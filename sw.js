// sw.js — cache básico do PWA
const CACHE = 'iml-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './pin-web-shim.js',
  './manifest.webmanifest'
  // adicione './icons/icon-192.png', './icons/icon-512.png' se tiver
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
