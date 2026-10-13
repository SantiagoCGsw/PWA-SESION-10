const CACHE = 'taller-pwa-v2';
const ARCHIVOS = [
  '/',
  '/acerca',
  '/offline.html',
  '/css/estilos.min.css',
  '/js/swregist.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// 1. install: guarda los archivos estáticos en la caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

// 2. activate: borra las versiones viejas de la caché
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(nombres => Promise.all(
      nombres.filter(n => n !== CACHE).map(n => caches.delete(n))
    ))
  );
  self.clients.claim();
});

// 3. fetch: primero la caché, luego la red, y si no hay red, offline.html
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(guardada =>
      guardada || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') return caches.match('/offline.html');
      })
    )
  );
});