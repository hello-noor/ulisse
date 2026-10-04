// Genera index.html: ULIBRICKS in 100 secondi. Riprese del gioco vero dentro un telefono + tipografia grande e d'impatto.
// Uso: node tools/build.mjs
import fs from "node:fs";

const W = 1080, H = 1920, TOTAL = 100, C0 = 92; // C0 = inizio della chiusura (browser, smartphone, QR)
const read = (f) => { try { return JSON.parse(fs.readFileSync(new URL("../assets/" + f, import.meta.url))); } catch { return null; } };

// ── Riprese del gioco vero (assets/v/<src>.mp4). at = quando parte nel video, dur = durata, from = punto nella ripresa, rate = velocità
const SEGS = [
  { id: "hero", src: "hero", at: 0, dur: 6.2, from: 0.3, rate: 1 },
  // 01 COSTRUISCI 6–26
  { id: "tray", src: "tray", at: 6, dur: 3, from: 0.8, rate: 1.2 },
  { id: "kit", src: "kit", at: 9, dur: 4, from: 0.8, rate: 1.9 },
  { id: "city", src: "citybuild", at: 13, dur: 6, from: 0.5, rate: 1 },
  { id: "bases", src: "bases2", at: 19, dur: 4, from: 1.2, rate: 1.6 },
  { id: "park", src: "park", at: 23, dur: 3, from: 1.4, rate: 1.4 },
  // 02 PERSONAGGI 26–44
  { id: "creator", src: "creator2", at: 26, dur: 8, from: 0.5, rate: 1.45 },
  { id: "lineup", src: "lineup", at: 34, dur: 4, from: 0.7, rate: 1 },
  { id: "vita", src: "vita", at: 38, dur: 6, from: 1.0, rate: 1 },
  // 03 ANIMALI 44–66
  { id: "atab", src: "animals_tab", at: 44, dur: 3.5, from: 0.7, rate: 1.5 },
  { id: "zoo", src: "zoo", at: 47.5, dur: 18.5, from: 0.8, rate: 1.8 },
  // 04 VEICOLI 66–78
  { id: "car", src: "car", at: 66, dur: 6, from: 1.0, rate: 1, steer: "car.steer.json" },
  { id: "truck", src: "truck", at: 72, dur: 6, from: 1.0, rate: 1, steer: "truck.steer.json" },
  // 05 GIOCA 78–88
  { id: "dyn", src: "dyn", at: 78, dur: 4, from: 3.6, rate: 1 },
  { id: "tetris", src: "tetris", at: 82, dur: 1.8, from: 4.6, rate: 1 },
  { id: "quake", src: "quake", at: 83.8, dur: 1.5, from: 1.0, rate: 1 },
  { id: "run", src: "run", at: 85.3, dur: 2.7, from: 6.5, rate: 1 },
  // 06 MOSTRA 88–92
  { id: "reel", src: "reel", at: 88, dur: 2, from: 11, rate: 1 },
  { id: "share", src: "share", at: 90, dur: 2, from: 1.0, rate: 1 },
];
// finestre in cui il telefono si ingrandisce a tutto schermo (momenti d'azione)
const PUSH = [[80.4, 82.0], [85.3, 88.0]];

const CHAPTERS = [
  { t: 6, e: 26, accent: "#3b7bff", title: "COSTRUISCI", fs: 124 },
  { t: 26, e: 44, accent: "#ee45a8", title: "PERSONAGGI", fs: 124 },
  { t: 44, e: 66, accent: "#22d38a", title: "ANIMALI", fs: 156 },
  { t: 66, e: 78, accent: "#22c4f0", title: "VEICOLI", fs: 156 },
  { t: 78, e: 88, accent: "#ff6a3d", title: "GIOCA", fs: 176 },
  { t: 88, e: 92, accent: "#ffc72c", title: "MOSTRA", fs: 168 },
];

// titolo secondario d'impatto (sotto il capitolo): count = numero che sale
const HEAD = [
  { t: 6.2, d: 2.7, txt: "103 TIPI DI PEZZO" },
  { t: 9.2, d: 3.7, txt: "12 KIT GUIDATI" },
  { t: 13.2, d: 5.7, txt: "CITTÀ DA PAZZI" },
  { t: 19.2, d: 3.7, txt: "9 AMBIENTI IN UNO" },
  { t: 23.2, d: 2.7, txt: "SI MUOVONO DAVVERO" },
  { t: 26.2, d: 3.8, txt: "8 SCHEDE DI SCELTE" },
  { t: 30.2, d: 3.8, txt: "ORECCHIE, CODE, ZAMPE" },
  { t: 34.2, d: 3.7, txt: "24 COSTUMI" },
  { t: 38.2, d: 5.7, txt: "VIVONO DA SOLI" },
  { t: 44.2, d: 3.2, txt: "20 ANIMALI" },
  { t: 47.6, d: 2.3, txt: "TOCCA UN ANIMALE" },
  { t: 49.9, d: 2.8, txt: "DRAGO AL GUINZAGLIO!" },
  { t: 52.7, d: 3.0, txt: "ANCHE IL GRIFO!" },
  { t: 55.7, d: 3.6, txt: "CAVALCA LA CHIMERA" },
  { t: 59.3, d: 3.4, txt: "T-REX AFFAMATO" },
  { t: 62.7, d: 3.3, txt: "POLPO COCCOLONE" },
  { t: 66.2, d: 5.6, txt: "GUIDALO COL TELEFONO" },
  { t: 72.2, d: 5.6, txt: "CAMION CON DRAGO E T-REX" },
  { t: 78.2, d: 2.1, txt: "DINAMITE!" },
  { t: 82.1, d: 1.6, txt: "TETRIS 3D" },
  { t: 83.9, d: 1.3, txt: "TERREMOTO" },
  { t: 85.4, d: 2.5, txt: "CORRI!" },
  { t: 88.2, d: 1.7, txt: "SHOWREEL" },
  { t: 90.2, d: 1.7, txt: "CONDIVIDI" },
];

