// Genera index.html: ULIBRICKS, spot da 30 secondi.
// Riprese vere del gioco a tutto schermo, tipografia cinetica (Unbounded + Inter), transizioni a effetto:
// zoom dentro le lettere, muro di mattoncini, zoom-blur, glitch, whip pan, fette, flash, raffica finale.
// Uso: node tools/build.mjs && python3 tools/mix.py
import fs from "node:fs";

const W = 1080, H = 1920, TOTAL = 30;
const read = (f) => JSON.parse(fs.readFileSync(new URL("../assets/" + f, import.meta.url)));

// ── riprese: at = quando parte, dur = durata, from = punto nella ripresa, rate = velocità
// cam = movimento di camera sulla ripresa [scala inizio, scala fine, origine]
const SEGS = [
  { id: "hero", src: "hero", at: 0, dur: 1.8, from: 2.2, rate: 1.3, cam: [1.3, 1.5, "50% 45%"] },
  { id: "reel", src: "reel", at: 1.8, dur: 3.8, from: 10.0, rate: 2.0, cam: [1.12, 1.24, "50% 58%"] },
  { id: "creator", src: "creator2", at: 5.6, dur: 3.2, from: 0.4, rate: 2.6, cam: [1.0, 1.32, "50% 16%"] },
  { id: "drago", src: "zoo", at: 8.8, dur: 1.5, from: 2.2, rate: 1.5, cam: [1.25, 1.38, "42% 58%"] },
  { id: "chimera", src: "zoo", at: 10.3, dur: 2.3, from: 19.6, rate: 1.7, cam: [1.3, 1.42, "50% 56%"] },
  { id: "car", src: "car", at: 12.6, dur: 3.0, from: 1.6, rate: 1.2, cam: [1.38, 1.38, "50% 50%"], steer: "car.steer.json" },
  { id: "dyn", src: "dyn", at: 15.6, dur: 2.4, from: 5.6, rate: 1, cam: [1.08, 1.26, "50% 42%"] },
  { id: "tetris", src: "tetris2", at: 18.0, dur: 1.7, from: 7.0, rate: 1, cam: [1.12, 1.2, "50% 45%"] },
  { id: "run", src: "run2", at: 19.7, dur: 1.9, from: 12.4, rate: 1.1, cam: [1.1, 1.22, "50% 55%"] },
  { id: "m1", src: "quake", at: 21.6, dur: 0.2, from: 3.0, rate: 1, cam: [1.2, 1.25, "50% 40%"] },
  { id: "m2", src: "vita", at: 21.8, dur: 0.2, from: 3.0, rate: 1, cam: [1.2, 1.25, "50% 40%"] },
  { id: "m3", src: "lineup", at: 22.0, dur: 0.2, from: 2.0, rate: 1, cam: [1.2, 1.25, "50% 40%"] },
  { id: "m4", src: "zoo", at: 22.2, dur: 0.2, from: 26.5, rate: 1, cam: [1.3, 1.35, "50% 55%"] },
  { id: "m5", src: "hero", at: 22.4, dur: 0.2, from: 5.5, rate: 1, cam: [1.2, 1.25, "50% 40%"] },
  { id: "m6", src: "tetris2", at: 22.6, dur: 0.2, from: 12.45, rate: 1, cam: [1.15, 1.2, "50% 45%"] },
  { id: "m7", src: "reel", at: 22.8, dur: 0.2, from: 16.5, rate: 1, cam: [1.2, 1.25, "50% 50%"] },
];
const BOOM = 15.6 + (6.9 - 5.6); // esplosione della dinamite
const TBOOM = 18.0 + (8.23 - 7.0); // esplosione del Tetris

