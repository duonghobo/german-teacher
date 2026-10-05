# Memory

What this project is for, what was decided and why, and what was learned. Read this before changing anything. Append to the log at the bottom; don't rewrite history.

## The problem
- A B1 → B2 learner reads German books and exercises on an iPad, often fully offline (train, plane).
- Book and notes live in one note-taking app (GoodNotes); the AI sits next to it in Split View. Pages are both selectable text and images (scans, handwriting).
- Where reading breaks down: decoding word by word. Separable verbs, two-part connectors, idioms, verb + preposition pairs, reflexive verbs with two meanings. Translator apps lack context.
- Wanted: meaning, tense, structure, fixed phrases and new words for one sentence, plus a flashcard line; word deep-dives (forms, other meanings, *sich* versions).
- Review happens in GoodNotes flashcards. No cloud step: it adds too much friction.

## Constraints
- Offline only → an on-device model: Gemma in Google AI Edge Gallery (multimodal, so screenshots work).
- No temperature setting available in the app.
- Small model: follows a fixed format reasonably well, but invents grammar facts with confidence.

## Decisions
1. **Habit and existing tools first, build last.** It started as Split View plus a prompt. It became a build only after 3 prompt versions failed on the same kinds of facts.
2. **Split the work.** Gemma does meaning, explanation and format. Deterministic offline JavaScript (Agent Skills, `run_js`) supplies the facts it got wrong: verb forms, haben/sein, noun gender and plural, fixed phrases, clause and verb position.
3. **Tool output is short plain text**, not nested JSON, ending in "These facts are correct. Use them and do not contradict them."
4. **Every rule-based answer says so** ("rule-based, say (check)"), so the learner knows when to verify in a dictionary.
5. **Corrections of the learner's own German only on `check:`.** Doing it automatically produced wrong corrections.
6. **Zero dependencies**; tests run the built `index.html` the way the app calls it.
7. **One skill, not two** (v2). Memory has to be shared by every action, and separately loaded skills may not share browser storage. The repo root is the skill, so the GitHub ZIP imports as one folder.
8. **Two-layer memory** (v2), modelled on uussnn/second-brain but without its unworkable part (a sandboxed skill cannot rewrite its own SKILL.md):
   - *On the device*: localStorage mirrored to IndexedDB inside the skill. Saved words (Leitner review 1/3/7/14/30 days), verified corrections (`fix:`) that override the tables, the learner's mistakes (`check:`). Instant and offline.
   - *In the repo*: `export` → `evolution/*.jsonl` → table rows + tests + Discovered rules → new release. Permanent and tested.
9. **German by default, examples always** (v2.1). The learner wants to be taught in German. Every analyze/word result ends with the answer format in the current language (ANTWORTE AUF DEUTSCH / ANSWER IN ENGLISH), so the format sits right next to the facts and an old pasted prompt can't override it. Every fixed phrase carries a checked example; word answers ask for 3 examples, and the learner's own book sentence comes first if the word was saved. `settings` switches the language and is remembered.
10. **Writing check = a second, specialised model** (2026-10-05). Hugging Face has no small model that explains German sentences to learners, but it has one for correcting learner writing: langlm-de (EuroLLM-1.7B on Falko-MERLIN, 755 MB GGUF, MIT). It can't run in Edge Gallery (LiteRT only), so it runs in PocketPal in Slide Over; the learner is fine with a second app. It needs its raw prompt (no chat template). See docs/langlm.md.

## What failed (keep these as regression cases)
| Version | Failure |
|---|---|
| Prompt v1 (7 sections) | Treated the learner's own German question as the sentence to analyse and lost the context. Invented "Präfabrik" (Präsens), tun → "machte" (tat), "die (maskulin) Heimat", plural "Heiman". Missed *mit etwas zu tun haben*. Mixed Hindi and Chinese words into the answer. Never used "(unsure)". Added an unrequested "Tipp" section. |
| Prompt v2 (CONTEXT/TEXT/Q labels, auto-correction) | Found *zu tun haben*. But the correction changed the learner's meaning and was ungrammatical, it then analysed its own correction, still wrote "Die (maskulin) Satz", kept listing basic words, the flashcard dropped "zu … haben", and it added "Explanation" / "Keep practicing" sections. |
| Prompt v3 (one job per message + worked example) | Not field-tested before skills were built; kept as the no-skills fallback in SYSTEM_PROMPT.md. |
| Skills v1 (2 skills) | Built and unit-tested; never loaded on device. Replaced by v2 (one skill + memory). |
| Skills v2 | Built and unit-tested (13 tests); not yet tested on device. |

Lesson: a small on-device model can't hold many jobs in one answer and can't be trusted for morphology. Give it fewer jobs, a worked example, and facts from a tool.

