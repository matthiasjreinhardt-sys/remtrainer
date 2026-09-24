// Spielmodul "Integralfunktion" (Mathe 13): I(x) = Integral von a bis x
// ueber f(t) dt, rein grafisch/qualitativ ueber den Zusammenhang zwischen
// dem Verlauf von f (Integrandenfunktion) und dem Verlauf von I (Integral-
// funktion) - bewusst OHNE Stammfunktions-Berechnung durch die Schueler
// (Hauptsatz kommt erst spaeter). Die Stammfunktion wird intern trotzdem
// verwendet, um bei den Vergleichs-Aufgaben (Profi-Level) die korrekte
// Antwort zuverlaessig zu bestimmen - das sieht der Schueler nie.
//
// Zusammenhaenge, die hier trainiert werden:
//  - I(a) = 0
//  - f(t) > 0 auf einem Intervall  -> I dort streng monoton steigend
//  - f(t) < 0 auf einem Intervall  -> I dort streng monoton fallend
//  - Vorzeichenwechsel von f (Nullstelle mit VZW) -> Extremstelle von I
//    (+ nach - : Maximum von I; - nach + : Minimum von I)
//  - Extremstelle von f selbst (kein VZW, nur Hoch-/Tiefpunkt von f)
//    -> Wendepunkt von I (dort aendert sich die Kruemmung von I,
//       die Steigung von I ist dort am groessten/kleinsten)

window.Game = window.Game || {};
Game.modules = Game.modules || {};

// --- Bausteine: parametrisierte Funktionen mit bekannten Eigenschaften ---

function templateLinear() {
  const direction = Game.Questions.pickRandom([1, -1]);
  const k = Game.Questions.randomInt(-2, 2);
  const domain = [k - 4, k + 4];
  const label =
    direction === 1
      ? `f(x) = x ${k >= 0 ? "−" : "+"} ${Math.abs(k)}`
      : `f(x) = −(x ${k >= 0 ? "−" : "+"} ${Math.abs(k)})`;
  return {
    f: (x) => direction * (x - k),
    F: (x) => direction * ((x - k) ** 2 / 2),
    domain,
    label,
    zero: k,
    extremumType: direction === 1 ? "Minimum" : "Maximum",
  };
}

function templateQuadraticTwoZeros() {
  const opensUp = Game.Questions.pickRandom([true, false]);
  const s = opensUp ? 1 : -1;
  const p = Game.Questions.randomInt(-3, 0);
  const q = p + Game.Questions.randomInt(3, 5);
  const domain = [p - 2, q + 2];
  const vertexX = (p + q) / 2;
  const label = `f(x) = ${opensUp ? "" : "−"}(x ${p >= 0 ? "−" : "+"} ${Math.abs(p)})(x ${
    q >= 0 ? "−" : "+"
  } ${Math.abs(q)})`;
  return {
    f: (x) => s * (x - p) * (x - q),
    F: (x) => s * (x ** 3 / 3 - (p + q) * (x ** 2 / 2) + p * q * x),
    domain,
    label,
    zeros: [p, q],
    extrema: opensUp
      ? [
          { x: p, type: "Maximum" },
          { x: q, type: "Minimum" },
        ]
      : [
          { x: p, type: "Minimum" },
          { x: q, type: "Maximum" },
        ],
    inflection: { x: vertexX, steepest: opensUp ? "fallend" : "steigend" },
  };
}

function templateHumpNoZero() {
  const positive = Game.Questions.pickRandom([true, false]);
  const sign = positive ? 1 : -1;
  const m = Game.Questions.randomInt(-1, 1);
  const h = Game.Questions.randomInt(5, 6);
  const domain = [m - 2, m + 2];
  const label = `f(x) = ${sign === 1 ? "" : "−"}(${h} − (x ${m >= 0 ? "−" : "+"} ${Math.abs(m)})²)`;
  return {
    f: (x) => sign * (h - (x - m) ** 2),
    F: (x) => sign * (h * x - (x - m) ** 3 / 3),
    domain,
    label,
    monotone: positive ? "steigend" : "fallend",
    inflection: { x: m, steepest: positive ? "steigend" : "fallend" },
  };
}

