// Colonna sonora sintetica di ULIBRICKS promo: 120 BPM, 30 s, DO maggiore.
// Deterministica (nessun random non seminato). Uso: node tools/make-music.mjs assets/music.wav
import fs from "node:fs";
const SR = 44100, DUR = 90, BPM = 120, BEAT = 60 / BPM;
const N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 1337;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const add = (t, buf, g = 1, pan = 0) => {
  const s = Math.floor(t * SR);
  const gl = g * (1 - Math.max(0, pan)), gr = g * (1 + Math.min(0, pan));
  for (let i = 0; i < buf.length && s + i < N; i++) { L[s + i] += buf[i] * gl; R[s + i] += buf[i] * gr; }
};
const mk = (len, fn) => { const n = Math.floor(len * SR), b = new Float32Array(n); for (let i = 0; i < n; i++) b[i] = fn(i / SR, i); return b; };
const kick = () => mk(0.35, (t) => { const f = 45 + 120 * Math.exp(-t * 28); return Math.sin(2 * Math.PI * f * t + 0) * Math.exp(-t * 9) * 1.1; });
const clap = () => { let lp = 0; return mk(0.22, (t) => { lp += (rnd() - lp) * 0.55; const e = Math.exp(-t * 22) * (1 + 0.8 * Math.exp(-((t * 1000) % 12) / 3)); return lp * e * 0.55; }); };
const hat = (o = false) => { let p = 0; return mk(o ? 0.16 : 0.05, (t) => { const x = rnd(); const hp = x - p; p = x; return hp * Math.exp(-t * (o ? 22 : 90)) * 0.28; }); };
const bass = (m, len) => mk(len, (t) => { const f = mtof(m); const e = Math.min(1, t * 120) * Math.exp(-t * 4.5); return (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(4 * Math.PI * f * t)) * e * 0.5; });
const pluck = (m, len = 0.4) => { let lp = 0; return mk(len, (t) => { const f = mtof(m); const saw = 2 * ((t * f) % 1) - 1; const sq = (t * f) % 1 < 0.5 ? 1 : -1; const cut = 0.08 + 0.5 * Math.exp(-t * 14); lp += ((saw + sq) * 0.5 - lp) * cut; return lp * Math.exp(-t * 9) * 0.42; }); };
const bell = (m, len = 0.9) => mk(len, (t) => { const f = mtof(m); return (Math.sin(2 * Math.PI * f * t) + 0.4 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 8)) * Math.exp(-t * 4.2) * 0.30; });
const crash = (len = 1.6) => { let p = 0; return mk(len, (t) => { const x = rnd(); const hp = x - p; p = x; return hp * Math.exp(-t * 2.6) * 0.5; }); };
const riser = (len) => { let p = 0; return mk(len, (t) => { const x = rnd(); const hp = x - p; p = x; const g = Math.pow(t / len, 2.2); return hp * g * 0.35; }); };
const pad = (ms, len) => mk(len, (t) => { let s = 0; for (const m of ms) { const f = mtof(m); s += Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 1.004 * t); } const e = Math.min(1, t * 6) * Math.min(1, (len - t) * 6); return (s / ms.length) * 0.07 * e; });

const prog = [ // una battuta = 2 s
  { root: 36, ch: [60, 64, 67], arp: [72, 76, 79, 76, 72, 76, 79, 84] },  // C
  { root: 33, ch: [57, 60, 64], arp: [69, 72, 76, 72, 69, 72, 76, 81] },  // Am
  { root: 29, ch: [57, 60, 65], arp: [69, 72, 77, 72, 69, 72, 77, 81] },  // F
  { root: 31, ch: [59, 62, 67], arp: [71, 74, 79, 74, 71, 74, 79, 83] },  // G
];
const K = kick(), C = clap(), H = hat(), HO = hat(true);
const bars = DUR / (4 * BEAT);
for (let b = 0; b < bars; b++) {
  const p = prog[b % 4], t0 = b * 4 * BEAT;
  const full = b >= 1 && b < 43;
  add(t0, pad(p.ch, 4 * BEAT), 1, 0);
  for (let i = 0; i < 8; i++) { // ottavi
    const t = t0 + i * BEAT / 2;
    add(t, pluck(p.arp[i]), b >= 2 ? 0.9 : 0.55, i % 2 ? 0.35 : -0.35);
    if (full) { add(t, bass(p.root + (i % 4 === 3 ? 12 : 0), BEAT / 2 * 0.95), 1); add(t, i % 2 ? HO : H, 0.8, i % 2 ? 0.2 : -0.2); }
  }
  for (let i = 0; i < 4; i++) { // quarti
    const t = t0 + i * BEAT;
    if (b < 43 && (full || i % 2 === 0)) add(t, K, 0.95);
    if (full && (i === 1 || i === 3)) add(t, C, 0.8);
  }
  if (b >= 4 && b % 2 === 0) add(t0 + 0.75 * BEAT, bell(p.ch[2] + 12), 0.8, 0.4);
}
// accenti sui cambi di scena (0, 4, 9, 14, 19, 24 s)
for (const t of [0, 5, 25, 47, 66, 76, 81]) { add(t, crash(1.4), 0.55); add(t, K, 0.9); }
for (const t of [3.5, 23.5, 45.5, 64.5, 74.5, 79.5]) add(t, riser(1.5), 1);
// chiusura: accordo di DO pieno
for (const m of [60, 64, 67, 72, 76]) add(88, bell(m, 2), 0.9, (m % 3 - 1) * 0.3);
add(88, bass(36, 2), 1.1);
// master: soft clip + fade finale + normalizzazione
let peak = 0;
for (let i = 0; i < N; i++) { const f = i / SR > 89 ? Math.max(0, 90 - i / SR) : 1; L[i] = Math.tanh(L[i] * 1.3) * f; R[i] = Math.tanh(R[i] * 1.3) * f; peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
const g = 0.8 / peak;
const out = Buffer.alloc(44 + N * 4);
out.write("RIFF", 0); out.writeUInt32LE(36 + N * 4, 4); out.write("WAVEfmt ", 8); out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22);
out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34); out.write("data", 36); out.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { out.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); out.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
fs.writeFileSync(process.argv[2] || "music.wav", out);
console.log("ok", (N / SR).toFixed(1) + "s");
