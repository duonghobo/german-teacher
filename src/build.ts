// Builds the German Agent Skills for Google AI Edge Gallery into the repo root (one folder per skill).
// Each skill is a folder with SKILL.md (+ scripts/index.html for JS skills), ready to host or import.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const OUT = join(here, '..');

const engine = readFileSync(join(here, 'german-engine.js'), 'utf8').replace(/^export \{[^}]*\};\s*$/m, '');

function page(body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>German skill</title></head>
<body>
<script>
${engine}
window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const input = JSON.parse(data || '{}');
${body}
  } catch (e) {
    return JSON.stringify({ error: String(e && e.message || e) });
  }
};
</script>
</body>
</html>
`;
}

export const SKILLS: Record<string, Record<string, string>> = {
  'german-sentence-coach': {
    'SKILL.md': `---
name: german-sentence-coach
description: Explains a German sentence from a book like a teacher, with checked grammar facts. Use whenever the user sends a German sentence or a photo of German text.
---

# German sentence coach

## Instructions

1. If the user sent a photo, read the German sentence from it: the one that is underlined, circled or highlighted, otherwise the first full sentence. Copy it exactly.
2. Call the \`run_js\` tool with the following exact parameters:
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
`,
    'scripts/index.html': page(`    const sentence = String(input.sentence || '').trim();
    if (!sentence) return JSON.stringify({ error: 'Missing field "sentence".' });
    return JSON.stringify({ result: formatSentence(sentence) });`),
  },
  'german-word-forms': {
    'SKILL.md': `---
name: german-word-forms
description: Looks up the correct forms of one German word offline. Nouns get der/die/das and plural. Verbs get Präteritum, Partizip II, haben or sein, separable prefix, and the meaning with "sich". Use when the user asks about a single word or writes "word: ...".
---

# German word forms

## Instructions

1. Call the \`run_js\` tool with the following exact parameters:
   - script name: index.html
   - data: A JSON string with the following field:
     - word: the word. Nouns with a capital letter (Heimat). Verbs as the infinitive, with "sich" if reflexive (sich vorstellen). A conjugated form (tat) also works.
2. Copy the forms from the tool exactly. Never change a gender, plural or verb form the tool gives.
3. Then add: the common meanings as a numbered list, typical prepositions, and 2 short example sentences.
4. If the tool says "(check)", "rule-based" or "unknown", tell the user to check the dictionary for that form.
`,
    'scripts/index.html': page(`    const word = String(input.word || '').trim();
    if (!word) return JSON.stringify({ error: 'Missing field "word".' });
    return JSON.stringify({ result: formatWord(word) });`),
  },
};

export function buildAll(outDir = OUT): string[] {
  const written: string[] = [];
  for (const [skill, files] of Object.entries(SKILLS)) {
    for (const [rel, content] of Object.entries(files)) {
      const path = join(outDir, skill, rel);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content);
      written.push(path);
    }
  }
  writeFileSync(join(outDir, '.nojekyll'), '');
  return written;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const p of buildAll()) console.log(p);
}
