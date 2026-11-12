// Spielmodul "Gravitationsgesetz" (Physik 11): F_G = G*m1*m2/r², und daraus
// abgeleitet (Gravitationskraft = Zentripetalkraft) die Bahngeschwindigkeit
// v = sqrt(G*M/r) und die Umlaufdauer T = 2*pi*sqrt(r³/(G*M)) von Monden,
// Satelliten und Planeten.
//
// Alle Hilfsnamen hier sind mit "grav" praefigiert bzw. eindeutig gewaehlt,
// damit sie sich NICHT mit gleich benannten Hilfsfunktionen in anderen
// module-*.js-Dateien ueberschneiden (alle Skripte teilen sich einen
// globalen Gueltigkeitsbereich fuer Top-Level function/const).

window.Game = window.Game || {};
Game.modules = Game.modules || {};

const G_GRAV = 6.674e-11; // Gravitationskonstante in N*m^2/kg^2

// --- Zahlen in wissenschaftlicher Schreibweise formatieren (z.B. 5,97 x 10^24) ---

const GRAV_SUPERSCRIPTS = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };

function gravToSuperscript(n) {
  return String(n)
    .split("")
    .map((ch) => GRAV_SUPERSCRIPTS[ch] || ch)
    .join("");
}

function formatSci(value) {
  if (value === 0) return "0";
  let exponent = Math.floor(Math.log10(Math.abs(value)));
  let mantissa = Math.round((value / 10 ** exponent) * 100) / 100;
  if (Math.abs(mantissa) >= 10) {
    mantissa /= 10;
    exponent += 1;
  }
  return `${formatNum(mantissa)} × 10${gravToSuperscript(exponent)}`;
}

function buildGravOptions(correctValue, distractors, unit) {
  const opts = Game.Questions.buildOptionsFromCandidates(correctValue, 2, distractors);
  return opts.map((o) => ({ value: `${formatNum(o.value)} ${unit}`, correct: o.correct }));
}

function finalizeGravQuestion(item, mode) {
  const question = {
    kind: "code",
    mode,
    prompt: item.prompt,
    code: item.code || null,
    correctValue: item.correctValue,
    unit: item.unit,
  };
  if (mode === "mc") {
    question.options = buildGravOptions(item.correctValue, item.distractors, item.unit);
  }
  return question;
}

function gravPickPoolItem(pool) {
  const item = Game.Questions.pickRandom(pool);
  return { prompt: item.prompt, code: null, options: Game.Questions.shuffle(item.options) };
}

// --- Thema 1: Das Gravitationsgesetz F_G = G*m1*m2/r² ---
// Ergebnis in Mikronewton (µN), da F_G bei Alltagsmassen extrem klein ist.

function genGravitationsgesetz() {
  const m1 = Game.Questions.randomDecimal(200, 2000, 0);
  const m2 = Game.Questions.randomDecimal(200, 2000, 0);
  const r = Game.Questions.randomDecimal(1, 5, 1);
  const correctValue = (G_GRAV * m1 * m2 * 1e6) / (r * r);
  return {
    prompt: "Wie groß ist die Gravitationskraft F_G zwischen den beiden Massen?",
    code: `Gegeben:\nm₁ = ${formatNum(m1)} kg\nm₂ = ${formatNum(m2)} kg\nr = ${formatNum(r)} m`,
    correctValue,
    unit: "µN",
    distractors: [
      (G_GRAV * m1 * m2 * 1e6) / r,
      G_GRAV * m1 * m2 * r * r * 1e6,
      (G_GRAV * (m1 + m2) * 1e6) / (r * r),
    ],
  };
}

