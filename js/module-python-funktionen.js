// Spielmodul "Python-Funktionen" (Informatik 11): def/Aufruf, Parameter,
// Rueckgabewert mit return (vs. print), Standardwerte, Gueltigkeitsbereich
// (lokale/globale Variablen). Kuratierter Fragenpool pro Level wie bei den
// anderen Python-Modulen, Auswahl und Antwortreihenfolge zufaellig.

window.Game = window.Game || {};
Game.modules = Game.modules || {};

Game.modules.pythonFunktionen = {
  id: "pythonFunktionen",
  title: "Informatik 11 - Python-Funktionen",
  subjectTrack: "informatik-11",
  description: "Funktionen definieren und aufrufen, Parameter, return-Werte, Standardwerte, Gültigkeitsbereich.",
  levels: [
    {
      id: "definieren",
      title: "Funktionen definieren & aufrufen",
      description: "def, Funktionsaufruf, Parameter übergeben.",
      questionCount: 6,
      pool: [
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'def gruss():\n    print("Hallo!")\n\ngruss()',
          options: [
            { value: "Hallo!", correct: true },
            { value: "gruss()", correct: false },
            { value: "Nichts, da nichts zurückgegeben wird", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "def quadrat(x):\n    print(x * x)\n\nquadrat(4)",
          options: [
            { value: "16", correct: true },
            { value: "4", correct: false },
            { value: "x * x", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'def begruessung(name):\n    print("Hallo " + name)\n\nbegruessung("Lena")',
          options: [
            { value: "Hallo Lena", correct: true },
            { value: "Hallo name", correct: false },
            { value: "Lena", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was steht in der Definition def berechne(x, y): zwischen den Klammern?",
          options: [
            { value: "Die Parameter der Funktion", correct: true },
            { value: "Der Rückgabewert", correct: false },
            { value: "Der Funktionskörper", correct: false },
            { value: "Ein Kommentar", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "def verdoppeln(zahl):\n    print(zahl * 2)\n\nverdoppeln(3)\nverdoppeln(5)",
          options: [
            { value: "6 und danach 10 (zwei Zeilen)", correct: true },
            { value: "nur 6", correct: false },
            { value: "nur 10", correct: false },
            { value: "15", correct: false },
          ],
        },
        {
          prompt: "Wozu dient das Schlüsselwort def in Python?",
          options: [
            { value: "Um eine neue Funktion zu definieren", correct: true },
            { value: "Um eine Variable zu löschen", correct: false },
            { value: "Um eine Schleife zu starten", correct: false },
            { value: "Um eine Bedingung zu prüfen", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'def info():\n    print("Start")\n\nprint("Vorher")\ninfo()\nprint("Nachher")',
          options: [
            { value: "Vorher, Start, Nachher (drei Zeilen)", correct: true },
            { value: "nur Start", correct: false },
            { value: "Start, Vorher, Nachher", correct: false },
            { value: "Vorher, Nachher", correct: false },
          ],
        },
      ],
    },
    {
      id: "rueckgabewert",
      title: "Rückgabewert mit return",
      description: "return liefert einen Wert zurück - anders als print().",
      questionCount: 6,
      pool: [
        {
          prompt: "Was gibt dieser Code aus?",
          code: "def quadrat(x):\n    return x * x\n\nergebnis = quadrat(5)\nprint(ergebnis)",
          options: [
            { value: "25", correct: true },
            { value: "x * x", correct: false },
            { value: "5", correct: false },
            { value: "Nichts", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "def quadrat(x):\n    print(x * x)\n\nergebnis = quadrat(5)\nprint(ergebnis)",
          options: [
            { value: "25 und danach None (zwei Zeilen)", correct: true },
            { value: "nur 25", correct: false },
            { value: "25 und danach 25", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was ist der Unterschied zwischen print(x) und return x in einer Funktion?",
          options: [
            {
              value: "print() gibt nur auf dem Bildschirm aus, return liefert den Wert an die aufrufende Stelle zurück",
              correct: true,
            },
            { value: "Es gibt keinen Unterschied", correct: false },
            { value: "return gibt nur auf dem Bildschirm aus", correct: false },
            { value: "print() liefert den Wert zurück, return gibt ihn aus", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'def addiere(a, b):\n    return a + b\n    print("fertig")\n\nprint(addiere(2, 3))',
          options: [
            { value: "5", correct: true },
            { value: "5 und danach fertig", correct: false },
            { value: "fertig", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was gibt eine Funktion zurück, die kein return enthält?",
          options: [
            { value: "None", correct: true },
            { value: "0", correct: false },
            { value: "Eine Fehlermeldung", correct: false },
            { value: "Den letzten berechneten Wert", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "def verdoppeln(x):\n    return x * 2\n\na = verdoppeln(3)\nb = verdoppeln(a)\nprint(b)",
          options: [
            { value: "12", correct: true },
            { value: "6", correct: false },
            { value: "9", correct: false },
            { value: "18", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "def ist_gerade(zahl):\n    return zahl % 2 == 0\n\nprint(ist_gerade(7))",
          options: [
            { value: "False", correct: true },
            { value: "True", correct: false },
            { value: "1", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
      ],
    },
    {
      id: "parameter",
      title: "Parameter & Standardwerte",
      description: "Mehrere Parameter, Reihenfolge, Parameter mit Vorgabewert.",
      questionCount: 6,
      pool: [
        {
          prompt: "Was gibt dieser Code aus?",
          code: "def potenz(basis, exponent):\n    return basis ** exponent\n\nprint(potenz(2, 3))",
          options: [
            { value: "8", correct: true },
            { value: "6", correct: false },
            { value: "9", correct: false },
            { value: "5", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'def begruessung(name, gruss="Hallo"):\n    print(gruss + " " + name)\n\nbegruessung("Tom")',
          options: [
            { value: "Hallo Tom", correct: true },
            { value: "Fehler, da gruss fehlt", correct: false },
            { value: "Tom Hallo", correct: false },
            { value: "nur Tom", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: 'def begruessung(name, gruss="Hallo"):\n    print(gruss + " " + name)\n\nbegruessung("Tom", "Servus")',
          options: [
            { value: "Servus Tom", correct: true },
            { value: "Hallo Tom", correct: false },
            { value: "Fehler, zu viele Argumente", correct: false },
            { value: "Tom Servus", correct: false },
          ],
        },
        {
          prompt: "Wozu dient ein Standardwert, z.B. bei def f(x, y=0):?",
          options: [
            {
              value: "Der Parameter bekommt diesen Wert, wenn beim Aufruf kein Argument dafür übergeben wird",
              correct: true,
            },
            { value: "Der Parameter darf nie verändert werden", correct: false },
            { value: "Die Funktion wird dadurch automatisch aufgerufen", correct: false },
            { value: "Der Wert wird dadurch zu einer globalen Variable", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "def rechne(a, b):\n    return a - b\n\nprint(rechne(10, 3))\nprint(rechne(3, 10))",
          options: [
            { value: "7 und danach −7 (zwei Zeilen)", correct: true },
            { value: "7 und danach 7", correct: false },
            { value: "−7 und danach 7", correct: false },
            { value: "10 und danach 3", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "def flaeche(breite, hoehe=2):\n    return breite * hoehe\n\nprint(flaeche(5))",
          options: [
            { value: "10", correct: true },
            { value: "5", correct: false },
            { value: "7", correct: false },
            { value: "Fehler, hoehe fehlt", correct: false },
          ],
        },
        {
          prompt: "Was passiert, wenn man zu wenige Argumente für Parameter ohne Standardwert übergibt?",
          options: [
            { value: "Python meldet einen Fehler (TypeError)", correct: true },
            { value: "Die fehlenden Parameter werden automatisch 0", correct: false },
            { value: "Python wartet auf eine Eingabe", correct: false },
            { value: "Die Funktion wird einfach übersprungen", correct: false },
          ],
        },
      ],
    },
    {
      id: "gueltigkeitsbereich",
      title: "Gültigkeitsbereich (Scope)",
      description: "Lokale und globale Variablen.",
      questionCount: 6,
      pool: [
        {
          prompt: "Was gibt dieser Code aus?",
          code: "def test():\n    x = 5\n    print(x)\n\ntest()\nprint(x)",
          options: [
            { value: "5 und danach Fehler (NameError)", correct: true },
            { value: "5 und danach 5", correct: false },
            { value: "Fehler und danach 5", correct: false },
            { value: "nur 5", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "x = 10\n\ndef zeige():\n    print(x)\n\nzeige()",
          options: [
            { value: "10", correct: true },
            { value: "Fehler", correct: false },
            { value: "0", correct: false },
            { value: "Nichts", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "x = 10\n\ndef aendere():\n    x = 20\n    print(x)\n\naendere()\nprint(x)",
          options: [
            { value: "20 und danach 10 (zwei Zeilen)", correct: true },
            { value: "20 und danach 20", correct: false },
            { value: "10 und danach 10", correct: false },
            { value: "Fehler", correct: false },
          ],
        },
        {
          prompt: "Was ist eine lokale Variable?",
          options: [
            { value: "Eine Variable, die nur innerhalb der Funktion existiert, in der sie erstellt wurde", correct: true },
            { value: "Eine Variable, die überall im Programm bekannt ist", correct: false },
            { value: "Eine Variable, die sich nie ändern kann", correct: false },
            { value: "Eine Variable, die nur Zahlen speichern kann", correct: false },
          ],
        },
        {
          prompt: "Was ist eine globale Variable?",
          options: [
            {
              value: "Eine Variable, die außerhalb aller Funktionen definiert ist und überall gelesen werden kann",
              correct: true,
            },
            { value: "Eine Variable, die nur in einer Funktion existiert", correct: false },
            { value: "Eine Variable, die man nicht ausgeben kann", correct: false },
            { value: "Ein anderes Wort für Parameter", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "def addiere_eins(zahl):\n    zahl = zahl + 1\n    return zahl\n\nn = 5\naddiere_eins(n)\nprint(n)",
          options: [
            { value: "5", correct: true },
            { value: "6", correct: false },
            { value: "Fehler", correct: false },
            { value: "None", correct: false },
          ],
        },
        {
          prompt: "Was gibt dieser Code aus?",
          code: "zaehler = 0\n\ndef erhoehe():\n    global zaehler\n    zaehler = zaehler + 1\n\nerhoehe()\nerhoehe()\nprint(zaehler)",
          options: [
            { value: "2", correct: true },
            { value: "0", correct: false },
            { value: "1", correct: false },
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
