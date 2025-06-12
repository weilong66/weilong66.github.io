function t(t) {
  return t && t.__esModule ? t.default : t
}
var e = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {},
  a = {},
  o = {},
  i = e.parcelRequired8e1;
null == i && ((i = function (t) {
  if (t in a) return a[t].exports;
  if (t in o) {
    var e = o[t];
    delete o[t];
    var i = {
      id: t,
      exports: {}
    };
    return a[t] = i, e.call(i.exports, i, i.exports), i.exports
  }
  var l = new Error("Cannot find module '" + t + "'");
  throw l.code = "MODULE_NOT_FOUND", l
}).register = function (t, e) {
  o[t] = e
}, e.parcelRequired8e1 = i), i("bXuNP").register(JSON.parse('{"aTdUK":"index.aa042a92.js","jHKS0":"arrow_back_24dp.svg","eakYW":"arrow_forward_24dp.svg","hww8G":"index.67315050.css"}'));
var l;
l = i("kPq84").getBundleURL("aTdUK") + i("bXuNP").resolve("jHKS0");
var r;
r = i("kPq84").getBundleURL("aTdUK") + i("bXuNP").resolve("eakYW");
class n extends HTMLElement {
  constructor() {
    super(), this.optionsBoard = {
      "3x3": 9,
      "4x4": 16,
      "5x5": 25,
      "6x6": 36,
      "7x7": 49,
      "8x8": 64,
      "9x9": 81
    }, this.diffLevels = ["easy", "medium", "difficult"]
  }
  connectedCallback() {
    const t = localStorage.getItem("playerName"),
      e = localStorage.getItem("board"),
      a = localStorage.getItem("boxNumber"),
      o = localStorage.getItem("difficulty");
    this.options = {
      playerName: t,
      board: e,
      boxNumber: a,
      difficulty: o
    }, console.log(this.options), this.render(), this.setBoardArrowBtns(), this.setDifficultyArrowBtns(), this.setPlayBtnEvent()
  }
  getItem(t, e) {
    var a = Object.keys(this.optionsBoard).sort((function (t, e) {
        return t - e
      })),
      o = a.indexOf(t);
    return (-1 == e && o > 0 || 1 == e && o < a.length - 1) && (o += e), a[o]
  }
  updateBoardArrowDisplay() {
    this.boardBackBtn.style.display = "flex", this.boardForwardBtn.style.display = "flex", 9 == this.options.boxNumber && (this.boardBackBtn.style.display = "none"), 81 == this.options.boxNumber && (this.boardForwardBtn.style.display = "none")
  }
  setBoardArrowBtns() {
    this.boardBackBtn = document.getElementById("boardBackBtn"), this.boardForwardBtn = document.getElementById("boardForwardBtn"), this.updateBoardArrowDisplay(), this.boardBackBtn.addEventListener("click", (() => {
      const t = document.getElementById("board"),
        e = t.value;
      t.value = this.getItem(e, -1), this.options.boxNumber = this.optionsBoard[t.value], this.updateBoardArrowDisplay()
    })), this.boardForwardBtn.addEventListener("click", (() => {
      const t = document.getElementById("board"),
        e = t.value;
      t.value = this.getItem(e, 1), this.options.boxNumber = this.optionsBoard[t.value], this.updateBoardArrowDisplay()
    }))
  }
  updateDiffArrowDisplay(t) {
    this.diffBackBtn.style.display = "flex", this.diffForwardBtn.style.display = "flex", "easy" === t && (this.diffBackBtn.style.display = "none"), "difficult" === t && (this.diffForwardBtn.style.display = "none")
  }
  setDifficultyArrowBtns() {
    this.diffBackBtn = document.getElementById("diffBackBtn"), this.diffForwardBtn = document.getElementById("diffForwardBtn");
    const t = document.getElementById("difficulty").value;
    this.updateDiffArrowDisplay(t), this.diffBackBtn.addEventListener("click", (() => {
      const t = document.getElementById("difficulty"),
        e = this.diffLevels.indexOf(t.value);
      t.value = this.diffLevels[e - 1], this.updateDiffArrowDisplay(t.value)
    })), this.diffForwardBtn.addEventListener("click", (() => {
      const t = document.getElementById("difficulty"),
        e = this.diffLevels.indexOf(t.value);
      t.value = this.diffLevels[e + 1], this.updateDiffArrowDisplay(t.value)
    }))
  }
  setPlayBtnEvent() {
    this.playBtn = document.getElementById("playBtn");
    const t = document.getElementById("playBtnLink");
    this.playBtn.addEventListener("click", (e => {
      e.preventDefault(), e.stopPropagation();
      const a = document.getElementById("name").value,
        o = document.getElementById("board").value;
      a && "" != a && localStorage.setItem("playerName", a), localStorage.setItem("board", o), localStorage.setItem("boxNumber", this.optionsBoard[o]), localStorage.setItem("difficulty", document.getElementById("difficulty").value), t.dispatchEvent(new Event("click"))
    }))
  }
  render = () => {
    const e = String.raw;
    this.innerHTML = e `
      <section id="${"_options_440221"}">
        <!-- Name -->
        <label for="name" class="${"_optLabel_440221"} ${"_optElem_440221"}">名称
          <input
            class="${"_inputField_440221"}"
            id="name"
            required
            minlength="4"
            maxlength="8"
            size="10"
            placeholder="Player 1"
            value="${this.options.playerName}"
          />
        </label>
        <!-- Board -->
        <button
          id="boardBackBtn"
          type="button"
          class="${"_modularBtn_440221"} ${"_arrowBack_440221"}"
          data-target="board"
        >
          <img class="icon" src="${t(l)}" alt="arrowBackIcon" />
        </button>
        <label for="board" class="${"_optLabel_440221"} ${"_optElem_440221"}">棋盘
          <input
            id="board"
            value="${this.options.board}"
            class="${"_inputField_440221"}"
            disabled
          />
        </label>
        <button
          id="boardForwardBtn"
          type="button"
          class="${"_modularBtn_440221"} ${"_arrowForward_440221"}"
          data-target="board"
        >
          <img class="icon" src="${t(r)}" alt="arrowForwardIcon" />
        </button>
        <!-- Difficulty -->
        <button
          id="diffBackBtn"
          type="button"
          class="${"_modularBtn_440221"} ${"_arrowBack_440221"}"
          data-target="difficulty"
        >
          <img class="icon" src="${t(l)}" alt="arrowBackIcon" />
        </button>
        <label for="difficulty" class="${"_optLabel_440221"} ${"_optElem_440221"}">难度
          <input
            id="difficulty"
            value="${this.options.difficulty}"
            class="${"_inputField_440221"} ${"_optElem_440221"}"
            disabled
          />
        </label>
        <button
          id="diffForwardBtn"
          type="button"
          class="${"_modularBtn_440221"} ${"_arrowForward_440221"}"
          data-target="difficulty"
        >
          <img class="icon" src="${t(r)}" alt="arrowForwardIcon" />
        </button>
        <button id="playBtn" type="button" class="${"_actionBtn_440221"} ${"_optElem_440221"}">
          开始游戏
          <a id="playBtnLink" href="/game" aria-label="Play"></a>
        </button>
        <!-- <a
          id="playBtn"
          href="/game"
          aria-label="Play"
          class="${"_actionBtn_440221"} ${"_optElem_440221"}"
          >Play</a
        > -->
        <a
          id="scoreBtn"
          class="${"_actionBtn_440221"} ${"_optElem_440221"}"
          href="/scores"
          aria-label="Scores"
          >最佳成绩</a
        >
      </section>
    `
  }
}
customElements.define("game-options", n);
//# sourceMappingURL=index.aa042a92.js.map