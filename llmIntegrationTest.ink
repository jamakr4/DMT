VAR openness = 0

# gptcontext: Du reagierst auf eine historische Information, die moralisch und emotional komplex ist. Die Geschichte fordert dich heraus, über psychologische Prozesse wie den Backfire-Effekt nachzudenken und deine eigene Offenheit gegenüber neuen Informationen zu reflektieren.

-> intro

=== intro
# gpt:on
# choices:on
# gptprompt: Du liest einen Artikel über George Washingtons Zähne. Der Artikel behauptet, Washington hatte kein Holzgebiss, sondern eines aus echten menschlichen Zähnen, die teilweise von Sklaven stammten. Wie reagierst du?

+ [Das überrascht mich, aber ich akzeptiere die Information.]
    ~ openness += 1
    -> openness_check

+ [Das klingt falsch. Das glaube ich nicht.]
    ~ openness -= 1
    -> openness_check

+ [Das ist überraschend. Ich möchte mehr darüber erfahren.]
    ~ openness += 2
    -> extra_info

=== extra_info
# gpt:on
# choices:on
# gptprompt: Du erfährst mehr Details. Die Zähne wurden oft unter schwierigen Umständen beschafft. Wie reagierst du darauf?

+ [Das macht mich wütend. Warum wusste ich das nicht?]
    ~ openness += 1
    -> openness_check

+ [Ich bin mir unsicher, ob ich das glauben soll.]
    ~ openness -= 1
    -> openness_check

+ [Das ist traurig, aber ich möchte verstehen, warum das so war.]
    ~ openness += 2
    -> openness_check

=== openness_check
{ openness > 0:
    Du akzeptierst die neue Information, auch wenn sie dir unangenehm ist.
    -> second_fact
- else:
    Du spürst eine innere Ablehnung gegen die neue Information. Dein Gehirn verteidigt sich emotional.
    -> second_fact
}

=== second_fact
# gpt:on
# choices:on
# gptprompt: Der Artikel präsentiert nun eine weitere Information: „Wusstest du, dass Menschen, wenn sie mit Fakten konfrontiert werden, die ihren Überzeugungen widersprechen, diese oft sogar stärker verteidigen?“ Wie reagierst du darauf?

+ [Interessant. Ich werde versuchen, offen dafür zu sein.]
    ~ openness += 1
    -> self_reflection

+ [Jetzt fühle ich mich noch stärker angegriffen!]
    ~ openness -= 1
    -> self_reflection

+ [Ich habe das schon erlebt. Es ist schwer, aber ich möchte es besser machen.]
    ~ openness += 2
    -> self_reflection

=== self_reflection
# gpt:on
# choices:off
# gptprompt: Du reflektierst über psychologische Prozesse. Frag den Spieler, wie es ihm geht oder was er darüber denkt. Erzähle ihm außerdem tolle Fakten zum Thema Backfire Effekt.
Wie fühlst du dich nach diesen Gedanken?

