import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { HardwareModel, ModelPart } from "../data/hardwareModels";

interface HardwareViewerProps {
  model: HardwareModel;
  selected: string | null;
  onSelect: (id: string | null) => void;
  autoRotate: boolean;
  xray: boolean;
  exploded: boolean;
}

interface Part {
  id: string;
  group: THREE.Group;
  dir: THREE.Vector3;
  localCenter: THREE.Vector3;
  meshes: THREE.Mesh[];
}

interface Build {
  root: THREE.Group;
  parts: Part[];
  radius: number;
  materials: THREE.MeshStandardMaterial[];
  /** objects the render loop spins, e.g. counter-rotating rotors */
  spinners?: THREE.Object3D[];
}

const makeTexture = (
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
  size = 128,
  repeat = 1,
) => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  return tex;
};

/** Crinkled multi-layer insulation: gives metal a surface rather than a sheen. */
const makeFoil = () =>
  makeTexture((ctx, size) => {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 900; i += 1) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const len = 2 + Math.random() * 14;
      const shade = Math.random() > 0.5 ? 255 : 40;
      ctx.strokeStyle = `rgba(${shade},${shade},${shade},${0.05 + Math.random() * 0.14})`;
      ctx.lineWidth = Math.random() * 1.6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * len, y + (Math.random() - 0.5) * len);
      ctx.stroke();
    }
  }, 128, 3);

/** Solar cells: dark blue tiles separated by thin gold busbars. */
const makeSolar = () => {
  const tex = makeTexture((ctx, size) => {
    ctx.fillStyle = "#0d1a30";
    ctx.fillRect(0, 0, size, size);
    const cell = size / 4;
    for (let x = 0; x < 4; x += 1) {
      for (let y = 0; y < 4; y += 1) {
        ctx.fillStyle = `rgba(38,74,132,${0.55 + Math.random() * 0.25})`;
        ctx.fillRect(x * cell + 2, y * cell + 2, cell - 4, cell - 4);
      }
    }
    ctx.strokeStyle = "rgba(214,176,106,0.55)";
    ctx.lineWidth = 1.5;
    for (let i = 1; i < 4; i += 1) {
      ctx.beginPath();
      ctx.moveTo(i * cell, 0);
      ctx.lineTo(i * cell, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cell);
      ctx.lineTo(size, i * cell);
      ctx.stroke();
    }
  }, 128, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

const palette = () => {
  const foil = makeFoil();
  const solar = makeSolar();
  return {
    metal: new THREE.MeshStandardMaterial({
      color: 0xc2c8d2,
      metalness: 0.92,
      roughness: 0.4,
      bumpMap: foil,
      bumpScale: 0.014,
    }),
    dark: new THREE.MeshStandardMaterial({ color: 0x2b313b, metalness: 0.6, roughness: 0.62, bumpMap: foil, bumpScale: 0.01 }),
    gold: new THREE.MeshStandardMaterial({
      color: 0xdcb26b,
      metalness: 1,
      roughness: 0.32,
      bumpMap: foil,
      bumpScale: 0.022,
    }),
    panel: new THREE.MeshStandardMaterial({ color: 0xffffff, map: solar, metalness: 0.55, roughness: 0.32 }),
    white: new THREE.MeshStandardMaterial({ color: 0xe4e7eb, metalness: 0.28, roughness: 0.66, bumpMap: foil, bumpScale: 0.008 }),
    accent: new THREE.MeshStandardMaterial({ color: 0xffd9a0, metalness: 0.6, roughness: 0.38 }),
  };
};

const box = (w: number, h: number, d: number, m: THREE.Material) =>
  new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
const cyl = (rt: number, rb: number, h: number, seg: number, m: THREE.Material) =>
  new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
/** A cylinder spanning two points — used for legs and struts that must meet. */
const strut = (from: THREE.Vector3, to: THREE.Vector3, radius: number, m: THREE.Material) => {
  const dir = new THREE.Vector3().subVectors(to, from);
  const length = dir.length();
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 8), m);
  mesh.position.copy(from).addScaledVector(dir, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return mesh;
};

/** Open cone: reads as a parabolic dish where a sphere slice reads as an egg. */
const dishMesh = (radius: number, source: THREE.MeshStandardMaterial) =>
  new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius * 0.07, radius * 0.5, 30, 1, true),
    new THREE.MeshStandardMaterial({
      color: source.color,
      metalness: source.metalness,
      roughness: source.roughness,
      side: THREE.DoubleSide,
    }),
  );

/** Add a prepared mesh to a part, keeping the part id for picking. */
const attach = (p: Part, mesh: THREE.Mesh) => {
  mesh.userData.partId = p.id;
  p.group.add(mesh);
  p.meshes.push(mesh);
  return mesh;
};

