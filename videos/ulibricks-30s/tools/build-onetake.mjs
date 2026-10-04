// Genera onetake.html: ULIBRICKS, spot da 30 secondi in UN SOLO PIANO SEQUENZA (nessun taglio).
// Tutte le riprese sono "mattoncini" appoggiati su una grande base: la camera vola dall'uno all'altro,
// i testi restano attaccati al loro mattoncino e viaggiano con lui. Alla fine la camera si allontana
// e mostra tutto il mondo, poi si tuffa nel finale.
// Uso: node tools/build-onetake.mjs && python3 tools/mix-onetake.py
//      npx hyperframes render -c onetake.html -o ulibricks-30s-onetake.mp4
import fs from "node:fs";

const W = 1080, H = 1920, TOTAL = 30, GAP = 150;
const read = (f) => JSON.parse(fs.readFileSync(new URL("../assets/" + f, import.meta.url)));

// ── pannelli sulla base: col/row nella griglia, t/e = quando la camera ci sta sopra
// v = ripresa (src, from = punto della ripresa all'istante t, rate), cam = scala della ripresa dentro il pannello
const BOOM = 15.6 + (6.9 - 5.6), TBOOM = 18.0 + (8.23 - 7.0);
const P = [
  { id: "intro", col: 0, row: 0, t: 0, e: 2.4, v: { src: "hero", from: 1.6, rate: 1.2 }, cam: [1.3, 1.5] },
  { id: "reel", col: 1, row: 0, t: 2.4, e: 5.6, v: { src: "reel", from: 10.0, rate: 2.4 }, cam: [1.12, 1.24], n: "01", bc: "#3d8bff", w: "COSTRUISCI", s: "Città intere, un mattoncino alla volta.", kin: "drop" },
  { id: "creator", col: 2, row: 0, t: 5.6, e: 8.8, v: { src: "creator2", from: 1.6, rate: 2.4 }, cam: [1.0, 1.25], n: "02", bc: "#ff5cb8", w: "CREA", s: "Miliardi di miliardi di personaggi.", kin: "pop" },
  { id: "drago", col: 2, row: 1, t: 8.8, e: 10.3, v: { src: "zoo", from: 2.2, rate: 1.5 }, cam: [1.25, 1.38], n: "03", bc: "#2fd480", w: "DRAGHI", s: "Sì, anche al guinzaglio.", kin: "slide" },
  { id: "chimera", col: 1, row: 1, t: 10.3, e: 12.6, v: { src: "zoo", from: 19.6, rate: 1.7 }, cam: [1.3, 1.42], n: "03", bc: "#2fd480", w: "CAVALCA", s: "Una chimera? Salta in sella.", kin: "rise" },
  { id: "car", col: 0, row: 1, t: 12.6, e: 15.6, v: { src: "car", from: 1.6, rate: 1.2 }, cam: [1.38, 1.38], steer: "car.steer.json", n: "04", bc: "#3fd0f5", w: "GUIDA", s: "Inclina il telefono per sterzare.", kin: "slide" },
  { id: "dyn", col: 0, row: 2, t: 15.6, e: 18.0, v: { src: "dyn", from: 5.6, rate: 1 }, cam: [1.08, 1.26], n: "05", bc: "#ff6a2b", w: "BOOM!", s: "Poi fai saltare tutto.", kin: "pop", wAt: BOOM },
  { id: "tetris", col: 1, row: 2, t: 18.0, e: 19.7, v: { src: "tetris2", from: 7.0, rate: 1 }, cam: [1.12, 1.2], n: "06", bc: "#ffc72c", w: "GIOCA", s: "Pioggia di mattoncini.", kin: "drop" },
  { id: "run", col: 2, row: 2, t: 19.7, e: 21.6, v: { src: "run2", from: 12.4, rate: 1.1 }, cam: [1.1, 1.22], n: "06", bc: "#ffc72c", w: "CORRI", s: "Con i personaggi che hai creato.", kin: "slide" },
  { id: "final", col: 1, row: 3, t: 23.1, e: 30 },
  // pannelli che si vedono solo quando la camera si allontana
  { id: "x1", col: 0, row: 3, wall: { src: "lineup", from: 1.0 } },
  { id: "x2", col: 2, row: 3, wall: { src: "quake", from: 2.0 } },
];
const PAD = 0.45; // la ripresa gira anche mentre la camera arriva e riparte
const WALL = [21.25, 23.35]; // finestra in cui si vede tutto il mondo
P.forEach((p) => { p.x = p.col * (W + GAP); p.y = p.row * (H + GAP); });
const WORLD_W = 3 * W + 2 * GAP, WORLD_H = 4 * H + 3 * GAP;

