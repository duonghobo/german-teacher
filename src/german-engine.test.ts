import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatWord, verbInfo, nounInfo, wordInfo, analyzeSentence, findPhrases, PHRASES, PHRASE_EXAMPLES } from './german-engine.js';

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
  const f = analyzeSentence('Ich denke, die neuen Wörter haben mit dem Begriff Heimat zu tun.');
  assert.equal(f.clauses[1].type, 'main clause');
  assert.match(f.clauses[1].verb_position, /"haben"/);
  assert.equal(analyzeSentence('Er versuchte, das Buch zu lesen.').clauses[1].type, 'infinitive clause');

  const e = analyzeSentence('Das Haus wurde 1990 gebaut.');
  assert.ok(e.clauses[0].tense_hints.some((h: string) => h.startsWith('Passiv')));
});

test('every fixed phrase has an example, and the example contains the phrase', () => {
  for (const p of PHRASES as { phrase: string }[]) {
    const ex = (PHRASE_EXAMPLES as Record<string, string[]>)[p.phrase];
    assert.ok(ex, `missing example for "${p.phrase}"`);
    assert.ok(phraseNames(ex[0]).includes(p.phrase), `example "${ex[0]}" does not match "${p.phrase}"`);
  }
});

test('typos are corrected to the closest known word', () => {
  assert.equal(wordInfo('Befriff').did_you_mean, 'Begriff');
  assert.equal(wordInfo('Heimt').gender, 'die');
  assert.equal(wordInfo('komen').infinitive, 'kommen');
  assert.equal(wordInfo('Heimat').did_you_mean, undefined);
  assert.equal(wordInfo('Xyzabc').gender, 'unknown');
});

test('several words: content words and fixed phrases, no noise', () => {
  const out = formatWord('Befriff haben');
  assert.match(out, /TYPO: .*"Befriff".*"Begriff"/);
  assert.match(out, /NOUN: der Begriff/);
  assert.doesNotMatch(out, /VERB: haben/); // basic words skipped when there is a content word
  const sich = formatWord('sich freuen auf');
  assert.match(sich, /FIXED PHRASE: sich freuen auf/);
  assert.doesNotMatch(sich, /UNKNOWN: auf/);
});

test('looking up a noun lists the fixed phrases built with it', () => {
  const out = formatWord('Begriff haben');
  assert.match(out, /NOUN: der Begriff/);
  assert.match(out, /PHRASE WITH THIS WORD: im Begriff sein, etwas zu tun = to be about to do something/);
  assert.match(out, /schwer von Begriff sein/);
  assert.match(formatWord('Heimweh'), /Heimweh haben/);
  assert.deepEqual(phraseNames('Ich denke, die neuen Wörter haben mit dem Begriff Heimat zu tun.'), ['mit etwas zu tun haben']);
});

test('forms of prefixed verbs are recognised (begriffen → begreifen)', () => {
  const b = wordInfo('begriffen');
  assert.equal(b.infinitive, 'begreifen');
  assert.equal(b.praeteritum, 'begriff');
  assert.equal(b.partizip2, 'begriffen');
  assert.equal(b.auxiliary, 'haben');
  assert.match(b.meaning, /understand/);
  assert.equal(wordInfo('angekommen').infinitive, 'ankommen');
  assert.equal(wordInfo('verstand').infinitive, 'verstehen');
  const out = formatWord('begriffen haben');
  assert.match(out, /"begriffen" is a form of "begreifen" \(Partizip II/);
  assert.match(out, /meaning: to understand, grasp/);
  assert.ok(analyzeSentence('Ich habe es endlich begriffen.').irregular_verbs.some((v) => v.infinitive === 'begreifen'));
});

test('meanings come from the tables, with an honest fallback', () => {
  assert.match(formatWord('Heimat'), /meaning: home, homeland/);
  assert.match(formatWord('tun'), /meaning: to do/);
  assert.match(formatWord('Xyzabc'), /meaning: not in the tables/);
});
