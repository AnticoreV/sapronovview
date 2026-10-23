/**
 * Adventures paper globe — port of claude-design-system/3d/d2.html (three r184),
 * travel mode, driven by src/data/adventures.ts and world-atlas countries-110m.
 *
 * Visited countries in ink, home (Czechia) in magenta, wishlist countries with a
 * dashed magenta outline, magenta arcs from Prague to every visited place.
 * Drag to rotate (with inertia), hover for the country name, click a country
 * with places to open its card. The country list beside the globe is the
 * keyboard / screen-reader equivalent; selecting there turns the globe.
 *
 * Loaded lazily by src/components/adventures/GlobeStage.astro — never under
 * reduced motion or without WebGL (the d3-geo SVG map is shown instead).
 */
import {
  AmbientLight,
  CanvasTexture,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  QuadraticBezierCurve3,
  Raycaster,
  RingGeometry,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
  type Object3D,
  type Texture,
} from "three";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import { adventures, home } from "@data/adventures";
import { countryNumericIds } from "@data/country-ids";

export type GlobeHandle = {
  /** Turn the globe so that lat/lng faces the viewer. */
  focus(lat: number, lng: number): void;
  dispose(): void;
};

export type GlobeOptions = {
  /** A country with places was clicked (ISO alpha-2). */
  onPick?: (countryCode: string) => void;
  /** Hovered country name (or null) and pointer position inside the stage. */
  onHover?: (name: string | null, x: number, y: number) => void;
  onFirstFrame?: () => void;
  capture?: { dpr: number };
};

type Palette = {
  paper: string;
  graticule: string;
  land: string;
  border: string;
  visited: string;
  home: string;
  route: string;
  dot: string;
  ambient: number;
  key: number;
};

const PALETTES: Record<"day" | "night", Palette> = {
  day: {
    paper: "#f7f8f6",
    graticule: "#c6ccc7",
    land: "#ffffff",
    border: "#111413",
    visited: "#111413",
    home: "#a3136a",
    route: "#a3136a",
    dot: "#111413",
    ambient: 2.2,
    key: 1.2,
  },
  night: {
    paper: "#1b1f1f",
    graticule: "#2a2f2e",
    land: "#262b2b",
    border: "#a2a8a4",
    visited: "#eeeee8",
    home: "#e0569f",
    route: "#e0569f",
    dot: "#eeeee8",
    ambient: 1.6,
    key: 1.0,
  },
};

const DEG = Math.PI / 180;
/** Initial view: centred on Europe, as on the poster. */
const START = { lng: 18, lat: 38 };

type CountryProps = { name: string };
type Countries = Topology<{ countries: GeometryCollection<CountryProps> }>;

const isNight = () => document.documentElement.classList.contains("dark");

function toVec(lng: number, lat: number, r = 1) {
  const phi = (90 - lat) * DEG;
  const th = (lng + 180) * DEG;
  return new Vector3(
    -r * Math.sin(phi) * Math.cos(th),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(th),
  );
}

