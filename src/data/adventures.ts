/**
 * Adventures: places visited and places on the wish list.
 *
 * Shown on the interactive world map (src/components/adventures/).
 * To add a location, append an object to `adventures` below — see README
 * "Adventures map". Coordinates are decimal degrees (north / east positive).
 */

export type AdventureStatus = "visited" | "wishlist";

export type AdventureLocation = {
  /** Unique, URL-safe id. Used for the details card and the URL hash. */
  id: string;
  country: string;
  /** ISO 3166-1 alpha-2 code, e.g. "DE". Used to highlight the country on the map. */
  countryCode: string;
  city?: string;
  coordinates: { lat: number; lng: number };
  status: AdventureStatus;
  /** Visited only: year or free-form date label, e.g. "2023" or "Winter 2024". */
  visitedAt?: string;
  /** Visited only: short note about the trip. */
  description?: string;
  /** Wishlist only: why you want to go. */
  reason?: string;
  /** Wishlist only: bucket-list style label. */
  priority?: "bucket-list" | "someday";
  /** Optional image path (e.g. "/images/adventures/berlin.jpg", 16:10 works best). */
  image?: string;
  imageAlt?: string;
  /** Optional link to an article, gallery or external page. */
  href?: string;
  hrefLabel?: string;
};

/** Named views the map can zoom to. Bounds are [west, south, east, north] in degrees. */
export type MapView = {
  id: string;
  label: string;
  bounds?: [number, number, number, number];
};

export const mapViews: MapView[] = [
  { id: "world", label: "World" },
  { id: "europe", label: "Europe", bounds: [-11, 33, 36, 71] },
];

