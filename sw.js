const CACHE = 'dna-v1';
const ASSETS = [
  '/dna-terra-fertil/',
  '/dna-terra-fertil/index.html',
  '/dna-terra-fertil/admin.html',
  '/dna-terra-fertil/mapa.html',
  '/dna-terra-fertil/icon-192.png',
  '/dna-terra-fertil/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
