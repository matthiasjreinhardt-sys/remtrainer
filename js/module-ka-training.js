// Spielmodul "Kasl-Training" (Mathe 13): Wiederholung/Training fuer die
// Klassenarbeit mit drei Themen:
//  1. Sonderregeln fuer die Integration (Stammfunktion von f(ax+b))
//  2. Flaeche zwischen Graph und x-Achse (Wiederholung, nutzt denselben
//     Funktionspool wie das Flaechenbilanz-Modul)
//  3. Flaeche zwischen zwei Graphen (neu: Game.Graph.drawBetween)
// Profi-Level mischt alle drei Themen, Ergebnis wird eingetippt.

window.Game = window.Game || {};
Game.modules = Game.modules || {};

// --- Thema 1: Sonderregeln (Stammfunktion von f(ax+b) = (1/a)*F(ax+b)) ---

const sonderregelPool = [
  {
    id: "sr-quad-2x1",
    label: "f(x) = (2x + 1)²",
    f: (x) => (2 * x + 1) ** 2,
    F: (x) => (2 * x + 1) ** 3 / 6,
    domain: [0, 3],
  },
  {
    id: "sr-cubic-shift",
    label: "f(x) = (x + 2)³",
    f: (x) => (x + 2) ** 3,
    F: (x) => (x + 2) ** 4 / 4,
    domain: [-1, 2],
  },
  {
    id: "sr-sin-2x",
    label: "f(x) = sin(2x)",
    f: (x) => Math.sin(2 * x),
    F: (x) => -Math.cos(2 * x) / 2,
    domain: [0, Math.PI],
    niceBounds: [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI],
  },
  {
    id: "sr-cos-half-x",
    label: "f(x) = cos(0,5x)",
    f: (x) => Math.cos(0.5 * x),
    F: (x) => 2 * Math.sin(0.5 * x),
    domain: [0, 4 * Math.PI],
    niceBounds: [0, Math.PI, 2 * Math.PI, 3 * Math.PI, 4 * Math.PI],
  },
  {
    id: "sr-exp-2x",
    label: "f(x) = e^(2x)",
    f: (x) => Math.exp(2 * x),
    F: (x) => Math.exp(2 * x) / 2,
    domain: [0, 2],
  },
  {
    id: "sr-quad-3minusx",
    label: "f(x) = (3 − x)²",
    f: (x) => (3 - x) ** 2,
    F: (x) => -((3 - x) ** 3) / 3,
    domain: [0, 3],
  },
];

function makeSonderregelQuestion(mode) {
  const funcObj = Game.Questions.pickRandom(sonderregelPool);
  const [a, b] = Game.Questions.generateBounds(funcObj);
  const correctValue = Game.Questions.computeIntegral(funcObj, a, b);
  const question = { funcObj, a, b, correctValue, mode };
  if (mode === "mc") question.options = Game.Questions.generateMCOptions(correctValue);
  return question;
}

// --- Thema 2: Flaeche zwischen Graph und x-Achse (Wiederholung) ---

function makeFlaecheXAchseQuestion(mode) {
  const pool = Game.functionPool.filter((f) => f.category === "signed");
  const funcObj = Game.Questions.pickRandom(pool);
  const [a, b] = Game.Questions.generateBounds(funcObj);
  const correctValue = Game.Questions.computeIntegral(funcObj, a, b);
  const question = { funcObj, a, b, correctValue, mode };
  if (mode === "mc") question.options = Game.Questions.generateMCOptions(correctValue);
  return question;
}

// --- Thema 3: Flaeche zwischen zwei Graphen ---
// Jedes Paar hat bekannte, ganzzahlige Schnittstellen x1 < x2, und f >= g auf
// [x1, x2] (per Konstruktion sichergestellt) - deshalb ist die Flaeche
// einfach H(x2) - H(x1) mit H als Stammfunktion von h = f - g.

