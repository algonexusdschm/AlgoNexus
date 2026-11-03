import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, Zap, CheckCircle2, ChevronRight, Activity, Terminal, Shield, Cpu, Scan, Database, BrainCircuit, Sparkles } from 'lucide-react';

/**
 * AiUniverse3D: Hyper-Futuristic Cyber Deck (Video Feed Pipeline)
 * 
 * Features:
 * - High-tech Sci-Fi HUD overlays (Reticles, Coordinate trackers, Frequency Oscilloscope, Cyber Traces)
 * - 5 Interconnected Cinematic Stage Views (CV Optical Scanner, RAG Vector Cube Matrix, NLP Synapse Transformer, ML Silicon Core, AI Generative Hologram)
 * - Animated Laser Sweeps, Bounding Boxes, Gradient Loss Waveforms & Token Particles
 * - Cyberpunk/Sci-Fi soundless video simulation with live system telemetry
 */

const PIPELINE_STAGES = [
  {
    id: 'cv',
    number: '01',
    name: 'COMPUTER VISION',
    tag: 'SPATIAL RETICLE ACTIVE',
    headline: 'Optical Neural Scan & Student OCR Extraction',
    details: 'Calibrating multi-spectral depth sensors. Detecting handwritten mathematical formulas and student facial keypoints with real-time bounding box segmentation.',
    telemetry: {
      fps: '120.4 FPS',
      confidence: '99.82%',
      latency: '4.2ms',
      resolution: '4K Ultra-Scan'
    },
    codeStream: [
      '>> [CV_INIT] Sensor matrix linked to /dev/video0',
      '>> [BOUNDING_BOX] Target coordinates: [X: 412, Y: 189, W: 620, H: 480]',
      '>> [OCR_ENGINE] Extracted equation: \\int_{0}^{\\pi} \\sin(x) dx = 2',
      '>> [HANDSHAKE] Dispatched 512-dim visual vector to RAG indexer...'
    ],
    accent: 'sky'
  },
  {
    id: 'rag',
    number: '02',
    name: 'RAG VECTOR ENGINE',
    tag: 'COSINE SIMILARITY SEARCH',
    headline: 'Multi-Dimensional Vector Knowledge Retrieval',
    details: 'Traversing 250,000+ indexed syllabus textbooks, research papers, and academic lecture transcript embeddings in high-dimensional Hilbert space.',
    telemetry: {
      vectorsIndexed: '284,910',
      topKScore: '0.984 Cosine',
      queryTime: '0.018s',
      dimension: '1536-D Vector'
    },
    codeStream: [
      '>> [RAG_QUERY] Ingested visual embedding from CV node',
      '>> [INDEX_TRAVERSAL] Querying HNSW graph cluster #892',
      '>> [VECTOR_MATCH] 5 verified textbook citations retrieved (score: 0.984)',
      '>> [PIPELINE] Grounded context injected into NLP attention heads...'
    ],
    accent: 'blue'
  },
  {
    id: 'nlp',
    number: '03',
    name: 'NLP TRANSFORMER',
    tag: 'MULTI-HEAD ATTENTION',
    headline: 'Syntactic Tokenization & Semantic Reasoning',
    details: 'Transformer multi-head self-attention mechanisms decomposing student query into semantic tokens, intent trees, and interactive reasoning graphs.',
    telemetry: {
      contextWindow: '128K Tokens',
      attentionHeads: '32 Parallel',
      perplexity: '1.04 PPL',
      throughput: '148 Tok/sec'
    },
    codeStream: [
      '>> [TOKENIZE] Parsing natural language intent with BPE encoder',
      '>> [ATTENTION] Q*K.T / sqrt(d_k) soft-alignment matrix calculated',
      '>> [REASONING] Generating Chain-of-Thought pedagogical proof tree',
      '>> [DISPATCH] Passing token weights to ML Edge Silicon Chip...'
    ],
    accent: 'indigo'
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
      temperature: '48.2°C Silicon'
    },
    codeStream: [
      '>> [NPU_ENGAGE] Initializing localized edge compute core',
      '>> [GRADIENT_DESCENT] Backward pass executed (learning_rate=0.0003)',
      '>> [LOSS_STABILITY] Loss metric stabilized: 0.0041 (plateau reached)',
      '>> [COMPILED] Adaptive model weights dispatched to GenAI Core...'
    ],
    accent: 'amber'
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
      status: 'Mission Complete'
    },
    codeStream: [
      '>> [SYNTHESIZE] Assembling RAG citations + CV OCR + NLP Logic',
      '>> [STREAM_START] Token pipeline dispatching to student dashboard',
      '>> [STATUS] Holographic solution projected onto student workstation',
      '>> [SUCCESS] Feedback loop logged to institutional database ✓'
    ],
    accent: 'purple'
  }
];