function withGraph(t) {
  return { f: t.f, domain: t.domain };
}

// --- Level "Grundlagen": rein begrifflich, ohne Graph ---

const grundlagenPool = [
  {
    prompt: "Was beschreibt I(x) = ∫ₐˣ f(t) dt anschaulich?",
    options: [
      { value: "Die Flächenbilanz zwischen dem Graphen von f und der x-Achse im Intervall [a,x]", correct: true },
      { value: "Die Steigung von f an der Stelle x", correct: false },
      { value: "Den Funktionswert f(x)", correct: false },
      { value: "Die Ableitung von f an der Stelle x", correct: false },
    ],
  },
  {
    prompt: "Was gilt für I(a), also für die untere Grenze selbst?",
    options: [
      { value: "I(a) = 0", correct: true },
      { value: "I(a) = f(a)", correct: false },
      { value: "I(a) ist nicht definiert", correct: false },
      { value: "I(a) hängt vom Vorzeichen von f ab", correct: false },
    ],
  },
  {
    prompt: "In einem Bereich, in dem f(t) > 0 gilt, ist I(x)...",
    options: [
      { value: "streng monoton steigend", correct: true },
      { value: "streng monoton fallend", correct: false },
      { value: "konstant", correct: false },
      { value: "dort nicht definiert", correct: false },
    ],
  },
  {
    prompt: "In einem Bereich, in dem f(t) < 0 gilt, ist I(x)...",
    options: [
      { value: "streng monoton fallend", correct: true },
      { value: "streng monoton steigend", correct: false },
      { value: "konstant", correct: false },
      { value: "dort nicht definiert", correct: false },
    ],
  },
  {
    prompt: "An einer Nullstelle von f mit Vorzeichenwechsel hat I(x)...",
    options: [
      { value: "eine Extremstelle", correct: true },
      { value: "eine Nullstelle", correct: false },
      { value: "einen Wendepunkt", correct: false },
      { value: "eine Definitionslücke", correct: false },
    ],
  },
  {
    prompt: "Wechselt f an einer Nullstelle das Vorzeichen von + nach −, hat I(x) dort ein...",
    options: [
      { value: "Maximum", correct: true },
      { value: "Minimum", correct: false },
      { value: "Sattelpunkt", correct: false },
      { value: "keine besondere Stelle", correct: false },
    ],
  },
  {
    prompt: "Wechselt f an einer Nullstelle das Vorzeichen von − nach +, hat I(x) dort ein...",
    options: [
      { value: "Minimum", correct: true },
      { value: "Maximum", correct: false },
      { value: "Sattelpunkt", correct: false },
      { value: "keine besondere Stelle", correct: false },
    ],
  },
  {
    prompt: "f selbst (nicht I!) hat an einer Stelle ein lokales Extremum (Hoch- oder Tiefpunkt). Was hat I(x) dort?",
    options: [
      { value: "einen Wendepunkt", correct: true },
      { value: "eine Extremstelle", correct: false },
      { value: "eine Nullstelle", correct: false },
      { value: "nichts Besonderes", correct: false },
    ],
  },
];

function generateGrundlagenQuestions(levelDef) {
  const picked = Game.Questions.sampleWithoutReplacement(grundlagenPool, levelDef.questionCount);
  return picked.map((item) => ({
    kind: "code",
    mode: "mc",
    prompt: item.prompt,
    code: null,
    options: Game.Questions.shuffle(item.options),
  }));
}

// --- Level "Monotonie & Extremstellen" (Graph, linear + quadratisch) ---

function genLinearExtremstelle() {
  const t = templateLinear();
  const wrongType = t.extremumType === "Minimum" ? "Maximum" : "Minimum";
  return {
    prompt: `${t.label}. Betrachte I(x) = ∫ₐˣ f(t) dt mit a = ${t.domain[0]} (linker Rand). An welcher Stelle hat I(x) eine Extremstelle, und um welche Art handelt es sich?`,
    funcObj: withGraph(t),
    a: t.domain[0],
    b: t.domain[1],
    options: Game.Questions.shuffle([
      { value: `${t.extremumType} bei x = ${t.zero}`, correct: true },
      { value: `${wrongType} bei x = ${t.zero}`, correct: false },
      { value: `${t.extremumType} bei x = ${t.domain[0]}`, correct: false },
      { value: "I(x) hat keine Extremstelle", correct: false },
    ]),
  };
}

