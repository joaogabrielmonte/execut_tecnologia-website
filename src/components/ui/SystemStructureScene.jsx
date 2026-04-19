import { useEffect, useRef } from "react";
import * as THREE from "three";

const RED = 0xdc2626;
const RED_HOT = 0xff3333;
const WHITE = 0xffffff;

function SystemStructureScene({ progress = 0 }) {
  const hostRef = useRef(null);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-3.6, 3.6, 2.8, -2.8, 0.1, 100);
    camera.position.set(5.2, 3.6, 5.7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    host.appendChild(renderer.domElement);

    const architecture = new THREE.Group();
    architecture.rotation.set(-0.04, -0.22, 0.02);
    architecture.scale.setScalar(1.24);
    scene.add(architecture);

    architecture.add(createFloorGrid());
    architecture.add(createCore());
    createPlatforms().forEach((platform) => architecture.add(platform));
    architecture.add(createStructuralFrames());
    createModules().forEach((module) => architecture.add(module));
    createConnections().forEach((connection) => architecture.add(connection));
    architecture.add(createSignalNodes());
    const dataParticles = createDataParticles();
    const scanPlane = createScanPlane();
    architecture.add(dataParticles, scanPlane);

    const ambient = createAmbientLines();
    scene.add(ambient);

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      const safeWidth = Math.max(1, width);
      const safeHeight = Math.max(1, height);
      const aspect = safeWidth / safeHeight;
      const vertical = safeWidth < 520 ? 3.52 : 2.52;
      const horizontal = vertical * aspect;

      architecture.scale.setScalar(safeWidth < 520 ? 0.94 : 1.28);
      camera.left = -horizontal;
      camera.right = horizontal;
      camera.top = vertical;
      camera.bottom = -vertical;
      camera.updateProjectionMatrix();
      renderer.setSize(safeWidth, safeHeight, false);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    const clock = new THREE.Clock();
    let raf = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const scroll = progressRef.current;
      const easedScroll = THREE.MathUtils.smoothstep(scroll, 0, 1);

      architecture.rotation.y = -0.22 + Math.sin(elapsed * 0.26) * 0.045 + easedScroll * 0.42;
      architecture.rotation.x = -0.04 + easedScroll * 0.11;
      architecture.rotation.z = 0.02 - easedScroll * 0.04;
      architecture.position.y = Math.sin(elapsed * 0.58) * 0.035 + easedScroll * 0.18;

      ambient.rotation.y -= 0.0012 + easedScroll * 0.0012;
      ambient.position.y = -0.1 + easedScroll * 0.18;
      ambient.scale.setScalar(1 + easedScroll * 0.08);

      dataParticles.rotation.y = Math.sin(elapsed * 0.22) * 0.035 + easedScroll * 0.22;
      dataParticles.position.y = easedScroll * 0.06;
      dataParticles.material.opacity = 0.48 + easedScroll * 0.28;

      scanPlane.position.y = -0.96 + ((elapsed * 0.26 + easedScroll * 1.1) % 1.72);
      scanPlane.material.opacity = 0.06 + Math.sin(elapsed * 1.7) * 0.025 + easedScroll * 0.06;

      architecture.traverse((child) => {
        if (child.userData.pulse && child.material) {
          child.material.opacity =
            child.userData.base +
            Math.sin(elapsed * child.userData.speed + child.userData.offset) * child.userData.range +
            easedScroll * child.userData.scrollBoost;
        }

        if (child.userData.float) {
          child.position.y = child.userData.baseY + Math.sin(elapsed * child.userData.floatSpeed + child.userData.floatOffset) * child.userData.floatRange + easedScroll * child.userData.scrollLift;
        }
      });

      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      renderer.dispose();
      disposeObject(scene);

      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="structure-scene" ref={hostRef} aria-hidden="true" />;
}

