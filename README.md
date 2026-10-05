# German Teacher for Google AI Edge Gallery

An offline German teacher for reading German books on an iPad or phone. The on-device model (Gemma in [Google AI Edge Gallery](https://github.com/google-ai-edge/gallery)) explains sentences; two Agent Skills give it **checked grammar facts** so it stops guessing.

| Skill | Gemma uses it when you send | It returns |
|---|---|---|
| [`german-sentence-coach`](german-sentence-coach/) | a sentence, or a photo of text | clauses and verb positions, separable verbs (*kommt … an* → *ankommen*), tense hints, ~80 fixed phrases and two-part connectors, irregular verb forms, plus the answer format |
| [`german-word-forms`](german-word-forms/) | one word, or `word: X` | nouns: der/die/das + plural; verbs: Präteritum, Partizip II, haben/sein, separable prefix, meanings with *sich* |

Everything runs inside the skill's `scripts/index.html`: no network, no API key.

## Install
1. GitHub Pages serves this repo at `https://duonghobo.github.io/german-teacher/`.
2. In Edge Gallery: **Agent Skills → + → Load skill from URL**:
   - `https://duonghobo.github.io/german-teacher/german-sentence-coach`
   - `https://duonghobo.github.io/german-teacher/german-word-forms`
3. Paste the [system prompt](SYSTEM_PROMPT.md) into the chat.
4. Turn on airplane mode and send a test sentence (see below) to confirm it works offline.

## Use
| You send | You get |
|---|---|
| a sentence from the book, or a screenshot | meaning, tense, structure, fixed phrases, key words, a flashcard line |
| `word: Heimat` / `word: sich vorstellen` | correct forms and meanings |
| `check: <your own German sentence>` | a correction and your main mistake |
| `quiz` | 3 questions on what you covered |

Test sentences:
- `Die neuen Wörter haben mit dem Begriff Heimat zu tun.` → must find *mit etwas zu tun haben*
- `Der Zug kommt um acht Uhr an.` → must find *ankommen*
- `Ich verstehe nur Bahnhof.` → must find the idiom

## Develop
```
npm test        # 9 tests: grammar facts + the built skills run like Edge Gallery calls them
npm run build   # regenerates the skill folders from src/
```
Data lives in `src/german-engine.js` (verb table, noun table, phrase list). Add rows there, add a test, rebuild. See [MEMORY.md](MEMORY.md) for why it is built this way.
