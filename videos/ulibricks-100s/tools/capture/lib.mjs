import { ev, adv } from './harness.mjs';
export const castle = (p, id='castello') => ev(p, `(()=>{ const k=KITS.find(k=>k.id==='${id}'); k.steps.forEach(d=>attach(makeBrick(d),false)); settle(true); afterChange(); })()`);
export const addChar = (p, o, i0, j0, anim=true) => ev(p, `(()=>{ const ch=newChar(); Object.assign(ch, ${JSON.stringify(o)}); chars.push(ch);
  const b=makeBrick({shape:'personaggio',w:2,d:1,color:'@'+ch.id,rot:0,i0:${i0},j0:${j0},level:0}); attach(b,${anim}); try{renderCharRail();renderCharPanel();}catch(e){} return ch.id; })()`);
export const addAnimal = (p, id, i0, j0, anim=true) => ev(p, `(()=>{ const sz=ANIMAL_SIZE['an_${id}']; const b=makeBrick({shape:'personaggio',w:sz[0],d:sz[1],color:'@an_${id}',rot:0,i0:${i0},j0:${j0},level:0}); attach(b,${anim}); return 1; })()`);
export const orbit = (p, dth, dphi=0) => ev(p, `(cam.theta+=${dth}, cam.phi+=${dphi}, 0)`);
export const screenOf = (p, expr) => ev(p, `(()=>{ const b=${expr}; if(!b) return null; const v=b.mesh.position.clone(); v.y+=1.6; v.project(camera); const r=canvas.getBoundingClientRect(); return [r.left+(v.x+1)/2*r.width, r.top+(1-v.y)/2*r.height]; })()`);
// mondo grande e "senza senso": base 48x48 a 4 superfici + tutti i kit sparsi
export const megaWorld = (p, o = {}) => ev(p, `(()=>{
  base.plates.length=0;
  [[0,0,'grass','#3FA34D'],[24,0,'sand'],[0,24,'snow'],[24,24,'lava']].forEach(([x,z,b,c])=>base.plates.push({x,z,w:24,d:24,color:c||'#3FA34D',round:false,b}));
  baseChanged(false);
  const put=(id,cx,cz)=>{ const k=KITS.find(k=>k.id===id); k.steps.forEach(d=>attach(makeBrick(Object.assign({},d,{i0:d.i0+(cx-24),j0:d.j0+(cz-24)})),false)); };
  const L=${JSON.stringify(o.layout || [['castello',11,11],['pagoda',37,11],['palazzo',11,37],['torre',37,37],['razzo',24,24],['ponte',24,8],['auto',24,41],['elicottero',24,4],['albero',6,24],['giardino',41,24],['casa',24,32],['faro',19,18]])};
  L.forEach(([id,x,z])=>put(id,x,z));
  settle(true); afterChange(); return bricks.length; })()`);
// posizioni libere nel mondo (deterministiche)
export const installFree = (p) => ev(p, `(()=>{ window.__free=(w,d,n,seed)=>{ let s=seed; const rnd=()=>((s=(s*1664525+1013904223)>>>0)/4294967296); const out=[];
  const ok=(i0,j0)=>{ for(let i=i0-1;i<i0+w+1;i++)for(let j=j0-1;j<j0+d+1;j++){ if(i<0||j<0||i>=G||j>=G||!mask[i*G+j]) return false; for(let y=0;y<30;y++) if(occ.has(key(i,j,y))) return false; } return true; };
  for(let t=0;t<9000&&out.length<n;t++){ const i0=Math.floor(rnd()*(G-w)), j0=Math.floor(rnd()*(G-d)); if(ok(i0,j0)&&!out.some(([a,b])=>Math.abs(a-i0)<w+2&&Math.abs(b-j0)<d+2)) out.push([i0,j0]); } return out; }; return 1; })()`);
export const freeSpots = (p, w, d, n, seed = 7) => ev(p, `JSON.stringify(__free(${w},${d},${n},${seed}))`).then(JSON.parse);
export const lookAt = (p, i, j, radius = 40, phi = 1.0, theta) => ev(p, `(cam.target.set(${i}-24, 1, ${j}-24), cam.radius=${radius}, cam.phi=${phi}, ${theta == null ? '0' : 'cam.theta=' + theta}, 0)`);
export const animalAt = (p, id, i0, j0, level = 0, beh = 'walk') => ev(p, `(()=>{ const sz=ANIMAL_SIZE['an_${id}']; ANIMAL_CHARS['an_${id}'].beh='${beh}'; const b=makeBrick({shape:'personaggio',w:sz[0],d:sz[1],color:'@an_${id}',rot:0,i0:${i0},j0:${j0},level:${level}}); attach(b,false); return 1; })()`);
export const LAYOUT_FULL = [['castello', 11, 11], ['pagoda', 37, 11], ['palazzo', 11, 37], ['torre', 37, 37], ['razzo', 24, 24], ['ponte', 24, 8], ['auto', 24, 41], ['elicottero', 24, 4], ['albero', 6, 24], ['giardino', 41, 24], ['casa', 24, 32], ['faro', 19, 18]];
export const LAYOUT_ROAD = [['castello', 9, 9], ['pagoda', 39, 9], ['palazzo', 9, 39], ['torre', 39, 39], ['albero', 4, 24], ['giardino', 44, 24], ['faro', 24, 4]];
