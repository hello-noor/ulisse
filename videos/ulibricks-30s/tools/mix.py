# Mixa la colonna sonora dello spot: musica del gioco + effetti sonori veri del gioco + colpi di montaggio.
# Uso: python3 tools/mix.py  → assets/mix.mp3
import json, subprocess, numpy as np, os

ROOT = os.path.join(os.path.dirname(__file__), "..")
A = lambda p: os.path.join(ROOT, "assets", p)
SR, TOTAL = 48000, 30.0
tl = json.load(open(A("timeline.json")))
BOOM = tl["BOOM"]

def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()

out = np.zeros((int(SR * TOTAL), 2), np.float32)
def put(sig, t, vol=1.0):
    i = int(t * SR); j = min(len(out), i + len(sig))
    if j > i: out[i:j] += sig[: j - i] * vol

def fade(sig, fin=0.0, fout=0.0):
    n = len(sig); s = sig.copy()
    if fin: k = min(n, int(fin * SR)); s[:k] *= np.linspace(0, 1, k)[:, None]
    if fout: k = min(n, int(fout * SR)); s[n - k:] *= np.linspace(1, 0, k)[:, None]
    return s

music = load(A("music.mp3"))
seg = lambda a, b: music[int(a * SR): int(b * SR)]
# musica: parte subito, si interrompe di colpo sul logo, torna per il finale
put(fade(seg(0.4, 0.4 + 23.0), 0.02, 0.08), 0.0, 0.8)
put(fade(seg(60.0, 60.0 + 5.6), 1.2, 1.8), 24.4, 0.7)

S = lambda n: load(A(f"sfx/{n}.mp3"))
GS = lambda n: load(A(f"gamesfx/{n}.mp3"))
# apertura: lettere che arrivano, poi lo zoom dentro la parola
put(S("sfx_003"), 0.02, 0.8)
put(S("sfx_001"), 0.3, 0.4)
put(S("sfx_002"), 1.55, 0.55); put(S("sfx_001"), 1.8, 0.5)
# transizioni
for k in range(10): put(GS("clack" if k % 2 else "pop"), 5.12 + k * 0.045, 0.35)  # muro di mattoncini
put(S("sfx_002"), 8.6, 0.55); put(S("sfx_001"), 8.8, 0.5)                          # zoom-blur
put(GS("zap"), 10.22, 0.7)                                                          # glitch
put(GS("whoosh"), 12.4, 0.8)                                                        # whip pan
put(S("sfx_002"), 15.3, 0.6); put(S("sfx_005"), 15.6, 0.5)                          # fette
put(S("sfx_002"), 19.5, 0.55); put(S("sfx_001"), 19.7, 0.5)                         # zoom-blur
for w in tl["WORDS"]: put(S("sfx_005"), (w.get("at") or w["t"]) + 0.05, 0.3)       # parole
# Costruisci: incastri
for k, t in enumerate(np.arange(2.2, 5.5, 0.32)):
    put(GS("clack" if k % 2 == 0 else "pop"), t, 0.32)
# Crea: scelte che cambiano
for t in (6.0, 6.6, 7.2, 7.8, 8.3):
    put(GS("pop"), t, 0.4)
put(GS("an_drago"), 9.0, 0.95)
put(GS("an_chimera"), 10.5, 0.95)
put(GS("fuse"), 15.75, 0.7)
put(GS("boom_big"), BOOM, 1.0)
put(S("sfx_004"), BOOM, 0.35)
put(GS("tet_rain"), 18.05, 0.7)
put(GS("tet_boom"), 18.0 + (8.23 - 7.0), 1.0)
put(GS("rn_go"), 19.75, 0.6)
put(GS("rn_coin"), 20.35, 0.6); put(GS("rn_coin"), 20.75, 0.6); put(GS("rn_jump"), 21.15, 0.6)
for k in range(7):
    put(S("sfx_001" if k % 2 == 0 else "sfx_005"), 21.6 + k * 0.2, 0.5)
put(S("sfx_004"), 23.0, 0.95)
put(S("sfx_003"), 26.35, 0.55)
put(GS("pop"), 27.4, 0.45)

tmp = A("mix.wav")
pcm = np.clip(out, -1, 1)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", tmp], input=pcm.tobytes(), check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1.0:LRA=11", "-ar", "48000", "-b:a", "192k", A("mix.mp3")], check=True)
os.remove(tmp)
print("mix.mp3 scritto")
