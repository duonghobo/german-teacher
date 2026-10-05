---
name: german-word-forms
description: Looks up the correct forms of one German word offline. Nouns get der/die/das and plural. Verbs get Präteritum, Partizip II, haben or sein, separable prefix, and the meaning with "sich". Use when the user asks about a single word or writes "word: ...".
---

# German word forms

## Instructions

1. Call the `run_js` tool with the following exact parameters:
   - script name: index.html
   - data: A JSON string with the following field:
     - word: the word. Nouns with a capital letter (Heimat). Verbs as the infinitive, with "sich" if reflexive (sich vorstellen). A conjugated form (tat) also works.
2. Copy the forms from the tool exactly. Never change a gender, plural or verb form the tool gives.
3. Then add: the common meanings as a numbered list, typical prepositions, and 2 short example sentences.
4. If the tool says "(check)", "rule-based" or "unknown", tell the user to check the dictionary for that form.