// ── parole: n = numero capitolo, w = parola gigante, s = riga, c = colore
const WORDS = [
  { t: 1.8, e: 5.6, n: "01", w: "COSTRUISCI", s: "Città intere, un mattoncino alla volta.", c: "#4aa3ff", g: "linear-gradient(100deg,#7cc4ff,#2f6bff 60%,#8a5cff)" },
  { t: 5.6, e: 8.8, n: "02", w: "CREA", s: "Miliardi di miliardi di personaggi.", c: "#ff5cb8", g: "linear-gradient(100deg,#ff9ad5,#ee45a8 55%,#9b5cff)" },
  { t: 8.8, e: 10.3, n: "03", w: "DRAGHI", s: "Sì, anche al guinzaglio.", c: "#3dff9e", g: "linear-gradient(100deg,#a6ffcf,#22d38a 55%,#19b6c9)" },
  { t: 10.3, e: 12.6, n: "03", w: "CAVALCA", s: "Una chimera? Salta in sella.", c: "#3dff9e", g: "linear-gradient(100deg,#a6ffcf,#22d38a 55%,#19b6c9)" },
  { t: 12.6, e: 15.6, n: "04", w: "GUIDA", s: "Inclina il telefono per sterzare.", c: "#4fd8ff", g: "linear-gradient(100deg,#b0f1ff,#22c4f0 55%,#2f6bff)" },
  { t: 15.6, e: 18.0, n: "05", w: "BOOM!", s: "Poi fai saltare tutto.", c: "#ff7a3d", g: "linear-gradient(100deg,#ffe066,#ff6a3d 50%,#ff2d55)", at: BOOM },
  { t: 18.0, e: 19.7, n: "06", w: "GIOCA", s: "Pioggia di mattoncini.", c: "#ffc72c", g: "linear-gradient(100deg,#fff38a,#ffc72c 50%,#ff8a3d)" },
  { t: 19.7, e: 21.6, n: "06", w: "CORRI", s: "Con i personaggi che hai creato.", c: "#ffc72c", g: "linear-gradient(100deg,#fff38a,#ffc72c 50%,#ff8a3d)" },
];
const FLASHW = ["COSTRUISCI", "CREA", "CAVALCA", "GUIDA", "DISTRUGGI", "GIOCA", "CORRI"];

// ── inclinazione della ripresa della guida, sincronizzata con lo sterzo registrato
const TILT = [];
SEGS.filter((s) => s.steer).forEach((s) => {
  const j = read(s.steer);
  j.log.filter((_, i) => i % 2 === 0).forEach(([f, st, ac]) => {
    const t = s.at + (f / j.fps - s.from) / s.rate;
    if (t >= s.at && t <= s.at + s.dur) TILT.push([+t.toFixed(2), +(-st * 9).toFixed(2), +(ac * 0.06).toFixed(3)]);
  });
});

fs.writeFileSync(new URL("../assets/timeline.json", import.meta.url), JSON.stringify({ SEGS, WORDS, BOOM, TBOOM, TOTAL }, null, 1));

const videos = SEGS.map((s) => `        <video id="v-${s.id}" class="clip vid" src="assets/v/${s.src}.mp4" muted playsinline data-start="${s.at}" data-duration="${s.dur}" data-media-start="${s.from}" data-playback-rate="${s.rate}" data-track-index="1"></video>`).join("\n");
const ff = (fam, file, w) => `@font-face { font-family:"${fam}"; font-weight:${w}; font-style:normal; src:url("assets/fonts/${file}-latin-${w}-normal.woff2") format("woff2"); }`;
const fonts = [...[500, 600, 700, 800].map((w) => ff("Inter", "inter", w)), ...[400, 700, 900].map((w) => ff("Unbounded", "unbounded", w))].join("\n      ");

