// Offline German grammar helper for Google AI Edge Gallery skills.
// Plain JS (no imports) so build.ts can inline it into a skill's index.html.
// Deterministic data the small on-device model kept getting wrong:
// verb forms, noun genders/plurals, fixed phrases, clause structure.

// ---------- Verb table: infinitive|er-Präsens|Präteritum|Partizip II|aux (h, s, hs) ----------
const VERB_ROWS = `
backen|backt|backte|gebacken|h
befehlen|befiehlt|befahl|befohlen|h
beginnen|beginnt|begann|begonnen|h
beißen|beißt|biss|gebissen|h
biegen|biegt|bog|gebogen|hs
bieten|bietet|bot|geboten|h
binden|bindet|band|gebunden|h
bitten|bittet|bat|gebeten|h
blasen|bläst|blies|geblasen|h
bleiben|bleibt|blieb|geblieben|s
braten|brät|briet|gebraten|h
brechen|bricht|brach|gebrochen|hs
brennen|brennt|brannte|gebrannt|h
bringen|bringt|brachte|gebracht|h
denken|denkt|dachte|gedacht|h
dringen|dringt|drang|gedrungen|s
dürfen|darf|durfte|gedurft|h
empfehlen|empfiehlt|empfahl|empfohlen|h
essen|isst|aß|gegessen|h
fahren|fährt|fuhr|gefahren|hs
fallen|fällt|fiel|gefallen|s
fangen|fängt|fing|gefangen|h
finden|findet|fand|gefunden|h
fliegen|fliegt|flog|geflogen|hs
fliehen|flieht|floh|geflohen|s
fließen|fließt|floss|geflossen|s
fressen|frisst|fraß|gefressen|h
frieren|friert|fror|gefroren|hs
geben|gibt|gab|gegeben|h
gehen|geht|ging|gegangen|s
gelingen|gelingt|gelang|gelungen|s
gelten|gilt|galt|gegolten|h
genießen|genießt|genoss|genossen|h
geschehen|geschieht|geschah|geschehen|s
gewinnen|gewinnt|gewann|gewonnen|h
gießen|gießt|goss|gegossen|h
gleichen|gleicht|glich|geglichen|h
gleiten|gleitet|glitt|geglitten|s
graben|gräbt|grub|gegraben|h
greifen|greift|griff|gegriffen|h
haben|hat|hatte|gehabt|h
halten|hält|hielt|gehalten|h
hängen|hängt|hing|gehangen|h
heben|hebt|hob|gehoben|h
heißen|heißt|hieß|geheißen|h
helfen|hilft|half|geholfen|h
kennen|kennt|kannte|gekannt|h
klingen|klingt|klang|geklungen|h
kommen|kommt|kam|gekommen|s
können|kann|konnte|gekonnt|h
kriechen|kriecht|kroch|gekrochen|s
laden|lädt|lud|geladen|h
lassen|lässt|ließ|gelassen|h
laufen|läuft|lief|gelaufen|s
leiden|leidet|litt|gelitten|h
leihen|leiht|lieh|geliehen|h
lesen|liest|las|gelesen|h
liegen|liegt|lag|gelegen|h
lügen|lügt|log|gelogen|h
meiden|meidet|mied|gemieden|h
messen|misst|maß|gemessen|h
mögen|mag|mochte|gemocht|h
müssen|muss|musste|gemusst|h
nehmen|nimmt|nahm|genommen|h
nennen|nennt|nannte|genannt|h
pfeifen|pfeift|pfiff|gepfiffen|h
raten|rät|riet|geraten|h
reiben|reibt|rieb|gerieben|h
reißen|reißt|riss|gerissen|hs
reiten|reitet|ritt|geritten|hs
rennen|rennt|rannte|gerannt|s
riechen|riecht|roch|gerochen|h
rufen|ruft|rief|gerufen|h
scheiden|scheidet|schied|geschieden|hs
scheinen|scheint|schien|geschienen|h
schieben|schiebt|schob|geschoben|h
schießen|schießt|schoss|geschossen|hs
schlafen|schläft|schlief|geschlafen|h
schlagen|schlägt|schlug|geschlagen|h
schleichen|schleicht|schlich|geschlichen|s
schließen|schließt|schloss|geschlossen|h
schmeißen|schmeißt|schmiss|geschmissen|h
schmelzen|schmilzt|schmolz|geschmolzen|hs
schneiden|schneidet|schnitt|geschnitten|h
schreiben|schreibt|schrieb|geschrieben|h
schreien|schreit|schrie|geschrien|h
schweigen|schweigt|schwieg|geschwiegen|h
schwimmen|schwimmt|schwamm|geschwommen|hs
schwören|schwört|schwor|geschworen|h
sehen|sieht|sah|gesehen|h
sein|ist|war|gewesen|s
singen|singt|sang|gesungen|h
sinken|sinkt|sank|gesunken|s
sitzen|sitzt|saß|gesessen|h
sollen|soll|sollte|gesollt|h
sprechen|spricht|sprach|gesprochen|h
springen|springt|sprang|gesprungen|s
stechen|sticht|stach|gestochen|h
stehen|steht|stand|gestanden|h
stehlen|stiehlt|stahl|gestohlen|h
steigen|steigt|stieg|gestiegen|s
sterben|stirbt|starb|gestorben|s
stinken|stinkt|stank|gestunken|h
stoßen|stößt|stieß|gestoßen|hs
streichen|streicht|strich|gestrichen|h
streiten|streitet|stritt|gestritten|h
tragen|trägt|trug|getragen|h
treffen|trifft|traf|getroffen|h
treiben|treibt|trieb|getrieben|hs
treten|tritt|trat|getreten|hs
trinken|trinkt|trank|getrunken|h
tun|tut|tat|getan|h
verderben|verdirbt|verdarb|verdorben|hs
vergessen|vergisst|vergaß|vergessen|h
verlieren|verliert|verlor|verloren|h
verschwinden|verschwindet|verschwand|verschwunden|s
verzeihen|verzeiht|verzieh|verziehen|h
wachsen|wächst|wuchs|gewachsen|s
waschen|wäscht|wusch|gewaschen|h
weichen|weicht|wich|gewichen|s
weisen|weist|wies|gewiesen|h
werben|wirbt|warb|geworben|h
werden|wird|wurde|geworden|s
werfen|wirft|warf|geworfen|h
wiegen|wiegt|wog|gewogen|h
wissen|weiß|wusste|gewusst|h
wollen|will|wollte|gewollt|h
ziehen|zieht|zog|gezogen|hs
zwingen|zwingt|zwang|gezwungen|h
bekommen|bekommt|bekam|bekommen|h
verstehen|versteht|verstand|verstanden|h
entscheiden|entscheidet|entschied|entschieden|h
erfahren|erfährt|erfuhr|erfahren|h
gefallen|gefällt|gefiel|gefallen|h
entstehen|entsteht|entstand|entstanden|s
erscheinen|erscheint|erschien|erschienen|s
unterscheiden|unterscheidet|unterschied|unterschieden|h
unterhalten|unterhält|unterhielt|unterhalten|h
einschlafen|schläft ein|schlief ein|eingeschlafen|s
aufstehen|steht auf|stand auf|aufgestanden|s
`;

// Regular (weak) verbs that take "sein" in the Perfekt.
const REGULAR_SEIN = new Set(['reisen', 'wandern', 'folgen', 'begegnen', 'passieren', 'landen', 'klettern',
  'aufwachen', 'erwachen', 'stolpern', 'eilen', 'verreisen', 'zurückkehren', 'auswandern', 'einwandern',
  'umziehen', 'aufwachsen', 'scheitern', 'joggen', 'starten', 'segeln', 'rudern']);

// "sich" changes the meaning of these verbs.
const REFLEXIVE_NOTES = {
  vorstellen: 'jemanden vorstellen = to introduce someone; sich (Dat) etwas vorstellen = to imagine something; sich vorstellen = to introduce oneself',
  erinnern: 'jemanden an etwas erinnern = to remind someone of something; sich an etwas (Akk) erinnern = to remember something',
  freuen: 'jemanden freuen = to please someone; sich auf etwas (Akk) freuen = to look forward to; sich über etwas (Akk) freuen = to be glad about',
  ärgern: 'jemanden ärgern = to annoy someone; sich über etwas (Akk) ärgern = to be annoyed about',
  entscheiden: 'etwas entscheiden = to decide something; sich für etwas (Akk) entscheiden = to choose / decide in favour of',
  fühlen: 'etwas fühlen = to feel/touch something; sich + Adjektiv fühlen = to feel (e.g. sich fremd fühlen)',
  setzen: 'etwas setzen = to put/place; sich setzen = to sit down',
  legen: 'etwas legen = to lay something down; sich legen = to lie down / to calm down',
  verlassen: 'jemanden/etwas verlassen = to leave; sich auf jemanden verlassen = to rely on someone',
  handeln: 'handeln = to act / to trade; von etwas handeln = to be about; es handelt sich um = it is (a matter of)',
  kümmern: 'jemanden kümmern = to concern someone; sich um etwas (Akk) kümmern = to take care of',
  beschäftigen: 'jemanden beschäftigen = to employ/occupy; sich mit etwas (Dat) beschäftigen = to deal with / study',
  unterhalten: 'jemanden unterhalten = to entertain; sich unterhalten = to have a conversation',
  bewerben: 'sich um/für etwas bewerben = to apply for; sich bei einer Firma bewerben = to apply to a company',
  gewöhnen: 'jemanden an etwas gewöhnen = to accustom someone; sich an etwas (Akk) gewöhnen = to get used to',
  verlieben: 'sich in jemanden verlieben = to fall in love with',
  sehnen: 'sich nach etwas (Dat) sehnen = to long for',
};

