// Generates the Mughal gate SVG used by the preloader (and imported into Figma).
// Run: node tools/gate.mjs  ->  writes src/assets/gate.svg
import { writeFileSync, mkdirSync } from 'node:fs';

const W = 1440, H = 900, CX = 720;
const GOLD = '#C9A35C';

// Pointed (four-centred) arch helper: x = left edge, w = width, spring = y where curve starts,
// apex = top y, base = bottom y.
const arch = (x, w, spring, apex, base, close = true) => {
  const m = x + w / 2, r = x + w;
  const k = (spring - apex);
  return `M${x},${base} L${x},${spring} C${x},${spring - k * 0.62} ${m - w * 0.2},${apex + k * 0.28} ${m},${apex} ` +
    `C${m + w * 0.2},${apex + k * 0.28} ${r},${spring - k * 0.62} ${r},${spring} L${r},${base}${close ? ' Z' : ''}`;
};
const rect = (x, y, w, h) => `M${x},${y} H${x + w} V${y + h} H${x} Z`;
const mirror = (d) => d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, a, b) => `${+(2 * CX - +a).toFixed(2)},${b}`)
  .replace(/H(-?\d+(?:\.\d+)?)/g, (_, a) => `H${+(2 * CX - +a).toFixed(2)}`);
const onion = (cx, base, w, h) => {
  const l = cx - w / 2, r = cx + w / 2, top = base - h;
  return `M${l},${base} C${l - w * 0.08},${base - h * 0.55} ${cx - w * 0.18},${base - h * 0.72} ${cx},${top} ` +
    `C${cx + w * 0.18},${base - h * 0.72} ${r + w * 0.08},${base - h * 0.55} ${r},${base} Z`;
};
const merlons = (x0, x1, y, size = 14) => {
  let d = '';
  for (let x = x0; x + size <= x1 + 0.1; x += size) {
    d += `M${x},${y} L${x},${y - size * 0.55} C${x},${y - size * 0.9} ${x + size / 2},${y - size * 1.05} ${x + size / 2},${y - size * 1.25} ` +
      `C${x + size / 2},${y - size * 1.05} ${x + size},${y - size * 0.9} ${x + size},${y - size * 0.55} L${x + size},${y} `;
  }
  return d;
};

// ---------- Shapes (left half where symmetric; mirrored automatically) ----------
const solids = [];   // filled silhouette pieces (facade)
const lines = [];    // gold line details
const both = (d) => { solids.push(d); lines.push(d); };
const sym = (fn) => { const d = fn(); return [d, mirror(d)]; };

// Outer minarets
for (const d of sym(() => `M136,900 L142,150 L158,150 L164,900 Z`)) both(d);
for (const y of [660, 450, 250]) for (const d of sym(() => rect(124, y, 52, 9))) both(d);
for (const y of [660, 450, 250]) for (const d of sym(() => `M128,${y + 9} L140,${y + 24} M172,${y + 9} L160,${y + 24}`)) lines.push(d);
for (const d of sym(() => rect(132, 120, 36, 30))) both(d);
for (const d of sym(() => `M132,120 H168 M138,150 V120 M162,150 V120`)) lines.push(d);
for (const d of sym(() => onion(150, 121, 40, 46))) both(d);
for (const d of sym(() => `M150,75 V52`)) lines.push(d);

// Wings
for (const d of sym(() => rect(196, 430, 296, 440))) both(d);
for (const d of sym(() => merlons(196, 490, 430, 14))) lines.push(d);
for (const d of sym(() => `M196,620 H492 M196,632 H492`)) lines.push(d);
for (const tier of [{ s: 700, a: 652, b: 852 }, { s: 520, a: 476, b: 606 }]) {
  for (const x of [222, 314, 406]) {
    for (const d of sym(() => arch(x, 66, tier.s, tier.a, tier.b))) lines.push(d);
    for (const d of sym(() => arch(x + 9, 48, tier.s + 6, tier.a + 13, tier.b))) lines.push(d);
  }
}

// Wing corner chhatris
for (const d of sym(() => rect(206, 380, 52, 50))) solids.push(d);
for (const d of sym(() => `M196,380 H268 M206,430 V380 M232,430 V380 M258,430 V380`)) lines.push(d);
for (const d of sym(() => onion(232, 381, 54, 52))) both(d);
for (const d of sym(() => `M232,329 V308`)) lines.push(d);

// Engaged turrets flanking the portal
for (const d of sym(() => rect(490, 214, 24, 656))) both(d);
for (const y of [300, 420, 540, 660, 780]) for (const d of sym(() => `M486,${y} H518`)) lines.push(d);
for (const d of sym(() => onion(502, 215, 30, 34))) both(d);
for (const d of sym(() => `M502,181 V164`)) lines.push(d);

