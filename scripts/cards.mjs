// Languages and contribution cards in the vent style. Pure rendering, no network.
import { uid, f1, P, tx, vgrad, rgrad, blurF, fontFaces, doc, SORA, SANS } from './lib.mjs';
import { C } from './hero.mjs';

const BG = '#050c0e', BORDER = '#16292c';
const frameCard = (w, h, glow) => `<defs>${rgrad(glow, [[0, C.ember, 0.18], [1, C.ember, 0]], 'cx="1" cy="1" r=".9"')}</defs><rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="16" fill="${BG}" stroke="${BORDER}"/><rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="16" fill="url(#${glow})"/>`;

// langs: [{ name, color, share }] with shares summing to about 1, already sorted.
export function languagesCard(langs) {
  const W = 300, H = 200, clip = uid('lc');
  let x = 24, bar = '';
  langs.forEach((l, i) => {
    const w = 252 * l.share;
    bar += `<rect x="${f1(x)}" y="58" width="0" height="10" fill="${l.color || '#888'}"><animate attributeName="width" from="0" to="${f1(w)}" begin="${(0.2 + i * 0.12).toFixed(2)}s" dur=".6s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".3 0 .2 1"/></rect>`;
    x += w;
  });
  const legend = langs.map((l, i) => {
    const cx = 24 + (i % 2) * 136, cy = 100 + Math.floor(i / 2) * 30;
    return `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${(0.5 + i * 0.1).toFixed(2)}s" dur=".4s" fill="freeze"/><circle cx="${cx + 5}" cy="${cy - 4}" r="5" fill="${l.color || '#888'}"/>${tx(cx + 16, cy, l.name, { f: SANS, s: 12, w: 500, c: C.tx })}${tx(cx + 120, cy, `${Math.round(l.share * 100)}%`, { f: SANS, s: 11, c: C.sub, op: 0.8, a: 'end' })}</g>`;
  }).join('');
  const body = `${frameCard(W, H, uid('g'))}${tx(24, 36, 'Most used languages', { f: SORA, s: 16, w: 500, c: C.tx })}
<clipPath id="${clip}"><rect x="24" y="58" width="252" height="10" rx="5"/></clipPath><rect x="24" y="58" width="252" height="10" rx="5" fill="${BORDER}"/><g clip-path="url(#${clip})">${bar}</g>${legend}`;
  return doc(W, H, body, { label: 'Most used languages: ' + langs.map((l) => `${l.name} ${(l.share * 100).toFixed(1)}%`).join(', '), css: fontFaces(['Sora-500', 'Inter-400', 'Inter-500']) });
}

// days: [{ date: 'YYYY-MM-DD', count }] oldest first.
export function activityCard(days) {
  const W = 600, H = 200, x0 = 40, x1 = 576, y0 = 64, y1 = 160;
  const max = Math.max(1, ...days.map((d) => d.count));
  const step = (x1 - x0) / Math.max(1, days.length - 1);
  const pts = days.map((d, i) => [x0 + i * step, y1 - (d.count / max) * (y1 - y0)]);
  // smooth line through the points
  let line = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], mx = (ax + bx) / 2; line += `C${f1(mx)} ${f1(ay)} ${f1(mx)} ${f1(by)} ${f1(bx)} ${f1(by)}`; }
  const area = `${line}L${x1} ${y1}L${x0} ${y1}Z`;
  const ag = uid('ag'), b = uid('b'), len = 1400;
  const fmt = (s) => { const [y, m, d] = s.split('-'); return `${+d} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}`; };
  const dots = pts.map(([x, y], i) => days[i].count ? `<circle cx="${f1(x)}" cy="${f1(y)}" r="0" fill="${C.hot}"><animate attributeName="r" from="0" to="2.4" begin="${(0.3 + i * 0.04).toFixed(2)}s" dur=".3s" fill="freeze"/></circle>` : '').join('');
  const body = `${frameCard(W, H, uid('g'))}<defs>${vgrad(ag, [[0, C.ember, 0.4], [1, C.ember, 0]])}${blurF(b, 4)}</defs>
${tx(24, 36, 'Contributions, last 30 days', { f: SORA, s: 16, w: 500, c: C.tx })}
${[y0, (y0 + y1) / 2].map((y) => `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${BORDER}" stroke-dasharray="2 5"/>`).join('')}<line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}" stroke="${BORDER}"/>
<path d="${area}" fill="url(#${ag})" opacity="0"><animate attributeName="opacity" from="0" to="1" begin=".6s" dur="1s" fill="freeze"/></path>
<path d="${line}" fill="none" stroke="${C.ember}" stroke-width="4" opacity=".5" filter="url(#${b})" stroke-dasharray="${len}" stroke-dashoffset="${len}"><animate attributeName="stroke-dashoffset" from="${len}" to="0" dur="1.6s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".4 0 .2 1"/></path>
<path d="${line}" fill="none" stroke="${C.hot}" stroke-width="2" stroke-linejoin="round" stroke-dasharray="${len}" stroke-dashoffset="${len}"><animate attributeName="stroke-dashoffset" from="${len}" to="0" dur="1.6s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".4 0 .2 1"/></path>
${dots}
${tx(x0, 182, fmt(days[0].date), { f: SANS, s: 11, c: C.sub, op: 0.8 })}${tx(x1, 182, fmt(days[days.length - 1].date), { f: SANS, s: 11, c: C.sub, op: 0.8, a: 'end' })}`;
  return doc(W, H, body, { label: 'Daily contributions over the last 30 days', css: fontFaces(['Sora-500', 'Inter-400']) });
}

export function sampleData() {
  const langs = [['TypeScript', '#3178c6', 0.41], ['C#', '#178600', 0.19], ['Rust', '#dea584', 0.14], ['JavaScript', '#f1e05a', 0.12], ['Java', '#b07219', 0.08], ['GLSL', '#5686a5', 0.06]].map(([name, color, share]) => ({ name, color, share }));
  const days = [];
  const end = new Date('2026-11-19T00:00:00Z');
  let s = 7;
  for (let i = 29; i >= 0; i--) { const d = new Date(end - i * 864e5); s = (s * 16807) % 2147483647; days.push({ date: d.toISOString().slice(0, 10), count: s % 7 < 2 ? 0 : s % 9 }); }
  return { langs, days };
}
