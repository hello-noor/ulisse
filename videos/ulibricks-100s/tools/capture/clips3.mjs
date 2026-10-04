import { open, Rec, adv, ev, FPS } from './harness.mjs';
import { megaWorld, addChar, orbit, screenOf, installFree, freeSpots, lookAt, animalAt, LAYOUT_FULL, LAYOUT_ROAD } from './lib.mjs';
import fs from 'node:fs';
const name = process.argv[2];
const DPR = +(process.env.DPR || 2);
const { b, p } = await open({ dpr: DPR });
const r = new Rec(p, `out/${name}`);
const tryDo = async (label, fn) => { try { await fn(); } catch (e) { console.log('FAIL', label, String(e.message).split('\n')[0].slice(0, 120)); } };
const clickText = (t) => p.locator(`button:has-text("${t}")`).first().click({ timeout: 6000 });
const tapAt = async (pt) => p.touchscreen.tap(pt[0], pt[1]);
const world = async (layout = LAYOUT_FULL) => { await megaWorld(p, { layout }); await installFree(p); };
const SUITS = ['principessa', 'astronauta', 'pirata', 'ninja', 'babbonatale', 'mago', 'supereroe', 'cuoco', 'regina', 'sirena', 'cowboy', 'fata'];
const crowd = async (nChars, animals, seed, charsBeh = 'walk') => { // popola gli spazi liberi
  const cs = await freeSpots(p, 2, 1, nChars, seed);
  for (let k = 0; k < cs.length; k++) await addChar(p, { suit: SUITS[k % SUITS.length], name: SUITS[k % SUITS.length], beh: charsBeh }, cs[k][0], cs[k][1], false);
  const sp = await freeSpots(p, 2, 3, animals.length, seed + 11);
  for (let k = 0; k < sp.length; k++) await animalAt(p, animals[k], sp[k][0], sp[k][1], 0, 'walk');
  return { cs, sp };
};
const act = async (animal, label, wait, charId) => {
  await tryDo('tool', async () => { await clickText('Interagisci'); }); await r.frames(0.35);
  if (charId) await ev(p, `(state.charId='${charId}', 0)`);
  const pos = await screenOf(p, `bricks.find(x=>String(x.color)==='@an_${animal}')`);
  if (!pos) { console.log('NOPOS', animal); return; }
  await tapAt(pos); await r.frames(0.8);
  await tryDo(label + ' ' + animal, async () => { await clickText(label); }); await r.frames(wait);
};
const steerLog = [];
let tAcc = 0, tSteer = 0;
const tiltEvt = async () => {
  const X = tAcc > 0 ? 7 + 28 * Math.pow(tAcc, 1 / 1.8) : 0;
  const Y = Math.abs(tSteer) > 0.001 ? Math.sign(tSteer) * (7 + 32 * Math.pow(Math.abs(tSteer), 1 / 1.8)) : 0;
  await ev(p, `window.dispatchEvent(new DeviceOrientationEvent('deviceorientation',{beta:${-X + 30},gamma:${-Y},alpha:0}))`);
};
// inclinazione dolce: ogni fotogramma si muove verso il target
const tilt = async (acc, steer, sec) => {
  const n = Math.round(sec * FPS);
  for (let i = 0; i < n; i++) {
    tAcc += (acc - tAcc) * 0.12; tSteer += (steer - tSteer) * 0.12;
    await tiltEvt(); steerLog.push([r.n, +tSteer.toFixed(3), +tAcc.toFixed(3)]); await r.step();
  }
};
const saveSteer = () => fs.writeFileSync(`out/${name}.steer.json`, JSON.stringify({ fps: FPS, log: steerLog }));
const startDriving = async () => { await ev(p, `startDrive(__w)`); await r.frames(0.5); await ev(p, `tiltOn()`); await r.frames(0.3); await tiltEvt(); await r.frames(0.5); };

