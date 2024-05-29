var rough = (function () {
  "use strict";
  function t(t, e, s) {
    if (t && t.length) {
      const [n, a] = e,
        o = (Math.PI / 180) * s,
        h = Math.cos(o),
        r = Math.sin(o);
      t.forEach((t) => {
        const [e, s] = t;
        (t[0] = (e - n) * h - (s - a) * r + n),
          (t[1] = (e - n) * r + (s - a) * h + a);
      });
    }
  }
  function e(t) {
    const e = t[0],
      s = t[1];
    return Math.sqrt(Math.pow(e[0] - s[0], 2) + Math.pow(e[1] - s[1], 2));
  }
  function s(e, s) {
    const n = s.hachureAngle + 90;
    let a = s.hachureGap;
    a < 0 && (a = 4 * s.strokeWidth), (a = Math.max(a, 0.1));
    const o = [0, 0];
    if (n) for (const s of e) t(s, o, n);
    const h = (function (t, e) {
      const s = [];
      for (const e of t) {
        const t = [...e];
        t[0].join(",") !== t[t.length - 1].join(",") &&
          t.push([t[0][0], t[0][1]]),
          t.length > 2 && s.push(t);
      }
      const n = [];
      e = Math.max(e, 0.1);
      const a = [];
      for (const t of s)
        for (let e = 0; e < t.length - 1; e++) {
          const s = t[e],
            n = t[e + 1];
          if (s[1] !== n[1]) {
            const t = Math.min(s[1], n[1]);
            a.push({
              ymin: t,
              ymax: Math.max(s[1], n[1]),
              x: t === s[1] ? s[0] : n[0],
              islope: (n[0] - s[0]) / (n[1] - s[1]),
            });
          }
        }
      if (
        (a.sort((t, e) =>
          t.ymin < e.ymin
            ? -1
            : t.ymin > e.ymin
            ? 1
            : t.x < e.x
            ? -1
            : t.x > e.x
            ? 1
            : t.ymax === e.ymax
            ? 0
            : (t.ymax - e.ymax) / Math.abs(t.ymax - e.ymax)
        ),
        !a.length)
      )
        return n;
      let o = [],
        h = a[0].ymin;
      for (; o.length || a.length; ) {
        if (a.length) {
          let t = -1;
          for (let e = 0; e < a.length && !(a[e].ymin > h); e++) t = e;
          a.splice(0, t + 1).forEach((t) => {
            o.push({ s: h, edge: t });
          });
        }
        if (
          ((o = o.filter((t) => !(t.edge.ymax <= h))),
          o.sort((t, e) =>
            t.edge.x === e.edge.x
              ? 0
              : (t.edge.x - e.edge.x) / Math.abs(t.edge.x - e.edge.x)
          ),
          o.length > 1)
        )
          for (let t = 0; t < o.length; t += 2) {
            const e = t + 1;
            if (e >= o.length) break;
            const s = o[t].edge,
              a = o[e].edge;
            n.push([
              [Math.round(s.x), h],
              [Math.round(a.x), h],
            ]);
          }
        (h += e),
          o.forEach((t) => {
            t.edge.x = t.edge.x + e * t.edge.islope;
          });
      }
      return n;
    })(e, a);
    if (n) {
      for (const s of e) t(s, o, -n);
      !(function (e, s, n) {
        const a = [];
        e.forEach((t) => a.push(...t)), t(a, s, n);
      })(h, o, -n);
    }
    return h;
  }
  class n {
    constructor(t) {
      this.helper = t;
    }
    fillPolygons(t, e) {
      return this._fillPolygons(t, e);
    }
    _fillPolygons(t, e) {
      const n = s(t, e);
      return { type: "fillSketch", ops: this.renderLines(n, e) };
    }
    renderLines(t, e) {
      const s = [];
      for (const n of t)
        s.push(
          ...this.helper.doubleLineOps(n[0][0], n[0][1], n[1][0], n[1][1], e)
        );
      return s;
    }
  }
  class a extends n {
    fillPolygons(t, n) {
      let a = n.hachureGap;
      a < 0 && (a = 4 * n.strokeWidth), (a = Math.max(a, 0.1));
      const o = s(t, Object.assign({}, n, { hachureGap: a })),
        h = (Math.PI / 180) * n.hachureAngle,
        r = [],
        i = 0.5 * a * Math.cos(h),
        c = 0.5 * a * Math.sin(h);
      for (const [t, s] of o)
        e([t, s]) &&
          r.push(
            [[t[0] - i, t[1] + c], [...s]],
            [[t[0] + i, t[1] - c], [...s]]
          );
      return { type: "fillSketch", ops: this.renderLines(r, n) };
    }
  }
  class o extends n {
    fillPolygons(t, e) {
      const s = this._fillPolygons(t, e),
        n = Object.assign({}, e, { hachureAngle: e.hachureAngle + 90 }),
        a = this._fillPolygons(t, n);
      return (s.ops = s.ops.concat(a.ops)), s;
    }
  }
  class h {
    constructor(t) {
      this.helper = t;
    }
    fillPolygons(t, e) {
      const n = s(t, (e = Object.assign({}, e, { hachureAngle: 0 })));
      return this.dotsOnLines(n, e);
    }
    dotsOnLines(t, s) {
      const n = [];
      let a = s.hachureGap;
      a < 0 && (a = 4 * s.strokeWidth), (a = Math.max(a, 0.1));
      let o = s.fillWeight;
      o < 0 && (o = s.strokeWidth / 2);
      const h = a / 4;
      for (const r of t) {
        const t = e(r),
          i = t / a,
          c = Math.ceil(i) - 1,
          l = t - c * a,
          u = (r[0][0] + r[1][0]) / 2 - a / 4,
          p = Math.min(r[0][1], r[1][1]);
        for (let t = 0; t < c; t++) {
          const e = p + l + t * a,
            r = u - h + 2 * Math.random() * h,
            i = e - h + 2 * Math.random() * h,
            c = this.helper.ellipse(r, i, o, o, s);
          n.push(...c.ops);
        }
      }
      return { type: "fillSketch", ops: n };
    }
  }
  class r {
    constructor(t) {
      this.helper = t;
    }
    fillPolygons(t, e) {
      const n = s(t, e);
      return { type: "fillSketch", ops: this.dashedLine(n, e) };
    }
    dashedLine(t, s) {
      const n =
          s.dashOffset < 0
            ? s.hachureGap < 0
              ? 4 * s.strokeWidth
              : s.hachureGap
            : s.dashOffset,
        a =
          s.dashGap < 0
            ? s.hachureGap < 0
              ? 4 * s.strokeWidth
              : s.hachureGap
            : s.dashGap,
        o = [];
      return (
        t.forEach((t) => {
          const h = e(t),
            r = Math.floor(h / (n + a)),
            i = (h + a - r * (n + a)) / 2;
          let c = t[0],
            l = t[1];
          c[0] > l[0] && ((c = t[1]), (l = t[0]));
          const u = Math.atan((l[1] - c[1]) / (l[0] - c[0]));
          for (let t = 0; t < r; t++) {
            const e = t * (n + a),
              h = e + n,
              r = [
                c[0] + e * Math.cos(u) + i * Math.cos(u),
                c[1] + e * Math.sin(u) + i * Math.sin(u),
              ],
              l = [
                c[0] + h * Math.cos(u) + i * Math.cos(u),
                c[1] + h * Math.sin(u) + i * Math.sin(u),
              ];
            o.push(...this.helper.doubleLineOps(r[0], r[1], l[0], l[1], s));
          }
        }),
        o
      );
    }
  }
  class i {
    constructor(t) {
      this.helper = t;
    }
    fillPolygons(t, e) {
      const n = e.hachureGap < 0 ? 4 * e.strokeWidth : e.hachureGap,
        a = e.zigzagOffset < 0 ? n : e.zigzagOffset,
        o = s(t, (e = Object.assign({}, e, { hachureGap: n + a })));
      return { type: "fillSketch", ops: this.zigzagLines(o, a, e) };
    }
    zigzagLines(t, s, n) {
      const a = [];
      return (
        t.forEach((t) => {
          const o = e(t),
            h = Math.round(o / (2 * s));
          let r = t[0],
            i = t[1];
          r[0] > i[0] && ((r = t[1]), (i = t[0]));
          const c = Math.atan((i[1] - r[1]) / (i[0] - r[0]));
          for (let t = 0; t < h; t++) {
            const e = 2 * t * s,
              o = 2 * (t + 1) * s,
              h = Math.sqrt(2 * Math.pow(s, 2)),
              i = [r[0] + e * Math.cos(c), r[1] + e * Math.sin(c)],
              l = [r[0] + o * Math.cos(c), r[1] + o * Math.sin(c)],
              u = [
                i[0] + h * Math.cos(c + Math.PI / 4),
                i[1] + h * Math.sin(c + Math.PI / 4),
              ];
            a.push(
              ...this.helper.doubleLineOps(i[0], i[1], u[0], u[1], n),
              ...this.helper.doubleLineOps(u[0], u[1], l[0], l[1], n)
            );
          }
        }),
        a
      );
    }
  }
  const c = {};
  class l {
    constructor(t) {
      this.seed = t;
    }
    next() {
      return this.seed
        ? ((2 ** 31 - 1) & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31
        : Math.random();
    }
  }
  const u = {
    A: 7,
    a: 7,
    C: 6,
    c: 6,
    H: 1,
    h: 1,
    L: 2,
    l: 2,
    M: 2,
    m: 2,
    Q: 4,
    q: 4,
    S: 4,
    s: 4,
    T: 2,
    t: 2,
    V: 1,
    v: 1,
    Z: 0,
    z: 0,
  };
  function p(t, e) {
    return t.type === e;
  }
  function f(t) {
    const e = [],
      s = (function (t) {
        const e = new Array();
        for (; "" !== t; )
          if (t.match(/^([ \t\r\n,]+)/)) t = t.substr(RegExp.$1.length);
          else if (t.match(/^([aAcChHlLmMqQsStTvVzZ])/))
            (e[e.length] = { type: 0, text: RegExp.$1 }),
              (t = t.substr(RegExp.$1.length));
          else {
            if (
              !t.match(
                /^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/
              )
            )
              return [];
            (e[e.length] = { type: 1, text: `${parseFloat(RegExp.$1)}` }),
              (t = t.substr(RegExp.$1.length));
          }
        return (e[e.length] = { type: 2, text: "" }), e;
      })(t);
    let n = "BOD",
      a = 0,
      o = s[a];
    for (; !p(o, 2); ) {
      let h = 0;
      const r = [];
      if ("BOD" === n) {
        if ("M" !== o.text && "m" !== o.text) return f("M0,0" + t);
        a++, (h = u[o.text]), (n = o.text);
      } else p(o, 1) ? (h = u[n]) : (a++, (h = u[o.text]), (n = o.text));
      if (!(a + h < s.length)) throw new Error("Path data ended short");
      for (let t = a; t < a + h; t++) {
        const e = s[t];
        if (!p(e, 1))
          throw new Error("Param not a number: " + n + "," + e.text);
        r[r.length] = +e.text;
      }
      if ("number" != typeof u[n]) throw new Error("Bad segment: " + n);
      {
        const t = { key: n, data: r };
        e.push(t),
          (a += h),
          (o = s[a]),
          "M" === n && (n = "L"),
          "m" === n && (n = "l");
      }
    }
    return e;
  }
  function d(t) {
    let e = 0,
      s = 0,
      n = 0,
      a = 0;
    const o = [];
    for (const { key: h, data: r } of t)
      switch (h) {
        case "M":
          o.push({ key: "M", data: [...r] }), ([e, s] = r), ([n, a] = r);
          break;
        case "m":
          (e += r[0]),
            (s += r[1]),
            o.push({ key: "M", data: [e, s] }),
            (n = e),
            (a = s);
          break;
        case "L":
          o.push({ key: "L", data: [...r] }), ([e, s] = r);
          break;
        case "l":
          (e += r[0]), (s += r[1]), o.push({ key: "L", data: [e, s] });
          break;
        case "C":
          o.push({ key: "C", data: [...r] }), (e = r[4]), (s = r[5]);
          break;
        case "c": {
          const t = r.map((t, n) => (n % 2 ? t + s : t + e));
          o.push({ key: "C", data: t }), (e = t[4]), (s = t[5]);
          break;
        }
        case "Q":
          o.push({ key: "Q", data: [...r] }), (e = r[2]), (s = r[3]);
          break;
        case "q": {
          const t = r.map((t, n) => (n % 2 ? t + s : t + e));
          o.push({ key: "Q", data: t }), (e = t[2]), (s = t[3]);
          break;
        }
        case "A":
          o.push({ key: "A", data: [...r] }), (e = r[5]), (s = r[6]);
          break;
        case "a":
          (e += r[5]),
            (s += r[6]),
            o.push({ key: "A", data: [r[0], r[1], r[2], r[3], r[4], e, s] });
          break;
        case "H":
          o.push({ key: "H", data: [...r] }), (e = r[0]);
          break;
        case "h":
          (e += r[0]), o.push({ key: "H", data: [e] });
          break;
        case "V":
          o.push({ key: "V", data: [...r] }), (s = r[0]);
          break;
        case "v":
          (s += r[0]), o.push({ key: "V", data: [s] });
          break;
        case "S":
          o.push({ key: "S", data: [...r] }), (e = r[2]), (s = r[3]);
          break;
        case "s": {
          const t = r.map((t, n) => (n % 2 ? t + s : t + e));
          o.push({ key: "S", data: t }), (e = t[2]), (s = t[3]);
          break;
        }
        case "T":
          o.push({ key: "T", data: [...r] }), (e = r[0]), (s = r[1]);
          break;
        case "t":
          (e += r[0]), (s += r[1]), o.push({ key: "T", data: [e, s] });
          break;
        case "Z":
        case "z":
          o.push({ key: "Z", data: [] }), (e = n), (s = a);
      }
    return o;
  }
  function g(t) {
    const e = [];
    let s = "",
      n = 0,
      a = 0,
      o = 0,
      h = 0,
      r = 0,
      i = 0;
    for (const { key: c, data: l } of t) {
      switch (c) {
        case "M":
          e.push({ key: "M", data: [...l] }), ([n, a] = l), ([o, h] = l);
          break;
        case "C":
          e.push({ key: "C", data: [...l] }),
            (n = l[4]),
            (a = l[5]),
            (r = l[2]),
            (i = l[3]);
          break;
        case "L":
          e.push({ key: "L", data: [...l] }), ([n, a] = l);
          break;
        case "H":
          (n = l[0]), e.push({ key: "L", data: [n, a] });
          break;
        case "V":
          (a = l[0]), e.push({ key: "L", data: [n, a] });
          break;
        case "S": {
          let t = 0,
            o = 0;
          "C" === s || "S" === s
            ? ((t = n + (n - r)), (o = a + (a - i)))
            : ((t = n), (o = a)),
            e.push({ key: "C", data: [t, o, ...l] }),
            (r = l[0]),
            (i = l[1]),
            (n = l[2]),
            (a = l[3]);
          break;
        }
        case "T": {
          const [t, o] = l;
          let h = 0,
            c = 0;
          "Q" === s || "T" === s
            ? ((h = n + (n - r)), (c = a + (a - i)))
            : ((h = n), (c = a));
          const u = n + (2 * (h - n)) / 3,
            p = a + (2 * (c - a)) / 3,
            f = t + (2 * (h - t)) / 3,
            d = o + (2 * (c - o)) / 3;
          e.push({ key: "C", data: [u, p, f, d, t, o] }),
            (r = h),
            (i = c),
            (n = t),
            (a = o);
          break;
        }
        case "Q": {
          const [t, s, o, h] = l,
            c = n + (2 * (t - n)) / 3,
            u = a + (2 * (s - a)) / 3,
            p = o + (2 * (t - o)) / 3,
            f = h + (2 * (s - h)) / 3;
          e.push({ key: "C", data: [c, u, p, f, o, h] }),
            (r = t),
            (i = s),
            (n = o),
            (a = h);
          break;
        }
        case "A": {
          const t = Math.abs(l[0]),
            s = Math.abs(l[1]),
            o = l[2],
            h = l[3],
            r = l[4],
            i = l[5],
            c = l[6];
          if (0 === t || 0 === s)
            e.push({ key: "C", data: [n, a, i, c, i, c] }), (n = i), (a = c);
          else if (n !== i || a !== c) {
            k(n, a, i, c, t, s, o, h, r).forEach(function (t) {
              e.push({ key: "C", data: t });
            }),
              (n = i),
              (a = c);
          }
          break;
        }
        case "Z":
          e.push({ key: "Z", data: [] }), (n = o), (a = h);
      }
      s = c;
    }
    return e;
  }
  function M(t, e, s) {
    return [
      t * Math.cos(s) - e * Math.sin(s),
      t * Math.sin(s) + e * Math.cos(s),
    ];
  }
  function k(t, e, s, n, a, o, h, r, i, c) {
    const l = ((u = h), (Math.PI * u) / 180);
    var u;
    let p = [],
      f = 0,
      d = 0,
      g = 0,
      b = 0;
    if (c) [f, d, g, b] = c;
    else {
      ([t, e] = M(t, e, -l)), ([s, n] = M(s, n, -l));
      const h = (t - s) / 2,
        c = (e - n) / 2;
      let u = (h * h) / (a * a) + (c * c) / (o * o);
      u > 1 && ((u = Math.sqrt(u)), (a *= u), (o *= u));
      const p = a * a,
        k = o * o,
        y = p * k - p * c * c - k * h * h,
        m = p * c * c + k * h * h,
        w = (r === i ? -1 : 1) * Math.sqrt(Math.abs(y / m));
      (g = (w * a * c) / o + (t + s) / 2),
        (b = (w * -o * h) / a + (e + n) / 2),
        (f = Math.asin(parseFloat(((e - b) / o).toFixed(9)))),
        (d = Math.asin(parseFloat(((n - b) / o).toFixed(9)))),
        t < g && (f = Math.PI - f),
        s < g && (d = Math.PI - d),
        f < 0 && (f = 2 * Math.PI + f),
        d < 0 && (d = 2 * Math.PI + d),
        i && f > d && (f -= 2 * Math.PI),
        !i && d > f && (d -= 2 * Math.PI);
    }
    let y = d - f;
    if (Math.abs(y) > (120 * Math.PI) / 180) {
      const t = d,
        e = s,
        r = n;
      (d =
        i && d > f
          ? f + ((120 * Math.PI) / 180) * 1
          : f + ((120 * Math.PI) / 180) * -1),
        (p = k(
          (s = g + a * Math.cos(d)),
          (n = b + o * Math.sin(d)),
          e,
          r,
          a,
          o,
          h,
          0,
          i,
          [d, t, g, b]
        ));
    }
    y = d - f;
    const m = Math.cos(f),
      w = Math.sin(f),
      x = Math.cos(d),
      P = Math.sin(d),
      v = Math.tan(y / 4),
      O = (4 / 3) * a * v,
      S = (4 / 3) * o * v,
      L = [t, e],
      T = [t + O * w, e - S * m],
      D = [s + O * P, n - S * x],
      A = [s, n];
    if (((T[0] = 2 * L[0] - T[0]), (T[1] = 2 * L[1] - T[1]), c))
      return [T, D, A].concat(p);
    {
      p = [T, D, A].concat(p);
      const t = [];
      for (let e = 0; e < p.length; e += 3) {
        const s = M(p[e][0], p[e][1], l),
          n = M(p[e + 1][0], p[e + 1][1], l),
          a = M(p[e + 2][0], p[e + 2][1], l);
        t.push([s[0], s[1], n[0], n[1], a[0], a[1]]);
      }
      return t;
    }
  }
  const b = {
    randOffset: function (t, e) {
      return A(t, e);
    },
    randOffsetWithRange: function (t, e, s) {
      return D(t, e, s);
    },
    ellipse: function (t, e, s, n, a) {
      const o = P(s, n, a);
      return v(t, e, a, o).opset;
    },
    doubleLineOps: function (t, e, s, n, a) {
      return I(t, e, s, n, a, !0);
    },
  };
  function y(t, e, s, n, a) {
    return { type: "path", ops: I(t, e, s, n, a) };
  }
  function m(t, e, s) {
    const n = (t || []).length;
    if (n > 2) {
      const a = [];
      for (let e = 0; e < n - 1; e++)
        a.push(...I(t[e][0], t[e][1], t[e + 1][0], t[e + 1][1], s));
      return (
        e && a.push(...I(t[n - 1][0], t[n - 1][1], t[0][0], t[0][1], s)),
        { type: "path", ops: a }
      );
    }
    return 2 === n
      ? y(t[0][0], t[0][1], t[1][0], t[1][1], s)
      : { type: "path", ops: [] };
  }
  function w(t, e, s, n, a) {
    return (function (t, e) {
      return m(t, !0, e);
    })(
      [
        [t, e],
        [t + s, e],
        [t + s, e + n],
        [t, e + n],
      ],
      a
    );
  }
  function x(t, e) {
    let s = _(t, 1 * (1 + 0.2 * e.roughness), e);
    if (!e.disableMultiStroke) {
      const n = _(
        t,
        1.5 * (1 + 0.22 * e.roughness),
        (function (t) {
          const e = Object.assign({}, t);
          (e.randomizer = void 0), t.seed && (e.seed = t.seed + 1);
          return e;
        })(e)
      );
      s = s.concat(n);
    }
    return { type: "path", ops: s };
  }
  function P(t, e, s) {
    const n = Math.sqrt(
        2 * Math.PI * Math.sqrt((Math.pow(t / 2, 2) + Math.pow(e / 2, 2)) / 2)
      ),
      a = Math.ceil(
        Math.max(s.curveStepCount, (s.curveStepCount / Math.sqrt(200)) * n)
      ),
      o = (2 * Math.PI) / a;
    let h = Math.abs(t / 2),
      r = Math.abs(e / 2);
    const i = 1 - s.curveFitting;
    return (
      (h += A(h * i, s)), (r += A(r * i, s)), { increment: o, rx: h, ry: r }
    );
  }
  function v(t, e, s, n) {
    const [a, o] = z(
      n.increment,
      t,
      e,
      n.rx,
      n.ry,
      1,
      n.increment * D(0.1, D(0.4, 1, s), s),
      s
    );
    let h = W(a, null, s);
    if (!s.disableMultiStroke && 0 !== s.roughness) {
      const [a] = z(n.increment, t, e, n.rx, n.ry, 1.5, 0, s),
        o = W(a, null, s);
      h = h.concat(o);
    }
    return { estimatedPoints: o, opset: { type: "path", ops: h } };
  }
  function O(t, e, s, n, a, o, h, r, i) {
    const c = t,
      l = e;
    let u = Math.abs(s / 2),
      p = Math.abs(n / 2);
    (u += A(0.01 * u, i)), (p += A(0.01 * p, i));
    let f = a,
      d = o;
    for (; f < 0; ) (f += 2 * Math.PI), (d += 2 * Math.PI);
    d - f > 2 * Math.PI && ((f = 0), (d = 2 * Math.PI));
    const g = (2 * Math.PI) / i.curveStepCount,
      M = Math.min(g / 2, (d - f) / 2),
      k = E(M, c, l, u, p, f, d, 1, i);
    if (!i.disableMultiStroke) {
      const t = E(M, c, l, u, p, f, d, 1.5, i);
      k.push(...t);
    }
    return (
      h &&
        (r
          ? k.push(
              ...I(c, l, c + u * Math.cos(f), l + p * Math.sin(f), i),
              ...I(c, l, c + u * Math.cos(d), l + p * Math.sin(d), i)
            )
          : k.push(
              { op: "lineTo", data: [c, l] },
              { op: "lineTo", data: [c + u * Math.cos(f), l + p * Math.sin(f)] }
            )),
      { type: "path", ops: k }
    );
  }
  function S(t, e) {
    const s = [];
    for (const n of t)
      if (n.length) {
        const t = e.maxRandomnessOffset || 0,
          a = n.length;
        if (a > 2) {
          s.push({ op: "move", data: [n[0][0] + A(t, e), n[0][1] + A(t, e)] });
          for (let o = 1; o < a; o++)
            s.push({
              op: "lineTo",
              data: [n[o][0] + A(t, e), n[o][1] + A(t, e)],
            });
        }
      }
    return { type: "fillPath", ops: s };
  }
  function L(t, e) {
    return (function (t, e) {
      let s = t.fillStyle || "hachure";
      if (!c[s])
        switch (s) {
          case "zigzag":
            c[s] || (c[s] = new a(e));
            break;
          case "cross-hatch":
            c[s] || (c[s] = new o(e));
            break;
          case "dots":
            c[s] || (c[s] = new h(e));
            break;
          case "dashed":
            c[s] || (c[s] = new r(e));
            break;
          case "zigzag-line":
            c[s] || (c[s] = new i(e));
            break;
          case "hachure":
          default:
            (s = "hachure"), c[s] || (c[s] = new n(e));
        }
      return c[s];
    })(e, b).fillPolygons(t, e);
  }
  function T(t) {
    return (
      t.randomizer || (t.randomizer = new l(t.seed || 0)), t.randomizer.next()
    );
  }
  function D(t, e, s, n = 1) {
    return s.roughness * n * (T(s) * (e - t) + t);
  }
  function A(t, e, s = 1) {
    return D(-t, t, e, s);
  }
  function I(t, e, s, n, a, o = !1) {
    const h = o ? a.disableMultiStrokeFill : a.disableMultiStroke,
      r = C(t, e, s, n, a, !0, !1);
    if (h) return r;
    const i = C(t, e, s, n, a, !0, !0);
    return r.concat(i);
  }
  function C(t, e, s, n, a, o, h) {
    const r = Math.pow(t - s, 2) + Math.pow(e - n, 2),
      i = Math.sqrt(r);
    let c = 1;
    c = i < 200 ? 1 : i > 500 ? 0.4 : -0.0016668 * i + 1.233334;
    let l = a.maxRandomnessOffset || 0;
    l * l * 100 > r && (l = i / 10);
    const u = l / 2,
      p = 0.2 + 0.2 * T(a);
    let f = (a.bowing * a.maxRandomnessOffset * (n - e)) / 200,
      d = (a.bowing * a.maxRandomnessOffset * (t - s)) / 200;
    (f = A(f, a, c)), (d = A(d, a, c));
    const g = [],
      M = () => A(u, a, c),
      k = () => A(l, a, c),
      b = a.preserveVertices;
    return (
      o &&
        (h
          ? g.push({ op: "move", data: [t + (b ? 0 : M()), e + (b ? 0 : M())] })
          : g.push({
              op: "move",
              data: [t + (b ? 0 : A(l, a, c)), e + (b ? 0 : A(l, a, c))],
            })),
      h
        ? g.push({
            op: "bcurveTo",
            data: [
              f + t + (s - t) * p + M(),
              d + e + (n - e) * p + M(),
              f + t + 2 * (s - t) * p + M(),
              d + e + 2 * (n - e) * p + M(),
              s + (b ? 0 : M()),
              n + (b ? 0 : M()),
            ],
          })
        : g.push({
            op: "bcurveTo",
            data: [
              f + t + (s - t) * p + k(),
              d + e + (n - e) * p + k(),
              f + t + 2 * (s - t) * p + k(),
              d + e + 2 * (n - e) * p + k(),
              s + (b ? 0 : k()),
              n + (b ? 0 : k()),
            ],
          }),
      g
    );
  }
  function _(t, e, s) {
    const n = [];
    n.push([t[0][0] + A(e, s), t[0][1] + A(e, s)]),
      n.push([t[0][0] + A(e, s), t[0][1] + A(e, s)]);
    for (let a = 1; a < t.length; a++)
      n.push([t[a][0] + A(e, s), t[a][1] + A(e, s)]),
        a === t.length - 1 && n.push([t[a][0] + A(e, s), t[a][1] + A(e, s)]);
    return W(n, null, s);
  }
  function W(t, e, s) {
    const n = t.length,
      a = [];
    if (n > 3) {
      const o = [],
        h = 1 - s.curveTightness;
      a.push({ op: "move", data: [t[1][0], t[1][1]] });
      for (let e = 1; e + 2 < n; e++) {
        const s = t[e];
        (o[0] = [s[0], s[1]]),
          (o[1] = [
            s[0] + (h * t[e + 1][0] - h * t[e - 1][0]) / 6,
            s[1] + (h * t[e + 1][1] - h * t[e - 1][1]) / 6,
          ]),
          (o[2] = [
            t[e + 1][0] + (h * t[e][0] - h * t[e + 2][0]) / 6,
            t[e + 1][1] + (h * t[e][1] - h * t[e + 2][1]) / 6,
          ]),
          (o[3] = [t[e + 1][0], t[e + 1][1]]),
          a.push({
            op: "bcurveTo",
            data: [o[1][0], o[1][1], o[2][0], o[2][1], o[3][0], o[3][1]],
          });
      }
      if (e && 2 === e.length) {
        const t = s.maxRandomnessOffset;
        a.push({ op: "lineTo", data: [e[0] + A(t, s), e[1] + A(t, s)] });
      }
    } else
      3 === n
        ? (a.push({ op: "move", data: [t[1][0], t[1][1]] }),
          a.push({
            op: "bcurveTo",
            data: [t[1][0], t[1][1], t[2][0], t[2][1], t[2][0], t[2][1]],
          }))
        : 2 === n && a.push(...I(t[0][0], t[0][1], t[1][0], t[1][1], s));
    return a;
  }
  function z(t, e, s, n, a, o, h, r) {
    const i = [],
      c = [];
    if (0 === r.roughness) {
      (t /= 4), c.push([e + n * Math.cos(-t), s + a * Math.sin(-t)]);
      for (let o = 0; o <= 2 * Math.PI; o += t) {
        const t = [e + n * Math.cos(o), s + a * Math.sin(o)];
        i.push(t), c.push(t);
      }
      c.push([e + n * Math.cos(0), s + a * Math.sin(0)]),
        c.push([e + n * Math.cos(t), s + a * Math.sin(t)]);
    } else {
      const l = A(0.5, r) - Math.PI / 2;
      c.push([
        A(o, r) + e + 0.9 * n * Math.cos(l - t),
        A(o, r) + s + 0.9 * a * Math.sin(l - t),
      ]);
      const u = 2 * Math.PI + l - 0.01;
      for (let h = l; h < u; h += t) {
        const t = [
          A(o, r) + e + n * Math.cos(h),
          A(o, r) + s + a * Math.sin(h),
        ];
        i.push(t), c.push(t);
      }
      c.push([
        A(o, r) + e + n * Math.cos(l + 2 * Math.PI + 0.5 * h),
        A(o, r) + s + a * Math.sin(l + 2 * Math.PI + 0.5 * h),
      ]),
        c.push([
          A(o, r) + e + 0.98 * n * Math.cos(l + h),
          A(o, r) + s + 0.98 * a * Math.sin(l + h),
        ]),
        c.push([
          A(o, r) + e + 0.9 * n * Math.cos(l + 0.5 * h),
          A(o, r) + s + 0.9 * a * Math.sin(l + 0.5 * h),
        ]);
    }
    return [c, i];
  }
  function E(t, e, s, n, a, o, h, r, i) {
    const c = o + A(0.1, i),
      l = [];
    l.push([
      A(r, i) + e + 0.9 * n * Math.cos(c - t),
      A(r, i) + s + 0.9 * a * Math.sin(c - t),
    ]);
    for (let o = c; o <= h; o += t)
      l.push([A(r, i) + e + n * Math.cos(o), A(r, i) + s + a * Math.sin(o)]);
    return (
      l.push([e + n * Math.cos(h), s + a * Math.sin(h)]),
      l.push([e + n * Math.cos(h), s + a * Math.sin(h)]),
      W(l, null, i)
    );
  }
  function $(t, e, s, n, a, o, h, r) {
    const i = [],
      c = [r.maxRandomnessOffset || 1, (r.maxRandomnessOffset || 1) + 0.3];
    let l = [0, 0];
    const u = r.disableMultiStroke ? 1 : 2,
      p = r.preserveVertices;
    for (let f = 0; f < u; f++)
      0 === f
        ? i.push({ op: "move", data: [h[0], h[1]] })
        : i.push({
            op: "move",
            data: [h[0] + (p ? 0 : A(c[0], r)), h[1] + (p ? 0 : A(c[0], r))],
          }),
        (l = p ? [a, o] : [a + A(c[f], r), o + A(c[f], r)]),
        i.push({
          op: "bcurveTo",
          data: [
            t + A(c[f], r),
            e + A(c[f], r),
            s + A(c[f], r),
            n + A(c[f], r),
            l[0],
            l[1],
          ],
        });
    return i;
  }
  function G(t) {
    return [...t];
  }
  function R(t, e) {
    return Math.pow(t[0] - e[0], 2) + Math.pow(t[1] - e[1], 2);
  }
  function q(t, e, s) {
    const n = R(e, s);
    if (0 === n) return R(t, e);
    let a = ((t[0] - e[0]) * (s[0] - e[0]) + (t[1] - e[1]) * (s[1] - e[1])) / n;
    return (a = Math.max(0, Math.min(1, a))), R(t, j(e, s, a));
  }
  function j(t, e, s) {
    return [t[0] + (e[0] - t[0]) * s, t[1] + (e[1] - t[1]) * s];
  }
  function F(t, e, s, n) {
    const a = n || [];
    if (
      (function (t, e) {
        const s = t[e + 0],
          n = t[e + 1],
          a = t[e + 2],
          o = t[e + 3];
        let h = 3 * n[0] - 2 * s[0] - o[0];
        h *= h;
        let r = 3 * n[1] - 2 * s[1] - o[1];
        r *= r;
        let i = 3 * a[0] - 2 * o[0] - s[0];
        i *= i;
        let c = 3 * a[1] - 2 * o[1] - s[1];
        return (c *= c), h < i && (h = i), r < c && (r = c), h + r;
      })(t, e) < s
    ) {
      const s = t[e + 0];
      if (a.length) {
        ((o = a[a.length - 1]), (h = s), Math.sqrt(R(o, h))) > 1 && a.push(s);
      } else a.push(s);
      a.push(t[e + 3]);
    } else {
      const n = 0.5,
        o = t[e + 0],
        h = t[e + 1],
        r = t[e + 2],
        i = t[e + 3],
        c = j(o, h, n),
        l = j(h, r, n),
        u = j(r, i, n),
        p = j(c, l, n),
        f = j(l, u, n),
        d = j(p, f, n);
      F([o, c, p, d], 0, s, a), F([d, f, u, i], 0, s, a);
    }
    var o, h;
    return a;
  }
  function V(t, e) {
    return Z(t, 0, t.length, e);
  }
  function Z(t, e, s, n, a) {
    const o = a || [],
      h = t[e],
      r = t[s - 1];
    let i = 0,
      c = 1;
    for (let n = e + 1; n < s - 1; ++n) {
      const e = q(t[n], h, r);
      e > i && ((i = e), (c = n));
    }
    return (
      Math.sqrt(i) > n
        ? (Z(t, e, c + 1, n, o), Z(t, c, s, n, o))
        : (o.length || o.push(h), o.push(r)),
      o
    );
  }
  function Q(t, e = 0.15, s) {
    const n = [],
      a = (t.length - 1) / 3;
    for (let s = 0; s < a; s++) {
      F(t, 3 * s, e, n);
    }
    return s && s > 0 ? Z(n, 0, n.length, s) : n;
  }
  const H = "none";
  class N {
    constructor(t) {
      (this.defaultOptions = {
        maxRandomnessOffset: 2,
        roughness: 1,
        bowing: 1,
        stroke: "#000",
        strokeWidth: 1,
        curveTightness: 0,
        curveFitting: 0.95,
        curveStepCount: 9,
        fillStyle: "hachure",
        fillWeight: -1,
        hachureAngle: -41,
        hachureGap: -1,
        dashOffset: -1,
        dashGap: -1,
        zigzagOffset: -1,
        seed: 0,
        disableMultiStroke: !1,
        disableMultiStrokeFill: !1,
        preserveVertices: !1,
      }),
        (this.config = t || {}),
        this.config.options &&
          (this.defaultOptions = this._o(this.config.options));
    }
    static newSeed() {
      return Math.floor(Math.random() * 2 ** 31);
    }
    _o(t) {
      return t
        ? Object.assign({}, this.defaultOptions, t)
        : this.defaultOptions;
    }
    _d(t, e, s) {
      return { shape: t, sets: e || [], options: s || this.defaultOptions };
    }
    line(t, e, s, n, a) {
      const o = this._o(a);
      return this._d("line", [y(t, e, s, n, o)], o);
    }
    rectangle(t, e, s, n, a) {
      const o = this._o(a),
        h = [],
        r = w(t, e, s, n, o);
      if (o.fill) {
        const a = [
          [t, e],
          [t + s, e],
          [t + s, e + n],
          [t, e + n],
        ];
        "solid" === o.fillStyle ? h.push(S([a], o)) : h.push(L([a], o));
      }
      return o.stroke !== H && h.push(r), this._d("rectangle", h, o);
    }
    ellipse(t, e, s, n, a) {
      const o = this._o(a),
        h = [],
        r = P(s, n, o),
        i = v(t, e, o, r);
      if (o.fill)
        if ("solid" === o.fillStyle) {
          const s = v(t, e, o, r).opset;
          (s.type = "fillPath"), h.push(s);
        } else h.push(L([i.estimatedPoints], o));
      return o.stroke !== H && h.push(i.opset), this._d("ellipse", h, o);
    }
    circle(t, e, s, n) {
      const a = this.ellipse(t, e, s, s, n);
      return (a.shape = "circle"), a;
    }
    linearPath(t, e) {
      const s = this._o(e);
      return this._d("linearPath", [m(t, !1, s)], s);
    }
    arc(t, e, s, n, a, o, h = !1, r) {
      const i = this._o(r),
        c = [],
        l = O(t, e, s, n, a, o, h, !0, i);
      if (h && i.fill)
        if ("solid" === i.fillStyle) {
          const h = Object.assign({}, i);
          h.disableMultiStroke = !0;
          const r = O(t, e, s, n, a, o, !0, !1, h);
          (r.type = "fillPath"), c.push(r);
        } else
          c.push(
            (function (t, e, s, n, a, o, h) {
              const r = t,
                i = e;
              let c = Math.abs(s / 2),
                l = Math.abs(n / 2);
              (c += A(0.01 * c, h)), (l += A(0.01 * l, h));
              let u = a,
                p = o;
              for (; u < 0; ) (u += 2 * Math.PI), (p += 2 * Math.PI);
              p - u > 2 * Math.PI && ((u = 0), (p = 2 * Math.PI));
              const f = (p - u) / h.curveStepCount,
                d = [];
              for (let t = u; t <= p; t += f)
                d.push([r + c * Math.cos(t), i + l * Math.sin(t)]);
              return (
                d.push([r + c * Math.cos(p), i + l * Math.sin(p)]),
                d.push([r, i]),
                L([d], h)
              );
            })(t, e, s, n, a, o, i)
          );
      return i.stroke !== H && c.push(l), this._d("arc", c, i);
    }
    curve(t, e) {
      const s = this._o(e),
        n = [],
        a = x(t, s);
      if (s.fill && s.fill !== H && t.length >= 3) {
        const e = Q(
          (function (t, e = 0) {
            const s = t.length;
            if (s < 3)
              throw new Error("A curve must have at least three points.");
            const n = [];
            if (3 === s) n.push(G(t[0]), G(t[1]), G(t[2]), G(t[2]));
            else {
              const s = [];
              s.push(t[0], t[0]);
              for (let e = 1; e < t.length; e++)
                s.push(t[e]), e === t.length - 1 && s.push(t[e]);
              const a = [],
                o = 1 - e;
              n.push(G(s[0]));
              for (let t = 1; t + 2 < s.length; t++) {
                const e = s[t];
                (a[0] = [e[0], e[1]]),
                  (a[1] = [
                    e[0] + (o * s[t + 1][0] - o * s[t - 1][0]) / 6,
                    e[1] + (o * s[t + 1][1] - o * s[t - 1][1]) / 6,
                  ]),
                  (a[2] = [
                    s[t + 1][0] + (o * s[t][0] - o * s[t + 2][0]) / 6,
                    s[t + 1][1] + (o * s[t][1] - o * s[t + 2][1]) / 6,
                  ]),
                  (a[3] = [s[t + 1][0], s[t + 1][1]]),
                  n.push(a[1], a[2], a[3]);
              }
            }
            return n;
          })(t),
          10,
          (1 + s.roughness) / 2
        );
        "solid" === s.fillStyle ? n.push(S([e], s)) : n.push(L([e], s));
      }
      return s.stroke !== H && n.push(a), this._d("curve", n, s);
    }
    polygon(t, e) {
      const s = this._o(e),
        n = [],
        a = m(t, !0, s);
      return (
        s.fill &&
          ("solid" === s.fillStyle ? n.push(S([t], s)) : n.push(L([t], s))),
        s.stroke !== H && n.push(a),
        this._d("polygon", n, s)
      );
    }
    path(t, e) {
      const s = this._o(e),
        n = [];
      if (!t) return this._d("path", n, s);
      t = (t || "")
        .replace(/\n/g, " ")
        .replace(/(-\s)/g, "-")
        .replace("/(ss)/g", " ");
      const a = s.fill && "transparent" !== s.fill && s.fill !== H,
        o = s.stroke !== H,
        h = !!(s.simplification && s.simplification < 1),
        r = (function (t, e, s) {
          const n = g(d(f(t))),
            a = [];
          let o = [],
            h = [0, 0],
            r = [];
          const i = () => {
              r.length >= 4 && o.push(...Q(r, e)), (r = []);
            },
            c = () => {
              i(), o.length && (a.push(o), (o = []));
            };
          for (const { key: t, data: e } of n)
            switch (t) {
              case "M":
                c(), (h = [e[0], e[1]]), o.push(h);
                break;
              case "L":
                i(), o.push([e[0], e[1]]);
                break;
              case "C":
                if (!r.length) {
                  const t = o.length ? o[o.length - 1] : h;
                  r.push([t[0], t[1]]);
                }
                r.push([e[0], e[1]]),
                  r.push([e[2], e[3]]),
                  r.push([e[4], e[5]]);
                break;
              case "Z":
                i(), o.push([h[0], h[1]]);
            }
          if ((c(), !s)) return a;
          const l = [];
          for (const t of a) {
            const e = V(t, s);
            e.length && l.push(e);
          }
          return l;
        })(t, 1, h ? 4 - 4 * s.simplification : (1 + s.roughness) / 2);
      return (
        a && ("solid" === s.fillStyle ? n.push(S(r, s)) : n.push(L(r, s))),
        o &&
          (h
            ? r.forEach((t) => {
                n.push(m(t, !1, s));
              })
            : n.push(
                (function (t, e) {
                  const s = g(d(f(t))),
                    n = [];
                  let a = [0, 0],
                    o = [0, 0];
                  for (const { key: t, data: h } of s)
                    switch (t) {
                      case "M": {
                        const t = 1 * (e.maxRandomnessOffset || 0),
                          s = e.preserveVertices;
                        n.push({
                          op: "move",
                          data: h.map((n) => n + (s ? 0 : A(t, e))),
                        }),
                          (o = [h[0], h[1]]),
                          (a = [h[0], h[1]]);
                        break;
                      }
                      case "L":
                        n.push(...I(o[0], o[1], h[0], h[1], e)),
                          (o = [h[0], h[1]]);
                        break;
                      case "C": {
                        const [t, s, a, r, i, c] = h;
                        n.push(...$(t, s, a, r, i, c, o, e)), (o = [i, c]);
                        break;
                      }
                      case "Z":
                        n.push(...I(o[0], o[1], a[0], a[1], e)),
                          (o = [a[0], a[1]]);
                    }
                  return { type: "path", ops: n };
                })(t, s)
              )),
        this._d("path", n, s)
      );
    }
    opsToPath(t, e) {
      let s = "";
      for (const n of t.ops) {
        const t =
          "number" == typeof e && e >= 0
            ? n.data.map((t) => +t.toFixed(e))
            : n.data;
        switch (n.op) {
          case "move":
            s += `M${t[0]} ${t[1]} `;
            break;
          case "bcurveTo":
            s += `C${t[0]} ${t[1]}, ${t[2]} ${t[3]}, ${t[4]} ${t[5]} `;
            break;
          case "lineTo":
            s += `L${t[0]} ${t[1]} `;
        }
      }
      return s.trim();
    }
    toPaths(t) {
      const e = t.sets || [],
        s = t.options || this.defaultOptions,
        n = [];
      for (const t of e) {
        let e = null;
        switch (t.type) {
          case "path":
            e = {
              d: this.opsToPath(t),
              stroke: s.stroke,
              strokeWidth: s.strokeWidth,
              fill: H,
            };
            break;
          case "fillPath":
            e = {
              d: this.opsToPath(t),
              stroke: H,
              strokeWidth: 0,
              fill: s.fill || H,
            };
            break;
          case "fillSketch":
            e = this.fillSketch(t, s);
        }
        e && n.push(e);
      }
      return n;
    }
    fillSketch(t, e) {
      let s = e.fillWeight;
      return (
        s < 0 && (s = e.strokeWidth / 2),
        { d: this.opsToPath(t), stroke: e.fill || H, strokeWidth: s, fill: H }
      );
    }
  }
  class B {
    constructor(t, e) {
      (this.canvas = t),
        (this.ctx = this.canvas.getContext("2d")),
        (this.gen = new N(e));
    }
    draw(t) {
      const e = t.sets || [],
        s = t.options || this.getDefaultOptions(),
        n = this.ctx,
        a = t.options.fixedDecimalPlaceDigits;
      for (const o of e)
        switch (o.type) {
          case "path":
            n.save(),
              (n.strokeStyle = "none" === s.stroke ? "transparent" : s.stroke),
              (n.lineWidth = s.strokeWidth),
              s.strokeLineDash && n.setLineDash(s.strokeLineDash),
              s.strokeLineDashOffset &&
                (n.lineDashOffset = s.strokeLineDashOffset),
              this._drawToContext(n, o, a),
              n.restore();
            break;
          case "fillPath": {
            n.save(), (n.fillStyle = s.fill || "");
            const e =
              "curve" === t.shape || "polygon" === t.shape || "path" === t.shape
                ? "evenodd"
                : "nonzero";
            this._drawToContext(n, o, a, e), n.restore();
            break;
          }
          case "fillSketch":
            this.fillSketch(n, o, s);
        }
    }
    fillSketch(t, e, s) {
      let n = s.fillWeight;
      n < 0 && (n = s.strokeWidth / 2),
        t.save(),
        s.fillLineDash && t.setLineDash(s.fillLineDash),
        s.fillLineDashOffset && (t.lineDashOffset = s.fillLineDashOffset),
        (t.strokeStyle = s.fill || ""),
        (t.lineWidth = n),
        this._drawToContext(t, e, s.fixedDecimalPlaceDigits),
        t.restore();
    }
    _drawToContext(t, e, s, n = "nonzero") {
      t.beginPath();
      for (const n of e.ops) {
        const e =
          "number" == typeof s && s >= 0
            ? n.data.map((t) => +t.toFixed(s))
            : n.data;
        switch (n.op) {
          case "move":
            t.moveTo(e[0], e[1]);
            break;
          case "bcurveTo":
            t.bezierCurveTo(e[0], e[1], e[2], e[3], e[4], e[5]);
            break;
          case "lineTo":
            t.lineTo(e[0], e[1]);
        }
      }
      "fillPath" === e.type ? t.fill(n) : t.stroke();
    }
    get generator() {
      return this.gen;
    }
    getDefaultOptions() {
      return this.gen.defaultOptions;
    }
    line(t, e, s, n, a) {
      const o = this.gen.line(t, e, s, n, a);
      return this.draw(o), o;
    }
    rectangle(t, e, s, n, a) {
      const o = this.gen.rectangle(t, e, s, n, a);
      return this.draw(o), o;
    }
    ellipse(t, e, s, n, a) {
      const o = this.gen.ellipse(t, e, s, n, a);
      return this.draw(o), o;
    }
    circle(t, e, s, n) {
      const a = this.gen.circle(t, e, s, n);
      return this.draw(a), a;
    }
    linearPath(t, e) {
      const s = this.gen.linearPath(t, e);
      return this.draw(s), s;
    }
    polygon(t, e) {
      const s = this.gen.polygon(t, e);
      return this.draw(s), s;
    }
    arc(t, e, s, n, a, o, h = !1, r) {
      const i = this.gen.arc(t, e, s, n, a, o, h, r);
      return this.draw(i), i;
    }
    curve(t, e) {
      const s = this.gen.curve(t, e);
      return this.draw(s), s;
    }
    path(t, e) {
      const s = this.gen.path(t, e);
      return this.draw(s), s;
    }
  }
  const J = "http://www.w3.org/2000/svg";
  class K {
    constructor(t, e) {
      (this.svg = t), (this.gen = new N(e));
    }
    draw(t) {
      const e = t.sets || [],
        s = t.options || this.getDefaultOptions(),
        n = this.svg.ownerDocument || window.document,
        a = n.createElementNS(J, "g"),
        o = t.options.fixedDecimalPlaceDigits;
      for (const h of e) {
        let e = null;
        switch (h.type) {
          case "path":
            (e = n.createElementNS(J, "path")),
              e.setAttribute("d", this.opsToPath(h, o)),
              e.setAttribute("stroke", s.stroke),
              e.setAttribute("stroke-width", s.strokeWidth + ""),
              e.setAttribute("fill", "none"),
              s.strokeLineDash &&
                e.setAttribute(
                  "stroke-dasharray",
                  s.strokeLineDash.join(" ").trim()
                ),
              s.strokeLineDashOffset &&
                e.setAttribute(
                  "stroke-dashoffset",
                  `${s.strokeLineDashOffset}`
                );
            break;
          case "fillPath":
            (e = n.createElementNS(J, "path")),
              e.setAttribute("d", this.opsToPath(h, o)),
              e.setAttribute("stroke", "none"),
              e.setAttribute("stroke-width", "0"),
              e.setAttribute("fill", s.fill || ""),
              ("curve" !== t.shape && "polygon" !== t.shape) ||
                e.setAttribute("fill-rule", "evenodd");
            break;
          case "fillSketch":
            e = this.fillSketch(n, h, s);
        }
        e && a.appendChild(e);
      }
      return a;
    }
    fillSketch(t, e, s) {
      let n = s.fillWeight;
      n < 0 && (n = s.strokeWidth / 2);
      const a = t.createElementNS(J, "path");
      return (
        a.setAttribute("d", this.opsToPath(e, s.fixedDecimalPlaceDigits)),
        a.setAttribute("stroke", s.fill || ""),
        a.setAttribute("stroke-width", n + ""),
        a.setAttribute("fill", "none"),
        s.fillLineDash &&
          a.setAttribute("stroke-dasharray", s.fillLineDash.join(" ").trim()),
        s.fillLineDashOffset &&
          a.setAttribute("stroke-dashoffset", `${s.fillLineDashOffset}`),
        a
      );
    }
    get generator() {
      return this.gen;
    }
    getDefaultOptions() {
      return this.gen.defaultOptions;
    }
    opsToPath(t, e) {
      return this.gen.opsToPath(t, e);
    }
    line(t, e, s, n, a) {
      const o = this.gen.line(t, e, s, n, a);
      return this.draw(o);
    }
    rectangle(t, e, s, n, a) {
      const o = this.gen.rectangle(t, e, s, n, a);
      return this.draw(o);
    }
    ellipse(t, e, s, n, a) {
      const o = this.gen.ellipse(t, e, s, n, a);
      return this.draw(o);
    }
    circle(t, e, s, n) {
      const a = this.gen.circle(t, e, s, n);
      return this.draw(a);
    }
    linearPath(t, e) {
      const s = this.gen.linearPath(t, e);
      return this.draw(s);
    }
    polygon(t, e) {
      const s = this.gen.polygon(t, e);
      return this.draw(s);
    }
    arc(t, e, s, n, a, o, h = !1, r) {
      const i = this.gen.arc(t, e, s, n, a, o, h, r);
      return this.draw(i);
    }
    curve(t, e) {
      const s = this.gen.curve(t, e);
      return this.draw(s);
    }
    path(t, e) {
      const s = this.gen.path(t, e);
      return this.draw(s);
    }
  }
  return {
    canvas: (t, e) => new B(t, e),
    svg: (t, e) => new K(t, e),
    generator: (t) => new N(t),
    newSeed: () => N.newSeed(),
  };
})();






const cS = Math.min(window.innerWidth, window.innerHeight);

let mode = Math.random() <= 0.3 ? 1 : 0;
let bgClr = [];
let special = Math.random() <= 0.017 ? true : false;
let bgMode = "";
let colorChoice = Math.random();
bgClr = [cusrand(0, 360), 50, 93];
let fills = ["none", "hachure", "zigzag", "cross-hatch", "dashed", "zigzag-line", "dots", "solid"]
let squareType = cusrand(0, 6);
let rare = Math.random() <= 0.2 ? true : false;
let accent1 = "white", accent2 = "black";
let accent_temp1 = accent1, accent_temp2 = accent2;



function flip() {
  return Math.random() <= 0.5? -1 : 1;
}

function space(rough, cnvs) {
  let md = half()
  if (md) {
    rough.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
  }
  else {
    rough.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent1 });
  }
  let starT = half(4, 6)
  rough.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "cross-hatch", hachureGap: 1, fill: md ? accent1 : accent2 });
  let points = generateRandomPoints(5, cnvs.width - 5, 5, cnvs.height - 5, 130, 25, 800);
  red = false;
  for (let i = 0; i < points.length; i++) {

    cnvs.push();
    cnvs.fill(md ? accent2 : accent1);

    cnvs.noStroke()
    if (Math.random() <= 0.3) {
      if (rare) {
        if (!red) {
          cnvs.fill("#E0115F");
          red = true;
        }
      }
      star(points[i][0], points[i][1], 2, 4, starT, cnvs)
    }
    else {
      cnvs.ellipse(points[i][0], points[i][1], cusrand(2, 4))
    }
    cnvs.pop();
  }
}

