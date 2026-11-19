// Writes README.md. Images in a row sit edge to edge (no whitespace between them),
// so the blocks line up with the hero on one grid.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, esc } from './lib.mjs';
import { NAME, TAG, LINE } from './hero.mjs';
import { LINKS, STACK } from './blocks.mjs';

const RAW = 'https://raw.githubusercontent.com/corashina/corashina/output';
const links = LINKS.map((l) => `<a href="${l.href}"><img src="./assets/link-${l.key}.svg" width="25%" alt="${l.label}"></a>`).join('');

const md = `<p align="center"><img src="./assets/hero.svg" width="100%" alt="${esc(`${NAME}. ${TAG}. ${LINE}`)}"></p>

<p align="center">${links}</p>

<p align="center"><img src="./assets/stack.svg" width="100%" alt="${esc('Stack: ' + STACK.map((t) => t[0]).join(', '))}"></p>

<p align="center"><img src="${RAW}/languages.svg" width="33.333%" alt="Most used languages"><img src="${RAW}/activity.svg" width="66.667%" alt="Contributions over the last 30 days"></p>

<p align="center"><img src="${RAW}/eel.svg" width="100%" alt="Contribution graph with an eel eating through it"></p>
`;
writeFileSync(join(ROOT, 'README.md'), md);
console.log('wrote README.md');
