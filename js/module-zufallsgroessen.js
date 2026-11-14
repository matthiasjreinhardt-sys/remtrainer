// Spielmodul "Zufallsgrößen & Normalverteilung" (Mathe 13): diskrete
// Zufallsgrößen (Erwartungswert), stetige Zufallsgrößen (Dichtefunktion,
// Wahrscheinlichkeit als Fläche - Anschluss an die Integral-Module) und
// die Normalverteilung (Glockenkurve, Sigma-Regeln).
//
// Alle Hilfsnamen sind mit "stoch" praefigiert, um Namenskollisionen mit
// anderen module-*.js-Dateien zu vermeiden (gemeinsamer globaler Scope).

window.Game = window.Game || {};
Game.modules = Game.modules || {};

function stochBuildOptions(correctValue, distractors, unit) {
  const opts = Game.Questions.buildOptionsFromCandidates(correctValue, 2, distractors);
  return opts.map((o) => ({
    value: unit ? `${formatNum(o.value)} ${unit}` : formatNum(o.value),
    correct: o.correct,
  }));
}

function stochPickPoolItem(pool) {
  const item = Game.Questions.pickRandom(pool);
  return { kind: "code", mode: "mc", prompt: item.prompt, code: item.code || null, options: Game.Questions.shuffle(item.options) };
}

// --- Thema 1: Diskrete Zufallsgrößen (Erwartungswert) ---

const stochDiskreteKonzeptPool = [
  {
    prompt: "Was muss für die Wahrscheinlichkeiten P(X=xᵢ) einer diskreten Zufallsgröße X immer gelten?",
    options: [
      { value: "Sie sind alle ≥ 0, und ihre Summe ist genau 1", correct: true },
      { value: "Ihre Summe ist größer als 1", correct: false },
      { value: "Sie müssen alle gleich groß sein", correct: false },
      { value: "Es gibt keine besondere Bedingung", correct: false },
    ],
  },
  {
    prompt: "Was gibt der Erwartungswert E(X) einer Zufallsgröße an?",
    options: [
      { value: "Den auf lange Sicht zu erwartenden Mittelwert (gewichtetes Mittel der möglichen Werte)", correct: true },
      { value: "Den häufigsten einzelnen Wert", correct: false },
      { value: "Den größten möglichen Wert", correct: false },
      { value: "Die Anzahl der möglichen Werte", correct: false },
    ],
  },
  {
    prompt: "Wie wird der Erwartungswert E(X) berechnet?",
    options: [
      { value: "E(X) = Σ xᵢ · P(X=xᵢ)", correct: true },
      { value: "E(X) = Σ xᵢ", correct: false },
      { value: "E(X) = Σ P(X=xᵢ)", correct: false },
      { value: "E(X) = max(xᵢ)", correct: false },
    ],
  },
];

function stochMakeErwartungswert(mode) {
  const x0 = Game.Questions.randomInt(-5, 0);
  const x1 = Game.Questions.randomInt(1, 5);
  const x2 = Game.Questions.randomInt(6, 15);
  const p0Tenths = Game.Questions.randomInt(1, 6);
  const p1Tenths = Game.Questions.randomInt(1, 9 - p0Tenths);
  const p2Tenths = 10 - p0Tenths - p1Tenths;
  const p0 = p0Tenths / 10;
  const p1 = p1Tenths / 10;
  const p2 = p2Tenths / 10;
  const correctValue = x0 * p0 + x1 * p1 + x2 * p2;

  const question = {
    kind: "code",
    mode,
    prompt: "Wie groß ist der Erwartungswert E(X) dieser Zufallsgröße X?",
    code: `x        | ${x0}  | ${x1}  | ${x2}\nP(X = x) | ${formatNum(p0)} | ${formatNum(p1)} | ${formatNum(p2)}`,
    correctValue,
    unit: "",
  };
  if (mode === "mc") {
    const modusX = p0 >= p1 && p0 >= p2 ? x0 : p1 >= p2 ? x1 : x2;
    question.options = stochBuildOptions(correctValue, [(x0 + x1 + x2) / 3, modusX, x0 * p2 + x1 * p1 + x2 * p0], "");
  }
  return question;
}

function pickDiskreteFrage(mode) {
  if (Math.random() < 0.3) return stochPickPoolItem(stochDiskreteKonzeptPool);
  return stochMakeErwartungswert(mode);
}

// --- Thema 2: Stetige Zufallsgrößen (Dichtefunktion, Wahrscheinlichkeit = Fläche) ---

