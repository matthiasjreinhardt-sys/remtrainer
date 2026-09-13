// Spielmodul "Python-Einstieg" (Informatik 11): feste, kuratierte
// Multiple-Choice-Fragen zu print(), Variablen/Zuweisung, Datentypen und
// input(). Anders als beim Flaechenbilanz-Modul gibt es hier keinen
// Zufallsgenerator fuer Aufgaben (keine "unendliche" Variation moeglich bei
// Konzeptfragen) - stattdessen wird pro Level aus einem festen Fragenpool
// zufaellig gemischt und ausgewaehlt.

window.Game = window.Game || {};
Game.modules = Game.modules || {};

Game.modules.pythonEinstieg = {
  id: "pythonEinstieg",
  title: "Informatik 11 - Einstieg in Python",
  subjectTrack: "informatik-11",
  description: "print(), Variablen, Datentypen und input() - die ersten Bausteine in Python.",
  levels: [
    {
      id: "print",
      title: "Ausgabe mit print()",
      description: "Was gibt der Code auf dem Bildschirm aus?",
      questionCount: 6,
      pool: [
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'print("Hallo Welt")',
          options: [
            { value: "Hallo Welt", correct: true },
            { value: '"Hallo Welt"', correct: false },
            { value: "Hallo", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "print(3 + 4)",
          options: [
            { value: "7", correct: true },
            { value: "3 + 4", correct: false },
            { value: '"7"', correct: false },
            { value: "34", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'print("3" + "4")',
          options: [
            { value: "34", correct: true },
            { value: "7", correct: false },
            { value: "Fehler", correct: false },
            { value: '"3" "4"', correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'print("Alter:", 16)',
          options: [
            { value: "Alter: 16", correct: true },
            { value: "Alter:16", correct: false },
            { value: "Alter, 16", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'print("Es ist " + str(5) + " Uhr")',
          options: [
            { value: "Es ist 5 Uhr", correct: true },
            { value: "Es ist  Uhr", correct: false },
            { value: "Fehler (TypeError)", correct: false },
            { value: "Es ist str(5) Uhr", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "x = 5\nprint(x)",
          options: [
            { value: "5", correct: true },
            { value: "x", correct: false },
            { value: '"x"', correct: false },
            { value: "Fehler", correct: false },
          ],
        },
      ],
    },
    {
      id: "variablen",
      title: "Variablen & Zuweisung",
      description: "Was bedeutet '=' und wie verändern sich Variablenwerte?",
      questionCount: 6,
      pool: [
        {
          prompt: "Was gibt dieser Code aus?",
          code: "x = 5\nx = x + 1\nprint(x)",
          options: [
            { value: "6", correct: true },
            { value: "5", correct: false },
            { value: "x + 1", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "a = 3\nb = a\na = 10\nprint(b)",
          options: [
            { value: "3", correct: true },
            { value: "10", correct: false },
            { value: "13", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was bedeutet der Operator '=' in Python?",
          options: [
            { value: "Weist der Variable links einen Wert zu", correct: true },
            { value: "Prüft, ob zwei Werte gleich sind", correct: false },
            { value: "Vergleicht zwei Variablen", correct: false },
            { value: "Vertauscht zwei Werte", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'name = "Anna"\nname = "Ben"\nprint(name)',
          options: [
            { value: "Ben", correct: true },
            { value: "Anna", correct: false },
            { value: "AnnaBen", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Welcher Variablenname ist in Python NICHT gültig?",
          options: [
            { value: "2xy", correct: true },
            { value: "x2", correct: false },
            { value: "_wert", correct: false },
            { value: "mein_wert", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "punkte = 0\npunkte = punkte + 5\npunkte = punkte + 5\nprint(punkte)",
          options: [
            { value: "10", correct: true },
            { value: "5", correct: false },
            { value: "55", correct: false },
            { value: "0", correct: false },
          ],
        },
      ],
    },
    {
      id: "datentypen",
      title: "Datentypen",
      description: "int, float, str, bool unterscheiden und mit type() bestimmen.",
      questionCount: 6,
      pool: [
        {
          prompt: "Was gibt dieser Code aus?",
          code: "print(type(5))",
          options: [
            { value: "<class 'int'>", correct: true },
            { value: "<class 'float'>", correct: false },
            { value: "<class 'str'>", correct: false },
            { value: "<class 'bool'>", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "print(type(5.0))",
          options: [
            { value: "<class 'float'>", correct: true },
            { value: "<class 'int'>", correct: false },
            { value: "<class 'str'>", correct: false },
            { value: "<class 'bool'>", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'print(type("5"))',
          options: [
            { value: "<class 'str'>", correct: true },
            { value: "<class 'int'>", correct: false },
            { value: "<class 'float'>", correct: false },
            { value: "<class 'bool'>", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "print(type(True))",
          options: [
            { value: "<class 'bool'>", correct: true },
            { value: "<class 'int'>", correct: false },
            { value: "<class 'str'>", correct: false },
            { value: "wahr", correct: false },
          ],
        },
        {
          prompt: "Welcher Datentyp passt zu \"Hallo\"?",
          options: [
            { value: "str", correct: true },
            { value: "int", correct: false },
            { value: "float", correct: false },
            { value: "bool", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus? (Achtung, Division in Python!)",
          code: "print(type(10 / 2))",
          options: [
            { value: "<class 'float'>", correct: true },
            { value: "<class 'int'>", correct: false },
            { value: "<class 'str'>", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "\"123\" (mit Anführungszeichen) - welcher Datentyp ist das?",
          options: [
            { value: "str", correct: true },
            { value: "int", correct: false },
            { value: "float", correct: false },
            { value: "bool", correct: false },
          ],
        },
      ],
    },
    {
      id: "input",
      title: "Eingabe mit input()",
      description: "input() liefert Text - wann braucht man int()/float()?",
      questionCount: 6,
      pool: [
        {
          prompt: "Welchen Datentyp liefert input() immer zurück?",
          options: [
            { value: "str", correct: true },
            { value: "int", correct: false },
            { value: "float", correct: false },
            { value: "hängt von der Eingabe ab", correct: false },
          ],
        },
        {
          prompt: "Eingabe: 16 - was gibt dieser Code aus?",
          code: 'alter = input("Wie alt bist du? ")\nprint(alter + 1)',
          options: [
            { value: "Fehler (TypeError)", correct: true },
            { value: "17", correct: false },
            { value: "161", correct: false },
            { value: "16", correct: false },
          ],
        },
        {
          prompt: "Eingabe: 16 - was gibt dieser Code aus?",
          code: 'alter = int(input("Wie alt bist du? "))\nprint(alter + 1)',
          options: [
            { value: "17", correct: true },
            { value: "161", correct: false },
            { value: "Fehler (TypeError)", correct: false },
            { value: "16", correct: false },
          ],
        },
        {
          prompt: "Warum braucht man oft int() oder float() um input() herum?",
          options: [
            { value: "Weil input() den Wert immer als Text (str) liefert", correct: true },
            { value: "Weil input() sonst gar nicht funktioniert", correct: false },
            { value: "Weil Python das bei jedem Programm verlangt", correct: false },
            { value: "Um Rechtschreibfehler zu vermeiden", correct: false },
          ],
        },
        {
          prompt: "Eingabe: 3.5 - was gibt dieser Code aus?",
          code: 'zahl = float(input("Zahl: "))\nprint(zahl * 2)',
          options: [
            { value: "7.0", correct: true },
            { value: "3.53.5", correct: false },
            { value: "7", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Eingabe: Ben - was gibt dieser Code aus?",
          code: 'text = input("Name: ")\nprint("Hallo " + text)',
          options: [
            { value: "Hallo Ben", correct: true },
            { value: "Hallo text", correct: false },
            { value: "Fehler (TypeError)", correct: false },
            { value: "HalloBen", correct: false },
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
