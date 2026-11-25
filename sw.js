const CACHE = "estoque-web-v36";
const CDN_CACHE = CACHE + "-cdn";
const FILES = ["./", "./index.html", "./firebase-config.js", "./manifest.json", "./logo.png", "./icon-192.png", "./icon-180.png", "./icon-512.png", "./icon-maskable-512.png"];
// scripts do Firebase: sem eles o programa nao abre sem internet
const CDN = [
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(FILES))
      .then(() => caches.open(CDN_CACHE).then((c) => c.addAll(CDN)).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== CDN_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Rede primeiro (sempre pega a versão nova do site); cache só como reserva offline.
// Scripts do Firebase: cache primeiro, para funcionar sem internet.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);

  if (CDN.indexOf(e.request.url) >= 0) {
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
    return;
  }

  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then((hit) => hit || caches.match("./index.html")))
  );
});
