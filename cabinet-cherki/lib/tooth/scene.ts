/**
 * Scène 3D « La dent, de près » — une molaire en céramique modélisée en code
 * (aucun fichier 3D à télécharger) qui illustre chaque soin au défilement :
 *
 *   u = -1  introduction : dent naturelle
 *   u =  0  Consultation : vue radiographique (pulpe et canaux visibles)
 *   u =  1  Esthétique   : blanchiment, la teinte s'éclaircit
 *   u =  2  Prothèse     : la couronne se soulève, le moignon apparaît
 *   u =  3  Pédiatrie    : la dent devient une dent de lait
 *
 * Rendu à la demande : aucune image n'est calculée tant que rien ne bouge.
 * Unités : 1 ≈ 5,5 mm (couronne de 11 mm de large).
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Scene,
  ShaderMaterial,
  SplineCurve,
  Vector2,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/* ------------------------------------------------------------------ */
/*  Outils                                                             */
/* ------------------------------------------------------------------ */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Valeur d'une suite de clés (u = -1 … 3) avec un palier autour de chaque étape. */
function keyed(keys: number[], u: number, a = 0.2, b = 0.8) {
  const x = Math.min(Math.max(u + 1, 0), keys.length - 1);
  const i = Math.min(Math.floor(x), keys.length - 2);
  return mix(keys[i], keys[i + 1], smooth(a, b, x - i));
}

/** Passage de l'étape `i` à l'étape `i + 1` (0 → 1), fenêtre [a, b] du segment. */
const step = (u: number, i: number, a: number, b: number) => smooth(a, b, u - i);

/* ------------------------------------------------------------------ */
/*  Anatomie                                                           */
/* ------------------------------------------------------------------ */

const CEJ_Y = -0.6; // collet : jonction émail–cément
const SPLIT_Y = -0.66; // découpe couronne / racine (étape prothèse)
const ROOT_TOP = -0.66; // les racines forment elles-mêmes le tronc radiculaire
const TOP_Y = 0.78;
const APEX_Y = -3.13;
export const TOOTH_HEIGHT = TOP_Y - APEX_Y;
const CENTER_Y = (TOP_Y + APEX_Y) / 2;

/** Profil (rayon, hauteur) de la couronne et du tronc radiculaire. */
const BODY: [number, number][] = [
  [0.0, 0.5],
  [0.3, 0.53],
  [0.62, 0.56],
  [0.82, 0.52],
  [0.95, 0.38],
  [1.0, 0.16],
  [0.95, -0.12],
  [0.84, -0.4],
  [0.74, -0.6],
  [0.7, -0.74],
  [0.6, -0.92],
  [0.36, -1.06],
  [0.0, -1.1],
];

/** Moignon préparé pour recevoir une couronne (épaulement au collet). */
const STUMP: [number, number][] = [
  [0.0, 0.06],
  [0.28, 0.05],
  [0.44, 0.0],
  [0.52, -0.2],
  [0.58, -0.46],
  [0.6, -0.55],
  [0.72, -0.6],
  [0.66, -0.74],
  [0.0, -0.8],
];

/** Chambre pulpaire. */
const PULP: [number, number][] = [
  [0.0, 0.15],
  [0.24, 0.16],
  [0.4, 0.11],
  [0.47, 0.0],
  [0.42, -0.15],
  [0.26, -0.25],
  [0.0, -0.28],
];
const PULP_Y = -0.42;

/** Cuspides d'une première molaire inférieure : x (mésial −), z (vestibulaire +), hauteur. */
const CUSPS: [number, number, number][] = [
  [-0.5, 0.38, 0.17], // mésio-vestibulaire
  [0.02, 0.44, 0.15], // disto-vestibulaire
  [0.55, 0.3, 0.11], // distale
  [-0.45, -0.38, 0.21], // mésio-linguale
  [0.38, -0.4, 0.19], // disto-linguale
];

/** Sillons : segments (x1, z1) → (x2, z2). */
const GROOVES: [number, number, number, number][] = [
  [-0.72, 0.0, 0.72, 0.03], // sillon principal mésio-distal
  [-0.22, 0.02, -0.27, 0.78], // sillon vestibulaire mésial
  [0.3, 0.03, 0.42, 0.72], // sillon vestibulaire distal
  [0.0, -0.02, -0.03, -0.78], // sillon lingual
];

