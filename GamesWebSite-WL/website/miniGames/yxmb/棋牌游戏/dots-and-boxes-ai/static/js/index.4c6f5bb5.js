function e(e, t, r, o) {
    Object.defineProperty(e, t, {
        get: r,
        set: o,
        enumerable: !0,
        configurable: !0
    })
}
var t = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {},
    r = {},
    o = {},
    n = t.parcelRequired8e1;
null == n && ((n = function (e) {
    if (e in r) return r[e].exports;
    if (e in o) {
        var t = o[e];
        delete o[e];
        var n = {
            id: e,
            exports: {}
        };
        return r[e] = n, t.call(n.exports, n, n.exports), n.exports
    }
    var s = new Error("Cannot find module '" + e + "'");
    throw s.code = "MODULE_NOT_FOUND", s
}).register = function (e, t) {
    o[e] = t
}, t.parcelRequired8e1 = n), n.register("bXuNP", (function (t, r) {
    var o, n;
    e(t.exports, "register", (() => o), (e => o = e)), e(t.exports, "resolve", (() => n), (e => n = e));
    var s = {};
    o = function (e) {
        for (var t = Object.keys(e), r = 0; r < t.length; r++) s[t[r]] = e[t[r]]
    }, n = function (e) {
        var t = s[e];
        if (null == t) throw new Error("Could not resolve bundle with id " + e);
        return t
    }
})), n("bXuNP").register(JSON.parse('{"3IBLK":"index.4c6f5bb5.js","f1knV":"./sw.js"}'));
var s = class {
    constructor(e, t, r) {
        this.path = e, this.component = t, this.afterRender = r
    }
};
class a {
    outlet;
    routes;
    constructor(e) {
        this.routes = [], this.outlet = e
    }
    setRoutes(e) {
        e && 0 !== e.length && (e.forEach((({
            path: e,
            component: t,
            afterRender: r
        }) => {
            const o = new s(e, t, r);
            this.routes.push(o)
        })), this.navigate("/"), window.onpopstate = () => {
            this.navigate(location.pathname)
        })
    }
    navigate(e) {
        const t = this.routes.find((t => t.path == e));
        /* history.pushState({}, t.path, location.origin + t.path), */
         this.outlet.innerHTML = t.component, setTimeout((() => {
            this.updateLinks()
        }), 1e3), t.afterRender && t.afterRender()
    }
    updateLinks() {
        document.querySelectorAll("a").forEach((e => {
            if (e.hasListenerAttached) return;
            e.hasListenerAttached = !0;
            let t = e.getAttribute("href");
            if (null == t) return;
            if (t.match(/^(http|https)/) && "undefined" != typeof URL) return;
            e.addEventListener("click", (e => {
                e.preventDefault(), e.stopPropagation(), console.log(`%c ${t}`, "color:yellow;"), this.navigate(t)
            }))
        }))
    }
}
var i;
n.register("kPq84", (function (t, r) {
    var o;
    e(t.exports, "getBundleURL", (() => o), (e => o = e));
    var n = {};

    function s(e) {
        return ("" + e).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, "$1") + "/"
    }
    o = function (e) {
        var t = n[e];
        return t || (t = function () {
            try {
                throw new Error
            } catch (t) {
                var e = ("" + t.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
                if (e) return s(e[2])
            }
            return "/"
        }(), n[e] = t), t
    }
})), i = n("kPq84").getBundleURL("3IBLK") + n("bXuNP").resolve("f1knV");
new class {
    constructor() {
        const e = document.querySelector("main"),
            t = new a(e);
        localStorage.getItem("playerName") || (localStorage.setItem("playerName", "Player 1 👑"), localStorage.setItem("board", "3x3"), localStorage.setItem("boxNumber", "9"), localStorage.setItem("difficulty", "medium")), t.setRoutes([{
            path: "/",
            component: "<game-options></game-options>"
        }, {
            path: "/game",
            component: "<dots-and-boxes></dots-and-boxes>"
        }, {
            path: "/scores",
            component: "<game-scores></game-scores>"
        }]), this.registerServiceWorker()
    }
    registerServiceWorker() {
        const e = new URL(i);
        "serviceWorker" in navigator && window.addEventListener("load", (function () {
            navigator.serviceWorker.register(e).then((function (e) {
                console.log("ServiceWorker registration successful with scope: ", e.scope)
            }), (function (e) {
                console.log("ServiceWorker registration failed: ", e)
            }))
        }))
    }
};
//# sourceMappingURL=index.4c6f5bb5.js.map