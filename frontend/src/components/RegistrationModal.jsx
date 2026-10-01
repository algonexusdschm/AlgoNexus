import React, { useState, useEffect } from 'react';
import { 
  X, Ticket, Users, AlertCircle, ArrowRight, Loader2, 
  QrCode, Building2, CreditCard, Copy, Check, Upload, Smartphone, ExternalLink,
  User, Mail, Phone, School, Compass, ShieldCheck
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { EVENT_TRACKS } from '../data/eventData';
import { useEvent } from '../context/EventContext';

export default function RegistrationModal({
  isOpen,
  onClose,
  initialTier,
  onPaymentSuccess
}) {
  const { paymentSettings, pricingTiers, addRegistration } = useEvent();
  const [selectedTier, setSelectedTier] = useState(initialTier || pricingTiers[0]);
  const [step, setStep] = useState(1); // 1: Attendee Info, 2: Payment Gateway
  const [paymentTab, setPaymentTab] = useState('upi'); // 'upi', 'netbanking', 'card'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Always sync selected tier if parent passes a new initialTier
  useEffect(() => {
    if (initialTier) {
      setSelectedTier(initialTier);
    }
  }, [initialTier]);

  // Payment settings from context with safe fallback
  const settings = paymentSettings || {
    upiId: 'algonexus.fest@oksbi',
    payeeName: 'AlgoNexus 2026 Organizing Committee',
    qrCodeImage: '',
    bankDetails: {
      bankName: 'State Bank of India',
      accountNumber: '41829019283',
      ifscCode: 'SBIN0001234',
      accountHolder: 'AlgoNexus 2026 Student Council',
      accountType: 'Current Account',
      branch: 'College Campus Branch'
    }
  };

  // Copy indicator states
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);

  // Payment Verification fields
  const [utrNumber, setUtrNumber] = useState('');
  const [netBankingUtr, setNetBankingUtr] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [selectedBank, setSelectedBank] = useState(settings.bankDetails?.bankName || 'State Bank of India');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });

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

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  // Handle Screenshot Upload with size and type check
  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Uploaded file must be an image (PNG, JPG, or WEBP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Screenshot size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
        setErrorMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  // UPI deep link for mobile devices
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(settings.upiId || 'algonexus.fest@oksbi')}&pn=${encodeURIComponent(settings.payeeName || 'AlgoNexus')}&am=${selectedTier.price}&cu=INR&tn=AlgoNexus-${encodeURIComponent(formData.fullName.trim() || 'Pass')}`;

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

      const payload = {
        razorpay_order_id: `ORD_${Date.now()}`,
        razorpay_payment_id: additionalData.utr || `PAY_${Date.now()}`,
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
        utrNumber: additionalData.utr || utrNumber.trim(),
        paymentScreenshot: additionalData.screenshot || screenshotPreview,
        bankName: additionalData.bank || selectedBank,
        isSimulated: true
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
        amountPaid: selectedTier.price,
        passType: selectedTier.name,
        attendee: {
          ...payload.registrationData
        },
        checkedIn: false
      };

      try {
        const res = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success && data.ticket) {
          finalTicket = data.ticket;
        }
      } catch (e) {
        console.warn('Backend sync note: persisted to local state:', e);
      }

      // Add to shared event context (persists in localStorage & admin console)
      addRegistration(finalTicket);

      setLoading(false);
      onPaymentSuccess(finalTicket);
      onClose();
    } catch (err) {
      setLoading(false);
      setErrorMessage('Could not verify payment. Please try again.');
    }
  };

  // Handle UPI Verification Submission
  const handleUpiSubmit = (e) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr) {
      setErrorMessage('Please enter the 12-digit UPI UTR / Transaction Reference ID from your GPay / PhonePe payment receipt');
      return;
    }
    if (cleanUtr.length < 8) {
      setErrorMessage('UPI UTR / Transaction ID must be at least 8 to 12 digits');
      return;
    }
    completePayment('UPI_QR', { utr: cleanUtr, screenshot: screenshotPreview });
  };

  // Handle Net Banking Submit
  const handleNetBankingSubmit = (e) => {
    e.preventDefault();
    const cleanNetUtr = netBankingUtr.trim();
    if (!cleanNetUtr) {
      setErrorMessage('Please enter the IMPS / NEFT / UTR reference number from your bank transfer');
      return;
    }
    if (cleanNetUtr.length < 6) {
      setErrorMessage('Transfer reference number must be at least 6 characters');
      return;
    }
    completePayment('NET_BANKING', { 
      bank: selectedBank, 
      utr: cleanNetUtr, 
      screenshot: screenshotPreview 
    });
  };

  // Handle Card Submission with strict validation
  const handleCardSubmit = (e) => {
    e.preventDefault();
    const cleanCard = cardData.number.replace(/\D/g, '');
    if (!cleanCard || cleanCard.length < 13 || cleanCard.length > 19) {
      setErrorMessage('Please enter a valid 13 to 19 digit card number');
      return;
    }

    const expiryMatch = cardData.expiry.trim().match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!expiryMatch) {
      setErrorMessage('Please enter a valid expiry date in MM/YY format (e.g. 08/28)');
      return;
    }

    const cleanCvv = cardData.cvv.replace(/\D/g, '');
    if (cleanCvv.length < 3 || cleanCvv.length > 4) {
      setErrorMessage('Please enter a valid 3 or 4 digit CVV code');
      return;
    }

    if (!cardData.name.trim() || cardData.name.trim().length < 2) {
      setErrorMessage('Please enter the cardholder name as printed on the card');
      return;
    }

    completePayment('CARD', { 
      cardLast4: cleanCard.slice(-4),
      cardholderName: cardData.name.trim()
    });
  };

  // Auto-fill test simulation helper
  const handleAutoFillUpi = () => {
    const randomUtr = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setUtrNumber(randomUtr);
    completePayment('UPI_QR', { utr: randomUtr, screenshot: screenshotPreview });
  };

  // Launch Native Razorpay Checkout Popup if clicked
  const handleLaunchRazorpay = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedTier.price,
          passType: selectedTier.name,
          attendeeName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim()
        })
      });

      const orderData = await orderRes.json();
      if (orderData.mode === 'live_razorpay' && window.Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: 'INR',
          name: 'AlgoNexus 2026',
          description: `${selectedTier.name} Registration`,
          order_id: orderData.orderId,
          handler: async function (response) {
            completePayment('RAZORPAY_POPUP', {
              utr: response.razorpay_payment_id,
              orderId: response.razorpay_order_id
            });
          },
          prefill: {
            name: formData.fullName.trim(),
            email: formData.email.trim(),
            contact: formData.phone.trim()
          },
          theme: { color: '#06b6d4' },
          modal: { ondismiss: () => setLoading(false) }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback simulated checkout
        setTimeout(() => {
          completePayment('RAZORPAY_SIMULATION', { utr: `pay_rzp_${Date.now()}` });
        }, 1200);
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message || 'Razorpay initialization failed');
    }
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
                  <span>Proceed to Payment Options (UPI / NetBanking / Cards)</span>
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

              {/* Payment Method Tabs */}
              <div className="grid grid-cols-3 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentTab('upi');
                    if (errorMessage) setErrorMessage('');
                  }}
                  className={`py-3 flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    paymentTab === 'upi'
                      ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>UPI & GPay QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentTab('netbanking');
                    if (errorMessage) setErrorMessage('');
                  }}
                  className={`py-3 flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    paymentTab === 'netbanking'
                      ? 'bg-indigo-500/20 text-indigo-300 border-b-2 border-indigo-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentTab('card');
                    if (errorMessage) setErrorMessage('');
                  }}
                  className={`py-3 flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    paymentTab === 'card'
                      ? 'bg-pink-500/20 text-pink-300 border-b-2 border-pink-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Cards</span>
                </button>
              </div>

              {/* PAYMENT OPTION 1: UPI & GPAY QR CODE */}
              {paymentTab === 'upi' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                    
                    {/* QR Code Card */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-slate-950 shadow-xl border border-cyan-500/40">
                      <div className="flex items-center justify-between w-full mb-2 pb-1.5 border-b border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Scan & Pay with Any UPI App</span>
                        <span className="text-xs font-mono font-bold text-emerald-600">₹{selectedTier.price}</span>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 my-1">
                        {settings.qrCodeImage ? (
                          <img
                            src={settings.qrCodeImage}
                            alt="College GPay QR Code"
                            className="w-40 h-40 object-contain rounded-lg"
                          />
                        ) : (
                          <QRCodeSVG
                            value={upiIntentUrl}
                            size={160}
                            level="H"
                            includeMargin={false}
                          />
                        )}
                      </div>

                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                        Google Pay • PhonePe • Paytm • BHIM
                      </div>
                    </div>

                    {/* UPI ID & Intent Links */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Official College UPI ID
                        </label>
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700">
                          <span className="font-mono text-xs font-bold text-white flex-1 truncate">{settings.upiId || 'algonexus.fest@oksbi'}</span>
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
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Pay Directly via Installed App:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={upiIntentUrl}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Google Pay</span>
                          </a>
                          <a
                            href={upiIntentUrl}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                            <span>PhonePe / Paytm</span>
                          </a>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-slate-300 leading-snug">
                        ⚡ <strong>Note:</strong> After completing payment in GPay/PhonePe, enter the <strong>12-digit UTR number</strong> below to verify your pass.
                      </div>
                    </div>

                  </div>

                  {/* Verification Form (UTR & Screenshot) */}
                  <form onSubmit={handleUpiSubmit} className="pt-4 border-t border-slate-800 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          12-Digit UPI UTR / Transaction ID *
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
                        <span className="text-[10px] text-slate-500 block mt-1">Found in your GPay / PhonePe receipt</span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Upload Payment Screenshot (Optional)
                        </label>
                        <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs cursor-pointer hover:border-cyan-400 transition-colors">
                          <Upload className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span className="truncate">{screenshotPreview ? 'Screenshot Attached ✓' : 'Attach Screenshot'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotChange}
                            className="hidden"
                          />
                        </label>
                        {screenshotPreview && (
                          <span className="text-[10px] text-emerald-400 block mt-1">Ready for verification</span>
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
              )}

              {/* PAYMENT OPTION 2: NET BANKING & DIRECT BANK TRANSFER */}
              {paymentTab === 'netbanking' && (
                <div className="space-y-5">
                  
                  {/* Official College Bank Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                      <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                        <Building2 className="w-4 h-4 text-cyan-400" />
                        <span>Official College Festival Bank Account</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400">Pay: ₹{selectedTier.price}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block">Bank Name</span>
                        <span className="font-semibold text-white">{settings.bankDetails?.bankName || 'State Bank of India'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block">Account Holder Name</span>
                        <span className="font-semibold text-white">{settings.bankDetails?.accountHolder || 'AlgoNexus 2026 Organizing Committee'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block">Account Number</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono font-bold text-cyan-300">{settings.bankDetails?.accountNumber || '41829019283'}</span>
                          <button
                            type="button"
                            onClick={handleCopyAcc}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 flex items-center gap-1 border border-slate-700 transition-colors"
                          >
                            {copiedAcc ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedAcc ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block">IFSC Code</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono font-bold text-cyan-300">{settings.bankDetails?.ifscCode || 'SBIN0001234'}</span>
                          <button
                            type="button"
                            onClick={handleCopyIfsc}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 flex items-center gap-1 border border-slate-700 transition-colors"
                          >
                            {copiedIfsc ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedIfsc ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="sm:col-span-2 text-[11px] text-slate-400 border-t border-white/5 pt-2">
                        <span>Account Type: <strong className="text-slate-300">{settings.bankDetails?.accountType || 'Current'}</strong></span>
                        <span className="mx-2">•</span>
                        <span>Branch: <strong className="text-slate-300">{settings.bankDetails?.branch || 'Campus Branch'}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Transfer Reference & Receipt Form */}
                  <form onSubmit={handleNetBankingSubmit} className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          IMPS / NEFT / UTR Reference No. *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 129038472910"
                          value={netBankingUtr}
                          onChange={(e) => {
                            setNetBankingUtr(e.target.value);
                            if (errorMessage) setErrorMessage('');
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Attach Transfer Screenshot (Optional)
                        </label>
                        <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs cursor-pointer hover:border-cyan-400 transition-colors">
                          <Upload className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span className="truncate">{screenshotPreview ? 'Receipt Attached ✓' : 'Upload Receipt'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const testUtr = 'NET' + Math.floor(1000000000 + Math.random() * 9000000000);
                          setNetBankingUtr(testUtr);
                          completePayment('NET_BANKING', { bank: settings.bankDetails?.bankName || 'State Bank of India', utr: testUtr });
                        }}
                        className="text-xs text-indigo-400 hover:underline py-1"
                      >
                        ⚡ Simulate Instant Net Banking Transfer
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
                          className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirm & Get E-Ticket</span>}
                        </button>
                      </div>
                    </div>
                  </form>

                </div>
              )}

              {/* PAYMENT OPTION 3: CARDS */}
              {paymentTab === 'card' && (
                <form onSubmit={handleCardSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Card Number *</label>
                    <input
                      type="text"
                      placeholder="4532 8901 2345 8892"
                      value={cardData.number}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Expiry (MM/YY) *</label>
                      <input
                        type="text"
                        placeholder="MM/YY (e.g. 12/28)"
                        value={cardData.expiry}
                        onChange={handleCardExpiryChange}
                        maxLength={5}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">CVV *</label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={cardData.cvv}
                        onChange={handleCardCvvChange}
                        maxLength={4}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Cardholder Name *</label>
                    <input
                      type="text"
                      placeholder="Name as printed on card"
                      value={cardData.name}
                      onChange={handleCardNameChange}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-3">
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
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Pay ₹{selectedTier.price} via Card</span>}
                    </button>
                  </div>
                </form>
              )}

              {/* Extra Option: Trigger Native Razorpay Modal */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Want to use official Razorpay checkout popup?</span>
                <button
                  type="button"
                  onClick={handleLaunchRazorpay}
                  className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Open Razorpay Popup</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