export async function mountGlobe(
  canvas: HTMLCanvasElement,
  options: GlobeOptions = {},
): Promise<GlobeHandle> {
  const capture = options.capture;
  const stage = canvas.parentElement ?? canvas;
  const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;

  /* ------------------------------------------------------------ data */
  const topo = world as unknown as Countries;
  const countries = (
    feature(topo, topo.objects.countries) as FeatureCollection<Geometry, CountryProps>
  ).features.filter((f) => String(f.id) !== "010"); // no Antarctica
  const alphaByNumeric = new Map(Object.entries(countryNumericIds).map(([a, n]) => [n, a]));
  const numeric = (alpha: string) => countryNumericIds[alpha];
  const visited = new Set(
    adventures.filter((a) => a.status === "visited").map((a) => numeric(a.countryCode)),
  );
  const wishlist = new Set(
    adventures.filter((a) => a.status === "wishlist").map((a) => numeric(a.countryCode)),
  );
  const homeId = numeric(home.countryCode);
  const nameByCode = new Map(adventures.map((a) => [a.countryCode, a.country]));
  nameByCode.set(home.countryCode, home.country);
  const withPlaces = new Set([...adventures.map((a) => a.countryCode), home.countryCode]);

  /* ------------------------------------------------------------ renderer */
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
    preserveDrawingBuffer: Boolean(capture),
  });
  renderer.setPixelRatio(
    capture ? capture.dpr : Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2),
  );
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const camera = new PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0, 4.4);
  const resize = () => {
    const w = Math.max(1, stage.clientWidth);
    const h = Math.max(1, stage.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();

  /* ------------------------------------------------------------ textures */
  const maxTex = renderer.capabilities.maxTextureSize;
  const W = Math.min(mobile ? 2048 : 4096, maxTex);
  const H = W / 2;
  const px = W / 4096; // line widths below are in 4096-wide texture pixels

  function trace(g: CanvasRenderingContext2D, geom: Polygon | MultiPolygon, w: number, h: number) {
    const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
    g.beginPath();
    for (const poly of polys) {
      for (const ring of poly) {
        // unwrap longitudes so rings crossing the antimeridian stay continuous
        let off = 0;
        let prev: number | null = null;
        ring.forEach((pt, i) => {
          let lon = pt[0]!;
          if (prev !== null) {
            const d = lon + off - prev;
            if (d > 180) off -= 360;
            else if (d < -180) off += 360;
          }
          lon += off;
          prev = lon;
          const x = ((lon + 180) / 360) * w;
          const y = ((90 - pt[1]!) / 180) * h;
          if (i === 0) g.moveTo(x, y);
          else g.lineTo(x, y);
        });
      }
    }
  }

  const geomOf = (f: Feature<Geometry, CountryProps>) =>
    f.geometry && (f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon")
      ? f.geometry
      : null;

  function paintMap(C: Palette) {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d")!;
    g.fillStyle = C.paper;
    g.fillRect(0, 0, W, H);
    g.strokeStyle = C.graticule;
    g.lineWidth = 1.1 * px;
    for (let lon = -180; lon <= 180; lon += 10) {
      const x = ((lon + 180) / 360) * W;
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, H);
      g.stroke();
    }
    for (let lat = -80; lat <= 80; lat += 10) {
      const y = ((90 - lat) / 180) * H;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(W, y);
      g.stroke();
    }
    for (const f of countries) {
      const geom = geomOf(f);
      if (!geom) continue;
      const id = String(f.id);
      trace(g, geom, W, H);
      g.fillStyle = visited.has(id) ? C.visited : id === homeId ? C.home : C.land;
      g.fill("evenodd");
      const wish = wishlist.has(id);
      g.setLineDash(wish ? [9 * px, 6 * px] : []);
      g.strokeStyle = wish ? C.route : C.border;
      g.lineWidth = (wish ? 2.6 : 1.3) * px;
      g.stroke();
    }
    g.setLineDash([]);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
    return t;
  }

  /** Low-res id map for hover / click picking: each country painted in its own colour. */
  const PICK_W = 1024;
  const PICK_H = 512;
  const pickPixels = (() => {
    const c = document.createElement("canvas");
    c.width = PICK_W;
    c.height = PICK_H;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    countries.forEach((f, i) => {
      const geom = geomOf(f);
      if (!geom) return;
      const n = i + 1;
      g.fillStyle = `rgb(${n & 255},${(n >> 8) & 255},0)`;
      trace(g, geom, PICK_W, PICK_H);
      g.fill("evenodd");
    });
    return g.getImageData(0, 0, PICK_W, PICK_H).data;
  })();
  const countryAt = (u: number, v: number) => {
    const x = Math.min(PICK_W - 1, Math.max(0, Math.floor(u * PICK_W)));
    const y = Math.min(PICK_H - 1, Math.max(0, Math.floor((1 - v) * PICK_H)));
    const k = (y * PICK_W + x) * 4;
    if (pickPixels[k + 2] !== 0 || pickPixels[k + 3]! < 250) return null; // edge blend
    const n = pickPixels[k]! + (pickPixels[k + 1]! << 8);
    return countries[n - 1] ?? null;
  };

  /* ------------------------------------------------------------ scene */
  const globe = new Group();
  globe.rotation.order = "XYZ";
  scene.add(globe);
  let C = PALETTES[isNight() ? "night" : "day"];
  const sphereMat = new MeshStandardMaterial({ roughness: 1, metalness: 0 });
  const sphere = new Mesh(new SphereGeometry(1, mobile ? 96 : 128, mobile ? 72 : 96), sphereMat);
  globe.add(sphere);

  const arcMat = new MeshBasicMaterial({ color: C.route });
  const dotMat = new MeshBasicMaterial({ color: C.dot });
  const homeMat = new MeshBasicMaterial({ color: C.home, side: DoubleSide });
  const pulseMat = new MeshBasicMaterial({ color: C.home, side: DoubleSide, transparent: true });

  const prague = [home.coordinates.lng, home.coordinates.lat] as const;
  const a = toVec(prague[0], prague[1], 1.003);
  for (const place of adventures.filter((p) => p.status === "visited")) {
    const b = toVec(place.coordinates.lng, place.coordinates.lat, 1.003);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(1 + a.distanceTo(b) * 0.45);
    const tube = new Mesh(
      new TubeGeometry(new QuadraticBezierCurve3(a, mid, b), 64, 0.0042, 6),
      arcMat,
    );
    const dot = new Mesh(new SphereGeometry(0.011, 12, 8), dotMat);
    dot.position.copy(b);
    globe.add(tube, dot);
  }
  const ring = new Mesh(new RingGeometry(0.028, 0.036, 48), homeMat);
  ring.position.copy(toVec(prague[0], prague[1], 1.006));
  ring.lookAt(toVec(prague[0], prague[1], 2));
  const pulse = new Mesh(new RingGeometry(0.028, 0.036, 48), pulseMat);
  pulse.position.copy(ring.position);
  pulse.quaternion.copy(ring.quaternion);
  pulse.visible = false;
  globe.add(ring, pulse);

  const ambient = new AmbientLight(0xffffff, C.ambient);
  const key = new DirectionalLight(0xffffff, C.key);
  key.position.set(-3, 2, 4);
  scene.add(ambient, key);

  let mapTexture: Texture = paintMap(C);
  sphereMat.map = mapTexture;

  const applyTheme = () => {
    C = PALETTES[isNight() ? "night" : "day"];
    const next = paintMap(C);
    sphereMat.map = next;
    sphereMat.needsUpdate = true;
    mapTexture.dispose();
    mapTexture = next;
    arcMat.color.set(C.route);
    dotMat.color.set(C.dot);
    homeMat.color.set(C.home);
    pulseMat.color.set(C.home);
    ambient.intensity = C.ambient;
    key.intensity = C.key;
  };

  /* ------------------------------------------------------------ motion */
  const yawFor = (lng: number) => -(lng + 90) * DEG;
  let rotY = yawFor(START.lng);
  let rotX = START.lat * DEG;
  let velY = 0;
  let velX = 0;
  let target: { y: number; x: number } | null = null;
  let pulseT = capture ? -1 : 0;
  const PULSE_SECONDS = 6.4;

  let raf = 0;
  let last = 0;
  let visible = true;
  let disposed = false;
  let dragging = false;
  const running = () => visible && document.visibilityState === "visible" && !disposed;

  function frame(now: number) {
    raf = 0;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
    last = now;
    let busy = dragging;

    if (!dragging && (Math.abs(velY) > 1e-4 || Math.abs(velX) > 1e-4)) {
      rotY += velY;
      rotX = Math.max(-1.2, Math.min(1.2, rotX + velX));
      const decay = Math.pow(0.9, dt * 60);
      velY *= decay;
      velX *= decay;
      busy = true;
    }
    if (target) {
      const k = 1 - Math.exp(-dt * 5);
      rotY += (target.y - rotY) * k;
      rotX += (target.x - rotX) * k;
      if (Math.abs(target.y - rotY) < 1e-3 && Math.abs(target.x - rotX) < 1e-3) target = null;
      busy = true;
    }
    if (pulseT >= 0 && pulseT < PULSE_SECONDS) {
      pulseT += dt;
      const p = (pulseT % 1.6) / 1.6;
      pulse.visible = pulseT < PULSE_SECONDS;
      pulse.scale.setScalar(1 + p * 1.6);
      pulseMat.opacity = 1 - p;
      busy = true;
    } else {
      pulse.visible = false;
    }

    globe.rotation.y = rotY;
    globe.rotation.x = rotX;
    renderer.render(scene, camera);
    if (busy && running()) raf = requestAnimationFrame(frame);
  }
  const wake = () => {
    if (!raf && running()) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  };

  /* ------------------------------------------------------------ input */
  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const hit = (clientX: number, clientY: number) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const [first] = raycaster.intersectObject(sphere, false);
    if (!first?.uv) return null;
    return countryAt(first.uv.x, first.uv.y);
  };

  let downX = 0;
  let downY = 0;
  let lastX = 0;
  let lastY = 0;
  let moved = 0;
  const onDown = (e: PointerEvent) => {
    dragging = true;
    target = null;
    moved = 0;
    downX = lastX = e.clientX;
    downY = lastY = e.clientY;
    velX = velY = 0;
    canvas.setPointerCapture(e.pointerId);
    wake();
  };
  const onMove = (e: PointerEvent) => {
    if (dragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      moved = Math.max(moved, Math.hypot(e.clientX - downX, e.clientY - downY));
      const k = 0.0055;
      velY = dx * k;
      velX = dy * k;
      rotY += velY;
      rotX = Math.max(-1.2, Math.min(1.2, rotX + velX));
      options.onHover?.(null, 0, 0);
      wake();
      return;
    }
    if (e.pointerType !== "mouse") return;
    const f = hit(e.clientX, e.clientY);
    const r = stage.getBoundingClientRect();
    const alpha = f ? alphaByNumeric.get(String(f.id)) : undefined;
    const name = f ? ((alpha && nameByCode.get(alpha)) ?? f.properties.name) : null;
    options.onHover?.(name, e.clientX - r.left, e.clientY - r.top);
    canvas.style.cursor = alpha && withPlaces.has(alpha) ? "pointer" : "grab";
  };
  const onUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    if (moved < 5) {
      velX = velY = 0;
      const f = hit(e.clientX, e.clientY);
      const alpha = f ? alphaByNumeric.get(String(f.id)) : undefined;
      if (alpha && withPlaces.has(alpha)) options.onPick?.(alpha);
    }
    wake();
  };
  const onLeave = () => options.onHover?.(null, 0, 0);

  const io = new IntersectionObserver((entries) => {
    visible = entries.some((en) => en.isIntersecting);
    if (visible) wake();
  });
  const ro = new ResizeObserver(() => {
    resize();
    renderer.render(scene, camera);
  });
  const onVisibility = () => wake();
  const themeObserver = new MutationObserver(() => {
    const night = isNight();
    if ((night && C === PALETTES.day) || (!night && C === PALETTES.night)) {
      applyTheme();
      renderer.render(scene, camera);
    }
  });

  if (!capture) {
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    io.observe(stage);
    ro.observe(stage);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  globe.rotation.y = rotY;
  globe.rotation.x = rotX;
  try {
    await renderer.compileAsync(scene, camera);
  } catch {
    /* compile on first render */
  }
  renderer.render(scene, camera);
  options.onFirstFrame?.();
  if (!capture) window.setTimeout(wake, 450);

  const disposeObject = (obj: Object3D) =>
    obj.traverse((o) => {
      const mesh = o as Mesh;
      if (mesh.geometry) (mesh.geometry as BufferGeometry).dispose();
      const mat = mesh.material as Material | undefined;
      mat?.dispose();
    });

  return {
    focus(lat: number, lng: number) {
      // Shortest way round for the yaw.
      let y = yawFor(lng);
      const twoPi = Math.PI * 2;
      y = rotY + ((((y - rotY) % twoPi) + twoPi * 1.5) % twoPi) - Math.PI;
      target = { y, x: Math.max(-1.2, Math.min(1.2, lat * DEG)) };
      velX = velY = 0;
      wake();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      disposeObject(globe);
      mapTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
