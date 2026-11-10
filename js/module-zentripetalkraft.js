// Spielmodul "Zentripetalkraft" (Physik 11): F_Z = m*v²/r = m*ω²*r, Einfluss
// der einzelnen Größen auf F_Z, und Kurvenneigung (tan(α) = v²/(r*g)) mit
// Bezug zu Zug, Kettenkarussell und Fahrradfahrer.

window.Game = window.Game || {};
Game.modules = Game.modules || {};

const G_ERDE = 9.81;

function buildZentripetalOptions(correctValue, distractors, unit) {
  const opts = Game.Questions.buildOptionsFromCandidates(correctValue, 2, distractors);
  return opts.map((o) => ({ value: `${formatNum(o.value)} ${unit}`, correct: o.correct }));
}

function finalizeQuestion(item, mode) {
  const question = {
    kind: "code",
    mode,
    prompt: item.prompt,
    code: item.code || null,
    correctValue: item.correctValue,
    unit: item.unit,
  };
  if (mode === "mc") {
    question.options = buildZentripetalOptions(item.correctValue, item.distractors, item.unit);
  }
  return question;
}

// --- Thema 1: Die Formel F_Z = m*v²/r = m*ω²*r ---

function genFzAusMV() {
  const m = Game.Questions.randomDecimal(0.5, 5, 1);
  const v = Game.Questions.randomDecimal(2, 15, 1);
  const r = Game.Questions.randomDecimal(0.5, 5, 1);
  const correctValue = (m * v * v) / r;
  return {
    prompt: "Wie groß ist die Zentripetalkraft F_Z?",
    code: `Gegeben:\nm = ${formatNum(m)} kg\nv = ${formatNum(v)} m/s\nr = ${formatNum(r)} m`,
    correctValue,
    unit: "N",
    distractors: [(m * v) / r, m * v * v * r, (m * v * v) / (r * r)],
  };
}

function genFzAusMOmegaR() {
  const m = Game.Questions.randomDecimal(0.5, 5, 1);
  const omega = Game.Questions.randomDecimal(0.5, 6, 2);
  const r = Game.Questions.randomDecimal(0.5, 5, 1);
  const correctValue = m * omega * omega * r;
  return {
    prompt: "Wie groß ist die Zentripetalkraft F_Z?",
    code: `Gegeben:\nm = ${formatNum(m)} kg\nω = ${formatNum(omega)} rad/s\nr = ${formatNum(r)} m`,
    correctValue,
    unit: "N",
    distractors: [m * omega * r, (m * omega * omega) / r, m * omega * r * r],
  };
}

function genVAusFzMR() {
  const m = Game.Questions.randomDecimal(0.5, 5, 1);
  const v = Game.Questions.randomDecimal(2, 15, 1);
  const r = Game.Questions.randomDecimal(0.5, 5, 1);
  const fz = (m * v * v) / r;
  return {
    prompt: "Wie groß ist die Bahngeschwindigkeit v?",
    code: `Gegeben:\nF_Z = ${formatNum(fz)} N\nm = ${formatNum(m)} kg\nr = ${formatNum(r)} m`,
    correctValue: v,
    unit: "m/s",
    distractors: [(fz * r) / m, Math.sqrt(fz / m), Math.sqrt((fz * m) / r)],
  };
}

function genRAusFzMV() {
  const m = Game.Questions.randomDecimal(0.5, 5, 1);
  const v = Game.Questions.randomDecimal(2, 15, 1);
  const r = Game.Questions.randomDecimal(0.5, 5, 1);
  const fz = (m * v * v) / r;
  return {
    prompt: "Wie groß ist der Bahnradius r?",
    code: `Gegeben:\nF_Z = ${formatNum(fz)} N\nm = ${formatNum(m)} kg\nv = ${formatNum(v)} m/s`,
    correctValue: r,
    unit: "m",
    distractors: [fz / (m * v * v), (m * v) / fz, m * v * v * fz],
  };
}

