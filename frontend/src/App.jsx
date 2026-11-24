import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SurvivalProtocol from './components/SurvivalProtocol';
import Announcement from './components/Announcement';
import Gallery from './components/Gallery';
import PricingSection from './components/PricingSection';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AiUniverse3D from './components/AiUniverse3D';
import ScrollRadar from './components/ScrollRadar';
import { EventProvider, useEvent } from './context/EventContext';

class ModalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Modal error caught by boundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-xl border border-slate-200">
            <h4 className="text-base font-bold text-slate-900">Registration Modal Notice</h4>
            <p className="text-xs text-slate-600">A temporary loading error occurred. Please try opening the registration again.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                this.props.onReset?.();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy-loaded heavy modules for optimal initial load speed
const RegistrationModal = lazy(() => import('./components/RegistrationModal'));
const TicketModal = lazy(() => import('./components/TicketModal'));
const AdminPage = lazy(() => import('./components/AdminPage'));

function MainEventApp() {
  const { pricingTiers } = useEvent();
  const isAdminRoute = () => {
    const path = (window.location.pathname || '').toLowerCase();
    const hash = (window.location.hash || '').toLowerCase();
    return (
      path === '/admin' ||
      path === '/admin/' ||
      path.endsWith('/admin') ||
      path.endsWith('/admin/') ||
      hash === '#admin' ||
      hash.startsWith('#admin')
    );
  };

  const [currentRoute, setCurrentRoute] = useState(() => {
    return isAdminRoute() ? 'admin' : 'event';
  });

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(() => (pricingTiers && pricingTiers.length > 0 ? pricingTiers[0] : null));
  const [issuedTicket, setIssuedTicket] = useState(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);

  // Clear any residual session on mount so payment modal never auto-pops up on landing
  useEffect(() => {
    try {
      localStorage.removeItem('algonexus_checkout_session');
    } catch {}
  }, []);

  // Sync routing on popstate / hashchange
  useEffect(() => {
    const handleRouteChange = () => {
      if (isAdminRoute()) {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('event');
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const navigateToAdmin = () => {
    try {
      window.history.pushState({}, '', '/admin');
    } catch {}
    window.location.hash = 'admin';
    setCurrentRoute('admin');
    window.scrollTo(0, 0);
  };

  const navigateToEvent = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {}
    window.location.hash = '';
    setCurrentRoute('event');
    window.scrollTo(0, 0);
  };

  const handleOpenRegister = (tier = null) => {
    if (tier) setSelectedTier(tier);
    else setSelectedTier(pricingTiers[0]);
    setIsRegisterOpen(true);
  };

  const handlePaymentSuccess = (ticket) => {
    setIssuedTicket(ticket);
    setIsTicketOpen(true);
  };

  // If on Admin Website Route
  if (currentRoute === 'admin') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col relative selection:bg-sky-500/30 overflow-x-hidden">
        {/* Global 3D Interactive AI Globe Background */}
        <AiUniverse3D />
        <div className="relative z-10 flex-1 flex flex-col">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sky-600 font-chakra text-sm tracking-widest animate-pulse">CONNECTING TO GATE CONSOLE...</div>}>
            <AdminPage onBackToWebsite={navigateToEvent} />
          </Suspense>
        </div>
      </div>
    );
  }

  // Public Event Website
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col relative selection:bg-sky-500/30 overflow-x-hidden">
      {/* 1. Global 3D Interactive AI Globe with White Studio Background */}
      <AiUniverse3D />

      {/* 2. Interactive 3D Orbital Sector Scroll HUD */}
      <ScrollRadar />

      {/* 3. Top Navbar with Admin Portal Trigger */}
      <Navbar
        onOpenRegister={() => handleOpenRegister(pricingTiers[0])}
        onOpenAdmin={navigateToAdmin}
      />

      {/* 3. Main Content Sections */}
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <Hero onOpenRegister={() => handleOpenRegister(pricingTiers[0])} />

        {/* The Survival Protocol (Structure, Judging, AI Policy, Open For All Eligibility) */}
        <SurvivalProtocol onOpenRegister={() => handleOpenRegister(pricingTiers[0])} />

        {/* Official Announcement Section for This Year's Event */}
        <Announcement onOpenRegister={() => handleOpenRegister(pricingTiers[0])} />

        {/* Photo Gallery of Last Year's Event with Centered Modal Lightbox */}
        <Gallery />

        {/* Passes & Pricing Tiers with Razorpay & Bank checkout triggers */}
        <PricingSection onSelectTier={(tier) => handleOpenRegister(tier)} />

        {/* FAQs */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer
        onOpenRegister={() => handleOpenRegister(pricingTiers[0])}
        onOpenAdmin={navigateToAdmin}
      />

      {/* Interactive Modals (Lazy Loaded on Demand with Crash Protection) */}
      <ModalErrorBoundary onReset={() => { setIsRegisterOpen(false); setIsTicketOpen(false); }}>
        <Suspense fallback={null}>
          {isRegisterOpen && (
            <RegistrationModal
              isOpen={isRegisterOpen}
              initialTier={selectedTier}
              onClose={() => setIsRegisterOpen(false)}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}

          {isTicketOpen && issuedTicket && (
            <TicketModal
              ticket={issuedTicket}
              isOpen={isTicketOpen}
              onClose={() => setIsTicketOpen(false)}
            />
          )}
        </Suspense>
      </ModalErrorBoundary>
    </div>
  );
}

export default function App() {
  return (
    <EventProvider>
      <MainEventApp />
    </EventProvider>
  );
}