function segmentDistance2(px: number, pz: number, s: [number, number, number, number]) {
  const [x1, z1, x2, z2] = s;
  const dx = x2 - x1;
  const dz = z2 - z1;
  const t = clamp01(((px - x1) * dx + (pz - z1) * dz) / (dx * dx + dz * dz));
  const qx = x1 + dx * t - px;
  const qz = z1 + dz * t - pz;
  return qx * qx + qz * qz;
}

/** Relief de la face occlusale : cuspides, sillons, fosse centrale. */
function occlusal(x: number, z: number) {
  let h = 0;
  for (const [cx, cz, a] of CUSPS) h += a * Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / 0.115);
  for (const g of GROOVES) h -= 0.055 * Math.exp(-segmentDistance2(x, z, g) / 0.005);
  h -= 0.05 * Math.exp(-(x * x + z * z) / 0.03);
  return h;
}

/** Contour horizontal d'une molaire : un carré très arrondi, un peu plus étroit en z. */
function outline(theta: number) {
  const c = Math.abs(Math.cos(theta));
  const s = Math.abs(Math.sin(theta)) / 0.9;
  return Math.pow(c ** 2.6 + s ** 2.6, -1 / 2.6);
}

/* ------------------------------------------------------------------ */
/*  Géométrie                                                          */
/* ------------------------------------------------------------------ */

type Displace = (x: number, y: number, z: number) => number;

/**
 * Surface de révolution suivant `points` (rayon, hauteur), au contour de
 * molaire. Sommets : pôle haut, `rows - 1` anneaux de `cols` sommets, pôle bas.
 */
function lathe(points: [number, number][], rows: number, cols: number, displace?: Displace) {
  const curve = new SplineCurve(points.map(([r, y]) => new Vector2(r, y)));
  const count = 2 + (rows - 1) * cols;
  const ring = (i: number) => 1 + (i - 1) * cols;
  const pos = new Float32Array(count * 3);
  const rowY: number[] = [];
  const p = new Vector2();
  const dirs = Array.from({ length: cols }, (_, j) => {
    const t = (j / cols) * Math.PI * 2;
    const k = outline(t);
    return [Math.cos(t) * k, Math.sin(t) * k] as const;
  });

  curve.getPointAt(0, p);
  pos[1] = p.y + (displace?.(0, p.y, 0) ?? 0);
  rowY.push(p.y);
  for (let i = 1; i < rows; i++) {
    curve.getPointAt(i / rows, p);
    rowY.push(p.y);
    for (let j = 0; j < cols; j++) {
      const x = p.x * dirs[j][0];
      const z = p.x * dirs[j][1];
      const o = (ring(i) + j) * 3;
      pos[o] = x;
      pos[o + 1] = p.y + (displace?.(x, p.y, z) ?? 0);
      pos[o + 2] = z;
    }
  }
  curve.getPointAt(1, p);
  pos[(count - 1) * 3 + 1] = p.y;
  rowY.push(p.y);

  /** Triangles des rangées [from, to] (0 = pôle haut, rows = pôle bas). */
  const triangles = (from: number, to: number) => {
    const idx: number[] = [];
    for (let i = from; i < to; i++) {
      for (let j = 0; j < cols; j++) {
        const j1 = (j + 1) % cols;
        if (i === 0) idx.push(0, ring(1) + j1, ring(1) + j);
        else if (i === rows - 1) idx.push(count - 1, ring(i) + j, ring(i) + j1);
        else {
          const a = ring(i) + j;
          const a1 = ring(i) + j1;
          const b = ring(i + 1) + j;
          const b1 = ring(i + 1) + j1;
          idx.push(a, a1, b, b, a1, b1);
        }
      }
    }
    return idx;
  };

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(pos, 3));
  geometry.setIndex(triangles(0, rows));
  geometry.computeVertexNormals();
  return { geometry, rowY, triangles, rows };
}

/** Sous-maillage partageant les sommets (et donc les normales) du maillage complet. */
function subset(source: BufferGeometry, index: number[]) {
  const g = new BufferGeometry();
  g.setAttribute("position", source.getAttribute("position"));
  g.setAttribute("normal", source.getAttribute("normal"));
  g.setIndex(index);
  g.computeBoundingSphere();
  return g;
}

/**
 * Tube effilé le long d'une ligne centrale (racine, canal). Anneaux
 * horizontaux, extrémité arrondie (apex), haut fermé (caché dans la dent).
 */
