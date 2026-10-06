import React, { useState, useEffect } from 'react';
import { 
  X, Users, IndianRupee, ShieldCheck, Download, Search, Check, RefreshCw, 
  QrCode, Settings, Upload, Image, ExternalLink, Eye, AlertCircle, Save 
} from 'lucide-react';

export default function AdminDashboard({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('registrations'); // 'registrations', 'payment-settings'
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [manualTicketInput, setManualTicketInput] = useState('');
  const [scanMessage, setScanMessage] = useState(null);

  // Settings State
  const [settings, setSettings] = useState({
    upiId: '8010086323@okbizaxis',
    payeeName: 'Department of Data Science, Smt. Chandibai Himathmal Mansukhani College',
    qrCodeImage: '',
    instructions: 'Scan using any UPI App (Google Pay, PhonePe, Paytm, BHIM). Enter 12-digit UTR and attach screenshot.'
  });
  const [qrFilePreview, setQrFilePreview] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Screenshot Lightbox Modal
  const [viewScreenshotModal, setViewScreenshotModal] = useState(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/registrations');
      const data = await res.json();
      setRegistrations(data.registrations || []);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/payment-settings');
      const data = await res.json();
      if (data && data.upiId) {
        setSettings(data);
        if (data.qrCodeImage) {
          setQrFilePreview(data.qrCodeImage);
        }
      }
    } catch (err) {
      console.error('Error fetching payment settings:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRegistrations();
      fetchSettings();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Gate Check-in Action
  const handleCheckIn = async (ticketId) => {
    try {
      const res = await fetch(`/api/check-in/${ticketId}`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setScanMessage({ success: true, text: `Ticket ${ticketId} Checked In Successfully!` });
        fetchRegistrations();
      } else {
        setScanMessage({ success: false, text: data.error || 'Check-in failed' });
      }
    } catch (err) {
      setScanMessage({ success: false, text: 'Check-in request failed' });
    }
  };

  // QR Code Image Upload Handler for Organizers
  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('QR code file must be under 8MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrFilePreview(reader.result);
        setSettings(prev => ({ ...prev, qrCodeImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Payment Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok && data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      setLoading(false);
      alert('Failed to save payment settings');
    }
  };

  // CSV Export
  const exportToCSV = () => {
    if (registrations.length === 0) return;
    const headers = ['Ticket ID', 'Full Name', 'Email', 'Phone', 'College', 'Branch', 'Year', 'Pass Type', 'Track', 'Payment Method', 'UTR Number', 'Amount', 'Checked In'];
    const rows = registrations.map(r => [
      r.ticketId,
      `"${r.attendee.fullName}"`,
      `"${r.attendee.email}"`,
      `"${r.attendee.phone}"`,
      `"${r.attendee.college}"`,
      `"${r.attendee.branch}"`,
      `"${r.attendee.year}"`,
      `"${r.passType}"`,
      `"${r.attendee.track}"`,
      r.paymentMethod || 'UPI',
      `"${r.utrNumber || r.paymentId || ''}"`,
      r.amountPaid,
      r.checkedIn ? 'YES' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `techastra_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalRevenue = registrations.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const totalCheckedIn = registrations.filter(r => r.checkedIn).length;

  const filteredRegistrations = registrations.filter(r => {
    const q = search.toLowerCase();
    return (
      r.ticketId.toLowerCase().includes(q) ||
      r.attendee.fullName.toLowerCase().includes(q) ||
      r.attendee.email.toLowerCase().includes(q) ||
      r.attendee.college.toLowerCase().includes(q) ||
      (r.utrNumber && r.utrNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0a0f24] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">TechAstra Organizer & Gate Portal</h3>
              <p className="text-xs text-slate-400">Live registrations, UTR verification, GPay QR upload & gate desk</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { fetchRegistrations(); fetchSettings(); }}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Portal Tabs */}
        <div className="flex border-b border-white/5 bg-slate-950/70 px-6 gap-6 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`py-3.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'registrations'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Registrations & Gate Check-In ({registrations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payment-settings')}
            className={`py-3.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'payment-settings'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>Upload GPay / PhonePe QR & UPI Settings</span>
          </button>
        </div>

        {/* Tab 1: Registrations & Gate Portal */}
        {activeTab === 'registrations' && (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <div className="text-xs text-slate-400">Gate Check-in Status</div>
                <div className="text-3xl font-extrabold text-cyan-400 mt-1 font-mono">
                  {totalCheckedIn} / {registrations.length}
                </div>
              </div>
            </div>

            {/* Quick Gate Scanner Desk */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/20 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider shrink-0">
                <QrCode className="w-4 h-4" />
                <span>Gate Desk Check-in Scanner:</span>
              </div>
              <input
                type="text"
                placeholder="Enter or scan Ticket ID (e.g. TECH26-XXXX)"
                value={manualTicketInput}
                onChange={(e) => setManualTicketInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
              />
              <button
                onClick={() => {
                  if (manualTicketInput) {
                    handleCheckIn(manualTicketInput.trim());
                    setManualTicketInput('');
                  }
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs shrink-0 hover:bg-cyan-400 transition-colors"
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
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search attendee, ticket ID, UTR, college..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500"
                />
              </div>

              <button
                onClick={exportToCSV}
                disabled={registrations.length === 0}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 border border-slate-700 disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV for Printing / Attendance</span>
              </button>
            </div>

            {/* Registrations Table with UTR & Screenshot */}
            <div className="border border-white/5 rounded-2xl overflow-hidden bg-slate-950/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-mono">
                    <tr>
                      <th className="p-3">Ticket ID</th>
                      <th className="p-3">Attendee</th>
                      <th className="p-3">College & Track</th>
                      <th className="p-3">Pass & Method</th>
                      <th className="p-3">Payment / UTR</th>
                      <th className="p-3">Receipt</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="p-8 text-center text-slate-500">
                          No registrations found yet.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.ticketId} className="hover:bg-slate-900/40">
                          <td className="p-3 font-mono font-bold text-cyan-400">{reg.ticketId}</td>
                          <td className="p-3">
                            <div className="font-semibold text-white">{reg.attendee.fullName}</div>
                            <div className="text-[11px] text-slate-400">{reg.attendee.phone}</div>
                          </td>
                          <td className="p-3">
                            <div>{reg.attendee.college}</div>
                            <div className="text-[10px] text-cyan-300">{reg.attendee.track}</div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold">
                              {reg.passType}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">₹{reg.amountPaid} • {reg.paymentMethod || 'UPI'}</div>
                          </td>
                          <td className="p-3 font-mono text-[11px]">
                            {reg.utrNumber ? (
                              <div>
                                <span className="text-slate-400 block text-[9px] uppercase">UTR:</span>
                                <span className="text-emerald-400 font-bold">{reg.utrNumber}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500">{reg.paymentId}</span>
                            )}
                          </td>
                          <td className="p-3">
                            {reg.paymentScreenshot ? (
                              <button
                                onClick={() => setViewScreenshotModal(reg.paymentScreenshot)}
                                className="px-2 py-1 rounded bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 border border-indigo-500/40 text-[10px] font-semibold flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Receipt</span>
                              </button>
                            ) : (
                              <span className="text-slate-600 text-[10px]">No image</span>
                            )}
                          </td>
                          <td className="p-3">
                            {reg.checkedIn ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                Checked In
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                                Awaiting
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {!reg.checkedIn && (
                              <button
                                onClick={() => handleCheckIn(reg.ticketId)}
                                className="px-2.5 py-1 rounded bg-cyan-600/30 text-cyan-300 hover:bg-cyan-600/60 border border-cyan-500/40 text-[10px] font-semibold"
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

        {/* Tab 2: Upload College GPay QR Code & Settings */}
        {activeTab === 'payment-settings' && (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            <div className="max-w-2xl mx-auto space-y-6">
              
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-300">
                <h4 className="font-bold text-cyan-300 text-sm mb-1 flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  <span>College UPI & GPay QR Code Configuration</span>
                </h4>
                <p className="leading-relaxed">
                  Upload your official College Festival Google Pay / PhonePe QR code image below. When participants click <strong>Register</strong> and proceed to payment, your uploaded QR code will be displayed directly for instant scanning!
                </p>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Payment & QR settings updated successfully! New registrants will see this QR immediately.</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* QR Code Upload Box */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
                    College Festival GPay / PhonePe QR Code Image *
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    
                    {/* Live Preview */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-slate-900 border-2 border-dashed border-cyan-500/60 min-h-[200px]">
                      {qrFilePreview ? (
                        <>
                          <img
                            src={qrFilePreview}
                            alt="Uploaded College GPay QR Code"
                            className="max-h-44 object-contain rounded-lg shadow-md"
                          />
                          <span className="text-[10px] text-emerald-700 font-bold mt-2">Active QR Code Preview ✓</span>
                        </>
                      ) : (
                        <div className="text-center p-4">
                          <Image className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                          <p className="text-xs text-slate-600 font-medium">No custom QR image uploaded</p>
                          <p className="text-[10px] text-slate-400 mt-1">Default dynamic UPI QR is currently active</p>
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="space-y-3">
                      <label className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900 border border-slate-700 hover:border-cyan-400 cursor-pointer text-center transition-all group">
                        <Upload className="w-8 h-8 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white">Click to Select QR Image</span>
                        <span className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, JPEG (Max 8MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleQrUpload}
                          className="hidden"
                        />
                      </label>

                      {qrFilePreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setQrFilePreview('');
                            setSettings(prev => ({ ...prev, qrCodeImage: '' }));
                          }}
                          className="w-full py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-semibold"
                        >
                          Remove Custom QR & Reset
                        </button>
                      )}
                    </div>

                  </div>
                </div>

                {/* College UPI ID Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1">
                    Official College / Fest UPI ID *
                  </label>
                  <input
                    type="text"
                    value={settings.upiId}
                    onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                    placeholder="e.g. 8010086323@okbizaxis or collegename@upi"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    This UPI ID is copied by students if they prefer manual UPI transfer.
                  </span>
                </div>

                {/* Payee / College Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1">
                    Payee / Festival Account Name *
                  </label>
                  <input
                    type="text"
                    value={settings.payeeName}
                    onChange={(e) => setSettings({ ...settings, payeeName: e.target.value })}
                    placeholder="e.g. TechAstra 2026 Organizing Committee"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1">
                    Participant Payment Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={settings.instructions}
                    onChange={(e) => setSettings({ ...settings, instructions: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:opacity-95 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Payment & QR Settings</span>
                  </button>
                </div>

              </form>

            </div>

          </div>
        )}

        {/* Screenshot Lightbox Modal */}
        {viewScreenshotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="relative max-w-lg w-full bg-slate-900 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
              <button
                onClick={() => setViewScreenshotModal(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800 text-white hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
              <h4 className="text-xs font-bold uppercase text-slate-300 mb-3">Participant Payment Receipt Screenshot</h4>
              <img
                src={viewScreenshotModal}
                alt="Payment Receipt Screenshot"
                className="max-h-[70vh] object-contain rounded-lg border border-slate-800"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