const graphPairPool = [
  {
    id: "gp-linie-parabel-1",
    fLabel: "f(x) = x + 2",
    gLabel: "g(x) = x²",
    f: (x) => x + 2,
    g: (x) => x * x,
    H: (x) => -(x ** 3) / 3 + (x * x) / 2 + 2 * x,
    x1: -1,
    x2: 2,
  },
  {
    id: "gp-konstante-parabel",
    fLabel: "f(x) = 4",
    gLabel: "g(x) = x²",
    f: () => 4,
    g: (x) => x * x,
    H: (x) => 4 * x - (x ** 3) / 3,
    x1: -2,
    x2: 2,
  },
  {
    id: "gp-parabel-linie",
    fLabel: "f(x) = −x² + 4x",
    gLabel: "g(x) = x",
    f: (x) => -(x * x) + 4 * x,
    g: (x) => x,
    H: (x) => -(x ** 3) / 3 + 1.5 * x * x,
    x1: 0,
    x2: 3,
  },
  {
    id: "gp-linie-parabel-2",
    fLabel: "f(x) = x + 4",
    gLabel: "g(x) = 0,5x²",
    f: (x) => x + 4,
    g: (x) => 0.5 * x * x,
    H: (x) => (x * x) / 2 + 4 * x - (x ** 3) / 6,
    x1: -2,
    x2: 4,
  },
];

function makeFlaecheGraphenQuestion(mode) {
  const pair = Game.Questions.pickRandom(graphPairPool);
  const correctValue = pair.H(pair.x2) - pair.H(pair.x1);
  const legend = `
    <div class="legend">
      <span class="curve-f">${pair.fLabel}</span>
      <span class="curve-g">${pair.gLabel}</span>
    </div>`;
  const question = {
    kind: "graph",
    drawMode: "between",
    mode,
    prompt: `Die Graphen von ${pair.fLabel} und ${pair.gLabel} schneiden sich bei x = ${pair.x1} und x = ${pair.x2} (markiert). Berechne die Fläche, die von den beiden Graphen eingeschlossen wird.`,
    legend,
    funcObj: { f: pair.f },
    gFuncObj: { f: pair.g },
    domain: [pair.x1, pair.x2],
    a: pair.x1,
    b: pair.x2,
    correctValue,
  };
  if (mode === "mc") {
    question.options = Game.Questions.generateMCOptions(correctValue).map((o) => ({
      value: `${formatNum(o.value)} FE`,
      correct: o.correct,
    }));
  }
  return question;
}

Game.modules.kaTraining = {
  id: "kaTraining",
  title: "Mathe 13 - Kasl-Training",
  subjectTrack: "mathe-13",
  description:
    "Wiederholung für die Klassenarbeit: Sonderregeln der Integration, Fläche zwischen Graph und x-Achse, Fläche zwischen zwei Graphen.",
  levels: [
    {
      id: "sonderregeln",
      title: "Sonderregeln der Integration",
      description: "Stammfunktion von f(ax+b) - Faktor 1/a nicht vergessen.",
      mode: "mc",
      questionCount: 6,
      kind: "sonderregeln",
    },
    {
      id: "flaeche-x-achse",
      title: "Fläche zwischen Graph und x-Achse",
      description: "Wiederholung der Flächenbilanz.",
      mode: "mc",
      questionCount: 6,
      kind: "flaeche-x-achse",
    },
    {
      id: "flaeche-graphen",
      title: "Fläche zwischen zwei Graphen",
      description: "Die Fläche, die von f und g gemeinsam eingeschlossen wird.",
      mode: "mc",
      questionCount: 6,
      kind: "flaeche-graphen",
    },
    {
      id: "profi",
      title: "Profi: Alles gemischt",
      description: "Alle drei Themen gemischt, Ergebnis selbst eingeben.",
      mode: "numeric",
      questionCount: 6,
      kind: "profi",
    },
  ],

  generateQuestions(levelDef) {
    const questions = [];
    for (let i = 0; i < levelDef.questionCount; i++) {
      let question;
      if (levelDef.kind === "sonderregeln") {
        question = makeSonderregelQuestion(levelDef.mode);
      } else if (levelDef.kind === "flaeche-x-achse") {
        question = makeFlaecheXAchseQuestion(levelDef.mode);
      } else if (levelDef.kind === "flaeche-graphen") {
        question = makeFlaecheGraphenQuestion(levelDef.mode);
      } else {
        const maker = Game.Questions.pickRandom([
          makeSonderregelQuestion,
          makeFlaecheXAchseQuestion,
          makeFlaecheGraphenQuestion,
        ]);
        question = maker(levelDef.mode);
      }
      questions.push(question);
    }
    return questions;
  },
};
