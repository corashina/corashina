// Everything under the hero, drawn on one 900-unit grid with 16-unit gutters.
// Each block is its own SVG. Their widths are chosen so that, placed edge to edge
// at 25% / 33.333% / 66.667% / 100%, the panels line up with the hero's edges.
import { uid, f1, tx, vgrad, hgrad, rgrad, fontFaces, doc, SORA, SANS } from './lib.mjs';
import { C } from './hero.mjs';
import { ICONS } from './icons.mjs';

export const GW = 900, GAP = 16, LW = (GW - 3 * GAP) / 4; // a link tile is 213 wide
const BORDER = '#1a3033', TRACK = '#132427';

export const LINKS = [
  { key: 'website', label: 'Website', href: 'https://tomasz-zielinski.com' },
  { key: 'email', label: 'Email', href: 'mailto:corashina@gmail.com' },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/corashina' },
  { key: 'blog', label: 'Blog', href: 'https://tomasz-zielinski.com/blog' },
];

// [label, icon, tile colour, text colour]. Grouped by related tech, CV-relevant groups first.
export const STACK = [
  ['TypeScript', 'typescript', '#3178C6'], ['React', 'react', '#61DAFB', '#000'], ['JavaScript', 'javascript', '#F7DF1E', '#000'], ['React Native', 'react', '#61DAFB', '#000'], ['Expo', 'expo', '#000020'],
  ['C#', 'csharp', '#239120'], ['.NET', 'dotnet', '#512BD4'], ['Azure', 'azure', '#0078D4'], ['SQL', 'sql', '#CC2927'], ['Node.js', 'nodedotjs', '#339933'],
  ['Google Gemini', 'googlegemini', '#8E75B2'], ['Google Cloud', 'googlecloud', '#4285F4'], ['n8n', 'n8n', '#EA4B71'], ['GitHub Actions', 'githubactions', '#2088FF'],
  ['Kotlin', 'kotlin', '#7F52FF'], ['Java', 'openjdk', '#ED8B00'], ['Android', 'android', '#3DDC84', '#000'], ['Flutter', 'flutter', '#02569B'],
  ['Three.js', 'threedotjs', '#000000'], ['WebGL', 'webgl', '#990000'], ['GLSL', 'opengl', '#5586A4'], ['Rust', 'rust', '#B7410E'], ['Bevy', 'bevy', '#232326'], ['WebAssembly', 'webassembly', '#654FF0'],
];

