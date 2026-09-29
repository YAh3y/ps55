const CACHE_NAME = "yahay-ps5-offline-v1";
const ASSETS = [
  './index.html',
  './offsets/10.00.js',
  './offsets/10.01.js',
  './offsets/10.20.js',
  './offsets/10.40.js',
  './offsets/10.60.js',
  './offsets/11.00.js',
  './offsets/11.20.js',
  './offsets/11.60.js',
  './offsets/12.00.js',
  './offsets/12.02.js',
  './offsets/12.20.js',
  './offsets/12.40.js',
  './offsets/12.60.js',
  './offsets/12.70.js',
  './offsets/13.00.js',
  './offsets/13.20.js',
  './offsets/13.40.js',
  './offsets/13.42.js',
  './offsets/13.60.js',
  './offsets/7.00.js',
  './offsets/7.01.js',
  './offsets/7.20.js',
  './offsets/7.40.js',
  './offsets/7.60.js',
  './offsets/7.61.js',
  './offsets/8.00.js',
  './offsets/8.20.js',
  './offsets/8.40.js',
  './offsets/8.60.js',
  './offsets/9.00.js',
  './offsets/9.20.js',
  './offsets/9.40.js',
  './offsets/9.60.js',
  './payloads/elfldr-ps5-1360.elf',
  './payloads/etaHEN.elf',
  './payloads/kexp_2026_05_25.bin',
  './payloads/kstuff.elf',
  './payloads/shadowmountplus.elf',
  './src/firmware.js',
  './src/kexp.js',
  './src/main.js',
  './src/relapse_exploit.js',
  './src/rop.js',
  './src/site.js',
  './src/utils/int64.js',
  './src/utils/mem.js',
  './src/utils/rop_slave.js',
  './src/utils/syscalls.js',
  './src/webkit.js',
  './'
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const url of ASSETS) {
      try { await cache.add(url); } catch (e) { /* keep caching remaining files */ }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request, {ignoreSearch: true});
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch (e) {
      if (event.request.mode === "navigate") return (await caches.match("./index.html")) || (await caches.match("./"));
      throw e;
    }
  })());
});
