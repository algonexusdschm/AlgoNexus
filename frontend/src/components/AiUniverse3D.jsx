import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, Zap, CheckCircle2, ChevronRight } from 'lucide-react';

/**
 * AiUniverse3D (Cinema Mode)
 * Replaces the globe/sphere structure with a continuous cinematic, step-by-step
 * interconnected video-style pipeline running across the background:
 *
 * STEP 1: [📸 Computer Vision] Scanning student assignment / document
 *    │ (live laser beam sweeps across photo, detecting bounding boxes)
 *    ▼ (streaming neural data pipeline)
 * STEP 2: [📚 RAG Vector Knowledge] Indexing text embeddings against textbook DB
 *    │ (vector similarity matching & verified citation retrieval)
 *    ▼ (streaming context window)
 * STEP 3: [💬 NLP Transformer] Multi-Head Attention tokenization & syntactic breakdown
 *    │ (conversational reasoning & logic synthesis)
 *    ▼ (gradient descent & weights update)
 * STEP 4: [💻 ML Silicon Engine] Edge model training & real-time loss convergence
 *    │ (fine-tuned model output)
 *    ▼ (deployment to student)
 * STEP 5: [🧠 Generative AI Core] Live personalized solution & tutoring response generated!
 */

const PIPELINE_STEPS = [
  {
    id: 'cv',
    number: '01',
    name: 'Computer Vision',
    badge: 'SCAN & DETECT',
    action: 'Scanning handwritten student math equation & student face via optical laser reticle',
    metric: '99.4% OCR Confidence',
    color: 'from-sky-500 to-blue-600',
    borderColor: 'border-sky-500',
    textColor: 'text-sky-600',
    bgBadge: 'bg-sky-50',
    codeSnippet: 'model.detect_objects(frame, threshold=0.94)'
  },
  {
    id: 'rag',
    number: '02',
    name: 'RAG Knowledge Base',
    badge: 'VECTOR RETRIEVAL',
    action: 'Cosine similarity search querying 50,000+ verified textbook vector embeddings',
    metric: '0.04s Vector Query Latency',
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-600',
    textColor: 'text-blue-600',
    bgBadge: 'bg-blue-50',
    codeSnippet: 'pinecone.query(vector=embeddings, top_k=5)'
  },
  {
    id: 'nlp',
    number: '03',
    name: 'NLP Transformer',
    badge: 'ATTENTION SYNAPSE',
    action: 'Multi-head attention parsing syntactic tokens, intent classification & logic reasoning',
    metric: '4,096 Token Context Window',
    color: 'from-indigo-600 to-purple-600',
    borderColor: 'border-purple-600',
    textColor: 'text-purple-600',
    bgBadge: 'bg-purple-50',
    codeSnippet: 'attention_weights = softmax(Q @ K.T / sqrt(d_k))'
  },
  {
    id: 'ml',
    number: '04',
    name: 'Machine Learning Engine',
    badge: 'TRAINING & ADAPTATION',
    action: 'Real-time gradient descent optimizing personalized learning pacing on edge silicon',
    metric: 'Loss converged to 0.012',
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-600',
    bgBadge: 'bg-amber-50',
    codeSnippet: 'loss.backward(); optimizer.step()'
  },
  {
    id: 'ai',
    number: '05',
    name: 'Generative AI Master Core',
    badge: 'LIVE SYNTHESIS',
    action: 'Assembling verified personalized tutoring roadmap, hints, and step-by-step solution',
    metric: 'Real-Time Streaming Output',
    color: 'from-sky-600 via-blue-600 to-indigo-600',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-600',
    bgBadge: 'bg-blue-50',
    codeSnippet: 'yield response.stream_tokens()'
  }
];

export default function AiUniverse3D() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Auto-progress cinematic pipeline (like an interconnected animated video loop)
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((step) => (step + 1) % PIPELINE_STEPS.length);
          return 0;
        }
        return prev + 2.5; // ~4 seconds per step
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const current = PIPELINE_STEPS[activeStep];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gradient-to-b from-slate-100 via-sky-50/30 to-slate-100">
      
      {/* Background Architectural Canvas */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 mix-blend-multiply pointer-events-none scale-105"
        style={{ backgroundImage: "url('/images/edutech_cyber_atrium_2050.jpg')" }}
      />

      {/* Cyber Grid Lines */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none"
      />

      {/* ========================================================================= */}
      {/* CINEMATIC VIDEO-STYLE PIPELINE STAGE (Interconnected Horizontal Rail)       */}
      {/* ========================================================================= */}
      <div className="absolute top-24 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
        
        {/* Top Video Pipeline Stepper Ribbon */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xl shadow-slate-200/50 space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                LIVE INTERCONNECTED AI IN EDUTECH PIPELINE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                STEP {activeStep + 1} OF 5
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title={isPlaying ? 'Pause Video Pipeline' : 'Play Video Pipeline'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-blue-600" />}
              </button>
              <button
                onClick={() => {
                  setActiveStep(0);
                  setProgress(0);
                }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Restart Pipeline"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Connected Steps Track with Animated Flow Cable */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
            {PIPELINE_STEPS.map((step, idx) => {
              const isCurrent = idx === activeStep;
              const isPast = idx < activeStep;

              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setActiveStep(idx);
                    setProgress(0);
                  }}
                  className={`text-left p-3 rounded-2xl transition-all relative overflow-hidden border ${
                    isCurrent
                      ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : isPast
                      ? 'bg-white/60 border-slate-200 opacity-75'
                      : 'bg-white/40 border-slate-100 opacity-50'
                  }`}
                >
                  {/* Step Progress Bar at top of active button */}
                  {isCurrent && (
                    <div 
                      className="absolute top-0 left-0 bottom-0 bg-blue-500/10 transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  )}

                  <div className="flex items-center justify-between mb-1 relative z-10">
                    <span className="text-[10px] font-chakra font-black text-slate-400">
                      STEP {step.number}
                    </span>
                    {isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    ) : isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    ) : null}
                  </div>

                  <div className="text-xs font-chakra font-bold text-slate-900 truncate relative z-10">
                    {step.name}
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 truncate relative z-10">
                    {step.badge}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Live Operational Showcase (Cinematic Feed) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-white shadow-2xl relative overflow-hidden border border-slate-800">
            
            {/* Background laser beam effect */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 shadow-[0_0_15px_#38bdf8] animate-pulse" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Left Action Description */}
              <div className="md:col-span-8 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-blue-500 text-slate-950 uppercase">
                    LIVE OPERATION
                  </span>
                  <span className="text-xs font-chakra font-bold text-sky-400">
                    {current.name} • {current.badge}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-mono text-slate-200 leading-relaxed">
                  {current.action}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-slate-400">
                  <span className="text-emerald-400 font-bold">✓ {current.metric}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">Automated Pipeline Handshake</span>
                </div>
              </div>

              {/* Right: Live Terminal Code Stream */}
              <div className="md:col-span-4 bg-slate-900/90 rounded-xl p-3 border border-slate-800 font-mono text-[11px] text-sky-300 overflow-x-auto shadow-inner">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800 text-[9px] text-slate-500 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="ml-1">Pipeline Feed</span>
                </div>
                <div className="pt-2 text-slate-300">
                  <span className="text-sky-400">$</span> {current.codeSnippet}
                </div>
                <div className="pt-1 text-[10px] text-emerald-400 animate-pulse">
                  ➜ streaming output to next node...
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
