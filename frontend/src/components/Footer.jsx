import React from 'react';
import { Box, Globe, Mail, Phone, MapPin, Heart, Code2, MessageSquare, Terminal } from 'lucide-react';
import { useEvent } from '../context/EventContext';

export default function Footer({ onOpenRegister, onOpenAdmin }) {
  const { eventSettings } = useEvent();

  return (
    <footer className="bg-[#080a0f]/90 border-t-4 border-mc-border pt-16 pb-12 text-slate-400 text-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-mc-deepslate border-2 border-mc-diamond flex items-center justify-center">
                <Box className="w-5 h-5 text-mc-diamond" />
              </div>
              <span className="text-lg font-mc font-black text-white">
                TECH<span className="text-mc-diamond">ASTRA</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Organized under <strong className="text-emerald-400 font-semibold">Club Data Decoder</strong> by the <strong className="text-slate-200">Department of Data Science</strong> at Smt. Chandibai Himathmal Mansukhani College. Built to forge the next generation of algorithmic pioneers and software architects.
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono">
              <span className="px-2 py-0.5 bg-mc-deepslate border border-mc-border text-[10px] text-mc-redstone">
                REDSTONE-V26
              </span>
              <span className="px-2 py-0.5 bg-mc-deepslate border border-mc-border text-[10px] text-mc-diamond">
                VOXEL ENGINE
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mc font-bold uppercase tracking-wider text-mc-diamond mb-4">
              [EXPEDITION MAP]
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#announcement" className="hover:text-mc-diamond transition-colors">Announcement 2026</a></li>
              <li><a href="#gallery" className="hover:text-mc-diamond transition-colors">Last Event Memories</a></li>
              <li><a href="#passes" className="hover:text-mc-diamond transition-colors">Passes & Pricing Tiers</a></li>
              <li><a href="#faq" className="hover:text-mc-diamond transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* College & Department */}
          <div>
            <h4 className="text-xs font-mc font-bold uppercase tracking-wider text-mc-diamond mb-4">
              [ORGANIZING GUILD]
            </h4>
            <div className="space-y-2 text-xs">
              <div className="inline-block px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 mb-1">
                <span className="font-bold text-emerald-400 text-[11px] font-space tracking-wider uppercase">Club Data Decoder</span>
              </div>
              <p className="font-semibold text-slate-200">Department of Data Science</p>
              <p className="text-slate-300 font-medium">{eventSettings.venue || "Smt. Chandibai Himathmal Mansukhani College"}</p>
              <p className="text-slate-400 flex items-start gap-2 pt-0.5 font-light">
                <MapPin className="w-4 h-4 text-mc-diamond shrink-0 mt-0.5" />
                <span>Ulhasnagar, Maharashtra</span>
              </p>
              <p className="text-slate-400 flex items-center gap-2 font-mono">
                <Mail className="w-4 h-4 text-mc-diamond shrink-0" />
                <a href="mailto:algonexusdschm@gmail.com" className="hover:text-mc-diamond transition-colors">algonexusdschm@gmail.com</a>
              </p>
              <p className="text-slate-400 flex items-center gap-2 font-mono">
                <Phone className="w-4 h-4 text-mc-diamond shrink-0" />
                <a href="tel:8010086323" className="hover:text-mc-diamond transition-colors">+91 80100 86323</a>
              </p>
            </div>
          </div>

          {/* Admin & Payment Note */}
          <div className="space-y-3">
            <h4 className="text-xs font-mc font-bold uppercase tracking-wider text-mc-diamond">
              [GUILD MASTERS & DESK]
            </h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Authorized gate desks and student coordinators can access the check-in console to scan entrant QR passes or update college bank/QR settings.
            </p>
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2 btn-voxel-dark text-xs flex items-center gap-1.5"
            >
              <span>[ACCESS ADMIN CONSOLE]</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-mc-border flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-mono">
          <div>
            © 2026 TechAstra. All rights reserved. 3D Voxel Engine powered by React, Three.js & Tailwind.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted for collegiate innovation & coding dominance</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