function truna(rough, cnvs) {
  let md = half()
  if (md) {
    rough.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
  }
  else {
    rough.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent1 });
  }
  let trunaFill = ["hachure", "zigzag", "cross-hatch", "dashed", "zigzag-line", "dots"].random();
  rough.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: trunaFill, hachureGap: 2, fill: md ? accent1 : accent2 });
  if (!["zigzag", "zigzag-line", "dashed"].includes(trunaFill)) {
    rough.polygon([[160, 60], [305, 35], [640, 60], [640, 155], [305, 180], [160, 155], [160, 60]], { fillStyle: half() ? "solid" : "cross-hatch", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1, fillWidth: md ? 1 : 1, strokeWidth: 2, hachureGap: 2 })
    let crS = 270;
    rough.line(crS, 107, crS + 80, 107, { stroke: md ? accent1 : accent2, strokeWidth: 3 })
    rough.line(crS + 20, 87, crS + 20, 127, { stroke: md ? accent1 : accent2, strokeWidth: 3 })
  } else {
    rough.polygon([[160, 60], [305, 35], [640, 60], [640, 155], [305, 180], [160, 155], [160, 60]], { fillStyle: half() ? "solid" : "cross-hatch", fill: accent2, stroke: accent2, fillWidth: md ? 1 : 1, strokeWidth: 2, hachureGap: 2 })
    let crS = 270;
    rough.line(crS, 107, crS + 80, 107, { stroke: accent1, strokeWidth: 3 })
    rough.line(crS + 20, 87, crS + 20, 127, { stroke: accent1, strokeWidth: 3 })
  }
}

