// Cloudflare Pages middleware: the project's own pages.dev address 301s to the main domain,
// keeping path and query. Branch previews (<branch>.sapronovview.pages.dev) are left alone.
const PAGES_DEV_HOST = "sapronovview.pages.dev";
const MAIN_ORIGIN = "https://ivansapronov.com";

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === PAGES_DEV_HOST) {
    return Response.redirect(MAIN_ORIGIN + url.pathname + url.search, 301);
  }
  return next();
}
