import React from 'react';
import { Mail, Phone, MapPin, BrainCircuit, Sparkles, GraduationCap } from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { EVENT_DETAILS, FACULTY_COMMITTEE } from '../data/eventData';

export default function Footer({ onOpenRegister, onOpenAdmin }) {
  const { eventSettings } = useEvent();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/90 pt-16 pb-12 text-slate-400 text-xs relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Top Section: Dedicated Faculty Mentors & Co-ordinator Credits */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              <span className="font-chakra font-black text-white tracking-wider uppercase text-xs">
                DEPARTMENT FACULTY COORDINATION & MENTORSHIP
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-0.5 rounded-full">
              Smt. CHM College
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {FACULTY_COMMITTEE.map((fac, idx) => (
              <div key={idx} className="space-y-0.5 font-mono">
                <span className="text-[10px] font-bold text-cyan-400 block">{fac.role}</span>
                <div className="font-chakra font-black text-white text-sm">{fac.name}</div>
                <div className="text-[10px] text-slate-400">{fac.dept}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Column Footer Information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="text-xl font-chakra font-black tracking-tight text-white uppercase">
                TECH<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">ASTRA</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Organized by <strong className="text-white font-semibold">Club Data Decoder</strong> & the <strong className="text-white font-semibold">Department of Data Science</strong> at Smt. Chandibai Himathmal Mansukhani College. Under the leadership of Co-ordinator Dr. Shiji Johnson and Faculty Mentors.
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono">
              <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] text-cyan-300 font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                AI IN EDUTECH
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-[10px] text-purple-300 font-bold tracking-wider">
                FLAGSHIP 2026
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li><a href="#ai-3d-lab" className="hover:text-cyan-300 text-cyan-400 transition-colors font-semibold">⚡ 3D Holodeck Interactive Lab</a></li>
              <li><a href="#tracks" className="hover:text-cyan-300 transition-colors">AI Innovation Tracks</a></li>
              <li><a href="#announcement" className="hover:text-cyan-300 transition-colors">Official Announcement</a></li>
              <li><a href="#faculty" className="hover:text-cyan-300 transition-colors">Faculty & Mentors</a></li>
              <li><a href="#gallery" className="hover:text-cyan-300 transition-colors">Event Memories</a></li>
              <li><a href="#passes" className="hover:text-cyan-300 transition-colors">Delegate Passes</a></li>
              <li><a href="#faq" className="hover:text-cyan-300 transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* College & Department */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Institution & Host
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="inline-block px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 mb-1">
                <span className="font-bold text-cyan-300 text-[11px] uppercase">Club Data Decoder</span>
              </div>
              <p className="font-semibold text-slate-200">Department of Data Science</p>
              <p className="text-slate-400">{eventSettings.venue || "Smt. Chandibai Himathmal Mansukhani College"}</p>
              <p className="text-slate-400 flex items-start gap-2 pt-0.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Ulhasnagar, Maharashtra</span>
              </p>
            </div>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Helpline & Coordination
            </h4>
            <div className="space-y-2.5 text-xs font-mono">
              <p className="text-slate-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{EVENT_DETAILS.email}</span>
              </p>
              <p className="text-slate-300 flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{EVENT_DETAILS.phone}</span>
              </p>
              <div className="pt-3">
                <button
                  onClick={onOpenAdmin}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Organizer & Admin Portal</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© 2026 TechAstra • Department of Data Science • Smt. CHM College. All rights reserved.</p>
          <p>Guided by Co-ordinator Dr. Shiji Johnson & Faculty Mentors</p>
        </div>

      </div>
    </footer>
  );
}
