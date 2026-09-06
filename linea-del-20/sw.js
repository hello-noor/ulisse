/* Service worker degli strumenti del metodo analogico.
   Il guscio dell'app non cambia durante l'uso: si serve dalla cache,
   cosi' la linea del 20 si apre anche in aereo, in treno o senza rete.
   Per pubblicare una versione nuova basta cambiare CACHE (v2, v3...). */

const CACHE = 'bortolato-v2';
/* Tutte le app di Ulisse stanno sullo stesso sito: qui ripuliamo solo
   le cache di questa app, altrimenti cancelleremmo quelle delle altre. */
const CACHE_PREFIX = 'bortolato-';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
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

/* La pagina puo' chiedere di passare subito alla versione nuova. */
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* I caratteri di Google si usano se c'e' rete; senza rete il CSS
     ripiega sui caratteri di sistema, gia' previsti. Non blocchiamo mai l'app. */
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

  /* Il guscio dell'app: prima la cache, poi la rete come riserva.
     Se manca tutto, si torna comunque alla pagina. */
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
