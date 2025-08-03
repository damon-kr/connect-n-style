import { useState, useEffect, useRef } from 'react';
import { WiFiConfig, QRTemplate } from '@/types/wifi';
import { PrintSize } from '@/types/size';
import { generateQRCode } from '@/lib/qrGenerator';
import { QRCustomizer } from '@/components/QRCustomizer';
import { DraggableQRCanvas } from '@/components/DraggableQRCanvas';
import { TextPosition, textPositions } from '@/components/TextPositionSelector';
import { AdInterstitial } from '@/components/AdInterstitial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Share2, Eye, FileImage, FileText, Move } from 'lucide-react';
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
  const [otherText, setOtherText] = useState('');
  const [businessFont, setBusinessFont] = useState('inter');
  const [textPosition, setTextPosition] = useState<TextPosition | null>(textPositions[0]);
  const [fontSize, setFontSize] = useState(18);
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('bold');
  const [showWifiInfo, setShowWifiInfo] = useState(false);
  const [wifiInfoFont, setWifiInfoFont] = useState('inter');
  const [wifiInfoPosition, setWifiInfoPosition] = useState<TextPosition | null>(textPositions[1]);
  const [showAdInterstitial, setShowAdInterstitial] = useState(false);
  const [pendingAction, setPendingAction] = useState<'download' | 'export' | 'generate' | null>(null);
  const [isQRGenerated, setIsQRGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderToCanvas = (qrDataUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas || !template || !printSize) {
        reject(new Error('Canvas not found or missing template/printSize'));
        return;
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      // Set canvas size based on print size
      canvas.width = printSize.width;
      canvas.height = printSize.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Render background with pattern
      renderBackground(ctx, canvas, template);
      
      // Apply border style
      if (template.borderStyle !== 'none') {
        ctx.strokeStyle = template.accentColor;
        ctx.lineWidth = 3;
        
        if (template.borderStyle === 'dashed') {
          ctx.setLineDash([8, 8]);
        } else {
          ctx.setLineDash([]);
        }
        
        if (template.borderStyle === 'rounded') {
          const radius = 16;
          const margin = 8;
          ctx.beginPath();
          ctx.roundRect(margin, margin, canvas.width - margin * 2, canvas.height - margin * 2, radius);
          ctx.stroke();
        } else {
          const margin = 8;
          ctx.strokeRect(margin, margin, canvas.width - margin * 2, canvas.height - margin * 2);
        }
      }
      
      // Add decorative elements
      if (template.decorativeElements) {
        renderDecorativeElements(ctx, canvas, template);
      }
      
      // Load and draw QR code
      const img = new Image();
      img.onload = () => {
        try {
          // Calculate QR size based on template settings
          const qrSizeMultiplier = {
            small: 0.3,
            medium: 0.5,
            large: 0.7
          }[template.qrSizeRatio] || 0.5;
          
          const qrSize = Math.min(canvas.width, canvas.height) * qrSizeMultiplier;
          
          // Calculate QR position based on layout
          const qrPosition = calculateQRPosition(canvas, qrSize, template.layout);
          
          // Add subtle shadow for QR code
          ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4;
          
          ctx.drawImage(img, qrPosition.x, qrPosition.y, qrSize, qrSize);
          
          // Reset shadow
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          
           // Add text based on layout and position settings
          renderText(ctx, canvas, template, qrPosition, qrSize, businessName, additionalText, businessFont, fontSize, fontWeight, textPosition, config, showWifiInfo, wifiInfoFont, wifiInfoPosition);
          
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load QR image'));
      img.src = qrDataUrl;
    });
  };

  const renderBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, template: QRTemplate) => {
    // AI 생성 배경이 있는 경우 먼저 렌더링
    if (template.aiGeneratedBackground) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = template.aiGeneratedBackground;
      return;
    }

    if (!template.backgroundPattern || template.backgroundPattern === 'none') {
      ctx.fillStyle = template.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    switch (template.backgroundPattern) {
      case 'gradient':
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, template.backgroundColor);
        gradient.addColorStop(1, template.accentColor + '20');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;

      case 'dots':
        ctx.fillStyle = template.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = template.accentColor + '20';
        const dotSize = 4;
        const spacing = 20;
        for (let x = spacing; x < canvas.width; x += spacing) {
          for (let y = spacing; y < canvas.height; y += spacing) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;

      case 'lines':
        ctx.fillStyle = template.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = template.accentColor + '30';
        ctx.lineWidth = 1;
        const lineSpacing = 15;
        for (let x = 0; x < canvas.width; x += lineSpacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        break;
    }
  };

  const renderDecorativeElements = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, template: QRTemplate) => {
    if (!template.decorativeElements) return;

    template.decorativeElements.forEach(element => {
      switch (element) {
        case 'corners':
          const cornerSize = 20;
          ctx.fillStyle = template.accentColor;
          // Top-left corner
          ctx.fillRect(20, 20, cornerSize, 4);
          ctx.fillRect(20, 20, 4, cornerSize);
          // Top-right corner
          ctx.fillRect(canvas.width - 40, 20, cornerSize, 4);
          ctx.fillRect(canvas.width - 24, 20, 4, cornerSize);
          // Bottom-left corner
          ctx.fillRect(20, canvas.height - 24, cornerSize, 4);
          ctx.fillRect(20, canvas.height - 40, 4, cornerSize);
          // Bottom-right corner
          ctx.fillRect(canvas.width - 40, canvas.height - 24, cornerSize, 4);
          ctx.fillRect(canvas.width - 24, canvas.height - 40, 4, cornerSize);
          break;

        case 'frame':
          ctx.strokeStyle = template.accentColor + '40';
          ctx.lineWidth = 2;
          ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
          break;

        case 'shapes':
          ctx.fillStyle = template.accentColor + '20';
          // Add some geometric shapes
          ctx.beginPath();
          ctx.arc(50, 50, 15, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(canvas.width - 50, canvas.height - 50, 15, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
    });
  };

  const calculateQRPosition = (canvas: HTMLCanvasElement, qrSize: number, layout: QRTemplate['layout']) => {
    // 첨부된 이미지 기준으로 QR 위치 조정
    const baseSize = Math.min(canvas.width, canvas.height);
    const topMargin = baseSize * 0.25; // 업체명과 부가설명을 위한 여백
    const bottomMargin = baseSize * 0.15; // WiFi 정보를 위한 여백

    // 모든 레이아웃에서 수직 중앙에 배치 (상하 여백 고려)
    const centerY = topMargin + (canvas.height - topMargin - bottomMargin - qrSize) / 2;

    switch (layout) {
      case 'center':
      case 'vertical_centered':
        return {
          x: (canvas.width - qrSize) / 2,
          y: centerY
        };
      case 'top':
      case 'top_heavy':
        return {
          x: (canvas.width - qrSize) / 2,
          y: topMargin
        };
      case 'bottom':
      case 'bottom_heavy':
        return {
          x: (canvas.width - qrSize) / 2,
          y: canvas.height - bottomMargin - qrSize
        };
      case 'split-left':
      case 'horizontal_split':
        return {
          x: canvas.width * 0.15,
          y: centerY
        };
      case 'split-right':
        return {
          x: canvas.width * 0.85 - qrSize,
          y: centerY
        };
      case 'tag_style':
        return {
          x: (canvas.width - qrSize) / 2,
          y: centerY
        };
      default:
        return {
          x: (canvas.width - qrSize) / 2,
          y: centerY
        };
    }
  };

  const renderText = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    template: QRTemplate,
    qrPosition: { x: number; y: number },
    qrSize: number,
    businessName: string,
    additionalText: string,
    businessFont: string,
    fontSize: number,
    fontWeight: 'normal' | 'bold',
    textPosition: any,
    wifiConfig: WiFiConfig,
    showWifiInfo: boolean,
    wifiInfoFont: string,
    wifiInfoPosition: any
  ) => {
    // 첨부된 이미지 기준으로 레이아웃 조정
    const canvasRatio = canvas.width / canvas.height;
    const isLandscape = canvasRatio > 1;
    
    // 기본 간격 및 크기 설정
    const baseSize = Math.min(canvas.width, canvas.height);
    const margins = {
      top: baseSize * 0.08,
      side: baseSize * 0.06,
      between: baseSize * 0.04
    };

    // 폰트 매핑 (한글 폰트 적용 보장)
    const getFontFamily = (fontId: string) => {
      const fontMap: { [key: string]: string } = {
        'noto-sans-kr': '"Noto Sans KR", sans-serif',
        'nanum-gothic': '"Nanum Gothic", sans-serif',
        'nanum-myeongjo': '"Nanum Myeongjo", serif',
        'black-han-sans': '"Black Han Sans", sans-serif',
        'jua': 'Jua, sans-serif',
        'stylish': 'Stylish, sans-serif',
        'gamja-flower': '"Gamja Flower", cursive',
        'gaegu': 'Gaegu, cursive',
        'do-hyeon': '"Do Hyeon", sans-serif',
        'sunflower': 'Sunflower, sans-serif',
        'inter': 'Inter, sans-serif',
        'roboto': 'Roboto, sans-serif'
      };
      return fontMap[fontId] || '"Noto Sans KR", sans-serif';
    };

    // 텍스트 스타일 설정
    ctx.textAlign = 'center';
    ctx.fillStyle = template.textColor;

    // 1. 업체명 (빨간색 영역 - 상단)
    if (businessName) {
      const businessFontSize = isLandscape ? baseSize * 0.08 : baseSize * 0.06;
      ctx.font = `bold ${businessFontSize}px ${getFontFamily(businessFont)}`;
      const businessY = margins.top + businessFontSize;
      ctx.fillText(businessName, canvas.width / 2, businessY);
    }

    // 2. 부가설명 (회색 영역 - 업체명 아래)
    if (additionalText) {
      const additionalFontSize = isLandscape ? baseSize * 0.05 : baseSize * 0.04;
      ctx.font = `normal ${additionalFontSize}px ${getFontFamily(businessFont)}`;
      const additionalY = margins.top + (businessName ? baseSize * 0.08 : 0) + margins.between + additionalFontSize;
      ctx.fillText(additionalText, canvas.width / 2, additionalY);
    }

    // QR 코드는 이미 중앙에 배치됨 (파란색 영역)

    // 3. 기타 문구 (QR 하단)
    if (otherText) {
      const otherFontSize = isLandscape ? baseSize * 0.04 : baseSize * 0.035;
      ctx.font = `normal ${otherFontSize}px ${getFontFamily(businessFont)}`;
      const otherY = qrPosition.y + qrSize + margins.between + otherFontSize;
      ctx.fillText(otherText, canvas.width / 2, otherY);
    }

    // 4. WiFi 정보 (기타 문구 아래)
    if (showWifiInfo && wifiConfig.ssid) {
      const baseY = qrPosition.y + qrSize + margins.between;
      const otherTextOffset = otherText ? margins.between * 1.5 : 0;
      const wifiY = baseY + otherTextOffset;
      const wifiFontSize = isLandscape ? baseSize * 0.035 : baseSize * 0.03;
      
      ctx.font = `normal ${wifiFontSize}px ${getFontFamily(wifiInfoFont)}`;
      
      // WiFi 이름 (더 큰 글씨)
      const ssidFontSize = wifiFontSize * 1.2;
      ctx.font = `bold ${ssidFontSize}px ${getFontFamily(wifiInfoFont)}`;
      ctx.fillText(wifiConfig.ssid, canvas.width / 2, wifiY + ssidFontSize);
      
      // 비밀번호 (있는 경우, 작은 글씨)
      if (wifiConfig.password && wifiConfig.security !== 'nopass') {
        ctx.font = `normal ${wifiFontSize}px ${getFontFamily(wifiInfoFont)}`;
        const passwordY = wifiY + ssidFontSize + margins.between * 0.8;
        ctx.fillText(wifiConfig.password, canvas.width / 2, passwordY);
      }
    }
  };

  const generateQR = async () => {
    if (!template || !config.ssid || !printSize) return;
    
    setIsGenerating(true);
    try {
      const qrDataUrl = await generateQRCode(config, template);
      setQrImage(qrDataUrl);
      
      // Render to canvas with proper async handling
      await renderToCanvas(qrDataUrl);
      
      toast.success('QR 코드가 생성되었습니다!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('QR 코드 생성에 실패했습니다');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateQR = () => {
    if (!template || !config.ssid || !printSize) {
      toast.error('WiFi 정보와 템플릿, 인쇄 크기를 먼저 설정해주세요');
      return;
    }
    setPendingAction('generate');
    setShowAdInterstitial(true);
  };

  // 설정이 변경될 때마다 QR 생성 상태 리셋
  useEffect(() => {
    setIsQRGenerated(false);
  }, [config, template, printSize, businessName, additionalText, otherText, businessFont, textPosition, fontSize, fontWeight, showWifiInfo, wifiInfoFont, wifiInfoPosition]);

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
      await generateQR();
      setIsQRGenerated(true);
      setPendingAction(null);
      return;
    }

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
        otherText={otherText}
        onOtherTextChange={setOtherText}
        businessFont={businessFont}
        onBusinessFontChange={setBusinessFont}
        textPosition={textPosition}
        onTextPositionChange={setTextPosition}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        fontWeight={fontWeight}
        onFontWeightChange={setFontWeight}
        showWifiInfo={showWifiInfo}
        onShowWifiInfoChange={setShowWifiInfo}
        wifiInfoFont={wifiInfoFont}
        onWifiInfoFontChange={setWifiInfoFont}
        wifiInfoPosition={wifiInfoPosition}
        onWifiInfoPositionChange={setWifiInfoPosition}
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
            
            {!isQRGenerated && !isGenerating && template && printSize && config.ssid && (
              <div className="text-center space-y-4">
                <div className="text-muted-foreground">
                  <p>QR 코드를 생성하려면</p>
                  <p>아래 버튼을 클릭하세요</p>
                </div>
                <Button 
                  onClick={handleGenerateQR}
                  className="w-full"
                >
                  QR 코드 생성하기
                </Button>
              </div>
            )}
            
            {!config.ssid && template && printSize && (
              <div className="text-center text-muted-foreground">
                <p>WiFi 정보를 먼저 입력해주세요</p>
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

      {/* 드래그 편집 컴포넌트 - QR 코드가 생성된 후에만 표시 */}
      {qrImage && (
        <DraggableQRCanvas
          businessName={businessName}
          additionalText={additionalText}
          otherText={otherText}
          showWifiInfo={showWifiInfo}
          wifiConfig={config}
          qrImageUrl={qrImage}
          canvasWidth={printSize?.width || 400}
          canvasHeight={printSize?.height || 400}
        />
      )}

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
        title={
          pendingAction === 'download' ? 'PNG 다운로드 준비 중...' : 
          pendingAction === 'export' ? 'PDF 내보내기 준비 중...' : 
          'QR 코드 생성 중...'
        }
      />
    </div>
  );
};