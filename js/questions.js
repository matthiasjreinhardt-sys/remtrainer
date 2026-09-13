// Generische, modul-unabhaengige Helfer zum Erzeugen von Aufgaben:
// Integrationsgrenzen waehlen, den exakten Integralwert berechnen und
// plausible Multiple-Choice-Distraktoren (typische Fehler) generieren.

window.Game = window.Game || {};

Game.Questions = {
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // Liefert eine zufaellig gemischte Kopie von arr (Fisher-Yates), laesst
  // das Original unveraendert.
  shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },

  // Waehlt n zufaellige, unterschiedliche Eintraege aus pool (ohne
  // Zuruecklegen). Ist n >= pool.length, wird der ganze Pool gemischt
  // zurueckgegeben.
  sampleWithoutReplacement(pool, n) {
    return this.shuffle(pool).slice(0, n);
  },

  round2(n) {
    return Math.round(n * 100) / 100;
  },

  // Waehlt Integrationsgrenzen a < b. Funktionen mit "niceBounds" (z.B. sin)
  // bekommen Grenzen aus dieser Liste, damit F(a)/F(b) schoene Werte ergeben.
  // Sonst werden ganzzahlige Grenzen innerhalb des Definitionsbereichs gewaehlt.
  generateBounds(funcObj) {
    if (funcObj.niceBounds && funcObj.niceBounds.length >= 2) {
      const pts = funcObj.niceBounds;
      const i = this.randomInt(0, pts.length - 2);
      const j = this.randomInt(i + 1, pts.length - 1);
      return [pts[i], pts[j]];
    }
    const [lo, hi] = funcObj.domain;
    const a = this.randomInt(lo, hi - 1);
    const b = this.randomInt(a + 1, hi);
    return [a, b];
  },

  computeIntegral(funcObj, a, b) {
    return funcObj.F(b) - funcObj.F(a);
  },

  // Erzeugt 4 Antwortoptionen: den korrekten Wert plus Distraktoren, die
  // typischen Fehlern entsprechen (Vorzeichen vertauscht, falscher Faktor, ...).
  generateMCOptions(correctValue) {
    const correct = this.round2(correctValue);
    const values = [correct];

    const candidates = [
      -correctValue,
      correctValue * 0.5,
      correctValue * 1.5,
      correctValue * -0.5,
      correctValue + (Math.random() < 0.5 ? 1 : -1) * (1 + Math.random() * 3),
      correctValue - (Math.random() < 0.5 ? 1 : -1) * (1 + Math.random() * 3),
    ];
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    for (const c of candidates) {
      if (values.length >= 4) break;
      const rc = this.round2(c);
      if (values.every((v) => Math.abs(v - rc) > 0.15)) values.push(rc);
    }
    let guard = 0;
    while (values.length < 4 && guard < 20) {
      const rc = this.round2(correctValue + (Math.random() * 8 - 4));
      if (values.every((v) => Math.abs(v - rc) > 0.15)) values.push(rc);
      guard++;
    }

    const options = values.map((v) => ({ value: v, correct: v === correct }));
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  },
};
