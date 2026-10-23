/**
 * Hero instrument panel — port of claude-design-system/3d/d4.html (three r184).
 *
 * An aluminium panel whose instruments read real engineering facts from
 * src/data/readouts.ts. Loaded lazily by src/components/home/PanelStage.astro
 * (never under reduced motion or without WebGL — the poster stays instead).
 *
 * - Cursor → attitude indicator pitch/roll (lerped, ±8° / ±12°). Device tilt ignored.
 * - Needles settle with a damped spring once the scene is live (one small overshoot).
 * - Renders on demand: no frames while nothing moves, offscreen or in a hidden tab.
 * - Day / night palettes follow the `.dark` class on <html>.
 * - Canvas textures are drawn after the web fonts are ready.
 */
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Scene,
  SRGBColorSpace,
  TorusGeometry,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
  type Object3D,
  type Texture,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { careerSpan, readouts } from "@data/readouts";

export type PanelHandle = {
  /** Re-read the theme from <html class="dark"> and redraw. */
  refreshTheme(): void;
  dispose(): void;
};

export type PanelOptions = {
  /** Annunciator text on the panel (availability). */
  annunciator: string;
  /** Called after the first frame is on screen. */
  onFirstFrame?: () => void;
  /**
   * Poster capture (scripts/render-posters.mjs): fixed DPR, final values, no
   * animation, and the frame is kept in the drawing buffer for toDataURL().
   */
  capture?: { dpr: number };
};

type Palette = {
  panel: string;
  face: string;
  mark: string;
  muted: string;
  cyan: string;
  green: string;
  screw: string;
  placard: string;
  annunciatorGround: string;
  sky: string;
  ground: string;
  hub: string;
};

const PALETTES: Record<"day" | "night", Palette> = {
  day: {
    panel: "#cfd3cf",
    face: "#101211",
    mark: "#f1f1eb",
    muted: "#a2a8a4",
    cyan: "#3fcfdf",
    green: "#3cc46e",
    screw: "#9aa09c",
    placard: "#111312",
    annunciatorGround: "#0c2a18",
    sky: "#2e5b78",
    ground: "#4a3a2a",
    hub: "#2a2f2e",
  },
  night: {
    panel: "#1b1f1f",
    face: "#0a0c0c",
    mark: "#eeeee8",
    muted: "#a2a8a4",
    cyan: "#3fcfdf",
    green: "#3cc46e",
    screw: "#3a403f",
    placard: "#a2a8a4",
    annunciatorGround: "#0c2a18",
    sky: "#244a62",
    ground: "#3b2f23",
    hub: "#2a2f2e",
  },
};

const DEG = Math.PI / 180;
const MAX_PITCH = 8; // degrees, nose up/down with the cursor
const MAX_ROLL = 12 * DEG; // bank with the cursor
const SETTLE_SECONDS = 2.6;

/** Small deterministic PRNG so the live panel matches the rendered poster. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fontStacks() {
  const css = getComputedStyle(document.documentElement);
  const mono = css.getPropertyValue("--font-mono").trim() || "ui-monospace, monospace";
  const sans = css.getPropertyValue("--font-sans").trim() || "system-ui, sans-serif";
  return { mono, sans };
}

async function fontsReady(mono: string, sans: string) {
  try {
    await Promise.all([
      document.fonts.load(`600 64px ${mono}`, "0123456789MAX~½→"),
      document.fonts.load(`700 64px ${mono}`, "0123456789MAX~½→"),
      document.fonts.load(`600 46px ${sans}`, "NCRVOYIX"),
      document.fonts.load(`700 76px ${sans}`, "USERS"),
    ]);
    await document.fonts.ready;
  } catch {
    /* draw with fallbacks */
  }
}

const isNight = () => document.documentElement.classList.contains("dark");

/** Give the main thread back between heavy init phases (no single long task). */
const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

