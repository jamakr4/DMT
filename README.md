# GPT + Ink Hybrid Story Engine

Dieses Projekt ist ein experimenteller Prototyp für interaktive Geschichten, die **regelbasiertes Erzählen mit generativer KI** verbinden. Die Grundlage bildet das Open-Source-Storytelling-System [Ink](https://www.inklestudios.com/ink/), erweitert um einen freien Texteingabemodus mit GPT-Unterstützung.

🧠 **Inspiriert von:** [The Oatmeal – You’re Not Going to Believe What I’m About to Tell You](https://theoatmeal.com/comics/believe)

---

## 💡 Was dieses Projekt bietet

- Verzweigte interaktive Geschichten via Ink
- GPT-Integration an bestimmten Entscheidungsknoten
- Auswahl per Multiple Choice **oder** per Freitexteingabe
- Möglichkeit, über Tags globale oder lokale Prompts an GPT zu übergeben


---

## 📦 Projektstruktur

```txt
projektordner/
├── index.html
├── main.js              ← zentrale Logik
├── story.json           ← exportierte Ink-Geschichte
├── apikey.txt           ← Ihr OpenAI API-Key (nicht commiten!)
```

---

## ▶️ Lokaler Start

1. Stellen Sie sicher, dass Sie `apikey.txt` mit dem **OpenAI API-Key** aus den Folien im Hauptordner erzeugt haben.
2. Starten Sie einen lokalen Server, z. B.:
   ```bash
   npx serve .
   ```
   oder mit Live Server in VS Code
3. Öffnen Sie `index.html` im Browser

---

## ✏️ Ink-Integration (Story schreiben)

In Ihrer `.ink`-Datei können Sie GPT einbinden mit:

```ink
# gpt:on               // GPT ist an
# choices:on           // auch Multiple Choice wird angezeigt
# gptprompt: Du hilfst dem Spieler, ...  // spezifischer Kontext
```

Zusätzlich können Sie im oberen Bereich der Story globale Tags setzen:
```ink
# gptcontext: Du bist ein kluger Begleiter, der ...
```

### 🗃 Beispiel:
```ink
# gptcontext: Du bist ein empathischer Berater.

=== start
# gpt:on
# choices:on
# gptprompt: Der Spieler steht vor einer schwierigen moralischen Entscheidung.
Was möchten Sie tun?

+ [Option A] -> a
+ [Option B] -> b
```

---

## 💬 GPT-Verhalten

- GPT erhält die **Kombination** aus globalem Kontext + lokalem Prompt + Spielertext + aktuelle Optionen
- GPT antwortet nur mit einer Zahl (entspricht der gewählten Option)
- Wenn GPT nichts erkennt, wird die Rohantwort angezeigt, und das Texteingabefeld bleibt bestehen
- **Alle Texteingaben („Sie“) und GPT-Antworten („Du“) bleiben sichtbar in der Geschichte**

---

## 🛡️ Sicherheitshinweis

Ihre Datei `apikey.txt` sollte **niemals** mit ins Repository geladen werden. Ergänzen Sie ggf. `.gitignore`:
```bash
apikey.txt
```



