# ULIBRICKS · spot 30s (9:16, 1080×1920)

Spot breve in stile "keynote": nero assoluto, tipografia Inter enorme con parole sfumate, un telefono che fluttua e riprese vere del gioco.

- `ulibricks-30s.mp4` — video finale (versione web).
- `tools/build.mjs` — genera `index.html` (tempi, testi, movimenti di camera).
- `tools/mix.py` — mixa `assets/mix.mp3`: musica del gioco + effetti sonori veri del gioco.

Rigenerare: `node tools/build.mjs && python3 tools/mix.py && npx hyperframes render -o ulibricks-30s.mp4`

Le riprese in `assets/v/` sono le stesse del trailer lungo (`videos/ulibricks-100s`). Font: Inter (SIL OFL, `assets/fonts/`).
