import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { useRef } from "react";

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableNumber: string;
  branchName: string;
}

// Simple QR code SVG component (in a real app, you'd use a QR code library)
const QRCodeSVG = ({ value, size = 200 }: { value: string; size?: number }) => {
  // This is a simplified QR code representation
  // In a real application, you would use a library like 'qrcode' or 'react-qr-code'
  return (
    <div 
      className="bg-white border-2 border-gray-300 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size - 20}
        height={size - 20}
        viewBox="0 0 100 100"
        className="text-black"
      >
        {/* Simplified QR pattern */}
        <rect x="0" y="0" width="20" height="20" fill="currentColor" />
        <rect x="80" y="0" width="20" height="20" fill="currentColor" />
        <rect x="0" y="80" width="20" height="20" fill="currentColor" />
        <rect x="10" y="10" width="80" height="5" fill="currentColor" />
        <rect x="10" y="20" width="5" height="60" fill="currentColor" />
        <rect x="85" y="20" width="5" height="60" fill="currentColor" />
        <rect x="20" y="85" width="60" height="5" fill="currentColor" />
        
        {/* Add some pattern dots */}
        {Array.from({ length: 10 }, (_, i) => (
          <rect
            key={i}
            x={25 + (i % 5) * 10}
            y={25 + Math.floor(i / 5) * 10}
            width="5"
            height="5"
            fill="currentColor"
          />
        ))}
        
        {/* Center pattern */}
        <rect x="40" y="40" width="20" height="20" fill="currentColor" />
        <rect x="45" y="45" width="10" height="10" fill="white" />
      </svg>
    </div>
  );
};

export default function QRCodeModal({ open, onOpenChange, tableNumber, branchName }: QRCodeModalProps) {
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (qrCodeRef.current) {
      // Create a canvas to convert the QR code to an image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = 300;
      
      canvas.width = size;
      canvas.height = size + 60; // Extra space for text
      
      if (ctx) {
        // White background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw QR code (simplified representation)
        ctx.fillStyle = 'black';
        ctx.fillRect(20, 20, 60, 60);
        ctx.fillRect(220, 20, 60, 60);
        ctx.fillRect(20, 220, 60, 60);
        
        // Add some QR pattern elements
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            if ((i + j) % 3 === 0) {
              ctx.fillRect(90 + i * 12, 90 + j * 12, 8, 8);
            }
          }
        }
        
        // Add text
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${tableNumber} - ${branchName}`, size / 2, size + 30);
        
        // Create download link
        const link = document.createElement('a');
        link.download = `${tableNumber.replace(/\s+/g, '_')}_QR_Code.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code - ${tableNumber}</title>
            <style>
              body {
                margin: 0;
                padding: 40px;
                display: flex;
                flex-direction: column;
                align-items: center;
                font-family: Arial, sans-serif;
              }
              .qr-container {
                text-align: center;
                margin-bottom: 20px;
              }
              .qr-title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #333;
              }
              .qr-subtitle {
                font-size: 16px;
                color: #666;
                margin-bottom: 30px;
              }
              .qr-code {
                border: 2px solid #ccc;
                display: inline-block;
                padding: 20px;
                background: white;
              }
              @media print {
                body { margin: 0; padding: 20px; }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="qr-title">${tableNumber}</div>
              <div class="qr-subtitle">${branchName}</div>
              <div class="qr-code">
                ${qrCodeRef.current?.innerHTML || ''}
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const qrValue = `table:${tableNumber.toLowerCase().replace(/\s+/g, '')}-${branchName.toLowerCase().replace(/\s+/g, '')}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="qr-code-modal">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900" data-testid="qr-modal-title">
            QR Code
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6">
          {/* Table Information */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1" data-testid="qr-table-number">
              {tableNumber}
            </h3>
            <p className="text-sm text-gray-600" data-testid="qr-branch-name">
              {branchName}
            </p>
          </div>

          {/* QR Code */}
          <div 
            ref={qrCodeRef}
            className="flex justify-center p-4 bg-gray-50 rounded-lg"
            data-testid="qr-code-display"
          >
            <QRCodeSVG value={qrValue} size={200} />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 w-full">
            <Button
              onClick={handleDownload}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              data-testid="button-download-qr"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              data-testid="button-print-qr"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Scan this QR code to access the menu and place orders for {tableNumber}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}