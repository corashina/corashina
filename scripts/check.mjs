// Minimal well-formedness check for the generated SVGs: balanced tags, quoted attributes, no stray '<'.
// Usage: node scripts/check.mjs file.svg [...]
import { readFileSync } from 'node:fs';

let failed = false;
for (const file of process.argv.slice(2)) {
  const src = readFileSync(file, 'utf8').replace(/<style>[\s\S]*?<\/style>/g, '<style/>');
  const stack = [];
  const re = /<(\/?)([a-zA-Z][\w:-]*)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>|<!--[\s\S]*?-->|<|>/g;
  let m, err = null;
  while ((m = re.exec(src)) && !err) {
    if (m[0] === '<') err = `stray '<' at ${m.index}`;
    else if (m[0] === '>') err = `stray '>' at ${m.index}`;
    else if (m[0].startsWith('<!--')) continue;
    else if (m[1]) { const top = stack.pop(); if (top !== m[2]) err = `</${m[2]}> closes <${top}> at ${m.index}`; }
    else if (!m[4]) stack.push(m[2]);
  }
  if (!err && stack.length) err = `unclosed <${stack.join('>, <')}>`;
  if (!err && !/^<svg[\s>]/.test(src.trim())) err = 'does not start with <svg';
  console.log(`${err ? 'FAIL' : 'ok  '} ${file}${err ? ': ' + err : ''} (${(Buffer.byteLength(readFileSync(file)) / 1024).toFixed(0)} KB)`);
  if (err) failed = true;
}
process.exit(failed ? 1 : 0);
