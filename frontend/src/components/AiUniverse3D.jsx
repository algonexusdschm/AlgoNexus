import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { 
  Scan, 
  Database, 
  BrainCircuit, 
  Cpu, 
  Sparkles, 
  RotateCcw, 
  Activity, 
  Globe2 
} from 'lucide-react';

/**
 * AiUniverse3D: Hyper-Futuristic 3D Interactive AI Globe on White / Light Theme
 *
 * Features:
 * - 3D Translucent Pearlescent Sphere with dot-matrix continental constellation
 * - Glowing Latitude/Longitude geodesic wireframes and gyroscopic orbital rings
 * - 5 Interconnected AI Hubs on Globe surface:
 *   * AI CORE (Master Node)
 *   * CV (Computer Vision Scanner)
 *   * RAG (Vector Knowledge Engine)
 *   * NLP (Transformer Attention)
 *   * ML (Silicon Edge NPU)
 * - 3D Great-Circle Flight Arcs with streaming glowing photon data packets
 * - Full 360° Mouse & Touch Dragging with smooth inertia
 * - Pure Light Theme / White Studio Lighting (Strictly NO Green: Electric Cyan, Blue, Violet)
 */

const AI_NODES = [
  {
    id: 'ai',
    name: 'AI CORE',
    tag: 'AUTONOMOUS SYNTHESIS',
    lat: 5,
    lon: 0,
    color: '#0284c7',
    desc: 'Central intelligence synthesizing multimodal educational outputs.'
  },
  {
    id: 'cv',
    name: 'CV SCANNER',
    tag: 'OPTICAL OCR & RETICLE',
    lat: 34,
    lon: -65,
    color: '#0ea5e9',
    desc: 'Spatial scanning of handwritten formulas and student work.'
  },
  {
    id: 'rag',
    name: 'RAG VECTORS',
    tag: '1536-D HILBERT SEARCH',
    lat: 38,
    lon: 68,
    color: '#3b82f6',
    desc: 'Semantic retrieval across 250,000+ textbooks & syllabus docs.'
  },
  {
    id: 'nlp',
    name: 'NLP ATTENTION',
    tag: 'MULTI-HEAD TRANSFORMER',
    lat: -24,
    lon: 82,
    color: '#8b5cf6',
    desc: 'Self-attention decomposition into verified reasoning proofs.'
  },
  {
    id: 'ml',
    name: 'ML SILICON',
    tag: 'NPU EDGE TRAINING',
    lat: -28,
    lon: -70,
    color: '#6366f1',
    desc: 'Real-time weight updates adapting to student learning curves.'
  }
];

