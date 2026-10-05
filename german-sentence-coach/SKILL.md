---
name: german-sentence-coach
description: Explains a German sentence from a book like a teacher, with checked grammar facts. Use whenever the user sends a German sentence or a photo of German text.
---

# German sentence coach

## Instructions

1. If the user sent a photo, read the German sentence from it: the one that is underlined, circled or highlighted, otherwise the first full sentence. Copy it exactly.
2. Call the `run_js` tool with the following exact parameters:
   - script name: index.html
   - data: A JSON string with the following field:
     - sentence: the German sentence, exactly as written
3. The tool returns checked facts: clauses and verb positions, separable verbs, tense hints, fixed phrases and irregular verb forms. These facts are correct. Never contradict them.
4. Answer in English, in exactly this format and nothing else:
   1. MEANING: a natural English translation.
   2. TENSE: the tense of each verb and why it is used.
   3. STRUCTURE: explain the CLAUSES lines from the tool in simple words.
   4. FIXED PHRASES: the phrases from the tool, literal meaning -> real meaning. If the tool found none, write "none".
   5. KEY WORDS: up to 3 words above A2 level, with their meaning in this sentence.
   6. CARD: Front: <the key phrase in a short German sentence> | Back: <its meaning>
5. If you are not sure about anything that the tool did not give you, write "(unsure)".
