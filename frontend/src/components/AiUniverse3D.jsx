import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Scan, 
  Database, 
  BrainCircuit, 
  Cpu, 
  Sparkles, 
  ChevronRight, 
  Activity, 
  Maximize2,
  Eye,
  CheckCircle2,
  Terminal,
  Zap,
  Layers
} from 'lucide-react';

/**
 * AiUniverse3D: Hyper-Futuristic 3D AI in EduTech Interactive Holodeck
 * 
 * True WebGL 3D experience with 5 interconnected physical 3D stages:
 * 1. CV Scanner: 3D tablet with oscillating laser plane, 3D bounding boxes & point cloud
 * 2. RAG Matrix: 3D crystal hypercube with orbiting vector nodes & cosine radar
 * 3. NLP Attention: Dual concentric transformer rings with orbiting token prisms & synaptic arcs
 * 4. ML Silicon Chip: Physical NPU die with dynamic 3D parametric Loss Wave surface converging
 * 5. AI Synthesis: Quantum geodesic core with shockwave emission rings & solution shards
 * 
 * Plus:
 * - 3D spline conduits with streaming data packets connecting all stages
 * - Smooth cinematic camera transitions with OrbitControls
 * - Live sci-fi telemetry HUD & code terminal
 * - Strictly NO green: Pure cyan, sapphire blue, and cyber violet
 */

