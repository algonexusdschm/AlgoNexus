import React from 'react';
import { 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Scale, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Code2, 
  Layers, 
  ArrowRight,
  Trophy,
  Flame,
  Radio
} from 'lucide-react';

const PROTOCOL_STEPS = [
  {
    step: '01',
    title: 'SQUAD REGISTRATION',
    desc: 'Assemble your team (1 to 4 members) or enlist solo. Secure your digital pass to enter the 48-hour arena.',
    accent: 'emerald',
    status: 'PHASE 01'
  },
  {
    step: '02',
    title: 'MISSION BRIEFING',
    desc: 'The official problem statement is revealed live at Zero Hour. Rules, constraints, and evaluation rubrics unlocked.',
    accent: 'amber',
    status: 'PHASE 02'
  },
  {
    step: '03',
    title: 'THE 48-HOUR SPRINT',
    desc: 'Two days of intense problem-solving, rapid prototyping, and architecture development with scheduled mentor review checkpoints.',
    accent: 'emerald',
    status: 'PHASE 03'
  },
  {
    step: '04',
    title: 'SYSTEM LOCKDOWN',
    desc: 'Code repository and project submission freeze. Final commit hashes recorded before the hard deadline.',
    accent: 'rose',
    status: 'PHASE 04'
  },
  {
    step: '05',
    title: 'DEMO & DEFENSE',
    desc: 'Live functional demonstration and code viva before the expert academic & industry jury panel.',
    accent: 'cyan',
    status: 'PHASE 05'
  },
  {
    step: '06',
    title: 'MISSION COMPLETE',
    desc: 'Top solutions awarded from the ₹1,00,000 cash prize pool, prestigious trophies, and official certificates of excellence.',
    accent: 'purple',
    status: 'PHASE 06'
  }
];

const JUDGING_CRITERIA = [
  {
    criteria: 'Technical Implementation',
    weight: '25%',
    desc: 'Code quality, software engineering rigor, architecture robustness, and chosen tech stack.'
  },
  {
    criteria: 'Functionality & Working Prototype',
    weight: '20%',
    desc: 'Live demonstration stability, core feature completion, and error handling.'
  },
  {
    criteria: 'Problem Understanding',
    weight: '15%',
    desc: 'Depth of domain analysis, addressing the root challenges of the problem statement.'
  },
  {
    criteria: 'Solution Architecture & Design',
    weight: '15%',
    desc: 'Scalability, clean modularity, component decoupling, and user experience flow.'
  },
  {
    criteria: 'Innovation & Originality',
    weight: '10%',
    desc: 'Novel angles, non-trivial engineering insights, and creative approaches.'
  },
  {
    criteria: 'Real-World Impact & Feasibility',
    weight: '10%',
    desc: 'Practical utility, deployment viability, and potential beyond the conclave.'
  },
  {
    criteria: 'Presentation & Code Viva',
    weight: '5%',
    desc: 'Team communication, clarity of explanation, and defending codebase line-by-line.'
  }
];

export default function SurvivalProtocol({ onOpenRegister }) {
  return (
    <section id="protocol" className="relative py-20 sm:py-28 overflow-hidden bg-slate-950/70 backdrop-blur-sm border-t border-b border-emerald-500/20">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-chakra tracking-[0.2em] uppercase mb-4 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>OPERATIONAL BLUEPRINT • ALGO NEXUS 2026</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            <span className="font-bebas tracking-wide block">THE SURVIVAL PROTOCOL</span>
            <span className="font-space text-lg sm:text-2xl font-light text-slate-300 normal-case tracking-normal block mt-2">
              48 hours. One problem. Unlimited possibilities.
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light max-w-2xl mx-auto font-space">
            Two days of intense problem-solving, development, collaboration, and innovation under the unified banner of AlgoNexus 2026.
          </p>
        </div>

        {/* 1. 6-Step Hackathon Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {PROTOCOL_STEPS.map((item) => (
            <div
              key={item.step}
              className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 group shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl sm:text-4xl font-black font-bebas text-slate-500 group-hover:text-emerald-400 transition-colors">
                  {item.step}
                </span>
                <span className="font-chakra text-[10px] font-bold px-2.5 py-1 rounded bg-slate-800/80 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                  {item.status}
                </span>
              </div>
              <h3 className="text-lg font-bold font-space text-white group-hover:text-emerald-300 transition-colors mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 2. Side-by-Side: Judgement Protocol & Policies */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Judgement Protocol Table (7 Columns of Criteria) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-emerald-500/30 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-space text-white">JUDGEMENT PROTOCOL</h3>
                <p className="text-xs text-slate-400 font-light font-chakra uppercase tracking-wider">Transparent & Objective Evaluation</p>
              </div>
            </div>

            <div className="divide-y divide-slate-800 text-xs sm:text-sm">
              {JUDGING_CRITERIA.map((row) => (
                <div key={row.criteria} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white font-space flex items-center gap-2">
                      <span>{row.criteria}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-light leading-snug">{row.desc}</p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-chakra font-bold text-xs">
                    {row.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: AI Policy & Open Eligibility Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Eligibility Card: OPEN FOR ALL */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-space text-white uppercase">OPEN FOR ALL ELIGIBILITY</h4>
                  <span className="text-[10px] font-chakra text-cyan-400 uppercase tracking-wider">All Streams • All Years</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 font-light leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>All Branches Welcome:</strong> IT, CS, Data Science, AI/ML, Electronics, Mechanical, BCA, MCA, and Science streams.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>All Academic Years:</strong> Open to First Year (FY), Second Year (SY), Third Year (TY), and Final Year students.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Squad Composition:</strong> Teams of 1 to 4 members. Inter-college and inter-department squads are fully permitted.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/20 text-[11px] text-cyan-200 mt-2">
                  ⚖️ <strong>Fair Play Guarantee:</strong> All squads compete under a common problem statement with equal mentorship access, resources, and identical judging criteria.
                </div>
              </div>
            </div>

            {/* AI Protocol Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-amber-500/30 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-space text-white uppercase">AI & TOOL PROTOCOL</h4>
                  <span className="text-[10px] font-chakra text-amber-400 uppercase tracking-wider">Transparent Innovation Guidelines</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 font-light leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>AI Assistants Allowed:</strong> Tools like ChatGPT, Claude, Gemini, and GitHub Copilot may be used as development and debugging accelerators.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Code Defense Mandatory:</strong> Participants must fully understand, explain, and defend all submitted code during the live jury viva.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/20 text-[11px] text-amber-200 mt-2">
                  💡 <strong>AI/ML is NOT Mandatory:</strong> Pure algorithmic, software engineering, web, systems, and mobile solutions will be evaluated with 100% equal merit.
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Prize Pool & Enlist CTA Banner */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90 border border-emerald-500/40 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-chakra font-bold tracking-widest uppercase">
              <Trophy className="w-3.5 h-3.5" />
              <span>₹1,00,000 TOTAL PRIZE POOL</span>
            </div>
            <h4 className="text-2xl sm:text-3xl font-black font-space text-white">
              Ready to conquer the breaking point?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl">
              Cash bounties, trophy honours, and official participation certification for all registered hackers.
            </p>
          </div>
          <button
            onClick={() => onOpenRegister && onOpenRegister()}
            className="btn-doomsday-cyber shrink-0 px-8 py-3.5 flex items-center gap-2.5 cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.4)]"
          >
            <span className="font-chakra text-xs sm:text-sm font-bold tracking-widest text-emerald-300 uppercase">
              REGISTER SQUAD NOW →
            </span>
          </button>
        </div>

      </div>
    </section>
  );
}