let wb = { true: accent1, false: accent2 }

function piano(rough, cnvs) {
  let white = 50, black = 20, ang = half() ? cusrand(20, 160) : cusrand(-160, -20);

  let md = Math.random() <= 0.3
  if (md) {
    rough.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
  }
  else {
    rough.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent1 });
  }
  keyStroke = md ? true : false;
  for (let i = 0; i < 16; i++) {
    rough.rectangle(white * i, 0, white, cnvs.height, { fill: Math.random() <= 0.3 ? (md ? accent1 : accent2) : "", hachureAngle: ang, stroke: wb[keyStroke] })
    if (i != 0) { rough.rectangle(white * i - 10, 0, black, cnvs.height / 2, { fill: wb[keyStroke], fillStyle: "solid", stroke: wb[keyStroke] }) }

  }



}


function vikno(roug, cnvs) {
  let white = 50, black = 20, ang = half() ? cusrand(20, 160) : cusrand(-160, -20);
  let bg = ["hachure", "zigzag", "cross-hatch", "dashed", "zigzag-line"].random()
  let md = half();
  if (md) {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fill: accent2, hachureGap: 3, fillStyle: bg, hachureAngle: half() ? cusrand(20, 160) : cusrand(-160, -20) });
  }
  else {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fill: accent1, hachureGap: 3, fillStyle: bg, hachureAngle: half() ? cusrand(20, 160) : cusrand(-160, -20) });
  }






  roug.rectangle(0, cnvs.height / 2 - 15 / 2, cnvs.width, 15, { hachureGap: 1, fillStyle: "cross-hatch", fill: md ? accent2 : accent1 })
  roug.rectangle(cnvs.width / 2 - 15 / 2, 0, 15, cnvs.height, { hachureGap: 1, fillStyle: "cross-hatch", fill: md ? accent2 : accent1 })
  if (Math.random() <= 0.33) {
    roug.rectangle(cnvs.width / 4 - 15 / 2, 0, 15, cnvs.height, { hachureGap: 1, fillStyle: "cross-hatch", fill: md ? accent2 : accent1 })
    roug.rectangle(cnvs.width / 1.3 - 15 / 2, 0, 15, cnvs.height, { hachureGap: 1, fillStyle: "cross-hatch", fill: md ? accent2 : accent1 })
  }
  roug.rectangle(0, 0, cnvs.width, 20, { hachureGap: 1, fillStyle: "cross-hatch", fill: md ? accent2 : accent1 })
  roug.rectangle(cnvs.width - 20, 0, 20, cnvs.height, { hachureGap: 1, fillStyle: "cross-hatch", fill: md ? accent2 : accent1 })
  roug.rectangle(0, 0, 20, cnvs.height, { hachureGap: 1, fillStyle: "cross-hatch", fill: md ? accent2 : accent1 })

  let side = half() ? true : false;
  let locX = 415, locY = cusrand(100, 180);
  let pnts = [];
  pnts.push([locX, 0])
  for (let i = 0; i < 20; i++) {
    pnts.push([locX + 20 * i, i % 2 ? locY : locY - 10])
  }
  pnts.push([pnts[pnts.length - 1][0], 0])
  pnts.push([locX, 0])


  if (side) {
    roug.curve(pnts, { fill: md ? accent1 : accent2, hachureGap: 1, fillStyle: "cross-hatch", curveFitting: 5 })
  }
  else {
    cnvs.push()
    cnvs.scale(-1, 1)
    cnvs.translate(-cnvs.width, 0)
    roug.curve(pnts, { fill: md ? accent1 : accent2, hachureGap: 1, fillStyle: "cross-hatch", curveFitting: 5 })
    cnvs.pop()
  }


  let potCnvs = createGraphics(70, 120);
  let potRough = rough.canvas(potCnvs.elt)

  potRough.rectangle(5, 15, 60, 10, { fill: md ? accent2 : accent1, fillStyle: "solid" })
  potRough.polygon([[10, 25], [60, 25], [55, 60], [15, 60], [10, 25]], { fill: md ? accent2 : accent1, fillStyle: "solid" })
  let potLoc = half() ? cusrand(70, cnvs.width / 2 - 70) : cusrand(cnvs.width / 2 + 70, cnvs.width - 70)
  cnvs.image(potCnvs, potLoc, cnvs.height - 70)

  cenX = potLoc + 33, cenY = cnvs.height - 55;

  plantPoints = []
  let leng = cusrand(2, 7, [3, 4])

  for (let i = 0; i < leng; i++) {
    let s = half()
    plantPoints.push([s ? (i % 2 == 0 ? cenX + cusrand(3, 6) : cenX - cusrand(3, 6)) : (i % 2 != 0 ? cenX + cusrand(3, 6) : cenX - cusrand(3, 6)), cenY - i * 20])
  }

  roug.curve(plantPoints, { strokeWidth: 2, stroke: md ? accent2 : accent1})

  let c = 0
  for (let p = 0; p < plantPoints.length; p++) {
    const element = plantPoints[p];

    if (p == plantPoints.length - 1) {
      roug.curve([element, [element[0] + 3, element[1] - 7], [element[0] + 10, element[1] - 12], [element[0] + 9, element[1] - 5], [element[0], element[1]]], { fill: md ? accent2 : accent1, fillStyle: "solid", stroke: md ? accent2 : accent1 })
      roug.curve([element, [element[0] - 3, element[1] - 7], [element[0] - 10, element[1] - 12], [element[0] - 9, element[1] - 5], [element[0], element[1]]], { fill: md ? accent2 : accent1, fillStyle: "solid", stroke: md ? accent2 : accent1 })
    }
    else {
      if (Math.random() <= 0.5) {
        if (c == 0) {
          roug.curve([element, [element[0] + 3, element[1] - 7], [element[0] + 10, element[1] - 12], [element[0] + 9, element[1] - 5], [element[0], element[1]]], { fill: md ? accent2 : accent1, fillStyle: "solid", stroke: md ? accent2 : accent1 })
          c += 1;
        }
        else {
          roug.curve([element, [element[0] - 3, element[1] - 7], [element[0] - 10, element[1] - 12], [element[0] - 9, element[1] - 5], [element[0], element[1]]], { fill: md ? accent2 : accent1, fillStyle: "solid", stroke: md ? accent2 : accent1 })
          c -= 1;
        }
      }

    }

  }

  roug.rectangle(0, cnvs.height - 20, cnvs.width, 20, { hachureGap: 1, fillStyle: "cross-hatch", fill: md ? accent2 : accent1 })

}


