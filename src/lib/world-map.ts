/**
 * Build-time world map geometry.
 *
 * Runs only in Astro frontmatter (server side): converts the `world-atlas`
 * TopoJSON into SVG path strings with d3-geo and projects lat/lng points.
 * Nothing from this module is shipped to the browser.
 */
import { geoNaturalEarth1, geoPath, type GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { Topology, GeometryCollection } from "topojson-specification";
import topology from "world-atlas/countries-110m.json";

export const MAP_WIDTH = 960;

const ANTARCTICA = "010";

type CountryProps = { name: string };
type CountriesTopology = Topology<{ countries: GeometryCollection<CountryProps> }>;

const topo = topology as unknown as CountriesTopology;
const countries = feature(topo, topo.objects.countries) as FeatureCollection<
  Geometry,
  CountryProps
>;
countries.features = countries.features.filter((f) => String(f.id) !== ANTARCTICA);

const projection: GeoProjection = geoNaturalEarth1().fitWidth(MAP_WIDTH, { type: "Sphere" });
const pathGenerator = geoPath(projection).digits(0);

const [, [, sphereBottom]] = pathGenerator.bounds({ type: "Sphere" });
export const MAP_HEIGHT = Math.ceil(sphereBottom);

export type CountryPath = { id: string; name: string; d: string };

/** SVG path for every country (Antarctica excluded), keyed by ISO numeric id. */
export const countryPaths: CountryPath[] = countries.features
  .map((f) => ({
    id: String(f.id).padStart(3, "0"),
    name: f.properties.name,
    d: pathGenerator(f) ?? "",
  }))
  .filter((c) => c.d.length > 0);

export const spherePath = pathGenerator({ type: "Sphere" }) ?? "";

/** Project a lat/lng pair to map coordinates (pixels in the 960-wide space). */
export function project(lat: number, lng: number): { x: number; y: number } {
  const p = projection([lng, lat]);
  if (!p) throw new Error(`Cannot project ${lat},${lng}`);
  return { x: +p[0].toFixed(1), y: +p[1].toFixed(1) };
}

export type ViewBox = { x: number; y: number; w: number; h: number };

export const worldViewBox: ViewBox = { x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT };

/**
 * ViewBox that frames a lon/lat bounding box [west, south, east, north],
 * keeping the map's aspect ratio and adding a little padding.
 */
export function viewBoxForBounds(
  bounds: [number, number, number, number],
  padding = 0.06,
): ViewBox {
  const [west, south, east, north] = bounds;
  const samples: Array<[number, number]> = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    samples.push([west + (east - west) * t, north], [west + (east - west) * t, south]);
    samples.push([west, south + (north - south) * t], [east, south + (north - south) * t]);
  }
  const pts = samples.map(([lng, lat]) => project(lat, lng));
  let minX = Math.min(...pts.map((p) => p.x));
  let maxX = Math.max(...pts.map((p) => p.x));
  let minY = Math.min(...pts.map((p) => p.y));
  let maxY = Math.max(...pts.map((p) => p.y));
  const padX = (maxX - minX) * padding;
  const padY = (maxY - minY) * padding;
  minX -= padX;
  maxX += padX;
  minY -= padY;
  maxY += padY;
  // Match the world aspect ratio so the SVG box doesn't change shape.
  const aspect = MAP_WIDTH / MAP_HEIGHT;
  let w = maxX - minX;
  let h = maxY - minY;
  if (w / h > aspect) {
    const nh = w / aspect;
    minY -= (nh - h) / 2;
    h = nh;
  } else {
    const nw = h * aspect;
    minX -= (nw - w) / 2;
    w = nw;
  }
  return { x: +minX.toFixed(1), y: +minY.toFixed(1), w: +w.toFixed(1), h: +h.toFixed(1) };
}
