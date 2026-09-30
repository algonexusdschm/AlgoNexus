import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function MinecraftVoxelCore() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Helpers to create Minecraft-like procedural pixel textures
    function createOreCanvas(baseHex, spotHex, glowHex) {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');

      // Base stone / deepslate color
      ctx.fillStyle = baseHex;
      ctx.fillRect(0, 0, 16, 16);

      // Noise pixels
      for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
          if (Math.random() > 0.6) {
            ctx.fillStyle = Math.random() > 0.5 ? '#1a2230' : '#121722';
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }

      // Ore crystal clusters
      ctx.fillStyle = spotHex;
      const spots = [
        [3, 4], [4, 4], [4, 5],
        [10, 3], [11, 3], [11, 4],
        [7, 9], [8, 9], [8, 10], [9, 10],
        [3, 12], [4, 12], [12, 11]
      ];
      spots.forEach(([x, y]) => {
        ctx.fillRect(x, y, 1, 1);
        if (Math.random() > 0.4) {
          ctx.fillStyle = glowHex;
          ctx.fillRect(x + (Math.random() > 0.5 ? 1 : -1), y, 1, 1);
          ctx.fillStyle = spotHex;
        }
      });

      // Border bevel
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.strokeRect(0.5, 0.5, 15, 15);

      const texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.NearestFilter; // Authentic Minecraft pixelation
      texture.minFilter = THREE.NearestFilter;
      return texture;
    }

    // Main Diamond-Redstone Core Material
    const mainCoreTexture = createOreCanvas('#1b2230', '#00f0ff', '#38bdf8');
    const redstoneTexture = createOreCanvas('#1b2230', '#ff2a4b', '#ff7185');
    const emeraldTexture = createOreCanvas('#1b2230', '#10b981', '#34d399');
    const goldTexture = createOreCanvas('#1b2230', '#fbbf24', '#fef08a');

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const diamondLight = new THREE.PointLight(0x00f0ff, 3, 10);
    diamondLight.position.set(2, 3, 2);
    scene.add(diamondLight);

    const redstoneLight = new THREE.PointLight(0xff2a4b, 3, 10);
    redstoneLight.position.set(-2, -2, -2);
    scene.add(redstoneLight);

    // Group for entire voxel rig
    const voxelGroup = new THREE.Group();
    scene.add(voxelGroup);

    // 1. Central Hero Voxel Block (Algo-Core)
    const boxGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    const boxMat = new THREE.MeshStandardMaterial({
      map: mainCoreTexture,
      roughness: 0.3,
      metalness: 0.4
    });
    const mainCube = new THREE.Mesh(boxGeo, boxMat);
    voxelGroup.add(mainCube);

    // Inner wireframe glow
    const wireGeo = new THREE.EdgesGeometry(boxGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, linewidth: 2 });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    mainCube.add(wireframe);

    // 2. Orbiting Sub-Voxel Blocks (Redstone, Emerald, Gold, Diamond)
    const subCubes = [
      { texture: redstoneTexture, color: 0xff2a4b, dist: 2.2, speed: 1.0, size: 0.45, yOffset: 0.3 },
      { texture: emeraldTexture, color: 0x10b981, dist: 2.3, speed: 0.7, size: 0.4, yOffset: -0.4 },
      { texture: goldTexture, color: 0xfbbf24, dist: 2.0, speed: 1.3, size: 0.38, yOffset: 0.6 },
      { texture: mainCoreTexture, color: 0x00f0ff, dist: 2.4, speed: 0.9, size: 0.42, yOffset: -0.2 }
    ];

    const subMeshes = subCubes.map(cfg => {
      const geo = new THREE.BoxGeometry(cfg.size, cfg.size, cfg.size);
      const mat = new THREE.MeshStandardMaterial({ map: cfg.texture, roughness: 0.2 });
      const mesh = new THREE.Mesh(geo, mat);
      
      const subWire = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: cfg.color })
      );
      mesh.add(subWire);
      scene.add(mesh);
      return { mesh, cfg };
    });

    // 3. Floating 3D Pixel / Voxel Dust Particles
    const particleCount = 45;
    const particleGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const particleGroup = new THREE.Group();

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const pMesh = new THREE.Mesh(
        particleGeo,
        new THREE.MeshBasicMaterial({
          color: Math.random() > 0.5 ? 0x00f0ff : 0xff2a4b,
          transparent: true,
          opacity: 0.75
        })
      );
      pMesh.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      );
      pMesh.userData = {
        vy: 0.005 + Math.random() * 0.01,
        initialY: pMesh.position.y
      };
      particleGroup.add(pMesh);
      particles.push(pMesh);
    }
    scene.add(particleGroup);

    // Mouse Interaction Parallax
    let targetRotationX = 0.2;
    let targetRotationY = 0.4;
    let clickSpin = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.9;
      targetRotationX = y * 0.6;
    };

    const handleClick = () => {
      clickSpin += 3.14; // Instant spin impulse on click
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth central rotation
      mainCube.rotation.x = THREE.MathUtils.lerp(mainCube.rotation.x, targetRotationX + Math.sin(elapsedTime * 0.8) * 0.1, 0.05);
      mainCube.rotation.y = THREE.MathUtils.lerp(mainCube.rotation.y, targetRotationY + elapsedTime * 0.4 + clickSpin, 0.05);
      mainCube.rotation.z = Math.sin(elapsedTime * 0.5) * 0.05;

      // Decay click spin
      clickSpin *= 0.92;

      // Orbiting Sub Cubes
      subMeshes.forEach(({ mesh, cfg }) => {
        const angle = elapsedTime * cfg.speed;
        mesh.position.x = Math.cos(angle) * cfg.dist;
        mesh.position.z = Math.sin(angle) * cfg.dist;
        mesh.position.y = cfg.yOffset + Math.sin(elapsedTime * 2 + cfg.speed) * 0.15;

        mesh.rotation.x += 0.02;
        mesh.rotation.y += 0.03;
      });

      // Voxel Particles floating upwards
      particles.forEach(p => {
        p.position.y += p.userData.vy;
        p.rotation.x += 0.02;
        p.rotation.y += 0.02;
        if (p.position.y > 3) {
          p.position.y = -2.5;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[450px] lg:h-[500px] flex items-center justify-center cursor-pointer group">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Interactive HUD Hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-[#0b0e14]/80 border border-mc-border text-[10px] font-mc text-mc-diamond tracking-wider opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-voxel-sm">
        [3D VOXEL CORE: INTERACTIVE CLICK & TILT]
      </div>
    </div>
  );
}
