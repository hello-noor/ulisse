// Genera index.html: ULIBRICKS in 90 secondi. Riprese del gioco vero dentro un telefono + grafica moderna.
// Uso: node tools/build.mjs
import fs from "node:fs";

const W = 1080, H = 1920, TOTAL = 90;

// ── Riprese del gioco vero (assets/v/<src>.mp4). at = quando parte nel video, dur = durata, from = punto nella ripresa, rate = velocità
const SEGS = [
  // intro
  { src: "scene", at: 0, dur: 5.2, from: 0.5, rate: 1 },
  // 01 COSTRUISCI
  { src: "tray", at: 5, dur: 3.5, from: 0.8, rate: 1 },
  { src: "kit", at: 8.5, dur: 6, from: 0.8, rate: 1.5 },
  { src: "bases", at: 14.5, dur: 4, from: 1.2, rate: 1.9 },
  { src: "park", at: 18.5, dur: 2.5, from: 1.8, rate: 1.2 },
  { src: "vehicle", at: 21, dur: 4, from: 1.6, rate: 1.2 },
  // 02 PERSONAGGI
  { src: "creator2", at: 25, dur: 10, from: 0.6, rate: 1.25 },
  { src: "lineup", at: 35, dur: 4, from: 0.8, rate: 1.1 },
  { src: "vita", at: 39, dur: 8, from: 1.2, rate: 0.8 },
  // 03 ANIMALI
  { src: "animals_tab", at: 47, dur: 4.5, from: 0.8, rate: 1.4 },
  { src: "interact", at: 51.5, dur: 13.5, from: 0.9, rate: 1.4 },
  // 04 GIOCA
  { src: "dyn", at: 65, dur: 3.5, from: 3.2, rate: 1 },
  { src: "tetris", at: 68.5, dur: 2.5, from: 4.5, rate: 1 },
  { src: "quake", at: 71, dur: 1.5, from: 1.0, rate: 1 },
  { src: "run", at: 72.5, dur: 3.5, from: 6.5, rate: 1 },
  // 05 MOSTRA
  { src: "reel", at: 76, dur: 2, from: 11.5, rate: 1 },
  { src: "share", at: 78, dur: 2.5, from: 1.0, rate: 1 },
];
// finestre in cui il telefono si ingrandisce a tutto schermo (momenti d'azione)
const PUSH = [[66.6, 68.9], [73.0, 76.0]];

const CHAPTERS = [
  { t: 5, e: 25, accent: "#2f6bff", kick: "01 / COSTRUISCI", title: "COSTRUISCI", sub: "Pezzo per pezzo, come con i veri mattoncini" },
  { t: 25, e: 47, accent: "#e0399b", kick: "02 / PERSONAGGI", title: "PERSONAGGI", sub: "Creali, vestili, danne vita" },
  { t: 47, e: 65, accent: "#19c37d", kick: "03 / ANIMALI", title: "ANIMALI", sub: "Si accarezzano, si sfamano, si cavalcano" },
  { t: 65, e: 76, accent: "#ff5a36", kick: "04 / GIOCA", title: "GIOCA", sub: "Dinamite, Tetris, Terremoto, Corri!" },
  { t: 76, e: 80.5, accent: "#ffc72c", kick: "05 / MOSTRA", title: "MOSTRA", sub: "Showreel, foto, libretto e QR" },
];

