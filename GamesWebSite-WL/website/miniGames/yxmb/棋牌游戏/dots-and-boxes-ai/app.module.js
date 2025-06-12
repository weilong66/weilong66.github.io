import { Router } from "./router/router.module.js";

class App {
  constructor() {
    const routerOutlet = document.querySelector("main");
    const router = new Router(routerOutlet);
    if (!localStorage.getItem("playerName")) {
      localStorage.setItem("playerName", "Player 1 👑");
      localStorage.setItem("board", "3x3");
      localStorage.setItem("boxNumber", "9");
      localStorage.setItem("difficulty", "medium");
    }
    router.setRoutes([
      {
        path: "/",
        component: "<game-options></game-options>",
      },
      {
        path: "/game",
        component: "<dots-and-boxes></dots-and-boxes>",
      },
      { path: "/scores", component: "<game-scores></game-scores>" },
    ]);
    this.registerServiceWorker();
  }

  registerServiceWorker() {
    const sw = new URL("./sw.js", import.meta.url);
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register(sw).then(
          function (registration) {
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope
            );
          },
          function (err) {
            console.log("ServiceWorker registration failed: ", err);
          }
        );
      });
    }
  }
}

const app = new App();