## Coverage (v1)
- About 130 irregular and mixed verbs (plus modals and auxiliaries), derived prefix verbs, regular-verb rules, about 20 regular verbs with *sein*.
- Separable, inseparable and ambiguous prefixes (*über-, um-, durch-, unter-, wieder-* → "depends on meaning").
- About 160 nouns with gender and plural (including the Heimat topic), compound-noun rule (the last part decides), ending rules with reliability notes, nominalised infinitives → das.
- About 80 phrases: verb + preposition pairs, functional verb phrases (*zur Verfügung stehen*), idioms, two-part connectors (*sowohl … als auch*, *je … desto*, *um … zu*).
- Clauses: subordinate clauses (verb at the end), relative clauses (only after a noun), infinitive clauses, verb in position 2, separable particle at the end, tense hints (Perfekt, Plusquamperfekt, Passiv, Futur I, Konjunktiv II).

## Discovered rules
Patterns learned the hard way. Each one has a test.
1. A main clause can end in "zu + infinitive" (*Das hat mit mir zu tun.*): only call it an infinitive clause after a comma. (v2)
2. A saved phrase rarely appears word for word (*mit etwas zu tun haben* → *hat mit mir zu tun*): match saved items through the fixed-phrase finder, not only by words. (v2)
3. A clause after a comma that ends in "zu + infinitive" is only an infinitive clause if it has no conjugated verb of its own (*Ich denke, die Wörter haben … zu tun* is a main clause) or starts with um/ohne/(an)statt. (v2.1)

4. Small models sometimes paste the tool output as their answer. Frame it: first line "FAKTEN FÜR DICH (nicht zeigen)", last line "Schreib jetzt deine eigene Antwort", and say it in SKILL.md too. (v2.2)
5. Learners type fast: typos (*Befriff*) and several words (*Begriff haben*) reach the word lookup. Correct to the closest known word (edit distance 1–2) and split multi-word input into content words plus fixed phrases; skip articles, prepositions and basic verbs. (v2.2)

6. A noun lookup should surface the idioms built on that noun (*Begriff* → *im Begriff sein*, *ein Begriff sein*, *schwer von Begriff sein*). Learners often ask about a noun when they really met an idiom. Idiom patterns need their article (*einen/keinen Begriff haben*) so ordinary sentences with "Begriff … haben" don't match. (v2.3)

7. Learners meet inflected forms of prefixed verbs (*begriffen*, *angekommen*, *verstand*). Resolve prefix + table base (inseparable Partizip II = prefix + base Partizip II without ge-) before falling back to regular rules, or a strong verb gets called regular. (v2.4)
8. Facts without meanings make the model refuse ("meaning not provided by the tool"). Ship short meanings for table words, and say explicitly that the model may give a meaning from its own knowledge when the tables have none. (v2.4)

## Open questions
- Does the iOS app support "Import local skill" from a Files folder? (second-brain's README says yes for iOS 17+.)
- Does memory survive closing the app, and re-importing a new version? First on-device test.
- Does the iOS app keep URL-loaded JS skills on the device (does it work offline after loading)? Test in airplane mode.
- An iOS bug once broke "Load skill from URL" (google-ai-edge/gallery#583, app v1.0.2).
- Does Gemma call the skill reliably every time, or does the system prompt need to push harder?

## How to improve
1. On the device: `fix:` wrong facts and `check:` own sentences as they come up.
2. When online: `export`, paste the block to Claude.
3. Claude appends to `evolution/`, turns each correction into a row in `src/german-engine.js` with a test, adds a Discovered rule if it's a pattern, bumps `evolution/history.jsonl`, runs `npm test` + `npm run build`, pushes.
4. A wrong format or behaviour → change the SKILL.md instructions in `src/build.ts`.
5. Log it below.

## Log
- 2026-10-05: Interviewed the learner. Setup: Split View + prompt. Prompts v1–v3 tried and failed as described above. Built skills v1 (2 skills, 9 tests). Published this repo.
- 2026-10-05: v2. Merged into one skill with on-device memory (save, fix, mistake, quiz/review, recall, stats, export) and the evolution/ loop. Repo root is the skill (ZIP → import folder). 13 tests.
- 2026-10-05: v2.1. First on-device output came from the old pasted prompt (7 sections, "haben" as a new word, invented meaning), so the format now travels inside every tool result. German answers by default, `settings` for English, 80 checked phrase examples, 3 examples per word. Fixed rule 3. 15 tests.
- 2026-10-05: v2.2. First on-device run of v2.1: the skill ran (German format visible), but "Befriff haben" came back as one unknown noun and Gemma echoed the tool output. Added typo correction, multi-word lookup, and facts-vs-answer framing. Rules 4–5.
- 2026-10-05: Model search. No small German *tutor* model exists; langlm-de added as the writing checker in PocketPal (docs/langlm.md). Reading stays with Gemma + skill.
- 2026-10-05: v2.3. "Begriff haben" asked on device (and to Siri, which failed). Added 4 Begriff idioms with examples; noun lookups now list idioms containing the noun. Rule 6.
- 2026-10-05: v2.4. On device, "begriffen haben" was called a regular verb and Gemma refused to give a meaning. Added prefixed-form resolution (begriffen → begreifen) and short English meanings for ~190 verbs and ~170 nouns. Rules 7–8. 21 tests.
