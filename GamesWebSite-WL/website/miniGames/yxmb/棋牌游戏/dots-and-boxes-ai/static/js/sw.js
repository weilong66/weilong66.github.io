const CACHE_NAME = "dots-boxes";
const urlsToCache = [];
/* const urlsToCache = [
  "./",
  "index.html",
  "app.module.js",
  "styles/light.css",
  "styles/dark.css",
  "router/route.js",
  "router/router.module.js",
  "img/purple-wave1.png",
  "img/purple-wave2.png",
  "img/yellow-wave1.png",
  "img/yellow-wave2.png",
  "icons/arrow_back_24dp.svg",
  "icons/arrow_forward_24dp.svg",
  "icons/home_black_24dp.svg",
  "icons/replay_black_24dp.svg",
  "icons/icosahedron.svg",
  "components/dot-box/dot-box-game.js",
  "components/dot-box/dot-box-grid.js",
  "components/dot-box/dot-box-gris.module.css",
  "components/dot-box/game-controller.js",
  "components/dot-box/player.js",
  "components/end-game-modal/end-game-modal.js",
  "components/end-game-modal/end-game-modal.module.css",
  "components/scores/scores.js",
  "components/scores/scores.module.css",
  "components/themetoggler/themeToggler.js",
  "components/themetoggler/themeToggler.module.css",
  "components/options/options.js",
  "components/options/options.module.css",
]; */

self.addEventListener("install", (event) => {
  console.log("installing service worker…");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker now ready to handle fetches!");
});