// schede di vetro: side L/R, y, numero (conteggio) + etichetta
const CALL = [
  { t: 5.7, d: 2.6, side: "L", y: 470, n: 103, l: "tipi di pezzo" },
  { t: 6.4, d: 2.0, side: "R", y: 700, n: 424, l: "misure" },
  { t: 7.1, d: 1.4, side: "L", y: 930, n: 31, l: "colori" },
  { t: 9.2, d: 5.0, side: "L", y: 470, n: 12, l: "kit guidati" },
  { t: 10.0, d: 4.2, side: "R", y: 700, txt: "13→110", l: "passi per kit" },
  { t: 15.0, d: 3.4, side: "R", y: 470, n: 9, l: "ambienti" },
  { t: 18.9, d: 2.0, side: "L", y: 470, txt: "Si muovono", l: "mulini, giostre, radar" },
  { t: 21.4, d: 3.4, side: "R", y: 470, txt: "Guidabili", l: "veicoli con le ruote" },
  { t: 25.8, d: 4.2, side: "L", y: 470, n: 8, l: "schede di scelte" },
  { t: 30.0, d: 4.4, side: "R", y: 700, n: 19, l: "pettinature" },
  { t: 35.4, d: 3.4, side: "L", y: 470, n: 24, l: "costumi" },
  { t: 39.4, d: 3.6, side: "R", y: 470, txt: "Vita", l: "camminano e parlano" },
  { t: 43.2, d: 3.4, side: "L", y: 700, txt: "Amicizia", l: "fanno amici tra loro" },
  { t: 47.4, d: 3.8, side: "L", y: 470, n: 20, l: "animali" },
  { t: 52.2, d: 3.0, side: "R", y: 470, txt: "Verso", l: "ognuno ha il suo" },
  { t: 54.0, d: 3.0, side: "L", y: 700, txt: "Cibo", l: "il personaggio glielo porta" },
  { t: 57.6, d: 3.0, side: "R", y: 470, txt: "Coccole", l: "con i cuoricini" },
  { t: 61.4, d: 3.2, side: "L", y: 470, txt: "Cavalca!", l: "drago, T-rex, leone…" },
  { t: 65.4, d: 2.9, side: "L", y: 470, txt: "Dinamite", l: "fai esplodere tutto" },
  { t: 68.6, d: 2.2, side: "R", y: 470, txt: "Tetris 3D", l: "blocchi che esplodono" },
  { t: 71.1, d: 1.3, side: "L", y: 470, txt: "Terremoto", l: "quanto resiste?" },
  { t: 72.6, d: 3.3, side: "R", y: 470, txt: "Corri!", l: "gli ostacoli sono i tuoi blocchi" },
  { t: 76.4, d: 1.6, side: "L", y: 470, txt: "Showreel", l: "il filmato in automatico" },
  { t: 78.3, d: 2.0, side: "R", y: 470, txt: "QR code", l: "condividi la costruzione" },
];

// didascalie in basso
const CAPS = [
  [5.2, 3.2, "Scegli, ruota e posa: i pezzi si incastrano."],
  [8.7, 5.6, "I kit ti guidano pezzo per pezzo."],
  [14.7, 3.6, "Cambia ambiente: prato, acqua, luna, lava…"],
  [18.7, 2.2, "Mulini, giostre e radar si muovono."],
  [21.2, 3.6, "Costruisci un veicolo e guidalo."],
  [25.3, 9.4, "Capelli, faccia, vestiti, costume, orecchie, code, zampe, oggetti."],
  [35.2, 3.6, "24 costumi, dalla principessa al Minotauro."],
  [39.2, 7.6, "Con Vita camminano, parlano, si siedono e fanno amicizia."],
  [47.2, 4.0, "Fattoria, selvaggi, mito e dinosauri."],
  [51.7, 13.0, "Tocca un animale: verso, cibo, coccole, guinzaglio, cavalcata."],
  [76.2, 4.1, "Mostra la tua opera: filmato, foto, libretto e QR."],
];

// ── effetti sonori
const SFX = [];
const add = (f, t, v) => SFX.push([f, t, v]);
add("sfx_003", 0.55, 0.8); // logo
[5, 25, 47, 65, 76, 80.5, 83.4, 86.4].forEach((T) => { add("sfx_002", T - 0.5, 0.65); });
CHAPTERS.forEach((c) => add("sfx_003", c.t + 0.25, 0.6));
CALL.forEach((c, i) => add(i % 2 ? "sfx_005" : "sfx_001", c.t + 0.05, 0.7));
add("sfx_001", 81.9, 0.7); add("sfx_005", 82.2, 0.6); add("sfx_004", 84.9, 0.7); add("sfx_003", 86.9, 0.7); add("sfx_004", 87.7, 0.7);
SFX.sort((a, b) => a[1] - b[1]);
const SD = { sfx_001: 0.7, sfx_002: 0.6, sfx_003: 2.0, sfx_004: 2.5, sfx_005: 0.7 };

