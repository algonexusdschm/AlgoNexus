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
    scene.fog = new THREE.FogExp2(0x060912, 0.035);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 16);

    // Dynamic Lighting for Doomsday Multiverse
    const ambientLight = new THREE.AmbientLight(0x1a2236, 1.2);
    scene.add(ambientLight);

    // Latverian Emerald Fortress Light (Right side)
    const emeraldLight = new THREE.PointLight(0x10b981, 4.5, 45);
    emeraldLight.position.set(12, 5, 8);
    scene.add(emeraldLight);

    // Multiversal Incursion Rift Light (Upper left)
    const cosmicRiftLight = new THREE.PointLight(0xa855f7, 4.0, 45);
    cosmicRiftLight.position.set(-10, 8, 8);
    scene.add(cosmicRiftLight);

    // Golden Arcane Flare Light (Center rift)
    const goldenFlareLight = new THREE.PointLight(0xf59e0b, 3.5, 35);
    goldenFlareLight.position.set(-4, 6, 10);
    scene.add(goldenFlareLight);

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

    const emeraldColor = new THREE.Color(0x10b981);
    const goldColor = new THREE.Color(0xf59e0b);
    const violetColor = new THREE.Color(0xa855f7);
    const cyanColor = new THREE.Color(0x06b6d4);

    for (let i = 0; i < particleCount; i++) {
      // 50% emerald (from Latveria fortress), 50% gold/violet/cyan (from rift)
      const isEmerald = i % 2 === 0;
      let x, y, z;

      if (isEmerald) {
        // Latveria side (right)
        x = 2 + Math.random() * 16;
        y = -10 + Math.random() * 22;
        z = -4 + Math.random() * 10;
      } else {
        // Rift side (left & center)
        x = -18 + Math.random() * 22;
        y = -4 + Math.random() * 18;
        z = -6 + Math.random() * 12;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      let color;
      if (isEmerald) {
        color = Math.random() > 0.4 ? emeraldColor : cyanColor;
      } else {
        color = Math.random() > 0.4 ? goldColor : violetColor;
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
    const ringGeo1 = new THREE.TorusGeometry(3.5, 0.04, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const riftRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    riftRing1.position.set(-6, 6, 2);
    riftRing1.rotation.set(0.4, 0.3, 0);
    scene.add(riftRing1);

    const ringGeo2 = new THREE.TorusGeometry(5.2, 0.03, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const riftRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    riftRing2.position.set(-6, 6, 1);
    riftRing2.rotation.set(-0.3, 0.5, 0);
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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#070913]">
      {/* 1. Avengers Doomsday Multiverse Incursion Wallpaper */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out pointer-events-none will-change-transform"
        style={{
          backgroundImage: "url('/images/doomsday_multiverse_rift.jpg'), url('https://vcswkusqdkyhyanytjlc.supabase.co/storage/v1/object/public/organizer-assets/wallpapers/doomsday_multiverse_rift.jpg')",
          backgroundPosition: 'center 40%',
          opacity: 0.94,
          filter: 'brightness(1.04) contrast(1.15) saturate(1.15)',
        }}
      />

      {/* 2. Latverian Emerald & Multiversal Incursion Glow Orbs */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 80% 35%, rgba(16, 185, 129, 0.28) 0%, transparent 50%),
            radial-gradient(circle at 35% 25%, rgba(168, 85, 247, 0.20) 0%, transparent 45%),
            radial-gradient(circle at 45% 30%, rgba(234, 179, 8, 0.16) 0%, transparent 35%)
          `
        }}
      />

      {/* 3. Subtle Backdrop Vignette (keeps text and cards 100% crisp and readable) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(7, 9, 19, 0.35) 0%, rgba(11, 14, 20, 0.45) 45%, rgba(7, 9, 19, 0.85) 100%)'
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 45%, transparent 35%, rgba(11, 14, 20, 0.45) 75%, rgba(7, 9, 19, 0.90) 100%)'
        }}
      />

      {/* 4. 3D WebGL Canvas (Multiversal Crystal Shards & Arcane Particles) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-90 pointer-events-none"
      />
    </div>
  );
}
