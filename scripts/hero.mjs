// The hero: a hydrothermal vent field with life drifting above it.
import { R, f1, P, cub, uid, tx, vgrad, hgrad, rgrad, blurF, SPL, grain, ridge, fontFaces, doc, SORA, SANS } from './lib.mjs';

export const NAME = 'Tomasz Zielinski';
export const TAG = 'Full-stack developer';
export const LINE = 'I build business software for a living and games for fun.';

export const C = {
  top: '#0f4752', mid: '#07262c', deep: '#02090b', floor: '#010405',
  ember: '#ff8a3d', hot: '#ffd08a', white: '#fff3e0', teal: '#5ff3e6', violet: '#9b8cff', amber: '#ffb35c',
  tx: '#fff4ea', sub: '#b9cdca', snow: '#a9dcd6',
};

const W = 900, H = 460;

const CSS = `
@keyframes fall{from{transform:translateY(-20px);opacity:0}20%{opacity:1}to{transform:translateY(90px);opacity:0}}
@keyframes tw{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes breathe{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes swim{0%{transform:translateY(0)}22%{transform:translateY(-9px)}100%{transform:translateY(0)}}
@keyframes bell{0%,100%{transform:scale(1,1)}18%{transform:scale(.86,1.05)}40%{transform:scale(1.05,.95)}}
@keyframes tent{0%,100%{transform:skewX(-6deg)}50%{transform:skewX(6deg)}}
@keyframes rise{0%{transform:translate(0,0);opacity:0}8%{opacity:1}50%{transform:translate(6px,-230px)}90%{opacity:.8}100%{transform:translate(-4px,-460px);opacity:0}}
@keyframes wig{0%,100%{transform:rotate(-9deg)}50%{transform:rotate(9deg)}}
@keyframes shaft{0%,100%{transform:rotate(-2.5deg);opacity:.45}50%{transform:rotate(2.5deg);opacity:1}}
@keyframes sway{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
@keyframes flick{0%,100%{opacity:1}45%{opacity:.55}52%{opacity:.95}70%{opacity:.7}}
@keyframes plume{0%{transform:translate(0,0) scale(.35);opacity:0}10%{opacity:.9}100%{transform:translate(-60px,-300px) scale(3.6);opacity:0}}
@keyframes hotpuff{0%{transform:translate(0,0) scale(.3);opacity:0}15%{opacity:1}100%{transform:translate(-10px,-70px) scale(1.8);opacity:0}}
@keyframes ember{0%{transform:translate(0,0);opacity:0}15%{opacity:1}100%{transform:translate(-24px,-170px);opacity:0}}
@keyframes twitch{0%,100%{transform:translate(0,0)}25%{transform:translate(3px,-2px)}50%{transform:translate(-2px,1px)}75%{transform:translate(1px,3px)}}
@keyframes drift{0%,100%{transform:translateX(0)}50%{transform:translateX(-24px)}}
.fall{animation:fall 9s linear infinite}.tw{animation:tw 3.4s ease-in-out infinite}.breathe{animation:breathe 5s ease-in-out infinite}
.swim{animation:swim 3.6s cubic-bezier(.3,0,.3,1) infinite}.bell{animation:bell 3.6s ease-in-out infinite}.tent{animation:tent 4s ease-in-out infinite}
.rise{animation:rise 12s linear infinite}.wig{animation:wig .5s ease-in-out infinite}.shaft{animation:shaft 11s ease-in-out infinite}
.sway{animation:sway 4.5s ease-in-out infinite}.flick{animation:flick 2.6s ease-in-out infinite}.plume{animation:plume 9s ease-out infinite}
.hotpuff{animation:hotpuff 2.4s ease-out infinite}.ember{animation:ember 6s ease-out infinite}.twitch{animation:twitch 1.3s steps(2) infinite}
.drift{animation:drift 18s ease-in-out infinite}`;