// didascalie in basso (grandi, almeno ~3 secondi)
const CAPS = [
  [6.2, 2.7, "Mattoni, piastre, forme, tetti, meccanica e decorazioni."],
  [9.2, 3.7, "Dal giardino alla pagoda da 110 pezzi: ti guida passo passo."],
  [13.2, 5.7, "Castelli, razzi, grattacieli, pagode… mescola tutto, anche senza senso."],
  [19.2, 3.7, "Prato, acqua, luna, neve, sabbia, lava, asfalto, parquet, scacchi."],
  [23.2, 2.7, "Giostre, mulini e radar girano, i semafori si accendono."],
  [26.2, 3.8, "Capelli, faccia, vestiti, costume… crei il tuo personaggio."],
  [30.2, 3.8, "Aggiungi orecchie da elefante, coda da drago, chele di granchio."],
  [34.2, 3.7, "Dalla principessa al Minotauro e al Centauro."],
  [38.2, 5.7, "Camminano, parlano, si siedono e fanno amicizia tra loro."],
  [44.2, 3.2, "Fattoria, selvaggi, mito e dinosauri."],
  [47.6, 2.3, "Scegli un personaggio e tocca un animale."],
  [49.9, 2.8, "Il drago? Si porta a spasso al guinzaglio."],
  [52.7, 3.0, "Anche il grifo di Perugia. Sì, davvero."],
  [55.7, 3.6, "Salta in sella: la chimera ti porta in giro."],
  [59.3, 3.4, "Cibo al T-rex: gnam, gnam."],
  [62.7, 3.3, "Coccole al polpo: ognuno ha il suo verso."],
  [66.2, 5.6, "Inclina il telefono: avanti accelera, di lato sterza."],
  [72.2, 5.6, "Se ha le ruote lo guidi: anche un camion pieno di animali."],
  [78.2, 2.1, "Fai esplodere la tua città con la dinamite."],
  [82.1, 1.6, "Tetris in 3D: i blocchi esplodono."],
  [85.4, 2.5, "Corri! Gli ostacoli sono i tuoi blocchi."],
  [88.2, 3.7, "Showreel, foto, libretto e QR della tua costruzione."],
];

// adesivi giganti: numero o parola (rimbalzano sull'angolo del telefono)
const STICK = [
  { t: 6.5, d: 2.5, n: 103, l: "TIPI DI PEZZO", ci: 0 },
  { t: 9.5, d: 3.2, n: 12, l: "KIT GUIDATI", ci: 0 },
  { t: 19.5, d: 3.2, n: 9, l: "AMBIENTI", ci: 0 },
  { t: 26.5, d: 3.4, n: 8, l: "SCHEDE", ci: 1 },
  { t: 34.5, d: 3.2, n: 24, l: "COSTUMI", ci: 1 },
  { t: 38.6, d: 3.6, html: "10<sup>18</sup>", l: "PERSONAGGI", ci: 1 },
  { t: 44.5, d: 2.8, n: 20, l: "ANIMALI", ci: 2 },
  { t: 66.6, d: 3.6, txt: "TILT", l: "TELEFONO", ci: 3 },
  { t: 72.6, d: 3.4, txt: "3×", l: "ANIMALI A BORDO", ci: 3 },
  { t: 55.2, d: 3.6, txt: "6 ANNI", l: "IDEATO DA ULISSE (6 ANNI)", ci: 2 },
];

