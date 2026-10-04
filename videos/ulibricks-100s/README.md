# ULIBRICKS in 100 secondi

Video promo 9:16 (1080×1920): riprese del gioco vero, registrate dal suo motore 3D, dentro un telefono, con tipografia d'impatto.
Musica di sottofondo e suoni (dinamite, terremoto, versi degli animali, motore, clack) catturati dal motore audio dell'app.

- `ulibricks-100s-web.mp4`: video finito.
- `tools/build.mjs`: genera `index.html` (montaggio, testi, adesivi, finale browser/smartphone con QR).
- `tools/mixsfx.py`: mixa i suoni veri del gioco nei punti giusti.
- `tools/capture/`: script per registrare il gioco (Playwright) e catturare musica ed effetti.
- Render: `npx hyperframes render -o ulibricks-100s.mp4` da questa cartella (serve `hyperframes.json`, copiabile da `../ulibricks-gioco-60s`).
