# German Teacher for Google AI Edge Gallery

An offline German teacher with memory, for reading German books on an iPad or phone. The on-device model (Gemma in [Google AI Edge Gallery](https://github.com/google-ai-edge/gallery)) explains; this Agent Skill gives it **checked grammar facts** and a **memory that survives between chats**: your saved words, your corrections, your recurring mistakes.

**The whole repo folder is the skill.** `SKILL.md` and `scripts/index.html` sit at the root; everything else is ignored by the app.

## Install (ZIP → folder)
1. On the iPad, open this repo in Safari → **Code → Download ZIP**.
2. In the **Files** app, tap `german-teacher-main.zip` to extract it. You get a folder `german-teacher-main` with `SKILL.md` inside.
3. In Edge Gallery: **Agent Skills → + → Import local skill** (may be labelled *Import from local file*) → choose the folder `german-teacher-main`.
4. Paste the [system prompt](SYSTEM_PROMPT.md) into the chat.
5. Test (airplane mode on):
   - send `Die neuen Wörter haben mit dem Begriff Heimat zu tun.` → must find *mit etwas zu tun haben*
   - send `save: mit etwas zu tun haben = to have to do with`
   - **close Edge Gallery completely, reopen it**, send `stats` → must say `Saved: 1` and `saved between chats`

If your app version has no local import, use **Load skill from URL** with `https://duonghobo.github.io/german-teacher` (needs GitHub Pages on: Settings → Pages → main / root).

**Updating:** download the new ZIP and import again. Your memory is kept on the device, not in the folder, so it should survive an update. Run `export` first anyway, to be safe.

## Use
| You send | What happens |
|---|---|
| a sentence from the book, or a screenshot | meaning, tense, structure, fixed phrases, key words, a flashcard line |
| `word: Heimat` · `word: sich vorstellen` | correct forms and meanings |
| `save: X = meaning` | saves X for spaced review (1, 3, 7, 14, 30 days) |
| `quiz` | asks what is due today, plus your recurring mistakes |
| `fix: Bahnhofsuhr is die Bahnhofsuhr, -en` | **self-correction**: overrides the built-in tables from now on |
| `check: <your own German>` | corrects it and logs the mistake |
| `my words` · `stats` | what is saved, what is due |
| `export` | text block of new corrections and mistakes: paste it to Claude to make them permanent |

## How it evolves
```
on the iPad (instant)                       in this repo (permanent, tested)
fix: / check:  ──► memory on the device ──► export ──► evolution/*.jsonl
                     (overrides tables)                 ──► data tables + tests in src/
                                                        ──► MEMORY.md "Discovered rules"
                                                        ──► new ZIP ──► import again
```
- **Memory** (`localStorage` + IndexedDB inside the skill) changes behaviour immediately, offline.
- **The repo** turns exported corrections into table rows with tests, so they work for everyone and never get lost. See [MEMORY.md](MEMORY.md) and [evolution/](evolution/).

## Develop
```
npm test        # 13 tests: grammar facts, memory, and the built page run like Edge Gallery calls it
npm run build   # regenerates SKILL.md and scripts/index.html from src/
```
| File | Role |
|---|---|
| `src/german-engine.js` | verb table, noun table, ~80 fixed phrases, clause analysis |
| `src/memory.js` | on-device memory: saved words, corrections, mistakes, spaced review, export |
| `src/skill.js` | one entry point, `action` → handler |
| `src/build.ts` | writes `SKILL.md` + `scripts/index.html` (everything inlined, no network) |
| `MEMORY.md` | project memory: decisions, what failed, discovered rules, log |
| `evolution/` | exported corrections and mistakes, version history |
