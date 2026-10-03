# ULIBRICKS — scheda tecnica e descrizione completa

> Nota sul nome: il progetto si chiama **ULIBRICKS** (non "Uliblocks"). Logo a due righe, "ULI" e "BRICKS", con le lettere su mattoncini colorati.
> Indirizzo: https://hello-noor.github.io/ulisse/ulibricks/ · Versione descritta: build `v90` del service worker (ottobre 2026).

---

## 1. In una frase

ULIBRICKS è un gioco di costruzioni a mattoncini **in 3D, nel browser e installabile come app** (PWA): si costruisce pezzo per pezzo, si creano e si animano personaggi, si fanno esplodere le costruzioni con la dinamite, si gioca a Tetris 3D, al terremoto e a una corsa a corsie, e alla fine si condivide tutto con foto, showreel, libretto di istruzioni e QR code.

Slogan dell'app: **Costruisci · Anima · Gioca**.

## 2. Numeri chiave (dati ricavati dal codice)

| Cosa | Quantità |
|---|---|
| Tipi di pezzo nel catalogo | **78** (più il personaggio, che è un "pezzo" speciale) |
| Combinazioni forma × misura | **341** varianti di dimensione |
| Colori dei pezzi | **31** (26 pieni + 1 vetro trasparente + 4 metallici: oro, argento, rame, acciaio) |
| Varianti di pezzo teoriche (misura × colore) | circa **10.500** (341 × 31), senza contare le rotazioni |
| Base di costruzione | griglia fino a **48 × 48 bottoncini** |
| Altezza massima | **150 piastre**, cioè 50 mattoni impilati (circa **48 cm** nel mondo reale, 1 piastra = 3,2 mm) |
| Costumi per i personaggi | **24** (+ "Niente") |
| Capelli e cappelli | **19** |
| Facce | **16** |
| Oggetti da tenere in mano | **16** (+ "Niente") |
| Fantasie per maglia e pantaloni | **11** (+ "Tinta unita") |
| Orecchie animali | **9** (+ "Niente") |
| Code animali | **11** (+ "Niente") |
| Corna | **4** (+ "Niente") |
| Mani e zampe (chele, artigli…) | **4** (+ "Niente") |
| Musi (proboscide, zanne, naso da maiale…) | **4** (+ "Niente") |
| Colori della pelle | **11** |
| Colori dei capelli | **17** |
| Giochi | **4** (Dinamite, Tetris, Terremoto, Corri!) |
| Animali (pezzi con vita propria) | **10** (5 di fattoria, 5 esotici) |
| Kit guidati di costruzione | **12** (da 13 a 110 passi) |
| Oggetti animabili | **18 tipi** (17 oggetti + i personaggi) |
| Basi: ambienti | **4** (Prato, Acqua, Luna, Neve) + modalità Auto |
| Colori della base | **18** |
| Progetti salvabili | fino a **24** |
| Annulla (undo) | fino a **300** passi |
| Lingue | **Italiano e Inglese** |

### Quanti personaggi diversi si possono creare?

Moltiplicando le scelte strutturali (capelli 19 × facce 16 × oggetti 17 × fantasia maglia 12 × fantasia pantaloni 12 × costumi 25 × orecchie 10 × code 12 × corna 5 × mani/zampe 5 × musi 5) si ottengono circa **279 miliardi** di combinazioni (senza contare i 10 animali, che sono personaggi a parte). Aggiungendo i colori (11 pelli, 17 colori capelli, 28 colori per maglia, braccia e pantaloni, più due colori personalizzabili sui costumi) si supera **un miliardo di miliardi (10^18)** come limite teorico. Il numero è un massimo teorico: alcune combinazioni si sovrappongono, per esempio un costume sostituisce maglia e pantaloni.

---

## 3. L'idea di gioco e la meccanica

