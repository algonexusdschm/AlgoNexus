import React, { useState } from 'react';
import { Cpu, ShieldAlert, Network, Sparkles, ArrowRight, Trophy, Code2, Layers, CheckCircle } from 'lucide-react';

const TRACKS = [
  {
    id: 'ai-agents',
    character: 'Doctor Victor von Doom',
    role: 'Supreme Sovereign of Science & Arcane Synthesis',
    alias: 'DOCTOR DOOM',
    title: 'Autonomous AI & Neural Swarms',
    image: '/images/characters/dr_doom.jpg',
    accentColor: 'emerald',
    glowColor: 'rgba(34, 197, 94, 0.45)',
    borderStyle: 'border-emerald-500/40 hover:border-emerald-400',
    tagBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    bounty: '₹75,000',
    summary: 'Harness machine intelligence to build autonomous agents capable of independent reasoning, multi-agent coordination, and real-time decision synthesis.',
    problemThemes: [
      'Multi-Agent Autonomous Workflows & Tool Use',
      'Local Edge LLMs & Neuromorphic Inference',
      'Predictive Incursion Modeling & Real-Time Analytics'
    ],
    techStack: ['PyTorch', 'LangChain', 'LlamaIndex', 'FastAPI', 'Vector DBs'],
    quote: '"None shall rival the intellect of Doom. Build systems that think, adapt, and conquer."'
  },
  {
    id: 'architecture',
    character: 'Reed Richards (Mister Fantastic)',
    role: 'The Multiversal System Architect',
    alias: 'MISTER FANTASTIC',
    title: 'High-Concurrency Distributed Engines',
    image: '/images/characters/reed_richards.jpg',
    accentColor: 'cyan',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    borderStyle: 'border-cyan-500/40 hover:border-cyan-400',
    tagBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    bounty: '₹60,000',
    summary: 'Design fault-tolerant backend architectures, ultra-low latency event brokers, and self-healing distributed meshes that endure the breaking point.',
    problemThemes: [
      'Zero-Latency Event Streaming & Consensus',
      'Microservice Resilience & Chaos Engineering',
      'High-Throughput Graph Computing at Scale'
    ],
    techStack: ['Go / Rust', 'Kafka', 'gRPC', 'Kubernetes', 'Redis'],
    quote: '"A bridge across realities requires absolute architectural precision. Stress-test every boundary."'
  },
  {
    id: 'cyber-defense',
    character: 'Latverian Sentinel (Doombot)',
    role: 'The Iron Wall & Cryptographic Guardian',
    alias: 'DOOMBOT SENTINEL',
    title: 'Zero-Day Cyber Defense & Cryptography',
    image: '/images/characters/doombot.jpg',
    accentColor: 'rose',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    borderStyle: 'border-rose-500/40 hover:border-rose-400',
    tagBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    bounty: '₹60,000',
    summary: 'Develop fortified security mechanisms, automated vulnerability mitigation pipelines, zero-knowledge proofs, and post-quantum defense shields.',
    problemThemes: [
      'Automated Vulnerability Detection & Patching',
      'Zero-Knowledge Proofs (ZK-SNARKs) & Privacy Guard',
      'Adversarial AI Defense & Malware Sandboxing'
    ],
    techStack: ['Rust / C++', 'eBPF', 'ZK-Rollups', 'WireGuard', 'SIEM'],
    quote: '"Perimeter breached? Impossible. The Latverian shield is impenetrable."'
  },
  {
    id: 'web3-reality',
    character: 'Multiversal Arcane Sorcerer',
    role: 'Keeper of Cross-Chain Dimensions & Reality Forks',
    alias: 'THE MULTIVERSE SORCERER',
    title: 'Web3 & Cross-Chain Incursions',
    image: '/images/characters/sorcerer.jpg',
    accentColor: 'amber',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    borderStyle: 'border-amber-500/40 hover:border-amber-400',
    tagBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    bounty: '₹55,000',
    summary: 'Build decentralized state bridges, immutable truth protocols, decentralized physical infrastructure (DePIN), and next-gen verifiable compute.',
    problemThemes: [
      'Trustless Cross-Chain Asset & State Bridging',
      'Decentralized AI Compute & Storage Networks',
      'Verifiable Real-World Oracle Data Ingestion'
    ],
    techStack: ['Solidity', 'Foundry', 'IPFS / Arweave', 'Viem', 'The Graph'],
    quote: '"The multiverse is fractured. Only cryptographic consensus can bind the realities together."'
  }
];