function birds(roug, cnvs) {
  let bgFill = ["hachure", "zigzag", "dashed", "zigzag-line"].random()
  let ang = cusrand(0, 360);
  let width = cusrand(1, 3)
  let md = half();
  if (md) {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent2, fillWidth: width, hachureAngle: ang });
  }
  else {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent1, fillWidth: width, hachureAngle: ang });

  }



  for (let x = 0; x <= cnvs.width; x += 2) {
    let y = noise(x / 50) * 200;
    roug.line(x, cnvs.height, x, cnvs.height - y, { stroke: md ? accent2 : accent1 });
  }

  let points = generateRandomPoints(20, cnvs.width - 20, 20, 65
    , cusrand(4, 10), 40, 1000);
  for (let b = 0; b < points.length; b++) {
    wings = cusrand(10, 19)
    tail = cusrand(5, 7)
    ax = points[b][0], ay = points[b][1]
    roug.curve([[ax - wings, ay - tail], [ax, ay - 3], [ax, ay], [ax, ay - 3], [ax + wings, ay - tail]], { stroke: md ? accent2 : accent1, strokeWidth: 1.5 })

  }


}


function tile(domRough, leftN, rightN, md) {

  domRough.polygon([[40, 0], [80, 0], [80, 40], [40, 40], [40, 0], [0, 0], [0, 40], [40, 40]], { strokeWidth: 2, fillWidth: 1, hachureGap: 2, fillStyle: "solid", stroke: md ? accent2 : accent1, fill: md ? accent1 : accent2 })

  switch (leftN) {
    case 1:
      domRough.ellipse(20, 20, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      break;
    case 2:
      domRough.ellipse(12, 12, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(28, 28, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      break;
    case 3:
      domRough.ellipse(8, 8, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(32, 32, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(20, 20, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      break;
    case 4:
      domRough.ellipse(10, 10, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(30, 10, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(10, 30, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(30, 30, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      break;
    case 5:
      domRough.ellipse(10, 10, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(30, 10, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(20, 20, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(10, 30, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(30, 30, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      break;
    case 6:
      domRough.ellipse(9, 10, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(20, 10, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(31, 10, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })

      domRough.ellipse(9, 30, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(20, 30, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(31, 30, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      break;
  }
  switch (rightN) {
    case 1:
      domRough.ellipse(40 + 20, 20, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      break;
    case 2:
      domRough.ellipse(40 + 12, 12, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(40 + 28, 28, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      break;
    case 3:
      domRough.ellipse(40 + 8, 8, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(40 + 32, 32, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(40 + 20, 20, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      break;
    case 4:
      domRough.ellipse(40 + 10, 10, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(40 + 30, 10, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(40 + 10, 30, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(40 + 30, 30, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      break;
    case 5:
      domRough.ellipse(40 + 10, 10, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(40 + 30, 10, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(40 + 20, 20, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(40 + 10, 30, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(40 + 30, 30, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      break;
    case 6:
      domRough.ellipse(40 + 9, 10, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(40 + 20, 10, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(40 + 31, 10, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })

      domRough.ellipse(40 + 9, 30, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(40 + 20, 30, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      domRough.ellipse(40 + 31, 30, 8, 8, { fillStyle: "solid", fill: md ? accent2 : accent1, stroke: md ? accent2 : accent1 })
      break;
  }



}

function domino(roug, cnvs) {
  let doFill = ["hachure", "zigzag", "cross-hatch", "dashed", "zigzag-line"].random();
  let ang = cusrand(0, 360);
  let md = half();
  if (md) {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: doFill, fill: accent2, hachureAngle: ang });
  }
  else {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: doFill, fill: accent1, hachureAngle: ang });
    md = half()
  }

  let domCnvs = createGraphics(90, 50)
  let domRough = rough.canvas(domCnvs.elt)
  let y = cusrand(40, cnvs.height - 100), x = 40;
  let leftN = cusrand(1, 6), rightN = cusrand(1, 6);
  tile(domRough, leftN, rightN, md)

  cnvs.push()
  cnvs.angleMode(DEGREES)
  cnvs.translate(x, y)
  cnvs.rotate(90)
  cnvs.image(domCnvs, 0, 0)
  cnvs.pop()

  let dir = 0;


  if (half()) {

    leftN = rightN;
    rightN = cusrand(1, 6);

    domCnvs.clear()
    tile(domRough, leftN, rightN, md)

    cnvs.push()
    cnvs.translate(45, y + 40)
    cnvs.image(domCnvs, 0, 0)
    cnvs.pop()
    y += 40;
    x += 90;

  }
  else {
    rightN = cusrand(1, 6);

    domCnvs.clear();
    tile(domRough, leftN, rightN, md);

    cnvs.push();
    cnvs.angleMode(DEGREES);
    cnvs.translate(45, y);
    cnvs.image(domCnvs, 0, 0);
    cnvs.pop();
    x += 90;
  }


  for (let i = 0; i < 20; i++) {
    leftN = rightN;
    rightN = cusrand(1, 6);
    domCnvs.clear();
    tile(domRough, leftN, rightN, md);


    let choice;

    if (y <= 40) {
      choice = cusrand(0, 1);
      if (choice == 0 || dir != 0) {
        cnvs.push();
        cnvs.angleMode(DEGREES);
        cnvs.translate(x, y);
        cnvs.image(domCnvs, 0, 0);
        cnvs.pop();
        x += 85;
        dir = 0;
      }
      else {
        cnvs.push();
        cnvs.angleMode(DEGREES);
        cnvs.translate(x + 40, y);
        cnvs.rotate(90)
        cnvs.image(domCnvs, 0, 0);
        cnvs.pop();
        x += 45;
        y += 40;
        dir -= 1;
      }
    }
    else if (y >= 120) {
      choice = cusrand(0, 1);
      if (choice == 0 || dir != 0) {
        cnvs.push();
        cnvs.angleMode(DEGREES);
        cnvs.translate(x, y);
        cnvs.image(domCnvs, 0, 0);
        cnvs.pop();
        x += 85;
        dir = 0;
      }
      else {
        domCnvs.clear();
        tile(domRough, rightN, leftN, md);
        cnvs.push();
        cnvs.angleMode(DEGREES);
        cnvs.translate(x + 40, y - 40);
        cnvs.rotate(90)
        cnvs.image(domCnvs, 0, 0);
        cnvs.pop();
        x += 45;
        y -= 40;
        dir += 1;
      }
    }
    else {
      choice = cusrand(0, 2);
      if (choice == 0 || dir != 0) {
        cnvs.push();
        cnvs.angleMode(DEGREES);
        cnvs.translate(x, y);
        cnvs.image(domCnvs, 0, 0);
        cnvs.pop();
        x += 85;
        dir = 0;
      }

      else if (choice == 1) {
        domCnvs.clear();
        tile(domRough, rightN, leftN, md);
        cnvs.push();
        cnvs.angleMode(DEGREES);
        cnvs.translate(x + 40, y - 40);
        cnvs.rotate(90)
        cnvs.image(domCnvs, 0, 0);
        cnvs.pop();
        x += 45;
        y -= 40;
        dir += 1;
      }
      else if (choice == 2) {
        cnvs.push();
        cnvs.angleMode(DEGREES);
        cnvs.translate(x + 40, y);
        cnvs.rotate(90)
        cnvs.image(domCnvs, 0, 0);
        cnvs.pop();
        x += 45;
        y += 40;
        dir -= 1;
      }
    }


  }


}


function falling(roug, cnvs) {
  let bgFill = ["hachure", "zigzag", "dashed", "zigzag-line", "cross-hatch"].random()
  let ang = cusrand(0, 360);
  let md = half();
  if (md) {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent2, fillWidth: width, hachureAngle: ang });
  }
  else {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent1, fillWidth: width, hachureAngle: ang });

  }

  let dominoCnvs = createGraphics(53, 103)
  let dominoRough = rough.canvas(dominoCnvs.elt)

  let domCount = 20;
  for (let d = 1; d < 20; d++) {
    const angle = -exponentialAngleChange(90, d, 1.00065);
    dominoCnvs.clear()
    dominoRough.rectangle(0, 0, 25, 100, { strokeWidth: 2, fill: !md ? accent1 : accent2, fillStyle: "solid", stroke: !md ? accent2 : accent1 })
    dominoRough.line(1, 50, 25, 50, { strokeWidth: 2, stroke: !md ? accent2 : accent1 })
    if (d == domCount - 1) {
      cnvs.push();
      cnvs.translate(d * 50 - d * floatrand(14.5, 16.5, 2) + 55, cnvs.height / 2 + 60);
      cnvs.rotate(angle)
      cnvs.image(dominoCnvs, 0, 0);
      cnvs.pop();
    }
    else {
      cnvs.push();
      cnvs.translate(d * 50 - d * 17.3 + 55, cnvs.height / 2 + 60);
      cnvs.rotate(angle)
      cnvs.image(dominoCnvs, 0, 0);
      cnvs.pop();
    }


  }

  roug.line(50, cnvs.height / 2 + 60, cnvs.width - 50, cnvs.height / 2 + 60, { strokeWidth: 3, stroke: md ? accent2 : accent1 })

}

function pointOnLine(p1, p2, dist) {
  let xDiff = p2[0] - p1[0];
  let yDiff = p2[1] - p1[1];
  let lineLength = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  let scale = dist / lineLength;
  return [p1[0] + xDiff * scale, p1[1] + yDiff * scale];
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function getWigglyPoints(p1, p2, amp) {
  const curve = [];
  const diffX = p2.x - p1.x;
  const diffY = p2.y - p1.y;

  for (let t = 0; t <= 1; t += 0.01) {
    const x = p1.x + diffX * t;
    const y = p1.y + diffY * t + amp * Math.sin(2 * Math.PI * t);

    curve.push([x, y]);
  }

  return curve;
}

function rotateAndDraw(c1, c2, flip) {
  var w = c1.width;
  var h = c1.height;
  var offscreenCanvas = createGraphics(h, w);
  var flipCanvas = createGraphics(h, w);
 if (!flip){ 
  offscreenCanvas.push();
  offscreenCanvas.translate(h, 0);
  offscreenCanvas.rotate(radians(90));
  offscreenCanvas.image(c1, 0, 0);
  offscreenCanvas.pop();
  c2.image(offscreenCanvas, 0, 0);}
  else {
    offscreenCanvas.push();
    offscreenCanvas.translate(h, 0);
    offscreenCanvas.rotate(radians(90));
    offscreenCanvas.image(c1, 0, 0);
    offscreenCanvas.pop();
    flipCanvas.push();
    flipCanvas.scale(1, -1);
    flipCanvas.translate(0, -h/2);
    flipCanvas.image(offscreenCanvas, 0, 0)
    flipCanvas.pop()
    c2.image(flipCanvas, 0, 0);
  }
}

function lupa(roug, cnvs) {
  let bgFill = ["hachure", "zigzag", "dashed", "zigzag-line", "cross-hatch"].random()
  let ang = cusrand(0, 360);
  let md = half();
  if (md) {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent2, fillWidth: width, hachureAngle: ang });
  }
  else {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent1, fillWidth: width, hachureAngle: ang });

  }

  let lupaPos = [cusrand(100, cnvs.width-100), cusrand(100, cnvs.height-100)]
  let handle = []

while (true){
  point = ellipseRand(lupaPos[0], lupaPos[1], 250, 250)
 if( point[0] >= 10 && point[0] <= cnvs.width-10 && point[1] >= 10 && point[1] <= cnvs.height-10){
  handle = point;
  break;
 }
}

let footCnvs = createGraphics(60, 90)
let foot90Cnvs = createGraphics(90, 60)
let footRoug = rough.canvas(footCnvs.elt)

footRoug.curve([[16, 22], [18, 18], [30, 9], [37, 22], [34, 40], [32, 55], [25, 55], [20, 55], [16, 22]], {strokeWidth:2, fill:md?accent2:accent1, fillStyle:"solid", stroke:md?accent2:accent1})
footRoug.curve([[23, 65], [24, 80], [30, 85], [35, 80], [37, 76], [33, 65], [28, 65], [23, 65]], {strokeWidth:2, fill:md?accent2:accent1, fillStyle:"solid", stroke:md?accent2:accent1})


let stP = lupaPos[0] >= cnvs.width/2 ? {x:0, y:cusrand(0, cnvs.height)} : {x:cnvs.width, y:cusrand(0, cnvs.height)}

let curvTemp = getWigglyPoints(stP,{x:lupaPos[0], y:lupaPos[1]}, 30)
let curv = [], curv2 = []
for (let i = 0; i < curvTemp.length; i++) {
  if (i % 20 == 0 || i == curvTemp.length - 1){
    curv.push(curvTemp[i])
    if (i%2 == 0)
    curv2.push([curvTemp[i][0], curvTemp[i][1]-40])
    else 
    curv2.push([curvTemp[i][0], curvTemp[i][1]])
  }
}
for (let c = 0; c < curv2.length; c++) {
  const element = curv2[c];
  if (c%2==0){
foot90Cnvs.clear()
rotateAndDraw(footCnvs, foot90Cnvs, false)
cnvs.image(foot90Cnvs, element[0], element[1])
  }
  else {
    foot90Cnvs.clear()
rotateAndDraw(footCnvs, foot90Cnvs, true)
cnvs.image(foot90Cnvs, element[0], element[1])
  }

roug.line(pointOnLine(lupaPos, handle, 50)[0], pointOnLine(lupaPos, handle, 50)[1], Math.round(handle[0]), Math.round(handle[1]), {strokeWidth:15, stroke:md?accent1:accent1, seed:2})
  roug.ellipse(lupaPos[0], lupaPos[1], 100, 100, {stroke:md?accent1:accent1, strokeWidth:12, seed:1})
  roug.ellipse(lupaPos[0], lupaPos[1], 100, 100, {fillStyle:"cross-hatch", fill:md?accent1:accent1, strokeWidth:8, fillWeight:0.1, hachureGap:1.5, seed:1, stroke:md?accent2:accent2})
  roug.line(pointOnLine(lupaPos, handle, 55)[0], pointOnLine(lupaPos, handle, 50)[1], Math.round(handle[0]), Math.round(handle[1]), {strokeWidth:10, seed:2, stroke:md?accent2:accent2})
  let loc = cusrand(0, 360)
  roug.arc(lupaPos[0], lupaPos[1], 70, 70, toRadians(loc), toRadians(loc+60), false, {strokeWidth:2, stroke:md?accent2:accent2})






  
}

}


function letters(roug, cnvs){
  let bgFill = ["hachure", "zigzag", "dashed", "zigzag-line", "cross-hatch"].random()
  let gap = 4;
  if (bgFill == "cross-hatch" || bgFill == "hachure"){
    gap = 2;
  }
  let ang = cusrand(0, 360);
  let md = half();
  if (md) {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent2, fillWidth: width, hachureAngle: ang, hachureGap: gap});
  }
  else {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent1, fillWidth: width, hachureAngle: ang, hachureGap: gap});

  }

let points = generateRandomPoints(0, cnvs.width, 0, cnvs.height, 100, 20, 1000)
let lCnvs = createGraphics(200, 200)
let lRoug = rough.canvas(lCnvs.elt)
let allWhite = Math.random() <= 0.33;
let angl = cusrand(0, 360);
letterFill = ["hachure", "dashed"].random()
for (let p = 0; p < points.length; p++) {
  const point = points[p];

  lCnvs.clear()
  if (p%3!=0){
  lCnvs.push()
  lCnvs.translate(lCnvs.width/2, lCnvs.height/2)
  lCnvs.rotate(radians(cusrand(0 , 180)))
  let sx = 5, sy = 5, ex =  60, ey = 30;
  lRoug.rectangle(sx,sy, ex, ey, {stroke:"", fill:accent1, fillStyle:"solid"})
  if (!allWhite){
    if (Math.random() <= 0.5)
      lRoug.rectangle(sx,sy, ex, ey, {strokeWidth:2, fill:accent2, fillStyle:letterFill, fillWeight:0.8, hachureAngle:angl})
  }
  lRoug.polygon([[sx,sy], [sx+ex/2, sy+20], [sx+ex, sy]], {strokeWidth:2, fill:accent1, fillStyle:"solid"})

  lCnvs.pop()

  cnvs.image(lCnvs, point[0]-100, point[1]-100)}
  else {
    lCnvs.push()
    lCnvs.translate(lCnvs.width/2, lCnvs.height/2);
    lCnvs.rotate(radians(cusrand(0 , 180)));
    let sx = 5, sy = 5, ex =  60, ey = 30;
    lRoug.rectangle(sx,sy, ex, ey, {strokeWidth:2, fill:accent1, fillStyle:"solid"})
    lRoug.rectangle(10,10, 6, 8, { fill:accent2, fillStyle:"solid"})
    let wrType = cusrand(0,  2)
    if (wrType == 0)
    {
    let wrY = 15, wrX = 35;
    lRoug.curve([[wrX, wrY], [wrX+3, wrY+1], [wrX+5, wrY-1], [wrX+7, wrY+1], [wrX+9, wrY-1], [wrX+11, wrY+1], [wrX+13, wrY-1], [wrX+15, wrY+1]], {roughness:0.6})
    wrY = 25, wrX = 35;
    lRoug.curve([[wrX, wrY], [wrX+3, wrY+1], [wrX+5, wrY-1], [wrX+7, wrY+1], [wrX+9, wrY-1], [wrX+11, wrY+1], [wrX+13, wrY-1], [wrX+15, wrY+1]], {roughness:0.6})
}
else if (wrType == 1){
  let wrY = 20, wrX = 35;
  lRoug.curve([[wrX, wrY], [wrX+3, wrY+1], [wrX+5, wrY-1], [wrX+7, wrY+1], [wrX+9, wrY-1], [wrX+11, wrY+1], [wrX+13, wrY-1], [wrX+15, wrY+1]], {roughness:0.6})
}
else {
  let wrY = 13, wrX = 35;
  lRoug.curve([[wrX, wrY], [wrX+3, wrY+1], [wrX+5, wrY-1], [wrX+7, wrY+1], [wrX+9, wrY-1], [wrX+11, wrY+1], [wrX+13, wrY-1], [wrX+15, wrY+1]], {roughness:0.6})
  wrY = 20, wrX = 35;
  lRoug.curve([[wrX, wrY], [wrX+3, wrY+1], [wrX+5, wrY-1], [wrX+7, wrY+1], [wrX+9, wrY-1], [wrX+11, wrY+1], [wrX+13, wrY-1], [wrX+15, wrY+1]], {roughness:0.6})
  wrY = 27, wrX = 35;
  lRoug.curve([[wrX, wrY], [wrX+3, wrY+1], [wrX+5, wrY-1], [wrX+7, wrY+1], [wrX+9, wrY-1], [wrX+11, wrY+1], [wrX+13, wrY-1], [wrX+15, wrY+1]], {roughness:0.6})
}
    lCnvs.pop()
  
    cnvs.image(lCnvs, point[0]-100, point[1]-100)
  }
}

}


function forest (roug, cnvs){
  let bgFill = ["hachure", "zigzag", "dashed", "zigzag-line", "cross-hatch"].random()
  let ang = cusrand(0, 360);
let gap = ["cross-hatch", "hachure", "zigzag"].includes(bgFill) ? cusrand(4, 6) : cusrand(1, 5)
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent2, fillWidth: width, hachureAngle: ang, hachureGap:gap});


  for (let x = 0; x <= cnvs.width; x += 2) {
    let y = noise(x / 125) * 150;
    roug.line(x, cnvs.height - y, x, cnvs.height, { stroke:accent2 });
    sY = cnvs.height - y;
    eY = sY - cusrand(25, 50)

    if (x % cusrand(9, 11) == 0){
      roug.line(x, sY, x, eY, { stroke:accent2})

      for (let t = 0; t < sY-eY-cusrand(5, 9); t++) {
        
        tY = eY + t;

        if (t%4 == 0){
          
            roug.polygon([[Math.round(x-t/3), tY+3], [x, tY ], [Math.round(x+t/3), tY+3]], {stroke:accent2 })
        }

        
      }

    }

  }


}

function notation (roug, cnvs){
  let bgFill = ["hachure", "zigzag", "dashed", "zigzag-line", "cross-hatch"].random()
  let ang = cusrand(0, 360);
  let md = half();
  if (md) {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent1, fillWeight: 0.1, hachureAngle: ang });
  }
  else {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent1 });
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent2, fillWeight: 0.1, hachureAngle: ang });

  }
let l1 = 50, l2 = 130;
for (let i = 0; i < 5; i++) {
  roug.line (0, l1+i*10, cnvs.width, l1+i*10, {stroke: md?accent1:accent2, roughness:0.5})
}
for (let i = 0; i < 5; i++) {
  roug.line (0, l2+i*10, cnvs.width, l2+i*10, {stroke: md?accent1:accent2, roughness:0.5})
}

let note1 = createGraphics(40, 40)
let note1R = rough.canvas(note1.elt)
let note2 = createGraphics(80, 80)
let note2R = rough.canvas(note2.elt)
let empty = Math.random() <= 0.5;



let row1 = generateRandomPoints(25, cnvs.width - 10, 20, 70, 10, 40, 800)

for (let i = 0; i < row1.length; i++) {
  const p = row1[i];

  let note = Math.random() <= 0.3? 2: 1;
  let upside =   Math.random() <= 0.3? true:false;;
  note1.clear()
  note2.clear()

  if (note ==1)
  {
    if (upside==false)
    {

  note1.push()
  note1.translate(10, 30)
  note1.rotate(radians(150))
  note1R.ellipse(0, 0, 10, 5, {stroke: md?accent1:accent2, fill:empty?Math.random()<=0.5?accent2:(md?accent1:accent2):(md?accent1:accent2), fillStyle:"solid"})
  note1.pop()
  note1R.line(14, 30, 14, 2, {stroke: md?accent1:accent2})
  if (Math.random() <= 0.5){
  note1R.curve([[14, 2], [15, 5], [21, 10], [20, 20]], {stroke: md?accent1:accent2})}
  cnvs.image(note1, p[0], p[1])
}
else {

  note1.push()
  note1.translate(10, 30)
  note1.rotate(radians(150))
  note1R.ellipse(0, 0, 10, 5, {stroke: md?accent1:accent2, fill:empty?Math.random()<=0.5?accent2:(md?accent1:accent2):(md?accent1:accent2), fillStyle:"solid"})
  note1.pop()
  note1R.line(14, 30, 14, 2, {stroke: md?accent1:accent2})
  

  cnvs.push()
  cnvs.scale(-1, -1)
  cnvs.translate(-cnvs.width, -cnvs.height)
  cnvs.image(note1, cnvs.width-p[0]-20, cnvs.height/1.4-p[1])
  cnvs.pop()
}


}
else if (note == 2){
  let elFill = empty?Math.random()<=0.5?accent2:(md?accent1:accent2):(md?accent1:accent2);
  note2.push()
  note2.translate(10, 30)
  note2.rotate(radians(150))
  note2R.ellipse(0, 0, 10, 5, {stroke: md?accent1:accent2, fill:elFill, fillStyle:"solid"})
  note2.pop()
  note2R.line(14, 30, 14, 2, {stroke: md?accent1:accent2})
  note2.push()
  note2.translate(30, 35)
  note2.rotate(radians(150))
  note2R.ellipse(0, 0, 10, 5, {stroke: md?accent1:accent2, fill:elFill, fillStyle:"solid"})
  note2.pop()
  note2R.line(34, 35, 34, 7, {stroke: md?accent1:accent2})
  note2R.polygon([[14, 5], [14, 2], [34, 5], [34, 7],  [14, 5]], {stroke: md?accent1:accent2, fill:md?accent1:accent2, fillStyle:"solid"})
  
  cnvs.image(note2, p[0], p[1])
}

}


let row2 = generateRandomPoints(25, cnvs.width - 10, 100, 140, 10, 40, 800)
  
for (let i = 0; i < row2.length; i++) {
  const p = row2[i];

  let note = Math.random() <= 0.3? 2: 1;
  let upside =   Math.random() <= 0.3? true:false;;
  note1.clear()
  note2.clear()

  if (note ==1)
  {
    if (upside==false)
    {

  note1.push()
  note1.translate(10, 30)
  note1.rotate(radians(150))
  note1R.ellipse(0, 0, 10, 5, {stroke: md?accent1:accent2, fill:empty?Math.random()<=0.5?accent2:(md?accent1:accent2):(md?accent1:accent2), fillStyle:"solid"})
  note1.pop()
  note1R.line(14, 30, 14, 2, {stroke: md?accent1:accent2})
  if (Math.random() <= 0.5){
  note1R.curve([[14, 2], [15, 5], [21, 10], [20, 20]], {stroke: md?accent1:accent2})}
  cnvs.image(note1, p[0], p[1])
}
else {

  note1.push()
  note1.translate(10, 30)
  note1.rotate(radians(150))
  note1R.ellipse(0, 0, 10, 5, {stroke: md?accent1:accent2, fill:empty?Math.random()<=0.5?accent2:(md?accent1:accent2):(md?accent1:accent2), fillStyle:"solid"})
  note1.pop()
  note1R.line(14, 30, 14, 2, {stroke: md?accent1:accent2})
  

  cnvs.push()
  cnvs.scale(-1, -1)
  cnvs.translate(-cnvs.width, -cnvs.height)
  cnvs.image(note1, cnvs.width-p[0]-20, cnvs.height/1.4-p[1])
  cnvs.pop()
}


}
else if (note == 2){
  let elFill = empty?Math.random()<=0.5?accent2:(md?accent1:accent2):(md?accent1:accent2);
  note2.push()
  note2.translate(10, 30)
  note2.rotate(radians(150))
  note2R.ellipse(0, 0, 10, 5, {stroke: md?accent1:accent2, fill:elFill, fillStyle:"solid"})
  note2.pop()
  note2R.line(14, 30, 14, 2, {stroke: md?accent1:accent2})
  note2.push()
  note2.translate(30, 35)
  note2.rotate(radians(150))
  note2R.ellipse(0, 0, 10, 5, {stroke: md?accent1:accent2, fill:elFill, fillStyle:"solid"})
  note2.pop()
  note2R.line(34, 35, 34, 7, {stroke: md?accent1:accent2})
  note2R.polygon([[14, 5], [14, 2], [34, 5], [34, 7],  [14, 5]], {stroke: md?accent1:accent2, fill:md?accent1:accent2, fillStyle:"solid"})
  
  cnvs.image(note2, p[0], p[1])
}

}
  
  
}


function concatArrays(arr1, arr2) {
  const concatenatedArr = [];
  concatenatedArr.push(...arr1, ...arr2);
  return concatenatedArr.map((nestedArr) => [...nestedArr]);
}

const Gaps = {
  "hachure": 3,
  "zigzag":4, 
  "dashed":3, 
  "zigzag-line":2, 
  "cross-hatch":5
};

function dunes (roug, cnvs){
  let bgFill = ["hachure", "zigzag", "dashed", "zigzag-line", "cross-hatch"].random()
  let duneFill = ["hachure", "zigzag", "dashed", "cross-hatch"].random()

  while (bgFill == duneFill){
    duneFill = ["hachure", "zigzag", "dashed", "cross-hatch"].random()
  }

  
  let ang = cusrand(0, 360);
  let direction = Math.random() <= 0.6;
  let md = Math.random() <= 0.6;
  if (md) {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent1 });
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent2, hachureAngle: ang });
  }
  else {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent1, hachureAngle: ang });
  }

for (let x = 0; x <= cnvs.width; x += 2) {
    let y = noise(x / 50) * 200;
    roug.line(x, cnvs.height, x, cnvs.height - y, { stroke: md ? accent2 : accent1 });
  }




let triCnvs = createGraphics(400, 200)
let triRoug = rough.canvas(triCnvs.elt)

let sum = -cusrand(50, 100)

let duneHis = []
duneHis.push(sum)

for (let l = 0; l < 2; l++) {



  for (let t = 0; t < 6; t++) {
    let duneSeed = cusrand(1, 999)
      triCnvs.clear()
      
    let length = cusrand(250, 370)
    
    let height = l==0?cusrand(80, 130):cusrand(70, 150)
    let halfLength = length/2 - cusrand(0, 10) * flip()
    let triPoints = [], triSecond = []
    triPoints.push([halfLength, triCnvs.height-height])
    
    triSecond.push([halfLength, triCnvs.height-height])
    for (let y = triCnvs.height-height+50; y <= triCnvs.height; y += 30) {
      noiseSeed(cusrand(1, 9999))
      let x = noise(y/50)*60 + halfLength-20;
      triPoints.push([x, y])
      triSecond.push([x, y])
    }
    triPoints.push([halfLength, triCnvs.height+10])
    
    triSecond.push([halfLength, triCnvs.height+10])
    
      triPoints.push([0, triCnvs.height])
      triPoints.push([halfLength, triCnvs.height-height])
    
      triSecond.push([length, triCnvs.height])
      triSecond.push([halfLength, triCnvs.height-height])
    
    
      
      triRoug.curve(triPoints, {stroke: accent2, fill:accent1, fillStyle:"solid", seed:duneSeed})
      triRoug.curve(triSecond, {stroke: accent2, fill:accent1, fillStyle:"solid", seed:duneSeed})
    if (direction){
      triRoug.curve(triPoints, {stroke: accent2, fill:accent2, fillStyle:"cross-hatch", hachureGap:1.5, seed:duneSeed})
      triRoug.curve(triSecond, {stroke: accent2, fill:accent2, fillStyle:duneFill, hachureGap:Gaps[duneFill], seed:duneSeed})}
      else {
        triRoug.curve(triPoints, {stroke: accent2, fill:accent2, fillStyle:duneFill, hachureGap:Gaps[duneFill], seed:duneSeed})
      triRoug.curve(triSecond, {stroke: accent2, fill:accent2, fillStyle:"cross-hatch", hachureGap:1.5, seed:duneSeed})
      }
    if (l==0){

      cnvs.image(triCnvs, sum, cnvs.height-triCnvs.height)


    } else {
      cnvs.image(triCnvs, duneHis[t]+length/3, cnvs.height-triCnvs.height)
  
    }
   
    sum+=length-cusrand(100, 150);
    duneHis.push(sum)

      
    
    
    }
}





accent1 = accent_temp1;
accent2 = accent_temp2;

}


function lineCirclePoints(c, d, s) {
  const points = [];

  
  const r = d / 2;

  
  const numSteps = Math.floor((2 * r) / s);

  
  for (let i = 0; i <= numSteps; i++) {
    
    const y = c[1] - r + (i * s);

    
    const x1 = Math.sqrt((r * r) - ((y - c[1]) * (y - c[1]))) + c[0];
    const x2 = c[0] - Math.sqrt((r * r) - ((y - c[1]) * (y - c[1])));

    
    points.push([[x1, y], [x2, y]]);

    
    points.push([[x1, 2 * c[1] - y], [x2, 2 * c[1] - y]]);
  }

  return points;
}


function city (roug, cnvs){
  let bgFill = ["hachure", "zigzag", "dashed", "zigzag-line", "cross-hatch"].random()
  let ang = cusrand(0, 360);
  let bFill = ["hachure", "zigzag", "cross-hatch"].random()
  let md = half();
  if (md) {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent2, fillWidth: width, hachureAngle: ang });
  }
  else {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent1, fillWidth: width, hachureAngle: ang });

  }

let locX = half()? cusrand(60, cnvs.width/2-150) : cusrand(cnvs.width/2+150, cnvs.width-60)
 const center = [locX, cusrand(30, 40)];
const diameter = cusrand(50, 80);
const step = 3;
let oppositePoints = lineCirclePoints(center, diameter, step);

for (let l = 0; l < oppositePoints.length; l++) {
  const line = oppositePoints[l]; 

  roug.line(line[0][0], line[0][1], line[1][0], line[1][1] , {strokeWidth:1, stroke:md?"black":"white"} )
}



for (let t = 0; t < 2; t++) {
  let num = 20;

for (let b = 1; b < num; b++) {
  let bType = cusrand(2,6);
let bCnvs = createGraphics(100, cnvs.height)
let bRoug = rough.canvas(bCnvs.elt)
let bH = cusrand(120, 180)
let bW = cusrand(30, 80)
let gap = md?1.5:2;
let oS = 47

bCnvs.clear()
if (t==1){
  bH = cusrand(60, 120)
  oS = 52;
  gap += 1
}
  switch (bType) {
    case 2:
        let off1 = cusrand(5, bW-15), off2 = cusrand(off1+10, bW)
        bRoug.polygon([[5, 10], [off1, 10], [off1, 5], [off2, 5], [off2, 10], [bW, 10], [bW, bH], [5, bH], [5, 10]], {fill:accent1, fillStyle:"solid", seed:1, hachureGap:gap})
        bRoug.polygon([[5, 10], [off1, 10], [off1, 5], [off2, 5], [off2, 10], [bW, 10], [bW, bH], [5, bH], [5, 10]], {fill:accent2, fillStyle:bFill, seed:1, hachureGap:gap})
    
      break;
    case 3:
      if (Math.random() <= 0.33){
      if (half()){
      bRoug.polygon([[15, 5], [5, 15], [5, bH], [bW, bH], [bW, 5], [15, 5]], {fill:accent1, fillStyle:"solid", seed:1, hachureGap:gap})
      bRoug.polygon([[15, 5], [5, 15], [5, bH], [bW, bH], [bW, 5], [15, 5]], {fill:accent2, fillStyle:bFill, seed:1, hachureGap:gap})}
      else {
        bRoug.polygon([[5, 5], [5, bH], [bW, bH], [bW, 15], [bW-15, 5], [5, 5]], {fill:accent1, fillStyle:"solid", seed:1, hachureGap:gap})
        bRoug.polygon([[5, 5], [5, bH], [bW, bH], [bW, 15], [bW-15, 5], [5, 5]], {fill:accent2, fillStyle:bFill, seed:1, hachureGap:gap})
      }}
      else {
        bRoug.polygon([[15, 5], [5, 15], [5, bH], [bW, bH], [bW, 15], [bW-10, 5], [15, 5]], {fill:accent1, fillStyle:"solid", seed:1, hachureGap:gap})
        bRoug.polygon([[15, 5], [5, 15], [5, bH], [bW, bH], [bW, 15], [bW-10, 5], [15, 5]], {fill:accent2, fillStyle:bFill, seed:1, hachureGap:gap})
      }
      break;
      case 4:
        let offsetW = cusrand(bW/8, bW/4) 
        let offsetH = cusrand(10, 20)
        bRoug.polygon([[5, offsetH], [5, bH], [bW+5, bH], [bW+5, offsetH],[bW+5-offsetW, offsetH],  [bW+5-offsetW, 5], [5+offsetW, 5],[5+offsetW, offsetH], [5, offsetH]], {fill:accent1, fillStyle:"solid", seed:1, hachureGap:gap})
   bRoug.polygon([[5, offsetH], [5, bH], [bW+5, bH], [bW+5, offsetH],[bW+5-offsetW, offsetH],  [bW+5-offsetW, 5], [5+offsetW, 5],[5+offsetW, offsetH], [5, offsetH]], {fill:accent2, fillStyle:bFill, seed:1, hachureGap:gap})
        break;
        case 5: 
        bRoug.polygon([[5, 40], [5, bH], [bW+5, bH], [bW+5, 40],[bW+5-bW/8, 40],  [bW+5-bW/8, 30], [bW+5-bW/6, 30], [bW+5-bW/6, 20], [bW+5-bW/4, 20], [bW+5-bW/4, 10], [bW+5-bW/2.5, 10], [bW+5-bW/2.5, 5], 
     [5+bW/2.5, 5], [5+bW/2.5, 10], [5+bW/4, 10], [5+bW/4, 20], [5+bW/6, 20], [5+bW/6, 30], [5+bW/8, 30], [5+bW/8, 40], [5, 40]], {fill:accent1, fillStyle:"solid", seed:1, hachureGap:gap})                                                              |
     bRoug.polygon([[5, 40], [5, bH], [bW+5, bH], [bW+5, 40],[bW+5-bW/8, 40],  [bW+5-bW/8, 30], [bW+5-bW/6, 30], [bW+5-bW/6, 20], [bW+5-bW/4, 20], [bW+5-bW/4, 10], [bW+5-bW/2.5, 10], [bW+5-bW/2.5, 5], 
     [5+bW/2.5, 5], [5+bW/2.5, 10], [5+bW/4, 10], [5+bW/4, 20], [5+bW/6, 20], [5+bW/6, 30], [5+bW/8, 30], [5+bW/8, 40], [5, 40]], {fill:accent2, fillStyle:bFill, seed:1, hachureGap:gap})
     roug.line(b*oS+5+bW/2-60, cnvs.height-bH+5, b*oS+5+bW/2-60, 180 - bH, {strokeWidth:md?1:2, roughness:0.5})
           break;
           case 6:
            steepness = cusrand(20, 30)
            if (half()){
              bRoug.polygon([[5, 5], [5, bH], [bW, bH], [bW, steepness], [5, 5]], {fill:accent1, fillStyle:"solid", seed:1, hachureGap:gap})
              bRoug.polygon([[5, 5], [5, bH], [bW, bH], [bW, steepness], [5, 5]], {fill:accent2, fillStyle:bFill, seed:1, hachureGap:gap})
            }
            else {
              bRoug.polygon([[5, steepness], [5, bH], [bW, bH], [bW, 5], [5, steepness]], {fill:accent1, fillStyle:"solid", seed:1, hachureGap:gap})
              bRoug.polygon([[5, steepness], [5, bH], [bW, bH], [bW, 5], [5, steepness]], {fill:accent2, fillStyle:bFill, seed:1, hachureGap:gap})
            }
            break;
    default:
      break;
  }

    cnvs.image(bCnvs, b*oS-60, cnvs.height-bH)
  


}

}

accent1 = accent_temp1;
accent2 = accent_temp2;

}

const Ellipse = {
  center: [0, 0],
  width: 0,
  height: 0
};

function createEllipse(center, width, height) {
  const ellipse = Object.create(Ellipse);
  ellipse.center = center;
  ellipse.width = width;
  ellipse.height = height;
  return ellipse;
}

function sortPointsClockwise(points) {
  
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < points.length; i++) {
    cx += points[i][0];
    cy += points[i][1];
  }
  cx /= points.length;
  cy /= points.length;

  
  points.sort(function(a, b) {
    const angleA = Math.atan2(a[1] - cy, a[0] - cx);
    const angleB = Math.atan2(b[1] - cy, b[0] - cx);
    return angleA - angleB;
  });

  return points;
}

function generatePointsBetweenEllipses(e1, e2, mindist, maxdist, numpoints) {
  const points = [];

  
  const outerRadius = Math.max(e1.width, e1.height) / 2;

  
  const innerRadius = Math.max(e2.width, e2.height) / 2;

  
  const dx = e2.center[0] - e1.center[0];
  const dy = e2.center[1] - e1.center[1];
  const distance = Math.sqrt(dx * dx + dy * dy);

  
  const angle = Math.atan2(dy, dx);

  
  while (points.length < numpoints) {
    
    const r = Math.random() * (maxdist - mindist) + mindist;

    
    const a = Math.random() * 2 * Math.PI;

    
    const x = e1.center[0] + r * Math.cos(a);
    const y = e1.center[1] + r * Math.sin(a);

    
    const pointDistance = Math.sqrt(((x - e2.center[0]) / e2.width) ** 2 + ((y - e2.center[1]) / e2.height) ** 2);

    
    if (pointDistance <= 1 && r <= outerRadius) {
      
      let valid = true;
      for (let i = 0; i < points.length; i++) {
        const dx = x - points[i][0];
        const dy = y - points[i][1];
        if (Math.sqrt(dx * dx + dy * dy) < mindist) {
          valid = false;
          break;
        }
      }

      
      if (valid) {
        points.push([x, y]);
      }
    }
  }

  return points;
}



function findHighestY(points) {
  
  var highestY = points[0][1];
  
  
  for (var i = 1; i < points.length; i++) {
    var currentY = points[i][1];
    if (currentY > highestY) {
      highestY = currentY;
    }
  }
  
  
  return highestY;
}

function ship (roug, cnvs){

  let bgFill = ["hachure", "zigzag", "dashed", "zigzag-line", "cross-hatch"].random()
  let ang = cusrand(0, 360);
  let bFill = ["hachure", "zigzag", "cross-hatch"].random()
  let md = true;
  if (md) {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent2, fillWidth: width, hachureAngle: ang });
  }
  else {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent1, fillWidth: width, hachureAngle: ang });

  }


  let lCnvs = createGraphics(100, 200)
  let lRoug = rough.canvas(lCnvs.elt)

  let lX = lCnvs.width/2, lY = lCnvs.height/2
  
  lRoug.polygon([[lX - 25, lY + 80], [lX + 25, lY + 80], [lX + 10, lY - 50], [lX -10, lY - 50], [lX - 25, lY + 80]], {fill:accent1, fillStyle:"solid", stroke:accent1, strokeWidth:7})
  lRoug.polygon([[lX - 25, lY + 80], [lX + 25, lY + 80], [lX + 10, lY - 50], [lX -10, lY - 50], [lX - 25, lY + 80]], {fill:accent2, fillStyle:"hachure", hachureGap:22, hachureAngle:90, fillWeight:10, stroke:"none"})
  lRoug.polygon([[lX - 30, lY + 80], [lX + 30, lY + 80], [lX + 15, lY - 50], [lX -15, lY - 50], [lX - 27, lY + 80]], { stroke:accent2, strokeWidth:3})

  lRoug.line(lX + 20, lY - 50, lX - 20, lY - 50, {strokeWidth:5})

  lRoug.polygon([[lX- 12, lY - 50], [lX - 7, lY - 70], [lX + 7, lY - 70], [lX + 13, lY - 50]], {fill:accent1, fillStyle:"solid", stroke:accent2, strokeWidth:3})

  lRoug.polygon([[lX - 15, lY - 70], [lX, lY - 85], [lX + 15, lY - 70], [lX - 15, lY - 70]],  {fill:accent2, fillStyle:"solid", stroke:accent2, strokeWidth:2})

  let side = true;
  let locLx = 0, locLy =  cusrand(0, 40);
  if (side)
    locLx = cusrand(100, cnvs.width/2-200)
  else 
    locLx = cusrand(cnvs.width/2+200, cnvs.width-100)
  

  cnvs.image(lCnvs, locLx, locLy)



  let wave = []
  for (let x = 0; x <= cnvs.width; x += 15) {
    let y = noise(x / 100) * 100 + 20;
    wave.push([x, cnvs.height - y])
  }
  let lowestY = findHighestY(wave);

