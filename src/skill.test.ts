import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import vm from 'node:vm';
import { handle } from './skill.js';
import { openMemory, createMapStore } from './memory.js';
import { build } from './build.ts';

const DAY = 24 * 60 * 60 * 1000;
const T0 = Date.UTC(2026, 9, 5);

test('analyze and word still return the checked facts', async () => {
  const mem = await openMemory(createMapStore(), T0);
  assert.match(handle({ action: 'analyze', sentence: 'Die Wörter haben mit Heimat zu tun.' }, mem, T0).result, /mit etwas zu tun haben/);
  assert.match(handle({ action: 'word', word: 'tun' }, mem, T0).result, /Präteritum: tat/);
  assert.match(handle({ sentence: 'Ich verstehe nur Bahnhof.' }, mem, T0).result, /nur Bahnhof verstehen/); // action inferred
  assert.match(handle({ action: 'nope' }, mem, T0).error, /Unknown action/);
});

test('a correction overrides the tables next time and survives a reload', async () => {
  const store = createMapStore();
  const mem = await openMemory(store, T0);
  handle({ action: 'fix', item: 'Bahnhofsuhr', correction: 'die Bahnhofsuhr, plural die Bahnhofsuhren' }, mem, T0);
  await mem.flush();

  const again = await openMemory(store, T0 + DAY); // a new chat
  const out = handle({ action: 'word', word: 'Bahnhofsuhr' }, again, T0 + DAY).result;
  assert.match(out, /^VERIFIED CORRECTIONS[\s\S]*die Bahnhofsuhr, plural die Bahnhofsuhren/);
  const inSentence = handle({ action: 'analyze', sentence: 'Die Bahnhofsuhr ist kaputt.' }, again, T0 + DAY).result;
  assert.match(inSentence, /VERIFIED CORRECTIONS/);
});

test('saved words come back for spaced review', async () => {
  const mem = await openMemory(createMapStore(), T0);
  assert.match(handle({ action: 'save', item: 'mit etwas zu tun haben', meaning: 'to have to do with' }, mem, T0).result, /Saved/);
  assert.match(handle({ action: 'quiz' }, mem, T0).result, /Nothing is due/);
  assert.match(handle({ action: 'quiz' }, mem, T0 + DAY).result, /mit etwas zu tun haben \| answer: to have to do with/);
  assert.match(handle({ action: 'review', item: 'mit etwas zu tun haben', correct: true }, mem, T0 + DAY).result, /next due in 3 days/);
  assert.match(handle({ action: 'review', item: 'mit etwas zu tun haben', correct: false }, mem, T0 + DAY).result, /next due in 1 day/);
  assert.match(handle({ action: 'analyze', sentence: 'Das hat mit mir zu tun.' }, mem, T0).result, /ALREADY SAVED BY THE LEARNER: mit etwas zu tun haben/);
  assert.match(handle({ action: 'recall' }, mem, T0).result, /SAVED \(1\)/);
});

test('mistakes feed the quiz and export only new items once', async () => {
  const mem = await openMemory(createMapStore(), T0);
  handle({ action: 'mistake', wrong: 'die neue Worte', right: 'die neuen Wörter', rule: 'Wörter vs Worte' }, mem, T0);
  assert.match(handle({ action: 'mistake', wrong: 'Worte', right: 'Wörter', rule: 'Wörter vs Worte' }, mem, T0).result, /2\. time/);
  handle({ action: 'fix', item: 'Heimat', correction: 'die Heimat' }, mem, T0);
  assert.match(handle({ action: 'quiz' }, mem, T0).result, /practise these recurring mistakes: Wörter vs Worte/);
  const exp = handle({ action: 'export' }, mem, T0).result;
  assert.equal(exp.split('\n').filter((l: string) => l.startsWith('{')).length, 3);
  assert.match(exp, /"type":"correction"/);
  assert.match(handle({ action: 'export' }, mem, T0).result, /Nothing new/);
  assert.match(handle({ action: 'stats' }, mem, T0).result, /Corrections: 1, mistakes logged: 2/);
});

test('built page works like Edge Gallery calls it, with memory between calls', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gt-'));
  build(dir);
  assert.match(readFileSync(join(dir, 'SKILL.md'), 'utf8'), /^---\nname: german-teacher\ndescription: .+\n---\n/);
  const html = readFileSync(join(dir, 'scripts', 'index.html'), 'utf8');
  assert.doesNotMatch(html, /<script src=|https?:\/\/(?!github)/, 'no network dependencies');
  const script = html.match(/<script>([\s\S]*)<\/script>/)![1];
  const storage = new Map<string, string>();
  const localStorage = { getItem: (k: string) => storage.get(k) ?? null, setItem: (k: string, v: string) => void storage.set(k, v), removeItem: (k: string) => void storage.delete(k) };
  const run = async (data: object) => {
    const window: Record<string, (d: string) => Promise<string>> = {};
    vm.runInNewContext(script, { window, localStorage, JSON, String, Number, Set, Map, Date, Math, Promise, Object });
    return JSON.parse(await window['ai_edge_gallery_get_result'](JSON.stringify(data)));
  };
  assert.match((await run({ action: 'fix', item: 'Satz', correction: 'der Satz, die Sätze' })).result, /Correction stored/);
  assert.match((await run({ action: 'word', word: 'Satz' })).result, /VERIFIED CORRECTIONS/); // fresh page load, same storage
  assert.match((await run({ action: 'stats' })).result, /saved between chats/);
  assert.match((await run({})).error, /Unknown action/);
});

test('answers in German by default with examples; English on request; remembered', async () => {
  const store = createMapStore();
  const mem = await openMemory(store, T0);
  const de = handle({ action: 'analyze', sentence: 'Das hat nichts mit dir zu tun.' }, mem, T0).result;
  assert.match(de, /ANTWORTE AUF DEUTSCH/);
  assert.match(de, /Beispiel: Das hat nichts mit dir zu tun\. \(That has nothing to do with you\.\)/);
  assert.match(handle({ action: 'word', word: 'Begriff' }, mem, T0).result, /BEISPIELE: 3 kurze Sätze/);

  handle({ action: 'save', item: 'Begriff', meaning: 'term', example: 'Das hat mit dem Begriff Heimat zu tun.' }, mem, T0);
  assert.match(handle({ action: 'word', word: 'Begriff' }, mem, T0).result, /Satz aus dem Buch des Lernenden: "Das hat mit dem Begriff Heimat zu tun\."/);

  assert.match(handle({ action: 'settings', lang: 'English' }, mem, T0).result, /English/);
  await mem.flush();
  const later = await openMemory(store, T0 + DAY);
  assert.match(handle({ action: 'analyze', sentence: 'Ich verstehe nur Bahnhof.' }, later, T0 + DAY).result, /ANSWER IN ENGLISH/);
  assert.match(handle({ action: 'settings', lang: 'de' }, later, T0).result, /Deutsch/);
});
