import type { APIRoute } from "astro";
import { renderOgImage } from "@lib/brand-images";

/** Czech Open Graph image (Czech pages), generated at build time. */
export const GET: APIRoute = async () =>
  new Response(await renderOgImage("cs"), { headers: { "Content-Type": "image/png" } });
