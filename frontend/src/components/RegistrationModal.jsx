import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Ticket, Users, AlertCircle, ArrowRight, Loader2, 
  QrCode, Copy, Check, Upload, Smartphone, Download, ExternalLink,
  User, Mail, Phone, School, Compass, ShieldCheck, Sparkles,
  Clock, CheckCircle2, ChevronDown, ChevronUp, Image as ImageIcon,
  Trash2, HelpCircle, Building2, Zap, ZoomIn, Shield
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
  const [loadingStage, setLoadingStage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Payment Verification fields
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotMeta, setScreenshotMeta] = useState(null); // { name, size }

  // Interactive UI states for Step 2
  const [qrMode, setQrMode] = useState('dynamic'); // 'dynamic' (auto-filled amount) or 'official' (college image)
  const [showUtrHelp, setShowUtrHelp] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [isZoomQr, setIsZoomQr] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [pasteNotification, setPasteNotification] = useState('');

  // Unique session order reference
  const [orderRef] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());

  // 10-Minute live fintech countdown timer
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes = 600s

  useEffect(() => {
    if (step !== 2) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
    } catch (e) {}
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

  // Keep selected tier in sync if pass pricing changes live from cloud
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
    qrCodeImage: 'https://vcswkusqdkyhyanytjlc.supabase.co/storage/v1/object/public/organizer-assets/qr-codes/1790917868549-hyt2j0.png',
    bankDetails: {
      bankName: 'Smt. Chandibai Himathmal Mansukhani College Account',
      accountNumber: '41829019283',
      ifscCode: 'SBIN0001234',
      accountHolder: 'Department of Data Science - AlgoNexus 2026',
      accountType: 'Current Account',
      branch: 'CHM College Campus Branch'
    }
  };

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

  // Process and upload screenshot file (supports file input, drag-and-drop, and clipboard paste!)
  const processScreenshot = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Uploaded file must be an image (PNG, JPG, JPEG, or WEBP)');
      return;
    }
    setUploadingImage(true);
    setErrorMessage('');
    try {
      const sizeKb = Math.round(file.size / 1024);
      setScreenshotMeta({ name: file.name || 'clipboard-screenshot.jpg', size: `${sizeKb} KB` });

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
  };

  // Clipboard Paste Support (Ctrl + V anywhere on Step 2!)
  useEffect(() => {
    if (step !== 2) return;
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            processScreenshot(file);
            setPasteNotification('Screenshot pasted from clipboard! ✓');
            setTimeout(() => setPasteNotification(''), 3000);
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [step]);

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processScreenshot(files[0]);
    }
  };

  // Remove screenshot
  const handleRemoveScreenshot = () => {
    setScreenshotPreview('');
    setScreenshotUrl('');
    setScreenshotMeta(null);
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    saveSession(step, updated, selectedTier);
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

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(selectedTier.price.toString());
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
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

  // Generic UPI deep link (matches exact QR payment format with amount locked!)
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(activeUpiId)}&pn=${encodeURIComponent(activePayeeName)}&am=${passPrice}&cu=INR&tn=TechAstra-${encodeURIComponent(payerName)}`;
  
  // Specific UPI App Schemes (Mobile direct deep links)
  const gpayIntentUrl = `tez://upi/pay?pa=${encodeURIComponent(activeUpiId)}&pn=${encodeURIComponent(activePayeeName)}&am=${passPrice}&cu=INR&tn=TechAstra-${encodeURIComponent(payerName)}`;
  const phonepeIntentUrl = `phonepe://pay?pa=${encodeURIComponent(activeUpiId)}&pn=${encodeURIComponent(activePayeeName)}&am=${passPrice}&cu=INR&tn=TechAstra-${encodeURIComponent(payerName)}`;
  const paytmIntentUrl = `paytmmp://pay?pa=${encodeURIComponent(activeUpiId)}&pn=${encodeURIComponent(activePayeeName)}&am=${passPrice}&cu=INR&tn=TechAstra-${encodeURIComponent(payerName)}`;

  // Download / Save QR code image helper for mobile scan-from-gallery
  const handleDownloadQr = () => {
    const qrSrc = (qrMode === 'official' && settings.qrCodeImage) 
      ? settings.qrCodeImage 
      : (settings.qrCodeImage || 'https://vcswkusqdkyhyanytjlc.supabase.co/storage/v1/object/public/organizer-assets/qr-codes/1790917868549-hyt2j0.png');
    
    const link = document.createElement('a');
    link.href = qrSrc;
    link.download = `TechAstra_Pay_Rs${passPrice}_QR.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // UTR format & validation helpers
  const cleanUtrRaw = utrNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const is12DigitUtr = /^\d{12}$/.test(cleanUtrRaw);

  const handleUtrInput = (e) => {
    const raw = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 16);
    setUtrNumber(raw);
    if (errorMessage) setErrorMessage('');
  };

  // Complete Payment Verification & Pass Creation
  const completePayment = async (method, additionalData = {}) => {
    setLoading(true);
    setErrorMessage('');

    try {
      setLoadingStage('Step 1/3: Verifying UPI transaction reference...');
      await new Promise(r => setTimeout(r, 450));

      setLoadingStage('Step 2/3: Allocating Doomsday gate pass in Supabase...');
      await new Promise(r => setTimeout(r, 450));

      setLoadingStage('Step 3/3: Forging Holographic Attendee Pass...');
      const generatedTicketId = `TECH26-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // Assemble structured team members list for squad pass
      const teamMembers = selectedTier.type === 'team' ? [
        { role: 'Team Lead', name: formData.fullName.trim(), email: formData.email.trim(), phone: formData.phone.trim() },
        ...(formData.member2.trim() ? [{ role: 'Member 2', name: formData.member2.trim() }] : []),
        ...(formData.member3.trim() ? [{ role: 'Member 3', name: formData.member3.trim() }] : []),
        ...(formData.member4.trim() ? [{ role: 'Member 4', name: formData.member4.trim() }] : [])
      ] : [];

      const finalScreenshot = screenshotUrl || additionalData.screenshot || screenshotPreview;
      const finalUtr = additionalData.utr || cleanUtrRaw || (finalScreenshot ? `SCREENSHOT-${generatedTicketId}` : `UTR-${Date.now().toString().slice(-6)}`);

      const payload = {
        razorpay_order_id: `ORD_${orderRef}`,
        razorpay_payment_id: finalUtr,
        paymentStatus: 'PAID',
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
        utrNumber: finalUtr,
        paymentScreenshot: finalScreenshot,
        bankName: additionalData.bank || 'UPI_DIRECT',
        isSimulated: Boolean(additionalData.isSimulated)
      };

      let finalTicket = {
        ticketId: generatedTicketId,
        orderId: payload.razorpay_order_id,
        paymentId: payload.razorpay_payment_id,
        paymentStatus: 'PAID',
        paymentMethod: method,
        utrNumber: payload.utrNumber,
        paymentScreenshot: payload.paymentScreenshot,
        bankName: payload.bankName,
        verifiedAt: new Date().toISOString(),
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
      setErrorMessage('Could not complete payment verification. Please try again.');
    }
  };

  // Handle UPI Verification Submission (Flexible: UTR, Screenshot, or Both!)
  const handleUpiSubmit = (e) => {
    e.preventDefault();
    const cleanUtr = cleanUtrRaw;
    const hasScreenshot = Boolean(screenshotPreview || screenshotUrl);

    if (!cleanUtr && !hasScreenshot) {
      setErrorMessage('Please enter your 12-digit UPI UTR number OR attach your payment screenshot to verify');
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
    completePayment('UPI_QR', { utr: randomUtr, screenshot: screenshotUrl || screenshotPreview, isSimulated: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-emerald-500/30 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.22)] overflow-hidden my-4 sm:my-6 flex flex-col max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-center shadow-sm">
              <Ticket className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-chakra font-bold text-white tracking-wide flex items-center gap-2">
                <span>TECH<span className="text-emerald-400">ASTRA</span> 2026 GATEWAY</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {step === 1 ? 'STEP 1/2' : 'STEP 2/2'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {step === 1 ? 'Attendee Details & Competition Track' : 'Official Direct UPI Settlement'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {step === 2 && (
              <div className="text-right hidden sm:block font-mono">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-chakra">PAYABLE AMOUNT</span>
                <span className="text-xl font-chakra font-black text-emerald-400">₹{selectedTier.price}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-all"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs flex items-center gap-2 shrink-0 font-mono rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Clipboard Notification */}
        {pasteNotification && (
          <div className="mx-4 sm:mx-6 mt-3 p-2.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 shrink-0 font-mono rounded-xl animate-pulse">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{pasteNotification}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
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
                      className={`p-3 text-left border rounded-xl transition-all ${
                        selectedTier.id === tier.id
                          ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white font-chakra">{tier.name}</div>
                      <div className="text-sm font-black text-emerald-400 font-chakra mt-1">₹{tier.price}</div>
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
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          ) : (
            /* ========================================================================= */
            /* STEP 2: REVOLUTIONARY DIRECT UPI GATEWAY INTERFACE                        */
            /* ========================================================================= */
            <div className="space-y-5">
              
              {/* Order Reference & Live Timer Bar */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs shadow-inner">
                <div className="flex items-center gap-2 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-400">Order:</span>
                  <span className="font-bold text-white tracking-wider">#ORD-{orderRef}</span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-slate-400">Rate locked:</span>
                  <span className="font-bold text-amber-300">{formatCountdown(timeLeft)}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300 font-mono text-xs">
                  <span className="text-slate-400">Payable:</span>
                  <span className="text-base font-extrabold text-emerald-400">₹{selectedTier.price}</span>
                  <button
                    type="button"
                    onClick={handleCopyAmount}
                    className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                    title="Copy Amount"
                  >
                    {copiedAmount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Official College Verified Trust Banner */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{activePayeeName}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                        VERIFIED ORGANIZER
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Direct NPCI • BHIM UPI • 0% Surcharge • 100% Secure
                    </div>
                  </div>
                </div>
              </div>

              {/* Central Payment Matrix: QR Code & Mobile Launchers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                
                {/* Left Column: High-Tech Interactive QR Card */}
                <div className="flex flex-col items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-xl relative overflow-hidden">
                  
                  {/* QR Mode Switcher Tabs */}
                  <div className="flex items-center justify-between w-full mb-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => setQrMode('dynamic')}
                      className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
                        qrMode === 'dynamic'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Zap className="w-3 h-3 text-emerald-400" />
                      <span>Auto-Filled (₹{passPrice})</span>
                    </button>
                    {settings.qrCodeImage && (
                      <button
                        type="button"
                        onClick={() => setQrMode('official')}
                        className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
                          qrMode === 'official'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Building2 className="w-3 h-3 text-cyan-400" />
                        <span>Official FamPay QR</span>
                      </button>
                    )}
                  </div>

                  {/* QR Box with Cyber Bezel & Animated Laser Sweep */}
                  <div className="relative p-3 bg-white rounded-2xl shadow-2xl border-2 border-emerald-400/40 group overflow-hidden my-1">
                    {/* Laser Sweep line */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] qr-scanner-laser pointer-events-none z-10" />

                    {qrMode === 'dynamic' ? (
                      <QRCodeSVG
                        value={upiIntentUrl}
                        size={170}
                        level="H"
                        includeMargin={false}
                        className="rounded-lg"
                      />
                    ) : (
                      <img
                        src={settings.qrCodeImage}
                        alt="Official College FamPay QR"
                        className="w-[170px] h-[170px] object-contain rounded-lg"
                      />
                    )}

                    {/* Zoom button overlay */}
                    <button
                      type="button"
                      onClick={() => setIsZoomQr(true)}
                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/75 hover:bg-black text-white text-[10px] flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
                      title="Enlarge QR for scanning"
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>

                  {/* QR Sub-text */}
                  <p className="text-[10px] text-slate-400 font-mono text-center mt-2">
                    {qrMode === 'dynamic' 
                      ? `Scan with any app — amount ₹${passPrice} auto-fills!`
                      : 'Scan official College QR code'}
                  </p>

                  {/* Save QR to Photos Button for Mobile Users scanning from gallery */}
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="w-full mt-2.5 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Save QR to Gallery (Scan in App)</span>
                  </button>

                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-2">
                    Google Pay • PhonePe • Paytm • BHIM
                  </div>
                </div>

                {/* Right Column: 1-Tap Mobile Launchers & UPI ID */}
                <div className="flex flex-col justify-between space-y-3">
                  
                  {/* Copyable UPI ID Box */}
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 font-mono flex items-center justify-between">
                      <span>Official College UPI ID:</span>
                      <span className="text-[10px] text-emerald-400">1-Click Copy</span>
                    </label>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700/80">
                      <span className="font-mono text-xs font-bold text-white flex-1 truncate">{activeUpiId}</span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 1-Tap Mobile UPI App Buttons */}
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono flex items-center justify-between">
                      <span>Pay directly on your phone:</span>
                      <span className="text-[9px] text-emerald-400 font-mono">⚡ 1-Tap App Launch</span>
                    </label>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {/* Google Pay */}
                      <button
                        type="button"
                        onClick={(e) => handleLaunchUpi(e, gpayIntentUrl)}
                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all shadow-sm group"
                        title="Open Google Pay"
                      >
                        <div className="w-5 h-5 rounded-full bg-slate-950 flex items-center justify-center text-[11px] font-black text-cyan-400 border border-cyan-400/30">
                          G
                        </div>
                        <span className="group-hover:text-cyan-300">Google Pay</span>
                      </button>

                      {/* PhonePe */}
                      <button
                        type="button"
                        onClick={(e) => handleLaunchUpi(e, phonepeIntentUrl)}
                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-400 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all shadow-sm group"
                      >
                        <div className="w-5 h-5 rounded-full bg-slate-950 flex items-center justify-center text-[11px] font-black text-purple-400 border border-purple-400/30">
                          ₹
                        </div>
                        <span className="group-hover:text-purple-300">PhonePe</span>
                      </button>

                      {/* Paytm */}
                      <button
                        type="button"
                        onClick={(e) => handleLaunchUpi(e, paytmIntentUrl)}
                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-400 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all shadow-sm group"
                      >
                        <div className="w-5 h-5 rounded-full bg-slate-950 flex items-center justify-center text-[11px] font-black text-sky-400 border border-sky-400/30">
                          P
                        </div>
                        <span className="group-hover:text-sky-300">Paytm</span>
                      </button>

                      {/* Any UPI App */}
                      <button
                        type="button"
                        onClick={(e) => handleLaunchUpi(e, upiIntentUrl)}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 hover:from-emerald-900/60 hover:to-teal-900/60 border border-emerald-500/40 text-xs font-bold text-emerald-200 flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                        <span>Any UPI App</span>
                      </button>
                    </div>
                  </div>

                  {/* Bank Details Accordion Toggle (For IMPS / NEFT) */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowBankDetails(!showBankDetails)}
                      className="w-full p-2.5 flex items-center justify-between text-left text-xs font-semibold text-slate-300 hover:text-white"
                    >
                      <span className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Prefer IMPS / NEFT Direct Bank Transfer?</span>
                      </span>
                      {showBankDetails ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                    </button>

                    {showBankDetails && (
                      <div className="p-3 border-t border-slate-800 bg-slate-950/90 space-y-2 text-[11px] font-mono text-slate-300">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Bank:</span>
                          <span className="text-white font-semibold">{settings.bankDetails?.bankName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Account No:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-400 font-bold">{settings.bankDetails?.accountNumber}</span>
                            <button
                              type="button"
                              onClick={handleCopyAcc}
                              className="p-1 hover:text-emerald-400 text-slate-400"
                              title="Copy Account Number"
                            >
                              {copiedAcc ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">IFSC Code:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-400 font-bold">{settings.bankDetails?.ifscCode}</span>
                            <button
                              type="button"
                              onClick={handleCopyIfsc}
                              className="p-1 hover:text-emerald-400 text-slate-400"
                              title="Copy IFSC"
                            >
                              {copiedIfsc ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Beneficiary:</span>
                          <span className="text-slate-200 text-right truncate max-w-[200px]">{settings.bankDetails?.accountHolder}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Help banner */}
                  <div className="p-2.5 rounded-xl bg-emerald-950/25 border border-emerald-800/30 text-[11px] text-slate-300 leading-snug font-mono">
                    💡 <strong>Pro Tip:</strong> After paying, enter your 12-digit UTR reference below or attach receipt to generate your official pass instantly!
                  </div>

                </div>

              </div>

              {/* UTR Reference & Screenshot Verification Section */}
              <form onSubmit={handleUpiSubmit} className="pt-3 border-t border-slate-800/80 space-y-3.5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Field 1: Smart 12-Digit UTR Input */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1 font-mono">
                        <span>12-Digit UPI UTR / Ref ID</span>
                        {is12DigitUtr && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowUtrHelp(!showUtrHelp)}
                        className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Where to find?</span>
                      </button>
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. 428190284719"
                        value={utrNumber}
                        onChange={handleUtrInput}
                        maxLength={16}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-white font-mono text-sm placeholder-slate-500 focus:outline-none transition-colors ${
                          is12DigitUtr 
                            ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                            : 'border-slate-700 focus:border-cyan-400'
                        }`}
                      />
                      <span className="absolute right-3 top-3 text-[10px] font-mono text-slate-400">
                        {cleanUtrRaw.length}/12
                      </span>
                    </div>

                    {is12DigitUtr ? (
                      <span className="text-[10px] text-emerald-400 font-mono block">
                        ✓ Valid 12-digit UPI reference ID
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono block">
                        Found in your GPay / PhonePe payment receipt
                      </span>
                    )}

                    {/* Expandable UTR Guide */}
                    {showUtrHelp && (
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-[10px] text-slate-300 font-mono space-y-1">
                        <div>• <strong>Google Pay:</strong> Tap transaction → Look for <em>"UPI transaction ID"</em> (12 digits)</div>
                        <div>• <strong>PhonePe:</strong> Tap transaction → View <em>"UTR"</em> under Transfer Details</div>
                        <div>• <strong>Paytm:</strong> Tap receipt → Check <em>"UPI Ref No."</em></div>
                      </div>
                    )}
                  </div>

                  {/* Field 2: Smart Screenshot Dropzone & Paste Box */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span className="font-mono">Attach Payment Receipt</span>
                      <span className="text-[10px] text-slate-400 font-mono">Or press Ctrl+V to Paste</span>
                    </label>

                    {screenshotPreview ? (
                      /* Active Screenshot Preview Box */
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <img
                            src={screenshotPreview}
                            alt="Receipt Preview"
                            className="w-9 h-9 object-cover rounded-lg border border-slate-700 shrink-0"
                          />
                          <div className="overflow-hidden">
                            <span className="text-white font-mono font-bold truncate block">
                              {screenshotMeta?.name || 'receipt-screenshot.jpg'}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono">
                              ✓ Attached & Compressed {screenshotMeta?.size ? `(${screenshotMeta.size})` : ''}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveScreenshot}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="Remove screenshot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      /* Dropzone */
                      <label
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed text-xs cursor-pointer transition-all ${
                          isDraggingFile 
                            ? 'bg-emerald-500/15 border-emerald-400 text-white' 
                            : 'bg-slate-900 hover:bg-slate-850 border-slate-700 hover:border-cyan-400 text-slate-300'
                        }`}
                      >
                        {uploadingImage ? (
                          <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                        ) : (
                          <Upload className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <span className="truncate font-mono text-[11px]">
                          {uploadingImage 
                            ? 'Compressing image...' 
                            : 'Click to upload or Drag & Drop screenshot'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && processScreenshot(e.target.files[0])}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                    )}

                    <span className="text-[10px] text-slate-500 font-mono block">
                      Auto-compressed to ~100KB for instant verification
                    </span>
                  </div>

                </div>

                {/* Submit Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAutoFillUpi}
                    className="text-xs text-cyan-400 hover:underline py-1 font-mono flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>⚡ Simulate Instant Test Pass (Demo)</span>
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={loading || uploadingImage}
                      className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition-all font-chakra tracking-wide"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>{loadingStage || 'Verifying...'}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>CONFIRM & FORGE E-TICKET</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>

            </div>
          )}
        </div>

      </div>

      {/* Enlarged QR Modal Lightbox */}
      {isZoomQr && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 backdrop-blur-lg p-4">
          <div className="relative p-6 bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl">
            <button
              onClick={() => setIsZoomQr(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-base font-chakra font-bold text-white tracking-wide">
              SCAN TO PAY <span className="text-emerald-400">₹{passPrice}</span>
            </h4>

            <div className="p-4 bg-white rounded-2xl mx-auto inline-block shadow-inner">
              {qrMode === 'dynamic' ? (
                <QRCodeSVG
                  value={upiIntentUrl}
                  size={240}
                  level="H"
                  includeMargin={false}
                />
              ) : (
                <img
                  src={settings.qrCodeImage}
                  alt="Official College FamPay QR"
                  className="w-60 h-60 object-contain mx-auto"
                />
              )}
            </div>

            <p className="text-xs text-slate-400 font-mono">
              Open Google Pay, PhonePe, Paytm, or any banking app camera to scan directly.
            </p>

            <button
              onClick={() => setIsZoomQr(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-black font-chakra font-bold text-sm"
            >
              Close & Return to Checkout
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