/* ------------------------------------------------------------------ builders */

const buildLander = (variant: string | undefined): Build => {
  const M = palette();
  const root = new THREE.Group();
  const parts: Part[] = [];

  const part = (id: string, dir: THREE.Vector3) => {
    const group = new THREE.Group();
    group.userData.partId = id;
    root.add(group);
    const p: Part = { id, group, dir: dir.clone().normalize(), localCenter: new THREE.Vector3(), meshes: [] };
    parts.push(p);
    return p;
  };
  const put = (
    p: Part,
    mesh: THREE.Mesh,
    x = 0,
    y = 0,
    z = 0,
    rx = 0,
    ry = 0,
    rz = 0,
  ) => {
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.userData.partId = p.id;
    p.group.add(mesh);
    p.meshes.push(mesh);
    return mesh;
  };

  const viking = variant === "viking";
  const body = part("body", new THREE.Vector3(0, 0.6, 0));
  put(body, cyl(viking ? 0.92 : 0.86, viking ? 1.0 : 0.76, 0.62, 8, M.metal), 0, 0, 0);
  put(body, box(1.06, 0.05, 1.06, M.dark), 0, -0.33, 0);

  const engine = part("engine", new THREE.Vector3(0, -1, 0));
  put(engine, cyl(0.16, 0.42, 0.5, 20, M.dark), 0, -0.56, 0);

  const legs = part("legs", new THREE.Vector3(0, -0.5, 1));
  const legCount = viking ? 3 : 4;
  for (let i = 0; i < legCount; i += 1) {
    const a = (i / legCount) * Math.PI * 2 + Math.PI / 4;
    const x = Math.cos(a);
    const z = Math.sin(a);
    const top = new THREE.Vector3(x * 0.6, -0.18, z * 0.6);
    const foot = new THREE.Vector3(x * 1.02, -1.0, z * 1.02);
    attach(legs, strut(top, foot, 0.028, M.metal));
    attach(legs, strut(new THREE.Vector3(x * 0.46, -0.02, z * 0.46), foot, 0.017, M.dark));
    put(legs, cyl(0.15, 0.17, 0.055, 18, M.gold), foot.x, foot.y, foot.z);
  }

  const cabin = part("cabin", new THREE.Vector3(0, 1, 0));
  if (viking) {
    put(cabin, box(1.05, 0.4, 1.05, M.metal), 0, 0.5, 0);
    put(cabin, cyl(0.26, 0.26, 0.12, 20, M.white), 0, 0.74, 0);
    // Sampling arm reaching out over the footpad, as a surface lander would carry.
    attach(cabin, strut(new THREE.Vector3(0.4, 0.52, 0.28), new THREE.Vector3(0.86, 0.18, 0.5), 0.03, M.gold));
    put(cabin, box(0.12, 0.12, 0.12, M.dark), 0.88, 0.14, 0.52);
  } else {
    // Ascent stage sits offset forward, with the descent engine bell beneath it.
    put(cabin, box(0.66, 0.5, 0.6, M.metal), 0.08, 0.58, 0);
    put(cabin, box(0.3, 0.15, 0.04, M.dark), 0.08, 0.64, 0.31);
    put(cabin, box(0.3, 0.15, 0.04, M.dark), 0.08, 0.64, -0.31);
    put(cabin, cyl(0.17, 0.08, 0.14, 16, M.dark), 0.08, 0.28, 0);
    put(cabin, box(0.2, 0.03, 0.2, M.dark), 0.08, 0.85, 0);
  }

  const antenna = part("antenna", new THREE.Vector3(-1, 0.5, 0));
  attach(antenna, strut(new THREE.Vector3(-0.58, 0.24, 0.3), new THREE.Vector3(-0.8, 0.88, 0.44), 0.016, M.dark));
  const d = put(antenna, dishMesh(0.23, M.white), -0.82, 0.95, 0.46);
  d.rotation.set(-0.42, 0, 0.55);
  attach(antenna, strut(new THREE.Vector3(-0.76, 0.9, 0.42), new THREE.Vector3(-0.86, 0.72, 0.44), 0.009, M.gold));

  return { root, parts, radius: 1.9, materials: Object.values(M) };
};

