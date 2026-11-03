import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * AiUniverse3D
 * Fully Interactive 3D WebGL Neural Knowledge Mesh
 * 
 * Features:
 * - Clean, modern, high-key studio light background (#f8fafc -> #ffffff)
 * - 3D Master "AI Core" Sphere with orbiting concentric rings
 * - 4 Orbiting 3D Hubs: ML, RAG, NLP, and CV
 * - 3D Spline curves with live pulsing energy packets streaming between nodes
 * - Interactive 360-degree mouse/touch drag + smooth parallax
 * - Scroll-driven 3D camera navigation that smoothly traverses the network
 */
export default function AiUniverse3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    scene.fog = new THREE.FogExp2(0xf1f5f9, 0.022);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // --- 2. Lighting (High-Key Studio) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(10, 20, 15);
    keyLight.castShadow = !isMobile;
    scene.add(keyLight);

    const rimCyan = new THREE.DirectionalLight(0x06b6d4, 1.8);
    rimCyan.position.set(-15, 10, -10);
    scene.add(rimCyan);

    const rimViolet = new THREE.DirectionalLight(0x8b5cf6, 1.8);
    rimViolet.position.set(15, -10, -5);
    scene.add(rimViolet);

    // Subtle Ground Grid plane
    const gridHelper = new THREE.GridHelper(60, 40, 0x0284c7, 0xe2e8f0);
    gridHelper.position.y = -7;
    scene.add(gridHelper);

    // --- 3. Master AI Group & Interactive World ---
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Helper: Create Text Sprite for 3D Labeled Nodes
    function createTextSprite(text, color = '#0284c7', subtext = '') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      // Rounded badge box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(40, 40, 432, 176, 36);
      ctx.fill();
      ctx.stroke();

      // Title
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 74px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 256, subtext ? 105 : 128);

      // Subtitle
      if (subtext) {
        ctx.fillStyle = color;
        ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(subtext, 256, 168);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(3.2, 1.6, 1);
      return sprite;
    }

    // --- 4. Central Master AI Core ---
    const aiCoreGroup = new THREE.Group();
    worldGroup.add(aiCoreGroup);

    // Glassmorphic Outer Sphere
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 3);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.7,
      thickness: 1.2,
      ior: 1.5,
      transparent: true,
      opacity: 0.85
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    aiCoreGroup.add(coreMesh);

    // Inner Glowing Wireframe Core
    const innerGeo = new THREE.IcosahedronGeometry(1.1, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    aiCoreGroup.add(innerMesh);

    // Concentric Gyroscope Rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.04, 16, 64), ringMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.03, 16, 64), new THREE.MeshBasicMaterial({ color: 0x8b5cf6 }));
    ring1.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    aiCoreGroup.add(ring1);
    aiCoreGroup.add(ring2);

    // AI Core Label Sprite
    const aiLabel = createTextSprite('AI CORE', '#0284c7', 'Foundation');
    aiLabel.position.set(0, 2.7, 0);
    aiCoreGroup.add(aiLabel);

    // --- 5. Orbiting Connected Nodes (ML, RAG, NLP, CV) ---
    const nodesData = [
      {
        id: 'RAG',
        label: 'RAG',
        sub: 'Knowledge Base',
        color: 0x0284c7,
        hexStr: '#0284c7',
        pos: new THREE.Vector3(-5.5, 2.4, 0),
        geo: new THREE.OctahedronGeometry(0.9, 0)
      },
      {
        id: 'NLP',
        label: 'NLP',
        sub: 'Tutoring Models',
        color: 0x8b5cf6,
        hexStr: '#8b5cf6',
        pos: new THREE.Vector3(5.5, 2.2, -0.5),
        geo: new THREE.DodecahedronGeometry(0.85, 0)
      },
      {
        id: 'CV',
        label: 'CV',
        sub: 'Visual Classrooms',
        color: 0x10b981,
        hexStr: '#10b981',
        pos: new THREE.Vector3(-4.8, -3.2, 0.5),
        geo: new THREE.BoxGeometry(1.2, 1.2, 1.2)
      },
      {
        id: 'ML',
        label: 'ML',
        sub: 'Adaptive Engine',
        color: 0xf59e0b,
        hexStr: '#f59e0b',
        pos: new THREE.Vector3(4.8, -3.2, 0),
        geo: new THREE.TetrahedronGeometry(1.1, 0)
      }
    ];

    const nodeObjects = [];
    const connectionSplines = [];

    nodesData.forEach((item) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.copy(item.pos);
      worldGroup.add(nodeGroup);

      // Node mesh (translucent glossy crystal)
      const mat = new THREE.MeshPhysicalMaterial({
        color: item.color,
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.65,
        thickness: 0.8,
        transparent: true,
        opacity: 0.95
      });
      const mesh = new THREE.Mesh(item.geo, mat);
      nodeGroup.add(mesh);

      // Inner wireframe
      const wire = new THREE.Mesh(
        item.geo,
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, opacity: 0.6, transparent: true })
      );
      wire.scale.set(1.05, 1.05, 1.05);
      nodeGroup.add(wire);

      // Sprite Label
      const sprite = createTextSprite(item.label, item.hexStr, item.sub);
      sprite.position.set(0, 1.6, 0);
      nodeGroup.add(sprite);

      nodeObjects.push({ group: nodeGroup, mesh, item, initialPos: item.pos.clone() });

      // Luminous Spline Cable connecting Node to Central AI Core
      const p1 = new THREE.Vector3(0, 0, 0);
      const p2 = item.pos;
      const midPoint = new THREE.Vector3()
        .addVectors(p1, p2)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(0, (Math.random() - 0.5) * 1.5, 0));

      const curve = new THREE.QuadraticBezierCurve3(p1, midPoint, p2);
      const points = curve.getPoints(40);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

      const curveMat = new THREE.LineBasicMaterial({
        color: item.color,
        transparent: true,
        opacity: 0.5,
        linewidth: 2
      });
      const line = new THREE.Line(curveGeo, curveMat);
      worldGroup.add(line);

      // Streaming Data Pulse Packet along Cable
      const pulseGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      worldGroup.add(pulseMesh);

      connectionSplines.push({ curve, pulseMesh, progress: Math.random() });
    });

    // Inter-node cross links (RAG -> NLP and CV -> ML)
    function addCrossLink(pA, pB, colorHex) {
      const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
      mid.z -= 1.2;
      const curve = new THREE.QuadraticBezierCurve3(pA, mid, pB);
      const pts = curve.getPoints(30);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.35 })
      );
      worldGroup.add(line);
      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 8, 8),
        new THREE.MeshBasicMaterial({ color: colorHex })
      );
      worldGroup.add(pulse);
      connectionSplines.push({ curve, pulseMesh: pulse, progress: Math.random() });
    }

    addCrossLink(nodesData[0].pos, nodesData[1].pos, 0x38bdf8); // RAG to NLP
    addCrossLink(nodesData[2].pos, nodesData[3].pos, 0x10b981); // CV to ML

    // --- 6. Floating Background Particle Constellation ---
    const particleCount = isMobile ? 80 : 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 36;
      particlePos[i + 1] = (Math.random() - 0.5) * 24;
      particlePos[i + 2] = (Math.random() - 0.5) * 20 - 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x0284c7,
      size: 0.16,
      transparent: true,
      opacity: 0.4
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    scene.add(particleCloud);

    // --- 7. Mouse Drag, Parallax & Scroll Physics ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      prevMouseY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    };

    const handlePointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      // Normal hovering parallax
      mouseX = (clientX / window.innerWidth - 0.5) * 2;
      mouseY = (clientY / window.innerHeight - 0.5) * 2;

      // Drag to orbit 3D view
      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        targetRotationY += deltaX * 0.005;
        targetRotationX += deltaY * 0.005;
        prevMouseX = clientX;
        prevMouseY = clientY;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Scroll-driven camera drift
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- 8. Real-Time 60-120fps Animation Loop ---
    let clock = new THREE.Clock();
    let animFrameId;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Core rotations
      coreMesh.rotation.y = time * 0.35;
      coreMesh.rotation.x = time * 0.2;
      innerMesh.rotation.y = -time * 0.5;
      ring1.rotation.z = time * 0.4;
      ring2.rotation.x = -time * 0.35;

      // Node individual rotations and floating breathing motion
      nodeObjects.forEach(({ group, mesh, initialPos }, idx) => {
        mesh.rotation.y = time * 0.6 + idx;
        mesh.rotation.x = time * 0.4 + idx;
        group.position.y = initialPos.y + Math.sin(time * 1.5 + idx) * 0.25;
      });

      // Advance data pulses along spline cables
      connectionSplines.forEach((conn) => {
        conn.progress += delta * 0.45;
        if (conn.progress > 1) conn.progress = 0;
        const pt = conn.curve.getPoint(conn.progress);
        conn.pulseMesh.position.copy(pt);
      });

      // Particles subtle spin
      particleCloud.rotation.y = time * 0.03;

      // Smooth camera interpolation based on scroll and mouse drag
      const scrollNorm = Math.min(scrollY / 1800, 1);
      const targetCamZ = 16 - scrollNorm * 4;
      const targetCamY = -scrollNorm * 3;

      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;

      // Smooth world rotation
      worldGroup.rotation.y += (targetRotationY + mouseX * 0.25 - worldGroup.rotation.y) * 0.06;
      worldGroup.rotation.x += (targetRotationX + mouseY * 0.15 - worldGroup.rotation.x) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-auto z-0 overflow-hidden select-none bg-gradient-to-b from-slate-50 via-white to-slate-100"
      title="Drag to orbit 3D AI Network"
    />
  );
}
