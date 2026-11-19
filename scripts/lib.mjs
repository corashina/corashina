// Small helpers for hand-built SVG. No dependencies.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Seeded random so every build gives the same picture.
export const R = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
export const f1 = (n) => (+n).toFixed(1);
export const P = (pts) => 'M' + pts.map((p) => f1(p[0]) + ' ' + f1(p[1])).join('L');
export const cub = (a, b, c, d, t) => { const m = 1 - t; return [0, 1].map((k) => m * m * m * a[k] + 3 * m * m * t * b[k] + 3 * m * t * t * c[k] + t * t * t * d[k]); };

let U = 0;
export const uid = (p) => p + (++U).toString(36);
export const resetIds = () => { U = 0; };

const attrs = (o) => `font-family="${o.f}" font-size="${o.s}"${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.c}"${o.ls != null ? ` letter-spacing="${o.ls}"` : ''}${o.a ? ` text-anchor="${o.a}"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}${o.x ? ' ' + o.x : ''}`;
export const tx = (x, y, s, o) => `<text x="${x}" y="${y}" ${attrs(o)}>${esc(s)}</text>`;

const stops = (st) => st.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}"${a === 1 ? '' : ` stop-opacity="${a}"`}/>`).join('');
export const vgrad = (id, st) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops(st)}</linearGradient>`;
export const hgrad = (id, st) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">${stops(st)}</linearGradient>`;
export const rgrad = (id, st, ex = '') => `<radialGradient id="${id}" ${ex}>${stops(st)}</radialGradient>`;
export const blurF = (id, s) => `<filter id="${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${s}"/></filter>`;
export const SPL = 'calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1"';

export function grain(w, h, op = 0.1) {
  const id = uid('gr');
  return `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="${w}" height="${h}" filter="url(#${id})" opacity="${op}" style="mix-blend-mode:overlay"/>`;
}

export function ridge(r, y0, amps, o = {}) {
  const w = o.w || 900, step = o.step || 6, bot = o.bot ?? 460, ph = amps.map(() => r() * 6.28);
  const pts = [];
  for (let x = -step; x <= w + step; x += step) {
    let y = y0 + (o.slope || 0) * x;
    amps.forEach(([a, f], i) => { y += a * Math.sin(x * f + ph[i]); });
    y += (r() - 0.5) * (o.jag || 0);
    pts.push([x, y]);
  }
  return {
    d: P(pts) + `L${w + step} ${bot}L${-step} ${bot}Z`,
    line: P(pts),
    at: (x) => { const i = Math.max(0, Math.min(pts.length - 1, Math.round((x + step) / step))); return pts[i][1]; },
  };
}

// Embed the subset woff2 fonts. Only the faces a file uses are included.
const FACES = { 'Sora-300': ['Sora', 300], 'Sora-500': ['Sora', 500], 'Inter-400': ['Inter', 400], 'Inter-500': ['Inter', 500], 'Inter-600': ['Inter', 600] };
export function fontFaces(names) {
  return names.map((n) => {
    const [fam, wt] = FACES[n];
    const b64 = readFileSync(join(ROOT, 'fonts', `${n}.woff2`)).toString('base64');
    return `@font-face{font-family:'${fam}';font-weight:${wt};src:url(data:font/woff2;base64,${b64}) format('woff2')}`;
  }).join('');
}

export const SANS = "'Inter',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";
export const SORA = "'Sora','Inter',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";

// Wrap a body into a standalone SVG document. `css` carries keyframes and font faces.
export function doc(w, h, body, { label, css = '', rx = 0 } = {}) {
  const clip = rx ? uid('clip') : null;
  const inner = clip ? `<clipPath id="${clip}"><rect width="${w}" height="${h}" rx="${rx}"/></clipPath><g clip-path="url(#${clip})">${body}</g>` : body;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title><style>${css}@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style>${inner}</svg>\n`;
}
