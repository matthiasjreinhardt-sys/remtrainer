// Zeichnet einen Funktionsgraphen inkl. schraffierter Flaeche zwischen a und b
// auf ein <canvas>. Flaeche oberhalb der x-Achse blau, unterhalb orange,
// damit die Flaechenbilanz (Integral als Summe vorzeichenbehafteter Flaechen)
// visuell erkennbar wird.

window.Game = window.Game || {};

Game.Graph = {
  draw(canvas, funcObj, a, b) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth || 640;
    const cssHeight = 340;
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.height = cssHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const pad = 30;
    const [domMin, domMax] = funcObj.domain;
    // etwas Rand links/rechts vom Definitionsbereich fuer bessere Lesbarkeit
    const xMin = domMin - (domMax - domMin) * 0.08;
    const xMax = domMax + (domMax - domMin) * 0.08;

    // y-Wertebereich durch Abtasten bestimmen
    const samples = 200;
    let yMin = Infinity;
    let yMax = -Infinity;
    for (let i = 0; i <= samples; i++) {
      const x = xMin + ((xMax - xMin) * i) / samples;
      const y = funcObj.f(x);
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    }
    yMin = Math.min(yMin, 0);
    yMax = Math.max(yMax, 0);
    const yPad = (yMax - yMin) * 0.15 || 1;
    yMin -= yPad;
    yMax += yPad;

    const plotW = cssWidth - pad * 2;
    const plotH = cssHeight - pad * 2;

    const toPx = (x) => pad + ((x - xMin) / (xMax - xMin)) * plotW;
    const toPy = (y) => pad + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

    // Gitter
    ctx.strokeStyle = "rgba(148,163,184,0.15)";
    ctx.lineWidth = 1;
    const xStep = niceStep(xMax - xMin);
    for (let gx = Math.ceil(xMin / xStep) * xStep; gx <= xMax; gx += xStep) {
      ctx.beginPath();
      ctx.moveTo(toPx(gx), pad);
      ctx.lineTo(toPx(gx), pad + plotH);
      ctx.stroke();
    }
    const yStep = niceStep(yMax - yMin);
    for (let gy = Math.ceil(yMin / yStep) * yStep; gy <= yMax; gy += yStep) {
      ctx.beginPath();
      ctx.moveTo(pad, toPy(gy));
      ctx.lineTo(pad + plotW, toPy(gy));
      ctx.stroke();
    }

    // Schraffierte Flaeche zwischen a und b, getrennt nach Vorzeichen
    const fillSamples = 120;
    const drawFill = (color) => {
      ctx.fillStyle = color;
    };
    let segStartX = a;
    let segSign = Math.sign(funcObj.f(a)) || 0;

    const paintSegment = (x0, x1, sign) => {
      if (x1 - x0 < 1e-9) return;
      ctx.beginPath();
      ctx.moveTo(toPx(x0), toPy(0));
      const steps = Math.max(2, Math.round((fillSamples * (x1 - x0)) / (b - a)));
      for (let i = 0; i <= steps; i++) {
        const x = x0 + ((x1 - x0) * i) / steps;
        ctx.lineTo(toPx(x), toPy(funcObj.f(x)));
      }
      ctx.lineTo(toPx(x1), toPy(0));
      ctx.closePath();
      ctx.fillStyle = sign < 0 ? "rgba(249,115,22,0.45)" : "rgba(59,130,246,0.45)";
      ctx.fill();
    };

    // in kleine Intervalle zerlegen und bei Vorzeichenwechsel neu beginnen
    const n = 160;
    let prevX = a;
    let prevSign = Math.sign(funcObj.f(a));
    for (let i = 1; i <= n; i++) {
      const x = a + ((b - a) * i) / n;
      const sign = Math.sign(funcObj.f(x));
      if (sign !== prevSign && sign !== 0 && prevSign !== 0) {
        paintSegment(prevX, x, prevSign);
        prevX = x;
      }
      prevSign = sign || prevSign;
    }
    paintSegment(prevX, b, prevSign);

    // Achsen
    ctx.strokeStyle = "rgba(226,232,240,0.8)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad, toPy(0));
    ctx.lineTo(pad + plotW, toPy(0));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(toPx(0), pad);
    ctx.lineTo(toPx(0), pad + plotH);
    ctx.stroke();

    // Achsbeschriftungen
    ctx.fillStyle = "rgba(148,163,184,0.9)";
    ctx.font = "11px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    for (let gx = Math.ceil(xMin / xStep) * xStep; gx <= xMax; gx += xStep) {
      if (Math.abs(gx) < xStep / 100) continue;
      ctx.fillText(formatNum(gx), toPx(gx), toPy(0) + 14);
    }
    ctx.textAlign = "right";
    for (let gy = Math.ceil(yMin / yStep) * yStep; gy <= yMax; gy += yStep) {
      if (Math.abs(gy) < yStep / 100) continue;
      ctx.fillText(formatNum(gy), toPx(0) - 6, toPy(gy) + 4);
    }

    // Funktionsgraph
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= samples; i++) {
      const x = xMin + ((xMax - xMin) * i) / samples;
      const y = funcObj.f(x);
      const px = toPx(x);
      const py = toPy(y);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Grenzen a und b markieren
    ctx.strokeStyle = "rgba(226,232,240,0.6)";
    ctx.setLineDash([4, 4]);
    [a, b].forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(toPx(x), pad);
      ctx.lineTo(toPx(x), pad + plotH);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "center";
    ctx.fillText("a=" + formatNum(a), toPx(a), pad - 8);
    ctx.fillText("b=" + formatNum(b), toPx(b), pad - 8);
  },

  // Zeichnet zwei Funktionsgraphen (f, g) und schraffiert die Flaeche
  // zwischen ihnen auf [a,b]. Erwartet, dass f(x) >= g(x) auf [a,b] gilt
  // (keine Ueberschneidung innerhalb der Grenzen) - das stellt die
  // Aufgaben-Generierung sicher, hier wird nicht geprueft/korrigiert.
  drawBetween(canvas, fFunc, gFunc, domain, a, b) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth || 640;
    const cssHeight = 340;
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.height = cssHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const pad = 30;
    const [domMin, domMax] = domain;
    const xMin = domMin - (domMax - domMin) * 0.08;
    const xMax = domMax + (domMax - domMin) * 0.08;

    const samples = 200;
    let yMin = Infinity;
    let yMax = -Infinity;
    for (let i = 0; i <= samples; i++) {
      const x = xMin + ((xMax - xMin) * i) / samples;
      const yf = fFunc(x);
      const yg = gFunc(x);
      yMin = Math.min(yMin, yf, yg);
      yMax = Math.max(yMax, yf, yg);
    }
    yMin = Math.min(yMin, 0);
    yMax = Math.max(yMax, 0);
    const yPad = (yMax - yMin) * 0.15 || 1;
    yMin -= yPad;
    yMax += yPad;

    const plotW = cssWidth - pad * 2;
    const plotH = cssHeight - pad * 2;

    const toPx = (x) => pad + ((x - xMin) / (xMax - xMin)) * plotW;
    const toPy = (y) => pad + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

    // Gitter
    ctx.strokeStyle = "rgba(148,163,184,0.15)";
    ctx.lineWidth = 1;
    const xStep = niceStep(xMax - xMin);
    for (let gx = Math.ceil(xMin / xStep) * xStep; gx <= xMax; gx += xStep) {
      ctx.beginPath();
      ctx.moveTo(toPx(gx), pad);
      ctx.lineTo(toPx(gx), pad + plotH);
      ctx.stroke();
    }
    const yStep = niceStep(yMax - yMin);
    for (let gy = Math.ceil(yMin / yStep) * yStep; gy <= yMax; gy += yStep) {
      ctx.beginPath();
      ctx.moveTo(pad, toPy(gy));
      ctx.lineTo(pad + plotW, toPy(gy));
      ctx.stroke();
    }

    // Schraffierte Flaeche zwischen f und g auf [a,b]
    const steps = 120;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const x = a + ((b - a) * i) / steps;
      const px = toPx(x);
      const py = toPy(fFunc(x));
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    for (let i = steps; i >= 0; i--) {
      const x = a + ((b - a) * i) / steps;
      ctx.lineTo(toPx(x), toPy(gFunc(x)));
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(168,85,247,0.35)";
    ctx.fill();

    // Achsen
    ctx.strokeStyle = "rgba(226,232,240,0.8)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad, toPy(0));
    ctx.lineTo(pad + plotW, toPy(0));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(toPx(0), pad);
    ctx.lineTo(toPx(0), pad + plotH);
    ctx.stroke();

    // Achsbeschriftungen
    ctx.fillStyle = "rgba(148,163,184,0.9)";
    ctx.font = "11px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    for (let gx = Math.ceil(xMin / xStep) * xStep; gx <= xMax; gx += xStep) {
      if (Math.abs(gx) < xStep / 100) continue;
      ctx.fillText(formatNum(gx), toPx(gx), toPy(0) + 14);
    }
    ctx.textAlign = "right";
    for (let gy = Math.ceil(yMin / yStep) * yStep; gy <= yMax; gy += yStep) {
      if (Math.abs(gy) < yStep / 100) continue;
      ctx.fillText(formatNum(gy), toPx(0) - 6, toPy(gy) + 4);
    }

    // Graphen von f (hell) und g (gelb)
    const strokeCurve = (fn, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const x = xMin + ((xMax - xMin) * i) / samples;
        const px = toPx(x);
        const py = toPy(fn(x));
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    };
    strokeCurve(fFunc, "#e2e8f0");
    strokeCurve(gFunc, "#fbbf24");

    // Grenzen a und b markieren
    ctx.strokeStyle = "rgba(226,232,240,0.6)";
    ctx.setLineDash([4, 4]);
    [a, b].forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(toPx(x), pad);
      ctx.lineTo(toPx(x), pad + plotH);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "center";
    ctx.fillText("a=" + formatNum(a), toPx(a), pad - 8);
    ctx.fillText("b=" + formatNum(b), toPx(b), pad - 8);
  },
};

function niceStep(range) {
  if (range <= 4) return 0.5;
  if (range <= 10) return 1;
  if (range <= 20) return 2;
  return 5;
}

function formatNum(n) {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? String(r) : r.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}
