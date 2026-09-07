/* Service worker della pagina iniziale — "Le app di Ulisse".
   Tiene in memoria la home e le icone dei bottoni, così l'elenco si apre
   anche senza rete: dal telefono in aereo, in treno, in montagna.

   Attenzione: questo service worker ha come raggio d'azione tutto il sito,
   ma ogni app ha il suo nella propria cartella, e quello più vicino vince.
   Qui dentro passano solo le pagine che stanno nella cartella principale.

   Per pubblicare una versione nuova basta cambiare CACHE (v2, v3...). */

const CACHE = 'home-v1';
/* Ripuliamo solo le nostre cache: quelle delle app hanno un altro prefisso. */
const CACHE_PREFIX = 'home-';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon-32.png',
  /* le facce dei bottoni: senza queste l'elenco offline sarebbe muto */
  './nomi-cose-citta/icon-192.png',
  './linea-del-20/icon-192.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* I caratteri di Google si usano se c'è rete; senza rete il CSS ripiega
     su quelli di sistema, già previsti. Non blocchiamo mai la pagina. */
  if (url.origin !== location.origin) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => hit))
    );
    return;
  }

  /* Prima la memoria, poi la rete come riserva.
     Se manca tutto, si torna comunque all'elenco delle app. */
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
