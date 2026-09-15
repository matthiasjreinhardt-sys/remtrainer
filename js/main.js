// App-Controller: verwaltet den Screen-Zustand (Start, Levelauswahl, Quiz,
// Ergebnis) und rendert die jeweilige Ansicht in #app.

window.Game = window.Game || {};

Game.state = {
  screen: "start",
  moduleId: null,
  levelId: null,
  questions: [],
  index: 0,
  correctCount: 0,
  answered: false,
  sessionCorrect: 0,
  sessionTotal: 0,
  nickname: "",
  course: null,
  subjectTracks: [],
};

const appEl = document.getElementById("app");
const scoreboardEl = document.getElementById("scoreboard");

function render() {
  renderScoreboard();
  switch (Game.state.screen) {
    case "login":
      return renderLogin();
    case "start":
      return renderStart();
    case "levels":
      return renderLevels();
    case "quiz":
      return renderQuiz();
    case "summary":
      return renderSummary();
  }
}

function renderScoreboard() {
  const user = Game.Auth.currentUser;
  if (!user) {
    scoreboardEl.innerHTML = "";
    return;
  }
  const { sessionCorrect, sessionTotal, nickname } = Game.state;
  const displayName = nickname || user.email.split("@")[0];
  scoreboardEl.innerHTML = `
    <span>${displayName}</span>
    ${sessionTotal > 0 ? `<span>Punkte: <b>${sessionCorrect}/${sessionTotal}</b></span>` : ""}
    <button class="secondary" id="logout-btn">Abmelden</button>
  `;
  document.getElementById("logout-btn").addEventListener("click", () => Game.Auth.logout());
}

function renderLogin() {
  appEl.innerHTML = `
    <div class="login-panel">
      <h2>Anmeldung</h2>
      <p>Melde dich mit deinem Benutzernamen und Passwort an.</p>
      <form id="login-form" class="login-form">
        <input type="text" id="login-username" placeholder="Benutzername" autocomplete="username" required />
        <input type="password" id="login-password" placeholder="Passwort" autocomplete="current-password" required />
        <button type="submit">Anmelden</button>
      </form>
      <div class="feedback wrong" id="login-error"></div>
    </div>
  `;
  const form = document.getElementById("login-form");
  const errorEl = document.getElementById("login-error");
  if (Game.state.loginNotice) {
    errorEl.textContent = Game.state.loginNotice;
    errorEl.classList.add("show");
    Game.state.loginNotice = null;
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.classList.remove("show");
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const submitBtn = form.querySelector("button");
    submitBtn.disabled = true;
    Game.Auth.login(username, password).catch(() => {
      errorEl.textContent = "Login fehlgeschlagen: Benutzername oder Passwort falsch.";
      errorEl.classList.add("show");
      submitBtn.disabled = false;
    });
  });
}

