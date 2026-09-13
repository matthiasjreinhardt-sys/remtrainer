// Admin-Panel: Login mit echter Lehrkraft-E-Mail (kein Benutzername-Mapping
// wie bei Schuelern), danach Uebersicht aller Schueler-Ergebnisse, neue
// Zugaenge erzeugen und bestehende deaktivieren/aktivieren.
//
// "Loeschen" gibt es bewusst nicht: das Entfernen eines fremden Firebase-Auth-
// Kontos erfordert das Admin SDK (Server, siehe scripts/generate-accounts.js)
// und ist aus dem Browser heraus nicht sicher moeglich. Ein deaktiviertes
// Konto kann sich stattdessen einfach nicht mehr einloggen (siehe main.js).

window.Game = window.Game || {};

const appEl = document.getElementById("admin-app");
const scoreboardEl = document.getElementById("scoreboard");

function render() {
  renderTopbar();
  if (!Game.Auth.currentUser) renderLogin();
  else renderDashboard();
}

function renderTopbar() {
  const user = Game.Auth.currentUser;
  if (!user) {
    scoreboardEl.innerHTML = "";
    return;
  }
  scoreboardEl.innerHTML = `
    <span>${user.email}</span>
    <button class="secondary" id="logout-btn">Abmelden</button>
  `;
  document.getElementById("logout-btn").addEventListener("click", () => Game.Auth.logout());
}

function renderLogin() {
  appEl.innerHTML = `
    <div class="login-panel">
      <h2>Admin-Anmeldung</h2>
      <p>Melde dich mit deiner Lehrkraft-E-Mail an.</p>
      <form id="login-form" class="login-form">
        <input type="email" id="login-email" placeholder="E-Mail" autocomplete="username" required />
        <input type="password" id="login-password" placeholder="Passwort" autocomplete="current-password" required />
        <button type="submit">Anmelden</button>
      </form>
      <div class="feedback wrong" id="login-error"></div>
    </div>
  `;
  const form = document.getElementById("login-form");
  const errorEl = document.getElementById("login-error");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const btn = form.querySelector("button");
    btn.disabled = true;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(() => {
        errorEl.textContent = "Anmeldung fehlgeschlagen: E-Mail oder Passwort falsch.";
        errorEl.classList.add("show");
        btn.disabled = false;
      });
  });
}

function renderDashboard() {
  appEl.innerHTML = `
    <div class="admin-panel">
      <h2>Neue Zugänge erzeugen</h2>
      <form id="create-form" class="create-form">
        <label>Kurs<input type="text" id="create-course" placeholder="z.B. 12a" required /></label>
        <label>Fach-Jahrgangsstufe
          <select id="create-subject-track" required>
            <option value="" disabled selected>Bitte wählen…</option>
            ${Game.subjectTracks.map((t) => `<option value="${t.id}">${t.label}</option>`).join("")}
          </select>
        </label>
        <label>Anzahl<input type="number" id="create-count" min="1" max="100" value="10" /></label>
        <button type="submit">Konten erzeugen</button>
      </form>
      <div class="feedback" id="create-status"></div>
      <div class="create-result-box" id="create-result-box" style="display:none">
        <p class="create-result-warning">⚠️ Diese Passwörter werden nur jetzt einmal angezeigt und danach nirgends mehr gespeichert. Jetzt kopieren!</p>
        <pre class="create-result" id="create-result"></pre>
        <button type="button" class="secondary" id="copy-result-btn">In Zwischenablage kopieren</button>
        <button type="button" class="secondary" id="print-result-btn">🖨️ Als PDF / drucken</button>
      </div>
    </div>

    <div class="admin-panel">
      <h2 id="roster-heading">Schüler-Accounts</h2>
      <div id="roster-container"><p>Lade…</p></div>
    </div>
  `;

  wireCreateForm();
  refreshRoster();
}

let rosterCache = [];
let courseFilter = "";

async function refreshRoster() {
  const container = document.getElementById("roster-container");
  const heading = document.getElementById("roster-heading");
  try {
    rosterCache = await Game.Scores.listAll();
  } catch (err) {
    container.innerHTML = `
      <div class="feedback wrong show">
        Kein Zugriff auf die Schülerdaten (${err.message}).<br />
        Steht deine Firebase-Auth-UID in firestore.rules bei ADMIN_UIDS?
      </div>
    `;
    return;
  }
  rosterCache.sort((a, b) => {
    const courseCompare = (a.course || "").localeCompare(b.course || "");
    if (courseCompare !== 0) return courseCompare;
    return (a.username || a.uid).localeCompare(b.username || b.uid);
  });
  heading.textContent = `Schüler-Accounts (${rosterCache.length})`;

  const courses = [...new Set(rosterCache.map((r) => r.course).filter(Boolean))].sort();

  container.innerHTML = `
    ${
      courses.length > 0
        ? `
    <div class="course-filter-row">
      <label>Kurs filtern
        <select id="course-filter">
          <option value="">Alle Kurse</option>
          ${courses.map((c) => `<option value="${c}" ${c === courseFilter ? "selected" : ""}>${c}</option>`).join("")}
        </select>
      </label>
    </div>
    `
        : ""
    }
    <div id="roster-table-container"></div>
  `;

  const filterSelect = document.getElementById("course-filter");
  if (filterSelect) {
    filterSelect.addEventListener("change", () => {
      courseFilter = filterSelect.value;
      renderRosterTable();
    });
  }

  renderRosterTable();
}