function genQuadraticExtremstellen() {
  const t = templateQuadraticTwoZeros();
  const [e1, e2] = t.extrema;
  const swapped = [
    { x: e1.x, type: e2.type },
    { x: e2.x, type: e1.type },
  ];
  return {
    prompt: `${t.label}. Betrachte I(x) = ∫ₐˣ f(t) dt mit a = ${t.domain[0]} (linker Rand). Welche Extremstellen hat I(x)?`,
    funcObj: withGraph(t),
    a: t.domain[0],
    b: t.domain[1],
    options: Game.Questions.shuffle([
      { value: `${e1.type} bei x = ${e1.x}, ${e2.type} bei x = ${e2.x}`, correct: true },
      { value: `${swapped[0].type} bei x = ${swapped[0].x}, ${swapped[1].type} bei x = ${swapped[1].x}`, correct: false },
      { value: `nur eine Extremstelle bei x = ${e1.x}`, correct: false },
      { value: "I(x) hat keine Extremstelle", correct: false },
    ]),
  };
}

// --- Level "Wendepunkte" (Graph, Extremum von f selbst) ---

function genQuadraticWendepunkt() {
  const t = templateQuadraticTwoZeros();
  const wrongSteepest = t.inflection.steepest === "steigend" ? "fallend" : "steigend";
  return {
    prompt: `${t.label}. Betrachte I(x) = ∫ₐˣ f(t) dt mit a = ${t.domain[0]}. An welcher Stelle hat I(x) einen Wendepunkt, und wie verläuft I(x) dort?`,
    funcObj: withGraph(t),
    a: t.domain[0],
    b: t.domain[1],
    options: Game.Questions.shuffle([
      { value: `Wendepunkt bei x = ${t.inflection.x}, dort am stärksten ${t.inflection.steepest}`, correct: true },
      { value: `Wendepunkt bei x = ${t.inflection.x}, dort am stärksten ${wrongSteepest}`, correct: false },
      { value: `Extremstelle bei x = ${t.inflection.x}`, correct: false },
      { value: "I(x) hat keinen Wendepunkt", correct: false },
    ]),
  };
}

function genHumpWendepunkt() {
  const t = templateHumpNoZero();
  const wrongSteepest = t.inflection.steepest === "steigend" ? "fallend" : "steigend";
  return {
    prompt: `${t.label}. Betrachte I(x) = ∫ₐˣ f(t) dt mit a = ${t.domain[0]}. I(x) ist auf dem ganzen gezeigten Bereich ${t.monotone}. An welcher Stelle hat I(x) einen Wendepunkt (die größte bzw. kleinste Steigung)?`,
    funcObj: withGraph(t),
    a: t.domain[0],
    b: t.domain[1],
    options: Game.Questions.shuffle([
      { value: `Wendepunkt bei x = ${t.inflection.x}, dort am stärksten ${t.inflection.steepest}`, correct: true },
      { value: `Wendepunkt bei x = ${t.inflection.x}, dort am stärksten ${wrongSteepest}`, correct: false },
      { value: `Wendepunkt am linken Rand x = ${t.domain[0]}`, correct: false },
      { value: "I(x) hat keinen Wendepunkt", correct: false },
    ]),
  };
}

// --- Level "Profi": Flächenvergleich ohne Rechnung ---