- Si parte da una **base verde** (una piastra 32 × 32 modificabile) e si piazzano i pezzi sui bottoncini, come con i veri mattoncini: i pezzi si **incastrano** e si possono impilare, collegare di lato (pezzi SNOT, jumper, clip) e girare.
- I pezzi sono **mattoni**, **piastre**, **forme**, **tetti e archi**, **meccanica** e **decorazioni**. Ci sono anche pezzi che si muovono (ruote, eliche, ingranaggi, pistoni, giostre, mulini, radar) e pezzi da scena come semaforo, sirena, faro e lampione.
- La costruzione è **fisica**: i pezzi hanno un'altezza in piastre, si incastrano solo dove possono e il Terremoto può far crollare le parti poco collegate.
- Non ci sono punteggi per costruire: il gioco è **creativo e libero**. I punteggi esistono solo nei mini-giochi (Tetris e Corri!).
- Il gioco **salva da solo** nel dispositivo e funziona anche senza account.

### Il catalogo dei pezzi (78 tipi in 6 categorie)

| Categoria | N. tipi | Esempi |
|---|---|---|
| **Mattoni** | 9 | Mattone, Basso, Alto, Pilastro, Liscio, Angolo, Scala, SNOT |
| **Piastre** | 9 | Piastra (31 misure), Liscia (12), Piastra a L, Jumper, Cunei, Clip |
| **Forme** | 14 | Tondo, Colonna, Tubo, Disco, Cono, Cupola, Finestra, Porta, Vetrata, Oblò, Recinto, Parabrezza |
| **Tetti e archi** | 12 | Tegole, Curva, Colmo, Spicchio, Piramide, Merli, Camino, tre tipi di Arco |
| **Meccanica** | 16 | Ruote, Braccio, Cerniera, Elica, Ingranaggio, Mulino, Radar, Giostra, Altalena, Pistone, Semaforo, Orologio, Sirena, Faro, Antenna |
| **Decorazioni** | 18 | Albero, Palma, Cespuglio, Fiore, Roccia, Fungo, Cactus, Panchina, Fontana, Tavolo, Sedia, Letto, Barile, Cannone, Insegna, Cartello, Bandiera |

Il pezzo che ha più misure è la **Piastra** (31), poi il **Mattone** (16) e la **Liscia** (12). Alcune insegne permettono di scrivere un testo.

---

## 4. L'interfaccia

L'app è pensata per il **telefono** (si usa con il dito) ma funziona anche con mouse e tastiera. Stile "da gioco": schede in basso, icone colorate, menu a tendina, suoni e vibrazione sul telefono.

### Barra in basso (6 schede)
**Basi · Costruisci · Personaggi · Animali · Kit · Mostra**, ognuna con l'icona colorata. La scheda attiva si riempie di colore.

In ogni scheda c'è una linguetta **Nascondi** sopra il pannello: abbassa il pannello per vedere meglio la costruzione, e riappare cambiando scheda.

### Barra laterale destra (7 strumenti)
| Strumento | Cosa fa |
|---|---|
| **Guarda** | Muove la camera: gira, avvicina, allontana, vista dall'alto, inquadra tutto, giro automatico |
| **Costruisci** | Piazza i pezzi scelti nel vassoio |
| **Sposta** | Seleziona un gruppo di pezzi con **Tocco**, **Lazo** o **Rettangolo**, poi sposta, duplica, colora o elimina |
| **Gomma** | Toglie i pezzi toccandoli |
| **Pennello** | Cambia colore ai pezzi toccati; tendina con colore completo e 12 colori veloci |
| **Mostra** | Tendina con **Showreel**, **Foto**, **Libretto**, **Condividi QR** |
| **Aziona** | Tendina con **Tutti / Personaggi / Oggetti / Veicoli** per far muovere ciò che si può animare |

### In alto
**Progetti** (cartella), **Annulla**, **Impostazioni** e la **dinamite**, che apre la tendina dei giochi.

### Il vassoio dei pezzi
Si sceglie la categoria, la forma, la **misura** e il **colore**. Una grande anteprima 3D mostra il pezzo, con tasti per ruotarlo. Su telefono, il pezzo in mano si posa con una barra in basso: **Presa**, **Gira** a sinistra e a destra, **Annulla** e **Posa qui**.

### Altre schermate
- **Impostazioni:** musica (due brani jazz e bossa leggeri, si alternano), effetti sonori, vita dei personaggi, tema (auto, chiaro, scuro), lingua (italiano e inglese), salva e carica progetto, base, istruzioni, installa l'app.
- **Progetti:** fino a 24 progetti con miniatura, rinominabili, duplicabili ed eliminabili.
- **Tour guidato** alla prima apertura, in 6 passi.
- **Base:** finestra con mappa, strumenti e tre schede (Ambiente, Colore, Piastra).

