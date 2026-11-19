// Tech badges, one line per group, most CV-relevant first. Rendered by shields.io.
const BG = '0d1517';

// Logos simple-icons does not carry (Microsoft brands), as small inline SVGs.
const svg64 = (s) => 'data:image/svg+xml;base64,' + Buffer.from(s).toString('base64');
const CUSTOM = {
  csharp: svg64('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1.5l9.1 5.25v10.5L12 22.5l-9.1-5.25V6.75z" fill="#9b4f96"/><path d="M13.4 8.6a4.4 4.4 0 1 0 0 6.8" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M15.6 10.4h4M15.6 13.6h4M16.8 9v6M18.6 9v6" stroke="#fff" stroke-width="1.1"/></svg>'),
  azure: svg64('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.6 2.5h5.1L7.4 21.5H2.3z" fill="#0089d6"/><path d="M15.2 7.4l6.5 14.1H9.5l6.2-1.9-3.6-4.3z" fill="#50b8f0"/></svg>'),
  sql: svg64('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><ellipse cx="12" cy="5.5" rx="8" ry="3" fill="#e8564f"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13c0 1.7-3.6 3-8 3s-8-1.3-8-3z" fill="#c8322b"/><path d="M4 10c0 1.7 3.6 3 8 3s8-1.3 8-3M4 14.5c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke="#ffb3ae" stroke-width="1" fill="none"/></svg>'),
};

// [label, simple-icons slug or custom key, logo colour]
export const GROUPS = [
  [['TypeScript', 'typescript', '3178C6'], ['React', 'react', '61DAFB'], ['JavaScript', 'javascript', 'F7DF1E'], ['React Native', 'react', '61DAFB'], ['Expo', 'expo', 'FFFFFF']],
  [['C#', 'csharp'], ['.NET', 'dotnet', 'A78BFA'], ['Azure', 'azure'], ['SQL', 'sql'], ['Node.js', 'nodedotjs', '5FA04E']],
  [['Google Gemini', 'googlegemini', '8E75B2'], ['Google Cloud', 'googlecloud', '4285F4'], ['n8n', 'n8n', 'EA4B71'], ['GitHub Actions', 'githubactions', '2088FF']],
  [['Kotlin', 'kotlin', 'A97BFF'], ['Java', 'openjdk', 'F89820'], ['Android', 'android', '34A853'], ['Flutter', 'flutter', '47C5FB']],
  [['Three.js', 'threedotjs', 'FFFFFF'], ['WebGL', 'webgl', 'E0464A'], ['GLSL', 'opengl', '7FB2D6'], ['Rust', 'rust', 'DEA584'], ['Bevy', 'bevy', 'FFFFFF'], ['WebAssembly', 'webassembly', '8F7CFF']],
];

const part = (s) => encodeURIComponent(s.replace(/-/g, '--').replace(/_/g, '__'));
export function badgeUrl([label, logo, color]) {
  const base = `https://img.shields.io/badge/-${part(label)}-${BG}?style=flat-square`;
  if (CUSTOM[logo]) return `${base}&logo=${encodeURIComponent(CUSTOM[logo])}`;
  return `${base}&logo=${logo}&logoColor=${color}`;
}
export const CUSTOM_LOGOS = CUSTOM;