function renderStart() {
  const modules = Object.values(Game.modules).filter((m) => Game.state.subjectTracks.includes(m.subjectTrack));
  appEl.innerHTML = `
    <div class="admin-panel my-score-panel">
      <p class="my-score-label">Deine aktuelle Punktzahl</p>
      <div class="big-score">${Game.state.sessionCorrect}</div>
      <p class="my-score-hint">richtige Antworten insgesamt</p>
    </div>

    <div class="nickname-row">
      <form id="nickname-form" class="nickname-form">
        <label>Anzeigename für die Bestenliste
          <input type="text" id="nickname-input" maxlength="20" placeholder="z.B. CleverFuchs" value="${Game.state.nickname || ""}" />
        </label>
        <button type="submit" class="secondary">Speichern</button>
      </form>
    </div>

    ${
      Game.state.course
        ? `
    <div class="admin-panel highscore-panel">
      <h2>🏆 Bestenliste: ${Game.state.course}</h2>
      <p>Top 5 nach Anzahl richtiger Antworten.</p>
      <div id="highscore-container"><p>Lade…</p></div>
    </div>`
        : ""
    }

    <h2>Modul wählen</h2>
    ${
      modules.length === 0
        ? `<p>Für dein Konto ist noch kein Modul verfügbar. Bitte wende dich an deine Lehrkraft (fehlende Fach-Jahrgangsstufen-Zuordnung).</p>`
        : `
    <div class="module-grid">
      ${modules
        .map(
          (m) => `
        <div class="module-card">
          <h3>${m.title}</h3>
          <p>${m.description}</p>
          <button data-module="${m.id}">Starten</button>
        </div>`
        )
        .join("")}
    </div>
    `
    }
  `;
  appEl.querySelectorAll("[data-module]").forEach((btn) => {
    btn.addEventListener("click", () => {
      Game.state.moduleId = btn.dataset.module;
      Game.state.screen = "levels";
      render();
    });
  });

  const nicknameForm = document.getElementById("nickname-form");
  nicknameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nickname = document.getElementById("nickname-input").value.trim();
    const btn = nicknameForm.querySelector("button");
    btn.disabled = true;
    Game.Scores.setNickname(Game.Auth.currentUser.uid, nickname)
      .then(() => {
        Game.state.nickname = nickname;
        renderScoreboard();
        btn.textContent = "Gespeichert ✓";
      })
      .catch(() => {
        btn.textContent = "Fehler, nochmal versuchen";
      })
      .finally(() => {
        btn.disabled = false;
      });
  });

  if (Game.state.course) loadHighscore();
}