// --- Thema 2: Einfluss der Größen (fester Fragenpool, rein begrifflich) ---

const einflussPool = [
  {
    prompt:
      "Die Geschwindigkeit eines Körpers auf einer Kreisbahn wird verdoppelt (m und r bleiben gleich). Wie ändert sich die Zentripetalkraft F_Z?",
    options: [
      { value: "Sie vervierfacht sich", correct: true },
      { value: "Sie verdoppelt sich", correct: false },
      { value: "Sie bleibt gleich", correct: false },
      { value: "Sie halbiert sich", correct: false },
    ],
  },
  {
    prompt: "Der Bahnradius wird verdoppelt (m und v bleiben gleich). Wie ändert sich F_Z?",
    options: [
      { value: "Sie halbiert sich", correct: true },
      { value: "Sie verdoppelt sich", correct: false },
      { value: "Sie vervierfacht sich", correct: false },
      { value: "Sie bleibt gleich", correct: false },
    ],
  },
  {
    prompt: "Die Masse wird verdreifacht (v und r bleiben gleich). Wie ändert sich F_Z?",
    options: [
      { value: "Sie verdreifacht sich", correct: true },
      { value: "Sie bleibt gleich", correct: false },
      { value: "Sie verneunfacht sich", correct: false },
      { value: "Sie drittelt sich", correct: false },
    ],
  },
  {
    prompt: "Die Geschwindigkeit wird halbiert (m und r bleiben gleich). Wie ändert sich F_Z?",
    options: [
      { value: "Sie viertelt sich", correct: true },
      { value: "Sie halbiert sich", correct: false },
      { value: "Sie bleibt gleich", correct: false },
      { value: "Sie verdoppelt sich", correct: false },
    ],
  },
  {
    prompt: "v wird verdoppelt UND r wird verdoppelt (m bleibt gleich). Wie ändert sich F_Z?",
    options: [
      { value: "Sie verdoppelt sich", correct: true },
      { value: "Sie bleibt gleich", correct: false },
      { value: "Sie vervierfacht sich", correct: false },
      { value: "Sie halbiert sich", correct: false },
    ],
  },
  {
    prompt: "Welche Größe beeinflusst F_Z = m·v²/r am stärksten, wenn man sie verdoppelt (bei sonst gleichen Werten)?",
    options: [
      { value: "v, weil sie quadratisch eingeht", correct: true },
      { value: "m, weil sie linear eingeht", correct: false },
      { value: "r, weil sie im Nenner steht", correct: false },
      { value: "Alle drei beeinflussen F_Z gleich stark", correct: false },
    ],
  },
  {
    prompt: "In der Formel F_Z = m·ω²·r: Wie wirkt sich eine Verdopplung von r auf F_Z aus (m, ω bleiben gleich)?",
    options: [
      { value: "Sie verdoppelt sich (r steht hier im Zähler, nicht im Nenner)", correct: true },
      { value: "Sie halbiert sich", correct: false },
      { value: "Sie bleibt gleich", correct: false },
      { value: "Sie vervierfacht sich", correct: false },
    ],
  },
];

// --- Thema 3: Kurvenneigung (tan(α) = v²/(r*g)) ---

function genZugNeigung() {
  const r = Game.Questions.randomDecimal(300, 1200, 0);
  const vKmh = Game.Questions.randomDecimal(80, 200, 0);
  const v = vKmh / 3.6;
  const correctValue = (Math.atan((v * v) / (r * G_ERDE)) * 180) / Math.PI;
  const falscheEinheit = (Math.atan((vKmh * vKmh) / (r * G_ERDE)) * 180) / Math.PI;
  return {
    prompt:
      "Ein Zug durchfährt eine Kurve mit diesem Radius bei dieser Geschwindigkeit. Auf welchen Winkel müsste die Kurve geneigt sein, damit keine Querkraft auf die Schienen wirkt (ideale Neigung, ohne Reibung)?",
    code: `Gegeben:\nr = ${formatNum(r)} m\nv = ${formatNum(vKmh)} km/h`,
    correctValue,
    unit: "°",
    distractors: [falscheEinheit, correctValue * 2, correctValue / 2],
  };
}