const INSEPARABLE = ['miss', 'hinter', 'emp', 'zer', 'ver', 'ent', 'be', 'ge', 'er'];
const AMBIGUOUS = ['wieder', 'wider', 'unter', 'durch', 'über', 'voll', 'um'];
const SEPARABLE = ['zusammen', 'zurück', 'weiter', 'herein', 'heraus', 'hinaus', 'herum', 'vorbei', 'voraus',
  'entgegen', 'nieder', 'statt', 'fest', 'fort', 'frei', 'hoch', 'los', 'nach', 'teil', 'weg', 'her', 'hin',
  'vor', 'auf', 'aus', 'bei', 'ein', 'mit', 'ab', 'an', 'zu', 'da', 'dar'];

const VERBS = new Map();
for (const line of VERB_ROWS.trim().split('\n')) {
  const [inf, p3, prt, p2, aux] = line.split('|');
  VERBS.set(inf, { inf, p3, prt, p2, aux });
}


// Short meanings (English) so the model doesn't have to guess them.
const VERB_GLOSS = {
"backen": "to bake",
"befehlen": "to order, command",
"beginnen": "to begin",
"beißen": "to bite",
"biegen": "to bend; to turn (a corner)",
"bieten": "to offer",
"binden": "to tie, bind",
"bitten": "to ask (for), request",
"blasen": "to blow",
"bleiben": "to stay, remain",
"braten": "to fry, roast",
"brechen": "to break",
"brennen": "to burn",
"bringen": "to bring",
"denken": "to think",
"dringen": "to penetrate, urge",
"dürfen": "may, to be allowed to",
"empfehlen": "to recommend",
"essen": "to eat",
"fahren": "to drive, travel (by vehicle)",
"fallen": "to fall",
"fangen": "to catch",
"finden": "to find; to think (an opinion)",
"fliegen": "to fly",
"fliehen": "to flee",
"fließen": "to flow",
"fressen": "to eat (animals)",
"frieren": "to freeze, be cold",
"geben": "to give",
"gehen": "to go, walk",
"gelingen": "to succeed (es gelingt mir)",
"gelten": "to be valid, count as",
"genießen": "to enjoy",
"geschehen": "to happen",
"gewinnen": "to win",
"gießen": "to pour; to water",
"gleichen": "to resemble",
"gleiten": "to glide",
"graben": "to dig",
"greifen": "to grab, reach for",
"haben": "to have",
"halten": "to hold; to stop",
"hängen": "to hang",
"heben": "to lift",
"heißen": "to be called; to mean",
"helfen": "to help (+ Dat)",
"kennen": "to know (be familiar with)",
"klingen": "to sound",
"kommen": "to come",
"können": "can, to be able to",
"kriechen": "to crawl",
"laden": "to load",
"lassen": "to let, leave; to have something done",
"laufen": "to run, walk",
"leiden": "to suffer",
"leihen": "to lend, borrow",
"lesen": "to read",
"liegen": "to lie (be lying), be located",
"lügen": "to lie (tell lies)",
"meiden": "to avoid",
"messen": "to measure",
"mögen": "to like",
"müssen": "must, to have to",
"nehmen": "to take",
"nennen": "to name, call",
"pfeifen": "to whistle",
"raten": "to advise; to guess",
"reiben": "to rub",
"reißen": "to tear",
"reiten": "to ride (a horse)",
"rennen": "to run",
"riechen": "to smell",
"rufen": "to call",
"scheiden": "to separate; to divorce",
"scheinen": "to shine; to seem",
"schieben": "to push",
"schießen": "to shoot",
"schlafen": "to sleep",
"schlagen": "to hit, beat",
"schleichen": "to sneak",
"schließen": "to close; to conclude",
"schmeißen": "to chuck, throw",
"schmelzen": "to melt",
"schneiden": "to cut",
"schreiben": "to write",
"schreien": "to scream",
"schweigen": "to be silent",
"schwimmen": "to swim",
"schwören": "to swear",
"sehen": "to see",
"sein": "to be",
"singen": "to sing",
"sinken": "to sink",
"sitzen": "to sit",
"sollen": "should, to be supposed to",
"sprechen": "to speak",
"springen": "to jump",
"stechen": "to sting, prick",
"stehen": "to stand",
"stehlen": "to steal",
"steigen": "to climb, rise",
"sterben": "to die",
"stinken": "to stink",
"stoßen": "to push, bump",
"streichen": "to paint; to spread; to cross out",
"streiten": "to argue",
"tragen": "to carry; to wear",
"treffen": "to meet; to hit",
"treiben": "to drive; to do (sport)",
"treten": "to step; to kick",
"trinken": "to drink",
"tun": "to do",
"verderben": "to spoil",
"vergessen": "to forget",
"verlieren": "to lose",
"verschwinden": "to disappear",
"verzeihen": "to forgive",
"wachsen": "to grow",
"waschen": "to wash",
"weichen": "to give way",
"weisen": "to point, show",
"werben": "to advertise; to recruit",
"werden": "to become; (+ infinitive) will",
"werfen": "to throw",
"wiegen": "to weigh",
"wissen": "to know (a fact)",
"wollen": "to want",
"ziehen": "to pull; to move (house)",
"zwingen": "to force",
"bekommen": "to get, receive",
"verstehen": "to understand",
"entscheiden": "to decide",
"erfahren": "to find out; to experience",
"gefallen": "to please (es gefällt mir = I like it)",
"entstehen": "to arise, come into being",
"erscheinen": "to appear; to be published",
"unterscheiden": "to distinguish",
"unterhalten": "to entertain; (sich) to talk",
"einschlafen": "to fall asleep",
"aufstehen": "to get up, stand up",
"begreifen": "to understand, grasp",
"ergreifen": "to seize, take (an opportunity)",
"angreifen": "to attack",
"ankommen": "to arrive",
"anfangen": "to begin, start",
"anrufen": "to call (phone)",
"aussehen": "to look (like)",
"einladen": "to invite",
"vorschlagen": "to suggest",
"teilnehmen": "to take part",
"mitnehmen": "to take along",
"abfahren": "to depart",
"aufgeben": "to give up",
"ausgeben": "to spend (money)",
"annehmen": "to accept; to assume",
"vorlesen": "to read aloud",
"verlassen": "to leave, abandon; (sich auf) to rely on",
"erhalten": "to receive",
"enthalten": "to contain",
"behalten": "to keep",
"verbieten": "to forbid",
"versprechen": "to promise",
"besprechen": "to discuss",
"beschreiben": "to describe",
"unterschreiben": "to sign",
"vergleichen": "to compare",
"beweisen": "to prove",
"bestehen": "to pass (an exam); (aus) to consist of; (auf) to insist on",
"zurückkommen": "to come back",
"vorkommen": "to occur; to seem",
"anziehen": "to put on (clothes); to attract",
"ausziehen": "to take off (clothes); to move out",
"umziehen": "to move (house)",
"erziehen": "to bring up, educate",
"beziehen": "to obtain; (sich auf) to refer to",
"verbringen": "to spend (time)",
"entwerfen": "to design, draft",
"zurückgehen": "to go back",
"machen": "to make, do",
"lernen": "to learn",
"arbeiten": "to work",
"wohnen": "to live (reside)",
"leben": "to live",
"sagen": "to say",
"fragen": "to ask",
"antworten": "to answer",
"spielen": "to play",
"kaufen": "to buy",
"brauchen": "to need",
"glauben": "to believe",
"hoffen": "to hope",
"warten": "to wait",
"freuen": "(sich) to be glad",
"erinnern": "to remind; (sich) to remember",
"vorstellen": "to introduce; (sich etwas) to imagine",
"hören": "to hear, listen",
"zeigen": "to show",
"erklären": "to explain",
"bedeuten": "to mean",
"fühlen": "to feel",
"handeln": "to act; to trade; (von) to be about",
"sehnen": "(sich nach) to long for",
"suchen": "to look for",
"legen": "to lay, put (flat)",
"stellen": "to put (upright)",
"setzen": "to set, put; (sich) to sit down",
"reisen": "to travel",
"wandern": "to hike",
"folgen": "to follow",
"öffnen": "to open",
"studieren": "to study (at university)",
"vermissen": "to miss (someone)",
"kennenlernen": "to get to know",
"erzählen": "to tell (a story)",
"verändern": "to change",
"gehören": "to belong",
"träumen": "to dream"
};
const NOUN_GLOSS = {
"heimat": "home, homeland; the place where you feel you belong",
"heimweh": "homesickness",
"heimatland": "home country",
"zuhause": "home",
"herkunft": "origin, background",
"sehnsucht": "longing, yearning",
"fremde": "foreign parts (in der Fremde = far from home)",
"ausland": "abroad, foreign countries",
"ausländer": "foreigner",
"muttersprache": "mother tongue",
"wurzel": "root",
"grenze": "border; limit",
"satz": "sentence; (also) leap, set",
"begriff": "term, concept, notion",
"wort": "word",
"text": "text",
"kapitel": "chapter",
"thema": "topic",
"bedeutung": "meaning; importance",
"frage": "question",
"antwort": "answer",
"sprache": "language",
"buch": "book",
"geschichte": "story; history",
"erinnerung": "memory; reminder",
"kindheit": "childhood",
"erfahrung": "experience",
"gefühl": "feeling",
"meinung": "opinion",
"idee": "idea",
"sinn": "sense, meaning",
"grund": "reason; ground",
"unterschied": "difference",
"möglichkeit": "possibility",
"beispiel": "example",
"problem": "problem",
"ding": "thing",
"teil": "part",
"fall": "case; fall",
"seite": "side; page",
"mal": "time (one time, two times)",
"ziel": "goal; destination",
"weg": "way, path",
"ort": "place",
"raum": "room; space",
"zimmer": "room",
"haus": "house",
"wohnung": "apartment",
"tür": "door",
"fenster": "window",
"tisch": "table",
"stuhl": "chair",
"bett": "bed",
"straße": "street",
"stadt": "city, town",
"dorf": "village",
"land": "country; land",
"welt": "world",
"erde": "earth",
"himmel": "sky; heaven",
"sonne": "sun",
"mond": "moon",
"luft": "air",
"wasser": "water",
"feuer": "fire",
"meer": "sea",
"fluss": "river",
"berg": "mountain",
"baum": "tree",
"tier": "animal",
"hund": "dog",
"katze": "cat",
"zug": "train",
"bahnhof": "(train) station",
"auto": "car",
"reise": "trip, journey",
"mensch": "person, human being",
"leute": "people",
"eltern": "parents",
"mann": "man; husband",
"frau": "woman; wife; Mrs",
"kind": "child",
"mutter": "mother",
"vater": "father",
"bruder": "brother",
"schwester": "sister",
"familie": "family",
"freund": "friend; boyfriend",
"nachbar": "neighbour",
"name": "name",
"volk": "people, nation",
"gesellschaft": "society; company",
"kultur": "culture",
"gott": "god",
"hand": "hand",
"kopf": "head",
"auge": "eye",
"herz": "heart",
"gesicht": "face",
"leben": "life",
"tod": "death",
"zeit": "time",
"tag": "day",
"nacht": "night",
"morgen": "morning",
"abend": "evening",
"woche": "week",
"monat": "month",
"jahr": "year",
"stunde": "hour; lesson",
"minute": "minute",
"moment": "moment",
"anfang": "beginning",
"ende": "end",
"zukunft": "future",
"vergangenheit": "past",
"gegenwart": "present",
"arbeit": "work, job",
"schule": "school",
"firma": "company",
"stelle": "position, job; place",
"geld": "money",
"recht": "right; law",
"kraft": "strength, power",
"macht": "power",
"krieg": "war",
"frieden": "peace",
"essen": "food, meal",
"brot": "bread",
"bild": "picture",
"lied": "song",
"musik": "music",
"spiel": "game",
"uhr": "clock, watch; o'clock",
"kurs": "course",
"deutsch": "German (language)",
"zeitung": "newspaper",
"brief": "letter",
"gedanke": "thought",
"gedicht": "poem",
"roman": "novel",
"junge": "boy",
"käse": "cheese",
"mädchen": "girl"
};

