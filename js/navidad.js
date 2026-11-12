/**
 * Gabriel Construcciones – Decoración navideña + Arbolito & Regalos (navidad.js)
 * -----------------------------------------------------------------------------
 * Genera con SVG (sin imágenes externas):
 *   · Guirnalda de pino con luces titilantes, moños y bolas bajo el menú.
 *   · Bolas, estrella y adornos colgantes que se balancean en el hero.
 *   · Arbolito de Navidad ilustrado en SVG con luces, guirnaldas, esferas y
 *     estrella brillante + 3 regalos interactivos al pie del árbol que al
 *     tocarlos revelan promociones ("Presupuesto sin cargo + 10% OFF antes de
 *     diciembre") y abren WhatsApp con mensaje prearmado + aviso de cupos.
 *   · Widget flotante del arbolito en páginas internas para abrir los regalos.
 *   · Guirnalda sobre la franja de contacto (CTA) y tira de luces en el footer.
 *   · Nevada suave.
 *
 * Se activa sola del 1/11 al 10/01. Forzar desde la URL:
 *   ?navidad=on   → siempre activa      ?navidad=off  → desactivada
 */
(() => {
  "use strict";

  const WHATSAPP_NUMBER = "5491136080260";

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
    s += `<radialGradient id="${p}-starglow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe88a" stop-opacity=".9"/><stop offset=".45" stop-color="#f3c950" stop-opacity=".35"/><stop offset="1" stop-color="#f3c950" stop-opacity="0"/></radialGradient>`;
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
        for (let b = 0; b < 3; b++) {
          const [x, y] = pt(0.12 + rnd() * 0.76);
          for (let q = 0; q < 3; q++) {
            const bx = x + (rnd() - 0.5) * 7 * s, by = y + (rnd() - 0.5) * 7 * s, br = (2.2 + rnd()) * s;
            berries += `<circle cx="${f(bx)}" cy="${f(by)}" r="${f(br)}" fill="#c8102e"/><circle cx="${f(bx - br * 0.35)}" cy="${f(by - br * 0.35)}" r="${f(br * 0.32)}" fill="#fff" opacity=".7"/>`;
          }
        }
      }

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

  /* ══════════════════════════════════════════════════════════════
     ARBOLITO DE NAVIDAD EN SVG + REGALOS INTERACTIVOS
     ══════════════════════════════════════════════════════════════ */
  const GIFTS_DATA = [
    {
      id: "regalo-1",
      tag: "REGALO #1 · OBRA Y ALBAÑILERÍA",
      badge: "🎁 Presupuesto sin cargo + 10% OFF",
      title: "10% de descuento + Presupuesto sin cargo en tu obra",
      desc: "Contratando tu obra de construcción, ampliación, losa o colocación de cerámicos antes del 30 de noviembre, congelamos mano de obra y te bonificamos un 10%.",
      perk1: "✓ Visita técnica y presupuesto escrito 100% sin cargo",
      perk2: "✓ 10% OFF reservando fecha antes de diciembre",
      perk3: "✓ Un único responsable coordinando todos los gremios",
      cta: "Reclamar mi 10% OFF por WhatsApp →",
      waMsg: "Hola Gabriel! 🎄 Abrí el Regalo #1 del arbolito en la web y quiero aprovechar el Presupuesto sin cargo + 10% de descuento antes de diciembre para una obra de albañilería/ampliación.",
      boxColor: ["#ff5969", "#cf122a", "#740615"],
      ribbonColor: ["#fff3b8", "#e0a932", "#885b08"],
      label: "Regalo 1",
      hint: "Obra y Albañilería",
    },
    {
      id: "regalo-2",
      tag: "REGALO #2 · COCINAS, BAÑOS Y REMODELACIÓN",
      badge: "🎁 Presupuesto sin cargo + 10% OFF",
      title: "Renová tu casa para las Fiestas con 10% OFF",
      desc: "Remodelación de cocinas, baños, pintura e interiores para recibir Navidad y Año Nuevo con tu casa impecable. Presupuesto sin cargo y 10% de descuento confirmando antes de diciembre.",
      perk1: "✓ Presupuesto detallado en menos de 24 hs sin cargo",
      perk2: "✓ 10% OFF en mano de obra antes del 1 de diciembre",
      perk3: "✓ Plomero, electricista, albañil y pintor coordinados",
      cta: "Quiero renovar con 10% OFF →",
      waMsg: "Hola Gabriel! 🎄 Abrí el Regalo #2 en la página web y quiero consultar por el Presupuesto sin cargo + 10% de descuento antes de diciembre para una remodelación.",
      boxColor: ["#ffe89c", "#d69b27", "#744c05"],
      ribbonColor: ["#ff5969", "#c8102e", "#6d0514"],
      label: "Regalo 2",
      hint: "Cocina, Baño y Pintura",
    },
    {
      id: "regalo-3",
      tag: "REGALO #3 · TECHOS, PLOMERÍA Y ELECTRICIDAD",
      badge: "🎁 Presupuesto sin cargo + 10% OFF",
      title: "Techos, Filtraciones e Instalaciones con 10% OFF",
      desc: "Impermeabilización de techos y losas, recambio de cañerías en termofusión o tableros eléctricos antes de las lluvias de verano. Diagnóstico sin cargo + 10% OFF.",
      perk1: "✓ Revisión y presupuesto sin cargo en CABA y GBA",
      perk2: "✓ 10% de descuento contratando antes de diciembre",
      perk3: "✓ Trabajo garantizado y materiales de primera línea",
      cta: "Pedir revisión sin cargo + 10% OFF →",
      waMsg: "Hola Gabriel! 🎄 Abrí el Regalo #3 del arbolito en la web y quiero pedir el Presupuesto sin cargo + 10% de descuento antes de diciembre para techos/plomería/electricidad.",
      boxColor: ["#62dba0", "#13824c", "#053b1f"],
      ribbonColor: ["#fff3b8", "#e0a932", "#885b08"],
      label: "Regalo 3",
      hint: "Techos e Instalaciones",
    },
  ];

  function buildChristmasTreeSVG() {
    const p = "xtree" + ++uid;
    const rnd = mulberry32(77);
    const W = 400, H = 470, cx = 200;

    // 5 capas de pino de arriba hacia abajo
    const tiers = [
      { topY: 64,  botY: 146, topW: 12,  botW: 84  },
      { topY: 118, botY: 212, topW: 36,  botW: 124 },
      { topY: 176, botY: 282, topW: 54,  botW: 162 },
      { topY: 240, botY: 352, topW: 72,  botW: 198 },
      { topY: 304, botY: 410, topW: 92,  botW: 230 },
    ];

    let layersSvg = "";
    let darkNeedles = "", midNeedles = "", lightNeedles = "", snowTips = "";

    tiers.forEach((tier, idx) => {
      const { topY, botY, topW, botW } = tier;
      const h = botY - topY;
      // Puntas festoneadas en la base de cada capa
      const scallops = 7 + idx * 2;
      let d = `M ${f(cx - topW / 2)},${f(topY)} `;
      d += `Q ${f(cx - topW * 0.65)},${f(topY + h * 0.55)} ${f(cx - botW / 2)},${f(botY - 8)} `;

      const stepW = botW / scallops;
      for (let s = 0; s < scallops; s++) {
        const sx0 = cx - botW / 2 + s * stepW;
        const sx1 = sx0 + stepW;
        const smid = (sx0 + sx1) / 2;
        const dip = botY + 12 + (s % 2 === 0 ? 5 : 0);
        d += `Q ${f(smid)},${f(dip)} ${f(sx1)},${f(botY - 8)} `;
      }
      d += `Q ${f(cx + topW * 0.65)},${f(topY + h * 0.55)} ${f(cx + topW / 2)},${f(topY)} Z`;

      layersSvg += `<path d="${d}" fill="url(#${p}-tier-${idx % 2})" stroke="#0d2c19" stroke-width="1.5" filter="url(#${p}-drop)"/>`;

      // Agujas de pino texturizadas dentro de cada capa
      const needleCount = 65 + idx * 22;
      for (let n = 0; n < needleCount; n++) {
        const t = Math.pow(rnd(), 0.85);
        const y = topY + 8 + t * (h - 12);
        const halfW = (topW / 2) + t * ((botW - topW) / 2) * 0.92;
        const x = cx + (rnd() * 2 - 1) * halfW;
        const dir = x < cx ? -1 : 1;
        const ang = Math.PI / 2 + dir * (0.25 + rnd() * 0.65);
        const len = 9 + rnd() * 11;
        const seg = `M${f(x)},${f(y)}l${f(Math.cos(ang) * len)},${f(Math.sin(ang) * len)}`;
        const pick = rnd();
        if (pick < 0.36) darkNeedles += seg;
        else if (pick < 0.78) midNeedles += seg;
        else if (pick < 0.94) lightNeedles += seg;
        else snowTips += seg;
      }
    });

    // Guirnaldas doradas / perlas que cruzan el árbol
    constgarlandPaths: {
      /* defined below */
    }
    const swagRows = [
      { y0: 132, y1: 145, w0: 56,  w1: 72 },
      { y0: 192, y1: 210, w0: 88,  w1: 112 },
      { y0: 258, y1: 280, w0: 122, w1: 148 },
      { y0: 326, y1: 352, w0: 156, w1: 186 },
      { y0: 382, y1: 398, w0: 190, w1: 204 },
    ];
    let tinselSvg = "", pearlsSvg = "", treeLightsSvg = "";
    swagRows.forEach((row, rIdx) => {
      const xL = cx - row.w0 / 2;
      const xR = cx + row.w1 / 2;
      const cY = (row.y0 + row.y1) / 2 + 24;
      tinselSvg += `<path d="M${f(xL)},${f(row.y0)} Q${f(cx)},${f(cY)} ${f(xR)},${f(row.y1)}" fill="none" stroke="url(#${p}-cap)" stroke-width="3.5" stroke-linecap="round" opacity=".9"/>`;

      const count = 7 + rIdx * 2;
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const px = (1 - t) ** 2 * xL + 2 * (1 - t) * t * cx + t * t * xR;
        const py = (1 - t) ** 2 * row.y0 + 2 * (1 - t) * t * cY + t * t * row.y1;
        pearlsSvg += `<circle cx="${f(px)}" cy="${f(py)}" r="2.6" fill="#fff6cf" stroke="#a87532" stroke-width=".6"/>`;

        if (i < count) {
          const lt = (i + 0.5) / count;
          const lx = (1 - lt) ** 2 * xL + 2 * (1 - lt) * lt * cx + lt * lt * xR;
          const ly = (1 - lt) ** 2 * row.y0 + 2 * (1 - lt) * lt * cY + lt * lt * row.y1 - 4;
          const ci = (rIdx * 5 + i) % LIGHTS.length;
          treeLightsSvg += `<g class="xl" style="animation-delay:${f(-rnd() * 3)}s;animation-duration:${f(1.2 + rnd() * 1.6)}s">` +
            `<circle cx="${f(lx)}" cy="${f(ly)}" r="12" fill="url(#${p}-g${ci})"/>` +
            `<circle cx="${f(lx)}" cy="${f(ly)}" r="3.4" fill="${LIGHTS[ci]}"/>` +
            `<circle cx="${f(lx - 1)}" cy="${f(ly - 1)}" r="1.2" fill="#fff" opacity=".85"/>` +
            `</g>`;
        }
      }
    });

    // Esferas del arbolito (grandes y vistosas)
    const treeOrnaments = [
      { x: 182, y: 112, r: 10, color: "red",    deco: "band" },
      { x: 222, y: 128, r: 9.5, color: "gold",  deco: "glitter" },
      { x: 158, y: 168, r: 12, color: "gold",   deco: "snow" },
      { x: 204, y: 176, r: 11, color: "red",    deco: "zigzag" },
      { x: 244, y: 184, r: 11.5, color: "silver", deco: "lines" },
      { x: 138, y: 232, r: 13, color: "wine",   deco: "band" },
      { x: 182, y: 244, r: 12.5, color: "blue", deco: "snow" },
      { x: 226, y: 238, r: 13.5, color: "red",  deco: "glitter" },
      { x: 266, y: 252, r: 11.5, color: "gold", deco: "band" },
      { x: 118, y: 306, r: 14, color: "red",    deco: "snow" },
      { x: 162, y: 318, r: 13, color: "gold",   deco: "lines" },
      { x: 206, y: 308, r: 14.5, color: "silver", deco: "band" },
      { x: 248, y: 322, r: 13, color: "wine",   deco: "glitter" },
      { x: 286, y: 310, r: 12.5, color: "green", deco: "zigzag" },
      { x: 104, y: 376, r: 14.5, color: "gold", deco: "band" },
      { x: 148, y: 388, r: 15, color: "red",    deco: "glitter" },
      { x: 198, y: 382, r: 14, color: "blue",   deco: "snow" },
      { x: 244, y: 392, r: 15, color: "gold",   deco: "zigzag" },
      { x: 294, y: 380, r: 14, color: "red",    deco: "band" },
    ];

    let ballsSvg = "";
    treeOrnaments.forEach((b) => {
      const orn = ornament(p, { r: b.r, len: 5, color: b.color, deco: b.deco, tw: 1 }, rnd);
      const topY = b.y - b.r - 8;
      ballsSvg += `<g class="xs" style="transform-origin:${f(b.x)}px ${f(topY)}px;animation-delay:${f(-rnd() * 4)}s;animation-duration:${f(2.6 + rnd() * 1.6)}s">` +
        `<g transform="translate(${f(b.x)},${f(topY)})">${orn.svg}</g></g>`;
    });

    // Moños rojos decorativos en el árbol
    const treeBows = [
      [172, 146, 0.72], [230, 152, 0.72],
      [148, 206, 0.8],  [252, 214, 0.8],
      [128, 276, 0.86], [202, 272, 0.85], [274, 282, 0.86],
      [122, 350, 0.92], [278, 354, 0.92],
    ];
    let bowsSvg = "";
    treeBows.forEach(([bx, by, bs]) => {
      bowsSvg += bow(p, bx, by, bs);
    });

    // Estrella superior grande con halo brillante
    const starY = 48, starR = 30;
    const sPts = [], sInPts = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? starR * 0.42 : starR;
      sPts.push(f(cx + Math.cos(a) * rr) + "," + f(starY + Math.sin(a) * rr));
      sInPts.push(f(cx + Math.cos(a) * rr * 0.55) + "," + f(starY + Math.sin(a) * rr * 0.55));
    }
    const starSvg = `<g class="xmas-tree-star">` +
      `<circle cx="${cx}" cy="${starY}" r="52" fill="url(#${p}-starglow)" class="xl"/>` +
      `<polygon points="${sPts.join(" ")}" fill="url(#${p}-star)" stroke="#b8821e" stroke-width="1.4" stroke-linejoin="round"/>` +
      `<polygon points="${sInPts.join(" ")}" fill="#fffbe6" opacity=".55"/>` +
      `<circle cx="${cx}" cy="${starY}" r="4.5" fill="#ffffff"/>` +
      `</g>`;

    const customDefs = defs(p).replace(
      "</defs>",
      `<linearGradient id="${p}-tier-0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f8548"/><stop offset=".55" stop-color="#1c5c30"/><stop offset="1" stop-color="#0f381c"/></linearGradient>` +
      `<linearGradient id="${p}-tier-1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#27733e"/><stop offset=".55" stop-color="#174f28"/><stop offset="1" stop-color="#0c2f17"/></linearGradient>` +
      `<linearGradient id="${p}-trunk" x1="0" x2="1"><stop offset="0" stop-color="#3b2210"/><stop offset=".45" stop-color="#6e4121"/><stop offset="1" stop-color="#2d180a"/></linearGradient>` +
      `<radialGradient id="${p}-snowbase" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".7" stop-color="#dfece5" stop-opacity=".75"/><stop offset="1" stop-color="#dfece5" stop-opacity="0"/></radialGradient>` +
      `<filter id="${p}-drop" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000" flood-opacity=".38"/></filter>` +
      `</defs>`
    );

    const trunkAndBase =
      `<ellipse cx="${cx}" cy="442" rx="165" ry="20" fill="url(#${p}-snowbase)"/>` +
      `<rect x="${cx - 22}" y="395" width="44" height="46" rx="6" fill="url(#${p}-trunk)" stroke="#241206" stroke-width="1.5"/>` +
      `<path d="M${cx - 48},432 L${cx + 48},432 L${cx + 38},452 L${cx - 38},452 Z" fill="#8c1424" stroke="#d8aa63" stroke-width="2"/>`;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" class="xmas-tree-svg" aria-hidden="true" focusable="false">` +
      customDefs +
      trunkAndBase +
      layersSvg +
      `<path d="${darkNeedles}" stroke="#11381e" stroke-width="2.2" stroke-linecap="round" fill="none"/>` +
      `<path d="${midNeedles}" stroke="#2d7c45" stroke-width="2" stroke-linecap="round" fill="none"/>` +
      `<path d="${lightNeedles}" stroke="#54b267" stroke-width="1.7" stroke-linecap="round" fill="none"/>` +
      `<path d="${snowTips}" stroke="#eef8f1" stroke-width="1.9" stroke-linecap="round" fill="none" opacity=".92"/>` +
      tinselSvg +
      pearlsSvg +
      bowsSvg +
      ballsSvg +
      treeLightsSvg +
      starSvg +
      `</svg>`;
  }

  /* ── SVG de cada caja de regalo interactiva ────────────────── */
  function buildGiftBoxSVG(g, idx) {
    const p = `xgift${idx}_${++uid}`;
    const [bL, bM, bD] = g.boxColor;
    const [rL, rM, rD] = g.ribbonColor;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 135" class="xmas-gift-svg" aria-hidden="true">` +
      `<defs>` +
      `<linearGradient id="${p}-box" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bL}"/><stop offset=".5" stop-color="${bM}"/><stop offset="1" stop-color="${bD}"/></linearGradient>` +
      `<linearGradient id="${p}-rib" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${rD}"/><stop offset=".35" stop-color="${rL}"/><stop offset=".65" stop-color="${rM}"/><stop offset="1" stop-color="${rD}"/></linearGradient>` +
      `</defs>` +
      // Sombra de piso
      `<ellipse cx="65" cy="126" rx="48" ry="6" fill="rgba(0,0,0,.35)"/>` +
      // Destello mágico al abrir
      `<circle cx="65" cy="68" r="46" fill="${rL}" opacity="0" class="xmas-gift-burst"/>` +
      // Cuerpo de la caja
      `<g class="xmas-gift-body">` +
      `<rect x="20" y="54" width="90" height="70" rx="6" fill="url(#${p}-box)" stroke="${bD}" stroke-width="1.5"/>` +
      `<rect x="20" y="54" width="90" height="10" fill="#000" opacity=".18"/>` +
      // Cinta vertical
      `<rect x="57" y="54" width="16" height="70" fill="url(#${p}-rib)"/>` +
      // Cinta horizontal
      `<rect x="20" y="82" width="90" height="13" fill="url(#${p}-rib)"/>` +
      // Brillo lateral
      `<rect x="25" y="60" width="6" height="58" rx="3" fill="#fff" opacity=".22"/>` +
      `</g>` +
      // Tapa + moño (se levanta al hacer hover/abrir)
      `<g class="xmas-gift-lid">` +
      // Moño superior
      `<path d="M65,38 C48,18 26,22 30,36 C33,46 52,44 65,38 Z" fill="url(#${p}-rib)" stroke="${rD}" stroke-width="1"/>` +
      `<path d="M65,38 C82,18 104,22 100,36 C97,46 78,44 65,38 Z" fill="url(#${p}-rib)" stroke="${rD}" stroke-width="1"/>` +
      `<ellipse cx="65" cy="37" rx="7" ry="6" fill="${rM}" stroke="${rL}" stroke-width="1"/>` +
      // Tapa de la caja
      `<rect x="15" y="38" width="100" height="19" rx="5" fill="url(#${p}-box)" stroke="${bD}" stroke-width="1.5"/>` +
      `<rect x="56" y="38" width="18" height="19" fill="url(#${p}-rib)"/>` +
      `<rect x="20" y="41" width="90" height="4" rx="2" fill="#fff" opacity=".28"/>` +
      `</g>` +
      `</svg>`;
  }

  /* ── Construcción de la sección y modal de promociones ─────── */
  function mountPromoModal() {
    if (document.getElementById("xmasPromoModal")) return;
    const modal = document.createElement("div");
    modal.className = "xmas-promo-modal";
    modal.id = "xmasPromoModal";
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
      <div class="xmas-promo-dialog">
        <div class="xmas-promo-topbar">
          <div class="xmas-promo-switcher" id="xmasPromoSwitcher" aria-label="Elegir otro regalo"></div>
          <button type="button" class="xmas-promo-close" id="xmasPromoClose" aria-label="Cerrar regalo">&times;</button>
        </div>
        <div class="xmas-promo-body">
          <span class="xmas-promo-tag" id="xmasPromoTag"></span>
          <div class="xmas-promo-discount" id="xmasPromoBadge"></div>
          <h3 class="xmas-promo-title" id="xmasPromoTitle"></h3>
          <p class="xmas-promo-desc" id="xmasPromoDesc"></p>
          <ul class="xmas-promo-perks">
            <li id="xmasPromoPerk1"></li>
            <li id="xmasPromoPerk2"></li>
            <li id="xmasPromoPerk3"></li>
          </ul>
          <div class="xmas-promo-urgency">
            <span class="xmas-urgency-dot"></span>
            <span><strong>Cupos limitados:</strong> quedan <strong>3 lugares disponibles</strong> antes de diciembre.</span>
          </div>
        </div>
        <div class="xmas-promo-footer">
          <a class="btn xmas-promo-cta" id="xmasPromoCta" href="#" target="_blank" rel="noopener noreferrer"></a>
          <button type="button" class="xmas-promo-back" id="xmasPromoBack">← Volver al arbolito / Cerrar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const switcher = modal.querySelector("#xmasPromoSwitcher");
    GIFTS_DATA.forEach((g, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "xmas-switch-btn";
      btn.dataset.idx = idx;
      btn.innerHTML = `🎁 ${g.label}`;
      btn.addEventListener("click", () => openGiftModal(idx));
      switcher.appendChild(btn);
    });

    modal.querySelector("#xmasPromoClose").addEventListener("click", closeGiftModal);
    modal.querySelector("#xmasPromoBack").addEventListener("click", closeGiftModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeGiftModal();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeGiftModal();
    });
  }

  function openGiftModal(index) {
    mountPromoModal();
    const g = GIFTS_DATA[index] || GIFTS_DATA[0];
    const modal = document.getElementById("xmasPromoModal");
    modal.querySelector("#xmasPromoTag").textContent = g.tag;
    modal.querySelector("#xmasPromoBadge").textContent = g.badge;
    modal.querySelector("#xmasPromoTitle").textContent = g.title;
    modal.querySelector("#xmasPromoDesc").textContent = g.desc;
    modal.querySelector("#xmasPromoPerk1").textContent = g.perk1;
    modal.querySelector("#xmasPromoPerk2").textContent = g.perk2;
    modal.querySelector("#xmasPromoPerk3").textContent = g.perk3;

    const cta = modal.querySelector("#xmasPromoCta");
    cta.textContent = g.cta;
    cta.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(g.waMsg)}`;

    modal.querySelectorAll(".xmas-switch-btn").forEach((b, i) => {
      b.classList.toggle("is-active", i === index);
    });

    document.querySelectorAll(`.xmas-gift-btn[data-gift-index="${index}"]`).forEach((btn) => {
      btn.classList.add("is-opened");
    });

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeGiftModal() {
    const modal = document.getElementById("xmasPromoModal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function mountChristmasSection() {
    const targetSection = document.getElementById("navidad-promo");
    if (targetSection) {
      const treeSlot = targetSection.querySelector("#xmasTreeSlot");
      const giftsSlot = targetSection.querySelector("#xmasGiftsSlot");
      if (treeSlot) treeSlot.innerHTML = buildChristmasTreeSVG();
      if (giftsSlot) {
        giftsSlot.innerHTML = GIFTS_DATA.map((g, idx) => `
          <button type="button" class="xmas-gift-btn" data-gift-index="${idx}" aria-label="Abrir ${g.label}: ${g.hint} - Presupuesto sin cargo más 10% de descuento">
            <span class="xmas-gift-click-tag">¡Tocá para abrir!</span>
            ${buildGiftBoxSVG(g, idx)}
            <span class="xmas-gift-label">${g.label}</span>
            <span class="xmas-gift-sublabel">${g.hint}</span>
          </button>
        `).join("");
        giftsSlot.querySelectorAll(".xmas-gift-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            openGiftModal(Number(btn.dataset.giftIndex));
          });
        });
      }
    }

    // Widget flotante de regalo navideño en todas las páginas para acceso rápido
    if (!document.getElementById("xmasFloatingGift")) {
      const fab = document.createElement("button");
      fab.type = "button";
      fab.id = "xmasFloatingGift";
      fab.className = "xmas-floating-gift";
      fab.setAttribute("aria-label", "Abrir regalo navideño: Presupuesto sin cargo + 10% OFF");
      fab.innerHTML = `
        <span class="xmas-fab-badge">10% OFF</span>
        <span class="xmas-fab-icon" aria-hidden="true">🎄🎁</span>
        <span class="xmas-fab-text">
          <strong>Regalo de Navidad</strong>
          <small>Tocá y ganá 10% OFF</small>
        </span>
      `;
      fab.addEventListener("click", () => {
        const sec = document.getElementById("navidad-promo");
        if (sec && window.scrollY < 200) {
          sec.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => openGiftModal(0), 650);
        } else {
          openGiftModal(0);
        }
      });
      document.body.appendChild(fab);
    }
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
    mountChristmasSection();
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