wave.push(...[[cnvs.width, cnvs.height], [0, cnvs.height], wave[0]])

  roug.curve(wave, {fill:accent2, fillStyle:"cross-hatch", hachureGap:0.5})
let sCnvs = createGraphics(170, 100)
let sRoug = rough.canvas(sCnvs.elt)
let cX = sCnvs.width/2, cY = sCnvs.height/2
sRoug.polygon([[cX-70, cY-20], [cX+70, cY-20], [cX+40, cY+20], [cX-40, cY+20], [cX-70, cY-20]], {stroke:accent2, strokeWidth:2, fill:accent1, fillStyle:"solid"})

sRoug.polygon([[cX-20, cY], [cX, cY-50], [cX+20 , cY]], {stroke:accent2, strokeWidth:2, fill:accent1, fillStyle:"solid"})

sRoug.polygon([[cX-70, cY-20], [cX, cY], [cX+70, cY-20], [cX+40, cY+20], [cX-40, cY+20], [cX-70, cY-20]], {stroke:accent2, strokeWidth:2, fill:accent1, fillStyle:"solid"})

sRoug.polygon([[cX-40, cY+20], [cX, cY], [cX+40, cY+20]], {stroke:accent2, strokeWidth:0.5})


let mod = 0.6
let shipX = 0, shipY = 0;

