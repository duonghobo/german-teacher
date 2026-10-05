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

## What failed (keep these as regression cases)
| Version | Failure |
|---|---|
| Prompt v1 (7 sections) | Treated the learner's own German question as the sentence to analyse and lost the context. Invented "Präfabrik" (Präsens), tun → "machte" (tat), "die (maskulin) Heimat", plural "Heiman". Missed *mit etwas zu tun haben*. Mixed Hindi and Chinese words into the answer. Never used "(unsure)". Added an unrequested "Tipp" section. |
| Prompt v2 (CONTEXT/TEXT/Q labels, auto-correction) | Found *zu tun haben*. But the correction changed the learner's meaning and was ungrammatical, it then analysed its own correction, still wrote "Die (maskulin) Satz", kept listing basic words, the flashcard dropped "zu … haben", and it added "Explanation" / "Keep practicing" sections. |
| Prompt v3 (one job per message + worked example) | Not field-tested before skills were built; kept as the no-skills fallback in SYSTEM_PROMPT.md. |
| Skills v1 | Built and unit-tested; not yet tested on device. |

Lesson: a small on-device model can't hold many jobs in one answer and can't be trusted for morphology. Give it fewer jobs, a worked example, and facts from a tool.

## Coverage (v1)
- About 130 irregular and mixed verbs (plus modals and auxiliaries), derived prefix verbs, regular-verb rules, about 20 regular verbs with *sein*.
- Separable, inseparable and ambiguous prefixes (*über-, um-, durch-, unter-, wieder-* → "depends on meaning").
- About 160 nouns with gender and plural (including the Heimat topic), compound-noun rule (the last part decides), ending rules with reliability notes, nominalised infinitives → das.
- About 80 phrases: verb + preposition pairs, functional verb phrases (*zur Verfügung stehen*), idioms, two-part connectors (*sowohl … als auch*, *je … desto*, *um … zu*).
- Clauses: subordinate clauses (verb at the end), relative clauses (only after a noun), infinitive clauses, verb in position 2, separable particle at the end, tense hints (Perfekt, Plusquamperfekt, Passiv, Futur I, Konjunktiv II).

## Open questions
- Does the iOS app keep URL-loaded JS skills on the device (does it work offline after loading)? Test in airplane mode.
- An iOS bug once broke "Load skill from URL" (google-ai-edge/gallery#583, app v1.0.2).
- Does Gemma call the skill reliably every time, or does the system prompt need to push harder?

## How to improve
1. Collect failures: a screenshot of the answer plus one line on what was wrong.
2. A missing fact (verb, noun, phrase) → add a row in `src/german-engine.js`, add a test, `npm run build`.
3. A wrong format or behaviour → change the SKILL.md instructions in `src/build.ts`.
4. Log it below.

## Log
- 2026-10-05: Interviewed the learner. Setup: Split View + prompt. Prompts v1–v3 tried and failed as described above. Built skills v1 (2 skills, 9 tests). Published this repo.
