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
    // 1. 3D FLOATING SHATTERED MULTIVERSAL CRYSTAL SHARDS (24 Shards)
    // ═══════════════════════════════════════════════════════════
    const shardGeometries = [
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1.2, 0),
      new THREE.IcosahedronGeometry(0.9, 0),
    ];

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xc7d2fe,
      transmission: 0.88,
      opacity: 0.85,
      transparent: true,
      roughness: 0.08,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      ior: 1.52,
      reflectivity: 0.9,
    });

    const shards = [];
    const shardCount = 24;

    for (let i = 0; i < shardCount; i++) {
      const geo = shardGeometries[i % shardGeometries.length];
      const shard = new THREE.Mesh(geo, glassMaterial);

      // Distribute along the upper rift and across the sky
      const isRiftCluster = i < 16;
      const x = isRiftCluster ? (Math.random() - 0.7) * 22 : (Math.random() - 0.5) * 32;
      const y = isRiftCluster ? 1 + Math.random() * 10 : (Math.random() - 0.3) * 16;
      const z = -6 + Math.random() * 12;

      shard.position.set(x, y, z);
      const scale = 0.35 + Math.random() * 0.75;
      shard.scale.set(scale, scale * (0.8 + Math.random() * 1.5), scale * 0.5);

      shard.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      shard.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.01,
        bobSpeed: 0.8 + Math.random() * 1.2,
        bobAmp: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      };

      scene.add(shard);
      shards.push(shard);
    }

    // ═══════════════════════════════════════════════════════════
    // 2. 3D SWIRLING ARCANE PARTICLES & COSMIC EMBERS (1,500)
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
    // 3. 3D INCURSION RIFT ENERGY PULSE RINGS
    // ═══════════════════════════════════════════════════════════
    // Arcane rune ring — warm gold (hovers above floor runes)
    const ringGeo1 = new THREE.TorusGeometry(3.5, 0.04, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const riftRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    riftRing1.position.set(0, -3, 4);
    riftRing1.rotation.set(1.2, 0.2, 0);
    scene.add(riftRing1);

    // Outer rune ring — deep emerald (traces the outer rune circle)
    const ringGeo2 = new THREE.TorusGeometry(5.5, 0.03, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x16a34a,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const riftRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    riftRing2.position.set(0, -3.5, 3);
    riftRing2.rotation.set(1.2, -0.2, 0);
    scene.add(riftRing2);

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

      // Rotate & Float Crystal Shards
      shards.forEach((shard) => {
        shard.rotation.x += shard.userData.rotSpeedX;
        shard.rotation.y += shard.userData.rotSpeedY;
        shard.rotation.z += shard.userData.rotSpeedZ;

        shard.position.y = shard.userData.baseY + Math.sin(elapsed * shard.userData.bobSpeed + shard.userData.phase) * shard.userData.bobAmp;
      });

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