const CSS = `@keyframes sweep{0%{transform:translateX(-260px)}60%,100%{transform:translateX(1160px)}}.sweep{animation:sweep 7s ease-in-out infinite}
@keyframes flick{0%,100%{opacity:.85}40%{opacity:.45}55%{opacity:1}75%{opacity:.6}}.flick{animation:flick 2.8s ease-in-out infinite}
@keyframes slide{0%{transform:translateX(-120px)}100%{transform:translateX(340px)}}.slide{animation:slide 5s linear infinite}`;
const FONTS = ['Sora-500', 'Inter-400', 'Inter-500', 'Inter-600'];
// Embed only the font faces a file uses.
function usedFonts(body) {
  const set = new Set();
  for (const [t] of body.matchAll(/<text [^>]*>/g)) { const f = /font-family="'(Sora|Inter)/.exec(t), w = /font-weight="(\d+)"/.exec(t); if (f) set.add(`${f[1]}-${w ? w[1] : 400}`); }
  return FONTS.filter((f) => set.has(f));
}
const out = (w, h, body, label) => doc(w, h, body, { label, css: fontFaces(usedFonts(body)) + CSS });

// ---- shared parts --------------------------------------------------------
// A dark panel with an ember rule along the top and a spark travelling along it.
function panel(x, y, w, h) {
  const g = uid('pg'), gl = uid('pl'), s = uid('sh'), cl = uid('cl');
  return `<defs>${vgrad(g, [[0, '#081517'], [1, '#040a0b']])}${rgrad(gl, [[0, C.ember, 0.16], [1, C.ember, 0]], 'cx="1" cy="1" r=".9"')}${hgrad(s, [[0, C.hot, 0], [0.5, C.hot, 1], [1, C.hot, 0]])}<clipPath id="${cl}"><rect x="${x}" y="${y}" width="${w}" height="2"/></clipPath></defs>
<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="6" fill="url(#${g})" stroke="${BORDER}"/><rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="6" fill="url(#${gl})"/>
<rect x="${x}" y="${y}" width="${w}" height="2" fill="${C.ember}" opacity=".7"/><g clip-path="url(#${cl})"><rect x="${x}" y="${y}" width="120" height="2" fill="url(#${s})" class="slide" style="animation-duration:${(w / 90).toFixed(1)}s"/></g>`;
}
// Small-caps heading with an ember square.
const head = (x, y, t) => `<rect x="${x}" y="${y - 8}" width="6" height="6" fill="${C.ember}" class="flick"/>${tx(x + 14, y, t.toUpperCase(), { f: SANS, s: 10.5, w: 600, c: C.sub, ls: 2.2 })}`;

// ---- links ----------------------------------------------------------------
function linkIcon(k, col) {
  const S = `stroke="${col}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  return {
    website: `<circle r="7.5" ${S}/><path d="M-7.5 0H7.5M0 -7.5C-4 -3.5 -4 3.5 0 7.5M0 -7.5C4 -3.5 4 3.5 0 7.5" ${S}/>`,
    email: `<rect x="-8" y="-5.5" width="16" height="11" rx="1.5" ${S}/><path d="M-7 -4.5L0 1L7 -4.5" ${S}/>`,
    linkedin: `<rect x="-7.5" y="-7.5" width="15" height="15" rx="2" ${S}/><path d="M-3.5 -.5V4M-3.5 -3.6V-3.4M0 4V-.5M0 1.5C0 -1.5 3.8 -1.6 3.8 1.2V4" ${S}/>`,
    blog: `<path d="M-6 6L-5 1.5L3.5 -7L7 -3.5L-1.5 5ZM1.5 -5L5 -1.5" ${S}/>`,
  }[k];
}
// Link SVG i is 225 wide and its tile sits at x = 4i, so the four tiles line up on the grid.
export function linkTile(l, i) {
  const W = 225, H = 72, x = 4 * i, gl = uid('mg');
  return out(W, H, `${panel(x, 0, LW, H)}<defs>${rgrad(gl, [[0, C.ember, 0.55], [1, C.ember, 0]])}</defs>
<ellipse cx="${x + LW / 2}" cy="${H}" rx="70" ry="16" fill="url(#${gl})" class="flick" style="animation-delay:${(i * 0.45).toFixed(2)}s"/>
<g transform="translate(${x + LW / 2} 26)">${linkIcon(l.key, C.hot)}</g>${tx(x + LW / 2, 54, l.label, { f: SORA, s: 14, w: 500, c: C.tx, a: 'middle', ls: 0.3 })}`, l.label);
}

// ---- stack ----------------------------------------------------------------
// One brand tile, flat and square like the shields badges.
function tile(x, y, w, h, [label, ic, bg, fg = '#fff']) {
  const dark = /^#(000|2323)/i.test(bg);
  return `<rect x="${f1(x)}" y="${y}" width="${f1(w)}" height="${h}" rx="2" fill="${bg}"${dark ? ' stroke="#ffffff" stroke-opacity=".14"' : ''}/>
<g transform="translate(${f1(x + 8)} ${f1(y + (h - 14) / 2)}) scale(.5833)"><path d="${ICONS[ic]}" fill="${fg}" fill-rule="evenodd"/></g>${tx(f1(x + 28), y + h / 2 + 4, label, { f: SANS, s: 11.5, w: 500, c: fg, ls: 0.1 })}`;
}
// 6 x 4 grid of tiles with a light sweeping across them now and then.
export function stack() {
  const cols = 6, th = 26, g = 10, x0 = 24, y0 = 24, tw = (GW - 2 * x0 - (cols - 1) * g) / cols;
  const rows = Math.ceil(STACK.length / cols), H = y0 * 2 + rows * th + (rows - 1) * g;
  const cl = uid('sc'), sg = uid('sg');
  let tiles = '', clip = '';
  STACK.forEach((it, i) => { const x = x0 + (i % cols) * (tw + g), y = y0 + Math.floor(i / cols) * (th + g); tiles += tile(x, y, tw, th, it); clip += `<rect x="${f1(x)}" y="${y}" width="${f1(tw)}" height="${th}" rx="2"/>`; });
  const sweep = `<defs><clipPath id="${cl}">${clip}</clipPath>${hgrad(sg, [[0, '#fff', 0], [0.5, '#fff', 0.32], [1, '#fff', 0]])}</defs><g clip-path="url(#${cl})"><rect width="160" height="${H}" fill="url(#${sg})" class="sweep" transform="skewX(-20)"/></g>`;
  return out(GW, H, `${panel(0, 0, GW, H)}${tiles}${sweep}`, 'Stack: ' + STACK.map((t) => t[0]).join(', '));
}

// ---- languages (left third) ----------------------------------------------
// langs: [{ name, color, share }] sorted, shares summing to about 1.
export function languagesCard(langs) {
  const W = 300, H = 200, pw = W - 8, L = 24, bw = pw - 48, by = 50;
  let bar = '', x = L, legend = '';
  langs.forEach((l, i) => { const w = bw * l.share; bar += `<rect x="${f1(x)}" y="${by}" width="0" height="10" fill="${l.color || '#888'}"><animate attributeName="width" from="0" to="${f1(w)}" begin="${(0.2 + i * 0.12).toFixed(2)}s" dur=".7s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".3 0 .2 1"/></rect>`; x += w; });
  langs.forEach((l, i) => {
    const cx = L + (i % 2) * (bw / 2 + 8), cy = by + 42 + Math.floor(i / 2) * 30;
    legend += `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${(0.4 + i * 0.1).toFixed(2)}s" dur=".4s" fill="freeze"/><rect x="${cx}" y="${cy - 9}" width="9" height="9" fill="${l.color || '#888'}"/>${tx(cx + 16, cy, l.name, { f: SANS, s: 12, w: 500, c: C.tx })}${tx(cx + bw / 2 - 8, cy, `${Math.round(l.share * 100)}%`, { f: SANS, s: 11, c: C.sub, op: 0.8, a: 'end' })}</g>`;
  });
  return out(W, H, `${panel(0, 0, pw, H)}${head(L, 30, 'Languages')}<rect x="${L}" y="${by}" width="${bw}" height="10" fill="${TRACK}"/>${bar}${legend}`,
    'Most used languages: ' + langs.map((l) => `${l.name} ${(l.share * 100).toFixed(1)}%`).join(', '));
}

// ---- contributions, last 30 days (right two thirds) ----------------------
// days: [{ date: 'YYYY-MM-DD', count }] oldest first.
export function activityCard(days) {
  const W = 600, H = 200, px = 8, x0 = px + 40, x1 = W - 24, y0 = 52, y1 = H - 40;
  const max = Math.max(1, ...days.map((d) => d.count)), step = (x1 - x0) / Math.max(1, days.length - 1), bw = step * 0.62;
  const fmt = (s) => { const [, m, d] = s.split('-'); return `${+d} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}`; };
  const bars = days.map((d, i) => {
    const x = x0 + i * step, h = (d.count / max) * (y1 - y0), y = y1 - h, col = d.count >= max * 0.66 ? C.hot : d.count >= max * 0.33 ? C.ember : '#a8541f', t = (0.2 + i * 0.03).toFixed(2);
    return h ? `<rect x="${f1(x - bw / 2)}" y="${y1}" width="${f1(bw)}" height="0" fill="${col}"><animate attributeName="height" from="0" to="${f1(h)}" begin="${t}s" dur=".5s" fill="freeze"/><animate attributeName="y" from="${y1}" to="${f1(y)}" begin="${t}s" dur=".5s" fill="freeze"/></rect>`
      : `<rect x="${f1(x - bw / 2)}" y="${y1 - 2}" width="${f1(bw)}" height="2" fill="${TRACK}"/>`;
  }).join('');
  const grid = `${[y0, (y0 + y1) / 2].map((y) => `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${BORDER}" stroke-dasharray="2 5"/>`).join('')}<line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}" stroke="${BORDER}"/>`;
  return out(W, H, `${panel(px, 0, W - px, H)}${head(px + 24, 30, 'Contributions · 30 days')}${grid}${bars}
${tx(x0, H - 18, fmt(days[0].date), { f: SANS, s: 11, c: C.sub, op: 0.8 })}${tx(x1, H - 18, fmt(days[days.length - 1].date), { f: SANS, s: 11, c: C.sub, op: 0.8, a: 'end' })}`, 'Daily contributions over the last 30 days');
}

// ---- contribution graph ---------------------------------------------------
// Puts snk's SVG inside a panel. The viewBox is cropped to the cell grid.
export function eelFrame(snk) {
  const H = 200, open = snk.match(/<svg\b[^>]*>/)[0];
  const tag = open.replace(/\s(width|height|viewBox|x|y)="[^"]*"/g, '').replace('<svg', '<svg x="22" y="50" width="856" height="124" viewBox="-6 -6 860 124"');
  const inner = snk.replace(/<\?xml[^>]*>/, '').replace(open, tag);
  return out(GW, H, `${panel(0, 0, GW, H)}${head(24, 30, 'Contribution graph · 12 months')}${inner}`, 'Contribution graph with an eel eating through it');
}

export function sampleData() {
  const langs = [['TypeScript', '#3178c6', 0.41], ['C#', '#178600', 0.19], ['Rust', '#dea584', 0.14], ['JavaScript', '#f1e05a', 0.12], ['Java', '#b07219', 0.08], ['GLSL', '#5686a5', 0.06]].map(([name, color, share]) => ({ name, color, share }));
  const days = [];
  const end = new Date('2026-11-19T00:00:00Z');
  let s = 7;
  for (let i = 29; i >= 0; i--) { const d = new Date(end - i * 864e5); s = (s * 16807) % 2147483647; days.push({ date: d.toISOString().slice(0, 10), count: s % 7 < 2 ? 0 : s % 9 }); }
  return { langs, days };
}
