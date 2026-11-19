// Writes languages.svg and activity.svg from public GitHub data.
// Usage: GITHUB_TOKEN=... node scripts/build-cards.mjs [--out dist] [--sample]
import { writeFileSync, mkdirSync } from 'node:fs';
import { languagesCard, activityCard, sampleData } from './cards.mjs';

const args = process.argv.slice(2);
const outDir = args.includes('--out') ? args[args.indexOf('--out') + 1] : 'dist';
const user = process.env.PROFILE_USER || 'corashina';

async function fetchData() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is not set (use --sample to render sample data)');
  const query = `query($login:String!){user(login:$login){
    repositories(first:100, ownerAffiliations:OWNER, isFork:false, privacy:PUBLIC){nodes{name languages(first:10, orderBy:{field:SIZE, direction:DESC}){edges{size node{name color}}}}}
    contributionsCollection{contributionCalendar{weeks{contributionDays{date contributionCount}}}}}}`;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'profile-cards' },
    body: JSON.stringify({ query, variables: { login: user } }),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  const u = json.data.user;

  const totals = new Map();
  for (const repo of u.repositories.nodes) {
    if (repo.name === user) continue; // the profile repo itself is generated code
    for (const e of repo.languages.edges) {
      const t = totals.get(e.node.name) || { name: e.node.name, color: e.node.color, size: 0 };
      t.size += e.size; totals.set(e.node.name, t);
    }
  }
  const sorted = [...totals.values()].sort((a, b) => b.size - a.size).slice(0, 6);
  const sum = sorted.reduce((s, l) => s + l.size, 0) || 1;
  const langs = sorted.map((l) => ({ name: l.name, color: l.color, share: l.size / sum }));

  const days = u.contributionsCollection.contributionCalendar.weeks.flatMap((w) => w.contributionDays)
    .map((d) => ({ date: d.date, count: d.contributionCount })).slice(-30);
  return { langs, days };
}

const data = args.includes('--sample') ? sampleData() : await fetchData();
if (!data.langs.length || data.days.length < 2) throw new Error('not enough data to draw the cards');
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/languages.svg`, languagesCard(data.langs));
writeFileSync(`${outDir}/activity.svg`, activityCard(data.days));
console.log(`wrote ${outDir}/languages.svg and ${outDir}/activity.svg`);