// ── effetti sonori
const SFX = [];
const add = (f, t, v) => SFX.push([f, t, v]);
add("sfx_003", 0.55, 0.8);
CHAPTERS.forEach((c) => { add("sfx_002", c.t - 0.5, 0.65); add("sfx_003", c.t + 0.25, 0.6); });
add("sfx_002", C0 - 0.5, 0.65);
HEAD.forEach((h, i) => add(i % 2 ? "sfx_005" : "sfx_001", h.t + 0.05, 0.6));
STICK.forEach((s) => add("sfx_003", s.t + 0.1, 0.35));
add("sfx_001", C0 + 1.2, 0.7); add("sfx_005", C0 + 1.5, 0.6); add("sfx_004", C0 + 4.0, 0.7); add("sfx_003", C0 + 5.4, 0.7); add("sfx_004", C0 + 6.1, 0.7);
SFX.sort((a, b) => a[1] - b[1]);
const SD = { sfx_001: 0.7, sfx_002: 0.6, sfx_003: 2.0, sfx_004: 2.5, sfx_005: 0.7 };

// ── inclinazione del telefono nel video, sincronizzata con la guida registrata
const TILT = [];
SEGS.filter((s) => s.steer).forEach((s) => {
  const j = read(s.steer); if (!j) return;
  const pts = j.log.filter((_, i) => i % 3 === 0);
  pts.forEach(([f, st, ac]) => {
    const t = s.at + (f / j.fps - s.from) / s.rate;
    if (t >= s.at && t <= s.at + s.dur) TILT.push([+t.toFixed(2), +(-st * 17).toFixed(2), +(ac * 13).toFixed(2)]);
  });
});

fs.writeFileSync(new URL("../assets/segs.json", import.meta.url), JSON.stringify({ SEGS, PUSH, C0, TOTAL }));
const videos = SEGS.map((s) => `        <video id="v-${s.id}" class="clip vid" src="assets/v/${s.src}.mp4" muted playsinline data-start="${s.at}" data-duration="${s.dur}" data-media-start="${s.from}" data-playback-rate="${s.rate}" data-track-index="1"></video>`).join("\n");
const audios = SFX.map(([f, t, v], i) => `      <audio id="x${String(i).padStart(2, "0")}" src="assets/sfx/${f}.mp3" data-start="${t.toFixed(2)}" data-duration="${Math.min(SD[f], TOTAL - t).toFixed(2)}" data-track-index="${12 + (i % 5)}" data-volume="${v}"></audio>`).join("\n");