// Great dome behind the portal
both(rect(626, 196, 188, 40));
both(onion(CX, 199, 222, 150));
lines.push(`M${CX},49 V20`, `M${CX - 60},199 C${CX - 52},140 ${CX - 30},92 ${CX},49`, `M${CX + 60},199 C${CX + 52},140 ${CX + 30},92 ${CX},49`);

// Portal (pishtaq)
both(rect(514, 250, 412, 620));
lines.push(merlons(514, 926, 250, 16));
lines.push(rect(530, 266, 380, 604), rect(544, 280, 352, 590));
lines.push(arch(586, 268, 568, 342, 900, false));
lines.push(`M600,330 m-18,0 a18,18 0 1,0 36,0 a18,18 0 1,0 -36,0`, `M840,330 m-18,0 a18,18 0 1,0 36,0 a18,18 0 1,0 -36,0`);
lines.push(`M600,330 m-7,0 a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0`, `M840,330 m-7,0 a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0`);

// Plinth & steps
both(rect(88, 870, 1264, 30));
lines.push(`M88,882 H1352 M88,892 H1352`);

const HOLE = arch(606, 228, 572, 372, 900);

const doorLeft = `M606,900 L606,572 C606,448 674,410 720,372 L720,900 Z`;
const doorRight = mirror(doorLeft);
const studs = (side) => {
  let s = '';
  for (let y = 600; y <= 880; y += 28) {
    for (let i = 0; i < 4; i++) {
      const x = side === 'l' ? 626 + i * 24 : 814 - i * 24;
      s += `<circle cx="${x}" cy="${y}" r="2.6"/>`;
    }
  }
  return s;
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" class="gate-svg" aria-hidden="true">
  <defs>
    <radialGradient id="gSky" cx="50%" cy="100%" r="85%">
      <stop offset="0" stop-color="#3A1A12"/>
      <stop offset="0.45" stop-color="#1A0E0B"/>
      <stop offset="1" stop-color="#090605"/>
    </radialGradient>
    <linearGradient id="gFacade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2A1812"/>
      <stop offset="1" stop-color="#140C09"/>
    </linearGradient>
    <linearGradient id="gDoor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3B2015"/>
      <stop offset="1" stop-color="#1E100B"/>
    </linearGradient>
    <radialGradient id="gGlow" cx="50%" cy="75%" r="60%">
      <stop offset="0" stop-color="#FFE3A3"/>
      <stop offset="0.5" stop-color="#E9A44C"/>
      <stop offset="1" stop-color="#7A3416"/>
    </radialGradient>
    <mask id="mHole" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
      <rect width="${W}" height="${H}" fill="#fff"/>
      <path d="${HOLE}" fill="#000"/>
    </mask>
  </defs>
  <g class="gate-shell" mask="url(#mHole)">
    <rect class="gate-sky" width="${W}" height="${H}" fill="url(#gSky)"/>
    <g class="gate-solid" fill="url(#gFacade)">
${solids.map((d) => `      <path d="${d}"/>`).join('\n')}
    </g>
  </g>
  <path class="gate-glow" d="${HOLE}" fill="url(#gGlow)" opacity="0"/>
  <g class="gate-doors">
    <g class="gate-door gate-door--l">
      <path d="${doorLeft}" fill="url(#gDoor)" stroke="${GOLD}" stroke-width="1.5"/>
      <path d="M616,890 V578 C616,462 678,424 712,394 V890" fill="none" stroke="${GOLD}" stroke-opacity=".55"/>
      <path d="M606,560 H720 M606,700 H720" stroke="${GOLD}" stroke-opacity=".55"/>
      <g fill="${GOLD}" fill-opacity=".8">${studs('l')}</g>
    </g>
    <g class="gate-door gate-door--r">
      <path d="${doorRight}" fill="url(#gDoor)" stroke="${GOLD}" stroke-width="1.5"/>
      <path d="${mirror('M616,890 V578 C616,462 678,424 712,394 V890')}" fill="none" stroke="${GOLD}" stroke-opacity=".55"/>
      <path d="M720,560 H834 M720,700 H834" stroke="${GOLD}" stroke-opacity=".55"/>
      <g fill="${GOLD}" fill-opacity=".8">${studs('r')}</g>
    </g>
  </g>
  <g class="gate-lines" mask="url(#mHole)" fill="none" stroke="${GOLD}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
${lines.map((d) => `    <path d="${d}"/>`).join('\n')}
    <path class="gate-pearls" d="${arch(594, 252, 570, 356, 900, false)}" stroke-width="5" stroke-dasharray="0.1 11"/>
  </g>
</svg>
`;

mkdirSync(new URL('../src/assets/', import.meta.url), { recursive: true });
writeFileSync(new URL('../src/assets/gate.svg', import.meta.url), svg);
console.log('gate.svg written', solids.length, 'solids', lines.length, 'lines');
