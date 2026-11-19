// Writes the static art: assets/hero.svg, assets/link-*.svg and assets/stack.svg
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, resetIds } from './lib.mjs';
import { hero } from './hero.mjs';
import { LINKS, linkTile, stack } from './blocks.mjs';

const out = join(ROOT, 'assets');
mkdirSync(out, { recursive: true });
resetIds();
writeFileSync(join(out, 'hero.svg'), hero());
LINKS.forEach((l, i) => { resetIds(); writeFileSync(join(out, `link-${l.key}.svg`), linkTile(l, i)); });
resetIds();
writeFileSync(join(out, 'stack.svg'), stack());
console.log('wrote assets/hero.svg, assets/stack.svg and', LINKS.length, 'link tiles');
