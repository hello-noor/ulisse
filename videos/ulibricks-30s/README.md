# ULIBRICKS · spot 30s (9:16, 1080×1920)

Spot breve ad alta dinamica: riprese vere del gioco a tutto schermo, testi su "mattoncini" colorati con i bottoncini sopra (Unbounded per le parole, JetBrains Mono per le frasi) che si incastrano con entrate diverse, sfondo animato con i colori del logo e transizioni a effetto (zoom dentro le lettere di IMMAGINA, muro di mattoncini, zoom-blur, glitch, whip pan, fette, flash con scossa, raffica finale).

- `ulibricks-30s.mp4` — video finale (versione web).
- `tools/build.mjs` — genera `index.html` (tempi, testi, movimenti di camera).
- `tools/mix.py` — mixa `assets/mix.mp3`: musica del gioco + effetti sonori veri del gioco.

Rigenerare: `node tools/build.mjs && python3 tools/mix.py && npx hyperframes render -o ulibricks-30s.mp4`

Le riprese in `assets/v/` sono le stesse del trailer lungo (`videos/ulibricks-100s`). Font: Unbounded, JetBrains Mono e Inter (SIL OFL, `assets/fonts/`).
