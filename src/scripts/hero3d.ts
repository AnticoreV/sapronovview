/**
 * Hero scene "V6 · Blueprint" — port of claude-design-system/3d/r4v6.html (three r184
 * + Line2 / LineGeometry / LineMaterial fat lines).
 *
 * The software lifecycle as an isometric technical drawing that builds itself: ink
 * strokes draw the idea, the validation gate and the architecture (frontend · backend ·
 * services); blocks fill with flat colour as they're built, tests stamp checks, a rose
 * review mark erases one link and redraws it through a queue, CI/CD arrows march,
 * deployed blocks extrude solid, a sparkline draws, and a rose pen-orb (the agent loop)
 * flies back and sketches the next idea while the sheet clears.
 *
 * - Deterministic, time-based 14 s loop. The live scene starts on the poster's frame
 *   (t = 12.85 s, the finished drawing), holds it briefly, then runs the loop.
 * - Cursor → world turn ±10° and tilt ±3° (lerped). Device tilt is ignored.
 * - Pauses offscreen and in hidden tabs; rebuilds with the other palette when the theme
 *   changes; callout labels are drawn after the self-hosted IBM Plex Mono is ready;
 *   LineMaterial resolution / width follow the stage size.
 *
 * Loaded lazily by src/components/home/HeroStage.astro — never under reduced motion or
 * without WebGL (the poster stays instead).
 */
import {
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  Color,
  CubicBezierCurve3,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  type Material,
  type Object3D,
  type Texture,
} from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

export type HeroHandle = {
  dispose(): void;
};

export type HeroOptions = {
  /** Called after the first frame is on screen. */
  onFirstFrame?: () => void;
  /**
   * Poster capture (scripts/render-posters.mjs): fixed DPR, one frame at the poster
   * time, no animation, and the frame is kept in the drawing buffer for toDataURL().
   */
  capture?: { dpr: number };
};

type Palette = {
  bg: string;
  ink: string;
  faint: string;
  label: string;
  grid: string;
  gridMajor: string;
  blue: string;
  mint: string;
  butter: string;
  rose: string;
  paper: string;
  white: string;
  shadow: string;
  fillShade: string;
  tagLine: string;
};

/** Palettes from r4v6.html (the approved renders); bg = the page `--bg` token. */
const PALETTES: Record<"light" | "dark", Palette> = {
  light: {
    bg: "#EEF1F4",
    ink: "#10141A",
    faint: "#7D879A",
    label: "#4D5662",
    grid: "#DDE2E8",
    gridMajor: "#CDD4DC",
    blue: "#3D63FF",
    mint: "#59C990",
    butter: "#F4CC52",
    rose: "#EE8597",
    paper: "#FFFFFF",
    white: "#FFFFFF",
    shadow: "#1B2A44",
    fillShade: "#10141A",
    tagLine: "#D4DAE1",
  },
  dark: {
    bg: "#0E1116",
    ink: "#EEF1F4",
    faint: "#8C96A4",
    label: "#A3ACB8",
    grid: "#1D232C",
    gridMajor: "#252D38",
    blue: "#4F72FF",
    mint: "#59C990",
    butter: "#F4CC52",
    rose: "#EE8597",
    paper: "#171B22",
    white: "#EEF1F4",
    shadow: "#000000",
    fillShade: "#05070A",
    tagLine: "#2A313B",
  },
};

/** Loop length (s), the frame the posters show, and how long the live scene holds it. */
export const LOOP = 14;
export const POSTER_T = 12.85;
const HOLD = 1.6;

const ZOOM = 12.5;
const SX = 0.12;
const SY = 0.35;
const TURN = MathUtils.degToRad(10);
const TILT = MathUtils.degToRad(3);

const isDark = () => document.documentElement.classList.contains("dark");

/** Give the main thread back between heavy build phases (no single long task). */
const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

function monoStack(): string {
  const css = getComputedStyle(document.documentElement);
  return css.getPropertyValue("--font-mono").trim() || '"IBM Plex Mono", Menlo, monospace';
}

async function fontsReady(font: string) {
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load(`600 64px ${font}`, "IDEAVLTRCHUFNBKSOPYG/·1"),
        document.fonts.ready,
      ]),
      new Promise((r) => setTimeout(r, 2500)),
    ]);
  } catch {
    /* draw with fallbacks */
  }
}