const buildRover = (variant: string | undefined): Build => {
  const M = palette();
  const root = new THREE.Group();
  const parts: Part[] = [];
  const part = (id: string, dir: THREE.Vector3) => {
    const group = new THREE.Group();
    group.userData.partId = id;
    root.add(group);
    const p: Part = { id, group, dir: dir.clone().normalize(), localCenter: new THREE.Vector3(), meshes: [] };
    parts.push(p);
    return p;
  };
  const put = (p: Part, mesh: THREE.Mesh, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.userData.partId = p.id;
    p.group.add(mesh);
    p.meshes.push(mesh);
    return mesh;
  };

  const six = variant === "six";
  const chassis = part("chassis", new THREE.Vector3(0, 1, 0));
  put(chassis, box(six ? 1.5 : 1.9, 0.1, six ? 1.0 : 0.86, M.metal), 0, 0.46, 0);
  put(chassis, box(six ? 1.2 : 1.5, 0.16, 0.07, M.dark), 0, 0.47, six ? 0.5 : 0.44);
  put(chassis, box(six ? 1.2 : 1.5, 0.16, 0.07, M.dark), 0, 0.47, six ? -0.5 : -0.44);

  const wheels = part("wheels", new THREE.Vector3(0, -1, 0));
  const axleX = six ? [0.62, 0, -0.62] : [0.66, -0.66];
  const zSide = six ? 0.56 : 0.5;
  axleX.forEach((ax) => {
    [zSide, -zSide].forEach((az) => {
      const side = Math.sign(az);
      // Tyre, hub and rim face, so the wheel reads as a wheel and not a disc.
      put(wheels, cyl(0.23, 0.23, 0.13, 24, M.dark), ax, 0.31, az, Math.PI / 2, 0, 0);
      put(wheels, cyl(0.12, 0.12, 0.17, 20, M.gold), ax, 0.31, az, Math.PI / 2, 0, 0);
      put(wheels, cyl(0.075, 0.075, 0.19, 16, M.dark), ax, 0.31, az, Math.PI / 2, 0, 0);
      put(wheels, cyl(0.2, 0.2, 0.02, 24, M.metal), ax, 0.31, az + side * 0.07, Math.PI / 2, 0, 0);
      for (let t = 0; t < 12; t += 1) {
        const a = (t / 12) * Math.PI * 2;
        put(
          wheels,
          box(0.045, 0.02, 0.05, M.gold),
          ax + Math.cos(a) * 0.225,
          0.31 + Math.sin(a) * 0.225,
          az + side * 0.062,
        );
      }
      attach(wheels, strut(new THREE.Vector3(ax, 0.44, az), new THREE.Vector3(ax * 0.72, 0.32, az), 0.022, M.metal));
    });
  });
  if (six) {
    put(wheels, cyl(0.03, 0.03, 0.5, 8, M.metal), 0.5, 0.42, 0, 0, 0, Math.PI / 2.6);
    put(wheels, cyl(0.03, 0.03, 0.5, 8, M.metal), -0.5, 0.42, 0, 0, 0, -Math.PI / 2.6);
  }

  const seats = part("seats", new THREE.Vector3(0, 1, 1));
  if (six) {
    put(seats, box(1.0, 0.08, 0.8, M.panel), 0, 0.55, 0);
    put(seats, box(0.34, 0.16, 0.3, M.white), -0.34, 0.66, 0.2);
    put(seats, box(0.34, 0.16, 0.3, M.white), 0.34, 0.66, 0.2);
  } else {
    put(seats, box(0.5, 0.14, 0.42, M.dark), -0.3, 0.58, 0.06);
    put(seats, box(0.5, 0.14, 0.42, M.dark), 0.46, 0.58, 0.06);
    put(seats, box(0.28, 0.1, 0.3, M.dark), 0.08, 0.58, 0.06);
    put(seats, box(0.5, 0.16, 0.05, M.metal), -0.3, 0.72, -0.16);
    put(seats, box(0.5, 0.16, 0.05, M.metal), 0.46, 0.72, -0.16);
  }

  const mast = part("mast", new THREE.Vector3(-0.6, 1, 0));
  put(mast, cyl(0.035, 0.045, 0.85, 10, M.metal), -0.62, 0.9, -0.24);
  const m = put(mast, dishMesh(0.17, M.white), -0.62, 1.36, -0.24);
  m.rotation.set(0.5, 0, 0.3);
  put(mast, box(0.16, 0.16, 0.16, M.dark), six ? 0.5 : 0.62, 0.78, six ? 0.34 : 0.36);

  const fenders = part("fenders", new THREE.Vector3(0, 0, 1));
  axleX.forEach((ax) => {
    [zSide, -zSide].forEach((az) => {
      // A dust guard bridging over each wheel, on two short stays.
      put(fenders, box(0.44, 0.022, 0.24, M.white), ax, 0.5, az);
      put(fenders, box(0.05, 0.1, 0.035, M.metal), ax + 0.16, 0.44, az);
      put(fenders, box(0.05, 0.1, 0.035, M.metal), ax - 0.16, 0.44, az);
    });
  });
  if (six) {
    attach(fenders, strut(new THREE.Vector3(0.6, 0.44, 0.3), new THREE.Vector3(1.02, 0.18, 0.44), 0.028, M.metal));
    put(fenders, box(0.16, 0.1, 0.16, M.dark), 1.04, 0.14, 0.46);
  }

  return { root, parts, radius: 2.1, materials: Object.values(M) };
};

