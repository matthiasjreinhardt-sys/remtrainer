// Spielmodul "Python-Listen" (Informatik 11): Listen erstellen und
// indizieren, veraendern (append/pop/remove), durchlaufen mit for, und
// weitere Werkzeuge (in, min/max/sum, Slicing, Verkettung). Bewusst OHNE
// Sortieralgorithmen. Kuratierter Fragenpool wie bei den anderen
// Python-Modulen, Auswahl und Antwortreihenfolge zufaellig.

window.Game = window.Game || {};
Game.modules = Game.modules || {};

Game.modules.pythonListen = {
  id: "pythonListen",
  title: "Informatik 11 - Python-Listen",
  subjectTrack: "informatik-11",
  description: "Listen erstellen, verändern, durchlaufen und weitere Listen-Werkzeuge (ohne Sortieralgorithmen).",
  levels: [
    {
      id: "erstellen-indizieren",
      title: "Listen erstellen & indizieren",
      description: "Index (ab 0, auch negativ), len().",
      questionCount: 6,
      pool: [
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahlen = [10, 20, 30, 40]\nprint(zahlen[1])",
          options: [
            { value: "20", correct: true },
            { value: "10", correct: false },
            { value: "30", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahlen = [10, 20, 30, 40]\nprint(zahlen[-1])",
          options: [
            { value: "40", correct: true },
            { value: "10", correct: false },
            { value: "30", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'namen = ["Anna", "Ben", "Cem"]\nprint(len(namen))',
          options: [
            { value: "3", correct: true },
            { value: "2", correct: false },
            { value: "4", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahlen = [5, 10, 15]\nprint(zahlen[3])",
          options: [
            { value: "Fehler (IndexError)", correct: true },
            { value: "15", correct: false },
            { value: "0", correct: false },
            { value: "Nichts", correct: false },
          ],
        },
        {
          prompt: "Mit welchem Index greift man in Python auf das erste Element einer Liste zu?",
          options: [
            { value: "0", correct: true },
            { value: "1", correct: false },
            { value: "-1", correct: false },
            { value: "Mit dem Namen des Elements", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "liste = []\nprint(len(liste))",
          options: [
            { value: "0", correct: true },
            { value: "Fehler", correct: false },
            { value: "None", correct: false },
            { value: "1", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'gemischt = [1, "zwei", 3.0, True]\nprint(gemischt[2])',
          options: [
            { value: "3.0", correct: true },
            { value: "zwei", correct: false },
            { value: "1", correct: false },
            { value: "True", correct: false },
          ],
        },
      ],
    },
    {
      id: "veraendern",
      title: "Listen verändern",
      description: "append(), Index-Zuweisung, pop(), remove().",
      questionCount: 6,
      pool: [
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahlen = [1, 2, 3]\nzahlen.append(4)\nprint(zahlen)",
          options: [
            { value: "[1, 2, 3, 4]", correct: true },
            { value: "[4, 1, 2, 3]", correct: false },
            { value: "[1, 2, 3]", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahlen = [1, 2, 3]\nzahlen[0] = 99\nprint(zahlen)",
          options: [
            { value: "[99, 2, 3]", correct: true },
            { value: "[1, 2, 99]", correct: false },
            { value: "[99, 1, 2, 3]", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'namen = ["Anna", "Ben", "Cem"]\nnamen.remove("Ben")\nprint(namen)',
          options: [
            { value: "['Anna', 'Cem']", correct: true },
            { value: "['Anna', 'Ben']", correct: false },
            { value: "['Ben', 'Cem']", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahlen = [1, 2, 3, 4]\nzahlen.pop()\nprint(zahlen)",
          options: [
            { value: "[1, 2, 3]", correct: true },
            { value: "[2, 3, 4]", correct: false },
            { value: "[1, 2, 3, 4]", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was macht liste.append(x)?",
          options: [
            { value: "Fügt x am Ende der Liste hinzu", correct: true },
            { value: "Fügt x am Anfang der Liste hinzu", correct: false },
            { value: "Entfernt x aus der Liste", correct: false },
            { value: "Ersetzt alle Elemente durch x", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahlen = [1, 2, 3]\nzahlen.append(4)\nprint(len(zahlen))",
          options: [
            { value: "4", correct: true },
            { value: "3", correct: false },
            { value: "5", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "liste = [10, 20, 30]\nliste.pop(0)\nprint(liste)",
          options: [
            { value: "[20, 30]", correct: true },
            { value: "[10, 20]", correct: false },
            { value: "[10, 30]", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
      ],
    },
    {
      id: "durchlaufen",
      title: "Listen durchlaufen",
      description: "for-Schleife über eine Liste, kombiniert mit Zählen/Summieren.",
      questionCount: 6,
      pool: [
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahlen = [1, 2, 3]\nsumme = 0\nfor z in zahlen:\n    summe = summe + z\nprint(summe)",
          options: [
            { value: "6", correct: true },
            { value: "3", correct: false },
            { value: "0", correct: false },
            { value: "123", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'namen = ["Anna", "Ben", "Cem"]\nfor n in namen:\n    print(n)',
          options: [
            { value: "Anna, Ben, Cem (drei Zeilen)", correct: true },
            { value: "nur Anna", correct: false },
            { value: "['Anna', 'Ben', 'Cem']", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahlen = [2, 5, 8, 11]\nanzahl = 0\nfor z in zahlen:\n    if z % 2 == 0:\n        anzahl = anzahl + 1\nprint(anzahl)",
          options: [
            { value: "2", correct: true },
            { value: "1", correct: false },
            { value: "3", correct: false },
            { value: "4", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahlen = [4, 7, 2, 9]\ngroesste = 0\nfor z in zahlen:\n    if z > groesste:\n        groesste = z\nprint(groesste)",
          options: [
            { value: "9", correct: true },
            { value: "7", correct: false },
            { value: "4", correct: false },
            { value: "2", correct: false },
          ],
        },
        {
          prompt: "Was passiert beim Durchlaufen mit for element in liste:?",
          options: [
            { value: "element nimmt der Reihe nach jeden Wert aus liste an", correct: true },
            { value: "element ist immer der erste Wert der Liste", correct: false },
            { value: "liste wird dabei gelöscht", correct: false },
            { value: "Es wird nur einmal durchlaufen, unabhängig von der Länge", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'woerter = ["Hallo", "Welt"]\nergebnis = ""\nfor w in woerter:\n    ergebnis = ergebnis + w\nprint(ergebnis)',
          options: [
            { value: "HalloWelt", correct: true },
            { value: "Hallo Welt", correct: false },
            { value: "WeltHallo", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahlen = [3, 1, 4, 1, 5]\nsumme = 0\nanzahl = 0\nfor z in zahlen:\n    summe = summe + z\n    anzahl = anzahl + 1\nprint(summe / anzahl)",
          options: [
            { value: "2.8", correct: true },
            { value: "2", correct: false },
            { value: "14", correct: false },
            { value: "5", correct: false },
          ],
        },
      ],
    },
    {
      id: "weitere-werkzeuge",
      title: "Weitere Listen-Werkzeuge",
      description: "in-Operator, min()/max()/sum(), Slicing, Verkettung mit +.",
      questionCount: 6,
      pool: [
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahlen = [1, 2, 3, 4]\nprint(3 in zahlen)",
          options: [
            { value: "True", correct: true },
            { value: "False", correct: false },
            { value: "3", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'namen = ["Anna", "Ben"]\nprint("Cem" in namen)',
          options: [
            { value: "False", correct: true },
            { value: "True", correct: false },
            { value: "Fehler", correct: false },
            { value: "Cem", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahlen = [4, 1, 9, 2]\nprint(max(zahlen))",
          options: [
            { value: "9", correct: true },
            { value: "1", correct: false },
            { value: "4", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahlen = [4, 1, 9, 2]\nprint(min(zahlen))",
          options: [
            { value: "1", correct: true },
            { value: "9", correct: false },
            { value: "4", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahlen = [1, 2, 3, 4, 5]\nprint(sum(zahlen))",
          options: [
            { value: "15", correct: true },
            { value: "5", correct: false },
            { value: "1", correct: false },
            { value: "120", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahlen = [10, 20, 30, 40, 50]\nprint(zahlen[1:3])",
          options: [
            { value: "[20, 30]", correct: true },
            { value: "[10, 20, 30]", correct: false },
            { value: "[20, 30, 40]", correct: false },
            { value: "[10, 20]", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "a = [1, 2]\nb = [3, 4]\nprint(a + b)",
          options: [
            { value: "[1, 2, 3, 4]", correct: true },
            { value: "[4, 6]", correct: false },
            { value: "[1, 2, 3, 4, 3, 4]", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
      ],
    },
  ],

  generateQuestions(levelDef) {
    const picked = Game.Questions.sampleWithoutReplacement(levelDef.pool, levelDef.questionCount);
    return picked.map((item) => ({
      kind: "code",
      mode: "mc",
      prompt: item.prompt,
      code: item.code || null,
      options: Game.Questions.shuffle(item.options),
    }));
  },
};