// riprese: una principale per pannello + una copia per il momento "tutto il mondo"
const VIDS = [];
P.forEach((p) => {
  if (p.v) {
    const a = Math.max(0, p.t - PAD), b = p.e + PAD;
    const from = Math.max(0, p.v.from - (p.t - a) * p.v.rate);
    VIDS.push({ id: p.id, pid: p.id, src: p.v.src, at: +a.toFixed(2), dur: +(b - a).toFixed(2), from: +from.toFixed(2), rate: p.v.rate, main: true });
  }
  const wsrc = p.wall || (p.v && { src: p.v.src, from: p.v.from + (p.e - p.t) * p.v.rate * 0.6 });
  if (wsrc) VIDS.push({ id: p.id + "-w", pid: p.id, src: wsrc.src, at: WALL[0], dur: +(WALL[1] - WALL[0]).toFixed(2), from: +wsrc.from.toFixed(2), rate: 1 });
});

// inclinazione della guida, sincronizzata con lo sterzo registrato
const TILT = [];
P.filter((p) => p.steer).forEach((p) => {
  const j = read(p.steer);
  j.log.filter((_, i) => i % 2 === 0).forEach(([f, st]) => {
    const t = p.t + (f / j.fps - p.v.from) / p.v.rate;
    if (t >= p.t - PAD && t <= p.e + PAD) TILT.push([+t.toFixed(2), +(-st * 9).toFixed(2)]);
  });
});

fs.writeFileSync(new URL("../assets/timeline-onetake.json", import.meta.url), JSON.stringify({ P, VIDS, BOOM, TBOOM, TOTAL, WALL }, null, 1));

const panels = P.map((p) => `          <div class="panel" id="p-${p.id}" style="left:${p.x}px; top:${p.y}px">
            <div class="pin" id="pin-${p.id}">
${VIDS.filter((v) => v.pid === p.id).map((v) => `              <video id="v-${v.id}" class="clip vid" src="assets/v/${v.src}.mp4" muted playsinline data-start="${v.at}" data-duration="${v.dur}" data-media-start="${v.from}" data-playback-rate="${v.rate}" data-track-index="1"></video>`).join("\n")}
            </div>
            <div class="pshade"></div>
            <div class="ptext" id="t-${p.id}"></div>
          </div>`).join("\n");
const ff = (fam, file, w) => `@font-face { font-family:"${fam}"; font-weight:${w}; font-style:normal; src:url("assets/fonts/${file}-latin-${w}-normal.woff2") format("woff2"); }`;
const fonts = [...[500, 700, 800].map((w) => ff("Inter", "inter", w)), ...[700, 900].map((w) => ff("Unbounded", "unbounded", w)), ...[700, 800].map((w) => ff("JetBrains Mono", "jetbrains-mono", w))].join("\n      ");