const STAGES = [
  {
    id: 'cv',
    number: '01',
    name: 'COMPUTER VISION',
    tag: 'SPATIAL LASER SCANNER ACTIVE',
    headline: 'Optical Neural Scan & Handwritten OCR Extraction',
    details: 'Calibrating multi-spectral depth sensors. Detecting handwritten mathematical formulas and student facial keypoints with real-time 3D bounding box segmentation.',
    telemetry: {
      fps: '120.4 FPS',
      confidence: '99.82%',
      latency: '4.2ms',
      resolution: '4K Ultra-Scan',
      detected: '\\int_{0}^{\\pi} \\sin(x)dx = 2'
    },
    codeStream: [
      '>> [CV_INIT] Sensor matrix linked to /dev/video0',
      '>> [BOUNDING_BOX] Target coordinates: [X: 412, Y: 189, W: 620, H: 480]',
      '>> [OCR_ENGINE] Extracted equation: \\int_{0}^{\\pi} \\sin(x) dx = 2',
      '>> [HANDSHAKE] Dispatched 512-dim visual vector to RAG indexer...'
    ],
    accent: 'cyan',
    icon: Scan,
    camPos: [-6.5, 1.8, 6.5],
    lookAt: [-6.5, 0.5, 2.5]
  },
  {
    id: 'rag',
    number: '02',
    name: 'RAG VECTOR ENGINE',
    tag: 'COSINE SIMILARITY RETRIEVAL',
    headline: 'Multi-Dimensional Vector Knowledge Retrieval',
    details: 'Traversing 250,000+ indexed syllabus textbooks, research papers, and academic lecture transcript embeddings in high-dimensional Hilbert space.',
    telemetry: {
      vectorsIndexed: '284,910',
      topKScore: '0.984 Cosine',
      queryTime: '0.018s',
      dimension: '1536-D Vector',
      topCitation: 'Calculus Vol. 3, Ch. 7'
    },
    codeStream: [
      '>> [RAG_QUERY] Ingested visual embedding from CV node',
      '>> [INDEX_TRAVERSAL] Querying HNSW graph cluster #892',
      '>> [VECTOR_MATCH] 5 verified textbook citations retrieved (score: 0.984)',
      '>> [PIPELINE] Grounded context injected into NLP attention heads...'
    ],
    accent: 'blue',
    icon: Database,
    camPos: [-3.2, 4.5, 2.0],
    lookAt: [-3.2, 3.2, -2.5]
  },
  {
    id: 'nlp',
    number: '03',
    name: 'NLP TRANSFORMER',
    tag: 'MULTI-HEAD ATTENTION MATRIX',
    headline: 'Syntactic Tokenization & Semantic Reasoning',
    details: 'Transformer multi-head self-attention mechanisms decomposing student query into semantic tokens, intent trees, and interactive reasoning graphs.',
    telemetry: {
      contextWindow: '128K Tokens',
      attentionHeads: '32 Parallel',
      perplexity: '1.04 PPL',
      throughput: '148 Tok/sec',
      intent: 'Step-by-step Integral Proof'
    },
    codeStream: [
      '>> [TOKENIZE] Parsing natural language intent with BPE encoder',
      '>> [ATTENTION] Q*K.T / sqrt(d_k) soft-alignment matrix calculated',
      '>> [REASONING] Generating Chain-of-Thought pedagogical proof tree',
      '>> [DISPATCH] Passing token weights to ML Edge Silicon Chip...'
    ],
    accent: 'violet',
    icon: BrainCircuit,
    camPos: [3.2, 4.5, 2.0],
    lookAt: [3.2, 3.2, -2.5]
  },
  {
    id: 'ml',
    number: '04',
    name: 'ML EDGE CHIP',
    tag: 'NEURAL WEIGHT ADAPTATION',
    headline: 'Real-time Silicon Training & Gradient Descent',
    details: 'Accelerating neural weight updates on localized NPU silicon. Tuning learning curves to match the student\'s real-time comprehension velocity.',
    telemetry: {
      lossConvergence: '0.0041',
      flops: '31.4 TFLOPS',
      epochs: 'Adaptive Step',
      temperature: '48.2°C Silicon',
      optimizer: 'AdamW (lr=3e-4)'
    },
    codeStream: [
      '>> [NPU_ENGAGE] Initializing localized edge compute core',
      '>> [GRADIENT_DESCENT] Backward pass executed (learning_rate=0.0003)',
      '>> [LOSS_STABILITY] Loss metric stabilized: 0.0041 (plateau reached)',
      '>> [COMPILED] Adaptive model weights dispatched to GenAI Core...'
    ],
    accent: 'blue',
    icon: Cpu,
    camPos: [6.5, 1.8, 6.5],
    lookAt: [6.5, 0.5, 2.5]
  },
  {
    id: 'ai',
    number: '05',
    name: 'GENAI SYNTHESIS',
    tag: 'AUTONOMOUS SOLUTION FORGED',
    headline: 'Personalized Educational Solution & Interactive Walkthrough',
    details: 'Assembling the verified step-by-step mathematical derivation, interactive 3D graphs, personalized voice hints, and concept mastery badges.',
    telemetry: {
      outputType: 'Interactive Stream',
      hallucinationRate: '0.00% Grounded',
      renderTime: 'Instant Real-Time',
      status: 'Mission Complete',
      studentScore: 'Mastery Level 5/5'
    },
    codeStream: [
      '>> [SYNTHESIZE] Assembling RAG citations + CV OCR + NLP Logic',
      '>> [STREAM_START] Token pipeline dispatching to student dashboard',
      '>> [STATUS] Holographic solution projected onto student workstation',
      '>> [SUCCESS] Feedback loop logged to institutional database ✓'
    ],
    accent: 'cyan',
    icon: Sparkles,
    camPos: [0, 2.0, 4.8],
    lookAt: [0, 0.8, 0]
  }
];

const OVERVIEW_CAM = {
  camPos: [0, 4.5, 13.0],
  lookAt: [0, 1.0, 0]
};

