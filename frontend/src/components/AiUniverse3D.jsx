import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * AiUniverse3D: Fully Scroll-Driven "TechAstra" 3D Celestial Universe
 * 
 * Scroll-Choreographed Architecture:
 * - The entire 3D scene responds and transforms continuously as you scroll the page
 * - Waypoint 0 (Hero): Master frontal view of the TechAstra World Globe & 5 Tech Pillars
 * - Waypoint 1 (AI Tracks): Swoop into the 5 Tech Pillars (AI, CV, ML, NLP, RAG) with glowing highways
 * - Waypoint 2 (Roadmap): High-angle tactical orbital view looking down at the world network
 * - Waypoint 3 (Announcement/Gallery): Sweeping 180° rotation revealing the global nodes & golden Astra orbit ring
 * - Waypoint 4 (Passes/FAQ/Footer): Grand wide-angle cosmic pull-back framing the horizon
 * 
 * Performance:
 * - Ultra-low CPU/GPU (< 5-8% usage)
 * - 30 FPS throttle
 * - Opaque canvas (alpha: false, background: #f8fafc) for direct hardware scanout
 * - Capped DPR = 1.0
 * - Disposes memory cleanly on unmount
 */

// 5 Core Tech Pillars of TechAstra
const TECH_PILLARS = [
  {
    id: 'ai',
    name: 'AI CORE',
    sub: 'Artificial Intelligence',
    pos: [0, 4.6, 0.5],
    color: '#0284c7', // Electric Cyan
    geo: 'icosahedron',
    radius: 1.1,
    nodes: 50
  },
  {
    id: 'cv',
    name: 'CV ENGINE',
    sub: 'Computer Vision',
    pos: [-8.4, 1.6, 1.8],
    color: '#0ea5e9', // Sky Blue
    geo: 'octahedron',
    radius: 0.85,
    nodes: 40
  },
  {
    id: 'rag',
    name: 'RAG MEMORY',
    sub: 'Vector Retrieval',
    pos: [8.4, 1.8, -1.6],
    color: '#2563eb', // Cobalt Blue
    geo: 'octahedron',
    radius: 0.85,
    nodes: 40
  },
  {
    id: 'nlp',
    name: 'NLP SYNAPSE',
    sub: 'Natural Language',
    pos: [6.4, -3.8, 1.8],
    color: '#8b5cf6', // Synaptic Violet
    geo: 'tetrahedron',
    radius: 0.75,
    nodes: 35
  },
  {
    id: 'ml',
    name: 'ML WEIGHTS',
    sub: 'Machine Learning',
    pos: [-6.4, -3.8, -1.4],
    color: '#6366f1', // Indigo Neural
    geo: 'tetrahedron',
    radius: 0.75,
    nodes: 35
  }
];

// Peripheral Widescreen Wings (Ensures full laptop edge-to-edge constellation)
const WIDESCREEN_EDGES = [
  { id: 'edge_west', pos: [-15.2, -0.6, -2.0], color: '#38bdf8', nodes: 35 },
  { id: 'edge_east', pos: [15.2, -0.4, -2.0], color: '#818cf8', nodes: 35 },
  { id: 'horizon_nw', pos: [-8.8, 5.5, -1.8], color: '#0284c7', nodes: 25 },
  { id: 'horizon_ne', pos: [8.8, 5.6, -1.8], color: '#7c3aed', nodes: 25 }
];

export default function AiUniverse3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // Disposables registry
    const disposables = [];
    const register = (item) => {
      if (item && typeof item.dispose === 'function') {
        disposables.push(item);
      }
      return item;
    };

    // --- 1. Scene & Opaque Canvas ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.010);

    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const initialCamZ = isMobile ? 18.5 : 14.2;
    camera.position.set(0, 0, initialCamZ);

    // --- 2. Low-Overhead Renderer ---
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
      precision: 'mediump',
      stencil: false,
      depth: true
    });
    register(renderer);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1.0);
    container.appendChild(renderer.domElement);

    // --- 3. Master Groups ---
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const globeGroup = new THREE.Group();
    rootGroup.add(globeGroup);

    const astraRingsGroup = new THREE.Group();
    rootGroup.add(astraRingsGroup);

    const techConstellationGroup = new THREE.Group();
    rootGroup.add(techConstellationGroup);

    // --- 4. Central World / Globe ---
    const GLOBE_RADIUS = 3.6;

    const meridianMat = register(new THREE.LineBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.22
    }));

    // Longitude circular meridians
    const meridianCount = 6;
    for (let m = 0; m < meridianCount; m++) {
      const circlePts = [];
      const segs = 48;
      for (let s = 0; s <= segs; s++) {
        const theta = (s / segs) * Math.PI * 2;
        circlePts.push(new THREE.Vector3(
          Math.cos(theta) * GLOBE_RADIUS,
          Math.sin(theta) * GLOBE_RADIUS,
          0
        ));
      }
      const mGeo = register(new THREE.BufferGeometry().setFromPoints(circlePts));
      const mLine = new THREE.Line(mGeo, meridianMat);
      mLine.rotation.y = (m / meridianCount) * Math.PI;
      globeGroup.add(mLine);
    }

    // Latitude horizontal rings
    const latLevels = [-2.4, -1.2, 0, 1.2, 2.4];
    latLevels.forEach((y) => {
      const r = Math.sqrt(Math.max(0.1, GLOBE_RADIUS * GLOBE_RADIUS - y * y));
      const circlePts = [];
      const segs = 48;
      for (let s = 0; s <= segs; s++) {
        const theta = (s / segs) * Math.PI * 2;
        circlePts.push(new THREE.Vector3(
          Math.cos(theta) * r,
          y,
          Math.sin(theta) * r
        ));
      }
      const latGeo = register(new THREE.BufferGeometry().setFromPoints(circlePts));
      const latLine = new THREE.Line(latGeo, meridianMat);
      globeGroup.add(latLine);
    });

    // Fibonacci Sphere Global Dot-Matrix
    const globePointsCount = 260;
    const globePositions = [];
    const globeColors = [];
    const cyanCol = new THREE.Color(0x0284c7);
    const blueCol = new THREE.Color(0x2563eb);
    const purpleCol = new THREE.Color(0x8b5cf6);

    const phiGolden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < globePointsCount; i++) {
      const y = 1 - (i / (globePointsCount - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phiGolden * i;

      const x = Math.cos(theta) * radiusAtY * GLOBE_RADIUS;
      const z = Math.sin(theta) * radiusAtY * GLOBE_RADIUS;
      const posY = y * GLOBE_RADIUS;

      globePositions.push(x, posY, z);
      const col = (i % 3 === 0) ? cyanCol : (i % 3 === 1 ? blueCol : purpleCol);
      globeColors.push(col.r, col.g, col.b);
    }

    const globePtsGeo = register(new THREE.BufferGeometry());
    globePtsGeo.setAttribute('position', new THREE.Float32BufferAttribute(globePositions, 3));
    globePtsGeo.setAttribute('color', new THREE.Float32BufferAttribute(globeColors, 3));

    const globePtsMat = register(new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    }));
    const globePoints = new THREE.Points(globePtsGeo, globePtsMat);
    globeGroup.add(globePoints);

    // --- 5. "Astra" Celestial Orbital Rings ---
    // Celestial Orbital Ring 1: Primary Diagonal Astra Ring (Golden from logo emblem)
    const ring1Pts = [];
    const RING1_RADIUS = 5.8;
    for (let s = 0; s <= 64; s++) {
      const theta = (s / 64) * Math.PI * 2;
      ring1Pts.push(new THREE.Vector3(
        Math.cos(theta) * RING1_RADIUS,
        0,
        Math.sin(theta) * (RING1_RADIUS * 0.92)
      ));
    }
    const ring1Geo = register(new THREE.BufferGeometry().setFromPoints(ring1Pts));
    const ring1Mat = register(new THREE.LineBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.45
    }));
    const astraRing1 = new THREE.Line(ring1Geo, ring1Mat);
    astraRing1.rotation.x = 0.58;
    astraRing1.rotation.z = -0.32;
    astraRingsGroup.add(astraRing1);

    // Celestial Orbital Ring 2: Secondary Counter-Orbit Ring
    const ring2Pts = [];
    const RING2_RADIUS = 6.6;
    for (let s = 0; s <= 64; s++) {
      const theta = (s / 64) * Math.PI * 2;
      ring2Pts.push(new THREE.Vector3(
        Math.cos(theta) * RING2_RADIUS,
        0,
        Math.sin(theta) * (RING2_RADIUS * 0.94)
      ));
    }
    const ring2Geo = register(new THREE.BufferGeometry().setFromPoints(ring2Pts));
    const ring2Mat = register(new THREE.LineBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.35
    }));
    const astraRing2 = new THREE.Line(ring2Geo, ring2Mat);
    astraRing2.rotation.x = -0.45;
    astraRing2.rotation.z = 0.40;
    astraRingsGroup.add(astraRing2);

    // --- 6. The 5 Core Tech Pillars (AI, CV, ML, NLP, RAG) ---
    const pillarMeshes = [];
    const techNodePositions = [];
    const techNodeColors = [];

    const icosaGeo = register(new THREE.IcosahedronGeometry(1.0, 1));
    const octaGeo = register(new THREE.OctahedronGeometry(0.8, 0));
    const tetraGeo = register(new THREE.TetrahedronGeometry(0.75, 0));
    const haloRingGeo = register(new THREE.RingGeometry(0.9, 1.05, 20));

    TECH_PILLARS.forEach((pillar) => {
      const center = new THREE.Vector3(...pillar.pos);
      const color = new THREE.Color(pillar.color);

      const pillarGroup = new THREE.Group();
      pillarGroup.position.copy(center);

      let coreGeo = octaGeo;
      if (pillar.geo === 'icosahedron') coreGeo = icosaGeo;
      else if (pillar.geo === 'tetrahedron') coreGeo = tetraGeo;

      const coreMat = register(new THREE.MeshBasicMaterial({
        color: pillar.color,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      }));
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.scale.setScalar(pillar.radius);
      pillarGroup.add(coreMesh);

      const haloMat = register(new THREE.MeshBasicMaterial({
        color: pillar.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45
      }));
      const haloMesh = new THREE.Mesh(haloRingGeo, haloMat);
      haloMesh.scale.setScalar(pillar.radius * 1.15);
      pillarGroup.add(haloMesh);

      techConstellationGroup.add(pillarGroup);
      pillarMeshes.push({ coreMesh, haloMesh, center, color });

      for (let i = 0; i < pillar.nodes; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * 2.2;

        const sinPhi = Math.sin(phi);
        const x = center.x + r * sinPhi * Math.cos(theta);
        const y = center.y + r * sinPhi * Math.sin(theta);
        const z = center.z + r * Math.cos(phi);

        techNodePositions.push(x, y, z);
        techNodeColors.push(color.r, color.g, color.b);
      }

      // Connecting Ray to Globe Center
      const beamPts = [center, new THREE.Vector3(center.x * 0.4, center.y * 0.4, center.z * 0.4)];
      const beamGeo = register(new THREE.BufferGeometry().setFromPoints(beamPts));
      const beamMat = register(new THREE.LineBasicMaterial({
        color: pillar.color,
        transparent: true,
        opacity: 0.35
      }));
      const beam = new THREE.Line(beamGeo, beamMat);
      techConstellationGroup.add(beam);
    });

    // --- 7. Widescreen Peripheral Wings ---
    WIDESCREEN_EDGES.forEach((edge) => {
      const center = new THREE.Vector3(...edge.pos);
      const color = new THREE.Color(edge.color);

      for (let i = 0; i < edge.nodes; i++) {
        const r = Math.random() * 2.0;
        const theta = Math.random() * Math.PI * 2;
        const x = center.x + Math.cos(theta) * r;
        const y = center.y + (Math.random() - 0.5) * 2.0;
        const z = center.z + Math.sin(theta) * r;

        techNodePositions.push(x, y, z);
        techNodeColors.push(color.r, color.g, color.b);
      }
    });

    const techPtsGeo = register(new THREE.BufferGeometry());
    techPtsGeo.setAttribute('position', new THREE.Float32BufferAttribute(techNodePositions, 3));
    techPtsGeo.setAttribute('color', new THREE.Float32BufferAttribute(techNodeColors, 3));

    const techPtsMat = register(new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    }));
    const techPoints = new THREE.Points(techPtsGeo, techPtsMat);
    techConstellationGroup.add(techPoints);

    // --- 8. Synaptic Axon Highways Between AI, CV, ML, NLP, RAG ---
    const highwayPairs = [
      { from: 'cv', to: 'ai', color: 0x0ea5e9 },
      { from: 'ai', to: 'rag', color: 0x2563eb },
      { from: 'rag', to: 'nlp', color: 0x8b5cf6 },
      { from: 'nlp', to: 'ml', color: 0x6366f1 },
      { from: 'ml', to: 'cv', color: 0x0284c7 },
      { from: 'cv', to: 'rag', color: 0x0ea5e9 },
      { from: 'ml', to: 'ai', color: 0x6366f1 },
      { from: 'nlp', to: 'ai', color: 0x8b5cf6 },
      { from: 'cv', to: 'edge_west', color: 0x38bdf8 },
      { from: 'rag', to: 'edge_east', color: 0x818cf8 }
    ];

    const allPositionsMap = {
      ai: new THREE.Vector3(...TECH_PILLARS[0].pos),
      cv: new THREE.Vector3(...TECH_PILLARS[1].pos),
      rag: new THREE.Vector3(...TECH_PILLARS[2].pos),
      nlp: new THREE.Vector3(...TECH_PILLARS[3].pos),
      ml: new THREE.Vector3(...TECH_PILLARS[4].pos),
      edge_west: new THREE.Vector3(...WIDESCREEN_EDGES[0].pos),
      edge_east: new THREE.Vector3(...WIDESCREEN_EDGES[1].pos)
    };

    highwayPairs.forEach(({ from, to, color }) => {
      const pA = allPositionsMap[from];
      const pB = allPositionsMap[to];
      if (!pA || !pB) return;

      const mid = pA.clone().add(pB).multiplyScalar(0.5);
      mid.z += 1.6;

      const curve = new THREE.QuadraticBezierCurve3(pA, mid, pB);
      const pts = curve.getPoints(24);
      const lineGeo = register(new THREE.BufferGeometry().setFromPoints(pts));
      const lineMat = register(new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.38
      }));
      const line = new THREE.Line(lineGeo, lineMat);
      techConstellationGroup.add(line);
    });

    // --- 9. Cinematic Scroll Waypoints Choreography ---
    // Defines exact 3D camera & planetary orientation across the entire page journey
    const BASE_Z = isMobile ? 18.5 : 14.2;

    const SCROLL_WAYPOINTS = [
      // 0. Hero (Top): Frontal Master View of Globe & 5 Pillars
      {
        p: 0.00,
        camX: 0.0,
        camY: 0.0,
        camZ: BASE_Z,
        rotY: 0.0,
        rotX: 0.0,
        globeRotY: 0.0,
        ringsTilt: 0.0
      },
      // 1. AI Challenge Tracks: Swoop into the 5 Pillars (CV, ML, AI, RAG, NLP)
      {
        p: 0.22,
        camX: isMobile ? -1.0 : -3.2,
        camY: 1.6,
        camZ: BASE_Z - 2.4,
        rotY: 0.85,
        rotX: 0.16,
        globeRotY: 0.8,
        ringsTilt: 0.25
      },
      // 2. 48-Hour Innovation Roadmap: Tactical High-Angle Planetary Network
      {
        p: 0.44,
        camX: isMobile ? 1.0 : 2.5,
        camY: 4.0,
        camZ: BASE_Z - 1.8,
        rotY: 1.85,
        rotX: -0.32,
        globeRotY: 1.6,
        ringsTilt: -0.2
      },
      // 3. National Announcement & Memories: Sweeping 180° Orbital View
      {
        p: 0.70,
        camX: isMobile ? -1.0 : 3.8,
        camY: -1.4,
        camZ: BASE_Z - 0.8,
        rotY: 3.14,
        rotX: 0.14,
        globeRotY: 2.8,
        ringsTilt: 0.4
      },
      // 4. Passes & FAQ / Footer: Wide Horizon Cosmic Pullback
      {
        p: 1.00,
        camX: 0.0,
        camY: -2.0,
        camZ: BASE_Z + 1.6,
        rotY: 4.4,
        rotX: -0.10,
        globeRotY: 4.2,
        ringsTilt: 0.0
      }
    ];

    // Smoothstep interpolation between waypoints
    const getChoreographyAt = (progress) => {
      const p = Math.max(0, Math.min(1, progress));
      for (let i = 0; i < SCROLL_WAYPOINTS.length - 1; i++) {
        const w1 = SCROLL_WAYPOINTS[i];
        const w2 = SCROLL_WAYPOINTS[i + 1];
        if (p >= w1.p && p <= w2.p) {
          const t = (p - w1.p) / (w2.p - w1.p);
          const ease = t * t * (3 - 2 * t); // Smoothstep easing
          return {
            camX: w1.camX + (w2.camX - w1.camX) * ease,
            camY: w1.camY + (w2.camY - w1.camY) * ease,
            camZ: w1.camZ + (w2.camZ - w1.camZ) * ease,
            rotY: w1.rotY + (w2.rotY - w1.rotY) * ease,
            rotX: w1.rotX + (w2.rotX - w1.rotX) * ease,
            globeRotY: w1.globeRotY + (w2.globeRotY - w1.globeRotY) * ease,
            ringsTilt: w1.ringsTilt + (w2.ringsTilt - w1.ringsTilt) * ease
          };
        }
      }
      return SCROLL_WAYPOINTS[SCROLL_WAYPOINTS.length - 1];
    };

    // --- 10. Live Scroll & 360° Drag State ---
    let currentScrollProgress = 0;
    let targetScrollProgress = 0;

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        targetScrollProgress = Math.min(Math.max((window.scrollY || window.pageYOffset) / docHeight, 0), 1);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initialize

    // 360° Drag & Cursor Interaction
    let dragRotY = 0;
    let dragRotX = 0;
    let targetDragRotY = 0;
    let targetDragRotX = 0;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      prevX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      prevY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    };

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      mouseX = (clientX / window.innerWidth - 0.5) * 2;
      mouseY = (clientY / window.innerHeight - 0.5) * 2;

      if (isDragging) {
        const dx = clientX - prevX;
        const dy = clientY - prevY;
        targetDragRotY += dx * 0.0035;
        targetDragRotX += dy * 0.0035;
        prevX = clientX;
        prevY = clientY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Page Visibility API
    let isTabVisible = !document.hidden;
    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Resize
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        onScroll();
      }, 150);
    };
    window.addEventListener('resize', onResize);

    // --- 11. Controlled 30 FPS Render Loop (Continuous Scroll-Driven World) ---
    let animId;
    let lastTime = 0;
    const FRAME_INTERVAL = 1000 / 30; // 30 FPS cap (33.3ms)
    let elapsed = 0;

    const animate = (timestamp) => {
      animId = requestAnimationFrame(animate);

      // Pause rendering only when tab is hidden to save power
      if (!isTabVisible) {
        return;
      }

      const elapsedDelta = timestamp - lastTime;
      if (elapsedDelta < FRAME_INTERVAL) {
        return;
      }
      lastTime = timestamp - (elapsedDelta % FRAME_INTERVAL);

      const delta = 0.033;
      elapsed += delta;

      // Smooth scroll interpolation
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;
      const choreo = getChoreographyAt(currentScrollProgress);

      // Smooth user drag inertia
      dragRotY += (targetDragRotY - dragRotY) * 0.06;
      dragRotX += (targetDragRotX - dragRotX) * 0.06;

      // Target camera position dictated by scroll progress
      camera.position.x += (choreo.camX - camera.position.x) * 0.08;
      camera.position.y += (choreo.camY - camera.position.y) * 0.08;
      camera.position.z += (choreo.camZ - camera.position.z) * 0.08;

      // Master root rotation combining scroll choreography + user drag + mouse parallax
      const targetGroupRotY = choreo.rotY + dragRotY + mouseX * 0.06;
      const targetGroupRotX = choreo.rotX + dragRotX + mouseY * 0.03;

      rootGroup.rotation.y += (targetGroupRotY - rootGroup.rotation.y) * 0.06;
      rootGroup.rotation.x += (targetGroupRotX - rootGroup.rotation.x) * 0.06;

      // Independent continuous planetary spin
      globeGroup.rotation.y += 0.0025;
      astraRingsGroup.rotation.y -= 0.0018;
      astraRingsGroup.rotation.z = -0.32 + choreo.ringsTilt;

      // Spin individual Tech Pillar Cores & Halos
      const pLen = pillarMeshes.length;
      for (let i = 0; i < pLen; i++) {
        const item = pillarMeshes[i];
        item.coreMesh.rotation.y = elapsed * 0.6 + i;
        item.coreMesh.rotation.x = elapsed * 0.35 + i;
        const s = 1.0 + Math.sin(elapsed * 2.8 + i) * 0.12;
        item.haloMesh.scale.set(s, s, 1);
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Cleanup & Disposals
    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      disposables.forEach((item) => {
        try {
          item.dispose();
        } catch {}
      });
      scene.clear();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden select-none bg-[#f8fafc]">
      {/* 3D WebGL Canvas */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" 
      />

      {/* Static Zero-Cost Ambient Gradient Glows */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle 650px at 50% 35%, rgba(14, 165, 233, 0.09) 0%, transparent 70%),
            radial-gradient(circle 500px at 50% 38%, rgba(217, 119, 6, 0.05) 0%, transparent 65%),
            radial-gradient(circle 500px at 15% 45%, rgba(99, 102, 241, 0.05) 0%, transparent 65%),
            radial-gradient(circle 500px at 85% 45%, rgba(37, 99, 235, 0.05) 0%, transparent 65%)
          `
        }}
      />
    </div>
  );
}
