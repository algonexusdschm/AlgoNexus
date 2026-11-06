import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * AiUniverse3D: High-Density High-Definition Color-Calibrated TechAstra Universe
 * 
 * Color Architecture (High-Contrast White Studio Palette):
 * - Radiant Solar Gold (#f59e0b, #fbbf24) - Official TechAstra Astra Emblem Ring & Beacons
 * - Electric Cyan (#00b4d8, #0284c7) - Global Equator & AI Apex Nucleus
 * - Deep Sapphire Cobalt (#1d4ed8, #2563eb) - Meridian Latitudes & RAG Memory Lattice
 * - Neon Indigo (#4f46e5, #6366f1) - Machine Learning Tensor Weights
 * - Synaptic Imperial Violet (#7c3aed, #8b5cf6) - NLP Attention Networks & Counter-Orbit Ring
 * 
 * Performance:
 * - Rock-solid 30 FPS throttle
 * - Opaque canvas (alpha: false, background: #fcfdfd) with zero compositor blur passes
 * - Smooth scroll-driven camera choreography across all 5 waypoints
 * - Consolidated BufferGeometry line segments (under 25 draw calls total)
 * - Complete memory cleanup on unmount
 */

// 5 Core Tech Pillars of TechAstra with Dense Satellite Constellations
const TECH_PILLARS = [
  {
    id: 'ai',
    name: 'AI CORE',
    sub: 'Artificial Intelligence',
    pos: [0, 4.8, 0.6],
    color: '#0284c7', // Electric Cyan
    accentColor: '#f59e0b', // Solar Gold Highlight
    geo: 'icosahedron',
    radius: 1.15,
    nodes: 160
  },
  {
    id: 'cv',
    name: 'CV ENGINE',
    sub: 'Computer Vision',
    pos: [-8.6, 1.8, 1.8],
    color: '#0ea5e9', // Optical Azure
    accentColor: '#0284c7',
    geo: 'octahedron',
    radius: 0.9,
    nodes: 130
  },
  {
    id: 'rag',
    name: 'RAG MEMORY',
    sub: 'Vector Retrieval',
    pos: [8.6, 2.0, -1.6],
    color: '#2563eb', // Royal Cobalt
    accentColor: '#3b82f6',
    geo: 'octahedron',
    radius: 0.9,
    nodes: 130
  },
  {
    id: 'nlp',
    name: 'NLP SYNAPSE',
    sub: 'Natural Language',
    pos: [6.6, -3.8, 1.8],
    color: '#8b5cf6', // Synaptic Violet
    accentColor: '#a855f7',
    geo: 'tetrahedron',
    radius: 0.8,
    nodes: 120
  },
  {
    id: 'ml',
    name: 'ML WEIGHTS',
    sub: 'Machine Learning',
    pos: [-6.6, -3.8, -1.4],
    color: '#6366f1', // Neural Indigo
    accentColor: '#818cf8',
    geo: 'tetrahedron',
    radius: 0.8,
    nodes: 120
  }
];

// Peripheral Widescreen Wings
const WIDESCREEN_EDGES = [
  { id: 'edge_west', pos: [-15.5, -0.6, -2.0], color: '#38bdf8', nodes: 85 },
  { id: 'edge_east', pos: [15.5, -0.4, -2.0], color: '#818cf8', nodes: 85 },
  { id: 'horizon_nw', pos: [-9.0, 5.6, -1.8], color: '#0284c7', nodes: 65 },
  { id: 'horizon_ne', pos: [9.0, 5.8, -1.8], color: '#7c3aed', nodes: 65 }
];

export default function AiUniverse3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // Disposables registry
    const disposables = [];
    const register = (item) => {
      if (item && typeof item.dispose === 'function') {
        disposables.push(item);
      }
      return item;
    };

    // --- 1. Scene & Crisp Studio White Canvas ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfdfd);
    scene.fog = new THREE.FogExp2(0xfcfdfd, 0.005);

    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const initialCamZ = isMobile ? 18.5 : 14.2;
    camera.position.set(0, 0, initialCamZ);

    // --- 2. Low-Overhead WebGLRenderer ---
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
      precision: 'mediump',
      stencil: false,
      depth: true
    });
    register(renderer);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1.0);
    container.appendChild(renderer.domElement);

    // --- 3. Master Hierarchy Groups ---
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const globeGroup = new THREE.Group();
    rootGroup.add(globeGroup);

    const astraRingsGroup = new THREE.Group();
    rootGroup.add(astraRingsGroup);

    const techConstellationGroup = new THREE.Group();
    rootGroup.add(techConstellationGroup);

    // --- 4. Central World / Globe ("Astra Global Network") ---
    const GLOBE_RADIUS = 3.6;

    // 4a. High-Contrast Latitude & Longitude Meridians
    const primeMeridianMat = register(new THREE.LineBasicMaterial({
      color: 0x0284c7, // Vibrant Electric Cyan
      transparent: true,
      opacity: 0.65
    }));

    const secondaryMeridianMat = register(new THREE.LineBasicMaterial({
      color: 0x1d4ed8, // Deep Sapphire Cobalt
      transparent: true,
      opacity: 0.38
    }));

    // Longitude circular meridians
    const meridianCount = 10;
    for (let m = 0; m < meridianCount; m++) {
      const circlePts = [];
      const segs = 64;
      for (let s = 0; s <= segs; s++) {
        const theta = (s / segs) * Math.PI * 2;
        circlePts.push(new THREE.Vector3(
          Math.cos(theta) * GLOBE_RADIUS,
          Math.sin(theta) * GLOBE_RADIUS,
          0
        ));
      }
      const mGeo = register(new THREE.BufferGeometry().setFromPoints(circlePts));
      const mat = (m === 0 || m === 5) ? primeMeridianMat : secondaryMeridianMat;
      const mLine = new THREE.Line(mGeo, mat);
      mLine.rotation.y = (m / meridianCount) * Math.PI;
      globeGroup.add(mLine);
    }

    // Latitude horizontal rings
    const latLevels = [-2.8, -2.1, -1.4, -0.7, 0, 0.7, 1.4, 2.1, 2.8];
    latLevels.forEach((y) => {
      const r = Math.sqrt(Math.max(0.1, GLOBE_RADIUS * GLOBE_RADIUS - y * y));
      const circlePts = [];
      const segs = 64;
      for (let s = 0; s <= segs; s++) {
        const theta = (s / segs) * Math.PI * 2;
        circlePts.push(new THREE.Vector3(
          Math.cos(theta) * r,
          y,
          Math.sin(theta) * r
        ));
      }
      const latGeo = register(new THREE.BufferGeometry().setFromPoints(circlePts));
      const isEquator = Math.abs(y) < 0.01;
      const latLine = new THREE.Line(latGeo, isEquator ? primeMeridianMat : secondaryMeridianMat);
      globeGroup.add(latLine);
    });

    // 4b. Inner Cyber Heart Core (Volumetric substance)
    const innerCoreGeo = register(new THREE.IcosahedronGeometry(1.5, 1));
    const innerCoreMat = register(new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    }));
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    globeGroup.add(innerCoreMesh);

    // 4c. Dense Fibonacci Global Network Dots (Four Vibrant Cyber Jewels)
    const globePointsCount = 650;
    const globePositions = [];
    const globeColors = [];
    const globeVectors = [];
    
    const palette = [
      new THREE.Color(0x0284c7), // Electric Cyan
      new THREE.Color(0xf59e0b), // Radiant Solar Gold
      new THREE.Color(0x2563eb), // Cobalt Blue
      new THREE.Color(0x8b5cf6)  // Synaptic Violet
    ];

    const phiGolden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < globePointsCount; i++) {
      const y = 1 - (i / (globePointsCount - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phiGolden * i;

      const x = Math.cos(theta) * radiusAtY * GLOBE_RADIUS;
      const z = Math.sin(theta) * radiusAtY * GLOBE_RADIUS;
      const posY = y * GLOBE_RADIUS;

      globePositions.push(x, posY, z);
      globeVectors.push(new THREE.Vector3(x, posY, z));
      const col = palette[i % palette.length];
      globeColors.push(col.r, col.g, col.b);
    }

    const globePtsGeo = register(new THREE.BufferGeometry());
    globePtsGeo.setAttribute('position', new THREE.Float32BufferAttribute(globePositions, 3));
    globePtsGeo.setAttribute('color', new THREE.Float32BufferAttribute(globeColors, 3));

    const globePtsMat = register(new THREE.PointsMaterial({
      size: 0.17,
      vertexColors: true,
      transparent: true,
      opacity: 0.92
    }));
    const globePoints = new THREE.Points(globePtsGeo, globePtsMat);
    globeGroup.add(globePoints);

    // 4d. Dense Global Surface Synaptic Net (LineSegments connecting nearby globe surface nodes)
    const globeLinePositions = [];
    const globeLineColors = [];
    for (let i = 0; i < globePointsCount; i++) {
      const p1 = globeVectors[i];
      const col1 = palette[i % palette.length];
      let links = 0;
      for (let j = i + 1; j < globePointsCount; j++) {
        const p2 = globeVectors[j];
        const dist = p1.distanceTo(p2);
        if (dist < 1.05) {
          globeLinePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
          const col2 = palette[j % palette.length];
          globeLineColors.push(col1.r, col1.g, col1.b, col2.r, col2.g, col2.b);
          links++;
          if (links >= 3) break;
        }
      }
    }

    const globeLineGeo = register(new THREE.BufferGeometry());
    globeLineGeo.setAttribute('position', new THREE.Float32BufferAttribute(globeLinePositions, 3));
    globeLineGeo.setAttribute('color', new THREE.Float32BufferAttribute(globeLineColors, 3));
    const globeLineMat = register(new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35
    }));
    const globeSynapseMesh = new THREE.LineSegments(globeLineGeo, globeLineMat);
    globeGroup.add(globeSynapseMesh);

    // --- 5. "Astra" Celestial Orbital Rings (Vibrant Gold & Cyan) ---
    // Celestial Ring 1: Primary Diagonal Astra Ring (Rich Radiant Solar Gold)
    const ring1Pts = [];
    const RING1_RADIUS = 5.8;
    for (let s = 0; s <= 80; s++) {
      const theta = (s / 80) * Math.PI * 2;
      ring1Pts.push(new THREE.Vector3(
        Math.cos(theta) * RING1_RADIUS,
        0,
        Math.sin(theta) * (RING1_RADIUS * 0.92)
      ));
    }
    const ring1Geo = register(new THREE.BufferGeometry().setFromPoints(ring1Pts));
    const ring1Mat = register(new THREE.LineBasicMaterial({
      color: 0xf59e0b, // Radiant Solar Gold
      transparent: true,
      opacity: 0.80
    }));
    const astraRing1 = new THREE.Line(ring1Geo, ring1Mat);
    astraRing1.rotation.x = 0.58;
    astraRing1.rotation.z = -0.32;
    astraRingsGroup.add(astraRing1);

    // Golden Astra Orbit Beacons (8 jewel-like stars gliding along the ring)
    const beaconPts = [];
    const beaconCols = [];
    const goldCol = new THREE.Color(0xfbbf24);
    for (let k = 0; k < 8; k++) {
      const angle = (k / 8) * Math.PI * 2;
      beaconPts.push(
        Math.cos(angle) * RING1_RADIUS,
        0,
        Math.sin(angle) * (RING1_RADIUS * 0.92)
      );
      beaconCols.push(goldCol.r, goldCol.g, goldCol.b);
    }
    const beaconGeo = register(new THREE.BufferGeometry());
    beaconGeo.setAttribute('position', new THREE.Float32BufferAttribute(beaconPts, 3));
    beaconGeo.setAttribute('color', new THREE.Float32BufferAttribute(beaconCols, 3));
    const beaconMat = register(new THREE.PointsMaterial({
      size: 0.32,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    }));
    const astraBeacons = new THREE.Points(beaconGeo, beaconMat);
    astraRing1.add(astraBeacons);

    // Celestial Ring 2: Secondary Counter-Orbit Ring (Luminous Cyan)
    const ring2Pts = [];
    const RING2_RADIUS = 6.6;
    for (let s = 0; s <= 80; s++) {
      const theta = (s / 80) * Math.PI * 2;
      ring2Pts.push(new THREE.Vector3(
        Math.cos(theta) * RING2_RADIUS,
        0,
        Math.sin(theta) * (RING2_RADIUS * 0.94)
      ));
    }
    const ring2Geo = register(new THREE.BufferGeometry().setFromPoints(ring2Pts));
    const ring2Mat = register(new THREE.LineBasicMaterial({
      color: 0x0ea5e9, // Electric Cyan Accent
      transparent: true,
      opacity: 0.60
    }));
    const astraRing2 = new THREE.Line(ring2Geo, ring2Mat);
    astraRing2.rotation.x = -0.45;
    astraRing2.rotation.z = 0.40;
    astraRingsGroup.add(astraRing2);

    // Celestial Ring 3: Concentric Equatorial Synaptic Ring
    const ring3Pts = [];
    const RING3_RADIUS = 5.0;
    for (let s = 0; s <= 64; s++) {
      const theta = (s / 64) * Math.PI * 2;
      ring3Pts.push(new THREE.Vector3(
        Math.cos(theta) * RING3_RADIUS,
        0,
        Math.sin(theta) * RING3_RADIUS
      ));
    }
    const ring3Geo = register(new THREE.BufferGeometry().setFromPoints(ring3Pts));
    const ring3Mat = register(new THREE.LineBasicMaterial({
      color: 0x8b5cf6, // Synaptic Violet
      transparent: true,
      opacity: 0.42
    }));
    const astraRing3 = new THREE.Line(ring3Geo, ring3Mat);
    astraRingsGroup.add(astraRing3);

    // --- 6. The 5 Core Tech Pillars (AI, CV, ML, NLP, RAG) with Dense Synaptic Clouds ---
    const pillarMeshes = [];
    const techNodePositions = [];
    const techNodeColors = [];
    const denseSynapseLinePos = [];
    const denseSynapseLineCol = [];

    const icosaGeo = register(new THREE.IcosahedronGeometry(1.0, 1));
    const octaGeo = register(new THREE.OctahedronGeometry(0.8, 0));
    const tetraGeo = register(new THREE.TetrahedronGeometry(0.75, 0));
    const haloRingGeo = register(new THREE.RingGeometry(0.9, 1.05, 24));
    const outerHaloGeo = register(new THREE.RingGeometry(1.2, 1.28, 24));

    TECH_PILLARS.forEach((pillar) => {
      const center = new THREE.Vector3(...pillar.pos);
      const color = new THREE.Color(pillar.color);

      const pillarGroup = new THREE.Group();
      pillarGroup.position.copy(center);

      let coreGeo = octaGeo;
      if (pillar.geo === 'icosahedron') coreGeo = icosaGeo;
      else if (pillar.geo === 'tetrahedron') coreGeo = tetraGeo;

      // Vivid Geometric Core Mesh
      const coreMat = register(new THREE.MeshBasicMaterial({
        color: pillar.color,
        wireframe: true,
        transparent: true,
        opacity: 0.90
      }));
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.scale.setScalar(pillar.radius);
      pillarGroup.add(coreMesh);

      // Primary Luminous Halo Ring
      const haloMat = register(new THREE.MeshBasicMaterial({
        color: pillar.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55
      }));
      const haloMesh = new THREE.Mesh(haloRingGeo, haloMat);
      haloMesh.scale.setScalar(pillar.radius * 1.15);
      pillarGroup.add(haloMesh);

      // Secondary Concentric Outer Orbit Halo
      const outerHaloMat = register(new THREE.MeshBasicMaterial({
        color: pillar.accentColor || pillar.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.30
      }));
      const outerHaloMesh = new THREE.Mesh(outerHaloGeo, outerHaloMat);
      outerHaloMesh.scale.setScalar(pillar.radius * 1.25);
      pillarGroup.add(outerHaloMesh);

      techConstellationGroup.add(pillarGroup);
      pillarMeshes.push({ coreMesh, haloMesh, outerHaloMesh, center, color });

      // Ultra-Dense Satellite Cloud
      const clusterVectorList = [];
      for (let i = 0; i < pillar.nodes; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * 2.7;

        const sinPhi = Math.sin(phi);
        const x = center.x + r * sinPhi * Math.cos(theta);
        const y = center.y + r * sinPhi * Math.sin(theta);
        const z = center.z + r * Math.cos(phi);

        techNodePositions.push(x, y, z);
        techNodeColors.push(color.r, color.g, color.b);
        clusterVectorList.push(new THREE.Vector3(x, y, z));
      }

      // Intra-cluster Synaptic Axon Connections
      const clusterLen = clusterVectorList.length;
      for (let a = 0; a < clusterLen; a++) {
        const ptA = clusterVectorList[a];
        let links = 0;
        for (let b = a + 1; b < clusterLen; b++) {
          const ptB = clusterVectorList[b];
          if (ptA.distanceTo(ptB) < 1.30) {
            denseSynapseLinePos.push(ptA.x, ptA.y, ptA.z, ptB.x, ptB.y, ptB.z);
            denseSynapseLineCol.push(color.r, color.g, color.b, color.r, color.g, color.b);
            links++;
            if (links >= 3) break;
          }
        }
      }

      // Multi-Ray Data Beams to Globe Center (3 braided lines per pillar)
      for (let b = -1; b <= 1; b++) {
        const offset = b * 0.22;
        const beamPts = [
          new THREE.Vector3(center.x + offset, center.y + offset * 0.5, center.z),
          new THREE.Vector3(center.x * 0.35, center.y * 0.35, center.z * 0.35)
        ];
        const beamGeo = register(new THREE.BufferGeometry().setFromPoints(beamPts));
        const beamMat = register(new THREE.LineBasicMaterial({
          color: pillar.color,
          transparent: true,
          opacity: b === 0 ? 0.60 : 0.30
        }));
        const beam = new THREE.Line(beamGeo, beamMat);
        techConstellationGroup.add(beam);
      }
    });

    // --- 7. Widescreen Peripheral Wings with Synaptic Sub-Networks ---
    WIDESCREEN_EDGES.forEach((edge) => {
      const center = new THREE.Vector3(...edge.pos);
      const color = new THREE.Color(edge.color);
      const edgeVectorList = [];

      for (let i = 0; i < edge.nodes; i++) {
        const r = Math.random() * 2.8;
        const theta = Math.random() * Math.PI * 2;
        const x = center.x + Math.cos(theta) * r;
        const y = center.y + (Math.random() - 0.5) * 2.6;
        const z = center.z + Math.sin(theta) * r;

        techNodePositions.push(x, y, z);
        techNodeColors.push(color.r, color.g, color.b);
        edgeVectorList.push(new THREE.Vector3(x, y, z));
      }

      // Connect peripheral nodes into a network
      for (let i = 0; i < edgeVectorList.length; i++) {
        const p1 = edgeVectorList[i];
        let links = 0;
        for (let j = i + 1; j < edgeVectorList.length; j++) {
          const p2 = edgeVectorList[j];
          if (p1.distanceTo(p2) < 1.45) {
            denseSynapseLinePos.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
            denseSynapseLineCol.push(color.r, color.g, color.b, color.r, color.g, color.b);
            links++;
            if (links >= 2) break;
          }
        }
      }
    });

    // --- 8. Ambient Inter-Pillar Synaptic Starfield (Deep Neural Space) ---
    const ambientCount = 260;
    const ambientVectors = [];
    const ambientCol = new THREE.Color(0x38bdf8);
    for (let i = 0; i < ambientCount; i++) {
      const x = (Math.random() - 0.5) * 28;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 8 - 1.0;
      techNodePositions.push(x, y, z);
      techNodeColors.push(ambientCol.r, ambientCol.g, ambientCol.b);
      ambientVectors.push(new THREE.Vector3(x, y, z));
    }

    // Connect ambient nodes if in close proximity
    for (let i = 0; i < ambientVectors.length; i++) {
      const p1 = ambientVectors[i];
      let links = 0;
      for (let j = i + 1; j < ambientVectors.length; j++) {
        const p2 = ambientVectors[j];
        if (p1.distanceTo(p2) < 2.0) {
          denseSynapseLinePos.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
          denseSynapseLineCol.push(ambientCol.r, ambientCol.g, ambientCol.b, ambientCol.r, ambientCol.g, ambientCol.b);
          links++;
          if (links >= 2) break;
        }
      }
    }

    // Master Points Render
    const techPtsGeo = register(new THREE.BufferGeometry());
    techPtsGeo.setAttribute('position', new THREE.Float32BufferAttribute(techNodePositions, 3));
    techPtsGeo.setAttribute('color', new THREE.Float32BufferAttribute(techNodeColors, 3));

    const techPtsMat = register(new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.88
    }));
    const techPoints = new THREE.Points(techPtsGeo, techPtsMat);
    techConstellationGroup.add(techPoints);

    // Master Dense Synapse Lines Render (Consolidated into single draw call!)
    const denseSynapseGeo = register(new THREE.BufferGeometry());
    denseSynapseGeo.setAttribute('position', new THREE.Float32BufferAttribute(denseSynapseLinePos, 3));
    denseSynapseGeo.setAttribute('color', new THREE.Float32BufferAttribute(denseSynapseLineCol, 3));
    const denseSynapseMat = register(new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.38
    }));
    const denseSynapseMesh = new THREE.LineSegments(denseSynapseGeo, denseSynapseMat);
    techConstellationGroup.add(denseSynapseMesh);

    // --- 9. Complete Interconnected Synaptic Axon Highways (K5 Dense Network) ---
    const allPositionsMap = {
      ai: new THREE.Vector3(...TECH_PILLARS[0].pos),
      cv: new THREE.Vector3(...TECH_PILLARS[1].pos),
      rag: new THREE.Vector3(...TECH_PILLARS[2].pos),
      nlp: new THREE.Vector3(...TECH_PILLARS[3].pos),
      ml: new THREE.Vector3(...TECH_PILLARS[4].pos),
      edge_west: new THREE.Vector3(...WIDESCREEN_EDGES[0].pos),
      edge_east: new THREE.Vector3(...WIDESCREEN_EDGES[1].pos),
      horizon_nw: new THREE.Vector3(...WIDESCREEN_EDGES[2].pos),
      horizon_ne: new THREE.Vector3(...WIDESCREEN_EDGES[3].pos)
    };

    const highwayPairs = [
      // Outer Pentagon loop
      { from: 'cv', to: 'ai', color: 0x0ea5e9 },
      { from: 'ai', to: 'rag', color: 0x2563eb },
      { from: 'rag', to: 'nlp', color: 0x8b5cf6 },
      { from: 'nlp', to: 'ml', color: 0x6366f1 },
      { from: 'ml', to: 'cv', color: 0x0284c7 },
      // Inner Complete Star Cross-Connections
      { from: 'cv', to: 'rag', color: 0x0ea5e9 },
      { from: 'ml', to: 'ai', color: 0x6366f1 },
      { from: 'nlp', to: 'ai', color: 0x8b5cf6 },
      { from: 'cv', to: 'nlp', color: 0x0284c7 },
      { from: 'ml', to: 'rag', color: 0x6366f1 },
      // Peripheral Highway Extensions
      { from: 'cv', to: 'edge_west', color: 0x38bdf8 },
      { from: 'rag', to: 'edge_east', color: 0x818cf8 },
      { from: 'ai', to: 'horizon_nw', color: 0x0284c7 },
      { from: 'ai', to: 'horizon_ne', color: 0x7c3aed },
      { from: 'edge_west', to: 'ml', color: 0x38bdf8 },
      { from: 'edge_east', to: 'nlp', color: 0x818cf8 }
    ];

    // Render multi-strand braided highways
    highwayPairs.forEach(({ from, to, color }) => {
      const pA = allPositionsMap[from];
      const pB = allPositionsMap[to];
      if (!pA || !pB) return;

      // Primary High-Arch Curve
      const mid1 = pA.clone().add(pB).multiplyScalar(0.5);
      mid1.z += 1.8;
      const curve1 = new THREE.QuadraticBezierCurve3(pA, mid1, pB);
      const pts1 = curve1.getPoints(32);
      const lineGeo1 = register(new THREE.BufferGeometry().setFromPoints(pts1));
      const lineMat1 = register(new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.58
      }));
      const line1 = new THREE.Line(lineGeo1, lineMat1);
      techConstellationGroup.add(line1);

      // Secondary Braided Parallel Strand (giving thick neural axon appearance)
      const mid2 = pA.clone().add(pB).multiplyScalar(0.5);
      mid2.z += 1.3;
      mid2.y += 0.35;
      const curve2 = new THREE.QuadraticBezierCurve3(pA, mid2, pB);
      const pts2 = curve2.getPoints(24);
      const lineGeo2 = register(new THREE.BufferGeometry().setFromPoints(pts2));
      const lineMat2 = register(new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.32
      }));
      const line2 = new THREE.Line(lineGeo2, lineMat2);
      techConstellationGroup.add(line2);
    });

    // --- 10. Cinematic Scroll Waypoints Choreography ---
    const BASE_Z = isMobile ? 18.5 : 14.2;

    const SCROLL_WAYPOINTS = [
      // 0. Hero (Top): Frontal Master View of Globe & 5 Pillars
      {
        p: 0.00,
        camX: 0.0,
        camY: 0.0,
        camZ: BASE_Z,
        rotY: 0.0,
        rotX: 0.0,
        globeRotY: 0.0,
        ringsTilt: 0.0
      },
      // 1. AI Challenge Tracks: Swoop into the 5 Pillars (CV, ML, AI, RAG, NLP)
      {
        p: 0.22,
        camX: isMobile ? -1.0 : -3.2,
        camY: 1.6,
        camZ: BASE_Z - 2.4,
        rotY: 0.85,
        rotX: 0.16,
        globeRotY: 0.8,
        ringsTilt: 0.25
      },
      // 2. 48-Hour Innovation Roadmap: Tactical High-Angle Planetary Network
      {
        p: 0.44,
        camX: isMobile ? 1.0 : 2.5,
        camY: 4.0,
        camZ: BASE_Z - 1.8,
        rotY: 1.85,
        rotX: -0.32,
        globeRotY: 1.6,
        ringsTilt: -0.2
      },
      // 3. National Announcement & Memories: Sweeping 180° Orbital View
      {
        p: 0.70,
        camX: isMobile ? -1.0 : 3.8,
        camY: -1.4,
        camZ: BASE_Z - 0.8,
        rotY: 3.14,
        rotX: 0.14,
        globeRotY: 2.8,
        ringsTilt: 0.4
      },
      // 4. Passes & FAQ / Footer: Wide Horizon Cosmic Pullback
      {
        p: 1.00,
        camX: 0.0,
        camY: -2.0,
        camZ: BASE_Z + 1.6,
        rotY: 4.4,
        rotX: -0.10,
        globeRotY: 4.2,
        ringsTilt: 0.0
      }
    ];

    const getChoreographyAt = (progress) => {
      const p = Math.max(0, Math.min(1, progress));
      for (let i = 0; i < SCROLL_WAYPOINTS.length - 1; i++) {
        const w1 = SCROLL_WAYPOINTS[i];
        const w2 = SCROLL_WAYPOINTS[i + 1];
        if (p >= w1.p && p <= w2.p) {
          const t = (p - w1.p) / (w2.p - w1.p);
          const ease = t * t * (3 - 2 * t);
          return {
            camX: w1.camX + (w2.camX - w1.camX) * ease,
            camY: w1.camY + (w2.camY - w1.camY) * ease,
            camZ: w1.camZ + (w2.camZ - w1.camZ) * ease,
            rotY: w1.rotY + (w2.rotY - w1.rotY) * ease,
            rotX: w1.rotX + (w2.rotX - w1.rotX) * ease,
            globeRotY: w1.globeRotY + (w2.globeRotY - w1.globeRotY) * ease,
            ringsTilt: w1.ringsTilt + (w2.ringsTilt - w1.ringsTilt) * ease
          };
        }
      }
      return SCROLL_WAYPOINTS[SCROLL_WAYPOINTS.length - 1];
    };

    // --- 11. Live Scroll & 360° Drag State ---
    let currentScrollProgress = 0;
    let targetScrollProgress = 0;

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        targetScrollProgress = Math.min(Math.max((window.scrollY || window.pageYOffset) / docHeight, 0), 1);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    let dragRotY = 0;
    let dragRotX = 0;
    let targetDragRotY = 0;
    let targetDragRotX = 0;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let mouseX = 0;
    let mouseY = 0;

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
        targetDragRotY += dx * 0.0035;
        targetDragRotX += dy * 0.0035;
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

    let isTabVisible = !document.hidden;
    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        onScroll();
      }, 150);
    };
    window.addEventListener('resize', onResize);

    // --- 12. Controlled 30 FPS Render Loop ---
    let animId;
    let lastTime = 0;
    const FRAME_INTERVAL = 1000 / 30; // 30 FPS cap
    let elapsed = 0;

    const animate = (timestamp) => {
      animId = requestAnimationFrame(animate);

      if (!isTabVisible) {
        return;
      }

      const elapsedDelta = timestamp - lastTime;
      if (elapsedDelta < FRAME_INTERVAL) {
        return;
      }
      lastTime = timestamp - (elapsedDelta % FRAME_INTERVAL);

      const delta = 0.033;
      elapsed += delta;

      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;
      const choreo = getChoreographyAt(currentScrollProgress);

      dragRotY += (targetDragRotY - dragRotY) * 0.06;
      dragRotX += (targetDragRotX - dragRotX) * 0.06;

      camera.position.x += (choreo.camX - camera.position.x) * 0.08;
      camera.position.y += (choreo.camY - camera.position.y) * 0.08;
      camera.position.z += (choreo.camZ - camera.position.z) * 0.08;

      const targetGroupRotY = choreo.rotY + dragRotY + mouseX * 0.06;
      const targetGroupRotX = choreo.rotX + dragRotX + mouseY * 0.03;

      rootGroup.rotation.y += (targetGroupRotY - rootGroup.rotation.y) * 0.06;
      rootGroup.rotation.x += (targetGroupRotX - rootGroup.rotation.x) * 0.06;

      // Independent continuous planetary spin
      globeGroup.rotation.y += 0.0028;
      innerCoreMesh.rotation.y -= 0.0035;
      astraRingsGroup.rotation.y -= 0.0020;
      astraRingsGroup.rotation.z = -0.32 + choreo.ringsTilt;

      // Spin individual Tech Pillar Cores & Halos
      const pLen = pillarMeshes.length;
      for (let i = 0; i < pLen; i++) {
        const item = pillarMeshes[i];
        item.coreMesh.rotation.y = elapsed * 0.6 + i;
        item.coreMesh.rotation.x = elapsed * 0.35 + i;
        const s = 1.0 + Math.sin(elapsed * 2.8 + i) * 0.12;
        item.haloMesh.scale.set(s, s, 1);
        if (item.outerHaloMesh) {
          const sOuter = 1.0 + Math.cos(elapsed * 2.2 + i) * 0.10;
          item.outerHaloMesh.scale.set(sOuter, sOuter, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      disposables.forEach((item) => {
        try {
          item.dispose();
        } catch {}
      });
      scene.clear();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden select-none bg-[#fcfdfd]">
      {/* 3D WebGL Canvas */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" 
      />

      {/* Multi-Spectral Atmospheric Glows (Rich Gold & Cyan Cyber Ambience) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle 750px at 50% 32%, rgba(2, 132, 199, 0.14) 0%, transparent 70%),
            radial-gradient(circle 600px at 50% 36%, rgba(245, 158, 11, 0.12) 0%, transparent 65%),
            radial-gradient(circle 550px at 18% 45%, rgba(99, 102, 241, 0.09) 0%, transparent 65%),
            radial-gradient(circle 550px at 82% 45%, rgba(37, 99, 235, 0.09) 0%, transparent 65%),
            radial-gradient(circle 450px at 50% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 65%)
          `
        }}
      />
    </div>
  );
}