export default function AiUniverse3D() {
  const mountRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0); // 0..4, or -1 for overview
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // References for Three.js animation controller
  const controllerRef = useRef({
    targetCamPos: new THREE.Vector3(...STAGES[0].camPos),
    targetLookAt: new THREE.Vector3(...STAGES[0].lookAt),
    cvLaser: null,
    ragRadar: null,
    nlpRingA: null,
    nlpRingB: null,
    mlLossPlane: null,
    aiCore: null,
    aiRing: null,
    packetGroup: null,
    splinePoints: null,
    time: 0
  });

  // Auto-progress cinematic sequence when isPlaying is true
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStage((curr) => {
            const next = curr < 0 ? 0 : (curr + 1) % STAGES.length;
            return next;
          });
          return 0;
        }
        return prev + 2.5; // ~4 seconds per stage
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Update target camera position when activeStage changes
  useEffect(() => {
    if (activeStage === -1) {
      controllerRef.current.targetCamPos.set(...OVERVIEW_CAM.camPos);
      controllerRef.current.targetLookAt.set(...OVERVIEW_CAM.lookAt);
    } else {
      const stage = STAGES[activeStage];
      controllerRef.current.targetCamPos.set(...stage.camPos);
      controllerRef.current.targetLookAt.set(...stage.lookAt);
    }
  }, [activeStage]);

  // =========================================================================
  // 🚀 THREE.JS WEBGL 3D SCENE SETUP
  // =========================================================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060b19, 0.032);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(...STAGES[0].camPos);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 25;
    controls.minDistance = 3.5;
    controls.target.set(...STAGES[0].lookAt);
    controls.enablePan = false;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    scene.add(ambientLight);

    const cyanKeyLight = new THREE.PointLight(0x00f0ff, 3.5, 60);
    cyanKeyLight.position.set(0, 8, 8);
    scene.add(cyanKeyLight);

    const violetFillLight = new THREE.PointLight(0x8b5cf6, 3.0, 60);
    violetFillLight.position.set(-8, 5, -5);
    scene.add(violetFillLight);

    const blueRimLight = new THREE.PointLight(0x38bdf8, 2.5, 60);
    blueRimLight.position.set(8, 4, 4);
    scene.add(blueRimLight);

    // 3D Perspective Ground Grid
    const groundGrid = new THREE.GridHelper(50, 36, 0x00f0ff, 0x1e293b);
    groundGrid.position.y = -2.5;
    groundGrid.material.transparent = true;
    groundGrid.material.opacity = 0.35;
    scene.add(groundGrid);

    // Ground Holo Radar Ring
    const radarGeo = new THREE.RingGeometry(2.5, 2.55, 64);
    const radarMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const radarMesh = new THREE.Mesh(radarGeo, radarMat);
    radarMesh.rotation.x = -Math.PI / 2;
    radarMesh.position.y = -2.48;
    scene.add(radarMesh);

    // =========================================================================
    // 1. NODE 1: COMPUTER VISION (CV) SCANNER
    // Position: (-6.5, 0.5, 2.5)
    // =========================================================================
    const cvGroup = new THREE.Group();
    cvGroup.position.set(-6.5, 0.5, 2.5);

    // Tablet Base
    const tabletGeo = new THREE.BoxGeometry(2.2, 3.0, 0.08);
    const tabletMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      metalness: 0.85,
      roughness: 0.2
    });
    const tabletMesh = new THREE.Mesh(tabletGeo, tabletMat);
    cvGroup.add(tabletMesh);

    // Tablet Neon Border
    const tabletEdges = new THREE.EdgesGeometry(tabletGeo);
    const tabletBorder = new THREE.LineSegments(
      tabletEdges,
      new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.8 })
    );
    cvGroup.add(tabletBorder);

    // Tablet Screen Canvas Texture
    const cvCanvas = document.createElement('canvas');
    cvCanvas.width = 512;
    cvCanvas.height = 700;
    const ctx = cvCanvas.getContext('2d');
    ctx.fillStyle = '#0a101f';
    ctx.fillRect(0, 0, 512, 700);

    // Draw high-tech schematic on canvas
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 472, 660);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('CV-OPTICAL-SCAN // OCR v4.2', 40, 60);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px monospace';
    ctx.fillText('STUDENT_EXAM_PAPER_INPUT:', 40, 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px serif';
    ctx.fillText('∫ sin(x) dx = -cos(x) + C', 40, 170);
    ctx.fillText('lim (x→0) [sin(x)/x] = 1', 40, 220);

    // Draw bounding boxes on canvas
    ctx.strokeStyle = '#00f0ff';
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(35, 130, 440, 55);
    ctx.strokeRect(35, 185, 440, 50);
    ctx.setLineDash([]);

    // Draw neural node graph on canvas
    ctx.fillStyle = '#8b5cf6';
    ctx.font = '16px monospace';
    ctx.fillText('CONFIDENCE: 99.82% [VERIFIED]', 40, 310);
    ctx.fillText('HANDWRITING ENTROPY: 0.04', 40, 340);
    ctx.fillText('EQUATION TOKEN COUNT: 14', 40, 370);

    // Draw mini diagram
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(256, 490, 80, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(176, 490);
    ctx.lineTo(336, 490);
    ctx.moveTo(256, 410);
    ctx.lineTo(256, 570);
    ctx.stroke();

    const cvTexture = new THREE.CanvasTexture(cvCanvas);
    const screenGeo = new THREE.PlaneGeometry(2.0, 2.8);
    const screenMat = new THREE.MeshBasicMaterial({ map: cvTexture });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.045;
    cvGroup.add(screenMesh);

    // Sweeping 3D Laser Plane
    const laserGeo = new THREE.PlaneGeometry(2.1, 0.12);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const laserMesh = new THREE.Mesh(laserGeo, laserMat);
    laserMesh.position.z = 0.08;
    cvGroup.add(laserMesh);
    controllerRef.current.cvLaser = laserMesh;

    // 3D Spatial Bounding Box Brackets
    const boxGeo = new THREE.BoxGeometry(1.9, 0.7, 0.2);
    const boxEdges = new THREE.EdgesGeometry(boxGeo);
    const boxMesh = new THREE.LineSegments(
      boxEdges,
      new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.9 })
    );
    boxMesh.position.set(0, 0.5, 0.15);
    cvGroup.add(boxMesh);

    // Floating Detected Feature Points
    const ptGeo = new THREE.BufferGeometry();
    const ptPos = new Float32Array(24 * 3);
    for (let i = 0; i < 24; i++) {
      ptPos[i * 3] = (Math.random() - 0.5) * 1.6;
      ptPos[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
      ptPos[i * 3 + 2] = 0.1 + Math.random() * 0.3;
    }
    ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3));
    const ptMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.9
    });
    const ptPoints = new THREE.Points(ptGeo, ptMat);
    cvGroup.add(ptPoints);

    scene.add(cvGroup);

    // =========================================================================
    // 2. NODE 2: RAG VECTOR KNOWLEDGE LATTICE
    // Position: (-3.2, 3.2, -2.5)
    // =========================================================================
    const ragGroup = new THREE.Group();
    ragGroup.position.set(-3.2, 3.2, -2.5);

    // Outer Bounding Hypercube Wireframe
    const hypercubeGeo = new THREE.BoxGeometry(2.2, 2.2, 2.2);
    const hypercubeEdges = new THREE.EdgesGeometry(hypercubeGeo);
    const hypercubeMesh = new THREE.LineSegments(
      hypercubeEdges,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 })
    );
    ragGroup.add(hypercubeMesh);

    // Inner Spinning Crystal Octahedron
    const crystalGeo = new THREE.OctahedronGeometry(0.9, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      emissive: 0x2563eb,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: true
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    ragGroup.add(crystalMesh);

    // 35 Floating Vector Data Nodes
    const vectorGroup = new THREE.Group();
    const vectorCount = 35;
    for (let i = 0; i < vectorCount; i++) {
      const vGeo = i % 2 === 0 ? new THREE.BoxGeometry(0.12, 0.12, 0.12) : new THREE.OctahedronGeometry(0.08, 0);
      const vMat = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? 0x00f0ff : i % 3 === 1 ? 0x38bdf8 : 0x8b5cf6
      });
      const vMesh = new THREE.Mesh(vGeo, vMat);
      vMesh.position.set(
        (Math.random() - 0.5) * 1.8,
        (Math.random() - 0.5) * 1.8,
        (Math.random() - 0.5) * 1.8
      );
      vMesh.userData = {
        speed: 0.5 + Math.random() * 0.8,
        axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()
      };
      vectorGroup.add(vMesh);
    }
    ragGroup.add(vectorGroup);

    // Cosine Radar Search Ring
    const ragRadarGeo = new THREE.RingGeometry(0.7, 0.85, 32);
    const ragRadarMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const ragRadarMesh = new THREE.Mesh(ragRadarGeo, ragRadarMat);
    ragRadarMesh.rotation.x = Math.PI / 2;
    ragGroup.add(ragRadarMesh);
    controllerRef.current.ragRadar = ragRadarMesh;

    scene.add(ragGroup);

    // =========================================================================
    // 3. NODE 3: NLP TRANSFORMER ATTENTION ENGINE
    // Position: (3.2, 3.2, -2.5)
    // =========================================================================
    const nlpGroup = new THREE.Group();
    nlpGroup.position.set(3.2, 3.2, -2.5);

    // Concentric Attention Ring A (Cyan)
    const ringAGeo = new THREE.TorusGeometry(1.5, 0.04, 16, 64);
    const ringAMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const ringAMesh = new THREE.Mesh(ringAGeo, ringAMat);
    nlpGroup.add(ringAMesh);
    controllerRef.current.nlpRingA = ringAMesh;

    // Concentric Attention Ring B (Violet)
    const ringBGeo = new THREE.TorusGeometry(1.05, 0.035, 16, 64);
    const ringBMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6 });
    const ringBMesh = new THREE.Mesh(ringBGeo, ringBMat);
    ringBMesh.rotation.x = Math.PI / 3;
    nlpGroup.add(ringBMesh);
    controllerRef.current.nlpRingB = ringBMesh;

    // 6 Orbiting Token Prisms
    const tokenGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const tGeo = new THREE.OctahedronGeometry(0.2, 0);
      const tMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.7,
        metalness: 0.8
      });
      const tMesh = new THREE.Mesh(tGeo, tMat);
      tMesh.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0);
      tokenGroup.add(tMesh);
    }
    nlpGroup.add(tokenGroup);

    // Synaptic Attention Lines (Q * K.T)
    const synGeo = new THREE.BufferGeometry();
    const synPositions = new Float32Array(6 * 3);
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      synPositions[i * 3] = Math.cos(angle) * 1.5;
      synPositions[i * 3 + 1] = Math.sin(angle) * 1.5;
      synPositions[i * 3 + 2] = 0;
    }
    synGeo.setAttribute('position', new THREE.BufferAttribute(synPositions, 3));
    const synMat = new THREE.LineBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.6
    });
    const synLines = new THREE.Line(synGeo, synMat);
    nlpGroup.add(synLines);

    scene.add(nlpGroup);

    // =========================================================================
    // 4. NODE 4: ML SILICON EDGE CHIP & DYNAMIC LOSS WAVE
    // Position: (6.5, 0.5, 2.5)
    // =========================================================================
    const mlGroup = new THREE.Group();
    mlGroup.position.set(6.5, 0.5, 2.5);

    // Silicon Substrate Base
    const chipBaseGeo = new THREE.BoxGeometry(2.4, 0.16, 2.4);
    const chipBaseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.3
    });
    const chipBase = new THREE.Mesh(chipBaseGeo, chipBaseMat);
    mlGroup.add(chipBase);

    // Central NPU Die
    const dieGeo = new THREE.BoxGeometry(1.3, 0.24, 1.3);
    const dieMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.5,
      metalness: 0.95,
      roughness: 0.1
    });
    const dieMesh = new THREE.Mesh(dieGeo, dieMat);
    mlGroup.add(dieMesh);

    // Gold/Cyan Edge Pins
    const pinGroup = new THREE.Group();
    for (let i = 0; i < 16; i++) {
      const pGeo = new THREE.BoxGeometry(0.08, 0.05, 0.15);
      const pMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(-1.1 + (i / 15) * 2.2, 0, 1.25);
      pinGroup.add(pMesh);

      const pMesh2 = pMesh.clone();
      pMesh2.position.z = -1.25;
      pinGroup.add(pMesh2);
    }
    mlGroup.add(pinGroup);

    // Dynamic 3D Parametric Loss Wave Surface (Hovering above the chip!)
    const lossWaveGeo = new THREE.PlaneGeometry(1.9, 1.9, 22, 22);
    const lossWaveMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const lossWaveMesh = new THREE.Mesh(lossWaveGeo, lossWaveMat);
    lossWaveMesh.rotation.x = -Math.PI / 2;
    lossWaveMesh.position.y = 0.85;
    mlGroup.add(lossWaveMesh);
    controllerRef.current.mlLossPlane = lossWaveMesh;

    scene.add(mlGroup);

    // =========================================================================
    // 5. NODE 5: AUTONOMOUS AI SYNTHESIS (QUANTUM CORE)
    // Position: (0, 0.8, 0) [CENTER STAGE]
    // =========================================================================
    const aiGroup = new THREE.Group();
    aiGroup.position.set(0, 0.8, 0);

    // Outer Geodesic Icosahedron Wireframe
    const outerGeo = new THREE.IcosahedronGeometry(1.8, 1);
    const outerEdges = new THREE.EdgesGeometry(outerGeo);
    const outerMesh = new THREE.LineSegments(
      outerEdges,
      new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.7 })
    );
    aiGroup.add(outerMesh);
    controllerRef.current.aiCore = outerMesh;

    // Mid Geodesic Dodecahedron
    const midGeo = new THREE.DodecahedronGeometry(1.25, 0);
    const midEdges = new THREE.EdgesGeometry(midGeo);
    const midMesh = new THREE.LineSegments(
      midEdges,
      new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.6 })
    );
    aiGroup.add(midMesh);

    // Inner Radiant Orb
    const orbGeo = new THREE.SphereGeometry(0.65, 32, 32);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.9,
      roughness: 0.1
    });
    const orbMesh = new THREE.Mesh(orbGeo, orbMat);
    aiGroup.add(orbMesh);

    // Concentric Emission Shockwave Ring
    const aiRingGeo = new THREE.RingGeometry(1.85, 1.95, 48);
    const aiRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const aiRingMesh = new THREE.Mesh(aiRingGeo, aiRingMat);
    aiRingMesh.rotation.x = Math.PI / 2;
    aiGroup.add(aiRingMesh);
    controllerRef.current.aiRing = aiRingMesh;

    // 8 Floating Solution Diamond Shards
    const shardGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const sGeo = new THREE.OctahedronGeometry(0.18, 0);
      const sMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
      const sMesh = new THREE.Mesh(sGeo, sMat);
      sMesh.position.set(Math.cos(angle) * 2.2, (Math.random() - 0.5) * 0.8, Math.sin(angle) * 2.2);
      shardGroup.add(sMesh);
    }
    aiGroup.add(shardGroup);

    scene.add(aiGroup);

    // =========================================================================
    // 6. INTERCONNECTING 3D ENERGY CONDUITS & PACKET HIGHWAY
    // Connects: CV -> RAG -> NLP -> ML -> AI -> CV
    // =========================================================================
    const curvePoints = [
      new THREE.Vector3(-6.5, 0.5, 2.5),  // CV
      new THREE.Vector3(-3.2, 3.2, -2.5), // RAG
      new THREE.Vector3(3.2, 3.2, -2.5),  // NLP
      new THREE.Vector3(6.5, 0.5, 2.5),   // ML
      new THREE.Vector3(0, 0.8, 0),       // AI
      new THREE.Vector3(-6.5, 0.5, 2.5)   // Loop back to CV
    ];

    const splineCurve = new THREE.CatmullRomCurve3(curvePoints, true, 'catmullrom', 0.4);
    const splineGeo = new THREE.BufferGeometry().setFromPoints(splineCurve.getPoints(120));
    const splineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.45
    });
    const splineLine = new THREE.Line(splineGeo, splineMat);
    scene.add(splineLine);

    // Streaming Data Packets along the spline
    const packetGroup = new THREE.Group();
    const packetCount = 28;
    const packetMeshes = [];

    for (let i = 0; i < packetCount; i++) {
      const pGeo = new THREE.SphereGeometry(0.09, 12, 12);
      const pMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00f0ff : 0x8b5cf6
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.userData = {
        offset: i / packetCount,
        speed: 0.08
      };
      packetGroup.add(pMesh);
      packetMeshes.push(pMesh);
    }
    scene.add(packetGroup);
    controllerRef.current.packetGroup = packetMeshes;
    controllerRef.current.splineCurve = splineCurve;

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // =========================================================================
    // 7. ANIMATION RENDER LOOP (60 FPS)
    // =========================================================================
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      controllerRef.current.time = elapsed;

      // Smooth Camera Lerp towards target
      camera.position.lerp(controllerRef.current.targetCamPos, 0.04);
      controls.target.lerp(controllerRef.current.targetLookAt, 0.04);
      controls.update();

      // 1. CV Laser Sweep Animation
      if (controllerRef.current.cvLaser) {
        controllerRef.current.cvLaser.position.y = Math.sin(elapsed * 3.5) * 1.15;
      }

      // 2. RAG Matrix Rotation & Radar Sweep
      crystalMesh.rotation.y = elapsed * 0.6;
      crystalMesh.rotation.x = elapsed * 0.3;
      vectorGroup.rotation.y = elapsed * 0.2;
      if (controllerRef.current.ragRadar) {
        controllerRef.current.ragRadar.rotation.z = elapsed * 1.8;
      }

      // 3. NLP Attention Rings Spinning
      if (controllerRef.current.nlpRingA) {
        controllerRef.current.nlpRingA.rotation.z = elapsed * 0.7;
        controllerRef.current.nlpRingA.rotation.x = Math.sin(elapsed * 0.4) * 0.2;
      }
      if (controllerRef.current.nlpRingB) {
        controllerRef.current.nlpRingB.rotation.z = -elapsed * 0.9;
        controllerRef.current.nlpRingB.rotation.y = Math.cos(elapsed * 0.5) * 0.3;
      }
      tokenGroup.rotation.z = elapsed * 0.5;

      // 4. ML Silicon Loss Wave Parametric Deformation
      if (controllerRef.current.mlLossPlane) {
        const positions = controllerRef.current.mlLossPlane.geometry.attributes.position;
        const decay = Math.exp(-(progress / 100) * 1.8);

        for (let i = 0; i < positions.count; i++) {
          const u = positions.getX(i);
          const v = positions.getY(i);
          // Parametric Loss surface with decaying amplitude (Gradient Descent converging!)
          const z = Math.sin(u * 4.5 - elapsed * 3.0) * Math.cos(v * 4.5 - elapsed * 2.5) * 0.28 * decay;
          positions.setZ(i, z);
        }
        positions.needsUpdate = true;
      }

      // 5. AI Core Geodesic Shells Spinning
      if (controllerRef.current.aiCore) {
        controllerRef.current.aiCore.rotation.y = elapsed * 0.4;
        controllerRef.current.aiCore.rotation.x = elapsed * 0.2;
      }
      midMesh.rotation.y = -elapsed * 0.5;
      midMesh.rotation.z = elapsed * 0.3;
      shardGroup.rotation.y = elapsed * 0.3;

      if (controllerRef.current.aiRing) {
        const scale = 1.0 + (Math.sin(elapsed * 2.5) * 0.5 + 0.5) * 0.35;
        controllerRef.current.aiRing.scale.set(scale, scale, 1);
        controllerRef.current.aiRing.material.opacity = 0.8 - (scale - 1.0) * 1.8;
      }

      // 6. Data Packets Flowing along Interconnected Spline
      if (controllerRef.current.packetGroup && controllerRef.current.splineCurve) {
        const packets = controllerRef.current.packetGroup;
        const curve = controllerRef.current.splineCurve;

        packets.forEach((mesh) => {
          let u = (elapsed * mesh.userData.speed + mesh.userData.offset) % 1.0;
          const pos = curve.getPointAt(u);
          mesh.position.copy(pos);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  const currentStage = activeStage >= 0 ? STAGES[activeStage] : null;

  return (
    <section id="ai-3d-lab" className="py-20 relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold shadow-lg shadow-cyan-950/50">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>INTERACTIVE 3D AI IN EDUTECH HOLODECK</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-chakra font-black tracking-tight text-white uppercase">
            3D AUTONOMOUS COGNITIVE ENGINE
          </h2>

          <p className="text-slate-400 font-mono text-xs sm:text-sm">
            Rotate in 360°, inspect real 3D neural nodes, and watch the interconnected data pipeline flow from Computer Vision to Silicon ML and Autonomous Synthesis.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 🎮 3D INTERACTIVE VIEWPORT CONTAINER                                       */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-950/90 shadow-[0_0_60px_rgba(6,182,212,0.18)] backdrop-blur-2xl">
          
          {/* Top HUD Controls Bar */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/90 border-b border-cyan-500/20 backdrop-blur-md">
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-chakra font-black text-cyan-300 tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>3D SIMULATION LIVE</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                {activeStage >= 0 ? `PHASE [0${activeStage + 1}/05] • ${currentStage.name}` : 'FULL 3D ORBIT VIEW'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-white font-chakra font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isPlaying ? 'PAUSE AUTO-TOUR' : 'RESUME AUTO-TOUR'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveStage(-1);
                  setIsPlaying(false);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-chakra font-bold flex items-center gap-1.5 transition-all ${
                  activeStage === -1
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
                title="View Entire 3D Pipeline"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>360° OVERVIEW</span>
              </button>

              <button
                onClick={() => {
                  setActiveStage(0);
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all"
                title="Restart Tour from CV"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Actual 3D WebGL Canvas Mount */}
          <div className="relative w-full h-[450px] sm:h-[580px] cursor-grab active:cursor-grabbing">
            <div ref={mountRef} className="absolute inset-0 w-full h-full" />

            {/* Floating 3D Interaction Guide Hint */}
            <div className="absolute top-4 left-4 pointer-events-none z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 backdrop-blur-md shadow-lg">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>DRAG TO ROTATE 3D • SCROLL TO ZOOM</span>
            </div>

            {/* Floating Sci-Fi Telemetry Panel (Linked to Active Stage) */}
            {currentStage && (
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md pointer-events-auto z-10 p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 backdrop-blur-xl shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      PHASE {currentStage.number}: {currentStage.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {currentStage.tag}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  {currentStage.details}
                </p>

                {/* Telemetry Metric Pills */}
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  {Object.entries(currentStage.telemetry).map(([key, val]) => (
                    <div key={key} className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col">
                      <span className="text-[9px] text-slate-400 uppercase">{key}</span>
                      <span className="font-bold text-white truncate">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom 5-Stage Interconnected Selector Deck */}
          <div className="p-3 sm:p-4 bg-slate-950/95 border-t border-cyan-500/20 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {STAGES.map((stage, idx) => {
              const isActive = idx === activeStage;
              const isPast = idx < activeStage;
              const Icon = stage.icon;

              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    setActiveStage(idx);
                    setProgress(0);
                    setIsPlaying(false);
                  }}
                  className={`text-left p-3 rounded-2xl transition-all relative overflow-hidden border ${
                    isActive
                      ? 'bg-gradient-to-b from-cyan-950/90 to-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {/* Active Progress Line */}
                  {isActive && isPlaying && (
                    <div
                      className="absolute top-0 left-0 bottom-0 bg-cyan-500/15 transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  )}

                  <div className="flex items-center justify-between mb-1 relative z-10 font-mono text-[10px]">
                    <span className={isActive ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                      STAGE {stage.number}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  </div>

                  <div className={`text-xs font-chakra font-black tracking-wide truncate relative z-10 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {stage.name}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
