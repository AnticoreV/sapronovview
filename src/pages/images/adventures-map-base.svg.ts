import type { APIRoute } from "astro";
import { adventures, home } from "@data/adventures";
import { countryNumericIds } from "@data/country-ids";
import { MAP_HEIGHT, MAP_WIDTH, countryPaths, project } from "@lib/world-map";

/**
 * Flat world map for /adventures when the 3D globe does not run (reduced motion,
 * no WebGL). Fetched and inlined on demand, so the globe page never carries it.
 * Unstyled on purpose: classes are coloured by AdventureMap.astro with the theme
 * tokens (fills here are only defaults for viewing the file on its own).
 *
 *   path.c            country        · .v visited · .h home · .w wishlist · data-c ISO alpha-2
 *   circle.m          place marker   · .m-v visited · .m-w wishlist · data-id place id
 */
export const GET: APIRoute = () => {
  const alphaByNumeric = new Map(Object.entries(countryNumericIds).map(([a2, n]) => [n, a2]));
  const status = new Map<string, "v" | "w" | "h">();
  for (const a of adventures) {
    if (a.status === "visited") status.set(a.countryCode, "v");
    else if (!status.has(a.countryCode)) status.set(a.countryCode, "w");
  }
  status.set(home.countryCode, "h");

  const fills = { v: "#10141a", h: "#2450ff", w: "#ffffff" } as const;
  const countries = countryPaths
    .map((c) => {
      const code = alphaByNumeric.get(c.id);
      const s = code ? status.get(code) : undefined;
      return s
        ? `<path class="c ${s}" data-c="${code}" d="${c.d}" fill="${fills[s]}"/>`
        : `<path class="c" d="${c.d}" fill="#ffffff"/>`;
    })
    .join("");

  const markers = adventures
    .map((a) => {
      const { x, y } = project(a.coordinates.lat, a.coordinates.lng);
      const kind = a.status === "visited" ? "m-v" : "m-w";
      return `<circle class="m ${kind}" data-id="${a.id}" data-c="${a.countryCode}" cx="${x}" cy="${y}" r="4.5"/>`;
    })
    .join("");

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_WIDTH} ${MAP_HEIGHT}" class="adv-svg" focusable="false" aria-hidden="true">` +
    `<g stroke="#7d879a" stroke-width="0.6" stroke-linejoin="round">${countries}</g>` +
    `<g fill="#2450ff">${markers}</g></svg>`;

  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
  });
};