const AUX_TEXT = { h: 'haben', s: 'sein', hs: 'sein (movement / change of state) or haben (with an object)' };

function stemOf(inf) {
  if (/(el|er)n$/.test(inf)) return inf.slice(0, -1);
  if (inf.endsWith('en')) return inf.slice(0, -2);
  return inf.replace(/n$/, '');
}

function needsE(stem) {
  return /[dt]$/.test(stem) || /[^aeiouäöülrh][mn]$/.test(stem);
}

function regularForms(inf) {
  const stem = stemOf(inf);
  const e = needsE(stem) ? 'e' : '';
  const ge = inf.endsWith('ieren') ? '' : 'ge';
  return { inf, p3: stem + e + 't', prt: stem + e + 'te', p2: ge + stem + e + 't', aux: REGULAR_SEIN.has(inf) ? 's' : 'h' };
}

function splitPrefix(inf) {
  for (const p of SEPARABLE) {
    const rest = inf.slice(p.length);
    if (inf.startsWith(p) && rest.length >= 3 && /n$/.test(rest) && (VERBS.has(rest) || p.length >= 3 || /[aeiouäöü]/.test(rest.slice(0, -2)))) {
      return { prefix: p, base: rest, kind: 'separable' };
    }
  }
  for (const p of AMBIGUOUS) {
    const rest = inf.slice(p.length);
    if (inf.startsWith(p) && rest.length >= 3 && /n$/.test(rest)) return { prefix: p, base: rest, kind: 'depends' };
  }
  for (const p of INSEPARABLE) {
    const rest = inf.slice(p.length);
    if (inf.startsWith(p) && rest.length >= 3 && /n$/.test(rest)) return { prefix: p, base: rest, kind: 'inseparable' };
  }
  return null;
}

function stripGe(p2) {
  return p2.startsWith('ge') ? p2.slice(2) : p2;
}

// Full info for one infinitive. source: table | derived | rule
function verbInfo(rawInf) {
  const inf = rawInf.toLowerCase().replace(/^sich\s+/, '').trim();
  let row = VERBS.get(inf);
  let source = 'table';
  let separable = false;
  let prefix = null;
  let note = '';
  if (!row) {
    const sp = splitPrefix(inf);
    const base = sp && VERBS.get(sp.base);
    if (sp && base) {
      source = 'derived';
      prefix = sp.prefix;
      if (sp.kind === 'separable') {
        separable = true;
        row = { inf, p3: `${base.p3} ${sp.prefix}`, prt: `${base.prt} ${sp.prefix}`, p2: sp.prefix + base.p2, aux: base.aux };
      } else {
        separable = sp.kind === 'depends' ? 'depends on meaning' : false;
        row = { inf, p3: sp.prefix + base.p3, prt: sp.prefix + base.prt, p2: sp.prefix + stripGe(base.p2), aux: base.aux };
        if (sp.kind === 'depends') note = `"${sp.prefix}-" can be separable or not, with different meanings; the forms shown are the inseparable ones.`;
      }
      note = (note + ' Built from "' + sp.base + '"; prefix verbs can switch between haben and sein, so check the auxiliary.').trim();
    } else {
      source = 'rule';
      if (sp && sp.kind === 'separable') {
        separable = true;
        prefix = sp.prefix;
        const r = regularForms(sp.base);
        row = { inf, p3: `${r.p3} ${sp.prefix}`, prt: `${r.prt} ${sp.prefix}`, p2: sp.prefix + r.p2, aux: REGULAR_SEIN.has(inf) ? 's' : 'h' };
      } else {
        if (sp && sp.kind !== 'separable') prefix = sp.prefix;
        const r = regularForms(inf);
        row = prefix ? { ...r, p2: stripGe(r.p2) } : r;
        if (sp && sp.kind === 'depends') { separable = 'depends on meaning'; note = `"${sp.prefix}-" can be separable or not, with different meanings; the forms shown are the inseparable ones. `; }
      }
      note += 'Not in the irregular-verb table, so treated as a regular verb. If it is irregular, these forms are wrong: check the dictionary.';
    }
  } else if (row.p3.includes(' ')) {
    separable = true;
    prefix = row.p2.slice(0, row.p2.indexOf('ge'));
  }
  const base = prefix && separable === true ? inf.slice(prefix.length) : inf;
  const kind = ['haben', 'sein', 'werden'].includes(inf) ? 'auxiliary'
    : ['können', 'müssen', 'dürfen', 'sollen', 'wollen', 'mögen'].includes(inf) ? 'modal'
    : source === 'rule' ? 'regular (weak)'
    : (VERBS.get(base) && regularForms(base).prt !== VERBS.get(base).prt) || source === 'derived' ? 'irregular (strong/mixed)' : 'regular (weak)';
  const auxWord = AUX_TEXT[row.aux];
  return {
    infinitive: inf,
    type: kind,
    separable,
    prefix,
    praesens_er: row.p3,
    praeteritum: row.prt,
    partizip2: row.p2,
    perfekt: `er/sie ${row.aux === 's' ? 'ist' : row.aux === 'h' ? 'hat' : 'ist/hat'} ${row.p2}`,
    auxiliary: auxWord,
    reflexive_meanings: REFLEXIVE_NOTES[base] || REFLEXIVE_NOTES[inf] || null,
    meaning: VERB_GLOSS[inf] || null,
    source,
    note: note || null,
  };
}

// ---------- Forms used for matching inside sentences ----------
const SPECIAL_FORMS = {
  sein: ['bin', 'bist', 'ist', 'sind', 'seid', 'war', 'warst', 'waren', 'wart', 'wäre', 'wärst', 'wären', 'gewesen', 'sein'],
  haben: ['habe', 'hast', 'hat', 'haben', 'habt', 'hatte', 'hattest', 'hatten', 'hattet', 'hätte', 'hättest', 'hätten', 'gehabt'],
  werden: ['werde', 'wirst', 'wird', 'werden', 'werdet', 'wurde', 'wurdest', 'wurden', 'würde', 'würdest', 'würden', 'geworden', 'worden'],
  wissen: ['weiß', 'weißt', 'wissen', 'wisst', 'wusste', 'wussten', 'wüsste', 'gewusst'],
  tun: ['tue', 'tust', 'tut', 'tun', 'tat', 'taten', 'getan'],
};

