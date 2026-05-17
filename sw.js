const CACHE = 'dna-v3';

// Só cacheia ícones e manifest — NUNCA os HTMLs
const ASSETS = [
  '/dna-terra-fertil/icon-192.png',
  '/dna-terra-fertil/icon-512.png',
  '/dna-terra-fertil/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Apaga TODOS os caches antigos
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Firebase, Google APIs e gstatic: sempre da rede, nunca cacheia
  if (
    url.hostname.includes('firebase') ||
    url.hostname.includes('google') ||
    url.hostname.includes('gstatic') ||
    url.hostname.includes('googleapis')
  ) {
    e.respondWith(fetch(e.request));
    return;
  }

  // HTMLs: sempre da rede (nunca do cache)
  if (e.request.destination === 'document') {
    e.respondWith(fetch(e.request));
    return;
  }

  // Demais assets (ícones etc): rede primeiro, cache como fallback
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
