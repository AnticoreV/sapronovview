/** Structured data shared by the homepage (Person) and /about (ProfilePage). */
import { siteConfig } from "@config";

export function personSchema(site: URL) {
  return {
    "@type": "Person",
    "@id": `${site.origin}/#person`,
    name: siteConfig.name,
    givenName: siteConfig.name.split(" ")[0],
    familyName: siteConfig.name.split(" ").slice(1).join(" "),
    jobTitle: "Backend & Fullstack Engineer",
    description: siteConfig.description,
    url: site.origin,
    email: `mailto:${siteConfig.email}`,
    // Stable URL (public/images/ivan-sapronov.jpg), not a hashed build asset.
    image: new URL(siteConfig.personImage, site).toString(),
    sameAs: Object.values(siteConfig.social).filter(Boolean),
    knowsLanguage: siteConfig.languages.map((l) => l.name),
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressCountry: "CZ",
    },
  };
}
