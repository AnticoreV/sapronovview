/**
 * Build-time generated brand images (Open Graph card and touch icon).
 * Rendered from SVG templates with sharp so no binary assets live in the
 * repository and the OG card always reflects `siteConfig`.
 *
 * To use your own artwork instead, delete the matching endpoint in
 * src/pages/ and drop a static file into public/ with the same path.
 */
import sharp from "sharp";
import { siteConfig } from "@config";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const initials = siteConfig.name
  .split(" ")
  .map((n) => n[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

const iconSvg = (
  size: number,
) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" rx="14" fill="#1c1917"/>
  <path d="M14 44 L32 16 L50 44" fill="none" stroke="#f2662a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22 44 L42 44" stroke="#fafaf9" stroke-width="6" stroke-linecap="round"/>
</svg>`;

const ogSvg = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="g" cx="50%" cy="0%" r="80%">
      <stop offset="0" stop-color="#f2662a" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#151311" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#2a2724" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#151311"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="80" y="80" width="64" height="64" rx="14" fill="#f2662a"/>
  <text x="112" y="126" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="700" fill="#151311" text-anchor="middle">${escape(initials)}</text>
  <text x="80" y="330" font-family="Helvetica, Arial, sans-serif" font-size="82" font-weight="700" fill="#fafaf9" letter-spacing="-3">${escape(siteConfig.name)}</text>
  <text x="80" y="400" font-family="Helvetica, Arial, sans-serif" font-size="36" fill="#a8a29e">${escape(siteConfig.title)}</text>
  <text x="80" y="540" font-family="Menlo, Consolas, monospace" font-size="22" fill="#f2662a" letter-spacing="3">BACKEND · WEB · AVIATION · MOTORCYCLES</text>
</svg>`;

/** Copy a Node Buffer into a standalone ArrayBuffer-backed Uint8Array (a valid Response body). */
function toBody(buf: Buffer): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(buf.byteLength));
  bytes.set(buf);
  return bytes;
}

export async function renderOgImage(): Promise<Uint8Array<ArrayBuffer>> {
  return toBody(await sharp(Buffer.from(ogSvg())).png().toBuffer());
}

export async function renderTouchIcon(size = 180): Promise<Uint8Array<ArrayBuffer>> {
  return toBody(
    await sharp(Buffer.from(iconSvg(size)))
      .png()
      .toBuffer(),
  );
}
