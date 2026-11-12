/**
 * Gabriel Construcciones – Decoración navideña (navidad.js)
 * ------------------------------------------------------------
 * Genera con SVG (sin imágenes externas):
 *   · Guirnalda de pino con luces titilantes, moños y bolas bajo el menú.
 *   · Bolas, estrella y adornos colgantes que se balancean en el hero.
 *   · Guirnalda sobre la franja de contacto (CTA) y tira de luces en el footer.
 *   · Nevada suave.
 *
 * Se activa sola del 1/11 al 10/01. Forzar desde la URL:
 *   ?navidad=on   → siempre activa      ?navidad=off  → desactivada
 * Para quitarla definitivamente: borrar el <link> a css/navidad.css
 * y el <script> a js/navidad.js de cada página.
 */
(() => {
  "use strict";

  /* ── ¿Está activa? ─────────────────────────────────────────── */
  const param = new URLSearchParams(location.search).get("navidad");
  const now = new Date();
  const m = now.getMonth() + 1;
  const inSeason = m === 11 || m === 12 || (m === 1 && now.getDate() <= 10);
  if (param === "off" || (!inSeason && param !== "on")) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Utilidades ────────────────────────────────────────────── */
  let uid = 0;
  const f = (n) => (Math.round(n * 10) / 10).toString();
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ── Paletas ───────────────────────────────────────────────── */
  const BALL = {
    red:    ["#ffa3a3", "#d3132b", "#5c0410"],
    gold:   ["#fff3c4", "#dca32a", "#6e4706"],
    green:  ["#a3ecbb", "#138a4f", "#04341c"],
    blue:   ["#b4d6f5", "#1f5c99", "#0a2140"],
    silver: ["#ffffff", "#c3ccd4", "#56636d"],
    wine:   ["#f5aac8", "#8c1446", "#3a0519"],
  };
  const LIGHTS = ["#ff4b4b", "#ffd23f", "#3ef08a", "#4cb4ff", "#ff7ad9", "#ffa63d"];

  function defs(p) {
    let s = "<defs>";
    for (const [k, [l, b, d]] of Object.entries(BALL)) {
      s += `<radialGradient id="${p}-b-${k}" cx=".5" cy=".5" r=".56" fx=".33" fy=".28"><stop offset="0" stop-color="${l}"/><stop offset=".45" stop-color="${b}"/><stop offset="1" stop-color="${d}"/></radialGradient>`;
      s += `<linearGradient id="${p}-f-${k}" x1="0" x2="1"><stop offset="0" stop-color="${d}"/><stop offset=".3" stop-color="${l}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${d}"/></linearGradient>`;
    }
    LIGHTS.forEach((c, i) => {
      s += `<radialGradient id="${p}-g${i}"><stop offset="0" stop-color="${c}" stop-opacity=".95"/><stop offset=".35" stop-color="${c}" stop-opacity=".38"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
    });
    s += `<linearGradient id="${p}-cap" x1="0" x2="1"><stop offset="0" stop-color="#6f5212"/><stop offset=".3" stop-color="#f8e39a"/><stop offset=".55" stop-color="#b98a2c"/><stop offset=".8" stop-color="#f1d47a"/><stop offset="1" stop-color="#6f5212"/></linearGradient>`;
    s += `<radialGradient id="${p}-shade" cx=".42" cy=".38" r=".62"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></radialGradient>`;
    s += `<linearGradient id="${p}-bow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5466"/><stop offset=".5" stop-color="#d0142c"/><stop offset="1" stop-color="#7d0614"/></linearGradient>`;
    s += `<radialGradient id="${p}-star" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fffbe6"/><stop offset=".45" stop-color="#f3c950"/><stop offset="1" stop-color="#8d600c"/></radialGradient>`;
    return s + "</defs>";
  }

  /* ── Decoración interna de las bolas ───────────────────────── */
  function ballDeco(p, deco, r, cy, rnd) {
    let s = "";
    if (deco === "band") {
      const w = r * 0.19, k = r * 0.34;
      s += `<path d="M${f(-r)},${f(cy - w)} Q0,${f(cy - w + k)} ${f(r)},${f(cy - w)} L${f(r)},${f(cy + w)} Q0,${f(cy + w + k)} ${f(-r)},${f(cy + w)}Z" fill="url(#${p}-cap)"/>`;
      for (let i = -3; i <= 3; i++) {
        const x = i * r * 0.27, y = cy + (k / 2) * (1 - (x / r) ** 2);
        s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.055)}" fill="#fff" opacity=".9"/>`;
      }
      [-2.2, 2.2].forEach((o) => {
        s += `<path d="M${f(-r)},${f(cy + w * o)} Q0,${f(cy + w * o + k)} ${f(r)},${f(cy + w * o)}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="${f(r * 0.04)}"/>`;
      });
    } else if (deco === "glitter") {
      const n = Math.round(r * 1.8);
      for (let i = 0; i < n; i++) {
        const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * r * 0.95;
        s += `<circle cx="${f(Math.cos(a) * d)}" cy="${f(cy + Math.sin(a) * d)}" r="${f(r * (0.025 + rnd() * 0.045))}" fill="${rnd() < 0.5 ? "#fff" : "#ffe7a1"}" opacity="${f(0.45 + rnd() * 0.55)}"/>`;
      }
    } else if (deco === "lines") {
      [0.34, 0.7].forEach((k) => {
        s += `<ellipse cx="0" cy="${f(cy)}" rx="${f(r * k)}" ry="${f(r)}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="${f(r * 0.05)}"/>`;
      });
      s += `<ellipse cx="0" cy="${f(cy)}" rx="${f(r)}" ry="${f(r * 0.3)}" fill="none" stroke="#d8aa63" stroke-opacity=".85" stroke-width="${f(r * 0.07)}"/>`;
    } else if (deco === "snow") {
      const L = r * 0.56, b = r * 0.17;
      let d = "";
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 - Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a);
        d += `M0,${f(cy)}l${f(ca * L)},${f(sa * L)}`;
        const bx = ca * L * 0.6, by = cy + sa * L * 0.6;
        [-0.7, 0.7].forEach((o) => {
          d += `M${f(bx)},${f(by)}l${f(Math.cos(a + o) * b)},${f(Math.sin(a + o) * b)}`;
        });
      }
      s += `<path d="${d}" stroke="#fff" stroke-width="${f(r * 0.06)}" stroke-linecap="round" fill="none" opacity=".92"/>`;
      s += `<circle cx="0" cy="${f(cy)}" r="${f(r * 0.07)}" fill="#fff"/>`;
    } else if (deco === "zigzag") {
      [[-0.05, "url(#" + p + "-cap)", 0.11], [0.2, "#fff", 0.05], [-0.3, "#fff", 0.05]].forEach(([oy, col, sw]) => {
        let d = "";
        for (let i = 0; i <= 8; i++) {
          const x = -r + (i * r) / 4;
          const y = cy + oy * r + (i % 2 ? r * 0.12 : -r * 0.12) + 0.12 * r * (1 - (x / r) ** 2);
          d += (i ? "L" : "M") + f(x) + "," + f(y);
        }
        s += `<path d="${d}" fill="none" stroke="${col}" stroke-width="${f(r * sw)}" stroke-linejoin="round" opacity=".9"/>`;
      });
    }
    return s;
  }

  /* ── Adorno colgante (bola, estrella o gota). Cuelga de (0,0) ─ */
  function ornament(p, o, rnd) {
    const { r, color = "red", deco = "plain", len = 20, type = "ball", thread = "#d9c27a", tw = 1 } = o;
    const ringR = Math.max(1.6, r * 0.09);
    const capW = r * 0.5, capH = Math.max(3, r * 0.26);
    const capY = len + ringR * 1.6;
    let s = `<line x1="0" y1="0" x2="0" y2="${f(len)}" stroke="${thread}" stroke-width="${tw}"/>`;
    s += `<circle cx="0" cy="${f(len)}" r="${f(ringR)}" fill="none" stroke="#c9a04a" stroke-width="${f(Math.max(1, ringR * 0.55))}"/>`;
    let h;

    const cap = `<rect x="${f(-capW / 2)}" y="${f(capY)}" width="${f(capW)}" height="${f(capH)}" rx="${f(capH * 0.25)}" fill="url(#${p}-cap)"/>` +
      [-0.25, 0, 0.25].map((k) => `<line x1="${f(capW * k)}" y1="${f(capY + 0.6)}" x2="${f(capW * k)}" y2="${f(capY + capH - 0.6)}" stroke="#6f5212" stroke-opacity=".5" stroke-width=".6"/>`).join("");

    if (type === "star") {
      const R = r, cy = capY + R * 0.95;
      const pts = [], hpts = [];
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? R * 0.45 : R;
        pts.push(f(Math.cos(a) * rr) + "," + f(cy + Math.sin(a) * rr));
        hpts.push(f(Math.cos(a) * rr * 0.55 - R * 0.06) + "," + f(cy - R * 0.06 + Math.sin(a) * rr * 0.55));
      }
      s += `<polygon points="${pts.join(" ")}" fill="url(#${p}-star)" stroke="#a87532" stroke-width="${f(R * 0.04)}" stroke-linejoin="round"/>`;
      s += `<polygon points="${hpts.join(" ")}" fill="#fff" opacity=".28"/>`;
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        s += `<line x1="0" y1="${f(cy)}" x2="${f(Math.cos(a) * R * 0.92)}" y2="${f(cy + Math.sin(a) * R * 0.92)}" stroke="#fff6d0" stroke-opacity=".45" stroke-width="${f(R * 0.03)}"/>`;
      }
      h = cy + R + 4;
    } else if (type === "finial") {
      const top = capY + capH * 0.8, H = r * 3.3;
      const P = (y) => f(top + y);
      const body = `M0,${P(0)} C${f(r * 0.6)},${P(0)} ${f(r)},${P(H * 0.2)} ${f(r)},${P(H * 0.38)} C${f(r)},${P(H * 0.58)} ${f(r * 0.32)},${P(H * 0.72)} 0,${P(H)} C${f(-r * 0.32)},${P(H * 0.72)} ${f(-r)},${P(H * 0.58)} ${f(-r)},${P(H * 0.38)} C${f(-r)},${P(H * 0.2)} ${f(-r * 0.6)},${P(0)} 0,${P(0)}Z`;
      const id = `${p}-fc${++uid}`;
      s += `<clipPath id="${id}"><path d="${body}"/></clipPath>`;
      s += `<path d="${body}" fill="url(#${p}-f-${color})"/>`;
      s += `<g clip-path="url(#${id})">`;
      [0.18, 0.38, 0.56].forEach((k, i) => {
        s += `<ellipse cx="0" cy="${P(H * k)}" rx="${f(r * 1.1)}" ry="${f(r * 0.16)}" fill="none" stroke="${i === 1 ? "#f1d47a" : "#fff"}" stroke-opacity="${i === 1 ? ".9" : ".45"}" stroke-width="${f(r * (i === 1 ? 0.12 : 0.05))}"/>`;
      });
      s += `<ellipse cx="${f(-r * 0.45)}" cy="${P(H * 0.3)}" rx="${f(r * 0.13)}" ry="${f(r * 0.6)}" fill="#fff" opacity=".55"/></g>`;
      s += cap;
      h = top + H + 4;
    } else {
      const cy = capY + capH + r * 0.94;
      const id = `${p}-c${++uid}`;
      s += `<clipPath id="${id}"><circle cx="0" cy="${f(cy)}" r="${f(r)}"/></clipPath>`;
      s += `<circle cx="0" cy="${f(cy)}" r="${f(r)}" fill="url(#${p}-b-${color})"/>`;
      s += `<g clip-path="url(#${id})">${ballDeco(p, deco, r, cy, rnd)}<circle cx="0" cy="${f(cy)}" r="${f(r)}" fill="url(#${p}-shade)"/></g>`;
      s += `<ellipse cx="${f(-r * 0.36)}" cy="${f(cy - r * 0.4)}" rx="${f(r * 0.24)}" ry="${f(r * 0.13)}" transform="rotate(-38 ${f(-r * 0.36)} ${f(cy - r * 0.4)})" fill="#fff" opacity=".78"/>`;
      s += `<circle cx="${f(-r * 0.1)}" cy="${f(cy - r * 0.64)}" r="${f(r * 0.05)}" fill="#fff" opacity=".6"/>`;
      s += cap;
      h = cy + r + 4;
    }
    return { svg: s, h };
  }

  /* ── Moño rojo ─────────────────────────────────────────────── */
  function bow(p, x, y, s) {
    return `<g transform="translate(${f(x)},${f(y)}) scale(${f(s)})">` +
      `<path d="M-1,1 L-10,19 L-6,17 L-4,21 L2,2Z M1,1 L10,19 L6,17 L4,21 L-2,2Z" fill="url(#${p}-bow)"/>` +
      `<path d="M0,0 C-6,-11 -21,-13 -21,-3 C-21,7 -6,5 0,0Z M0,0 C6,-11 21,-13 21,-3 C21,7 6,5 0,0Z" fill="url(#${p}-bow)" stroke="#ff7d8a" stroke-width=".7" stroke-opacity=".7"/>` +
      `<path d="M-3,-2 C-8,-7 -15,-8 -16,-4 M3,-2 C8,-7 15,-8 16,-4" fill="none" stroke="#7d0614" stroke-opacity=".45" stroke-width="1"/>` +
      `<ellipse cx="0" cy="0" rx="4" ry="4.6" fill="#b30f24" stroke="#ff7d8a" stroke-width=".6"/></g>`;
  }

  /* ── Guirnalda de pino (o tira de luces) en festones ───────── */
  function garland(opts) {
    const { width, swag, sag, top = 6, scale: s = 1, seed = 7, pine = true, balls = true, extras = false, bows = true } = opts;
    const p = "xm" + ++uid;
    const rnd = mulberry32(seed);
    const n = Math.max(2, Math.round(width / swag));
    const sw = width / n;
    const H = Math.ceil(top + sag + (balls ? 82 : 30) * s);
    const COLORS = ["red", "gold", "green", "silver", "wine", "blue"];
    const DECOS = ["band", "glitter", "plain", "snow", "lines", "zigzag"];
    let base = "", dark = "", mid = "", light = "", frost = "", berries = "", lights = "", bowsS = "", ballsS = "";

    for (let i = 0; i < n; i++) {
      const x0 = i * sw, x1 = x0 + sw, cx = (x0 + x1) / 2, cy = top + 2 * sag;
      base += `M${f(x0)},${top} Q${f(cx)},${f(cy)} ${f(x1)},${top} `;
      const pt = (t) => [(1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * top + 2 * (1 - t) * t * cy + t * t * top];
      const tan = (t) => Math.atan2(2 * (1 - t) * (cy - top) + 2 * t * (top - cy), 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx));

      if (pine) {
        const steps = Math.ceil(sw / (2.4 * s));
        for (let j = 0; j <= steps; j++) {
          const t = j / steps, [x, y] = pt(t), a = tan(t);
          for (let k = 0; k < 5; k++) {
            const side = rnd() < 0.5 ? -1 : 1;
            const ang = a + side * (Math.PI / 2) * (0.25 + rnd() * 0.85) - 0.35;
            const len = (7 + rnd() * 10) * s;
            const off = (rnd() - 0.5) * 7 * s;
            const sx = x - Math.sin(a) * off, sy = y + Math.cos(a) * off;
            const seg = `M${f(sx)},${f(sy)}l${f(Math.cos(ang) * len)},${f(Math.sin(ang) * len)}`;
            const r = rnd();
            if (r < 0.38) dark += seg; else if (r < 0.78) mid += seg; else if (r < 0.95) light += seg; else frost += seg;
          }
        }
        // Racimos de frutos rojos (acebo)
        for (let b = 0; b < 3; b++) {
          const [x, y] = pt(0.12 + rnd() * 0.76);
          for (let q = 0; q < 3; q++) {
            const bx = x + (rnd() - 0.5) * 7 * s, by = y + (rnd() - 0.5) * 7 * s, br = (2.2 + rnd()) * s;
            berries += `<circle cx="${f(bx)}" cy="${f(by)}" r="${f(br)}" fill="#c8102e"/><circle cx="${f(bx - br * 0.35)}" cy="${f(by - br * 0.35)}" r="${f(br * 0.32)}" fill="#fff" opacity=".7"/>`;
          }
        }
      }

      // Luces
      const mL = Math.max(3, Math.round(sw / ((pine ? 36 : 30) * s)));
      for (let k = 0; k < mL; k++) {
        const t = (k + 0.5) / mL, [x, y] = pt(t), a = tan(t);
        const ci = (i * mL + k) % LIGHTS.length;
        const up = pine && k % 2 === 1;
        const deg = (a * 180) / Math.PI + (up ? 180 : 0);
        lights += `<g transform="translate(${f(x)},${f(y)}) rotate(${f(deg)})"><g class="xl" style="animation-delay:${f(-rnd() * 3)}s;animation-duration:${f(1.3 + rnd() * 1.7)}s">` +
          `<circle cx="0" cy="${f(9 * s)}" r="${f(15 * s)}" fill="url(#${p}-g${ci})"/>` +
          `<rect x="${f(-2.3 * s)}" y="${f(0.5 * s)}" width="${f(4.6 * s)}" height="${f(4.2 * s)}" rx="${f(s)}" fill="#26352b"/>` +
          `<ellipse cx="0" cy="${f(9.6 * s)}" rx="${f(3.7 * s)}" ry="${f(5.7 * s)}" fill="${LIGHTS[ci]}"/>` +
          `<ellipse cx="${f(-1.2 * s)}" cy="${f(8 * s)}" rx="${f(s)}" ry="${f(2.2 * s)}" fill="#fff" opacity=".75"/></g></g>`;
      }

      // Bolas colgando del punto más bajo (y extras a los costados)
      if (balls) {
        const hangs = [[0.5, i % 2 ? 26 : 12, i % 3 === 0 ? 13.5 : 11.5]];
        if (extras && sw > 190) hangs.push([0.2, 6, 8.5], [0.8, 8, 8.5]);
        hangs.forEach(([t, len, r], h) => {
          const [x, y] = pt(t);
          const o = { r: r * s, len: len * s, color: COLORS[(i * 3 + h) % COLORS.length], deco: h ? "plain" : DECOS[i % DECOS.length], tw: 0.9 };
          const orn = ornament(p, o, rnd);
          ballsS += `<g class="xs" style="transform-origin:${f(x)}px ${f(y)}px;animation-delay:${f(-rnd() * 4)}s;animation-duration:${f(2.6 + rnd() * 1.8)}s"><g transform="translate(${f(x)},${f(y)})">${orn.svg}</g></g>`;
        });
      }
    }
    if (bows) for (let i = 0; i <= n; i++) bowsS += bow(p, i * sw, top + 2 * s, 0.85 * s);

    const lw = (w) => f(w * s);
    let body = ballsS;
    if (pine) {
      body += `<path d="${base}" fill="none" stroke="#163b23" stroke-width="${lw(12)}" stroke-linecap="round"/>` +
        `<path d="${dark}" stroke="#1d5530" stroke-width="${lw(2.1)}" stroke-linecap="round" fill="none"/>` +
        `<path d="${mid}" stroke="#2c7a43" stroke-width="${lw(1.9)}" stroke-linecap="round" fill="none"/>` +
        `<path d="${light}" stroke="#4fa35f" stroke-width="${lw(1.6)}" stroke-linecap="round" fill="none"/>` +
        `<path d="${frost}" stroke="#eaf6ef" stroke-width="${lw(1.6)}" stroke-linecap="round" fill="none" opacity=".9"/>` +
        berries;
    } else {
      body += `<path d="${base}" fill="none" stroke="#0b1a12" stroke-width="${lw(1.6)}"/>`;
    }
    body += bowsS + lights;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${f(width)}" height="${H}" viewBox="0 0 ${f(width)} ${H}" aria-hidden="true" focusable="false">${defs(p)}${body}</svg>`;
  }

  /* ── Adornos colgantes del hero ────────────────────────────── */
  const HERO_SET = [
    { left: 55, len: 60,  r: 26, color: "red",    deco: "band" },
    { left: 62, len: 160, r: 34, color: "gold",   deco: "glitter" },
    { left: 69, len: 50,  r: 24, type: "star" },
    { left: 76, len: 220, r: 40, color: "green",  deco: "snow" },
    { left: 83, len: 100, r: 26, type: "finial", color: "wine" },
    { left: 89, len: 180, r: 30, color: "silver", deco: "lines" },
    { left: 95, len: 70,  r: 25, color: "red",    deco: "zigzag" },
  ];

  function heroSet(vw, isPageHero) {
    if (vw <= 650) {
      return [
        { left: 84, len: 22, r: 14, color: "gold", deco: "glitter" },
        { left: 94, len: 60, r: 16, color: "red", deco: "band" },
      ];
    }
    if (vw <= 900) return HERO_SET.filter((o) => o.left >= 76).map((o) => ({ ...o, len: o.len * 0.6, r: o.r * 0.75 }));
    return isPageHero ? HERO_SET.filter((o) => o.left >= 69).map((o) => ({ ...o, len: o.len * 0.75 })) : HERO_SET;
  }

  function hanger(o, seed) {
    const p = "xm" + ++uid;
    const rnd = mulberry32(seed);
    const orn = ornament(p, { ...o, thread: "#e3c47a", tw: 1.4 }, rnd);
    const w = Math.ceil(o.r * 2 + 10);
    const h = Math.ceil(orn.h);
    const style = `left:${o.left}%;margin-left:${-w / 2}px;--d:${f(2.8 + rnd() * 2)}s;--del:${f(-rnd() * 4)}s;--amp:${f(2.5 + rnd() * 2.5)}deg`;
    return `<div class="xmas-hang" style="${style}"><svg width="${w}" height="${h}" viewBox="${f(-w / 2)} 0 ${w} ${h}" aria-hidden="true" focusable="false">${defs(p)}${orn.svg}</svg></div>`;
  }

  /* ── Montaje en la página ──────────────────────────────────── */
  function mount(host, cls, html) {
    let el = host.querySelector(":scope > ." + cls);
    if (!el) {
      el = document.createElement("div");
      el.className = "xmas-deco " + cls;
      el.setAttribute("aria-hidden", "true");
      host.appendChild(el);
    }
    el.innerHTML = html;
  }

  const header = document.querySelector("header");
  const hero = document.querySelector(".hero, .page-hero");
  const cta = document.querySelector(".cta-band");
  const footer = document.querySelector("footer");

  function build() {
    const vw = window.innerWidth;
    const small = vw <= 650;

    if (header) {
      mount(header, "xmas-garland", garland({
        width: header.clientWidth, swag: small ? 150 : 260, sag: small ? 15 : 28,
        scale: small ? 0.72 : 1, seed: 11, extras: !small,
      }));
    }
    if (hero) {
      const isPage = hero.classList.contains("page-hero");
      mount(hero, "xmas-hangers", heroSet(vw, isPage).map((o, i) => hanger(o, 100 + i)).join(""));
    }
    if (cta) {
      mount(cta, "xmas-garland-cta", garland({
        width: cta.clientWidth, swag: small ? 160 : 230, sag: small ? 12 : 17, top: 4,
        scale: small ? 0.7 : 0.9, seed: 23,
      }));
    }
    if (footer) {
      mount(footer, "xmas-lights-footer", garland({
        width: footer.clientWidth, swag: small ? 120 : 180, sag: small ? 8 : 12, top: 2,
        scale: small ? 0.7 : 0.85, seed: 31, pine: false, balls: false, bows: false,
      }));
    }
  }

  /* ── Nevada ────────────────────────────────────────────────── */
  function snow() {
    const c = document.createElement("canvas");
    c.className = "xmas-snow";
    c.setAttribute("aria-hidden", "true");
    document.body.appendChild(c);
    const ctx = c.getContext("2d");
    let W = 0, H = 0, flakes = [];
    const mk = (init) => ({
      x: Math.random() * W, y: init ? Math.random() * H : -8,
      r: 0.8 + Math.random() * 2.6, v: 0.3 + Math.random() * 0.8,
      ph: Math.random() * 6.28, sw: 0.4 + Math.random() * 1.2, o: 0.45 + Math.random() * 0.5,
    });
    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth; H = window.innerHeight;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(110, W / 14));
      while (flakes.length < n) flakes.push(mk(true));
      flakes.length = n;
    }
    function tick() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      for (const fl of flakes) {
        fl.y += fl.v * (fl.r / 2 + 0.5);
        fl.ph += 0.012;
        fl.x += Math.sin(fl.ph) * fl.sw * 0.4;
        if (fl.y > H + 6) Object.assign(fl, mk(false));
        ctx.globalAlpha = fl.o;
        ctx.beginPath();
        ctx.arc(fl.x, fl.y, fl.r, 0, 6.283);
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });
    requestAnimationFrame(tick);
  }

  function init() {
    document.documentElement.classList.add("xmas-on");
    build();
    let lastW = window.innerWidth, timer;
    window.addEventListener("resize", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (window.innerWidth !== lastW) { lastW = window.innerWidth; build(); }
      }, 200);
    }, { passive: true });
    if (!reduceMotion) snow();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

