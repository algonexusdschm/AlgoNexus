import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * AiUniverse3D
 * Live Operational 3D AI Matrix:
 * - 📸 CV Hub: Scanning a holographic image with moving laser mesh & bounding box
 * - 💻 ML Hub: High-speed neural training simulation on an edge silicon GPU chip with animated gradient loss curve
 * - 🧠 AI Core: Generating real-time holographic code, mathematics & synthetic data particles
 * - 📚 RAG Hub: 3D vector retrieval searching through stacked holographic knowledge documents
 * - 💬 NLP Hub: Live tokenization & transformer attention arcs streaming linguistic tokens
 * - Interactive 360° drag + mouse parallax + smooth scroll flight
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
    scene.fog = new THREE.FogExp2(0xf1f5f9, 0.02);

    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 16.5);

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

    // --- 2. Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
    keyLight.position.set(12, 22, 16);
    scene.add(keyLight);

    const cyanLaser = new THREE.PointLight(0x0284c7, 3.5, 35);
    cyanLaser.position.set(-10, 5, 4);
    scene.add(cyanLaser);

    const violetLaser = new THREE.PointLight(0x7c3aed, 3.5, 35);
    violetLaser.position.set(10, -4, 4);
    scene.add(violetLaser);

    // Clean Cyber Grid Floor
    const gridHelper = new THREE.GridHelper(80, 50, 0x0284c7, 0xe2e8f0);
    gridHelper.position.y = -7.5;
    scene.add(gridHelper);

    // --- 3. Master World Group ---
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Helper: Canvas-rendered 3D Label Badge
    function createBadge(title, subtitle, badgeColor = '#0284c7') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = badgeColor;
      ctx.lineWidth = 6;
      ctx.shadowColor = badgeColor;
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.roundRect(40, 40, 432, 176, 28);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = badgeColor;
      ctx.beginPath();
      ctx.arc(80, 84, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 64px "Chakra Petch", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(title, 110, 96);

      ctx.fillStyle = badgeColor;
      ctx.font = 'bold 28px "Plus Jakarta Sans", monospace';
      ctx.fillText(subtitle.toUpperCase(), 80, 166);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(3.4, 1.7, 1);
      return sprite;
    }

    // =========================================================================
    // 🧠 1. CENTRAL AI MASTER CORE — Real-time Generation
    // =========================================================================
    const aiGroup = new THREE.Group();
    worldGroup.add(aiGroup);

    // Glowing Generative Core
    const aiCoreGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const aiCoreMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transmission: 0.8,
      thickness: 1.2,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9
    });
    const aiCoreMesh = new THREE.Mesh(aiCoreGeo, aiCoreMat);
    aiGroup.add(aiCoreMesh);

    // Wireframe Synth Core
    const aiInnerMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.1, 1),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true })
    );
    aiGroup.add(aiInnerMesh);

    // Concentric Gyroscope Rings
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.04, 16, 64), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.03, 16, 64), new THREE.MeshBasicMaterial({ color: 0x7c3aed }));
    ring1.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    aiGroup.add(ring1);
    aiGroup.add(ring2);

    // Swirling Generated Code / Syntax Particles radiating outward
    const genCount = 35;
    const genGeo = new THREE.BufferGeometry();
    const genPos = new Float32Array(genCount * 3);
    for (let i = 0; i < genCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const r = 2.0 + Math.random() * 1.8;
      genPos[i] = Math.cos(angle) * r;
      genPos[i + 1] = (Math.random() - 0.5) * 1.5;
      genPos[i + 2] = Math.sin(angle) * r;
    }
    genGeo.setAttribute('position', new THREE.BufferAttribute(genPos, 3));
    const genParticles = new THREE.Points(
      genGeo,
      new THREE.PointsMaterial({ color: 0x0284c7, size: 0.22, transparent: true, opacity: 0.85 })
    );
    aiGroup.add(genParticles);

    const aiBadge = createBadge('AI CORE', 'Generating Synthetic Logic', '#0284c7');
    aiBadge.position.set(0, 3.2, 0);
    aiGroup.add(aiBadge);

    // =========================================================================
    // 📸 2. COMPUTER VISION (CV) — Scanning an Image with Laser Bounding Box
    // =========================================================================
    const cvGroup = new THREE.Group();
    cvGroup.position.set(-6.2, -2.8, 0.8);
    worldGroup.add(cvGroup);

    // Holographic Photo Plane being scanned
    const photoCanvas = document.createElement('canvas');
    photoCanvas.width = 256;
    photoCanvas.height = 256;
    const pCtx = photoCanvas.getContext('2d');
    pCtx.fillStyle = '#0f172a';
    pCtx.fillRect(0, 0, 256, 256);
    pCtx.strokeStyle = '#38bdf8';
    pCtx.lineWidth = 4;
    pCtx.strokeRect(20, 20, 216, 216);
    // Student face silhouette
    pCtx.fillStyle = '#38bdf8';
    pCtx.beginPath();
    pCtx.arc(128, 90, 40, 0, Math.PI * 2);
    pCtx.fill();
    pCtx.beginPath();
    pCtx.arc(128, 200, 65, Math.PI, 0);
    pCtx.fill();
    const photoTexture = new THREE.CanvasTexture(photoCanvas);

    const photoPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 2.2),
      new THREE.MeshBasicMaterial({ map: photoTexture, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    cvGroup.add(photoPlane);

    // CV Cyan Laser Scanning Beam
    const scanLineGeo = new THREE.BoxGeometry(2.4, 0.05, 0.05);
    const scanLineMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const scanLine = new THREE.Mesh(scanLineGeo, scanLineMat);
    cvGroup.add(scanLine);

    // Bounding Box Reticle
    const boxGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.7, -0.7, 0.1), new THREE.Vector3(0.7, -0.7, 0.1),
      new THREE.Vector3(0.7, 0.7, 0.1), new THREE.Vector3(-0.7, 0.7, 0.1),
      new THREE.Vector3(-0.7, -0.7, 0.1)
    ]);
    const boundingBox = new THREE.Line(boxGeo, new THREE.LineBasicMaterial({ color: 0x0284c7, linewidth: 2 }));
    cvGroup.add(boundingBox);

    const cvBadge = createBadge('CV', 'Object Detection & OCR', '#0284c7');
    cvBadge.position.set(0, 2.2, 0);
    cvGroup.add(cvBadge);

    // =========================================================================
    // 💻 3. MACHINE LEARNING (ML) — Training Neural Device & Loss Gradient
    // =========================================================================
    const mlGroup = new THREE.Group();
    mlGroup.position.set(6.2, -2.8, 0.5);
    worldGroup.add(mlGroup);

    // Silicon Neural Chip substrate
    const chipGeo = new THREE.BoxGeometry(2.4, 0.35, 2.4);
    const chipMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.2
    });
    const chipMesh = new THREE.Mesh(chipGeo, chipMat);
    chipMesh.rotation.x = Math.PI / 6;
    mlGroup.add(chipMesh);

    // Glowing Golden Silicon Die
    const dieMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.42, 1.2),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    );
    dieMesh.rotation.x = Math.PI / 6;
    mlGroup.add(dieMesh);

    // Loss Gradient Curve (Descending Line showing model training convergence)
    const lossPts = [];
    for (let i = 0; i < 20; i++) {
      const x = (i / 19) * 2.2 - 1.1;
      const y = Math.exp(-i * 0.22) * 1.2 - 0.2;
      lossPts.push(new THREE.Vector3(x, y + 1.2, 0));
    }
    const lossLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(lossPts),
      new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 3 })
    );
    mlGroup.add(lossLine);

    const mlBadge = createBadge('ML', 'Neural Model Training', '#f59e0b');
    mlBadge.position.set(0, 2.2, 0);
    mlGroup.add(mlBadge);

    // =========================================================================
    // 📚 4. RAG (Vector Knowledge Base) — Indexing Document Vectors
    // =========================================================================
    const ragGroup = new THREE.Group();
    ragGroup.position.set(-6.0, 2.8, 0);
    worldGroup.add(ragGroup);

    // Stacked Floating Holographic Document Slates
    const docMeshes = [];
    for (let d = 0; d < 3; d++) {
      const docGeo = new THREE.BoxGeometry(1.8, 0.04, 1.4);
      const docMat = new THREE.MeshPhysicalMaterial({
        color: 0x0284c7,
        transmission: 0.7,
        transparent: true,
        opacity: 0.85
      });
      const doc = new THREE.Mesh(docGeo, docMat);
      doc.position.y = (d - 1) * 0.45;
      ragGroup.add(doc);
      docMeshes.push(doc);
    }

    // Vector Embedding Search Cone / Probe
    const probeGeo = new THREE.ConeGeometry(0.35, 0.9, 16);
    const probeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    const probeMesh = new THREE.Mesh(probeGeo, probeMat);
    probeMesh.rotation.x = Math.PI;
    probeMesh.position.y = 1.0;
    ragGroup.add(probeMesh);

    const ragBadge = createBadge('RAG', 'Vector Embeddings & Search', '#0284c7');
    ragBadge.position.set(0, 2.2, 0);
    ragGroup.add(ragBadge);

    // =========================================================================
    // 💬 5. NLP (Natural Language Processing) — Attention Head & Token Stream
    // =========================================================================
    const nlpGroup = new THREE.Group();
    nlpGroup.position.set(6.0, 2.8, 0);
    worldGroup.add(nlpGroup);

    // Central Multi-Head Attention Polyhedron
    const nlpMesh = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.0, 0),
      new THREE.MeshPhysicalMaterial({
        color: 0x7c3aed,
        transmission: 0.7,
        roughness: 0.15,
        transparent: true,
        opacity: 0.9
      })
    );
    nlpGroup.add(nlpMesh);

    // Orbiting Floating Tokens (Linguistic data cubes)
    const tokenCubes = [];
    for (let t = 0; t < 4; t++) {
      const tMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.35, 0.35),
        new THREE.MeshBasicMaterial({ color: 0x8b5cf6 })
      );
      nlpGroup.add(tMesh);
      tokenCubes.push({ mesh: tMesh, angleOffset: (t * Math.PI) / 2 });
    }

    const nlpBadge = createBadge('NLP', 'Multimodal Transformer', '#7c3aed');
    nlpBadge.position.set(0, 2.2, 0);
    nlpGroup.add(nlpBadge);

    // =========================================================================
    // ⚡ INTERCONNECTED SYNAPTIC ARCS & DATA CABLES
    // =========================================================================
    const hubPositions = [
      { pos: cvGroup.position, color: 0x0284c7 },
      { pos: mlGroup.position, color: 0xf59e0b },
      { pos: ragGroup.position, color: 0x0284c7 },
      { pos: nlpGroup.position, color: 0x7c3aed }
    ];

    const splineCables = [];
    hubPositions.forEach((hub) => {
      const p1 = new THREE.Vector3(0, 0, 0);
      const p2 = hub.pos;
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += (Math.random() - 0.5) * 1.5;

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const pts = curve.getPoints(40);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: hub.color, transparent: true, opacity: 0.5, linewidth: 2 })
      );
      worldGroup.add(line);

      // Data pulse packet
      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      worldGroup.add(pulse);
      splineCables.push({ curve, pulseMesh: pulse, progress: Math.random() });
    });

    // Cross synapses: RAG <-> NLP and CV <-> ML
    function addCrossCable(pA, pB, col) {
      const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
      mid.z -= 1.4;
      const curve = new THREE.QuadraticBezierCurve3(pA, mid, pB);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(30)),
        new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.35 })
      );
      worldGroup.add(line);
      const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: col }));
      worldGroup.add(pulse);
      splineCables.push({ curve, pulseMesh: pulse, progress: Math.random() });
    }
    addCrossCable(ragGroup.position, nlpGroup.position, 0x0284c7);
    addCrossCable(cvGroup.position, mlGroup.position, 0xf59e0b);

    // =========================================================================
    // 🖱️ MOUSE, TOUCH DRAGGING & SCROLL INTERACTION
    // =========================================================================
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

    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // =========================================================================
    // 🔄 REAL-TIME ANIMATION LOOP (60-120 FPS)
    // =========================================================================
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // 1. AI Core Animations (Generation)
      aiCoreMesh.rotation.y = time * 0.4;
      aiCoreMesh.rotation.x = time * 0.25;
      aiInnerMesh.rotation.y = -time * 0.6;
      ring1.rotation.z = time * 0.5;
      ring2.rotation.x = -time * 0.4;
      genParticles.rotation.y = time * 0.3;

      // 2. CV Scanning Laser Motion
      scanLine.position.y = Math.sin(time * 3.0) * 1.0;
      boundingBox.scale.setScalar(0.95 + Math.sin(time * 4.0) * 0.08);

      // 3. ML Training Chip & Loss Pulse
      dieMesh.scale.y = 1.0 + Math.sin(time * 6.0) * 0.15; // Chip clock frequency pulse
      chipMesh.rotation.z = Math.sin(time * 1.2) * 0.08;

      // 4. RAG Document Indexing Search
      docMeshes.forEach((doc, idx) => {
        doc.rotation.y = Math.sin(time * 1.5 + idx) * 0.15;
      });
      probeMesh.position.y = 1.0 + Math.sin(time * 2.5) * 0.35;

      // 5. NLP Transformer Attention Heads & Orbiting Tokens
      nlpMesh.rotation.y = time * 0.6;
      nlpMesh.rotation.x = time * 0.35;
      tokenCubes.forEach(({ mesh, angleOffset }) => {
        const curAngle = time * 1.8 + angleOffset;
        mesh.position.x = Math.cos(curAngle) * 1.4;
        mesh.position.z = Math.sin(curAngle) * 1.4;
        mesh.rotation.y = time * 2;
      });

      // 6. Spline Data Cable Pulses
      splineCables.forEach((cable) => {
        cable.progress += delta * 0.55;
        if (cable.progress > 1) cable.progress = 0;
        cable.pulseMesh.position.copy(cable.curve.getPoint(cable.progress));
      });

      // Camera Scroll Drift & World Orbit
      const scrollRatio = Math.min(scrollY / 1800, 1);
      const targetCamZ = 16.5 - scrollRatio * 4.5;
      const targetCamY = -scrollRatio * 3.2;

      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;

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
      className="fixed inset-0 pointer-events-auto z-0 overflow-hidden select-none bg-gradient-to-b from-slate-100 via-sky-50/40 to-slate-100"
      title="360° Drag & Orbit Live AI Operations Matrix"
    >
      {/* Background Architectural Canvas */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-multiply pointer-events-none scale-105"
        style={{ backgroundImage: "url('/images/edutech_cyber_atrium_2050.jpg')" }}
      />
    </div>
  );
}
