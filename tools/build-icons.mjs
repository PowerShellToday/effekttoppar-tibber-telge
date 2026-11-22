// Renders all icons and the share image from inline SVG.
// Usage: npm install && npm run icons
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "icons");
await mkdir(out, { recursive: true });

// Artwork on a 512x512 canvas (no background). Five peak bars, the highest one
// marked with a lightning bolt, and a dashed threshold line.
const art = `
  <g fill="#fff">
    <rect x="92"  y="300" width="56" height="120" rx="10" opacity=".55"/>
    <rect x="166" y="250" width="56" height="170" rx="10" opacity=".55"/>
    <rect x="240" y="196" width="56" height="224" rx="10"/>
    <rect x="314" y="280" width="56" height="140" rx="10" opacity=".55"/>
    <rect x="388" y="234" width="56" height="186" rx="10" opacity=".55"/>
    <path d="M286 60 L222 140 H262 L246 182 L314 104 H272 Z"/>
  </g>
  <line x1="72" x2="464" y1="262" y2="262" stroke="#fff" stroke-width="8" stroke-dasharray="22 14" stroke-linecap="round" opacity=".9"/>`;

const grad = `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#f26a32"/><stop offset="1" stop-color="#c9400b"/></linearGradient></defs>`;

// Rounded icon (favicon, "any" purpose)
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${grad}
  <rect width="512" height="512" rx="112" fill="url(#g)"/>${art}</svg>`;

// Full-bleed square, art scaled into the 80% safe zone (maskable / iOS, which rounds itself)
const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${grad}
  <rect width="512" height="512" fill="url(#g)"/>
  <g transform="translate(256 256) scale(.82) translate(-256 -248)">${art}</g></svg>`;

// 1200x630 share card
const font = `font-family="Segoe UI, Helvetica Neue, Arial, sans-serif"`;
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${grad}
  <rect width="1200" height="630" fill="#12151b"/>
  <g transform="translate(110 135)"><svg width="360" height="360" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="112" fill="url(#g)"/>${art}</svg></g>
  <text x="540" y="290" ${font} font-size="92" font-weight="700" fill="#e6e9ef">Effekttoppar</text>
  <text x="544" y="360" ${font} font-size="40" fill="#9aa3b2">Effektavgift från din Tibber-data</text>
  <text x="544" y="420" ${font} font-size="30" fill="#ff7a3d">Telge Nät-regler · körs i webbläsaren</text>
</svg>`;

await writeFile(join(out, "icon.svg"), iconSvg.trim() + "\n");
await writeFile(join(out, "icon-maskable.svg"), maskSvg.trim() + "\n");

const png = (svg, size, file, density = 300) =>
  sharp(Buffer.from(svg), { density }).resize(size, size).png().toFile(join(out, file));

await png(iconSvg, 32, "favicon-32.png");
await png(iconSvg, 192, "icon-192.png");
await png(iconSvg, 512, "icon-512.png");
await png(maskSvg, 512, "icon-maskable-512.png");
await png(maskSvg, 180, "apple-touch-icon.png");
await sharp(Buffer.from(ogSvg), { density: 144 }).resize(1200, 630).png().toFile(join(out, "og-image.png"));
console.log("Icons written to", out);
