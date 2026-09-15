// Spielmodul "Kreisbewegung" (Physik 11): Grundgroessen der Kreisbewegung
// mit konstanter Winkelgeschwindigkeit - Frequenz f, Umlaufdauer T,
// Winkelgeschwindigkeit omega und Bahngeschwindigkeit v.
//
// Formeln: T = 1/f, omega = 2*pi/T = 2*pi*f, v = omega*r = 2*pi*r/T = 2*pi*r*f
//
// Wie beim Flaechenbilanz-Modul werden Aufgaben aus Formeln mit zufaelligen
// Werten generiert (nicht aus einem festen Pool wie beim Python-Modul), da
// hier ein kontinuierlicher Parameterraum existiert.

window.Game = window.Game || {};
Game.modules = Game.modules || {};

const TWO_PI = 2 * Math.PI;

// Radius- und Umlaufdauer-Bereiche realitaetsnah pro Objekt, damit z.B. ein
// Riesenrad nicht mit der Umlaufdauer eines Wäscheschleudergangs auftaucht.
const kreisObjekte = [
  { label: "ein Kettenkarussell", rMin: 3, rMax: 8, tMin: 3, tMax: 6 },
  { label: "ein Riesenrad", rMin: 8, rMax: 20, tMin: 60, tMax: 180 },
  { label: "ein Fahrradreifen", rMin: 0.25, rMax: 0.35, tMin: 0.3, tMax: 1.2 },
  { label: "eine Waschmaschinentrommel im Schleudergang", rMin: 0.2, rMax: 0.3, tMin: 0.04, tMax: 0.12 },
  { label: "ein Kinderkarussell", rMin: 1.5, rMax: 3, tMin: 4, tMax: 8 },
  { label: "ein Modellflugzeug an einer Leine", rMin: 5, rMax: 15, tMin: 2, tMax: 5 },
];

function pickKreisObjekt() {
  return Game.Questions.pickRandom(kreisObjekte);
}

function randomUmlaufdauer() {
  return Game.Questions.randomDecimal(0.5, 12, 1);
}

function randomFrequenz() {
  return Game.Questions.randomDecimal(0.1, 4, 2);
}

function randomObjektRadius(obj) {
  const decimals = obj.rMax < 1 ? 2 : obj.rMax > 5 ? 0 : 1;
  return Game.Questions.randomDecimal(obj.rMin, obj.rMax, decimals);
}

function randomObjektT(obj) {
  const decimals = obj.tMax < 1 ? 2 : 1;
  return Game.Questions.randomDecimal(obj.tMin, obj.tMax, decimals);
}

function buildKreisOptions(correctValue, distractors, unit) {
  const opts = Game.Questions.buildOptionsFromCandidates(correctValue, 2, distractors);
  return opts.map((o) => ({ value: `${formatNum(o.value)} ${unit}`, correct: o.correct }));
}

// --- Frequenz <-> Umlaufdauer (T = 1/f) ---
function questionTZuF() {
  const T = randomUmlaufdauer();
  const correct = 1 / T;
  return {
    prompt: "Wie groß ist die Frequenz f?",
    code: `Gegeben:\nT = ${formatNum(T)} s`,
    options: buildKreisOptions(correct, [T, correct * 2, correct / 2], "Hz"),
  };
}

function questionFZuT() {
  const f = randomFrequenz();
  const correct = 1 / f;
  return {
    prompt: "Wie groß ist die Umlaufdauer T?",
    code: `Gegeben:\nf = ${formatNum(f)} Hz`,
    options: buildKreisOptions(correct, [f, correct * 2, correct / 2], "s"),
  };
}

// --- Winkelgeschwindigkeit (omega = 2*pi/T = 2*pi*f) ---
function questionOmegaAusT() {
  const T = randomUmlaufdauer();
  const correct = TWO_PI / T;
  return {
    prompt: "Wie groß ist die Winkelgeschwindigkeit ω?",
    code: `Gegeben:\nT = ${formatNum(T)} s`,
    options: buildKreisOptions(correct, [1 / T, Math.PI / T, (4 * Math.PI) / T], "rad/s"),
  };
}

function questionOmegaAusF() {
  const f = randomFrequenz();
  const correct = TWO_PI * f;
  return {
    prompt: "Wie groß ist die Winkelgeschwindigkeit ω?",
    code: `Gegeben:\nf = ${formatNum(f)} Hz`,
    options: buildKreisOptions(correct, [f, Math.PI * f, 4 * Math.PI * f], "rad/s"),
  };
}

