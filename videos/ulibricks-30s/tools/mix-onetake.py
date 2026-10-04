# Colonna sonora del piano sequenza: musica del gioco + effetti veri del gioco + un "volo" per ogni spostamento di camera.
# Uso: python3 tools/mix-onetake.py  → assets/mix-onetake.mp3
import json, subprocess, numpy as np, os

ROOT = os.path.join(os.path.dirname(__file__), "..")
A = lambda p: os.path.join(ROOT, "assets", p)
SR, TOTAL = 48000, 30.0
tl = json.load(open(A("timeline-onetake.json")))
BOOM, TBOOM, WALL = tl["BOOM"], tl["TBOOM"], tl["WALL"]
P = [p for p in tl["P"] if p.get("t") is not None]

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

music = load(A("music.mp3")); seg = lambda a, b: music[int(a * SR): int(b * SR)]
# musica continua come la camera: si abbassa sul "tutto il mondo" e riparte nel finale
put(fade(seg(0.4, 0.4 + 22.0), 0.02, 0.6), 0.0, 0.8)
put(fade(seg(60.0, 60.0 + 7.0), 0.4, 1.8), 23.0, 0.75)

S = lambda n: load(A(f"sfx/{n}.mp3")); GS = lambda n: load(A(f"gamesfx/{n}.mp3"))
for k in range(9): put(GS("clack" if k % 2 else "pop"), 0.3 + k * 0.055, 0.45)     # mattoncini del logo
put(S("sfx_003"), 0.75, 0.75); put(S("sfx_001"), 0.85, 0.45); put(S("sfx_005"), 1.05, 0.45)
for p in P[1:]:
    if p["id"] == "final": continue
    put(GS("whoosh"), p["t"] - 0.4, 0.55)                                              # volo tra due mattoncini
    put(S("sfx_005"), (p.get("wAt") or p["t"] + 0.12) + 0.03, 0.3)                    # parola che si incastra
for k, t in enumerate(np.arange(2.8, 5.5, 0.32)): put(GS("clack" if k % 2 == 0 else "pop"), t, 0.3)
for t in (6.0, 6.6, 7.2, 7.8, 8.3): put(GS("pop"), t, 0.4)
put(GS("an_drago"), 9.0, 0.95); put(GS("an_chimera"), 10.5, 0.95)
put(GS("fuse"), 15.75, 0.7); put(GS("boom_big"), BOOM, 1.0); put(S("sfx_004"), BOOM, 0.35)
put(GS("tet_rain"), 18.05, 0.7); put(GS("tet_boom"), TBOOM, 1.0)
put(GS("rn_go"), 19.75, 0.6); put(GS("rn_coin"), 20.35, 0.6); put(GS("rn_coin"), 20.75, 0.6); put(GS("rn_jump"), 21.15, 0.6)
put(S("sfx_002"), WALL[0], 0.6); put(GS("whoosh"), WALL[0] + 0.05, 0.6)                # la camera si allontana
put(S("sfx_002"), WALL[1] - 1.0, 0.6); put(S("sfx_004"), WALL[1] - 0.2, 0.9)           # tuffo nel finale
put(GS("clack"), 25.4 + 0.45, 0.5); put(S("sfx_003"), 25.4, 0.5); put(GS("pop"), 26.8, 0.45)

tmp = A("mix-onetake.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", tmp], input=np.clip(out, -1, 1).tobytes(), check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1.0:LRA=11", "-ar", "48000", "-b:a", "192k", A("mix-onetake.mp3")], check=True)
os.remove(tmp); print("mix-onetake.mp3 scritto")
