// Dispatcher for the single german-teacher skill. build.ts inlines engine + memory + this file
// into scripts/index.html (import/export lines are stripped there).
import { formatSentence, formatWord, findPhrases } from './german-engine.js';
import {
  addCorrection, addMistake, correctionsFor, savedIn, memKey, saveWord, quiz, review, recall, stats, exportNew,
} from './memory.js';

const ACTIONS = ['analyze', 'word', 'save', 'fix', 'mistake', 'quiz', 'review', 'recall', 'stats', 'export'];

function withMemory(mem, text, base) {
  const lines = [];
  const fixes = correctionsFor(mem, text);
  if (fixes.length) {
    lines.push('VERIFIED CORRECTIONS FROM THE LEARNER (these override everything below):');
    fixes.forEach((c) => lines.push(`- ${c.item}: ${c.correction}`));
  }
  lines.push(base);
  const phraseKeys = new Set(findPhrases(text).map((p) => memKey(p.phrase)));
  const known = savedIn(mem, text);
  Object.values(mem.data.vocab).forEach((v) => { if (phraseKeys.has(memKey(v.item)) && !known.includes(v)) known.push(v); });
  if (known.length) lines.push(`ALREADY SAVED BY THE LEARNER: ${known.map((v) => v.item).join(', ')} (mention that they have seen these before)`);
  return lines.join('\n');
}

function handle(input, mem, now = Date.now()) {
  const action = String(input.action || (input.sentence ? 'analyze' : input.word ? 'word' : '')).toLowerCase().trim();
  if (!ACTIONS.includes(action)) return { error: `Unknown action "${action}". Use one of: ${ACTIONS.join(', ')}.` };
  const need = (field) => String(input[field] || '').trim();
  switch (action) {
    case 'analyze': {
      const sentence = need('sentence');
      if (!sentence) return { error: 'Missing field "sentence".' };
      return { result: withMemory(mem, sentence, formatSentence(sentence)) };
    }
    case 'word': {
      const word = need('word');
      if (!word) return { error: 'Missing field "word".' };
      return { result: withMemory(mem, word, formatWord(word)) };
    }
    case 'save': return { result: saveWord(mem, { item: need('item'), meaning: need('meaning'), example: need('example') }, now) };
    case 'fix': return { result: addCorrection(mem, { item: need('item'), correction: need('correction') }, now) };
    case 'mistake': return { result: addMistake(mem, { wrong: need('wrong'), right: need('right'), rule: need('rule') }, now) };
    case 'quiz': return { result: quiz(mem, Number(input.n) || 5, now) };
    case 'review': return { result: review(mem, { item: need('item'), correct: input.correct }, now) };
    case 'recall': return { result: recall(mem, need('query')) };
    case 'stats': return { result: stats(mem, now) };
    case 'export': return { result: exportNew(mem, now) };
  }
  return { error: 'Unreachable' };
}

export { ACTIONS, handle };
