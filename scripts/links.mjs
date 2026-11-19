// Link buttons. Each is its own SVG so the README can wrap it in a link.
import { uid, tx, vgrad, blurF, fontFaces, doc, SORA } from './lib.mjs';
import { C } from './hero.mjs';

export const LINKS = [
  { key: 'website', label: 'Website', href: 'https://tomasz-zielinski.com' },
  { key: 'email', label: 'Email', href: 'mailto:corashina@gmail.com' },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/corashina' },
  { key: 'blog', label: 'Blog', href: 'https://tomasz-zielinski.com/blog' },
];

function icon(k, col) {
  const S = `stroke="${col}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  return {
    website: `<circle r="7.5" ${S}/><path d="M-7.5 0H7.5M0 -7.5C-4 -3.5 -4 3.5 0 7.5M0 -7.5C4 -3.5 4 3.5 0 7.5" ${S}/>`,
    email: `<rect x="-8" y="-5.5" width="16" height="11" rx="2" ${S}/><path d="M-7 -4.5L0 1L7 -4.5" ${S}/>`,
    linkedin: `<rect x="-7.5" y="-7.5" width="15" height="15" rx="3" ${S}/><path d="M-3.5 -.5V4M-3.5 -3.6V-3.4M0 4V-.5M0 1.5C0 -1.5 3.8 -1.6 3.8 1.2V4" ${S}/>`,
    blog: `<path d="M-6 6L-5 1.5L3.5 -7L7 -3.5L-1.5 5ZM1.5 -5L5 -1.5" ${S}/>`,
  }[k];
}

const CSS = `@keyframes flick{0%,100%{opacity:1}45%{opacity:.5}52%{opacity:.9}70%{opacity:.65}}.flick{animation:flick 2.6s ease-in-out infinite}
@keyframes rise{0%{transform:translate(0,0);opacity:0}20%{opacity:1}100%{transform:translate(-3px,-30px);opacity:0}}.rise{animation:rise 3s ease-out infinite}`;

export function linkButton(l, i) {
  const W = 196, H = 52, g = uid('g'), b = uid('b');
  const sparks = [0, 1, 2].map((k) => `<g transform="translate(${150 + k * 12} ${44})"><circle r="1" fill="${C.hot}" class="rise" style="animation-delay:-${((i * 0.7 + k * 1.1) % 3).toFixed(1)}s"/></g>`).join('');
  const body = `<defs>${blurF(b, 3)}${vgrad(g, [[0, '#071012'], [1, '#1d0f08']])}</defs>
<rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="${(H - 8) / 2}" fill="none" stroke="${C.ember}" stroke-width="2.4" filter="url(#${b})" class="flick" style="animation-delay:-${(i * 0.6).toFixed(1)}s"/>
<rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="${(H - 8) / 2}" fill="url(#${g})" stroke="${C.ember}" stroke-opacity=".85"/>${sparks}
<g transform="translate(32 26)">${icon(l.key, C.hot)}</g>${tx(52, 31, l.label, { f: SORA, s: 14.5, w: 500, c: C.tx, ls: 0.3 })}`;
  return doc(W, H, body, { label: l.label, css: fontFaces(['Sora-500']) + CSS });
}
