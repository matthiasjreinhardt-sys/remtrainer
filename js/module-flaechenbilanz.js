// Spielmodul "Flaechenbilanz": definiert Levels (Schwierigkeitsstufen)
// und erzeugt daraus konkrete Aufgaben aus dem Funktionspool.

window.Game = window.Game || {};
Game.modules = Game.modules || {};

Game.modules.flaechenbilanz = {
  id: "flaechenbilanz",
  title: "Q13 - Integral - Flächenbilanz",
  subjectTrack: "mathe-13",
  description:
    "Bestimme Integrale als Summe vorzeichenbehafteter Flächen zwischen Graph und x-Achse.",
  levels: [
    {
      id: "einstieg",
      title: "Einstieg",
      description: "Flächen oberhalb der x-Achse, Multiple Choice.",
      category: "easy",
      mode: "mc",
      questionCount: 6,
    },
    {
      id: "bilanz",
      title: "Flächenbilanz",
      description: "Mit Vorzeichenwechsel, Multiple Choice.",
      category: "signed",
      mode: "mc",
      questionCount: 6,
    },
    {
      id: "vertauscht",
      title: "Vertauschte Grenzen",
      description: "Meist geht's von der größeren zur kleineren Grenze. Achte aufs Vorzeichen!",
      category: "signed",
      mode: "mc",
      questionCount: 6,
      swapProbability: 0.75,
    },
    {
      id: "profi",
      title: "Profi",
      description: "Exakten Integralwert selbst eingeben.",
      category: "signed",
      mode: "numeric",
      questionCount: 6,
    },
  ],

  generateQuestions(levelDef) {
    const pool = Game.functionPool.filter((f) => f.category === levelDef.category);
    const questions = [];
    let lastId = null;
    for (let i = 0; i < levelDef.questionCount; i++) {
      let funcObj;
      do {
        funcObj = Game.Questions.pickRandom(pool);
      } while (pool.length > 1 && funcObj.id === lastId);
      lastId = funcObj.id;

      let [a, b] = Game.Questions.generateBounds(funcObj);
      if (levelDef.swapProbability && Math.random() < levelDef.swapProbability) {
        [a, b] = [b, a];
      }
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
