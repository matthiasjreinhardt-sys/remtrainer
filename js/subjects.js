// Fach-Jahrgangsstufen-Kombinationen, die aktuell unterrichtet werden.
// Jeder Kurs (siehe admin.js) wird genau einer davon zugeordnet, jedes Modul
// (siehe module-*.js) ebenso - Schueler sehen dann nur Module, deren
// subjectTrack zu ihrem Kurs passt.
//
// Neues Schuljahr / neue Faecher-Kombination -> hier anpassen.

window.Game = window.Game || {};

Game.subjectTracks = [
  { id: "mathe-13", label: "Mathe 13" },
  { id: "physik-13", label: "Physik 13" },
  { id: "physik-12", label: "Physik 12" },
  { id: "physik-11", label: "Physik 11" },
  { id: "informatik-11", label: "Informatik 11" },
];