if (side)
  shipX = cusrand(cnvs.width/2, cnvs.width-100)
else 
  shipX = cusrand(100, cnvs.width/2-100)

  roug.ellipse(shipX+50, lowestY-2, 110, 45, {fill:"white", fillStyle:"cross-hatch", hachureGap:3, stroke:"none", fillWeight:0.2})

lX = locLx + lX;
lY = locLy+lY;  
if (side){
  roug.polygon([[lX + 7, lY - 66], [lX + 7, lY - 55],[shipX+cX-60, lowestY-30+cY-10], [shipX+cX, lowestY-30+cY-31],    [lX + 7, lY - 66] ], {fill:"white", fillStyle:"cross-hatch", hachureGap:1,  stroke:"none"})

}
else {
  roug.polygon([[lX - 7, lY - 66],[lX - 7, lY - 55], [shipX+cX-10, lowestY-30+cY-30], [shipX+cX-70, lowestY-30+cY-32],  [lX - 7, lY - 66] ], {fill:"white", fillStyle:"cross-hatch", hachureGap:1,  stroke:"none"})

 }




cnvs.image(sCnvs, shipX, lowestY-30, sCnvs.width*mod, sCnvs.height*mod)

  accent1 = accent_temp1;
  accent2 = accent_temp2;

}


function decreasingYNoise(x, yMax, yMin) {
  let n = noise(x/50);
  let y = map(n, 0, 1, yMax, yMin)+30;
  return y;
}

function increasingYNoise(x, yMax, yMin) {
  let n = noise(x/50);
  let y = map(n, 0, 1, yMax, yMin)+30;
  let xMapped = map(x, 0, 1200, 1, 0.8);
  let noiseValue = y * xMapped;
  return noiseValue;
}

function createArc(s, e, c, n) {
  const startPoint = s;
  const endPoint = e;
  const topPoint = c;

  const curvePoints = [];

  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = (1 - t) * (1 - t) * startPoint[0] + 2 * (1 - t) * t * topPoint[0] + t * t * endPoint[0];
    const y = (1 - t) * (1 - t) * startPoint[1] + 2 * (1 - t) * t * topPoint[1] + t * t * endPoint[1];
    curvePoints.push([x, y]);
  }

  return curvePoints;
}

function findPointByX(points, x) {
  for (let i = 0; i < points.length; i++) {
    if (points[i][0] === x) {
      return points[i];
    }
  }
  return 0;
}

function isInRange(desiredNumber, value, x) {
  return Math.abs(desiredNumber - value) <= x;
}

function createRoundedRectangle(w, h, r, c) {
  const cx = c[0];
  const cy = c[1];

  const points = [];

  
  points.push([cx - w / 2 + r, cy - h / 2]);
  points.push([cx - w / 2, cy - h / 2 + r]);

  
  points.push([cx - w / 2 + r, cy - h / 2]);
  points.push([cx + w / 2 - r, cy - h / 2]);

  
  points.push([cx + w / 2 - r, cy - h / 2]);
  points.push([cx + w / 2, cy - h / 2 + r]);

  
  points.push([cx + w / 2, cy - h / 2 + r]);
  points.push([cx + w / 2, cy + h / 2 - r]);

  
  points.push([cx + w / 2, cy + h / 2 - r]);
  points.push([cx + w / 2 - r, cy + h / 2]);

  
  points.push([cx + w / 2 - r, cy + h / 2]);
  points.push([cx - w / 2 + r, cy + h / 2]);

  
  points.push([cx - w / 2 + r, cy + h / 2]);
  points.push([cx - w / 2, cy + h / 2 - r]);

  
  points.push([cx - w / 2, cy + h / 2 - r]);
  points.push([cx - w / 2, cy - h / 2 + r]);

  return points;
}


function train (roug, cnvs){

  let bgFill = ["hachure", "zigzag", "dashed", "zigzag-line", "cross-hatch"].random()
  let ang = cusrand(0, 360);
  let md = true;
  if (md) {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent2, fillWidth: width, hachureAngle: ang });
  }
  else {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent1, fillWidth: width, hachureAngle: ang });

  }

  bH = cusrand(80, 120)
  rH = bH - 10;



  
let bS = [], bE = [];
let lS = undefined, lE = undefined, rS = undefined, rE = undefined;
  for (let x = 0; x <= cnvs.width/3; x += 2) {
    let y = decreasingYNoise(x, 200-x*0.9, 150-x*0.9);
    roug.line(x, cnvs.height, x, cnvs.height - y, { stroke: md ? accent2 : accent1 });

    if (isInRange(cnvs.height - y, bH, 3) && lS == undefined){
        lS = x;
    }

    if (isInRange(cnvs.height - y, rH, 2) && rS == undefined){
      rS = x;
  }

    if (x == Math.floor(cnvs.width/3)-80){
      bS.push([x, cnvs.height-y]);
    }
  }

  for (let x = cnvs.width; x >= cnvs.width - cnvs.width/3; x -= 2) {
    let y = increasingYNoise(x,  200-(cnvs.width-x)*0.9, 150-(cnvs.width-x)*0.9);
    roug.line(x, cnvs.height, x, cnvs.height - y, { stroke: md ? accent2 : accent1 });
    if (isInRange(cnvs.height - y, bH, 3) && lE == undefined){
      lE = x;
  }

  if (isInRange(cnvs.height - y, rH, 2) && rE == undefined){
    rE = x;
}

    if (x == cnvs.width - Math.floor(cnvs.width/3) + 80){
      bE.push([x, cnvs.height-y]);
    }
  }


  roug.line(rS, rH, rE, rH, {stroke:md?accent2:accent1, strokeWidth:2, roughness:0.5})
  let margin = cusrand(15, 40)
  for (let i = lS; i < lE; i+=margin) {
    roug.line(i, bH, i, rH, {stroke:md?accent2:accent1})
  }
  

  let wagonCnvs = createGraphics(100, 50)
  let wagonRoug = rough.canvas(wagonCnvs.elt)
  let wagon = createRoundedRectangle(70, 20, 5, [37, 14])
  let loco = [[5, 10], [12, 3], [60, 3], [75, 18], [70, 25], [10, 25], [5, 20], [5, 10]];
  
  let dir = half()
  let wN = cusrand(3, 5)
  let tLoc = cusrand(bS[0][0]+50, bE[0][0]-(wN*90+100))
  
  for (let w = 0; w < wN; w++) {
    wagonCnvs.clear()
    let wX = 10, wY = 11;
    if(dir && w==0){
  
      wagonCnvs.push()
      wagonCnvs.scale(-1, 1)
      wagonCnvs.translate(-wagonCnvs.width, 0)
      wagonRoug.curve(loco, {stroke:md?accent2:accent1, fill:md?accent1:accent2, fillStyle:"solid", seed:1})
      wagonRoug.curve(loco, {stroke:md?accent2:accent1, fill:md?accent2:accent1, fillStyle:"cross-hatch", hachureGap:1.8, strokeWidth:1.5, fillWeight:0.5, seed:1})

      for (let w = 0; w < 5; w++) {
        wagonRoug.curve([[wX+wX*w, wY], [wX+wX*w+5, wY], [wX+wX*w+5, wY+5], [wX+wX*w, wY+5]],  {stroke:"none", fill:md?accent1:accent2, fillStyle:"cross-hatch", hachureGap:1, fillWeight:0.5})
      }

      wagonRoug.curve([[wX+wX*5, wY], [wX+wX*5+4, wY], [wX+wX*5+8, wY+5], [wX+wX*5, wY+5]],  {stroke:"none", fill:md?accent1:accent2, fillStyle:"cross-hatch", hachureGap:1, fillWeight:0.5})

      wagonCnvs.pop()


    

  
      cnvs.image(wagonCnvs, tLoc-24, bH-26)
      
    }
    else if (!dir && w == wN-1){
      wagonRoug.curve(loco, {stroke:md?accent2:accent1, fill:md?accent1:accent2, fillStyle:"solid", seed:1})
      wagonRoug.curve(loco, {stroke:md?accent2:accent1, fill:md?accent2:accent1, fillStyle:"cross-hatch", hachureGap:1.8, strokeWidth:1.5, fillWeight:0.5, seed:1})

      for (let w = 0; w < 5; w++) {
        wagonRoug.curve([[wX+wX*w, wY], [wX+wX*w+5, wY], [wX+wX*w+5, wY+5], [wX+wX*w, wY+5]],  {stroke:"none", fill:md?accent1:accent2, fillStyle:"cross-hatch", hachureGap:1, fillWeight:0.5})
      }

      wagonRoug.curve([[wX+wX*5, wY], [wX+wX*5+4, wY], [wX+wX*5+8, wY+5], [wX+wX*5, wY+5]],  {stroke:"none", fill:md?accent1:accent2, fillStyle:"cross-hatch", hachureGap:1, fillWeight:0.5})

      cnvs.image(wagonCnvs, tLoc+76*w, bH-26)
  
    }
  else {
    wagonRoug.curve(wagon, {stroke:md?accent2:accent1, fill:md?accent1:accent2, fillStyle:"solid", seed:1})
    wagonRoug.curve(wagon, {stroke:md?accent2:accent1, fill:md?accent2:accent1, fillStyle:"cross-hatch", hachureGap:1.8, strokeWidth:1.5, fillWeight:0.5, seed:1})

    for (let w = 0; w < 6; w++) {
      wagonRoug.curve([[wX+wX*w, wY], [wX+wX*w+5, wY], [wX+wX*w+5, wY+5], [wX+wX*w, wY+5]],  {stroke:"none", fill:md?accent1:accent2, fillStyle:"cross-hatch", hachureGap:1, fillWeight:0.5})
      
    }
    cnvs.image(wagonCnvs, tLoc+77*w, bH-26)
  }
    
  }

roug.line(lS, bH, lE, bH, {stroke:md?accent2:accent1, strokeWidth:4})





let bBase = createArc(bS[0], bE[0],[cnvs.width/2, bH + 10], 8)
for (let p = 0; p < bBase.length; p++) {
  const element = bBase[p];
  roug.line(element[0], bH, element[0], element[1], {stroke:md?accent2:accent1, strokeWidth:2})
}

roug.curve(bBase, {stroke:md?accent2:accent1, strokeWidth:2})




}

function weightedRandom(valuesWithPercs) {

  let totalPerc = 0;

  valuesWithPercs.forEach(pair => {
    totalPerc += pair[1];
  });

  const randomPerc = Math.random() * totalPerc;
  let accumulatedPerc = 0;

  for (const pair of valuesWithPercs) {
    accumulatedPerc += pair[1];
    if (randomPerc <= accumulatedPerc) {
      return pair[0];
    }
  }
}


function bees (roug, cnvs){
  let bgFill = ["hachure", "zigzag", "dashed", "zigzag-line", "cross-hatch"].random()
  let ang = cusrand(0, 360);
  let md = Math.random() <= 0.15? false: true;
  if (md) {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent1});
  }
  else {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });

  }



for (let i = 0; i < 20; i++) {
  let hW = 30, hH = 30, hC = {x:-5, y:0}
  if (i%2!=0){
    hC.x += hW/2;
  }

  for (let j = 0; j < 41; j++) {
    let hexFill = weightedRandom([["hachure", 10], ["cross-hatch", 10], ["solid", 80]])
    roug.polygon([[hC.x+j*hW, hC.y + i*hH/1.25 - hH/2], [hC.x+j*hW+hW/2, hC.y + i*hH/1.25- hH/4], [hC.x+j*hW+hW/2, hC.y + i*hH/1.25 + hH/4], [hC.x+j*hW, hC.y + i*hH/1.25 + hH/2], [hC.x+j*hW-hW/2, hC.y + i*hH/1.25+ hH/4], [hC.x+j*hW-hW/2, hC.y + i*hH/1.25 - hH/4], [hC.x+j*hW, hC.y + i*hH/1.25- hH/2]],
    {stroke:md?accent2:accent1, strokeWidth:1, fill:hexFill=="solid"?(md?accent1:accent2):(md?accent2:accent1), fillStyle:hexFill, fillWeight:0.5, hachureGap:3.5, hachureAngle:cusrand(0, 360), roughness:0.5})
 
  }
}

let beeCnvs = createGraphics(50, 50)
beeCnvs.pixelDensity(4)
let beeRoug = rough.canvas(beeCnvs.elt)
let wingCnvs = createGraphics(50, 50)
wingCnvs.pixelDensity(4)
let wingRough = rough.canvas(wingCnvs.elt)
let cX = 25, cY = 25;   

let beePoints = generateRandomPoints(5, cnvs.width-5, 5, cnvs.height-5,cusrand(20, 50), 30, 800)

