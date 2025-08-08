import { useState, useEffect, useRef } from 'react';
import { WiFiConfig, QRTemplate } from '@/types/wifi';
import { PrintSize } from '@/types/size';
import { QRCustomizer } from '@/components/QRCustomizer';
import { AdInterstitial } from '@/components/AdInterstitial';
import { QRCanvas, QRCanvasRef } from '@/components/QRCanvas';
import { useQRGeneration } from '@/hooks/useQRGeneration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, FileText, QrCode, Eye, Settings } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { computeLayout } from '@/lib/layoutEngine';

interface QRPreviewProps {
  config: WiFiConfig;
  template: QRTemplate | null;
  printSize: PrintSize | null;
  onDownload: (imageUrl: string) => void;
  onShare: (imageUrl?: string) => void;
}

export const QRPreview = ({ config, template, printSize, onDownload, onShare }: QRPreviewProps) => {
  const { qrImage, isGenerating, isQRGenerated, generateQR, resetQR } = useQRGeneration();
  const [businessName, setBusinessName] = useState('');
  const [additionalText, setAdditionalText] = useState('');
  const [otherText, setOtherText] = useState('');
  const [businessFont, setBusinessFont] = useState('inter');
  const [fontSize, setFontSize] = useState(18);
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('bold');
  const [showWifiInfo, setShowWifiInfo] = useState(false);
  const [wifiInfoFont, setWifiInfoFont] = useState('inter');
  const [showAdInterstitial, setShowAdInterstitial] = useState(false);
  const [pendingAction, setPendingAction] = useState<'download' | 'export' | 'generate' | null>(null);
  
  const canvasRef = useRef<QRCanvasRef>(null);

  useEffect(() => {
    resetQR();
  }, [config, template, printSize, businessName, additionalText, otherText, businessFont, fontSize, fontWeight, showWifiInfo, wifiInfoFont, resetQR]);

  // QR 생성 함수 - 훅에서 가져온 함수 사용
  const handleGenerateQR = async () => {
    if (!template || !config.ssid || !printSize) {
      toast.error('WiFi 정보와 템플릿, 인쇄 크기를 먼저 설정해주세요');
      return;
    }
    setPendingAction('generate');
    setShowAdInterstitial(true);
  };

  const handleDownload = () => {
    setPendingAction('download');
    setShowAdInterstitial(true);
  };

  const handlePDFExport = () => {
    setPendingAction('export');
    setShowAdInterstitial(true);
  };

  const handleAdComplete = async () => {
    if (pendingAction === 'generate') {
      await generateQR(config, template, printSize);
      setPendingAction(null);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // 항상 최신 레이아웃과 QR로 캔버스 렌더링 후 내보내기
    await canvas.renderToCanvas();

    if (pendingAction === 'download') {
      const dataUrl = canvas.getCanvasDataUrl();
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `${businessName || config.ssid || 'WiFi'}-QR.png`;
        link.href = dataUrl;
        link.click();
        onDownload(dataUrl);
        toast.success('QR 코드가 다운로드되었습니다!');
      }
    } else if (pendingAction === 'export') {
      const dataUrl = canvas.getCanvasDataUrl();
      if (dataUrl) {
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgAspectRatio = printSize ? printSize.width / printSize.height : 1;
        let imgWidth = pageWidth - 40;
        let imgHeight = imgWidth / imgAspectRatio;
        if (imgHeight > pageHeight - 40) {
          imgHeight = pageHeight - 40;
          imgWidth = imgHeight * imgAspectRatio;
        }
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;
        pdf.addImage(dataUrl, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save(`${businessName || config.ssid || 'WiFi'}-QR.pdf`);
        toast.success('PDF가 다운로드되었습니다!');
      }
    }

    setPendingAction(null);
  };

  // 레이아웃 계산 (프리뷰/캔버스 공용)
  const layoutElements = (() => {
    if (!template || !printSize) return [] as any[];
    return computeLayout(
      template,
      printSize,
      {
        businessName,
        additionalText,
        otherText,
        showWifiInfo,
        businessFont,
        wifiInfoFont,
      },
      config.ssid,
      config.password
    );
  })();

  // Helper for scale
  const scale = printSize ? Math.min(400, printSize.width) / printSize.width : 1;
  const qrElement = layoutElements.find((el) => el.id === 'qr');

  return (
    <div className="space-y-6">
      {/* Text Customization */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings size={20} />
            텍스트 커스터마이징
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <QRCustomizer
            businessName={businessName}
            onBusinessNameChange={setBusinessName}
            additionalText={additionalText}
            onAdditionalTextChange={setAdditionalText}
            otherText={otherText}
            onOtherTextChange={setOtherText}
            businessFont={businessFont}
            onBusinessFontChange={setBusinessFont}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            fontWeight={fontWeight}
            onFontWeightChange={setFontWeight}
            showWifiInfo={showWifiInfo}
            onShowWifiInfoChange={setShowWifiInfo}
            wifiInfoFont={wifiInfoFont}
            onWifiInfoFontChange={setWifiInfoFont}
            textPosition={null}
            onTextPositionChange={() => {}}
            wifiInfoPosition={null}
            onWifiInfoPositionChange={() => {}}
          />
          
          {/* QR Generation Button */}
          <div className="pt-3 border-t">
            <Button 
              onClick={handleGenerateQR} 
              disabled={!template || !config.ssid || !printSize || isGenerating}
              className="w-full h-10 text-sm font-medium"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent mr-2" />
                  QR 코드 생성 중...
                </>
              ) : (
                <>
                  <QrCode size={16} className="mr-2" />
                  {isQRGenerated ? 'QR 코드 다시 생성하기' : 'QR 코드 생성하기'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Eye size={14} />
            미리보기
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          {qrImage && printSize ? (
            <div className="space-y-3">
              {/* Preview Container */}
              <div 
                className="relative bg-white border-2 border-dashed border-gray-300 mx-auto overflow-hidden w-full max-w-full"
                style={{
                  width: '100%',
                  maxWidth: `min(100vw - 3rem, 400px)`,
                  height: `${Math.min(300, printSize.height * (Math.min(window.innerWidth - 48, 400) / printSize.width))}px`,
                  aspectRatio: `${printSize.width} / ${printSize.height}`
                }}
              >
                {/* Background */}
                <div 
                  className="absolute inset-0"
                  style={{ backgroundColor: template?.backgroundColor || '#ffffff' }}
                >
                  {/* AI 생성 배경 이미지 (비활성화되어도 안전) */}
                  {template?.aiGeneratedBackground && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ 
                        backgroundImage: `url(${template.aiGeneratedBackground})`,
                        filter: 'brightness(1.0) contrast(1.1)'
                      }}
                    />
                  )}
                </div>
                
                {/* QR Code - use computed layout */}
                {qrImage && qrElement && (
                  <div
                    className="absolute"
                    style={{
                      left: `${qrElement.x * scale}px`,
                      top: `${qrElement.y * scale}px`,
                      width: `${qrElement.width * scale}px`,
                      height: `${qrElement.height * scale}px`,
                      zIndex: 20
                    }}
                  >
                    <div 
                      className="w-full h-full p-2 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.98)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.08)'
                      }}
                    >
                      <img 
                        src={qrImage} 
                        alt="QR Code" 
                        className="w-full h-full object-contain"
                        draggable={false}
                      />
                    </div>
                  </div>
                )}
                
                {/* Text Elements */}
                {layoutElements.filter(el => el.type === 'text').map((element) => {
                  if (!element.textElement?.visible) return null;
                  
                  return (
                    <div
                      key={element.id}
                      style={{
                        position: 'absolute',
                        left: `${element.x * scale}px`,
                        top: `${element.y * scale}px`,
                        width: `${element.width * scale}px`,
                        height: `${element.height * scale}px`,
                        fontSize: `${element.textElement.fontSize * scale}px`,
                        fontFamily: template?.structure?.fontFamily || element.textElement.fontFamily,
                        fontWeight: element.textElement.fontWeight,
                        color: template?.structure?.colors?.text || element.textElement.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: template?.structure?.textAlign || 'center',
                        lineHeight: '1.2',
                        zIndex: 20,
                        background: 'transparent'
                      }}
                    >
                      {element.textElement.text}
                    </div>
                  );
                })}
              </div>
              
              {/* Download Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3">
                <Button 
                  onClick={handleDownload} 
                  disabled={!qrImage}
                  className="h-8 text-xs"
                >
                  <Download size={12} className="mr-1" />
                  PNG 다운로드
                </Button>
                
                <Button 
                  onClick={handlePDFExport} 
                  disabled={!qrImage}
                  variant="outline"
                  className="h-8 text-xs"
                >
                  <FileText size={12} className="mr-1" />
                  PDF 다운로드
                </Button>
                
                <Button 
                  onClick={() => onShare(qrImage || undefined)} 
                  disabled={!qrImage}
                  variant="outline"
                  className="h-8 text-xs"
                >
                  <Share2 size={12} className="mr-1" />
                  공유하기
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16 border-2 border-dashed border-muted rounded-lg">
              QR 코드를 먼저 생성해주세요
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden Canvas for Export */}
      <QRCanvas
        ref={canvasRef}
        template={template}
        printSize={printSize}
        elements={layoutElements as any}
        qrDataUrl={qrImage}
      />
      
      {/* Ad Interstitial */}
      <AdInterstitial 
        isOpen={showAdInterstitial}
        onClose={() => {
          setShowAdInterstitial(false);
          setPendingAction(null);
        }}
        onComplete={handleAdComplete}
        title="광고 보기"
      />
    </div>
  );
};