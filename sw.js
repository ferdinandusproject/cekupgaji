/* =====================================================================
   Service Worker CEKUP-GAJI (PWA) — skill gas-pwa-github
   • Cangkang aplikasi (HTML/CSS/JS/ikon) di-cache → buka instan & tetap tampil saat sinyal lemah.
   • Permintaan ke Google Apps Script (script.google.com / googleusercontent.com) TIDAK PERNAH di-cache:
     data gaji selalu langsung dari server.
   • js/config.js: jaringan dulu (agar perubahan GAS_URL langsung berlaku), cadangan cache.
   • Font & pustaka CDN berversi: cache dulu (tidak berubah).
   Nama cache otomatis berganti setiap build → versi lama dibersihkan.
   ===================================================================== */
const CACHE_NAME = 'cekup-gaji-v3.2.0-7aad5d58e8';
const RUNTIME = 'cekup-gaji-runtime-v1';
const STATIC_ASSETS = ['./', './index.html', './css/style.css', './js/app.js', './js/config.js', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(STATIC_ASSETS.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => (k !== CACHE_NAME && k !== RUNTIME ? caches.delete(k) : null)))).then(() => self.clients.claim()));
});

const tanpaQuery = (req) => { const u = new URL(req.url); u.search = ''; return u.toString(); };

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;                       // POST API → selalu jaringan
  const url = new URL(req.url);
  // 1) Google Apps Script & Google APIs data: JANGAN di-cache
  if (/(^|\.)script\.google(usercontent)?\.com$/.test(url.hostname) || url.hostname.endsWith('googleapis.com') && url.pathname.indexOf('/css') < 0) return;
  // 2) Font Google & CDN berversi: cache dulu
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' || url.hostname === 'cdnjs.cloudflare.com') {
    event.respondWith(caches.open(RUNTIME).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => { if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; }))));
    return;
  }
  if (url.origin !== self.location.origin) return;
  // 3) config.js: jaringan dulu
  if (url.pathname.endsWith('/js/config.js')) {
    event.respondWith(fetch(req).then((res) => { const cp = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(tanpaQuery(req), cp)); return res; }).catch(() => caches.match(tanpaQuery(req))));
    return;
  }
  // 4) Navigasi: cangkang dari cache (instan), diperbarui di latar
  if (req.mode === 'navigate') {
    event.respondWith(caches.match('./index.html').then((hit) => {
      const net = fetch(req).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(CACHE_NAME).then((c) => c.put('./index.html', cp)); } return res; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  // 5) Aset statis: cache dulu (abaikan ?v=), cadangan jaringan
  event.respondWith(caches.match(tanpaQuery(req)).then((hit) => hit || fetch(req).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(tanpaQuery(req), cp)); } return res; })));
});