export const adventures: AdventureLocation[] = [
  /* ---------------------------------------------------------------- Visited */
  {
    id: "munich",
    country: "Germany",
    countryCode: "DE",
    city: "Munich",
    coordinates: { lat: 48.1351, lng: 11.582 },
    status: "visited",
    description: "[Add a short note about this trip]",
  },
  {
    id: "berlin",
    country: "Germany",
    countryCode: "DE",
    city: "Berlin",
    coordinates: { lat: 52.52, lng: 13.405 },
    status: "visited",
    description: "[Add a short note about this trip]",
  },
  {
    id: "stockholm",
    country: "Sweden",
    countryCode: "SE",
    city: "Stockholm",
    coordinates: { lat: 59.3293, lng: 18.0686 },
    status: "visited",
    description: "[Add a short note about this trip]",
  },
  {
    id: "wroclaw",
    country: "Poland",
    countryCode: "PL",
    city: "Wrocław",
    coordinates: { lat: 51.1079, lng: 17.0385 },
    status: "visited",
    description: "[Add a short note about this trip]",
  },
  {
    id: "gdansk",
    country: "Poland",
    countryCode: "PL",
    city: "Gdańsk",
    coordinates: { lat: 54.352, lng: 18.6466 },
    status: "visited",
    description: "[Add a short note about this trip]",
  },
  {
    id: "warsaw",
    country: "Poland",
    countryCode: "PL",
    city: "Warsaw",
    coordinates: { lat: 52.2297, lng: 21.0122 },
    status: "visited",
    description: "[Add a short note about this trip]",
  },
  {
    id: "soelden",
    country: "Austria",
    countryCode: "AT",
    city: "Sölden",
    coordinates: { lat: 46.9655, lng: 11.0079 },
    status: "visited",
    description: "Skiing in the Ötztal Alps.",
  },
  {
    id: "madrid",
    country: "Spain",
    countryCode: "ES",
    city: "Madrid",
    coordinates: { lat: 40.4168, lng: -3.7038 },
    status: "visited",
    description: "[Add a short note about this trip]",
  },
  {
    id: "cyprus",
    country: "Cyprus",
    countryCode: "CY",
    city: "[Which town?]",
    coordinates: { lat: 34.9, lng: 33.2 },
    status: "visited",
    description: "[Add a short note about this trip]",
  },
  {
    id: "istanbul",
    country: "Turkey",
    countryCode: "TR",
    city: "Istanbul",
    coordinates: { lat: 41.0082, lng: 28.9784 },
    status: "visited",
    description: "[Add a short note about this trip]",
  },
  {
    id: "zakynthos",
    country: "Greece",
    countryCode: "GR",
    city: "Zakynthos",
    coordinates: { lat: 37.787, lng: 20.8999 },
    status: "visited",
    description: "[Add a short note about this trip]",
  },
  {
    id: "venice",
    country: "Italy",
    countryCode: "IT",
    city: "Venice",
    coordinates: { lat: 45.4408, lng: 12.3155 },
    status: "visited",
    description: "[Add a short note about this trip]",
  },
  {
    id: "rome",
    country: "Italy",
    countryCode: "IT",
    city: "Rome",
    coordinates: { lat: 41.9028, lng: 12.4964 },
    status: "visited",
    description: "[Add a short note about this trip]",
  },
  {
    id: "giza",
    country: "Egypt",
    countryCode: "EG",
    city: "Giza",
    coordinates: { lat: 29.9773, lng: 31.1325 },
    status: "visited",
    description: "[Add a short note about this trip]",
  },
  {
    id: "skopje",
    country: "North Macedonia",
    countryCode: "MK",
    city: "Skopje",
    coordinates: { lat: 41.9981, lng: 21.4254 },
    status: "visited",
    description: "[Add a short note about this trip]",
  },

  /* --------------------------------------------------------------- Wishlist */
  {
    id: "tokyo",
    country: "Japan",
    countryCode: "JP",
    city: "Tokyo",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    status: "wishlist",
    reason: "The scale of the city, the food, and the trains that leave to the second.",
    priority: "bucket-list",
  },
  {
    id: "kyoto",
    country: "Japan",
    countryCode: "JP",
    city: "Kyoto",
    coordinates: { lat: 35.0116, lng: 135.7681 },
    status: "wishlist",
    reason: "Temples, gardens and the older side of Japan.",
    priority: "bucket-list",
  },
  {
    id: "new-york",
    country: "United States",
    countryCode: "US",
    city: "New York City",
    coordinates: { lat: 40.7128, lng: -74.006 },
    status: "wishlist",
    reason: "The skyline, and the sheer number of things going on at once.",
    priority: "bucket-list",
  },
  {
    id: "san-francisco",
    country: "United States",
    countryCode: "US",
    city: "San Francisco",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    status: "wishlist",
    reason: "The bridge, the bay, and the Pacific coast road south of it.",
    priority: "someday",
  },
  {
    id: "queenstown",
    country: "New Zealand",
    countryCode: "NZ",
    city: "Queenstown",
    coordinates: { lat: -45.0312, lng: 168.6626 },
    status: "wishlist",
    reason: "Mountains, lakes and every adventure sport in one place.",
    priority: "bucket-list",
  },
  {
    id: "auckland",
    country: "New Zealand",
    countryCode: "NZ",
    city: "Auckland",
    coordinates: { lat: -36.8509, lng: 174.7645 },
    status: "wishlist",
    reason: "Gateway to the North Island and its volcanic landscapes.",
    priority: "someday",
  },
  {
    id: "lofoten",
    country: "Norway",
    countryCode: "NO",
    city: "Lofoten Islands",
    coordinates: { lat: 68.2343, lng: 14.5681 },
    status: "wishlist",
    reason: "Fjords, fishing villages and roads that beg to be ridden.",
    priority: "bucket-list",
  },
  {
    id: "tromso",
    country: "Norway",
    countryCode: "NO",
    city: "Tromsø",
    coordinates: { lat: 69.6492, lng: 18.9553 },
    status: "wishlist",
    reason: "Northern lights, above the Arctic Circle.",
    priority: "someday",
  },
];

/* ------------------------------------------------------------- Helpers */

export const priorityLabels: Record<NonNullable<AdventureLocation["priority"]>, string> = {
  "bucket-list": "Bucket list",
  someday: "Someday",
};

export function getAdventuresByStatus(status: AdventureStatus): AdventureLocation[] {
  return adventures.filter((a) => a.status === status);
}

/** Locations grouped by country, preserving the order of first appearance. */
export function groupByCountry(list: AdventureLocation[] = adventures) {
  const map = new Map<
    string,
    { country: string; countryCode: string; locations: AdventureLocation[] }
  >();
  for (const a of list) {
    const g = map.get(a.countryCode) ?? {
      country: a.country,
      countryCode: a.countryCode,
      locations: [],
    };
    g.locations.push(a);
    map.set(a.countryCode, g);
  }
  return [...map.values()];
}

export function placeLabel(a: AdventureLocation): string {
  return a.city ? `${a.city}, ${a.country}` : a.country;
}
