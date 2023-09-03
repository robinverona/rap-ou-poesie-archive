const staticRapOuPoesie = "rap-ou-poesie-site-v1"
const assets = [
  "/",
  "/index.html",
  "/styles/app.css",
  "/js/app.js",
  "/assets/poetry-circle.png",
  "/assets/rap-circle.png",
  "/assets/start.svg",
  "/assets/rapoesie.png",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticRapOuPoesie).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })