import React, { useState } from 'react';
import { Box, Menu, X, Ticket, LayoutDashboard, Shield } from 'lucide-react';

export default function Navbar({ onOpenRegister, onOpenAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/40 backdrop-blur-md border-b border-emerald-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.6)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-slate-900/80 border-2 border-emerald-500/50 p-1.5 shadow-[0_0_15px_rgba(16,185,129,0.25)] group-hover:border-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center rounded-lg">
              <Box className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bebas tracking-widest text-white uppercase">
                  ALGO<span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">NEXUS</span>
                </span>
                <span className="text-[10px] font-space font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                  2026
                </span>
              </div>
              <p className="text-[10px] text-slate-300 tracking-wider uppercase font-space">
                <span className="text-emerald-400 font-semibold">Club Data Decoder</span> • Dept. of Data Science • CHM College
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-7 text-[11px] font-space font-semibold uppercase tracking-wider text-slate-300">
            <a href="#protocol" className="hover:text-emerald-400 text-emerald-300 transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Protocol</span>
            </a>
            <a href="#announcement" className="hover:text-emerald-400 transition-colors">Announcement</a>
            <a href="#gallery" className="hover:text-emerald-400 transition-colors">Memories</a>
            <a href="#passes" className="hover:text-emerald-400 transition-colors">Passes</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2 rounded-lg bg-slate-900/70 hover:bg-slate-800/90 border border-slate-700/70 hover:border-slate-500 text-slate-300 font-chakra text-xs flex items-center gap-1.5 transition-all shadow-sm"
              title="Organizers & Gate Console"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Console</span>
            </button>

            <button
              onClick={() => onOpenRegister()}
              className="px-5 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/60 hover:border-emerald-400 text-emerald-300 font-chakra font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.45)] transition-all"
            >
              <Ticket className="w-4 h-4" />
              <span>Register Now</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-mc-deepslate border-2 border-mc-border text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b0e14] border-b-2 border-mc-border px-4 pt-3 pb-6 space-y-3 font-semibold text-xs uppercase tracking-wider">
          <a
            href="#protocol"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-emerald-400 hover:text-emerald-300"
          >
            ☢️ Survival Protocol
          </a>
          <a
            href="#announcement"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-slate-300 hover:text-mc-diamond"
          >
            Announcement (2026)
          </a>
          <a
            href="#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-slate-300 hover:text-mc-diamond"
          >
            Last Event Memories
          </a>
          <a
            href="#passes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-slate-300 hover:text-mc-diamond"
          >
            Event Passes
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-slate-300 hover:text-mc-diamond"
          >
            FAQ
          </a>

          <div className="pt-3 border-t border-mc-border flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full py-3 btn-voxel-diamond text-xs flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" /> Claim Event Pass
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 btn-voxel-dark text-xs flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-mc-diamond" /> Organizer Admin Console
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