const gravEinflussPool = [
  {
    prompt: "Der Abstand zwischen zwei Massen wird verdoppelt (m₁, m₂ bleiben gleich). Wie ändert sich F_G?",
    options: [
      { value: "Sie viertelt sich", correct: true },
      { value: "Sie halbiert sich", correct: false },
      { value: "Sie bleibt gleich", correct: false },
      { value: "Sie verdoppelt sich", correct: false },
    ],
  },
  {
    prompt: "Der Abstand zwischen zwei Massen wird verdreifacht (m₁, m₂ bleiben gleich). Wie ändert sich F_G?",
    options: [
      { value: "Sie neuntelt sich", correct: true },
      { value: "Sie drittelt sich", correct: false },
      { value: "Sie bleibt gleich", correct: false },
      { value: "Sie verdreifacht sich", correct: false },
    ],
  },
  {
    prompt: "Eine der beiden Massen wird verdoppelt (r bleibt gleich). Wie ändert sich F_G?",
    options: [
      { value: "Sie verdoppelt sich", correct: true },
      { value: "Sie vervierfacht sich", correct: false },
      { value: "Sie bleibt gleich", correct: false },
      { value: "Sie halbiert sich", correct: false },
    ],
  },
  {
    prompt: "Beide Massen werden verdoppelt (r bleibt gleich). Wie ändert sich F_G?",
    options: [
      { value: "Sie vervierfacht sich", correct: true },
      { value: "Sie verdoppelt sich", correct: false },
      { value: "Sie bleibt gleich", correct: false },
      { value: "Sie verachtfacht sich", correct: false },
    ],
  },
  {
    prompt: "Mit welchem Exponenten geht der Abstand r in das Gravitationsgesetz F_G = G·m₁·m₂/r² ein?",
    options: [
      { value: "2 (quadratisch, im Nenner)", correct: true },
      { value: "1 (linear, im Nenner)", correct: false },
      { value: "2 (quadratisch, im Zähler)", correct: false },
      { value: "r kommt gar nicht vor", correct: false },
    ],
  },
  {
    prompt: "Warum ist die Gravitationskraft zwischen zwei Gegenständen im Alltag (z.B. zwei Büchern) nicht spürbar?",
    options: [
      { value: "Weil die Gravitationskonstante G extrem klein ist und die Massen im Alltag gering sind", correct: true },
      { value: "Weil Gravitation nur zwischen Himmelskörpern wirkt", correct: false },
      { value: "Weil sich die Kräfte gegenseitig aufheben", correct: false },
      { value: "Weil Luft die Gravitation abschirmt", correct: false },
    ],
  },
];

// --- Thema 2 & 3: Monde, Satelliten, Planeten auf (angenommener) Kreisbahn ---
// Gravitationskraft = Zentripetalkraft: G*M*m/r² = m*v²/r  bzw. = m*(2π/T)²*r

const gravSzenarien = [
  { label: "der Mond um die Erde", M: 5.972e24, r: 3.844e8, periodUnit: "Tage", periodDivisor: 86400 },
  { label: "die ISS um die Erde", M: 5.972e24, r: 6.771e6, periodUnit: "h", periodDivisor: 3600 },
  { label: "ein geostationärer Satellit um die Erde", M: 5.972e24, r: 4.2164e7, periodUnit: "h", periodDivisor: 3600 },
  { label: "ein GPS-Satellit um die Erde", M: 5.972e24, r: 2.656e7, periodUnit: "h", periodDivisor: 3600 },
  { label: "Merkur um die Sonne", M: 1.989e30, r: 5.79e10, periodUnit: "Tage", periodDivisor: 86400 },
  { label: "Venus um die Sonne", M: 1.989e30, r: 1.082e11, periodUnit: "Tage", periodDivisor: 86400 },
  { label: "die Erde um die Sonne", M: 1.989e30, r: 1.496e11, periodUnit: "Tage", periodDivisor: 86400 },
  { label: "Mars um die Sonne", M: 1.989e30, r: 2.279e11, periodUnit: "Tage", periodDivisor: 86400 },
  { label: "Phobos um den Mars", M: 6.417e23, r: 9.376e6, periodUnit: "h", periodDivisor: 3600 },
];

function genBahngeschwindigkeit() {
  const s = Game.Questions.pickRandom(gravSzenarien);
  const vMs = Math.sqrt((G_GRAV * s.M) / s.r);
  const correctValue = vMs / 1000;
  return {
    prompt: `Mit welcher Bahngeschwindigkeit bewegt sich ${s.label} (bei angenommener Kreisbahn)?`,
    code: `Gegeben:\nM = ${formatSci(s.M)} kg\nr = ${formatSci(s.r)} m`,
    correctValue,
    unit: "km/s",
    distractors: [
      (G_GRAV * s.M) / s.r / 1000,
      Math.sqrt((G_GRAV * s.M) / (s.r * s.r)) / 1000,
      Math.sqrt(s.M / s.r) / 1000,
    ],
  };
}

function genUmlaufdauer() {
  const s = Game.Questions.pickRandom(gravSzenarien);
  const tSeconds = 2 * Math.PI * Math.sqrt(s.r ** 3 / (G_GRAV * s.M));
  const correctValue = tSeconds / s.periodDivisor;
  return {
    prompt: `Wie lange dauert ein Umlauf von ${s.label} (bei angenommener Kreisbahn)?`,
    code: `Gegeben:\nM = ${formatSci(s.M)} kg\nr = ${formatSci(s.r)} m`,
    correctValue,
    unit: s.periodUnit,
    distractors: [
      Math.sqrt(s.r ** 3 / (G_GRAV * s.M)) / s.periodDivisor,
      (2 * Math.PI * Math.sqrt((s.r * s.r) / (G_GRAV * s.M))) / s.periodDivisor,
      (2 * Math.PI * Math.sqrt((G_GRAV * s.M) / s.r ** 3)) / s.periodDivisor,
    ],
  };
}