async function loadHighscore() {
  const container = document.getElementById("highscore-container");
  try {
    const top = await Game.Scores.listTopByCourse(Game.state.course, 5);
    const myUid = Game.Auth.currentUser.uid;
    container.innerHTML = top.length
      ? `
      <div class="table-scroll">
        <table class="admin-table">
          <thead>
            <tr><th>Platz</th><th>Name</th><th>Richtige Antworten</th></tr>
          </thead>
          <tbody>
            ${top
              .map(
                (r, i) => `
              <tr class="${r.uid === myUid ? "highscore-me" : ""}">
                <td>${i + 1}</td>
                <td>${r.nickname || r.username || "unbekannt"}</td>
                <td>${r.correct || 0}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>`
      : "<p>Noch keine Ergebnisse in diesem Kurs.</p>";
  } catch (err) {
    container.innerHTML = `<div class="feedback wrong show">Bestenliste konnte nicht geladen werden: ${err.message}</div>`;
  }
}

function renderLevels() {
  const mod = Game.modules[Game.state.moduleId];
  if (!mod || !Game.state.subjectTracks.includes(mod.subjectTrack)) {
    Game.state.screen = "start";
    return renderStart();
  }
  appEl.innerHTML = `
    <button class="secondary" id="back-start">&larr; Zurück</button>
    <h2>${mod.title}</h2>
    <p>${mod.description}</p>
    <div class="level-grid">
      ${mod.levels
        .map(
          (lv) => `
        <div class="level-card">
          <h4>${lv.title}</h4>
          <p>${lv.description}</p>
          <button data-level="${lv.id}">Starten</button>
        </div>`
        )
        .join("")}
    </div>
  `;
  document.getElementById("back-start").addEventListener("click", () => {
    Game.state.screen = "start";
    render();
  });
  appEl.querySelectorAll("[data-level]").forEach((btn) => {
    btn.addEventListener("click", () => startLevel(btn.dataset.level));
  });
}

function startLevel(levelId) {
  const mod = Game.modules[Game.state.moduleId];
  const levelDef = mod.levels.find((l) => l.id === levelId);
  Game.state.levelId = levelId;
  Game.state.questions = mod.generateQuestions(levelDef);
  Game.state.index = 0;
  Game.state.correctCount = 0;
  Game.state.answered = false;
  Game.state.screen = "quiz";
  render();
}

function currentLevelDef() {
  const mod = Game.modules[Game.state.moduleId];
  return mod.levels.find((l) => l.id === Game.state.levelId);
}

function renderQuiz() {
  const { questions, index } = Game.state;
  const q = questions[index];
  const levelDef = currentLevelDef();

  appEl.innerHTML = `
    <div class="quiz-header">
      <span>${levelDef.title}</span>
      <span>Frage ${index + 1} / ${questions.length}</span>
    </div>
    <div class="quiz-panel">
      ${q.kind === "code" ? renderCodeQuestion(q) : renderIntegralQuestion(q)}
      ${q.mode === "mc" ? renderMcOptions(q) : renderNumericInput()}
      <div class="feedback" id="feedback"></div>
      <div class="quiz-actions">
        <button id="next-btn" disabled>${
          index === questions.length - 1 ? "Ergebnis anzeigen" : "Weiter"
        }</button>
      </div>
    </div>
  `;

  if (q.kind !== "code") {
    const canvas = document.getElementById("quiz-canvas");
    Game.Graph.draw(canvas, q.funcObj, q.a, q.b);
  }

  if (q.mode === "mc") wireMcOptions(q);
  else wireNumericInput(q);

  document.getElementById("next-btn").addEventListener("click", nextQuestion);
}

function renderIntegralQuestion(q) {
  return `
    <div class="func-label">${q.funcObj.label}</div>
    <div class="bounds-label">
      <span class="integral-symbol">&int;</span>
      <span class="integral-bounds">
        <span class="integral-upper">${formatNum(q.b)}</span>
        <span class="integral-lower">${formatNum(q.a)}</span>
      </span>
      <span class="integral-integrand">f(x)&nbsp;dx</span>
    </div>
    <canvas class="graph-canvas" id="quiz-canvas"></canvas>
    <div class="legend">
      <span class="above">Fläche oberhalb x-Achse (positiv)</span>
      <span class="below">Fläche unterhalb x-Achse (negativ)</span>
    </div>
  `;
}

function renderCodeQuestion(q) {
  return `
    <p class="code-prompt">${escapeHtml(q.prompt)}</p>
    ${q.code ? `<pre class="code-block"><code>${escapeHtml(q.code)}</code></pre>` : ""}
  `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMcOptions(q) {
  return `
    <div class="mc-options">
      ${q.options
        .map((opt, i) => {
          const label = q.kind === "code" ? escapeHtml(opt.value) : `${formatNum(opt.value)} FE`;
          return `<button data-index="${i}">${label}</button>`;
        })
        .join("")}
    </div>
  `;
}

function wireMcOptions(q) {
  const buttons = appEl.querySelectorAll(".mc-options button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (Game.state.answered) return;
      const opt = q.options[Number(btn.dataset.index)];
      answerQuestion(opt.correct, q);
      buttons.forEach((b) => {
        b.disabled = true;
        const bOpt = q.options[Number(b.dataset.index)];
        if (bOpt.correct) b.classList.add("correct");
        else if (b === btn) b.classList.add("wrong");
      });
    });
  });
}

function renderNumericInput() {
  return `
    <div class="numeric-input-row">
      <input type="text" id="numeric-answer" placeholder="Wert in FE" inputmode="decimal" />
      <button id="check-btn">Prüfen</button>
    </div>
  `;
}

function wireNumericInput(q) {
  const input = document.getElementById("numeric-answer");
  const checkBtn = document.getElementById("check-btn");

  const submit = () => {
    if (Game.state.answered) return;
    const raw = input.value.trim().replace(",", ".");
    const val = parseFloat(raw);
    if (Number.isNaN(val)) {
      input.focus();
      return;
    }
    const isCorrect = Math.abs(val - q.correctValue) < 0.06;
    answerQuestion(isCorrect, q);
    input.disabled = true;
    checkBtn.disabled = true;
  };

  checkBtn.addEventListener("click", submit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submit();
  });
  input.focus();
}

function answerQuestion(isCorrect, q) {
  Game.state.answered = true;
  Game.state.sessionTotal++;
  if (isCorrect) {
    Game.state.correctCount++;
    Game.state.sessionCorrect++;
  }
  renderScoreboard();
  Game.Scores.recordAnswer(Game.Auth.currentUser.uid, isCorrect).catch((err) =>
    console.error("Antwort konnte nicht gespeichert werden", err)
  );

  const feedback = document.getElementById("feedback");
  feedback.classList.add("show", isCorrect ? "correct" : "wrong");
  feedback.textContent = buildFeedbackText(isCorrect, q);

  document.getElementById("next-btn").disabled = false;
}

function buildFeedbackText(isCorrect, q) {
  if (q.kind === "code") {
    const correctOption = q.options.find((o) => o.correct);
    return isCorrect ? "Richtig!" : `Leider falsch. Richtig wäre: ${correctOption.value}`;
  }
  return isCorrect
    ? `Richtig! ∫ = F(b) − F(a) = ${formatNum(q.correctValue)} FE`
    : `Leider falsch. Richtig wäre: ∫ = F(b) − F(a) = ${formatNum(q.correctValue)} FE`;
}

function nextQuestion() {
  Game.state.index++;
  Game.state.answered = false;
  if (Game.state.index >= Game.state.questions.length) {
    Game.state.screen = "summary";
  }
  render();
}

function renderSummary() {
  const { correctCount, questions, moduleId, levelId } = Game.state;
  const total = questions.length;
  Game.Scores.recordAttempt(Game.Auth.currentUser.uid, moduleId, levelId, correctCount, total).catch(
    (err) => console.error("Ergebnis konnte nicht gespeichert werden", err)
  );
  const pct = Math.round((correctCount / total) * 100);
  let message;
  if (pct >= 80) message = "Stark! Das sitzt.";
  else if (pct >= 50) message = "Gut gemacht, mit etwas Übung wird's noch besser.";
  else message = "Übung macht den Meister – versuch's noch einmal.";

  appEl.innerHTML = `
    <div class="summary-panel">
      <h2>Ergebnis</h2>
      <div class="big-score">${correctCount} / ${total}</div>
      <p>${message}</p>
      <div class="quiz-actions summary-actions">
        <button class="secondary" id="retry-btn">Stufe wiederholen</button>
        <button class="secondary" id="levels-btn">Andere Stufe</button>
        <button id="start-btn">Zum Start</button>
      </div>
    </div>
  `;
  document.getElementById("retry-btn").addEventListener("click", () => startLevel(Game.state.levelId));
  document.getElementById("levels-btn").addEventListener("click", () => {
    Game.state.screen = "levels";
    render();
  });
  document.getElementById("start-btn").addEventListener("click", () => {
    Game.state.screen = "start";
    render();
  });
}

Game.Auth.onReady(async (user) => {
  if (!user) {
    Game.state.screen = "login";
    render();
    return;
  }
  try {
    const agg = await Game.Scores.loadAggregate(user.uid);
    if (agg.disabled) {
      Game.state.loginNotice = "Dieses Konto wurde deaktiviert. Bitte wende dich an deine Lehrkraft.";
      await Game.Auth.logout(); // loest onAuthStateChanged(null) aus -> zeigt den Login-Screen
      return;
    }
    Game.state.sessionCorrect = agg.correct;
    Game.state.sessionTotal = agg.total;
    Game.state.nickname = agg.nickname;
    Game.state.course = agg.course;
    Game.state.subjectTracks = agg.subjectTracks;
    if (!agg.username) {
      Game.Scores.ensureUsername(user.uid, user.email.split("@")[0]).catch(() => {});
    }
  } catch (err) {
    console.error("Punktestand konnte nicht geladen werden", err);
  }
  if (Game.state.screen === "login") Game.state.screen = "start";
  render();
});
