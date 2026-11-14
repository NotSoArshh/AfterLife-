import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { imageSrc } from "../data/images";

export interface GlobeMarker {
  id: string;
  label: string;
  lat: number;
  lon: number;
}

interface GlobeProps {
  body: "moon" | "mars";
  markers: GlobeMarker[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}

type GlobeState = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  group: THREE.Group;
  markerGroup: THREE.Group;
  markerMeshes: THREE.Mesh[];
  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;
  yaw: number;
  targetYaw: number | null;
  pitch: number;
  dragging: boolean;
  moved: number;
  lastX: number;
  lastY: number;
  reduce: boolean;
  visible: boolean;
  frame: number;
};

/** Deterministic PRNG so the surface looks the same on every visit. */
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const latLonToVector = (lat: number, lon: number, radius = 1) => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

const makePlanetTexture = (body: "moon" | "mars") => {
  const W = 2048;
  const H = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry32(body === "moon" ? 1969 : 1976);
  const project = (lat: number, lon: number) => ({
    x: ((lon + 180) / 360) * W,
    y: ((90 - lat) / 180) * H,
  });

  if (body === "moon") {
    const base = ctx.createLinearGradient(0, 0, 0, H);
    base.addColorStop(0, "#8f8b84");
    base.addColorStop(0.5, "#a5a09a");
    base.addColorStop(1, "#87837c");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, W, H);

    // Maria: the dark basalt plains that give the near side its face.
    const maria: [number, number, number, number][] = [
      [33, -16, 210, 150], // Imbrium
      [28, 17, 150, 130], // Serenitatis
      [9, 31, 150, 120], // Tranquillitatis
      [17, 59, 110, 100], // Crisium
      [20, -55, 190, 170], // Procellarum
      [-21, -15, 150, 120], // Nubium
      [-8, 51, 130, 110], // Fecunditatis
      [-15, 34, 100, 90], // Nectaris
      [-24, -50, 130, 100], // Humorum / Cognitum
    ];
    for (const [lat, lon, w, h] of maria) {
      const { x, y } = project(lat, lon);
      const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h));
      g.addColorStop(0, "rgba(58,57,55,0.92)");
      g.addColorStop(0.65, "rgba(66,64,62,0.72)");
      g.addColorStop(1, "rgba(80,78,74,0)");
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, h / Math.max(w, h));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(w, h), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  } else {
    const base = ctx.createLinearGradient(0, 0, 0, H);
    base.addColorStop(0, "#b4613a");
    base.addColorStop(0.45, "#a9542f");
    base.addColorStop(0.55, "#9c4a2a");
    base.addColorStop(1, "#8d4226");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, W, H);

    // Dark albedo regions (Syrtis Major, Acidalia, Mare Erythraeum, Solis Lacus)
    const dark: [number, number, number, number][] = [
      [10, 70, 130, 150],
      [42, -20, 210, 110],
      [-12, -40, 240, 120],
      [-26, 85, 120, 90],
      [22, 170, 160, 120],
      [-45, 20, 180, 100],
    ];
    for (const [lat, lon, w, h] of dark) {
      const { x, y } = project(lat, lon);
      const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h));
      g.addColorStop(0, "rgba(96,52,34,0.78)");
      g.addColorStop(1, "rgba(120,64,40,0)");
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, h / Math.max(w, h));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(w, h), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Valles Marineris — a long tectonic scar along the equator.
    const v = project(-10, -55);
    ctx.strokeStyle = "rgba(74,38,26,0.75)";
    ctx.lineWidth = 26;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(v.x, v.y);
    ctx.bezierCurveTo(v.x + 170, v.y + 40, v.x + 300, v.y + 10, v.x + 430, v.y + 55);
    ctx.stroke();
    ctx.strokeStyle = "rgba(206,124,78,0.22)";
    ctx.lineWidth = 6;
    ctx.stroke();

    // Tharsis bulge, brighter and higher.
    const th = project(2, -110);
    const tg = ctx.createRadialGradient(th.x, th.y, 0, th.x, th.y, 260);
    tg.addColorStop(0, "rgba(213,137,91,0.30)");
    tg.addColorStop(1, "rgba(213,137,91,0)");
    ctx.fillStyle = tg;
    ctx.fillRect(th.x - 260, th.y - 260, 520, 520);
  }

  // Fine surface grain.
  for (let i = 0; i < 9000; i += 1) {
    const x = rand() * W;
    const y = rand() * H;
    const s = rand() * 2.2 + 0.4;
    ctx.fillStyle =
      body === "moon"
        ? rand() > 0.5
          ? "rgba(255,255,255,0.045)"
          : "rgba(0,0,0,0.05)"
        : rand() > 0.5
          ? "rgba(255,214,180,0.045)"
          : "rgba(60,26,14,0.055)";
    ctx.fillRect(x, y, s, s);
  }

  // Craters.
  const craterCount = body === "moon" ? 260 : 150;
  for (let i = 0; i < craterCount; i += 1) {
    const lat = Math.asin(rand() * 2 - 1) * (180 / Math.PI);
    const lon = rand() * 360 - 180;
    const { x, y } = project(lat, lon);
    const r = body === "moon" ? rand() * 26 + 3 : rand() * 16 + 2;
    const squash = 0.86 + rand() * 0.28;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, squash);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    if (body === "moon") {
      g.addColorStop(0, "rgba(104,101,96,0.55)");
      g.addColorStop(0.55, "rgba(120,116,110,0.32)");
      g.addColorStop(0.82, "rgba(226,222,214,0.34)");
      g.addColorStop(1, "rgba(226,222,214,0)");
    } else {
      g.addColorStop(0, "rgba(92,44,26,0.42)");
      g.addColorStop(0.6, "rgba(112,56,32,0.22)");
      g.addColorStop(0.86, "rgba(228,170,132,0.26)");
      g.addColorStop(1, "rgba(228,170,132,0)");
    }
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Polar caps on Mars.
  if (body === "mars") {
    for (const [y0, y1] of [
      [0, 70],
      [H - 70, H],
    ]) {
      const g = ctx.createLinearGradient(0, y0, 0, y1);
      const top = y0 === 0;
      g.addColorStop(top ? 0 : 1, "rgba(240,236,228,0.88)");
      g.addColorStop(top ? 1 : 0, "rgba(240,236,228,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, Math.min(y0, y1), W, Math.abs(y1 - y0));
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
};

const Globe = ({ body, markers, activeId, onSelect, className = "" }: GlobeProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GlobeState | null>(null);
  const [supported, setSupported] = useState(true);

  // Scene setup.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      setSupported(false);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "globe__canvas";
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
    camera.position.set(0, 0.18, 2.95);

    const group = new THREE.Group();
    scene.add(group);

    const texture = makePlanetTexture(body);
    const geometry = new THREE.SphereGeometry(1, 96, 64);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      bumpMap: texture,
      bumpScale: body === "moon" ? 0.022 : 0.014,
      roughness: 0.96,
      metalness: 0.02,
      color: 0xffffff,
    });
    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);

    if (body === "mars") {
      const haze = new THREE.Mesh(
        new THREE.SphereGeometry(1.035, 48, 32),
        new THREE.MeshBasicMaterial({
          color: 0xe08a4e,
          transparent: true,
          opacity: 0.1,
          side: THREE.BackSide,
          depthWrite: false,
        })
      );
      group.add(haze);
    }

    const sun = new THREE.DirectionalLight(0xfff3e2, 3.1);
    sun.position.set(4.5, 1.6, 3.2);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x5f7fb5, 0.55);
    fill.position.set(-3.5, -1.2, -2);
    scene.add(fill);
    scene.add(new THREE.AmbientLight(0x2a3346, 0.9));

    // Starfield
    const starCount = 1100;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      const r = 7 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xd8e2f2, size: 0.035, sizeAttenuation: true, transparent: true, opacity: 0.75 })
    );
    scene.add(stars);

    // Markers
    const markerGroup = new THREE.Group();
    group.add(markerGroup);
    const markerMeshes: THREE.Mesh[] = [];
    const markerGeo = new THREE.SphereGeometry(0.017, 12, 12);
    markers.forEach((marker) => {
      const pos = latLonToVector(marker.lat, marker.lon, 1.002);
      const dot = new THREE.Mesh(
        markerGeo,
        new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffd9a0") })
      );
      dot.position.copy(pos);
      dot.userData.id = marker.id;
      markerGroup.add(dot);
      markerMeshes.push(dot);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.032, 0.042, 24),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color("#ffd9a0"),
          transparent: true,
          opacity: 0.55,
          side: THREE.DoubleSide,
        })
      );
      ring.position.copy(pos.clone().multiplyScalar(1.001));
      ring.lookAt(0, 0, 0);
      ring.userData.id = marker.id;
      markerGroup.add(ring);
    });

    const state: GlobeState = {
      renderer,
      scene,
      camera,
      group,
      markerGroup,
      markerMeshes,
      raycaster: new THREE.Raycaster(),
      pointer: new THREE.Vector2(),
      yaw: body === "moon" ? -0.6 : 0.9,
      targetYaw: null,
      pitch: 0.12,
      dragging: false,
      moved: 0,
      lastX: 0,
      lastY: 0,
      reduce,
      visible: true,
      frame: 0,
    };
    stateRef.current = state;
    group.rotation.y = state.yaw;
    group.rotation.x = state.pitch;

    const onPointerDown = (e: PointerEvent) => {
      state.dragging = true;
      state.moved = 0;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      renderer.domElement.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      state.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      state.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (!state.dragging) return;
      const dx = e.clientX - state.lastX;
      const dy = e.clientY - state.lastY;
      state.moved += Math.abs(dx) + Math.abs(dy);
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      state.yaw += dx * 0.006;
      state.pitch = Math.max(-0.85, Math.min(0.85, state.pitch + dy * 0.004));
      state.targetYaw = null;
    };

    const onClick = (e: PointerEvent) => {
      if (state.moved > 6 || !onSelect) return;
      const rect = renderer.domElement.getBoundingClientRect();
      state.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      state.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      state.raycaster.setFromCamera(state.pointer, state.camera);
      const hits = state.raycaster.intersectObjects(markerGroup.children, false);
      const hit = hits.find((h) => h.object.userData.id);
      if (hit) onSelect(hit.object.userData.id as string);
    };

    const onPointerUp = () => {
      state.dragging = false;
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);
    renderer.domElement.addEventListener("click", onClick);

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);

    const io = new IntersectionObserver(
      (entries) => {
        state.visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    io.observe(wrap);

    const tick = () => {
      state.frame = requestAnimationFrame(tick);
      if (!state.visible || document.hidden) return;

      if (state.targetYaw !== null) {
        let diff = state.targetYaw - state.yaw;
        diff = ((diff + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
        state.yaw += diff * 0.08;
        state.pitch += (0.08 - state.pitch) * 0.05;
        if (Math.abs(diff) < 0.004) state.targetYaw = null;
      } else if (!state.dragging && !state.reduce) {
        state.yaw += 0.0011;
      }
      state.group.rotation.y = state.yaw;
      state.group.rotation.x += (state.pitch - state.group.rotation.x) * 0.12;
      state.raycaster.setFromCamera(state.pointer, state.camera);
      stars.rotation.y += 0.00008;
      renderer.render(state.scene, state.camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(state.frame);
      observer.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      renderer.domElement.removeEventListener("click", onClick);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      starGeo.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const m = obj.material;
          if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
          else m.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === wrap) wrap.removeChild(renderer.domElement);
      stateRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body]);

  // Rotate to the active marker.
  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    state.markerMeshes.forEach((mesh) => {
      const isActive = mesh.userData.id === activeId;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.color.set(isActive ? "#ffffff" : "#ffd9a0");
      mesh.scale.setScalar(isActive ? 1.8 : 1);
    });
    if (!activeId) {
      state.targetYaw = null;
      return;
    }
    const marker = markers.find((m) => m.id === activeId);
    if (!marker) return;
    const pos = latLonToVector(marker.lat, marker.lon);
    state.targetYaw = Math.atan2(-pos.x, pos.z);
  }, [activeId, markers]);

  if (!supported) {
    return (
      <div className={`globe globe--fallback ${className}`.trim()} ref={wrapRef}>
        <img src={imageSrc("moon-full")} alt="The Moon, photographed by NASA" />
        <p>
          This device could not start WebGL, so the interactive globe is shown as a photograph. The
          exploration list beside it still works.
        </p>
      </div>
    );
  }

  return (
    <div className={`globe ${className}`.trim()} ref={wrapRef}>
      <span className="globe__hint" aria-hidden="true">
        Drag to rotate
      </span>
    </div>
  );
};

export default Globe;