export default function AiUniverse3D() {
  const mountRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);

  // Helper: Convert lat/lon degrees to 3D Cartesian Vector on a sphere of radius R
  const latLonToVector3 = (lat, lon, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.016);

    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, isMobile ? 18 : 15);

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

    // --- 2. Studio Lighting for White / Light Background ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(15, 20, 15);
    scene.add(keyLight);

    const cyanRimLight = new THREE.PointLight(0x00f0ff, 3.5, 50);
    cyanRimLight.position.set(-15, 10, 8);
    scene.add(cyanRimLight);

    const violetRimLight = new THREE.PointLight(0x8b5cf6, 3.0, 50);
    violetRimLight.position.set(15, -8, 8);
    scene.add(violetRimLight);

    const blueFillLight = new THREE.PointLight(0x3b82f6, 2.5, 45);
    blueFillLight.position.set(0, -12, 10);
    scene.add(blueFillLight);

    // --- 3. Master 3D World Group (Rotatable Globe) ---
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const GLOBE_RADIUS = 4.2;

    // Layer 1: Inner Translucent Sphere Core
    const coreGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.6,
      transparent: true,
      opacity: 0.75,
      reflectivity: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // Layer 2: Fibonacci Dot-Matrix Constellation (1,200 points on sphere)
    const DOT_COUNT = 1200;
    const dotPositions = new Float32Array(DOT_COUNT * 3);
    const dotColors = new Float32Array(DOT_COUNT * 3);
    const cCyan = new THREE.Color(0x0284c7);
    const cBlue = new THREE.Color(0x2563eb);
    const cViolet = new THREE.Color(0x7c3aed);

    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    for (let i = 0; i < DOT_COUNT; i++) {
      const y = 1 - (i / (DOT_COUNT - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      dotPositions[i * 3] = x * (GLOBE_RADIUS + 0.04);
      dotPositions[i * 3 + 1] = y * (GLOBE_RADIUS + 0.04);
      dotPositions[i * 3 + 2] = z * (GLOBE_RADIUS + 0.04);

      const colChoice = Math.random();
      const col = colChoice < 0.5 ? cCyan : colChoice < 0.85 ? cBlue : cViolet;
      dotColors[i * 3] = col.r;
      dotColors[i * 3 + 1] = col.g;
      dotColors[i * 3 + 2] = col.b;
    }

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    dotGeo.setAttribute('color', new THREE.BufferAttribute(dotColors, 3));
    const dotMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const dotMesh = new THREE.Points(dotGeo, dotMat);
    globeGroup.add(dotMesh);

    // Layer 3: Latitude / Longitude Geodesic Rings
    const wireGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 0.02, 28, 16);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // Layer 4: Glowing Equator & Polar Rings
    const equatorGeo = new THREE.TorusGeometry(GLOBE_RADIUS + 0.08, 0.03, 16, 100);
    const equatorMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.6
    });
    const equatorMesh = new THREE.Mesh(equatorGeo, equatorMat);
    equatorMesh.rotation.x = Math.PI / 2;
    globeGroup.add(equatorMesh);

    // Layer 5: Outer Gyroscopic Orbital Rings
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const orbit1Geo = new THREE.TorusGeometry(5.6, 0.025, 16, 120);
    const orbit1Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });
    const orbit1 = new THREE.Mesh(orbit1Geo, orbit1Mat);
    orbit1.rotation.x = Math.PI / 3;
    orbit1.rotation.y = Math.PI / 6;
    orbitGroup.add(orbit1);

    const orbit2Geo = new THREE.TorusGeometry(6.4, 0.02, 16, 120);
    const orbit2Mat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.3 });
    const orbit2 = new THREE.Mesh(orbit2Geo, orbit2Mat);
    orbit2.rotation.x = -Math.PI / 4;
    orbit2.rotation.y = -Math.PI / 4;
    orbitGroup.add(orbit2);

    // Helper: Create High-Tech 3D Cyber Sprite Label for Light Background
    function createCyberSprite(title, subtitle, accentColor) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 220;
      const ctx = canvas.getContext('2d');

      // Light Card Background with glowing border
      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 6;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 18;

      ctx.beginPath();
      ctx.moveTo(50, 30);
      ctx.lineTo(462, 30);
      ctx.lineTo(492, 60);
      ctx.lineTo(492, 160);
      ctx.lineTo(462, 190);
      ctx.lineTo(50, 190);
      ctx.lineTo(20, 160);
      ctx.lineTo(20, 60);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Top corner tech accent
      ctx.fillStyle = accentColor;
      ctx.fillRect(40, 48, 16, 16);

      // Title Text
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 54px "Chakra Petch", "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, 260, 92);

      // Subtitle Tag
      ctx.fillStyle = accentColor;
      ctx.font = 'bold 26px monospace';
      ctx.fillText(`• ${subtitle} •`, 260, 146);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(2.2, 0.95, 1);
      return sprite;
    }

    // --- 4. Place the 5 AI Nodes on the Globe Surface ---
    const nodeObjects = [];

    AI_NODES.forEach((node) => {
      const pos = latLonToVector3(node.lat, node.lon, GLOBE_RADIUS + 0.1);
      const hubGroup = new THREE.Group();
      hubGroup.position.copy(pos);

      // 3D Glowing Core Node Mesh
      const nodeGeo = node.id === 'ai'
        ? new THREE.IcosahedronGeometry(0.32, 1)
        : new THREE.OctahedronGeometry(0.25, 0);

      const nodeMat = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.8
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      hubGroup.add(nodeMesh);

      // Pulsing Halo Ring
      const haloGeo = new THREE.RingGeometry(0.35, 0.44, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: node.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.lookAt(pos.clone().multiplyScalar(2));
      hubGroup.add(haloMesh);

      // Floating Cyber Label Sprite
      const sprite = createCyberSprite(node.name, node.tag, node.color);
      const normal = pos.clone().normalize();
      sprite.position.copy(normal.clone().multiplyScalar(0.95));
      hubGroup.add(sprite);

      globeGroup.add(hubGroup);
      nodeObjects.push({ node, hubGroup, nodeMesh, haloMesh });
    });

    // --- 5. Great-Circle 3D Curved Arcs & Streaming Photon Packets ---
    // Connects: CV -> RAG -> NLP -> ML -> AI -> CV
    const arcConnections = [
      { from: 'cv', to: 'rag', color: 0x0284c7 },
      { from: 'rag', to: 'nlp', color: 0x3b82f6 },
      { from: 'nlp', to: 'ml', color: 0x8b5cf6 },
      { from: 'ml', to: 'ai', color: 0x6366f1 },
      { from: 'ai', to: 'cv', color: 0x0ea5e9 }
    ];

    const splineStreams = [];

    arcConnections.forEach(({ from, to, color }) => {
      const nodeA = AI_NODES.find((n) => n.id === from);
      const nodeB = AI_NODES.find((n) => n.id === to);
      if (!nodeA || !nodeB) return;

      const pA = latLonToVector3(nodeA.lat, nodeA.lon, GLOBE_RADIUS + 0.1);
      const pB = latLonToVector3(nodeB.lat, nodeB.lon, GLOBE_RADIUS + 0.1);

      // Compute mid-point elevated above the sphere
      const mid = pA.clone().add(pB).multiplyScalar(0.5);
      const elevatedMid = mid.normalize().multiplyScalar(GLOBE_RADIUS + 1.6);

      const curve = new THREE.QuadraticBezierCurve3(pA, elevatedMid, pB);
      const points = curve.getPoints(50);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.55,
        linewidth: 2
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arcLine);

      // Streaming Photon Light Packet along this arc
      const pGeo = new THREE.SphereGeometry(0.09, 12, 12);
      const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pulseMesh = new THREE.Mesh(pGeo, pMat);
      globeGroup.add(pulseMesh);

      splineStreams.push({ curve, pulseMesh, progress: Math.random(), speed: 0.4 + Math.random() * 0.2 });
    });

    // --- 6. Ambient Floating Particles in Background ---
    const ambientCount = 350;
    const aGeo = new THREE.BufferGeometry();
    const aPos = new Float32Array(ambientCount * 3);
    for (let i = 0; i < ambientCount; i++) {
      aPos[i * 3] = (Math.random() - 0.5) * 45;
      aPos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      aPos[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    aGeo.setAttribute('position', new THREE.BufferAttribute(aPos, 3));
    const aMat = new THREE.PointsMaterial({
      color: 0x0284c7,
      size: 0.12,
      transparent: true,
      opacity: 0.35
    });
    const ambientMesh = new THREE.Points(aGeo, aMat);
    scene.add(ambientMesh);

    // --- 7. Interactive 360° Mouse & Touch Dragging + Parallax ---
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
        targetRotY += dx * 0.006;
        targetRotX += dy * 0.006;
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

    // Scroll Travel interpolation
    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Window Resize
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

      // Continuous gentle auto-spin when not dragging
      if (!isDragging) {
        targetRotY += delta * 0.18;
      }

      // Smooth inertia rotation
      globeGroup.rotation.y += (targetRotY + mouseX * 0.15 - globeGroup.rotation.y) * 0.06;
      globeGroup.rotation.x += (targetRotX + mouseY * 0.12 - globeGroup.rotation.x) * 0.06;

      // Outer rings independent counter-rotations
      orbit1.rotation.z = elapsed * 0.25;
      orbit2.rotation.z = -elapsed * 0.3;

      // Hub nodes floating and pulsing
      nodeObjects.forEach(({ nodeMesh, haloMesh }, idx) => {
        nodeMesh.rotation.y = elapsed * 0.8 + idx;
        nodeMesh.rotation.x = elapsed * 0.5 + idx;
        const scale = 1.0 + Math.sin(elapsed * 3 + idx) * 0.12;
        haloMesh.scale.set(scale, scale, 1);
      });

      // Stream photon packets along great-circle arcs
      splineStreams.forEach((stream) => {
        stream.progress += delta * stream.speed;
        if (stream.progress > 1) stream.progress = 0;
        const pos = stream.curve.getPoint(stream.progress);
        stream.pulseMesh.position.copy(pos);
      });

      // Ambient particle drift
      ambientMesh.rotation.y = elapsed * 0.02;

      // Subtle scroll-driven camera adjustment
      const scrollRatio = Math.min(scrollY / 1800, 1);
      const baseCamZ = isMobile ? 18 : 15;
      const targetCamZ = baseCamZ - scrollRatio * 3.5;
      const targetCamY = -scrollRatio * 2.5;

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
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Futuristic Light Studio Ambience Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-sky-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[400px] bg-indigo-200/25 rounded-full blur-3xl pointer-events-none" />

      {/* Floating 360° Drag Interaction Pill Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 px-4 py-2 rounded-full bg-white/85 backdrop-blur-xl border border-slate-200/90 text-xs font-mono font-bold text-slate-700 shadow-lg shadow-slate-200/60 select-none">
        <Globe2 className="w-4 h-4 text-sky-600 animate-spin" style={{ animationDuration: '8s' }} />
        <span>360° INTERACTIVE 3D AI GLOBE • DRAG TO ROTATE</span>
      </div>
    </div>
  );
}
