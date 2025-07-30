import { useState, useEffect, useRef } from 'react';
import { WiFiConfig, QRTemplate } from '@/types/wifi';
import { PrintSize } from '@/types/size';
import { generateQRCode } from '@/lib/qrGenerator';
import { QRCustomizer } from '@/components/QRCustomizer';
import { AdInterstitial } from '@/components/AdInterstitial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Eye, FileImage, FileText } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface QRPreviewProps {
  config: WiFiConfig;
  template: QRTemplate | null;
  printSize: PrintSize | null;
  onDownload: (imageUrl: string) => void;
  onShare: (imageUrl?: string) => void;
}

export const QRPreview = ({ config, template, printSize, onDownload, onShare }: QRPreviewProps) => {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [additionalText, setAdditionalText] = useState('');
  const [selectedFont, setSelectedFont] = useState('inter');
  const [showAdInterstitial, setShowAdInterstitial] = useState(false);
  const [pendingAction, setPendingAction] = useState<'download' | 'export' | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    if (!template || !config.ssid || !printSize) return;
    
    setIsGenerating(true);
    try {
      const qrDataUrl = await generateQRCode(config, template);
      setQrImage(qrDataUrl);
      
      // Draw on canvas for custom styling
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Set canvas size based on print size
          canvas.width = printSize.width;
          canvas.height = printSize.height;
          
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Set background
          ctx.fillStyle = template.backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Load and draw QR code
          const img = new Image();
          img.onload = () => {
            const qrSize = Math.min(canvas.width, canvas.height) * 0.6;
            const x = (canvas.width - qrSize) / 2;
            const y = (canvas.height - qrSize) / 2;
            
            ctx.drawImage(img, x, y, qrSize, qrSize);
            
            // Add business name if provided
            if (businessName) {
              ctx.fillStyle = template.textColor;
              ctx.font = `bold ${Math.max(16, canvas.width / 25)}px ${selectedFont}`;
              ctx.textAlign = 'center';
              ctx.fillText(businessName, canvas.width / 2, y - 20);
            }
            
            // Add additional text if provided
            if (additionalText) {
              ctx.fillStyle = template.accentColor;
              ctx.font = `${Math.max(14, canvas.width / 30)}px ${selectedFont}`;
              ctx.fillText(additionalText, canvas.width / 2, y + qrSize + 30);
            }
          };
          img.src = qrDataUrl;
        }
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('QR 코드 생성에 실패했습니다');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateQR();
  }, [config, template, printSize, businessName, additionalText, selectedFont]);

  const handleDownload = () => {
    setPendingAction('download');
    setShowAdInterstitial(true);
  };

  const handlePDFExport = () => {
    setPendingAction('export');
    setShowAdInterstitial(true);
  };

  const handleAdComplete = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (pendingAction === 'download') {
      const link = document.createElement('a');
      link.download = `${businessName || config.ssid || 'WiFi'}-QR.png`;
      link.href = canvas.toDataURL();
      link.click();
      onDownload(canvas.toDataURL());
      toast.success('QR 코드가 다운로드되었습니다!');
    } else if (pendingAction === 'export') {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      
      // Calculate dimensions to fit the page while maintaining aspect ratio
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgAspectRatio = canvas.width / canvas.height;
      
      let imgWidth = pageWidth - 40; // 20mm margin on each side
      let imgHeight = imgWidth / imgAspectRatio;
      
      if (imgHeight > pageHeight - 40) {
        imgHeight = pageHeight - 40;
        imgWidth = imgHeight * imgAspectRatio;
      }
      
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`${businessName || config.ssid || 'WiFi'}-QR.pdf`);
      toast.success('PDF가 다운로드되었습니다!');
    }

    setPendingAction(null);
  };

  return (
    <div className="space-y-4">
      <QRCustomizer 
        businessName={businessName}
        onBusinessNameChange={setBusinessName}
        additionalText={additionalText}
        onAdditionalTextChange={setAdditionalText}
        selectedFont={selectedFont}
        onFontChange={setSelectedFont}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye size={20} className="text-primary" />
            미리보기
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative bg-white rounded-lg p-4 shadow-lg border-2 border-gray-200">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto rounded"
                style={{ maxWidth: '400px', maxHeight: '400px' }}
              />
            </div>
            
            {!printSize && (
              <div className="text-center text-muted-foreground">
                <p>먼저 인쇄 크기를 선택해주세요</p>
              </div>
            )}
            
            {printSize && !template && (
              <div className="text-center text-muted-foreground">
                <p>템플릿을 선택해주세요</p>
              </div>
            )}
            
            {!qrImage && !isGenerating && template && printSize && (
              <div className="text-center text-muted-foreground">
                <p>WiFi 정보를 입력하면</p>
                <p>QR 코드 미리보기가 표시됩니다</p>
              </div>
            )}
            
            {isGenerating && (
              <div className="text-center text-muted-foreground">
                <p>QR 코드를 생성하는 중...</p>
              </div>
            )}

            {printSize && (
              <p className="text-xs text-muted-foreground text-center">
                인쇄 크기: {printSize.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button 
          onClick={handleDownload} 
          disabled={!qrImage || isGenerating}
          className="flex items-center gap-2"
        >
          <FileImage size={16} />
          PNG 다운로드
        </Button>
        
        <Button 
          onClick={handlePDFExport} 
          disabled={!qrImage || isGenerating}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileText size={16} />
          PDF 내보내기
        </Button>
        
        <Button 
          onClick={() => onShare(qrImage || undefined)} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <Share2 size={16} />
          공유하기
        </Button>
      </div>

      <AdInterstitial 
        isOpen={showAdInterstitial}
        onClose={() => {
          setShowAdInterstitial(false);
          setPendingAction(null);
        }}
        onComplete={handleAdComplete}
        title={pendingAction === 'download' ? 'PNG 다운로드 준비 중...' : 'PDF 내보내기 준비 중...'}
      />
    </div>
  );
};