function tube(
  center: (u: number) => [number, number, number],
  width: (u: number) => [number, number],
  rings: number,
  cols: number,
) {
  const count = 2 + rings * cols;
  const pos = new Float32Array(count * 3);
  const [tx, ty, tz] = center(0);
  pos.set([tx, ty + 0.02, tz], 0);
  for (let i = 0; i < rings; i++) {
    const u = i / rings;
    const [cx, cy, cz] = center(u);
    const [wx, wz] = width(u);
    for (let j = 0; j < cols; j++) {
      const t = (j / cols) * Math.PI * 2;
      const c = Math.cos(t);
      const s = Math.sin(t);
      const k = Math.pow(Math.abs(c) ** 2.3 + Math.abs(s) ** 2.3, -1 / 2.3);
      pos.set([cx + c * k * wx, cy, cz + s * k * wz], (1 + i * cols + j) * 3);
    }
  }
  pos.set(center(1), (count - 1) * 3);

  const idx: number[] = [];
  const ring = (i: number) => 1 + i * cols;
  for (let j = 0; j < cols; j++) {
    const j1 = (j + 1) % cols;
    idx.push(0, ring(0) + j1, ring(0) + j);
    idx.push(count - 1, ring(rings - 1) + j, ring(rings - 1) + j1);
    for (let i = 0; i < rings - 1; i++) {
      const a = ring(i) + j;
      const a1 = ring(i) + j1;
      const b = ring(i + 1) + j;
      const b1 = ring(i + 1) + j1;
      idx.push(a, a1, b, b, a1, b1);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

type RootSpec = { x0: number; a: number; b: number; z: number; length: number; wx: number; wz: number };

/** Racines d'une molaire inférieure (mésiale incurvée vers distal, distale plus droite). */
const ROOTS: RootSpec[] = [
  { x0: -0.33, a: -0.1, b: 0.17, z: 0.04, length: 2.47, wx: 0.38, wz: 0.6 },
  { x0: 0.33, a: 0.08, b: 0.06, z: 0.03, length: 2.27, wx: 0.36, wz: 0.56 },
];

const taper = (u: number) => Math.pow(1 - Math.pow(u, 2.6), 0.55) * (1 - 0.2 * u);

/** Racine en coordonnées locales : sommet en (0, 0, 0), apex vers le bas. */
function rootGeometry(r: RootSpec, rings: number, cols: number) {
  return tube(
    (u) => [r.a * u + r.b * u * u, -r.length * u, r.z * u * u],
    (u) => [r.wx * taper(u), r.wz * taper(u)],
    rings,
    cols,
  );
}

/** Canal radiculaire : part de la chambre pulpaire et suit la racine jusqu'à l'apex. */
function canalGeometry(r: RootSpec, rings: number, cols: number) {
  const startY = PULP_Y - 0.1;
  const startX = Math.sign(r.x0) * 0.24;
  const endY = ROOT_TOP - r.length * 0.96;
  return tube(
    (u) => {
      const y = mix(startY, endY, u);
      const v = Math.max(0, (ROOT_TOP - y) / r.length);
      const rootX = r.x0 + r.a * v + r.b * v * v;
      // Quitte la chambre en douceur puis épouse la courbe de la racine.
      return [mix(startX, rootX, smooth(startY, ROOT_TOP - 0.25, y)), y, r.z * v * v];
    },
    (u) => [0.05 * (1 - 0.65 * u), 0.07 * (1 - 0.65 * u)],
    rings,
    cols,
  );
}

/* ------------------------------------------------------------------ */
/*  Matériaux                                                          */
/* ------------------------------------------------------------------ */

const XRAY_VERT = /* glsl */ `
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  varying float vObjY;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormalV = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    vObjY = position.y;
    gl_Position = projectionMatrix * mv;
  }
`;

const XRAY_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uBase;
  uniform float uRim;
  uniform float uClipY;
  uniform float uFade;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  varying float vObjY;
  void main() {
    float facing = abs(dot(normalize(vNormalV), normalize(vViewDir)));
    float a = (uBase + uRim * pow(1.0 - facing, 2.2)) * uOpacity;
    // Fond progressif (haut des racines, caché dans le tronc)
    a *= 1.0 - smoothstep(uClipY - uFade, uClipY, vObjY);
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

function xrayMaterial(color: string, base: number, rim: number, clipY = 99, fade = 0.001) {
  return new ShaderMaterial({
    uniforms: {
      uColor: { value: new Color(color) },
      uOpacity: { value: 0 },
      uBase: { value: base },
      uRim: { value: rim },
      uClipY: { value: clipY },
      uFade: { value: fade },
    },
    vertexShader: XRAY_VERT,
    fragmentShader: XRAY_FRAG,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
  });
}

const HALO_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = pow(1.0 - smoothstep(0.0, 1.0, d), 2.0) * uIntensity;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

/* Teintes (sRGB) */
const SHADE_NATURAL = new Color("#eee3cc");
const SHADE_WHITE = new Color("#f7f5ef");
const SHADE_MILK = new Color("#f2f5fa");
const ROOT_COLOR = new Color("#e0cba3");
const DENTIN_COLOR = new Color("#e3c896");

/* ------------------------------------------------------------------ */
/*  Scène                                                              */
/* ------------------------------------------------------------------ */

export type ToothLayout = {
  /** Position du centre de la dent dans le canevas (0–1). */
  x: number;
  y: number;
  /** Hauteur de la dent, en fraction de la hauteur du canevas. */
  height: number;
};

export type ToothSceneOptions = {
  quality: "high" | "low";
  layout: (width: number, height: number) => ToothLayout;
  /** Fond transparent (capture de l'affiche statique). */
  transparent?: boolean;
  background?: string;
};

export type ToothScene = {
  /** Position dans le récit, de -1 (introduction) à 3 (pédiatrie). */
  setStory: (u: number, immediate?: boolean) => void;
  resize: () => void;
  dispose: () => void;
};

export function createToothScene(canvas: HTMLCanvasElement, options: ToothSceneOptions): ToothScene {
  const high = options.quality === "high";

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: !!options.transparent,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, high ? 2 : 1.5));
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  if (options.transparent) renderer.setClearColor(0x000000, 0);
  else renderer.setClearColor(new Color(options.background ?? "#060b1a"), 1);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  scene.environmentIntensity = 0.62;
  room.dispose();

  const camera = new PerspectiveCamera(28, 1, 0.1, 60);
  camera.position.set(0, 0.15, 10);
  camera.lookAt(0, 0, 0);

  /* Lumières : clé chaude, contre-jour froid pour détacher la dent du fond. */
  const key = new DirectionalLight("#fff2df", 2.1);
  key.position.set(3, 5, 4);
  const rim = new DirectionalLight("#b7ecf4", 2.8);
  rim.position.set(-5, 2, -3);
  const sweep = new PointLight("#eef9ff", 0, 0, 2);
  scene.add(key, rim, sweep);

  /* Halo doux derrière la dent */
  const haloMaterial = new ShaderMaterial({
    uniforms: { uColor: { value: new Color("#26bccb") }, uIntensity: { value: 0.08 } },
    vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: HALO_FRAG,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const halo = new Mesh(new PlaneGeometry(9, 9), haloMaterial);
  halo.position.z = -3;
  scene.add(halo);

  /* ---- Géométries ---- */
  const body = lathe(BODY, high ? 200 : 120, high ? 176 : 104, (x, y, z) =>
    smooth(0.25, 0.5, y) * occlusal(x, z),
  );
  let split = body.rowY.findIndex((y) => y <= SPLIT_Y);
  if (split < 1) split = Math.round(body.rows * 0.6);
  const capGeometry = subset(body.geometry, body.triangles(0, split));
  const trunkGeometry = subset(body.geometry, body.triangles(split, body.rows));

  const stumpGeometry = lathe(STUMP, high ? 90 : 56, high ? 120 : 72).geometry;
  const pulpChamber = lathe(PULP, high ? 60 : 40, high ? 72 : 48, (x, y, z) => {
    if (y <= 0) return 0;
    let h = 0;
    for (const [cx, cz] of CUSPS) h += 0.1 * Math.exp(-((x - cx * 0.6) ** 2 + (z - cz * 0.6) ** 2) / 0.02);
    return h * smooth(0.0, 0.12, y);
  }).geometry;
  pulpChamber.translate(0, PULP_Y, 0);

  const rings = high ? 72 : 44;
  const cols = high ? 56 : 36;
  const rootGeometries = ROOTS.map((r) => rootGeometry(r, rings, cols));
  const canalGeometries = ROOTS.map((r) => canalGeometry(r, high ? 60 : 36, high ? 24 : 16));

  /* ---- Matériaux ---- */
  const enamelUniforms = {
    uCej: { value: CEJ_Y },
    uRoot: { value: ROOT_COLOR.clone() },
    uCap: { value: 0 },
    uWarm: { value: 1 },
  };
  const enamel = new MeshPhysicalMaterial({
    color: SHADE_NATURAL.clone(),
    roughness: 0.3,
    clearcoat: 0.75,
    clearcoatRoughness: 0.14,
    ior: 1.62,
    transparent: true,
    side: DoubleSide,
  });
  enamel.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, enamelUniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vObj;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObj = position;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vObj;\nuniform float uCej;\nuniform vec3 uRoot;\nuniform float uCap;\nuniform float uWarm;",
      )
      .replace(
        "#include <color_fragment>",
        /* glsl */ `#include <color_fragment>
        float proximal = vObj.x * vObj.x / (vObj.x * vObj.x + vObj.z * vObj.z + 1e-4);
        float enamelMask = max(uCap, smoothstep(-0.025, 0.025, vObj.y - (uCej + 0.07 * proximal)));
        float cervical = (1.0 - smoothstep(-0.5, 0.35, vObj.y)) * uWarm;
        diffuseColor.rgb *= mix(vec3(1.0), vec3(1.0, 0.93, 0.8), cervical);
        diffuseColor.rgb = mix(uRoot, diffuseColor.rgb, enamelMask);`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        "#include <roughnessmap_fragment>\nroughnessFactor = mix(0.62, roughnessFactor, enamelMask);",
      )
      .replace(
        "#include <lights_physical_fragment>",
        "#include <lights_physical_fragment>\n#ifdef USE_CLEARCOAT\nmaterial.clearcoat *= enamelMask;\n#endif",
      );
  };

  const cementum = new MeshPhysicalMaterial({
    color: ROOT_COLOR.clone(),
    roughness: 0.6,
    clearcoat: 0.08,
    clearcoatRoughness: 0.5,
    transparent: true,
  });
  const dentin = new MeshPhysicalMaterial({
    color: DENTIN_COLOR,
    roughness: 0.55,
    clearcoat: 0.12,
    clearcoatRoughness: 0.4,
  });

  const xrayShell = xrayMaterial("#7fe9f5", 0.035, 0.9);
  const xrayInner = xrayMaterial("#7fe9f5", 0.0, 0.32); // limite émail / dentine
  const xrayRoots = xrayMaterial("#7fe9f5", 0.035, 0.9, 0.0, 0.1);
  const xrayPulp = xrayMaterial("#f1c983", 0.06, 0.72);
  xrayPulp.depthTest = false;

  /* ---- Assemblage ---- */
  const pivot = new Group(); // tourne autour du centre visuel de la dent
  const tooth = new Group();
  tooth.position.y = -CENTER_Y;
  pivot.add(tooth);
  scene.add(pivot);

  const cap = new Group();
  const capMesh = new Mesh(capGeometry, enamel);
  const capXray = new Mesh(capGeometry, xrayShell);
  // Couche d'émail : une coque intérieure, plus fine vers le collet.
  const dentinLine = new Group();
  dentinLine.position.y = CEJ_Y;
  dentinLine.scale.set(0.86, 0.84, 0.86);
  const dentinXray = new Mesh(capGeometry, xrayInner);
  dentinXray.position.y = -CEJ_Y;
  dentinLine.add(dentinXray);
  cap.add(capMesh, capXray, dentinLine);

  const trunk = new Mesh(trunkGeometry, cementum);
  const trunkXray = new Mesh(trunkGeometry, xrayShell);
  const stump = new Mesh(stumpGeometry, dentin);
  stump.scale.setScalar(0.995);

  const roots = ROOTS.map((r, i) => {
    const g = new Group();
    g.position.set(r.x0, ROOT_TOP, 0);
    g.add(new Mesh(rootGeometries[i], cementum), new Mesh(rootGeometries[i], xrayRoots));
    return g;
  });

  const pulp = new Group();
  pulp.add(new Mesh(pulpChamber, xrayPulp));
  for (const g of canalGeometries) pulp.add(new Mesh(g, xrayPulp));
  pulp.renderOrder = 10;
  pulp.traverse((o) => (o.renderOrder = 10));

  tooth.add(cap, trunk, trunkXray, stump, ...roots, pulp);

  /* ---- Cadrage ---- */
  let baseScale = 1;
  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const l = options.layout(w, h);
    camera.setViewOffset(w, h, (0.5 - l.x) * w, (0.5 - l.y) * h, w, h);
    camera.updateProjectionMatrix();
    const visible = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    baseScale = (l.height * visible) / TOOTH_HEIGHT;
    draw();
  };

  /* ---- État en fonction du récit ---- */
  const shade = new Color();
  const apply = (u: number) => {
    const xray = step(u, -1, 0.3, 0.8) * (1 - step(u, 0, 0.05, 0.45));
    const white = step(u, 0, 0.45, 0.95);
    const lift = step(u, 1, 0.2, 0.8) * (1 - step(u, 2, 0.05, 0.45));
    const milk = step(u, 2, 0.5, 0.95);

    pivot.rotation.set(keyed([0.22, 0.06, 0.55, 0.16, 0.28], u, 0.15, 0.85), -0.6 + 0.7 * (u + 1), 0);
    // La dent recule quand la couronne se soulève, pour la garder dans le cadre.
    pivot.scale.setScalar(baseScale * (1 - 0.18 * milk) * (1 - 0.14 * lift));
    pivot.position.y = -0.55 * lift * baseScale;

    // Radiographie
    const solid = 1 - xray;
    enamel.opacity = solid;
    cementum.opacity = solid;
    capMesh.visible = solid > 0.01;
    trunk.visible = solid > 0.01;
    for (const g of roots) g.children[0].visible = solid > 0.01;
    for (const m of [xrayShell, xrayInner, xrayRoots, xrayPulp]) m.uniforms.uOpacity.value = xray;
    capXray.visible = trunkXray.visible = pulp.visible = dentinLine.visible = xray > 0.01;
    for (const g of roots) g.children[1].visible = xray > 0.01;
    haloMaterial.uniforms.uIntensity.value = 0.07 + 0.13 * xray;

    // Blanchiment : la teinte s'éclaircit au passage d'une lumière
    shade.copy(SHADE_NATURAL).lerp(SHADE_WHITE, white).lerp(SHADE_MILK, milk);
    enamel.color.copy(shade);
    enamelUniforms.uWarm.value = 1 - 0.75 * white;
    const pass = Math.exp(-(((u - 0.7) / 0.17) ** 2));
    sweep.intensity = 16 * pass;
    sweep.position.set(mix(-2.4, 2.4, smooth(0.35, 1.05, u)), 0.6, 2.6);

    // Prothèse : la couronne se soulève et révèle le moignon
    cap.position.set(0, 0.95 * lift, 0.25 * lift);
    cap.rotation.set(-0.45 * lift, 0, 0.1 * lift);
    stump.visible = lift > 0.002;
    enamelUniforms.uCap.value = smooth(0.0, 0.15, lift);

    // Pédiatrie : racines plus courtes et écartées, dent plus petite
    roots.forEach((g, i) => {
      g.scale.y = 1 - 0.45 * milk;
      g.rotation.z = (i === 0 ? -0.22 : 0.22) * milk;
    });
  };

  /* ---- Rendu à la demande ---- */
  let target = -1;
  let current = -1;
  let raf = 0;
  let last = 0;
  let disposed = false;

  const draw = () => {
    if (disposed) return;
    apply(current);
    renderer.render(scene, camera);
  };

  const frame = (now: number) => {
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    current += (target - current) * (1 - Math.exp(-dt * 7));
    if (Math.abs(target - current) < 0.0005) current = target;
    draw();
    raf = current !== target ? requestAnimationFrame(frame) : 0;
  };

  const setStory = (u: number, immediate = false) => {
    target = Math.min(3, Math.max(-1, u));
    if (immediate) {
      current = target;
      draw();
      return;
    }
    if (!raf && current !== target) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };

  const dispose = () => {
    disposed = true;
    cancelAnimationFrame(raf);
    scene.traverse((o) => {
      if (o instanceof Mesh) o.geometry.dispose();
    });
    body.geometry.dispose();
    for (const m of [enamel, cementum, dentin, xrayShell, xrayInner, xrayRoots, xrayPulp, haloMaterial])
      m.dispose();
    scene.environment?.dispose();
    pmrem.dispose();
    renderer.dispose();
  };

  resize();
  return { setStory, resize, dispose };
}
