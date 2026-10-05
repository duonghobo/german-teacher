import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verbInfo, nounInfo, wordInfo, analyzeSentence, findPhrases } from './german-engine.js';

const phraseNames = (s: string) => findPhrases(s).map((p: { phrase: string }) => p.phrase);

test('irregular verbs come from the table (the forms Gemma got wrong)', () => {
  assert.equal(verbInfo('tun').praeteritum, 'tat');
  assert.equal(verbInfo('tun').partizip2, 'getan');
  assert.equal(verbInfo('kommen').auxiliary, 'sein');
  assert.equal(verbInfo('bekommen').auxiliary, 'haben');
  assert.equal(verbInfo('verstehen').partizip2, 'verstanden');
  assert.equal(verbInfo('wissen').praesens_er, 'weiß');
});

test('separable, inseparable and ambiguous prefixes', () => {
  const an = verbInfo('ankommen');
  assert.equal(an.separable, true);
  assert.equal(an.praesens_er, 'kommt an');
  assert.equal(an.partizip2, 'angekommen');
  assert.equal(verbInfo('teilnehmen').partizip2, 'teilgenommen');
  assert.equal(verbInfo('vorstellen').partizip2, 'vorgestellt');
  assert.equal(verbInfo('übersetzen').partizip2, 'übersetzt');
  assert.equal(verbInfo('übersetzen').separable, 'depends on meaning');
  assert.equal(verbInfo('bezahlen').partizip2, 'bezahlt');
});

test('regular verb rules', () => {
  assert.equal(verbInfo('arbeiten').praeteritum, 'arbeitete');
  assert.equal(verbInfo('öffnen').praesens_er, 'öffnet');
  assert.equal(verbInfo('studieren').partizip2, 'studiert');
  assert.equal(verbInfo('wandern').auxiliary, 'sein');
  assert.equal(verbInfo('machen').source, 'rule');
});

test('reflexive meanings are attached', () => {
  assert.match(verbInfo('sich vorstellen').reflexive_meanings, /imagine/);
  assert.match(verbInfo('erinnern').reflexive_meanings, /remember/);
});

test('nouns: table, compounds, ending rules', () => {
  assert.equal(nounInfo('Heimat').gender, 'die');
  assert.equal(nounInfo('Satz').gender, 'der');
  assert.equal(nounInfo('Satz').plural, 'Sätze');
  assert.equal(nounInfo('Heimatgefühl').gender, 'das');
  assert.equal(nounInfo('Zeitung').gender, 'die');
  assert.equal(nounInfo('Mädchen').gender, 'das');
  assert.equal(nounInfo('Lesen').gender, 'das');
  assert.equal(nounInfo('Xyz').gender, 'unknown');
});

test('wordInfo routes verbs, conjugated forms and nouns', () => {
  assert.equal(wordInfo('tat').infinitive, 'tun');
  assert.equal(wordInfo('Heimat').kind, 'noun');
  assert.equal(wordInfo('sich freuen').kind, 'verb');
});

test('fixed phrases, including the one Gemma missed', () => {
  assert.deepEqual(phraseNames('Die neuen Wörter haben mit dem Begriff Heimat zu tun.'), ['mit etwas zu tun haben']);
  assert.ok(phraseNames('Es geht in diesem Kapitel um die Frage, was Heimat bedeutet.').includes('es geht um'));
  assert.ok(phraseNames('Ich habe mich darauf gefreut, dass er endlich ankommt.').includes('sich freuen auf'));
  assert.ok(phraseNames('Ich verstehe nur Bahnhof.').includes('nur Bahnhof verstehen'));
  assert.ok(phraseNames('Er nahm an dem Kurs teil, um besser Deutsch zu lernen.').includes('teilnehmen an'));
  assert.ok(phraseNames('Sie sehnt sich nach ihrer Heimat.').includes('sich sehnen nach'));
  assert.ok(phraseNames('Er spricht sowohl Deutsch als auch Englisch.').includes('sowohl ... als auch'));
  assert.deepEqual(phraseNames('Der Hund schläft.'), []);
});

test('sentence structure: clauses, separable verbs, tense hints', () => {
  const a = analyzeSentence('Der Zug kommt um acht Uhr an.');
  assert.match(a.clauses[0].separable_verb, /ankommen/);
  assert.match(a.clauses[0].verb_position, /kommt/);

  const b = analyzeSentence('Ich habe mich darauf gefreut, dass er endlich ankommt.');
  assert.equal(b.clauses[1].type, 'subordinate clause');
  assert.match(b.clauses[1].verb_position, /ankommt/);
  assert.match(b.clauses[0].tense_hints[0], /Perfekt/);
  assert.ok(b.irregular_verbs.some((v: { infinitive: string }) => v.infinitive === 'ankommen'));

  const c = analyzeSentence('Ich denke, die neuen Wörter haben mit dem Begriff Heimat zu tun.');
  assert.notEqual(c.clauses[1].type, 'relative clause (probably)');

  const d = analyzeSentence('Das ist der Mann, der in Berlin wohnt.');
  assert.equal(d.clauses[1].type, 'relative clause (probably)');

  assert.equal(analyzeSentence('Das hat mit mir zu tun.').clauses[0].type, 'main clause');

  const e = analyzeSentence('Das Haus wurde 1990 gebaut.');
  assert.ok(e.clauses[0].tense_hints.some((h: string) => h.startsWith('Passiv')));
});
