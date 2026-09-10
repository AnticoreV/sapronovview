import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "@lib/content";
import { siteConfig } from "@config";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${siteConfig.name} — Writing`,
    description: siteConfig.description,
    site: context.site ?? "http://localhost:4321",
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/writing/${post.id}`,
      categories: post.data.tags,
      author: siteConfig.email ? `${siteConfig.email} (${siteConfig.name})` : undefined,
    })),
    customData: `<language>${siteConfig.locale}</language>`,
  });
}
