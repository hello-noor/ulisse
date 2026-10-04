# ULIBRICKS · spot 30s in piano sequenza (9:16, 1080×1920)

Stesso spot di `../ulibricks-30s`, ma senza nessun taglio: ogni ripresa del gioco è un "mattoncino" appoggiato su una grande base, e una sola camera vola dall'uno all'altro. I testi (mattoncini colorati con i bottoncini) restano attaccati al loro pannello e viaggiano con lui. Verso la fine la camera si allontana e mostra tutto il mondo, poi si tuffa nel logo e nell'invito finale.

- `ulibricks-30s-onetake.mp4` — video finale (versione web).
- `index.html` — generato da `../ulibricks-30s/tools/build-onetake.mjs`.
- `assets` — collegamento alle risorse di `../ulibricks-30s/assets` (riprese, font, logo, audio).

Rigenerare (da questa cartella):
`node ../ulibricks-30s/tools/build-onetake.mjs && python3 ../ulibricks-30s/tools/mix-onetake.py && npx hyperframes render -o ulibricks-30s-onetake.mp4`
