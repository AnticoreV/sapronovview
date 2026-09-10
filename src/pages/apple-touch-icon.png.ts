import type { APIRoute } from "astro";
import { renderTouchIcon } from "@lib/brand-images";

/** 180×180 touch icon, generated at build time. */
export const GET: APIRoute = async () =>
  new Response(await renderTouchIcon(180), { headers: { "Content-Type": "image/png" } });
