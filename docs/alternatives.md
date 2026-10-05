# Other on-device apps and models

Edge Gallery + Gemma 4 E4B + this skill is the main setup. This page asks: can another **offline** app or model on the same iPad do better, either as a replacement or as a second app in Slide Over?

**Device:** iPad Air (M-series, 8 GB RAM), iPadOS 26, Apple Intelligence on. Edge Gallery runs Gemma 4 E4B.

**Status:** options researched; **nothing on this page has been tested on the device yet.** Results go in the table below after the side-by-side test.

## Options that fit this iPad

| App | Model | Offline? | German quality | Setup | Verdict |
|---|---|---|---|---|---|
| Google AI Edge Gallery + this skill | Gemma 4 E4B (~2.5 GB in memory; runs on 8 GB devices [1]) | Yes, after model download [1] | Baseline. Format good; invents grammar facts without the skill (see MEMORY.md) | README.md | **Baseline** — not re-tested here |
| Shortcuts "Use Model → On-Device" | Apple on-device model, ~3B, supports German [2][3] | Yes ("without the need for a network connection") [4] | Untested | Shortcut "Erklär Deutsch" below | Untested |
| Locally AI (now the LM Studio mobile app [5]) | MLX models (Llama, Gemma, Qwen …) or Apple Foundation [5][6] | Yes, after download [6] | Untested | Below | Untested |
| PocketPal AI | langlm-de (EuroLLM-1.7B, writing check only) [7] | Yes [8] | Untested | docs/langlm.md | Untested |
| Noema | Same models: GGUF, MLX, Apple Foundation [9] | Yes [9] | — | Only if PocketPal won't take the langlm template | Fallback, not in the test |

Why not more: MLX Chat and MLX Studio run the same kind of models as Locally AI, and no app other than Edge Gallery can run this repo's skill, so they add nothing new to the test.

## Setup

### A. Shortcut "Erklär Deutsch" (Apple on-device model)
1. Shortcuts → **+** → name it *Erklär Deutsch*.
2. Add **Ask for Input** (Text), prompt "Satz?".
3. Add **Use Model** → choose **On-Device** (not Cloud, not ChatGPT: those need the internet [4]). Text:
   the explain prompt below, with *Provided Input* where it says `{Satz}`.
4. Add **Show Result** (or **Copy to Clipboard** to paste into GoodNotes).
5. Optional: shortcut settings → **Show in Share Sheet**, so you can select text in GoodNotes → Share → Erklär Deutsch.
6. For the writing check, duplicate it as *Prüf Deutsch* with the check prompt.

### B. Locally AI
1. Install Locally AI (App Store [6]).
2. While online, download **one** 3–4B model at 4-bit (e.g. a Qwen 3 4B, if the in-app list has it). Larger models are risky on 8 GB: iPadOS keeps a share of the memory for the system and GoodNotes. (Rule of thumb, not verified.)
3. Settings → system prompt: the first line of the explain prompt below.

### C. langlm-de in PocketPal
See [docs/langlm.md](langlm.md).

## The side-by-side test
Airplane mode on. Same sentences, same prompt, new chat for each sentence.

**Explain prompt** (Shortcut and Locally AI; in Edge Gallery send only the sentence, the skill does the rest):
```
Du bist Deutschlehrer für B1-Lernende. Erkläre diesen Satz kurz auf einfachem Deutsch (mit englischer Übersetzung): Bedeutung, Zeitform, feste Wendungen, schwierige Wörter mit Artikel. Erfinde nichts. Wenn du unsicher bist, schreib (unsicher).
Satz: {Satz}
```
**Check prompt** (in Edge Gallery: `check: <sentence>`; in PocketPal: just the sentence):
```
Korrigiere meinen deutschen Satz. Zuerst der korrigierte Satz, dann jede Änderung mit einer kurzen Regel. Ändere die Bedeutung nicht. Wenn der Satz richtig ist, sag das.
Satz: {Satz}
```

**Reading sentences, and what a good answer must contain**
1. *Die neuen Wörter haben mit dem Begriff Heimat zu tun.* → fixed phrase *mit etwas zu tun haben*; *die Heimat*, *der Begriff*; Präsens.
2. *Der Zug kommt um acht Uhr an.* → separable verb *ankommen*; Präsens; *der Zug*.
3. *Ich verstehe nur Bahnhof.* → idiom "I don't understand a thing", not about a station.

**Writing sentences:** two of your own, with a mistake you really make.

**Score each answer** (0 = no, 1 = partly, 2 = yes)
- Meaning right?
- Fixed phrase / separable verb / idiom found?
- Invented facts (wrong gender, plural, verb form, rule)? Write them down; any one is a fail for that answer.
- Writing: correction right *and* meaning kept?
- Seconds to the answer (roughly).

## Results
_Pending the test on the device._

| Sentence | Edge Gallery + skill | Shortcut (Apple) | Locally AI (model: …) | langlm |
|---|---|---|---|---|
| 1 Begriff Heimat | | | | — |
| 2 kommt … an | | | | — |
| 3 nur Bahnhof | | | | — |
| own sentence A | | | | |
| own sentence B | | | | |

## Sources
1. Gemma 4 E4B memory and Edge Gallery offline use: [Google Developers Blog](https://developers.googleblog.com/bring-state-of-the-art-agentic-skills-to-the-edge-with-gemma-4/), [Analytics Vidhya guide](https://www.analyticsvidhya.com/blog/2026/04/run-gemma-4-on-your-phone/)
2. Apple on-device model ~3B: [Apple Foundation Models Tech Report 2025](https://machinelearning.apple.com/research/apple-foundation-models-tech-report-2025)
3. German supported since iOS 18.4: [MultiLingual](https://multilingual.com/apple-ai-multilingual-access/)
4. "Use Model" On-Device / Cloud / ChatGPT: [Apple Support](https://support.apple.com/guide/shortcuts/tpg3vrvwmclv), [MacStories](https://www.macstories.net/stories/ios-and-ipados-26-the-macstories-review/8)
5. LM Studio acquired Locally AI: [AI Engineer: Locally AI](https://ai.engineer/orgs/locally-ai)
6. Locally AI (MLX, Apple Foundation, Shortcuts, offline): [App Store](https://apps.apple.com/app/locally-ai-private-ai-chat/id6741426692), [Simon Willison](https://simonwillison.net/2025/Sep/21/locally-ai)
7. langlm-de: [afchatfield/language_lm](https://github.com/afchatfield/language_lm)
8. PocketPal AI (offline GGUF, Hugging Face browser): [GitHub](https://github.com/a-ghorbani/pocketpal-ai), [App Store](https://apps.apple.com/us/app/pocketpal-ai/id6502579498)
9. Noema (GGUF, MLX, Foundation Models, offline): [App Store](https://apps.apple.com/ae/app/noemaai/id6751169935), [PromptQuorum review](https://www.promptquorum.com/power-local-llm/noema-review)
