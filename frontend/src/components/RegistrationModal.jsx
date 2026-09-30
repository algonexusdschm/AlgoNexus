import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Ticket, Users, AlertCircle, ArrowRight, Loader2, 
  QrCode, Building2, CreditCard, Copy, Check, Upload, Smartphone, ExternalLink 
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
  const [paymentTab, setPaymentTab] = useState('upi'); // 'upi', 'netbanking', 'card', 'razorpay'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Payment settings from context
  const settings = paymentSettings;

  // UPI and Net Banking fields
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
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
    track: EVENT_TRACKS[0].name,
    teamName: '',
    member2: '',
    member3: '',
    member4: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetch('/api/payment-settings')
        .then(res => res.json())
        .then(data => {
          if (data && data.upiId) {
            setSettings(data);
          }
        })
        .catch(err => console.error('Error fetching settings:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return 'Please enter your full name';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid email address';
    if (!formData.phone.trim() || formData.phone.length < 10) return 'Please enter a valid 10-digit phone number';
    if (!formData.college.trim()) return 'Please enter your college/institution name';
    if (selectedTier.type === 'team' && !formData.teamName.trim()) {
      return 'Please enter your team/squad name for the hackathon';
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
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(settings.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Screenshot size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.payeeName)}&am=${selectedTier.price}&cu=INR&tn=AlgoNexus-${encodeURIComponent(formData.fullName || 'Pass')}`;

  // Complete Payment Verification
  const completePayment = async (method, additionalData = {}) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const generatedTicketId = `ALGO26-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const payload = {
        razorpay_order_id: `ORD_${Date.now()}`,
        razorpay_payment_id: additionalData.utr || `PAY_${Date.now()}`,
        registrationData: {
          ...formData,
          amount: selectedTier.price,
          passType: selectedTier.name
        },
        paymentMethod: method,
        utrNumber: additionalData.utr || utrNumber,
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
          ...formData
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
        console.warn('API sync warning, using local ticket generation:', e);
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

  // Copy helpers
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

  // Handle Net Banking Submit
  const handleNetBankingSubmit = (e) => {
    e.preventDefault();
    if (!netBankingUtr.trim()) {
      setErrorMessage('Please enter the IMPS / NEFT / UTR reference number from your transfer');
      return;
    }
    completePayment('NET_BANKING', { 
      bank: selectedBank, 
      utr: netBankingUtr.trim(), 
      screenshot: screenshotPreview 
    });
  };

  // Handle UPI Verification Submission
  const handleUpiSubmit = (e) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      setErrorMessage('Please enter the 12-digit UPI UTR / Transaction Reference ID from your GPay / PhonePe payment receipt');
      return;
    }
    completePayment('UPI_QR', { utr: utrNumber.trim(), screenshot: screenshotPreview });
  };

  // Auto-fill test helper
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
          attendeeName: formData.fullName,
          email: formData.email,
          phone: formData.phone
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
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone
          },
          theme: { color: '#06b6d4' },
          modal: { ondismiss: () => setLoading(false) }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback simulation
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
                {step === 1 ? 'Phase 1: Attendee Details' : 'Phase 2: Payment & Pass Verification'}
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
              className="p-2 bg-mc-card border border-mc-border text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-mc-redstone/10 border border-mc-redstone/40 text-mc-redstone text-xs flex items-center gap-2 shrink-0 font-mono">
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
                      onClick={() => setSelectedTier(tier)}
                      className={`p-3 text-left border transition-all ${
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
                  <label className="block text-xs text-slate-300 mb-1">Full Name *</label>
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
                  <label className="block text-xs text-slate-300 mb-1">Email Address *</label>
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
                  <label className="block text-xs text-slate-300 mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">College / University Name *</label>
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
                <label className="block text-xs text-slate-300 mb-1">Preferred Competition Track</label>
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
                <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    <Users className="w-4 h-4" />
                    <span>Hackathon Squad Details</span>
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      name="member2"
                      value={formData.member2}
                      onChange={handleChange}
                      placeholder="Member 2 Name"
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                    <input
                      type="text"
                      name="member3"
                      value={formData.member3}
                      onChange={handleChange}
                      placeholder="Member 3 (Optional)"
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                    <input
                      type="text"
                      name="member4"
                      value={formData.member4}
                      onChange={handleChange}
                      placeholder="Member 4 (Optional)"
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Next Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:opacity-95"
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
                  onClick={() => setPaymentTab('upi')}
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
                  onClick={() => setPaymentTab('netbanking')}
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
                  onClick={() => setPaymentTab('card')}
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
                          <span className="font-mono text-xs font-bold text-white flex-1 truncate">{settings.upiId}</span>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-semibold flex items-center gap-1"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
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
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Google Pay</span>
                          </a>
                          <a
                            href={upiIntentUrl}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5"
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
                          onChange={(e) => setUtrNumber(e.target.value)}
                          maxLength={18}
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
                          onClick={() => setStep(1)}
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
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 flex items-center gap-1 border border-slate-700"
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
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 flex items-center gap-1 border border-slate-700"
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
                          onChange={(e) => setNetBankingUtr(e.target.value)}
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
                          onClick={() => setStep(1)}
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
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8892"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      maxLength={19}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        maxLength={5}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        maxLength={4}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Name on card"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => completePayment('CARD', { cardLast4: cardData.number.slice(-4) || '8892' })}
                      disabled={loading}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Pay ₹{selectedTier.price} via Card</span>}
                    </button>
                  </div>
                </div>
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