export default function AiUniverse3D() {
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Auto-progress cinematic sequence
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStage((curr) => (curr + 1) % PIPELINE_STAGES.length);
          return 0;
        }
        return prev + 2.5; // ~4 seconds per stage
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const current = PIPELINE_STAGES[activeStage];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#0a0f1d]">
      
      {/* Layer 0: Futuristic Cybernetic Architectural Atrium Backdrop */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-screen pointer-events-none scale-105"
        style={{ backgroundImage: "url('/images/edutech_cyber_atrium_2050.jpg')" }}
      />

      {/* Layer 1: High-Tech Cyber Grid & Coordinate Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,165,233,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.07)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_10%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Layer 2: Moving Holographic Laser Horizon Line */}
      <div className="absolute top-1/4 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#06b6d4] opacity-50 animate-pulse pointer-events-none" />

      {/* ========================================================================= */}
      {/* 🚀 SCI-FI CYBER DECK INTERFACE (Interconnected Cinematic Stage Feed)       */}
      {/* ========================================================================= */}
      <div className="absolute top-20 sm:top-24 left-0 right-0 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pointer-events-auto">
        
        {/* Main Glass Cyber Frame */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(6,182,212,0.18)] space-y-5 relative overflow-hidden">
          
          {/* Neon Corner Tech Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-2xl" />

          {/* Top HUD Telemetry Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>AI IN EDUTECH • PIPELINE LIVE</span>
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                STAGE [0{activeStage + 1}/05] • 100% AUTONOMOUS HANDSHAKE
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-chakra font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isPlaying ? 'PAUSE FEED' : 'RESUME FEED'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveStage(0);
                  setProgress(0);
                }}
                className="p-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300"
                title="Restart Pipeline Video Loop"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 5 Interconnected Futuristic Stepper Nodes with Synaptic Data Pulses */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 relative">
            {PIPELINE_STAGES.map((stage, idx) => {
              const isActive = idx === activeStage;
              const isDone = idx < activeStage;

              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    setActiveStage(idx);
                    setProgress(0);
                  }}
                  className={`text-left p-3.5 rounded-2xl transition-all relative overflow-hidden border ${
                    isActive
                      ? 'bg-gradient-to-b from-cyan-950/90 via-slate-900 to-slate-950 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.35)] scale-[1.02]'
                      : isDone
                      ? 'bg-slate-900/80 border-slate-700/80 hover:border-slate-500 opacity-90'
                      : 'bg-slate-950/60 border-slate-800/70 opacity-60'
                  }`}
                >
                  {/* Progress laser beam */}
                  {isActive && (
                    <div 
                      className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-cyan-500/10 via-cyan-500/20 to-transparent transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  )}

                  <div className="flex items-center justify-between mb-1.5 relative z-10 font-mono">
                    <span className={`text-[10px] font-black ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                      PHASE {stage.number}
                    </span>
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    ) : isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    ) : null}
                  </div>

                  <div className={`text-xs font-chakra font-black tracking-wide truncate relative z-10 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {stage.name}
                  </div>
                  <div className="text-[9px] font-mono text-cyan-400/80 truncate relative z-10">
                    {stage.tag}
                  </div>
                </button>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* 🌟 CINEMATIC VIDEO SIMULATION STAGE (Visibly Doing the Work)                */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Visualizer Frame (Camera/Laser/Silicon/Vector Simulation Screen) */}
            <div className="lg:col-span-7 rounded-2xl bg-slate-950 border border-cyan-500/40 p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between shadow-inner min-h-[220px]">
              
              {/* Scanline Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none opacity-40 z-20" />

              {/* Stage Header Info */}
              <div className="flex items-center justify-between relative z-30 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold text-slate-400">REC // LIVE FEED</span>
                  <span className="text-cyan-400 font-bold">• {current.name}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  {current.tag}
                </span>
              </div>

              {/* DYNAMIC VISUAL GRAPHICS PER STAGE */}
              <div className="py-5 my-auto relative z-30 flex items-center justify-center">
                
                {/* 1. CV MODE: Scanning Document with Moving Laser Reticle */}
                {current.id === 'cv' && (
                  <div className="relative w-full max-w-sm h-36 bg-slate-900/90 rounded-xl border border-sky-500/40 p-3 overflow-hidden shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                    {/* Laser Scanner Bar */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] qr-scanner-laser pointer-events-none" />

                    {/* Bounding Box 1: Face Detection */}
                    <div className="absolute top-3 left-4 w-20 h-20 border-2 border-emerald-400 rounded-lg bg-emerald-500/10 flex flex-col justify-between p-1">
                      <span className="text-[8px] font-mono font-bold text-emerald-400">STUDENT_ID [99.4%]</span>
                      <span className="text-[7px] font-mono text-slate-400">XYZ: (124, 88)</span>
                    </div>

                    {/* Bounding Box 2: Equation Detection */}
                    <div className="absolute top-6 right-4 w-44 h-24 border-2 border-cyan-400 rounded-lg bg-cyan-500/10 p-2 flex flex-col justify-between">
                      <span className="text-[8px] font-mono font-bold text-cyan-400">MATH_OCR_SEGMENT</span>
                      <div className="font-mono text-xs text-white">∫ sin(x) dx = -cos(x) + C</div>
                      <span className="text-[7px] font-mono text-emerald-400">TOKEN MATCHED: 100%</span>
                    </div>
                  </div>
                )}

                {/* 2. RAG MODE: 3D Vector Cube Space */}
                {current.id === 'rag' && (
                  <div className="relative w-full max-w-sm h-36 bg-slate-900/90 rounded-xl border border-blue-500/40 p-4 flex items-center justify-around overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.2)] font-mono text-xs">
                    <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-400 text-center animate-pulse">
                      <Database className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <div className="text-[9px] font-bold text-white">VECTOR DB</div>
                      <div className="text-[8px] text-blue-300">250k Chunks</div>
                    </div>

                    <div className="text-cyan-400 text-xs font-bold animate-bounce">
                      ── [COSINE: 0.984] ──►
                    </div>

                    <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-400 text-center">
                      <div className="text-[9px] font-bold text-emerald-400">VERIFIED CITATION</div>
                      <div className="text-[8px] text-slate-300 mt-1">Calculus Vol. 2 §4.1</div>
                      <div className="text-[7px] text-cyan-400">Zero Hallucination</div>
                    </div>
                  </div>
                )}

                {/* 3. NLP MODE: Attention Transformer Stream */}
                {current.id === 'nlp' && (
                  <div className="relative w-full max-w-sm h-36 bg-slate-900/90 rounded-xl border border-indigo-500/40 p-3 flex flex-col justify-between overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.2)] font-mono">
                    <div className="flex items-center justify-between text-[9px] text-indigo-300 border-b border-indigo-900 pb-1">
                      <span>MULTI-HEAD ATTENTION MATRIX</span>
                      <span className="text-emerald-400">32 HEADS ACTIVE</span>
                    </div>

                    <div className="flex items-center justify-between gap-1 py-1">
                      {['Integrate', 'Function', 'sin(x)', 'across', 'Interval', '[0, π]'].map((token, i) => (
                        <div key={i} className="px-2 py-1 rounded bg-indigo-950/80 border border-indigo-500/50 text-[9px] text-white text-center">
                          <div className="text-indigo-400 text-[7px]">T{i+1}</div>
                          <div>{token}</div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[9px] text-emerald-400 flex items-center justify-between">
                      <span>Attention Arc: (sin(x) ↔ Interval: 0.96)</span>
                      <span>148 Tok/s</span>
                    </div>
                  </div>
                )}

                {/* 4. ML MODE: Silicon Chip with Real-time Loss Descent */}
                {current.id === 'ml' && (
                  <div className="relative w-full max-w-sm h-36 bg-slate-900/90 rounded-xl border border-amber-500/40 p-3 flex flex-col justify-between overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.2)] font-mono">
                    <div className="flex items-center justify-between text-[9px] text-amber-300 border-b border-amber-900 pb-1">
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-amber-400" />
                        <span>NPU SILICON CORE [TFLOPS: 31.4]</span>
                      </span>
                      <span className="text-emerald-400">CONVERGED ✓</span>
                    </div>

                    {/* Gradient Loss descent curve visualization */}
                    <div className="flex items-end justify-between h-14 gap-1 px-2 pt-2">
                      {[1.2, 0.95, 0.72, 0.54, 0.38, 0.22, 0.14, 0.08, 0.04, 0.01].map((loss, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-0.5">
                          <div 
                            className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t"
                            style={{ height: `${loss * 40}px` }}
                          />
                          <span className="text-[6px] text-slate-500">{idx + 1}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[8px] text-slate-400 flex items-center justify-between">
                      <span>Epoch 10: Loss = 0.012 (Optimal)</span>
                      <span className="text-amber-400">Weights Locked</span>
                    </div>
                  </div>
                )}

                {/* 5. AI GENERATION MODE: Holographic Solution Output */}
                {current.id === 'ai' && (
                  <div className="relative w-full max-w-sm h-36 bg-slate-900/90 rounded-xl border border-purple-500/40 p-3 flex flex-col justify-between overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.25)] font-mono">
                    <div className="flex items-center justify-between text-[9px] text-purple-300 border-b border-purple-900 pb-1">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>PERSONALIZED TUTORING SOLUTION</span>
                      </span>
                      <span className="text-emerald-400 animate-pulse">STREAMING</span>
                    </div>

                    <div className="space-y-1 text-left bg-purple-950/40 p-2 rounded-lg border border-purple-800/40 text-[10px] text-white">
                      <div className="text-purple-300 font-bold">Step 1: Compute Antiderivative:</div>
                      <div className="text-slate-300 pl-2">F(x) = -cos(x)</div>
                      <div className="text-purple-300 font-bold">Step 2: Evaluate Limits [0, π]:</div>
                      <div className="text-emerald-300 font-bold pl-2">(-cos(π)) - (-cos(0)) = 1 - (-1) = 2.0 ✓</div>
                    </div>

                    <div className="text-[8px] text-purple-300 flex items-center justify-between">
                      <span>Zero Hallucination Grounded</span>
                      <span className="text-emerald-400">Student Mastery: +15 XP</span>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Real-time Telemetry Bar */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center font-mono">
                {Object.entries(current.telemetry).map(([key, val]) => (
                  <div key={key} className="bg-slate-900/90 py-1 px-1.5 rounded-lg border border-slate-800">
                    <div className="text-[8px] text-slate-500 uppercase truncate">{key}</div>
                    <div className="text-[10px] font-bold text-cyan-400 truncate">{val}</div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Command Feed: Real-time Terminal Log Stream */}
            <div className="lg:col-span-5 rounded-2xl bg-slate-950 border border-slate-800 p-4 sm:p-5 flex flex-col justify-between font-mono text-xs shadow-inner">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>NEURAL PIPELINE TELEMETRY</span>
                  </span>
                  <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                    ACTIVE
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-chakra font-bold text-white tracking-wide">
                    {current.headline}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {current.details}
                  </p>
                </div>

                {/* Console Log Terminal Stream */}
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-1.5 text-[10px]">
                  {current.codeStream.map((log, lIdx) => (
                    <div key={lIdx} className="text-slate-300 font-mono leading-tight">
                      <span className="text-cyan-400">#</span> {log}
                    </div>
                  ))}
                  <div className="text-emerald-400 text-[9px] pt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Synchronizing with next node in pipeline...</span>
                  </div>
                </div>
              </div>

              {/* Handshake Ribbon */}
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Handshake Protocol: v4.2</span>
                <span className="text-cyan-400 font-bold">100% Interconnected ✓</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
