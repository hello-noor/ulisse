import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import fs from 'node:fs';
export const FPS = +(process.env.FPS||30);
const VCLOCK = () => {
  let now = 1000, id = 1; const timers = new Map(); let raf = [];
  const realNow = performance.now.bind(performance);
  performance.now = () => now;
  Date.now = () => 1.7e12 + now;
  window.requestAnimationFrame = (cb) => { const i = id++; raf.push([i, cb]); return i; };
  window.cancelAnimationFrame = (i) => { raf = raf.filter(r => r[0] !== i); };
  window.setTimeout = (cb, d = 0, ...a) => { const i = id++; timers.set(i, { t: now + Math.max(0, +d || 0), cb, a, iv: 0 }); return i; };
  window.setInterval = (cb, d = 0, ...a) => { const i = id++; d = Math.max(1, +d || 1); timers.set(i, { t: now + d, cb, a, iv: d }); return i; };
  window.clearTimeout = window.clearInterval = (i) => { timers.delete(i); };
  window.__advance = (dt) => {
    const end = now + dt;
    for (;;) { // timer in ordine
      let best = null, bi = 0;
      for (const [i, t] of timers) if (t.t <= end && (!best || t.t < best.t)) { best = t; bi = i; }
      if (!best) break;
      now = Math.max(now, best.t);
      if (best.iv) best.t += best.iv; else timers.delete(bi);
      try { best.cb(...best.a); } catch (e) { console.error(e); }
    }
    now = end;
    for (const a of document.getAnimations()) { try { a.pause(); a.currentTime = (a.currentTime || 0) + dt; } catch (e) {} }
    const cbs = raf; raf = [];
    for (const [, cb] of cbs) { try { cb(now); } catch (e) { console.error(e); } }
  };
};
export async function open({ w = 540, h = 960, dpr = 2, lang = 'it', url = 'http://localhost:8099/ulibricks/index.html', init = '' } = {}) {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, hasTouch: true, isMobile: true, locale: 'it-IT' });
  await ctx.addInitScript(([l]) => { try { localStorage.setItem('ulibricks-lang', l); localStorage.setItem('ulibricks-tour-v1', '1'); } catch (e) {} }, [lang]);
  await ctx.addInitScript(`(${VCLOCK.toString()})()`);
  if (init) await ctx.addInitScript(init);
  await ctx.route('https://fonts.googleapis.com/**', async (route) => {
    const F = '/tmp/claude-0/fonts/node_modules/@fontsource';
    const ff = (fam, w, file) => `@font-face{font-family:'${fam}';font-style:normal;font-weight:${w};font-display:block;src:url(data:font/woff2;base64,${fs.readFileSync(file).toString('base64')}) format('woff2');}`;
    const css = [ff('Bungee', 400, F + '/bungee/files/bungee-latin-400-normal.woff2'), ...[600, 700, 800].map((w) => ff('Nunito', w, F + `/nunito/files/nunito-latin-${w}-normal.woff2`))].join('\n');
    await route.fulfill({ body: css, contentType: 'text/css' });
  });
  await ctx.route('https://fonts.gstatic.com/**', (route) => route.abort());
  await ctx.route('**/ulibricks/index.html', async (route) => {
    let html = fs.readFileSync('/home/user/ulisse/ulibricks/index.html', 'utf8');
    const i = html.lastIndexOf('})();');
    html = html.slice(0, i) + 'window.__ev=(s)=>eval(s);' + html.slice(i);
    await route.fulfill({ body: html, contentType: 'text/html' });
  });
  const p = await ctx.newPage(); p.setDefaultTimeout(240000);
  p.on('pageerror', e => console.log('PAGEERR', e.message.slice(0, 200)));
  p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text().slice(0, 200)); });
  await p.goto(url);
  await p.waitForTimeout(500);
  const r = { b, p, ctx };
  await adv(p, 2000);
  return r;
}
export async function adv(p, ms, step = 1000 / 30) { let t = 0; while (t < ms) { const d = Math.min(step, ms - t); await p.evaluate((d) => window.__advance(d), d); t += d; } }
export const ev = (p, code) => p.evaluate((c) => window.__ev(c), code);
export class Rec {
  constructor(p, dir) { this.p = p; this.dir = dir; this.n = 0; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true }); }
  async frames(sec) { const n = Math.round(sec * FPS); for (let i = 0; i < n; i++) { await this.p.evaluate((d) => window.__advance(d), 1000 / FPS); await this.p.screenshot({ path: `${this.dir}/f${String(this.n++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92, timeout: 180000 }); } }
  async step(k = 1) { for (let i = 0; i < k; i++) { await this.p.evaluate((d) => window.__advance(d), 1000 / FPS); await this.p.screenshot({ path: `${this.dir}/f${String(this.n++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92, timeout: 180000 }); } }
  async skip(sec) { await adv(this.p, sec * 1000); }
}