export default function HackathonTracks({ onOpenRegister }) {
  const [selectedTrack, setSelectedTrack] = useState(null);

  return (
    <section id="characters" className="relative py-20 sm:py-28 overflow-hidden bg-slate-950/70 backdrop-blur-sm border-t border-b border-emerald-500/20">
      
      {/* Background Ambience Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55rem] h-[55rem] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-chakra tracking-[0.2em] uppercase mb-4 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>CHAMPIONS OF DOOMSDAY • HACKATHON TRACKS</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            <span className="font-bebas tracking-wide block">CHOOSE YOUR ARENA</span>
            <span className="font-space text-lg sm:text-2xl font-light text-slate-300 normal-case tracking-normal block mt-2">
              Four specialized tracks curated by the iconic figures of Doomsday.
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light max-w-2xl mx-auto font-space">
            Align your team with a Doomsday champion, solve high-stakes breaking-point challenges, and compete for domain-specific bounties.
          </p>
        </div>

        {/* 4 Track Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRACKS.map((track) => {
            return (
              <div
                key={track.id}
                className={`group relative rounded-2xl bg-slate-900/60 border ${track.borderStyle} backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between shadow-xl`}
                style={{
                  boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.45)`
                }}
              >
                {/* Top Character Portrait */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <img
                    src={track.image}
                    alt={track.character}
                    className="w-full h-full object-cover object-top filter brightness-95 contrast-110 group-hover:scale-105 group-hover:brightness-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                  {/* Character Name Tag Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-block font-chakra text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md border ${track.tagBg} uppercase shadow-md`}>
                      {track.alias}
                    </span>
                  </div>

                  {/* Bounty Tag Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 font-chakra text-[11px] font-extrabold px-2.5 py-1 rounded-md bg-slate-950/80 text-amber-300 border border-amber-500/40 shadow-md">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span>{track.bounty}</span>
                    </span>
                  </div>

                  {/* Role Subtitle over portrait base */}
                  <div className="absolute bottom-2 left-3 right-3 text-left">
                    <p className="font-space text-[11px] text-slate-300 font-medium truncate drop-shadow-md">
                      {track.role}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Track Title */}
                    <h3 className="text-xl font-bold font-space text-white group-hover:text-emerald-300 transition-colors leading-snug">
                      {track.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs text-slate-300 font-light mt-2 line-clamp-3 leading-relaxed">
                      {track.summary}
                    </p>
                  </div>

                  {/* Tech Stack Pills */}
                  <div>
                    <div className="text-[10px] font-chakra font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Core Technologies
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {track.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/80 text-slate-300 border border-slate-700/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quote from the Character */}
                  <blockquote className="p-2.5 rounded-lg bg-slate-950/50 border border-white/5 text-[11px] italic text-slate-400 font-light border-l-2 border-l-emerald-500/60">
                    {track.quote}
                  </blockquote>

                  {/* Card Action Button */}
                  <button
                    onClick={() => {
                      if (onOpenRegister) onOpenRegister();
                    }}
                    className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-800/70 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-400 text-slate-200 hover:text-emerald-300 font-chakra text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    <span>ENLIST IN ARENA</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner with Track Flexibility */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-emerald-500/20 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold font-space text-white flex items-center justify-center md:justify-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Interdisciplinary & Hybrid Submissions Welcome</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 font-light">
              Teams are free to cross-pollinate tracks (e.g. Autonomous AI + Zero-Knowledge Privacy). Official problem statements are unlocked upon hackathon commencement.
            </p>
          </div>
          <button
            onClick={() => {
              if (onOpenRegister) onOpenRegister();
            }}
            className="btn-doomsday-cyber shrink-0 px-8 py-3 flex items-center gap-2 cursor-pointer"
          >
            <span className="font-chakra text-xs font-bold tracking-widest text-emerald-300 uppercase">
              REGISTER SQUAD NOW →
            </span>
          </button>
        </div>

      </div>
    </section>
  );
}