---

## 5. La base e gli ambienti

La base è fatta di una o più **piastre** che si possono **disegnare, spostare, allargare, togliere, ruotare, duplicare**, quadrate o tonde, fino a una griglia di **48 × 48 bottoncini**.

- **Ambienti:** Prato, Acqua, Luna, Neve, oppure **Auto** (segue la piastra più grande). Cambiano cielo, luce e il fondo del mondo.
- **Colori della base:** 18.

---

## 6. I personaggi

Ogni personaggio è un **omino a mattoncini** con braccia, gambe, mani e testa ruotanti. Il creatore ha **8 schede**: **Capelli, Faccia, Vestiti, Costume, Orecchie, Code, Zampe, Oggetto**. Un dado crea un personaggio casuale.

Quando un costume sostituisce una parte (per esempio i capelli sotto un casco), nel creatore quella caratteristica viene **evidenziata come bloccata**, con una nota che spiega perché. Con i costumi che coprono il volto (Ninja, Medico della peste, Minotauro) l'espressione è bloccata ma il **colore della pelle** resta modificabile.

### I 24 costumi
Astronauta, Principessa, Sub, Pompiere, Fata, Dottore, Ninja, Babbo Natale, Ballerina, Supereroe, Cavaliere, Strega, Cuoco, Pirata, **Sirena**, Cowboy, Regina, Mago, Poliziotto, Infermiera, **Medico della peste**, Centurione romano, **Minotauro** e **Centauro**.
Ogni costume ha **due colori personalizzabili** (colore principale e dettagli).

Due costumi sono **creature miste** e lasciano il resto del personaggio libero:
- **Minotauro:** solo la **testa è di toro** (corna, muso, orecchie). Il corpo è umano, quindi **maglia, pantaloni e fantasie si cambiano** come per qualsiasi personaggio; non ha coda.
- **Centauro:** il **busto è umano** e si personalizza in tutto (maglia, capelli, faccia, accessori), mentre dalla vita in giù è un **corpo da cavallo** con quattro zampe e coda. Il colore del cavallo è quello del pelo (scheda Orecchie → Colore); i pantaloni non si vedono.

### Aspetto
- **Capelli (19):** Calvo, Corti, Lunghi, Coda, Ricci, Treccia, Mohicano, Afro, Berretto, Lana, Elmetto, Cowboy, Cilindro, Cuoco, Pirata, Corona, Mago, **Criniera da leone**, **Cappello cinese**.
- **Facce (16):** Sorriso, Felice, Occhiolino, Linguaccia, Sorpreso, Arrabbiato, Triste, Cuori, Occhiali, Sole, Barba, Baffi, Lentiggini, Dorme, Benda, Robot.
- **Fantasie (11):** Righe, Zebra, Leopardo, Tigre, Giraffa, Mucca, Macchie, Stella, Cuore, Fulmine, Bottoni. Si applicano a maglia, pantaloni o entrambi.

### Tratti da animale e da creatura
- **Orecchie (9):** Gatto, Cane, Orso, Topo, Volpe, Coniglio, Unicorno (con il corno), Diavoletto, **Elefante**.
- **Code (11):** Gatto, Cane, Volpe, Coniglio, Leone, Topo, Drago, Diavoletto, Cavallo, Scoiattolo, Maiale.
- **Corna (4):** Diavolo, Toro, Cervo, Ariete.
- **Mani e zampe (4):** Chele di granchio, Scorpione, Zampa, Artigli.
- **Muso (4):** **Proboscide**, **Zanne** (lunghe e curve), **Elefante** (proboscide e zanne insieme), **Naso da maiale**.
- Questi tratti si **combinano liberamente**: per esempio Babbo Natale con le chele, un supereroe con orecchie e coda da gatto, un elefante intero.

### Oggetti da tenere in mano (16)
Spada, **Spada laser** (6 colori), Bacchetta, Scudo, Torcia, Martello, Fiore, Palloncino, Gelato, Libro, Ombrello, Bandierina, Pallone, Mela, **Tridente**, **Fulmine**.

