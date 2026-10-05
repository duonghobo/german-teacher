import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import vm from 'node:vm';
import { buildAll } from './build.ts';

// Run a built index.html the way Edge Gallery does: load the script, call the global function.
function load(html: string) {
  const script = html.match(/<script>([\s\S]*)<\/script>/)![1];
  const window: Record<string, (data: string) => Promise<string>> = {};
  vm.runInNewContext(script, { window, JSON, String, Set, Map });
  return window['ai_edge_gallery_get_result'];
}

test('built skills have valid SKILL.md and a working run_js entry point', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'edge-skills-'));
  buildAll(dir);

  for (const name of ['german-sentence-coach', 'german-word-forms']) {
    const md = readFileSync(join(dir, name, 'SKILL.md'), 'utf8');
    assert.match(md, new RegExp(`^---\\nname: ${name}\\ndescription: .+\\n---\\n`));
  }

  const coach = load(readFileSync(join(dir, 'german-sentence-coach', 'scripts', 'index.html'), 'utf8'));
  const out = JSON.parse(await coach(JSON.stringify({ sentence: 'Die neuen Wörter haben mit dem Begriff Heimat zu tun.' })));
  assert.match(out.result, /mit etwas zu tun haben = to have to do with something/);
  assert.match(JSON.parse(await coach('{}')).error, /sentence/);

  const words = load(readFileSync(join(dir, 'german-word-forms', 'scripts', 'index.html'), 'utf8'));
  assert.match(JSON.parse(await words(JSON.stringify({ word: 'tun' }))).result, /Präteritum: tat/);
  assert.match(JSON.parse(await words(JSON.stringify({ word: 'Heimat' }))).result, /NOUN: die Heimat/);
  assert.match(JSON.parse(await words('not json')).error, /JSON/);
});
