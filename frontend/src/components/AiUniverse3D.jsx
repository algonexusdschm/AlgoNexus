import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * AiUniverse3D: Hyper-Futuristic 3D Living Neural Architecture
 * 
 * Features:
 * - 1,000+ Micro-neurons grouped into distinct functional lobes (CV, RAG, NLP, ML, AI Core)
 * - Synaptic axon dendrite lines connecting nearest-neighbor neurons
 * - Real-time electrical action potentials (firing light pulses) streaming along pathways
 * - Clean 3D background with zero intrusive floating text boxes or buttons
 * - 360° Mouse & Touch Dragging with smooth inertia
 * - Pure White / Light Studio Theme (Electric Cyan, Cobalt Blue, Synaptic Violet - NO GREEN)
 */

const NEURAL_LOBES = [
  {
    id: 'ai',
    name: 'AI CORE',
    center: [0, 0.6, 0],
    color: '#0284c7',
    radius: 2.2,
    count: 220
  },
  {
    id: 'cv',
    name: 'CV RETINA',
    center: [-5.8, 1.2, 1.5],
    color: '#0ea5e9',
    radius: 1.8,
    count: 140
  },
  {
    id: 'rag',
    name: 'RAG MEMORY',
    center: [5.2, 2.0, -1.2],
    color: '#2563eb',
    radius: 1.9,
    count: 150
  },
  {
    id: 'nlp',
    name: 'NLP ATTENTION',
    center: [3.4, -2.4, 1.8],
    color: '#8b5cf6',
    radius: 1.7,
    count: 130
  },
  {
    id: 'ml',
    name: 'ML PLASTICITY',
    center: [-3.8, -2.6, -1.2],
    color: '#6366f1',
    radius: 1.7,
    count: 130
  }
];