/* ---------- pieces ---------- */
function snowfall(r, n, col) {
  let s = '';
  for (let i = 0; i < n; i++) s += `<circle cx="${f1(r() * W)}" cy="${f1(r() * H)}" r="${(0.4 + r() * 1.1).toFixed(2)}" fill="${col}" opacity="${(0.2 + r() * 0.55).toFixed(2)}" class="fall" style="animation-delay:-${(r() * 9).toFixed(1)}s;animation-duration:${(7 + r() * 8).toFixed(1)}s"/>`;
  return s;
}
function plankton(r, n, cols, y0 = 0, h = H) {
  let s = '';
  for (let i = 0; i < n; i++) s += `<circle cx="${f1(r() * W)}" cy="${f1(y0 + r() * h)}" r="${(1 + r() * 2).toFixed(1)}" fill="${cols[i % cols.length]}" opacity="${(0.4 + r() * 0.5).toFixed(2)}" class="tw" style="animation-delay:${(r() * 3).toFixed(1)}s"/>`;
  return s;
}
function bubbles(r, n, x0, w, col) {
  let s = '';
  for (let i = 0; i < n; i++) s += `<g transform="translate(${f1(x0 + r() * w)} ${f1(380 + r() * 20)})"><circle r="${(1 + r() * 2.6).toFixed(1)}" fill="${col}" fill-opacity=".08" stroke="${col}" stroke-opacity=".6" class="rise" style="animation-duration:${(8 + r() * 8).toFixed(1)}s;animation-delay:-${(r() * 16).toFixed(1)}s"/></g>`;
  return s;
}
function school(r, n, col, d, dur, o = {}) {
  const id = uid('sp');
  let f = '';
  for (let i = 0; i < n; i++) {
    const ox = (r() - 0.5) * 110, oy = (r() - 0.5) * 40, s = (0.55 + r() * 0.6) * (o.s || 1);
    f += `<g transform="translate(${f1(ox)} ${f1(oy)}) scale(${s.toFixed(2)})"><g class="wig" style="animation-delay:-${r().toFixed(2)}s"><path d="M-8 0Q-2 -4.5 6 0Q-2 4.5 -8 0ZM-7 0L-13 -4L-11.5 0L-13 4Z" fill="${col}"/></g></g>`;
  }
  return `<path id="${id}" d="${d}" fill="none"/><g opacity="${o.op || 0.7}"><g>${f}</g><animateMotion dur="${dur}s" begin="-${o.begin || 4}s" repeatCount="indefinite" rotate="auto"><mpath href="#${id}"/></animateMotion></g>`;
}
function whale(col, fid) {
  return `<g opacity=".09" filter="url(#${fid})"><g><path d="M0 0C30 -28 120 -40 220 -20C250 -14 272 -6 292 -16L326 -44L318 -8L350 10L308 4C286 18 246 24 206 22C150 30 60 24 0 0ZM80 12C92 34 112 50 136 54C128 36 116 20 100 12Z" fill="${col}"/><animateTransform attributeName="transform" type="translate" values="1000 104;-420 80" dur="75s" begin="-30s" repeatCount="indefinite"/></g></g>`;
}
function jelly(x, y, s, col, seed, o = {}) {
  const r = R(seed), g = uid('jg'), b = uid('b'), b2 = uid('b'), dl = o.delay || 0, dur = o.dur || 3.6;
  let tent = '';
  for (let i = 0; i < 10; i++) {
    const sx = -34 + i * 7.5 + (r() - 0.5) * 4, l = 120 + r() * 90;
    tent += `<path d="M${f1(sx)} 3C${f1(sx + 8 + r() * 10)} ${f1(l * 0.3)} ${f1(sx - 14 - r() * 8)} ${f1(l * 0.62)} ${f1(sx + (r() - 0.5) * 16)} ${f1(l)}" stroke="${col}" stroke-opacity="${(0.25 + r() * 0.4).toFixed(2)}" stroke-width="${(0.6 + r() * 0.7).toFixed(2)}" fill="none"/>`;
  }
  let arm = '';
  for (const ax of [-9, 0, 9]) {
    let d = `M${ax} 2`; const L = ax ? 12 : 15;
    for (let k = 1; k <= L; k++) d += ` L${f1(ax + (k % 2 ? 5 : -5) * (1 - k / (L + 4)) + ax * 0.15 * k / L)} ${f1(2 + k * 7)}`;
    arm += `<path d="${d}" stroke="${col}" stroke-opacity="${ax ? 0.75 : 0.95}" stroke-width="${ax ? 2 : 2.8}" fill="none" stroke-linejoin="round"/>`;
  }
  const bell = 'M-40 0C-42 -38 -22 -56 0 -56C22 -56 42 -38 40 0C32 5 26 1 20 5C13 1 7 5 0 2C-7 5 -13 1 -20 5C-26 1 -32 5 -40 0Z';
  let rim = '';
  for (let k = 0; k < 9; k++) { const rx = -36 + k * 9; rim += `<circle cx="${rx}" cy="${f1(2 + Math.abs(rx) * 0.04)}" r="1.4" fill="#fff" class="tw" style="animation-delay:${(k * 0.18 + dl).toFixed(2)}s;animation-duration:1.6s"/>`; }
  const st = `animation-delay:${dl}s;animation-duration:${dur}s`;
  const drift = (o.dx || o.dy) ? `<animateTransform attributeName="transform" type="translate" values="0 0;${o.dx || 0} ${o.dy || 0};0 0" dur="${o.ddur || 18}s" begin="-${(r() * 10).toFixed(1)}s" repeatCount="indefinite" ${SPL}/>` : '';
  return `<defs>${rgrad(g, [[0, '#ffffff', 0.95], [0.22, col, 0.85], [1, col, 0.1]], 'cx=".5" cy=".18" r=".9"')}${blurF(b, 18)}${blurF(b2, 2)}</defs>
<g transform="translate(${x} ${y}) scale(${s})"${o.op ? ` opacity="${o.op}"` : ''}><g>${drift}<g class="swim" style="${st}">
<ellipse cx="0" cy="-12" rx="86" ry="70" fill="${col}" opacity=".2" filter="url(#${b})"/>
<g class="tent" style="animation-delay:${dl}s">${tent}<g filter="url(#${b2})">${arm}</g>${arm}</g>
<g class="bell" style="${st}"><path d="${bell}" fill="url(#${g})" stroke="${col}" stroke-width="1.2"/>
<path d="M-24 -6C-26 -30 -14 -46 0 -48M24 -6C26 -30 14 -46 0 -48M-10 -2C-12 -24 -6 -40 0 -48M10 -2C12 -24 6 -40 0 -48" stroke="#fff" stroke-opacity=".22" fill="none"/>
${[[-12, -28], [12, -28], [-5, -37], [5, -37]].map(([gx, gy]) => `<ellipse cx="${gx}" cy="${gy}" rx="5.5" ry="4" fill="${col}" opacity=".75"/>`).join('')}
<ellipse cx="0" cy="-30" rx="14" ry="10" fill="#fff" opacity=".16"/><path d="M-26 -36Q-18 -50 -4 -52" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none" stroke-linecap="round"/>${rim}</g>
</g></g></g>`;
}
function anemone(r, x, y, col, j, b) {
  let s = '';
  for (let k = 0; k < 15; k++) {
    const a = -164 + k * 10.5 + (r() - 0.5) * 6, l = 18 + r() * 16, ex = Math.cos(a * Math.PI / 180) * l, ey = Math.sin(a * Math.PI / 180) * l;
    s += `<path d="M0 0Q${f1(ex / 2 + (r() - 0.5) * 8)} ${f1(ey / 2)} ${f1(ex)} ${f1(ey)}" stroke="${col}" stroke-opacity=".7" fill="none"/><circle cx="${f1(ex)}" cy="${f1(ey)}" r="1.8" fill="${col}"/>`;
  }
  return `<g transform="translate(${x} ${f1(y)})"><circle cy="-12" r="26" fill="${col}" opacity=".28" filter="url(#${b})" class="breathe" style="animation-delay:-${j}s"/><g class="sway" style="animation-delay:-${(j * 0.7).toFixed(1)}s">${s}</g><ellipse rx="7" ry="3" fill="${col}" opacity=".5"/></g>`;
}
function worms(r, x, y, n, spread = 7) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const wx = x + (i - n / 2) * spread + (r() - 0.5) * 5, h = 16 + r() * 34, tip = (r() - 0.5) * 12;
    let pl = '';
    for (let j = 0; j < 8; j++) { const a = (-165 + j * 21) * Math.PI / 180; pl += `<path d="M0 0l${f1(Math.cos(a) * 9.5)} ${f1(Math.sin(a) * 9.5)}" stroke="#e3364d" stroke-width="2.3" stroke-linecap="round"/>`; }
    const d = `M0 0C${f1(tip * 0.3)} ${f1(-h * 0.4)} ${f1(tip * 0.8)} ${f1(-h * 0.7)} ${f1(tip)} ${f1(-h)}`;
    s += `<g transform="translate(${f1(wx)} ${f1(y)})"><g class="sway" style="animation-delay:-${(r() * 4).toFixed(1)}s;animation-duration:${(3.6 + r() * 2).toFixed(1)}s"><path d="${d}" stroke="#d9d0c3" stroke-width="4.4" stroke-linecap="round" fill="none"/><path d="${d}" stroke="#9c9285" stroke-width="1.4" fill="none" transform="translate(1.6 0)"/><g transform="translate(${f1(tip)} ${f1(-h)})">${pl}<circle r="4.6" fill="#ff4a5e"/><circle cx="-1.4" cy="-1.4" r="1.4" fill="#ffc0c8"/></g></g></g>`;
  }
  return s;
}
function mussels(r, x, y, n) {
  let s = '';
  for (let i = 0; i < n; i++) s += `<ellipse cx="${f1(x + (r() - 0.5) * 50)}" cy="${f1(y - r() * 6)}" rx="${(3 + r() * 2.5).toFixed(1)}" ry="${(1.8 + r()).toFixed(1)}" fill="#2a2f33" stroke="#c9b9a6" stroke-opacity=".35" stroke-width=".8" transform="rotate(${f1((r() - 0.5) * 50)} ${f1(x)} ${f1(y)})"/>`;
  return s;
}
function crab(x, y, k, walk) {
  const body = `<g class="twitch" style="animation-delay:-${k * 0.4}s;animation-duration:${2 + k * 0.6}s"><ellipse rx="6.5" ry="3.8" fill="#ece6dc"/><path d="M-5 1l-4 3M-3 2l-3 4M5 1l4 3M3 2l3 4M-4 -2l-5 -3M4 -2l5 -3" stroke="#ece6dc" stroke-width="1.1" fill="none"/><circle cx="-2" cy="-2.6" r=".9" fill="#222"/><circle cx="2" cy="-2.6" r=".9" fill="#222"/></g>`;
  const mv = walk ? `<animateTransform attributeName="transform" type="translate" values="0 0;${walk} 0;0 0" dur="${14 + k * 3}s" repeatCount="indefinite" ${SPL}/>` : '';
  return `<g transform="translate(${f1(x)} ${f1(y)})"><g>${mv}${body}</g></g>`;
}
function eelpout(id) {
  return `<path id="${id}" d="M960 404C760 396 620 418 420 402C300 392 180 410 -80 400" fill="none"/><g opacity=".9"><g transform="scale(-1 1)"><g class="wig" style="animation-duration:1.8s"><path d="M-40 0C-28 -4 4 -6 20 -3C25 -2 26 1 22 2.6C4 5 -28 4 -40 0Z" fill="#e3c9be"/><path d="M-40 0C-46 -1.6 -52 -1 -58 0C-52 1 -46 1.6 -40 0Z" fill="#cdb0a6"/><path d="M-30 -2.6C-12 -6 6 -5.4 18 -3.4" stroke="#fff" stroke-opacity=".35" fill="none"/><circle cx="16" cy="-1" r="1.2" fill="#2a2222"/></g></g><animateMotion dur="38s" begin="-12s" repeatCount="indefinite" rotate="auto"><mpath href="#${id}"/></animateMotion></g>`;
}