function finiteForms(inf) {
  const out = new Set(SPECIAL_FORMS[inf] || []);
  const row = VERBS.get(inf) || regularForms(inf);
  const stem = stemOf(inf);
  const p3 = row.p3.split(' ')[0];
  const prt = row.prt.split(' ')[0].split('/')[0];
  [inf, stem + 'e', stem + 'st', stem + 't', stem + 'et', stem + 'est', p3, p3.replace(/t$/, 'st'),
    prt, prt + 'st', prt + 'en', prt + 'n', prt + 't'].forEach((f) => out.add(f));
  if (['können', 'müssen', 'dürfen', 'mögen'].includes(inf)) {
    const k2 = { können: 'könnte', müssen: 'müsste', dürfen: 'dürfte', mögen: 'möchte' }[inf];
    [k2, k2 + 'st', k2 + 'n', k2 + 't', p3 + 'st'].forEach((f) => out.add(f));
  }
  return out;
}

// For a (possibly separable) verb: joined forms and split finite forms.
function matchForms(inf) {
  const info = verbInfo(inf);
  const prefix = info.separable === true ? info.prefix : null;
  const base = prefix ? inf.slice(prefix.length) : inf;
  const finite = finiteForms(base);
  const joined = new Set([inf, (prefix ? prefix + 'zu' + base : 'zu ' + inf), info.partizip2]);
  if (!prefix) finite.forEach((f) => joined.add(f));
  return { joined, finite, prefix };
}

// Reverse index: word form -> infinitive (table verbs only).
const FORM_INDEX = new Map();
for (const inf of VERBS.keys()) {
  const sep = VERBS.get(inf).p3.includes(' ');
  if (sep) continue;
  finiteForms(inf).forEach((f) => { if (!FORM_INDEX.has(f)) FORM_INDEX.set(f, { inf, kind: 'finite' }); });
  FORM_INDEX.set(VERBS.get(inf).p2, { inf, kind: 'partizip2' });
}
for (const f of ['sein', 'seine', 'seinen', 'seinem', 'seiner', 'seines', 'die', 'den', 'dem']) FORM_INDEX.delete(f);

// Partizip II of table verbs, for prefixed forms (begriffen = be + (ge)griffen).
const P2_INDEX = new Map();
for (const v of VERBS.values()) if (!v.p3.includes(' ')) P2_INDEX.set(v.p2, v.inf);

// A form of a prefixed verb whose base is in the table: begriffen → begreifen, angekommen → ankommen, verstand → verstehen.
function resolvePrefixed(lower) {
  const prefixes = [...INSEPARABLE, ...AMBIGUOUS, ...SEPARABLE].sort((a, b) => b.length - a.length);
  for (const p of prefixes) {
    if (!lower.startsWith(p) || lower.length < p.length + 3) continue;
    let rest = lower.slice(p.length);
    const separable = SEPARABLE.includes(p);
    if (separable && rest.startsWith('zu') && VERBS.has(rest.slice(2))) return { inf: p + rest.slice(2), kind: 'zu-infinitive' };
    if (VERBS.has(rest) && !VERBS.get(rest).p3.includes(' ')) return { inf: p + rest, kind: 'infinitive' };
    if (separable && P2_INDEX.has(rest)) return { inf: p + P2_INDEX.get(rest), kind: 'partizip2' };
    if (!separable && P2_INDEX.has('ge' + rest)) return { inf: p + P2_INDEX.get('ge' + rest), kind: 'partizip2' };
    const hit = FORM_INDEX.get(rest);
    if (hit && hit.kind === 'finite') return { inf: p + hit.inf, kind: 'finite' };
  }
  return null;
}

// ---------- Nouns ----------
// word|gender|plural ("-" = no plural in normal use)
const NOUN_ROWS = `
Heimat|die|-
Heimweh|das|-
Heimatland|das|Heimatländer
Zuhause|das|-
Herkunft|die|-
Sehnsucht|die|Sehnsüchte
Fremde|die|-
Ausland|das|-
Ausländer|der|Ausländer
Muttersprache|die|Muttersprachen
Wurzel|die|Wurzeln
Grenze|die|Grenzen
Satz|der|Sätze
Begriff|der|Begriffe
Wort|das|Wörter (single words) / Worte (sayings, spoken words)
Text|der|Texte
Kapitel|das|Kapitel
Thema|das|Themen
Bedeutung|die|Bedeutungen
Frage|die|Fragen
Antwort|die|Antworten
Sprache|die|Sprachen
Buch|das|Bücher
Geschichte|die|Geschichten
Erinnerung|die|Erinnerungen
Kindheit|die|Kindheiten
Erfahrung|die|Erfahrungen
Gefühl|das|Gefühle
Meinung|die|Meinungen
Idee|die|Ideen
Sinn|der|-
Grund|der|Gründe
Unterschied|der|Unterschiede
Möglichkeit|die|Möglichkeiten
Beispiel|das|Beispiele
Problem|das|Probleme
Ding|das|Dinge
Teil|der|Teile
Fall|der|Fälle
Seite|die|Seiten
Mal|das|Male
Ziel|das|Ziele
Weg|der|Wege
Ort|der|Orte
Raum|der|Räume
Zimmer|das|Zimmer
Haus|das|Häuser
Wohnung|die|Wohnungen
Tür|die|Türen
Fenster|das|Fenster
Tisch|der|Tische
Stuhl|der|Stühle
Bett|das|Betten
Straße|die|Straßen
Stadt|die|Städte
Dorf|das|Dörfer
Land|das|Länder
Welt|die|Welten
Erde|die|-
Himmel|der|Himmel
Sonne|die|Sonnen
Mond|der|Monde
Luft|die|-
Wasser|das|Wasser
Feuer|das|Feuer
Meer|das|Meere
Fluss|der|Flüsse
Berg|der|Berge
Baum|der|Bäume
Tier|das|Tiere
Hund|der|Hunde
Katze|die|Katzen
Zug|der|Züge
Bahnhof|der|Bahnhöfe
Auto|das|Autos
Reise|die|Reisen
Mensch|der|Menschen
Leute|die (plural only)|Leute
Eltern|die (plural only)|Eltern
Mann|der|Männer
Frau|die|Frauen
Kind|das|Kinder
Mutter|die|Mütter
Vater|der|Väter
Bruder|der|Brüder
Schwester|die|Schwestern
Familie|die|Familien
Freund|der|Freunde
Nachbar|der|Nachbarn
Name|der|Namen
Volk|das|Völker
Gesellschaft|die|Gesellschaften
Kultur|die|Kulturen
Gott|der|Götter
Hand|die|Hände
Kopf|der|Köpfe
Auge|das|Augen
Herz|das|Herzen
Gesicht|das|Gesichter
Leben|das|-
Tod|der|-
Zeit|die|Zeiten
Tag|der|Tage
Nacht|die|Nächte
Morgen|der|Morgen
Abend|der|Abende
Woche|die|Wochen
Monat|der|Monate
Jahr|das|Jahre
Stunde|die|Stunden
Minute|die|Minuten
Moment|der|Momente
Anfang|der|Anfänge
Ende|das|Enden
Zukunft|die|-
Vergangenheit|die|-
Gegenwart|die|-
Arbeit|die|Arbeiten
Schule|die|Schulen
Firma|die|Firmen
Stelle|die|Stellen
Geld|das|Gelder
Recht|das|Rechte
Kraft|die|Kräfte
Macht|die|Mächte
Krieg|der|Kriege
Frieden|der|-
Essen|das|-
Brot|das|Brote
Bild|das|Bilder
Lied|das|Lieder
Musik|die|-
Spiel|das|Spiele
Uhr|die|Uhren
Kurs|der|Kurse
Deutsch|das|-
Zeitung|die|Zeitungen
Brief|der|Briefe
Gedanke|der|Gedanken
Gedicht|das|Gedichte
Roman|der|Romane
Junge|der|Jungen
Käse|der|-
Mädchen|das|Mädchen
`;

const NOUNS = new Map();
for (const line of NOUN_ROWS.trim().split('\n')) {
  const [word, gender, plural] = line.split('|');
  NOUNS.set(word.toLowerCase(), { word, gender, plural: plural === '-' ? 'no plural in normal use' : plural });
}

// Suffix rules: [suffix, article, reliability]
const GENDER_RULES = [
  ['ung', 'die', 'always'], ['heit', 'die', 'always'], ['keit', 'die', 'always'], ['schaft', 'die', 'always'],
  ['ion', 'die', 'almost always'], ['tät', 'die', 'always'], ['ik', 'die', 'usually'], ['ie', 'die', 'usually'],
  ['ei', 'die', 'usually'], ['enz', 'die', 'always'], ['anz', 'die', 'always'], ['ur', 'die', 'usually'],
  ['chen', 'das', 'always'], ['lein', 'das', 'always'], ['ment', 'das', 'usually'], ['tum', 'das', 'usually (but der Irrtum, der Reichtum)'],
  ['um', 'das', 'usually'], ['nis', 'das', 'usually (but die Erlaubnis, die Kenntnis)'], ['ma', 'das', 'usually'],
  ['ling', 'der', 'always'], ['ismus', 'der', 'always'], ['ist', 'der', 'always (persons)'], ['or', 'der', 'usually'],
  ['ant', 'der', 'usually (persons)'], ['ig', 'der', 'usually'], ['ich', 'der', 'usually'],
  ['e', 'die', 'about 90% (but der Name, der Junge, das Auge, das Ende)'],
];

