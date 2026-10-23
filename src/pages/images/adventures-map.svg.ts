import type { APIRoute } from "astro";
import { adventures } from "@data/adventures";
import { countryNumericIds } from "@data/country-ids";
import { MAP_HEIGHT, MAP_WIDTH, countryPaths, project } from "@lib/world-map";

/**
 * Static, non-interactive snapshot of the adventures map, generated at build
 * time (kept as a stable image URL). Colours: ink for visited countries and
 * route magenta for markers, readable on both panels.
 */
export const GET: APIRoute = () => {
  const numericToAlpha = new Map(Object.entries(countryNumericIds).map(([a2, num]) => [num, a2]));
  const active = new Set(adventures.map((a) => a.countryCode));

  const land = countryPaths
    .map((c) => {
      const code = numericToAlpha.get(c.id);
      const isActive = code ? active.has(code) : false;
      return `<path d="${c.d}" fill="${isActive ? "rgba(17,19,18,0.82)" : "rgba(128,128,128,0.22)"}"/>`;
    })
    .join("");

  const markers = adventures
    .map((a) => {
      const { x, y } = project(a.coordinates.lat, a.coordinates.lng);
      return a.status === "visited"
        ? `<circle cx="${x}" cy="${y}" r="4.5" fill="#a3136a" stroke="rgba(255,255,255,0.9)" stroke-width="1.5"/>`
        : `<circle cx="${x}" cy="${y}" r="4" fill="rgba(255,255,255,0.85)" stroke="#a3136a" stroke-width="2"/>`;
    })
    .join("");

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_WIDTH} ${MAP_HEIGHT}" width="${MAP_WIDTH}" height="${MAP_HEIGHT}" role="img" aria-label="World map with visited places and places I want to visit">` +
    `<g stroke="rgba(255,255,255,0.35)" stroke-width="0.6" stroke-linejoin="round">${land}</g>` +
    `<g>${markers}</g></svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
