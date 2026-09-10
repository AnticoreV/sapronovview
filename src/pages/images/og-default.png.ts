import type { APIRoute } from "astro";
import { renderOgImage } from "@lib/brand-images";

/** Default Open Graph image, generated at build time from siteConfig. */
export const GET: APIRoute = async () =>
  new Response(await renderOgImage(), { headers: { "Content-Type": "image/png" } });
