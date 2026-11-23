import React from 'react';
import { 
  ArrowRight,
  Milestone
} from 'lucide-react';

const HACKATHON_STEPS = [
  {
    step: '01',
    title: 'INNOVATOR ENROLLMENT',
    desc: 'Form an innovator squad (2 to 4 members) and register for the flagship 48-Hour AI in EduTech hackathon challenge.',
    accent: 'blue'
  },
  {
    step: '02',
    title: 'PROBLEM STATEMENT UNLOCK',
    desc: 'The official EduTech real-world datasets, problem statements, and challenge guidelines go live at opening hour.',
    accent: 'purple'
  },
  {
    step: '03',
    title: '48-HOUR BUILD SPRINT',
    desc: 'Develop end-to-end intelligent systems, fine-tune models, connect knowledge stores, and build interactive UI prototypes.',
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
    title: 'GRAND CASH PRIZE AWARDS',
    desc: 'Top winning teams crowned with cash prizes, verified national trophies, internship opportunities, and certificates.',
    accent: 'blue'
  }
];

export default function SurvivalProtocol({ onOpenRegister }) {
  return (
    <section id="roadmap" className="py-20 bg-transparent relative z-10 scroll-mt-20">
      {/* Anchor for backward compatibility */}
      <div id="tracks" className="relative -top-24 invisible" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hackathon Journey Timeline Steps */}
        <div>
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold">
              <Milestone className="w-4 h-4 text-blue-600" />
              <span>THE 48-HOUR HACKATHON ROADMAP</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-chakra font-black tracking-tight text-slate-900 uppercase">
              HACKATHON PROTOCOL & ROADMAP
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-mono">
              From team formation to functional deployment and jury demo in 48 structured hours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {HACKATHON_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md hover:border-blue-300 transition-all"
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

