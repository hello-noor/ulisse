import { open, ev } from './harness.mjs';
import fs from 'node:fs';
const T = +(process.argv[2] || 100), SR = 44100;
const { b, p } = await open({ dpr: 1, init: `window.AudioContext = class extends OfflineAudioContext { constructor(){ super(2, ${SR}*${T}, ${SR}); } };` });
const info = await ev(p, `(()=>{
  ensureAudio();
  if(!ac) return 'noac';
  MUS.mode='game'; muted=false;
  MUS.gain=ac.createGain(); MUS.gain.gain.value=0; MUS.gain.connect(master);
  MUS.gain.gain.linearRampToValueAtTime(.2, 1.5);
  MUS.gain.gain.setValueAtTime(.2, ${T}-2.5); MUS.gain.gain.linearRampToValueAtTime(0, ${T}-0.2);
  MUS.playing=true; MUS.next=.12; MUS.step=0;
  while(MUS.next<${T}){ const s=MUS.step, tb=Math.floor(s/128)%2===1, e=60/(tb?104:92)/2, sw=(s%2)?e*(tb?.12:.18):0;
    if(tb) musPlayB(s,MUS.next+sw,e); else musPlay(s,MUS.next+sw,e,false); MUS.next+=e; MUS.step++; }
  return 'steps '+MUS.step;
})()`);
console.log(info);
const b64 = await p.evaluate(async () => {
  const buf = await window.__ev('ac').startRendering();
  const L = buf.getChannelData(0), R = buf.getChannelData(1), n = L.length;
  const out = new Int16Array(n * 2);
  for (let i = 0; i < n; i++) { out[2*i] = Math.max(-1, Math.min(1, L[i])) * 32767; out[2*i+1] = Math.max(-1, Math.min(1, R[i])) * 32767; }
  const u8 = new Uint8Array(out.buffer); let s = ''; const CH = 0x8000;
  for (let i = 0; i < u8.length; i += CH) s += String.fromCharCode.apply(null, u8.subarray(i, i + CH));
  return btoa(s);
});
fs.writeFileSync('assets/gamemusic.raw', Buffer.from(b64, 'base64'));
console.log('raw bytes', fs.statSync('assets/gamemusic.raw').size);
await b.close();
