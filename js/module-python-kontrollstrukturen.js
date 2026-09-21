// Spielmodul "Bedingungen & Wiederholungen" (Informatik 11): boolesche Werte,
// einseitige/zweiseitige bedingte Anweisung, Wiederholung mit fester Anzahl
// (for/range) und mit Abbruchbedingung (while). Kuratierter Fragenpool pro
// Level wie beim Python-Einstieg, Auswahl und Antwortreihenfolge zufaellig.

window.Game = window.Game || {};
Game.modules = Game.modules || {};

Game.modules.pythonKontrollstrukturen = {
  id: "pythonKontrollstrukturen",
  title: "Informatik 11 - Bedingungen & Wiederholungen",
  subjectTrack: "informatik-11",
  description: "Boolesche Werte, if/else, Schleifen mit fester Anzahl (for) und mit Abbruchbedingung (while).",
  levels: [
    {
      id: "bool",
      title: "Boolesche Werte",
      description: "Vergleiche, True/False, and, or, not.",
      questionCount: 6,
      pool: [
        {
          prompt: "Was gibt dieser Code aus?",
          code: "print(5 > 3)",
          options: [
            { value: "True", correct: true },
            { value: "False", correct: false },
            { value: "5", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "print(type(3 == 3))",
          options: [
            { value: "<class 'bool'>", correct: true },
            { value: "<class 'int'>", correct: false },
            { value: "<class 'str'>", correct: false },
            { value: "True", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "print(7 % 2 == 0)",
          options: [
            { value: "False", correct: true },
            { value: "True", correct: false },
            { value: "1", correct: false },
            { value: "0", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "a = 4\nb = 9\nprint(a > 5 and b > 5)",
          options: [
            { value: "False", correct: true },
            { value: "True", correct: false },
            { value: "4", correct: false },
            { value: "9", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "print(not (2 < 1))",
          options: [
            { value: "True", correct: true },
            { value: "False", correct: false },
            { value: "2", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "x = 10\nprint(x < 5 or x == 10)",
          options: [
            { value: "True", correct: true },
            { value: "False", correct: false },
            { value: "10", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was ist der Unterschied zwischen '=' und '=='?",
          options: [
            { value: "'=' weist einen Wert zu, '==' vergleicht zwei Werte", correct: true },
            { value: "'=' vergleicht, '==' weist zu", correct: false },
            { value: "Es gibt keinen Unterschied", correct: false },
            { value: "'==' ist nur für Text erlaubt", correct: false },
          ],
        },
      ],
    },
    {
      id: "if",
      title: "Einseitige Bedingung (if)",
      description: "Ein Block wird nur ausgeführt, wenn die Bedingung erfüllt ist.",
      questionCount: 6,
      pool: [
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'x = 7\nif x > 5:\n    print("groß")\nprint("Ende")',
          options: [
            { value: "groß und danach Ende (zwei Zeilen)", correct: true },
            { value: "nur Ende", correct: false },
            { value: "nur groß", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'x = 3\nif x > 5:\n    print("groß")\nprint("Ende")',
          options: [
            { value: "nur Ende", correct: true },
            { value: "groß und danach Ende (zwei Zeilen)", correct: false },
            { value: "nur groß", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "punkte = 8\nif punkte >= 10:\n    punkte = punkte + 5\nprint(punkte)",
          options: [
            { value: "8", correct: true },
            { value: "13", correct: false },
            { value: "10", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Woran erkennt Python, welche Anweisungen zum if-Block gehören?",
          options: [
            { value: "An der Einrückung (Leerzeichen am Zeilenanfang)", correct: true },
            { value: "An geschweiften Klammern { }", correct: false },
            { value: "An dem Wort 'end'", correct: false },
            { value: "An Semikolons am Zeilenende", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'zahl = 4\nif zahl % 2 == 0:\n    print("gerade")',
          options: [
            { value: "gerade", correct: true },
            { value: "ungerade", correct: false },
            { value: "0", correct: false },
            { value: "nichts", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "a = 5\nif a > 3:\n    a = a * 2\nif a > 8:\n    a = a - 1\nprint(a)",
          options: [
            { value: "9", correct: true },
            { value: "10", correct: false },
            { value: "5", correct: false },
            { value: "11", correct: false },
          ],
        },
        {
          prompt: "Was passiert bei einer einseitigen Bedingung, wenn die Bedingung False ergibt?",
          options: [
            { value: "Der eingerückte Block wird übersprungen", correct: true },
            { value: "Das Programm bricht mit einem Fehler ab", correct: false },
            { value: "Der Block wird trotzdem einmal ausgeführt", correct: false },
            { value: "Die Bedingung wird so lange wiederholt, bis sie True ist", correct: false },
          ],
        },
      ],
    },
    {
      id: "ifelse",
      title: "Zweiseitige Bedingung (if-else)",
      description: "Entweder der if-Block oder der else-Block wird ausgeführt.",
      questionCount: 6,
      pool: [
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'alter = 16\nif alter >= 18:\n    print("volljährig")\nelse:\n    print("minderjährig")',
          options: [
            { value: "minderjährig", correct: true },
            { value: "volljährig", correct: false },
            { value: "volljährig und minderjährig", correct: false },
            { value: "nichts", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'x = 10\nif x % 2 == 0:\n    print("gerade")\nelse:\n    print("ungerade")',
          options: [
            { value: "gerade", correct: true },
            { value: "ungerade", correct: false },
            { value: "gerade und ungerade", correct: false },
            { value: "0", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "a = 3\nb = 8\nif a > b:\n    m = a\nelse:\n    m = b\nprint(m)",
          options: [
            { value: "8", correct: true },
            { value: "3", correct: false },
            { value: "11", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'temp = 0\nif temp > 0:\n    print("Wasser")\nelse:\n    print("Eis")',
          options: [
            { value: "Eis", correct: true },
            { value: "Wasser", correct: false },
            { value: "Wasser und Eis", correct: false },
            { value: "0", correct: false },
          ],
        },
        {
          prompt: "Wann wird der else-Block ausgeführt?",
          options: [
            { value: "Wenn die Bedingung des zugehörigen if False ergibt", correct: true },
            { value: "Immer, unabhängig von der Bedingung", correct: false },
            { value: "Wenn die Bedingung des zugehörigen if True ergibt", correct: false },
            { value: "Nur wenn vorher ein Fehler aufgetreten ist", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'n = 5\nif n > 3:\n    print("A")\nelse:\n    print("B")\nprint("C")',
          options: [
            { value: "A und danach C (zwei Zeilen)", correct: true },
            { value: "B und danach C (zwei Zeilen)", correct: false },
            { value: "nur A", correct: false },
            { value: "A, B und C (drei Zeilen)", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'x = 6\nif x > 5 and x < 10:\n    print("mittel")\nelse:\n    print("außen")',
          options: [
            { value: "mittel", correct: true },
            { value: "außen", correct: false },
            { value: "mittel und außen", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
      ],
    },
    {
      id: "for",
      title: "Wiederholung mit fester Anzahl (for)",
      description: "for-Schleife mit range(): die Anzahl der Durchläufe steht vorher fest.",
      questionCount: 6,
      pool: [
        {
          prompt: "Was gibt dieser Code aus?",
          code: "summe = 0\nfor i in range(4):\n    summe = summe + 1\nprint(summe)",
          options: [
            { value: "4", correct: true },
            { value: "3", correct: false },
            { value: "5", correct: false },
            { value: "0", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "summe = 0\nfor i in range(5):\n    summe = summe + i\nprint(summe)",
          options: [
            { value: "10", correct: true },
            { value: "15", correct: false },
            { value: "5", correct: false },
            { value: "4", correct: false },
          ],
        },
        {
          prompt: "Welche Werte durchläuft die Variable i bei for i in range(3)?",
          options: [
            { value: "0, 1, 2", correct: true },
            { value: "1, 2, 3", correct: false },
            { value: "0, 1, 2, 3", correct: false },
            { value: "3", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 's = ""\nfor i in range(3):\n    s = s + "a"\nprint(s)',
          options: [
            { value: "aaa", correct: true },
            { value: "a", correct: false },
            { value: "3", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahl = 1\nfor i in range(3):\n    zahl = zahl * 2\nprint(zahl)",
          options: [
            { value: "8", correct: true },
            { value: "6", correct: false },
            { value: "4", correct: false },
            { value: "16", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "summe = 0\nfor i in range(2, 5):\n    summe = summe + i\nprint(summe)",
          options: [
            { value: "9", correct: true },
            { value: "14", correct: false },
            { value: "10", correct: false },
            { value: "7", correct: false },
          ],
        },
        {
          prompt: "Wann eignet sich eine for-Schleife mit range() besonders?",
          options: [
            { value: "Wenn die Anzahl der Wiederholungen von vornherein feststeht", correct: true },
            { value: "Wenn erst während des Ablaufs entschieden wird, wann Schluss ist", correct: false },
            { value: "Wenn man nur eine einzige Anweisung ausführen will", correct: false },
            { value: "Wenn man Text einlesen will", correct: false },
          ],
        },
      ],
    },
    {
      id: "while",
      title: "Wiederholung mit Abbruchbedingung (while)",
      description: "while-Schleife: läuft, solange die Bedingung erfüllt ist.",
      questionCount: 6,
      pool: [
        {
          prompt: "Was gibt dieser Code aus?",
          code: "n = 0\nwhile n < 3:\n    n = n + 1\nprint(n)",
          options: [
            { value: "3", correct: true },
            { value: "2", correct: false },
            { value: "0", correct: false },
            { value: "4", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "x = 1\nwhile x < 20:\n    x = x * 2\nprint(x)",
          options: [
            { value: "32", correct: true },
            { value: "16", correct: false },
            { value: "20", correct: false },
            { value: "64", correct: false },
          ],
        },
        {
          prompt: "Was passiert bei diesem Code?",
          code: "i = 1\nwhile i > 0:\n    i = i + 1",
          options: [
            { value: "Die Schleife läuft endlos, da die Bedingung immer True bleibt", correct: true },
            { value: "Es kommt sofort eine Fehlermeldung", correct: false },
            { value: "Die Schleife endet nach einem Durchlauf", correct: false },
            { value: "Die Schleife endet bei i = 10", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zahl = 10\nschritte = 0\nwhile zahl > 0:\n    zahl = zahl - 3\n    schritte = schritte + 1\nprint(schritte)",
          options: [
            { value: "4", correct: true },
            { value: "3", correct: false },
            { value: "5", correct: false },
            { value: "10", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "x = 5\nwhile x > 10:\n    x = x + 1\nprint(x)",
          options: [
            { value: "5", correct: true },
            { value: "10", correct: false },
            { value: "11", correct: false },
            { value: "Die Schleife läuft endlos", correct: false },
          ],
        },
        {
          prompt: "Was ist der wesentliche Unterschied zwischen for und while?",
          options: [
            {
              value: "for: Anzahl der Durchläufe steht vorher fest; while: läuft, solange die Bedingung erfüllt ist",
              correct: true,
            },
            { value: "for kann nur mit Zahlen, while nur mit Text arbeiten", correct: false },
            { value: "while läuft immer genau einmal", correct: false },
            { value: "Es gibt keinen Unterschied", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "summe = 0\nzahl = 1\nwhile summe < 10:\n    summe = summe + zahl\n    zahl = zahl + 1\nprint(summe)",
          options: [
            { value: "10", correct: true },
            { value: "6", correct: false },
            { value: "15", correct: false },
            { value: "5", correct: false },
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
