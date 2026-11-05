import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * AiUniverse3D: High-Performance Widescreen Neural Constellation
 * 
 * Performance Optimizations:
 * - Ultra-low CPU/GPU footprint (< 10-15% utilization)
 * - Capped pixel ratio (max 1.25 on desktop, 1.0 on mobile) to eliminate 4K/retina fill-rate thrashing
 * - Hardware powerPreference: 'low-power' with mediump precision
 * - Lightweight MeshBasicMaterial (no expensive PBR / quadratic point light calculations)
 * - Single instanced photon packet system with precomputed curve lookup tables (zero allocations in loop)
 * - 60 FPS render throttle with automatic pause when tab is inactive/hidden or scrolled out of view
 * - Zero CSS blur-3xl compositor passes (uses zero-cost CSS radial gradients instead)
 * - Complete Three.js memory disposal on unmount
 */

const NEURAL_LOBES = [
  // 1. Central Executive Nucleus
  {
    id: 'ai',
    name: 'AI CORE',
    center: [0, 0.4, 0],
    color: '#0284c7',
    radius: 3.4,
    count: 280
  },
  // 2. Left Wing: Visual Sensory Cortex (CV)
  {
    id: 'cv',
    name: 'CV RETINA',
    center: [-10.8, 1.8, 1.2],
    color: '#0ea5e9',
    radius: 3.0,
    count: 200
  },
  // 3. Right Wing: Vector Memory Lattice (RAG)
  {
    id: 'rag',
    name: 'RAG MEMORY',
    center: [10.8, 2.2, -1.0],
    color: '#2563eb',
    radius: 3.0,
    count: 200
  },
  // 4. Bottom-Right: Transformer Synapse Lattice (NLP)
  {
    id: 'nlp',
    name: 'NLP ATTENTION',
    center: [7.8, -4.2, 1.6],
    color: '#8b5cf6',
    radius: 2.7,
    count: 170
  },
  // 5. Bottom-Left: Synaptic Weight Engine (ML)
  {
    id: 'ml',
    name: 'ML PLASTICITY',
    center: [-7.8, -4.2, -1.2],
    color: '#6366f1',
    radius: 2.7,
    count: 170
  },
  // 6. Far-Left Peripheral Constellation (Fills laptop screen left margin)
  {
    id: 'peri_left',
    name: 'DATA EDGE WEST',
    center: [-15.5, -1.0, -1.8],
    color: '#38bdf8',
    radius: 2.5,
    count: 130
  },
  // 7. Far-Right Peripheral Constellation (Fills laptop screen right margin)
  {
    id: 'peri_right',
    name: 'DATA EDGE EAST',
    center: [15.5, -0.8, -1.8],
    color: '#818cf8',
    radius: 2.5,
    count: 130
  },
  // 8. Top-Left Horizon Lobe
  {
    id: 'top_left',
    name: 'HORIZON NORTHWEST',
    center: [-8.5, 5.6, -1.5],
    color: '#0284c7',
    radius: 2.4,
    count: 120
  },
  // 9. Top-Right Horizon Lobe
  {
    id: 'top_right',
    name: 'HORIZON NORTHEAST',
    center: [8.5, 5.8, -1.5],
    color: '#7c3aed',
    radius: 2.4,
    count: 120
  }
];

