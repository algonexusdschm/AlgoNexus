import React, { useState } from 'react';
import { X, QrCode, Building2, CreditCard, ShieldCheck, Copy, Check, Upload, ArrowRight, Loader2, Smartphone, AlertCircle, ExternalLink, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useEvent } from '../context/EventContext';

export default function PaymentGatewayModal({
  isOpen,
  onClose,
  amount,
  passType,
  registrationData,
  onPaymentSuccess
}) {
  const { paymentSettings, addRegistration } = useEvent();
  const [activeTab, setActiveTab] = useState('upi'); // 'upi', 'netbanking', 'card', 'razorpay'
  const settings = paymentSettings || {
    upiId: '8010086323@fam',
    payeeName: 'Club Data Decoder, Department of Data Science, Smt. Chandibai Himathmal Mansukhani College',
    qrCodeImage: 'https://vcswkusqdkyhyanytjlc.supabase.co/storage/v1/object/public/organizer-assets/qr-codes/1790917868549-hyt2j0.png',
    instructions: 'Scan using any UPI App (Google Pay, PhonePe, Paytm, BHIM). Enter 12-digit UTR and attach screenshot.'
  };

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Handle Copy UPI ID
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(settings.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Screenshot Upload
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
        setScreenshotFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // UPI Intent URL
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.payeeName)}&am=${amount}&cu=INR&tn=TechAstra-${encodeURIComponent(registrationData.fullName || 'Pass')}`;

  // Complete Payment Verification
  const completePayment = async (method, additionalData = {}) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const isGatewayPaid = Boolean(additionalData.isGatewayPaid);
      const paymentStatus = isGatewayPaid ? 'PAID' : 'PENDING_VERIFICATION';

      const payload = {
        razorpay_order_id: `ORD_${Date.now()}`,
        razorpay_payment_id: additionalData.utr || `PAY_${Date.now()}`,
        registrationData: {
          ...registrationData,
          amount: amount,
          passType: passType
        },
        paymentMethod: method,
        paymentStatus,
        utrNumber: additionalData.utr || utrNumber,
        paymentScreenshot: additionalData.screenshot || screenshotPreview,
        bankName: additionalData.bank || selectedBank,
        isSimulated: true
      };

      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        const ticketResult = data.ticket || {
          ticketId: `TECH26-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          orderId: payload.razorpay_order_id,
          paymentId: payload.razorpay_payment_id,
          paymentStatus,
          paymentMethod: method,
          utrNumber: payload.utrNumber,
          paymentScreenshot: payload.paymentScreenshot,
          bankName: payload.bankName,
          verifiedAt: isGatewayPaid ? new Date().toISOString() : null,
          submittedAt: new Date().toISOString(),
          amountPaid: amount,
          passType: passType,
          attendee: payload.registrationData,
          checkedIn: false
        };

        if (addRegistration) {
          addRegistration(ticketResult);
        }
        onPaymentSuccess(ticketResult);
        onClose();
      } else {
        setErrorMessage(data.error || 'Payment verification failed');
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage('Could not verify payment with server');
    }
  };

  // Handle UPI Submission
  const handleUpiSubmit = (e) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      setErrorMessage('Please enter the 12-digit UPI UTR / Transaction Reference ID from your payment receipt');
      return;
    }
    completePayment('UPI_QR', { utr: utrNumber.trim(), screenshot: screenshotPreview });
  };

  // Demo auto-fill helper for test user
  const handleAutoFillUpi = () => {
    const randomUtr = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setUtrNumber(randomUtr);
    completePayment('UPI_QR', { utr: randomUtr });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0a0f24] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-[#101736] to-slate-900 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Payment Checkout</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {passType}
                </span>
              </div>
              <p className="text-xs text-slate-400">Payee: {settings.payeeName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Payable</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">₹{amount}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 border-b border-white/5 bg-slate-950/60 shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('upi')}
            className={`py-3.5 flex items-center justify-center gap-2 transition-all border-b-2 ${
              activeTab === 'upi'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>UPI & QR Code</span>
          </button>

          <button
            onClick={() => setActiveTab('netbanking')}
            className={`py-3.5 flex items-center justify-center gap-2 transition-all border-b-2 ${
              activeTab === 'netbanking'
                ? 'border-indigo-400 text-indigo-300 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Net Banking</span>
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`py-3.5 flex items-center justify-center gap-2 transition-all border-b-2 ${
              activeTab === 'card'
                ? 'border-pink-400 text-pink-300 bg-pink-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cards (Debit/Credit)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: UPI & QR CODE */}
          {activeTab === 'upi' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                
                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white text-slate-900 shadow-xl border border-cyan-500/40 relative">
                  
                  {/* Top Branding */}
                  <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-200">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">Scan & Pay via UPI</span>
                    <span className="text-xs font-mono font-bold text-emerald-600">₹{amount}</span>
                  </div>

                  {/* QR Image: Either custom uploaded organizer QR or dynamic SVG */}
                  <div className="relative p-2 bg-slate-50 rounded-xl border border-slate-200">
                    {settings.qrCodeImage ? (
                      <img
                        src={settings.qrCodeImage}
                        alt="College GPay QR Code"
                        className="w-44 h-44 object-contain rounded-lg"
                      />
                    ) : (
                      <QRCodeSVG
                        value={upiIntentUrl}
                        size={176}
                        level="H"
                        includeMargin={false}
                      />
                    )}
                  </div>

                  {/* Accepted UPI Apps Footer */}
                  <div className="mt-3 text-center">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Google Pay • PhonePe • Paytm • BHIM
                    </div>
                  </div>
                </div>

                {/* UPI Details & Mobile Intent */}
                <div className="space-y-4">
                  
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Official College UPI ID
                    </label>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-700">
                      <span className="font-mono text-sm font-bold text-white flex-1 truncate">{settings.upiId}</span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Direct Mobile App Intent Links */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Or Open Directly in UPI App (Mobile):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={upiIntentUrl}
                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Google Pay</span>
                      </a>
                      <a
                        href={upiIntentUrl}
                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                        <span>PhonePe / Paytm</span>
                      </a>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-slate-300">
                    💡 <strong>Instructions:</strong> Scan the QR or send ₹{amount} to the UPI ID above. Note down the 12-digit UTR / Reference number from your payment receipt.
                  </div>
                </div>

              </div>

              {/* UTR and Screenshot Submission Form */}
              <form onSubmit={handleUpiSubmit} className="pt-4 border-t border-white/5 space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">Found in your Google Pay / PhonePe transaction details</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Attach Payment Screenshot (Optional)
                    </label>
                    <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs cursor-pointer hover:border-cyan-400 transition-colors">
                      <Upload className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="truncate">{screenshotPreview ? 'Screenshot Attached ✓' : 'Upload Screenshot (PNG/JPG)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="hidden"
                      />
                    </label>
                    {screenshotPreview && (
                      <span className="text-[10px] text-emerald-400 block mt-1">Screenshot preview ready for verification</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAutoFillUpi}
                    className="text-xs text-cyan-400 hover:underline py-1"
                  >
                    ⚡ Test Click: Simulate Instant Verification
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying & Generating Ticket...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit UTR & Claim Pass</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* TAB 2: NET BANKING */}
          {activeTab === 'netbanking' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
                  Select Your Bank for Net Banking
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3 rounded-xl text-center text-xs font-bold border transition-all ${
                        selectedBank === bank
                          ? 'bg-indigo-600/30 border-cyan-400 text-white shadow-lg shadow-indigo-500/20'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Building2 className="w-5 h-5 mx-auto mb-1.5 text-cyan-400" />
                      <span className="line-clamp-1">{bank}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Selected Institution:</span>
                  <span className="font-bold text-white">{selectedBank}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Payable Amount:</span>
                  <span className="font-mono font-bold text-cyan-400">₹{amount}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => completePayment('NET_BANKING', { bank: selectedBank })}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:opacity-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to {selectedBank}...</span>
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4" />
                    <span>Pay ₹{amount} via {selectedBank}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 3: CARDS */}
          {activeTab === 'card' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Accepted Card Networks:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">VISA</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">MasterCard</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">RuPay</span>
                  </div>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  For participant security & PCI-DSS compliance, credit & debit card numbers are processed via 256-bit SSL encrypted checkout. No card details or CVVs are ever stored on this server.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Transaction Fee:</span>
                  <span className="text-emerald-400 font-semibold">₹0 (Waived for TechAstra)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Payable:</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">₹{amount}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encrypted 3D Secure / OTP Verification via your issuing bank</span>
              </div>

              <button
                type="button"
                onClick={() => completePayment('CARD', { isGatewayPaid: true })}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:opacity-95 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to 3D Secure Gateway...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{amount} with Card</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Footer Security Badges */}
        <div className="p-3 bg-slate-950 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 shrink-0 px-6">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Secured</span>
          </div>
          <span>TechAstra Official Payment Gateway</span>
        </div>

      </div>
    </div>
  );
}