function nounInfo(raw) {
  const word = raw.trim().replace(/^(der|die|das)\s+/i, '');
  const key = word.toLowerCase();
  const hit = NOUNS.get(key);
  if (hit) return { noun: hit.word, gender: hit.gender, plural: hit.plural, source: 'table', meaning: NOUN_GLOSS[key] || null };
  // Compound noun: the last part decides the gender.
  for (let i = 1; i < key.length - 2; i++) {
    const tail = key.slice(i);
    const head = NOUNS.get(tail);
    if (head) {
      const first = word.slice(0, i);
      const plural = head.plural.startsWith('no plural') ? head.plural : first + head.plural.toLowerCase();
      return { noun: word, gender: head.gender, plural, source: 'compound', meaning: NOUN_GLOSS[tail] ? `(last part: ${NOUN_GLOSS[tail]})` : null, note: `Compound: the last part "${head.word}" decides the gender.` };
    }
  }
  if (/en$/.test(key) && word[0] === word[0].toUpperCase()) {
    const verb = key;
    if (VERBS.has(verb)) return { noun: word, gender: 'das', plural: 'no plural', source: 'rule', note: 'A verb used as a noun (das Lesen, das Leben) is always "das".' };
  }
  for (const [suffix, gender, reliability] of GENDER_RULES) {
    if (key.endsWith(suffix)) {
      return { noun: word, gender, plural: 'unknown: check the dictionary', source: 'rule', note: `Ending "-${suffix}" is ${gender} ${reliability}. Check the dictionary to be sure.` };
    }
  }
  return { noun: word, gender: 'unknown', plural: 'unknown', source: 'none', note: 'Not in the table and no ending rule fits: check the dictionary (long-press the word → Look Up).' };
}

// ---------- Fixed phrases ----------
// patterns: groups separated by " + "; a group is "V:verb" (any form) or "a|b|c" (any of these words).
const R = 'sich|mich|dich|uns|euch|mir|dir';
const PHRASES = [
  ['mit etwas zu tun haben', 'to have to do with something', 'mit + Dat', `zu + tun + V:haben + mit|damit|womit`],
  ['es geht um', 'it is about', 'um + Akk', `es + V:gehen + um|darum|worum|ums`],
  ['es handelt sich um', 'it is (a matter of) / we are dealing with', 'um + Akk', `${R} + V:handeln + um|darum|worum`],
  ['von etwas handeln', 'to be about (a book, a film)', 'von + Dat', `V:handeln + von|davon|wovon|vom`],
  ['es gibt', 'there is / there are', '+ Akk', `es + V:geben`],
  ['es kommt auf ... an', 'it depends on', 'auf + Akk', `V:ankommen + auf|darauf|worauf`],
  ['sich freuen auf', 'to look forward to', 'auf + Akk', `${R} + V:freuen + auf|darauf|worauf`],
  ['sich freuen über', 'to be glad about', 'über + Akk', `${R} + V:freuen + über|darüber|worüber`],
  ['warten auf', 'to wait for', 'auf + Akk', `V:warten + auf|darauf|worauf`],
  ['denken an', 'to think of', 'an + Akk', `V:denken + an|daran|woran`],
  ['sich erinnern an', 'to remember', 'an + Akk', `${R} + V:erinnern + an|daran|woran`],
  ['sich interessieren für', 'to be interested in', 'für + Akk', `${R} + V:interessieren + für|dafür|wofür`],
  ['sich kümmern um', 'to take care of', 'um + Akk', `${R} + V:kümmern + um|darum|worum`],
  ['Angst haben vor', 'to be afraid of', 'vor + Dat', `angst + V:haben + vor|davor|wovor`],
  ['sich fürchten vor', 'to be afraid of', 'vor + Dat', `${R} + V:fürchten + vor|davor|wovor`],
  ['teilnehmen an', 'to take part in', 'an + Dat', `V:teilnehmen + an|daran|woran|am`],
  ['abhängen von', 'to depend on', 'von + Dat', `V:abhängen + von|davon|wovon|vom`],
  ['bestehen aus', 'to consist of', 'aus + Dat', `V:bestehen + aus|daraus|woraus`],
  ['sich beschäftigen mit', 'to deal with / to study', 'mit + Dat', `${R} + V:beschäftigen + mit|damit|womit`],
  ['sich beschweren über', 'to complain about', 'über + Akk', `${R} + V:beschweren + über|darüber|worüber`],
  ['bitten um', 'to ask for', 'um + Akk', `V:bitten + um|darum|worum`],
  ['glauben an', 'to believe in', 'an + Akk', `V:glauben + an|daran|woran`],
  ['sich gewöhnen an', 'to get used to', 'an + Akk', `${R} + V:gewöhnen + an|daran|woran`],
  ['hoffen auf', 'to hope for', 'auf + Akk', `V:hoffen + auf|darauf|worauf`],
  ['sich verlassen auf', 'to rely on', 'auf + Akk', `${R} + V:verlassen + auf|darauf|worauf`],
  ['sich vorbereiten auf', 'to prepare for', 'auf + Akk', `${R} + V:vorbereiten + auf|darauf|worauf`],
  ['achten auf', 'to pay attention to', 'auf + Akk', `V:achten + auf|darauf|worauf`],
  ['sich entscheiden für', 'to decide on / choose', 'für + Akk', `${R} + V:entscheiden + für|dafür|wofür`],
  ['erzählen von', 'to tell about', 'von + Dat', `V:erzählen + von|davon|wovon|vom`],
  ['fragen nach', 'to ask about', 'nach + Dat', `V:fragen + nach|danach|wonach`],
  ['gehören zu', 'to be part of / belong to (a group)', 'zu + Dat', `V:gehören + zu|dazu|wozu|zum|zur`],
  ['leiden unter', 'to suffer from', 'unter + Dat', `V:leiden + unter|darunter|worunter`],
  ['nachdenken über', 'to think about / reflect on', 'über + Akk', `V:nachdenken + über|darüber|worüber`],
  ['sich sehnen nach', 'to long for', 'nach + Dat', `${R} + V:sehnen + nach|danach|wonach`],
  ['sorgen für', 'to take care of / to ensure', 'für + Akk', `V:sorgen + für|dafür|wofür`],
  ['träumen von', 'to dream of', 'von + Dat', `V:träumen + von|davon|wovon|vom`],
  ['sich unterhalten über', 'to talk about', 'über + Akk', `${R} + V:unterhalten + über|darüber|worüber`],
  ['sich verabschieden von', 'to say goodbye to', 'von + Dat', `${R} + V:verabschieden + von|davon|vom`],
  ['verzichten auf', 'to do without / give up', 'auf + Akk', `V:verzichten + auf|darauf|worauf`],
  ['zweifeln an', 'to doubt', 'an + Dat', `V:zweifeln + an|daran|woran`],
  ['sich ärgern über', 'to be annoyed about', 'über + Akk', `${R} + V:ärgern + über|darüber|worüber`],
  ['Lust haben auf', 'to feel like', 'auf + Akk', `lust + V:haben + auf|darauf|worauf`],
  ['Wert legen auf', 'to attach importance to', 'auf + Akk', `wert + V:legen + auf|darauf|worauf`],
  ['eine Rolle spielen', 'to play a role / to matter', '', `rolle + V:spielen`],
  ['in Frage kommen', 'to be an option', '', `frage + V:kommen + in`],
  ['zur Verfügung stehen', 'to be available', '', `verfügung + V:stehen`],
  ['in Kauf nehmen', 'to accept (a downside)', '', `kauf + V:nehmen`],
  ['zum Ausdruck bringen', 'to express', '', `ausdruck + V:bringen`],
  ['in Anspruch nehmen', 'to make use of / to take up (time)', '', `anspruch + V:nehmen`],
  ['Recht haben', 'to be right', '', `recht + V:haben`],
  ['sich Mühe geben', 'to make an effort', '', `mühe + V:geben`],
  ['ums Leben kommen', 'to die (in an accident)', '', `ums + leben + V:kommen`],
  ['jemandem schwer/leicht fallen', 'to be hard/easy for someone', 'Dat', `V:fallen + schwer|leicht`],
  ['zu Hause', 'at home', '', `zu + hause`],
  ['nach Hause', '(to) home, homewards', '', `nach + hause`],
  ['sich zu Hause fühlen', 'to feel at home', '', `${R} + V:fühlen + hause`],
  ['sich fremd fühlen', 'to feel like a stranger / out of place', '', `${R} + V:fühlen + fremd`],
  ['Heimweh haben', 'to be homesick', '', `heimweh`],
  ['Wurzeln schlagen', 'to put down roots / to settle in', '', `wurzeln + V:schlagen`],
  ['nur Bahnhof verstehen', 'not to understand a thing ("it is all Greek to me")', '', `bahnhof + V:verstehen`],
  ['die Daumen drücken', 'to keep one\'s fingers crossed', '', `daumen + V:drücken`],
  ['den Nagel auf den Kopf treffen', 'to hit the nail on the head', '', `nagel + kopf`],
  ['um den heißen Brei reden', 'to beat around the bush', '', `brei`],
  ['die Nase voll haben', 'to be fed up', '', `nase + voll + V:haben`],
  ['auf dem Holzweg sein', 'to be on the wrong track', '', `holzweg`],
  ['ins Fettnäpfchen treten', 'to put one\'s foot in it', '', `fettnäpfchen`],
  ['unter vier Augen', 'in private, one-to-one', '', `vier + augen + unter`],
  ['zwei Fliegen mit einer Klappe schlagen', 'to kill two birds with one stone', '', `fliegen + klappe`],
  ['Das ist nicht mein Bier', 'that is not my problem', '', `bier + nicht`],
  ['im Begriff sein, etwas zu tun', 'to be about to do something', 'zu + infinitive', `im + begriff + V:sein`],
  ['jemandem ein Begriff sein', 'to be familiar to someone, to ring a bell', 'Dat', `ein|kein + begriff + V:sein`],
  ['(k)einen Begriff haben von', 'to have (no) idea of something', 'von + Dat', `einen|keinen + begriff + V:haben`],
  ['schwer von Begriff sein', 'to be slow on the uptake', '', `schwer + von + begriff`],
  ['sowohl ... als auch', 'both ... and', 'two-part connector', `sowohl + als`],
  ['weder ... noch', 'neither ... nor', 'two-part connector', `weder + noch`],
  ['entweder ... oder', 'either ... or', 'two-part connector', `entweder + oder`],
  ['nicht nur ... sondern auch', 'not only ... but also', 'two-part connector', `nicht + nur + sondern`],
  ['je ... desto / umso', 'the more ... the more', 'two-part connector; verb at the end after "je"', `je + desto|umso`],
  ['zwar ... aber', 'admittedly ... but', 'two-part connector', `zwar + aber`],
  ['einerseits ... andererseits', 'on the one hand ... on the other hand', 'two-part connector', `einerseits + andererseits`],
  ['um ... zu', 'in order to', 'infinitive clause: "zu" + infinitive at the end', `um + zu`],
  ['ohne ... zu', 'without (doing)', 'infinitive clause', `ohne + zu`],
  ['(an)statt ... zu', 'instead of (doing)', 'infinitive clause', `anstatt|statt + zu`],
  ['als ob', 'as if', 'verb at the end, usually Konjunktiv II', `als + ob`],
].map(([phrase, meaning, grammar, pattern]) => ({
  phrase, meaning, grammar,
  groups: pattern.split(' + ').map((g) => g.startsWith('V:') ? { verb: g.slice(2) } : { words: new Set(g.split('|')) }),
}));

