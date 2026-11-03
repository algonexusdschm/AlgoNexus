import React, { useState } from 'react';
import { Menu, X, Ticket, LayoutDashboard, BrainCircuit, Sparkles, Box } from 'lucide-react';

export default function Navbar({ onOpenRegister, onOpenAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-cyan-500/20 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl p-2 shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-all flex items-center justify-center text-white">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-chakra font-black tracking-tight text-white uppercase">
                  TECH<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">ASTRA</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded-full">
                  2026
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">
                <span className="text-cyan-400 font-bold">Data Decoders</span> • Dept. of Data Science • CHM College
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6 text-xs font-mono font-semibold text-slate-300">
            <a href="#ai-3d-lab" className="hover:text-cyan-300 text-cyan-400 transition-colors flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>3D Holodeck</span>
            </a>
            <a href="#tracks" className="hover:text-cyan-300 transition-colors">AI Tracks</a>
            <a href="#faculty" className="hover:text-cyan-300 transition-colors">Mentors</a>
            <a href="#announcement" className="hover:text-cyan-300 transition-colors">Announcement</a>
            <a href="#gallery" className="hover:text-cyan-300 transition-colors">Memories</a>
            <a href="#passes" className="hover:text-cyan-300 transition-colors">Passes</a>
            <a href="#faq" className="hover:text-cyan-300 transition-colors">FAQ</a>
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-all font-semibold"
              title="Organizers & Gate Console"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Console</span>
            </button>

            <button
              onClick={() => onOpenRegister()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-chakra font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Register Now</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-cyan-500/20 px-4 pt-3 pb-6 space-y-3 font-mono font-semibold text-xs text-slate-200">
          <a
            href="#ai-3d-lab"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-cyan-400 font-bold"
          >
            ⚡ 3D Holodeck Interactive Lab
          </a>
          <a
            href="#tracks"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-cyan-300"
          >
            AI Tracks & Roadmap
          </a>
          <a
            href="#faculty"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-cyan-300"
          >
            Faculty Leadership & Mentors
          </a>
          <a
            href="#announcement"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-cyan-300"
          >
            Official Announcement
          </a>
          <a
            href="#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-cyan-300"
          >
            Photo Memories
          </a>
          <a
            href="#passes"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-cyan-300"
          >
            Delegate Passes
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-cyan-300"
          >
            FAQ
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-chakra font-bold text-center"
            >
              Register Now
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-center border border-slate-700"
            >
              Admin Console
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