### La "vita" dei personaggi
Attivando **Vita**, ogni personaggio ha un **comportamento** a scelta: **Cammina** (gira e ogni tanto si siede), **Seduto** (cerca un posto e resta lì), **Fermo** oppure **Amico** (va dagli altri, chiacchiera e fa amicizia). Parlano con fumetti e voce, salutano, si siedono sui blocchi e si spaventano durante il terremoto.

Nella barra laterale della scheda Personaggi (**Aggiungi, Vai qui, Interagisci, Amicizia, Sposta, Cancella**) c'è anche il pulsante **Vita**, con badge **ON/OFF** e fondo verde quando è attiva. Con **Vai qui** si manda un personaggio a un punto o su un oggetto: su un veicolo con le ruote si sceglie **Sali a bordo** e il personaggio si siede **sopra il mezzo**, anche se è alto (ci salta sopra). Personaggi e animali si possono posare anche sulle **superfici lisce**, e i pezzi decorativi e meccanici senza bottoncini (giostra, altalena, semaforo, orologio, faro, sirena) si possono mettere sui mattoni lisci e piani.

---

## 6b. Gli animali

La scheda **Animali** (accanto a Personaggi) aggiunge **10 animali procedurali**, costruiti a mattoncini e animati come i personaggi: camminano, scodinzolano, parlano con fumetti e **fanno il loro verso** (suoni sintetizzati nel browser).

| Gruppo | Animali |
|---|---|
| **Fattoria (5)** | Cane da guardia, Gatto, Mucca, Maiale, Pecora |
| **Esotici (5)** | Drago, Aragosta gigante, Polpo, Leone, Elefante |

