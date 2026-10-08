import React from 'react';
import { Shield, Globe, Mail, Phone, MapPin, Heart, Code2, MessageSquare, Terminal, Zap } from 'lucide-react';
import { useEvent } from '../context/EventContext';

export default function Footer({ onOpenRegister, onOpenAdmin }) {
  const { eventSettings } = useEvent();

  return (
    <footer className="bg-[#05080b]/95 border-t border-emerald-500/20 pt-16 pb-12 text-slate-400 text-xs backdrop-blur-md relative overflow-hidden">
      {/* Subtle emerald bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-emerald-500/5 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-slate-900 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xl font-bebas tracking-widest text-white uppercase">
                TECH<span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">ASTRA</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Organized under <strong className="text-emerald-400 font-semibold">Club Data Decoder</strong> by the <strong className="text-slate-200">Department of Data Science</strong> at Smt. Chandibai Himathmal Mansukhani College. Built to forge the next generation of algorithmic pioneers and software architects.
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono">
              <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-emerald-500/30 text-[10px] text-emerald-400 font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LATVERIA-PROTOCOL
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-cyan-500/30 text-[10px] text-cyan-300 font-bold tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                DOOMSDAY ENGINE
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-chakra font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-1.5">
              <span>[TACTICAL SECTOR MATRIX]</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-space">
              <li><a href="#protocol" className="hover:text-emerald-400 transition-colors">Survival Protocol</a></li>
              <li><a href="#announcement" className="hover:text-emerald-400 transition-colors">Announcement 2026</a></li>
              <li><a href="#gallery" className="hover:text-emerald-400 transition-colors">Last Event Memories</a></li>
              <li><a href="#passes" className="hover:text-emerald-400 transition-colors">Doomsday Passes & Tiers</a></li>
              <li><a href="#faq" className="hover:text-emerald-400 transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* College & Department */}
          <div>
            <h4 className="text-xs font-chakra font-bold uppercase tracking-wider text-cyan-300 mb-4 flex items-center gap-1.5">
              <span>[COMMAND HEADQUARTERS]</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="inline-block px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 mb-1">
                <span className="font-bold text-emerald-400 text-[11px] font-space tracking-wider uppercase">Club Data Decoder</span>
              </div>
              <p className="font-semibold text-slate-200">Department of Data Science</p>
              <p className="text-slate-300 font-medium">{eventSettings.venue || "Smt. Chandibai Himathmal Mansukhani College"}</p>
              <p className="text-slate-400 flex items-start gap-2 pt-0.5 font-light">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Ulhasnagar, Maharashtra</span>
              </p>
              <p className="text-slate-400 flex items-center gap-2 font-mono">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:algonexusdschm@gmail.com" className="hover:text-emerald-400 transition-colors">algonexusdschm@gmail.com</a>
              </p>
              <p className="text-slate-400 flex items-center gap-2 font-mono">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:8010086323" className="hover:text-emerald-400 transition-colors">+91 80100 86323</a>
              </p>
            </div>
          </div>

          {/* Admin & Security Desk */}
          <div className="space-y-3">
            <h4 className="text-xs font-chakra font-bold uppercase tracking-wider text-emerald-400">
              [GATE SECURITY & DESK]
            </h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Authorized gate desks and student coordinators can access the check-in console to scan entrant QR passes or update college bank/QR settings.
            </p>
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-400 text-xs font-chakra tracking-wider text-slate-200 hover:text-emerald-300 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>[ACCESS GATE CONSOLE]</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-mono">
          <div>
            © 2026 TechAstra. All rights reserved. Doomsday Engine powered by React, Three.js & Tailwind.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted for collegiate innovation & coding dominance</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