const videos = SEGS.map((s, i) => `        <video id="v${String(i).padStart(2, "0")}" class="clip vid" src="assets/v/${s.src}.mp4" muted playsinline data-start="${s.at}" data-duration="${s.dur}" data-media-start="${s.from}" data-playback-rate="${s.rate}" data-track-index="1"></video>`).join("\n");
const audios = SFX.map(([f, t, v], i) => `      <audio id="x${String(i).padStart(2, "0")}" src="assets/sfx/${f}.mp3" data-start="${t.toFixed(2)}" data-duration="${Math.min(SD[f], TOTAL - t).toFixed(2)}" data-track-index="${12 + (i % 5)}" data-volume="${v}"></audio>`).join("\n");

const html = `<!doctype html>
<html lang="it" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <title>ULIBRICKS in 90 secondi</title>
    <script src="assets/gsap.min.js"></script>
    <script src="assets/qrlib.js"></script>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      html, body { width:${W}px; height:${H}px; overflow:hidden; background:#060a18; }
      #root { position:relative; width:100%; height:100%; overflow:hidden; background:#060a18; color:#fff; font-family:Montserrat, sans-serif; perspective:1800px; }
      #bg { position:absolute; inset:0; --accent:#2f6bff; background:radial-gradient(120% 80% at 50% 0%, #121a3d 0%, #060a18 62%); }
      .orb { position:absolute; width:1100px; height:1100px; border-radius:50%; background:radial-gradient(circle, var(--accent) 0%, transparent 62%); opacity:.5; }
      #grid { position:absolute; inset:0; opacity:.07; background-image:linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size:60px 60px; }
      #phone { position:absolute; left:168px; top:350px; width:744px; height:1304px; border-radius:92px; padding:12px; background:#0b0f1f;
        border:2px solid rgba(255,255,255,.16); box-shadow:0 70px 160px -30px var(--accent), 0 0 0 1px rgba(0,0,0,.6); }
      #screen { position:absolute; left:12px; top:12px; width:720px; height:1280px; border-radius:80px; overflow:hidden; background:#0b1230; }
      .vid { position:absolute; left:0; top:0; width:720px; height:1280px; object-fit:cover; }
      .mono { font-family:"Space Mono", monospace; font-weight:700; letter-spacing:.26em; }
      .big { font-family:Montserrat, sans-serif; font-weight:900; text-transform:uppercase; line-height:1; letter-spacing:-.02em; white-space:nowrap; }
      .ttl { position:absolute; left:0; width:100%; text-align:center; }
      .mask { overflow:hidden; display:block; padding:6px 0; }
      .ch { display:inline-block; }
      .glass { position:absolute; width:290px; padding:18px 22px 20px; border-radius:30px; background:rgba(8,13,34,.80); border:1.5px solid rgba(255,255,255,.22); box-shadow:0 20px 50px rgba(0,0,0,.45); }
      .glass .n { font-weight:900; font-size:58px; line-height:1; letter-spacing:-.02em; color:var(--ac,#fff); }
      .glass .n.t { font-size:42px; }
      .glass .l { margin-top:8px; font-weight:700; font-size:25px; line-height:1.15; color:rgba(255,255,255,.88); }
      .glass i { position:absolute; top:22px; right:22px; width:14px; height:14px; border-radius:50%; background:var(--ac,#fff); box-shadow:0 0 0 7px rgba(255,255,255,.1); }
      #cap { position:absolute; left:0; width:100%; top:1690px; text-align:center; }
      .capp { position:absolute; left:50%; top:0; width:940px; margin-left:-470px; text-align:center; padding:22px 30px; border-radius:40px; background:rgba(8,13,34,.80); border:1.5px solid rgba(255,255,255,.2); font-weight:700; font-size:34px; line-height:1.18; }
      #bug { position:absolute; left:400px; top:1815px; width:280px; }
      #wipe { position:absolute; inset:0; z-index:60; opacity:0; clip-path:circle(0px at 540px 1000px); background:var(--wc,#2f6bff); }
      .abs { position:absolute; }
      .pill { position:absolute; border-radius:60px; background:rgba(255,255,255,.1); border:1.5px solid rgba(255,255,255,.25); font-weight:700; text-align:center; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}">
      <div id="bg">
        <div class="orb" id="o1" style="left:-500px; top:-300px"></div>
        <div class="orb" id="o2" style="left:480px; top:900px"></div>
        <div class="orb" id="o3" style="left:-200px; top:1300px; opacity:.32"></div>
        <div id="grid"></div>
      </div>
      <div id="phone">
        <div id="screen">
${videos}
        </div>
      </div>
      <div id="hud" class="clip" data-start="0" data-duration="${TOTAL}" data-track-index="3" style="position:absolute; inset:0"></div>
      <div id="cta" class="clip" data-start="80.2" data-duration="9.8" data-track-index="4" style="position:absolute; inset:0"></div>
      <div id="wipe"></div>
      <audio id="music" src="assets/music.mp3" data-start="0" data-duration="${TOTAL}" data-track-index="10" data-volume="0.5"></audio>
${audios}
    </div>
    <script>
      const CHAPTERS = ${JSON.stringify(CHAPTERS)};
      const CALL = ${JSON.stringify(CALL)};
      const CAPS = ${JSON.stringify(CAPS)};
      const PUSH = ${JSON.stringify(PUSH)};
      function el(tag, cls, css, parent, html) {
        const e = document.createElement(tag); if (cls) e.className = cls;
        if (css) for (const k in css) { if (k.startsWith("--")) e.style.setProperty(k, css[k]); else e.style[k] = css[k]; }
        if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e;
      }
      const tl = gsap.timeline({ paused: true });
      const bg = document.getElementById("bg"), phone = document.getElementById("phone"), screen = document.getElementById("screen"), hud = document.getElementById("hud"), cta = document.getElementById("cta"), wipe = document.getElementById("wipe");
      gsap.set(phone, { transformPerspective: 1800, transformOrigin: "50% 50%" });

      /* ── sfondo vivo: orbe che cambiano colore con il capitolo, griglia che scorre ── */
      tl.to("#o1", { x: 220, y: 160, duration: 90, ease: "none" }, 0);
      tl.to("#o2", { x: -260, y: -240, duration: 90, ease: "none" }, 0);
      tl.to("#o3", { x: 300, y: -120, duration: 90, ease: "none" }, 0);
      tl.to("#grid", { backgroundPosition: "0px 600px, 600px 0px", duration: 90, ease: "none" }, 0);
      const colorAt = (t, c) => tl.to(bg, { "--accent": c, duration: 0.6, ease: "power2.inOut" }, t);
      CHAPTERS.forEach((c) => colorAt(c.t - 0.1, c.accent)); colorAt(80.4, "#ffc72c");

      /* ── logo di apertura (quello originale dell'app) ── */
      {
        const rings = [0, 1, 2].map((i) => el("div", "abs", { left: "340px", top: "560px", width: "400px", height: "400px", borderRadius: "50%", border: "3px solid var(--accent)", opacity: 0 }, hud));
        rings.forEach((r, i) => tl.fromTo(r, { scale: 0.3, opacity: 0.9 }, { scale: 3.4, opacity: 0, duration: 1.6, ease: "power2.out" }, 0.45 + i * 0.28));
        const logo = el("img", "abs", { left: "70px", top: "560px", width: "940px", filter: "drop-shadow(0 18px 0 rgba(0,0,0,.35))" }, hud); logo.src = "assets/logo.png";
        tl.fromTo(logo, { scale: 0.15, opacity: 0, rotation: -10, y: 80 }, { scale: 1, opacity: 1, rotation: 0, y: 0, duration: 0.8, ease: "back.out(2)", transformOrigin: "50% 50%" }, 0.4);
        tl.to(logo, { y: -10, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: 1 }, 1.3);
        const tag = el("div", "ttl big", { top: "790px", fontSize: "62px" }, hud, "Il gioco di mattoncini 3D");
        tl.fromTo(tag, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 1.3);
        const sub = el("div", "ttl mono", { top: "900px", fontSize: "30px", color: "var(--accent)" }, hud, "COSTRUISCI · ANIMA · GIOCA");
        tl.fromTo(sub, { y: 40, opacity: 0, scaleX: 1.25 }, { y: 0, opacity: 1, scaleX: 1, duration: 0.7, ease: "power3.out" }, 1.8);
        const pills = ["Nel browser", "Senza account", "Sul telefono"].map((t, i) => el("div", "pill", { left: 90 + i * 300 + "px", top: "1010px", width: "270px", padding: "18px 0", fontSize: "28px" }, hud, t));
        pills.forEach((p, i) => tl.fromTo(p, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, 2.3 + i * 0.18));
        [logo, tag, sub, ...pills].forEach((e) => tl.to(e, { opacity: 0, y: -50, duration: 0.35, ease: "power2.in" }, 3.9));
        tl.set(phone, { y: 2300, rotationX: 28, opacity: 0 }, 0);
        tl.set(phone, { opacity: 1 }, 3.55);
        tl.fromTo(phone, { y: 2300, rotationX: 28 }, { y: 0, rotationX: 0, duration: 1.0, ease: "power3.out", immediateRender: false }, 3.6);
      }

      /* ── logo piccolo in basso (sempre presente nei capitoli) ── */
      {
        const bug = el("img", "abs", { left: "400px", top: "1815px", width: "280px", opacity: 0 }, hud); bug.src = "assets/logo.png"; bug.id = "bug2";
        tl.to(bug, { opacity: 0.95, duration: 0.4 }, 5.4);
        PUSH.forEach(([a, b]) => { tl.to(bug, { opacity: 0, duration: 0.2 }, a); tl.to(bug, { opacity: 0.95, duration: 0.3 }, b + 0.1); });
        tl.to(bug, { opacity: 0, duration: 0.3 }, 80.0);
      }

      /* ── titoli dei capitoli ── */
      CHAPTERS.forEach((c) => {
        const k = el("div", "ttl mono", { top: "92px", fontSize: "28px", color: c.accent, opacity: 0 }, hud, c.kick);
        const t = el("div", "ttl big", { top: "138px", fontSize: "122px" }, hud);
        const m = el("span", "mask", {}, t); m.innerHTML = c.title.split("").map((ch) => '<span class="ch">' + ch + "</span>").join("");
        const s = el("div", "ttl", { top: "282px", fontSize: "31px", fontWeight: 700, color: "rgba(255,255,255,.78)", opacity: 0 }, hud, c.sub);
        const chs = m.querySelectorAll(".ch");
        const tin = c.t + 0.3, tout = Math.min(c.e - 0.45, (PUSH.find(([a]) => a >= c.t && a < c.e) || [999])[0] - 0.05);
        tl.fromTo(k, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, tin);
        tl.fromTo(chs, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: "power4.out", stagger: 0.04 }, tin + 0.05);
        tl.fromTo(s, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, tin + 0.35);
        [k, s].forEach((e) => tl.to(e, { opacity: 0, duration: 0.3 }, tout));
        tl.to(chs, { yPercent: -120, opacity: 0, duration: 0.35, ease: "power3.in", stagger: 0.02 }, tout);
      });

      /* ── schede di vetro con numeri che salgono ── */
      CALL.forEach((c) => {
        const ch = CHAPTERS.find((x) => c.t >= x.t && c.t < x.e) || CHAPTERS[0];
        const card = el("div", "glass", { top: c.y + "px", [c.side === "L" ? "left" : "right"]: "8px", "--ac": ch.accent, opacity: 0 }, hud);
        card.innerHTML = '<i></i><div class="n' + (c.txt ? " t" : "") + '">' + (c.txt || "0") + '</div><div class="l">' + c.l + "</div>";
        const dir = c.side === "L" ? -1 : 1;
        tl.fromTo(card, { x: dir * 360, opacity: 0, rotation: dir * 4 }, { x: 0, opacity: 1, rotation: 0, duration: 0.55, ease: "back.out(1.5)" }, c.t);
        tl.to(card, { x: dir * 360, opacity: 0, duration: 0.4, ease: "power2.in" }, c.t + c.d - 0.4);
        if (c.n != null) { const nEl = card.querySelector(".n"), o = { v: 0 }; tl.to(o, { v: c.n, duration: 0.9, ease: "power2.out", onUpdate() { nEl.textContent = Math.round(o.v); } }, c.t + 0.1); }
      });

      /* ── didascalie ── */
      CAPS.forEach(([t, d, txt]) => {
        const p = el("div", "capp", { top: "1690px", opacity: 0 }, hud, txt);
        tl.fromTo(p, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, t);
        tl.to(p, { y: -20, opacity: 0, duration: 0.3, ease: "power2.in" }, t + d - 0.3);
      });

      /* ── telefono: respiro 3D e zoom a tutto schermo nei momenti d'azione ── */
      {
        const wins = []; let cur = 5.0;
        PUSH.forEach(([a, b]) => { wins.push([cur, a]); cur = b; }); wins.push([cur, 80.4]);
        let flip = 1;
        wins.forEach(([a, b]) => {
          if (b - a < 0.3) return;
          tl.fromTo(phone, { rotationY: -4 * flip, rotationX: 1.5 }, { rotationY: 4 * flip, rotationX: -1.5, duration: b - a, ease: "sine.inOut", immediateRender: false }, a);
          flip = -flip;
        });
        PUSH.forEach(([a, b]) => {
          tl.to(phone, { scale: 1.5, y: -42, rotationY: 0, rotationX: 0, duration: 0.45, ease: "power3.inOut" }, a - 0.2);
          tl.to([phone, screen], { borderRadius: 0, duration: 0.4 }, a - 0.2);
          tl.to(phone, { scale: 1, y: 0, duration: 0.5, ease: "power3.inOut" }, b - 0.05);
          tl.to(phone, { borderRadius: 92, duration: 0.4 }, b);
          tl.to(screen, { borderRadius: 80, duration: 0.4 }, b);
        });
        tl.to(phone, { y: 2300, rotationX: 20, duration: 0.7, ease: "power3.in" }, 80.3);
        tl.set(phone, { opacity: 0 }, 81.2);
      }

      /* ── onde di colore tra i capitoli ── */
      [5, 25, 47, 65, 76, 80.5].forEach((T, i) => {
        const col = i === 5 ? "#ffc72c" : CHAPTERS[i] ? CHAPTERS[i].accent : "#fff";
        tl.set(wipe, { "--wc": col, opacity: 1, clipPath: "circle(0px at 540px 1000px)" }, T - 0.5);
        tl.fromTo(wipe, { clipPath: "circle(0px at 540px 1000px)" }, { clipPath: "circle(1500px at 540px 1000px)", duration: 0.45, ease: "power3.in", immediateRender: false }, T - 0.45);
        tl.to(wipe, { opacity: 0, duration: 0.45, ease: "power2.out" }, T + 0.02);
      });

      /* ── CTA: browser, smartphone, QR ── */
      {
        const inkc = "#0b1230";
        // stadio 1: browser (81–84)
        const s1 = el("div", "abs", { inset: 0 }, cta);
        const h1 = el("div", "ttl big", { top: "150px", fontSize: "100px", lineHeight: 1.0, whiteSpace: "normal" }, s1, "Aprilo dal<br>browser");
        const k1 = el("div", "ttl mono", { top: "84px", fontSize: "28px", color: "#ffc72c" }, s1, "SUBITO · SENZA ACCOUNT");
        const win = el("div", "abs", { left: "60px", top: "470px", width: "960px", height: "640px", borderRadius: "30px", background: "#fff", overflow: "hidden", boxShadow: "0 60px 140px -30px #ffc72c, 0 0 0 1.5px rgba(255,255,255,.3)" }, s1);
        const bar = el("div", "abs", { left: 0, top: 0, width: "960px", height: "84px", background: "#e9ecf5" }, win);
        [["#ff5f57", 28], ["#febc2e", 58], ["#28c840", 88]].forEach(([c, x]) => el("div", "abs", { left: x + "px", top: "32px", width: "20px", height: "20px", borderRadius: "50%", background: c }, bar));
        const url = el("div", "abs", { left: "150px", top: "16px", width: "760px", height: "52px", borderRadius: "26px", background: "#fff", overflow: "hidden" }, bar);
        const ut = el("div", "abs", { left: "26px", top: 0, height: "52px", lineHeight: "52px", fontSize: "26px", fontWeight: 700, color: inkc, whiteSpace: "nowrap", clipPath: "inset(0 100% 0 0)" }, url, "hello-noor.github.io/ulisse/ulibricks");
        const shot = el("img", "abs", { left: 0, top: "84px", width: "960px", height: "556px", objectFit: "cover" }, win); shot.src = "assets/browser-shot.jpg";
        const c1 = el("div", "pill", { left: "90px", top: "1190px", width: "420px", padding: "20px 0", fontSize: "30px" }, s1, "Nessuna registrazione");
        const c2 = el("div", "pill", { left: "570px", top: "1190px", width: "420px", padding: "20px 0", fontSize: "30px" }, s1, "Funziona anche offline");
        const t1 = el("div", "ttl", { top: "1340px", fontSize: "44px", fontWeight: 900, color: "#ffc72c" }, s1, "Computer, tablet o telefono");
        tl.fromTo(win, { y: 700, rotationX: 22, opacity: 0 }, { y: 0, rotationX: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 80.9);
        tl.fromTo(ut, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.0, ease: "none" }, 81.4);
        tl.fromTo(h1, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 80.7);
        tl.fromTo(k1, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 80.7);
        [c1, c2, t1].forEach((e, i) => tl.fromTo(e, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, 81.9 + i * 0.25));
        tl.to(s1, { opacity: 0, y: -60, duration: 0.4, ease: "power2.in" }, 83.0);

        // stadio 2: smartphone (84–87)
        const s2 = el("div", "abs", { inset: 0, opacity: 0 }, cta);
        const h2 = el("div", "ttl big", { top: "110px", fontSize: "84px", lineHeight: 1.02, whiteSpace: "normal" }, s2, "Oppure installalo<br>sullo smartphone");
        const ph = el("div", "abs", { left: "290px", top: "480px", width: "500px", height: "960px", borderRadius: "76px", background: "#0b0f1f", border: "2px solid rgba(255,255,255,.18)", boxShadow: "0 60px 140px -30px #ffc72c" }, s2);
        const sc = el("div", "abs", { left: "10px", top: "10px", width: "480px", height: "940px", borderRadius: "66px", overflow: "hidden", background: "linear-gradient(160deg,#1c2b73,#5b2f8a 60%,#c04b7a)" }, ph);
        const cols = ["#3b4a8f", "#4a5aa8", "#2f7f8f", "#8f4a6a", "#5a8f4a", "#8f7a3a", "#4a3b8f", "#2f5f8f", "#8f3b3b", "#3b8f6a", "#6a4a8f", "#8f5a2f"];
        cols.forEach((c, i) => el("div", "abs", { left: 32 + (i % 4) * 112 + "px", top: 120 + Math.floor(i / 4) * 150 + "px", width: "96px", height: "96px", borderRadius: "24px", background: c, opacity: 0.85 }, sc));
        const slot = { x: 32 + 2 * 112, y: 120 + 3 * 150 };
        const icon = el("img", "abs", { left: slot.x + "px", top: slot.y + "px", width: "96px", height: "96px", borderRadius: "24px", boxShadow: "0 10px 24px rgba(0,0,0,.4)" }, sc); icon.src = "assets/icon-512.png";
        const lab = el("div", "abs", { left: slot.x - 20 + "px", top: slot.y + 104 + "px", width: "136px", textAlign: "center", fontSize: "19px", fontWeight: 900 }, sc, "ULIBRICKS");
        const tapr = el("div", "abs", { left: slot.x + 18 + "px", top: slot.y + 18 + "px", width: "60px", height: "60px", borderRadius: "50%", border: "4px solid #fff", opacity: 0 }, sc);
        const st1 = el("div", "pill", { left: "40px", top: "1490px", width: "1000px", padding: "22px 0", fontSize: "36px", background: "rgba(8,13,34,.8)" }, s2, "iPhone · Condividi → Aggiungi a Home");
        const st2 = el("div", "pill", { left: "40px", top: "1595px", width: "1000px", padding: "22px 0", fontSize: "36px", background: "rgba(8,13,34,.8)" }, s2, "Android · Menu → Installa app");
        tl.fromTo(s2, { opacity: 0 }, { opacity: 1, duration: 0.35 }, 83.3);
        tl.fromTo(h2, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 83.4);
        tl.fromTo(ph, { y: 900, rotationX: 24, opacity: 0 }, { y: 0, rotationX: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 83.5);
        tl.fromTo(icon, { y: -900, opacity: 0, scale: 1.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "bounce.out" }, 84.5);
        tl.fromTo(lab, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 85.0);
        tl.fromTo(tapr, { scale: 0.5, opacity: 1 }, { scale: 2.2, opacity: 0, duration: 0.6, ease: "power2.out" }, 85.0);
        [st1, st2].forEach((e, i) => tl.fromTo(e, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.6)" }, 84.8 + i * 0.3));
        tl.to(s2, { opacity: 0, y: -60, duration: 0.4, ease: "power2.in" }, 86.0);

        // stadio 3: finale con logo, icona e QR (87–90)
        const s3 = el("div", "abs", { inset: 0, opacity: 0 }, cta);
        const lg = el("img", "abs", { left: "70px", top: "150px", width: "940px", filter: "drop-shadow(0 16px 0 rgba(0,0,0,.35))" }, s3); lg.src = "assets/logo.png";
        const qrc = el("div", "abs", { left: "240px", top: "470px", width: "600px", height: "670px", borderRadius: "44px", background: "#fff", boxShadow: "0 40px 100px -20px #ffc72c" }, s3);
        const cv = el("canvas", "abs", { left: "50px", top: "46px", width: "500px", height: "500px" }, qrc); cv.width = 500; cv.height = 500;
        try {
          const q = QRLIB(0, "M"); q.addData("https://hello-noor.github.io/ulisse/ulibricks/", "Byte"); q.make();
          const n = q.getModuleCount(), cs = 500 / n, g = cv.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, 500, 500); g.fillStyle = "#0b1230";
          for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) g.fillRect(Math.floor(c * cs), Math.floor(r * cs), Math.ceil(cs), Math.ceil(cs));
        } catch (e) { console.error(e); }
        el("div", "abs", { left: 0, top: "568px", width: "600px", textAlign: "center", fontSize: "38px", fontWeight: 900, color: "#0b1230" }, qrc, "Inquadra e gioca");
        const ic = el("img", "abs", { left: "110px", top: "400px", width: "230px", height: "230px", borderRadius: "52px", boxShadow: "0 24px 60px rgba(0,0,0,.55)" }, s3); ic.src = "assets/icon-512.png";
        const u3 = el("div", "abs", { left: "100px", top: "1210px", width: "880px", padding: "28px 0", borderRadius: "60px", background: "#ffc72c", color: "#0b1230", textAlign: "center", fontWeight: 900, fontSize: "38px" }, s3, "hello-noor.github.io/ulisse/ulibricks");
        const t3 = el("div", "ttl big", { top: "1350px", fontSize: "84px", lineHeight: 1.05, whiteSpace: "normal" }, s3, "Nel browser<br>o sul telefono");
        const m3 = el("div", "ttl mono", { top: "1600px", fontSize: "30px", color: "#ffc72c" }, s3, "COSTRUISCI · ANIMA · GIOCA");
        tl.fromTo(s3, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 86.3);
        tl.fromTo(lg, { scale: 0.3, opacity: 0, rotation: -8 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.7, ease: "back.out(2)", transformOrigin: "50% 50%" }, 86.4);
        tl.fromTo(ic, { scale: 0.2, opacity: 0, rotation: 20 }, { scale: 1, opacity: 1, rotation: -9, duration: 0.6, ease: "back.out(2)" }, 87.0);
        tl.fromTo(qrc, { scale: 0.4, opacity: 0, rotation: 6 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(1.8)" }, 86.7);
        [u3, t3, m3].forEach((e, i) => tl.fromTo(e, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 87.1 + i * 0.2));
        tl.to(ic, { y: -14, duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: 2 }, 87.7);
      }

      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
`;
fs.writeFileSync(new URL("../index.html", import.meta.url), html);
console.log("index.html scritto:", SEGS.length, "riprese,", SFX.length, "effetti");