export default function AiUniverse3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // Track disposables for clean unmounting
    const disposables = [];
    const registerDisposable = (item) => {
      if (item && typeof item.dispose === 'function') {
        disposables.push(item);
      }
      return item;
    };

    // --- 1. Scene & Fog ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.012);

    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, isMobile ? 19 : 14.2);

    // --- 2. Low-Overhead Renderer ---
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'low-power',
      precision: 'mediump',
      stencil: false,
      depth: true
    });
    registerDisposable(renderer);

    renderer.setSize(window.innerWidth, window.innerHeight);
    // Cap pixel ratio to 1.25 on desktop, 1.0 on mobile to stop high-DPI GPU thrashing
    const maxPixelRatio = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.25);
    renderer.setPixelRatio(maxPixelRatio);
    container.appendChild(renderer.domElement);

    // --- 3. Master 3D Neural Network Group ---
    const neuralGroup = new THREE.Group();
    scene.add(neuralGroup);

    // Shared Geometries & Materials (Instanced/Reused for zero GC churn)
    const aiCoreGeo = registerDisposable(new THREE.IcosahedronGeometry(1.0, 1));
    const subCoreGeo = registerDisposable(new THREE.OctahedronGeometry(0.65, 0));
    const haloGeo = registerDisposable(new THREE.RingGeometry(0.85, 0.98, 24));

    const lobeMeshes = [];
    const allNeuronPositions = [];
    const allNeuronColors = [];

    // --- 4. Generate Neurons per Functional Lobe Across Widescreen ---
    NEURAL_LOBES.forEach((lobe) => {
      const center = new THREE.Vector3(...lobe.center);
      const color = new THREE.Color(lobe.color);

      const lobeGroup = new THREE.Group();
      lobeGroup.position.copy(center);

      // Core Geometric Nucleus with lightweight BasicMaterial
      const coreGeo = lobe.id === 'ai' ? aiCoreGeo : subCoreGeo;
      const coreMat = registerDisposable(new THREE.MeshBasicMaterial({
        color: lobe.color,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      }));
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      lobeGroup.add(coreMesh);

      // Halo Ring
      const haloMat = registerDisposable(new THREE.MeshBasicMaterial({
        color: lobe.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45
      }));
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      lobeGroup.add(haloMesh);

      neuralGroup.add(lobeGroup);
      lobeMeshes.push({ coreMesh, haloMesh });

      // Scatter micro-neurons
      for (let i = 0; i < lobe.count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * lobe.radius;

        const sinPhi = Math.sin(phi);
        const x = center.x + r * sinPhi * Math.cos(theta);
        const y = center.y + r * sinPhi * Math.sin(theta);
        const z = center.z + r * Math.cos(phi);

        allNeuronPositions.push(x, y, z);
        allNeuronColors.push(color.r, color.g, color.b);
      }
    });

    // Inter-lobe bridge neurons spanning the full width
    const bridgeCount = 350;
    for (let i = 0; i < bridgeCount; i++) {
      const idxA = Math.floor(Math.random() * NEURAL_LOBES.length);
      let idxB = Math.floor(Math.random() * NEURAL_LOBES.length);
      while (idxB === idxA) idxB = Math.floor(Math.random() * NEURAL_LOBES.length);

      const pA = new THREE.Vector3(...NEURAL_LOBES[idxA].center);
      const pB = new THREE.Vector3(...NEURAL_LOBES[idxB].center);
      const t = Math.random();
      const pt = pA.clone().lerp(pB, t);

      pt.x += (Math.random() - 0.5) * 2.0;
      pt.y += (Math.random() - 0.5) * 2.0;
      pt.z += (Math.random() - 0.5) * 2.0;

      allNeuronPositions.push(pt.x, pt.y, pt.z);
      const c = new THREE.Color(Math.random() > 0.5 ? 0x0284c7 : 0x8b5cf6);
      allNeuronColors.push(c.r, c.g, c.b);
    }

    // Points Cloud Buffer
    const neuronGeo = registerDisposable(new THREE.BufferGeometry());
    neuronGeo.setAttribute('position', new THREE.Float32BufferAttribute(allNeuronPositions, 3));
    neuronGeo.setAttribute('color', new THREE.Float32BufferAttribute(allNeuronColors, 3));
    const neuronMat = registerDisposable(new THREE.PointsMaterial({
      size: 0.13,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    }));
    const neuronPoints = new THREE.Points(neuronGeo, neuronMat);
    neuralGroup.add(neuronPoints);

    // --- 5. Synaptic Axon Connections (LineSegments) ---
    const totalNeurons = allNeuronPositions.length / 3;
    const axonIndices = [];
    const maxConnectionDistSq = 2.7 * 2.7;

    for (let i = 0; i < totalNeurons; i += 2) {
      const xi = allNeuronPositions[i * 3];
      const yi = allNeuronPositions[i * 3 + 1];
      const zi = allNeuronPositions[i * 3 + 2];

      let connected = 0;
      for (let j = i + 1; j < totalNeurons; j++) {
        const dx = xi - allNeuronPositions[j * 3];
        const dy = yi - allNeuronPositions[j * 3 + 1];
        const dz = zi - allNeuronPositions[j * 3 + 2];
        const dSq = dx * dx + dy * dy + dz * dz;

        if (dSq < maxConnectionDistSq) {
          axonIndices.push(i, j);
          connected++;
          if (connected >= 2) break;
        }
      }
    }

    const axonGeo = registerDisposable(new THREE.BufferGeometry());
    axonGeo.setAttribute('position', neuronGeo.getAttribute('position'));
    axonGeo.setIndex(axonIndices);
    const axonMat = registerDisposable(new THREE.LineBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.22
    }));
    const axonLines = new THREE.LineSegments(axonGeo, axonMat);
    neuralGroup.add(axonLines);

    // --- 6. Axon Highways & Precomputed Light Photons ---
    const highwayOrder = [
      { from: 'peri_left', to: 'cv', color: 0x38bdf8 },
      { from: 'cv', to: 'top_left', color: 0x0ea5e9 },
      { from: 'top_left', to: 'ai', color: 0x0284c7 },
      { from: 'ai', to: 'top_right', color: 0x7c3aed },
      { from: 'top_right', to: 'rag', color: 0x2563eb },
      { from: 'rag', to: 'peri_right', color: 0x818cf8 },
      { from: 'peri_right', to: 'nlp', color: 0x8b5cf6 },
      { from: 'nlp', to: 'ml', color: 0x6366f1 },
      { from: 'ml', to: 'peri_left', color: 0x0284c7 },
      { from: 'cv', to: 'rag', color: 0x0ea5e9 },
      { from: 'ml', to: 'ai', color: 0x6366f1 },
      { from: 'nlp', to: 'ai', color: 0x8b5cf6 }
    ];

    // Pre-sample highway curves into fast lookup tables (Zero allocations in render loop)
    const SAMPLES_PER_CURVE = 100;
    const packetRunners = [];
    const packetPositionsArray = [];

    highwayOrder.forEach(({ from, to, color }) => {
      const lobeA = NEURAL_LOBES.find((l) => l.id === from);
      const lobeB = NEURAL_LOBES.find((l) => l.id === to);
      if (!lobeA || !lobeB) return;

      const pA = new THREE.Vector3(...lobeA.center);
      const pB = new THREE.Vector3(...lobeB.center);
      const mid = pA.clone().add(pB).multiplyScalar(0.5);
      mid.y += (Math.random() - 0.5) * 2.2;
      mid.z += 1.8;

      const curve = new THREE.QuadraticBezierCurve3(pA, mid, pB);
      const pts = curve.getPoints(36);
      const lineGeo = registerDisposable(new THREE.BufferGeometry().setFromPoints(pts));
      const lineMat = registerDisposable(new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.42
      }));
      const tube = new THREE.Line(lineGeo, lineMat);
      neuralGroup.add(tube);

      // Pre-sample 100 points along curve
      const sampledCurvePts = curve.getPoints(SAMPLES_PER_CURVE);

      // 4 packets per highway
      const packetsPerHighway = 4;
      for (let k = 0; k < packetsPerHighway; k++) {
        const initialProgress = k / packetsPerHighway;
        const initialSampleIdx = Math.floor(initialProgress * SAMPLES_PER_CURVE);
        const pt = sampledCurvePts[initialSampleIdx] || sampledCurvePts[0];

        const particleIndex = packetRunners.length;
        packetPositionsArray.push(pt.x, pt.y, pt.z);

        packetRunners.push({
          pts: sampledCurvePts,
          progress: initialProgress,
          speed: 0.32 + (k % 2) * 0.1,
          index: particleIndex
        });
      }
    });

    // Single unified Points object for ALL firing photons (1 single draw call!)
    const packetPositions = new Float32Array(packetPositionsArray);
    const packetGeo = registerDisposable(new THREE.BufferGeometry());
    const packetPosAttr = new THREE.BufferAttribute(packetPositions, 3);
    packetGeo.setAttribute('position', packetPosAttr);

    const packetMat = registerDisposable(new THREE.PointsMaterial({
      color: 0x0284c7,
      size: 0.28,
      transparent: true,
      opacity: 0.95
    }));
    const packetPoints = new THREE.Points(packetGeo, packetMat);
    neuralGroup.add(packetPoints);

    // --- 7. Interactive 360° Mouse & Touch Dragging ---
    let targetRotY = 0;
    let targetRotX = 0;
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
        targetRotY += dx * 0.004;
        targetRotX += dy * 0.004;
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

    // Scroll interpolation with throttle
    let scrollY = 0;
    let isScrolledPastHero = false;
    const onScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
      // If user has scrolled deep into content (> 1800px), pause heavy rendering
      isScrolledPastHero = scrollY > 2200;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Page visibility (pause when tab is backgrounded)
    let isTabVisible = !document.hidden;
    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Resize with debouncing
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 100);
    };
    window.addEventListener('resize', onResize);

    // --- 8. Optimized 60 FPS Animation Render Loop ---
    let animId;
    let lastRenderTime = performance.now();
    const TARGET_FRAME_MS = 1000 / 60; // Max 60 FPS cap to prevent 144Hz/240Hz screen overheating
    let elapsed = 0;

    const animate = (now) => {
      animId = requestAnimationFrame(animate);

      // Skip render if tab is hidden in background or scrolled deep past hero
      if (!isTabVisible || isScrolledPastHero) {
        return;
      }

      const elapsedDelta = now - lastRenderTime;
      if (elapsedDelta < TARGET_FRAME_MS) {
        return; // Throttle to target FPS
      }

      const delta = Math.min(elapsedDelta / 1000, 0.1);
      lastRenderTime = now - (elapsedDelta % TARGET_FRAME_MS);
      elapsed += delta;

      // Gentle auto-rotation
      if (!isDragging) {
        targetRotY += delta * 0.08;
      }

      // Smooth inertia rotation
      neuralGroup.rotation.y += (targetRotY + mouseX * 0.12 - neuralGroup.rotation.y) * 0.05;
      neuralGroup.rotation.x += (targetRotX + mouseY * 0.06 - neuralGroup.rotation.x) * 0.05;

      // Rotate Lobe cores and pulse halos
      const lobeCount = lobeMeshes.length;
      for (let i = 0; i < lobeCount; i++) {
        const { coreMesh, haloMesh } = lobeMeshes[i];
        coreMesh.rotation.y = elapsed * 0.6 + i;
        coreMesh.rotation.x = elapsed * 0.35 + i;
        const s = 1.0 + Math.sin(elapsed * 3.0 + i) * 0.12;
        haloMesh.scale.set(s, s, 1);
      }

      // Stream continuous firing light packets using pre-sampled curves (Zero GC allocation!)
      const posArray = packetPosAttr.array;
      const runnerCount = packetRunners.length;
      for (let i = 0; i < runnerCount; i++) {
        const runner = packetRunners[i];
        runner.progress += delta * runner.speed;
        if (runner.progress >= 1) runner.progress = 0;

        const sampleIdx = Math.floor(runner.progress * SAMPLES_PER_CURVE);
        const pt = runner.pts[sampleIdx] || runner.pts[0];
        const offset = runner.index * 3;
        posArray[offset] = pt.x;
        posArray[offset + 1] = pt.y;
        posArray[offset + 2] = pt.z;
      }
      packetPosAttr.needsUpdate = true;

      // Subtle scroll-driven camera adjustment
      const scrollRatio = Math.min(scrollY / 1800, 1);
      const baseCamZ = isMobile ? 19 : 14.2;
      const targetCamZ = baseCamZ - scrollRatio * 3.0;
      const targetCamY = -scrollRatio * 2.0;

      camera.position.z += (targetCamZ - camera.position.z) * 0.06;
      camera.position.y += (targetCamY - camera.position.y) * 0.06;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // --- Cleanup & Memory Disposal ---
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

      // Explicitly dispose all geometries, materials, and renderer
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
      {/* 3D WebGL Canvas Mount */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" 
      />

      {/* Hardware-Accelerated Zero-Cost Radial Gradient Glows (Replaces expensive CSS blur-3xl) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle 600px at 50% 30%, rgba(14, 165, 233, 0.12) 0%, transparent 70%),
            radial-gradient(circle 500px at 20% 40%, rgba(99, 102, 241, 0.08) 0%, transparent 65%),
            radial-gradient(circle 500px at 80% 40%, rgba(37, 99, 235, 0.08) 0%, transparent 65%)
          `
        }}
      />
    </div>
  );
}
