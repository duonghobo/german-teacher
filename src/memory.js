// On-device memory for the German teacher skill: saved words (spaced review),
// verified corrections that override the built-in tables, and the learner's own mistakes.
// Plain JS (no imports) so build.ts can inline it into scripts/index.html.

const MEMORY_KEY = 'german-teacher-memory-v1';
const DAY = 24 * 60 * 60 * 1000;
const BOX_DAYS = [0, 1, 3, 7, 14, 30]; // Leitner boxes 1..5

function emptyMemory() {
  return { v: 1, vocab: {}, corrections: {}, mistakes: [], lastExport: 0 };
}

function memKey(text) {
  return String(text || '').toLowerCase().trim()
    .replace(/^(der|die|das|sich)\s+/, '')
    .replace(/[.,;:!?"„“]/g, '')
    .replace(/\s+/g, ' ');
}

// A store is { load(): Promise<string|null>, save(text): Promise<void>, persistent: boolean }.
function createMapStore() {
  let value = null;
  return { persistent: true, async load() { return value; }, async save(text) { value = text; } };
}

// Browser store: localStorage, mirrored to IndexedDB. Whichever copy is newer wins on load.
function createBrowserStore() {
  const hasLocal = (() => { try { const k = '__gt_probe'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return true; } catch (e) { return false; } })();
  const idb = (() => { try { return typeof indexedDB !== 'undefined' ? indexedDB : null; } catch (e) { return null; } })();
  function openDb() {
    return new Promise((resolve) => {
      if (!idb) return resolve(null);
      try {
        const req = idb.open('german-teacher', 1);
        req.onupgradeneeded = () => req.result.createObjectStore('kv');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch (e) { resolve(null); }
    });
  }
  async function idbGet() {
    const db = await openDb();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const req = db.transaction('kv', 'readonly').objectStore('kv').get(MEMORY_KEY);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (e) { resolve(null); }
    });
  }
  async function idbSet(text) {
    const db = await openDb();
    if (!db) return;
    await new Promise((resolve) => {
      try {
        const tx = db.transaction('kv', 'readwrite');
        tx.objectStore('kv').put(text, MEMORY_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) { resolve(); }
    });
  }
  const savedAt = (text) => { try { return JSON.parse(text).savedAt || 0; } catch (e) { return 0; } };
  return {
    persistent: hasLocal || !!idb,
    async load() {
      let local = null;
      if (hasLocal) { try { local = localStorage.getItem(MEMORY_KEY); } catch (e) { local = null; } }
      const fromDb = await idbGet();
      if (local && fromDb) return savedAt(local) >= savedAt(fromDb) ? local : fromDb;
      return local || fromDb;
    },
    async save(text) {
      if (hasLocal) { try { localStorage.setItem(MEMORY_KEY, text); } catch (e) { /* quota or blocked */ } }
      await idbSet(text);
    },
  };
}

async function openMemory(store, now = Date.now()) {
  let data = emptyMemory();
  try {
    const text = await store.load();
    if (text) data = { ...emptyMemory(), ...JSON.parse(text) };
  } catch (e) { data = emptyMemory(); }
  return {
    data,
    persistent: store.persistent,
    async flush() { data.savedAt = now; await store.save(JSON.stringify(data)); },
  };
}

// ---------- Operations (all pure on mem.data) ----------
function saveWord(mem, { item, meaning, example }, now = Date.now()) {
  const key = memKey(item);
  if (!key) return 'Nothing to save: give "item".';
  const old = mem.data.vocab[key];
  mem.data.vocab[key] = {
    item: String(item).trim(), meaning: meaning || (old && old.meaning) || '', example: example || (old && old.example) || '',
    box: old ? old.box : 1, due: old ? old.due : now + DAY, added: old ? old.added : now, right: old ? old.right : 0, wrong: old ? old.wrong : 0,
  };
  const n = Object.keys(mem.data.vocab).length;
  return `${old ? 'Updated' : 'Saved'} "${String(item).trim()}". You have ${n} saved item${n === 1 ? '' : 's'}. First review: tomorrow.`;
}

function addCorrection(mem, { item, correction }, now = Date.now()) {
  const key = memKey(item);
  if (!key || !correction) return 'A correction needs "item" and "correction".';
  mem.data.corrections[key] = { item: String(item).trim(), correction: String(correction).trim(), added: now, exported: false };
  return `Correction stored: ${String(item).trim()} → ${String(correction).trim()}. From now on it overrides the built-in tables.`;
}

function addMistake(mem, { wrong, right, rule }, now = Date.now()) {
  if (!wrong || !right) return 'A mistake needs "wrong" and "right".';
  mem.data.mistakes.push({ wrong: String(wrong).trim(), right: String(right).trim(), rule: rule ? String(rule).trim() : '', added: now, exported: false });
  const same = mem.data.mistakes.filter((m) => m.rule && m.rule === rule).length;
  return `Mistake logged.${same > 1 ? ` This is the ${same}. time for "${rule}".` : ''}`;
}

function correctionsFor(mem, text) {
  const out = [];
  const whole = mem.data.corrections[memKey(text)];
  if (whole) out.push(whole);
  for (const t of (String(text).match(/[A-Za-zÄÖÜäöüß]+/g) || [])) {
    const c = mem.data.corrections[memKey(t)];
    if (c && !out.includes(c)) out.push(c);
  }
  return out;
}

function savedIn(mem, text) {
  const tokens = new Set((String(text).match(/[A-Za-zÄÖÜäöüß]+/g) || []).map((t) => t.toLowerCase()));
  return Object.values(mem.data.vocab).filter((v) => memKey(v.item).split(' ').every((w) => tokens.has(w)));
}

function dueItems(mem, now = Date.now(), n = 5) {
  return Object.values(mem.data.vocab).filter((v) => v.due <= now).sort((a, b) => a.due - b.due).slice(0, n);
}

function quiz(mem, n = 5, now = Date.now()) {
  const due = dueItems(mem, now, n);
  const weak = mem.data.mistakes.slice(-20).filter((m) => m.rule);
  const rules = [...new Set(weak.map((m) => m.rule))].slice(0, 2);
  if (!due.length && !rules.length) {
    const total = Object.keys(mem.data.vocab).length;
    return total ? `Nothing is due today (${total} saved). Come back tomorrow.` : 'No saved words yet. Save words with "save: ...".';
  }
  const lines = ['QUIZ ITEMS (ask one at a time; after each answer call action "review"):'];
  due.forEach((v, i) => lines.push(`${i + 1}. ${v.item}${v.example ? ` (from: "${v.example}")` : ''} | answer: ${v.meaning || 'check with the learner'}`));
  if (rules.length) lines.push(`ALSO practise these recurring mistakes: ${rules.join('; ')}`);
  return lines.join('\n');
}

function review(mem, { item, correct }, now = Date.now()) {
  const v = mem.data.vocab[memKey(item)];
  if (!v) return `"${item}" is not saved.`;
  const ok = correct === true || correct === 'true' || correct === 'yes';
  v.box = ok ? Math.min(5, v.box + 1) : 1;
  v.due = now + BOX_DAYS[v.box] * DAY;
  if (ok) v.right += 1; else v.wrong += 1;
  return `${ok ? 'Correct' : 'Not yet'}: "${v.item}" next due in ${BOX_DAYS[v.box]} day${BOX_DAYS[v.box] === 1 ? '' : 's'}.`;
}

function recall(mem, query) {
  const q = memKey(query);
  const vocab = Object.values(mem.data.vocab).filter((v) => !q || memKey(v.item).includes(q) || (v.meaning || '').toLowerCase().includes(q));
  const corr = Object.values(mem.data.corrections).filter((c) => !q || memKey(c.item).includes(q));
  const lines = [`SAVED (${vocab.length}):`];
  vocab.slice(0, 15).forEach((v) => lines.push(`- ${v.item}${v.meaning ? ` = ${v.meaning}` : ''} (box ${v.box})`));
  lines.push(`CORRECTIONS (${corr.length}):`);
  corr.slice(0, 15).forEach((c) => lines.push(`- ${c.item} → ${c.correction}`));
  return lines.join('\n');
}

function stats(mem, now = Date.now()) {
  const vocab = Object.values(mem.data.vocab);
  const byBox = [1, 2, 3, 4, 5].map((b) => vocab.filter((v) => v.box === b).length);
  return [
    `Saved: ${vocab.length} (boxes 1-5: ${byBox.join(' / ')}), due now: ${dueItems(mem, now, 999).length}`,
    `Corrections: ${Object.keys(mem.data.corrections).length}, mistakes logged: ${mem.data.mistakes.length}`,
    `Memory on this device: ${mem.persistent ? 'saved between chats' : 'NOT persistent (storage blocked)'}`,
  ].join('\n');
}

// Lines for the repo's evolution/ files; marks them exported.
function exportNew(mem, now = Date.now()) {
  const day = new Date(now).toISOString().slice(0, 10);
  const lines = [];
  for (const c of Object.values(mem.data.corrections)) {
    if (!c.exported) { lines.push(JSON.stringify({ type: 'correction', date: day, item: c.item, correction: c.correction })); c.exported = true; }
  }
  for (const m of mem.data.mistakes) {
    if (!m.exported) { lines.push(JSON.stringify({ type: 'mistake', date: day, wrong: m.wrong, right: m.right, rule: m.rule })); m.exported = true; }
  }
  mem.data.lastExport = now;
  const vocab = Object.keys(mem.data.vocab).length;
  if (!lines.length) return `Nothing new to export. (${vocab} saved words stay on this device.)`;
  return ['EXPORT (copy everything between the lines and paste it to Claude when online):', '---', ...lines, '---', `${lines.length} new item(s). Saved words (${vocab}) stay on this device.`].join('\n');
}

export {
  MEMORY_KEY, emptyMemory, memKey, createMapStore, createBrowserStore, openMemory,
  saveWord, addCorrection, addMistake, correctionsFor, savedIn, dueItems, quiz, review, recall, stats, exportNew,
};
