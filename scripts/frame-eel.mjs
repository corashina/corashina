// Wraps snk's raw output (<dir>/eel-raw.svg) in a panel and writes <dir>/eel.svg.
// If snk produced nothing, the previous eel.svg is left as it is.
// Usage: node scripts/frame-eel.mjs [dist]
import { existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { eelFrame } from './blocks.mjs';

const dir = process.argv[2] || 'dist', raw = `${dir}/eel-raw.svg`;
if (!existsSync(raw)) { console.log(`no ${raw}, keeping the previous eel`); process.exit(0); }
writeFileSync(`${dir}/eel.svg`, eelFrame(readFileSync(raw, 'utf8')));
rmSync(raw);
console.log(`wrote ${dir}/eel.svg`);