**Interagire con un animale:** si sceglie un personaggio, si usa lo strumento **Interagisci** e si tocca l'animale. Compare un menu con le azioni:
- 🔊 **Verso** · il personaggio fa parlare l'animale;
- 🍎 **Mangiare** · il personaggio tira fuori un cibo adatto (osso al cane, pesce a gatto, aragosta e polpo, fieno alla mucca, mela al maiale, carota alla pecora, carne a drago e leone, banana all'elefante), lo porge alla bocca dell'animale, che dà due morsi e mastica;
- ❤️ **Coccole** · carezze con cuoricini;
- 🦮 **Guinzaglio** · l'animale segue il personaggio tenuto al guinzaglio (tasto **Libera** per lasciarlo);
- 🐴 **Cavalca** · il personaggio sale in sella e l'animale lo porta in giro (solo mucca, drago, leone, elefante; **Scendi** per scendere).

---

## 7. Gli oggetti animati e i veicoli

Con lo strumento **Aziona** si animano **18 tipi** di elementi: personaggi, ruote, braccio, cerniera, eliche (aereo e normale), mulino, radar, giostra, altalena, pistone, ingranaggio, semaforo, orologio, sirena, faro, lampione e bandiera.

**Veicoli:** una costruzione con le **ruote** si può **guidare** (fino a 300 pezzi): croce direzionale sullo schermo, clacson, parcheggio, velocità in km/h e anche **guida inclinando il telefono**.

---

## 8. I giochi (menu della dinamite)

1. **Dinamite.** Si piazzano fino a **5 candelotti** sulla costruzione, in tre raggi di esplosione: **Piccola** (pochi pezzi vicini), **Media** (una zona intera), **Maxi** (tutta la costruzione). Si accende la miccia toccandoli e la costruzione esplode in pezzi.
2. **Tetris** (nome interno "Pioggia di mattoncini"). Tetris in 3D: si fanno cadere pezzi, si formano blocchi uniti e li si fa **esplodere** quando raggiungono una certa dimensione. Si trascina per spostare, si tocca per girare, si preme giù per far cadere. Ci sono più modalità e livelli.
3. **Terremoto.** Scuote la costruzione: i pezzi collegati poco rischiano di cadere e i personaggi si spaventano. Si vede quanto resiste.
4. **Corri!** Corsa in 3D a **3 corsie** con il proprio personaggio: si scorre per cambiare corsia o saltare, si evitano gli ostacoli e si raccolgono le monete. Gli **ostacoli sono i blocchi della tua costruzione** (circa il 70% del percorso). Ogni costume dà un **bonus**:
   - 🛡️ **Scudo** (sopravvivi a un urto): Cavaliere, Centurione, Pompiere, Poliziotto.
   - 🚀 **Salto alto:** Astronauta, Supereroe, Ballerina, Fata.
   - 🥷 **Doppio salto:** Ninja, Strega, Mago, Sirena.
   - 🧲 **Calamita per le monete:** Pirata, Regina, Principessa, Babbo Natale.
   - 🪙 **Monete ×2:** Cuoco, Dottore, Infermiera, Medico della peste, Cowboy, Sub.
   Il record si salva nel dispositivo.

---

## 9. Costruire guidati: i Kit

**12 kit** passo per passo, ognuno con la sua difficoltà. Si piazzano i pezzi uno dopo l'altro seguendo le istruzioni.

| Kit | Difficoltà | Passi |
|---|---|---|
| Albero | Facilissimo | 17 |
| Giardino | Facilissimo | 17 |
| Ponte sul fiume | Facile | 21 |
| Razzo | Facile | 21 |
| Automobile | Facile | 19 |
| Faro | Medio | 13 |
| Casetta | Medio | 32 |
| Elicottero | Medio | 20 |
| Torre del castello | Medio | 34 |
| Palazzo | Difficile | 70 |
| Castello | Difficile | 79 |
| **Pagoda cinese** (5 piani rossi e oro, ciliegi in fiore) | Difficile | **110** |

---

## 10. Mostrare e condividere

Tutto è raccolto nel menu **Mostra** (e nella scheda omonima):

- **Showreel:** un video automatico della costruzione, con scene (Titolo, Sezione, Montaggio, **Vista esplosa**, Misure, **Colori e pezzi**, una scena per ogni personaggio, **Riepilogo** con numeri animati), musica, transizioni ed effetti. Si può impostare il titolo.
- **Foto:** scatto in **tre formati** (verticale 9:16, orizzontale 16:9, quadrato 1:1) con interruttori per le statistiche, la data e l'inquadratura di tutta la costruzione, e un titolo personalizzabile. Su telefono si salva nella **Galleria**.
- **Libretto:** un **PDF con le istruzioni di montaggio** passo per passo, generato dalla costruzione.
- **Condividi QR:** crea un **link e un QR code** che contengono la costruzione. Chi lo apre può guardarla e salvarla. Il riquadro ha il nome della costruzione, il QR e il tasto "Salva in Galleria".
- **Statistiche** mostrate nelle foto e nel riepilogo: pezzi, bottoncini, colori, altezza in cm, personaggi, tipo di pezzo più usato.

---

## 11. Aspetti tecnici (utili per un articolo)

- **App web a file unico** (HTML, CSS e JavaScript) con grafica **3D in tempo reale** tramite **three.js**.
- Installabile come **PWA** (service worker, manifest, icone). Non richiede registrazione: tutto è salvato **nel dispositivo** con salvataggio automatico.
- **PDF** generati nel browser (jsPDF), **QR code** generati nel browser. La condivisione non passa da un server.
- Personaggi e oggetti sono **procedurali**: vengono costruiti da forme geometriche, non da modelli scaricati.
- Audio generato dal browser: due brani musicali (jazz e bossa), effetti e voci dei personaggi.
- Tema automatico, chiaro o scuro; interfaccia in italiano e inglese; anteprima social (Open Graph) per WhatsApp e altri.

---

## 12. Frasi pronte per l'articolo

- "78 tipi di pezzo, 341 misure, 31 colori: circa 10.500 pezzi diversi da usare."
- "24 costumi, 19 pettinature, 16 facce, e orecchie, code, corna, chele e proboscidi da mescolare: i personaggi possibili sono più di un miliardo di miliardi, in teoria. E puoi essere un minotauro o un centauro."
- "Dieci animali a mattoncini, dal cane da guardia al drago: li accarezzi, li sfami, li porti al guinzaglio e ci cavalchi."
- "Non c'è un account, non c'è un server: la costruzione vive nel telefono e si condivide con un QR."
- "Il personaggio che crei diventa il protagonista di una corsa, e i blocchi che hai costruito diventano gli ostacoli."
- "Il gioco costruisce da solo il filmato e il libretto delle istruzioni della tua opera."