const html = `<!doctype html>
<html lang="it" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <title>ULIBRICKS · piano sequenza</title>
    <script src="assets/gsap.min.js"></script>
    <script src="assets/qrlib.js"></script>
    <style>
      ${fonts}
      * { margin:0; padding:0; box-sizing:border-box; }
      html, body { width:${W}px; height:${H}px; overflow:hidden; background:#0a0f2e; }
      #root { position:relative; width:100%; height:100%; overflow:hidden; background:#0a0f2e; color:#fff; font-family:"Inter", sans-serif; }
      #cam { position:absolute; inset:0; transform-origin:50% 50%; }
      #world { position:absolute; left:0; top:0; width:${WORLD_W}px; height:${WORLD_H}px; transform-origin:0 0; }
      #plate { position:absolute; left:-2400px; top:-2400px; width:${WORLD_W + 4800}px; height:${WORLD_H + 4800}px;
        background-color:#151d57; background-image:radial-gradient(circle at 50% 50%, rgba(255,255,255,.16) 0 30px, rgba(0,0,0,.25) 31px 34px, transparent 35px); background-size:96px 96px; }
      #plateglow { position:absolute; left:-2400px; top:-2400px; width:${WORLD_W + 4800}px; height:${WORLD_H + 4800}px;
        background:radial-gradient(40% 30% at 30% 25%, rgba(47,107,255,.55), transparent 70%), radial-gradient(40% 30% at 70% 60%, rgba(238,69,168,.45), transparent 70%), radial-gradient(35% 25% at 40% 85%, rgba(255,199,44,.35), transparent 70%); }
      .panel { position:absolute; width:${W}px; height:${H}px; border-radius:var(--pr,0px); overflow:hidden; background:#0b1236;
        box-shadow:0 0 0 10px rgba(255,255,255,.08), 0 60px 120px rgba(0,0,0,.6); }
      .pin { position:absolute; inset:0; }
      .vid { position:absolute; left:0; top:0; width:${W}px; height:${H}px; object-fit:cover; filter:contrast(1.06) saturate(1.12); }
      .pshade { position:absolute; inset:0; pointer-events:none;
        background:linear-gradient(180deg, rgba(6,9,30,.55) 0%, rgba(6,9,30,0) 18%, rgba(6,9,30,0) 50%, rgba(6,9,30,.7) 70%, rgba(6,9,30,.95) 88%); }
      .ptext { position:absolute; inset:0; }
      .abs { position:absolute; }
      .slab { position:absolute; display:inline-block; white-space:nowrap; }
      .sfill { position:absolute; inset:0; transform-origin:0% 50%; box-shadow:inset 0 -10px 0 rgba(0,0,0,.2), 0 22px 44px rgba(0,0,0,.45); }
      .stud { position:absolute; box-shadow:inset 0 -5px 0 rgba(0,0,0,.18), inset 0 4px 0 rgba(255,255,255,.35); }
      .smask { position:relative; display:block; overflow:hidden; }
      .stext { display:block; line-height:1.0; }
      .lb { position:absolute; background-image:url(assets/logo.png); background-repeat:no-repeat; }
      .shine { position:absolute; top:-40px; width:160px; height:300px; background:linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent); mix-blend-mode:overlay; }
      #vig { position:absolute; inset:0; pointer-events:none; background:radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(0,0,0,.45) 100%); }
      #flash { position:absolute; inset:0; background:#fff; opacity:0; pointer-events:none; }
      #grain { position:absolute; inset:-200px; opacity:.07; mix-blend-mode:overlay; pointer-events:none; }
      #meas { position:absolute; left:-9999px; top:-9999px; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}">
      <div id="cam" data-layout-allow-overflow>
        <div id="world" data-layout-allow-overflow>
          <div id="plate"></div>
          <div id="plateglow"></div>
${panels}
        </div>
      </div>
      <div id="vig"></div>
      <div id="flash"></div>
      <div id="grain"></div>
      <div id="meas"></div>
      <audio id="mix" src="assets/mix-onetake.mp3" data-start="0" data-duration="${TOTAL}" data-track-index="10" data-volume="1"></audio>
    </div>
    <script>
      const P = ${JSON.stringify(P)};
      const VIDS = ${JSON.stringify(VIDS)};
      const TILT = ${JSON.stringify(TILT)};
      const BOOM = ${BOOM}, TBOOM = ${TBOOM}, WALL = ${JSON.stringify(WALL)}, W = ${W}, H = ${H}, WORLD_W = ${WORLD_W}, WORLD_H = ${WORLD_H};
      const $ = (id) => document.getElementById(id);
      function el(tag, cls, css, parent, txt) {
        const e = document.createElement(tag); if (cls) e.className = cls;
        if (css) for (const k in css) { if (k.startsWith("--")) e.style.setProperty(k, css[k]); else e.style[k] = css[k]; }
        if (txt != null) e.textContent = txt; if (parent) parent.appendChild(e); return e;
      }
      let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
      function measure(text, font, weight, ls) { const t = el("span", null, { whiteSpace: "nowrap", fontFamily: font, fontWeight: weight, fontSize: "100px", letterSpacing: ls || "0" }, $("meas"), text); const w = t.offsetWidth; t.remove(); return w / 100; }
      // ── ogni parola è un mattoncino ──
      function slab(parent, o) {
        const box = el("div", "slab", { left: "0px", top: o.y + "px", opacity: 0 }, parent);
        const fill = el("div", "sfill", { background: o.bg, borderRadius: (o.r || 16) + "px" }, box);
        const m = el("span", "smask", null, box);
        el("span", "stext", { fontFamily: o.font, fontWeight: o.weight, fontSize: o.size + "px", color: o.ink, letterSpacing: o.ls || "0", padding: o.pad }, m, o.text);
        const w = box.offsetWidth, h = box.offsetHeight;
        const x = o.x === "c" ? (W - w) / 2 : o.x; box.style.left = x + "px";
        if (o.studs) { const d = Math.max(18, o.size * 0.2), n = Math.max(2, Math.floor((w - d) / (d * 2.1))), gap = (w - n * d) / (n + 1);
          for (let k = 0; k < n; k++) el("div", "stud", { left: gap + k * (d + gap) + "px", top: -d * 0.42 + "px", width: d + "px", height: d * 0.62 + "px", borderRadius: d * 0.2 + "px", background: o.bg }, fill); }
        gsap.set(box, { rotation: o.rot || 0, transformOrigin: "0% 50%" });
        return { box, fill, text: m.firstChild, w, h, x };
      }
      function slabIn(tl, s, t, kind) {
        tl.set(s.box, { opacity: 1 }, t);
        if (kind === "wipe") { tl.fromTo(s.fill, { scaleX: 0 }, { scaleX: 1, duration: 0.42, ease: "expo.out" }, t); tl.fromTo(s.text, { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: "expo.out" }, t + 0.08); }
        else if (kind === "rise") { gsap.set(s.fill, { transformOrigin: "50% 100%" }); tl.fromTo(s.fill, { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: "back.out(1.7)" }, t); tl.fromTo(s.text, { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: "expo.out" }, t + 0.1); }
        else if (kind === "drop") tl.fromTo(s.box, { y: -1500 }, { y: 0, duration: 0.6, ease: "bounce.out" }, t);
        else if (kind === "pop") tl.fromTo(s.box, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.38, ease: "back.out(2.6)" }, t);
        else if (kind === "slide") tl.fromTo(s.box, { x: -1300, skewX: 25 }, { x: 0, skewX: 0, duration: 0.5, ease: "expo.out" }, t);
      }
      const big = (parent, text, o) => { const fs = Math.min(o.max || 200, Math.floor(o.width / measure(text, "Unbounded", 900, "-.03em")));
        return slab(parent, { x: o.x, y: o.y, text, font: "Unbounded", weight: 900, size: fs, ls: "-.03em", bg: o.bg, ink: "#0a0f2e", pad: fs * 0.16 + "px " + fs * 0.2 + "px " + fs * 0.12 + "px", studs: true, r: 18, rot: o.rot || 0 }); };
      const mono = (parent, text, o) => slab(parent, { x: o.x, y: o.y, text, font: "JetBrains Mono", weight: o.weight || 700, size: o.size, ls: o.ls || "0", bg: o.bg, ink: o.ink, pad: o.pad || "16px 26px 18px", r: 12, rot: o.rot || 0 });

      function build() {
        const tl = gsap.timeline({ paused: true });
        const world = $("world"), cam = $("cam"), flash = $("flash");

        /* ── grana ── */
        {
          const cv = document.createElement("canvas"); cv.width = cv.height = 256; const g = cv.getContext("2d"), im = g.createImageData(256, 256);
          for (let i = 0; i < im.data.length; i += 4) { const v = Math.floor(rnd() * 255); im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
          g.putImageData(im, 0, 0); $("grain").style.backgroundImage = "url(" + cv.toDataURL() + ")";
          tl.to("#grain", { x: 180, y: -140, duration: 30, ease: "steps(900)" }, 0);
        }

        /* ── la camera: un solo movimento continuo per tutto lo spot ── */
        const C = { cx: 0, cy: 0, s: 1 };
        const center = (p) => [p.x + W / 2, p.y + H / 2];
        const apply = () => { world.style.transform = "translate(" + (W / 2 - C.cx * C.s) + "px," + (H / 2 - C.cy * C.s) + "px) scale(" + C.s + ")"; };
        const ord = P.filter((p) => p.t != null);
        [C.cx, C.cy] = center(ord[0]); apply();
        const camTo = (cx, cy, s, t, d, ease) => tl.to(C, { cx, cy, s, duration: d, ease, onUpdate: apply }, t);
        const TR = 0.66, LOW = 0.44; // durata del volo tra due mattoncini e quanto si allontana
        for (let i = 0; i < ord.length; i++) {
          const p = ord[i], q = ord[i + 1], [x, y] = center(p);
          if (p.id === "final") break;
          const holdA = p.t + (i === 0 ? 0 : TR / 2), holdB = (q && q.id !== "final" ? q.t - TR / 2 : WALL[0]);
          camTo(x, y, 1.035, holdA, holdB - holdA, "none"); // lieve spinta mentre si guarda
          if (q && q.id !== "final") {
            const [x2, y2] = center(q);
            tl.to(C, { cx: x2, cy: y2, duration: TR, ease: "power3.inOut", onUpdate: apply }, holdB);
            tl.to(C, { s: LOW, duration: TR / 2, ease: "power2.out", onUpdate: apply }, holdB);
            tl.to(C, { s: 1, duration: TR / 2, ease: "power2.in", onUpdate: apply }, holdB + TR / 2);
            tl.fromTo(cam, { rotation: 0 }, { rotation: (i % 2 ? 1 : -1) * 5, duration: TR / 2, ease: "sine.out", yoyo: true, repeat: 1, immediateRender: false }, holdB);
          }
        }
        // tutto il mondo: la camera si allontana e mostra ogni mattoncino, poi si tuffa nel finale
        const wallS = Math.min(W * 0.92 / WORLD_W, H * 0.92 / WORLD_H);
        tl.to(C, { cx: WORLD_W / 2, cy: WORLD_H / 2, s: wallS, duration: 0.75, ease: "power3.inOut", onUpdate: apply }, WALL[0] + 0.05);
        tl.to(C, { s: wallS * 1.06, duration: 0.6, ease: "none", onUpdate: apply }, WALL[0] + 0.8);
        const fin = P.find((p) => p.id === "final"), [fx, fy] = center(fin);
        tl.to(C, { cx: fx, cy: fy, duration: 0.7, ease: "expo.inOut", onUpdate: apply }, WALL[1] - 0.95);
        tl.to(C, { s: 1, duration: 0.7, ease: "expo.inOut", onUpdate: apply }, WALL[1] - 0.95);
        tl.to(C, { s: 1.03, duration: 30 - WALL[1], ease: "none", onUpdate: apply }, WALL[1]);
        // i mattoncini hanno angoli arrotondati solo quando li vediamo da lontano
        const panels = P.map((p) => $("p-" + p.id));
        tl.set(panels, { "--pr": "0px" }, 0);
        ord.slice(0, -1).forEach((p, i) => { if (i === 0) return; tl.to(panels, { "--pr": "60px", duration: TR / 2 }, p.t - TR / 2); tl.to(panels, { "--pr": "0px", duration: TR / 2 }, p.t); });
        tl.to(panels, { "--pr": "80px", duration: 0.5 }, WALL[0] + 0.05); tl.to(panels, { "--pr": "0px", duration: 0.5 }, WALL[1] - 0.6);

        /* ── camera dentro ogni ripresa ── */
        P.filter((p) => p.v).forEach((p) => {
          VIDS.filter((v) => v.pid === p.id).forEach((v) => {
            const e = $("v-" + v.id); gsap.set(e, { transformOrigin: "50% 50%" });
            tl.fromTo(e, { scale: p.cam[0] }, { scale: p.cam[1], duration: v.dur, ease: "none" }, v.at);
          });
        });
        for (let i = 1; i < TILT.length; i++) { const [t0] = TILT[i - 1], [t1, rz] = TILT[i]; if (t1 > t0) tl.to("#v-car", { rotation: rz, duration: t1 - t0, ease: "none" }, t0); }
        $("v-intro").style.filter = "contrast(1.06) saturate(1.12) blur(3px) brightness(.6)";

        /* ── 0: il logo si costruisce mattoncino per mattoncino ── */
        {
          const L = $("t-intro");
          const LOGO = [[74, 408], [412, 743], [746, 1080], [1084, 1415], [1418, 1744], [1744, 2071], [2074, 2408], [2412, 2743], [2746, 3080]];
          const sc = 980 / 3144, LX = 50, LY = 560, LH = 656 * sc;
          const halo = el("div", "abs", { left: "40px", top: LY - 260 + "px", width: "1000px", height: "720px", borderRadius: "50%", opacity: 0, background: "radial-gradient(closest-side, rgba(255,199,44,.5), rgba(238,69,168,.3) 50%, transparent 100%)", filter: "blur(30px)" }, L);
          const lb = LOGO.map(([x0, x1]) => el("div", "lb", { left: LX + x0 * sc + "px", top: LY + "px", width: (x1 - x0) * sc + 1 + "px", height: LH + "px", backgroundSize: 3144 * sc + "px " + LH + "px", backgroundPosition: -x0 * sc + "px 0", filter: "drop-shadow(0 14px 18px rgba(0,0,0,.55))" }, L));
          tl.fromTo(lb, { y: -1500, rotation: (k) => (k % 2 ? -22 : 22) }, { y: 0, rotation: 0, duration: 0.5, ease: "bounce.out", stagger: 0.055 }, 0.02);
          tl.fromTo(halo, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }, 0.55);
          const sh = el("div", "abs", { left: LX + "px", top: LY + "px", width: 3144 * sc + "px", height: LH + "px", overflow: "hidden" }, L);
          const bar = el("div", "shine", { left: "-200px" }, sh); gsap.set(bar, { rotation: 18 });
          tl.fromTo(bar, { x: 0 }, { x: 1300, duration: 0.5, ease: "power2.inOut" }, 0.95);
          const A = big(L, "MATTONCINI", { x: "c", y: LY + LH + 70, width: 820, bg: "#f4f6ff", rot: -2.5 });
          const B = big(L, "INFINITI.", { x: "c", y: LY + LH + 70 + A.h + 8, width: 700, bg: "#ffc72c", rot: 2 });
          const T = mono(L, "GRATIS · SUL TELEFONO E NEL BROWSER", { x: "c", y: LY + LH + 70 + A.h + B.h + 34, size: 34, weight: 800, ls: ".02em", bg: "#0a0f2e", ink: "#ffc72c", pad: "14px 24px", rot: -1 });
          slabIn(tl, A, 0.85, "pop"); slabIn(tl, B, 1.05, "rise"); slabIn(tl, T, 1.35, "wipe");
        }

        /* ── capitoli: i testi restano attaccati al loro mattoncino e viaggiano con lui ── */
        P.filter((p) => p.w).forEach((p, i) => {
          const L = $("t-" + p.id), sign = i % 2 ? 1 : -1, t0 = p.wAt || p.t + 0.12;
          const ss = Math.min(44, Math.floor(900 / (measure(p.s, "JetBrains Mono", 700) + 0.5)));
          const sub = mono(L, p.s, { x: 56, y: 0, size: ss, bg: "#f4f6ff", ink: "#0a0f2e", rot: sign * 1.0 });
          const tile = big(L, p.w, { x: 56, y: 0, width: 860, bg: p.bc, rot: sign * 1.6 });
          const lab = mono(L, p.n + " / 06", { x: 56, y: 0, size: 32, weight: 800, ls: ".08em", bg: "#0a0f2e", ink: p.bc, pad: "12px 20px" });
          const subY = 1770 - sub.h, tileY = subY - tile.h - 22;
          sub.box.style.top = subY + "px"; tile.box.style.top = tileY + "px"; lab.box.style.top = tileY - 92 + "px";
          slabIn(tl, lab, p.t + 0.02, "wipe");
          slabIn(tl, tile, t0, p.kin);
          slabIn(tl, sub, p.t + 0.3, "wipe");
          tl.fromTo(tile.box, { y: 0 }, { y: -10, duration: Math.max(0.3, (p.e - p.t - 0.9) / 2), ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }, t0 + 0.65);
          if (p.id === "dyn") [0, 1, 2, 3, 4, 5, 6, 7].forEach((k) => tl.set(tile.box, { x: k === 7 ? 0 : (hash(k * 13) - 0.5) * 50 }, BOOM + 0.42 + k * 0.04));
        });

        /* ── esplosioni: lampo e scossa della camera ── */
        const shake = (T, k) => [[-34, 2], [28, -2], [-20, 1.5], [14, -1], [-7, .5], [0, 0]].forEach(([x, r], i) => tl.to(cam, { x: x * k, y: -x * 0.6 * k, rotation: r * k, duration: 0.045, ease: "none" }, T + i * 0.045));
        tl.set(flash, { opacity: 0.85 }, BOOM); tl.to(flash, { opacity: 0, duration: 0.4, ease: "power2.out" }, BOOM + 0.04); shake(BOOM, 1.2);
        tl.set(flash, { opacity: 0.55 }, TBOOM); tl.to(flash, { opacity: 0, duration: 0.3 }, TBOOM + 0.03); shake(TBOOM, 0.6);

        /* ── finale: logo e invito, dentro l'ultimo mattoncino ── */
        {
          const L = $("t-final"); const pf = $("p-final");
          pf.style.background = "radial-gradient(70% 45% at 30% 25%, #2f4bd0 0%, transparent 70%), radial-gradient(60% 40% at 75% 70%, #a8338a 0%, transparent 70%), #0d1442";
          el("div", "abs", { inset: "0", opacity: ".1", backgroundImage: "radial-gradient(circle at 50% 50%, #fff 0 17px, transparent 19px)", backgroundSize: "72px 72px" }, L);
          const logo = el("img", "abs", { left: "100px", top: "180px", width: "880px", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.5))" }, L); logo.src = "assets/logo.png";
          const tag = mono(L, "IL GIOCO DI MATTONCINI 3D", { x: "c", y: 400, size: 34, weight: 800, ls: ".06em", bg: "#f4f6ff", ink: "#0a0f2e", pad: "14px 24px" });
          tl.fromTo(logo, { scale: 1.5, rotation: -6, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.7, ease: "expo.out", transformOrigin: "50% 50%" }, 21.95);
          slabIn(tl, tag, 22.35, "wipe");
          const G = big(L, "GIOCA ORA", { x: "c", y: 640, width: 860, bg: "#ffc72c", rot: -2 });
          const S1 = mono(L, "GRATIS NEL BROWSER · SENZA ACCOUNT", { x: "c", y: 640 + G.h + 40, size: 38, weight: 800, bg: "#f4f6ff", ink: "#0a0f2e", rot: 1.2 });
          const S2 = mono(L, "OPPURE INSTALLALO SUL TELEFONO", { x: "c", y: 640 + G.h + 40 + S1.h + 18, size: 38, weight: 800, bg: "#0a0f2e", ink: "#ffc72c", rot: -1 });
          slabIn(tl, G, 25.4, "drop"); slabIn(tl, S1, 26.1, "wipe"); slabIn(tl, S2, 26.4, "wipe");
          tl.fromTo(G.box, { scale: 1 }, { scale: 1.04, transformOrigin: "50% 50%", duration: 2.8, ease: "sine.inOut", immediateRender: false }, 26.6);
          const card = el("div", "abs", { left: "60px", top: "1420px", width: "960px", height: "250px", borderRadius: "40px", background: "rgba(255,255,255,.1)", border: "2px solid rgba(255,255,255,.25)", opacity: 0 }, L);
          const qrb = el("div", "abs", { left: "24px", top: "24px", width: "202px", height: "202px", borderRadius: "22px", background: "#fff" }, card);
          const cv = el("canvas", "abs", { left: "11px", top: "11px", width: "180px", height: "180px" }, qrb); cv.width = cv.height = 360;
          try {
            const q = QRLIB(0, "M"); q.addData("https://hello-noor.github.io/ulisse/ulibricks/", "Byte"); q.make();
            const n = q.getModuleCount(), s = 360 / n, x = cv.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, 360, 360); x.fillStyle = "#0a0f2e";
            for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) x.fillRect(Math.floor(c * s), Math.floor(r * s), Math.ceil(s), Math.ceil(s));
          } catch (err) { console.error(err); }
          el("div", "abs", { left: "262px", top: "52px", fontFamily: "Unbounded", fontWeight: 700, fontSize: "40px", color: "#ffc72c" }, card, "Inquadra e gioca");
          el("div", "abs", { left: "262px", top: "128px", width: "680px", fontWeight: 700, fontSize: "36px", lineHeight: 1.2, color: "#fff" }, card, "hello-noor.github.io/ulisse/ulibricks");
          tl.fromTo(card, { opacity: 0, y: 60, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "expo.out" }, 26.8);
          const by = el("div", "abs", { left: "0", top: "1745px", width: "1080px", textAlign: "center", fontWeight: 700, fontSize: "36px", color: "rgba(255,255,255,.75)", opacity: 0 }, L, "Ideato da Ulisse (6 anni)");
          tl.fromTo(by, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 27.3);
        }

        window.__timelines["main"] = tl;
        tl.seek(0);
      }
      Promise.all(['900 100px "Unbounded"', '700 40px "Unbounded"', '700 40px "Inter"', '700 40px "JetBrains Mono"', '800 40px "JetBrains Mono"'].map((f) => document.fonts.load(f))).then(build);
    </script>
  </body>
</html>
`;
fs.writeFileSync(new URL("../../ulibricks-30s-onetake/index.html", import.meta.url), html);
console.log("onetake.html scritto:", P.length, "pannelli,", VIDS.length, "riprese,", TILT.length, "punti tilt");
