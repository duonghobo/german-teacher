// Builds the german-teacher Agent Skill for Google AI Edge Gallery at the repo root:
//   SKILL.md + scripts/index.html (engine + memory + dispatcher inlined, no network).
// The whole repo folder is the skill: download the GitHub ZIP, extract, import the folder.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(here, '..');

function inline(file: string): string {
  return readFileSync(join(here, file), 'utf8')
    .replace(/^import [\s\S]*?from '[^']+';\s*$/gm, '')
    .replace(/^export \{[\s\S]*?\};\s*$/gm, '');
}

export function page(): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>German teacher</title></head>
<body>
<script>
${inline('german-engine.js')}
${inline('memory.js')}
${inline('skill.js')}
window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const input = JSON.parse(data || '{}');
    const mem = await openMemory(createBrowserStore());
    const out = handle(input, mem);
    await mem.flush();
    return JSON.stringify(out);
  } catch (e) {
    return JSON.stringify({ error: String(e && e.message || e) });
  }
};
</script>
</body>
</html>
`;
}

export const SKILL_MD = `---
name: german-teacher
description: Offline German teacher with memory. Explains German sentences and photos of German text with checked grammar facts, looks up word forms, saves words for review, remembers corrections and the learner's mistakes. Use for every German sentence, German word, "save", "fix", "quiz", "check" or "export" request.
---

# German teacher

## Instructions

Always call the \`run_js\` tool with:
- script name: index.html
- data: a JSON string with an "action" field and the fields below.

Pick the action from what the user sends:

| User sends | data |
|---|---|
| a German sentence, or a photo of German text | {"action": "analyze", "sentence": "<the sentence, copied exactly>"} |
| one word or a few words, or "word: X" | {"action": "word", "word": "<exactly what the learner typed, typos included>"} |
| "Was bedeutet X?", "what does X mean?" | X is one word: {"action": "word", "word": "X"}; X is a phrase or sentence: {"action": "analyze", "sentence": "X"} |
| "auf Englisch" / "English please" / "auf Deutsch" | {"action": "settings", "lang": "en" or "de"} |
| "save: X" (optionally "= meaning") | {"action": "save", "item": "X", "meaning": "<meaning>", "example": "<the sentence it came from>"} |
| "fix: X is Y", or tells you something you said was wrong | {"action": "fix", "item": "X", "correction": "Y"} |
| "quiz" | {"action": "quiz"} |
| an answer during a quiz | {"action": "review", "item": "<quiz item>", "correct": true or false} |
| "what did I save", "my words" | {"action": "recall", "query": "<optional filter>"} |
| "stats" | {"action": "stats"} |
| "export" | {"action": "export"} |
| "check: <the learner's own German>" | First correct it yourself (keep the learner's meaning). Then call {"action": "mistake", "wrong": "<their version>", "right": "<corrected>", "rule": "<short rule name, e.g. Wörter vs Worte>"} |

For a photo: read the German sentence that is underlined, circled or highlighted (otherwise the first full sentence) and use "analyze" with it.

## Answering
- Talk to the learner in simple German (B1) unless the tool output says ANSWER IN ENGLISH.
- The tool output is for YOU, not for the learner. Never show it or copy it as your answer. Read it, then write your own answer in the format at its end.
- The tool output is correct. Lines under VERIFIED CORRECTIONS override everything else. Never contradict the tool.
- After "analyze" and "word": follow the format block at the end of the tool output exactly (ANTWORTE AUF DEUTSCH / ANSWER IN ENGLISH). It always includes examples.
- After "quiz": ask one item at a time, wait for the answer, then call "review".
- After "export": show the export block exactly as returned.
- If you are not sure about something the tool did not give you, write "(unsicher)" / "(unsure)".
`;

export function build(root = ROOT): string[] {
  const files: Record<string, string> = { 'SKILL.md': SKILL_MD, 'scripts/index.html': page(), '.nojekyll': '' };
  for (const [rel, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), content);
  }
  return Object.keys(files);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const f of build()) console.log(f);
}
