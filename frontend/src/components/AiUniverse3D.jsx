import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * AiUniverse3D
 * Next-Gen Hyper-Futuristic 3D WebGL Neural Matrix
 *
 * Features:
 * - Layer 0: Futuristic panoramic ambient cyber-atrium backdrop with light dispersion
 * - Layer 1: Real-time 3D Cybernetic Grid with horizon glow
 * - Layer 2: Floating 3D Quantum Data Rings & Holographic Manifolds
 * - Layer 3: Central Master AI Core with pulsing energy halos & gyroscope rings
 * - Layer 4: Connected 3D Hubs (AI, ML, RAG, NLP, CV) with glowing spline data pulses
 * - Full 360-degree interactive mouse/touch drag + parallax + scroll camera travel
 */
export default function AiUniverse3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9);
    scene.fog = new THREE.FogExp2(0xe2e8f0, 0.018);

    const camera = new THREE.PerspectiveCamera(
      52,
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
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // --- 2. Lighting (Futuristic Studio + Neon Rim Lights) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(12, 22, 16);
    scene.add(keyLight);

    const cyanLaser = new THREE.PointLight(0x06b6d4, 3.5, 35);
    cyanLaser.position.set(-10, 5, 4);
    scene.add(cyanLaser);

    const violetLaser = new THREE.PointLight(0x8b5cf6, 3.5, 35);
    violetLaser.position.set(10, -4, 4);
    scene.add(violetLaser);

    const emeraldLaser = new THREE.PointLight(0x10b981, 2.5, 30);
    emeraldLaser.position.set(0, -8, 2);
    scene.add(emeraldLaser);

    // --- 3. Futuristic Quantum Floor Grid & Horizon Horizon Glow ---
    const gridHelper = new THREE.GridHelper(80, 50, 0x0284c7, 0xcfd8dc);
    gridHelper.position.y = -7.5;
    scene.add(gridHelper);

    // Floating Cybernetic Hex Rings in the background
    const hexGroup = new THREE.Group();
    scene.add(hexGroup);
    const hexMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    for (let i = 0; i < 4; i++) {
      const hexGeo = new THREE.CylinderGeometry(8 + i * 4, 8 + i * 4, 0.4, 6, 1, true);
      const hexMesh = new THREE.Mesh(hexGeo, hexMat);
      hexMesh.position.y = -6.8 + i * 0.2;
      hexGroup.add(hexMesh);
    }

    // --- 4. Master 3D World Group (Rotatable) ---
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Helper: High-Tech Cyber Badge Sprites for Nodes
    function createCyberSprite(title, subtitle = '', accentColor = '#0284c7') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      // Futuristic Chamfered Polygon Card
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 6;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 16;

      ctx.beginPath();
      ctx.moveTo(70, 40);
      ctx.lineTo(442, 40);
      ctx.lineTo(472, 70);
      ctx.lineTo(472, 186);
      ctx.lineTo(442, 216);
      ctx.lineTo(70, 216);
      ctx.lineTo(40, 186);
      ctx.lineTo(40, 70);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Top corner mini indicator
      ctx.fillStyle = accentColor;
      ctx.fillRect(56, 56, 16, 16);

      // Title Text
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 72px "Chakra Petch", "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, 256, subtitle ? 108 : 128);

      // Subtitle Tag
      if (subtitle) {
        ctx.fillStyle = accentColor;
        ctx.font = 'bold 30px "Plus Jakarta Sans", monospace';
        ctx.fillText(`• ${subtitle.toUpperCase()} •`, 256, 168);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(3.4, 1.7, 1);
      return sprite;
    }

    // --- 5. Central Master AI Quantum Core ---
    const aiCoreGroup = new THREE.Group();
    worldGroup.add(aiCoreGroup);

    // Glass Outer Shield
    const coreGeo = new THREE.IcosahedronGeometry(1.65, 3);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      metalness: 0.15,
      roughness: 0.1,
      transmission: 0.75,
      thickness: 1.4,
      ior: 1.55,
      transparent: true,
      opacity: 0.9
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    aiCoreGroup.add(coreMesh);

    // Quantum Wireframe Inner Core
    const innerGeo = new THREE.IcosahedronGeometry(1.15, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    aiCoreGroup.add(innerMesh);

    // Spinning Concentric Orbital Rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.045, 16, 80),
      new THREE.MeshBasicMaterial({ color: 0x0284c7 })
    );
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.9, 0.035, 16, 80),
      new THREE.MeshBasicMaterial({ color: 0x8b5cf6 })
    );
    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(3.4, 0.025, 16, 80),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
    );
    ring1.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    ring3.rotation.z = Math.PI / 6;
    aiCoreGroup.add(ring1);
    aiCoreGroup.add(ring2);
    aiCoreGroup.add(ring3);

    // AI Core Label Sprite
    const aiLabel = createCyberSprite('AI CORE', 'Foundation LLM', '#0284c7');
    aiLabel.position.set(0, 2.8, 0);
    aiCoreGroup.add(aiLabel);

    // --- 6. Orbiting Labeled Hubs (ML, RAG, NLP, CV) ---
    const nodesData = [
      {
        id: 'RAG',
        label: 'RAG',
        sub: 'Vector Knowledge',
        color: 0x0284c7,
        hexStr: '#0284c7',
        pos: new THREE.Vector3(-5.8, 2.4, 0.5),
        geo: new THREE.OctahedronGeometry(1.0, 0)
      },
      {
        id: 'NLP',
        label: 'NLP',
        sub: 'Adaptive Tutoring',
        color: 0x8b5cf6,
        hexStr: '#8b5cf6',
        pos: new THREE.Vector3(5.8, 2.2, -0.5),
        geo: new THREE.DodecahedronGeometry(0.95, 0)
      },
      {
        id: 'CV',
        label: 'CV',
        sub: 'Spatial Classrooms',
        color: 0x10b981,
        hexStr: '#10b981',
        pos: new THREE.Vector3(-5.0, -3.4, 0.5),
        geo: new THREE.BoxGeometry(1.3, 1.3, 1.3)
      },
      {
        id: 'ML',
        label: 'ML',
        sub: 'Predictive Engine',
        color: 0xf59e0b,
        hexStr: '#f59e0b',
        pos: new THREE.Vector3(5.0, -3.4, 0),
        geo: new THREE.TetrahedronGeometry(1.2, 0)
      }
    ];

    const nodeObjects = [];
    const connectionSplines = [];

    nodesData.forEach((item) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.copy(item.pos);
      worldGroup.add(nodeGroup);

      // Translucent Glossy Crystal
      const mat = new THREE.MeshPhysicalMaterial({
        color: item.color,
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.7,
        thickness: 0.9,
        transparent: true,
        opacity: 0.95
      });
      const mesh = new THREE.Mesh(item.geo, mat);
      nodeGroup.add(mesh);

      // Outer holographic halo ring
      const haloGeo = new THREE.TorusGeometry(1.5, 0.025, 8, 48);
      const haloMesh = new THREE.Mesh(
        haloGeo,
        new THREE.MeshBasicMaterial({ color: item.color, transparent: true, opacity: 0.5 })
      );
      haloMesh.rotation.x = Math.PI / 2;
      nodeGroup.add(haloMesh);

      // Node Cyber Label
      const sprite = createCyberSprite(item.label, item.sub, item.hexStr);
      sprite.position.set(0, 1.7, 0);
      nodeGroup.add(sprite);

      nodeObjects.push({ group: nodeGroup, mesh, haloMesh, item, initialPos: item.pos.clone() });

      // Luminous Connecting Spline to Central AI Core
      const p1 = new THREE.Vector3(0, 0, 0);
      const p2 = item.pos;
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += (Math.random() - 0.5) * 1.5;

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const pts = curve.getPoints(45);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: item.color, transparent: true, opacity: 0.6, linewidth: 2 })
      );
      worldGroup.add(line);

      // Streaming High-Speed Quantum Light Packets (Multiple along line)
      for (let k = 0; k < 2; k++) {
        const pulse = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        worldGroup.add(pulse);
        connectionSplines.push({ curve, pulseMesh: pulse, progress: (k * 0.5 + Math.random() * 0.3) % 1 });
      }
    });

    // Cross-Hub Synapses (RAG <-> NLP and CV <-> ML)
    function addCrossSynapse(pA, pB, colorHex) {
      const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
      mid.z -= 1.6;
      const curve = new THREE.QuadraticBezierCurve3(pA, mid, pB);
      const pts = curve.getPoints(35);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.4 })
      );
      worldGroup.add(line);
      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 10, 10),
        new THREE.MeshBasicMaterial({ color: colorHex })
      );
      worldGroup.add(pulse);
      connectionSplines.push({ curve, pulseMesh: pulse, progress: Math.random() });
    }

    addCrossSynapse(nodesData[0].pos, nodesData[1].pos, 0x38bdf8);
    addCrossSynapse(nodesData[2].pos, nodesData[3].pos, 0x10b981);

    // --- 7. Floating Quantum Particles & Data Matrix ---
    const count = isMobile ? 90 : 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 40;
      pPos[i + 1] = (Math.random() - 0.5) * 26;
      pPos[i + 2] = (Math.random() - 0.5) * 20 - 2;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x0284c7,
      size: 0.18,
      transparent: true,
      opacity: 0.5
    });
    const pMesh = new THREE.Points(pGeo, pMat);
    scene.add(pMesh);

    // --- 8. Mouse & Touch Dragging Parallax ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

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

    // Window Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // --- 9. 60-120 FPS Real-time Render Loop ---
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Core spin
      coreMesh.rotation.y = time * 0.4;
      coreMesh.rotation.x = time * 0.25;
      innerMesh.rotation.y = -time * 0.6;
      ring1.rotation.z = time * 0.5;
      ring2.rotation.x = -time * 0.4;
      ring3.rotation.y = time * 0.35;

      // Hex background drift
      hexGroup.rotation.y = time * 0.05;

      // Nodes individual floating and rotation
      nodeObjects.forEach(({ group, mesh, haloMesh, initialPos }, idx) => {
        mesh.rotation.y = time * 0.65 + idx;
        mesh.rotation.x = time * 0.45 + idx;
        haloMesh.rotation.z = -time * 0.8 + idx;
        group.position.y = initialPos.y + Math.sin(time * 1.8 + idx) * 0.28;
      });

      // Stream data pulses
      connectionSplines.forEach((conn) => {
        conn.progress += delta * 0.5;
        if (conn.progress > 1) conn.progress = 0;
        const pt = conn.curve.getPoint(conn.progress);
        conn.pulseMesh.position.copy(pt);
      });

      // Ambient particle cloud
      pMesh.rotation.y = time * 0.025;

      // Smooth camera interpolation based on scroll
      const scrollRatio = Math.min(scrollY / 1800, 1);
      const targetCamZ = 16 - scrollRatio * 4.5;
      const targetCamY = -scrollRatio * 3.2;

      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;

      // Smooth world orbit
      worldGroup.rotation.y += (targetRotY + mouseX * 0.28 - worldGroup.rotation.y) * 0.06;
      worldGroup.rotation.x += (targetRotX + mouseY * 0.18 - worldGroup.rotation.x) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

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
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-auto z-0 overflow-hidden select-none bg-gradient-to-b from-slate-100 via-sky-50/50 to-slate-100"
      title="360° Drag & Orbit AI Neural Constellation"
    />
  );
}
