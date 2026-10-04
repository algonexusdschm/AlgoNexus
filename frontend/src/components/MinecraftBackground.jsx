import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function MinecraftBackground() {
  const canvasRef = useRef(null);
  const bgImageRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Renderer & Scene Setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060a05, 0.030);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 16);

    // Ambient fill — warm ivory matching hall's ambient glow
    const ambientLight = new THREE.AmbientLight(0x1c1a0e, 1.4);
    scene.add(ambientLight);

    // Primary emerald rune glow (floor centre)
    const emeraldLight = new THREE.PointLight(0x22c55e, 4.0, 50);
    emeraldLight.position.set(0, -4, 10);
    scene.add(emeraldLight);

    // Left stained-glass warm gold beam
    const goldBeamLeft = new THREE.PointLight(0xd97706, 3.5, 40);
    goldBeamLeft.position.set(-10, 6, 8);
    scene.add(goldBeamLeft);

    // Right stained-glass warm gold beam
    const goldBeamRight = new THREE.PointLight(0xca8a04, 3.0, 38);
    goldBeamRight.position.set(10, 6, 8);
    scene.add(goldBeamRight);

    // ═══════════════════════════════════════════════════════════
    // 1. 3D SWIRLING ARCANE PARTICLES & COSMIC EMBERS (1,500)
    // ═══════════════════════════════════════════════════════════
    function createGlowParticleTexture() {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(254, 240, 138, 0.85)');
      grad.addColorStop(0.7, 'rgba(245, 158, 11, 0.4)');
      grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }

    const particleCount = 1400;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const particleData = [];

    const emeraldColor = new THREE.Color(0x22c55e);
    const goldColor    = new THREE.Color(0xd97706);
    const amberColor   = new THREE.Color(0xfbbf24);
    const paleGold     = new THREE.Color(0xfde68a);

    for (let i = 0; i < particleCount; i++) {
      // 55% emerald rune sparks (rising from floor), 45% gold/amber window motes
      const isEmerald = i % 20 < 11;
      let x, y, z;

      if (isEmerald) {
        // Concentrate rune sparks near center-floor, rising upward
        x = (Math.random() - 0.5) * 18;
        y = -12 + Math.random() * 20;
        z = -2 + Math.random() * 10;
      } else {
        // Golden light motes drifting from the tall windows (flanks)
        x = (Math.random() - 0.5) * 34;
        y = -4 + Math.random() * 18;
        z = -6 + Math.random() * 10;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      let color;
      if (isEmerald) {
        color = Math.random() > 0.45 ? emeraldColor : amberColor;
      } else {
        color = Math.random() > 0.5 ? goldColor : paleGold;
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      particleData.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        speedY: 0.015 + Math.random() * 0.025,
        spiralSpeed: 0.8 + Math.random() * 1.5,
        spiralRadius: 0.15 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      map: createGlowParticleTexture(),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ═══════════════════════════════════════════════════════════
    // 3. PROCEDURAL ELDRITCH RUNES & SACRED GEOMETRY (3D ROTATING)
    // ═══════════════════════════════════════════════════════════
    // Procedural texture for the outer runic ring with Elder Futhark & ciphers
    function createRunicRingTexture() {
      const size = 1024;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      const cx = size / 2;
      const cy = size / 2;

      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 14;

      // 1. Concentric boundary circles
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.44, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.36, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Outer Celestial Degree Ticks (72 ticks)
      for (let i = 0; i < 72; i++) {
        const angle = (i / 72) * Math.PI * 2;
        const isMajor = i % 6 === 0;
        const r1 = size * 0.46;
        const r2 = isMajor ? size * 0.42 : size * 0.445;
        ctx.strokeStyle = isMajor ? '#fbbf24' : '#10b981';
        ctx.lineWidth = isMajor ? 2.5 : 1.2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
        ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
        ctx.stroke();
      }

      // 3. Elder Futhark & Arcane Glyphs along circumference (28 runes)
      const RUNES = [
        '᚛', 'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ',
        'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛈ', 'ᛇ', 'ᛉ',
        'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ',
        'ᛟ', '✦', '✧', '⛤'
      ];
      ctx.font = `bold ${Math.round(size * 0.045)}px "Segoe UI Symbol", "Apple Symbols", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#6ee7b7';

      const runeRadius = size * 0.40;
      for (let i = 0; i < RUNES.length; i++) {
        const angle = (i / RUNES.length) * Math.PI * 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillText(RUNES[i], 0, -runeRadius);
        ctx.restore();
      }

      // 4. Inner Dotted Orbit
      ctx.setLineDash([5, 9]);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      return tex;
    }

    // Procedural texture for sacred geometry (8-pointed Latverian star & hexagram)
    function createSacredGeoTexture() {
      const size = 1024;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      const cx = size / 2;
      const cy = size / 2;

      ctx.shadowColor = '#059669';
      ctx.shadowBlur = 12;

      // 1. Overlapping squares (8-Pointed Star of Sorcery)
      const starRadius = size * 0.32;
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2.8;
      for (let offset = 0; offset < 2; offset++) {
        const baseAngle = (offset * Math.PI) / 4;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const a = baseAngle + (i * Math.PI) / 2;
          const x = cx + Math.cos(a) * starRadius;
          const y = cy + Math.sin(a) * starRadius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // 2. Interlocking Equilateral Triangles (Hexagram)
      const hexRadius = size * 0.28;
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.0;
      for (let tri = 0; tri < 2; tri++) {
        const startAngle = tri * Math.PI;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const a = startAngle + (i * 2 * Math.PI) / 3;
          const x = cx + Math.cos(a) * hexRadius;
          const y = cy + Math.sin(a) * hexRadius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // 3. Radial Spoke Beams to 8 star vertices
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.4;
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * starRadius, cy + Math.sin(a) * starRadius);
        ctx.stroke();
      }

      // 4. Bounding circle around the star
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, starRadius, 0, Math.PI * 2);
      ctx.stroke();

      // 5. Glowing Nodes on Star Vertices
      ctx.fillStyle = '#6ee7b7';
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * starRadius, cy + Math.sin(a) * starRadius, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      return tex;
    }

    // Procedural texture for the inner core sigil (Diamond Eye / Nexus Crest)
    function createInnerCoreTexture() {
      const size = 1024;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      const cx = size / 2;
      const cy = size / 2;

      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 18;

      // 1. Center Radiant Core
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.28, 'rgba(110, 231, 183, 0.75)');
      grad.addColorStop(0.65, 'rgba(16, 185, 129, 0.35)');
      grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // 2. Inner Ring with 12 Celestial Hash Marks
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.15, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const r1 = size * 0.15;
        const r2 = size * 0.11;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
        ctx.stroke();
      }

      // 3. Central Mystic Diamond
      ctx.strokeStyle = '#ecfdf5';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - size * 0.08);
      ctx.lineTo(cx + size * 0.06, cy);
      ctx.lineTo(cx, cy + size * 0.08);
      ctx.lineTo(cx - size * 0.06, cy);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();

      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      return tex;
    }

    // Procedural texture for floating orbital seals (flanking shields)
    function createFloatingSealTexture() {
      const size = 1024;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      const cx = size / 2;
      const cy = size / 2;

      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 14;

      // Outer rings
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.44, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.38, 0, Math.PI * 2);
      ctx.stroke();

      // Glyphs
      const SEAL_RUNES = ['ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᛃ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛟ'];
      ctx.font = `bold ${Math.round(size * 0.048)}px "Segoe UI Symbol", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#a7f3d0';

      const rRune = size * 0.41;
      for (let i = 0; i < SEAL_RUNES.length; i++) {
        const a = (i / SEAL_RUNES.length) * Math.PI * 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(a + Math.PI / 2);
        ctx.fillText(SEAL_RUNES[i], 0, -rRune);
        ctx.restore();
      }

      // Hexagram
      const hexR = size * 0.30;
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.5;
      for (let tri = 0; tri < 2; tri++) {
        const startA = tri * Math.PI;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const a = startA + (i * 2 * Math.PI) / 3;
          const x = cx + Math.cos(a) * hexR;
          const y = cy + Math.sin(a) * hexR;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Inner Core Ring & Radiant Node
      ctx.strokeStyle = '#6ee7b7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.16, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx, cy, 9, 0, Math.PI * 2);
      ctx.fill();

      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      return tex;
    }

    // --- INSTANTIATE 3D RUNES ---
    // A. Floor Central Great Seal (3 Concentric Counter-Rotating Planes)
    const floorRuneGeo = new THREE.PlaneGeometry(13.5, 13.5);

    const runeOuterTex = createRunicRingTexture();
    const runeGeoTex = createSacredGeoTexture();
    const runeCoreTex = createInnerCoreTexture();
    const sealTex = createFloatingSealTexture();

    const runeOuterMat = new THREE.MeshBasicMaterial({
      map: runeOuterTex,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const runeOuterMesh = new THREE.Mesh(floorRuneGeo, runeOuterMat);
    runeOuterMesh.position.set(0, -3.7, 4.0);
    runeOuterMesh.rotation.set(1.24, 0, 0);
    scene.add(runeOuterMesh);

    const runeGeoMat = new THREE.MeshBasicMaterial({
      map: runeGeoTex,
      transparent: true,
      opacity: 0.50,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const runeGeoMesh = new THREE.Mesh(floorRuneGeo, runeGeoMat);
    runeGeoMesh.position.set(0, -3.68, 4.02);
    runeGeoMesh.rotation.set(1.24, 0, 0);
    scene.add(runeGeoMesh);

    const runeCoreMat = new THREE.MeshBasicMaterial({
      map: runeCoreTex,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const runeCoreMesh = new THREE.Mesh(floorRuneGeo, runeCoreMat);
    runeCoreMesh.position.set(0, -3.66, 4.04);
    runeCoreMesh.rotation.set(1.24, 0, 0);
    scene.add(runeCoreMesh);

    // B. Flanking Floating Eldritch Seals (Mid-air mystical wards)
    const floatingSealGeo = new THREE.PlaneGeometry(5.2, 5.2);

    const sealMatLeft = new THREE.MeshBasicMaterial({
      map: sealTex,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const leftSealMesh = new THREE.Mesh(floatingSealGeo, sealMatLeft);
    leftSealMesh.position.set(-8.8, 3.2, 1.2);
    leftSealMesh.rotation.set(0.18, 0.42, 0);
    scene.add(leftSealMesh);

    const sealMatRight = new THREE.MeshBasicMaterial({
      map: sealTex,
      transparent: true,
      opacity: 0.40,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const rightSealMesh = new THREE.Mesh(floatingSealGeo, sealMatRight);
    rightSealMesh.position.set(9.0, 2.6, 0.8);
    rightSealMesh.rotation.set(-0.16, -0.40, 0);
    scene.add(rightSealMesh);

    // C. Energy Containment Rings (Harmonized Torus boundary rings)
    const ringGeo1 = new THREE.TorusGeometry(3.6, 0.04, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const riftRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    riftRing1.position.set(0, -3.6, 4.0);
    riftRing1.rotation.set(1.24, 0.05, 0);
    scene.add(riftRing1);

    const ringGeo2 = new THREE.TorusGeometry(5.8, 0.035, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x16a34a,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
    });
    const riftRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    riftRing2.position.set(0, -3.75, 3.9);
    riftRing2.rotation.set(1.24, -0.05, 0);
    scene.add(riftRing2);

    // ═══════════════════════════════════════════════════════════
    // 4. FLOATING SORCERER CHARACTER & ROTATING HAND RUNES
    // ═══════════════════════════════════════════════════════════
    const characterGroup = new THREE.Group();
    characterGroup.position.set(0, 1.4, 0.4);
    scene.add(characterGroup);

    // Sorcerer Texture with Soft Radial Feathering & High Contrast
    const sorcererCanvas = document.createElement('canvas');
    sorcererCanvas.width = 1024;
    sorcererCanvas.height = 1024;
    const sorcererTex = new THREE.CanvasTexture(sorcererCanvas);
    sorcererTex.minFilter = THREE.LinearMipmapLinearFilter;

    const sorcererImg = new Image();
    sorcererImg.src = '/images/floating_sorcerer.jpg';
    sorcererImg.onload = () => {
      const sCtx = sorcererCanvas.getContext('2d');
      // Boost contrast and vibrancy to make the character bold and prominent behind text
      sCtx.filter = 'contrast(1.28) saturate(1.35) brightness(1.12)';
      sCtx.drawImage(sorcererImg, 0, 0, 1024, 1024);
      sCtx.filter = 'none';

      // Soft elliptical feather mask to blend character smoothly into space while keeping the core 100% solid
      sCtx.globalCompositeOperation = 'destination-in';
      const maskGrad = sCtx.createRadialGradient(512, 512, 280, 512, 512, 505);
      maskGrad.addColorStop(0, 'rgba(0,0,0,1)');
      maskGrad.addColorStop(0.72, 'rgba(0,0,0,1)');
      maskGrad.addColorStop(0.92, 'rgba(0,0,0,0.5)');
      maskGrad.addColorStop(1, 'rgba(0,0,0,0)');
      sCtx.fillStyle = maskGrad;
      sCtx.fillRect(0, 0, 1024, 1024);

      sorcererTex.needsUpdate = true;
    };

    const characterGeo = new THREE.PlaneGeometry(8.8, 8.8);
    const characterMat = new THREE.MeshBasicMaterial({
      map: sorcererTex,
      transparent: true,
      opacity: 1.0, // Bold and vibrant
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const characterMesh = new THREE.Mesh(characterGeo, characterMat);
    characterGroup.add(characterMesh);

    // Arcane Aura Halo behind character
    function createAuraTexture() {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.45)');
      grad.addColorStop(0.4, 'rgba(217, 119, 6, 0.25)');
      grad.addColorStop(0.75, 'rgba(5, 150, 105, 0.10)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(c);
    }
    const auraTex = createAuraTexture();
    const auraGeo = new THREE.PlaneGeometry(10.5, 10.5);
    const auraMat = new THREE.MeshBasicMaterial({
      map: auraTex,
      transparent: true,
      opacity: 0.60,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    auraMesh.position.set(0, 0, -0.1);
    characterGroup.add(auraMesh);

    // ── ROTATING RUNES IN HANDS ──
    // Right Hand (Screen Left: Casting Radiant Golden Mandala)
    const rightHandGroup = new THREE.Group();
    rightHandGroup.position.set(-2.0, 1.45, 0.12);
    characterGroup.add(rightHandGroup);

    const handRuneGeo1 = new THREE.PlaneGeometry(2.9, 2.9);
    const handRuneMat1 = new THREE.MeshBasicMaterial({
      map: runeOuterTex,
      color: 0xfef08a,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const rightHandRuneOuter = new THREE.Mesh(handRuneGeo1, handRuneMat1);
    rightHandGroup.add(rightHandRuneOuter);

    const handRuneGeo2 = new THREE.PlaneGeometry(2.5, 2.5);
    const handRuneMat2 = new THREE.MeshBasicMaterial({
      map: runeGeoTex,
      color: 0x34d399,
      transparent: true,
      opacity: 0.80,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const rightHandRuneInner = new THREE.Mesh(handRuneGeo2, handRuneMat2);
    rightHandGroup.add(rightHandRuneInner);

    // Left Hand (Screen Right: Projecting Arcane Shield)
    const leftHandGroup = new THREE.Group();
    leftHandGroup.position.set(2.3, 1.15, 0.12);
    characterGroup.add(leftHandGroup);

    const handRuneGeo3 = new THREE.PlaneGeometry(2.4, 2.4);
    const handRuneMat3 = new THREE.MeshBasicMaterial({
      map: sealTex,
      color: 0x6ee7b7,
      transparent: true,
      opacity: 0.70,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const leftHandRuneOuter = new THREE.Mesh(handRuneGeo3, handRuneMat3);
    leftHandGroup.add(leftHandRuneOuter);

    const handRuneGeo4 = new THREE.PlaneGeometry(1.8, 1.8);
    const handRuneMat4 = new THREE.MeshBasicMaterial({
      map: runeCoreTex,
      color: 0xfde047,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const leftHandRuneInner = new THREE.Mesh(handRuneGeo4, handRuneMat4);
    leftHandGroup.add(leftHandRuneInner);

    // ═══════════════════════════════════════════════════════════
    // 5. 3D FLOATING ELDRITCH RUNE CHARACTERS (GLYPHS)
    // ═══════════════════════════════════════════════════════════
    const GLYPH_CHARS = ['᚛', 'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛈ', 'ᛇ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ', '✦', '✧', '⛤'];
    
    function createGlyphTextures() {
      const textures = [];
      const colors = ['#6ee7b7', '#34d399', '#fde047', '#fbbf24', '#a7f3d0'];
      for (let i = 0; i < 10; i++) {
        const c = document.createElement('canvas');
        c.width = 128;
        c.height = 128;
        const ctx = c.getContext('2d');
        const char = GLYPH_CHARS[i % GLYPH_CHARS.length];
        const color = colors[i % colors.length];

        ctx.shadowColor = color;
        ctx.shadowBlur = 16;
        ctx.font = 'bold 74px "Segoe UI Symbol", "Apple Symbols", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = color;
        ctx.fillText(char, 64, 64);

        const tex = new THREE.CanvasTexture(c);
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        textures.push(tex);
      }
      return textures;
    }

    const glyphTextures = createGlyphTextures();
    const floatingGlyphs = [];
    const glyphGeo = new THREE.PlaneGeometry(0.85, 0.85);

    for (let i = 0; i < 45; i++) {
      const tex = glyphTextures[i % glyphTextures.length];
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const glyphMesh = new THREE.Mesh(glyphGeo, mat);

      const x = (Math.random() - 0.5) * 22;
      const y = -7 + Math.random() * 18;
      const z = -2 + Math.random() * 10;

      glyphMesh.position.set(x, y, z);
      const scale = 0.6 + Math.random() * 0.7;
      glyphMesh.scale.set(scale, scale, 1);

      glyphMesh.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        speedY: 0.018 + Math.random() * 0.025,
        swayAmp: 0.3 + Math.random() * 0.6,
        swaySpeed: 0.8 + Math.random() * 1.4,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        pulseSpeed: 1.2 + Math.random() * 1.8,
        baseOpacity: 0.45 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2
      };

      scene.add(glyphMesh);
      floatingGlyphs.push(glyphMesh);
    }

    // ═══════════════════════════════════════════════════════════
    // INTERACTIVE MOUSE PARALLAX
    // ═══════════════════════════════════════════════════════════
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Window Resize Handler
    const handleResize = () => {
      if (!canvas) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ═══════════════════════════════════════════════════════════
    // ANIMATION RENDER LOOP (60 FPS)
    // ═══════════════════════════════════════════════════════════
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Parallax camera tilt
      camera.position.x = targetX * 1.5;
      camera.position.y = -targetY * 1.0;
      camera.lookAt(0, 0, 0);

      // Wallpaper 2.5D Parallax Shift
      if (bgImageRef.current) {
        bgImageRef.current.style.transform = `scale(1.06) translate(${targetX * -14}px, ${targetY * -10}px)`;
      }

      // Swirl & Ascend Arcane Particles
      const posAttr = particleGeo.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const p = particleData[i];
        let py = posAttr.getY(i) + p.speedY;
        if (py > 15) {
          py = -12;
        }
        posAttr.setY(i, py);

        // Helical spiral drift
        const px = p.baseX + Math.sin(elapsed * p.spiralSpeed + p.phase) * p.spiralRadius;
        const pz = p.baseZ + Math.cos(elapsed * p.spiralSpeed + p.phase) * p.spiralRadius;
        posAttr.setX(i, px);
        posAttr.setZ(i, pz);
      }
      posAttr.needsUpdate = true;

      // Incursion Ring Ripples
      riftRing1.rotation.z += 0.004;
      riftRing1.scale.setScalar(1 + Math.sin(elapsed * 1.2) * 0.08);

      riftRing2.rotation.z -= 0.003;
      riftRing2.scale.setScalar(1 + Math.cos(elapsed * 1.0) * 0.06);

      // ═══════════════════════════════════════════════════════════
      // ROTATE & PULSE 3D ELDRITCH RUNES
      // ═══════════════════════════════════════════════════════════
      // 1. Central Great Seal Multi-Layer Counter-Rotation
      runeOuterMesh.rotation.z += 0.0024;
      runeGeoMesh.rotation.z -= 0.0034;
      runeCoreMesh.rotation.z += 0.0055;

      // Gentle vertical breathing hover
      const runeBob = Math.sin(elapsed * 0.8) * 0.06;
      runeOuterMesh.position.y = -3.7 + runeBob;
      runeGeoMesh.position.y = -3.68 + runeBob;
      runeCoreMesh.position.y = -3.66 + runeBob;
      riftRing1.position.y = -3.6 + runeBob;
      riftRing2.position.y = -3.75 + runeBob;

      // Luminescent breathing pulses
      runeOuterMat.opacity = 0.52 + Math.sin(elapsed * 1.5) * 0.10;
      runeGeoMat.opacity = 0.48 + Math.cos(elapsed * 1.9) * 0.08;
      runeCoreMat.opacity = 0.62 + Math.sin(elapsed * 2.3) * 0.12;

      // Mouse parallax yaw response
      runeOuterMesh.rotation.y = targetX * 0.06;
      runeGeoMesh.rotation.y = targetX * 0.06;
      runeCoreMesh.rotation.y = targetX * 0.06;

      // 2. Flanking Floating Eldritch Orbital Seals
      leftSealMesh.rotation.z -= 0.0022;
      leftSealMesh.position.y = 3.2 + Math.sin(elapsed * 1.1) * 0.22;
      leftSealMesh.rotation.y = 0.42 + targetX * 0.12;
      sealMatLeft.opacity = 0.40 + Math.sin(elapsed * 1.4) * 0.08;

      rightSealMesh.rotation.z += 0.0026;
      rightSealMesh.position.y = 2.6 + Math.cos(elapsed * 0.95) * 0.20;
      rightSealMesh.rotation.y = -0.40 + targetX * 0.12;
      sealMatRight.opacity = 0.38 + Math.cos(elapsed * 1.3) * 0.08;

      // ═══════════════════════════════════════════════════════════
      // 3. CENTERED MAJESTIC LEVITATING SORCERER & ROTATING RUNES
      // ═══════════════════════════════════════════════════════════
      // Centered levitation & gentle breathing hover in the middle
      const charBob = Math.sin(elapsed * 1.1) * 0.22;
      characterGroup.position.x = targetX * 1.2;
      characterGroup.position.y = 1.4 + charBob;
      characterGroup.position.z = 0.4;
      characterGroup.rotation.y = targetX * 0.12;
      characterGroup.rotation.z = Math.sin(elapsed * 0.8) * 0.025;
      characterGroup.rotation.x = Math.sin(elapsed * 0.6) * 0.02;

      // Pulse aura with motion
      auraMat.opacity = 0.58 + Math.sin(elapsed * 1.8) * 0.18;
      auraMesh.scale.setScalar(1 + Math.sin(elapsed * 1.4) * 0.07);
      auraMesh.rotation.z += 0.0025;

      // Right Hand Runes (Clockwise outer, counter-clockwise inner)
      rightHandRuneOuter.rotation.z += 0.015;
      rightHandRuneInner.rotation.z -= 0.022;
      handRuneMat1.opacity = 0.76 + Math.sin(elapsed * 2.8) * 0.15;

      // Left Hand Runes (Counter-clockwise outer, clockwise inner)
      leftHandRuneOuter.rotation.z -= 0.012;
      leftHandRuneInner.rotation.z += 0.018;
      handRuneMat3.opacity = 0.72 + Math.cos(elapsed * 2.5) * 0.15;

      // ═══════════════════════════════════════════════════════════
      // 4. FLOATING ELDRITCH GLYPHS / RUNE LETTERS
      // ═══════════════════════════════════════════════════════════
      floatingGlyphs.forEach((g) => {
        g.position.y += g.userData.speedY;
        if (g.position.y > 11) {
          g.position.y = -7;
          g.userData.baseX = (Math.random() - 0.5) * 22;
        }

        g.position.x = g.userData.baseX + Math.sin(elapsed * g.userData.swaySpeed + g.userData.phase) * g.userData.swayAmp;
        g.rotation.z += g.userData.rotSpeed;
        g.material.opacity = g.userData.baseOpacity + Math.sin(elapsed * g.userData.pulseSpeed + g.userData.phase) * 0.22;

        // Billboard orientation: always face camera
        g.quaternion.copy(camera.quaternion);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      shardGeometries.forEach(g => g.dispose());
      glassMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();

      floorRuneGeo.dispose();
      floatingSealGeo.dispose();
      runeOuterMat.dispose();
      runeGeoMat.dispose();
      runeCoreMat.dispose();
      sealMatLeft.dispose();
      sealMatRight.dispose();
      runeOuterTex.dispose();
      runeGeoTex.dispose();
      runeCoreTex.dispose();
      sealTex.dispose();

      characterGeo.dispose();
      characterMat.dispose();
      sorcererTex.dispose();
      auraGeo.dispose();
      auraMat.dispose();
      auraTex.dispose();

      handRuneGeo1.dispose();
      handRuneMat1.dispose();
      handRuneGeo2.dispose();
      handRuneMat2.dispose();
      handRuneGeo3.dispose();
      handRuneMat3.dispose();
      handRuneGeo4.dispose();
      handRuneMat4.dispose();

      glyphGeo.dispose();
      glyphTextures.forEach(t => t.dispose());
      floatingGlyphs.forEach(g => g.material.dispose());

      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#080a07]">
      {/* 1. Arcane Hall Wallpaper with interactive parallax */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out pointer-events-none will-change-transform"
        style={{
          backgroundImage: "url('/images/arcane_hall_bg.jpg')",
          backgroundPosition: 'center 30%',
          opacity: 0.92,
          filter: 'brightness(0.96) contrast(1.08) saturate(1.10)',
        }}
      />

      {/* 2. Subtle ambient glow orbs — echo the hall's gold windows & emerald runes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 50% 72%, rgba(34, 197, 94, 0.18) 0%, transparent 55%),
            radial-gradient(ellipse 55% 55% at 20% 40%, rgba(217, 119, 6, 0.14) 0%, transparent 50%),
            radial-gradient(ellipse 55% 55% at 80% 40%, rgba(202, 138, 4, 0.14) 0%, transparent 50%)
          `
        }}
      />

      {/* 3. Directional vignette — darkens top & bottom so navbar and footer text stays sharp */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(4, 6, 4, 0.72) 0%, rgba(8, 10, 7, 0.20) 22%, rgba(8, 10, 7, 0.20) 72%, rgba(4, 6, 4, 0.82) 100%)'
        }}
      />
      {/* Side vignette — subtly frames the hall's wide composition */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 90% at 50% 42%, transparent 40%, rgba(4, 6, 4, 0.55) 80%, rgba(4, 6, 4, 0.80) 100%)'
        }}
      />

      {/* 4. 3D WebGL Canvas — arcane crystal shards & gold-emerald particle motes */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-75 pointer-events-none"
      />
    </div>
  );
}
