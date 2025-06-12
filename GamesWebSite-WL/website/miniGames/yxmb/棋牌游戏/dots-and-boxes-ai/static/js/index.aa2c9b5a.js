function e(e) {
  return e && e.__esModule ? e.default : e
}
var t = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {},
  r = {},
  n = {},
  o = t.parcelRequired8e1;
null == o && ((o = function (e) {
  if (e in r) return r[e].exports;
  if (e in n) {
    var t = n[e];
    delete n[e];
    var o = {
      id: e,
      exports: {}
    };
    return r[e] = o, t.call(o.exports, o, o.exports), o.exports
  }
  var s = new Error("Cannot find module '" + e + "'");
  throw s.code = "MODULE_NOT_FOUND", s
}).register = function (e, t) {
  n[e] = t
}, t.parcelRequired8e1 = o);
var s = class {
  constructor(e, t, r, n) {
    this.gridController = e, this.gameState = t, this.gameAI = r, this.classes = n
  }
  chooseBoxSide(e, t) {
    const r = document.getElementById(t);
    this.gridController.markBtnAsOwned(r, e);
    const n = this.gridController.getAdjacentBoxes(t);
    let o = 0;
    n.forEach((r => {
      r.sideIds[t] = e.name;
      let n = this.gridController.boxIsCompleted(r);
      n && o++, n && (e.score++, this.gameState.boxesOwned++, r.owner = e.name, this.gridController.markBoxAsOwned(r, e), this.gameState.checkEndGame())
    })), this.checkIfAINeedsToPlay(e, o > 0)
  }
  checkIfAINeedsToPlay(e, t) {
    if (e.isHuman && !t || !e.isHuman && t && !this.gameState.gameOver) {
      let e = this.gameAI.chooseSideId();
      this.chooseBoxSide(this.gameState.player2, e)
    }
  }
};
var i = class {
  constructor() {
    this.classes = this.getClasses()
  }
  getClasses() {
    return {
      sideBtn: "_sideBtn_fb4d88",
      selectable: "_selectable_fb4d88",
      player1Color: "_player1Color_fb4d88",
      player2Color: "_player2Color_fb4d88",
      dotboxGrid: "_dotboxGrid_fb4d88"
    }
  }
  getHorizonBtn(e, t) {
    return String.raw `
      <button
        id="r${e}c${t}"
        class="${"_sideBtn_fb4d88"} ${"_selectable_fb4d88"} ${"_horizonBtn_fb4d88"}"
      ></button>
    `
  }
  getDot() {
    return String.raw `<span class="${"_dot_fb4d88"}"></span>`
  }
  getHorizontalSides(e, t) {
    let r = "";
    for (let n = 2; n < t; n += 2) r += `\n        ${this.getDot()}\n        ${this.getHorizonBtn(e,n)}\n      `;
    return r += `${this.getDot()}`, r
  }
  getVerticalBtn(e, t) {
    return String.raw `
      <button
        id="r${e}c${t}"
        class="${"_sideBtn_fb4d88"} ${"_selectable_fb4d88"} ${"_verticaBtn_fb4d88"}"
      ></button>
    `
  }
  getBox(e, t) {
    return String.raw ` <div id="r${e}Content${t}"></div> `
  }
  getVerticalSides(e, t) {
    let r = "";
    for (let n = 1, o = 1; n < t; n += 2, o++) r += `\n        ${this.getVerticalBtn(e,n)}\n        ${this.getBox(e,o)}\n      `;
    return r += `${this.getVerticalBtn(e,t)}`, r
  }
  renderDotsAndBoxes(e) {
    let t = "";
    for (let r = 1; r < e; r += 2) t += `\n        ${this.getHorizontalSides(r,e)}\n        ${this.getVerticalSides(r+1,e)}\n      `;
    return t += `${this.getHorizontalSides(e,e)}`, t
  }
  component(e) {
    return String.raw `
      <section id="${"_dotboxGrid_fb4d88"}">${this.renderDotsAndBoxes(e)}</section>
    `
  }
};
var a = class {
  constructor(e) {
    this.gridController = e
  }
  chooseSideId() {
    return this.getRandomSideId()
  }
  getNextClosingSideBox() {
    for (let e of this.gridController.boxes) {
      let t = 0,
        r = "";
      for (let n of Object.entries(e.sideIds)) "" !== n[1] ? t++ : r = n[0];
      if (3 === t) return r
    }
    return null
  }
  getNextClosingSideBoxOrRandom() {
    let e = this.getNextClosingSideBox();
    return e || this.getRandomSideId()
  }
  getRandomSideId() {
    const e = this.gridController.availableSides,
      t = Math.floor(Math.random() * e.length);
    if (!this.isThirdSide(e[t])) return e[t];
    return this.tryGetNonThirdSideId(e, t)
  }
  tryGetNonThirdSideId(e, t) {
    for (let t of e)
      if (!this.isThirdSide(t)) return t;
    return e[t]
  }
  isThirdSide(e) {
    const t = this.gridController.getAdjacentBoxes(e);
    for (let e of t) {
      let t = 0;
      for (let r of Object.values(e.sideIds)) "" != r && t++;
      if (2 === t) return !0
    }
    return !1
  }
};
var c = class extends a {
  constructor(e) {
    super(e)
  }
  chooseSideId() {
    return this.getNextClosingSideBoxOrRandom()
  }
};
var l = class extends a {
  constructor(e) {
    super(e)
  }
  chooseSideId() {
    return this.getNextClosingSideBoxAndDoubleCross()
  }
  getNextClosingSideBoxAndDoubleCross() {
    for (let e of this.gridController.sharedSides) {
      if ("" !== e[1]) continue;
      const t = this.gridController.getAdjacentBoxes(e[0]);
      let r = 0,
        n = [];
      for (let e of t) {
        for (let t of Object.entries(e.sideIds)) this.gridController.isBorder(t[0]) && "" === t[1] && n.push(t), "" !== t[1] && r++;
        if (1 === r || 4 === r) break
      }
      if (5 === r && 1 === n.length) return n[0][0]
    }
    return this.getNextClosingSideBoxOrRandom()
  }
};
o.register("fM91i", (function (e, r) {
  var n = "__lodash_hash_undefined__",
    o = 9007199254740991,
    s = "[object Arguments]",
    i = "[object Boolean]",
    a = "[object Date]",
    c = "[object Function]",
    l = "[object GeneratorFunction]",
    u = "[object Map]",
    d = "[object Number]",
    h = "[object Object]",
    f = "[object Promise]",
    g = "[object RegExp]",
    p = "[object Set]",
    b = "[object String]",
    y = "[object Symbol]",
    v = "[object WeakMap]",
    _ = "[object ArrayBuffer]",
    m = "[object DataView]",
    S = "[object Float32Array]",
    x = "[object Float64Array]",
    w = "[object Int8Array]",
    j = "[object Int16Array]",
    O = "[object Int32Array]",
    I = "[object Uint8Array]",
    B = "[object Uint8ClampedArray]",
    A = "[object Uint16Array]",
    C = "[object Uint32Array]",
    $ = /\w*$/,
    M = /^\[object .+?Constructor\]$/,
    N = /^(?:0|[1-9]\d*)$/,
    E = {};
  E[s] = E["[object Array]"] = E[_] = E[m] = E[i] = E[a] = E[S] = E[x] = E[w] = E[j] = E[O] = E[u] = E[d] = E[h] = E[g] = E[p] = E[b] = E[y] = E[I] = E[B] = E[A] = E[C] = !0, E["[object Error]"] = E[c] = E[v] = !1;
  var P = "object" == typeof t && t && t.Object === Object && t,
    k = "object" == typeof self && self && self.Object === Object && self,
    G = P || k || Function("return this")(),
    D = "object" == typeof r && r && !r.nodeType && r,
    T = D && e && !e.nodeType && e,
    L = T && T.exports === D;

  function R(e, t) {
    return e.set(t[0], t[1]), e
  }

  function U(e, t) {
    return e.add(t), e
  }

  function H(e, t, r, n) {
    var o = -1,
      s = e ? e.length : 0;
    for (n && s && (r = e[++o]); ++o < s;) r = t(r, e[o], o, e);
    return r
  }

  function z(e) {
    var t = !1;
    if (null != e && "function" != typeof e.toString) try {
      t = !!(e + "")
    } catch (e) {}
    return t
  }

  function q(e) {
    var t = -1,
      r = Array(e.size);
    return e.forEach((function (e, n) {
      r[++t] = [n, e]
    })), r
  }

  function F(e, t) {
    return function (r) {
      return e(t(r))
    }
  }

  function V(e) {
    var t = -1,
      r = Array(e.size);
    return e.forEach((function (e) {
      r[++t] = e
    })), r
  }
  var J, W = Array.prototype,
    K = Function.prototype,
    Q = Object.prototype,
    X = G["__core-js_shared__"],
    Y = (J = /[^.]+$/.exec(X && X.keys && X.keys.IE_PROTO || "")) ? "Symbol(src)_1." + J : "",
    Z = K.toString,
    ee = Q.hasOwnProperty,
    te = Q.toString,
    re = RegExp("^" + Z.call(ee).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
    ne = L ? G.Buffer : void 0,
    oe = G.Symbol,
    se = G.Uint8Array,
    ie = F(Object.getPrototypeOf, Object),
    ae = Object.create,
    ce = Q.propertyIsEnumerable,
    le = W.splice,
    ue = Object.getOwnPropertySymbols,
    de = ne ? ne.isBuffer : void 0,
    he = F(Object.keys, Object),
    fe = Te(G, "DataView"),
    ge = Te(G, "Map"),
    pe = Te(G, "Promise"),
    be = Te(G, "Set"),
    ye = Te(G, "WeakMap"),
    ve = Te(Object, "create"),
    _e = ze(fe),
    me = ze(ge),
    Se = ze(pe),
    xe = ze(be),
    we = ze(ye),
    je = oe ? oe.prototype : void 0,
    Oe = je ? je.valueOf : void 0;

  function Ie(e) {
    var t = -1,
      r = e ? e.length : 0;
    for (this.clear(); ++t < r;) {
      var n = e[t];
      this.set(n[0], n[1])
    }
  }

  function Be(e) {
    var t = -1,
      r = e ? e.length : 0;
    for (this.clear(); ++t < r;) {
      var n = e[t];
      this.set(n[0], n[1])
    }
  }

  function Ae(e) {
    var t = -1,
      r = e ? e.length : 0;
    for (this.clear(); ++t < r;) {
      var n = e[t];
      this.set(n[0], n[1])
    }
  }

  function Ce(e) {
    this.__data__ = new Be(e)
  }

  function $e(e, t) {
    var r = Fe(e) || function (e) {
        return function (e) {
          return function (e) {
            return !!e && "object" == typeof e
          }(e) && Ve(e)
        }(e) && ee.call(e, "callee") && (!ce.call(e, "callee") || te.call(e) == s)
      }(e) ? function (e, t) {
        for (var r = -1, n = Array(e); ++r < e;) n[r] = t(r);
        return n
      }(e.length, String) : [],
      n = r.length,
      o = !!n;
    for (var i in e) !t && !ee.call(e, i) || o && ("length" == i || Ue(i, n)) || r.push(i);
    return r
  }

  function Me(e, t, r) {
    var n = e[t];
    ee.call(e, t) && qe(n, r) && (void 0 !== r || t in e) || (e[t] = r)
  }

  function Ne(e, t) {
    for (var r = e.length; r--;)
      if (qe(e[r][0], t)) return r;
    return -1
  }

  function Ee(e, t, r, n, o, f, v) {
    var M;
    if (n && (M = f ? n(e, o, f, v) : n(e)), void 0 !== M) return M;
    if (!Ke(e)) return e;
    var N = Fe(e);
    if (N) {
      if (M = function (e) {
          var t = e.length,
            r = e.constructor(t);
          t && "string" == typeof e[0] && ee.call(e, "index") && (r.index = e.index, r.input = e.input);
          return r
        }(e), !t) return function (e, t) {
        var r = -1,
          n = e.length;
        t || (t = Array(n));
        for (; ++r < n;) t[r] = e[r];
        return t
      }(e, M)
    } else {
      var P = Re(e),
        k = P == c || P == l;
      if (Je(e)) return function (e, t) {
        if (t) return e.slice();
        var r = new e.constructor(e.length);
        return e.copy(r), r
      }(e, t);
      if (P == h || P == s || k && !f) {
        if (z(e)) return f ? e : {};
        if (M = function (e) {
            return "function" != typeof e.constructor || He(e) ? {} : (t = ie(e), Ke(t) ? ae(t) : {});
            var t
          }(k ? {} : e), !t) return function (e, t) {
          return Ge(e, Le(e), t)
        }(e, function (e, t) {
          return e && Ge(t, Qe(t), e)
        }(M, e))
      } else {
        if (!E[P]) return f ? e : {};
        M = function (e, t, r, n) {
          var o = e.constructor;
          switch (t) {
            case _:
              return ke(e);
            case i:
            case a:
              return new o(+e);
            case m:
              return function (e, t) {
                var r = t ? ke(e.buffer) : e.buffer;
                return new e.constructor(r, e.byteOffset, e.byteLength)
              }(e, n);
            case S:
            case x:
            case w:
            case j:
            case O:
            case I:
            case B:
            case A:
            case C:
              return function (e, t) {
                var r = t ? ke(e.buffer) : e.buffer;
                return new e.constructor(r, e.byteOffset, e.length)
              }(e, n);
            case u:
              return function (e, t, r) {
                return H(t ? r(q(e), !0) : q(e), R, new e.constructor)
              }(e, n, r);
            case d:
            case b:
              return new o(e);
            case g:
              return function (e) {
                var t = new e.constructor(e.source, $.exec(e));
                return t.lastIndex = e.lastIndex, t
              }(e);
            case p:
              return function (e, t, r) {
                return H(t ? r(V(e), !0) : V(e), U, new e.constructor)
              }(e, n, r);
            case y:
              return s = e, Oe ? Object(Oe.call(s)) : {}
          }
          var s
        }(e, P, Ee, t)
      }
    }
    v || (v = new Ce);
    var G = v.get(e);
    if (G) return G;
    if (v.set(e, M), !N) var D = r ? function (e) {
      return function (e, t, r) {
        var n = t(e);
        return Fe(e) ? n : function (e, t) {
          for (var r = -1, n = t.length, o = e.length; ++r < n;) e[o + r] = t[r];
          return e
        }(n, r(e))
      }(e, Qe, Le)
    }(e) : Qe(e);
    return function (e, t) {
      for (var r = -1, n = e ? e.length : 0; ++r < n && !1 !== t(e[r], r, e););
    }(D || e, (function (o, s) {
      D && (o = e[s = o]), Me(M, s, Ee(o, t, r, n, s, e, v))
    })), M
  }

  function Pe(e) {
    return !(!Ke(e) || (t = e, Y && Y in t)) && (We(e) || z(e) ? re : M).test(ze(e));
    var t
  }

  function ke(e) {
    var t = new e.constructor(e.byteLength);
    return new se(t).set(new se(e)), t
  }

  function Ge(e, t, r, n) {
    r || (r = {});
    for (var o = -1, s = t.length; ++o < s;) {
      var i = t[o],
        a = n ? n(r[i], e[i], i, r, e) : void 0;
      Me(r, i, void 0 === a ? e[i] : a)
    }
    return r
  }

  function De(e, t) {
    var r, n, o = e.__data__;
    return ("string" == (n = typeof (r = t)) || "number" == n || "symbol" == n || "boolean" == n ? "__proto__" !== r : null === r) ? o["string" == typeof t ? "string" : "hash"] : o.map
  }

  function Te(e, t) {
    var r = function (e, t) {
      return null == e ? void 0 : e[t]
    }(e, t);
    return Pe(r) ? r : void 0
  }
  Ie.prototype.clear = function () {
    this.__data__ = ve ? ve(null) : {}
  }, Ie.prototype.delete = function (e) {
    return this.has(e) && delete this.__data__[e]
  }, Ie.prototype.get = function (e) {
    var t = this.__data__;
    if (ve) {
      var r = t[e];
      return r === n ? void 0 : r
    }
    return ee.call(t, e) ? t[e] : void 0
  }, Ie.prototype.has = function (e) {
    var t = this.__data__;
    return ve ? void 0 !== t[e] : ee.call(t, e)
  }, Ie.prototype.set = function (e, t) {
    return this.__data__[e] = ve && void 0 === t ? n : t, this
  }, Be.prototype.clear = function () {
    this.__data__ = []
  }, Be.prototype.delete = function (e) {
    var t = this.__data__,
      r = Ne(t, e);
    return !(r < 0) && (r == t.length - 1 ? t.pop() : le.call(t, r, 1), !0)
  }, Be.prototype.get = function (e) {
    var t = this.__data__,
      r = Ne(t, e);
    return r < 0 ? void 0 : t[r][1]
  }, Be.prototype.has = function (e) {
    return Ne(this.__data__, e) > -1
  }, Be.prototype.set = function (e, t) {
    var r = this.__data__,
      n = Ne(r, e);
    return n < 0 ? r.push([e, t]) : r[n][1] = t, this
  }, Ae.prototype.clear = function () {
    this.__data__ = {
      hash: new Ie,
      map: new(ge || Be),
      string: new Ie
    }
  }, Ae.prototype.delete = function (e) {
    return De(this, e).delete(e)
  }, Ae.prototype.get = function (e) {
    return De(this, e).get(e)
  }, Ae.prototype.has = function (e) {
    return De(this, e).has(e)
  }, Ae.prototype.set = function (e, t) {
    return De(this, e).set(e, t), this
  }, Ce.prototype.clear = function () {
    this.__data__ = new Be
  }, Ce.prototype.delete = function (e) {
    return this.__data__.delete(e)
  }, Ce.prototype.get = function (e) {
    return this.__data__.get(e)
  }, Ce.prototype.has = function (e) {
    return this.__data__.has(e)
  }, Ce.prototype.set = function (e, t) {
    var r = this.__data__;
    if (r instanceof Be) {
      var n = r.__data__;
      if (!ge || n.length < 199) return n.push([e, t]), this;
      r = this.__data__ = new Ae(n)
    }
    return r.set(e, t), this
  };
  var Le = ue ? F(ue, Object) : function () {
      return []
    },
    Re = function (e) {
      return te.call(e)
    };

  function Ue(e, t) {
    return !!(t = null == t ? o : t) && ("number" == typeof e || N.test(e)) && e > -1 && e % 1 == 0 && e < t
  }

  function He(e) {
    var t = e && e.constructor;
    return e === ("function" == typeof t && t.prototype || Q)
  }

  function ze(e) {
    if (null != e) {
      try {
        return Z.call(e)
      } catch (e) {}
      try {
        return e + ""
      } catch (e) {}
    }
    return ""
  }

  function qe(e, t) {
    return e === t || e != e && t != t
  }(fe && Re(new fe(new ArrayBuffer(1))) != m || ge && Re(new ge) != u || pe && Re(pe.resolve()) != f || be && Re(new be) != p || ye && Re(new ye) != v) && (Re = function (e) {
    var t = te.call(e),
      r = t == h ? e.constructor : void 0,
      n = r ? ze(r) : void 0;
    if (n) switch (n) {
      case _e:
        return m;
      case me:
        return u;
      case Se:
        return f;
      case xe:
        return p;
      case we:
        return v
    }
    return t
  });
  var Fe = Array.isArray;

  function Ve(e) {
    return null != e && function (e) {
      return "number" == typeof e && e > -1 && e % 1 == 0 && e <= o
    }(e.length) && !We(e)
  }
  var Je = de || function () {
    return !1
  };

  function We(e) {
    var t = Ke(e) ? te.call(e) : "";
    return t == c || t == l
  }

  function Ke(e) {
    var t = typeof e;
    return !!e && ("object" == t || "function" == t)
  }

  function Qe(e) {
    return Ve(e) ? $e(e) : function (e) {
      if (!He(e)) return he(e);
      var t = [];
      for (var r in Object(e)) ee.call(e, r) && "constructor" != r && t.push(r);
      return t
    }(e)
  }
  e.exports = function (e) {
    return Ee(e, !0, !0)
  }
}));
var u = o("fM91i");
u = o("fM91i");
var d = class {
  constructor(t, r) {
    this.player1 = e(u)(r.player1), this.player2 = e(u)(r.player2), this.maxScore = e(u)(r.maxScore), this.boxes = e(u)(t.boxes), this.boxesOwned = 0, this.chosenSideId = "", this.availableSides = e(u)(t.availableSides)
  }
  setActivePlayer(e) {
    e === this.player2 ? (this.activePlayer = this.player2, this.inActivePlayer = this.player1) : (this.activePlayer = this.player1, this.inActivePlayer = this.player2)
  }
  checkEndGame() {
    this.boxesOwned.toString() === this.maxScore && (this.gameOver = !0)
  }
  removeSideIdAvailability(e) {
    const t = this.availableSides.indexOf(e);
    t > -1 && this.availableSides.splice(t, 1)
  }
  getAdjacentBoxes(e) {
    return this.boxes.filter((t => Object.keys(t.sideIds).includes(e)))
  }
};
var h = class extends a {
  constructor(e, t) {
    super(e), this.gameState = t, this.maxDepth = 3
  }
  chooseSideId() {
    const e = new d(this.gridController, this.gameState);
    e.setActivePlayer(e.player2);
    return this.getMiniMaxSideId(e, this.maxDepth)
  }
  simulateChosenSide(t, r) {
    let n = e(u)(t);
    n.chosenSideId = r;
    const o = n.getAdjacentBoxes(r);
    let s = 0;
    return o.forEach((e => {
      e.sideIds[r] = n.activePlayer.name, n.removeSideIdAvailability(r);
      let t = this.gridController.boxIsCompleted(e);
      t && s++, t && (n.activePlayer.score++, n.boxesOwned++, e.owner = n.activePlayer.name, n.checkEndGame())
    })), 0 !== s || n.gameOver || n.setActivePlayer(n.inActivePlayer), n
  }
  getMinScore = (e, t) => e > t ? t : e;
  getMaxScore = (e, t) => e < t ? t : e;
  getMiniMaxSideId(e, t) {
    if (0 === t || 0 === e.availableSides.length) return e.player2.score - e.player1.score;
    if (e.player2 === e.activePlayer) {
      let r = -1 / 0,
        n = "";
      for (let o of e.availableSides) {
        let s = this.simulateChosenSide(e, o),
          i = this.getMiniMaxSideId(s, t - 1);
        i > r && (n = o, r = this.getMaxScore(r, i))
      }
      return t === this.maxDepth ? n : r
    } {
      let r = 1 / 0;
      for (let n of e.availableSides) {
        let o = this.simulateChosenSide(e, n),
          s = this.getMiniMaxSideId(o, t - 1);
        r = this.getMinScore(r, s)
      }
      return r
    }
  }
};
var f = class {
  constructor(e, t, r) {
    this.name = e, this.score = 0, this.isHuman = t, this.color = r
  }
};
var g = class {
  constructor(e, t, r) {
    this.player1 = e, this.player2 = t, this.board = r
  }
};
var p = class {
  constructor(e, t, r) {
    this.player1 = new f(t.playerName, !0, r.player1Color), this.player2 = new f("Player 2", !1, r.player2Color), this.boxes = e.boxes, this.gameOver = !1, this.boxesOwned = 0, this.maxScore = t.boxNumber, this.endGameModal = document.querySelector("end-game-modal")
  }
  get winner() {
    return this.player1.score === this.player2.score ? null : this.player1.score > this.player2.score ? this.player1.name : this.player2.name
  }
  registerScore() {
    const e = new g(this.player1, this.player2, this.maxScore),
      t = localStorage.getItem("scores"),
      r = JSON.parse(t) || [];
    this.isNewBestScore(r, e) && (this.addNewBestScore(r, e), localStorage.setItem("scores", JSON.stringify(r)))
  }
  checkEndGame() {
    this.boxesOwned.toString() === this.maxScore && (this.gameOver = !0, this.registerScore(), this.endGameModal.open(this))
  }
  resetGame() {
    location.reload()
  }
  isNewBestScore(e, t) {
    if (e.length < 9) return !0;
    for (let r of e)
      if (t.player1 > r.player1) return !0;
    return !1
  }
  addNewBestScore(e, t) {
    e.push(t), e.sort(((e, t) => e.p1 > t.p1)), e.splice(10)
  }
};
var b = class {
  constructor(e, t) {
    const r = 2 * Math.sqrt(e) + 1;
    this.classes = t, this.boxes = this.generateBoxes(e), this.setupCssGrid(r), this.sharedSides = this.getSharedSides()
  }
  get availableSides() {
    const e = this.boxes.reduce(((e, t) => [...e, ...Object.entries(t.sideIds).filter((e => "" === e[1])).map((e => e[0]))]), []);
    return [...new Set(e)]
  }
  markBtnAsOwned(e, t) {
    e.classList.add(t.color), e.classList.remove(`${this.classes.selectable}`), e.disabled = !0, e.tabIndex = -1
  }
  markBoxAsOwned(e, t) {
    document.getElementById(e.id).classList.add(t.color)
  }
  boxIsCompleted = e => !Object.values(e.sideIds).includes("");
  getSharedSides() {
    let e = [];
    for (let t of this.boxes)
      for (let r of Object.entries(t.sideIds)) this.isBorder(r[0]) || e.push(r);
    return [...new Set(e)]
  }
  getAdjacentBoxes(e) {
    return this.boxes.filter((t => Object.keys(t.sideIds).includes(e)))
  }
  isBorder(e) {
    return 1 === this.getAdjacentBoxes(e).length
  }
  generateBoxes = e => {
    let t = [],
      r = Math.sqrt(e),
      n = 1,
      o = 1;
    for (let e = 0; e < r; e++) {
      o = 1;
      for (let e = 0; e < r; e++) t.push({
        id: `r${n+1}Content${e+1}`,
        owner: "",
        sideIds: {
          [`r${n}c${o+1}`]: "",
          [`r${n+1}c${o}`]: "",
          [`r${n+1}c${o+2}`]: "",
          [`r${n+2}c${o+1}`]: ""
        }
      }), o += 2;
      n += 2
    }
    return t
  };
  setupCssGrid(e) {
    const t = document.getElementById(`${this.classes.dotboxGrid}`);
    let r = "";
    for (let t = 1; t < e; t += 2) r += "auto 1fr ";
    r += "auto";
    let n = r;
    t.style["grid-template"] = `${r} / ${n}`
  }
};
class y extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    const e = this.getOptions();
    console.log(e);
    const t = 2 * Math.sqrt(e.boxNumber) + 1;
    this.grid = new i(e.boxNumber), this.innerHTML = this.grid.component(t);
    const r = new b(e.boxNumber, this.grid.classes);
    this.gameState = new p(r, e, this.grid.classes);
    const n = this.setUpAI(e.difficulty, r, this.gameState);
    this.gameController = new s(r, this.gameState, n, this.grid.classes), this.setUpEventListeners()
  }
  getOptions() {
    const e = localStorage.getItem("playerName"),
      t = localStorage.getItem("board"),
      r = localStorage.getItem("difficulty");
    return {
      playerName: e,
      board: t,
      boxNumber: localStorage.getItem("boxNumber"),
      difficulty: r
    }
  }
  setUpAI(e, t, r) {
    switch (e) {
      case "easy":
      default:
        return new c(t);
      case "medium":
        return new l(t);
      case "difficult":
        return new h(t, r)
    }
  }
  setUpEventListeners = () => {
    document.querySelectorAll(`.${this.grid.classes.sideBtn}`).forEach((e => {
      e.addEventListener("click", (t => {
        const r = e.getAttribute("id");
        this.gameController.chooseBoxSide(this.gameState.player1, r)
      }))
    }))
  }
}
customElements.define("dots-and-boxes", y);
//# sourceMappingURL=index.aa2c9b5a.js.map