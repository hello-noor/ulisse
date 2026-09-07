# Le app di Ulisse

Ulisse ha 6 anni e scrive app con l'aiuto di papà.
Questa è la sua casa: una pagina da cui si scelgono tutte le app.

👉 **[Apri le app di Ulisse](https://USERNAME.github.io/ulisse/)**

## Le app

| App | Cosa fa | Cartella |
| --- | --- | --- |
| **Nomi Cose Città** | Segnapunti per giocare a voce, in auto o in viaggio. | [`nomi-cose-citta/`](nomi-cose-citta/) |
| **Linea del 20** | Linea del 20, linea del 100 e casa del 1000 (metodo analogico). | [`linea-del-20/`](linea-del-20/) |

Tutte le app:

- funzionano **anche senza rete** (ognuna ha il suo service worker, e la pagina
  iniziale ha il suo: [`sw.js`](sw.js));
- si possono **installare sul telefono** (su iPhone: *Condividi → Aggiungi a Home*);
- hanno in alto il tasto **← Le app di Ulisse** per tornare all'elenco;
- sono fatte di un solo file `index.html`, senza librerie da installare.

### Perché lo `scope` dei manifest è `"../"`

Nel manifest di ogni app lo `scope` è la cartella superiore, cioè tutto il sito.
Serve per il tasto "torna all'elenco": se lo `scope` fosse solo la cartella dell'app,
toccandolo dentro l'app installata la home si aprirebbe nel browser, fuori dall'app.
Con lo `scope` allargato la navigazione resta dentro la finestra dell'app.

Ogni app ha un `id` fisso (`/nomi-cose-citta/`, `/linea-del-20/`) così il telefono
continua a distinguerle anche se ora condividono lo `scope`.

⚠️ Chi aveva già installato un'app **deve toglierla e reinstallarla**: lo `scope`
viene letto quando l'app si installa, non si aggiorna da solo.

## Aggiungere una nuova app

1. Copia la cartella della nuova app qui dentro, con un nome semplice e minuscolo
   (per esempio `memory-degli-animali/`), con dentro il suo `index.html`.
2. Apri [`index.html`](index.html) (quello nella cartella principale) e aggiungi una riga
   nell'elenco `APPS`, in fondo al file:

   ```js
   {
     nome: "Memory degli animali",
     testo: "Due carte uguali si tolgono. Facile a dirsi.",
     cartella: "memory-degli-animali/",
     icona: "memory-degli-animali/icon-192.png",
     colore: "#2D96A3"
   }
   ```

3. Salva e carica su GitHub:

   ```bash
   git add -A && git commit -m "Aggiunta app: Memory degli animali" && git push
   ```

Dopo un minuto la nuova app compare da sola nella pagina principale.

## Se una modifica non si vede

Le app si salvano in memoria per funzionare senza rete. Quando cambi qualcosa,
apri il file `sw.js` dell'app e cambia il numero di versione della cache
(per esempio da `ncc-v1` a `ncc-v2`): al prossimo avvio l'app si aggiorna da sola.

---

Fatto in famiglia. 🚢
