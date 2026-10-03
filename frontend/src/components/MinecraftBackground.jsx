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
    // Subtle atmospheric fog for depth
    scene.fog = new THREE.FogExp2(0x0b0e14, 0.04);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 15);

    // Helpers to create procedural pixelated 16x16 Minecraft ore textures
    function createOreTexture(baseHex, spotHex, glowHex) {
      const c = document.createElement('canvas');
      c.width = 16;
      c.height = 16;
      const ctx = c.getContext('2d');

      // Base deepslate
      ctx.fillStyle = baseHex;
      ctx.fillRect(0, 0, 16, 16);

      // Pixel noise
      for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
          if (Math.random() > 0.65) {
            ctx.fillStyle = Math.random() > 0.5 ? '#1a2230' : '#0f141f';
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }

      // Ore spots
      ctx.fillStyle = spotHex;
      const spots = [
        [3, 4], [4, 4], [10, 3], [11, 4],
        [7, 9], [8, 9], [8, 10], [3, 12], [12, 11]
      ];
      spots.forEach(([x, y]) => {
        ctx.fillRect(x, y, 1, 1);
        if (Math.random() > 0.5) {
          ctx.fillStyle = glowHex;
          ctx.fillRect(x + 1, y, 1, 1);
          ctx.fillStyle = spotHex;
        }
      });

      // Voxel bevel border
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.strokeRect(0.5, 0.5, 15, 15);

      const texture = new THREE.CanvasTexture(c);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      return texture;
    }

    const diamondTex = createOreTexture('#161d2b', '#00f0ff', '#38bdf8');
    const redstoneTex = createOreTexture('#161d2b', '#ff2a4b', '#ff7185');
    const emeraldTex = createOreTexture('#161d2b', '#10b981', '#34d399');
    const goldTex = createOreTexture('#161d2b', '#fbbf24', '#fef08a');
    const deepslateTex = createOreTexture('#121722', '#2a3449', '#1e2638');

    // Natural Sunlit Lights & Radiant Slime Green Glow
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7e6, 1.8);
    sunLight.position.set(12, 28, 16);
    scene.add(sunLight);

    const slimeGreenLight = new THREE.PointLight(0x52e043, 3.5, 40);
    slimeGreenLight.position.set(0, -2, 10);
    scene.add(slimeGreenLight);

    // Helpers to create authentic Minecraft Slime textures
    function createSlimeFaceTexture() {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');

      // Slime green base
      ctx.fillStyle = '#44aa3b';
      ctx.fillRect(0, 0, 64, 64);

      // Pixel texture variation
      for (let x = 0; x < 64; x += 8) {
        for (let y = 0; y < 64; y += 8) {
          if (Math.random() > 0.45) {
            ctx.fillStyle = Math.random() > 0.5 ? '#53be48' : '#399632';
            ctx.fillRect(x, y, 8, 8);
          }
        }
      }

      // Left & Right Eyes (Minecraft pixel slime eyes)
      ctx.fillStyle = '#173612';
      ctx.fillRect(12, 18, 14, 14);
      ctx.fillRect(38, 18, 14, 14);

      // Eye white highlights
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(14, 20, 6, 6);
      ctx.fillRect(40, 20, 6, 6);

      // Cute Slime Mouth
      ctx.fillStyle = '#173612';
      ctx.fillRect(26, 38, 12, 6);

      const texture = new THREE.CanvasTexture(c);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      return texture;
    }

    function createSlimeBodyTexture() {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 32;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#48b73e';
      ctx.fillRect(0, 0, 32, 32);
      for (let x = 0; x < 32; x += 4) {
        for (let y = 0; y < 32; y += 4) {
          if (Math.random() > 0.5) {
            ctx.fillStyle = Math.random() > 0.5 ? '#57c74b' : '#3fa336';
            ctx.fillRect(x, y, 4, 4);
          }
        }
      }
      const texture = new THREE.CanvasTexture(c);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      return texture;
    }

    // 1. Animated Hopping Minecraft Slimes System
    const slimeFaceTex = createSlimeFaceTexture();
    const slimeBodyTex = createSlimeBodyTexture();

    const slimeGroup = new THREE.Group();
    scene.add(slimeGroup);

    // 6 playful Minecraft slimes (Big, Medium, and Baby slimes)
    const slimeConfigs = [
      { size: 1.5, startX: -9, startZ: -2.5, groundY: -5.6, jumpHeight: 3.0, hopSpeed: 2.3, dir: 1 },
      { size: 1.1, startX: -3.5, startZ: -1.5, groundY: -5.3, jumpHeight: 2.4, hopSpeed: 2.7, dir: 1 },
      { size: 0.65, startX: 2.5, startZ: -0.8, groundY: -5.0, jumpHeight: 1.8, hopSpeed: 3.3, dir: 1 },
      { size: 1.35, startX: 9.5, startZ: -3.2, groundY: -5.7, jumpHeight: 2.7, hopSpeed: 2.5, dir: -1 },
      { size: 0.85, startX: -6.5, startZ: -4.5, groundY: -6.0, jumpHeight: 2.1, hopSpeed: 2.9, dir: 1 },
      { size: 0.55, startX: 4.5, startZ: -5.0, groundY: -6.2, jumpHeight: 1.6, hopSpeed: 3.5, dir: -1 }
    ];

    const slimes = [];

    slimeConfigs.forEach((cfg, idx) => {
      const slime = new THREE.Group();

      // Outer Translucent Gelatinous Box
      const outerGeo = new THREE.BoxGeometry(cfg.size, cfg.size, cfg.size);
      const outerMat = new THREE.MeshStandardMaterial({
        color: 0x68e35a,
        transparent: true,
        opacity: 0.62,
        roughness: 0.1,
        metalness: 0.05
      });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      slime.add(outerMesh);

      // Outer bevel wire for authentic voxel block feel
      const outerWire = new THREE.LineSegments(
        new THREE.EdgesGeometry(outerGeo),
        new THREE.LineBasicMaterial({ color: 0x8ef581, transparent: true, opacity: 0.45 })
      );
      slime.add(outerWire);

      // Inner Core Box with Face on front
      const innerSize = cfg.size * 0.58;
      const innerGeo = new THREE.BoxGeometry(innerSize, innerSize, innerSize);
      const innerBodyMat = new THREE.MeshStandardMaterial({ map: slimeBodyTex, roughness: 0.35 });
      const innerFaceMat = new THREE.MeshStandardMaterial({ map: slimeFaceTex, roughness: 0.35 });
      const innerMats = [
        innerBodyMat, // +x
        innerBodyMat, // -x
        innerBodyMat, // +y
        innerBodyMat, // -y
        innerFaceMat, // +z (front)
        innerBodyMat  // -z
      ];
      const innerMesh = new THREE.Mesh(innerGeo, innerMats);
      innerMesh.position.z = cfg.size * 0.05;
      slime.add(innerMesh);

      // Ground Drop Shadow (squashes & stretches with hop)
      const shadowGeo = new THREE.PlaneGeometry(cfg.size * 1.3, cfg.size * 1.3);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x072007,
        transparent: true,
        opacity: 0.4,
        depthWrite: false
      });
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(cfg.startX, cfg.groundY, cfg.startZ);
      scene.add(shadow);

      slime.position.set(cfg.startX, cfg.groundY + cfg.size * 0.5, cfg.startZ);

      slimes.push({
        group: slime,
        outerMesh,
        shadow,
        cfg,
        baseY: cfg.groundY + cfg.size * 0.5,
        x: cfg.startX,
        z: cfg.startZ,
        hopOffset: idx * 1.15
      });

      slimeGroup.add(slime);
    });

    // 2. Ambient Natural Plains Particles (Sparks & Spores)
    const particleCount = 120;
    const particleGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    const particleColors = [0x52e043, 0x68e35a, 0x8ef581, 0x00f0ff, 0xfbbf24];
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const pColor = particleColors[Math.floor(Math.random() * particleColors.length)];
      const pMesh = new THREE.Mesh(
        particleGeo,
        new THREE.MeshBasicMaterial({
          color: pColor,
          transparent: true,
          opacity: 0.45 + Math.random() * 0.45
        })
      );

      pMesh.position.set(
        (Math.random() - 0.5) * 32,
        (Math.random() - 0.5) * 26,
        -2 - Math.random() * 12
      );

      pMesh.userData = {
        vy: 0.006 + Math.random() * 0.012,
        vx: (Math.random() - 0.5) * 0.005,
        rotSpeed: (Math.random() - 0.5) * 0.04
      };

      particleGroup.add(pMesh);
      particles.push(pMesh);
    }

    // Mouse Parallax & Scroll Reactivity
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let scrollY = window.scrollY;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetCameraX = mouseX * 2.2;
      targetCameraY = mouseY * 1.8;

      if (bgImageRef.current) {
        const moveX = (e.clientX / window.innerWidth - 0.5) * -22;
        const moveY = (e.clientY / window.innerHeight - 0.5) * -16;
        bgImageRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.06)`;
      }
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera smoothly tracks cursor & page scroll position
      const scrollOffset = scrollY * 0.008;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCameraX, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCameraY - scrollOffset, 0.05);

      // Animate 3D Minecraft Hopping Slimes
      slimes.forEach(s => {
        const cycle = (elapsed * s.cfg.hopSpeed + s.hopOffset) % (Math.PI * 2);
        const isAirborne = cycle > 0.6 && cycle < 2.5;

        if (isAirborne) {
          // Mid-air leaping arc
          const jumpProgress = (cycle - 0.6) / 1.9; // 0 to 1
          const jumpY = Math.sin(jumpProgress * Math.PI) * s.cfg.jumpHeight;
          s.group.position.y = s.baseY + jumpY;

          // Forward travel during leap
          s.x += s.cfg.dir * 0.042;
          if (s.x > 18) s.x = -18;
          else if (s.x < -18) s.x = 18;
          s.group.position.x = s.x;

          // Stretch along Y axis while in the air (squash & stretch)
          const stretch = Math.sin(jumpProgress * Math.PI);
          s.group.scale.y = 1.0 + stretch * 0.32;
          s.group.scale.x = 1.0 - stretch * 0.18;
          s.group.scale.z = 1.0 - stretch * 0.18;

          // Dynamic drop shadow shrinking and fading as slime jumps higher
          s.shadow.position.x = s.x;
          s.shadow.position.z = s.z;
          const shadowScale = Math.max(0.3, 1.0 - (jumpY / (s.cfg.jumpHeight * 1.5)));
          s.shadow.scale.set(shadowScale, shadowScale, 1);
          s.shadow.material.opacity = 0.4 * shadowScale;
        } else {
          // Ground phase: squish down before leap and upon landing
          s.group.position.y = s.baseY;
          s.shadow.position.x = s.x;
          s.shadow.position.z = s.z;

          const squish = Math.sin(cycle * 2);
          s.group.scale.y = 0.72 + squish * 0.22;
          s.group.scale.x = 1.22 - squish * 0.18;
          s.group.scale.z = 1.22 - squish * 0.18;

          s.shadow.scale.set(1.15, 1.15, 1);
          s.shadow.material.opacity = 0.42;
        }

        // Face forward toward movement direction
        s.group.rotation.y = s.cfg.dir > 0 ? 0.25 : -0.25;
      });

      // Drift gentle particles upwards
      particles.forEach(p => {
        p.position.y += p.userData.vy;
        p.position.x += p.userData.vx;
        p.rotation.x += p.userData.rotSpeed;
        p.rotation.y += p.userData.rotSpeed;

        if (p.position.y > 15) {
          p.position.y = -15;
          p.position.x = (Math.random() - 0.5) * 32;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#070913]">
      {/* 1. Natural Minecraft Sunlit Plains Background (Steve & Slimes) */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out pointer-events-none will-change-transform"
        style={{
          backgroundImage: "url('https://vcswkusqdkyhyanytjlc.supabase.co/storage/v1/object/public/organizer-assets/wallpapers/minecraft_hero_plains.jpg')",
          backgroundPosition: 'center 35%',
          opacity: 0.90,
          filter: 'brightness(1.06) contrast(1.12) saturate(1.18)',
        }}
      />

      {/* 2. Vibrant Natural Sunlight & Emerald Glow Orbs */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 88% 30%, rgba(82, 224, 67, 0.22) 0%, transparent 55%),
            radial-gradient(circle at 15% 40%, rgba(82, 224, 67, 0.16) 0%, transparent 50%),
            radial-gradient(circle at 50% 12%, rgba(255, 240, 185, 0.16) 0%, transparent 60%)
          `
        }}
      />

      {/* 3. Subtle Backdrop Vignette (keeps text and cards 100% crisp and readable) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(7, 9, 19, 0.28) 0%, rgba(11, 14, 20, 0.42) 45%, rgba(7, 9, 19, 0.78) 100%)'
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 45%, transparent 40%, rgba(11, 14, 20, 0.40) 75%, rgba(7, 9, 19, 0.85) 100%)'
        }}
      />

      {/* 4. 3D WebGL Canvas (Real 3D Animated Hopping Minecraft Slimes) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-85 pointer-events-none"
      />
    </div>
  );
}