/* ------------------------------------------------------------------ helpers */
const V = (x: number, y: number, z: number) => new Vector3(x, y, z);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ease = {
  io: (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  out: (x: number) => 1 - Math.pow(1 - x, 3),
  back: (x: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
};
const wrap = (x: number, p: number) => ((x % p) + p) % p;
const smoothstep01 = (x: number) => x * x * (3 - 2 * x);

/** Stroke width in CSS px per unit, scaled with the frame (r4v6 `frame()`); never hairline. */
const lineWidthFor = (w: number, h: number) =>
  Math.max(0.75, 2.1 * Math.min(w / 1280, h / 800) * Math.max(0.75, Math.min(1.25, 12.6 / ZOOM)));

type Built = {
  scene: Scene;
  setSize(w: number, h: number): void;
  renderAt(time: number, px: number, py: number): void;
  dispose(): void;
};

type StrokeOpts = {
  color?: string;
  w?: number;
  parent?: Object3D;
  dash?: [number, number] | null;
  order?: number;
  keep?: boolean;
};
type Stroke = {
  line: Line2;
  L: number;
  solid: LineMaterial;
  reveal: LineMaterial;
  pattern: LineMaterial | null;
  set(p: number, op?: number, o?: { from?: number; march?: number }): void;
};
type Callout = { set(k: number, op?: number): void };

/**
 * Build the whole drawing for one palette. Geometry and materials belong to this build
 * and are disposed with it (the theme toggle rebuilds).
 */
async function buildScene(
  renderer: WebGLRenderer,
  camera: OrthographicCamera,
  dark: boolean,
  font: string,
  size: { w: number; h: number },
): Promise<Built> {
  const C = PALETTES[dark ? "dark" : "light"];
  const scene = new Scene();
  const world = new Group();
  scene.add(world);
  const textures: Texture[] = [];
  const lineMats: LineMaterial[] = [];
  let LW = lineWidthFor(size.w, size.h);
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const col = (h: string) => new Color(h);
  const canvasTex = (c: HTMLCanvasElement) => {
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    textures.push(t);
    return t;
  };

  // A pen stroke: a polyline that reveals along its length (dash trick), then swaps to a
  // solid material. s.set(progress, opacity). `from` erases from the start.
  let ERASE = 0; // 0..1 during the end-of-loop clear: strokes un-draw from their start
  const stroke = (
    points: Vector3[],
    { color = C.ink, w = 1, parent = world, dash = null, order = 3, keep = false }: StrokeOpts = {},
  ): Stroke => {
    const pos: number[] = [];
    let L = 0;
    points.forEach((p, i) => {
      pos.push(p.x, p.y, p.z);
      if (i) L += p.distanceTo(points[i - 1]!);
    });
    const geo = new LineGeometry();
    geo.setPositions(pos);
    const mk = (dashed: boolean) => {
      const m = new LineMaterial({
        color,
        linewidth: LW * w,
        transparent: true,
        depthWrite: false,
        dashed,
        dashScale: 1,
        dashSize: L,
        gapSize: L * 3,
      });
      m.userData.w = w;
      m.resolution.set(size.w, size.h);
      lineMats.push(m);
      return m;
    };
    const solid = mk(false);
    const reveal = mk(true);
    let pattern: LineMaterial | null = null;
    if (dash) {
      pattern = mk(true);
      pattern.dashSize = dash[0];
      pattern.gapSize = dash[1];
    }
    const line = new Line2(geo, solid);
    line.computeLineDistances();
    line.renderOrder = order;
    parent.add(line);
    return {
      line,
      L,
      solid,
      reveal,
      pattern,
      set(p, op = 1, { from = 0, march = 0 } = {}) {
        if (!keep) from = Math.max(from, ERASE);
        if (p <= 0.0005 || op <= 0.002 || from >= p - 0.0005) {
          line.visible = false;
          return;
        }
        line.visible = true;
        if (pattern) {
          // dashed strokes: the pattern marches and fades in with the progress
          line.material = pattern;
          pattern.opacity = op * Math.min(1, p) * (keep ? 1 : 1 - ERASE);
          pattern.dashOffset = -march;
          return;
        }
        if (p >= 0.9995 && from <= 0.0005) {
          line.material = solid;
          solid.opacity = op;
          return;
        }
        line.material = reveal;
        reveal.opacity = op;
        // visible where (d + off) mod (dash + gap) <= dash  →  window [from·L, p·L]
        reveal.dashSize = Math.max(0.0001, (p - from) * L);
        reveal.gapSize = L * 3;
        reveal.dashOffset = -from * L;
      },
    };
  };
  const polyCircle = (
    cx: number,
    cz: number,
    r: number,
    y = 0.02,
    n = 72,
    wob = 0,
    seed = 0,
    a0 = 0,
    turns = 1.06,
  ) => {
    const pts: Vector3[] = [];
    for (let i = 0; i <= n; i++) {
      const a = a0 + (i / n) * Math.PI * 2 * turns;
      const rr =
        r * (1 + wob * (Math.sin(a * 3 + seed) * 0.6 + Math.sin(a * 5 + seed * 2.1) * 0.4));
      pts.push(V(cx + Math.cos(a) * rr, y, cz + Math.sin(a) * rr));
    }
    return pts;
  };

  // Flat-shaded fill box (vertex colours by face: top / +x / +z), base at y = 0.
  const fillBox = (
    w: number,
    h: number,
    d: number,
    color: string,
    x: number,
    z: number,
    y0 = 0,
  ) => {
    const g = new BoxGeometry(w, h, d);
    g.translate(0, h / 2, 0);
    const n = g.attributes.normal!;
    const cols: number[] = [];
    const base = col(color);
    const dk = col(C.fillShade);
    for (let i = 0; i < n.count; i++) {
      const ny = n.getY(i);
      const nx = n.getX(i);
      const nz = n.getZ(i);
      const k = ny > 0.5 ? 0 : nx > 0.5 ? 0.14 : nz > 0.5 ? 0.26 : 0.3;
      const c = base.clone().lerp(dk, k);
      cols.push(c.r, c.g, c.b);
    }
    g.setAttribute("color", new Float32BufferAttribute(cols, 3));
    const m = new Mesh(
      g,
      new MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        polygonOffset: true,
        polygonOffsetFactor: 2,
        polygonOffsetUnits: 2,
      }),
    );
    m.position.set(x, y0, z);
    m.renderOrder = 1;
    world.add(m);
    return m;
  };
  // Box outline as pen strokes: one continuous path + 3 verticals; the 3 hidden edges
  // (meeting at the −x −y −z corner) are lighter construction lines.
  const boxStrokes = (
    w: number,
    h: number,
    d: number,
    x: number,
    z: number,
    y0 = 0,
    opts: StrokeOpts = {},
  ) => {
    const x0 = x - w / 2;
    const x1 = x + w / 2;
    const z0 = z - d / 2;
    const z1 = z + d / 2;
    const y1 = y0 + h;
    const main = stroke(
      [
        V(x1, y0, z0),
        V(x1, y0, z1),
        V(x0, y0, z1),
        V(x0, y1, z1),
        V(x1, y1, z1),
        V(x1, y1, z0),
        V(x0, y1, z0),
        V(x0, y1, z1),
      ],
      opts,
    );
    const v1 = stroke([V(x1, y0, z1), V(x1, y1, z1)], opts);
    const v2 = stroke([V(x1, y0, z0), V(x1, y1, z0)], opts);
    const hid = [
      stroke([V(x0, y0, z0), V(x1, y0, z0)], { ...opts, color: C.faint, w: 0.7 }),
      stroke([V(x0, y0, z0), V(x0, y0, z1)], { ...opts, color: C.faint, w: 0.7 }),
      stroke([V(x0, y0, z0), V(x0, y1, z0)], { ...opts, color: C.faint, w: 0.7 }),
    ];
    return {
      // p: drawing progress, op: opacity, filled: hides construction lines as the fill rises
      set(p: number, op = 1, filled = 0) {
        main.set(seg(p, 0, 0.72), op);
        v1.set(seg(p, 0.62, 0.84), op);
        v2.set(seg(p, 0.76, 1), op);
        hid.forEach((s, i) =>
          s.set(seg(p, 0.1 + i * 0.12, 0.5 + i * 0.12), op * 0.8 * (1 - filled)),
        );
      },
    };
  };
  // Technical-drawing callout: a dot on the element, a thin leader, screen-facing mono text.
  const callout = (
    text: string,
    anchor: Vector3,
    elbow: Vector3,
    {
      color = C.label,
      lead = C.faint,
      size: sz = 0.27,
      align = "left",
    }: { color?: string; lead?: string; size?: number; align?: "left" | "right" | "center" } = {},
  ): Callout => {
    const c = document.createElement("canvas");
    const g = c.getContext("2d")!;
    const px = 80;
    g.font = `600 ${px}px ${font}`;
    g.letterSpacing = "9px";
    c.width = Math.ceil(g.measureText(text).width) + 24;
    c.height = Math.round(px * 1.4);
    g.font = `600 ${px}px ${font}`;
    g.letterSpacing = "9px";
    g.fillStyle = color;
    g.textBaseline = "middle";
    g.fillText(text, 12, c.height / 2 + 3);
    const t = canvasTex(c);
    t.anisotropy = maxAniso;
    const sp = new Sprite(
      new SpriteMaterial({ map: t, transparent: true, depthTest: false, toneMapped: false }),
    );
    const h = sz * 1.4;
    sp.scale.set((h * c.width) / c.height, h, 1);
    sp.center.set(align === "left" ? 0 : align === "right" ? 1 : 0.5, 0.5);
    sp.position.copy(elbow);
    sp.renderOrder = 9;
    world.add(sp);
    const leader =
      elbow.distanceTo(anchor) > 0.01
        ? stroke([anchor, elbow], { color: lead, w: 0.7, order: 6 })
        : null;
    const dot = new Mesh(
      new SphereGeometry(0.055, 12, 6),
      new MeshBasicMaterial({
        color: lead === C.faint ? C.ink : lead,
        transparent: true,
        depthTest: false,
      }),
    );
    dot.position.copy(anchor);
    dot.renderOrder = 9;
    world.add(dot);
    return {
      set(k: number, op = 1) {
        const lk = seg(k, 0, 0.55);
        const tk = seg(k, 0.45, 1);
        if (leader) leader.set(lk, op);
        dot.visible = k > 0 && op > 0.002 && !!leader;
        dot.material.opacity = op;
        dot.scale.setScalar(Math.max(0.001, ease.back(seg(k, 0, 0.3))));
        sp.visible = tk > 0 && op > 0.002;
        sp.material.opacity = tk * op;
      },
    };
  };
  const sprite = (drawFn: (g: CanvasRenderingContext2D) => void, sz: number, pos: Vector3) => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    drawFn(c.getContext("2d")!);
    const t = canvasTex(c);
    const s = new Sprite(
      new SpriteMaterial({ map: t, transparent: true, depthTest: false, toneMapped: false }),
    );
    s.scale.set(sz, sz, 1);
    s.position.copy(pos);
    s.renderOrder = 8;
    world.add(s);
    return s;
  };
  const aoTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    g.filter = "blur(20px)";
    g.fillStyle = "#000";
    g.beginPath();
    g.roundRect(58, 58, 140, 140, 22);
    g.fill();
    const t = new CanvasTexture(c);
    textures.push(t);
    return t;
  })();
  const contact = (w: number, d: number, x: number, z: number, k = 1.75) => {
    const m = new Mesh(
      new PlaneGeometry(w * k, d * k),
      new MeshBasicMaterial({
        map: aoTex,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        color: C.shadow,
      }),
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(x + 0.18, 0.006, z + 0.18);
    m.renderOrder = 0;
    world.add(m);
    return m;
  };

  /* ---------- paper grid (fades out toward the sheet edges) ---------- */
  {
    const g = new PlaneGeometry(60, 60);
    g.rotateX(-Math.PI / 2);
    const m = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        cMinor: { value: col(C.grid) },
        cMajor: { value: col(C.gridMajor) },
        bg: { value: col(C.bg) },
      },
      vertexShader:
        "varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
      fragmentShader: `varying vec3 vW; uniform vec3 cMinor; uniform vec3 cMajor; uniform vec3 bg;
        float gl(vec2 p, float s){ vec2 g = abs(fract(p / s - 0.5) - 0.5) * s / fwidth(p); return 1.0 - min(min(g.x, g.y), 1.0); }
        void main(){
          vec2 p = vW.xz;
          float minor = gl(p, 0.5), major = gl(p, 2.0);
          vec2 c = vec2((p.x - p.y) * 0.7071 + 0.2, (p.x + p.y) * 0.7071 - 0.4);
          float fade = 1.0 - smoothstep(0.55, 1.0, length(c / vec2(12.5, 7.4)));
          vec3 colr = mix(cMinor, cMajor, major);
          float a = max(minor * 0.55, major) * fade;
          gl_FragColor = vec4(colr, a);
          #include <colorspace_fragment>
        }`,
    });
    const mesh = new Mesh(g, m);
    mesh.renderOrder = -1;
    world.add(mesh);
  }

  /* ---------- layout (world x/z; screen-right = x − z, screen-down = x + z) ---------- */
  const IDEAS = [
    { x: -7.55, z: 3.9, r: 0.62, seed: 0.0 }, // I0 — the one that passes (and the one the agent draws)
    { x: -8.8, z: 2.65, r: 0.5, seed: 1.7 }, // I1 — struck through
    { x: -6.3, z: 5.15, r: 0.5, seed: 3.1 }, // I2 — struck through
  ];
  const I0 = IDEAS[0]!;
  const GATE = { x: -5.6, z: 3.9, half: 0.75, h: 1.25 };
  const FE = { w: 2.3, h: 0.42, d: 1.6, x: -2.9, z: 2.45 }; // frontend panel
  const BE = { w: 1.55, h: 1.55, d: 1.55, x: -0.35, z: 0.0 }; // backend block
  const BUS_X = 2.35;
  const SV = [-1.35, 0, 1.35].map((z) => ({ w: 0.86, h: 0.86, d: 0.86, x: 3.3, z })); // services
  const SV0 = SV[0]!;
  const SV2 = SV[2]!;
  const QU = { x: 1.3, z: 0 }; // queue added in review
  const DEP = { x: 7.1, z: -2.45, w: 2.7, d: 2.7 }; // deploy target
  const DB = [
    [-0.62, -0.62, 1.15],
    [0.62, -0.62, 0.8],
    [-0.62, 0.62, 0.65],
    [0.62, 0.62, 0.95],
  ].map(([dx, dz, h]) => ({ x: DEP.x + dx!, z: DEP.z + dz!, h: h!, w: 0.88, d: 0.88 }));
  const OBS = { x0: 5.75, x1: 8.45, z: -4.6, y0: 0.0, y1: 1.85 }; // observe card (faces +z)

  /* ---------- timeline (seconds, LOOP = 14) ---------- */
  const T = {
    ideasIn: [0.15, 1.0],
    gate: [0.85, 1.45],
    strike: [1.45, 2.05],
    fadeOut: [2.0, 2.6],
    ideaFill: [1.6, 2.3],
    link0: [2.1, 2.9],
    fe: [2.5, 3.4],
    be: [2.95, 3.85],
    sv: [3.4, 4.4],
    links: [3.9, 4.8],
    dim: [4.4, 5.1],
    dep: [4.6, 5.3],
    obsCard: [4.9, 5.6],
    fillFe: [5.1, 5.75],
    fillBe: [5.45, 6.15],
    fillSv: [5.8, 6.5],
    ui: [5.8, 6.4],
    tests: [6.55, 7.35],
    rev: [7.45, 7.95],
    erase: [7.95, 8.35],
    queue: [8.3, 8.85],
    relink: [8.75, 9.25],
    revOut: [9.2, 9.6],
    ci: [9.15, 9.75],
    stages: [9.7, 10.5],
    pkg: [9.75, 10.55],
    deploy: [10.3, 11.2],
    spark: [10.85, 11.85],
    agentUp: [11.8, 12.1],
    agentFly: [12.1, 13.05],
    agentDraw: [13.35, 13.95],
    agentOut: [0.0, 0.55],
    clear: [12.95, 13.35],
  } satisfies Record<string, [number, number]>;
  const S = (k: keyof typeof T, t: number) => seg(t, T[k][0], T[k][1]);

  /* ---------- build the drawing ---------- */
  // ideas: loose double-stroke circles; I0 gets a butter fill (validated)
  const ideaStrokes = IDEAS.map((I, i) => ({
    a: stroke(polyCircle(I.x, I.z, I.r, 0.02, 80, 0.035, I.seed, 0.4 + i, 1.07), {
      w: 1.05,
      keep: i === 0,
    }),
    b: stroke(
      polyCircle(I.x + 0.04, I.z - 0.03, I.r * 0.93, 0.021, 80, 0.05, I.seed + 2, 2.2 + i, 0.55),
      { w: 0.6, color: C.faint, keep: i === 0 },
    ),
  }));
  const ideaFill = new Mesh(
    new CircleGeometry(I0.r * 0.86, 64),
    new MeshBasicMaterial({ color: C.butter, transparent: true, depthWrite: false }),
  );
  ideaFill.rotation.x = -Math.PI / 2;
  ideaFill.position.set(I0.x, 0.012, I0.z);
  ideaFill.renderOrder = 1;
  world.add(ideaFill);
  const strikes = [1, 2].map((i) => {
    const I = IDEAS[i]!;
    return stroke(
      [V(I.x - I.r * 1.15, 0.03, I.z + I.r * 0.2), V(I.x + I.r * 1.15, 0.03, I.z - I.r * 0.2)],
      { w: 1.0 },
    );
  });
  // validation gate: a doorway frame across the idea's path (plane x = GATE.x)
  const gate = stroke(
    [
      V(GATE.x, 0, GATE.z - GATE.half),
      V(GATE.x, GATE.h, GATE.z - GATE.half),
      V(GATE.x, GATE.h, GATE.z + GATE.half),
      V(GATE.x, 0, GATE.z + GATE.half),
    ],
    { w: 1.1 },
  );
  const gateTicks = [0.35, 0.7, 1.05].map((y) =>
    stroke([V(GATE.x, y, GATE.z - GATE.half), V(GATE.x, y, GATE.z - GATE.half + 0.18)], {
      w: 0.7,
    }),
  );
  // link: idea → through the gate → frontend (orthogonal route on the ground)
  const link0 = stroke(
    [V(I0.x + I0.r, 0.02, I0.z), V(FE.x, 0.02, I0.z), V(FE.x, 0.02, FE.z + FE.d / 2)],
    { w: 1.0 },
  );
  const tokA = V(I0.x + I0.r, 0.15, I0.z);
  const tokB = V(FE.x, 0.15, I0.z);
  const tokC = V(FE.x, 0.15, FE.z + FE.d / 2);
  const token = new Mesh(
    new SphereGeometry(0.13, 24, 12),
    new MeshBasicMaterial({ color: C.butter }),
  );
  token.renderOrder = 5;
  world.add(token);
  await yieldToMain();

  // architecture
  const feS = boxStrokes(FE.w, FE.h, FE.d, FE.x, FE.z);
  const beS = boxStrokes(BE.w, BE.h, BE.d, BE.x, BE.z);
  const svS = SV.map((s) => boxStrokes(s.w, s.h, s.d, s.x, s.z));
  const feF = fillBox(FE.w, FE.h, FE.d, C.blue, FE.x, FE.z);
  const beF = fillBox(BE.w, BE.h, BE.d, C.blue, BE.x, BE.z);
  const svF = SV.map((s) => fillBox(s.w, s.h, s.d, C.blue, s.x, s.z));
  // frontend UI marks (on the top face, white once filled)
  const ui = (() => {
    const y = FE.h + 0.004;
    const x0 = FE.x - FE.w / 2;
    const z0 = FE.z - FE.d / 2;
    const P = (u: number, v: number) => V(x0 + u * FE.w, y, z0 + v * FE.d);
    return [
      stroke([P(0.1, 0.18), P(0.9, 0.18)], { color: C.white, w: 1.4 }),
      stroke([P(0.1, 0.42), P(0.46, 0.42), P(0.46, 0.84), P(0.1, 0.84), P(0.1, 0.42)], {
        color: C.white,
        w: 0.9,
      }),
      stroke([P(0.56, 0.42), P(0.9, 0.42), P(0.9, 0.84), P(0.56, 0.84), P(0.56, 0.42)], {
        color: C.white,
        w: 0.9,
      }),
    ];
  })();
  // backend glyph "{ }" on its +z face
  const beGlyph = (() => {
    const zf = BE.z + BE.d / 2 + 0.006;
    const cy = BE.h * 0.5;
    const s = 0.2;
    const F = (u: number, v: number) => V(BE.x + u * s, cy + v * s, zf);
    return [
      stroke([F(-1.6, 1), F(-2.6, 0), F(-1.6, -1)], { color: C.white, w: 1.6 }),
      stroke([F(1.6, 1), F(2.6, 0), F(1.6, -1)], { color: C.white, w: 1.6 }),
      stroke([F(0.55, 1.25), F(-0.55, -1.25)], { color: C.white, w: 1.6 }),
    ];
  })();
  // links: frontend → backend, backend → bus (reviewed), bus, bus → services
  const linkFB = stroke(
    [V(FE.x + FE.w / 2, 0.21, FE.z), V(BE.x, 0.21, FE.z), V(BE.x, 0.21, BE.z + BE.d / 2)],
    { w: 1.0 },
  );
  const linkBQ = stroke([V(BE.x + BE.w / 2, 0.45, 0), V(BUS_X, 0.45, 0)], { w: 1.0 }); // erased in review
  const linkBQa = stroke([V(BE.x + BE.w / 2, 0.45, 0), V(QU.x - 0.3, 0.45, 0)], { w: 1.0 }); // via the queue
  const linkBQb = stroke([V(QU.x + 0.3, 0.45, 0), V(BUS_X, 0.45, 0)], { w: 1.0 });
  const bus = stroke([V(BUS_X, 0.45, SV0.z), V(BUS_X, 0.45, SV2.z)], { w: 1.0 });
  const stubs = SV.map((s) =>
    stroke([V(BUS_X, 0.45, s.z), V(s.x - s.w / 2, 0.45, s.z)], { w: 1.0 }),
  );
  const nodes = [V(BUS_X, 0.45, 0), ...SV.map((s) => V(BUS_X, 0.45, s.z))].map((p) => {
    const m = new Mesh(
      new SphereGeometry(0.07, 16, 8),
      new MeshBasicMaterial({ color: C.ink, transparent: true }),
    );
    m.position.copy(p);
    m.renderOrder = 5;
    world.add(m);
    return m;
  });
  // queue (added in review): three thin butter slabs
  const quS = [0, 1, 2].map((k) => boxStrokes(0.6, 0.16, 0.9, QU.x, QU.z, 0.2 + k * 0.2));
  const quF = [0, 1, 2].map((k) => fillBox(0.6, 0.16, 0.9, C.butter, QU.x, QU.z, 0.2 + k * 0.2));
  // review mark: a rose pen ellipse around the backend → bus link
  const revMark = stroke(
    polyCircle(0, 0, 1, 0, 90, 0.04, 4.2, -2.4, 1.12).map((p) =>
      V(BE.x + BE.w / 2 + 0.95 + p.x * 0.82, 0.45 + p.y, p.z * 0.6),
    ),
    { color: C.rose, w: 1.5, order: 8 },
  );
  [revMark.solid, revMark.reveal].forEach((m) => {
    m.depthTest = false;
  });
  // dimension over the architecture: a screen-horizontal span with end ticks
  const R = V(1, 0, -1).normalize();
  const DIM_Y = 3.05;
  const dimA = V(FE.x - FE.w / 2, DIM_Y, FE.z);
  const dimB = dimA
    .clone()
    .add(R.clone().multiplyScalar((SV0.x + 0.43 - SV0.z - (dimA.x - dimA.z)) / Math.SQRT2));
  const dim = [
    stroke([dimA, dimB], { w: 0.7, color: C.faint }),
    stroke([dimA.clone().add(V(0, -0.22, 0)), dimA.clone().add(V(0, 0.22, 0))], {
      w: 0.7,
      color: C.faint,
    }),
    stroke([dimB.clone().add(V(0, -0.22, 0)), dimB.clone().add(V(0, 0.22, 0))], {
      w: 0.7,
      color: C.faint,
    }),
  ];
  await yieldToMain();

  // CI/CD: dashed route services → deploy target with three stage diamonds
  const ciPts = [
    V(SV0.x + SV0.w / 2 + 0.12, 0.02, SV0.z),
    V(4.95, 0.02, SV0.z),
    V(4.95, 0.02, DEP.z),
    V(DEP.x - DEP.w / 2 - 0.12, 0.02, DEP.z),
  ];
  const ciReveal = stroke(ciPts, { w: 1.1 });
  const ciDash = stroke(ciPts, { w: 1.1, dash: [0.22, 0.16] });
  const ciHead = stroke(
    [
      V(DEP.x - DEP.w / 2 - 0.42, 0.02, DEP.z - 0.2),
      V(DEP.x - DEP.w / 2 - 0.12, 0.02, DEP.z),
      V(DEP.x - DEP.w / 2 - 0.42, 0.02, DEP.z + 0.2),
    ],
    { w: 1.1 },
  );
  const stagePts = [V(4.3, 0.02, SV0.z), V(4.95, 0.02, (SV0.z + DEP.z) / 2), V(5.55, 0.02, DEP.z)];
  const stages = stagePts.map((p) => {
    const g = new Group();
    g.position.copy(p);
    world.add(g);
    const r = 0.2;
    const outline = stroke(
      [V(r, 0, 0), V(0, 0, r), V(-r, 0, 0), V(0, 0, -r), V(r, 0, 0)].map((v) =>
        v.add(p).setY(0.03),
      ),
      { w: 1.0 },
    );
    const fill = new Mesh(
      new CircleGeometry(r * 0.98, 4),
      new MeshBasicMaterial({ color: C.mint, transparent: true, depthWrite: false }),
    );
    fill.rotation.set(-Math.PI / 2, 0, 0);
    fill.position.y = 0.025;
    fill.renderOrder = 2;
    g.add(fill);
    return { outline, fill };
  });
  const pkgGroup = new Group();
  world.add(pkgGroup);
  const pkgS = boxStrokes(0.34, 0.34, 0.34, 0, 0, 0, { w: 0.9, parent: pkgGroup });
  const pkgBox = fillBox(0.34, 0.34, 0.34, C.blue, 0, 0);
  world.remove(pkgBox);
  pkgGroup.add(pkgBox);
  // deploy target: dashed footprint
  const depOutline = stroke(
    [
      V(DEP.x - DEP.w / 2, 0.02, DEP.z - DEP.d / 2),
      V(DEP.x + DEP.w / 2, 0.02, DEP.z - DEP.d / 2),
      V(DEP.x + DEP.w / 2, 0.02, DEP.z + DEP.d / 2),
      V(DEP.x - DEP.w / 2, 0.02, DEP.z + DEP.d / 2),
      V(DEP.x - DEP.w / 2, 0.02, DEP.z - DEP.d / 2),
    ],
    { w: 0.8, color: C.faint, dash: [0.16, 0.13] },
  );
  // deployed blocks: extrude solid (mint), outlined, with soft contact shadows
  const dbF = DB.map((b) => fillBox(b.w, 1, b.d, C.mint, b.x, b.z));
  const dbS = DB.map((b) => {
    const g = new Group();
    world.add(g);
    g.position.set(b.x, 0, b.z);
    const s = boxStrokes(b.w, 1, b.d, 0, 0, 0, { parent: g, w: 0.9 });
    return { g, s };
  });
  const dbAO = DB.map((b) => contact(b.w, b.d, b.x, b.z));
  const dbDots = DB.map(() => {
    const m = new Mesh(
      new CircleGeometry(0.09, 20),
      new MeshBasicMaterial({ color: C.white, transparent: true, depthWrite: false }),
    );
    m.rotation.x = -Math.PI / 2;
    m.renderOrder = 6;
    world.add(m);
    return m;
  });
  // observe card (vertical, faces +z) with a sparkline
  const card = stroke(
    [
      V(OBS.x0, 0, OBS.z),
      V(OBS.x0, OBS.y1, OBS.z),
      V(OBS.x1, OBS.y1, OBS.z),
      V(OBS.x1, 0, OBS.z),
      V(OBS.x0, 0, OBS.z),
    ],
    { w: 0.9 },
  );
  const cardFill = (() => {
    const g = new PlaneGeometry(OBS.x1 - OBS.x0, OBS.y1);
    g.translate((OBS.x0 + OBS.x1) / 2, OBS.y1 / 2, OBS.z - 0.004);
    const m = new Mesh(
      g,
      new MeshBasicMaterial({
        color: C.paper,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: 2,
        polygonOffsetUnits: 2,
      }),
    );
    m.renderOrder = 1;
    world.add(m);
    return m;
  })();
  const sparkPts: Vector3[] = [];
  for (let i = 0; i <= 48; i++) {
    const u = i / 48;
    const x = lerp(OBS.x0 + 0.28, OBS.x1 - 0.28, u);
    const y =
      0.75 +
      0.22 * Math.sin(u * 9.0) +
      0.12 * Math.sin(u * 23 + 1.2) +
      (u > 0.62 ? 0.42 * ease.out(seg(u, 0.62, 0.8)) : 0);
    sparkPts.push(V(x, y, OBS.z + 0.01));
  }
  const sparkEnd = sparkPts[sparkPts.length - 1]!;
  const spark = stroke(sparkPts, { color: C.blue, w: 1.5 });
  const baseline = stroke(
    [V(OBS.x0 + 0.28, 0.42, OBS.z + 0.01), V(OBS.x1 - 0.28, 0.42, OBS.z + 0.01)],
    { w: 0.6, color: C.faint },
  );
  const beat = new Mesh(
    new CircleGeometry(0.1, 24),
    new MeshBasicMaterial({ color: C.mint, transparent: true, depthWrite: false }),
  );
  beat.position.copy(sparkEnd).add(V(0, 0, 0.01));
  beat.renderOrder = 6;
  world.add(beat);
  // tests: stamps above each built block
  const stampTex = (g: CanvasRenderingContext2D) => {
    g.fillStyle = C.mint;
    g.beginPath();
    g.arc(128, 128, 104, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#FFFFFF";
    g.lineWidth = 26;
    g.lineCap = "round";
    g.lineJoin = "round";
    g.beginPath();
    g.moveTo(80, 132);
    g.lineTo(114, 166);
    g.lineTo(178, 96);
    g.stroke();
  };
  const stampAt = [
    V(FE.x + 0.55, FE.h + 0.55, FE.z - 0.3),
    V(BE.x, BE.h + 0.5, BE.z),
    ...SV.map((s) => V(s.x, s.h + 0.42, s.z)),
  ];
  const stampsSp = stampAt.map((p) => sprite(stampTex, 0.48, p));
  // agent loop: rose pen-orb + dotted trail arc from the sparkline back to the idea
  const orbG = new Group();
  world.add(orbG);
  const orbCore = new Mesh(
    new SphereGeometry(0.2, 32, 16),
    new MeshBasicMaterial({ color: C.rose, transparent: true }),
  );
  orbCore.renderOrder = 7;
  orbG.add(orbCore);
  const orbRing = stroke(
    polyCircle(0, 0, 0.36, 0, 48).map((p) => V(p.x, 0, p.z)),
    { color: C.rose, w: 1.0, parent: orbG, keep: true },
  );
  const ARC_A = sparkEnd.clone().add(V(0, 0.35, 0.2));
  const ARC_B = V(I0.x + Math.cos(0.4) * I0.r, 0.42, I0.z + Math.sin(0.4) * I0.r);
  const arcCurve = new CubicBezierCurve3(ARC_A, V(4.5, 6.4, -3.6), V(-6.0, 6.0, 1.2), ARC_B);
  const arcPts = arcCurve.getPoints(120);
  const trail = stroke(arcPts, { color: C.rose, w: 1.0, dash: [0.08, 0.17], keep: true });
  const agentTag = (() => {
    const c = document.createElement("canvas");
    const g = c.getContext("2d")!;
    const px = 64;
    g.font = `600 ${px}px ${font}`;
    g.letterSpacing = "8px";
    c.width = Math.ceil(g.measureText("AGENT LOOP").width) + 96;
    c.height = 120;
    g.fillStyle = C.paper;
    g.strokeStyle = C.tagLine;
    g.lineWidth = 4;
    g.beginPath();
    g.roundRect(4, 4, c.width - 8, c.height - 8, 56);
    g.fill();
    g.stroke();
    g.fillStyle = C.rose;
    g.beginPath();
    g.arc(48, 60, 11, 0, Math.PI * 2);
    g.fill();
    g.font = `600 ${px}px ${font}`;
    g.letterSpacing = "8px";
    g.fillStyle = C.label;
    g.textBaseline = "middle";
    g.fillText("AGENT LOOP", 72, 64);
    const t = canvasTex(c);
    const s = new Sprite(
      new SpriteMaterial({ map: t, transparent: true, depthTest: false, toneMapped: false }),
    );
    const h = 0.5;
    s.scale.set((h * c.width) / c.height, h, 1);
    s.renderOrder = 9;
    s.position.copy(arcCurve.getPoint(0.5)).add(V(0, 0.5, 0));
    world.add(s);
    return s;
  })();
  // annotations (callouts with leaders)
  const up = (p: Vector3, dy: number) => p.clone().add(V(0, dy, 0));
  const ideaAnchor = V(I0.x - 0.15, 0.03, I0.z - I0.r * 0.95);
  const gateTop = V(GATE.x, GATE.h, GATE.z - GATE.half);
  const feAnchor = V(FE.x - 0.55, FE.h, FE.z - 0.35);
  const beAnchor = V(BE.x - 0.3, BE.h, BE.z - 0.3);
  const svAnchor = V(SV0.x - 0.1, SV0.h, SV0.z - 0.1);
  const archMid = dimA
    .clone()
    .lerp(dimB, 0.5)
    .add(V(0, 0.3, 0));
  const testsAnchor = V(SV2.x, SV2.h + 0.42, SV2.z);
  const ciMid = V(4.95, 0.02, (SV0.z + DEP.z) / 2);
  const depCorner = V(DEP.x + DEP.w / 2, 0.02, DEP.z + DEP.d / 2);
  const obsCorner = V(OBS.x0, OBS.y1, OBS.z);
  const Lb = {
    idea: callout("IDEA", ideaAnchor, up(ideaAnchor, 1.55)),
    validate: callout("VALIDATE", gateTop, up(gateTop, 0.85)),
    frontend: callout("FRONTEND", feAnchor, up(feAnchor, 1.25)),
    backend: callout("BACKEND", beAnchor, up(beAnchor, 0.75)),
    services: callout("SERVICES", svAnchor, up(svAnchor, 0.85)),
    arch: callout("ARCHITECTURE", archMid, archMid, { align: "center", color: C.faint }),
    tests: callout(
      "TESTS",
      testsAnchor,
      testsAnchor
        .clone()
        .add(R.clone().multiplyScalar(-1.25))
        .add(V(0, -0.75, 0)),
      { lead: C.mint, color: C.label, align: "right" },
    ),
    review: callout("REVIEW · 1 CHANGE", V(QU.x - 0.2, 1.05, -0.62), V(QU.x - 0.2, 2.15, -0.62), {
      color: C.rose,
      lead: C.rose,
    }),
    cicd: callout("CI/CD", ciMid, ciMid.clone().add(V(0.85, 0, 0.85)), { align: "right" }),
    deploy: callout("DEPLOY", depCorner, depCorner.clone().add(V(0.55, 0, 0.55))),
    observe: callout("OBSERVE", obsCorner, up(obsCorner, 0.55)),
  };

  const tokSegA = tokA.distanceTo(tokB);
  const tokSegB = tokB.distanceTo(tokC);
  const ciSegs = [0, 1, 2].map((i) => ciPts[i]!.distanceTo(ciPts[i + 1]!));
  const ciTotal = ciSegs[0]! + ciSegs[1]! + ciSegs[2]!;
  const tmp = new Vector3();

  /* ---------- frame ---------- */
  const renderAt = (time: number, px: number, py: number) => {
    const t = wrap(time, LOOP);
    world.rotation.set(TILT * py, TURN * px, 0);

    // everything except the idea the agent draws clears at the end of the loop
    const ck = S("clear", t);
    ERASE = ease.io(ck);
    const clr = 1 - smoothstep01(seg(ck, 0.55, 1));
    const sink = 1 - ERASE;
    const lateLoop = t >= T.clear[1]; // after the clear: only the new idea + the agent

    // ideas
    {
      // I0: drawn by the agent at the end of the previous loop → complete at t = 0
      const s0 = ideaStrokes[0]!;
      if (t < T.clear[0]) {
        s0.a.set(1, 1);
        s0.b.set(1, 0.9);
      } else if (t < T.clear[1]) {
        s0.a.set(1, 1, { from: ERASE });
        s0.b.set(1, 0.9, { from: ERASE });
      } else {
        const p = S("agentDraw", t);
        s0.a.set(p, 1);
        s0.b.set(seg(p, 0.5, 1), 0.9);
      }
      // I1, I2 sketch in, get struck through, fade out
      [1, 2].forEach((i) => {
        const p = seg(t, T.ideasIn[0] + (i - 1) * 0.25, T.ideasIn[1] + (i - 1) * 0.25);
        const op = 1 - S("fadeOut", t);
        ideaStrokes[i]!.a.set(p, op);
        ideaStrokes[i]!.b.set(seg(p, 0.4, 1), 0.9 * op);
        strikes[i - 1]!.set(seg(t, T.strike[0] + (i - 1) * 0.18, T.strike[1] + (i - 1) * 0.18), op);
      });
      const f = ease.out(S("ideaFill", t)) * sink * (lateLoop ? 0 : 1);
      ideaFill.visible = f > 0.002;
      ideaFill.scale.setScalar(Math.max(0.001, f));
      ideaFill.material.opacity = Math.min(1, f * 1.4) * clr;
    }
    // validation gate
    gate.set(S("gate", t), clr);
    gateTicks.forEach((g, i) =>
      g.set(seg(t, T.gate[0] + 0.25 + i * 0.08, T.gate[1] + i * 0.08), clr),
    );
    // idea → frontend link and the token travelling along it
    link0.set(S("link0", t), clr);
    {
      const d = ease.io(seg(t, 2.25, 3.05)) * (tokSegA + tokSegB);
      if (d < tokSegA) token.position.copy(tokA).lerp(tokB, d / tokSegA);
      else token.position.copy(tokB).lerp(tokC, (d - tokSegA) / tokSegB);
      token.visible = t > 2.25 && t < 3.1;
      token.scale.setScalar(1 - seg(t, 2.95, 3.1) * 0.9);
    }
    // architecture strokes
    const fFe = ease.out(S("fillFe", t));
    const fBe = ease.out(S("fillBe", t));
    const fSv = (i: number) => ease.out(seg(t, T.fillSv[0] + i * 0.12, T.fillSv[1] + i * 0.12));
    feS.set(S("fe", t), clr, fFe);
    beS.set(S("be", t), clr, fBe);
    svS.forEach((s, i) =>
      s.set(seg(t, T.sv[0] + i * 0.18, T.sv[0] + 0.55 + i * 0.18), clr, fSv(i)),
    );
    // fills rise
    const rise = (m: Mesh, k: number) => {
      const kk = k * sink;
      m.visible = kk > 0.002 && clr > 0.002;
      m.scale.y = Math.max(0.001, kk);
      (m.material as MeshBasicMaterial).opacity = clr;
    };
    rise(feF, fFe);
    rise(beF, fBe);
    svF.forEach((m, i) => rise(m, fSv(i)));
    ui.forEach((s, i) => s.set(seg(t, T.ui[0] + i * 0.12, T.ui[1] + i * 0.12), clr));
    beGlyph.forEach((g, i) => g.set(seg(t, 6.05 + i * 0.08, 6.3 + i * 0.08), clr));
    // links
    linkFB.set(seg(t, T.links[0], T.links[0] + 0.5), clr);
    // backend → bus: drawn, then erased in review (from the start), then redrawn via the queue
    if (t < T.erase[0]) linkBQ.set(seg(t, T.links[0] + 0.15, T.links[0] + 0.55), clr);
    else linkBQ.set(1, clr, { from: S("erase", t) });
    linkBQa.set(seg(t, T.relink[0], T.relink[0] + 0.25), clr);
    linkBQb.set(seg(t, T.relink[0] + 0.2, T.relink[1]), clr);
    bus.set(seg(t, T.links[0] + 0.4, T.links[0] + 0.75), clr);
    stubs.forEach((s, i) =>
      s.set(seg(t, T.links[0] + 0.6 + i * 0.08, T.links[0] + 0.85 + i * 0.08), clr),
    );
    nodes.forEach((n, i) => {
      const k = seg(t, T.links[0] + 0.5 + i * 0.06, T.links[0] + 0.7 + i * 0.06);
      n.visible = k > 0 && clr > 0.002;
      n.scale.setScalar(Math.max(0.001, ease.back(k)));
      n.material.opacity = clr;
    });
    // queue slabs
    const fQu = (k: number) => seg(t, T.queue[0] + 0.3 + k * 0.08, T.queue[1] + k * 0.08);
    quS.forEach((s, k) =>
      s.set(seg(t, T.queue[0] + k * 0.1, T.queue[0] + 0.35 + k * 0.1), clr, fQu(k)),
    );
    quF.forEach((m, k) => rise(m, ease.out(fQu(k))));
    // review mark
    revMark.set(S("rev", t), (1 - S("revOut", t)) * clr);
    Lb.review.set(
      seg(t, T.rev[0] + 0.15, T.rev[1] + 0.2),
      (1 - seg(t, T.revOut[1] + 0.6, T.revOut[1] + 1.1)) * clr,
    );
    // dimension + callouts
    dim.forEach((s, i) => s.set(seg(t, T.dim[0] + i * 0.1, T.dim[1]), clr));
    const lab = (c: Callout, a: number, b: number, op = 1) => c.set(seg(t, a, b), op * clr);
    lab(Lb.idea, 0.35, 0.95, t >= T.clear[1] ? 0 : 1);
    lab(Lb.validate, 1.1, 1.6);
    lab(Lb.frontend, 3.2, 3.7);
    lab(Lb.backend, 3.65, 4.15);
    lab(Lb.services, 4.2, 4.7);
    lab(Lb.arch, 4.7, 5.1);
    lab(Lb.tests, 6.75, 7.25);
    lab(Lb.cicd, 9.45, 9.95);
    lab(Lb.deploy, 5.0, 5.5);
    lab(Lb.observe, 5.3, 5.8);
    // tests: stamps
    stampsSp.forEach((s, i) => {
      const k = seg(t, T.tests[0] + i * 0.13, T.tests[0] + 0.32 + i * 0.13);
      const sc = k < 1 ? lerp(1.5, 1, ease.out(k)) : 1;
      s.visible = k > 0 && clr > 0.002;
      s.material.opacity = Math.min(1, k * 2) * clr;
      s.scale.setScalar(0.46 * sc);
      s.position.y = stampAt[i]!.y;
    });
    // CI/CD
    {
      const p = S("ci", t);
      if (p < 1) {
        ciReveal.set(p, clr);
        ciDash.set(0, 0);
      } else {
        ciReveal.set(0, 0);
        ciDash.set(1, clr, { march: (t - T.ci[1]) * 0.9 });
      }
      ciHead.set(seg(t, T.ci[1] - 0.1, T.ci[1] + 0.15), clr);
      stages.forEach((st, i) => {
        st.outline.set(seg(t, T.ci[0] + 0.15 + i * 0.12, T.ci[0] + 0.45 + i * 0.12), clr);
        const k = seg(t, T.stages[0] + i * 0.26, T.stages[0] + 0.25 + i * 0.26);
        st.fill.visible = k > 0 && clr > 0.002;
        st.fill.scale.setScalar(Math.max(0.001, ease.back(k)));
        st.fill.material.opacity = clr;
      });
      // a package (blue cube) rides the route
      let d = ease.io(S("pkg", t)) * ciTotal;
      let i = 0;
      while (i < 2 && d > ciSegs[i]!) {
        d -= ciSegs[i]!;
        i++;
      }
      tmp.copy(ciPts[i]!).lerp(ciPts[i + 1]!, Math.min(1, d / ciSegs[i]!));
      pkgGroup.position.set(tmp.x, 0.06, tmp.z);
      const pv = t > T.pkg[0] && t < T.pkg[1] + 0.05;
      pkgGroup.visible = pv;
      pkgS.set(pv ? 1 : 0, 1, 1);
      pkgBox.visible = pv;
    }
    // deploy target outline and deployed blocks
    depOutline.set(S("dep", t), clr, { march: 0 });
    DB.forEach((b, i) => {
      const k = seg(t, T.deploy[0] + i * 0.16, T.deploy[0] + 0.55 + i * 0.16);
      const h = b.h * ease.back(k) * sink;
      const vis = k > 0 && clr > 0.002;
      const f = dbF[i]!;
      f.visible = vis;
      f.scale.y = Math.max(0.001, h);
      (f.material as MeshBasicMaterial).opacity = clr;
      dbS[i]!.g.visible = vis;
      dbS[i]!.g.scale.y = Math.max(0.001, h);
      dbS[i]!.s.set(vis ? 1 : 0, clr, 1);
      dbAO[i]!.material.opacity = (dark ? 0.5 : 0.26) * clamp01(k * 1.5) * clr;
      const live = seg(t, T.deploy[0] + 0.5 + i * 0.16, T.deploy[0] + 0.7 + i * 0.16);
      const dot = dbDots[i]!;
      dot.visible = live > 0 && clr > 0.002;
      dot.position.set(b.x + 0.22, Math.max(0.01, h) + 0.006, b.z + 0.22);
      dot.material.opacity = live * clr * (0.65 + 0.35 * Math.sin((t - 11) * 6 + i));
    });
    // observe card + sparkline
    card.set(S("obsCard", t), clr);
    cardFill.visible = clr > 0.002 && t > T.obsCard[0];
    cardFill.material.opacity = seg(t, T.obsCard[0], T.obsCard[1]) * clr * (dark ? 0.9 : 0.85);
    baseline.set(seg(t, T.obsCard[1] - 0.2, T.obsCard[1] + 0.2), clr);
    spark.set(ease.io(S("spark", t)), clr);
    {
      const k = seg(t, T.spark[1] - 0.1, T.spark[1] + 0.1);
      const pul = 1 + 0.35 * Math.max(0, Math.sin((t - T.spark[1]) * 7));
      beat.visible = k > 0 && clr > 0.002;
      beat.scale.setScalar(Math.max(0.001, k * pul));
      beat.material.opacity = clr;
    }
    // agent loop
    {
      let op = 0;
      let has = false;
      if (t < T.agentOut[1]) {
        // previous loop's agent finishes at the idea and fades
        const a = Math.PI * 2 * 1.07 + 0.4;
        tmp.set(
          I0.x + Math.cos(a) * I0.r,
          0.42 + S("agentOut", t) * 0.3,
          I0.z + Math.sin(a) * I0.r,
        );
        op = 1 - S("agentOut", t);
        has = true;
      } else if (t >= T.agentUp[0] && t < T.agentFly[0]) {
        tmp.copy(ARC_A);
        op = S("agentUp", t);
        has = true;
      } else if (t >= T.agentFly[0] && t < T.agentDraw[0]) {
        arcCurve.getPoint(ease.io(seg(t, T.agentFly[0], T.agentDraw[0])), tmp);
        op = 1;
        has = true;
      } else if (t >= T.agentDraw[0]) {
        const a = 0.4 + S("agentDraw", t) * Math.PI * 2 * 1.07;
        tmp.set(I0.x + Math.cos(a) * I0.r, 0.42, I0.z + Math.sin(a) * I0.r);
        op = 1;
        has = true;
      }
      orbG.visible = op > 0.002;
      if (has) {
        orbG.position.copy(tmp);
        orbCore.material.opacity = op;
        orbRing.set(1, op * 0.8);
        orbG.scale.setScalar(0.6 + 0.4 * op);
      }
      // the trail draws behind the orb and fades by the end of the loop
      const tk = t < T.agentFly[0] ? 0 : ease.io(seg(t, T.agentFly[0], T.agentDraw[0]));
      const trailOp =
        (t < T.agentDraw[1] ? 1 : 1 - seg(t, T.agentDraw[1], LOOP)) * (t >= T.agentFly[0] ? 1 : 0);
      if (tk > 0 && trail.pattern) {
        trail.line.visible = true;
        trail.pattern.opacity = trailOp * 0.9;
        trail.line.material = trail.pattern;
        trail.pattern.dashOffset = 0;
        trail.line.geometry.instanceCount = Math.max(1, Math.round(tk * (arcPts.length - 1)));
      } else trail.line.visible = false;
      const tagOp = seg(t, 12.45, 12.8) * (1 - seg(t, 13.6, 13.95));
      agentTag.visible = tagOp > 0.002;
      agentTag.material.opacity = tagOp;
    }
    renderer.render(scene, camera);
  };

  const setSize = (w: number, h: number) => {
    size.w = w;
    size.h = h;
    LW = lineWidthFor(w, h);
    lineMats.forEach((m) => {
      m.resolution.set(w, h);
      m.linewidth = LW * (m.userData.w as number);
    });
  };

  const dispose = () => {
    const seen = new Set<object>();
    scene.traverse((o) => {
      const mesh = o as Mesh;
      if (mesh.geometry && !seen.has(mesh.geometry)) {
        seen.add(mesh.geometry);
        mesh.geometry.dispose();
      }
      const m = (o as Mesh).material as Material | Material[] | undefined;
      for (const mm of Array.isArray(m) ? m : m ? [m] : []) {
        if (seen.has(mm)) continue;
        seen.add(mm);
        mm.dispose();
      }
    });
    lineMats.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
  };

  return { scene, setSize, renderAt, dispose };
}