const buildHelicopter = (): Build => {
  const M = palette();
  const root = new THREE.Group();
  const parts: Part[] = [];
  const part = (id: string, dir: THREE.Vector3) => {
    const group = new THREE.Group();
    group.userData.partId = id;
    root.add(group);
    const p: Part = { id, group, dir: dir.clone().normalize(), localCenter: new THREE.Vector3(), meshes: [] };
    parts.push(p);
    return p;
  };
  const put = (p: Part, mesh: THREE.Mesh, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.userData.partId = p.id;
    p.group.add(mesh);
    p.meshes.push(mesh);
    return mesh;
  };

  const fuselage = part("fuselage", new THREE.Vector3(0, 0.4, 0));
  put(fuselage, box(0.8, 0.26, 0.34, M.white), 0, 0, 0);
  put(fuselage, box(0.34, 0.1, 0.28, M.dark), 0.28, 0.02, 0);
  put(fuselage, box(0.18, 0.14, 0.3, M.dark), -0.36, 0.04, 0);

  const rotors = part("rotors", new THREE.Vector3(0, 1, 0));
  put(rotors, cyl(0.035, 0.035, 0.36, 8, M.metal), 0, 0.28, 0);
  const spinners: THREE.Object3D[] = [];
  for (let i = 0; i < 2; i += 1) {
    const rotor = new THREE.Group();
    rotor.position.y = 0.34 + i * 0.09;
    rotor.userData.spin = i === 0 ? 1 : -1;
    for (let j = 0; j < 2; j += 1) {
      const blade = box(1.5, 0.012, 0.06, M.dark);
      blade.rotation.y = j * Math.PI;
      blade.userData.partId = "rotors";
      rotor.add(blade);
      rotors.meshes.push(blade);
    }
    rotors.group.add(rotor);
    spinners.push(rotor);
  }

  const legs = part("legs", new THREE.Vector3(0, -1, 0));
  [
    [0.3, 0.14],
    [0.3, -0.14],
    [-0.3, 0.14],
    [-0.3, -0.14],
  ].forEach(([x, z]) => {
    attach(legs, strut(new THREE.Vector3(x, -0.1, z), new THREE.Vector3(x * 1.32, -0.5, z * 1.32), 0.012, M.dark));
    put(legs, cyl(0.022, 0.022, 0.14, 8, M.metal), x * 1.32, -0.52, z * 1.32, Math.PI / 2, 0, 0);
  });

  const solar = part("solar", new THREE.Vector3(0.8, 0.8, 0));
  put(solar, box(0.56, 0.018, 0.32, M.panel), -0.02, 0.27, 0);
  put(solar, box(0.6, 0.012, 0.05, M.metal), -0.02, 0.26, 0.17);

  const camera = part("camera", new THREE.Vector3(0.6, -0.6, 0));
  put(camera, box(0.12, 0.12, 0.12, M.dark), 0.3, -0.14, 0);

  return { root, parts, radius: 1.5, materials: Object.values(M), spinners };
};

const buildTelescope = (): Build => {
  const M = palette();
  const root = new THREE.Group();
  const parts: Part[] = [];
  const part = (id: string, dir: THREE.Vector3) => {
    const group = new THREE.Group();
    group.userData.partId = id;
    root.add(group);
    const p: Part = { id, group, dir: dir.clone().normalize(), localCenter: new THREE.Vector3(), meshes: [] };
    parts.push(p);
    return p;
  };
  const put = (p: Part, mesh: THREE.Mesh, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.userData.partId = p.id;
    p.group.add(mesh);
    p.meshes.push(mesh);
    return mesh;
  };

  const barrel = part("barrel", new THREE.Vector3(0, 0.3, 0));
  put(barrel, cyl(0.42, 0.42, 1.25, 28, M.white), 0, 0, 0, 0, 0, Math.PI / 2);
  put(barrel, cyl(0.46, 0.46, 0.18, 28, M.metal), 0.62, 0, 0, 0, 0, Math.PI / 2);
  put(barrel, box(0.5, 0.3, 0.5, M.dark), -0.62, 0, 0);

  const aperture = part("aperture", new THREE.Vector3(1, 0, 0));
  put(aperture, cyl(0.3, 0.3, 0.06, 28, M.panel), 0.72, 0, 0, 0, 0, Math.PI / 2);

  const arrays = part("arrays", new THREE.Vector3(0, -1, 0));
  // The array wings lie in the barrel's plane, not hanging off it like fins.
  [1, -1].forEach((side) => {
    put(arrays, box(0.88, 0.02, 0.46, M.panel), 0.08, -0.08, side * 0.66);
    put(arrays, box(0.07, 0.05, 0.3, M.metal), 0.08, -0.08, side * 0.34);
    put(arrays, box(0.9, 0.012, 0.03, M.metal), 0.08, -0.08, side * 0.88);
  });
  // High-gain antenna on the sunlit side of the barrel.
  put(barrel, cyl(0.022, 0.022, 0.26, 10, M.metal), -0.16, 0.5, 0);
  put(barrel, dishMesh(0.2, M.white), -0.16, 0.66, 0, 0.3, 0, 0);

  const wheels = part("wheels", new THREE.Vector3(-1, 0, 0));
  [-0.24, 0.24].forEach((y) => {
    put(wheels, cyl(0.13, 0.13, 0.06, 18, M.gold), -0.95, y, 0.26, Math.PI / 2, 0, 0);
    put(wheels, cyl(0.13, 0.13, 0.06, 18, M.gold), -0.95, y, -0.26, Math.PI / 2, 0, 0);
  });

  return { root, parts, radius: 1.9, materials: Object.values(M) };
};

