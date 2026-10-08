// Spielmodul "Integralrechnen im Kopf" (Mathe 13): Training der schnellen,
// direkten Integralberechnung (Stammfunktion bilden, F(b)-F(a) einsetzen)
// mit einer breiten Vielfalt an Integrandenfunktionen - Potenzfunktionen,
// e-Funktionen, trigonometrische Funktionen und Mischformen. Anders als
// beim Flaechenbilanz-Modul geht es hier nicht um Vorzeichen/Flaechenbilanz-
// Spezialfaelle, sondern um Tempo und Breite der Funktionstypen.
//
// Eigener Funktionspool (nicht Game.functionPool), damit das bestehende
// Flaechenbilanz-Modul unberuehrt bleibt.

window.Game = window.Game || {};
Game.modules = Game.modules || {};

const EXP1 = Math.E;

Game.integralRechnenPool = [
  // --- Potenzfunktionen ---
  { id: "const-1", label: "f(x) = 1", f: () => 1, F: (x) => x, domain: [0, 5], group: "potenz" },
  { id: "lin-x", label: "f(x) = x", f: (x) => x, F: (x) => (x * x) / 2, domain: [0, 6], group: "potenz" },
  { id: "lin-2x", label: "f(x) = 2x", f: (x) => 2 * x, F: (x) => x * x, domain: [0, 5], group: "potenz" },
  { id: "quad-x2", label: "f(x) = x²", f: (x) => x * x, F: (x) => (x ** 3) / 3, domain: [0, 4], group: "potenz" },
  { id: "quad-3x2", label: "f(x) = 3x²", f: (x) => 3 * x * x, F: (x) => x ** 3, domain: [0, 4], group: "potenz" },
  { id: "cubic-x3", label: "f(x) = x³", f: (x) => x ** 3, F: (x) => (x ** 4) / 4, domain: [0, 3], group: "potenz" },
  { id: "cubic-4x3", label: "f(x) = 4x³", f: (x) => 4 * x ** 3, F: (x) => x ** 4, domain: [0, 3], group: "potenz" },

  // --- e-Funktionen ---
  { id: "exp-ex", label: "f(x) = eˣ", f: (x) => Math.pow(EXP1, x), F: (x) => Math.pow(EXP1, x), domain: [0, 3], group: "exp" },
  { id: "exp-2ex", label: "f(x) = 2eˣ", f: (x) => 2 * Math.pow(EXP1, x), F: (x) => 2 * Math.pow(EXP1, x), domain: [0, 3], group: "exp" },
  {
    id: "exp-ex-plus1",
    label: "f(x) = eˣ + 1",
    f: (x) => Math.pow(EXP1, x) + 1,
    F: (x) => Math.pow(EXP1, x) + x,
    domain: [0, 3],
    group: "exp",
  },

  // --- Trigonometrische Funktionen ---
  {
    id: "trig-sin",
    label: "f(x) = sin(x)",
    f: (x) => Math.sin(x),
    F: (x) => -Math.cos(x),
    domain: [0, 2 * Math.PI],
    niceBounds: [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI],
    group: "trig",
  },
  {
    id: "trig-cos",
    label: "f(x) = cos(x)",
    f: (x) => Math.cos(x),
    F: (x) => Math.sin(x),
    domain: [0, 2 * Math.PI],
    niceBounds: [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI],
    group: "trig",
  },
  {
    id: "trig-2cos",
    label: "f(x) = 2cos(x)",
    f: (x) => 2 * Math.cos(x),
    F: (x) => 2 * Math.sin(x),
    domain: [0, 2 * Math.PI],
    niceBounds: [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI],
    group: "trig",
  },

  // --- Profi: Potenz mit negativem Exponenten + Mischformen ---
  {
    id: "neg-power",
    label: "f(x) = 1/x²",
    f: (x) => 1 / (x * x),
    F: (x) => -1 / x,
    domain: [1, 5],
    group: "profi",
  },
  {
    id: "mix-x-ex",
    label: "f(x) = x + eˣ",
    f: (x) => x + Math.pow(EXP1, x),
    F: (x) => (x * x) / 2 + Math.pow(EXP1, x),
    domain: [0, 3],
    group: "profi",
  },
  {
    id: "mix-3x2-2x",
    label: "f(x) = 3x² − 2x",
    f: (x) => 3 * x * x - 2 * x,
    F: (x) => x ** 3 - x * x,
    domain: [0, 4],
    group: "profi",
  },
];

function pickFromGroup(pool, group, lastId) {
  const candidates = group === "all" ? pool : pool.filter((f) => f.group === group);
  let funcObj;
  do {
    funcObj = Game.Questions.pickRandom(candidates);
  } while (candidates.length > 1 && funcObj.id === lastId);
  return funcObj;
}

Game.modules.integralrechnen = {
  id: "integralrechnen",
  title: "Mathe 13 - Integralrechnen im Kopf",
  subjectTrack: "mathe-13",
  description:
    "Stammfunktion bilden und direkt einsetzen - schnelle Integralberechnung mit verschiedenen Integrandenfunktionen.",
  levels: [
    {
      id: "potenz",
      title: "Potenzfunktionen",
      description: "Konstante, lineare, quadratische und kubische Funktionen.",
      group: "potenz",
      mode: "mc",
      questionCount: 6,
    },
    {
      id: "exp",
      title: "e-Funktionen",
      description: "Die Stammfunktion von eˣ ist eˣ selbst.",
      group: "exp",
      mode: "mc",
      questionCount: 6,
    },
    {
      id: "trig",
      title: "Trigonometrische Funktionen",
      description: "sin und cos integrieren.",
      group: "trig",
      mode: "mc",
      questionCount: 6,
    },
    {
      id: "profi",
      title: "Profi: Alles gemischt",
      description: "Alle Funktionstypen gemischt, Ergebnis selbst eingeben.",
      group: "all",
      mode: "numeric",
      questionCount: 6,
    },
  ],

  generateQuestions(levelDef) {
    const questions = [];
    let lastId = null;
    for (let i = 0; i < levelDef.questionCount; i++) {
      const funcObj = pickFromGroup(Game.integralRechnenPool, levelDef.group, lastId);
      lastId = funcObj.id;

      const [a, b] = Game.Questions.generateBounds(funcObj);
      const correctValue = Game.Questions.computeIntegral(funcObj, a, b);

      const question = { funcObj, a, b, correctValue, mode: levelDef.mode };
      if (levelDef.mode === "mc") {
        question.options = Game.Questions.generateMCOptions(correctValue);
      }
      questions.push(question);
    }
    return questions;
  },
};