export default function AiUniverse3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.015);

    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, isMobile ? 19 : 16);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // --- 2. Studio Lighting for White Background ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(12, 20, 16);
    scene.add(dirLight);

    const cyanPoint = new THREE.PointLight(0x00f0ff, 3.5, 60);
    cyanPoint.position.set(-14, 10, 8);
    scene.add(cyanPoint);

    const violetPoint = new THREE.PointLight(0x8b5cf6, 3.0, 60);
    violetPoint.position.set(14, -8, 8);
    scene.add(violetPoint);

    const blueFill = new THREE.PointLight(0x2563eb, 2.5, 50);
    blueFill.position.set(0, -12, 10);
    scene.add(blueFill);

    // --- 3. Master 3D Neural Network Group ---
    const neuralGroup = new THREE.Group();
    scene.add(neuralGroup);

    // --- 4. Generate Neurons per Functional Lobe ---
    const allNeuronPositions = [];
    const allNeuronColors = [];
    const lobeMeshes = [];

    NEURAL_LOBES.forEach((lobe) => {
      const center = new THREE.Vector3(...lobe.center);
      const color = new THREE.Color(lobe.color);

      // Dedicated Lobe Hub Group
      const lobeGroup = new THREE.Group();
      lobeGroup.position.copy(center);

      // Core Geometric Nucleus for this Lobe
      const coreGeo = lobe.id === 'ai'
        ? new THREE.IcosahedronGeometry(0.85, 2)
        : new THREE.OctahedronGeometry(0.55, 1);

      const coreMat = new THREE.MeshStandardMaterial({
        color: lobe.color,
        emissive: lobe.color,
        emissiveIntensity: 0.75,
        wireframe: true,
        roughness: 0.2
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      lobeGroup.add(coreMesh);

      // Pulsing Halo Ring
      const haloGeo = new THREE.RingGeometry(0.7, 0.82, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: lobe.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      lobeGroup.add(haloMesh);

      neuralGroup.add(lobeGroup);
      lobeMeshes.push({ lobe, coreMesh, haloMesh, center });

      // Scatter micro-neurons inside this lobe
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

    // Add inter-lobe bridge neurons (connecting pathways)
    const bridgeCount = 220;
    for (let i = 0; i < bridgeCount; i++) {
      const idxA = Math.floor(Math.random() * NEURAL_LOBES.length);
      let idxB = Math.floor(Math.random() * NEURAL_LOBES.length);
      while (idxB === idxA) idxB = Math.floor(Math.random() * NEURAL_LOBES.length);

      const pA = new THREE.Vector3(...NEURAL_LOBES[idxA].center);
      const pB = new THREE.Vector3(...NEURAL_LOBES[idxB].center);
      const t = Math.random();
      const pt = pA.clone().lerp(pB, t);

      // Jitter slightly for organic feel
      pt.x += (Math.random() - 0.5) * 1.5;
      pt.y += (Math.random() - 0.5) * 1.5;
      pt.z += (Math.random() - 0.5) * 1.5;

      allNeuronPositions.push(pt.x, pt.y, pt.z);
      const c = new THREE.Color(Math.random() > 0.5 ? 0x0284c7 : 0x8b5cf6);
      allNeuronColors.push(c.r, c.g, c.b);
    }

    // Create Neurons Point Cloud Buffer
    const neuronGeo = new THREE.BufferGeometry();
    neuronGeo.setAttribute('position', new THREE.Float32BufferAttribute(allNeuronPositions, 3));
    neuronGeo.setAttribute('color', new THREE.Float32BufferAttribute(allNeuronColors, 3));
    const neuronMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const neuronPoints = new THREE.Points(neuronGeo, neuronMat);
    neuralGroup.add(neuronPoints);

    // --- 5. Generate Synaptic Axon Connections (LineSegments) ---
    const totalNeurons = allNeuronPositions.length / 3;
    const axonIndices = [];
    const maxConnectionDistSq = 2.4 * 2.4;

    for (let i = 0; i < totalNeurons; i += 2) {
      const xi = allNeuronPositions[i * 3];
      const yi = allNeuronPositions[i * 3 + 1];
      const zi = allNeuronPositions[i * 3 + 2];

      let connected = 0;
      for (let j = i + 1; j < totalNeurons; j++) {
        const xj = allNeuronPositions[j * 3];
        const yj = allNeuronPositions[j * 3 + 1];
        const zj = allNeuronPositions[j * 3 + 2];

        const dx = xi - xj;
        const dy = yi - yj;
        const dz = zi - zj;
        const dSq = dx * dx + dy * dy + dz * dz;

        if (dSq < maxConnectionDistSq) {
          axonIndices.push(i, j);
          connected++;
          if (connected >= 3) break; // Keep lines clean and optimal
        }
      }
    }

    const axonGeo = new THREE.BufferGeometry();
    axonGeo.setAttribute('position', neuronGeo.getAttribute('position'));
    axonGeo.setIndex(axonIndices);
    const axonMat = new THREE.LineBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.22
    });
    const axonLines = new THREE.LineSegments(axonGeo, axonMat);
    neuralGroup.add(axonLines);

    // --- 6. Curved Inter-Lobe Axon Highways & Streaming Firing Pulses ---
    // Connects: CV -> RAG -> NLP -> ML -> AI Core -> CV
    const highwayOrder = [
      { from: 'cv', to: 'rag', color: 0x0ea5e9 },
      { from: 'rag', to: 'nlp', color: 0x2563eb },
      { from: 'nlp', to: 'ml', color: 0x8b5cf6 },
      { from: 'ml', to: 'ai', color: 0x6366f1 },
      { from: 'ai', to: 'cv', color: 0x0284c7 }
    ];

    const highwayCurves = [];

    highwayOrder.forEach(({ from, to, color }) => {
      const lobeA = NEURAL_LOBES.find((l) => l.id === from);
      const lobeB = NEURAL_LOBES.find((l) => l.id === to);
      if (!lobeA || !lobeB) return;

      const pA = new THREE.Vector3(...lobeA.center);
      const pB = new THREE.Vector3(...lobeB.center);
      const mid = pA.clone().add(pB).multiplyScalar(0.5);
      mid.y += (Math.random() - 0.5) * 2.2;
      mid.z += 2.0; // Arch toward viewer

      const curve = new THREE.QuadraticBezierCurve3(pA, mid, pB);
      const pts = curve.getPoints(50);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.45,
        linewidth: 2
      });
      const tube = new THREE.Line(lineGeo, lineMat);
      neuralGroup.add(tube);

      // Streaming Action Potential Photons along this highway
      const packetCount = 6;
      for (let k = 0; k < packetCount; k++) {
        const sGeo = new THREE.SphereGeometry(0.1, 10, 10);
        const sMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const packetMesh = new THREE.Mesh(sGeo, sMat);
        neuralGroup.add(packetMesh);

        highwayCurves.push({
          curve,
          mesh: packetMesh,
          progress: k / packetCount,
          speed: 0.35 + Math.random() * 0.15
        });
      }
    });

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
        targetRotY += dx * 0.005;
        targetRotX += dy * 0.005;
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

    // Scroll interpolation
    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // --- 8. Animation Render Loop (60-120 FPS) ---
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Gentle auto-rotation when user is not dragging
      if (!isDragging) {
        targetRotY += delta * 0.12;
      }

      // Smooth inertia rotation
      neuralGroup.rotation.y += (targetRotY + mouseX * 0.12 - neuralGroup.rotation.y) * 0.06;
      neuralGroup.rotation.x += (targetRotX + mouseY * 0.08 - neuralGroup.rotation.x) * 0.06;

      // Rotate Lobe cores and pulse halos
      lobeMeshes.forEach(({ coreMesh, haloMesh }, idx) => {
        coreMesh.rotation.y = elapsed * 0.7 + idx;
        coreMesh.rotation.x = elapsed * 0.4 + idx;
        const s = 1.0 + Math.sin(elapsed * 3.5 + idx) * 0.15;
        haloMesh.scale.set(s, s, 1);
      });

      // Stream continuous firing light packets
      highwayCurves.forEach((packet) => {
        packet.progress += delta * packet.speed;
        if (packet.progress > 1) packet.progress = 0;
        const pos = packet.curve.getPoint(packet.progress);
        packet.mesh.position.copy(pos);
      });

      // Subtle scroll-driven camera adjustment
      const scrollRatio = Math.min(scrollY / 1800, 1);
      const baseCamZ = isMobile ? 19 : 16;
      const targetCamZ = baseCamZ - scrollRatio * 3.5;
      const targetCamY = -scrollRatio * 2.2;

      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden select-none bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">
      {/* 3D WebGL Canvas Mount */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" 
      />

      {/* Futuristic Soft Studio Ambience Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-sky-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[550px] h-[450px] bg-indigo-200/25 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