function createCore() {
  const group = new THREE.Group();
  group.add(createBox({ size: [1.92, 1.32, 1.78], position: [0, 0.38, 0], color: RED_HOT, fillOpacity: 0.15, edgeOpacity: 0.96 }));
  group.add(createBox({ size: [1.2, 0.88, 1.1], position: [0, 0.38, 0], color: WHITE, fillOpacity: 0.04, edgeOpacity: 0.38 }));

  const ringGeometry = new THREE.RingGeometry(0.92, 0.94, 96);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: RED,
    transparent: true,
    opacity: 0.34,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const horizontalRing = new THREE.Mesh(ringGeometry, ringMaterial);
  horizontalRing.rotation.x = Math.PI / 2;
  horizontalRing.position.y = 0.39;
  horizontalRing.userData = { pulse: true, base: 0.28, range: 0.12, speed: 1.2, offset: 0.2, scrollBoost: 0.14 };
  group.add(horizontalRing);

  const verticalRing = horizontalRing.clone();
  verticalRing.rotation.set(0, Math.PI / 2, 0);
  verticalRing.userData = { pulse: true, base: 0.22, range: 0.1, speed: 1.4, offset: 1.2, scrollBoost: 0.12 };
  group.add(verticalRing);

  return group;
}

function createPlatforms() {
  return [
    createPlatform(5.15, 3.08, -0.9, 0.28),
    createPlatform(4.08, 2.38, -0.18, 0.36),
    createPlatform(2.92, 1.62, 0.78, 0.48),
  ];
}

function createModules() {
  const modules = [
    { size: [1.05, 0.58, 0.74], position: [-2.12, -0.16, 0.62], color: RED },
    { size: [1.0, 0.56, 0.72], position: [2.06, 0.0, -0.56], color: RED_HOT },
    { size: [0.92, 0.5, 0.68], position: [-1.42, 0.9, -0.98], color: WHITE },
    { size: [0.88, 0.5, 0.68], position: [1.5, 0.94, 0.86], color: RED },
    { size: [0.78, 0.44, 0.62], position: [0.0, 1.48, -1.34], color: RED_HOT },
  ];

  return modules.map((module, index) => {
    const box = createBox({
      ...module,
      fillOpacity: module.color === WHITE ? 0.035 : 0.08,
      edgeOpacity: module.color === WHITE ? 0.36 : 0.78,
    });

    box.userData.float = true;
    box.userData.baseY = box.position.y + Math.sin(index) * 0.02;
    box.userData.floatRange = 0.025 + index * 0.003;
    box.userData.floatSpeed = 0.72 + index * 0.08;
    box.userData.floatOffset = index * 0.85;
    box.userData.scrollLift = index % 2 === 0 ? 0.12 : 0.08;
    box.position.y = box.userData.baseY;
    return box;
  });
}

function createStructuralFrames() {
  const group = new THREE.Group();
  const frameMaterial = new THREE.LineBasicMaterial({
    color: RED,
    transparent: true,
    opacity: 0.42,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const accentMaterial = new THREE.LineBasicMaterial({
    color: WHITE,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const levels = [-0.9, -0.18, 0.78, 1.44];
  const corners = [
    [-2.52, -1.5],
    [2.52, -1.5],
    [2.52, 1.5],
    [-2.52, 1.5],
  ];
  const verticals = [];
  const diagonals = [];

  corners.forEach(([x, z], index) => {
    verticals.push(new THREE.Vector3(x, levels[0], z), new THREE.Vector3(x, levels[3], z));

    const next = corners[(index + 1) % corners.length];
    levels.slice(0, -1).forEach((level, levelIndex) => {
      const nextLevel = levels[levelIndex + 1];
      diagonals.push(
        new THREE.Vector3(x, level, z),
        new THREE.Vector3(next[0], nextLevel, next[1]),
      );
    });
  });

  group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(verticals), frameMaterial));
  group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(diagonals), accentMaterial));
  return group;
}