const html = `<!doctype html>
<html lang="it" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <title>ULIBRICKS in 100 secondi</title>
    <script src="assets/gsap.min.js"></script>
    <script src="assets/qrlib.js"></script>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      html, body { width:${W}px; height:${H}px; overflow:hidden; background:#060a18; }
      #root { position:relative; width:100%; height:100%; overflow:hidden; background:#060a18; color:#fff; font-family:Montserrat, sans-serif; perspective:1800px; }
      #bg { position:absolute; inset:0; --accent:#3b7bff; background:radial-gradient(120% 80% at 50% 0%, #121a3d 0%, #060a18 62%); }
      .orb { position:absolute; width:1100px; height:1100px; border-radius:50%; background:radial-gradient(circle, var(--accent) 0%, transparent 62%); opacity:.5; }
      #grid { position:absolute; inset:0; opacity:.07; background-image:linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size:60px 60px; }
      #phone { position:absolute; left:168px; top:372px; width:744px; height:1304px; border-radius:92px; padding:12px; background:#0b0f1f;
        border:2px solid rgba(255,255,255,.16); box-shadow:0 70px 160px -30px var(--accent), 0 0 0 1px rgba(0,0,0,.6); }
      #screen { position:absolute; left:12px; top:12px; width:720px; height:1280px; border-radius:80px; overflow:hidden; background:#0b1230; }
      .vid { position:absolute; left:0; top:0; width:720px; height:1280px; object-fit:cover; }
      .mono { font-family:"Space Mono", monospace; font-weight:700; letter-spacing:.26em; }
      .big { font-family:Montserrat, sans-serif; font-weight:900; text-transform:uppercase; line-height:1; letter-spacing:-.02em; white-space:nowrap; }
      .ttl { position:absolute; left:0; width:100%; text-align:center; }
      .mask { overflow:hidden; display:block; padding:6px 0; }
      .ch { display:inline-block; }
      #cap { position:absolute; left:0; width:100%; top:1700px; }
      .capp { position:absolute; left:40px; width:1000px; top:0; text-align:center; padding:22px 30px 24px; border-radius:44px; background:rgba(8,13,34,.86); border:2px solid rgba(255,255,255,.22);
        font-weight:800; font-size:50px; line-height:1.14; box-shadow:0 18px 40px rgba(0,0,0,.4); }
      .hl { position:absolute; left:20px; width:1040px; top:228px; text-align:center; font-weight:900; font-size:66px; line-height:1.02; text-transform:uppercase; letter-spacing:-.01em; text-shadow:0 6px 0 rgba(0,0,0,.35); }
      .stk { position:absolute; left:690px; top:300px; width:340px; height:340px; border-radius:50%; background:var(--c); color:var(--tc,#fff); display:flex; flex-direction:column; align-items:center; justify-content:center;
        border:10px solid #fff; box-shadow:0 22px 0 rgba(0,0,0,.35), 0 0 70px var(--c); }
      .stk .n { font-weight:900; font-size:132px; line-height:.95; letter-spacing:-.03em; }
      .stk .n.w { font-size:84px; }
      .stk .n sup { font-size:.5em; vertical-align:top; position:relative; top:-.05em; }
      .stk .l { margin-top:6px; font-weight:900; font-size:36px; letter-spacing:.02em; text-align:center; line-height:1.02; max-width:290px; }
      #wipe { position:absolute; inset:0; z-index:60; opacity:0; clip-path:circle(0px at 540px 1000px); background:var(--wc,#2f6bff); }
      .abs { position:absolute; }
      .pill { position:absolute; border-radius:60px; background:rgba(255,255,255,.1); border:2px solid rgba(255,255,255,.28); font-weight:800; text-align:center; }
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
      <div id="cta" class="clip" data-start="${C0 - 0.3}" data-duration="${TOTAL - C0 + 0.3}" data-track-index="4" style="position:absolute; inset:0"></div>
      <div id="wipe"></div>
      <audio id="gsfx" src="assets/gamesfx.mp3" data-start="0" data-duration="${TOTAL}" data-track-index="9" data-volume="1"></audio>
      <audio id="music" src="assets/music.mp3" data-start="0" data-duration="${TOTAL}" data-track-index="10" data-volume="0.85"></audio>
${audios}
    </div>
    <script>
      const CHAPTERS = ${JSON.stringify(CHAPTERS)};
      const HEAD = ${JSON.stringify(HEAD)};
      const CAPS = ${JSON.stringify(CAPS)};
      const STICK = ${JSON.stringify(STICK)};
      const PUSH = ${JSON.stringify(PUSH)};
      const TILT = ${JSON.stringify(TILT)};
      const C0 = ${C0};
      function el(tag, cls, css, parent, html) {
        const e = document.createElement(tag); if (cls) e.className = cls;
        if (css) for (const k in css) { if (k.startsWith("--")) e.style.setProperty(k, css[k]); else e.style[k] = css[k]; }
        if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e;
      }
      const endT = (t, d) => { const pu = PUSH.find(([a]) => t < a - 0.05 && t + d > a); return pu ? pu[0] - 0.05 : t + d; };
      const chapterOf = (t) => CHAPTERS.find((c) => t >= c.t - 0.01 && t < c.e) || CHAPTERS[0];
      const tl = gsap.timeline({ paused: true });
      const bg = document.getElementById("bg"), phone = document.getElementById("phone"), screen = document.getElementById("screen"), hud = document.getElementById("hud"), cta = document.getElementById("cta"), wipe = document.getElementById("wipe");
      gsap.set(phone, { transformPerspective: 1800, transformOrigin: "50% 50%" });

      /* ── sfondo vivo ── */
      tl.to("#o1", { x: 220, y: 160, duration: ${TOTAL}, ease: "none" }, 0);
      tl.to("#o2", { x: -260, y: -240, duration: ${TOTAL}, ease: "none" }, 0);
      tl.to("#o3", { x: 300, y: -120, duration: ${TOTAL}, ease: "none" }, 0);
      tl.to("#grid", { backgroundPosition: "0px 600px, 600px 0px", duration: ${TOTAL}, ease: "none" }, 0);
      const colorAt = (t, c) => tl.to(bg, { "--accent": c, duration: 0.6, ease: "power2.inOut" }, t);
      CHAPTERS.forEach((c) => colorAt(c.t - 0.1, c.accent)); colorAt(C0 - 0.1, "#ffc72c");

      /* ── apertura: il logo originale dell'app ── */
      {
        [0, 1, 2].forEach((i) => { const r = el("div", "abs", { left: "340px", top: "520px", width: "400px", height: "400px", borderRadius: "50%", border: "3px solid var(--accent)", opacity: 0 }, hud);
          tl.fromTo(r, { scale: 0.3, opacity: 0.9 }, { scale: 3.6, opacity: 0, duration: 1.7, ease: "power2.out" }, 0.45 + i * 0.28); });
        const logo = el("img", "abs", { left: "30px", top: "430px", width: "1020px", filter: "drop-shadow(0 22px 0 rgba(0,0,0,.35))" }, hud); logo.src = "assets/logo.png";
        tl.fromTo(logo, { scale: 0.15, opacity: 0, rotation: -10, y: 80 }, { scale: 1, opacity: 1, rotation: 0, y: 0, duration: 0.8, ease: "back.out(2)", transformOrigin: "50% 50%" }, 0.4);
        tl.to(logo, { y: -12, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: 1 }, 1.3);
        const tag = el("div", "ttl big", { top: "720px", fontSize: "84px", lineHeight: 1.0, whiteSpace: "normal" }, hud, "Il gioco di<br>mattoncini 3D");
        tl.fromTo(tag, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 1.3);
        const sub = el("div", "ttl big", { top: "980px", fontSize: "62px", color: "var(--accent)" }, hud, "Costruisci · Anima · Gioca");
        tl.fromTo(sub, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 2.0);
        const idea1 = el("div", "ttl big", { top: "740px", fontSize: "76px", color: "#fff" }, hud, "Ideato da");
        const idea2 = el("div", "ttl big", { top: "820px", fontSize: "210px", color: "#ffc72c", textShadow: "0 12px 0 rgba(0,0,0,.4)" }, hud, "ULISSE");
        const age = el("div", "stk", { left: "330px", top: "1090px", width: "420px", height: "420px", "--c": "#ee45a8", "--tc": "#fff", opacity: 0 }, hud);
        age.innerHTML = '<div class="n" style="font-size:200px">6</div><div class="l" style="font-size:58px;max-width:360px">ANNI</div>';
        const kid = el("div", "ttl big", { top: "1570px", fontSize: "60px", lineHeight: 1.05, whiteSpace: "normal" }, hud, "Un bambino di sei anni<br>ha inventato tutto questo");
        tl.fromTo(idea1, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 3.3);
        tl.fromTo(idea2, { scale: 0.3, opacity: 0, rotation: -6 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.7, ease: "back.out(2)", transformOrigin: "50% 50%" }, 3.4);
        tl.fromTo(age, { scale: 0.1, opacity: 0, rotation: -50 }, { scale: 1, opacity: 1, rotation: -8, duration: 0.7, ease: "back.out(2.2)" }, 3.8);
        tl.fromTo(kid, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 4.3);
        [tag, sub].forEach((e) => tl.to(e, { opacity: 0, y: -50, duration: 0.35, ease: "power2.in" }, 3.2));
        [logo, idea1, idea2, age, kid].forEach((e) => tl.to(e, { opacity: 0, y: -60, duration: 0.35, ease: "power2.in" }, 5.45));
        tl.set(phone, { y: 2300, rotationX: 28, opacity: 0 }, 0);
        tl.set(phone, { opacity: 1 }, 5.0);
        tl.fromTo(phone, { y: 2300, rotationX: 28 }, { y: 0, rotationX: 0, duration: 0.95, ease: "power3.out", immediateRender: false }, 5.05);
      }

      /* ── titolo capitolo (grande) ── */
      CHAPTERS.forEach((c) => {
        const t = el("div", "ttl big", { top: "62px", fontSize: c.fs + "px", textShadow: "0 8px 0 rgba(0,0,0,.35)" }, hud);
        const m = el("span", "mask", {}, t); m.innerHTML = c.title.split("").map((ch) => '<span class="ch">' + ch + "</span>").join("");
        const bar = el("div", "abs", { left: "340px", top: "216px", width: "400px", height: "8px", borderRadius: "4px", background: c.accent, opacity: 0 }, hud);
        const chs = m.querySelectorAll(".ch");
        const tin = c.t + 0.2, tout = Math.min(c.e - 0.4, (PUSH.find(([a]) => a >= c.t && a < c.e) || [999])[0] - 0.05);
        tl.fromTo(chs, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: "power4.out", stagger: 0.04 }, tin);
        tl.fromTo(bar, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.5, ease: "power3.out", transformOrigin: "50% 50%" }, tin + 0.3);
        tl.to(chs, { yPercent: -120, opacity: 0, duration: 0.35, ease: "power3.in", stagger: 0.02 }, tout);
        tl.to(bar, { opacity: 0, duration: 0.3 }, tout);
      });

      /* ── headline d'impatto con numeri che salgono ── */
      HEAD.forEach((h) => {
        const ch = chapterOf(h.t);
        const e = el("div", "hl", { color: "#fff" }, hud);
        const m = h.txt.match(/^(\\d+)(.*)$/);
        if (m) { e.innerHTML = '<span style="color:' + ch.accent + '" class="cnt">0</span>' + m[2]; } else { e.innerHTML = h.txt.replace(/(\\S+)$/, '<span style="color:' + ch.accent + '">$1</span>'); }
        const maxw = 1040; const len = h.txt.length; e.style.fontSize = (len > 24 ? 54 : len > 18 ? 62 : 70) + "px";
        const tend = endT(h.t, h.d);
        tl.fromTo(e, { y: 60, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }, h.t);
        tl.to(e, { y: -24, opacity: 0, duration: 0.3, ease: "power2.in" }, tend - 0.3);
        if (m) { const nEl = e.querySelector(".cnt"), o = { v: 0 }, to = +m[1]; tl.to(o, { v: to, duration: 0.9, ease: "power2.out", onUpdate() { nEl.textContent = Math.round(o.v); } }, h.t + 0.1); }
      });

      /* ── didascalie in basso ── */
      CAPS.forEach(([t, d, txt]) => {
        const p = el("div", "capp", { opacity: 0, top: "1700px" }, hud, txt);
        const tend = endT(t, d);
        tl.fromTo(p, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, t);
        tl.to(p, { y: -20, opacity: 0, duration: 0.3, ease: "power2.in" }, tend - 0.3);
      });

      /* ── adesivi giganti ── */
      const TC = ["#fff", "#fff", "#0b1230", "#0b1230"]; const CC = ["#3b7bff", "#ee45a8", "#22d38a", "#22c4f0"];
      STICK.forEach((s) => {
        const e = el("div", "stk", { "--c": CC[s.ci], "--tc": TC[s.ci], opacity: 0 }, hud);
        e.innerHTML = '<div class="n' + (s.txt || s.html ? " w" : "") + '">' + (s.html || s.txt || "0") + '</div><div class="l">' + s.l + "</div>";
        const tend = endT(s.t, s.d);
        tl.fromTo(e, { scale: 0.1, opacity: 0, rotation: -40 }, { scale: 1, opacity: 1, rotation: 9, duration: 0.6, ease: "back.out(2.2)" }, s.t);
        tl.to(e, { rotation: 4, duration: 1.0, ease: "sine.inOut", yoyo: true, repeat: 1 }, s.t + 0.6);
        tl.to(e, { scale: 0.1, opacity: 0, rotation: 40, duration: 0.35, ease: "power2.in" }, tend - 0.35);
        if (s.n != null) { const nEl = e.querySelector(".n"), o = { v: 0 }; tl.to(o, { v: s.n, duration: 0.9, ease: "power2.out", onUpdate() { nEl.textContent = Math.round(o.v); } }, s.t + 0.15); }
      });

      /* ── telefono: respiro 3D, zoom a tutto schermo, inclinazione sincronizzata alla guida ── */
      {
        const wins = []; let cur = 5.0; const NB = [[66, 78]]; // nei veicoli il telefono si inclina con la guida
        const cuts = [...PUSH.map(([a, b]) => [a - 0.2, b + 0.1]), ...NB].sort((a, b) => a[0] - b[0]);
        cuts.forEach(([a, b]) => { wins.push([cur, a]); cur = b; }); wins.push([cur, C0 - 0.1]);
        let flip = 1;
        wins.forEach(([a, b]) => { if (b - a < 0.4) return;
          tl.fromTo(phone, { rotationY: -4 * flip }, { rotationY: 4 * flip, duration: b - a, ease: "sine.inOut", immediateRender: false }, a); flip = -flip; });
        // inclinazione: il telefono segue davvero lo sterzo/accelerazione registrati
        if (TILT.length) {
          tl.set(phone, { rotationY: 0 }, 66);
          for (let i = 1; i < TILT.length; i++) {
            const [t0] = TILT[i - 1], [t1, rz, rx] = TILT[i];
            if (t1 - t0 > 0.5 || t1 <= t0) { tl.set(phone, { rotationZ: rz, rotationX: rx }, t1); continue; }
            tl.to(phone, { rotationZ: rz, rotationX: rx, duration: t1 - t0, ease: "none" }, t0);
          }
          tl.to(phone, { rotationZ: 0, rotationX: 0, duration: 0.4 }, 78);
        }
        PUSH.forEach(([a, b]) => {
          tl.to(phone, { scale: 1.5, y: -42, rotationY: 0, duration: 0.45, ease: "power3.inOut" }, a - 0.2);
          tl.to([phone, screen], { borderRadius: 0, duration: 0.4 }, a - 0.2);
          tl.to(phone, { scale: 1, y: 0, duration: 0.5, ease: "power3.inOut" }, b - 0.05);
          tl.to(phone, { borderRadius: 92, duration: 0.4 }, b);
          tl.to(screen, { borderRadius: 80, duration: 0.4 }, b);
        });
        tl.to(phone, { y: 2300, rotationX: 20, duration: 0.7, ease: "power3.in" }, C0 - 0.2);
        tl.set(phone, { opacity: 0 }, C0 + 0.7);
      }

      /* ── onde di colore tra i capitoli ── */
      [...CHAPTERS.map((c) => [c.t, c.accent]).slice(1), [C0, "#ffc72c"], [6, CHAPTERS[0].accent]].sort((a, b) => a[0] - b[0]).forEach(([T, col]) => {
        tl.set(wipe, { "--wc": col, opacity: 1, clipPath: "circle(0px at 540px 1000px)" }, T - 0.5);
        tl.fromTo(wipe, { clipPath: "circle(0px at 540px 1000px)" }, { clipPath: "circle(1500px at 540px 1000px)", duration: 0.45, ease: "power3.in", immediateRender: false }, T - 0.45);
        tl.to(wipe, { opacity: 0, duration: 0.45, ease: "power2.out" }, T + 0.02);
      });

      /* ── chiusura: browser, smartphone, QR ── */
      {
        const inkc = "#0b1230", S1 = C0, S2 = C0 + 2.6, S3 = C0 + 5.2;
        // 1: browser
        const s1 = el("div", "abs", { inset: 0 }, cta);
        const h1 = el("div", "ttl big", { top: "130px", fontSize: "118px", lineHeight: 1.0, whiteSpace: "normal" }, s1, "Aprilo dal<br>browser");
        const k1 = el("div", "ttl big", { top: "64px", fontSize: "38px", color: "#ffc72c" }, s1, "Subito · Senza account");
        const win = el("div", "abs", { left: "50px", top: "500px", width: "980px", height: "660px", borderRadius: "30px", background: "#fff", overflow: "hidden", boxShadow: "0 60px 140px -30px #ffc72c, 0 0 0 2px rgba(255,255,255,.3)" }, s1);
        const bar = el("div", "abs", { left: 0, top: 0, width: "980px", height: "88px", background: "#e9ecf5" }, win);
        [["#ff5f57", 30], ["#febc2e", 62], ["#28c840", 94]].forEach(([c, x]) => el("div", "abs", { left: x + "px", top: "34px", width: "20px", height: "20px", borderRadius: "50%", background: c }, bar));
        const url = el("div", "abs", { left: "150px", top: "17px", width: "790px", height: "54px", borderRadius: "27px", background: "#fff", overflow: "hidden" }, bar);
        const ut = el("div", "abs", { left: "26px", top: 0, height: "54px", lineHeight: "54px", fontSize: "29px", fontWeight: 800, color: inkc, whiteSpace: "nowrap", clipPath: "inset(0 100% 0 0)" }, url, "hello-noor.github.io/ulisse/ulibricks");
        const shot = el("img", "abs", { left: 0, top: "88px", width: "980px", height: "572px", objectFit: "cover" }, win); shot.src = "assets/browser-shot.jpg";
        const t1 = el("div", "ttl big", { top: "1260px", fontSize: "62px", color: "#ffc72c", lineHeight: 1.05, whiteSpace: "normal" }, s1, "Computer, tablet<br>o telefono");
        const c1 = el("div", "pill", { left: "60px", top: "1500px", width: "460px", padding: "26px 0", fontSize: "36px" }, s1, "Zero registrazione");
        const c2 = el("div", "pill", { left: "560px", top: "1500px", width: "460px", padding: "26px 0", fontSize: "36px" }, s1, "Anche offline");
        tl.fromTo(win, { y: 700, rotationX: 22, opacity: 0 }, { y: 0, rotationX: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, S1 + 0.3);
        tl.fromTo(ut, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "none" }, S1 + 0.8);
        tl.fromTo(h1, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, S1 + 0.1);
        tl.fromTo(k1, { opacity: 0 }, { opacity: 1, duration: 0.4 }, S1 + 0.1);
        [t1, c1, c2].forEach((e, i) => tl.fromTo(e, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, S1 + 1.3 + i * 0.2));
        tl.to(s1, { opacity: 0, y: -60, duration: 0.4, ease: "power2.in" }, S2 - 0.25);

        // 2: smartphone
        const s2 = el("div", "abs", { inset: 0, opacity: 0 }, cta);
        const h2 = el("div", "ttl big", { top: "96px", fontSize: "100px", lineHeight: 1.02, whiteSpace: "normal" }, s2, "Oppure<br>installalo<br>sul telefono");
        const ph = el("div", "abs", { left: "300px", top: "560px", width: "480px", height: "900px", borderRadius: "72px", background: "#0b0f1f", border: "2px solid rgba(255,255,255,.18)", boxShadow: "0 60px 140px -30px #ffc72c" }, s2);
        const sc = el("div", "abs", { left: "10px", top: "10px", width: "460px", height: "880px", borderRadius: "62px", overflow: "hidden", background: "linear-gradient(160deg,#1c2b73,#5b2f8a 60%,#c04b7a)" }, ph);
        const cols = ["#3b4a8f", "#4a5aa8", "#2f7f8f", "#8f4a6a", "#5a8f4a", "#8f7a3a", "#4a3b8f", "#2f5f8f", "#8f3b3b", "#3b8f6a", "#6a4a8f", "#8f5a2f"];
        cols.forEach((c, i) => el("div", "abs", { left: 30 + (i % 4) * 106 + "px", top: 110 + Math.floor(i / 4) * 140 + "px", width: "92px", height: "92px", borderRadius: "23px", background: c, opacity: 0.85 }, sc));
        const slot = { x: 30 + 2 * 106, y: 110 + 3 * 140 };
        const icon = el("img", "abs", { left: slot.x + "px", top: slot.y + "px", width: "92px", height: "92px", borderRadius: "23px", boxShadow: "0 10px 24px rgba(0,0,0,.4)" }, sc); icon.src = "assets/icon-512.png";
        const lab = el("div", "abs", { left: slot.x - 20 + "px", top: slot.y + 100 + "px", width: "132px", textAlign: "center", fontSize: "18px", fontWeight: 900 }, sc, "ULIBRICKS");
        const tapr = el("div", "abs", { left: slot.x + 16 + "px", top: slot.y + 16 + "px", width: "60px", height: "60px", borderRadius: "50%", border: "4px solid #fff", opacity: 0 }, sc);
        const st1 = el("div", "pill", { left: "40px", top: "1510px", width: "1000px", padding: "24px 0", fontSize: "40px", background: "rgba(8,13,34,.85)" }, s2, "iPhone · Condividi → Aggiungi a Home");
        const st2 = el("div", "pill", { left: "40px", top: "1640px", width: "1000px", padding: "24px 0", fontSize: "40px", background: "rgba(8,13,34,.85)" }, s2, "Android · Menu → Installa app");
        tl.fromTo(s2, { opacity: 0 }, { opacity: 1, duration: 0.35 }, S2 - 0.15);
        tl.fromTo(h2, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, S2);
        tl.fromTo(ph, { y: 900, rotationX: 24, opacity: 0 }, { y: 0, rotationX: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, S2 + 0.1);
        tl.fromTo(icon, { y: -900, opacity: 0, scale: 1.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "bounce.out" }, S2 + 1.0);
        tl.fromTo(lab, { opacity: 0 }, { opacity: 1, duration: 0.3 }, S2 + 1.5);
        tl.fromTo(tapr, { scale: 0.5, opacity: 1 }, { scale: 2.2, opacity: 0, duration: 0.6, ease: "power2.out" }, S2 + 1.5);
        [st1, st2].forEach((e, i) => tl.fromTo(e, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.6)" }, S2 + 1.2 + i * 0.3));
        tl.to(s2, { opacity: 0, y: -60, duration: 0.4, ease: "power2.in" }, S3 - 0.25);

        // 3: finale
        const s3 = el("div", "abs", { inset: 0, opacity: 0 }, cta);
        const lg = el("img", "abs", { left: "30px", top: "110px", width: "1020px", filter: "drop-shadow(0 18px 0 rgba(0,0,0,.35))" }, s3); lg.src = "assets/logo.png";
        const qrc = el("div", "abs", { left: "240px", top: "520px", width: "600px", height: "680px", borderRadius: "44px", background: "#fff", boxShadow: "0 40px 100px -20px #ffc72c" }, s3);
        const cv = el("canvas", "abs", { left: "50px", top: "46px", width: "500px", height: "500px" }, qrc); cv.width = 500; cv.height = 500;
        try {
          const q = QRLIB(0, "M"); q.addData("https://hello-noor.github.io/ulisse/ulibricks/", "Byte"); q.make();
          const n = q.getModuleCount(), cs = 500 / n, g = cv.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, 500, 500); g.fillStyle = "#0b1230";
          for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) g.fillRect(Math.floor(c * cs), Math.floor(r * cs), Math.ceil(cs), Math.ceil(cs));
        } catch (e) { console.error(e); }
        el("div", "abs", { left: 0, top: "572px", width: "600px", textAlign: "center", fontSize: "42px", fontWeight: 900, color: "#0b1230" }, qrc, "Inquadra e gioca");
        const ic = el("img", "abs", { left: "70px", top: "430px", width: "240px", height: "240px", borderRadius: "54px", boxShadow: "0 24px 60px rgba(0,0,0,.55)" }, s3); ic.src = "assets/icon-512.png";
        const u3 = el("div", "abs", { left: "60px", top: "1260px", width: "960px", padding: "30px 0", borderRadius: "64px", background: "#ffc72c", color: "#0b1230", textAlign: "center", fontWeight: 900, fontSize: "42px" }, s3, "hello-noor.github.io/ulisse/ulibricks");
        const t3 = el("div", "ttl big", { top: "1390px", fontSize: "84px", lineHeight: 1.0, whiteSpace: "normal" }, s3, "Nel browser<br>o sul telefono");
        const u4 = el("div", "abs", { left: "40px", top: "1640px", width: "1000px", padding: "26px 0", borderRadius: "64px", background: "#ee45a8", color: "#fff", textAlign: "center", fontWeight: 900, fontSize: "50px", boxShadow: "0 10px 0 rgba(0,0,0,.3)" }, s3, "Ideato da Ulisse (6 anni)");
        tl.fromTo(s3, { opacity: 0 }, { opacity: 1, duration: 0.3 }, S3 - 0.1);
        tl.fromTo(lg, { scale: 0.3, opacity: 0, rotation: -8 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.7, ease: "back.out(2)", transformOrigin: "50% 50%" }, S3);
        tl.fromTo(qrc, { scale: 0.4, opacity: 0, rotation: 6 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(1.8)" }, S3 + 0.3);
        tl.fromTo(ic, { scale: 0.2, opacity: 0, rotation: 20 }, { scale: 1, opacity: 1, rotation: -9, duration: 0.6, ease: "back.out(2)" }, S3 + 0.5);
        [u3, t3, u4].forEach((e, i) => tl.fromTo(e, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, S3 + 0.6 + i * 0.2));
        tl.to(ic, { y: -14, duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: 2 }, S3 + 1.1);
      }

      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
`;
fs.writeFileSync(new URL("../index.html", import.meta.url), html);
console.log("index.html scritto:", SEGS.length, "riprese,", SFX.length, "effetti,", TILT.length, "punti tilt");
