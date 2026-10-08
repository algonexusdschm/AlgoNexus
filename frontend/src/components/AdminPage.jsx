import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, Unlock, QrCode, Building2, Upload, Check, RefreshCw, 
  Download, Search, Eye, AlertCircle, Save, ExternalLink, ArrowLeft, 
  Users, IndianRupee, Calendar, MapPin, Sparkles, Trophy, Trash2, Copy,
  Crown, UserPlus, UserCheck, Key, EyeOff, UserX, CheckCircle2, ShieldAlert, Edit2
} from 'lucide-react';
import { useEvent } from '../context/EventContext';

export default function AdminPage({ onBackToWebsite }) {
  const { 
    eventSettings, 
    paymentSettings, 
    pricingTiers, 
    registrations, 
    isAdminAuthenticated, 
    currentAdminUser,
    headPasscode,
    teamMembers,
    updateEventSettings, 
    updatePaymentSettings, 
    updatePricingTiers, 
    checkInAttendee, 
    verifyRegistrationPayment,
    loginAdmin, 
    logoutAdmin,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    updateHeadPasscode
  } = useEvent();

  // Role detection
  const isHead = currentAdminUser?.isEventHead ?? false;

  // Active Tab: 'payment-bank', 'event-info', 'registrations', 'team-members'
  const [activeTab, setActiveTab] = useState('payment-bank');

  // Passcode Login State
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showNewMasterPass, setShowNewMasterPass] = useState(false);
  const [showNewMemberPass, setShowNewMemberPass] = useState(false);

  // Payment & Bank Form State
  const [paymentForm, setPaymentForm] = useState({
    upiId: paymentSettings.upiId || '8010086323@fam',
    payeeName: paymentSettings.payeeName || 'Club Data Decoder, Department of Data Science, Smt. Chandibai Himathmal Mansukhani College',
    qrCodeImage: paymentSettings.qrCodeImage || '',
    bankDetails: {
      bankName: paymentSettings.bankDetails?.bankName || 'Smt. Chandibai Himathmal Mansukhani College Account',
      accountNumber: paymentSettings.bankDetails?.accountNumber || '41829019283',
      ifscCode: paymentSettings.bankDetails?.ifscCode || 'SBIN0001234',
      accountHolder: paymentSettings.bankDetails?.accountHolder || 'Club Data Decoder / Department of Data Science - TechAstra 2026',
      accountType: paymentSettings.bankDetails?.accountType || 'Current Account',
      branch: paymentSettings.bankDetails?.branch || 'CHM College Campus Branch'
    },
    instructions: paymentSettings.instructions || 'Scan with Google Pay, PhonePe, Paytm, or BHIM. Enter 12-digit UTR and attach screenshot.'
  });

  // Event & Announcement Form State
  const [eventForm, setEventForm] = useState({
    name: eventSettings.name || 'TechAstra 2026',
    tagline: eventSettings.tagline || 'Architecting the Future of Code & Intelligence',
    dates: eventSettings.dates || 'To Be Announced Soon',
    datesAnnounced: eventSettings.datesAnnounced ?? false,
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

  // Keep admin forms in sync whenever cloud Supabase settings finish loading
  useEffect(() => {
    if (paymentSettings) {
      setPaymentForm({
        upiId: paymentSettings.upiId || '8010086323@fam',
        payeeName: paymentSettings.payeeName || 'Club Data Decoder, Department of Data Science, Smt. Chandibai Himathmal Mansukhani College',
        qrCodeImage: paymentSettings.qrCodeImage || '',
        bankDetails: {
          bankName: paymentSettings.bankDetails?.bankName || 'Smt. Chandibai Himathmal Mansukhani College Account',
          accountNumber: paymentSettings.bankDetails?.accountNumber || '41829019283',
          ifscCode: paymentSettings.bankDetails?.ifscCode || 'SBIN0001234',
          accountHolder: paymentSettings.bankDetails?.accountHolder || 'Club Data Decoder / Department of Data Science - TechAstra 2026',
          accountType: paymentSettings.bankDetails?.accountType || 'Current Account',
          branch: paymentSettings.bankDetails?.branch || 'CHM College Campus Branch'
        },
        instructions: paymentSettings.instructions || 'Scan with Google Pay, PhonePe, Paytm, or BHIM. Enter 12-digit UTR and attach screenshot.'
      });
    }
  }, [paymentSettings]);

  useEffect(() => {
    if (eventSettings) {
      setEventForm(prev => ({
        ...prev,
        name: eventSettings.name || 'TechAstra 2026',
        tagline: eventSettings.tagline || 'Architecting the Future of Code & Intelligence',
        dates: eventSettings.dates || 'To Be Announced Soon',
        datesAnnounced: eventSettings.datesAnnounced ?? false,
        targetDate: eventSettings.targetDate || '2026-10-16T09:00:00+05:30',
        venue: eventSettings.venue || 'Auditorium & Tech Hub, Main Campus',
        prizePool: eventSettings.prizePool || '₹2,50,000+',
        edition: eventSettings.edition || '4th National Edition'
      }));
    }
  }, [eventSettings]);

  useEffect(() => {
    if (pricingTiers && pricingTiers.length > 0) {
      setPricesForm({
        solo: pricingTiers.find(t => t.id === 'solo-coder')?.price || 299,
        squad: pricingTiers.find(t => t.id === 'hackathon-squad')?.price || 799,
        vip: pricingTiers.find(t => t.id === 'all-access-vip')?.price || 1299
      });
    }
  }, [pricingTiers]);

  // UI status
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [search, setSearch] = useState('');
  const [manualTicketInput, setManualTicketInput] = useState('');
  const [scanMessage, setScanMessage] = useState(null);
  const [viewScreenshotModal, setViewScreenshotModal] = useState(null);

  // Member Management State
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    email: '',
    role: 'Registration & Verification Lead',
    passcode: '',
    permissions: ['registrations', 'checkin']
  });

  // Edit Committee Member Modal State
  const [editingMember, setEditingMember] = useState(null);
  const [editMemberForm, setEditMemberForm] = useState({
    name: '',
    email: '',
    role: 'Registration & Verification Lead',
    passcode: '',
    permissions: ['registrations', 'checkin']
  });
  const [showEditMemberPass, setShowEditMemberPass] = useState(false);

  // Change Master Passcode Modal State
  const [isHeadPasscodeModalOpen, setIsHeadPasscodeModalOpen] = useState(false);
  const [newMasterPasscode, setNewMasterPasscode] = useState('');
  const [masterPasscodeSuccess, setMasterPasscodeSuccess] = useState('');

  // Password Visibility, Loading & Copied states
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [revealedPasscodes, setRevealedPasscodes] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [memberSuccessMsg, setMemberSuccessMsg] = useState('');

  const togglePasscodeReveal = (id) => {
    setRevealedPasscodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyPasscode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleGenerateRandomPasscode = () => {
    const roles = ['VOL', 'REG', 'FIN', 'GATE', 'TECH'];
    const prefix = roles[Math.floor(Math.random() * roles.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    setNewMemberForm(prev => ({ ...prev, passcode: `${prefix}-${num}` }));
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    if (!newMemberForm.name.trim()) return;
    const finalPasscode = newMemberForm.passcode.trim() || `MEM-${Math.floor(1000 + Math.random() * 9000)}`;
    await addTeamMember({
      name: newMemberForm.name.trim(),
      email: newMemberForm.email.trim(),
      role: newMemberForm.role,
      passcode: finalPasscode,
      permissions: newMemberForm.permissions
    });
    setMemberSuccessMsg(`Added "${newMemberForm.name}" as ${newMemberForm.role}. Credentials registered and synced securely!`);
    setIsAddMemberModalOpen(false);
    setNewMemberForm({
      name: '',
      email: '',
      role: 'Registration & Verification Lead',
      passcode: '',
      permissions: ['registrations', 'checkin']
    });
    setTimeout(() => setMemberSuccessMsg(''), 5000);
  };

  const handleOpenEditMember = (member) => {
    setEditingMember(member);
    setEditMemberForm({
      name: member.name || '',
      email: member.email || '',
      role: member.role || 'Registration & Verification Lead',
      passcode: member.passcode || '',
      permissions: member.permissions || ['registrations', 'checkin']
    });
    setShowEditMemberPass(false);
  };

  const handleSaveEditMember = async (e) => {
    e.preventDefault();
    if (!editingMember || !editMemberForm.name.trim()) return;
    await updateTeamMember(editingMember.id, {
      name: editMemberForm.name.trim(),
      email: editMemberForm.email.trim(),
      role: editMemberForm.role,
      passcode: editMemberForm.passcode.trim(),
      permissions: editMemberForm.permissions
    });
    setMemberSuccessMsg(`Updated member "${editMemberForm.name}". New credentials synced across all links & devices!`);
    setEditingMember(null);
    setTimeout(() => setMemberSuccessMsg(''), 5000);
  };

  const handleRemoveMember = async (id, name) => {
    if (window.confirm(`Are you sure you want to revoke access and remove member "${name}"?`)) {
      await removeTeamMember(id);
      setMemberSuccessMsg(`Revoked access for "${name}".`);
      setTimeout(() => setMemberSuccessMsg(''), 4000);
    }
  };

  const handleSaveMasterPasscode = async (e) => {
    e.preventDefault();
    if (!newMasterPasscode.trim()) return;
    await updateHeadPasscode(newMasterPasscode.trim());
    setMasterPasscodeSuccess('Event Head Master Passcode updated and synced live across all links and devices!');
    setTimeout(() => {
      setMasterPasscodeSuccess('');
      setIsHeadPasscodeModalOpen(false);
      setNewMasterPasscode('');
    }, 2000);
  };

  // Handle Login with live cloud validation
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');
    try {
      const res = await loginAdmin(passcode);
      if (res && res.success) {
        setAuthError('');
        if (!res.user.isEventHead) {
          if (res.user.permissions?.includes('registrations')) {
            setActiveTab('registrations');
          } else if (res.user.permissions?.includes('payment-bank')) {
            setActiveTab('payment-bank');
          } else {
            setActiveTab('registrations');
          }
        }
      } else {
        setAuthError(res?.error || 'Invalid Admin Passcode.');
      }
    } catch (err) {
      setAuthError('Error verifying credentials with cloud database. Please try again.');
    } finally {
      setIsLoggingIn(false);
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
  const handleSaveEventInfo = async (e) => {
    e.preventDefault();

    // Also update pricing tiers
    const updatedTiers = pricingTiers.map(t => {
      if (t.id === 'solo-coder') return { ...t, price: Number(pricesForm.solo) || 299 };
      if (t.id === 'hackathon-squad') return { ...t, price: Number(pricesForm.squad) || 799 };
      if (t.id === 'all-access-vip') return { ...t, price: Number(pricesForm.vip) || 1299 };
      return t;
    });

    await updatePricingTiers(updatedTiers);
    await updateEventSettings(eventForm, updatedTiers);

    setSaveSuccessMsg('Event details, edition tag & pass prices updated and synced live across all devices!');
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

  // Verify Payment Action
  const handleVerifyAttendeePayment = async (ticketId) => {
    if (!ticketId) return;
    await verifyRegistrationPayment(ticketId);
    setScanMessage({ success: true, text: `Payment Approved & Confirmed for ${ticketId.toUpperCase()}!` });
    setTimeout(() => setScanMessage(null), 3500);
  };

  // CSV Export with Blob and formula sanitization
  const exportToCSV = () => {
    if (registrations.length === 0) {
      alert('No registrations available to export.');
      return;
    }
    const headers = ['Ticket ID', 'Full Name', 'Email', 'Phone', 'College', 'Branch', 'Year', 'Pass Type', 'Track', 'Payment Method', 'UTR Number', 'Payment Status', 'Amount Paid', 'Checked In'];
    
    const sanitize = (val) => {
      let str = String(val ?? '');
      if (/^[=\+\-@]/.test(str)) {
        str = "'" + str;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = registrations.map(r => [
      sanitize(r.ticketId),
      sanitize(r.attendee?.fullName || ''),
      sanitize(r.attendee?.email || ''),
      sanitize(r.attendee?.phone || ''),
      sanitize(r.attendee?.college || ''),
      sanitize(r.attendee?.branch || ''),
      sanitize(r.attendee?.year || ''),
      sanitize(r.passType || ''),
      sanitize(r.attendee?.track || ''),
      sanitize(r.paymentMethod || 'UPI'),
      sanitize(r.utrNumber || r.paymentId || ''),
      sanitize(r.paymentStatus || 'PENDING_VERIFICATION'),
      r.amountPaid || 0,
      r.checkedIn ? 'YES' : 'NO'
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `techastra_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            <h2 className="text-2xl font-black text-white">TechAstra Admin Console</h2>
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Enter Passcode</span>
                <span className="text-[10px] text-cyan-400 font-mono">Head or Member Key</span>
              </label>
              <div className="relative">
                <input
                  type={showLoginPass ? "text" : "password"}
                  placeholder="Enter authorized passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  required
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 placeholder-slate-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                  title={showLoginPass ? "Hide Passcode" : "Show Passcode"}
                >
                  {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Organizer Console</span>
                </>
              )}
            </button>
          </form>

          {/* Secure Access Notice (Replaces Plaintext Credential Leak) */}
          <div className="mt-5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-center gap-2 text-center">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Authorized access only. Enter your confidential committee passcode.</span>
          </div>

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
                TECH<span className="text-cyan-400">ASTRA</span> ADMIN
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                LIVE SYNCED
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Organizer Management & Payment Settings</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isHead ? (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>EVENT HEAD (MASTER ADMIN)</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-sm">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentAdminUser?.name} ({currentAdminUser?.role})</span>
            </div>
          )}

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

        {/* Member Action Notification */}
        {memberSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{memberSuccessMsg}</span>
          </div>
        )}

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-card p-3.5 sm:p-4 rounded-2xl">
            <div className="text-[11px] sm:text-xs text-slate-400">Total Registered Attendees</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-mono">{registrations.length}</div>
          </div>

          <div className="glass-card p-3.5 sm:p-4 rounded-2xl">
            <div className="text-[11px] sm:text-xs text-slate-400">Total Revenue Collected</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 font-mono">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="glass-card p-3.5 sm:p-4 rounded-2xl">
            <div className="text-[11px] sm:text-xs text-slate-400">Gate Checked-in / Attendance</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1 font-mono">
              {totalCheckedIn} / {registrations.length}
            </div>
          </div>

          <div className="glass-card p-3.5 sm:p-4 rounded-2xl">
            <div className="text-[11px] sm:text-xs text-slate-400">Organizing Committee Members</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1 font-mono">
              {teamMembers.length}
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Responsive scroll for Mobile / Tablet / PC) */}
        <div className="flex border-b border-white/10 gap-3 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('payment-bank')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'payment-bank'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">1. College GPay QR & Bank Account Details</span>
            <span className="sm:hidden">1. UPI & Bank</span>
          </button>

          <button
            onClick={() => setActiveTab('event-info')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'event-info'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">2. Event Dates, Announcement & Ticket Prices</span>
            <span className="sm:hidden">2. Dates & Prices</span>
          </button>

          <button
            onClick={() => setActiveTab('registrations')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'registrations'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">3. Registrations & Verification Desk ({registrations.length})</span>
            <span className="sm:hidden">3. Registrations ({registrations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('team-members')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'team-members'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">4. Team & Member Access ({teamMembers.length})</span>
            <span className="sm:hidden">4. Passcodes ({teamMembers.length})</span>
            {isHead && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40 font-mono">
                HEAD ONLY
              </span>
            )}
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
                      placeholder="e.g. 8010086323@fam"
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
                      placeholder="e.g. TechAstra 2026 Organizing Committee"
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
                        placeholder="e.g. TechAstra Student Council"
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
              
              {/* TRIGGER TOGGLE: DATES TO BE ANNOUNCED SOON VS LIVE COUNTDOWN */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#101736] to-slate-900 border-2 border-cyan-500/40 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${eventForm.datesAnnounced ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
                      <span className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                        {eventForm.datesAnnounced ? 'Countdown Status: Official Dates Announced (Live Countdown Active)' : 'Countdown Status: To Be Announced Soon'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      {eventForm.datesAnnounced 
                        ? 'Official dates are visible on the website and the live countdown clock is ticking.' 
                        : 'Website displays "Dates To Be Announced Soon" badge. The countdown clock stays on hold until you unlock dates.'}
                    </p>
                  </div>

                  {/* Trigger Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const nextStatus = !eventForm.datesAnnounced;
                      setEventForm(prev => ({
                        ...prev,
                        datesAnnounced: nextStatus,
                        dates: nextStatus ? (prev.dates === 'To Be Announced Soon' ? 'December 20 and 21' : prev.dates) : 'To Be Announced Soon'
                      }));
                    }}
                    className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all shadow-lg shrink-0 ${
                      eventForm.datesAnnounced
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30'
                    }`}
                  >
                    <span>{eventForm.datesAnnounced ? '⚡ Switch to "To Be Announced Soon"' : '🚀 Announce Dates & Start Live Countdown'}</span>
                  </button>
                </div>
              </div>

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
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1 flex items-center justify-between">
                    <span>Event Dates (Display)</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${eventForm.datesAnnounced ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {eventForm.datesAnnounced ? 'Announced' : 'TBA Soon'}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={eventForm.dates}
                    onChange={(e) => setEventForm({ ...eventForm, dates: e.target.value })}
                    disabled={!eventForm.datesAnnounced}
                    placeholder="e.g. December 20 and 21, 2026"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                      eventForm.datesAnnounced 
                        ? 'bg-slate-900 border-slate-700 text-white' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1 flex items-center justify-between">
                    <span>Countdown Target (ISO)</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${eventForm.datesAnnounced ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {eventForm.datesAnnounced ? 'Timer Active' : 'Timer Paused'}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={eventForm.targetDate}
                    onChange={(e) => setEventForm({ ...eventForm, targetDate: e.target.value })}
                    disabled={!eventForm.datesAnnounced}
                    placeholder="2026-12-20T09:00:00"
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs ${
                      eventForm.datesAnnounced 
                        ? 'bg-slate-900 border-slate-700 text-white' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
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
                placeholder="Enter or scan Ticket ID (e.g. TECH26-XXXX)"
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
                      <th className="p-3.5">Payment Status</th>
                      <th className="p-3.5">Gate Status</th>
                      <th className="p-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="p-8 text-center text-slate-500">
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
                            {reg.paymentStatus === 'PAID' ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1 w-fit">
                                <AlertCircle className="w-3 h-3" />
                                <span>Pending</span>
                              </span>
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
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {reg.paymentStatus !== 'PAID' && (
                                <button
                                  onClick={() => handleVerifyAttendeePayment(reg.ticketId)}
                                  className="px-2.5 py-1 rounded bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/60 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 transition-all"
                                  title="Approve and verify participant payment"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Approve</span>
                                </button>
                              )}
                              {!reg.checkedIn && (
                                <button
                                  onClick={() => handleGateCheckIn(reg.ticketId)}
                                  className="px-3 py-1 rounded bg-cyan-600/30 text-cyan-300 hover:bg-cyan-600/60 border border-cyan-500/40 text-[10px] font-semibold transition-all"
                                >
                                  Check In
                                </button>
                              )}
                            </div>
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

        {/* TAB 4: ORGANIZING TEAM & MEMBER ACCESS CONTROL */}
        {activeTab === 'team-members' && (
          <div className="space-y-6">
            
            {/* Header & Control Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 glass-card rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/5 via-slate-900/40 to-cyan-500/5">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>Organizing Committee & Member Access</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/40">
                        {teamMembers.length} Members
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Event Head controls administrative delegation, creates team passcodes, and manages member permissions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Event Head Actions */}
              {isHead ? (
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.35)] font-bold hover:brightness-110 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ Add Committee Member</span>
                  </button>

                  <button
                    onClick={() => setIsHeadPasscodeModalOpen(true)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    title="Change Event Head Master Key"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden md:inline">Master Key</span>
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Logged in as <b>{currentAdminUser?.name}</b>. Only the Event Head can add or modify member passcodes.</span>
                </div>
              )}
            </div>

            {/* Event Head Master Admin Showcase Card */}
            <div className="p-6 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-[#1a160d] via-[#121624] to-[#0a0e1c] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-[2px] shadow-lg shadow-amber-500/20">
                    <div className="w-full h-full bg-[#121624] rounded-2xl flex items-center justify-center">
                      <Crown className="w-7 h-7 text-amber-400 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-lg font-black text-white">Event Head (Lead Organizer)</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/40">
                        MASTER ADMINISTRATOR
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Full supreme authority over Bank Details, QR Codes, Event Announcement, Ticket Pricing, Registrations & Team Members.
                    </p>
                  </div>
                </div>

                {/* Master Passcode Display */}
                <div className="flex items-center gap-3 bg-black/40 p-3 rounded-2xl border border-amber-500/30">
                  <div>
                    <div className="text-[10px] text-amber-400 uppercase font-mono font-bold">Master Passcode</div>
                    <div className="text-sm font-mono font-black text-white mt-0.5 tracking-wider">
                      {revealedPasscodes['head-master'] ? (headPasscode || 'head2026') : '••••••••'}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                    <button
                      onClick={() => togglePasscodeReveal('head-master')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title={revealedPasscodes['head-master'] ? 'Hide' : 'Reveal'}
                    >
                      {revealedPasscodes['head-master'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleCopyPasscode('head-master', headPasscode || 'head2026')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
                      title="Copy Master Key"
                    >
                      {copiedId === 'head-master' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Committee Members Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Committee Members & Designated Leads ({teamMembers.filter(m => !m.isEventHead).length})</span>
                </h4>
                <span className="text-xs text-slate-500">Each member logs in with their unique passcode</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.filter(m => !m.isEventHead).map((member) => (
                  <div
                    key={member.id}
                    className="glass-card p-5 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 relative group"
                  >
                    <div>
                      {/* Top Info */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold text-sm font-mono">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <h5 className="text-sm font-extrabold text-white">{member.name}</h5>
                            <span className="text-[11px] text-cyan-300 font-medium block">{member.role}</span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          {member.status || 'Active'}
                        </span>
                      </div>

                      {member.email && (
                        <p className="text-[11px] text-slate-400 mt-2 truncate font-mono">
                          {member.email}
                        </p>
                      )}

                      {/* Passcode Box */}
                      <div className="mt-4 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-[9px] uppercase font-mono text-slate-400">Login Passcode</div>
                          <div className="text-xs font-mono font-bold text-white mt-0.5 tracking-wider">
                            {revealedPasscodes[member.id] ? member.passcode : '••••••••'}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => togglePasscodeReveal(member.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                            title={revealedPasscodes[member.id] ? 'Hide' : 'Reveal'}
                          >
                            {revealedPasscodes[member.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleCopyPasscode(member.id, member.passcode)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                            title="Copy Passcode"
                          >
                            {copiedId === member.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Permissions Pills */}
                      <div className="mt-3">
                        <div className="text-[9px] uppercase font-mono text-slate-500 mb-1.5">Permissions Granted</div>
                        <div className="flex flex-wrap gap-1">
                          {member.permissions?.map((perm) => (
                            <span
                              key={perm}
                              className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-[10px] text-slate-300 font-medium"
                            >
                              {perm === 'registrations' && '📋 Registrations & UTR'}
                              {perm === 'checkin' && '🎟️ Gate Check-In'}
                              {perm === 'payment-bank' && '🏛️ Bank & QR'}
                              {perm === 'event-info' && '✨ Dates & Prices'}
                              {perm === 'all' && '👑 Full Access'}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer / Remove Action */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Added: {member.addedAt || '2026'}</span>
                      {isHead && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditMember(member)}
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-all text-xs font-semibold px-2 py-1 rounded-lg hover:bg-cyan-500/10"
                            title="Edit Member or Passcode"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleRemoveMember(member.id, member.name)}
                            className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-all text-xs font-semibold px-2 py-1 rounded-lg hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Revoke</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* MODAL 1: ADD COMMITTEE MEMBER */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative max-w-lg w-full glass-card p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/40 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Add Committee Member</h4>
                  <p className="text-[11px] text-slate-400">Create access key for an organizing team member</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddMemberModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Member Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sneha Deshmukh"
                  required
                  value={newMemberForm.name}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    College Email / ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. algonexusdschm@gmail.com"
                    value={newMemberForm.email}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Committee Role *
                  </label>
                  <select
                    value={newMemberForm.role}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Registration & Verification Lead">Registration & Verification Lead</option>
                    <option value="Finance & Accounts Coordinator">Finance & Accounts Coordinator</option>
                    <option value="Discipline & Gate Security Lead">Discipline & Gate Security Lead</option>
                    <option value="Hackathon Arena Coordinator">Hackathon Arena Coordinator</option>
                    <option value="Technical & Web Lead">Technical & Web Lead</option>
                    <option value="Sponsorship & PR Lead">Sponsorship & PR Lead</option>
                    <option value="Student Volunteer">Student Volunteer</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Member Login Passcode
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPasscode}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>🎲 Auto-Generate</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNewMemberPass ? "text" : "password"}
                    placeholder="Enter passcode or click Auto-Generate"
                    value={newMemberForm.passcode}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, passcode: e.target.value })}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-400 placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewMemberPass(!showNewMemberPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                    title={showNewMemberPass ? "Hide Passcode" : "Show Passcode"}
                  >
                    {showNewMemberPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Module Permissions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMemberForm.permissions.includes('registrations')}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...newMemberForm.permissions, 'registrations']
                          : newMemberForm.permissions.filter(p => p !== 'registrations');
                        setNewMemberForm({ ...newMemberForm, permissions: next });
                      }}
                      className="rounded text-emerald-500"
                    />
                    <span>📋 Registrations & UTR Desk</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMemberForm.permissions.includes('checkin')}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...newMemberForm.permissions, 'checkin']
                          : newMemberForm.permissions.filter(p => p !== 'checkin');
                        setNewMemberForm({ ...newMemberForm, permissions: next });
                      }}
                      className="rounded text-emerald-500"
                    />
                    <span>🎟️ Gate Check-In & Scanner</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMemberForm.permissions.includes('payment-bank')}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...newMemberForm.permissions, 'payment-bank']
                          : newMemberForm.permissions.filter(p => p !== 'payment-bank');
                        setNewMemberForm({ ...newMemberForm, permissions: next });
                      }}
                      className="rounded text-emerald-500"
                    />
                    <span>🏛️ College Bank & QR Code</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMemberForm.permissions.includes('event-info')}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...newMemberForm.permissions, 'event-info']
                          : newMemberForm.permissions.filter(p => p !== 'event-info');
                        setNewMemberForm({ ...newMemberForm, permissions: next });
                      }}
                      className="rounded text-emerald-500"
                    />
                    <span>✨ Event Dates & Prices</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.35)] flex items-center gap-1.5 hover:brightness-110 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Member & Grant Access</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CHANGE EVENT HEAD MASTER PASSCODE */}
      {isHeadPasscodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative max-w-md w-full glass-card p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Change Master Passcode</h4>
                  <p className="text-[11px] text-slate-400">Update Event Head supreme access key</p>
                </div>
              </div>
              <button
                onClick={() => setIsHeadPasscodeModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {masterPasscodeSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{masterPasscodeSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveMasterPasscode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  New Master Passcode *
                </label>
                <div className="relative">
                  <input
                    type={showNewMasterPass ? "text" : "password"}
                    placeholder="Enter new master passcode"
                    required
                    value={newMasterPasscode}
                    onChange={(e) => setNewMasterPasscode(e.target.value)}
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewMasterPass(!showNewMasterPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                    title={showNewMasterPass ? "Hide Passcode" : "Show Passcode"}
                  >
                    {showNewMasterPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">🔒 Encrypted and synchronized across all devices (phone, laptop, tablet).</span>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsHeadPasscodeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black shadow-lg shadow-amber-950 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Master Key</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT COMMITTEE MEMBER */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative max-w-lg w-full glass-card p-6 sm:p-8 rounded-3xl border-2 border-cyan-500/40 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Edit Committee Member</h4>
                  <p className="text-[11px] text-slate-400">Update member role, passcode, and module permissions</p>
                </div>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editMemberForm.name}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    College Email / ID
                  </label>
                  <input
                    type="text"
                    value={editMemberForm.email}
                    onChange={(e) => setEditMemberForm({ ...editMemberForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Committee Role *
                  </label>
                  <select
                    value={editMemberForm.role}
                    onChange={(e) => setEditMemberForm({ ...editMemberForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Registration & Verification Lead">Registration & Verification Lead</option>
                    <option value="Finance & Accounts Coordinator">Finance & Accounts Coordinator</option>
                    <option value="Discipline & Gate Security Lead">Discipline & Gate Security Lead</option>
                    <option value="Hackathon Arena Coordinator">Hackathon Arena Coordinator</option>
                    <option value="Technical & Web Lead">Technical & Web Lead</option>
                    <option value="Sponsorship & PR Lead">Sponsorship & PR Lead</option>
                    <option value="Student Volunteer">Student Volunteer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Member Login Passcode *
                </label>
                <div className="relative">
                  <input
                    type={showEditMemberPass ? "text" : "password"}
                    required
                    value={editMemberForm.passcode}
                    onChange={(e) => setEditMemberForm({ ...editMemberForm, passcode: e.target.value })}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditMemberPass(!showEditMemberPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                  >
                    {showEditMemberPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Module Permissions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editMemberForm.permissions.includes('registrations')}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...editMemberForm.permissions, 'registrations']
                          : editMemberForm.permissions.filter(p => p !== 'registrations');
                        setEditMemberForm({ ...editMemberForm, permissions: next });
                      }}
                      className="rounded text-cyan-500"
                    />
                    <span>📋 Registrations & UTR Desk</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editMemberForm.permissions.includes('checkin')}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...editMemberForm.permissions, 'checkin']
                          : editMemberForm.permissions.filter(p => p !== 'checkin');
                        setEditMemberForm({ ...editMemberForm, permissions: next });
                      }}
                      className="rounded text-cyan-500"
                    />
                    <span>🎟️ Gate Check-In & Scanner</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editMemberForm.permissions.includes('payment-bank')}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...editMemberForm.permissions, 'payment-bank']
                          : editMemberForm.permissions.filter(p => p !== 'payment-bank');
                        setEditMemberForm({ ...editMemberForm, permissions: next });
                      }}
                      className="rounded text-cyan-500"
                    />
                    <span>🏛️ College Bank & QR Code</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editMemberForm.permissions.includes('event-info')}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...editMemberForm.permissions, 'event-info']
                          : editMemberForm.permissions.filter(p => p !== 'event-info');
                        setEditMemberForm({ ...editMemberForm, permissions: next });
                      }}
                      className="rounded text-cyan-500"
                    />
                    <span>✨ Event Dates & Prices</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Member Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