const buildProbe = (): Build => {
  const M = palette();
  const root = new THREE.Group();
  const parts: Part[] = [];
  const part = (id: string, dir: THREE.Vector3) => {
    const group = new THREE.Group();
    group.userData.partId = id;
    root.add(group);
    const p: Part = { id, group, dir: dir.clone().normalize(), localCenter: new THREE.Vector3(), meshes: [] };
    parts.push(p);
    return p;
  };
  const put = (p: Part, mesh: THREE.Mesh, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.userData.partId = p.id;
    p.group.add(mesh);
    p.meshes.push(mesh);
    return mesh;
  };

  const bus = part("bus", new THREE.Vector3(0, 0, 0));
  put(bus, cyl(0.5, 0.56, 0.62, 8, M.gold), 0, 0, 0);
  put(bus, box(0.9, 0.1, 0.9, M.dark), 0, -0.32, 0);

  const arrays = part("arrays", new THREE.Vector3(0, -1, 0));
  [45, 135, 225, 315].forEach((deg) => {
    const a = (deg * Math.PI) / 180;
    const wing = put(arrays, box(1.0, 0.02, 0.34, M.panel), Math.cos(a) * 0.95, -0.16, Math.sin(a) * 0.95);
    wing.rotation.y = -a;
  });

  const dishP = part("dish", new THREE.Vector3(0, 1, 0));
  put(dishP, cyl(0.02, 0.02, 0.34, 8, M.metal), 0, 0.48, 0);
  put(dishP, dishMesh(0.32, M.white), 0, 0.66, 0);

  const thrusters = part("thrusters", new THREE.Vector3(0, -0.8, 1));
  [0, 90, 180, 270].forEach((deg) => {
    const a = (deg * Math.PI) / 180;
    put(thrusters, cyl(0.05, 0.09, 0.16, 12, M.dark), Math.cos(a) * 0.34, -0.44, Math.sin(a) * 0.34);
  });

  return { root, parts, radius: 1.9, materials: Object.values(M) };
};

const buildInstrument = (): Build => {
  const M = palette();
  const root = new THREE.Group();
  const parts: Part[] = [];
  const part = (id: string, dir: THREE.Vector3) => {
    const group = new THREE.Group();
    group.userData.partId = id;
    root.add(group);
    const p: Part = { id, group, dir: dir.clone().normalize(), localCenter: new THREE.Vector3(), meshes: [] };
    parts.push(p);
    return p;
  };
  const put = (p: Part, mesh: THREE.Mesh, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.userData.partId = p.id;
    p.group.add(mesh);
    p.meshes.push(mesh);
    return mesh;
  };

  const array = part("array", new THREE.Vector3(0, 1, 0));
  const panel = put(array, box(1.15, 0.86, 0.07, M.metal), 0, 0.5, 0, -0.28, 0, 0);

  const cubes = part("cubes", new THREE.Vector3(0, 0.3, 1));
  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      const cube = put(cubes, box(0.17, 0.17, 0.1, M.gold), x * 0.3, 0.5 + y * 0.24, 0.07, -0.28, 0, 0);
      cube.position.z += 0.05;
    }
  }
  panel.rotation.z = 0;

  const mount = part("mount", new THREE.Vector3(0, -1, 0));
  put(mount, box(0.5, 0.42, 0.5, M.dark), 0, -0.06, 0);
  put(mount, cyl(0.26, 0.3, 0.1, 16, M.metal), 0, -0.28, 0);

  const cable = part("cable", new THREE.Vector3(0.6, -0.6, 0));
  put(cable, cyl(0.02, 0.02, 1.1, 8, M.dark), 0.86, -0.18, 0, 0, 0, Math.PI / 2.2);

  return { root, parts, radius: 1.5, materials: Object.values(M) };
};