const stochStetigeKonzeptPool = [
  {
    prompt: "Welche Wahrscheinlichkeit hat ein einzelner, exakter Wert x bei einer stetigen Zufallsgröße X, z.B. P(X=5)?",
    options: [
      { value: "0 (bei stetigen Zufallsgrößen betrachtet man nur Intervalle)", correct: true },
      { value: "Das hängt von der Dichtefunktion an dieser Stelle ab", correct: false },
      { value: "Immer 1", correct: false },
      { value: "Das lässt sich grundsätzlich nicht bestimmen", correct: false },
    ],
  },
  {
    prompt: "Was muss für eine Dichtefunktion f einer stetigen Zufallsgröße gelten?",
    options: [
      { value: "f(x) ≥ 0 für alle x, und die Gesamtfläche unter f ist 1", correct: true },
      { value: "f(x) muss immer kleiner als 1 sein", correct: false },
      { value: "f ist immer eine Gerade", correct: false },
      { value: "f(x) kann auch negativ sein, solange die Summe 0 ist", correct: false },
    ],
  },
  {
    prompt: "Wie berechnet man P(a ≤ X ≤ b) bei einer stetigen Zufallsgröße mit Dichtefunktion f?",
    options: [
      { value: "Als Fläche unter f zwischen a und b, also ∫ₐᵇ f(x) dx", correct: true },
      { value: "Als f(b) − f(a)", correct: false },
      { value: "Als f((a+b)/2)", correct: false },
      { value: "Das ist bei stetigen Zufallsgrößen nicht berechenbar", correct: false },
    ],
  },
  {
    prompt: "Bei einer stetigen Zufallsgröße: Wie verhält sich P(a < X < b) im Vergleich zu P(a ≤ X ≤ b)?",
    options: [
      { value: "Beide sind gleich groß (einzelne Randpunkte haben Wahrscheinlichkeit 0)", correct: true },
      { value: "P(a < X < b) ist immer kleiner", correct: false },
      { value: "P(a < X < b) ist immer größer", correct: false },
      { value: "Keine Aussage ohne konkrete Dichtefunktion möglich", correct: false },
    ],
  },
  {
    prompt: "Was ist der Hauptunterschied zwischen einer diskreten und einer stetigen Zufallsgröße?",
    options: [
      {
        value: "Eine diskrete Zufallsgröße kann nur endlich (oder abzählbar unendlich) viele Werte annehmen, eine stetige beliebig viele Werte in einem Intervall",
        correct: true,
      },
      { value: "Eine stetige Zufallsgröße kann nur positive Werte annehmen", correct: false },
      { value: "Eine diskrete Zufallsgröße hat immer den Erwartungswert 0", correct: false },
      { value: "Es gibt keinen Unterschied", correct: false },
    ],
  },
];

function stochMakeGleichverteilung(mode) {
  const c = Game.Questions.randomInt(0, 4);
  const width = Game.Questions.randomInt(6, 10);
  const d = c + width;
  const height = 1 / width;
  const a = c + Game.Questions.randomInt(1, Math.floor(width / 2));
  const b = a + Game.Questions.randomInt(1, d - a - 1);
  const correctValue = (b - a) * height;

  const question = {
    kind: "graph",
    mode,
    prompt: `X ist gleichverteilt auf [${c}, ${d}] (konstante Dichtefunktion f(x) = ${formatNum(height)}). Wie groß ist P(${a} ≤ X ≤ ${b})? (Fläche unter f zwischen den markierten Grenzen)`,
    funcObj: { f: () => height, domain: [c, d] },
    a,
    b,
    correctValue,
    unit: "",
  };
  if (mode === "mc") {
    question.options = stochBuildOptions(correctValue, [b - a, height, 1 - correctValue], "");
  }
  return question;
}

function pickStetigeFrage(mode) {
  if (Math.random() < 0.3) return stochPickPoolItem(stochStetigeKonzeptPool);
  return stochMakeGleichverteilung(mode);
}

// --- Thema 3: Normalverteilung ---

const stochNormalKonzeptPool = [
  {
    prompt: "Welche Form hat die Dichtefunktion der Normalverteilung?",
    options: [
      { value: "Eine symmetrische Glockenkurve", correct: true },
      { value: "Eine Gerade", correct: false },
      { value: "Eine Parabel, die die x-Achse schneidet", correct: false },
      { value: "Eine Treppenfunktion", correct: false },
    ],
  },
  {
    prompt: "Um welchen Wert ist die Dichtefunktion der Normalverteilung symmetrisch?",
    options: [
      { value: "Um den Erwartungswert μ", correct: true },
      { value: "Um die Standardabweichung σ", correct: false },
      { value: "Immer um 0", correct: false },
      { value: "Um den größten vorkommenden Wert", correct: false },
    ],
  },
  {
    prompt: "Was passiert mit der Glockenkurve, wenn σ größer wird (μ bleibt gleich)?",
    options: [
      { value: "Sie wird breiter und flacher", correct: true },
      { value: "Sie wird schmaler und höher", correct: false },
      { value: "Sie verschiebt sich nach rechts", correct: false },
      { value: "Sie bleibt unverändert", correct: false },
    ],
  },
  {
    prompt: "Wo liegen die Wendepunkte der Normalverteilungs-Dichtefunktion?",
    options: [
      { value: "Bei μ − σ und μ + σ", correct: true },
      { value: "Bei μ", correct: false },
      { value: "Bei 0 und 2μ", correct: false },
      { value: "Die Kurve hat keine Wendepunkte", correct: false },
    ],
  },
  {
    prompt: "Wie groß ist näherungsweise die Wahrscheinlichkeit, dass eine normalverteilte Größe X im Intervall [μ−σ, μ+σ] liegt?",
    options: [
      { value: "ca. 68 %", correct: true },
      { value: "ca. 95 %", correct: false },
      { value: "ca. 99,7 %", correct: false },
      { value: "ca. 50 %", correct: false },
    ],
  },
  {
    prompt: "Wie groß ist näherungsweise die Wahrscheinlichkeit für das Intervall [μ−2σ, μ+2σ]?",
    options: [
      { value: "ca. 95 %", correct: true },
      { value: "ca. 68 %", correct: false },
      { value: "ca. 99,7 %", correct: false },
      { value: "ca. 100 %", correct: false },
    ],
  },
  {
    prompt: "Wie groß ist näherungsweise die Wahrscheinlichkeit für das Intervall [μ−3σ, μ+3σ]?",
    options: [
      { value: "ca. 99,7 %", correct: true },
      { value: "ca. 95 %", correct: false },
      { value: "ca. 68 %", correct: false },
      { value: "ca. 75 %", correct: false },
    ],
  },
];

