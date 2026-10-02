const CACHE='ulibricks-v63';
const FRESH=['./','./index.html','./manifest.webmanifest','./icons/icon-192-v2.png','./icons/icon-512-v2.png','./icons/maskable-512-v2.png','./icons/apple-touch-icon-v2.png','./icons/favicon-32-v2.png'];
const HEAVY=['./three.min.js','./jspdf.umd.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FRESH.concat(HEAVY).map(u=>c.add(u).catch(()=>null)))));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
function isFresh(u){const p=new URL(u,self.location.href);return p.origin===self.location.origin&&(/\/$/.test(p.pathname)||/\.(html|webmanifest|png|svg)$/i.test(p.pathname));}
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  if(isFresh(r.url)||r.mode==='navigate'){
    e.respondWith(fetch(r.url,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}return res;})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(h=>h||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{
    if(res.ok&&(r.url.startsWith(self.location.origin)||r.url.includes('fonts.g'))){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}
    return res;}).catch(()=>undefined)));
});