const buildPlaque = (): Build => {
  const M = palette();
  const root = new THREE.Group();
  const parts: Part[] = [];
  const part = (id: string, dir: THREE.Vector3) => {
    const group = new THREE.Group();
    group.userData.partId = id;
    root.add(group);
    const p: Part = { id, group, dir: dir.clone().normalize(), localCenter: new THREE.Vector3(), meshes: [] };
    parts.push(p);
    return p;
  };
  const put = (p: Part, mesh: THREE.Mesh, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.userData.partId = p.id;
    p.group.add(mesh);
    p.meshes.push(mesh);
    return mesh;
  };

  const plate = part("plate", new THREE.Vector3(0, 0.6, 0));
  put(plate, box(1.35, 0.95, 0.04, M.gold), 0, 0.4, 0);

  const engraving = part("engraving", new THREE.Vector3(0, 0.4, 1));
  // Abstract suggestion of the etched figures — bars and discs, not a replica.
  [-0.4, -0.1].forEach((x) => {
    put(engraving, cyl(0.055, 0.055, 0.02, 14, M.dark), x, 0.52, 0.03, Math.PI / 2, 0, 0);
    put(engraving, box(0.05, 0.34, 0.02, M.dark), x, 0.3, 0.03);
    put(engraving, box(0.1, 0.04, 0.02, M.dark), x, 0.58, 0.03);
  });
  for (let i = 0; i < 6; i += 1) {
    put(engraving, box(0.22, 0.012, 0.02, M.dark), 0.36, 0.6 - i * 0.075, 0.03);
  }
  for (let i = 0; i < 4; i += 1) {
    put(engraving, cyl(0.022, 0.022, 0.02, 10, M.dark), -0.5 + i * 0.11, 0.16, 0.03, Math.PI / 2, 0, 0);
  }

  const mount = part("mount", new THREE.Vector3(0, -0.6, 0));
  put(mount, box(0.06, 0.6, 0.06, M.metal), -0.45, -0.12, -0.06);
  put(mount, box(0.06, 0.6, 0.06, M.metal), 0.45, -0.12, -0.06);

  return { root, parts, radius: 1.5, materials: Object.values(M) };
};

const build = (model: HardwareModel): Build => {
  switch (model.kind) {
    case "rover":
      return buildRover(model.variant);
    case "helicopter":
      return buildHelicopter();
    case "telescope":
      return buildTelescope();
    case "probe":
      return buildProbe();
    case "instrument":
      return buildInstrument();
    case "plaque":
      return buildPlaque();
    case "lander":
    default:
      return buildLander(model.variant);
  }
};

/* -------------------------------------------------------------------- viewer */