function genSigmaIntervall() {
  const mu = Game.Questions.randomInt(50, 200);
  const sigma = Game.Questions.randomInt(5, 20);
  const k = Game.Questions.pickRandom([1, 2, 3]);
  const pctLabel = { 1: "68 %", 2: "95 %", 3: "99,7 %" }[k];
  const lower = mu - k * sigma;
  const upper = mu + k * sigma;
  const wrongK = Game.Questions.pickRandom([1, 2, 3].filter((n) => n !== k));

  return {
    kind: "code",
    mode: "mc",
    prompt: `Eine normalverteilte Größe X hat μ = ${mu} und σ = ${sigma}. In welchem Intervall liegen ca. ${pctLabel} der Werte?`,
    code: null,
    options: Game.Questions.shuffle([
      { value: `[${lower}, ${upper}]`, correct: true },
      { value: `[${mu - wrongK * sigma}, ${mu + wrongK * sigma}]`, correct: false },
      { value: `[${mu}, ${upper}]`, correct: false },
      { value: `[${lower}, ${mu}]`, correct: false },
    ]),
  };
}

function stochMakeSigmaWert(mode) {
  const mu = Game.Questions.randomInt(50, 200);
  const sigma = Game.Questions.randomInt(5, 20);
  const k = Game.Questions.pickRandom([1, 2, 3]);
  const sign = Game.Questions.pickRandom([1, -1]);
  const correctValue = mu + sign * k * sigma;

  const question = {
    kind: "code",
    mode,
    prompt: `Eine normalverteilte Größe X hat μ = ${mu} und σ = ${sigma}. Berechne μ ${sign > 0 ? "+" : "−"} ${k}σ.`,
    code: null,
    correctValue,
    unit: "",
  };
  if (mode === "mc") {
    question.options = stochBuildOptions(correctValue, [mu - sign * k * sigma, mu + sign * k * sigma * 2, mu], "");
  }
  return question;
}

function pickNormalverteilungFrage(mode) {
  const r = Math.random();
  if (r < 0.45) return stochPickPoolItem(stochNormalKonzeptPool);
  if (r < 0.75) return genSigmaIntervall();
  return stochMakeSigmaWert(mode);
}

function pickProfiFrage(mode) {
  const maker = Game.Questions.pickRandom([stochMakeErwartungswert, stochMakeGleichverteilung, stochMakeSigmaWert]);
  return maker(mode);
}

Game.modules.zufallsgroessen = {
  id: "zufallsgroessen",
  title: "Mathe 13 - Zufallsgrößen & Normalverteilung",
  subjectTrack: "mathe-13",
  description:
    "Diskrete und stetige Zufallsgrößen (Erwartungswert, Dichtefunktion als Fläche) sowie die Normalverteilung mit den Sigma-Regeln.",
  levels: [
    {
      id: "diskret",
      title: "Diskrete Zufallsgrößen",
      description: "Erwartungswert E(X) = Σ xᵢ·P(X=xᵢ).",
      mode: "mc",
      questionCount: 6,
      pick: pickDiskreteFrage,
    },
    {
      id: "stetig",
      title: "Stetige Zufallsgrößen",
      description: "Dichtefunktion, Wahrscheinlichkeit als Fläche.",
      mode: "mc",
      questionCount: 6,
      pick: pickStetigeFrage,
    },
    {
      id: "normalverteilung",
      title: "Normalverteilung",
      description: "Glockenkurve, μ, σ und die Sigma-Regeln.",
      mode: "mc",
      questionCount: 6,
      pick: pickNormalverteilungFrage,
    },
    {
      id: "profi",
      title: "Profi: Alles gemischt",
      description: "Erwartungswert, Flächen und Sigma-Regeln gemischt, Ergebnis selbst eingeben.",
      mode: "numeric",
      questionCount: 6,
      pick: pickProfiFrage,
    },
  ],

  generateQuestions(levelDef) {
    const questions = [];
    for (let i = 0; i < levelDef.questionCount; i++) {
      questions.push(levelDef.pick(levelDef.mode));
    }
    return questions;
  },
};
