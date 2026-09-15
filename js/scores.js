// Persistiert den Punktestand pro Benutzer in Firestore:
// scores/{uid}            -> laufende Summe (correct/total)
// scores/{uid}/attempts/*  -> ein Eintrag pro abgeschlossener Stufe

window.Game = window.Game || {};

Game.Scores = {
  // Ein Konto kann mehreren Fach-Jahrgangsstufen zugeordnet sein (z.B. eine
  // Klasse, die bei derselben Lehrkraft sowohl Physik als auch Informatik
  // hat). Neue Dokumente speichern das Array "subjectTracks". Aeltere
  // Dokumente haben noch das einzelne Feld "subjectTrack" - wird hier
  // automatisch in ein einelementiges Array umgewandelt, ohne dass die
  // bestehenden Konten manuell migriert werden muessen.
  getSubjectTracks(data) {
    if (data && Array.isArray(data.subjectTracks)) return data.subjectTracks;
    if (data && data.subjectTrack) return [data.subjectTrack];
    return [];
  },

  async loadAggregate(uid) {
    const doc = await firebase.firestore().collection("scores").doc(uid).get();
    const data = doc.data();
    return {
      correct: (data && data.correct) || 0,
      total: (data && data.total) || 0,
      disabled: !!(data && data.disabled),
      nickname: (data && data.nickname) || "",
      course: (data && data.course) || null,
      subjectTracks: this.getSubjectTracks(data),
      username: (data && data.username) || "",
    };
  },

  setNickname(uid, nickname) {
    return firebase.firestore().collection("scores").doc(uid).set({ nickname }, { merge: true });
  },

  // Traegt den Benutzernamen nach, falls er im Dokument fehlt (z.B. bei
  // Konten, die per Hand in der Firebase Console angelegt wurden statt
  // ueber das Admin-Panel).
  ensureUsername(uid, username) {
    return firebase.firestore().collection("scores").doc(uid).set({ username }, { merge: true });
  },

  setCourse(uid, course) {
    return firebase.firestore().collection("scores").doc(uid).set({ course }, { merge: true });
  },

  // Ersetzt die Fach-Jahrgangsstufen-Zuordnung komplett durch subjectTracks
  // (Array von IDs) und entfernt das alte einzelne Feld, damit ein Konto
  // nicht gleichzeitig beide Varianten fuehrt.
  setSubjectTracks(uid, subjectTracks) {
    return firebase
      .firestore()
      .collection("scores")
      .doc(uid)
      .set(
        { subjectTracks, subjectTrack: firebase.firestore.FieldValue.delete() },
        { merge: true }
      );
  },

  // Top-Platzierungen eines Kurses nach Anzahl richtiger Antworten.
  // Benoetigt einen Firestore-Composite-Index: scores, Felder "course" (Aufsteigend)
  // + "correct" (Absteigend) - Firebase Console -> Firestore -> Indizes.
  async listTopByCourse(course, limitCount = 5) {
    const snapshot = await firebase
      .firestore()
      .collection("scores")
      .where("course", "==", course)
      .orderBy("correct", "desc")
      .limit(limitCount)
      .get();
    return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
  },

  async listAll() {
    const snapshot = await firebase.firestore().collection("scores").get();
    return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
  },

  async listAttempts(uid) {
    const snapshot = await firebase
      .firestore()
      .collection("scores")
      .doc(uid)
      .collection("attempts")
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },

  setDisabled(uid, disabled) {
    return firebase.firestore().collection("scores").doc(uid).set({ disabled }, { merge: true });
  },

  // Entfernt nur den Firestore-Eintrag (Punktestand/Verlauf). Loescht NICHT
  // das Firebase-Auth-Konto - das ist entweder schon per Hand in der
  // Firebase Console entfernt worden (verwaister Eintrag), oder muesste
  // separat in der Console geloescht werden.
  deleteEntry(uid) {
    return firebase.firestore().collection("scores").doc(uid).delete();
  },

  recordAnswer(uid, isCorrect) {
    return firebase
      .firestore()
      .collection("scores")
      .doc(uid)
      .set(
        {
          correct: firebase.firestore.FieldValue.increment(isCorrect ? 1 : 0),
          total: firebase.firestore.FieldValue.increment(1),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
  },

  recordAttempt(uid, moduleId, levelId, correct, total) {
    return firebase
      .firestore()
      .collection("scores")
      .doc(uid)
      .collection("attempts")
      .add({
        moduleId,
        levelId,
        correct,
        total,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  },
};