// One checked example per phrase: [German, English]. A test makes sure each example is found by its own pattern.
const PHRASE_EXAMPLES = {
  'mit etwas zu tun haben': ['Das hat nichts mit dir zu tun.', 'That has nothing to do with you.'],
  'es geht um': ['In dem Buch geht es um Heimat.', 'The book is about home.'],
  'es handelt sich um': ['Es handelt sich um ein Missverständnis.', 'It is a misunderstanding.'],
  'von etwas handeln': ['Der Roman handelt von einer Familie.', 'The novel is about a family.'],
  'es gibt': ['Es gibt hier keinen Bahnhof.', 'There is no station here.'],
  'es kommt auf ... an': ['Es kommt auf das Wetter an.', 'It depends on the weather.'],
  'sich freuen auf': ['Ich freue mich auf das Wochenende.', 'I am looking forward to the weekend.'],
  'sich freuen über': ['Sie freut sich über das Geschenk.', 'She is happy about the present.'],
  'warten auf': ['Wir warten auf den Zug.', 'We are waiting for the train.'],
  'denken an': ['Ich denke oft an meine Familie.', 'I often think of my family.'],
  'sich erinnern an': ['Erinnerst du dich an unsere Kindheit?', 'Do you remember our childhood?'],
  'sich interessieren für': ['Er interessiert sich für Geschichte.', 'He is interested in history.'],
  'sich kümmern um': ['Sie kümmert sich um ihre Mutter.', 'She takes care of her mother.'],
  'Angst haben vor': ['Das Kind hat Angst vor dem Hund.', 'The child is afraid of the dog.'],
  'sich fürchten vor': ['Viele fürchten sich vor der Zukunft.', 'Many people are afraid of the future.'],
  'teilnehmen an': ['Ich nehme an dem Kurs teil.', 'I am taking part in the course.'],
  'abhängen von': ['Das hängt vom Preis ab.', 'That depends on the price.'],
  'bestehen aus': ['Das Team besteht aus fünf Personen.', 'The team consists of five people.'],
  'sich beschäftigen mit': ['Ich beschäftige mich mit deutscher Literatur.', 'I am studying German literature.'],
  'sich beschweren über': ['Er beschwert sich über den Lärm.', 'He complains about the noise.'],
  'bitten um': ['Darf ich Sie um Hilfe bitten?', 'May I ask you for help?'],
  'glauben an': ['Sie glaubt an eine bessere Zukunft.', 'She believes in a better future.'],
  'sich gewöhnen an': ['Ich habe mich an das Wetter gewöhnt.', 'I have got used to the weather.'],
  'hoffen auf': ['Wir hoffen auf gutes Wetter.', 'We are hoping for good weather.'],
  'sich verlassen auf': ['Du kannst dich auf mich verlassen.', 'You can rely on me.'],
  'sich vorbereiten auf': ['Ich bereite mich auf die Prüfung vor.', 'I am preparing for the exam.'],
  'achten auf': ['Achte auf die Aussprache!', 'Pay attention to the pronunciation!'],
  'sich entscheiden für': ['Sie hat sich für das rote Kleid entschieden.', 'She chose the red dress.'],
  'erzählen von': ['Er erzählt von seiner Heimat.', 'He talks about his home country.'],
  'fragen nach': ['Sie fragt nach dem Weg.', 'She asks for the way.'],
  'gehören zu': ['Das gehört zu meinen Aufgaben.', 'That is part of my tasks.'],
  'leiden unter': ['Viele leiden unter Heimweh.', 'Many people suffer from homesickness.'],
  'nachdenken über': ['Ich denke über deine Frage nach.', 'I am thinking about your question.'],
  'sich sehnen nach': ['Er sehnt sich nach seiner Heimat.', 'He longs for his home.'],
  'sorgen für': ['Die Eltern sorgen für ihre Kinder.', 'The parents look after their children.'],
  'träumen von': ['Sie träumt von einer Reise nach Japan.', 'She dreams of a trip to Japan.'],
  'sich unterhalten über': ['Wir unterhalten uns über das Buch.', 'We are talking about the book.'],
  'sich verabschieden von': ['Ich verabschiede mich von meinen Freunden.', 'I say goodbye to my friends.'],
  'verzichten auf': ['Ich verzichte heute auf Zucker.', 'I am doing without sugar today.'],
  'zweifeln an': ['Er zweifelt an seiner Entscheidung.', 'He doubts his decision.'],
  'sich ärgern über': ['Ich ärgere mich über den Fehler.', 'I am annoyed about the mistake.'],
  'Lust haben auf': ['Hast du Lust auf einen Kaffee?', 'Do you feel like a coffee?'],
  'Wert legen auf': ['Sie legt großen Wert auf Pünktlichkeit.', 'She attaches great importance to punctuality.'],
  'eine Rolle spielen': ['Das Geld spielt keine Rolle.', 'Money does not matter.'],
  'in Frage kommen': ['Das kommt nicht in Frage.', 'That is out of the question.'],
  'zur Verfügung stehen': ['Ich stehe Ihnen gern zur Verfügung.', 'I am happy to help you.'],
  'in Kauf nehmen': ['Wir nehmen die lange Reise in Kauf.', 'We accept the long journey.'],
  'zum Ausdruck bringen': ['Das Gedicht bringt die Sehnsucht zum Ausdruck.', 'The poem expresses the longing.'],
  'in Anspruch nehmen': ['Das nimmt viel Zeit in Anspruch.', 'That takes up a lot of time.'],
  'Recht haben': ['Du hast recht.', 'You are right.'],
  'sich Mühe geben': ['Er gibt sich viel Mühe.', 'He makes a big effort.'],
  'ums Leben kommen': ['Bei dem Unfall kam niemand ums Leben.', 'Nobody died in the accident.'],
  'jemandem schwer/leicht fallen': ['Deutsch fällt mir nicht leicht.', 'German is not easy for me.'],
  'zu Hause': ['Ich bin heute zu Hause.', 'I am at home today.'],
  'nach Hause': ['Ich gehe jetzt nach Hause.', 'I am going home now.'],
  'sich zu Hause fühlen': ['In Berlin fühle ich mich zu Hause.', 'I feel at home in Berlin.'],
  'sich fremd fühlen': ['Am Anfang fühlte sie sich fremd.', 'At first she felt like a stranger.'],
  'Heimweh haben': ['Im Winter habe ich oft Heimweh.', 'In winter I am often homesick.'],
  'Wurzeln schlagen': ['Nach zehn Jahren hat er hier Wurzeln geschlagen.', 'After ten years he has put down roots here.'],
  'nur Bahnhof verstehen': ['Bei Physik verstehe ich nur Bahnhof.', 'Physics is all Greek to me.'],
  'die Daumen drücken': ['Ich drücke dir die Daumen!', 'I will keep my fingers crossed for you!'],
  'den Nagel auf den Kopf treffen': ['Mit diesem Satz hast du den Nagel auf den Kopf getroffen.', 'With that sentence you hit the nail on the head.'],
  'um den heißen Brei reden': ['Red nicht um den heißen Brei!', 'Stop beating around the bush!'],
  'die Nase voll haben': ['Ich habe die Nase voll vom Regen.', 'I am fed up with the rain.'],
  'auf dem Holzweg sein': ['Da bist du auf dem Holzweg.', 'You are on the wrong track there.'],
  'ins Fettnäpfchen treten': ['Mit der Frage bin ich ins Fettnäpfchen getreten.', 'I put my foot in it with that question.'],
  'unter vier Augen': ['Können wir unter vier Augen sprechen?', 'Can we talk in private?'],
  'zwei Fliegen mit einer Klappe schlagen': ['So schlagen wir zwei Fliegen mit einer Klappe.', 'That way we kill two birds with one stone.'],
  'Das ist nicht mein Bier': ['Wie er das macht, ist nicht mein Bier.', 'How he does it is not my problem.'],
  'im Begriff sein, etwas zu tun': ['Ich war gerade im Begriff zu gehen.', 'I was just about to leave.'],
  'jemandem ein Begriff sein': ['Der Name ist mir ein Begriff.', 'The name rings a bell.'],
  '(k)einen Begriff haben von': ['Du hast keinen Begriff davon, wie schwer das ist.', 'You have no idea how hard that is.'],
  'schwer von Begriff sein': ['Heute bin ich etwas schwer von Begriff.', 'I am a bit slow on the uptake today.'],
  'sowohl ... als auch': ['Sie spricht sowohl Deutsch als auch Englisch.', 'She speaks both German and English.'],
  'weder ... noch': ['Ich habe weder Zeit noch Geld.', 'I have neither time nor money.'],
  'entweder ... oder': ['Entweder kommst du mit, oder du bleibst hier.', 'Either you come along, or you stay here.'],
  'nicht nur ... sondern auch': ['Er ist nicht nur klug, sondern auch nett.', 'He is not only clever but also kind.'],
  'je ... desto / umso': ['Je mehr ich lese, desto besser verstehe ich.', 'The more I read, the better I understand.'],
  'zwar ... aber': ['Das Buch ist zwar lang, aber spannend.', 'The book is long, admittedly, but exciting.'],
  'einerseits ... andererseits': ['Einerseits vermisse ich meine Heimat, andererseits gefällt es mir hier.', 'On the one hand I miss home, on the other hand I like it here.'],
  'um ... zu': ['Ich lerne Deutsch, um in Deutschland zu arbeiten.', 'I am learning German in order to work in Germany.'],
  'ohne ... zu': ['Er ging, ohne ein Wort zu sagen.', 'He left without saying a word.'],
  '(an)statt ... zu': ['Statt zu lernen, sieht er fern.', 'Instead of studying, he watches TV.'],
  'als ob': ['Er tut so, als ob er nichts wüsste.', 'He acts as if he knew nothing.'],
};