const clips = {
  async hero() {
    await world(); await crowd(10, ['drago', 'trex', 'elefante', 'leone', 'triceratopo', 'chimera', 'grifo', 'polpo'], 21);
    await ev(p, `(cam.target.set(0,5,0), cam.radius=150, cam.phi=1.15, cam.theta=0.2, 0)`); await adv(p, 1500); await r.frames(0.2);
    for (let i = 0; i < 7 * FPS; i++) { await ev(p, `(cam.theta+=0.011, cam.radius=Math.max(88, cam.radius-0.55), cam.phi=Math.max(.95, cam.phi-.0006), 0)`); await r.step(); }
  },
  async tray() {
    const shapes = [['mattoni', 'mattone', '#D7263D'], ['piastre', 'piastra', '#2FA84F'], ['forme', 'colonna', '#F5C400'], ['tetti', 'cupola', '#1F4FB5'], ['mecc', 'ruota', '#FF8A1F'], ['deco', 'albero', '#2FA84F']];
    await r.frames(0.5); let x = 14;
    for (const [cat, sh, col] of shapes) {
      await ev(p, `(()=>{ const c=CATS.find(c=>c[0].startsWith('${cat}'))||CATS[0]; state.shape=c[2].includes('${sh}')?'${sh}':c[2][0]; state.size=SHAPES[state.shape].sizes[Math.min(3,SHAPES[state.shape].sizes.length-1)].slice(); state.color='${col}'; renderUI(); })()`);
      await r.frames(0.4);
      await ev(p, `attach(makeBrick({shape:state.shape,w:state.size[0],d:state.size[1],color:state.color,rot:0,i0:${x},j0:22,level:0}),true)`); x += 5; await r.frames(0.6);
    }
    await r.frames(0.4);
  },
  async kit() {
    await ev(p, `setTab('kit')`); await r.frames(0.8);
    await ev(p, `startKit(KITS.find(k=>k.id==='castello'))`); await r.frames(0.8);
    for (let i = 0; i < 79; i++) { await ev(p, `kitAuto()`); await orbit(p, 0.012); await r.step(i < 20 ? 3 : 2); }
    for (let i = 0; i < 70; i++) { await orbit(p, 0.012); await r.step(); }
  },
  async citybuild() {
    await ev(p, `(()=>{ base.plates.length=0; [[0,0,'grass','#3FA34D'],[24,0,'sand'],[0,24,'snow'],[24,24,'lava']].forEach(([x,z,b,c])=>base.plates.push({x,z,w:24,d:24,color:c||'#3FA34D',round:false,b})); baseChanged(false); })()`);
    await ev(p, `(cam.target.set(0,4,0), cam.radius=125, cam.phi=1.1, cam.theta=0.5, 0)`); await adv(p, 600); await r.frames(0.6);
    const kits = LAYOUT_FULL;
    const all = await ev(p, `JSON.stringify(${JSON.stringify(kits)}.flatMap(([id,cx,cz])=>KITS.find(k=>k.id===id).steps.map(d=>Object.assign({},d,{i0:d.i0+(cx-24),j0:d.j0+(cz-24)}))))`).then(JSON.parse);
    const per = Math.ceil(all.length / (6.0 * FPS));
    for (let f = 0; f * per < all.length; f++) {
      const chunk = all.slice(f * per, (f + 1) * per);
      await ev(p, `(()=>{ ${JSON.stringify(chunk)}.forEach(d=>attach(makeBrick(d),true)); })()`);
      await ev(p, `(cam.theta+=0.006, cam.radius=Math.max(95,cam.radius-0.25), 0)`); await r.step();
    }
    await r.frames(1.2);
  },
  async bases2() {
    await world(); await crowd(6, ['leone', 'drago', 'trex'], 31);
    await ev(p, `(cam.target.set(0,3,0), cam.radius=110, cam.phi=1.1, cam.theta=0.7, 0)`); await adv(p, 800); await r.frames(0.5);
    await ev(p, `openBaseEditor()`); await r.frames(1.6);
    await ev(p, `document.getElementById('baseModal').hidden=true`); await r.frames(0.4);
    for (const [pl, id] of [[0, 'water'], [1, 'moon'], [2, 'checker'], [3, 'parquet'], [0, 'asphalt'], [1, 'grass']]) {
      await ev(p, `(()=>{ BE.sel=${pl}; setLook('${id === 'grass' ? '#3FA34D' : ''}', '${id}'); })()`); await ev(p, `(cam.theta+=0.05,0)`); await r.frames(0.8);
    }
  },
  async park() {
    await world(LAYOUT_ROAD); await installFree(p);
    const spots = await freeSpots(p, 5, 5, 8, 5);
    const names = [['giostra', 5, 5, '#D7263D'], ['mulino', 1, 1, '#FFC914'], ['radar', 1, 1, '#1F4FB5'], ['altalena', 1, 5, '#2FA84F'], ['semaforo', 1, 1, '#F46036'], ['orologio', 2, 2, '#FFC914'], ['sirena', 1, 1, '#D7263D'], ['bandiera', 1, 1, '#1F4FB5']];
    const sp0 = spots[0] || [20, 20];
    const place = [[0, 0], [8, 0], [-6, 0], [0, 8], [8, 8], [-6, 8], [4, -6], [-6, -6]];
    for (let k = 0; k < names.length; k++) { const [s, w, d, c] = names[k]; await ev(p, `attach(makeBrick({shape:'${s}',w:${w},d:${d},color:'${c}',rot:0,i0:${sp0[0] + place[k][0] + 3},j0:${sp0[1] + place[k][1] + 3},level:0}),true)`); await r.frames(0.3); }
    await lookAt(p, sp0[0] + 5, sp0[1] + 5, 44, 1.0, 0.6);
    for (let i = 0; i < 100 * FPS / 30; i++) { await orbit(p, 0.012); await r.step(); }
  },
  async car() {
    await world(LAYOUT_ROAD);
    await ev(p, `(()=>{ const k=KITS.find(k=>k.id==='auto'); k.steps.forEach(d=>attach(makeBrick(d),false)); settle(true); afterChange(); window.__w=bricks.find(b=>b.shape==='ruote'); })()`);
    await ev(p, `(()=>{ const sz=ANIMAL_SIZE['an_drago']; ANIMAL_CHARS['an_drago'].beh='still'; attach(makeBrick({shape:'personaggio',w:sz[0],d:sz[1],color:'@an_drago',rot:0,i0:22,j0:21,level:12}),false); settle(true); afterChange(); })()`);
    await ev(p, `(cam.radius=46, cam.target.set(0,3,0), cam.phi=1.0, 0)`); await adv(p, 500); await r.frames(0.6);
    await startDriving();
    await tilt(0.55, 0, 1.4); await tilt(0.6, 0.8, 1.8); await tilt(0.6, -0.8, 2.2); await tilt(0.6, 0.8, 1.8); await tilt(0.3, 0, 1.0); await tilt(0, 0, 0.8);
    saveSteer();
  },
  async truck() {
    await world(LAYOUT_ROAD);
    await ev(p, `(()=>{ const [w,d]=SHAPES.ruote.sizes[SHAPES.ruote.sizes.length-1];
      const add=(shape,w,d,c,i,j,l)=>attach(makeBrick({shape,w,d,color:c,rot:0,i0:i,j0:j,level:l}),false);
      const i0=24-Math.floor(w/2), j0=24-Math.floor(d/2); add('ruote',w,d,'#2B2B2B',i0,j0,0); add('piastra',w,d,'#FFC914',i0,j0,3);
      const an=(id,i,j,l)=>{ const sz=ANIMAL_SIZE['an_'+id]; ANIMAL_CHARS['an_'+id].beh='still'; attach(makeBrick({shape:'personaggio',w:sz[0],d:sz[1],color:'@an_'+id,rot:0,i0:i,j0:j,level:l}),false); };
      an('drago',i0,j0,4); an('trex',i0+2,j0+3,4); an('elefante',i0,j0+6,4);
      settle(true); afterChange(); window.__w=bricks.find(b=>b.shape==='ruote'); })()`);
    await ev(p, `(cam.radius=50, cam.target.set(0,3,0), cam.phi=1.0, 0)`); await adv(p, 500); await r.frames(0.8);
    await startDriving();
    await tilt(0.55, 0, 1.4); await tilt(0.6, -0.8, 1.8); await tilt(0.6, 0.8, 2.2); await tilt(0.6, -0.8, 1.8); await tilt(0.3, 0, 1.0); await tilt(0, 0, 0.8);
    saveSteer();
  },
  async zoo() {
    await world(LAYOUT_ROAD);
    const cid = await addChar(p, { suit: 'principessa', name: 'Sofia', beh: 'still' }, 22, 26, false);
    for (const [id, i, j] of [['drago', 27, 23], ['grifo', 31, 27], ['chimera', 16, 23], ['polpo', 22, 32], ['trex', 28, 32], ['cavalluccio', 15, 29]]) await animalAt(p, id, i, j, 0, 'still');
    await ev(p, `setTab('chars')`); await ev(p, `(cam.target.set(1,1,3), cam.radius=34, cam.phi=1.0, cam.theta=0, 0)`); await adv(p, 800); await r.frames(0.6);
    await ev(p, `(()=>{ state.charId='${cid}'; })()`);
    const go = async (x, y, sec) => { await tryDo('vai', async () => { await clickText('Vai qui'); }); await r.frames(0.3);
      await tapAt(await screenOf(p, `bricks.find(x=>String(x.color)==='@${cid}')`)); await r.frames(0.4); await tapAt([x, y]); await r.frames(sec); };
    await act('drago', 'Guinzaglio', 1.0); await go(320, 420, 3.4);
    await act('drago', 'Libera', 0.8);
    await act('grifo', 'Guinzaglio', 1.0); await go(110, 460, 3.4);
    await act('grifo', 'Libera', 0.8);
    await act('chimera', 'Cavalca', 4.5); await act('chimera', 'Scendi', 0.8);
    await act('trex', 'Mangiare', 3.4);
    await act('polpo', 'Coccole', 2.8);
    await act('cavalluccio', 'Verso', 2.0);
  },
  async dyn() {
    await world(); await crowd(6, ['leone', 'drago', 'elefante'], 41, 'walk');
    await ev(p, `(cam.target.set(0,4,0), cam.radius=88, cam.phi=1.05, cam.theta=0.3, 0)`); await adv(p, 800); await r.frames(0.6);
    await p.click('#boomBtn'); await r.frames(0.6); await p.locator('.dm-item').nth(0).click(); await r.frames(0.5); await p.locator('.dm-item').nth(0).click(); await r.frames(0.6);
    await tapAt([270, 430]); await r.frames(0.5); await tapAt([200, 470]); await r.frames(0.5); await tapAt([340, 470]); await r.frames(0.6); await tapAt([270, 430]); await r.frames(7.0);
  },
  async quake() {
    await world(); await crowd(8, ['trex', 'elefante', 'drago', 'leone'], 51, 'walk'); await ev(p, `(cam.target.set(0,4,0), cam.radius=95, cam.phi=1.05, cam.theta=-0.4, 0)`);
    await adv(p, 3000); await r.frames(0.6); await p.click('#boomBtn'); await r.frames(0.5); await p.locator('.dm-item').nth(2).click(); await r.frames(6.5);
  },
  async run() {
    await world(); await addChar(p, { suit: 'ninja', name: 'Ninja' }, 6, 44, false); await animalAt(p, 'trex', 40, 44, 0, 'still'); await adv(p, 800);
    await p.click('#boomBtn'); await r.frames(0.5); await p.locator('.dm-item').nth(3).click(); await r.frames(1.0);
    try { await p.locator('#rnMounts button').nth(1).click({ timeout: 3000 }); await r.frames(0.8); } catch (e) { console.log('nomount'); }
    await p.keyboard.press('Space'); await ev(p, `RUN.shield=99`);
    const plan = [[0.5, 'ArrowLeft'], [1.1, 'ArrowUp'], [1.6, 'ArrowRight'], [2.2, 'ArrowRight'], [2.7, 'ArrowUp'], [3.3, 'ArrowLeft'], [3.9, 'ArrowLeft'], [4.4, 'ArrowUp'], [5.0, 'ArrowRight'], [5.6, 'ArrowUp'], [6.2, 'ArrowLeft'], [6.8, 'ArrowRight'], [7.4, 'ArrowUp'], [8.0, 'ArrowLeft']];
    let t = 0; for (const [at, k] of plan) { await r.frames(at - t); t = at; await p.keyboard.press(k); await ev(p, `RUN.shield=99`); } await r.frames(1.0);
  },
  async reel() {
    await world(); await crowd(10, ['drago', 'trex', 'leone', 'elefante', 'grifo', 'chimera'], 61, 'still'); await adv(p, 2500);
    await ev(p, `setTab('show')`); await r.frames(0.4); await ev(p, `startPresent()`); await r.frames(18);
  },
  async share() {
    await world(); await adv(p, 1500); await ev(p, `setTab('show')`); await r.frames(0.6);
    await ev(p, `document.getElementById('shotTitle').value='La mia città folle'`); await ev(p, `openShare()`); await r.frames(3.5);
  },
  async lineup() {
    await world(); const suits = await ev(p, `JSON.stringify(SUITS.slice(1).map(s=>s[0]))`).then(JSON.parse);
    const spots = await freeSpots(p, 2, 1, suits.length, 13);
    for (let k = 0; k < suits.length; k++) await addChar(p, { suit: suits[k], name: suits[k], beh: 'walk' }, spots[k][0], spots[k][1], false);
    await ev(p, `(cam.target.set(0,2,4), cam.radius=62, cam.phi=1.0, cam.theta=0.2, 0)`); await adv(p, 1500); await r.frames(0.6);
    for (let i = 0; i < 6 * FPS; i++) { await orbit(p, 0.006); await r.step(); }
  },
  async vita() {
    await world(LAYOUT_ROAD); await ev(p, `setTab('chars')`);
    const sz = ['principessa', 'astronauta', 'pirata', 'ninja', 'babbonatale', 'mago', 'cuoco', 'supereroe', 'regina', 'cowboy'];
    const behs = ['walk', 'friend', 'friend', 'walk', 'friend', 'sit', 'walk', 'friend', 'walk', 'friend'];
    for (let k = 0; k < sz.length; k++) await addChar(p, { suit: sz[k], name: sz[k], beh: behs[k] }, 14 + (k % 5) * 4, 20 + Math.floor(k / 5) * 6, true);
    await ev(p, `(cam.target.set(0,1,0), cam.radius=40, cam.phi=1.0, cam.theta=0, 0)`); await r.frames(1.5);
    for (let i = 0; i < 7 * FPS; i++) { await orbit(p, 0.003); await r.step(); }
  },
  async animals_tab() {
    await world(LAYOUT_ROAD); await ev(p, `setTab('animals')`); await r.frames(0.8);
    for (let i = 0; i < 90 * FPS / 30; i++) { await ev(p, `(()=>{ const s=document.querySelector('#animCards'); if(s) s.scrollLeft = (s.scrollWidth - s.clientWidth) * ${i / (90 * FPS / 30 - 1)}; })()`); await r.step(); }
    for (const [id, i, j] of [['grifo', 18, 22], ['chimera', 26, 22], ['trex', 22, 28]]) { await ev(p, `armAnimal('an_${id}')`); await r.frames(0.3); await ev(p, `attach(makeBrick({shape:'personaggio',w:2,d:3,color:'@an_${id}',rot:0,i0:${i},j0:${j},level:0}),true)`); await r.frames(0.9); }
  },
  async house_wheels() {
    await world(LAYOUT_ROAD.filter(([id]) => id !== 'castello'));
    await ev(p, `(()=>{ const add=(shape,w,d,c,i,j,l)=>attach(makeBrick({shape,w,d,color:c,rot:0,i0:i,j0:j,level:l}),false);
      add('ruote',6,10,'#2B2B2B',21,19,0); add('piastra',16,16,'#C9CBD1',16,16,3);
      const k=KITS.find(k=>k.id==='castello'); k.steps.forEach(d=>attach(makeBrick(Object.assign({},d,{level:d.level+4})),false));
      settle(true); afterChange(); window.__w=bricks.find(b=>b.shape==='ruote'); return bricks.length; })()`).then(x => console.log('bricks', x));
    await ev(p, `(cam.radius=75, cam.target.set(0,12,0), cam.phi=1.0, 0)`); await adv(p, 500); await r.frames(0.8);
    await startDriving();
    await tilt(0.9, 0, 1.0); await tilt(0.9, 0.9, 1.5); await tilt(0.9, -0.9, 1.7); await tilt(0.9, 0.8, 1.4); await tilt(0.9, 0, 1.0);
    saveSteer();
  },
};
await clips[name]();
console.log(name, 'frames', r.n);
await b.close();
