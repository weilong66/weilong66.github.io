function e(e) {
  return e && e.__esModule ? e.default : e
}
var t = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {},
  a = {},
  i = {},
  n = t.parcelRequired8e1;
null == n && ((n = function (e) {
  if (e in a) return a[e].exports;
  if (e in i) {
    var t = i[e];
    delete i[e];
    var n = {
      id: e,
      exports: {}
    };
    return a[e] = n, t.call(n.exports, n, n.exports), n.exports
  }
  var l = new Error("Cannot find module '" + e + "'");
  throw l.code = "MODULE_NOT_FOUND", l
}).register = function (e, t) {
  i[e] = t
}, t.parcelRequired8e1 = n), n("bXuNP").register(JSON.parse('{"fX4rj":"index.b2757fd7.js","lbiQs":"replay_black_24dp.svg","bpMv2":"home_black_24dp.svg","hww8G":"index.67315050.css"}'));
var l;
l = n("kPq84").getBundleURL("fX4rj") + n("bXuNP").resolve("lbiQs");
var s;
s = n("kPq84").getBundleURL("fX4rj") + n("bXuNP").resolve("bpMv2");
class d extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    this.render(), this.modal = document.querySelector("._modal_17cba8"), this.modalTitle = document.getElementById("_endGameModalTitle_17cba8"), this.overlay = document.querySelector("._overlay_17cba8"), this.btnCloseModal = document.getElementById("closeModalBtn"), this.playerScore1 = document.getElementById("playerScore1"), this.playerScore2 = document.getElementById("playerScore2"), this.homeBtn = document.getElementById("homeBtn"), this.replayBtn = document.getElementById("replayBtn"), this.overlay.addEventListener("click", this.close), document.addEventListener("keydown", (function (e) {
      "Escape" !== e.key || this.modal.classList.contains("_hidden_17cba8") || this.close()
    }))
  }
  render() {
    const t = String.raw;
    this.innerHTML = t `
      <div
        role="dialog"
        class="${"_modal_17cba8"} ${"_hidden_17cba8"}"
        aria-hidden="true"
        aria-labelledby="${"_endGameModalTitle_17cba8"}"
      >
        <button id="closeModalBtn" class="${"_closeModal_17cba8"}">&times;</button>
        <h1 id="${"_endGameModalTitle_17cba8"}">Player 获胜 ! 🥳🔥</h1>
        <div role="document" class="${"_playerScores_17cba8"}">
          <p id="playerScore1"></p>
          <p id="playerScore2"></p>
        </div>
        <div id="${"_actionBtns_17cba8"}">
          <a
            id="replayBtn"
            class="${"_modalBtn_17cba8"}"
            href="/game"
            aria-label="Replay"
          >
            <img class="icon" src="${e(l)}" alt="replayIcon" />
          </a>
          <a id="homeBtn" class="${"_modalBtn_17cba8"}" href="/" aria-label="Home">
            <img class="icon" src="${e(s)}" alt="homeIcon" />
          </a>
        </div>
      </div>
      <div class="${"_overlay_17cba8"} ${"_hidden_17cba8"}" aria-hidden="true"></div>
    `
  }
  displayWinner(e) {
    this.modalTitle.innerHTML = e ? `${e} 获胜 ! 🥳 🔥` : "平局 ! 💪 🥰"
  }
  open(e) {
    const t = String.raw,
      a = e.player1,
      i = e.player2;
    this.setBtnEventListeners(e), this.displayWinner(e.winner), this.playerScore1.innerHTML = t ` ${a.name}<br />${a.score} `, this.playerScore2.innerHTML = t ` ${i.name}<br />${i.score} `, this.modal.classList.remove("_hidden_17cba8"), this.modal.removeAttribute("aria-hidden"), this.overlay.classList.remove("_hidden_17cba8"), this.overlay.removeAttribute("aria-hidden"), this.homeBtn.focus()
  }
  close() {
    this.modal.classList.add("_hidden_17cba8"), this.overlay.classList.add("_hidden_17cba8"), this.modal.setAttribute("aria-hidden", "true"), this.overlay.setAttribute("aria-hidden", "true")
  }
  setBtnEventListeners(e) {
    this.btnCloseModal.addEventListener("click", (() => this.close())), this.homeBtn.addEventListener("click", (() => this.close())), this.replayBtn.addEventListener("click", (t => {
      this.close(), e.resetGame()
    }))
  }
}
customElements.define("end-game-modal", d);
//# sourceMappingURL=index.b2757fd7.js.map