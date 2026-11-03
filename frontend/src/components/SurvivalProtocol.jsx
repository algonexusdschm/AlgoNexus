import React from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Scale, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Code2, 
  Layers, 
  ArrowRight,
  Trophy,
  BrainCircuit,
  Database,
  Scan,
  Network
} from 'lucide-react';
import { EVENT_TRACKS } from '../data/eventData';

const HACKATHON_STEPS = [
  {
    step: '01',
    title: 'INNOVATOR ENROLLMENT',
    desc: 'Register as a solo coder or form an innovator squad (2 to 4 members). Pick your primary AI in EduTech challenge track.',
    accent: 'blue'
  },
  {
    step: '02',
    title: 'PROBLEM STATEMENT UNLOCK',
    desc: 'The official EduTech real-world datasets, RAG vector schemas, and problem statements go live at opening hour.',
    accent: 'purple'
  },
  {
    step: '03',
    title: '48-HOUR BUILD SPRINT',
    desc: 'Develop end-to-end intelligent systems, fine-tune models, connect RAG knowledge stores, and build interactive UI prototypes.',
    accent: 'sky'
  },
  {
    step: '04',
    title: 'JURY EVALUATION & DEMOS',
    desc: 'Present functional prototypes to an expert jury comprising AI industry leads, college professors, and EduTech founders.',
    accent: 'indigo'
  },
  {
    step: '05',
    title: '₹1,00,000 PRIZE AWARDS',
    desc: 'Top teams crowned across all 5 AI tracks with cash prizes, verified national trophies, internship opportunities, and certificates.',
    accent: 'blue'
  }
];

export default function SurvivalProtocol({ onOpenRegister }) {
  return (
    <section id="tracks" className="py-24 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold">
            <BrainCircuit className="w-4 h-4 text-blue-600" />
            <span>INTERCONNECTED AI ARCHITECTURES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-chakra font-black tracking-tight text-slate-900 uppercase">
            HACKATHON INNOVATION TRACKS
          </h2>
          <p className="text-slate-600 font-mono text-xs sm:text-sm">
            Tackle real-world challenges at the intersection of AI, Machine Learning, RAG, NLP, and Computer Vision for modern education.
          </p>
        </div>

        {/* 5 Connected Node Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVENT_TRACKS.map((track) => {
            return (
              <div
                key={track.id}
                className="group relative p-6 rounded-3xl bg-white/85 hover:bg-white backdrop-blur-xl border border-slate-200/90 hover:border-blue-400 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Badge & Node pill */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-slate-900 text-white tracking-wider">
                      {track.node}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      {track.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-lg font-chakra font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {track.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 font-mono leading-relaxed">
                      {track.desc}
                    </p>
                  </div>
                </div>

                {/* Prize Footer (No Green!) */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    {track.prize}
                  </span>
                  <button
                    onClick={() => onOpenRegister()}
                    className="text-xs font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-1 font-chakra transition-colors cursor-pointer"
                  >
                    <span>Register</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hackathon Journey Timeline Steps */}
        <div className="pt-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <h3 className="text-2xl sm:text-3xl font-chakra font-bold text-slate-900 uppercase">
              THE 48-HOUR INNOVATION ROADMAP
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-mono">
              From zero to functional AI deployment in 48 structured hours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {HACKATHON_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm space-y-3"
              >
                <div className="text-2xl font-chakra font-black text-blue-600">
                  {step.step}
                </div>
                <h4 className="text-xs font-chakra font-bold text-slate-900 uppercase tracking-wide">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-600 font-mono leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