for (let b = 0; b < beePoints.length ; b++) {
  beeCnvs.clear()
  wingCnvs.clear()
  let aL = cusrand(5, 10)
  beeRoug.linearPath([[cX, cY-3], [cX-3, cY-aL]], {stroke:md?accent2:accent1,roughness:0.4, strokeWidth:0.5})
  beeRoug.linearPath([[cX, cY-3], [cX+3, cY-aL]], {stroke:md?accent2:accent1,roughness:0.4, strokeWidth:0.5})

  beeRoug.circle(cX, cY-4, md?4:6, {stroke:md?accent2:accent1,fill:accent2, fillStyle:"solid", roughness: 0.7})
  beeRoug.curve([[cX-1, cY-1], [cX+1, cY-1], [cX+3, cY+5], [cX, cY+12], [cX-3, cY+5], [cX-1, cY-1]], { stroke:md?accent2:accent1,fill:md?accent1:accent2, fillStyle:"solid",roughness: 0.7, seed:1})
  beeRoug.curve([[cX-1, cY-1], [cX+1, cY-1], [cX+3, cY+5], [cX, cY+12], [cX-3, cY+5], [cX-1, cY-1]], {fill:md?accent2:accent1, fillStyle:"hachure", hachureGap:3, hachureAngle:90, fillWeight:1, stroke:"none", roughness: 0.7, seed:1})

  
  
  
  let wingAngle = cusrand(10, 70)
  wingRough.curve([[cX, cY], [cX+7, cY-3], [cX+14, cY], [cX+7, cY+3], [cX, cY]], {stroke:md?accent2:accent1,fill:md?accent1:accent2, fillStyle:"solid", roughness: 0.5})
  beeCnvs.push()
  beeCnvs.angleMode(DEGREES)
  beeCnvs.translate(cX-1, cY-2)
  beeCnvs.rotate(wingAngle)
  beeCnvs.image(wingCnvs, -25, -25)
  beeCnvs.pop()
  wingCnvs.clear()
  wingRough.curve([[cX, cY], [cX-7, cY-3], [cX-14, cY], [cX-7, cY+3], [cX, cY]], {stroke:md?accent2:accent1,fill:md?accent1:accent2, fillStyle:"solid", roughness: 0.5})
  beeCnvs.push()
  beeCnvs.angleMode(DEGREES)
  beeCnvs.translate(cX-1, cY-2)
  beeCnvs.rotate(-wingAngle)
  beeCnvs.image(wingCnvs, -25, -25)
  beeCnvs.pop()
  wingCnvs.clear()
  
let beeAngle = cusrand(0, 180), side = flip();
cnvs.push()
cnvs.angleMode(DEGREES)
cnvs.translate(beePoints[b][0], beePoints[b][1])
cnvs.rotate(wingAngle*side)
cnvs.image(beeCnvs, 0, 0)
cnvs.pop()

  
}


  
}

function getDistance(x1, y1, x2, y2) {
  const xDiff = x2 - x1;
  const yDiff = y2 - y1;
  const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  return distance;
}




function generatePointTriplets(ellipse1, ellipse2, numP) {
  const { c: c1, eW: eW1, eH: eH1 } = ellipse1;
  const { c: c2, eW: eW2, eH: eH2 } = ellipse2;

  const angleStep = (2 * Math.PI) / numP;
  const points = [];

  for (let i = 0; i < numP; i++) {
    const angle1 = i * angleStep;
    const angle2 = angle1 + angleStep;
    const angleMid = (angle1 + angle2) / 2;

    const x1 = c1[0] + eW1 * Math.cos(angle1);
    const y1 = c1[1] + eH1 * Math.sin(angle1);

    const x2 = c2[0] + eW2 * Math.cos(angleMid);
    const y2 = c2[1] + eH2 * Math.sin(angleMid);

    const x3 = c1[0] + eW1 * Math.cos(angle2);
    const y3 = c1[1] + eH1 * Math.sin(angle2);

    points.push([[x1, y1], [x2, y2], [x3, y3], [x1, y1]]);
  }

  return points;
}

function generateArcPoints(aS, aM, aE, pNum) {
  function getArcPoints(aS, aM, aE, n, startRatio, endRatio) {
    const points = [];
    const tIncrement = (endRatio - startRatio) / (n - 1);

    for (let i = 0; i < n; i++) {
      const t = startRatio + tIncrement * i;
      const x = (1 - t) * (1 - t) * aS[0] + 2 * (1 - t) * t * aM[0] + t * t * aE[0];
      const y = (1 - t) * (1 - t) * aS[1] + 2 * (1 - t) * t * aM[1] + t * t * aE[1];
      points.push([x, y]);
    }

    return points;
  }
const offset = 10;
  const arc1Points = getArcPoints(aS, aM, aE, pNum, 1/6, 2/3);
  const flippedS = [aE[0], aS[1]-offset];
  const flippedM = [aM[0], 2 * aE[1] - aM[1]-offset];
  const flippedE = [aS[0], aE[1]-offset];
  let arc2Points = getArcPoints(flippedS, flippedM, flippedE, pNum + 2, 1/20, 1);
  arc2Points.reverse()
  return [arc1Points, arc2Points];
}

function generateArcPoints1(aS, aM, aE, pNum) {
  function getArcPoints(aS, aM, aE, n, startRatio, endRatio) {
    const points = [];
    const tIncrement = (endRatio - startRatio) / (n - 1);

    for (let i = 0; i < n; i++) {
      const t = startRatio + tIncrement * i;
      const x = (1 - t) * (1 - t) * aS[0] + 2 * (1 - t) * t * aM[0] + t * t * aE[0];
      const y = (1 - t) * (1 - t) * aS[1] + 2 * (1 - t) * t * aM[1] + t * t * aE[1];
      points.push([x, y]);
    }

    return points;
  }
  const offset = 10;
  const arc1Points = getArcPoints(aS, aM, aE, pNum, 1 / 3, 2 / 3);
  const flippedS = [aE[0], aS[1]-offset];
  const flippedM = [aM[0], 2 * aE[1] - aM[1]-offset];
  const flippedE = [aS[0], aE[1]-offset];
  const arc2Points = getArcPoints(flippedS, flippedM, flippedE, pNum, 0, 1);
  arc2Points.reverse()
  return [arc1Points, arc2Points];
}

function generateRandomXs(num, nlow, nhigh, dmin) {
  const result = [];

  while (result.length < num) {
    const potentialNextNumber = Math.floor(Math.random() * (nhigh - nlow + 1)) + nlow;

    let meetsCriteria = true;
    for (let i = 0; i < result.length; i++) {
      if (Math.abs(potentialNextNumber - result[i]) < dmin) {
        meetsCriteria = false;
        break;
      }
    }

    if (meetsCriteria) {
      result.push(potentialNextNumber);
    }
  }

  return result;
}


function grass (roug, cnvs){

  let bgFill = ["hachure", "zigzag", "dashed", "zigzag-line", "cross-hatch"].random()
  let ang = cusrand(0, 360);
  let md = true;
  if (md) {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent1 });
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent2, fillWidth: 0.5, hachureAngle: ang, hachureGap:5 });
  }
  else {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: bgFill, fill: accent2, fillWidth: 0.5, hachureAngle: ang, hachureGap:5 });

  }

  let counter = 0;
  let allEnds = []
let pCounter = 0;
let positions = generateRandomXs(20, -5, cnvs.width*2+5, 30)

  for (let i = -5; i < cnvs.width*2+5; i++) {
    const randomStep = 0.7;
   let gH = weightedRandom([[cusrand(130, 140), 3], [cusrand(50, 110), 90], [cusrand(120, 130), 7]])
   
   let offX = cusrand(10, 20)
   if (i%50 == 0){

    let fH = cusrand(130, 175)

    


    let plantPoints = []
    let leng = 15
    let lastCurve = 0

    for (let i = 0; i < leng; i++) {
      let s = half()
      let x = s ? (i % 2 == 0 ? counter + cusrand(3, 6) : counter - cusrand(3, 6)) : (i % 2 != 0 ? counter + cusrand(3, 6) : counter - cusrand(3, 6))
      if (i == 1)
        lastCurve = s ? (i % 2 == 0 ? 1 : -1) : (i % 2 != 0 ? 1 : -1)

      plantPoints.push([x, cnvs.height-fH + i * 15])
      if (i == 0){
        allEnds.push([x, cnvs.height-fH + i * 15])
      }
    }

    roug.curve(plantPoints, { strokeWidth: 2, stroke: md ? accent2 : accent1})
    
    let c = 0
    for (let p = 0; p < plantPoints.length; p++) {
      const element = plantPoints[p];
      if (p <= 1) {

      }
      else {
        if (Math.random() <= 0.7) {
          if (c == 0) {
            roug.curve([element, [element[0] + 3, element[1] - 7], [element[0] + 10, element[1] - 12], [element[0] + 9, element[1] - 5], [element[0], element[1]]], { fill: md ? accent2 : accent1, fillStyle: "solid", stroke: md ? accent2 : accent1 })
            c += 1;
          }
          else {
            roug.curve([element, [element[0] - 3, element[1] - 7], [element[0] - 10, element[1] - 12], [element[0] - 9, element[1] - 5], [element[0], element[1]]], { fill: md ? accent2 : accent1, fillStyle: "solid", stroke: md ? accent2 : accent1 })
            c -= 1;
          }
        }
  
      }
  
    }

    let fType = cusrand(1, 7)
    let petalCnvs = createGraphics(40, 40);
    petalCnvs.pixelDensity(2)
    let pW = petalCnvs.width
    let pH = petalCnvs.height
    let petalRoug = rough.canvas(petalCnvs.elt)
 
    switch(fType){

      
      case 0:
        eR = cusrand(6, 8);
        eR2 = eR-1;
        el1 = {c: [counter, cnvs.height-fH], eW:eR2, eH:eR2}
        el2 =  {c: [counter, cnvs.height-fH], eW:eR2*2.5, eH:eR2*2.5}
        pairs = generatePointTriplets(el1, el2, 8)

        for (let p = 0; p < pairs.length; p++) {
          const element = pairs[p];
          
          roug.curve(element, {fill: accent1, fillStyle:"solid", bowing:10, roughness:0.5})
        }
            
            roug.ellipse(counter, cnvs.height-fH, eR, eR, {fill: accent2, fillStyle:"solid"})
          
        
        break;

        case 1:
        
         eR = cusrand(6, 8);
         eR2 = eR-1;
         el1 = {c: [allEnds[pCounter][0], cnvs.height-fH], eW:eR2, eH:eR2}
         el2 =  {c: [allEnds[pCounter][0], cnvs.height-fH], eW:eR2*2, eH:eR2*2}
         pairs = generatePointTriplets(el1, el2, 6)
         for (let p = 0; p < pairs.length; p++) {
          
          petalCnvs.clear()

          psw = 6
          psh = 5
          petalRoug.curve([[pW/2-psw, pH/2+psh], [pW/2-psw, pH/2], [pW/2+psw, pH/2],  [pW/2+psw, pH/2+psw],[pW/2-psw, pH/2+psh]], {fill: accent1, fillStyle:"solid", roughness:0.7})
          
          cnvs.push()
          cnvs.angleMode(DEGREES)
          cnvs.translate(allEnds[pCounter][0], cnvs.height-fH)
          cnvs.rotate(180-(180/pairs.length*p)*2)
          cnvs.image(petalCnvs, -14, -22)
          cnvs.pop()
          
         }

          roug.ellipse(allEnds[pCounter][0], cnvs.height-fH, eR, eR, {fill: accent2, fillStyle:"solid"})
           
         
          break;
          case 2:
            eR = cusrand(2, 6);
            eR2 = eR-1;
            el1 = {c: [allEnds[pCounter][0], cnvs.height-fH], eW:eR2, eH:eR2}
            el2 =  {c: [allEnds[pCounter][0], cnvs.height-fH], eW:eR2*2, eH:eR2*2}
            pairs = generatePointTriplets(el1, el2, 10)
            for (let p = 0; p < pairs.length; p++) {
             
             petalCnvs.clear()
             psw = 3
             psh = 3
             petalRoug.curve([[pW/2-psw, pH/2+psh], [pW/2-psw, pH/2], [pW/2+psw, pH/2],  [pW/2+psw, pH/2+psw],[pW/2-psw, pH/2+psh]], {fill: accent1, fillStyle:"solid", roughness:0.7})
             
             cnvs.push()
             cnvs.angleMode(DEGREES)
             cnvs.translate(allEnds[pCounter][0], cnvs.height-fH)
             cnvs.rotate(180-(180/pairs.length*p)*2)
             cnvs.image(petalCnvs, -14, -22)
             cnvs.pop()
             
            }
   
             roug.ellipse(allEnds[pCounter][0], cnvs.height-fH, eR, eR, {fill: accent2, fillStyle:"solid"})
              
            
            break;

            case 3:
              eR = cusrand(4, 10);
              eR2 = eR-1;
              el1 = {c: [allEnds[pCounter][0], cnvs.height-fH], eW:eR2, eH:eR2}
              el2 =  {c: [allEnds[pCounter][0], cnvs.height-fH], eW:eR2*2, eH:eR2*2}
              pairs = generatePointTriplets(el1, el2, 12)
              for (let p = 0; p < pairs.length; p++) {
               
               petalCnvs.clear()
             
               petalRoug.line(pW/2, pH/2-15, pW/2, pH/2, {strokeWidth:0.5})
               petalRoug.circle(pW/2, pH/2-15, cusrand(1, 2))
               cnvs.push()
               cnvs.angleMode(DEGREES)
               cnvs.translate(allEnds[pCounter][0], cnvs.height-fH)
               cnvs.rotate(180-(180/pairs.length*p)*2)
               cnvs.image(petalCnvs, -20, -22)
               cnvs.pop()
               
              }
     
               roug.ellipse(allEnds[pCounter][0], cnvs.height-fH, eR, eR, {fill: accent2, fillStyle:"solid"})
                
              
              break;

              case 4:
                petalCnvs.clear()
                pnts = generateArcPoints1([5, pH/2+5 ], [pW/2, pH/2+15], [pW-5, pH/2+5], cusrand(5, 6))
                for (let m = 0; m < pnts[0].length; m++) {
                  const point1 = pnts[0][m];
                  const point2 = pnts[1][m];
                  
                  petalRoug.curve([point1, point2], {roughness:0.4})

                  petalRoug.circle(point2[0], point2[1], floatrand(0.5, 5.0, 2))
                }
                
                petalRoug.curve([[1, pH/2 ], [pW/2, pH/2+10], [pW-1, pH/2]], {strokeWidth:2})


                cnvs.image(petalCnvs, allEnds[pCounter][0]-20, cnvs.height-fH-30)

                break;
                case 5: 

                eR = cusrand(2, 6);
                eR2 = eR-1;
                el1 = {c: [allEnds[pCounter][0], cnvs.height-fH], eW:eR2, eH:eR2}
                el2 =  {c: [allEnds[pCounter][0], cnvs.height-fH], eW:eR2*2, eH:eR2*2}
                pairs = generatePointTriplets(el1, el2, 5)
                for (let p = 0; p < pairs.length; p++) {
                 
                 petalCnvs.clear()
                 psw = 3
                 psh = 3
                 petalRoug.curve([[pW/2-psw, pH/2+psh], [pW/2-psw, pH/2], [pW/2+psw, pH/2],  [pW/2+psw, pH/2+psw],[pW/2-psw, pH/2+psh]], {fill: accent1, fillStyle:"solid", roughness:0.7})
                 
                 cnvs.push()
                 cnvs.angleMode(DEGREES)
                 cnvs.translate(allEnds[pCounter][0], allEnds[pCounter][1])
                 cnvs.rotate(180-(180/pairs.length*p))
                 cnvs.image(petalCnvs, -14, -22)
                 cnvs.pop()
                 
                }
       
                 roug.ellipse(allEnds[pCounter][0], cnvs.height-fH, eR, eR, {fill: accent2, fillStyle:"solid"})
                
                break;
                case 6:
                  petalCnvs.scale(0.7, 0.7)
                  petalCnvs.clear()
                  petalRoug.curve([[pW/2, pH-3], [6, pH-15], [10, 15], [4, 4], [13, 10], [pW/2, 3], [pW/2+5, 10], [pW-4, 4], [pW-10, 15], [pW-6, pH-15], [pW/2, pH-3]], {fill:accent1, fillStyle:"solid", strokeWidth:2})
                  cnvs.push()
                  console.log(allEnds.length)
                  console.log(allEnds[pCounter])
                  cnvs.angleMode(DEGREES)
                  cnvs.translate(allEnds[pCounter][0], allEnds[pCounter][1])
                  if (lastCurve == 1)
                    cnvs.rotate(-30)
                  else if (lastCurve == -1)
                    cnvs.rotate(30)
                  cnvs.image(petalCnvs, -15, -22)
                 cnvs.pop()
                  break;
                  case 7:
                    petalCnvs.clear()
                    offs = 10
                    rX = 20
                    rY = 13
                    petalRoug.ellipse(pW/2, pH/2, 20, 20, {fill:accent2, fillStyle:"solid"})



                    petalRoug.ellipse(pW/2, pH/2-offs, rX, rY, {stroke:"none", fill:accent1, fillStyle:"solid", roughness:1.2, seed:1})
                    
                    petalRoug.ellipse(pW/2+offs, pH/2, rY, rX, {stroke:"none",fill:accent1, fillStyle:"solid", roughness:1.2, seed:1})
                    
                    petalRoug.ellipse(pW/2-offs, pH/2, rY, rX, {stroke:"none",fill:accent1, fillStyle:"solid", roughness:1.2, seed:1})
                    petalRoug.ellipse(pW/2, pH/2+offs, rX, rY, {stroke:"none",fill:accent1, fillStyle:"solid", roughness:1.2, seed:1})

                    petalRoug.ellipse(pW/2, pH/2-offs, rX, rY, { roughness:1.2, seed:1})
                    
                    petalRoug.ellipse(pW/2+offs, pH/2, rY, rX, { roughness:1.2, seed:1})

                    
                    petalRoug.ellipse(pW/2-offs, pH/2, rY, rX, { roughness:1.2, seed:1})
                    petalRoug.ellipse(pW/2, pH/2+offs, rX, rY, { roughness:1.2, seed:1})

                    cnvs.push()
                    cnvs.angleMode(DEGREES)
                    cnvs.translate(allEnds[pCounter][0], cnvs.height-fH)
                    cnvs.rotate(cusrand(-180, 180))
                    cnvs.image(petalCnvs, -15, -22)
                   cnvs.pop()
                    break;

    }
   
    pCounter += 1;

  }

    roug.curve([[counter, cnvs.height], [counter-(offX/2*flip()), cnvs.height-(gH/2)], [counter-(offX*flip()), cnvs.height-gH]])

    
    counter += randomStep;

   
  }

}

function createRainLines(w, h) {
  const points = [];

  
  const xMin = -w / 2;
  const xMax = w / 2;

  
  const yTop = h / 2;

  
  for (let x = xMin; x < xMax; x += 1) {
    
    const yMin = yTop - Math.random() * h;
    const yMax = yMin + Math.random() * h / 3;

    
    points.push({ x, y: yMin });
    points.push({ x, y: yMax });w
  }

  return points;
}



function isWithinRadius(p1, points, r) {
  for (const p2 of points) {
    const distance = Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
    if (distance <= r) {
      return true;
    }
  }
  return false;
}


function drawEllipses(roug, cnvs, c, w, h, num, step) {
  let strokeWidth = 1;

  cnvs.noFill()
  cnvs.stroke("white")
  cnvs.strokeWeight(strokeWidth);
  
  for (let i = 0; i < num; i++) {
    let ellipseWidth = w + i * step;
    let ellipseHeight = h + i * step;
    let ellipseX = c[0];
    let ellipseY = c[1];
  
    roug.ellipse(ellipseX, ellipseY, ellipseWidth, ellipseHeight, {stroke:"white", strokeWidth:strokeWidth, roughness:"0.5"});

    strokeWidth -= 0.3;
    cnvs.strokeWeight(strokeWidth);
  }
}


function findMediumY(arr) {
  const xs = arr.map(item => item[1]); 
  const sum = xs.reduce((acc, curr) => acc + curr, 0); 
  const avg = sum / xs.length; 
  return avg; 
}

function rain (roug, cnvs){
  
  let md = true;
  if (md) {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent1});
  }
  else {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
}



let wave = []
for (let x = 0; x <= cnvs.width; x += 15) {
  let y = noise(x / 100) * 40 + 80;
  wave.push([x, cnvs.height - y])
}
let mediumWave = findMediumY(wave)




wave.push(...[[cnvs.width+50, cnvs.height-60], [cnvs.width+50, cnvs.height], [0, cnvs.height], wave[0]])