const html = `<!doctype html>
<html lang="it" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <title>ULIBRICKS · 30 secondi</title>
    <script src="assets/gsap.min.js"></script>
    <script src="assets/qrlib.js"></script>
    <style>
      ${fonts}
      * { margin:0; padding:0; box-sizing:border-box; }
      html, body { width:${W}px; height:${H}px; overflow:hidden; background:#0a0f2e; }
      #root { position:relative; width:100%; height:100%; overflow:hidden; background:#0a0f2e; color:#fff; font-family:"Inter", sans-serif; }
      #bg { position:absolute; inset:0; overflow:hidden; background:linear-gradient(160deg,#101a52 0%,#0a0f2e 45%,#250c45 100%); }
      .blob { position:absolute; width:1200px; height:1200px; border-radius:50%; filter:blur(60px); opacity:.75; }
      #studs { position:absolute; inset:-60px; opacity:.09; background-image:radial-gradient(circle at 50% 50%, #fff 0 17px, transparent 19px); background-size:72px 72px; }
      #vwrap { position:absolute; inset:0; overflow:hidden; }
      .vid { position:absolute; left:0; top:0; width:${W}px; height:${H}px; object-fit:cover; filter:contrast(1.06) saturate(1.12); }
      #shade { position:absolute; inset:0; pointer-events:none;
        background:linear-gradient(180deg, rgba(6,9,30,.82) 0%, rgba(6,9,30,0) 22%, rgba(6,9,30,0) 48%, rgba(6,9,30,.72) 66%, rgba(6,9,30,.97) 86%),
                   radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(0,0,0,.45) 100%); }
      .big { position:absolute; left:0; width:${W}px; text-align:center; font-family:"Unbounded", sans-serif; font-weight:900; line-height:1; letter-spacing:-.03em; white-space:nowrap; text-transform:uppercase; }
      .m { display:inline-block; overflow:hidden; vertical-align:top; padding:.06em 0 .1em; margin:-.06em 0 -.1em; }
      .c { display:inline-block; }
      .fillg { filter:drop-shadow(0 7px 0 rgba(0,0,0,.6)) drop-shadow(0 0 28px rgba(0,0,0,.6)); }
      .line { color:transparent; -webkit-text-stroke:3px rgba(255,255,255,.55); }
      .idx { position:absolute; left:64px; top:140px; font-family:"Unbounded", sans-serif; font-weight:700; font-size:36px; letter-spacing:.06em; text-shadow:0 3px 12px rgba(0,0,0,.8); }
      .bar { position:absolute; left:64px; top:196px; height:6px; width:120px; border-radius:3px; }
      .sub { position:absolute; left:48px; top:226px; max-width:984px; padding:18px 28px 22px; border-radius:26px; background:rgba(7,10,32,.78); box-shadow:0 12px 40px rgba(0,0,0,.35); font-weight:800; font-size:62px; line-height:1.12; letter-spacing:-.02em; }
      .abs { position:absolute; }
      #bricks, #bands, #fx { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
      .brk { position:absolute; width:184px; height:176px; border-radius:16px; transform-origin:50% 50%;
        background-image:radial-gradient(circle at 30% 30%, rgba(255,255,255,.35) 0 22px, transparent 24px), radial-gradient(circle at 70% 30%, rgba(255,255,255,.35) 0 22px, transparent 24px),
          radial-gradient(circle at 30% 72%, rgba(255,255,255,.35) 0 22px, transparent 24px), radial-gradient(circle at 70% 72%, rgba(255,255,255,.35) 0 22px, transparent 24px);
        box-shadow:inset 0 -14px 0 rgba(0,0,0,.25); }
      .band { position:absolute; left:0; width:${W}px; }
      .leak { position:absolute; width:1400px; height:1400px; border-radius:50%; mix-blend-mode:screen; filter:blur(50px); opacity:0; }
      .scan { position:absolute; left:0; width:${W}px; mix-blend-mode:screen; opacity:0; }
      #dim { position:absolute; inset:0; background:rgba(5,8,26,.42); opacity:0; }
      #flash { position:absolute; inset:0; background:#fff; opacity:0; }
      #grain { position:absolute; inset:-200px; opacity:.07; mix-blend-mode:overlay; pointer-events:none; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}">
      <div id="bg">
        <div class="blob" id="b1" style="left:-520px; top:-380px; background:radial-gradient(circle,#2f6bff,transparent 65%)"></div>
        <div class="blob" id="b2" style="left:420px; top:700px; background:radial-gradient(circle,#ee45a8,transparent 65%)"></div>
        <div class="blob" id="b3" style="left:-300px; top:1250px; background:radial-gradient(circle,#ffc72c,transparent 65%); opacity:.45"></div>
        <div id="studs"></div>
      </div>
      <div id="vwrap" data-layout-allow-overflow>
${videos}
      </div>
      <div id="shade"></div>
      <div id="dim"></div>
      <div id="fx"></div>
      <div id="hud" class="clip" data-start="0" data-duration="${TOTAL}" data-track-index="3" style="position:absolute; inset:0"></div>
      <div id="bricks"></div>
      <div id="bands"></div>
      <div id="flash"></div>
      <div id="grain"></div>
      <audio id="mix" src="assets/mix.mp3" data-start="0" data-duration="${TOTAL}" data-track-index="10" data-volume="1"></audio>
    </div>
    <script>
      const SEGS = ${JSON.stringify(SEGS)};
      const WORDS = ${JSON.stringify(WORDS)};
      const FLASHW = ${JSON.stringify(FLASHW)};
      const TILT = ${JSON.stringify(TILT)};
      const BOOM = ${BOOM}, TBOOM = ${TBOOM};
      const $ = (id) => document.getElementById(id);
      function el(tag, cls, css, parent, txt) {
        const e = document.createElement(tag); if (cls) e.className = cls;
        if (css) for (const k in css) { if (k.startsWith("--")) e.style.setProperty(k, css[k]); else e.style[k] = css[k]; }
        if (txt != null) e.textContent = txt; if (parent) parent.appendChild(e); return e;
      }
      let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      // parola spezzata in lettere, ognuna dentro una maschera
      function split(e, text) { e.textContent = ""; return [...text].map((ch) => { const m = el("span", "m", null, e); return el("span", "c", null, m, ch === " " ? "\\u00a0" : ch); }); }
      // gradiente continuo su tutta la parola, applicato lettera per lettera
      function paint(e, g) {
        const cs = [...e.querySelectorAll(".c")]; if (!cs.length) return;
        const x0 = cs[0].parentNode.offsetLeft, ww = cs[cs.length - 1].parentNode.offsetLeft + cs[cs.length - 1].parentNode.offsetWidth - x0;
        cs.forEach((c) => { c.style.backgroundImage = g; c.style.backgroundSize = ww + "px 100%"; c.style.backgroundPosition = -(c.parentNode.offsetLeft - x0) + "px 0"; c.style.webkitBackgroundClip = "text"; c.style.backgroundClip = "text"; c.style.color = "transparent"; });
      }
      // adatta la dimensione del testo alla larghezza
      function fit(e, maxW, maxFs) { e.style.fontSize = "100px"; const ow = e.style.width; e.style.width = "auto"; const w = e.offsetWidth; e.style.width = ow; const fs = Math.min(maxFs, Math.floor(100 * maxW / w)); e.style.fontSize = fs + "px"; return fs; }

      function build() {
        const tl = gsap.timeline({ paused: true });
        const hud = $("hud"), vwrap = $("vwrap"), flash = $("flash"), fx = $("fx"), shade = $("shade");
        const NI = { immediateRender: false };

        /* ── sfondo vivo e grana ── */
        tl.to("#b1", { x: 380, y: 260, duration: 30, ease: "sine.inOut" }, 0);
        tl.to("#b2", { x: -420, y: -300, duration: 30, ease: "sine.inOut" }, 0);
        tl.to("#b3", { x: 520, y: -200, duration: 30, ease: "sine.inOut" }, 0);
        tl.to("#studs", { backgroundPosition: "0px 432px", duration: 30, ease: "none" }, 0);
        {
          const cv = document.createElement("canvas"); cv.width = cv.height = 256; const g = cv.getContext("2d"), im = g.createImageData(256, 256);
          for (let i = 0; i < im.data.length; i += 4) { const v = Math.floor(rnd() * 255); im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
          g.putImageData(im, 0, 0); $("grain").style.backgroundImage = "url(" + cv.toDataURL() + ")";
          tl.to("#grain", { x: 180, y: -140, duration: 30, ease: "steps(900)" }, 0);
        }

        /* ── camera sulle riprese ── */
        SEGS.forEach((s) => {
          const v = $("v-" + s.id); gsap.set(v, { transformOrigin: s.cam[2] });
          tl.fromTo(v, { scale: s.cam[0] }, { scale: s.cam[1], duration: s.dur, ease: "none" }, s.at);
        });
        // guida: l'inquadratura si inclina con lo sterzo
        for (let i = 1; i < TILT.length; i++) {
          const [t0] = TILT[i - 1], [t1, rz, ac] = TILT[i]; if (t1 <= t0) continue;
          tl.to("#v-car", { rotation: rz, scale: 1.38 + ac, duration: t1 - t0, ease: "none" }, t0);
        }
        tl.set(shade, { opacity: 1 }, 0); tl.set(shade, { opacity: 0 }, 23.0);

        /* ── 0: gancio — cos'è, detto subito ── */
        {
          tl.set("#dim", { opacity: 1 }, 0); tl.to("#dim", { opacity: 0, duration: 0.2 }, 1.7);
          const pill = el("div", "abs", { left: "0px", top: "780px", width: "1080px", textAlign: "center" }, hud);
          const pi = el("span", null, { display: "inline-block", padding: "16px 34px", borderRadius: "60px", background: "#ffc72c", color: "#0a0f2e", fontFamily: "Unbounded", fontWeight: 700, fontSize: "34px", letterSpacing: ".04em" }, pill, "IL GIOCO DI MATTONCINI 3D");
          const l1 = el("div", "big", { top: "0px", color: "#fff", filter: "drop-shadow(0 7px 0 rgba(0,0,0,.6)) drop-shadow(0 0 28px rgba(0,0,0,.6))" }, hud, "MATTONCINI"); const fs = fit(l1, 980, 200);
          const l2 = el("div", "big fillg", {}, hud, "INFINITI."); l2.style.fontSize = fs * 1.12 + "px";
          l1.style.top = "900px"; l2.style.top = 900 + fs * 1.02 + "px";
          const c1 = split(l1, "MATTONCINI"), c2 = split(l2, "INFINITI."); paint(l2, "linear-gradient(100deg,#fff38a,#ffc72c 45%,#ff6a3d)");
          const sl = el("div", "big", { top: 900 + fs * 2.3 + "px", fontFamily: "Inter", fontWeight: 800, fontSize: "50px", letterSpacing: "-.01em", textTransform: "none", textShadow: "0 3px 14px rgba(0,0,0,.9)" }, hud);
          const c3 = split(sl, "Gratis, sul telefono e nel browser.");
          tl.fromTo(pi, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" }, 0.02);
          tl.fromTo(c1, { yPercent: 118, rotation: 6 }, { yPercent: 0, rotation: 0, duration: 0.45, ease: "expo.out", stagger: 0.025 }, 0.1);
          tl.fromTo(c2, { yPercent: 118, rotation: 6 }, { yPercent: 0, rotation: 0, duration: 0.45, ease: "expo.out", stagger: 0.03 }, 0.3);
          tl.fromTo(c3, { yPercent: 115 }, { yPercent: 0, duration: 0.4, ease: "expo.out", stagger: 0.006 }, 0.6);
          tl.to([l1, l2], { scale: 1.06, duration: 1.2, ease: "none", transformOrigin: "50% 50%" }, 0.5);
          tl.to([pill, l1, l2, sl], { opacity: 0, duration: 0.12 }, 1.66);
          tl.set([pill, l1, l2, sl], { opacity: 0 }, 1.8);
        }
        punch(1.8);

        /* ── parole dei capitoli ── */
        WORDS.forEach((W, i) => {
          const t0 = W.at || W.t, end = W.e;
          const sameCh = i > 0 && WORDS[i - 1].n === W.n;
          const w = el("div", "big fillg", { "--g": W.g }, hud, W.w); const fs = fit(w, 960, 250);
          const top = 1920 - 170 - fs; w.style.top = top + "px";
          const cs = split(w, W.w); paint(w, W.g);
          tl.set(w, { opacity: 0 }, 0); tl.set(w, { opacity: 1 }, t0); tl.set(w, { opacity: 0 }, end);
          const boom = W.w === "BOOM!";
          if (boom) {
            tl.fromTo(cs, { yPercent: 0, scale: 0.2, rotation: () => (rnd() - 0.5) * 70, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: "back.out(3)", stagger: 0.04 }, t0);
            tl.to(w, { scale: 1.06, duration: end - t0 - 0.3, ease: "none", transformOrigin: "50% 50%" }, t0 + 0.5);
          } else {
            tl.fromTo(cs, { yPercent: 118, rotation: 6 }, { yPercent: 0, rotation: 0, duration: 0.6, ease: "expo.out", stagger: 0.04 }, t0 + 0.05);
          }
          tl.to(cs, { yPercent: -118, duration: 0.22, ease: "power3.in", stagger: 0.015 }, end - 0.24);
          // indice, barra e riga
          if (!sameCh) {
            const nEnd = (WORDS[i + 1] && WORDS[i + 1].n === W.n) ? WORDS[i + 1].e : end;
            const ix = el("div", "idx", { color: W.c, opacity: 0 }, hud, W.n + " / 06");
            const br = el("div", "bar", { background: W.c, opacity: 0 }, hud);
            tl.fromTo(ix, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }, W.t + 0.1);
            tl.fromTo(br, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, transformOrigin: "0% 50%", duration: 0.45, ease: "expo.out" }, W.t + 0.15);
            tl.to([ix, br], { opacity: 0, duration: 0.15 }, nEnd - 0.2);
          }
          const sb = el("div", "sub", { opacity: 0 }, hud);
          const words = W.s.split(" ").map((x) => { const m = el("span", "m", null, sb); const c = el("span", "c", null, m, x); sb.appendChild(document.createTextNode(" ")); return c; });
          tl.fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: "expo.out", stagger: 0.03 }, W.t + 0.22);
          tl.set(sb, { opacity: 1 }, W.t + 0.22); tl.to(sb, { opacity: 0, duration: 0.12 }, end - 0.14);
          tl.to(words, { yPercent: -110, duration: 0.2, ease: "power2.in", stagger: 0.01 }, end - 0.22);
        });

        /* ── TRANSIZIONI ── */
        // T2: muro di mattoncini (5.6)
        {
          const cols = ["#e53935", "#1e88e5", "#43a047", "#fdd835", "#ee45a8", "#ff7a1a", "#7a5cff"]; const B = [];
          for (let r = 0; r < 11; r++) for (let c = 0; c < 6; c++) B.push(el("div", "brk", { left: c * 180 - 2 + "px", top: r * 175 - 2 + "px", background: cols[(r * 3 + c * 2) % cols.length] }, $("bricks")));
          tl.fromTo(B, { scale: 0, rotation: -25 }, { scale: 1.02, rotation: 0, duration: 0.24, ease: "back.out(1.6)", stagger: { grid: [11, 6], from: "end", amount: 0.22 } }, 5.12);
          tl.to(B, { scale: 0, rotation: 25, duration: 0.22, ease: "power2.in", stagger: { grid: [11, 6], from: "start", amount: 0.22 } }, 5.62);
        }
        // zoom-blur (8.8, 19.7)
        function punch(T) {
          tl.to(vwrap, { scale: 1.28, filter: "blur(16px) brightness(1.5)", duration: 0.14, ease: "power2.in" }, T - 0.14);
          tl.fromTo(vwrap, { scale: 1.3, filter: "blur(16px) brightness(1.5)" }, { scale: 1, filter: "blur(0px) brightness(1)", duration: 0.32, ease: "expo.out", immediateRender: false }, T);
        }
        punch(8.8); punch(19.7);
        // glitch (10.3)
        {
          const C = ["#ff2d55", "#22d3ee", "#3dff9e", "#ff2d55", "#7a5cff", "#22d3ee"];
          const S = C.map((c, i) => el("div", "scan", { top: 180 + i * 290 + "px", height: 40 + (i % 3) * 30 + "px", background: c }, fx));
          [0, 0.04, 0.08, 0.12, 0.16].forEach((d, k) => {
            tl.set(vwrap, { x: [36, -48, 28, -20, 0][k], filter: ["hue-rotate(90deg) saturate(2)", "hue-rotate(-60deg) contrast(1.4)", "invert(.15) saturate(2)", "hue-rotate(40deg)", "none"][k] }, 10.22 + d);
            S.forEach((s, j) => tl.set(s, { opacity: (j + k) % 2 ? 0.75 : 0, x: (j % 2 ? 1 : -1) * 60 * (k + 1) }, 10.22 + d));
          });
          tl.set(S, { opacity: 0 }, 10.42); tl.set(vwrap, { x: 0, filter: "none" }, 10.42);
        }
        // whip pan (12.6)
        tl.to(vwrap, { x: -900, filter: "blur(22px)", duration: 0.16, ease: "power3.in" }, 12.44);
        tl.fromTo(vwrap, { x: 900, filter: "blur(22px)" }, { x: 0, filter: "blur(0px)", duration: 0.3, ease: "expo.out", immediateRender: false }, 12.6);
        // fette (15.6)
        {
          const n = 8, hh = 1920 / n, cols = ["#ff6a3d", "#ffc72c", "#ff2d55"];
          for (let i = 0; i < n; i++) {
            const b = el("div", "band", { top: i * hh + "px", height: hh + 2 + "px", background: cols[i % 3] }, $("bands"));
            const dir = i % 2 ? 1 : -1;
            tl.fromTo(b, { x: dir * 1100 }, { x: 0, duration: 0.24, ease: "power3.in", immediateRender: true }, 15.32 + i * 0.012);
            tl.to(b, { x: -dir * 1100, duration: 0.28, ease: "power3.out" }, 15.62 + i * 0.012);
          }
        }
        // esplosioni: flash, scossa, luce
        const shake = (T, k = 1) => [[-34, 2], [28, -2], [-20, 1.5], [14, -1], [-7, .5], [0, 0]].forEach(([x, r], i) => tl.to(vwrap, { x: x * k, y: -x * 0.6 * k, rotation: r * k, duration: 0.045, ease: "none" }, T + i * 0.045));
        tl.set(flash, { opacity: 0.9 }, BOOM); tl.to(flash, { opacity: 0, duration: 0.4, ease: "power2.out" }, BOOM + 0.04); shake(BOOM, 1.2);
        tl.set(flash, { opacity: 0.6 }, TBOOM); tl.to(flash, { opacity: 0, duration: 0.3 }, TBOOM + 0.03); shake(TBOOM, 0.6);
        // luci calde (18.0)
        {
          const l1 = el("div", "leak", { left: "-700px", top: "200px", background: "radial-gradient(circle,#ff8a3d,transparent 62%)" }, fx);
          const l2 = el("div", "leak", { left: "500px", top: "900px", background: "radial-gradient(circle,#ffd23f,transparent 62%)" }, fx);
          tl.fromTo(l1, { opacity: 0, x: 0 }, { opacity: 0.9, x: 700, duration: 0.35, ease: "power2.out" }, 17.82);
          tl.to(l1, { opacity: 0, x: 1200, duration: 0.5 }, 18.17);
          tl.fromTo(l2, { opacity: 0, x: 0 }, { opacity: 0.7, x: -500, duration: 0.35, ease: "power2.out" }, 17.88);
          tl.to(l2, { opacity: 0, x: -900, duration: 0.5 }, 18.23);
          tl.fromTo(vwrap, { scale: 1.18 }, { scale: 1, duration: 0.45, ease: "expo.out", immediateRender: false }, 18.0);
        }

        /* ── raffica: tagli da 0,2 s con parole a tutto schermo ── */
        FLASHW.forEach((txt, i) => {
          const T = 21.6 + i * 0.2;
          const w = el("div", "big", { color: i % 2 ? "#ffc72c" : "#fff", filter: "drop-shadow(0 8px 0 rgba(0,0,0,.65)) drop-shadow(0 0 30px rgba(0,0,0,.6))" }, hud); w.textContent = txt; const fs = fit(w, 1000, 300);
          w.style.top = (960 - fs * 0.5) + "px";
          tl.set(w, { opacity: 0 }, 0);
          tl.fromTo(w, { opacity: 1, scale: 1.25 }, { scale: 1, duration: 0.2, ease: "power2.out", immediateRender: false }, T);
          tl.set(w, { opacity: 0 }, T + 0.2);
          tl.fromTo(vwrap, { filter: "brightness(1.7)" }, { filter: "brightness(1)", duration: 0.1, ease: "none", immediateRender: false }, T);
        });
        tl.to(vwrap, { scale: 1.35, duration: 1.4, ease: "power2.in" }, 21.6);
        tl.set(flash, { opacity: 1 }, 23.0); tl.set(vwrap, { opacity: 0, scale: 1 }, 23.0);
        tl.to(flash, { opacity: 0, duration: 0.55, ease: "power2.out" }, 23.02);

        /* ── logo ── */
        {
          const rings = [0, 1, 2].map((k) => el("div", "abs", { left: "290px", top: "610px", width: "500px", height: "500px", borderRadius: "50%", border: "4px solid " + ["#ffc72c", "#ee45a8", "#4aa3ff"][k], opacity: 0 }, hud));
          rings.forEach((r, k) => tl.fromTo(r, { scale: 0.2, opacity: 1 }, { scale: 3.2, opacity: 0, duration: 1.3, ease: "power2.out", immediateRender: false }, 23.05 + k * 0.12));
          const logo = el("img", "abs", { left: "70px", top: "700px", width: "940px", opacity: 0, filter: "drop-shadow(0 26px 40px rgba(0,0,0,.5))" }, hud); logo.src = "assets/logo.png";
          tl.fromTo(logo, { opacity: 0, scale: 1.6, rotation: -6 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: "expo.out", transformOrigin: "50% 50%" }, 23.05);
          tl.to(logo, { scale: 1.05, duration: 2.2, ease: "none" }, 23.75);
          const tag = el("div", "big", { top: "1030px", fontSize: "44px", fontWeight: 700, letterSpacing: ".08em" }, hud); const tc = split(tag, "IL GIOCO DI MATTONCINI 3D");
          tl.set(tag, { opacity: 0 }, 0); tl.set(tag, { opacity: 1 }, 23.6); tl.set(tag, { opacity: 0 }, 26.0);
          tl.fromTo(tc, { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: "expo.out", stagger: 0.018 }, 23.6);
          tl.to(tc, { yPercent: -110, duration: 0.2, ease: "power2.in", stagger: 0.006 }, 25.8);
          tl.to(logo, { y: -500, scale: 0.7, duration: 0.8, ease: "expo.inOut" }, 25.95);
        }

        /* ── chiusura ── */
        {
          const g = el("div", "big fillg", { "--g": "linear-gradient(100deg,#fff38a,#ffc72c 45%,#ff6a3d)" }, hud, "GIOCA ORA"); const fs = fit(g, 960, 200); g.style.top = "640px";
          const gc = split(g, "GIOCA ORA"); paint(g, "linear-gradient(100deg,#fff38a,#ffc72c 45%,#ff6a3d)");
          tl.fromTo(gc, { yPercent: 118, rotation: 6 }, { yPercent: 0, rotation: 0, duration: 0.7, ease: "expo.out", stagger: 0.05 }, 26.3);
          const s1 = el("div", "big", { top: 640 + fs * 1.35 + "px", fontFamily: "Inter", fontWeight: 800, fontSize: "56px", letterSpacing: "-.02em", textTransform: "none" }, hud);
          const s1c = split(s1, "Gratis nel browser. Senza account.");
          const s2 = el("div", "big", { top: 640 + fs * 1.35 + 74 + "px", fontFamily: "Inter", fontWeight: 700, fontSize: "50px", letterSpacing: "-.01em", textTransform: "none", color: "rgba(255,255,255,.88)" }, hud);
          const s2c = split(s2, "Oppure installalo sul telefono.");
          tl.set([g, s1, s2], { opacity: 0 }, 0); tl.set(g, { opacity: 1 }, 26.3); tl.set(s1, { opacity: 1 }, 26.85); tl.set(s2, { opacity: 1 }, 27.1);
          tl.fromTo(s1c, { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: "expo.out", stagger: 0.008 }, 26.85);
          tl.fromTo(s2c, { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: "expo.out", stagger: 0.008 }, 27.1);
          const card = el("div", "abs", { left: "60px", top: "1420px", width: "960px", height: "250px", borderRadius: "40px", background: "rgba(255,255,255,.1)", border: "2px solid rgba(255,255,255,.25)", opacity: 0 }, hud);
          const qrb = el("div", "abs", { left: "24px", top: "24px", width: "202px", height: "202px", borderRadius: "22px", background: "#fff" }, card);
          const cv = el("canvas", "abs", { left: "11px", top: "11px", width: "180px", height: "180px" }, qrb); cv.width = cv.height = 360;
          try {
            const q = QRLIB(0, "M"); q.addData("https://hello-noor.github.io/ulisse/ulibricks/", "Byte"); q.make();
            const n = q.getModuleCount(), s = 360 / n, x = cv.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, 360, 360); x.fillStyle = "#0a0f2e";
            for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) x.fillRect(Math.floor(c * s), Math.floor(r * s), Math.ceil(s), Math.ceil(s));
          } catch (err) { console.error(err); }
          el("div", "abs", { left: "262px", top: "52px", fontFamily: "Unbounded", fontWeight: 700, fontSize: "40px", color: "#ffc72c" }, card, "Inquadra e gioca");
          el("div", "abs", { left: "262px", top: "128px", width: "680px", fontWeight: 700, fontSize: "36px", lineHeight: 1.2, color: "#fff" }, card, "hello-noor.github.io/ulisse/ulibricks");
          tl.fromTo(card, { opacity: 0, y: 60, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "expo.out" }, 27.45);
          const by = el("div", "big", { top: "1745px", fontFamily: "Inter", fontWeight: 700, fontSize: "36px", letterSpacing: "0", textTransform: "none", color: "rgba(255,255,255,.7)", opacity: 0 }, hud, "Ideato da Ulisse (6 anni)");
          tl.fromTo(by, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 27.9);
        }

        window.__timelines["main"] = tl;
        tl.seek(0);
      }
      document.fonts.load('900 100px "Unbounded"').then(() => Promise.all([document.fonts.load('700 40px "Unbounded"'), document.fonts.load('800 40px "Inter"'), document.fonts.load('600 40px "Inter"'), document.fonts.load('700 40px "Inter"')])).then(build);
    </script>
  </body>
</html>
`;
fs.writeFileSync(new URL("../index.html", import.meta.url), html);
console.log("index.html scritto:", SEGS.length, "riprese,", TILT.length, "punti tilt, boom a", BOOM.toFixed(2));
