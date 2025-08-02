import { useState, useEffect, useRef } from 'react';
import { WiFiConfig, QRTemplate } from '@/types/wifi';
import { PrintSize } from '@/types/size';
import { generateQRCode } from '@/lib/qrGenerator';
import { QRCustomizer } from '@/components/QRCustomizer';
import { TextPosition, textPositions } from '@/components/TextPositionSelector';
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
  const [businessFont, setBusinessFont] = useState('inter');
  const [textPosition, setTextPosition] = useState<TextPosition | null>(textPositions[0]);
  const [fontSize, setFontSize] = useState(18);
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('bold');
  const [showWifiInfo, setShowWifiInfo] = useState(false);
  const [wifiInfoFont, setWifiInfoFont] = useState('inter');
  const [wifiInfoPosition, setWifiInfoPosition] = useState<TextPosition | null>(textPositions[1]);
  const [showAdInterstitial, setShowAdInterstitial] = useState(false);
  const [pendingAction, setPendingAction] = useState<'download' | 'export' | null>(null);
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
    switch (layout) {
      case 'center':
      case 'vertical_centered':
        return {
          x: (canvas.width - qrSize) / 2,
          y: (canvas.height - qrSize) / 2
        };
      case 'top':
      case 'top_heavy':
        return {
          x: (canvas.width - qrSize) / 2,
          y: canvas.height * 0.15
        };
      case 'bottom':
      case 'bottom_heavy':
        return {
          x: (canvas.width - qrSize) / 2,
          y: canvas.height * 0.85 - qrSize
        };
      case 'split-left':
      case 'horizontal_split':
        return {
          x: canvas.width * 0.15,
          y: (canvas.height - qrSize) / 2
        };
      case 'split-right':
        return {
          x: canvas.width * 0.85 - qrSize,
          y: (canvas.height - qrSize) / 2
        };
      case 'tag_style':
        return {
          x: (canvas.width - qrSize) / 2,
          y: canvas.height * 0.3
        };
      default:
        return {
          x: (canvas.width - qrSize) / 2,
          y: (canvas.height - qrSize) / 2
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
    // 반응형 간격 계산
    const getSpacing = () => {
      const baseSpacing = Math.min(canvas.width, canvas.height) * 0.02;
      return {
        small: baseSpacing,
        medium: baseSpacing * 1.5,
        large: baseSpacing * 2.5,
        extraLarge: baseSpacing * 4
      };
    };

    const spacing = getSpacing();

    const getTextArea = (position: any, isWifiInfo: boolean = false) => {
      // 사용자 정의 위치가 있는 경우
      if (position) {
        const areaWidth = canvas.width * 0.6;
        const areaHeight = canvas.height * 0.3;
        return {
          x: canvas.width * position.x - areaWidth / 2,
          y: canvas.height * position.y - areaHeight / 2,
          width: areaWidth,
          height: areaHeight
        };
      }
      
      // 레이아웃 기반 자동 위치 계산
      const margin = spacing.medium;
      
          // 가로/세로 비율에 따른 레이아웃 자동 조정
          const isLandscape = canvas.width > canvas.height;
          const aspectRatio = canvas.width / canvas.height;
          
          switch (template.layout) {
            case 'top':
            case 'top_heavy':
              if (isWifiInfo) {
                return {
                  x: margin,
                  y: qrPosition.y + qrSize + (isLandscape ? spacing.medium : spacing.large),
                  width: canvas.width - margin * 2,
                  height: canvas.height - (qrPosition.y + qrSize + (isLandscape ? spacing.medium : spacing.large) + margin)
                };
              }
              return {
                x: margin,
                y: qrPosition.y + qrSize + spacing.medium,
                width: canvas.width - margin * 2,
                height: isLandscape ? spacing.large : spacing.extraLarge
              };
              
            case 'bottom':
            case 'bottom_heavy':
              if (isWifiInfo) {
                return {
                  x: margin,
                  y: margin,
                  width: canvas.width - margin * 2,
                  height: qrPosition.y - (isLandscape ? spacing.medium : spacing.large) - margin
                };
              }
              return {
                x: margin,
                y: qrPosition.y - (isLandscape ? spacing.large : spacing.extraLarge) - spacing.medium,
                width: canvas.width - margin * 2,
                height: isLandscape ? spacing.large : spacing.extraLarge
              };
              
            case 'split-left':
            case 'horizontal_split':
              // 가로형에 최적화된 레이아웃
              if (isLandscape && aspectRatio > 1.4) {
                if (isWifiInfo) {
                  return {
                    x: qrPosition.x + qrSize + spacing.large,
                    y: canvas.height * 0.65,
                    width: canvas.width - (qrPosition.x + qrSize + spacing.large + margin),
                    height: canvas.height * 0.25
                  };
                }
                return {
                  x: qrPosition.x + qrSize + spacing.medium,
                  y: canvas.height * 0.15,
                  width: canvas.width - (qrPosition.x + qrSize + spacing.medium + margin),
                  height: canvas.height * 0.45
                };
              } else {
                // 세로형이거나 비율이 낮은 경우
                if (isWifiInfo) {
                  return {
                    x: margin,
                    y: qrPosition.y + qrSize + spacing.large,
                    width: canvas.width - margin * 2,
                    height: canvas.height - (qrPosition.y + qrSize + spacing.large + margin)
                  };
                }
                return {
                  x: margin,
                  y: qrPosition.y + qrSize + spacing.medium,
                  width: canvas.width - margin * 2,
                  height: spacing.extraLarge
                };
              }
              
            case 'split-right':
              if (isLandscape && aspectRatio > 1.4) {
                if (isWifiInfo) {
                  return {
                    x: margin,
                    y: canvas.height * 0.65,
                    width: qrPosition.x - spacing.large - margin,
                    height: canvas.height * 0.25
                  };
                }
                return {
                  x: margin,
                  y: canvas.height * 0.15,
                  width: qrPosition.x - spacing.medium - margin,
                  height: canvas.height * 0.45
                };
              } else {
                if (isWifiInfo) {
                  return {
                    x: margin,
                    y: qrPosition.y + qrSize + spacing.large,
                    width: canvas.width - margin * 2,
                    height: canvas.height - (qrPosition.y + qrSize + spacing.large + margin)
                  };
                }
                return {
                  x: margin,
                  y: qrPosition.y + qrSize + spacing.medium,
                  width: canvas.width - margin * 2,
                  height: spacing.extraLarge
                };
              }
              
            case 'vertical_centered':
            case 'tag_style':
            case 'center':
            default:
              if (isWifiInfo) {
                return {
                  x: margin,
                  y: qrPosition.y + qrSize + (isLandscape ? spacing.large : spacing.extraLarge) + spacing.medium,
                  width: canvas.width - margin * 2,
                  height: canvas.height - (qrPosition.y + qrSize + (isLandscape ? spacing.large : spacing.extraLarge) + spacing.medium + margin)
                };
              }
              return {
                x: margin,
                y: qrPosition.y + qrSize + spacing.medium,
                width: canvas.width - margin * 2,
                height: isLandscape ? spacing.large : spacing.extraLarge
              };
          }
    };

    const businessTextArea = getTextArea(textPosition, false);
    const wifiTextArea = getTextArea(wifiInfoPosition, true);

    // 업체명 및 부가설명 렌더링
    if (businessName || additionalText) {
      let currentY = businessTextArea.y;
      
      if (businessName) {
        const businessTextSize = Math.max(fontSize, canvas.width / 25);
        ctx.fillStyle = template.textColor;
        ctx.font = `${fontWeight} ${businessTextSize}px ${businessFont}`;
        ctx.textAlign = textPosition?.align || 'center';
        ctx.textBaseline = 'top';

        const textX = textPosition?.align === 'left' ? businessTextArea.x : 
                     textPosition?.align === 'right' ? businessTextArea.x + businessTextArea.width :
                     businessTextArea.x + businessTextArea.width / 2;

        // Add text background for better readability
        const textMetrics = ctx.measureText(businessName);
        const textWidth = textMetrics.width;
        const textHeight = businessTextSize;

        const bgPadding = spacing.small;
        const bgX = textPosition?.align === 'left' ? textX - bgPadding :
                   textPosition?.align === 'right' ? textX - textWidth - bgPadding :
                   textX - textWidth / 2 - bgPadding;

        ctx.fillStyle = template.backgroundColor + 'DD';
        ctx.fillRect(bgX, currentY - bgPadding, textWidth + bgPadding * 2, textHeight + bgPadding * 2);

        ctx.fillStyle = template.textColor;
        ctx.fillText(businessName, textX, currentY);
        
        currentY += textHeight + spacing.medium;
      }

      if (additionalText) {
        const additionalTextSize = Math.max(fontSize - 4, canvas.width / 30);
        ctx.fillStyle = template.accentColor;
        ctx.font = `${fontWeight === 'bold' ? 'normal' : fontWeight} ${additionalTextSize}px ${businessFont}`;
        ctx.textAlign = textPosition?.align || 'center';
        ctx.textBaseline = 'top';

        const textX = textPosition?.align === 'left' ? businessTextArea.x : 
                     textPosition?.align === 'right' ? businessTextArea.x + businessTextArea.width :
                     businessTextArea.x + businessTextArea.width / 2;

        const textMetrics = ctx.measureText(additionalText);
        const textWidth = textMetrics.width;
        const textHeight = additionalTextSize;

        const bgPadding = spacing.small * 0.8;
        const bgX = textPosition?.align === 'left' ? textX - bgPadding :
                   textPosition?.align === 'right' ? textX - textWidth - bgPadding :
                   textX - textWidth / 2 - bgPadding;

        ctx.fillStyle = template.backgroundColor + 'DD';
        ctx.fillRect(bgX, currentY - bgPadding, textWidth + bgPadding * 2, textHeight + bgPadding * 2);

        ctx.fillStyle = template.accentColor;
        ctx.fillText(additionalText, textX, currentY);
      }
    }

    // WiFi 정보 표시
    if (showWifiInfo) {
      const wifiTextSize = Math.max(fontSize - 6, canvas.width / 35);
      ctx.font = `normal ${wifiTextSize}px ${wifiInfoFont}`;
      ctx.textAlign = wifiInfoPosition?.align || 'center';
      ctx.textBaseline = 'top';

      const textX = wifiInfoPosition?.align === 'left' ? wifiTextArea.x : 
                   wifiInfoPosition?.align === 'right' ? wifiTextArea.x + wifiTextArea.width :
                   wifiTextArea.x + wifiTextArea.width / 2;
      let currentY = wifiTextArea.y;

      // 네트워크 이름 표시
      const ssidText = `WiFi: ${wifiConfig.ssid}`;
      ctx.fillStyle = template.textColor;
      const ssidMetrics = ctx.measureText(ssidText);
      
      const bgPadding = spacing.small;
      const ssidBgX = wifiInfoPosition?.align === 'left' ? textX - bgPadding :
                     wifiInfoPosition?.align === 'right' ? textX - ssidMetrics.width - bgPadding :
                     textX - ssidMetrics.width / 2 - bgPadding;
      
      ctx.fillStyle = template.backgroundColor + 'DD';
      ctx.fillRect(ssidBgX, currentY - bgPadding, ssidMetrics.width + bgPadding * 2, wifiTextSize + bgPadding * 2);
      
      ctx.fillStyle = template.textColor;
      ctx.fillText(ssidText, textX, currentY);
      currentY += wifiTextSize + spacing.medium;

      // 비밀번호 표시 (보안이 설정된 경우만)
      if (wifiConfig.security !== 'nopass' && wifiConfig.password) {
        const passwordText = `Password: ${wifiConfig.password}`;
        const passwordMetrics = ctx.measureText(passwordText);
        
        const passwordBgX = wifiInfoPosition?.align === 'left' ? textX - bgPadding :
                           wifiInfoPosition?.align === 'right' ? textX - passwordMetrics.width - bgPadding :
                           textX - passwordMetrics.width / 2 - bgPadding;
        
        ctx.fillStyle = template.backgroundColor + 'DD';
        ctx.fillRect(passwordBgX, currentY - bgPadding, passwordMetrics.width + bgPadding * 2, wifiTextSize + bgPadding * 2);
        
        ctx.fillStyle = template.textColor;
        ctx.fillText(passwordText, textX, currentY);
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

  useEffect(() => {
    generateQR();
  }, [config, template, printSize, businessName, additionalText, businessFont, textPosition, fontSize, fontWeight, showWifiInfo, wifiInfoFont, wifiInfoPosition]);

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