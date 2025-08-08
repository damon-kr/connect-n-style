import { useState, useEffect, useRef } from 'react';
import { WiFiConfig, QRTemplate } from '@/types/wifi';
import { PrintSize } from '@/types/size';
import { QRCustomizer } from '@/components/QRCustomizer';
import { DraggablePreview } from '@/components/DraggablePreview';
import { CPVModal } from '@/components/CPVModal';
import { AdInterstitial } from '@/components/AdInterstitial';
import { QRCanvas, QRCanvasRef } from '@/components/QRCanvas';
import { useQRGeneration } from '@/hooks/useQRGeneration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, FileText, QrCode, Eye, Settings, Edit3 } from 'lucide-react';
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
  const [showWifiInfo, setShowWifiInfo] = useState(false);
  const [showAdInterstitial, setShowAdInterstitial] = useState(false);
  const [pendingAction, setPendingAction] = useState<'download' | 'export' | 'generate' | null>(null);
  const [isDetailMode, setIsDetailMode] = useState(false);
  const [showCPVModal, setShowCPVModal] = useState(false);
  
  const canvasRef = useRef<QRCanvasRef>(null);

  // 요소별 스타일 상태
  const [elementStyles, setElementStyles] = useState([
    {
      id: 'business',
      name: '업체명',
      visible: true,
      fontSize: 28,
      fontFamily: 'Inter',
      fontWeight: 'bold' as const,
      color: '#1F2937',
      x: 50,
      y: 20,
      width: 85,
      height: 15,
      textAlign: 'center' as const,
    },
    {
      id: 'description',
      name: '추가설명',
      visible: true,
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: 'normal' as const,
      color: '#6B7280',
      x: 50,
      y: 85,
      width: 85,
      height: 10,
      textAlign: 'center' as const,
    },
    {
      id: 'other',
      name: '기타문구',
      visible: false,
      fontSize: 14,
      fontFamily: 'Inter',
      fontWeight: 'normal' as const,
      color: '#6B7280',
      x: 50,
      y: 95,
      width: 80,
      height: 8,
      textAlign: 'center' as const,
    },
    {
      id: 'qr',
      name: 'QR 코드',
      visible: true,
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: 'normal' as const,
      color: '#000000',
      x: 50,
      y: 50,
      width: 35,
      height: 35,
      textAlign: 'center' as const,
    },
    {
      id: 'wifi-ssid',
      name: 'WiFi ID',
      visible: true,
      fontSize: 18,
      fontFamily: 'Inter',
      fontWeight: 'bold' as const,
      color: '#1F2937',
      x: 50,
      y: 75,
      width: 85,
      height: 12,
      textAlign: 'center' as const,
    },
    {
      id: 'wifi-password',
      name: 'WiFi 비밀번호',
      visible: true,
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: 'normal' as const,
      color: '#6B7280',
      x: 50,
      y: 87,
      width: 85,
      height: 10,
      textAlign: 'center' as const,
    },
  ]);

  useEffect(() => {
    resetQR();
  }, [config, template, printSize, businessName, additionalText, otherText, showWifiInfo, elementStyles, resetQR]);

  // 요소 스타일 변경 핸들러
  const handleElementChange = (elementId: string, updates: any) => {
    setElementStyles(prev => 
      prev.map(element => 
        element.id === elementId 
          ? { ...element, ...updates }
          : element
      )
    );
  };

  // 상세 조정 모드 토글
  const handleDetailModeToggle = () => {
    setShowCPVModal(true);
  };

  // CPV 모달에서 모드 변경
  const handleModeChange = (mode: 'preview' | 'detail') => {
    setIsDetailMode(mode === 'detail');
    setShowCPVModal(false);
  };

  // QR 생성 함수
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

  // 레이아웃 계산
  const layoutElements = (() => {
    if (!template || !printSize) return [] as any[];
    
    const baseElements = computeLayout(
      template,
      printSize,
      {
        businessName,
        additionalText,
        otherText,
        showWifiInfo,
        businessFont: 'Inter',
        wifiInfoFont: 'Inter',
      },
      config.ssid,
      config.password
    );

    return baseElements.map(element => {
      const style = elementStyles.find(s => s.id === element.id);
      if (style && element.textElement) {
        return {
          ...element,
          textElement: {
            ...element.textElement,
            fontSize: style.fontSize,
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            color: style.color,
            visible: style.visible,
            textAlign: style.textAlign,
          },
          x: (style.x / 100) * printSize.width,
          y: (style.y / 100) * printSize.height,
          width: (style.width / 100) * printSize.width,
          height: (style.height / 100) * printSize.height,
        };
      }
      return element;
    });
  })();

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
            showWifiInfo={showWifiInfo}
            onShowWifiInfoChange={setShowWifiInfo}
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye size={14} />
              미리보기
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDetailModeToggle}
              className="flex items-center gap-2"
            >
              <Edit3 size={14} />
              {isDetailMode ? '미리보기 모드' : '상세 조정 모드'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          {qrImage && printSize ? (
            <div className="space-y-3">
              {isDetailMode ? (
                <DraggablePreview
                  qrImage={qrImage}
                  printSize={printSize}
                  template={template}
                  elementStyles={elementStyles}
                  onElementChange={handleElementChange}
                  businessName={businessName}
                  additionalText={additionalText}
                  otherText={otherText}
                  showWifiInfo={showWifiInfo}
                  config={config}
                />
              ) : (
                <>
                  {/* 일반 미리보기 */}
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
                    
                    {/* QR Code */}
                    {qrImage && (
                      <div
                        className="absolute"
                        style={{
                          left: `${(printSize.width / 2 - 80) * (Math.min(400, printSize.width) / printSize.width)}px`,
                          top: `${(printSize.height / 2 - 80) * (Math.min(400, printSize.height) / printSize.height)}px`,
                          width: `${160 * (Math.min(400, printSize.width) / printSize.width)}px`,
                          height: `${160 * (Math.min(400, printSize.width) / printSize.width)}px`,
                          zIndex: 20
                        }}
                      >
                        <div 
                          className="w-full h-full p-2 rounded-xl"
                          style={{
                            background: template?.aiGeneratedBackground ? 'rgba(255,255,255,0.98)' : 'transparent',
                            backdropFilter: template?.aiGeneratedBackground ? 'blur(12px)' : 'none',
                            boxShadow: template?.aiGeneratedBackground ? '0 6px 20px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.3)' : 'none',
                            border: template?.aiGeneratedBackground ? '1px solid rgba(255,255,255,0.2)' : 'none'
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
                      
                      const containerWidth = Math.min(400, printSize.width);
                      const containerHeight = Math.min(400, printSize.height);
                      const scaleX = containerWidth / printSize.width;
                      const scaleY = containerHeight / printSize.height;
                      const scale = Math.min(scaleX, scaleY);
                      
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
                            fontFamily: element.textElement.fontFamily,
                            fontWeight: element.textElement.fontWeight,
                            color: element.textElement.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: element.textElement.textAlign || 'center',
                            lineHeight: '1.2',
                            zIndex: 20,
                            background: template?.aiGeneratedBackground ? 'rgba(255,255,255,0.95)' : 'transparent',
                            padding: template?.aiGeneratedBackground ? '8px 12px' : '0',
                            borderRadius: template?.aiGeneratedBackground ? '8px' : '0',
                            backdropFilter: template?.aiGeneratedBackground ? 'blur(8px)' : 'none',
                            boxShadow: template?.aiGeneratedBackground ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
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
                </>
              )}
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
      
      {/* CPV Modal */}
      <CPVModal
        isOpen={showCPVModal}
        onClose={() => setShowCPVModal(false)}
        mode={isDetailMode ? 'detail' : 'preview'}
        onModeChange={handleModeChange}
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