function subjectTrackLabel(id) {
  const track = Game.subjectTracks.find((t) => t.id === id);
  return track ? track.label : "–";
}

function renderRosterTable() {
  const tableContainer = document.getElementById("roster-table-container");
  const roster = courseFilter ? rosterCache.filter((r) => r.course === courseFilter) : rosterCache;

  tableContainer.innerHTML =
    roster.length === 0
      ? "<p>Noch keine Accounts vorhanden.</p>"
      : `
      <div class="table-scroll">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Kurs</th>
              <th>Fach-Jahrgangsstufe</th>
              <th>Benutzername</th>
              <th>Nickname</th>
              <th>Richtig/Gesamt</th>
              <th>Quote</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${roster
              .map(
                (r) => `
              <tr>
                <td>${r.course || "–"} <button class="secondary small" data-edit-course="${r.uid}" data-current="${r.course || ""}">✏️</button></td>
                <td id="subject-track-cell-${r.uid}">
                  ${subjectTrackLabel(r.subjectTrack)}
                  <button class="secondary small" data-edit-subject="${r.uid}" data-current="${r.subjectTrack || ""}">✏️</button>
                </td>
                <td>${r.username || "unbekannt"}</td>
                <td>${r.nickname || "–"}</td>
                <td>${r.correct || 0}/${r.total || 0}</td>
                <td>${r.total ? Math.round((r.correct / r.total) * 100) + "%" : "–"}</td>
                <td>${
                  r.disabled
                    ? '<span class="status-badge disabled">deaktiviert</span>'
                    : '<span class="status-badge active">aktiv</span>'
                }</td>
                <td class="admin-row-actions">
                  <button class="secondary small" data-toggle="${r.uid}" data-disabled="${!!r.disabled}">
                    ${r.disabled ? "Aktivieren" : "Deaktivieren"}
                  </button>
                  <button class="secondary small" data-history="${r.uid}">Verlauf</button>
                  <button class="secondary small" data-delete="${r.uid}" data-name="${r.username || "unbekannt"}">Eintrag entfernen</button>
                </td>
              </tr>
              <tr class="history-row" id="history-row-${r.uid}" style="display:none">
                <td colspan="8"><div class="history-content" id="history-content-${r.uid}"></div></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
      `;

  wireRosterActions();
}

// Solange eine frische Passwortliste angezeigt und noch nicht kopiert wurde,
// vor versehentlichem Verlassen/Neuladen der Seite warnen (das genau hat
// die Liste beim letzten Mal ungesehen geloescht).
function guardAgainstUnload(active) {
  window.onbeforeunload = active ? () => "Hast du die Passwortliste schon kopiert?" : null;
}

function wireCreateForm() {
  const form = document.getElementById("create-form");
  const statusEl = document.getElementById("create-status");
  const resultBox = document.getElementById("create-result-box");
  const resultEl = document.getElementById("create-result");
  const copyBtn = document.getElementById("copy-result-btn");
  const printBtn = document.getElementById("print-result-btn");
  let lastCreated = [];
  let lastCourse = "";

  printBtn.addEventListener("click", () => {
    printAccountCards(lastCourse, lastCreated);
  });

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(resultEl.textContent);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(resultEl);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      selection.removeAllRanges();
    }
    copyBtn.textContent = "Kopiert ✓";
    guardAgainstUnload(false);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const count = Math.max(1, Math.min(100, parseInt(document.getElementById("create-count").value, 10) || 1));
    const course = document.getElementById("create-course").value.trim();
    const subjectTrack = document.getElementById("create-subject-track").value;
    const submitBtn = form.querySelector("button");
    submitBtn.disabled = true;
    statusEl.classList.remove("wrong");
    statusEl.classList.add("show");
    resultBox.style.display = "none";
    guardAgainstUnload(false);

    const created = [];
    try {
      const existing = await Game.Scores.listAll();
      const usedNames = new Set(existing.map((r) => r.username));
      for (let i = 0; i < count; i++) {
        statusEl.textContent = `Erzeuge Konto ${i + 1}/${count}…`;
        const account = await createOneAccount(usedNames, course, subjectTrack);
        usedNames.add(account.username);
        created.push(account);
      }
      statusEl.textContent = `Fertig: ${created.length} Konten erzeugt.`;
      resultEl.textContent =
        `Kurs: ${course}\n\n` + created.map((a) => `${a.username}\t${a.password}`).join("\n");
      lastCreated = created;
      lastCourse = course;
      copyBtn.textContent = "In Zwischenablage kopieren";
      resultBox.style.display = "block";
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      guardAgainstUnload(true);
      refreshRoster();
    } catch (err) {
      statusEl.classList.add("wrong");
      statusEl.textContent = `Fehler beim Erzeugen: ${err.message}`;
      refreshRoster();
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// Baut eine Kartenansicht (Kurs, Benutzername, Passwort) in #print-area und
// oeffnet den Browser-Druckdialog. Dort kann als Ziel "Als PDF speichern"
// gewaehlt werden - kein zusaetzliches Tool noetig. Die gestrichelten Linien
// zwischen den Karten markieren die Schnittkanten zum Ausschneiden.
function printAccountCards(course, accounts) {
  const printArea = document.getElementById("print-area");
  printArea.innerHTML = `
    <h2 class="print-title">Zugangsdaten &middot; Kurs ${course}</h2>
    <div class="print-card-grid">
      ${accounts
        .map(
          (a) => `
        <div class="print-card">
          <div class="print-card-course">Kurs ${course}</div>
          <div class="print-card-row"><span>Benutzername</span><span>${a.username}</span></div>
          <div class="print-card-row"><span>Passwort</span><span>${a.password}</span></div>
        </div>`
        )
        .join("")}
    </div>
  `;
  window.print();
}

// Legt ein einzelnes Konto ueber eine zweite, isolierte Firebase-App-Instanz
// an, damit die eigentliche Admin-Anmeldung (Default-App) unberuehrt bleibt.
async function createOneAccount(usedNames, course, subjectTrack) {
  let username;
  do {
    username = Game.Auth.randomUsername();
  } while (usedNames.has(username));
  const password = Game.Auth.randomPassword();

  const email = Game.Auth.usernameToEmail(username);
  const tempAppName = `account-creator-${Date.now()}-${Math.random()}`;
  const tempApp = firebase.initializeApp(Game.firebaseConfig, tempAppName);
  try {
    const cred = await tempApp.auth().createUserWithEmailAndPassword(email, password);
    await firebase.firestore().collection("scores").doc(cred.user.uid).set({
      username,
      course,
      subjectTrack,
      correct: 0,
      total: 0,
    });
    await tempApp.auth().signOut();
  } finally {
    await tempApp.delete();
  }
  return { username, password };
}

function wireRosterActions() {
  appEl.querySelectorAll("[data-toggle]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const uid = btn.dataset.toggle;
      const currentlyDisabled = btn.dataset.disabled === "true";
      btn.disabled = true;
      await Game.Scores.setDisabled(uid, !currentlyDisabled);
      refreshRoster();
    });
  });

  appEl.querySelectorAll("[data-edit-course]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const uid = btn.dataset.editCourse;
      const current = btn.dataset.current;
      const next = prompt("Kurs für dieses Konto:", current);
      if (next === null || next.trim() === current) return;
      btn.disabled = true;
      await Game.Scores.setCourse(uid, next.trim());
      refreshRoster();
    });
  });

  appEl.querySelectorAll("[data-edit-subject]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const uid = btn.dataset.editSubject;
      const current = btn.dataset.current;
      const cell = document.getElementById(`subject-track-cell-${uid}`);
      cell.innerHTML = `
        <select data-subject-select="${uid}">
          ${Game.subjectTracks
            .map((t) => `<option value="${t.id}" ${t.id === current ? "selected" : ""}>${t.label}</option>`)
            .join("")}
        </select>
      `;
      const select = cell.querySelector("select");
      select.focus();
      select.addEventListener("change", async () => {
        select.disabled = true;
        await Game.Scores.setSubjectTrack(uid, select.value);
        refreshRoster();
      });
      select.addEventListener("blur", () => {
        if (select.value === current) refreshRoster();
      });
    });
  });

  appEl.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const uid = btn.dataset.delete;
      const name = btn.dataset.name;
      const ok = confirm(
        `Eintrag "${name}" wirklich entfernen? Das löscht Punktestand und Verlauf unwiderruflich.\n\n` +
          "Falls der Login noch existiert, kann sich die Person danach zwar noch anmelden, startet aber wieder bei 0 Punkten.\n" +
          "Willst du auch das Konto sperren, nutze stattdessen 'Deaktivieren'."
      );
      if (!ok) return;
      btn.disabled = true;
      await Game.Scores.deleteEntry(uid);
      refreshRoster();
    });
  });

  appEl.querySelectorAll("[data-history]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const uid = btn.dataset.history;
      const row = document.getElementById(`history-row-${uid}`);
      const content = document.getElementById(`history-content-${uid}`);
      const isOpen = row.style.display !== "none";
      if (isOpen) {
        row.style.display = "none";
        return;
      }
      content.textContent = "Lade…";
      row.style.display = "table-row";
      const attempts = await Game.Scores.listAttempts(uid);
      content.innerHTML = attempts.length
        ? attempts
            .map(
              (a) =>
                `<div>${a.moduleId} / ${a.levelId}: <b>${a.correct}/${a.total}</b></div>`
            )
            .join("")
        : "Noch keine abgeschlossenen Level.";
    });
  });
}

Game.Auth.onReady(() => render());