function genKettenkarussellNeigung() {
  const r = Game.Questions.randomDecimal(3, 8, 1);
  const v = Game.Questions.randomDecimal(3, 10, 1);
  const correctValue = (Math.atan((v * v) / (r * G_ERDE)) * 180) / Math.PI;
  return {
    prompt:
      "Bei einem Kettenkarussell bewegt sich ein Sitz mit dieser Geschwindigkeit auf einer Kreisbahn mit diesem Radius. Welchen Winkel schließen die Ketten mit der Senkrechten ein?",
    code: `Gegeben:\nr = ${formatNum(r)} m\nv = ${formatNum(v)} m/s`,
    correctValue,
    unit: "°",
    distractors: [correctValue * 2, correctValue / 2, (Math.atan(v / (r * G_ERDE)) * 180) / Math.PI],
  };
}

function genFahrradNeigungAusVR() {
  const r = Game.Questions.randomDecimal(3, 15, 1);
  const v = Game.Questions.randomDecimal(3, 12, 1);
  const correctValue = (Math.atan((v * v) / (r * G_ERDE)) * 180) / Math.PI;
  return {
    prompt:
      "Ein Fahrradfahrer durchfährt eine Kurve mit diesem Radius bei dieser Geschwindigkeit. Um welchen Winkel muss er sich mindestens zur Kurvenmitte neigen, damit er nicht umkippt?",
    code: `Gegeben:\nr = ${formatNum(r)} m\nv = ${formatNum(v)} m/s`,
    correctValue,
    unit: "°",
    distractors: [correctValue * 2, correctValue / 2, (Math.atan((v * v * r) / G_ERDE) * 180) / Math.PI],
  };
}

function genFahrradVAusAlphaR() {
  const r = Game.Questions.randomDecimal(3, 15, 1);
  const alphaDeg = Game.Questions.randomDecimal(10, 40, 0);
  const alphaRad = (alphaDeg * Math.PI) / 180;
  const correctValue = Math.sqrt(r * G_ERDE * Math.tan(alphaRad));
  return {
    prompt:
      "Ein Fahrradfahrer neigt sich um diesen Winkel in eine Kurve mit diesem Radius. Wie schnell fährt er (bei dieser Neigung als idealer Kurvengeschwindigkeit)?",
    code: `Gegeben:\nr = ${formatNum(r)} m\nα = ${formatNum(alphaDeg)}°`,
    correctValue,
    unit: "m/s",
    distractors: [
      r * G_ERDE * Math.tan(alphaRad),
      Math.sqrt(r * G_ERDE / Math.tan(alphaRad)),
      Math.sqrt(r * Math.tan(alphaRad)),
    ],
  };
}

const neigungKonzeptPool = [
  {
    prompt: "Warum neigen sich Fahrradfahrer, Motorradfahrer oder die Sitze eines Kettenkarussells in einer Kurve zur Kurvenmitte?",
    options: [
      {
        value: "Damit die Zentripetalkraft durch das Zusammenspiel aus Gewichtskraft und Normal-/Zugkraft aufgebracht werden kann",
        correct: true,
      },
      { value: "Damit die Reibung verringert wird", correct: false },
      { value: "Damit die Geschwindigkeit sinkt", correct: false },
      { value: "Aus rein aerodynamischen Gründen", correct: false },
    ],
  },
  {
    prompt: "Wie ändert sich der nötige Neigungswinkel, wenn die Geschwindigkeit in der Kurve erhöht wird (Radius bleibt gleich)?",
    options: [
      { value: "Er wird größer", correct: true },
      { value: "Er wird kleiner", correct: false },
      { value: "Er bleibt gleich", correct: false },
      { value: "Er wird negativ", correct: false },
    ],
  },
  {
    prompt: "Wie ändert sich der nötige Neigungswinkel, wenn der Kurvenradius größer wird (Geschwindigkeit bleibt gleich)?",
    options: [
      { value: "Er wird kleiner", correct: true },
      { value: "Er wird größer", correct: false },
      { value: "Er bleibt gleich", correct: false },
      { value: "Er wird negativ", correct: false },
    ],
  },
];

