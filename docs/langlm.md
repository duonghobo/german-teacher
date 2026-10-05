# Writing check with langlm (second app)

Edge Gallery + the german-teacher skill is for **reading**. For **checking your own German** there is a model trained only for that: **langlm-de** (EuroLLM-1.7B fine-tuned on ~19k real German learner sentences, Falko-MERLIN; 755 MB, offline). It corrects a sentence and labels every change with an error type. It does not explain, translate or read images.

Source: [afchatfield/language_lm](https://github.com/afchatfield/language_lm) (MIT), file `hf/langlm-de-755mb.gguf`.

## iPad layout
- Left: GoodNotes (book + notes). Right: Edge Gallery (reading). **Slide Over**: PocketPal with langlm (swipe in from the right edge when you write).

## Setup in PocketPal AI
1. Install **PocketPal AI** (App Store).
2. Get `langlm-de-755mb.gguf`: search "langlm" in PocketPal's Hugging Face browser (repo `AnthonyFC/langlm-gguf`), or download the file and add it from the Files app.
3. Model settings (chevron / advanced):
   - **Chat template**: replace it with exactly
     ```
     Correct the German sentence, then list what changed.

     Input: {{ messages[-1]['content'] }}
     Output:
     ```
     langlm is a raw-completion model: with a normal chat template it answers in prose instead of JSON.
   - **Temperature**: 0. **Context**: 1024.
   - **System prompt**: empty.
4. Now type only your sentence. Start a new chat per sentence (the template sends only the last message anyway).

Not verified on device yet: whether PocketPal accepts this template exactly. If the answer is prose instead of JSON, the template was not applied.

## Reading the answer
```json
{"correction": "Sie hatten keine Möglichkeit, sich auszubilden.",
 "changes": [{"was": "Möglichkeit sich", "now": "Möglichkeit, sich", "type": "M:PUNCT"}]}
```
`M:` missing · `R:` wrong (replace) · `U:` unnecessary

| Code | Meaning |
|---|---|
| R:SPELL | spelling |
| R:ORTH | capital letters, spacing, hyphens |
| R:DET:FORM | article form: gender/case/number (der/die/das, den/dem) |
| M:DET | missing article |
| R:ADJ:FORM | adjective ending |
| R:NOUN:FORM | noun form (case, plural) |
| R:VERB:FORM | verb form (tense, person) |
| M:AUX / R:AUX:FORM / U:AUX | haben/sein/werden missing / wrong form / extra |
| R:ADP / M:ADP | wrong / missing preposition |
| M:PRON / U:PRON | missing / extra pronoun |
| R:WO, move | word order |
| R:MORPH | wrong word form or part of speech |
| R:OTHER | wrong word choice |
| M:PUNCT / U:PUNCT / R:PUNCT | comma etc. missing / extra / wrong |

## Feeding it back into the teacher
Mistakes worth remembering → in Edge Gallery send:
`check: <your sentence>` (Gemma logs it) or directly tell it the langlm result, e.g. "mistake: Möglichkeit sich → Möglichkeit, sich, rule: Komma vor Infinitiv". The quiz then practises your recurring rules.
