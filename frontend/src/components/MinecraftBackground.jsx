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

    // Natural Sunlit Lights & Vibrant Emerald / Redstone Glows
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5dd, 1.6);
    sunLight.position.set(12, 25, 18);
    scene.add(sunLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 3.2, 35);
    emeraldLight.position.set(10, 6, 8);
    scene.add(emeraldLight);

    const redstoneLight = new THREE.PointLight(0xff2a4b, 3.0, 35);
    redstoneLight.position.set(-10, -4, 8);
    scene.add(redstoneLight);

    // 1. Floating 3D Voxel Ore Blocks in Background
    const blockCount = 28;
    const blocks = [];
    const blockGroup = new THREE.Group();
    scene.add(blockGroup);

    const textures = [diamondTex, redstoneTex, emeraldTex, goldTex, deepslateTex];
    const wireColors = [0x00f0ff, 0xff2a4b, 0x10b981, 0xfbbf24, 0x2e374d];

    for (let i = 0; i < blockCount; i++) {
      const typeIdx = i % textures.length;
      const size = 0.5 + Math.random() * 0.7; // Varied block sizes
      const geo = new THREE.BoxGeometry(size, size, size);
      const mat = new THREE.MeshStandardMaterial({
        map: textures[typeIdx],
        roughness: 0.35,
        metalness: 0.2
      });

      const mesh = new THREE.Mesh(geo, mat);
      
      // Wireframe bevel
      const wire = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({
          color: wireColors[typeIdx],
          transparent: true,
          opacity: 0.5
        })
      );
      mesh.add(wire);

      // Spread widely across 3D space and screen depth
      mesh.position.set(
        (Math.random() - 0.5) * 36,
        (Math.random() - 0.5) * 32,
        -5 - Math.random() * 18
      );

      mesh.userData = {
        rotX: (Math.random() - 0.5) * 0.008,
        rotY: (Math.random() - 0.5) * 0.012,
        floatSpeed: 0.5 + Math.random() * 0.8,
        floatAmplitude: 0.4 + Math.random() * 0.6,
        initialY: mesh.position.y,
        timeOffset: Math.random() * 100
      };

      blockGroup.add(mesh);
      blocks.push(mesh);
    }

    // 2. Ambient Minecraft Natural Voxel Particles (Emerald Slime & Redstone Embers)
    const particleCount = 150;
    const particleGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    const particleColors = [0x10b981, 0x34d399, 0x4ade80, 0xff2a4b, 0xff4d6d, 0x00f0ff, 0xfbbf24];
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const pColor = particleColors[Math.floor(Math.random() * particleColors.length)];
      const pMesh = new THREE.Mesh(
        particleGeo,
        new THREE.MeshBasicMaterial({
          color: pColor,
          transparent: true,
          opacity: 0.5 + Math.random() * 0.5
        })
      );

      pMesh.position.set(
        (Math.random() - 0.5) * 32,
        (Math.random() - 0.5) * 28,
        -2 - Math.random() * 14
      );

      pMesh.userData = {
        vy: 0.007 + Math.random() * 0.014,
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
      targetCameraX = mouseX * 2.5;
      targetCameraY = mouseY * 2.0;

      // Parallax effect on the natural Minecraft plains background
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

      // Rotate and float 3D Voxel Blocks
      blocks.forEach(mesh => {
        mesh.rotation.x += mesh.userData.rotX;
        mesh.rotation.y += mesh.userData.rotY;
        mesh.position.y = mesh.userData.initialY + Math.sin(elapsed * mesh.userData.floatSpeed + mesh.userData.timeOffset) * mesh.userData.floatAmplitude;
      });

      // Drift voxel particles upwards
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
      {/* 1. Natural Minecraft Sunlit Plains Background (Steve & Hopping Slimes) */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out pointer-events-none will-change-transform"
        style={{
          backgroundImage: "url('https://vcswkusqdkyhyanytjlc.supabase.co/storage/v1/object/public/organizer-assets/wallpapers/minecraft_hero_plains.jpg')",
          backgroundPosition: 'center 35%',
          opacity: 0.88,
          filter: 'brightness(1.05) contrast(1.12) saturate(1.18)',
        }}
      />

      {/* 2. Vibrant Red & Emerald Ambient Glow Orbs */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 12% 75%, rgba(255, 42, 75, 0.22) 0%, transparent 55%),
            radial-gradient(circle at 88% 30%, rgba(16, 185, 129, 0.25) 0%, transparent 55%),
            radial-gradient(circle at 50% 12%, rgba(255, 235, 175, 0.12) 0%, transparent 60%)
          `
        }}
      />

      {/* 3. Subtle Backdrop Vignette (ensures text, badges, and countdown HUD stay 100% crisp and readable) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(7, 9, 19, 0.35) 0%, rgba(11, 14, 20, 0.50) 45%, rgba(7, 9, 19, 0.82) 100%)'
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 45%, transparent 35%, rgba(11, 14, 20, 0.45) 75%, rgba(7, 9, 19, 0.90) 100%)'
        }}
      />

      {/* 4. 3D WebGL Canvas (Floating 3D Voxel Ores & Emerald Slime / Redstone Sparks) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-75 pointer-events-none"
      />
    </div>
  );
}