/* ---------- vents ---------- */
function chimneyShape(r, x, base, h, w) {
  const L = [], Rr = [];
  for (let i = 0; i <= 12; i++) {
    const y = base - h * i / 12, ww = w * (1 - i / 12 * 0.38) * (0.86 + r() * 0.28);
    L.push([x - ww / 2 + (r() - 0.5) * 5, y]); Rr.push([x + ww / 2 + (r() - 0.5) * 5, y]);
  }
  return { d: P([...L, ...Rr.reverse()]) + 'Z', widthAt: (t) => w * (1 - t * 0.38) };
}

export function hero() {
  const r = R(31);
  const ids = { bg: uid('bg'), warm: uid('w'), haze: uid('hz'), sh: uid('sh'), cg: uid('cg'), pg: uid('pg'), hp: uid('hp'), b4: uid('b'), b10: uid('b'), b16: uid('b'), b2: uid('b'), b3: uid('b'), wb: uid('b'), dist: uid('ds'), vig: uid('vg'), floor: uid('fl'), rim: uid('rm'), name: uid('ng'), nb: uid('nb'), mat: uid('mt'), ep: uid('ep'), surf: uid('sf'), caus: uid('cs'), cm: uid('cm'), cmg: uid('cmg') };
  const bed = ridge(r, 394, [[6, 0.01], [3, 0.05]], { jag: 3 });

  // light from the surface
  const rays = [[150, 50, 10, 5], [300, 70, 6, 1], [470, 60, 8, 0], [580, 90, -4, 3], [690, 50, 6, 6], [800, 110, -8, 2]]
    .map(([x, w, a, d]) => `<g transform="translate(${x} -10)"><g class="shaft" style="animation-delay:-${d}s"><path d="M${-w / 2} 0H${w / 2}L${f1(w * 1.8 + a * 8)} 380H${f1(-w * 1.4 + a * 8)}Z" fill="url(#${ids.sh})"/></g></g>`).join('');

  // far vents in the haze
  let far = '', farGlow = '';
  for (let i = 0; i < 11; i++) {
    const x = 330 + i * 54 + r() * 26, h = 24 + r() * 80, w = 12 + r() * 10, base = 392;
    far += `<path d="${chimneyShape(r, x, base, h, w).d}" fill="#0b2328"/>`;
    if (r() < 0.6) farGlow += `<circle cx="${f1(x)}" cy="${f1(base - h)}" r="${f1(w * 0.9)}" fill="${C.ember}" opacity=".22" filter="url(#${ids.b10})" class="flick" style="animation-delay:-${(r() * 2.6).toFixed(1)}s"/><path d="M${f1(x)} ${f1(base - h)}C${f1(x - 6)} ${f1(base - h - 40)} ${f1(x - 20)} ${f1(base - h - 80)} ${f1(x - 34)} ${f1(base - h - 150)}" stroke="#2a3a3c" stroke-width="${f1(w * 1.3)}" stroke-linecap="round" opacity=".35" filter="url(#${ids.b10})" fill="none"/>`;
  }

  // the three main black smokers and a small one
  const MAIN = [[520, 66, 20], [604, 168, 34], [716, 252, 46], [832, 142, 30]];
  let chim = '', plumes = '', hot = '', glowUnder = '', mats = '', cols = '';
  MAIN.forEach(([x, h, w], j) => {
    const base = bed.at(x) + 6, top = base - h, sh = chimneyShape(r, x, base, h, w);
    cols += `<path d="M${x} ${f1(top)}C${f1(x - 10)} ${f1(top - 90)} ${f1(x - 40)} ${f1(top - 170)} ${f1(x - 70)} ${f1(top - 320)}" stroke="#1b1816" stroke-width="${f1(w * 2.2)}" stroke-linecap="round" opacity=".55" filter="url(#${ids.b16})" fill="none" class="drift" style="animation-delay:-${j * 4}s"/>`;
    let nod = '';
    for (let k = 0; k < Math.round(h / 9); k++) { const t = r(), side = r() < 0.5 ? -1 : 1, yy = base - h * t, ww = sh.widthAt(t) / 2; nod += `<circle cx="${f1(x + side * (ww - 1 + r() * 3))}" cy="${f1(yy)}" r="${f1(2 + r() * 4.5)}" fill="${side < 0 ? '#2e231c' : '#0b0c0c'}"/>`; }
    let rust = '';
    for (let k = 0; k < 3; k++) { const xx = x + (r() - 0.5) * w * 0.5, ya = base - h * (0.1 + r() * 0.3), yb = ya - h * (0.2 + r() * 0.3); rust += `<path d="M${f1(xx)} ${f1(ya)}C${f1(xx + 3)} ${f1((ya + yb) / 2)} ${f1(xx - 3)} ${f1((ya + yb) / 2)} ${f1(xx + (r() - 0.5) * 4)} ${f1(yb)}" stroke="#8a4a26" stroke-width="${f1(1 + r() * 2)}" stroke-opacity=".35" fill="none"/>`; }
    chim += `${nod}<path d="${sh.d}" fill="url(#${ids.cg})"/>${rust}`;
    // flanges: ledges that trap shimmering hot water underneath
    const nf = h > 200 ? 2 : h > 100 ? 1 : 0;
    for (let k = 0; k < nf; k++) {
      const t = 0.3 + k * 0.3 + r() * 0.08, fy = base - h * t, fw = sh.widthAt(t) * (1.25 + r() * 0.2), side = k % 2 ? 1 : -1, fx = x + side * fw * 0.22;
      glowUnder += `<ellipse cx="${f1(fx)}" cy="${f1(fy + 5)}" rx="${f1(fw * 0.5)}" ry="4" fill="${C.ember}" opacity=".7" filter="url(#${ids.b3})" class="flick" style="animation-delay:-${(r() * 2.6).toFixed(1)}s"/>`;
      chim += `<path d="M${f1(fx - fw / 2)} ${f1(fy + 2)}C${f1(fx - fw / 2)} ${f1(fy - 6)} ${f1(fx + fw / 2)} ${f1(fy - 7)} ${f1(fx + fw / 2)} ${f1(fy + 1)}C${f1(fx + fw / 4)} ${f1(fy + 5)} ${f1(fx - fw / 4)} ${f1(fy + 5)} ${f1(fx - fw / 2)} ${f1(fy + 2)}Z" fill="#1d1916"/><path d="M${f1(fx - fw / 2)} ${f1(fy + 2)}C${f1(fx - fw / 4)} ${f1(fy + 5)} ${f1(fx + fw / 4)} ${f1(fy + 5)} ${f1(fx + fw / 2)} ${f1(fy + 1)}" stroke="${C.hot}" stroke-opacity=".45" stroke-width=".9" fill="none" class="flick" style="animation-delay:-${(r() * 2.6).toFixed(1)}s"/>`;
    }
    // glowing cracks
    let cr = '';
    for (let k = 0; k < Math.round(h / 45) + 1; k++) { const yy = base - h * (0.12 + k * 0.2 + r() * 0.05), xx = x + (r() - 0.5) * w * 0.45; cr += `M${f1(xx)} ${f1(yy)}l${f1((r() - 0.5) * 8)} -${f1(6 + r() * 8)}l${f1((r() - 0.5) * 6)} -${f1(5 + r() * 6)}l${f1((r() - 0.5) * 5)} -${f1(3 + r() * 5)}`; }
    chim += `<path d="${cr}" stroke="${C.ember}" stroke-width="3.4" fill="none" filter="url(#${ids.b2})" class="flick" style="animation-delay:-${j}s"/><path d="${cr}" stroke="${C.hot}" stroke-width="1" fill="none"/>`;
    // white bacterial mats near the base
    mats += `<ellipse cx="${f1(x + (r() - 0.5) * w)}" cy="${f1(base - 8 - r() * 20)}" rx="${f1(w * 0.4)}" ry="5" fill="url(#${ids.mat})"/>`;
    // the mouth: heat, glow and a column of smoke
    hot += `<circle cx="${x}" cy="${f1(top)}" r="${f1(w * 1.25)}" fill="${C.ember}" opacity=".5" filter="url(#${ids.b16})" class="flick" style="animation-delay:-${(j * 0.7).toFixed(1)}s"/><ellipse cx="${x}" cy="${f1(top + 1)}" rx="${f1(w * 0.36)}" ry="3.2" fill="${C.hot}"/><ellipse cx="${x}" cy="${f1(top + 1)}" rx="${f1(w * 0.16)}" ry="1.6" fill="#fff"/>`;
    for (let k = 0; k < 6; k++) hot += `<g transform="translate(${x} ${f1(top)})"><circle r="${f1(w * 0.42)}" fill="url(#${ids.hp})" class="hotpuff" style="animation-delay:-${(k * 0.4).toFixed(1)}s"/></g>`;
    const n = Math.round(6 + h / 20);
    for (let k = 0; k < n; k++) plumes += `<g transform="translate(${f1(x + (r() - 0.5) * 6)} ${f1(top - 4)})"><circle r="${f1(w * 0.55)}" fill="url(#${ids.pg})" class="plume" style="animation-delay:-${(k * 9 / n + j * 0.37).toFixed(2)}s;animation-duration:${(8 + r() * 2).toFixed(1)}s"/></g>`;
  });

  // life around the vents
  let embers = '';
  for (let i = 0; i < 34; i++) embers += `<g transform="translate(${f1(500 + r() * 380)} ${f1(150 + r() * 240)})"><circle r="${(0.7 + r() * 1.3).toFixed(1)}" fill="${C.hot}" class="ember" style="animation-delay:-${(r() * 6).toFixed(1)}s;animation-duration:${(5 + r() * 4).toFixed(1)}s"/></g>`;
  let swarm = '';
  [[716, 300, 46, 20, 9], [640, 330, 34, 14, 7], [790, 320, 38, 16, 11]].forEach(([cx, cy, rx, ry, dur], j) => {
    let dots = '';
    for (let i = 0; i < 12; i++) dots += `<g transform="translate(${f1((r() - 0.5) * 30)} ${f1((r() - 0.5) * 16)})"><path d="M-3 0Q0 -1.6 3 0Q0 1.6 -3 0Z" fill="${C.hot}" opacity=".85" class="twitch" style="animation-delay:-${(r() * 1.3).toFixed(2)}s"/></g>`;
    swarm += `<g><animateMotion path="M${cx - rx} ${cy}a${rx} ${ry} 0 1 ${j % 2} ${2 * rx} 0a${rx} ${ry} 0 1 ${j % 2} ${-2 * rx} 0" dur="${dur}s" begin="-${j * 3}s" repeatCount="indefinite" rotate="auto"/>${dots}</g>`;
  });
  let wormBeds = '', mus = '';
  [[470, 4], [566, 7], [660, 6], [770, 8], [876, 5]].forEach(([x, n]) => { const y = bed.at(x) + 5; mus += mussels(r, x, y, 10); wormBeds += worms(r, x, y, n); });
  const crabs = crab(452, bed.at(452) + 1, 0, 18) + crab(690, bed.at(690) + 1, 1, 0) + crab(800, bed.at(800) + 1, 2, -22) + crab(610, bed.at(610) + 2, 3, 0);
  const anem = anemone(r, 70, bed.at(70) + 8, C.teal, 0, ids.b10) + anemone(r, 190, bed.at(190) + 8, C.violet, 1, ids.b10) + anemone(r, 330, bed.at(330) + 8, C.teal, 2, ids.b10);

  // foreground rocks
  const fgL = `M-10 470L-10 400C30 388 70 396 110 410C150 420 200 418 240 432C260 440 270 452 280 470Z`;
  const fgR = `M910 470L910 404C880 400 860 414 840 426C820 438 800 446 790 470Z`;

  const defs = `<defs>
${vgrad(ids.bg, [[0, C.top], [0.32, C.mid], [0.7, C.deep], [1, C.floor]])}
${rgrad(ids.warm, [[0, C.ember, 0.42], [0.5, C.ember, 0.12], [1, C.ember, 0]], 'cx=".74" cy=".86" r=".55"')}
${rgrad(ids.surf, [[0, '#8fe6ff', 0.3], [1, '#8fe6ff', 0]], 'cx=".55" cy="-.05" r=".7"')}
${vgrad(ids.haze, [[0, '#2b5a5c', 0], [0.5, '#2b5a5c', 0.22], [1, '#2b5a5c', 0]])}
${vgrad(ids.sh, [[0, '#a9f0ff', 0.22], [0.55, '#a9f0ff', 0.05], [1, '#a9f0ff', 0]])}
<linearGradient id="${ids.cg}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a3326"/><stop offset=".28" stop-color="#211a16"/><stop offset=".7" stop-color="#0c0d0d"/><stop offset="1" stop-color="#060707"/></linearGradient>
${rgrad(ids.pg, [[0, '#7d6656', 0.85], [0.5, '#45392f', 0.55], [1, '#221d1a', 0]])}
${rgrad(ids.hp, [[0, C.hot, 0.9], [0.4, C.ember, 0.6], [1, C.ember, 0]])}
${rgrad(ids.mat, [[0, '#fff1d9', 0.45], [1, '#fff1d9', 0]])}
${vgrad(ids.floor, [[0, '#0a1112'], [1, '#010304']])}
${hgrad(ids.rim, [[0, C.teal, 0.12], [0.45, C.teal, 0.05], [0.7, C.ember, 0.45], [1, C.ember, 0.2]])}
${rgrad(ids.vig, [[0.6, '#000', 0], [1, '#000', 0.6]])}
${blurF(ids.b2, 2.2)}${blurF(ids.b3, 3)}${blurF(ids.b4, 4)}${blurF(ids.b10, 10)}${blurF(ids.b16, 16)}${blurF(ids.wb, 2.5)}
<filter id="${ids.dist}" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".012 .035" numOctaves="2" seed="4"><animate attributeName="baseFrequency" values=".012 .035;.016 .045;.012 .035" dur="10s" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="22"/></filter>
<linearGradient id="${ids.name}" gradientUnits="userSpaceOnUse" x1="44" y1="0" x2="304" y2="0"><stop offset="0" stop-color="${C.tx}"/><stop offset=".4" stop-color="${C.tx}"/><stop offset=".5" stop-color="${C.hot}"/><stop offset=".6" stop-color="${C.tx}"/><stop offset="1" stop-color="${C.tx}"/><animateTransform attributeName="gradientTransform" type="translate" values="-500 0;-500 0;700 0" keyTimes="0;.45;1" dur="8s" repeatCount="indefinite"/></linearGradient>
${blurF(ids.nb, 12)}
<filter id="${ids.caus}" x="0" y="0" width="100%" height="100%"><feTurbulence type="turbulence" baseFrequency=".018 .05" numOctaves="2" seed="9"><animate attributeName="baseFrequency" values=".018 .05;.022 .06;.018 .05" dur="14s" repeatCount="indefinite"/></feTurbulence><feColorMatrix values="0 0 0 0 .65  0 0 0 0 .95  0 0 0 0 1  0 0 0 -2.2 1.1"/></filter>
${vgrad(ids.cmg, [[0, '#fff', 0.55], [1, '#fff', 0]])}<mask id="${ids.cm}"><rect width="${W}" height="150" fill="url(#${ids.cmg})"/></mask>
</defs>`;

  const ny = 196;
  const name = `${tx(44, ny, NAME, { f: SORA, s: 56, w: 300, c: C.ember, op: 0.45, ls: 0.5, x: `filter="url(#${ids.nb})"` })}${tx(44, ny, NAME, { f: SORA, s: 56, w: 300, c: `url(#${ids.name})`, ls: 0.5 })}
${tx(48, ny + 36, TAG.toUpperCase(), { f: SANS, s: 11.5, w: 600, c: C.ember, ls: 4.2 })}${tx(48, ny + 64, LINE, { f: SANS, s: 14, w: 400, c: C.sub })}`;

  const body = `${defs}
<rect width="${W}" height="${H}" fill="url(#${ids.bg})"/><rect width="${W}" height="${H}" fill="url(#${ids.surf})"/><rect width="${W}" height="150" filter="url(#${ids.caus})" mask="url(#${ids.cm})"/>${rays}
${whale(C.snow, ids.wb)}
<g filter="url(#${ids.b2})">${plankton(r, 30, [C.teal, C.amber, C.violet])}</g>
<rect y="230" width="${W}" height="170" fill="url(#${ids.haze})"/><rect width="${W}" height="${H}" fill="url(#${ids.warm})"/>
${farGlow}${far}
${jelly(560, 96, 0.7, C.teal, 7, { dx: -22, dy: 12, ddur: 16 })}${jelly(420, 50, 0.3, C.amber, 8, { delay: -0.9, dx: 26, dy: 8, ddur: 22 })}${jelly(860, 70, 0.4, C.violet, 6, { delay: -1.6, dx: -18, dy: 14, ddur: 19 })}${jelly(130, 66, 0.2, C.teal, 11, { delay: -2.2, op: 0.6, dx: 30, dy: 10, ddur: 28 })}${jelly(300, 300, 0.24, C.amber, 12, { delay: -1.1, op: 0.75, dx: -24, dy: -14, ddur: 24 })}
${school(r, 18, '#cfe6e2', 'M-140 330C200 300 520 330 1040 230', 26)}
<g filter="url(#${ids.dist})">${cols}${plumes}</g>
${glowUnder}${chim}${hot}${mats}
${swarm}${embers}
<path d="${bed.d}" fill="url(#${ids.floor})"/><path d="${bed.line}" stroke="url(#${ids.rim})" stroke-width="1.5" fill="none"/>
${mus}${wormBeds}${crabs}${anem}
${eelpout(ids.ep)}
<path d="${fgL}" fill="#010304"/><path d="${fgR}" fill="#010304"/><path d="M910 404C880 400 860 414 840 426C820 438 800 446 790 470" stroke="${C.ember}" stroke-opacity=".35" fill="none"/>
${snowfall(r, 150, C.snow)}${bubbles(r, 14, 500, 380, C.snow)}
<rect width="${W}" height="${H}" fill="url(#${ids.vig})"/>
${name}
${grain(W, H, 0.09)}`;

  return doc(W, H, body, { label: `${NAME}. ${TAG}. ${LINE}`, css: fontFaces(['Sora-300', 'Inter-400', 'Inter-600']) + CSS, rx: 18 });
}