const HardwareViewer = ({ model, selected, onSelect, autoRotate, xray, exploded }: HardwareViewerProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [failed, setFailed] = useState(false);

  const options = useRef({ selected, autoRotate, xray, exploded });
  const stateRef = useRef<{
    root: THREE.Group;
    parts: Part[];
    materials: THREE.MeshStandardMaterial[];
    yaw: number;
    pitch: number;
    zoom: number;
    zoomTarget: number;
    fit: number;
    velocity: number;
    spinners: THREE.Object3D[];
    dragging: boolean;
    moved: number;
    visible: boolean;
  } | null>(null);

  useEffect(() => {
    options.current = { selected, autoRotate, xray, exploded };
  }, [selected, autoRotate, xray, exploded]);

  // Selecting a part turns it toward the camera and tightens the framing on it.
  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    if (!selected) {
      state.zoomTarget = state.fit;
      return;
    }
    const part = state.parts.find((p) => p.id === selected);
    if (!part) return;
    state.yaw = Math.atan2(-part.localCenter.x, part.localCenter.z);
    state.pitch = 0.12;
    state.velocity = 0;
    state.zoomTarget = Math.max(2.4, state.fit * 0.78);
  }, [selected]);

  // Materials follow the x-ray toggle.
  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    state.materials.forEach((m) => {
      m.wireframe = xray;
      m.transparent = xray;
      m.opacity = xray ? 0.42 : 1;
      m.depthWrite = !xray;
      m.needsUpdate = true;
    });
  }, [xray]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return;
    }

    const built = build(model);
    built.materials.forEach((m) => {
      m.wireframe = xray;
      m.transparent = xray;
      m.opacity = xray ? 0.42 : 1;
      m.depthWrite = !xray;
    });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.5, 4.6);
    camera.lookAt(0, 0.25, 0);

    /* A small painted environment, run through PMREM, so metal reflects a sky
       and a rim light instead of shading as flat grey. */
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 512;
    envCanvas.height = 256;
    const ectx = envCanvas.getContext("2d");
    if (ectx) {
      const sky = ectx.createLinearGradient(0, 0, 0, 256);
      sky.addColorStop(0, "#39466b");
      sky.addColorStop(0.42, "#121826");
      sky.addColorStop(1, "#05070b");
      ectx.fillStyle = sky;
      ectx.fillRect(0, 0, 512, 256);
      const blobs: [number, number, number, string][] = [
        [150, 54, 118, "rgba(255,241,214,0.98)"],
        [372, 96, 150, "rgba(150,192,255,0.6)"],
        [286, 24, 84, "rgba(255,201,146,0.45)"],
      ];
      blobs.forEach(([x, y, r, col]) => {
        const glow = ectx.createRadialGradient(x, y, 0, x, y, r);
        glow.addColorStop(0, col);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ectx.fillStyle = glow;
        ectx.fillRect(0, 0, 512, 256);
      });
    }
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    envTex.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromEquirectangular(envTex).texture;
    scene.environment = envMap;
    envTex.dispose();
    pmrem.dispose();

    const root = built.root;
    // Centre the object on its own bounding box so orbiting turns around it
    // rather than around an arbitrary origin, and frame it from its size.
    const bounds = new THREE.Box3().setFromObject(root);
    const size = bounds.getSize(new THREE.Vector3());
    root.position.sub(bounds.getCenter(new THREE.Vector3()));
    root.rotation.y = -0.6;
    scene.add(root);

    const fit =
      (Math.max(size.x, size.y) / (2 * Math.tan((camera.fov * Math.PI) / 360))) * 1.9;

    scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x1a1f2b, 1.15));
    const key = new THREE.DirectionalLight(0xfff4e2, 2.4);
    key.position.set(3.4, 4.2, 3.6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8fb6ff, 1.25);
    rim.position.set(-3.6, 1.2, -2.8);
    scene.add(rim);
    const warm = new THREE.PointLight(0xffc98a, 22, 12);
    warm.position.set(-1.6, -1.4, 2.4);
    scene.add(warm);

    // Soft contact shadow, painted from a radial gradient so it has no edge.
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext("2d");
    if (sctx) {
      const grad = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(0,0,0,0.62)");
      grad.addColorStop(0.5, "rgba(0,0,0,0.24)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const footprint = Math.max(size.x, size.z) * 2.6;
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(footprint, footprint),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = new THREE.Box3().setFromObject(root).min.y - 0.01;
    scene.add(shadow);

    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(420 * 3);
    for (let i = 0; i < 420; i += 1) {
      const r = 8 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.cos(phi);
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xcfe0ff, size: 0.05, transparent: true, opacity: 0.7 }));
    scene.add(stars);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.className = "viewer__canvas";
    wrap.appendChild(renderer.domElement);

    // Part centres in group space, for label placement.
    const box3 = new THREE.Box3();
    built.parts.forEach((p) => {
      box3.setFromObject(p.group);
      p.localCenter.copy(p.group.worldToLocal(box3.getCenter(new THREE.Vector3())));
    });

    const state = {
      root,
      parts: built.parts,
      materials: built.materials,
      spinners: built.spinners ?? [],
      yaw: -0.6,
      pitch: 0.1,
      zoom: fit,
      zoomTarget: fit,
      fit,
      velocity: 0,
      dragging: false,
      moved: 0,
      visible: true,
    };
    stateRef.current = state;

    let lastX = 0;
    let lastY = 0;
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const onDown = (e: PointerEvent) => {
      state.dragging = true;
      state.moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      renderer.domElement.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!state.dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      state.moved += Math.abs(dx) + Math.abs(dy);
      lastX = e.clientX;
      lastY = e.clientY;
      state.yaw += dx * 0.0075;
      state.velocity = dx * 0.006;
      state.pitch = Math.max(-0.7, Math.min(0.85, state.pitch + dy * 0.005));
    };
    const onUp = () => {
      state.dragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      state.zoomTarget = Math.max(2.6, Math.min(8, state.zoomTarget + e.deltaY * 0.004));
    };
    const onClick = (e: PointerEvent) => {
      if (state.moved > 8) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(root, true);
      const hit = hits.find((h) => h.object.userData.partId);
      onSelect(hit ? (hit.object.userData.partId as string) : null);
    };

    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointercancel", onUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    renderer.domElement.addEventListener("click", onClick);

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver(
      (entries) => {
        state.visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    io.observe(wrap);

    let frame = 0;
    let clock = 0;
    const tmp = new THREE.Vector3();
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!state.visible || document.hidden) return;
      clock += 1;

      const opts = options.current;
      if (opts.autoRotate && !state.dragging && !reduce) state.yaw += 0.0042;

      // Momentum after a flick, so releasing a drag has some weight to it.
      if (!state.dragging && Math.abs(state.velocity) > 0.0002) {
        state.yaw += state.velocity;
        state.velocity *= 0.93;
      } else if (!state.dragging) {
        state.velocity = 0;
      }

      if (!reduce) {
        state.spinners.forEach((o) => {
          o.rotation.y += 0.24 * (o.userData.spin ?? 1);
        });
      }

      root.rotation.y += (state.yaw - root.rotation.y) * 0.12;
      root.rotation.x += (state.pitch - root.rotation.x) * 0.12;

      state.zoom += (state.zoomTarget - state.zoom) * 0.12;
      camera.position.z = state.zoom;
      camera.position.y = size.y * 0.22 + 0.35;
      camera.lookAt(0, 0, 0);

      built.parts.forEach((p) => {
        const spread = opts.exploded ? 0.42 : 0;
        p.group.position.lerp(tmp.copy(p.dir).multiplyScalar(spread), 0.11);
        const target = p.id === opts.selected ? 1.05 : 1;
        p.group.scale.lerp(tmp.setScalar(target), 0.16);
      });

      stars.rotation.y += 0.0004;
      renderer.render(scene, camera);

      // Label placement runs every other frame; it is layout-heavy.
      if (clock % 2 === 0) {
        const w = wrap.clientWidth;
        const h = wrap.clientHeight;
        built.parts.forEach((p) => {
          const el = labelRefs.current[p.id];
          if (!el) return;
          const world = p.group.localToWorld(tmp.copy(p.localCenter));
          const projected = world.clone().project(camera);
          const x = (projected.x * 0.5 + 0.5) * w;
          const y = (-projected.y * 0.5 + 0.5) * h;
          el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
          el.style.opacity = projected.z < 1 ? "1" : "0";
        });
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointercancel", onUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.domElement.removeEventListener("click", onClick);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          const m = obj.material;
          if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
          else m.dispose();
        }
      });
      built.materials.forEach((m) => {
        (["map", "bumpMap", "roughnessMap", "metalnessMap"] as const).forEach((slot) => m[slot]?.dispose());
      });
      envMap.dispose();
      starGeo.dispose();
      shadowTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === wrap) wrap.removeChild(renderer.domElement);
      stateRef.current = null;
    };
    // Rebuild only when the object itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.id]);

  if (failed) {
    return (
      <div className="viewer__fallback">
        <p>
          This device could not start WebGL, so the model cannot be drawn. The written record for
          every part is still listed beside it.
        </p>
      </div>
    );
  }

  return (
    <div
      className="viewer__stage"
      ref={wrapRef}
      tabIndex={0}
      role="group"
      aria-label={`${model.title} in three dimensions. Drag to orbit, scroll to zoom, arrow keys to rotate, and select a part to read it.`}
      onKeyDown={(e) => {
        const state = stateRef.current;
        if (!state) return;
        switch (e.key) {
          case "ArrowLeft":
            state.yaw -= 0.16;
            break;
          case "ArrowRight":
            state.yaw += 0.16;
            break;
          case "ArrowUp":
            state.pitch = Math.min(0.85, state.pitch + 0.12);
            break;
          case "ArrowDown":
            state.pitch = Math.max(-0.7, state.pitch - 0.12);
            break;
          case "+":
          case "=":
            state.zoomTarget = Math.max(2.4, state.zoomTarget - 0.4);
            break;
          case "-":
            state.zoomTarget = Math.min(8, state.zoomTarget + 0.4);
            break;
          case "Escape":
            onSelect(null);
            break;
          default:
            return;
        }
        e.preventDefault();
      }}
    >
      <div className="viewer__labels">
        {model.parts.map((p: ModelPart) => (
          <button
            key={p.id}
            type="button"
            ref={(el) => {
              labelRefs.current[p.id] = el;
            }}
            className={`hotspot${selected === p.id ? " is-on" : ""}`}
            onClick={() => onSelect(selected === p.id ? null : p.id)}
            aria-label={`${p.label} — ${p.note}`}
            title={p.label}
          >
            <span className="hotspot__dot" aria-hidden="true" />
            <span className="hotspot__text">{p.label}</span>
          </button>
        ))}
      </div>
      <p className="viewer__hint">
        Drag to orbit · scroll to zoom · click a part
      </p>
    </div>
  );
};

export default HardwareViewer;