// --- Bahngeschwindigkeit (v = 2*pi*r/T = 2*pi*r*f) ---
function questionVAusRT() {
  const obj = pickKreisObjekt();
  const r = randomObjektRadius(obj);
  const T = randomObjektT(obj);
  const correct = (TWO_PI * r) / T;
  return {
    prompt: `Für ${obj.label} mit Bahnradius r: Wie groß ist die Bahngeschwindigkeit v?`,
    code: `Gegeben:\nr = ${formatNum(r)} m\nT = ${formatNum(T)} s`,
    options: buildKreisOptions(correct, [r / T, (Math.PI * r) / T, TWO_PI * r * T], "m/s"),
  };
}

function questionVAusRF() {
  const obj = pickKreisObjekt();
  const r = randomObjektRadius(obj);
  const T = randomObjektT(obj);
  const f = 1 / T;
  const correct = TWO_PI * r * f;
  return {
    prompt: `Für ${obj.label} mit Bahnradius r: Wie groß ist die Bahngeschwindigkeit v?`,
    code: `Gegeben:\nr = ${formatNum(r)} m\nf = ${formatNum(f)} Hz`,
    options: buildKreisOptions(correct, [r * f, Math.PI * r * f, (r * f) / TWO_PI], "m/s"),
  };
}

// --- Profi: umgestellte Formeln (r, omega, T aus v berechnen) ---
function questionRAusVOmega() {
  const obj = pickKreisObjekt();
  const r = randomObjektRadius(obj);
  const T = randomObjektT(obj);
  const omega = TWO_PI / T;
  const v = omega * r;
  const correct = v / omega;
  return {
    prompt: "Wie groß ist der Bahnradius r?",
    code: `Gegeben:\nv = ${formatNum(v)} m/s\nω = ${formatNum(omega)} rad/s`,
    options: buildKreisOptions(correct, [v * omega, omega / v, correct * 2], "m"),
  };
}

function questionOmegaAusVR() {
  const obj = pickKreisObjekt();
  const r = randomObjektRadius(obj);
  const T = randomObjektT(obj);
  const v = (TWO_PI * r) / T;
  const correct = v / r;
  return {
    prompt: `Für ${obj.label}: Wie groß ist die Winkelgeschwindigkeit ω?`,
    code: `Gegeben:\nv = ${formatNum(v)} m/s\nr = ${formatNum(r)} m`,
    options: buildKreisOptions(correct, [v * r, r / v, correct * TWO_PI], "rad/s"),
  };
}

function questionTAusVR() {
  const obj = pickKreisObjekt();
  const r = randomObjektRadius(obj);
  const T = randomObjektT(obj);
  const v = (TWO_PI * r) / T;
  const correct = (TWO_PI * r) / v;
  return {
    prompt: `Für ${obj.label}: Wie groß ist die Umlaufdauer T?`,
    code: `Gegeben:\nv = ${formatNum(v)} m/s\nr = ${formatNum(r)} m`,
    options: buildKreisOptions(correct, [r / v, (Math.PI * r) / v, (v * r) / TWO_PI], "s"),
  };
}

Game.modules.kreisbewegung = {
  id: "kreisbewegung",
  title: "Physik 11 - Kreisbewegung",
  subjectTrack: "physik-11",
  description:
    "Grundgrößen der Kreisbewegung mit konstanter Winkelgeschwindigkeit: Frequenz, Umlaufdauer, Winkelgeschwindigkeit, Bahngeschwindigkeit.",
  levels: [
    {
      id: "frequenz-umlaufdauer",
      title: "Frequenz & Umlaufdauer",
      description: "Der Zusammenhang T = 1/f.",
      questionCount: 6,
      generators: [questionTZuF, questionFZuT],
    },
    {
      id: "winkelgeschwindigkeit",
      title: "Winkelgeschwindigkeit",
      description: "ω = 2π/T = 2π·f",
      questionCount: 6,
      generators: [questionOmegaAusT, questionOmegaAusF],
    },
    {
      id: "bahngeschwindigkeit",
      title: "Bahngeschwindigkeit",
      description: "v = 2π·r/T = 2π·r·f",
      questionCount: 6,
      generators: [questionVAusRT, questionVAusRF],
    },
    {
      id: "profi",
      title: "Profi: Alles gemischt",
      description: "Auch umgestellte Formeln - r, ω oder T aus v berechnen.",
      questionCount: 6,
      generators: [
        questionTZuF,
        questionFZuT,
        questionOmegaAusT,
        questionOmegaAusF,
        questionVAusRT,
        questionVAusRF,
        questionRAusVOmega,
        questionOmegaAusVR,
        questionTAusVR,
      ],
    },
  ],

  generateQuestions(levelDef) {
    const questions = [];
    for (let i = 0; i < levelDef.questionCount; i++) {
      const generator = Game.Questions.pickRandom(levelDef.generators);
      const item = generator();
      questions.push({
        kind: "code",
        mode: "mc",
        prompt: item.prompt,
        code: item.code,
        options: item.options,
      });
    }
    return questions;
  },
};