const gravGeschwindigkeitKonzeptPool = [
  {
    prompt: "Warum fühlen sich Astronauten auf der ISS schwerelos, obwohl die Erdanziehung dort fast genauso groß ist wie am Boden?",
    options: [
      { value: "Weil die Gravitationskraft vollständig als Zentripetalkraft für die Kreisbahn wirkt (freier Fall auf der Bahn)", correct: true },
      { value: "Weil es im Weltraum keine Gravitation gibt", correct: false },
      { value: "Weil die ISS sich außerhalb des Einflussbereichs der Erde befindet", correct: false },
      { value: "Weil die Fliehkraft größer ist als die Gravitationskraft", correct: false },
    ],
  },
  {
    prompt: "Was passiert mit der nötigen Bahngeschwindigkeit, wenn ein Satellit auf einer größeren Kreisbahn (größeres r) um dieselbe Masse M fliegen soll?",
    options: [
      { value: "Sie wird kleiner", correct: true },
      { value: "Sie wird größer", correct: false },
      { value: "Sie bleibt gleich", correct: false },
      { value: "Das hängt nur von der Satellitenmasse ab", correct: false },
    ],
  },
];

const gravUmlaufdauerKonzeptPool = [
  {
    prompt: "Was ist das Besondere an der Umlaufdauer eines geostationären Satelliten?",
    options: [
      { value: "Sie entspricht genau einem Erdtag, der Satellit steht scheinbar fest über einem Punkt der Erde", correct: true },
      { value: "Sie ist unabhängig vom Bahnradius", correct: false },
      { value: "Sie ist immer kürzer als die eines Mondes", correct: false },
      { value: "Sie ist zufällig und nicht berechenbar", correct: false },
    ],
  },
  {
    prompt: "Ein Planet ist weiter von der Sonne entfernt als die Erde. Wie verhält sich seine Umlaufdauer im Vergleich zur Erde (3. Kepler'sches Gesetz: T² ~ r³)?",
    options: [
      { value: "Sie ist länger", correct: true },
      { value: "Sie ist kürzer", correct: false },
      { value: "Sie ist genauso lang", correct: false },
      { value: "Das lässt sich daraus nicht bestimmen", correct: false },
    ],
  },
];

const gravGeschwindigkeitGeneratoren = [genBahngeschwindigkeit, genBahngeschwindigkeit, genBahngeschwindigkeit, () => ({ pool: gravPickPoolItem(gravGeschwindigkeitKonzeptPool) })];
const gravUmlaufdauerGeneratoren = [genUmlaufdauer, genUmlaufdauer, genUmlaufdauer, () => ({ pool: gravPickPoolItem(gravUmlaufdauerKonzeptPool) })];
const gravFormelGeneratoren = [genGravitationsgesetz, genGravitationsgesetz, genGravitationsgesetz, () => ({ pool: gravPickPoolItem(gravEinflussPool) })];
const gravProfiGeneratoren = [genGravitationsgesetz, genBahngeschwindigkeit, genUmlaufdauer];

function gravRunGenerator(generatorFn, mode) {
  const result = generatorFn();
  if (result.pool) {
    return { kind: "code", mode: "mc", prompt: result.pool.prompt, code: result.pool.code, options: result.pool.options };
  }
  return finalizeGravQuestion(result, mode);
}

Game.modules.gravitationsgesetz = {
  id: "gravitationsgesetz",
  title: "Physik 11 - Gravitationsgesetz",
  subjectTrack: "physik-11",
  description:
    "F_G = G·m₁·m₂/r² und daraus abgeleitet Bahngeschwindigkeit und Umlaufdauer von Monden, Satelliten und Planeten.",
  levels: [
    {
      id: "formel",
      title: "Das Gravitationsgesetz",
      description: "F_G = G·m₁·m₂/r² und der Einfluss von Masse und Abstand.",
      mode: "mc",
      questionCount: 6,
      generators: gravFormelGeneratoren,
    },
    {
      id: "bahngeschwindigkeit",
      title: "Bahngeschwindigkeit",
      description: "Mond, Satelliten, Planeten: v = √(G·M/r).",
      mode: "mc",
      questionCount: 6,
      generators: gravGeschwindigkeitGeneratoren,
    },
    {
      id: "umlaufdauer",
      title: "Umlaufdauer (Kepler)",
      description: "T = 2π·√(r³/(G·M)).",
      mode: "mc",
      questionCount: 6,
      generators: gravUmlaufdauerGeneratoren,
    },
    {
      id: "profi",
      title: "Profi: Alles gemischt",
      description: "Formel, Bahngeschwindigkeit und Umlaufdauer gemischt, Ergebnis selbst eingeben.",
      mode: "numeric",
      questionCount: 6,
      generators: gravProfiGeneratoren,
    },
  ],

  generateQuestions(levelDef) {
    const questions = [];
    for (let i = 0; i < levelDef.questionCount; i++) {
      const generatorFn = Game.Questions.pickRandom(levelDef.generators);
      questions.push(gravRunGenerator(generatorFn, levelDef.mode));
    }
    return questions;
  },
};