function pickPoolItem(pool) {
  const item = Game.Questions.pickRandom(pool);
  return { prompt: item.prompt, code: null, options: Game.Questions.shuffle(item.options) };
}

const neigungGenerators = [
  () => ({ raw: genZugNeigung() }),
  () => ({ raw: genKettenkarussellNeigung() }),
  () => ({ raw: genFahrradNeigungAusVR() }),
  () => ({ raw: genFahrradVAusAlphaR() }),
  () => ({ pool: pickPoolItem(neigungKonzeptPool) }),
];

const profiGenerators = [genFzAusMV, genFzAusMOmegaR, genVAusFzMR, genRAusFzMV, genZugNeigung, genKettenkarussellNeigung, genFahrradNeigungAusVR, genFahrradVAusAlphaR];

Game.modules.zentripetalkraft = {
  id: "zentripetalkraft",
  title: "Physik 11 - Zentripetalkraft",
  subjectTrack: "physik-11",
  description:
    "F_Z = m·v²/r = m·ω²·r, der Einfluss der einzelnen Größen, und Kurvenneigung bei Zug, Kettenkarussell und Fahrrad.",
  levels: [
    {
      id: "formel",
      title: "Die Zentripetalkraft-Formel",
      description: "F_Z berechnen - und auch mal nach v, r oder m umstellen.",
      mode: "mc",
      questionCount: 6,
      kind: "formel",
    },
    {
      id: "einfluss",
      title: "Einfluss der Größen",
      description: "Was passiert mit F_Z, wenn man m, v oder r verändert?",
      mode: "mc",
      questionCount: 6,
      kind: "einfluss",
    },
    {
      id: "kurvenneigung",
      title: "Kurvenneigung",
      description: "Zug, Kettenkarussell, Fahrrad: tan(α) = v²/(r·g).",
      mode: "mc",
      questionCount: 6,
      kind: "kurvenneigung",
    },
    {
      id: "profi",
      title: "Profi: Alles gemischt",
      description: "Formel und Kurvenneigung gemischt, Ergebnis selbst eingeben.",
      mode: "numeric",
      questionCount: 6,
      kind: "profi",
    },
  ],

  generateQuestions(levelDef) {
    const questions = [];
    for (let i = 0; i < levelDef.questionCount; i++) {
      if (levelDef.kind === "formel") {
        const item = Game.Questions.pickRandom([genFzAusMV, genFzAusMOmegaR, genVAusFzMR, genRAusFzMV])();
        questions.push(finalizeQuestion(item, levelDef.mode));
      } else if (levelDef.kind === "einfluss") {
        const item = pickPoolItem(einflussPool);
        questions.push({ kind: "code", mode: "mc", prompt: item.prompt, code: item.code, options: item.options });
      } else if (levelDef.kind === "kurvenneigung") {
        const choice = Game.Questions.pickRandom(neigungGenerators)();
        if (choice.raw) questions.push(finalizeQuestion(choice.raw, levelDef.mode));
        else questions.push({ kind: "code", mode: "mc", prompt: choice.pool.prompt, code: choice.pool.code, options: choice.pool.options });
      } else {
        const item = Game.Questions.pickRandom(profiGenerators)();
        questions.push(finalizeQuestion(item, levelDef.mode));
      }
    }
    return questions;
  },
};