roug.curve(wave, {fill:accent2, fillStyle:"solid"})


pnts2 = generateRandomPoints(-5, cnvs.width+5, mediumWave+25, cnvs.height+5, 20, 50, 5000)

pnts2.forEach(el=>{
  wid = cusrand(4, 12)
 drawEllipses(roug, cnvs, el, wid, wid - wid/2, cusrand(1, 4), cusrand(5, 9))
});








let dir = flip();
let rainCnvs = createGraphics(20, 20)
let rainRoug = rough.canvas(rainCnvs.elt)
let ang = flip() * cusrand(5, 45)
pnts = generateRandomPoints(-5, cnvs.width+5, -5, cnvs.height+5, 100, 20, 5000)
cnvs.angleMode(DEGREES)
pnts.forEach(el => {
  if (!isWithinRadius(el, pnts2, 30))
{

  let len = cusrand(2, 10)
  if (el[1] >= mediumWave){
  rainCnvs.clear()

  rainRoug.line(rainCnvs.width/2, rainCnvs.height/2 - len/2, rainCnvs.width/2, rainCnvs.height/2 + len/2, {roughness:0.3, stroke:"white"})
  cnvs.push()
  cnvs.translate(el[0], el[1])
  cnvs.rotate(ang)
  cnvs.image(rainCnvs, 0, 0)
  cnvs.pop()
}
else {
  rainCnvs.clear()
  rainRoug.line(rainCnvs.width/2, rainCnvs.height/2 - len/2, rainCnvs.width/2, rainCnvs.height/2 + len/2, {roughness:0.3})
  cnvs.push()
  cnvs.translate(el[0], el[1])
  cnvs.rotate(ang)
  cnvs.image(rainCnvs, 0, 0)
  cnvs.pop()

}

}

});

}



function generatePointsInEllipse(c, w, h, mode, num) {
  var points = [];

  for (var i = 0; i < num; i++) {
    var angle = Math.random() * 2 * Math.PI;
    var r = Math.sqrt(Math.random());
    var x = c[0] + (mode ? (w / 2) * r * Math.cos(angle) : (w / 2) * (1 - r) * Math.cos(angle));
    var y = c[1] + (mode ? (h / 2) * r * Math.sin(angle) : (h / 2) * (1 - r) * Math.sin(angle));
    points.push([x, y]);
  }

  return points;
}

function generatePoints(c, w, h, num, dmin) {
  let points = [];

  
  const dist = (p1, p2) => Math.sqrt(Math.pow(p1[0]-p2[0], 2) + Math.pow(p1[1]-p2[1], 2));

  
  const isInEllipse = (point) => {
      let x = point[0], y = point[1];
      return Math.pow((x - c[0]), 2) / Math.pow(w, 2) + Math.pow((y - c[1]), 2) / Math.pow(h, 2) <= 1;
  };

  
  const isValid = (point) => {
      for(let i = 0; i < points.length; i++) {
          if(dist(points[i], point) < dmin) {
              return false;
          }
      }
      return true;
  };

  
  while(points.length < num) {
      let x = Math.random() * (2 * w) + c[0] - w;
      let y = Math.random() * (2 * h) + c[1] - h;
      let point = [x, y];

      if(isInEllipse(point) && isValid(point)) {
          points.push(point);
      }
  }

  return points;
}


function planet(roug, cnvs) {
  let md = false;
  if (md) {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent1});
  }
  else {
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
}

stars = generateRandomPoints(-5, cnvs.width + 5, -5, cnvs.height + 5, 250, 10, 1000)

stars.forEach(s => {
  r = floatrand(0.1, 2.0)
  roug.circle(s[0], s[1], r, {stroke:accent1, roughness:floatrand(0.1, 0.9)})
});


ePoints = generatePoints ([cnvs.width/2, cnvs.height/2], 50, 50, 200, 2)

ePoints.forEach(p => {
  r = 0.5
  roug.circle(p[0], p[1], r, {stroke:accent1, roughness:0.1})
});

}
function createDividedLinesFromPoint(s, num, sec, len) {
  const [sx, sy] = s;
  const angleStep = (2 * Math.PI) / num;
  const result = [];

  for (let i = 0; i < num; i++) {
    const angle = angleStep * i;
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const line = [];

    for (let j = 0; j <= sec; j++) {
      const t = Math.pow(j / sec, 2);
      const x = sx + t * len * cosAngle;
      const y = sy + t * len * sinAngle;
      line.push([x, y]);
    }

    result.push(line);
  }

  return result;
}


function getSpiderLoc(s, w, h, dis) {
 
 if (dis * 2 > w || dis * 2 > h) {
  throw new Error('The given distance is too large for the specified rectangle.');
}


function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}


function euclideanDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
}

let randomPoint;
let validDistance = false;

do {
  
  const minX = Math.max(dis, s[0] - dis);
  const maxX = Math.min(w - dis, s[0] + dis);
  const minY = Math.max(dis, s[1] - dis);
  const maxY = Math.min(h - dis, s[1] + dis);

  
  const x = randomInRange(minX, maxX);
  const y = randomInRange(minY, maxY);

  randomPoint = [x, y];

  
  if (euclideanDistance(s, randomPoint) >= dis) {
    validDistance = true;
  }
} while (!validDistance);

return randomPoint;
}



function generateRandomPoint(minW, maxW, minH, maxH, min_distance, sP) {


  let distance = 0
  let point;
  while (distance < min_distance){
    point = [cusrand(minW, maxW), cusrand(minH, maxH)];

    const dx = sP[0] - point[0];
    const dy = sP[1] - point[1];
    distance = Math.sqrt(dx * dx + dy * dy);
  }

    return point;


}



function spider (roug, cnvs){
  let ang = cusrand(0, 360);
  let md = half();
  if (!md) {
    accent1 = accent_temp2;
    accent2 = accent_temp1;
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
    roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "cross-hatch", fill: accent1, fillWidth: 0.5, hachureAngle: ang, hachureGap:0.8 });
  }

else {
  roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "solid", fill: accent2 });
  roug.rectangle(0, 0, cnvs.width, cnvs.height, { fillStyle: "cross-hatch", fill: accent1, fillWidth: 0.5, hachureAngle: ang, hachureGap:1 });
}


let secs = 30
let s = [cusrand(50, 750), cusrand(50, 165)]
let lines = createDividedLinesFromPoint(s, 30, secs, 1000)

let sections = []
for (let s = 0; s < secs; s++) {
 sections.push([])
}

lines.forEach(l => {
  roug.polygon([l[0], l[l.length-1]], {roughness:2, stroke:accent2})

for (let i = 0; i < secs; i++) {
  sections[i].push(l[i+1])
}

});


for (let i = 0; i < secs; i++) {
  sections[i].push(lines[0][i+1])
}
console.log(sections)
sections.forEach((el, i) => {
  const modifiedEl = [];

  for (let j = 0; j < el.length - 1; j++) {
    const [x1, y1] = el[j];
    const [x2, y2] = el[j + 1];

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    const dx = x2 - x1;
    const dy = y2 - y1;

    const norm = Math.sqrt(dx * dx + dy * dy);
    const perpX = -dy / norm;
    const perpY = dx / norm;

    const offset = floatrand(-3, 3);
    const offsetX = midX + offset * perpX;
    const offsetY = midY + offset * perpY;

    modifiedEl.push([x1, y1]);
    modifiedEl.push([offsetX, offsetY]);
  }

  modifiedEl.push(el[el.length - 1]);

  if (half())
  roug.polygon(modifiedEl, {roughness:1, stroke:accent2})
  else 
  roug.curve(modifiedEl, {roughness:1, curveStepCount:20, stroke:accent2})

});

console.log(cnvs.width, cnvs.height)
let spid2 = generateRandomPoint(40, cnvs.width-40, 40, cnvs.height-40, 50, s)


let spidCnvs = createGraphics(80, 100)
let spidRoug = rough.canvas(spidCnvs.elt)


let spidType = cusrand(0, 1)

let vM = 3.0;



spidRoug.curve([[spidCnvs.width/2-1, spidCnvs.height/2-20],[spidCnvs.width/2-5, spidCnvs.height/2-22], [spidCnvs.width/2-4, spidCnvs.height/2-25]], {strokeWidth:1, roughness:0.5, stroke:accent2})
spidRoug.curve([[spidCnvs.width/2+1, spidCnvs.height/2-20],[spidCnvs.width/2+5, spidCnvs.height/2-22], [spidCnvs.width/2+4, spidCnvs.height/2-25]], {strokeWidth:1, roughness:0.5, stroke:accent2})



spidRoug.linearPath([[spidCnvs.width/2-flip()*floatrand(0, vM), spidCnvs.height/2-10-flip()*floatrand(0, vM)],[spidCnvs.width/2+12-flip()*floatrand(0, vM), spidCnvs.height/2-20-flip()*floatrand(0, vM)], [spidCnvs.width/2+18-flip()*floatrand(0, vM), spidCnvs.height/2-35-flip()*floatrand(0, vM)], [spidCnvs.width/2+15-flip()*floatrand(0, vM), spidCnvs.height/2-50-flip()*floatrand(0, vM)]], {strokeWidth:2, roughness:0.5, stroke:accent2})
spidRoug.linearPath([[spidCnvs.width/2, spidCnvs.height/2-10],[spidCnvs.width/2-12, spidCnvs.height/2-20], [spidCnvs.width/2-18, spidCnvs.height/2-35], [spidCnvs.width/2-15, spidCnvs.height/2-50]], {strokeWidth:2, roughness:0.5, stroke:accent2})   

spidRoug.linearPath([[spidCnvs.width/2-flip()*floatrand(0, vM), spidCnvs.height/2-2-flip()*floatrand(0, vM)],[spidCnvs.width/2+20-flip()*floatrand(0, vM), spidCnvs.height/2-15-flip()*floatrand(0, vM)], [spidCnvs.width/2+30-flip()*floatrand(0, vM), spidCnvs.height/2-30-flip()*floatrand(0, vM)]], {strokeWidth:2, roughness:0.5, stroke:accent2})
spidRoug.linearPath([[spidCnvs.width/2-flip()*floatrand(0, vM), spidCnvs.height/2-2-flip()*floatrand(0, vM)],[spidCnvs.width/2-20-flip()*floatrand(0, vM), spidCnvs.height/2-15-flip()*floatrand(0, vM)], [spidCnvs.width/2-30-flip()*floatrand(0, vM), spidCnvs.height/2-30-flip()*floatrand(0, vM)]], {strokeWidth:2, roughness:0.5, stroke:accent2})


spidRoug.linearPath([[spidCnvs.width/2-flip()*floatrand(0, vM), spidCnvs.height/2-5-flip()*floatrand(0, vM)],[spidCnvs.width/2+20-flip()*floatrand(0, vM), spidCnvs.height/2-flip()*floatrand(0, vM)], [spidCnvs.width/2+30-flip()*floatrand(0, vM), spidCnvs.height/2-flip()*floatrand(0, vM)], [spidCnvs.width/2+35-flip()*floatrand(0, vM), spidCnvs.height/2-4-flip()*floatrand(0, vM)]], {strokeWidth:2, roughness:0.5, stroke:accent2})
spidRoug.linearPath([[spidCnvs.width/2-flip()*floatrand(0, vM), spidCnvs.height/2-5-flip()*floatrand(0, vM)],[spidCnvs.width/2-20-flip()*floatrand(0, vM), spidCnvs.height/2-flip()*floatrand(0, vM)], [spidCnvs.width/2-30-flip()*floatrand(0, vM), spidCnvs.height/2-flip()*floatrand(0, vM)], [spidCnvs.width/2-35-flip()*floatrand(0, vM), spidCnvs.height/2-4-flip()*floatrand(0, vM)]], {strokeWidth:2, roughness:0.5, stroke:accent2})



spidRoug.linearPath([[spidCnvs.width/2-flip()*floatrand(0, vM), spidCnvs.height/2-5-flip()*floatrand(0, vM)],[spidCnvs.width/2+13-flip()*floatrand(0, vM), spidCnvs.height/2+10-flip()*floatrand(0, vM)], [spidCnvs.width/2+17-flip()*floatrand(0, vM), spidCnvs.height/2+25-flip()*floatrand(0, vM)], [spidCnvs.width/2+15-flip()*floatrand(0, vM), spidCnvs.height/2+35-flip()*floatrand(0, vM)]], {strokeWidth:2, roughness:0.5, stroke:accent2})
spidRoug.linearPath([[spidCnvs.width/2-flip()*floatrand(0, vM), spidCnvs.height/2-5-flip()*floatrand(0, vM)],[spidCnvs.width/2-13-flip()*floatrand(0, vM), spidCnvs.height/2+10-flip()*floatrand(0, vM)], [spidCnvs.width/2-17-flip()*floatrand(0, vM), spidCnvs.height/2+25-flip()*floatrand(0, vM)], [spidCnvs.width/2-15-flip()*floatrand(0, vM), spidCnvs.height/2+35-flip()*floatrand(0, vM)]], {strokeWidth:2, roughness:0.5, stroke:accent2})


if (spidType){
  spidRoug.ellipse(spidCnvs.width/2, spidCnvs.height/2, 7, 30, {fill:accent2, fillStyle:"solid", roughness:0.7, stroke:accent2})
  spidRoug.ellipse(spidCnvs.width/2, spidCnvs.height/2-10, 13, 20, {fill:accent2, fillStyle:"solid", roughness:0.7, stroke:accent2})
  spidRoug.line(spidCnvs.width/2, spidCnvs.height/2+15, spidCnvs.width/2+2, spidCnvs.height/2+18, {strokeWeight:1, roughness:0.5, stroke:accent2})
  spidRoug.line(spidCnvs.width/2, spidCnvs.height/2+15, spidCnvs.width/2-2, spidCnvs.height/2+18, {strokeWeight:1, roughness:0.5, stroke:accent2})
}
  else {
    spidRoug.ellipse(spidCnvs.width/2, spidCnvs.height/2, 17, 20, {fill:accent2, fillStyle:"solid", roughness:0.7, stroke:accent2})
    spidRoug.ellipse(spidCnvs.width/2, spidCnvs.height/2-10, 8, 20, {fill:accent2, fillStyle:"solid", roughness:0.7, stroke:accent2})
    spidRoug.line(spidCnvs.width/2, spidCnvs.height/2+6, spidCnvs.width/2, spidCnvs.height/2-7, {stroke:accent1, roughness:0.7})
    spidRoug.line(spidCnvs.width/2-4, spidCnvs.height/2-2, spidCnvs.width/2+4, spidCnvs.height/2-2, {stroke:accent1, roughness:0.7})
  }
  


cnvs.push()
cnvs.translate(spid2[0], spid2[1])
cnvs.angleMode(DEGREES)
cnvs.rotate(cusrand(0, 360))
cnvs.image(spidCnvs, -40,-50)
cnvs.pop()


accent1 = accent_temp1;
accent2 = accent_temp2;
}

const scenes = {
  1:space,
  2:truna,
  3:piano,
  4:dunes, 
  5:domino,
  6:falling,
  7:birds,
  8:notation,
  9:vikno,
  10:forest,
  11:lupa,
  12:letters,
  13:city,
  14:ship,
  15:grass,
  16:bees,
  17:train,
  18:rain,
  19:spider
};

const usedNumbers = [];
function uniquerand(min, max) {
  let number;
  do {
    number = cusrand(min, max);
  } while (usedNumbers.includes(number));
  usedNumbers.push(number);
  return number;
}

let fixed = 1000;

function setup() {

  base = createGraphics(fixed, fixed);

  randomSeed(Math.random() * 99999);
  noiseSeed(Math.random() * 99999);
  createCanvas(cS, cS);                                        
  base.colorMode(HSL, 360, 100, 100);
  base.background(bgClr[0], bgClr[1], bgClr[2]);
  base.stroke(45, 40, 95);
  
  let counter = 0;
  for (let i = 0; i < fixed; i += 6) {
    for (let j = 0; j < fixed; j += 3) {
      base.ellipse(counter % 2 == 0 ? i : i + 3, j, random(3, 5));
      counter++;
    }
  }




  graphics = createGraphics(fixed, fixed);
  polotno1 = createGraphics(800, 215);
  rough1 = rough.canvas(polotno1.elt);

  polotno2 = createGraphics(800, 215);
  rough2 = rough.canvas(polotno2.elt);

  polotno3 = createGraphics(800, 215);
  rough3 = rough.canvas(polotno3.elt);


  for(let i = 0; i < 3; i++){
    if (i == 0){
    func = scenes[uniquerand(1, 19)]
    func(rough1, polotno1)}
    else if (i == 1){
    func = scenes[uniquerand(1, 19)]
    func(rough2, polotno2)}
    else {
    func = scenes[uniquerand(1, 19)]
    func(rough3, polotno3)}
  }
  

  let roughCanvas = rough.canvas(graphics.elt);
  image(base, 0, 0, cS, cS);
  graphics.image(polotno1, fixed / 10, fixed / 10);
  graphics.image(polotno2, fixed / 10, fixed / 2.5);

  graphics.image(polotno3, fixed / 10, fixed / 1.43);

  roughCanvas.rectangle(fixed / 10, fixed / 10, fixed - fixed / 5, fixed / 4.65, { strokeWidth: 3, roughness: 1 });
  roughCanvas.rectangle(fixed / 10, fixed / 2.5, fixed - fixed / 5, fixed / 4.65, { strokeWidth: 3, roughness: 1 });
  roughCanvas.rectangle(fixed / 10, fixed / 1.43, fixed - fixed / 5, fixed / 4.65, { strokeWidth: 3, roughness: 1 });
  image(graphics, 0, 0, cS, cS);
}


function ellipseRand(x, y, width, height) {
  const angle = Math.random() * 2 * Math.PI;
  const x1 = x + width/2 * Math.cos(angle);
  const y1 = y + height/2 * Math.sin(angle);
  return [x1, y1];
}


Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))];
}



function star(x, y, radius1, radius2, npoints, cnvs) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  cnvs.beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    cnvs.vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    cnvs.vertex(sx, sy);
  }
  cnvs.endShape(CLOSE);

}


function half(one, two) {
  if (one == undefined || two == undefined) {
    if (Math.random() < 0.5)
      return false;
    else
      return true;
  }
  else {
    if (Math.random() <= 0.5)
      return one;
    else
      return two;
  }
}

function third(one, two) {
  if (one == undefined || two == undefined) {
    if (Math.random() <= 0.33)
      return true;
    else
      return false;
  }
  else {
    if (Math.random() <= 0.33)
      return one;
    else
      return two;
  }
}

function generateRandomPoints(minW, maxW, minH, maxH, points_num, min_distance, max_distance) {
  const points = [];

  const addPoint = () => {
    const point = [cusrand(minW, maxW), cusrand(minH, maxH)];

    if (points.every(p => {
      const dx = p[0] - point[0];
      const dy = p[1] - point[1];
      const distance = dx * dx + dy * dy;
      return distance >= min_distance * min_distance && distance <= max_distance * max_distance;
    })) {
      points.push(point);
    }
  };

  while (points.length < points_num) {
    addPoint();
  }

  return points;
}

function isInEllipse(point, eC, eW, eH) {
  
  const dx = (point[0] - eC[0]) / eW;
  const dy = (point[1] - eC[1]) / eH;
  const distance = Math.sqrt(dx * dx + dy * dy);

  
  return distance <= 1;
}

function exponentialAngleChange(initialAngle, numDominos, coefficient) {
  let angle = initialAngle;
  for (let i = 0; i < numDominos; i++) {
    angle *= coefficient;
  }
  return angle;
}

function cusrand(min, max, arr) {
  let result = Math.floor(Math.random() * (max - min + 1) + min);
  if (arr != undefined) {
    while (arr.includes(result)) {
      result = Math.floor(Math.random() * (max - min + 1) + min);
    }
  }
  return result;
}
function floatrand(min, max) {
  return Math.random() * (max - min) + min;
}