export async function mountPanel(
  canvas: HTMLCanvasElement,
  options: PanelOptions,
): Promise<PanelHandle> {
  const capture = options.capture;
  const { mono: FONT, sans: SANS } = fontStacks();
  await fontsReady(FONT, SANS);

  const stage = canvas.parentElement ?? canvas;
  const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  const dprCap = capture ? capture.dpr : mobile ? 1.5 : 2;

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
    preserveDrawingBuffer: Boolean(capture),
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
  if (capture) renderer.setPixelRatio(capture.dpr);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  await yieldToMain();
  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.03);
  scene.environment = envRT.texture;
  await yieldToMain();

  const camera = new PerspectiveCamera(26, 1400 / 800, 0.1, 100);
  camera.position.set(-3.2, -1.4, 21);
  camera.lookAt(0.3, 0.1, 0);

  const resize = () => {
    const w = Math.max(1, stage.clientWidth);
    const h = Math.max(1, stage.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();

  /* ------------------------------------------------------------ build */
  let C = PALETTES[isNight() ? "night" : "day"];
  let panelGroup = new Group();
  let lights: Object3D[] = [];
  const faceCanvases = {
    users: makeCanvas(1024, 1024),
    adi: makeCanvas(1024, 1024),
    alt: makeCanvas(1024, 1024),
  };
  let textures: { users?: CanvasTexture; adi?: CanvasTexture; alt?: CanvasTexture } = {};

  function makeCanvas(w: number, h: number) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  }

  function brushed(rand: () => number, w = 1024, h = 512) {
    const c = makeCanvas(w, h);
    const g = c.getContext("2d")!;
    g.fillStyle = C.panel;
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) {
      const y = rand() * h;
      const a = rand() * 0.06;
      g.strokeStyle = rand() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a * 0.7})`;
      g.lineWidth = rand() * 1.4;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y + (rand() - 0.5) * 2);
      g.stroke();
    }
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }

  function ticks(
    g: CanvasRenderingContext2D,
    from: number,
    to: number,
    n: number,
    r0: number,
    r1: number,
    w: number,
    col: string,
  ) {
    g.strokeStyle = col;
    g.lineWidth = w;
    for (let i = 0; i <= n; i++) {
      const a = from + ((to - from) * i) / n;
      g.beginPath();
      g.moveTo(512 + Math.cos(a) * r0, 512 + Math.sin(a) * r0);
      g.lineTo(512 + Math.cos(a) * r1, 512 + Math.sin(a) * r1);
      g.stroke();
    }
  }

  function needle(g: CanvasRenderingContext2D, a: number, len: number, col: string, w = 18) {
    g.save();
    g.translate(512, 512);
    g.rotate(a);
    g.fillStyle = col;
    g.beginPath();
    g.moveTo(-70, -w / 2);
    g.lineTo(len - 40, -w / 2.6);
    g.lineTo(len, 0);
    g.lineTo(len - 40, w / 2.6);
    g.lineTo(-70, w / 2);
    g.closePath();
    g.fill();
    g.restore();
    g.fillStyle = C.hub;
    g.beginPath();
    g.arc(512, 512, 34, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = C.mark;
    g.beginPath();
    g.arc(512, 512, 10, 0, Math.PI * 2);
    g.fill();
  }

  /** Users gauge: ~2M users served at NCR Voyix. */
  function drawUsers(value: number) {
    const g = faceCanvases.users.getContext("2d")!;
    const min = 0;
    const max = 3;
    g.fillStyle = C.face;
    g.fillRect(0, 0, 1024, 1024);
    const A0 = Math.PI * 0.75;
    const A1 = Math.PI * 2.25;
    const ang = (v: number) => A0 + ((A1 - A0) * (v - min)) / (max - min);
    g.lineWidth = 26;
    g.strokeStyle = C.green;
    g.beginPath();
    g.arc(512, 512, 400, ang(min), ang(Math.max(min, value)), false);
    g.stroke();
    ticks(g, A0, A1, 30, 372, 412, 5, C.muted);
    ticks(g, A0, A1, 6, 352, 420, 10, C.mark);
    g.fillStyle = C.mark;
    g.font = `600 64px ${FONT}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    const labels = ["0", "", "1M", "", "2M", "", "3M"];
    labels.forEach((l, i) => {
      const a = A0 + ((A1 - A0) * i) / (labels.length - 1);
      g.fillText(l, 512 + Math.cos(a) * 288, 512 + Math.sin(a) * 288);
    });
    g.fillStyle = C.muted;
    g.font = `600 46px ${SANS}`;
    g.fillText(readouts.users.panel ?? readouts.users.source.toUpperCase(), 512, 330);
    g.fillStyle = C.cyan;
    g.font = `700 92px ${FONT}`;
    g.fillText(readouts.users.value, 512, 690);
    g.fillStyle = C.muted;
    g.font = `500 40px ${SANS}`;
    g.fillText("enterprise platform", 512, 780);
    needle(g, ang(value), 370, C.mark);
  }

  /** Career "altimeter": years in production, 2021 → 2026. */
  function drawAlt(year: number) {
    const g = faceCanvases.alt.getContext("2d")!;
    g.fillStyle = C.face;
    g.fillRect(0, 0, 1024, 1024);
    const span = careerSpan.to - careerSpan.from;
    const years = Array.from({ length: span + 1 }, (_, i) =>
      i === 0 ? String(careerSpan.from) : String(careerSpan.from + i).slice(-2),
    );
    const A0 = -Math.PI / 2;
    const step = (Math.PI * 2) / (span + 1);
    ticks(g, A0, A0 + Math.PI * 2, 70, 380, 410, 4, C.muted);
    ticks(g, A0, A0 + Math.PI * 2, span + 1, 350, 420, 10, C.mark);
    g.fillStyle = C.mark;
    g.font = `600 70px ${FONT}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    years.forEach((y, i) => {
      const a = A0 + step * i;
      g.fillText(y, 512 + Math.cos(a) * 290, 512 + Math.sin(a) * 290);
    });
    g.fillStyle = C.muted;
    g.font = `600 44px ${SANS}`;
    g.fillText("CAREER · YRS", 512, 640);
    // drum window
    g.fillStyle = "#000";
    g.fillRect(392, 318, 240, 96);
    g.strokeStyle = C.muted;
    g.lineWidth = 4;
    g.strokeRect(392, 318, 240, 96);
    g.fillStyle = C.mark;
    g.font = `700 70px ${FONT}`;
    const shown = Math.min(careerSpan.to, Math.max(careerSpan.from, Math.round(year)));
    g.fillText(String(shown), 512, 370);
    needle(g, A0 + step * (year - careerSpan.from), 330, C.mark);
  }

  /** Attitude indicator: pitch in degrees, roll in radians (canvas rotation). */
  function drawADI(pitch: number, roll: number) {
    const g = faceCanvases.adi.getContext("2d")!;
    g.fillStyle = C.face;
    g.fillRect(0, 0, 1024, 1024);
    g.save();
    g.beginPath();
    g.arc(512, 512, 430, 0, Math.PI * 2);
    g.clip();
    g.translate(512, 512);
    g.rotate(roll);
    g.translate(0, pitch * 9);
    g.fillStyle = C.sky;
    g.fillRect(-900, -1200, 1800, 1200);
    g.fillStyle = C.ground;
    g.fillRect(-900, 0, 1800, 1200);
    g.strokeStyle = C.mark;
    g.lineWidth = 8;
    g.beginPath();
    g.moveTo(-900, 0);
    g.lineTo(900, 0);
    g.stroke();
    g.lineWidth = 5;
    g.fillStyle = C.mark;
    g.font = `600 34px ${FONT}`;
    g.textAlign = "left";
    g.textBaseline = "middle";
    for (let p = -20; p <= 20; p += 5) {
      if (!p) continue;
      const y = -p * 9;
      const w = p % 10 === 0 ? 120 : 60;
      g.beginPath();
      g.moveTo(-w, y);
      g.lineTo(w, y);
      g.stroke();
      if (p % 10 === 0) g.fillText(String(Math.abs(p)), w + 14, y);
    }
    g.restore();
    // fixed bank scale
    g.save();
    g.translate(512, 512);
    [-60, -45, -30, -20, -10, 0, 10, 20, 30, 45, 60].forEach((d) => {
      const a = ((d - 90) * Math.PI) / 180;
      const l = d % 30 === 0 ? 46 : 26;
      g.strokeStyle = C.mark;
      g.lineWidth = d === 0 ? 10 : 6;
      g.beginPath();
      g.moveTo(Math.cos(a) * 410, Math.sin(a) * 410);
      g.lineTo(Math.cos(a) * (410 - l), Math.sin(a) * (410 - l));
      g.stroke();
    });
    // roll pointer
    g.rotate(roll);
    g.fillStyle = C.cyan;
    g.beginPath();
    g.moveTo(0, -352);
    g.lineTo(-22, -318);
    g.lineTo(22, -318);
    g.closePath();
    g.fill();
    g.restore();
    // fixed aircraft symbol (cyan = selectable: you fly it)
    g.fillStyle = C.cyan;
    g.fillRect(512 - 250, 506, 150, 16);
    g.fillRect(512 + 100, 506, 150, 16);
    g.fillRect(512 - 116, 506, 16, 44);
    g.fillRect(512 + 100, 506, 16, 44);
    g.beginPath();
    g.arc(512, 514, 14, 0, Math.PI * 2);
    g.fill();
  }

  const metal = (col: string, r = 0.35, m = 0.85) =>
    new MeshStandardMaterial({ color: col, roughness: r, metalness: m });

  function build() {
    const rand = mulberry32(20261022);
    const group = new Group();
    const plate = new Mesh(
      new RoundedBoxGeometry(13.2, 6.2, 0.35, 4, 0.12),
      new MeshStandardMaterial({
        map: brushed(rand),
        color: 0xffffff,
        roughness: 0.42,
        metalness: 0.55,
      }),
    );
    plate.receiveShadow = true;
    group.add(plate);

    const screw = (x: number, y: number) => {
      const s = new Mesh(new CylinderGeometry(0.09, 0.09, 0.06, 20), metal(C.screw, 0.3));
      s.rotation.x = Math.PI / 2;
      s.position.set(x, y, 0.2);
      const slot = new Mesh(new BoxGeometry(0.15, 0.025, 0.03), metal("#2a2f2e", 0.6));
      slot.position.set(x, y, 0.235);
      slot.rotation.z = rand() * Math.PI;
      group.add(s, slot);
    };
    [
      [-6.3, 2.8],
      [6.3, 2.8],
      [-6.3, -2.8],
      [6.3, -2.8],
    ].forEach(([x, y]) => screw(x!, y!));

    const instrument = (x: number, y: number, r: number, canvasEl: HTMLCanvasElement) => {
      const grp = new Group();
      grp.position.set(x, y, 0.18);
      const bezel = new Mesh(new TorusGeometry(r + 0.1, 0.14, 16, 96), metal("#1c201f", 0.4, 0.6));
      bezel.position.z = 0.16;
      bezel.castShadow = true;
      grp.add(bezel);
      const well = new Mesh(
        new CylinderGeometry(r + 0.02, r + 0.02, 0.2, 96, 1, true),
        metal("#0d0f0f", 0.7, 0.3),
      );
      well.rotation.x = Math.PI / 2;
      well.position.z = 0.1;
      grp.add(well);
      const tex = new CanvasTexture(canvasEl);
      tex.colorSpace = SRGBColorSpace;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      const face = new Mesh(
        new CircleGeometry(r, 96),
        new MeshStandardMaterial({ map: tex, roughness: 0.9, metalness: 0 }),
      );
      face.position.z = 0.02;
      grp.add(face);
      const glass = new Mesh(
        new CircleGeometry(r, 64),
        new MeshPhysicalMaterial({
          color: 0xffffff,
          roughness: 0.05,
          metalness: 0,
          transparent: true,
          opacity: 0.12,
          clearcoat: 1,
          envMapIntensity: 1.6,
        }),
      );
      glass.position.z = 0.2;
      grp.add(glass);
      [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
      ].forEach(([sx, sy]) => {
        const s = new Mesh(new CylinderGeometry(0.06, 0.06, 0.04, 16), metal(C.screw, 0.3));
        s.rotation.x = Math.PI / 2;
        s.position.set(sx! * (r + 0.32) * 0.72, sy! * (r + 0.32) * 0.72, 0.03);
        grp.add(s);
      });
      group.add(grp);
      return tex;
    };

    const module = (
      x: number,
      y: number,
      w: number,
      h: number,
      draw: (g: CanvasRenderingContext2D, w: number, h: number) => void,
    ) => {
      const grp = new Group();
      grp.position.set(x, y, 0.2);
      const frame = new Mesh(
        new RoundedBoxGeometry(w + 0.14, h + 0.14, 0.12, 3, 0.04),
        metal("#1c201f", 0.5, 0.5),
      );
      grp.add(frame);
      const c = makeCanvas(Math.round(w * 200), Math.round(h * 200));
      draw(c.getContext("2d")!, c.width, c.height);
      const tex = new CanvasTexture(c);
      tex.colorSpace = SRGBColorSpace;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      const face = new Mesh(
        new PlaneGeometry(w, h),
        new MeshStandardMaterial({
          map: tex,
          roughness: 0.8,
          emissive: 0xffffff,
          emissiveMap: tex,
          emissiveIntensity: 0.25,
        }),
      );
      face.position.z = 0.065;
      grp.add(face);
      group.add(grp);
    };

    const placard = (x: number, y: number, text: string, size = 0.22) => {
      const c = makeCanvas(2048, 128);
      const g = c.getContext("2d")!;
      g.fillStyle = C.placard;
      g.font = `700 76px ${SANS}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(text, 1024, 66);
      const tex = new CanvasTexture(c);
      tex.colorSpace = SRGBColorSpace;
      const m = new Mesh(
        new PlaneGeometry(size * 16, size),
        new MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }),
      );
      m.position.set(x, y, 0.181);
      group.add(m);
    };

    textures = {
      users: instrument(-4.15, 0.75, 1.55, faceCanvases.users),
      adi: instrument(0, 0.75, 1.9, faceCanvases.adi),
      alt: instrument(4.15, 0.75, 1.55, faceCanvases.alt),
    };
    placard(-4.15, -1.25, "USERS SERVED");
    placard(0, -1.55, "ATTITUDE");
    placard(4.15, -1.25, "IN PRODUCTION");

    const lcd =
      (label: string, value: string) => (g: CanvasRenderingContext2D, w: number, h: number) => {
        g.fillStyle = C.face;
        g.fillRect(0, 0, w, h);
        g.fillStyle = C.muted;
        g.font = `600 ${h * 0.2}px ${SANS}`;
        g.textAlign = "left";
        g.textBaseline = "top";
        g.fillText(label, w * 0.06, h * 0.12);
        g.fillStyle = C.cyan;
        g.font = `700 ${h * 0.38}px ${FONT}`;
        g.textBaseline = "bottom";
        g.fillText(value, w * 0.06, h * 0.9);
      };
    module(-4.4, -2.35, 3.2, 0.78, (g, w, h) => {
      g.fillStyle = C.annunciatorGround;
      g.fillRect(0, 0, w, h);
      g.fillStyle = C.green;
      g.font = `700 ${h * 0.36}px ${SANS}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(options.annunciator, w / 2, h / 2 + 2);
    });
    const label = (r: { panel?: string; label: string; source: string }) =>
      r.panel ?? `${r.label} · ${r.source}`.toUpperCase();
    module(-0.9, -2.35, 2.6, 0.78, lcd(label(readouts.p95), readouts.p95.value));
    module(1.95, -2.35, 2.6, 0.78, lcd(label(readouts.ciQueue), readouts.ciQueue.value));
    module(4.85, -2.35, 2.6, 0.78, lcd(label(readouts.downstream), readouts.downstream.value));

    // toggle switches
    for (let i = 0; i < 3; i++) {
      const x = 5.1 + i * 0.42;
      const y = 2.78;
      const base = new Mesh(new CylinderGeometry(0.1, 0.1, 0.08, 16), metal("#2a2f2e", 0.4));
      base.rotation.x = Math.PI / 2;
      base.position.set(x, y, 0.21);
      group.add(base);
      const lever = new Mesh(new CylinderGeometry(0.035, 0.05, 0.36, 10), metal("#d9dcd8", 0.25));
      lever.position.set(x, y + 0.1, 0.36);
      lever.rotation.x = i === 1 ? -0.7 : 0.7;
      group.add(lever);
    }
    placard(5.52, 2.47, "NAV · STROBE · LDG", 0.13);
    placard(-3.9, 2.72, "I. SAPRONOV · PRAGUE · LKPR", 0.16);

    group.rotation.set(0.1, 0.22, 0);
    return group;
  }

  function buildLights(night: boolean) {
    const out: Object3D[] = [];
    const key = new DirectionalLight(0xffffff, night ? 0.5 : 1.8);
    key.position.set(-6, 8, 10);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    out.push(key, new AmbientLight(0xffffff, night ? 0.15 : 0.35));
    if (night) {
      const glow = new PointLight(0xf2c230, 6, 9);
      glow.position.set(0, 3.4, 2);
      out.push(glow);
    }
    return out;
  }

  function disposeObject(obj: Object3D) {
    obj.traverse((o) => {
      const mesh = o as Mesh;
      if (mesh.geometry) (mesh.geometry as BufferGeometry).dispose();
      const mat = mesh.material as Material | Material[] | undefined;
      const mats = Array.isArray(mat) ? mat : mat ? [mat] : [];
      for (const m of mats) {
        for (const value of Object.values(m)) {
          if (value && typeof value === "object" && (value as Texture).isTexture) {
            (value as Texture).dispose();
          }
        }
        m.dispose();
      }
    });
  }

  /* ------------------------------------------------------------ state */
  let usersValue = readouts.users.count?.to ?? 2;
  let yearValue: number = careerSpan.to;
  let pitch = 0;
  let roll = 0;
  let targetPitch = 0;
  let targetRoll = 0;
  let settleT = capture ? SETTLE_SECONDS : 0;

  const applyTheme = () => {
    const night = isNight();
    C = PALETTES[night ? "night" : "day"];
    renderer.toneMappingExposure = night ? 1.0 : 1.05;
    if (panelGroup.parent) {
      scene.remove(panelGroup);
      disposeObject(panelGroup);
    }
    lights.forEach((l) => scene.remove(l));
    panelGroup = build();
    lights = buildLights(night);
    scene.add(panelGroup, ...lights);
    drawUsers(usersValue);
    drawADI(pitch, roll * -1);
    drawAlt(yearValue);
    markDirty();
  };

  const markDirty = () => {
    if (textures.users) textures.users.needsUpdate = true;
    if (textures.adi) textures.adi.needsUpdate = true;
    if (textures.alt) textures.alt.needsUpdate = true;
  };

  applyTheme();
  await yieldToMain();

  /* ------------------------------------------------------------ loop */
  let visible = true;
  let raf = 0;
  let last = 0;
  let disposed = false;
  const running = () => visible && document.visibilityState === "visible" && !disposed;

  const kick = (t: number, amp: number, k = 2.4, w = 7.2) =>
    amp * Math.exp(-k * t) * Math.sin(w * t);

  function frame(now: number) {
    raf = 0;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
    last = now;
    let busy = false;

    if (settleT < SETTLE_SECONDS) {
      settleT = Math.min(SETTLE_SECONDS, settleT + dt);
      const done = settleT >= SETTLE_SECONDS;
      usersValue = Math.min(3, Math.max(0, 2 + (done ? 0 : kick(settleT, -0.55))));
      yearValue = careerSpan.to + (done ? 0 : kick(settleT, -0.9, 2.0, 6));
      drawUsers(usersValue);
      drawAlt(yearValue);
      if (textures.users) textures.users.needsUpdate = true;
      if (textures.alt) textures.alt.needsUpdate = true;
      busy = !done;
    }

    const a = 1 - Math.exp(-dt * 6);
    const dp = targetPitch - pitch;
    const dr = targetRoll - roll;
    if (Math.abs(dp) > 0.01 || Math.abs(dr) > 0.0004) {
      pitch += dp * a;
      roll += dr * a;
      drawADI(pitch, -roll);
      if (textures.adi) textures.adi.needsUpdate = true;
      busy = true;
    }

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
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetRoll = Math.max(-1, Math.min(1, nx)) * MAX_ROLL;
    targetPitch = -Math.max(-1, Math.min(1, ny)) * MAX_PITCH;
    wake();
  };

  const io = new IntersectionObserver((entries) => {
    visible = entries.some((en) => en.isIntersecting);
    if (visible) wake();
  });
  const ro = new ResizeObserver(() => {
    resize();
    renderer.render(scene, camera);
  });
  const onVisibility = () => wake();
  const onTheme = () => {
    applyTheme();
    renderer.render(scene, camera);
  };
  const themeObserver = new MutationObserver(() => {
    const night = isNight();
    if ((night && C === PALETTES.day) || (!night && C === PALETTES.night)) onTheme();
  });

  if (!capture) {
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    io.observe(stage);
    ro.observe(stage);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  // Compile shaders without blocking where the browser supports it, then show the first frame.
  try {
    await renderer.compileAsync(scene, camera);
  } catch {
    /* fall back to compiling on first render */
  }
  renderer.render(scene, camera);
  options.onFirstFrame?.();
  if (!capture) {
    // Let the canvas fade in over the matching poster, then let the needles settle.
    window.setTimeout(wake, 450);
  }

  return {
    refreshTheme: onTheme,
    dispose() {
      if (disposed) return;
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      disposeObject(panelGroup);
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