function genVorzeichenAmRand() {
  const t = templateQuadraticTwoZeros();
  const a = t.domain[0];
  const b = t.domain[1];
  const totalSigned = t.F(b) - t.F(a);
  let correctSign;
  if (Math.abs(totalSigned) < 0.3) correctSign = "ungefähr Null";
  else correctSign = totalSigned > 0 ? "positiv" : "negativ";
  const allSigns = ["positiv", "negativ", "ungefähr Null"];
  return {
    prompt: `${t.label}. I(x) = ∫ₐˣ f(t) dt mit a = ${a} (linker Rand). Ist I(b) am rechten markierten Rand (x = ${b}) positiv, negativ oder ungefähr Null? Schätze anhand der eingefärbten Flächen ab - keine Rechnung nötig.`,
    funcObj: withGraph(t),
    a,
    b,
    options: Game.Questions.shuffle([
      { value: correctSign, correct: true },
      ...allSigns.filter((s) => s !== correctSign).map((s) => ({ value: s, correct: false })),
      { value: "kann man ohne Rechnung nicht sagen", correct: false },
    ]),
  };
}

function genVergleichZweiStellen() {
  const t = templateQuadraticTwoZeros();
  const a = t.domain[0];
  const [x1, x2] = t.zeros;
  const I1 = t.F(x1) - t.F(a);
  const I2 = t.F(x2) - t.F(a);
  let correct;
  if (Math.abs(I1 - I2) < 0.3) correct = `I(${x1}) und I(${x2}) sind ungefähr gleich groß`;
  else if (I1 > I2) correct = `I(${x1}) ist größer als I(${x2})`;
  else correct = `I(${x2}) ist größer als I(${x1})`;
  return {
    prompt: `${t.label}. I(x) = ∫ₐˣ f(t) dt mit a = ${a} (linker Rand, gezeigt bis x = ${t.domain[1]}). Vergleiche I(${x1}) und I(${x2}) anhand der Flächen - keine Rechnung nötig.`,
    funcObj: withGraph(t),
    a,
    b: t.domain[1],
    options: Game.Questions.shuffle([
      { value: correct, correct: true },
      ...[`I(${x1}) ist größer als I(${x2})`, `I(${x2}) ist größer als I(${x1})`, `I(${x1}) und I(${x2}) sind ungefähr gleich groß`]
        .filter((v) => v !== correct)
        .map((v) => ({ value: v, correct: false })),
      { value: "kann man ohne Rechnung nicht sagen", correct: false },
    ]),
  };
}

Game.modules.integralfunktion = {
  id: "integralfunktion",
  title: "Mathe 13 - Integralfunktion",
  subjectTrack: "mathe-13",
  description:
    "Wie hängt der Verlauf der Integralfunktion I(x) = ∫ₐˣ f(t) dt vom Verlauf der Integrandenfunktion f ab? Rein grafisch, ohne Stammfunktions-Berechnung.",
  levels: [
    {
      id: "grundlagen",
      title: "Grundlagen",
      description: "Was I(x) bedeutet und wie Vorzeichen von f sich auswirken.",
      questionCount: 6,
      generate: generateGrundlagenQuestions,
    },
    {
      id: "monotonie",
      title: "Monotonie & Extremstellen",
      description: "Vorzeichenwechsel von f → Extremstelle von I.",
      questionCount: 6,
      generators: [genLinearExtremstelle, genQuadraticExtremstellen],
    },
    {
      id: "wendepunkte",
      title: "Wendepunkte",
      description: "Extremstelle von f selbst → Wendepunkt von I.",
      questionCount: 6,
      generators: [genQuadraticWendepunkt, genHumpWendepunkt],
    },
    {
      id: "profi",
      title: "Profi: Flächenvergleich",
      description: "Vorzeichen und Größenvergleich von I(x) anhand der Fläche abschätzen.",
      questionCount: 6,
      generators: [genVorzeichenAmRand, genVergleichZweiStellen],
    },
  ],

  generateQuestions(levelDef) {
    if (levelDef.generate) return levelDef.generate(levelDef);
    const questions = [];
    for (let i = 0; i < levelDef.questionCount; i++) {
      const generator = Game.Questions.pickRandom(levelDef.generators);
      const item = generator();
      questions.push({
        kind: "graph",
        mode: "mc",
        prompt: item.prompt,
        funcObj: item.funcObj,
        a: item.a,
        b: item.b,
        options: item.options,
      });
    }
    return questions;
  },
};
