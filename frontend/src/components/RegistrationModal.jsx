import React, { useState, useEffect } from 'react';
import { 
  X, Ticket, Users, AlertCircle, ArrowRight, Loader2, 
  QrCode, Copy, Check, Upload, Smartphone, Download, ExternalLink,
  User, Mail, Phone, School, Compass, ShieldCheck
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { EVENT_TRACKS } from '../data/eventData';
import { useEvent } from '../context/EventContext';
import { uploadImageToSupabase } from '../lib/supabaseClient';

const SESSION_KEY = 'algonexus_checkout_session';

export default function RegistrationModal({
  isOpen,
  onClose,
  initialTier,
  onPaymentSuccess
}) {
  const { paymentSettings, pricingTiers, addRegistration } = useEvent();
  const [selectedTier, setSelectedTier] = useState(initialTier || pricingTiers[0]);
  const [step, setStep] = useState(1); // 1: Attendee Info, 2: UPI Payment
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Payment Verification fields
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    github: '',
    track: EVENT_TRACKS[0]?.name || 'AI & Neural Frontiers',
    teamName: '',
    member2: '',
    member3: '',
    member4: ''
  });

  // Save active checkout session to localStorage
  const saveSession = (currentStep, form, tier) => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        step: currentStep,
        formData: form,
        tierId: tier?.id,
        timestamp: Date.now()
      }));
    } catch (e) {
      // Ignore private mode storage restrictions
    }
  };

  // Clear checkout session from localStorage
  const clearSession = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  };

  // Restore saved session on mount if user switched apps or refreshed
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.timestamp && Date.now() - parsed.timestamp < 12 * 60 * 60 * 1000) {
          if (parsed.formData) setFormData(parsed.formData);
          if (parsed.tierId && pricingTiers && pricingTiers.length > 0) {
            const match = pricingTiers.find(t => t.id === parsed.tierId);
            if (match) setSelectedTier(match);
          }
          if (parsed.step === 2) setStep(2);
        }
      }
    } catch (e) {}
  }, [pricingTiers]);

  // Always sync selected tier if parent passes a new initialTier
  useEffect(() => {
    if (initialTier) {
      setSelectedTier(initialTier);
    }
  }, [initialTier]);

  // Keep selected tier in sync if pass pricing changes live from cloud on another device
  useEffect(() => {
    if (selectedTier && pricingTiers && pricingTiers.length > 0) {
      const match = pricingTiers.find(t => t.id === selectedTier.id);
      if (match && match.price !== selectedTier.price) {
        setSelectedTier(prev => ({ ...prev, price: match.price }));
      }
    }
  }, [pricingTiers]);

  // Payment settings from context with safe fallback (synced with official FamPay QR)
  const settings = paymentSettings || {
    upiId: '8010086323@fam',
    payeeName: 'Club Data Decoder, Department of Data Science, Smt. Chandibai Himathmal Mansukhani College',
    qrCodeImage: 'https://vcswkusqdkyhyanytjlc.supabase.co/storage/v1/object/public/organizer-assets/qr-codes/1790917868549-hyt2j0.png'
  };

  // Copy indicator states
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Client-side image compressor: scales down high-res phone screenshots to max 1200px / ~100KB
  const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        };
        img.onerror = () => resolve(e.target.result);
      };
      reader.onerror = () => resolve('');
    });
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    saveSession(step, updated, selectedTier);
    if (errorMessage) setErrorMessage('');
  };

  // Card input change formatters
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 19);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardData(prev => ({ ...prev, number: formatted }));
    if (errorMessage) setErrorMessage('');
  };

  const handleCardExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.substring(0, 2)}/${raw.substring(2)}`;
    }
    setCardData(prev => ({ ...prev, expiry: raw }));
    if (errorMessage) setErrorMessage('');
  };

  const handleCardCvvChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCardData(prev => ({ ...prev, cvv: raw }));
    if (errorMessage) setErrorMessage('');
  };

  const handleCardNameChange = (e) => {
    setCardData(prev => ({ ...prev, name: e.target.value }));
    if (errorMessage) setErrorMessage('');
  };

  // Phase 1: Robust Form Validation
  const validateStep1 = () => {
    const trimmedName = formData.fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      return 'Please enter your full name (minimum 2 characters)';
    }

    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return 'Please enter a valid email address (e.g. name@college.edu)';
    }

    const cleanPhone = formData.phone.replace(/[\s\-\+\(\)]/g, '');
    if (!cleanPhone || cleanPhone.length < 10 || !/^\d{10,13}$/.test(cleanPhone)) {
      return 'Please enter a valid 10-digit mobile number';
    }

    const trimmedCollege = formData.college.trim();
    if (!trimmedCollege || trimmedCollege.length < 3) {
      return 'Please enter your college or institution name (minimum 3 characters)';
    }

    // Team pass specific requirements
    if (selectedTier.type === 'team') {
      const trimmedTeamName = formData.teamName.trim();
      if (!trimmedTeamName || trimmedTeamName.length < 2) {
        return 'Please enter your team/squad name for the hackathon';
      }

      const trimmedMember2 = formData.member2.trim();
      if (!trimmedMember2 || trimmedMember2.length < 2) {
        return 'Squad pass covers 2-4 members. Please enter Member 2\'s full name.';
      }

      if (trimmedMember2.toLowerCase() === trimmedName.toLowerCase()) {
        return 'Member 2 name cannot be identical to the team leader\'s name';
      }
    }

    return '';
  };

  const handleNext = (e) => {
    e.preventDefault();
    const err = validateStep1();
    if (err) {
      setErrorMessage(err);
      return;
    }
    setStep(2);
    setErrorMessage('');
  };

  // Copy to clipboard handlers
  const handleCopyUpi = () => {
    if (settings.upiId) {
      navigator.clipboard.writeText(settings.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleCopyAcc = () => {
    if (settings.bankDetails?.accountNumber) {
      navigator.clipboard.writeText(settings.bankDetails.accountNumber);
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    }
  };

  const handleCopyIfsc = () => {
    if (settings.bankDetails?.ifscCode) {
      navigator.clipboard.writeText(settings.bankDetails.ifscCode);
      setCopiedIfsc(true);
      setTimeout(() => setCopiedIfsc(false), 2000);
    }
  };

  // Handle Screenshot Upload with automatic canvas compression & Supabase Storage upload
  const handleScreenshotChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Uploaded file must be an image (PNG, JPG, or WEBP)');
        return;
      }
      setUploadingImage(true);
      setErrorMessage('');
      try {
        // Compress high-res smartphone screenshots down to ~100KB (max 1200px width/height, 80% JPEG)
        const compressedBase64 = await compressImage(file, 1200, 1200, 0.78);
        setScreenshotPreview(compressedBase64);

        // Upload to Supabase Storage bucket in the background
        const cdnUrl = await uploadImageToSupabase(compressedBase64, 'organizer-assets', 'payment-receipts');
        if (cdnUrl && cdnUrl.startsWith('http')) {
          setScreenshotUrl(cdnUrl);
        }
      } catch (err) {
        console.warn('Screenshot upload note:', err);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  // Safe launcher for UPI apps that does NOT cause the browser tab to unload/refresh
  const handleLaunchUpi = (e, url) => {
    if (e && e.preventDefault) e.preventDefault();
    saveSession(2, formData, selectedTier);

    // Open via hidden target="_blank" anchor so mobile browser stays active
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // UPI details matching the official uploaded QR code (8010086323@fam)
  const activeUpiId = (settings.upiId || '8010086323@fam').trim();
  const activePayeeName = (settings.payeeName || 'Club Data Decoder, Department of Data Science, Smt. Chandibai Himathmal Mansukhani College').trim();
  const passPrice = selectedTier?.price || 299;
  const payerName = (formData.fullName.trim() || 'Pass');

  // Generic UPI deep link (matches exact QR payment format)
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(activeUpiId)}&pn=${encodeURIComponent(activePayeeName)}&am=${passPrice}&cu=INR&tn=AlgoNexus-${encodeURIComponent(payerName)}`;
  
  // Specific UPI App Schemes (Mobile direct deep links)
  const gpayIntentUrl = `tez://upi/pay?pa=${encodeURIComponent(activeUpiId)}&pn=${encodeURIComponent(activePayeeName)}&am=${passPrice}&cu=INR&tn=AlgoNexus-${encodeURIComponent(payerName)}`;
  const phonepeIntentUrl = `phonepe://pay?pa=${encodeURIComponent(activeUpiId)}&pn=${encodeURIComponent(activePayeeName)}&am=${passPrice}&cu=INR&tn=AlgoNexus-${encodeURIComponent(payerName)}`;
  const paytmIntentUrl = `paytmmp://pay?pa=${encodeURIComponent(activeUpiId)}&pn=${encodeURIComponent(activePayeeName)}&am=${passPrice}&cu=INR&tn=AlgoNexus-${encodeURIComponent(payerName)}`;

  // Download / Save QR code image helper for mobile scan-from-gallery
  const handleDownloadQr = () => {
    const qrSrc = settings.qrCodeImage || 'https://vcswkusqdkyhyanytjlc.supabase.co/storage/v1/object/public/organizer-assets/qr-codes/1790917868549-hyt2j0.png';
    const link = document.createElement('a');
    link.href = qrSrc;
    link.download = 'AlgoNexus_Payment_QR.png';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Complete Payment Verification & Pass Creation
  const completePayment = async (method, additionalData = {}) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const generatedTicketId = `ALGO26-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // Assemble structured team members list for squad pass
      const teamMembers = selectedTier.type === 'team' ? [
        { role: 'Team Lead', name: formData.fullName.trim(), email: formData.email.trim(), phone: formData.phone.trim() },
        ...(formData.member2.trim() ? [{ role: 'Member 2', name: formData.member2.trim() }] : []),
        ...(formData.member3.trim() ? [{ role: 'Member 3', name: formData.member3.trim() }] : []),
        ...(formData.member4.trim() ? [{ role: 'Member 4', name: formData.member4.trim() }] : [])
      ] : [];

      const finalScreenshot = screenshotUrl || additionalData.screenshot || screenshotPreview;

      const payload = {
        razorpay_order_id: `ORD_${Date.now()}`,
        razorpay_payment_id: additionalData.utr || (finalScreenshot ? `SCREENSHOT-${generatedTicketId}` : `PAY_${Date.now()}`),
        registrationData: {
          ...formData,
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          college: formData.college.trim(),
          teamName: formData.teamName.trim(),
          teamMembers,
          amount: selectedTier.price,
          passType: selectedTier.name
        },
        paymentMethod: method,
        utrNumber: additionalData.utr || utrNumber.trim() || (finalScreenshot ? `SCREENSHOT-${generatedTicketId}` : `UTR-PENDING-${Date.now().toString().slice(-6)}`),
        paymentScreenshot: finalScreenshot,
        bankName: additionalData.bank || 'UPI_TRANSFER',
        isSimulated: true
      };

      const isGatewayPaid = Boolean(additionalData.isGatewayPaid);
      const calculatedPaymentStatus = isGatewayPaid ? 'PAID' : 'PENDING_VERIFICATION';

      let finalTicket = {
        ticketId: generatedTicketId,
        orderId: payload.razorpay_order_id,
        paymentId: payload.razorpay_payment_id,
        paymentStatus: calculatedPaymentStatus,
        paymentMethod: method,
        utrNumber: payload.utrNumber,
        paymentScreenshot: payload.paymentScreenshot,
        bankName: payload.bankName,
        verifiedAt: isGatewayPaid ? new Date().toISOString() : null,
        submittedAt: new Date().toISOString(),
        amountPaid: selectedTier.price,
        passType: selectedTier.name,
        attendee: {
          ...payload.registrationData
        },
        checkedIn: false
      };

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch('/api/verify-payment', {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.ticket) {
            finalTicket = data.ticket;
          }
        }
      } catch (e) {
        console.warn('Backend sync note: persisted to local state:', e);
      }

      // Add to shared event context (persists in localStorage & admin console)
      addRegistration(finalTicket);

      // Clear the saved active checkout session
      clearSession();

      setLoading(false);
      onPaymentSuccess(finalTicket);
      onClose();
    } catch (err) {
      setLoading(false);
      setErrorMessage('Could not verify payment. Please try again.');
    }
  };

  // Handle UPI Verification Submission (Flexible: UTR, Screenshot, or Both!)
  const handleUpiSubmit = (e) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();
    const hasScreenshot = Boolean(screenshotPreview || screenshotUrl);

    if (!cleanUtr && !hasScreenshot) {
      setErrorMessage('Please either enter the 12-digit UPI UTR number OR attach your payment screenshot to verify');
      return;
    }

    const finalUtr = cleanUtr || `IMG-VERIFY-${Date.now().toString().slice(-6)}`;
    completePayment('UPI_QR', { 
      utr: finalUtr, 
      screenshot: screenshotUrl || screenshotPreview 
    });
  };

  // Auto-fill test simulation helper
  const handleAutoFillUpi = () => {
    const randomUtr = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setUtrNumber(randomUtr);
    completePayment('UPI_QR', { utr: randomUtr, screenshot: screenshotUrl || screenshotPreview });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0b0e14] border-2 border-mc-diamond rounded-2xl shadow-diamond-glow overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-mc-deepslate border-b-2 border-mc-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mc-card border border-mc-diamond flex items-center justify-center shadow-voxel-sm">
              <Ticket className="w-5 h-5 text-mc-diamond" />
            </div>
            <div>
              <h3 className="text-base font-mc font-bold text-white tracking-wide">
                ALGO<span className="text-mc-diamond">NEXUS</span> REGISTRATION
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {step === 1 ? 'Phase 1: Attendee Details & Preferences' : 'Phase 2: Payment & Pass Verification'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {step === 2 && (
              <div className="text-right hidden sm:block font-mono">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mc">PAYABLE</span>
                <span className="text-xl font-black text-mc-diamond font-mc">₹{selectedTier.price}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-mc-card border border-mc-border text-slate-400 hover:text-white transition-all rounded"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-mc-redstone/10 border border-mc-redstone/40 text-mc-redstone text-xs flex items-center gap-2 shrink-0 font-mono rounded">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-4">
              
              {/* Pass Tier Picker */}
              <div>
                <label className="block text-xs font-mc font-bold uppercase tracking-wider text-slate-300 mb-2">
                  [SELECT EXPEDITION PASS]
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {pricingTiers.map((tier) => (
                    <button
                      type="button"
                      key={tier.id}
                      onClick={() => {
                        setSelectedTier(tier);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className={`p-3 text-left border rounded transition-all ${
                        selectedTier.id === tier.id
                          ? 'bg-mc-diamond/10 border-mc-diamond text-white shadow-voxel-sm'
                          : 'bg-mc-deepslate border-mc-border text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xs font-bold text-white font-mc">{tier.name}</div>
                      <div className="text-sm font-black text-mc-diamond font-mc mt-1">₹{tier.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-mc-diamond" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Alex Sharma"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-mc-diamond" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@college.edu"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-mc-diamond" />
                    <span>WhatsApp / Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    maxLength={13}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 flex items-center gap-1">
                    <School className="w-3.5 h-3.5 text-mc-diamond" />
                    <span>College / University Name *</span>
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="e.g. National Institute of Tech"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Branch / Major</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    <option>Computer Science & Engineering</option>
                    <option>Information Technology</option>
                    <option>AI & Data Science</option>
                    <option>Electronics & Communication</option>
                    <option>Electrical / Mechanical</option>
                    <option>Other / MCA / BCA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Year of Study</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                    <option>Postgraduate / Alum</option>
                  </select>
                </div>
              </div>

              {/* Primary Track Choice */}
              <div>
                <label className="block text-xs text-slate-300 mb-1 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-mc-diamond" />
                  <span>Preferred Competition Track</span>
                </label>
                <select
                  name="track"
                  value={formData.track}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                >
                  {EVENT_TRACKS.map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.prize})</option>
                  ))}
                </select>
              </div>

              {/* Team Information if Team Pass */}
              {selectedTier.type === 'team' && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/40 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Hackathon Squad Details (Team 2 to 4)</span>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Team Name *</label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleChange}
                      placeholder="e.g. ByteBusters"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] text-slate-400">Teammate Names (Lead is {formData.fullName || 'You'}):</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <input
                          type="text"
                          name="member2"
                          value={formData.member2}
                          onChange={handleChange}
                          placeholder="Member 2 Name *"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-400"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="member3"
                          value={formData.member3}
                          onChange={handleChange}
                          placeholder="Member 3 (Optional)"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-400"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="member4"
                          value={formData.member4}
                          onChange={handleChange}
                          placeholder="Member 4 (Optional)"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all"
                >
                  <span>Proceed to Pay via UPI QR</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          ) : (
            /* Step 2: Payment Gateway Options */
            <div className="space-y-6">
              
              {/* Payment Summary Bar */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Registering: </span>
                  <span className="font-bold text-white">{formData.fullName}</span>
                  <span className="text-slate-400"> ({selectedTier.name})</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Amount: </span>
                  <span className="text-base font-extrabold text-cyan-400 font-mono">₹{selectedTier.price}</span>
                </div>
              </div>

              {/* Official UPI Payment Header */}
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Official College UPI & GPay Payment</div>
                    <div className="text-[10px] text-slate-400">Scan using Google Pay, PhonePe, Paytm, or BHIM</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold shrink-0">
                  Instant Verification
                </span>
              </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                    
                    {/* QR Code Card */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-slate-950 shadow-xl border border-cyan-500/40">
                      <div className="flex items-center justify-between w-full mb-2 pb-1.5 border-b border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Official College UPI QR</span>
                        <span className="text-xs font-mono font-bold text-emerald-600">₹{selectedTier.price}</span>
                      </div>

                      {/* Interactive QR Code: Tapping directly opens UPI app on mobile without refreshing */}
                      <button
                        type="button"
                        onClick={(e) => handleLaunchUpi(e, upiIntentUrl)}
                        className="block relative p-2 bg-slate-50 rounded-xl border border-slate-200 my-1 group hover:border-cyan-500 transition-all text-center w-full"
                        title="Tap to pay directly in UPI App"
                      >
                        {settings.qrCodeImage ? (
                          <img
                            src={settings.qrCodeImage}
                            alt="Official College UPI QR Code"
                            className="w-40 h-40 object-contain rounded-lg mx-auto"
                          />
                        ) : (
                          <QRCodeSVG
                            value={upiIntentUrl}
                            size={160}
                            level="H"
                            includeMargin={false}
                          />
                        )}
                        <span className="text-[10px] text-cyan-700 font-bold flex items-center justify-center gap-1 mt-1.5 group-hover:underline">
                          <Smartphone className="w-3 h-3" />
                          <span>Tap QR to Pay in App</span>
                        </span>
                      </button>

                      {/* Save QR to Photos Button for Mobile Users scanning from gallery */}
                      <button
                        type="button"
                        onClick={handleDownloadQr}
                        className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Save QR to Gallery (Scan in App)</span>
                      </button>

                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                        Google Pay • PhonePe • Paytm • BHIM
                      </div>
                    </div>

                    {/* UPI ID & Direct Mobile Intent Links */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Official College UPI ID
                        </label>
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700">
                          <span className="font-mono text-xs font-bold text-white flex-1 truncate">{activeUpiId}</span>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                          <span>Pay with Downloaded UPI App:</span>
                          <span className="text-[9px] text-cyan-400 font-mono">Safe 1-Tap Redirect</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleLaunchUpi(e, gpayIntentUrl)}
                            className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                            title="Open Google Pay"
                          >
                            <span className="text-cyan-400 font-black">G</span>
                            <span>Google Pay</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleLaunchUpi(e, phonepeIntentUrl)}
                            className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-500 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                            title="Open PhonePe"
                          >
                            <span className="text-purple-400 font-black">₹</span>
                            <span>PhonePe</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleLaunchUpi(e, paytmIntentUrl)}
                            className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-500 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                            title="Open Paytm"
                          >
                            <span className="text-sky-400 font-black">P</span>
                            <span>Paytm</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleLaunchUpi(e, upiIntentUrl)}
                            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600/20 to-indigo-600/20 hover:from-cyan-600/30 hover:to-indigo-600/30 border border-cyan-500/40 text-xs font-bold text-cyan-200 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                            title="Open in Any Installed UPI App"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Any UPI App</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-slate-300 leading-snug">
                        💡 <strong>How to Pay on Mobile:</strong> Tap any app button above to pay directly, or save the QR to scan from your gallery. When returning from your UPI app, your session is saved!
                      </div>
                    </div>

                  </div>

                  {/* Verification Form (UTR & Screenshot) */}
                  <form onSubmit={handleUpiSubmit} className="pt-4 border-t border-slate-800 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                          <span>12-Digit UPI UTR / Transaction ID</span>
                          <span className="text-[10px] text-slate-400 font-normal">Optional if screenshot attached</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 428190284719"
                          value={utrNumber}
                          onChange={(e) => {
                            setUtrNumber(e.target.value);
                            if (errorMessage) setErrorMessage('');
                          }}
                          maxLength={22}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                        <span className="text-[10px] text-slate-500 block mt-1">Found in your GPay / PhonePe receipt details</span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                          <span>Attach Payment Screenshot</span>
                          <span className="text-[10px] text-cyan-400 font-normal">Auto-compressed</span>
                        </label>
                        <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs cursor-pointer hover:border-cyan-400 transition-colors">
                          {uploadingImage ? (
                            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                          ) : (
                            <Upload className="w-4 h-4 text-cyan-400 shrink-0" />
                          )}
                          <span className="truncate">
                            {uploadingImage 
                              ? 'Compressing & securing image...' 
                              : (screenshotPreview ? 'Screenshot Attached ✓' : 'Upload Receipt Photo / Screenshot')}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotChange}
                            disabled={uploadingImage}
                            className="hidden"
                          />
                        </label>
                        {screenshotPreview ? (
                          <span className="text-[10px] text-emerald-400 block mt-1">
                            ✓ Screenshot attached successfully! You can submit now.
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 block mt-1">
                            Scanned on phone? Send screenshot to laptop and upload here.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleAutoFillUpi}
                        className="text-xs text-cyan-400 hover:underline py-1"
                      >
                        ⚡ Simulate Instant Test Verification
                      </button>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setStep(1);
                            if (errorMessage) setErrorMessage('');
                          }}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirm & Get E-Ticket</span>}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
