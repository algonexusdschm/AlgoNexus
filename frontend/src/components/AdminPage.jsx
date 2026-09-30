import React, { useState } from 'react';
import { 
  Shield, Lock, Unlock, QrCode, Building2, Upload, Check, RefreshCw, 
  Download, Search, Eye, AlertCircle, Save, ExternalLink, ArrowLeft, 
  Users, IndianRupee, Calendar, MapPin, Sparkles, Trophy, Trash2, Copy
} from 'lucide-react';
import { useEvent } from '../context/EventContext';

export default function AdminPage({ onBackToWebsite }) {
  const { 
    eventSettings, 
    paymentSettings, 
    pricingTiers, 
    registrations, 
    isAdminAuthenticated, 
    updateEventSettings, 
    updatePaymentSettings, 
    updatePricingTiers, 
    checkInAttendee, 
    loginAdmin, 
    logoutAdmin 
  } = useEvent();

  // Active Tab
  const [activeTab, setActiveTab] = useState('payment-bank'); // 'payment-bank', 'event-info', 'registrations'

  // Passcode Login State
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Payment & Bank Form State
  const [paymentForm, setPaymentForm] = useState({
    upiId: paymentSettings.upiId || 'algonexus.fest@oksbi',
    payeeName: paymentSettings.payeeName || 'AlgoNexus 2026 Organizing Committee',
    qrCodeImage: paymentSettings.qrCodeImage || '',
    bankDetails: {
      bankName: paymentSettings.bankDetails?.bankName || 'State Bank of India',
      accountNumber: paymentSettings.bankDetails?.accountNumber || '41829019283',
      ifscCode: paymentSettings.bankDetails?.ifscCode || 'SBIN0001234',
      accountHolder: paymentSettings.bankDetails?.accountHolder || 'AlgoNexus 2026 Student Council',
      accountType: paymentSettings.bankDetails?.accountType || 'Current Account',
      branch: paymentSettings.bankDetails?.branch || 'Campus Main Branch'
    },
    instructions: paymentSettings.instructions || 'Scan with Google Pay, PhonePe, Paytm, or BHIM. Enter 12-digit UTR and attach screenshot.'
  });

  // Event & Announcement Form State
  const [eventForm, setEventForm] = useState({
    name: eventSettings.name || 'AlgoNexus 2026',
    tagline: eventSettings.tagline || 'Architecting the Future of Code & Intelligence',
    dates: eventSettings.dates || 'October 16 - 18, 2026',
    targetDate: eventSettings.targetDate || '2026-10-16T09:00:00+05:30',
    venue: eventSettings.venue || 'Auditorium & Tech Hub, Main Campus',
    prizePool: eventSettings.prizePool || '₹2,50,000+',
    edition: eventSettings.edition || '4th National Edition'
  });

  // Pass Prices Form State
  const [pricesForm, setPricesForm] = useState({
    solo: pricingTiers.find(t => t.id === 'solo-coder')?.price || 299,
    squad: pricingTiers.find(t => t.id === 'hackathon-squad')?.price || 799,
    vip: pricingTiers.find(t => t.id === 'all-access-vip')?.price || 1299
  });

  // UI status
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [search, setSearch] = useState('');
  const [manualTicketInput, setManualTicketInput] = useState('');
  const [scanMessage, setScanMessage] = useState(null);
  const [viewScreenshotModal, setViewScreenshotModal] = useState(null);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    const success = loginAdmin(passcode);
    if (success) {
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Passcode. Try: admin123');
    }
  };

  // Handle QR File Upload
  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('QR code file must be under 8MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentForm(prev => ({ ...prev, qrCodeImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save Payment & Bank Details
  const handleSavePaymentSettings = async (e) => {
    e.preventDefault();
    await updatePaymentSettings(paymentForm);
    setSaveSuccessMsg('Bank details and GPay QR code saved! The event website now displays these details live.');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Handle Save Event & Announcement Info
  const handleSaveEventInfo = (e) => {
    e.preventDefault();
    updateEventSettings(eventForm);

    // Also update pricing tiers
    const updatedTiers = pricingTiers.map(t => {
      if (t.id === 'solo-coder') return { ...t, price: Number(pricesForm.solo) };
      if (t.id === 'hackathon-squad') return { ...t, price: Number(pricesForm.squad) };
      if (t.id === 'all-access-vip') return { ...t, price: Number(pricesForm.vip) };
      return t;
    });
    updatePricingTiers(updatedTiers);

    setSaveSuccessMsg('Event details, dates & ticket prices updated! Changes are live on the website.');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Gate Scanner Action
  const handleGateCheckIn = (ticketId) => {
    if (!ticketId) return;
    checkInAttendee(ticketId.trim());
    setScanMessage({ success: true, text: `Ticket ${ticketId.toUpperCase()} Checked In Successfully!` });
    setManualTicketInput('');
    setTimeout(() => setScanMessage(null), 3000);
  };

  // CSV Export
  const exportToCSV = () => {
    if (registrations.length === 0) {
      alert('No registrations available to export.');
      return;
    }
    const headers = ['Ticket ID', 'Full Name', 'Email', 'Phone', 'College', 'Branch', 'Year', 'Pass Type', 'Track', 'Payment Method', 'UTR Number', 'Amount Paid', 'Checked In'];
    const rows = registrations.map(r => [
      r.ticketId,
      `"${r.attendee?.fullName || ''}"`,
      `"${r.attendee?.email || ''}"`,
      `"${r.attendee?.phone || ''}"`,
      `"${r.attendee?.college || ''}"`,
      `"${r.attendee?.branch || ''}"`,
      `"${r.attendee?.year || ''}"`,
      `"${r.passType || ''}"`,
      `"${r.attendee?.track || ''}"`,
      r.paymentMethod || 'UPI',
      `"${r.utrNumber || r.paymentId || ''}"`,
      r.amountPaid || 0,
      r.checkedIn ? 'YES' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `algonexus_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const totalRevenue = registrations.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const totalCheckedIn = registrations.filter(r => r.checkedIn).length;

  const filteredRegistrations = registrations.filter(r => {
    const q = search.toLowerCase();
    return (
      r.ticketId?.toLowerCase().includes(q) ||
      r.attendee?.fullName?.toLowerCase().includes(q) ||
      r.attendee?.email?.toLowerCase().includes(q) ||
      r.attendee?.college?.toLowerCase().includes(q) ||
      (r.utrNumber && r.utrNumber.toLowerCase().includes(q))
    );
  });

  // 1. Passcode Screen if Not Authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070913] text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-cyan-500/30 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] mb-4">
              <div className="w-full h-full bg-[#0a0f24] rounded-2xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-white">AlgoNexus Admin Console</h2>
            <p className="text-xs text-slate-400 mt-1">
              Event Organizers & Bank Details Configuration Portal
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Enter Organizer Passcode
              </label>
              <input
                type="password"
                placeholder="Enter passcode (default: admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 placeholder-slate-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Default Passcode: <code className="text-cyan-400">admin123</code></span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all"
            >
              Unlock Organizer Console
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <button
              onClick={onBackToWebsite}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Event Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Full Admin Dashboard
  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col">
      
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-[#090d1f]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white tracking-wide">
                ALGO<span className="text-cyan-400">NEXUS</span> ADMIN
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                LIVE SYNCED
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Organizer Management & Payment Settings</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToWebsite}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={logoutAdmin}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            title="Lock Console"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Save Notification */}
        {saveSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950">
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-2xl">
            <div className="text-xs text-slate-400">Total Registered Attendees</div>
            <div className="text-3xl font-extrabold text-white mt-1 font-mono">{registrations.length}</div>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="text-xs text-slate-400">Total Revenue Collected</div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="text-xs text-slate-400">Gate Checked-in / Attendance</div>
            <div className="text-3xl font-extrabold text-cyan-400 mt-1 font-mono">
              {totalCheckedIn} / {registrations.length}
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="text-xs text-slate-400">Current Payment Mode</div>
            <div className="text-sm font-bold text-indigo-300 mt-2 truncate">
              {paymentForm.upiId || 'Direct UPI & Bank'}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 gap-6 text-sm font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('payment-bank')}
            className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'payment-bank'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>1. College GPay QR & Bank Account Details</span>
          </button>

          <button
            onClick={() => setActiveTab('event-info')}
            className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'event-info'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>2. Event Dates, Announcement & Ticket Prices</span>
          </button>

          <button
            onClick={() => setActiveTab('registrations')}
            className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'registrations'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Registrations & Verification Desk ({registrations.length})</span>
          </button>
        </div>

        {/* TAB 1: BANK & QR CODE CONFIGURATION */}
        {activeTab === 'payment-bank' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form */}
            <div className="lg:col-span-8 glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-cyan-400" />
                  <span>College Payment Gateway & Bank Account Details</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upload your festival GPay / PhonePe QR code and bank account info. All changes automatically update the checkout modal on the main website!
                </p>
              </div>

              <form onSubmit={handleSavePaymentSettings} className="space-y-6">
                
                {/* 1. QR Code Upload */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    College Festival Google Pay / PhonePe QR Code Image *
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-slate-900 border-2 border-dashed border-cyan-500/60 min-h-[190px]">
                      {paymentForm.qrCodeImage ? (
                        <>
                          <img
                            src={paymentForm.qrCodeImage}
                            alt="Uploaded College GPay QR Code"
                            className="max-h-40 object-contain rounded-lg shadow-md"
                          />
                          <span className="text-[10px] text-emerald-700 font-bold mt-2">Active College QR Code ✓</span>
                        </>
                      ) : (
                        <div className="text-center p-3">
                          <QrCode className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                          <p className="text-xs text-slate-600 font-medium">No custom QR image uploaded</p>
                          <p className="text-[10px] text-slate-400">Using standard dynamic UPI QR</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      <label className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-cyan-400 cursor-pointer text-center transition-all group">
                        <Upload className="w-6 h-6 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white">Upload New GPay QR Code</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Supports PNG, JPG, JPEG</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleQrUpload}
                          className="hidden"
                        />
                      </label>

                      {paymentForm.qrCodeImage && (
                        <button
                          type="button"
                          onClick={() => setPaymentForm(prev => ({ ...prev, qrCodeImage: '' }))}
                          className="w-full py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Custom QR Image</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. UPI ID and Payee Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Official Festival UPI ID *
                    </label>
                    <input
                      type="text"
                      value={paymentForm.upiId}
                      onChange={(e) => setPaymentForm({ ...paymentForm, upiId: e.target.value })}
                      placeholder="e.g. algonexus.fest@oksbi"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Students will copy this for manual UPI transfer</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Account / Committee Name *
                    </label>
                    <input
                      type="text"
                      value={paymentForm.payeeName}
                      onChange={(e) => setPaymentForm({ ...paymentForm, payeeName: e.target.value })}
                      placeholder="e.g. AlgoNexus 2026 Organizing Committee"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Appears on receipt as the receiving party</span>
                  </div>
                </div>

                {/* 3. Direct Bank Details (For Net Banking, IMPS, NEFT) */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider border-b border-indigo-500/20 pb-2">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    <span>College Bank Account Details (Shown in Net Banking Tab)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Bank Name *</label>
                      <input
                        type="text"
                        value={paymentForm.bankDetails.bankName}
                        onChange={(e) => setPaymentForm({
                          ...paymentForm,
                          bankDetails: { ...paymentForm.bankDetails, bankName: e.target.value }
                        })}
                        placeholder="e.g. State Bank of India"
                        required
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Bank Account Number *</label>
                      <input
                        type="text"
                        value={paymentForm.bankDetails.accountNumber}
                        onChange={(e) => setPaymentForm({
                          ...paymentForm,
                          bankDetails: { ...paymentForm.bankDetails, accountNumber: e.target.value }
                        })}
                        placeholder="e.g. 41829019283"
                        required
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">IFSC Code *</label>
                      <input
                        type="text"
                        value={paymentForm.bankDetails.ifscCode}
                        onChange={(e) => setPaymentForm({
                          ...paymentForm,
                          bankDetails: { ...paymentForm.bankDetails, ifscCode: e.target.value }
                        })}
                        placeholder="e.g. SBIN0001234"
                        required
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs uppercase focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Account Holder Name *</label>
                      <input
                        type="text"
                        value={paymentForm.bankDetails.accountHolder}
                        onChange={(e) => setPaymentForm({
                          ...paymentForm,
                          bankDetails: { ...paymentForm.bankDetails, accountHolder: e.target.value }
                        })}
                        placeholder="e.g. AlgoNexus Student Council"
                        required
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Account Type</label>
                      <select
                        value={paymentForm.bankDetails.accountType}
                        onChange={(e) => setPaymentForm({
                          ...paymentForm,
                          bankDetails: { ...paymentForm.bankDetails, accountType: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                      >
                        <option>Current Account</option>
                        <option>Savings Account</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Branch Name</label>
                      <input
                        type="text"
                        value={paymentForm.bankDetails.branch}
                        onChange={(e) => setPaymentForm({
                          ...paymentForm,
                          bankDetails: { ...paymentForm.bankDetails, branch: e.target.value }
                        })}
                        placeholder="e.g. Campus Branch"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Instructions */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Student Instructions during Checkout
                  </label>
                  <textarea
                    rows={2}
                    value={paymentForm.instructions}
                    onChange={(e) => setPaymentForm({ ...paymentForm, instructions: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Save Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Publish Payment Settings to Live Website</span>
                  </button>
                </div>

              </form>
            </div>

            {/* Live Preview Card */}
            <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-cyan-500/30 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Live Student View Preview</span>
              </h4>

              <div className="p-4 rounded-2xl bg-white text-slate-950 shadow-inner text-center">
                <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Scan & Pay</span>
                {paymentForm.qrCodeImage ? (
                  <img
                    src={paymentForm.qrCodeImage}
                    alt="Preview QR"
                    className="w-36 h-36 mx-auto object-contain rounded"
                  />
                ) : (
                  <div className="w-36 h-36 mx-auto bg-slate-100 flex items-center justify-center rounded">
                    <QrCode className="w-16 h-16 text-slate-400" />
                  </div>
                )}
                <div className="mt-2 text-xs font-bold text-indigo-700 font-mono">{paymentForm.upiId}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Net Banking Direct Details:</div>
                <div className="text-white font-semibold">{paymentForm.bankDetails.bankName}</div>
                <div className="text-slate-300 font-mono">A/C: {paymentForm.bankDetails.accountNumber}</div>
                <div className="text-cyan-300 font-mono">IFSC: {paymentForm.bankDetails.ifscCode}</div>
                <div className="text-slate-400 text-[11px]">Holder: {paymentForm.bankDetails.accountHolder}</div>
              </div>

              <div className="text-[11px] text-slate-400">
                ✅ When saved, these details immediately reflect in the registration modal for all attendees.
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: EVENT & ANNOUNCEMENT INFO */}
        {activeTab === 'event-info' && (
          <div className="max-w-3xl mx-auto glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Event Announcements, Dates & Pass Pricing</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Update the official dates, countdown timer, venue, and pass prices on the public event website.
              </p>
            </div>

            <form onSubmit={handleSaveEventInfo} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Event Name</label>
                  <input
                    type="text"
                    value={eventForm.name}
                    onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Edition Tag</label>
                  <input
                    type="text"
                    value={eventForm.edition}
                    onChange={(e) => setEventForm({ ...eventForm, edition: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Event Dates (Display)</label>
                  <input
                    type="text"
                    value={eventForm.dates}
                    onChange={(e) => setEventForm({ ...eventForm, dates: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Countdown Target (ISO)</label>
                  <input
                    type="text"
                    value={eventForm.targetDate}
                    onChange={(e) => setEventForm({ ...eventForm, targetDate: e.target.value })}
                    placeholder="2026-10-16T09:00:00+05:30"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Venue / Location</label>
                  <input
                    type="text"
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Prize Pool</label>
                  <input
                    type="text"
                    value={eventForm.prizePool}
                    onChange={(e) => setEventForm({ ...eventForm, prizePool: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Event Theme Tagline</label>
                <input
                  type="text"
                  value={eventForm.tagline}
                  onChange={(e) => setEventForm({ ...eventForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
              </div>

              {/* Pass Pricing */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 block">
                  Pass Registration Fees (₹ INR)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Solo Hacker Pass (₹)</label>
                    <input
                      type="number"
                      value={pricesForm.solo}
                      onChange={(e) => setPricesForm({ ...pricesForm, solo: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Hackathon Squad Pass (₹)</label>
                    <input
                      type="number"
                      value={pricesForm.squad}
                      onChange={(e) => setPricesForm({ ...pricesForm, squad: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">VIP Delegate Pass (₹)</label>
                    <input
                      type="number"
                      value={pricesForm.vip}
                      onChange={(e) => setPricesForm({ ...pricesForm, vip: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:opacity-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Event Announcements & Ticket Prices</span>
              </button>

            </form>
          </div>
        )}

        {/* TAB 3: REGISTRATIONS & VERIFICATION DESK */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            
            {/* Quick Gate Desk Check-in Scanner */}
            <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider shrink-0">
                <QrCode className="w-4 h-4" />
                <span>Gate Desk Check-in Scanner:</span>
              </div>
              <input
                type="text"
                placeholder="Enter or scan Ticket ID (e.g. ALGO26-XXXX)"
                value={manualTicketInput}
                onChange={(e) => setManualTicketInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
              <button
                onClick={() => handleGateCheckIn(manualTicketInput)}
                className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shrink-0 hover:bg-cyan-400 transition-colors"
              >
                Verify & Check In
              </button>
            </div>

            {scanMessage && (
              <div className={`p-3 rounded-xl text-xs flex items-center justify-between ${
                scanMessage.success ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                <span>{scanMessage.text}</span>
                <button onClick={() => setScanMessage(null)} className="underline ml-4">Dismiss</button>
              </div>
            )}

            {/* Search and Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search attendee, ticket ID, UTR, college..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500"
                />
              </div>

              <button
                onClick={exportToCSV}
                disabled={registrations.length === 0}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 border border-slate-700 disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV for Gate Desk / Certificates</span>
              </button>
            </div>

            {/* Registrations Table */}
            <div className="border border-white/5 rounded-2xl overflow-hidden bg-slate-950/60 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-mono">
                    <tr>
                      <th className="p-3.5">Ticket ID</th>
                      <th className="p-3.5">Attendee</th>
                      <th className="p-3.5">College & Track</th>
                      <th className="p-3.5">Pass & Method</th>
                      <th className="p-3.5">Payment / UTR</th>
                      <th className="p-3.5">Receipt</th>
                      <th className="p-3.5">Gate Status</th>
                      <th className="p-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="p-8 text-center text-slate-500">
                          No registrations found. New registrations from the website will appear here live!
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.ticketId} className="hover:bg-slate-900/40">
                          <td className="p-3.5 font-mono font-bold text-cyan-400">{reg.ticketId}</td>
                          <td className="p-3.5">
                            <div className="font-semibold text-white">{reg.attendee?.fullName || 'N/A'}</div>
                            <div className="text-[11px] text-slate-400">{reg.attendee?.phone || ''}</div>
                          </td>
                          <td className="p-3.5">
                            <div>{reg.attendee?.college || 'N/A'}</div>
                            <div className="text-[10px] text-cyan-300">{reg.attendee?.track || ''}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold">
                              {reg.passType}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">₹{reg.amountPaid} • {reg.paymentMethod || 'UPI'}</div>
                          </td>
                          <td className="p-3.5 font-mono text-[11px]">
                            {reg.utrNumber ? (
                              <div>
                                <span className="text-slate-400 block text-[9px] uppercase">UTR:</span>
                                <span className="text-emerald-400 font-bold">{reg.utrNumber}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500">{reg.paymentId || 'N/A'}</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            {reg.paymentScreenshot ? (
                              <button
                                onClick={() => setViewScreenshotModal(reg.paymentScreenshot)}
                                className="px-2.5 py-1 rounded bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 border border-indigo-500/40 text-[10px] font-semibold flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Receipt</span>
                              </button>
                            ) : (
                              <span className="text-slate-600 text-[10px]">No image</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            {reg.checkedIn ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                Checked In
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                                Awaiting
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            {!reg.checkedIn && (
                              <button
                                onClick={() => handleGateCheckIn(reg.ticketId)}
                                className="px-3 py-1 rounded bg-cyan-600/30 text-cyan-300 hover:bg-cyan-600/60 border border-cyan-500/40 text-[10px] font-semibold"
                              >
                                Check In
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Screenshot Modal */}
      {viewScreenshotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="relative max-w-lg w-full bg-slate-900 p-4 rounded-3xl border border-white/10 flex flex-col items-center">
            <button
              onClick={() => setViewScreenshotModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700"
            >
              ✕
            </button>
            <h4 className="text-xs font-bold uppercase text-slate-300 mb-3">Participant Payment Receipt Screenshot</h4>
            <img
              src={viewScreenshotModal}
              alt="Payment Receipt"
              className="max-h-[70vh] object-contain rounded-xl border border-slate-800"
            />
          </div>
        </div>
      )}

    </div>
  );
}
