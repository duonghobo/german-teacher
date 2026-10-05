// Dispatcher for the single german-teacher skill. build.ts inlines engine + memory + this file
// into scripts/index.html (import/export lines are stripped there).
import { formatSentence, formatWord, findPhrases } from './german-engine.js';
import {
  addCorrection, addMistake, correctionsFor, savedIn, memKey, saveWord, setLanguage, quiz, review, recall, stats, exportNew,
} from './memory.js';

const ACTIONS = ['analyze', 'word', 'save', 'fix', 'mistake', 'quiz', 'review', 'recall', 'stats', 'export', 'settings'];

// The answer format travels with every tool result, so the model sees it right next to the facts.
const FORMAT = {
  de: {
    analyze: `ANTWORTE AUF DEUTSCH (einfaches Deutsch, Niveau B1), genau in diesem Format:
1. BEDEUTUNG: Erkläre den Satz in einfachem Deutsch. Dann: (English: <natürliche Übersetzung>)
2. ZEITFORM: die Zeitform jedes Verbs und warum der Autor sie benutzt.
3. SATZBAU: erkläre die CLAUSES-Zeilen in einfachen Worten.
4. FESTE AUSDRÜCKE: die Ausdrücke vom Tool, wörtlich -> wirkliche Bedeutung, mit dem Beispiel vom Tool. Sonst "keine".
5. WICHTIGE WÖRTER: bis zu 3 Wörter über A2: Wort – Erklärung auf Deutsch (English) – ein kurzer Beispielsatz (English).
6. KARTE: Vorderseite: <Ausdruck in einem kurzen deutschen Satz> | Rückseite: <Bedeutung>
Grammatikbegriffe auf Deutsch (Präsens, Akkusativ, Nebensatz). Nichts davor, nichts danach.`,
    word: `ANTWORTE AUF DEUTSCH (einfaches Deutsch, Niveau B1):
- Wenn oben TYPO steht: beginne mit "Meintest du: ...?".
- Wenn oben FIXED PHRASE steht: erkläre zuerst den Ausdruck, mit dem Beispiel vom Tool.
- FORMEN: genau wie vom Tool, nichts ändern.
- BEDEUTUNGEN: nummeriert; nimm die "meaning"-Zeile vom Tool. Steht dort "not in the tables", gib die Bedeutung aus deinem Wissen (bei Zweifel: "(unsicher)"). Jede Bedeutung auf Deutsch erklärt, dann (English: ...).
- BEISPIELE: 3 kurze Sätze, ein Satz pro Bedeutung, jeder mit (English: ...).{saved}
- MIT/OHNE "SICH": nur wenn das Tool es angibt.`,
  },
  en: {
    analyze: `ANSWER IN ENGLISH, exactly in this format:
1. MEANING: a natural English translation.
2. TENSE: the tense of each verb and why it is used.
3. STRUCTURE: explain the CLAUSES lines in simple words.
4. FIXED PHRASES: the phrases from the tool, literal -> real meaning, with the tool's example. Otherwise "none".
5. KEY WORDS: up to 3 words above A2: word – meaning – one short German example sentence (English).
6. CARD: Front: <key phrase in a short German sentence> | Back: <its meaning>
Nothing before or after.`,
    word: `ANSWER IN ENGLISH:
- If TYPO appears above: start with "Did you mean: ...?".
- If FIXED PHRASE appears above: explain the phrase first, with the tool's example.
- FORMS: exactly as the tool gives them.
- MEANINGS: numbered; use the tool's "meaning" line. If it says "not in the tables", give the meaning from your own knowledge (mark "(unsure)" if in doubt).
- EXAMPLES: 3 short German sentences, one per meaning, each with its English translation.{saved}
- WITH/WITHOUT "SICH": only if the tool gives it.`,
  },
};

const WRAP = {
  de: ['FAKTEN FÜR DICH (dem Lernenden NICHT zeigen, nicht kopieren):', 'Schreib jetzt DEINE EIGENE Antwort an den Lernenden in diesem Format. Kopiere nichts von oben wörtlich, außer Formen und Beispielen.'],
  en: ['FACTS FOR YOU (do NOT show or copy these to the learner):', 'Now write YOUR OWN answer to the learner in this format. Do not copy anything above word for word, except forms and examples.'],
};

function wrap(mem, facts, format) {
  const lang = (mem.data.prefs && mem.data.prefs.lang) === 'en' ? 'en' : 'de';
  return `${WRAP[lang][0]}\n${facts}\n\n${WRAP[lang][1]}\n${format}`;
}

function answerFormat(mem, kind, savedExample) {
  const lang = (mem.data.prefs && mem.data.prefs.lang) === 'en' ? 'en' : 'de';
  const saved = savedExample
    ? (lang === 'de' ? `\n  Der erste Beispielsatz ist der Satz aus dem Buch des Lernenden: "${savedExample}"` : `\n  Use the learner's own sentence as the first example: "${savedExample}"`)
    : '';
  return FORMAT[lang][kind].replace('{saved}', saved);
}

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
      return { result: wrap(mem, withMemory(mem, sentence, formatSentence(sentence)), answerFormat(mem, 'analyze')) };
    }
    case 'word': {
      const word = need('word');
      if (!word) return { error: 'Missing field "word".' };
      const saved = mem.data.vocab[memKey(word)];
      return { result: wrap(mem, withMemory(mem, word, formatWord(word)), answerFormat(mem, 'word', saved && saved.example)) };
    }
    case 'save': return { result: saveWord(mem, { item: need('item'), meaning: need('meaning'), example: need('example') }, now) };
    case 'fix': return { result: addCorrection(mem, { item: need('item'), correction: need('correction') }, now) };
    case 'mistake': return { result: addMistake(mem, { wrong: need('wrong'), right: need('right'), rule: need('rule') }, now) };
    case 'quiz': return { result: quiz(mem, Number(input.n) || 5, now) };
    case 'review': return { result: review(mem, { item: need('item'), correct: input.correct }, now) };
    case 'recall': return { result: recall(mem, need('query')) };
    case 'stats': return { result: stats(mem, now) };
    case 'export': return { result: exportNew(mem, now) };
    case 'settings': return { result: setLanguage(mem, need('lang')) };
  }
  return { error: 'Unreachable' };
}

export { ACTIONS, handle };