function createConnections() {
  const endpoints = [
    [-2.12, -0.16, 0.62],
    [2.06, 0.0, -0.56],
    [-1.42, 0.9, -0.98],
    [1.5, 0.94, 0.86],
    [0.0, 1.48, -1.34],
    [-2.0, -0.88, -0.95],
    [2.0, -0.88, 0.98],
  ];

  return endpoints.map((endpoint, index) => {
    const start = new THREE.Vector3(0, 0.38, 0);
    const end = new THREE.Vector3(...endpoint);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += index % 2 === 0 ? 0.36 : -0.08;

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(44));
    const material = new THREE.LineBasicMaterial({
      color: index % 3 === 0 ? RED_HOT : RED,
      transparent: true,
      opacity: 0.44,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const line = new THREE.Line(geometry, material);
    line.userData = { pulse: true, base: 0.34, range: 0.2, speed: 1.1 + index * 0.1, offset: index * 0.55, scrollBoost: 0.12 };

    return line;
  });
}

function createSignalNodes() {
  const group = new THREE.Group();
  const geometry = new THREE.SphereGeometry(0.045, 14, 14);
  const positions = [
    [0, 0.38, 0],
    [-2.12, -0.16, 0.62],
    [2.06, 0.0, -0.56],
    [-1.42, 0.9, -0.98],
    [1.5, 0.94, 0.86],
    [0.0, 1.48, -1.34],
    [-2.0, -0.88, -0.95],
    [2.0, -0.88, 0.98],
  ];

  positions.forEach((position, index) => {
    const node = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        color: index === 0 ? WHITE : RED_HOT,
        transparent: true,
        opacity: index === 0 ? 0.72 : 0.58,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    node.position.set(...position);
    node.userData = { pulse: true, base: index === 0 ? 0.58 : 0.42, range: 0.22, speed: 1.7 + index * 0.08, offset: index * 0.4, scrollBoost: 0.12 };
    group.add(node);
  });

  return group;
}

function createFloorGrid() {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({
    color: RED,
    transparent: true,
    opacity: 0.42,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const points = [];

  for (let x = -2.9; x <= 2.9; x += 0.38) {
    points.push(new THREE.Vector3(x, -1.12, -1.72), new THREE.Vector3(x, -1.12, 1.72));
  }

  for (let z = -1.72; z <= 1.72; z += 0.38) {
    points.push(new THREE.Vector3(-2.9, -1.12, z), new THREE.Vector3(2.9, -1.12, z));
  }

  group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), material));
  return group;
}

function createScanPlane() {
  const scan = new THREE.Mesh(
    new THREE.PlaneGeometry(5.3, 3.1),
    new THREE.MeshBasicMaterial({
      color: RED_HOT,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  scan.rotation.x = -Math.PI / 2;
  scan.position.y = -0.96;
  return scan;
}

function createPlatform(width, depth, y, opacity) {
  const group = new THREE.Group();
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshBasicMaterial({
      color: RED,
      transparent: true,
      opacity: opacity * 0.1,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = y;
  group.add(plane);

  const points = [
    new THREE.Vector3(-width / 2, y + 0.012, -depth / 2),
    new THREE.Vector3(width / 2, y + 0.012, -depth / 2),
    new THREE.Vector3(width / 2, y + 0.012, depth / 2),
    new THREE.Vector3(-width / 2, y + 0.012, depth / 2),
    new THREE.Vector3(-width / 2, y + 0.012, -depth / 2),
  ];
  const edge = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({
      color: RED,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  edge.userData = { pulse: true, base: opacity * 0.66, range: 0.12, speed: 1.05, offset: y * 2, scrollBoost: 0.1 };
  group.add(edge);

  return group;
}

function createBox({ size, position, color, fillOpacity, edgeOpacity }) {
  const group = new THREE.Group();
  const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
  const fill = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: fillOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: edgeOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );

  edges.userData = { pulse: true, base: edgeOpacity * 0.72, range: 0.16, speed: 1.3, offset: position[0] + position[2], scrollBoost: 0.12 };
  group.add(fill, edges);
  group.position.set(position[0], position[1], position[2]);

  return group;
}

function createDataParticles() {
  const positions = [];

  for (let i = 0; i < 760; i += 1) {
    const lane = i % 9;
    const x = -2.8 + ((i * 0.131) % 5.6);
    const y = -0.98 + lane * 0.27 + Math.sin(i * 1.7) * 0.018;
    const z = -1.48 + ((i * 0.219) % 2.96);
    positions.push(x, y, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: RED_HOT,
      size: 0.026,
      transparent: true,
      opacity: 0.68,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
}

function createAmbientLines() {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({
    color: 0x8f151a,
    transparent: true,
    opacity: 0.26,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  for (let i = 0; i < 12; i += 1) {
    const points = [];
    const radius = 2.2 + i * 0.11;

    for (let t = 0; t <= Math.PI * 2; t += Math.PI / 80) {
      points.push(new THREE.Vector3(Math.cos(t) * radius, Math.sin(i) * 0.08, Math.sin(t) * radius * 0.36));
    }

    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material.clone());
    line.rotation.x = 0.62 + i * 0.025;
    line.rotation.z = i * 0.14;
    group.add(line);
  }

  return group;
}

function disposeObject(object) {
  object.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }

    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
}

export default SystemStructureScene;
