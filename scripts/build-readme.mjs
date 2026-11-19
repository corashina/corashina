// Writes README.md from the link list and badge groups, so URLs stay in one place.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, esc } from './lib.mjs';
import { NAME, TAG, LINE } from './hero.mjs';
import { LINKS } from './links.mjs';
import { GROUPS, badgeUrl } from './badges.mjs';

const RAW = 'https://raw.githubusercontent.com/corashina/corashina/output';

const links = LINKS.map((l) => `  <a href="${l.href}"><img src="./assets/link-${l.key}.svg" height="52" alt="${l.label}"></a>`).join('\n');
const badges = GROUPS.map((g) => '  ' + g.map((b) => `<img src="${esc(badgeUrl(b))}" alt="${esc(b[0])}">`).join('\n  ')).join('\n  <br>\n');

const md = `<p align="center">
  <img src="./assets/hero.svg" width="100%" alt="${esc(`${NAME}. ${TAG}. ${LINE}`)}">
</p>

<p align="center">
${links}
</p>

<p align="center">
${badges}
</p>

<p align="center">
  <img src="${RAW}/languages.svg" width="33%" alt="Most used languages">
  <img src="${RAW}/activity.svg" width="65%" alt="Contributions over the last 30 days">
</p>

<p align="center">
  <img src="${RAW}/eel.svg" width="100%" alt="Contribution graph with a glowing eel eating through it">
</p>
`;
writeFileSync(join(ROOT, 'README.md'), md);
console.log('wrote README.md');
