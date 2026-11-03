import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * AiBackground3D: Pure WebGL 3D Cosmic Cyber Space Background
 * 
 * Replaces any static image wallpaper with a live, 60fps WebGL 3D universe:
 * - Dynamic 3D perspective cybernetic grid fading into deep space
 * - 450 floating quantum dust particles & twinkling stars drifting through depth
 * - Subtle peripheral geometric wireframes (octahedrons, icosahedrons)
 * - Smooth lerped cursor parallax tracking
 * - Strictly NO green: Pure electric cyan, deep sapphire blue, and cyber violet
 */
export default function AiBackground3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050814, 0.025);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 20);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient & Point Lighting (Cyan & Cyber Violet)
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 2.5, 80);
    cyanLight.position.set(15, 12, 10);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8b5cf6, 2.5, 80);
    violetLight.position.set(-15, -8, 5);
    scene.add(violetLight);

    // 1. Perspective Cyber Grid Floor
    const gridHelper = new THREE.GridHelper(120, 60, 0x00f0ff, 0x1e293b);
    gridHelper.position.y = -8;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.45;
    scene.add(gridHelper);

    // 2. Starfield / Quantum Dust Particles (450 particles)
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x00f0ff);
    const violetColor = new THREE.Color(0x8b5cf6);
    const blueColor = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const choice = Math.random();
      const col = choice < 0.45 ? cyanColor : choice < 0.8 ? blueColor : violetColor;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 3. Floating Peripheral Geometric Wireframes
    const polyGroup = new THREE.Group();
    const polyCount = 8;
    const polyMeshes = [];

    for (let i = 0; i < polyCount; i++) {
      const geo = i % 2 === 0 
        ? new THREE.OctahedronGeometry(1.2 + Math.random() * 0.8, 0)
        : new THREE.IcosahedronGeometry(1.0 + Math.random() * 0.6, 0);
      
      const edges = new THREE.EdgesGeometry(geo);
      const lineMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x00f0ff : 0x8b5cf6,
        transparent: true,
        opacity: 0.25 + Math.random() * 0.25
      });

      const mesh = new THREE.LineSegments(edges, lineMat);
      mesh.position.set(
        (Math.random() > 0.5 ? 1 : -1) * (14 + Math.random() * 16),
        (Math.random() - 0.5) * 20,
        -15 + (Math.random() - 0.5) * 20
      );
      mesh.userData = {
        rotX: (Math.random() - 0.5) * 0.008,
        rotY: (Math.random() - 0.5) * 0.008,
        floatSpeed: 0.5 + Math.random() * 0.8,
        initialY: mesh.position.y
      };

      polyMeshes.push(mesh);
      polyGroup.add(mesh);
    }
    scene.add(polyGroup);

    // Mouse Tracking for Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Render Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Camera parallax tilt
      camera.position.x = mouseX * 2.5;
      camera.position.y = 2 - mouseY * 1.5;
      camera.lookAt(0, 0, 0);

      // Rotate star particles slowly
      particles.rotation.y = elapsedTime * 0.02;
      particles.rotation.x = Math.sin(elapsedTime * 0.015) * 0.05;

      // Rotate peripheral wireframe geometries
      polyMeshes.forEach((mesh) => {
        mesh.rotation.x += mesh.userData.rotX;
        mesh.rotation.y += mesh.userData.rotY;
        mesh.position.y = mesh.userData.initialY + Math.sin(elapsedTime * mesh.userData.floatSpeed) * 0.8;
      });

      // Slowly pulse cyber grid line opacity
      gridHelper.position.z = (elapsedTime * 1.5) % 2;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#050814]">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 pointer-events-none" />

      {/* Cybernetic High-Tech Horizon Glows (Pure CSS radial glows, NO image files!) */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-sky-600/15 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050814] via-[#050814]/80 to-transparent pointer-events-none" />

      {/* Subtle Scanline Holographic Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />
    </div>
  );
}
