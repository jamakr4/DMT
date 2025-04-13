// main.js (GPT + Ink Hybrid mit direktem API-Key aus apikey.txt)

let story;
let currentGptNode = null;
let gptEnabled = true;
let inkChoicesEnabled = true;
let currentGptPromptHint = "";
let globalGptContext = "";
let openaiApiKey = ""; // wird geladen aus apikey.txt
const gptModel = "gpt-4-turbo";

// Lade API-Key aus externer Datei
fetch("apikey.txt")
  .then(res => res.text())
  .then(key => {
    openaiApiKey = key.trim();
    console.log("🔑 OpenAI API-Key geladen.");
  });

fetch('story.json')
  .then(response => response.json())
  .then(json => {
    story = new inkjs.Story(json);

    // Hole globalen gptcontext aus den globalTags (einmalig)
    const globalTags = story.globalTags || [];
    globalTags.forEach(tag => {
      const cleanTag = tag.trim().toLowerCase();
      if (cleanTag.startsWith("gptcontext:")) {
        globalGptContext = tag.substring("gptcontext:".length).trim();
        console.log("🌍 Globaler GPT-Kontext erkannt:", globalGptContext);
      }
    });

    continueStory();
  });

function continueStory() {
  const storyContainer = document.getElementById("story");

  while (story.canContinue) {
    const text = story.Continue();
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    storyContainer.appendChild(paragraph);
    console.log('📝 Storyausgabe:', text);

    const tags = story.currentTags;
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        const cleanTag = tag.trim().toLowerCase();
        if (cleanTag === "gpt:off") gptEnabled = false;
        if (cleanTag === "gpt:on") gptEnabled = true;
        if (cleanTag === "choices:off") inkChoicesEnabled = false;
        if (cleanTag === "choices:on") inkChoicesEnabled = true;
        if (cleanTag.startsWith("gptprompt:")) {
          currentGptPromptHint = tag.substring("gptprompt:".length).trim();
          console.log("💡 GPT Prompt-Hinweis gesetzt:", currentGptPromptHint);
        }
      });
      console.log("🏷️ Tags erkannt:", tags);
    }

    const rawPath = story.currentPathString;
    if (rawPath) {
      currentGptNode = rawPath.split(".")[0];
      console.log('🧭 GPT-Knoten aktualisiert auf:', currentGptNode);
    }
  }

  removeAll(".choice");

  if (inkChoicesEnabled) {
    story.currentChoices.forEach(choice => {
      const choiceParagraph = document.createElement("p");
      choiceParagraph.classList.add("choice");
      choiceParagraph.innerHTML = `<a href="#">${choice.text}</a>`;
      document.getElementById("story").appendChild(choiceParagraph);
      choiceParagraph.querySelector("a").addEventListener("click", event => {
        event.preventDefault();
        console.log("🖱️ Choice ausgewählt:", choice.text);
        story.ChooseChoiceIndex(choice.index);
        continueStory();
      });
    });
  }

  if (gptEnabled) showGptInput();
  else removeElement("userInputArea");
}

function showGptInput() {
  removeElement("userInputArea");

  const container = document.createElement("div");
  container.id = "userInputArea";

  const input = document.createElement("input");
  input.type = "text";
  input.id = "userInput";
  input.placeholder = "Was willst du tun?";

  const button = document.createElement("button");
  button.textContent = "Senden";
  button.onclick = handleUserInput;

  input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      console.log("⏎ Enter erkannt, Eingabe senden...");
      event.preventDefault();
      handleUserInput();
    }
  });

  container.appendChild(input);
  container.appendChild(button);
  document.getElementById("story").appendChild(container);
  input.focus();
}

async function handleUserInput() {
  const input = document.getElementById("userInput").value;
  console.log("📨 Benutzereingabe:", input);
  document.getElementById("userInput").value = "";

  // Eingabe des Nutzers dauerhaft anzeigen
  const userParagraph = document.createElement("p");
  userParagraph.classList.add("user-input");
  userParagraph.textContent = `🗣️ Du: ${input}`;
  document.getElementById("story").appendChild(userParagraph);

  const result = await askGPTForChoiceIndex(input);
  console.log("🧠 GPT Ergebnis:", result);

 
    const p = document.createElement("p");
    p.textContent = result.rawResponse || "GPT konnte deine Eingabe nicht zuordnen.";
    document.getElementById("story").appendChild(p);
    showGptInput(); // neues Eingabefeld unterhalb
  
}

async function askGPTForChoiceIndex(input) {
  const choices = story.currentChoices.map((c, i) => `(${i}): ${c.text}`).join("\n");

  const fullPrompt = `${globalGptContext}\n\n${currentGptPromptHint}\n\nDer Spieler sagt: "${input}"\n\nHier sind die Optionen:\n${choices}\n\nWähle die passende Zahl.`;

  console.log("📤 Sende Prompt an GPT direkt:", fullPrompt);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: gptModel,
      messages: [{ role: "user", content: fullPrompt }],
      temperature: 0
    })
  });

  const data = await res.json();
  console.log("📥 GPT Antwort JSON:", data);

  const response = data.choices[0].message.content.trim();
  console.log('✅ GPT Antwort (bereinigt):', response);
  const number = parseInt(response);

  return {
    index: isNaN(number) ? null : number,
    rawResponse: response
  };
}

function removeAll(selector) {
  const all = document.querySelectorAll(selector);
  all.forEach(el => el.remove());
}

function removeElement(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