const MATCH_CACHE = new Map();
function verbMatcher(inf) {
  if (!MATCH_CACHE.has(inf)) MATCH_CACHE.set(inf, matchForms(inf));
  return MATCH_CACHE.get(inf);
}

function groupHit(group, tokenSet) {
  if (group.words) return [...group.words].some((w) => tokenSet.has(w));
  const m = verbMatcher(group.verb);
  for (const t of tokenSet) {
    if (m.joined.has(t)) return true;
    if (m.finite.has(t) && (!m.prefix || tokenSet.has(m.prefix))) return true;
  }
  return false;
}

function findPhrases(sentence) {
  const tokenSet = new Set(tokenize(sentence).map((t) => t.toLowerCase()));
  return PHRASES.filter((p) => p.groups.every((g) => groupHit(g, tokenSet)))
    .map(({ phrase, meaning, grammar }) => ({ phrase, meaning, grammar: grammar || null, example: PHRASE_EXAMPLES[phrase] || null }));
}

// ---------- Sentence structure ----------
const SUBORDINATORS = new Set(['dass', 'weil', 'ob', 'wenn', 'als', 'obwohl', 'obgleich', 'damit', 'nachdem', 'bevor', 'ehe',
  'während', 'seit', 'seitdem', 'sodass', 'falls', 'indem', 'da', 'bis', 'sobald', 'solange', 'sooft', 'wie', 'wo', 'was', 'wer',
  'wen', 'wem', 'warum', 'wieso', 'weshalb', 'wann', 'woher', 'wohin', 'womit', 'wofür', 'worüber', 'wovon', 'woran', 'worauf']);
const RELATIVES = new Set(['der', 'die', 'das', 'dem', 'den', 'deren', 'dessen', 'denen', 'welcher', 'welche', 'welches', 'welchem', 'welchen']);
const PREPOSITIONS = new Set(['in', 'an', 'auf', 'mit', 'von', 'zu', 'für', 'über', 'unter', 'aus', 'bei', 'nach', 'vor', 'um', 'durch', 'ohne', 'gegen']);
const SEP_PARTICLES = new Set(SEPARABLE);

function tokenize(text) {
  return (text.match(/[A-Za-zÄÖÜäöüß]+/g) || []);
}

function looksLikePartizip(t) {
  return /^ge[a-zäöüß]{2,}(t|en)$/.test(t) || /iert$/.test(t) || [...VERBS.values()].some((v) => v.p2 === t);
}

function analyzeClause(words, index, prev) {
  const lower = words.map((w) => w.toLowerCase());
  const first = lower[0];
  const second = lower[1];
  const out = { text: words.join(' ') };
  let startIdx = 0;
  if (PREPOSITIONS.has(first) && RELATIVES.has(second) && index > 0) startIdx = 1;
  const opener = lower[startIdx];
  if (index > 0 && SUBORDINATORS.has(opener)) {
    out.type = 'subordinate clause';
    out.starts_with = words[startIdx];
    out.verb_position = `the conjugated verb goes to the END of this clause: "${words[words.length - 1]}"`;
  } else if (index > 0 && RELATIVES.has(opener) && prev && /^[A-ZÄÖÜ]/.test(prev[prev.length - 1]) && prev.length > 1) {
    out.type = 'relative clause (probably)';
    out.starts_with = words.slice(0, startIdx + 1).join(' ');
    out.verb_position = `the conjugated verb goes to the END: "${words[words.length - 1]}"`;
  } else if (index > 0 && lower[lower.length - 2] === 'zu'
    && (['um', 'ohne', 'statt', 'anstatt'].includes(first) || !lower.slice(0, -2).some((t) => { const h = FORM_INDEX.get(t); return h && h.kind === 'finite'; }))) {
    out.type = 'infinitive clause';
    out.verb_position = `"zu" + infinitive at the end: "zu ${words[words.length - 1]}"`;
  } else {
    out.type = index === 0 && words[words.length - 1] && /\?$/.test(words[words.length - 1]) ? 'question' : 'main clause';
    const finite = words.slice(1).find((w) => { const h = FORM_INDEX.get(w.toLowerCase()); return h && h.kind === 'finite'; });
    if (words.length > 1) out.verb_position = finite
      ? `the conjugated verb "${finite}" is in position 2 (the second element; an element can be several words)`
      : 'the conjugated verb is the second element (an element can be several words, e.g. "Der Zug")';
  }
  const last = lower[lower.length - 1];
  if (out.type === 'main clause' && SEP_PARTICLES.has(last) && words.length > 2) {
    const verbHit = lower.slice(0, -1).map((t) => FORM_INDEX.get(t)).find((h) => h && h.kind === 'finite');
    out.separable_verb = verbHit
      ? `"${last}" at the end belongs to "${verbHit.inf}" → separable verb "${last}${verbHit.inf}"`
      : `"${last}" at the end is a separable prefix: it belongs to the conjugated verb (position 2) → look up "${last}" + that verb's infinitive`;
  }
  const hints = [];
  const has = (forms) => lower.some((t) => forms.includes(t));
  const partizip = lower.find((t) => looksLikePartizip(t));
  if (partizip && has(['habe', 'hast', 'hat', 'haben', 'habt', 'bin', 'bist', 'ist', 'sind', 'seid'])) hints.push(`Perfekt (haben/sein + Partizip II "${partizip}")`);
  if (partizip && has(['hatte', 'hattest', 'hatten', 'hattet', 'war', 'warst', 'waren', 'wart'])) hints.push(`Plusquamperfekt (hatte/war + Partizip II "${partizip}")`);
  if (partizip && has(['werde', 'wirst', 'wird', 'werden', 'werdet', 'wurde', 'wurden'])) hints.push(`Passiv (werden + Partizip II "${partizip}")`);
  if (partizip && has(['hätte', 'hätten', 'wäre', 'wären'])) hints.push(`Konjunktiv II Vergangenheit (hätte/wäre + Partizip II "${partizip}")`);
  if (!partizip && has(['würde', 'würdest', 'würden'])) hints.push('Konjunktiv II (würde + infinitive)');
  if (!partizip && has(['werde', 'wirst', 'wird', 'werden', 'werdet']) && /en$/.test(last)) hints.push('Futur I (werden + infinitive), or Präsens of "werden"');
  if (has(['hätte', 'hätten', 'wäre', 'wären', 'könnte', 'könnten', 'müsste', 'dürfte', 'möchte', 'möchten', 'sollte', 'wollte']) && !partizip) hints.push('Konjunktiv II form present (hätte/wäre/könnte...): polite, hypothetical or wish — unless sollte/wollte is plain Präteritum');
  if (hints.length) out.tense_hints = hints;
  return out;
}

