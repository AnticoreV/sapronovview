/**
 * Build-time generated brand images (Open Graph card and touch icon) in the
 * D4 · Pre-flight look: day panel, dark instrument faces, cyan = selectable.
 * Rendered from SVG with sharp; the OG card composites the hero panel poster so
 * it always shows the same instruments as the homepage.
 *
 * To use your own artwork instead, delete the matching endpoint in src/pages/
 * and drop a static file into public/ with the same path.
 */
import sharp, { type OverlayOptions } from "sharp";
import { fileURLToPath } from "node:url";
import { availabilityText, siteConfig } from "@config";
import { heroReadouts } from "@data/readouts";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const SANS = "Helvetica Neue, Helvetica, Arial, sans-serif";
const MONO = "Menlo, DejaVu Sans Mono, monospace";

/** Attitude-indicator mark: dark face, cyan horizon + aircraft symbol. */
export const iconSvg = (size: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" rx="12" fill="#101211"/>
  <circle cx="32" cy="32" r="22" fill="none" stroke="#1c201f" stroke-width="6"/>
  <path d="M10 34h44" stroke="#f1f1eb" stroke-width="3"/>
  <path d="M17 31h10v6M47 31H37v6" fill="none" stroke="#3fcfdf" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="32" cy="32" r="3.5" fill="#3fcfdf"/>
</svg>`;

const ogSvg = () => {
  const [first, ...rest] = siteConfig.name.toUpperCase().split(" ");
  const readouts = heroReadouts
    .slice(0, 3)
    .map(
      (r, i) => `
  <g transform="translate(${64 + i * 176} 470)">
    <rect width="164" height="96" rx="8" fill="#101211"/>
    <rect x="3" y="3" width="158" height="90" rx="6" fill="none" stroke="#1c201f" stroke-width="4"/>
    <text x="16" y="30" font-family="${MONO}" font-size="12" font-weight="700" fill="#a2a8a4" letter-spacing="0.5">${escape(r.source.toUpperCase())}</text>
    <text x="16" y="74" font-family="${MONO}" font-size="30" font-weight="700" fill="#3fcfdf">${escape(r.value)}</text>
  </g>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#d5d8d5"/>
  <rect width="1200" height="56" fill="#101211"/>
  <text x="64" y="36" font-family="${MONO}" font-size="18" font-weight="700" fill="#f1f1eb" letter-spacing="2">${escape(siteConfig.callsign)} / ${escape(siteConfig.base)}</text>
  <rect x="900" y="13" width="236" height="30" rx="4" fill="#0c2a18"/>
  <text x="1018" y="34" font-family="${MONO}" font-size="14" font-weight="700" fill="#3cc46e" text-anchor="middle">${escape(availabilityText[siteConfig.availability.status].long)}</text>
  <text x="64" y="118" font-family="${MONO}" font-size="16" fill="#464c49" letter-spacing="1">BACKEND &amp; FULLSTACK ENGINEER · FOUNDER</text>
  <text x="60" y="222" font-family="${SANS}" font-size="104" font-weight="800" fill="#111312" letter-spacing="-3">${escape(first ?? "")}</text>
  <text x="60" y="318" font-family="${SANS}" font-size="104" font-weight="800" fill="#111312" letter-spacing="-3">${escape(rest.join(" "))}</text>
  <text x="64" y="380" font-family="${SANS}" font-size="24" fill="#111312">Backend systems and products, AI agents and automation,</text>
  <text x="64" y="412" font-family="${SANS}" font-size="24" fill="#111312">services shipped to production.</text>
  ${readouts}
</svg>`;
};

/** Copy a Node Buffer into a standalone ArrayBuffer-backed Uint8Array (a valid Response body). */
function toBody(buf: Buffer): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(buf.byteLength));
  bytes.set(buf);
  return bytes;
}

export async function renderOgImage(): Promise<Uint8Array<ArrayBuffer>> {
  const poster = fileURLToPath(new URL("../assets/hero/panel-day.png", import.meta.url));
  let layers: OverlayOptions[] = [];
  try {
    const panel = await sharp(poster)
      .resize({
        width: 700,
        height: 400,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();
    layers = [{ input: panel, left: 560, top: 140 }];
  } catch {
    /* poster missing — text-only card */
  }
  const base = sharp(Buffer.from(ogSvg())).png();
  return toBody(await base.composite(layers).png().toBuffer());
}

export async function renderTouchIcon(size = 180): Promise<Uint8Array<ArrayBuffer>> {
  return toBody(
    await sharp(Buffer.from(iconSvg(size)))
      .png()
      .toBuffer(),
  );
}
