import { useEffect, useRef, useState } from 'react';
import { WiFiConfig, QRTemplate } from '@/types/wifi';
import { generateWiFiQRString, generateQRCode, validateWiFiConfig } from '@/lib/qrGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Share2, QrCode, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface QRPreviewProps {
  config: WiFiConfig;
  template: QRTemplate | null;
  onDownload?: (dataUrl: string) => void;
  onShare?: () => void;
}

export const QRPreview = ({ config, template, onDownload, onShare }: QRPreviewProps) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [businessName, setBusinessName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const generateQR = async () => {
    if (!template) return;

    const errors = validateWiFiConfig(config);
    if (errors.length > 0) {
      toast.error('Please fix the form errors before generating QR code');
      return;
    }

    setIsGenerating(true);
    try {
      const wifiString = generateWiFiQRString(config);
      const dataUrl = await generateQRCode(wifiString, {
        color: {
          dark: template.textColor,
          light: 'transparent'
        },
        width: 400,
        margin: 2,
      });
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (config.ssid && template) {
      generateQR();
    }
  }, [config, template]);

  const handleDownloadPNG = async () => {
    if (!previewRef.current || !qrDataUrl) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        backgroundColor: template?.backgroundColor || '#ffffff',
        width: 800,
        height: 1000,
      });
      
      const link = document.createElement('a');
      link.download = `wifi-qr-${config.ssid.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success('QR code downloaded successfully!');
      onDownload?.(canvas.toDataURL());
    } catch (error) {
      console.error('Error downloading PNG:', error);
      toast.error('Failed to download QR code');
    }
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current || !qrDataUrl) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        backgroundColor: template?.backgroundColor || '#ffffff',
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 150;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const x = (210 - imgWidth) / 2; // Center on A4 page
      const y = 20;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`wifi-qr-${config.ssid.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  const handleShare = async () => {
    if (!qrDataUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `WiFi QR Code for ${config.ssid}`,
          text: `Scan this QR code to connect to ${config.ssid} WiFi network`,
          url: window.location.href,
        });
        onShare?.();
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
        onShare?.();
      } catch (error) {
        toast.error('Sharing not supported');
      }
    }
  };

  if (!template) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <QrCode size={48} className="mx-auto mb-2 opacity-50" />
            <p>Select a template to see preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <QrCode size={20} className="text-primary" />
          Preview & Download
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="businessName" className="text-sm font-medium">
            Business Name (Optional)
          </Label>
          <Input
            id="businessName"
            type="text"
            placeholder="Enter your business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full"
          />
        </div>

        {/* QR Code Preview */}
        <div 
          ref={previewRef}
          className="w-full max-w-md mx-auto p-8 rounded-lg shadow-lg"
          style={{ backgroundColor: template.backgroundColor }}
        >
          <div className="text-center space-y-6">
            {businessName && (
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Building2 size={24} style={{ color: template.accentColor }} />
                  <h2 
                    className="text-xl font-bold"
                    style={{ color: template.textColor }}
                  >
                    {businessName}
                  </h2>
                </div>
              </div>
            )}
            
            <div>
              <h3 
                className="text-lg font-semibold mb-2"
                style={{ color: template.textColor }}
              >
                Free WiFi
              </h3>
              <p 
                className="text-sm mb-4"
                style={{ color: template.textColor, opacity: 0.8 }}
              >
                Scan QR code to connect
              </p>
            </div>

            {qrDataUrl && (
              <div className="flex justify-center">
                <div 
                  className={`p-4 bg-white rounded-lg inline-block ${
                    template.borderStyle === 'solid' ? 'border-2' :
                    template.borderStyle === 'dashed' ? 'border-2 border-dashed' :
                    template.borderStyle === 'rounded' ? 'border border-opacity-30' : ''
                  }`}
                  style={{ 
                    borderColor: template.borderStyle !== 'none' ? template.accentColor : 'transparent'
                  }}
                >
                  <img 
                    src={qrDataUrl} 
                    alt="WiFi QR Code"
                    className="w-48 h-48 max-w-full"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <p 
                className="font-mono text-sm font-medium"
                style={{ color: template.accentColor }}
              >
                {config.ssid}
              </p>
              {config.security !== 'nopass' && (
                <p 
                  className="text-xs"
                  style={{ color: template.textColor, opacity: 0.6 }}
                >
                  Password: {config.password}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleDownloadPNG}
            className="flex-1"
            variant="gradient"
            disabled={!qrDataUrl || isGenerating}
          >
            <Download size={16} />
            Download PNG
          </Button>
          
          <Button 
            onClick={handleDownloadPDF}
            className="flex-1"
            variant="default"
            disabled={!qrDataUrl || isGenerating}
          >
            <Download size={16} />
            Download PDF
          </Button>
          
          <Button 
            onClick={handleShare}
            variant="outline"
            disabled={!qrDataUrl || isGenerating}
          >
            <Share2 size={16} />
            Share
          </Button>
        </div>

        {!qrDataUrl && !isGenerating && (
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Fill in the WiFi details to generate QR code</p>
          </div>
        )}

        {isGenerating && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-primary">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm">Generating QR code...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};