function analyzeSentence(sentence) {
  const clauses = sentence.split(/[,;:.!?–]+/).map((c) => tokenize(c)).filter((w) => w.length);
  const tokens = tokenize(sentence);
  const verbs = [];
  const seen = new Set();
  for (const t of tokens) {
    const low = t.toLowerCase();
    let hit = FORM_INDEX.get(low);
    let inf = hit && hit.inf;
    if (!hit && /^[a-zäöü]/.test(t)) {
      const pre = resolvePrefixed(low);
      if (pre) { hit = { inf: pre.inf, kind: pre.kind }; inf = pre.inf; }
    }
    if (hit && !seen.has(inf)) {
      seen.add(inf);
      const info = verbInfo(inf);
      verbs.push({ form_in_sentence: t, infinitive: info.infinitive, praeteritum: info.praeteritum, partizip2: info.partizip2, auxiliary: info.auxiliary });
    }
  }
  return {
    clauses: clauses.map((c, i) => analyzeClause(c, i, clauses[i - 1])),
    fixed_phrases: findPhrases(sentence),
    irregular_verbs: verbs,
    note: 'These facts come from an offline rule table. Use them; do not contradict them. Verbs not listed may be regular or not in the table.',
  };
}

// ---------- Typos: closest known word ----------
function editDistance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return d[a.length][b.length];
}

function closestKnown(word) {
  const w = word.toLowerCase();
  const max = w.length <= 4 ? 1 : 2;
  let best = null;
  const consider = (cand, kind) => {
    const dist = editDistance(w, cand.toLowerCase());
    if (dist > 0 && dist <= max && (!best || dist < best.dist)) best = { word: cand, kind, dist };
  };
  for (const n of NOUNS.values()) consider(n.word, 'noun');
  for (const v of VERBS.keys()) consider(v, 'verb');
  return best;
}

const SKIP_WORDS = new Set(['der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer', 'eines', 'sich', 'etwas', 'jemanden', 'jemandem']);
const BASIC_WORDS = new Set(['haben', 'sein', 'werden', 'machen', 'tun', 'gehen', 'kommen']);

function singleWordInfo(raw) {
  const w = raw.trim().replace(/^sich\s+/i, '');
  const lower = w.toLowerCase();
  const isNounLike = /^(der|die|das)\s/i.test(raw.trim()) || (w[0] === w[0].toUpperCase() && w[0] !== w[0].toLowerCase());
  if (!isNounLike) {
    if (VERBS.has(lower)) return { kind: 'verb', ...verbInfo(lower) };
    const hit = FORM_INDEX.get(lower);
    if (hit) return { kind: 'verb', form_given: w, ...verbInfo(hit.inf) };
    const pre = resolvePrefixed(lower);
    if (pre) return { kind: 'verb', form_given: w, form_kind: pre.kind, ...verbInfo(pre.inf) };
    const near = closestKnown(lower);
    if (near && near.dist === 1) return { did_you_mean: near.word, typed: w, ...singleWordInfo(near.kind === 'noun' ? near.word : near.word) };
    if (/(en|ern|eln|n)$/.test(lower)) return { kind: 'verb', ...verbInfo(lower) };
    return { kind: 'unknown', word: w, note: 'Not a verb in the table. If it is a noun, send it with a capital letter. Otherwise check the dictionary.' };
  }
  const info = nounInfo(w);
  if (info.source === 'none' || info.source === 'rule') {
    const near = closestKnown(w.replace(/^(der|die|das)\s+/i, ''));
    if (near && (info.source === 'none' || near.dist === 1)) return { did_you_mean: near.word, typed: w, ...singleWordInfo(near.word) };
  }
  return { kind: 'noun', ...info };
}

// One word, or several ("Begriff haben", "einen Begriff haben"): each content word, plus any fixed phrase.
function wordInfo(raw) {
  const text = String(raw || '').trim();
  const words = tokenize(text).filter((t) => !SKIP_WORDS.has(t.toLowerCase()) && !(PREPOSITIONS.has(t.toLowerCase()) && t === t.toLowerCase()));
  if (tokenize(text).filter((t) => !SKIP_WORDS.has(t.toLowerCase())).length <= 1 && !findPhrases(text).length) return singleWordInfo(text);
  const content = words.filter((t) => !BASIC_WORDS.has(t.toLowerCase()));
  return {
    kind: 'multi',
    text,
    phrases: findPhrases(text),
    parts: (content.length ? content : words).map((t) => singleWordInfo(t)).filter((p) => p.kind !== 'unknown'),
  };
}

// ---------- Plain-text output for the small model ----------
function formatSentence(sentence) {
  const a = analyzeSentence(sentence);
  const lines = ['CLAUSES:'];
  for (const c of a.clauses) {
    let line = `- "${c.text}": ${c.type}`;
    if (c.starts_with) line += ` (starts with "${c.starts_with}")`;
    if (c.verb_position) line += `; ${c.verb_position}`;
    if (c.separable_verb) line += `; ${c.separable_verb}`;
    if (c.tense_hints) line += `; tense: ${c.tense_hints.join(' / ')}`;
    lines.push(line);
  }
  lines.push('FIXED PHRASES:');
  if (a.fixed_phrases.length) a.fixed_phrases.forEach((p) => lines.push(`- ${p.phrase} = ${p.meaning}${p.grammar ? ` (${p.grammar})` : ''}${p.example ? `. Beispiel: ${p.example[0]} (${p.example[1]})` : ''}`));
  else lines.push('- none found in the offline list (there may still be one: say "(unsure)")');
  lines.push('IRREGULAR VERBS:');
  if (a.irregular_verbs.length) a.irregular_verbs.forEach((v) => lines.push(`- ${v.form_in_sentence} → ${v.infinitive} (Präteritum ${v.praeteritum}, Partizip II ${v.partizip2}, Perfekt with ${v.auxiliary})`));
  else lines.push('- none from the table');
  lines.push('These facts are correct. Use them and do not contradict them.');
  return lines.join('\n');
}

function formatOne(w) {
  const sure = w.source === 'table' ? 'certain' : w.source === 'none' ? 'unknown' : 'rule-based, say "(check)"';
  const lines = [];
  if (w.did_you_mean) lines.push(`TYPO: the learner wrote "${w.typed}", they mean "${w.did_you_mean}". Say "Meintest du: ${w.did_you_mean}?" first.`);
  if (w.kind === 'verb') {
    lines.push(
      `VERB: ${w.infinitive} (${w.type}; ${sure})`,
      `er/sie: ${w.praesens_er} | Präteritum: ${w.praeteritum} | Partizip II: ${w.partizip2} | Perfekt: ${w.perfekt}`,
      `separable: ${w.separable === true ? `yes, prefix "${w.prefix}"` : w.separable === false ? 'no' : w.separable}`,
    );
    if (w.reflexive_meanings) lines.push(`with/without "sich": ${w.reflexive_meanings}`);
    if (w.form_given && w.form_given.toLowerCase() !== w.infinitive) lines.push(`"${w.form_given}" is a form of "${w.infinitive}"${w.form_kind === 'partizip2' ? ' (Partizip II, used in the Perfekt: hat/ist + Partizip II)' : ''}`);
    lines.push(w.meaning ? `meaning: ${w.meaning}` : 'meaning: not in the tables, give it from your own knowledge');
  } else if (w.kind === 'noun') {
    lines.push(`NOUN: ${w.gender} ${w.noun} (${sure})`, `plural: ${w.plural}`);
    lines.push(w.meaning ? `meaning: ${w.meaning}` : 'meaning: not in the tables, give it from your own knowledge');
    const key = String(w.noun).toLowerCase();
    PHRASES.filter((p) => p.groups.some((g) => g.words && g.words.has(key))).forEach((p) => {
      const ex = PHRASE_EXAMPLES[p.phrase];
      lines.push(`PHRASE WITH THIS WORD: ${p.phrase} = ${p.meaning}${ex ? `. Beispiel: ${ex[0]} (${ex[1]})` : ''}`);
    });
  } else {
    lines.push(`UNKNOWN: ${w.word}`);
  }
  if (w.note) lines.push(`note: ${w.note}`);
  return lines.join('\n');
}

function formatWord(word) {
  const w = wordInfo(word);
  if (w.kind !== 'multi') return formatOne(w);
  const lines = [`SEVERAL WORDS: "${w.text}"`];
  if (w.phrases.length) w.phrases.forEach((p) => lines.push(`FIXED PHRASE: ${p.phrase} = ${p.meaning}${p.grammar ? ` (${p.grammar})` : ''}${p.example ? `. Beispiel: ${p.example[0]} (${p.example[1]})` : ''}`));
  w.parts.forEach((part) => lines.push(formatOne(part)));
  return lines.join('\n');
}

export { VERB_GLOSS, NOUN_GLOSS, resolvePrefixed, PHRASE_EXAMPLES, editDistance, closestKnown, verbInfo, nounInfo, wordInfo, findPhrases, analyzeSentence, formatSentence, formatWord, tokenize, VERBS, PHRASES };