export async function mountHero(
  canvas: HTMLCanvasElement,
  options: HeroOptions = {},
): Promise<HeroHandle> {
  const capture = options.capture;
  const font = monoStack();
  await fontsReady(font);

  const stage = canvas.parentElement ?? canvas;
  const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  const dprCap = capture ? capture.dpr : mobile ? 1.5 : 2;

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: mobile ? "low-power" : "default",
    preserveDrawingBuffer: Boolean(capture),
  });
  renderer.setPixelRatio(capture ? capture.dpr : Math.min(window.devicePixelRatio || 1, dprCap));
  renderer.outputColorSpace = SRGBColorSpace;

  // True isometric, orthographic.
  const camera = new OrthographicCamera(-1, 1, 1, -1, -200, 400);
  {
    const az = Math.PI / 4;
    const el = Math.atan(1 / Math.SQRT2); // 35.26°
    camera.position.set(
      Math.sin(az) * Math.cos(el) * 80,
      Math.sin(el) * 80,
      Math.cos(az) * Math.cos(el) * 80,
    );
    camera.lookAt(0, 0, 0);
  }
  const size = { w: Math.max(1, stage.clientWidth), h: Math.max(1, stage.clientHeight) };
  const frameCamera = () => {
    const a = size.w / size.h;
    const H = (ZOOM / Math.min(1, a / 1.6)) * (a < 1 ? 1.12 : 1);
    const W = H * a;
    camera.left = -W / 2 + SX;
    camera.right = W / 2 + SX;
    camera.top = H / 2 + SY;
    camera.bottom = -H / 2 + SY;
    camera.updateProjectionMatrix();
  };
  renderer.setSize(size.w, size.h, false);
  frameCamera();

  let dark = isDark();
  renderer.setClearColor(PALETTES[dark ? "dark" : "light"].bg, 1);
  let built = await buildScene(renderer, camera, dark, font, { ...size });

  /* ------------------------------------------------------------ state */
  let time = POSTER_T;
  let hold = capture ? 0 : HOLD;
  let px = 0;
  let py = 0;
  let targetX = 0;
  let targetY = 0;
  let visible = true;
  let disposed = false;
  let raf = 0;
  let last = 0;
  let rebuilding = false;
  const running = () => visible && document.visibilityState === "visible" && !disposed;

  function frame(now: number) {
    raf = 0;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
    last = now;
    if (hold > 0) hold -= dt;
    else time = (time + dt) % LOOP;
    const k = 1 - Math.exp(-dt * 6);
    px += (targetX - px) * k;
    py += (targetY - py) * k;
    built.renderAt(time, px, py);
    if (running()) raf = requestAnimationFrame(frame);
  }
  const wake = () => {
    if (!raf && running() && !rebuilding) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  };
  const sleep = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  /* ------------------------------------------------------------ input + lifecycle */
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    targetX = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
    targetY = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1));
  };
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((en) => en.isIntersecting);
    if (visible) wake();
    else sleep();
  });
  const ro = new ResizeObserver(() => {
    size.w = Math.max(1, stage.clientWidth);
    size.h = Math.max(1, stage.clientHeight);
    renderer.setSize(size.w, size.h, false);
    frameCamera();
    if (!rebuilding) {
      built.setSize(size.w, size.h);
      built.renderAt(time, px, py);
    }
  });
  const onVisibility = () => (document.visibilityState === "visible" ? wake() : sleep());
  const themeObserver = new MutationObserver(async () => {
    const next = isDark();
    if (next === dark || rebuilding || disposed) return;
    dark = next;
    rebuilding = true;
    sleep();
    const old = built;
    renderer.setClearColor(PALETTES[dark ? "dark" : "light"].bg, 1);
    built = await buildScene(renderer, camera, dark, font, { ...size });
    old.dispose();
    rebuilding = false;
    if (disposed) {
      built.dispose();
      return;
    }
    built.renderAt(time, px, py);
    wake();
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
    await renderer.compileAsync(built.scene, camera);
  } catch {
    /* fall back to compiling on first render */
  }
  built.renderAt(time, px, py);
  options.onFirstFrame?.();
  // Let the canvas fade in over the matching poster, then start the loop.
  if (!capture) window.setTimeout(wake, 450);

  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      sleep();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      if (!rebuilding) built.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
