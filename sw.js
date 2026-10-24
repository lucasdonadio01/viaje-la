const V = "la26-v11";
const TILES = "la26-tiles";
const APP = [
  "./", "index.html", "estilos.css", "app.js", "datos.js", "rutas.js", "manifest.webmanifest", "icono.svg",
  "presupuesto/", "presupuesto/presupuesto.css", "presupuesto/presupuesto.js", "presupuesto/datos.js"
];
const CDN = [
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(V)
      .then((c) => c.addAll(APP).then(() => Promise.all(CDN.map((u) => c.add(u).catch(() => {})))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== V && k !== TILES).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const u = new URL(req.url);

  if (u.hostname === "server.arcgisonline.com" && u.pathname.includes("/tile/")) {
    e.respondWith(
      caches.open(TILES).then(async (c) => {
        const hit = await c.match(req.url);
        if (hit) return hit;
        try {
          const r = await fetch(req);
          if (r.ok) c.put(req.url, r.clone());
          return r;
        } catch (err) {
          return new Response("", { status: 504 });
        }
      })
    );
    return;
  }

  if (u.origin === self.location.origin) {
    e.respondWith(
      fetch(req)
        .then((r) => {
          if (r.ok) {
            const copia = r.clone();
            caches.open(V).then((c) => c.put(req, copia));
          }
          return r;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((h) => h || caches.match("index.html")))
    );
    return;
  }

  if (u.hostname === "cdnjs.cloudflare.com" || u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.match(req).then((h) =>
        h || fetch(req).then((r) => {
          if (r.ok || r.type === "opaque") {
            const copia = r.clone();
            caches.open(V).then((c) => c.put(req, copia));
          }
          return r;
        })
      )
    );
  }
});
