import React, { useState } from 'react';
import { Menu, X, Ticket, LayoutDashboard, BrainCircuit, Globe2 } from 'lucide-react';

export default function Navbar({ onOpenRegister, onOpenAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-slate-200/90 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <img
              src="/techastra-logo.jpg"
              alt="TechAstra Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover object-[center_28%] rounded-xl shadow-md border border-slate-200/90 group-hover:scale-105 transition-all bg-[#0f1218] shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-chakra font-black tracking-tight text-slate-900 uppercase">
                  TECH<span className="text-blue-600">ASTRA</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                  2026
                </span>
              </div>
              <p className="text-[10px] text-slate-500 tracking-wider uppercase font-mono">
                <span className="text-blue-600 font-bold">Data Decoders</span> • Dept. of Data Science • CHM College
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6 text-xs font-mono font-semibold text-slate-600">
            <a href="#tracks" className="hover:text-blue-600 text-blue-600 transition-colors flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>AI Tracks</span>
            </a>
            <a href="#announcement" className="hover:text-blue-600 transition-colors">Announcement</a>
            <a href="#gallery" className="hover:text-blue-600 transition-colors">Memories</a>
            <a href="#passes" className="hover:text-blue-600 transition-colors">Delegate Passes</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-mono text-xs flex items-center gap-1.5 transition-all font-semibold cursor-pointer"
              title="Organizers & Gate Console"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
              <span>Admin Console</span>
            </button>

            <button
              onClick={() => onOpenRegister()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-700 text-white font-chakra font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 hover:shadow-lg transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Register Now</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 font-mono font-semibold text-xs text-slate-700">
          <a
            href="#tracks"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-blue-600"
          >
            AI Tracks & Roadmap
          </a>
          <a
            href="#announcement"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-blue-600"
          >
            Official Announcement
          </a>
          <a
            href="#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-blue-600"
          >
            Photo Memories
          </a>
          <a
            href="#passes"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-blue-600"
          >
            Delegate Passes
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-blue-600"
          >
            FAQ
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white font-chakra font-bold text-center"
            >
              Register Now
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 font-mono text-center border border-slate-200"
            >
              Admin Console
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
