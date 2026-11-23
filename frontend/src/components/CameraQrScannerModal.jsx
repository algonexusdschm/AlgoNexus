import React, { useEffect, useState, useRef } from 'react';
import { X, Camera, SwitchCamera, AlertCircle, Upload, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function CameraQrScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    let html5QrCode = null;
    let isMounted = true;

    const initScanner = async () => {
      setIsStarting(true);
      setErrorMsg('');

      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          if (isMounted) setCameras(devices);
          // Prefer back / environment camera if available
          const backCam = devices.find(d => 
            d.label.toLowerCase().includes('back') || 
            d.label.toLowerCase().includes('environment') || 
            d.label.toLowerCase().includes('rear')
          );
          const defaultCamId = backCam ? backCam.id : devices[0].id;
          if (isMounted) setSelectedCameraId(defaultCamId);

          html5QrCode = new Html5Qrcode("qr-camera-stream");
          scannerRef.current = html5QrCode;

          await html5QrCode.start(
            defaultCamId,
            {
              fps: 15,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0
            },
            (decodedText) => {
              if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch(() => {}).finally(() => {
                  if (isMounted) {
                    setIsScanning(false);
                    onScanSuccess(decodedText);
                  }
                });
              } else {
                if (isMounted) onScanSuccess(decodedText);
              }
            },
            () => {
              // Frame scan attempt (ignore per-frame miss)
            }
          );

          if (isMounted) {
            setIsScanning(true);
            setIsStarting(false);
          }
        } else {
          if (isMounted) {
            setErrorMsg('No camera detected on this device. You can upload a QR image or enter the Pass Number manually.');
            setIsStarting(false);
          }
        }
      } catch (err) {
        console.warn('Camera scanner init error:', err);
        if (isMounted) {
          setErrorMsg(
            err.name === 'NotAllowedError' 
              ? 'Camera permission denied. Please allow camera access in your browser settings.' 
              : 'Unable to start camera. Please ensure no other app is using it, or upload a QR image below.'
          );
          setIsStarting(false);
        }
      }
    };

    // Small delay to allow DOM element to render
    const timer = setTimeout(initScanner, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().then(() => {
            scannerRef.current?.clear();
          }).catch(() => {});
        } else {
          try { scannerRef.current?.clear(); } catch (e) {}
        }
        scannerRef.current = null;
      }
    };
  }, [isOpen]);

  // Switch camera device
  const handleSwitchCamera = async (newDeviceId) => {
    setSelectedCameraId(newDeviceId);
    if (!scannerRef.current) return;

    try {
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
      await scannerRef.current.start(
        newDeviceId,
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          if (scannerRef.current?.isScanning) {
            scannerRef.current.stop().catch(() => {}).finally(() => {
              onScanSuccess(decodedText);
            });
          }
        },
        () => {}
      );
      setIsScanning(true);
    } catch (err) {
      console.warn('Error switching camera:', err);
      setErrorMsg('Could not switch to selected camera.');
    }
  };

  // Handle scanning from uploaded image file
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setErrorMsg('');
      let html5QrCode = scannerRef.current;
      if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("qr-camera-stream");
        scannerRef.current = html5QrCode;
      }

      if (html5QrCode.isScanning) {
        await html5QrCode.stop();
        setIsScanning(false);
      }

      const decodedText = await html5QrCode.scanFile(file, true);
      if (decodedText) {
        onScanSuccess(decodedText);
      }
    } catch (err) {
      console.warn('File QR scan error:', err);
      setErrorMsg('No QR code detected in this image. Please upload a clear photo of the pass QR code.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center border border-blue-200">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-chakra font-bold text-slate-900 text-sm uppercase tracking-wide">
                Gate Entry QR Scanner
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Point camera at attendee's delegate pass
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all border border-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Viewport */}
        <div className="p-5 flex flex-col items-center">
          
          {errorMsg && (
            <div className="w-full mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Camera Frame */}
          <div className="relative w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden bg-slate-950 border-2 border-blue-500/50 shadow-inner flex items-center justify-center">
            
            {/* Viewport for html5-qrcode */}
            <div id="qr-camera-stream" className="w-full h-full object-cover"></div>

            {/* Loading indicator */}
            {isStarting && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 text-white gap-2 font-mono text-xs z-10">
                <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                <span>Starting Camera...</span>
              </div>
            )}

            {/* Target overlay guide */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-56 border-2 border-dashed border-blue-400/90 rounded-2xl relative shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
                  {/* Scanning line animation */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-pulse absolute top-1/2 -translate-y-1/2 shadow-[0_0_8px_#38bdf8]" />
                </div>
              </div>
            )}

          </div>

          <p className="text-[11px] text-slate-500 font-mono text-center mt-3">
            Align the QR code within the frame to verify attendance instantly.
          </p>

          {/* Camera Switcher (if multiple cameras available) */}
          {cameras.length > 1 && (
            <div className="mt-3 flex items-center gap-2 text-xs font-mono w-full justify-center">
              <SwitchCamera className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedCameraId}
                onChange={(e) => handleSwitchCamera(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono"
              >
                {cameras.map(cam => (
                  <option key={cam.id} value={cam.id}>
                    {cam.label || `Camera ${cam.id.slice(0, 5)}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Upload QR Image Fallback */}
          <div className="mt-4 pt-4 border-t border-slate-100 w-full flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">Camera not working?</span>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>Upload Pass Screenshot</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
