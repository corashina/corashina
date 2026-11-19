// Writes the static art: assets/hero.svg and assets/link-*.svg
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, resetIds } from './lib.mjs';
import { hero } from './hero.mjs';
import { LINKS, linkButton } from './links.mjs';

const out = join(ROOT, 'assets');
mkdirSync(out, { recursive: true });
resetIds();
writeFileSync(join(out, 'hero.svg'), hero());
LINKS.forEach((l, i) => { resetIds(); writeFileSync(join(out, `link-${l.key}.svg`), linkButton(l, i)); });
console.log('wrote assets/hero.svg and', LINKS.length, 'link buttons');
