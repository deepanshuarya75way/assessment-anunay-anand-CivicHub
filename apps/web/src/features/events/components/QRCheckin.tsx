import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRCheckinProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: any) => void;
}

export default function QRCheckin({ onScanSuccess, onScanFailure }: QRCheckinProps) {
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    setScanner(html5QrcodeScanner);

    html5QrcodeScanner.render((decodedText) => {
      // Pause on success to prevent multiple scans
      html5QrcodeScanner.pause(true);
      onScanSuccess(decodedText);
      // Let the parent component resume when ready
    }, (error) => {
      if (onScanFailure) {
        onScanFailure(error);
      }
    });

    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [onScanSuccess, onScanFailure]);

  const resumeScan = () => {
    if (scanner) {
      scanner.resume();
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">Scan QR Code</h3>
      
      <div className="relative overflow-hidden rounded-2xl bg-black aspect-square flex items-center justify-center border-2 border-dashed border-white/20 mb-6">
        <div id="qr-reader" className="w-full h-full text-white"></div>
      </div>
      
      <p className="text-slate-400 text-sm text-center mb-6">
        Position the QR code within the frame to automatically scan and check in the participant.
      </p>

      <button 
        onClick={resumeScan}
        className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
      >
        Resume Scanning
      </button>

      {/* Basic styles to override html5-qrcode defaults */}
      <style>{`
        #qr-reader {
          border: none !important;
          border-radius: 1rem;
        }
        #qr-reader__dashboard_section_csr span {
          color: white;
        }
        #qr-reader__dashboard_section_swaplink {
          color: #a855f7;
          text-decoration: none;
        }
        #qr-reader button {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
