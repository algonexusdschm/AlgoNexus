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

    // Helpers to create Allay textures
    function createAllayHeadTexture() {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 32;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#4cc7f5';
      ctx.fillRect(0, 0, 32, 32);
      for (let x = 0; x < 32; x += 4) {
        for (let y = 0; y < 32; y += 4) {
          if (Math.random() > 0.5) {
            ctx.fillStyle = Math.random() > 0.5 ? '#65d5fc' : '#39b5e3';
            ctx.fillRect(x, y, 4, 4);
          }
        }
      }
      // Eyes (deep navy with light cyan pixel shine)
      ctx.fillStyle = '#0f2942';
      ctx.fillRect(6, 12, 6, 8);
      ctx.fillRect(20, 12, 6, 8);
      ctx.fillStyle = '#c5f2ff';
      ctx.fillRect(8, 14, 3, 4);
      ctx.fillRect(22, 14, 3, 4);

      const texture = new THREE.CanvasTexture(c);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      return texture;
    }

    // Helpers to create Ghast texture
    function createGhastTexture() {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      // Pale white/light grey ghostly base
      ctx.fillStyle = '#f0f3f6';
      ctx.fillRect(0, 0, 64, 64);
      for (let x = 0; x < 64; x += 8) {
        for (let y = 0; y < 64; y += 8) {
          if (Math.random() > 0.45) {
            ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#e0e6ed';
            ctx.fillRect(x, y, 8, 8);
          }
        }
      }
      // Ghast Face: Closed/crying eyes & sad mouth
      ctx.fillStyle = '#4a5568';
      ctx.fillRect(12, 22, 12, 6);
      ctx.fillRect(40, 22, 12, 6);
      ctx.fillStyle = '#718096';
      ctx.fillRect(16, 28, 4, 12);
      ctx.fillRect(44, 28, 4, 12);
      ctx.fillStyle = '#4a5568';
      ctx.fillRect(26, 42, 12, 8);

      const texture = new THREE.CanvasTexture(c);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      return texture;
    }

    // 2. Floating Animated Allays Group
    const allays = [];
    const allayGroup = new THREE.Group();
    scene.add(allayGroup);

    const allayHeadTex = createAllayHeadTexture();

    const allayConfigs = [
      { startX: -7.5, startY: 2.4, startZ: 2, scale: 0.9, speed: 1.1, radiusX: 3.2, radiusY: 1.1 },
      { startX: 6.8, startY: 3.5, startZ: 0.5, scale: 0.95, speed: 0.95, radiusX: 3.8, radiusY: 1.4 },
      { startX: -1.2, startY: 4.5, startZ: -2.5, scale: 0.8, speed: 1.3, radiusX: 2.6, radiusY: 0.9 }
    ];

    allayConfigs.forEach((cfg, idx) => {
      const allay = new THREE.Group();

      // Head
      const headGeo = new THREE.BoxGeometry(0.36 * cfg.scale, 0.36 * cfg.scale, 0.36 * cfg.scale);
      const headMat = new THREE.MeshStandardMaterial({
        map: allayHeadTex,
        roughness: 0.3,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.28
      });
      const headMesh = new THREE.Mesh(headGeo, headMat);
      headMesh.position.y = 0.28 * cfg.scale;
      allay.add(headMesh);

      // Torso & Dress
      const bodyGeo = new THREE.BoxGeometry(0.24 * cfg.scale, 0.38 * cfg.scale, 0.2 * cfg.scale);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x2baae2,
        roughness: 0.4,
        emissive: 0x0284c7,
        emissiveIntensity: 0.3
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      bodyMesh.position.y = -0.05 * cfg.scale;
      allay.add(bodyMesh);

      // Translucent Fluttering Wings
      const wingGeo = new THREE.PlaneGeometry(0.42 * cfg.scale, 0.28 * cfg.scale);
      const wingMat = new THREE.MeshBasicMaterial({
        color: 0xa5f3fc,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });

      const wingL = new THREE.Mesh(wingGeo, wingMat);
      wingL.position.set(-0.16 * cfg.scale, 0.05 * cfg.scale, -0.12 * cfg.scale);
      allay.add(wingL);

      const wingR = new THREE.Mesh(wingGeo, wingMat);
      wingR.position.set(0.16 * cfg.scale, 0.05 * cfg.scale, -0.12 * cfg.scale);
      allay.add(wingR);

      // Held item (tiny sparkling emerald)
      const itemGeo = new THREE.BoxGeometry(0.12 * cfg.scale, 0.12 * cfg.scale, 0.12 * cfg.scale);
      const itemMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        emissive: 0x10b981,
        emissiveIntensity: 0.7
      });
      const itemMesh = new THREE.Mesh(itemGeo, itemMat);
      itemMesh.position.set(0, -0.1 * cfg.scale, 0.16 * cfg.scale);
      allay.add(itemMesh);

      allay.position.set(cfg.startX, cfg.startY, cfg.startZ);

      allays.push({
        group: allay,
        wingL,
        wingR,
        cfg,
        timeOffset: idx * 2.2
      });

      allayGroup.add(allay);
    });

    // 3. One Majestic Floating Ghast in the High Sky
    const ghastTex = createGhastTexture();
    const ghastGroup = new THREE.Group();
    scene.add(ghastGroup);

    // Large Cubic Body
    const ghastBodyGeo = new THREE.BoxGeometry(2.3, 2.3, 2.3);
    const ghastBodyMat = new THREE.MeshStandardMaterial({
      map: ghastTex,
      roughness: 0.45,
      transparent: true,
      opacity: 0.94
    });
    const ghastBody = new THREE.Mesh(ghastBodyGeo, ghastBodyMat);
    ghastGroup.add(ghastBody);

    // 9 Drooping Tentacles in 3x3 grid underneath the body
    const tentacles = [];
    const tentacleMat = new THREE.MeshStandardMaterial({
      color: 0xe5e9f0,
      roughness: 0.5,
      transparent: true,
      opacity: 0.9
    });

    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        const tentLength = 1.0 + (Math.abs(row) + Math.abs(col)) * 0.25;
        const tentGeo = new THREE.BoxGeometry(0.18, tentLength, 0.18);
        tentGeo.translate(0, -tentLength / 2, 0);

        const tentMesh = new THREE.Mesh(tentGeo, tentacleMat);
        tentMesh.position.set(col * 0.65, -1.15, row * 0.65);
        ghastGroup.add(tentMesh);
        tentacles.push({ mesh: tentMesh, offset: (row + 1) * 3 + (col + 1) });
      }
    }

    ghastGroup.position.set(-14, 5.2, -6);

    // 4. Ambient Natural Plains Particles (Sparks & Spores)
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

      // Animate Allays (Fluttering wings, playful hovering & swooping in gentle curves)
      allays.forEach(a => {
        const t = elapsed * a.cfg.speed + a.timeOffset;
        a.group.position.x = a.cfg.startX + Math.sin(t * 0.7) * a.cfg.radiusX;
        a.group.position.y = a.cfg.startY + Math.sin(t * 1.5) * a.cfg.radiusY;
        a.group.position.z = a.cfg.startZ + Math.cos(t * 0.6) * 1.2;

        // Flutter wings rapidly
        const wingFlap = Math.sin(elapsed * 24 + a.timeOffset * 2) * 0.65;
        a.wingL.rotation.y = wingFlap;
        a.wingR.rotation.y = -wingFlap;

        // Gentle bank into flight curve
        a.group.rotation.z = -Math.cos(t * 0.7) * 0.15;
        a.group.rotation.y = Math.cos(t * 0.7) * 0.45;
      });

      // Animate One Floating Ghast in the High Sky (Majestic drift + swaying tentacles)
      const ghastX = ((elapsed * 0.5) % 44) - 22; // drifts smoothly from -22 to +22 across sky
      ghastGroup.position.x = ghastX;
      ghastGroup.position.y = 5.2 + Math.sin(elapsed * 0.65) * 0.45;
      ghastGroup.position.z = -6.5;
      ghastGroup.rotation.y = 0.15 + Math.sin(elapsed * 0.4) * 0.08;

      tentacles.forEach(tent => {
        tent.mesh.rotation.x = Math.sin(elapsed * 1.5 + tent.offset * 0.7) * 0.2;
        tent.mesh.rotation.z = Math.cos(elapsed * 1.2 + tent.offset * 0.5) * 0.15;
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

      {/* 4. 3D WebGL Canvas (Real 3D Animated Hopping Minecraft Slimes) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-85 pointer-events-none"
      />
    </div>
  );
}
