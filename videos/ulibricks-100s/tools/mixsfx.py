# Mixa i suoni veri del gioco (catturati dal suo motore audio) nei punti giusti del video.
# Uso: python3 tools/mixsfx.py   ->  assets/gamesfx.mp3
import json, subprocess, os, numpy as np
D = os.path.join(os.path.dirname(__file__), '..', 'assets')
SR = 44100
segs = json.load(open(f'{D}/segs.json')); TOTAL = segs['TOTAL']
S = {s['id']: s for s in segs['SEGS']}
buf = np.zeros((int(TOTAL * SR) + SR * 4, 2), dtype=np.float32)
cache = {}
def load(name):
    if name not in cache:
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{D}/gamesfx/{name}.mp3', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
        cache[name] = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)
    return cache[name]
def put(t, name, g=1.0, maxlen=None, fade=0.12):
    if t < 0 or t > TOTAL: return
    a = load(name) if isinstance(name, str) else name
    if maxlen: 
        a = a[: int(maxlen * SR)].copy(); f = int(min(fade, maxlen) * SR); a[-f:] *= np.linspace(1, 0, f)[:, None]
    i = int(t * SR); n = min(len(a), len(buf) - i); buf[i:i + n] += a[:n] * g
def vt(seg, src_t):  # tempo sorgente -> tempo nel video (None se fuori dalla ripresa)
    s = S[seg]; t = s['at'] + (src_t - s['from']) / s['rate']
    return t if s['at'] - 0.05 <= t <= s['at'] + s['dur'] else None
def at(seg, src_t, name, g=1.0, **kw):
    t = vt(seg, src_t)
    if t is not None: put(t, name, g, **kw)

# ── costruzione: clack di ogni pezzo posato (kit) e fanfara a kit completato
fr = 0; t0 = 1.6
for i in range(79):
    at('kit', t0 + fr / 30, 'clack', 0.55); fr += 3 if i < 20 else 2
at('kit', t0 + fr / 30 + 0.1, 'fanfare', 0.7)
# vassoio pezzi: ogni pezzo atterra
for i in range(6): at('tray', 0.9 + i + 0.28, 'clack', 0.7)
# citta' che si costruisce: ticchettio di mattoncini
for k in range(0, 60): at('city', 0.6 + k * 0.1, 'clack', 0.30 + 0.25 * ((k * 7) % 5) / 5)
# basi: cambio ambiente
for i in range(6): at('bases', 2.5 + i * 0.8, 'pop', 0.7)
# creatore personaggi: ogni scelta fa pop
seq = [.3,.5,.5,.3,.5,.5,.4,.3,.5,.6,.3,.55,.3,.55,.3,.7,.3,.5,.5,.5,.6,.6]; tt = 1.0
for d in seq: at('creator', tt, 'pop', 0.55); tt += d
# vita: chiacchiere dei personaggi
for k, t in enumerate([1.5, 2.6, 3.4, 4.5, 5.6]): at('vita', t + 0.5, 'voice', 0.35)
# animali veri nello zoo (tempi dalla ripresa)
m = {k: t for k, t in json.load(open(f'{D}/zoo.marks.json'))['marks'] if ':' in k}
mk = lambda key: m.get(key)
g = mk('Guinzaglio:drago'); at('zoo', g + 0.4, 'an_drago', 0.9) if g else None
g = mk('Guinzaglio:grifo'); at('zoo', g + 0.4, 'an_grifo', 0.9) if g else None
g = mk('Cavalca:chimera'); at('zoo', g + 1.6, 'an_chimera', 0.9) if g else None
g = mk('Mangiare:trex'); 
if g: at('zoo', g + 0.2, 'an_trex', 0.9); at('zoo', g + 1.6, 'crunch', 0.9); at('zoo', g + 2.1, 'crunch', 0.8)
g = mk('Coccole:polpo'); at('zoo', g + 1.0, 'an_polpo', 0.9) if g else None
g = mk('Verso:cavalluccio'); at('zoo', g + 0.05, 'an_cavalluccio', 1.0) if g else None
# veicoli: motore del gioco (dal profilo di guida registrato)
for seg in ('car', 'truck'):
    y = np.load(f'{D}/engine_{seg}.npy'); st = json.load(open(f'{D}/engine_{seg}.json'))['src_start']
    s = S[seg]; t_start = s['at'] + (st - s['from']) / s['rate']
    a = np.stack([y, y], 1) * 1.0
    # taglia alla finestra del segmento
    lo = max(0, int((s['at'] - t_start) * SR)); hi = int((s['at'] + s['dur'] - t_start) * SR)
    a = a[lo:hi].copy(); n = int(0.25 * SR); a[:n] *= np.linspace(0, 1, n)[:, None]; a[-n:] *= np.linspace(1, 0, n)[:, None]
    put(max(t_start, s["at"]), a, 0.22)
    # clacson (dal gioco): una volta per veicolo
# dinamite: miccia, beep 3-2-1, botto (il botto e' a 6,87 s nella ripresa)
ign = 6.87 - 3.0
at('dyn', ign, 'fuse', 0.8, maxlen=3.0)
at('dyn', ign, 'beep3', 0.8); at('dyn', ign + 1.0, 'beep3', 0.8); at('dyn', ign + 2.0, 'beep1', 0.9)
at('dyn', 6.87, 'boom_big', 1.0)
# terremoto
at('quake', 1.1, 'rumble', 0.9, maxlen=2.4)
# tetris: blocchi che cadono
for k in range(4): at('tetris', 5.0 + k * 0.8, 'thud', 0.5)

# fade finale e normalizzazione dolce
peak = np.abs(buf).max(); print('picco', round(float(peak), 2))
if peak > 0.98: buf *= 0.98 / peak
out = f'{D}/gamesfx.wav'
import wave
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(buf[: int(TOTAL * SR)], -1, 1) * 32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', out, '-c:a', 'libmp3lame', '-b:a', '192k', f'{D}/gamesfx.mp3'], check=True); os.remove(out)
print('ok gamesfx.mp3')
