import { useState, useEffect, useRef, useCallback } from 'react';
import { WiFiConfig, QRTemplate } from '@/types/wifi';
import { PrintSize } from '@/types/size';
import { generateQRCode } from '@/lib/qrGenerator';
import { QRCustomizer } from '@/components/QRCustomizer';
import { AdInterstitial } from '@/components/AdInterstitial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Share2, FileText, RotateCcw, Move, Eye, Settings, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TextElement {
  id: string;
  type: 'business' | 'additional' | 'other' | 'wifi-ssid' | 'wifi-password';
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  color: string;
  visible: boolean;
}

interface QRElement {
  id: string;
  type: 'qr';
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PowerPointElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
  isDragging: boolean;
  isResizing: boolean;
  resizeHandle?: string;
  element: TextElement | QRElement;
}

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
  const [fontSize, setFontSize] = useState(18);
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('bold');
  const [showWifiInfo, setShowWifiInfo] = useState(false);
  const [wifiInfoFont, setWifiInfoFont] = useState('inter');
  const [showAdInterstitial, setShowAdInterstitial] = useState(false);
  const [pendingAction, setPendingAction] = useState<'download' | 'export' | 'generate' | null>(null);
  const [isQRGenerated, setIsQRGenerated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [elements, setElements] = useState<PowerPointElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // 설정이 변경될 때마다 QR 생성 상태 리셋 및 재생성 필요 플래그 설정
  useEffect(() => {
    setIsQRGenerated(false);
  }, [config, template, printSize, businessName, additionalText, otherText, businessFont, fontSize, fontWeight, showWifiInfo, wifiInfoFont]);

  // 초기 요소들 설정
  useEffect(() => {
    if (!printSize) return;

    const canvasWidth = printSize.width;
    const canvasHeight = printSize.height;

    const defaultElements: PowerPointElement[] = [
      // QR 코드 (중앙)
      {
        id: 'qr',
        x: canvasWidth / 2 - 80,
        y: canvasHeight / 2 - 80,
        width: 160,
        height: 160,
        selected: false,
        isDragging: false,
        isResizing: false,
        element: {
          id: 'qr',
          type: 'qr',
          x: canvasWidth / 2 - 80,
          y: canvasHeight / 2 - 80,
          width: 160,
          height: 160,
        } as QRElement
      },
      // 업체명 (상단)
      {
        id: 'business',
        x: canvasWidth / 2 - 100,
        y: 40,
        width: 200,
        height: 30,
        selected: false,
        isDragging: false,
        isResizing: false,
        element: {
          id: 'business',
          type: 'business',
          text: businessName || '업체명',
          x: canvasWidth / 2 - 100,
          y: 40,
          width: 200,
          height: 30,
          fontSize: 18,
          fontFamily: 'Noto Sans KR',
          fontWeight: 'bold',
          color: '#000000',
          visible: !!businessName,
        } as TextElement
      },
      // 부가설명 (업체명 아래)
      {
        id: 'additional',
        x: canvasWidth / 2 - 100,
        y: 80,
        width: 200,
        height: 25,
        selected: false,
        isDragging: false,
        isResizing: false,
        element: {
          id: 'additional',
          type: 'additional',
          text: additionalText || '부가설명',
          x: canvasWidth / 2 - 100,
          y: 80,
          width: 200,
          height: 25,
          fontSize: 14,
          fontFamily: 'Noto Sans KR',
          fontWeight: 'normal',
          color: '#666666',
          visible: !!additionalText,
        } as TextElement
      },
      // 기타 문구 (QR 하단)
      {
        id: 'other',
        x: canvasWidth / 2 - 100,
        y: canvasHeight / 2 + 100,
        width: 200,
        height: 25,
        selected: false,
        isDragging: false,
        isResizing: false,
        element: {
          id: 'other',
          type: 'other',
          text: otherText || '기타 문구',
          x: canvasWidth / 2 - 100,
          y: canvasHeight / 2 + 100,
          width: 200,
          height: 25,
          fontSize: 14,
          fontFamily: 'Noto Sans KR',
          fontWeight: 'normal',
          color: '#000000',
          visible: !!otherText,
        } as TextElement
      },
      // WiFi SSID
      {
        id: 'wifi-ssid',
        x: canvasWidth / 2 - 100,
        y: canvasHeight / 2 + 140,
        width: 200,
        height: 25,
        selected: false,
        isDragging: false,
        isResizing: false,
        element: {
          id: 'wifi-ssid',
          type: 'wifi-ssid',
          text: config.ssid ? `WIFI : ${config.ssid}` : 'WIFI : ',
          x: canvasWidth / 2 - 100,
          y: canvasHeight / 2 + 140,
          width: 200,
          height: 25,
          fontSize: 16,
          fontFamily: 'Noto Sans KR',
          fontWeight: 'bold',
          color: '#000000',
          visible: true,
        } as TextElement
      },
      // WiFi 비밀번호
      {
        id: 'wifi-password',
        x: canvasWidth / 2 - 100,
        y: canvasHeight / 2 + 170,
        width: 200,
        height: 20,
        selected: false,
        isDragging: false,
        isResizing: false,
        element: {
          id: 'wifi-password',
          type: 'wifi-password',
          text: config.password ? `PW : ${config.password}` : 'PW : ',
          x: canvasWidth / 2 - 100,
          y: canvasHeight / 2 + 170,
          width: 200,
          height: 20,
          fontSize: 12,
          fontFamily: 'Noto Sans KR',
          fontWeight: 'normal',
          color: '#666666',
          visible: true,
        } as TextElement
      },
    ];
    
    setElements(defaultElements);
  }, [businessName, additionalText, otherText, showWifiInfo, config, printSize]);

  const renderToCanvas = async (qrDataUrl: string): Promise<void> => {
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
      
      canvas.width = printSize.width;
      canvas.height = printSize.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // AI 생성 배경 이미지가 있는 경우 먼저 그리기
      if (template.aiGeneratedBackground) {
        const bgImg = new Image();
        bgImg.onload = () => {
          // AI 배경 이미지를 캔버스 전체에 그리기 (aspect ratio 유지)
          const bgAspectRatio = bgImg.width / bgImg.height;
          const canvasAspectRatio = canvas.width / canvas.height;
          
          let drawWidth = canvas.width;
          let drawHeight = canvas.height;
          let offsetX = 0;
          let offsetY = 0;
          
          if (bgAspectRatio > canvasAspectRatio) {
            // 배경이 더 가로로 긴 경우
            drawHeight = canvas.height;
            drawWidth = drawHeight * bgAspectRatio;
            offsetX = (canvas.width - drawWidth) / 2;
          } else {
            // 배경이 더 세로로 긴 경우
            drawWidth = canvas.width;
            drawHeight = drawWidth / bgAspectRatio;
            offsetY = (canvas.height - drawHeight) / 2;
          }
          
          ctx.drawImage(bgImg, offsetX, offsetY, drawWidth, drawHeight);
          
          // QR Code with background for better visibility
          const img = new Image();
          img.onload = () => {
            const qrElement = elements.find(el => el.id === 'qr');
            if (qrElement) {
              // QR 코드 배경 (흰색 배경으로 가독성 향상)
              ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
              ctx.fillRect(qrElement.x - 10, qrElement.y - 10, qrElement.width + 20, qrElement.height + 20);
              
              // QR 코드 그리기
              ctx.drawImage(img, qrElement.x, qrElement.y, qrElement.width, qrElement.height);
            }
            
            // Text elements with enhanced visibility
            elements.forEach(element => {
              if (element.element.type !== 'qr' && 'visible' in element.element && element.element.visible) {
                const textEl = element.element as TextElement;
                
                // 텍스트 배경 (가독성을 위한 반투명 배경)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fillRect(element.x - 8, element.y - 5, element.width + 16, element.height + 10);
                
                // 텍스트 테두리 (더 나은 가독성)
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.lineWidth = 1;
                ctx.strokeRect(element.x - 8, element.y - 5, element.width + 16, element.height + 10);
                
                // 텍스트 그리기
                ctx.font = `${textEl.fontWeight} ${textEl.fontSize}px ${textEl.fontFamily}`;
                ctx.fillStyle = textEl.color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(textEl.text, element.x + element.width / 2, element.y + element.height / 2);
              }
            });
            
            resolve();
          };
          img.onerror = () => reject(new Error('Failed to load QR image'));
          img.src = qrDataUrl;
        };
        bgImg.onerror = () => {
          // AI 배경 로드 실패시 기본 배경 사용
          ctx.fillStyle = template.backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // QR Code
          const img = new Image();
          img.onload = () => {
            const qrElement = elements.find(el => el.id === 'qr');
            if (qrElement) {
              ctx.drawImage(img, qrElement.x, qrElement.y, qrElement.width, qrElement.height);
            }
            
            // Text elements
            elements.forEach(element => {
              if (element.element.type !== 'qr' && 'visible' in element.element && element.element.visible) {
                const textEl = element.element as TextElement;
                ctx.font = `${textEl.fontWeight} ${textEl.fontSize}px ${textEl.fontFamily}`;
                ctx.fillStyle = textEl.color;
                ctx.textAlign = 'center';
                ctx.fillText(textEl.text, element.x + element.width / 2, element.y + element.height / 2);
              }
            });
            
            resolve();
          };
          img.onerror = () => reject(new Error('Failed to load QR image'));
          img.src = qrDataUrl;
        };
        bgImg.src = template.aiGeneratedBackground;
      } else {
        // 기본 배경색 사용
        ctx.fillStyle = template.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // QR Code
        const img = new Image();
        img.onload = () => {
          const qrElement = elements.find(el => el.id === 'qr');
          if (qrElement) {
            ctx.drawImage(img, qrElement.x, qrElement.y, qrElement.width, qrElement.height);
          }
          
          // Text elements
          elements.forEach(element => {
            if (element.element.type !== 'qr' && 'visible' in element.element && element.element.visible) {
              const textEl = element.element as TextElement;
              ctx.font = `${textEl.fontWeight} ${textEl.fontSize}px ${textEl.fontFamily}`;
              ctx.fillStyle = textEl.color;
              ctx.textAlign = 'center';
              ctx.fillText(textEl.text, element.x + element.width / 2, element.y + element.height / 2);
            }
          });
          
          resolve();
        };
        img.onerror = () => reject(new Error('Failed to load QR image'));
        img.src = qrDataUrl;
      }
    });
  };

  const generateQR = async () => {
    if (!template || !config.ssid || !printSize) return;
    
    setIsGenerating(true);
    try {
      const qrDataUrl = await generateQRCode(config, template);
      setQrImage(qrDataUrl);
      await renderToCanvas(qrDataUrl);
      toast.success('QR 코드가 생성되었습니다!');
      setIsQRGenerated(true);
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
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgAspectRatio = canvas.width / canvas.height;
      
      let imgWidth = pageWidth - 40;
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

  // PowerPoint 스타일 드래그 핸들링
  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string, action: 'drag' | 'resize', handle?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isEditMode) return;
    
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setSelectedElementId(elementId);
    
    if (action === 'drag') {
      setDragStart({ x: mouseX, y: mouseY });
      setElements(prev => prev.map(el => 
        el.id === elementId ? { ...el, isDragging: true, selected: true } : { ...el, selected: false }
      ));
    } else if (action === 'resize') {
      const element = elements.find(el => el.id === elementId);
      if (element) {
        setResizeStart({ x: mouseX, y: mouseY, width: element.width, height: element.height });
        setElements(prev => prev.map(el => 
          el.id === elementId ? { ...el, isResizing: true, resizeHandle: handle, selected: true } : { ...el, selected: false }
        ));
      }
    }
  }, [isEditMode, elements]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isEditMode) return;
    
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const draggingElement = elements.find(el => el.isDragging);
    const resizingElement = elements.find(el => el.isResizing);
    
    if (draggingElement && dragStart) {
      const deltaX = mouseX - dragStart.x;
      const deltaY = mouseY - dragStart.y;
      
      setElements(prev => prev.map(el => 
        el.id === draggingElement.id 
          ? { ...el, x: Math.max(0, el.x + deltaX), y: Math.max(0, el.y + deltaY) }
          : el
      ));
      setDragStart({ x: mouseX, y: mouseY });
    }
    
    if (resizingElement && resizeStart) {
      const deltaX = mouseX - resizeStart.x;
      const deltaY = mouseY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      
      if (resizingElement.resizeHandle?.includes('e')) newWidth += deltaX;
      if (resizingElement.resizeHandle?.includes('w')) newWidth -= deltaX;
      if (resizingElement.resizeHandle?.includes('s')) newHeight += deltaY;
      if (resizingElement.resizeHandle?.includes('n')) newHeight -= deltaY;
      
      newWidth = Math.max(20, newWidth);
      newHeight = Math.max(10, newHeight);
      
      setElements(prev => prev.map(el => 
        el.id === resizingElement.id 
          ? { ...el, width: newWidth, height: newHeight }
          : el
      ));
    }
  }, [isEditMode, dragStart, resizeStart, elements]);

  const handleMouseUp = useCallback(() => {
    setDragStart(null);
    setResizeStart(null);
    setElements(prev => prev.map(el => ({ 
      ...el, 
      isDragging: false, 
      isResizing: false, 
      resizeHandle: undefined 
    })));
  }, []);

  const resetLayout = () => {
    if (!printSize) return;
    
    const canvasWidth = printSize.width;
    const canvasHeight = printSize.height;
    
    setElements(prev => prev.map(el => {
      switch (el.id) {
        case 'qr':
          return { ...el, x: canvasWidth / 2 - 80, y: canvasHeight / 2 - 80, width: 160, height: 160 };
        case 'business':
          return { ...el, x: canvasWidth / 2 - 100, y: 40, width: 200, height: 30 };
        case 'additional':
          return { ...el, x: canvasWidth / 2 - 100, y: 80, width: 200, height: 25 };
        case 'other':
          return { ...el, x: canvasWidth / 2 - 100, y: canvasHeight / 2 + 100, width: 200, height: 25 };
        case 'wifi-ssid':
          return { ...el, x: canvasWidth / 2 - 100, y: canvasHeight / 2 + 140, width: 200, height: 25 };
        case 'wifi-password':
          return { ...el, x: canvasWidth / 2 - 100, y: canvasHeight / 2 + 170, width: 200, height: 20 };
        default:
          return el;
      }
    }));
    setSelectedElementId(null);
  };

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

      {/* Preview with Mode Toggle */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye size={14} />
              미리보기
            </CardTitle>
            
            <Tabs value={isEditMode ? "edit" : "preview"} onValueChange={(value) => setIsEditMode(value === "edit")} className="w-auto">
              <TabsList className="grid w-fit grid-cols-2 h-7">
                <TabsTrigger value="preview" className="text-xs px-2 h-6">
                  <Eye size={12} className="mr-1" />
                  미리보기
                </TabsTrigger>
                <TabsTrigger value="edit" className="text-xs px-2 h-6">
                  <Move size={12} className="mr-1" />
                  위치 및 크기 수정
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          {qrImage && printSize ? (
            <div className="space-y-3">
              {/* Reset Layout Button for Edit Mode */}
              {isEditMode && (
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={resetLayout} className="h-7 text-xs">
                    <RotateCcw size={12} className="mr-1" />
                    레이아웃 초기화
                  </Button>
                </div>
              )}
              
              {/* Preview Container */}
              <div 
                ref={previewRef}
                className={`relative bg-white border-2 border-dashed border-gray-300 mx-auto overflow-hidden w-full max-w-full ${
                  isEditMode ? 'cursor-crosshair' : ''
                }`}
                style={{
                  width: '100%',
                  maxWidth: `min(100vw - 3rem, 400px)`,
                  height: `${Math.min(300, printSize.height * (Math.min(window.innerWidth - 48, 400) / printSize.width))}px`,
                  aspectRatio: `${printSize.width} / ${printSize.height}`
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Background */}
                <div 
                  className="absolute inset-0"
                  style={{ backgroundColor: template?.backgroundColor || '#ffffff' }}
                >
                  {/* AI 생성 배경 이미지 */}
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
                    className={`absolute ${isEditMode ? 'border-2 border-blue-500 cursor-move' : ''} ${
                      selectedElementId === 'qr' ? 'ring-2 ring-blue-400 ring-offset-1' : ''
                    }`}
                    style={{
                      left: `${(elements.find(el => el.id === 'qr')?.x || 0) * (Math.min(400, printSize.width) / printSize.width)}px`,
                      top: `${(elements.find(el => el.id === 'qr')?.y || 0) * (Math.min(400, printSize.height) / printSize.height)}px`,
                      width: `${(elements.find(el => el.id === 'qr')?.width || 160) * (Math.min(400, printSize.width) / printSize.width)}px`,
                      height: `${(elements.find(el => el.id === 'qr')?.height || 160) * (Math.min(400, printSize.width) / printSize.width)}px`,
                      zIndex: 20
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'qr', 'drag')}
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
                    
                    {/* Resize Handles for QR */}
                    {isEditMode && selectedElementId === 'qr' && (
                      <>
                        {['nw', 'ne', 'sw', 'se'].map((handle) => (
                          <div
                            key={handle}
                            className={`absolute w-2 h-2 bg-blue-500 border border-white cursor-${handle}-resize ${
                              handle.includes('n') ? '-top-1' : '-bottom-1'
                            } ${
                              handle.includes('w') ? '-left-1' : '-right-1'
                            }`}
                            onMouseDown={(e) => handleMouseDown(e, 'qr', 'resize', handle)}
                          />
                        ))}
                      </>
                    )}
                  </div>
                )}
                
                {/* Text Elements */}
                {elements.filter(el => el.element.type !== 'qr').map((element) => {
                  const textEl = element.element as TextElement;
                  if (!textEl.visible) return null;
                  
                  return (
                    <div
                      key={element.id}
                      className={`absolute ${isEditMode ? 'border border-green-500 cursor-move' : ''} ${
                        selectedElementId === element.id ? 'ring-2 ring-green-400 ring-offset-1' : ''
                      }`}
                      style={{
                        left: `${element.x * (Math.min(400, printSize.width) / printSize.width)}px`,
                        top: `${element.y * (Math.min(400, printSize.height) / printSize.height)}px`,
                        width: `${element.width * (Math.min(400, printSize.width) / printSize.width)}px`,
                        height: `${element.height * (Math.min(400, printSize.width) / printSize.width)}px`,
                        fontSize: `${textEl.fontSize * (Math.min(400, printSize.width) / printSize.width)}px`,
                        fontFamily: template?.structure?.fontFamily || textEl.fontFamily,
                        fontWeight: textEl.fontWeight,
                        color: template?.structure?.colors?.text || (template?.aiGeneratedBackground ? '#ffffff' : textEl.color),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: template?.structure?.textAlign || 'center',
                        lineHeight: '1.2',
                        zIndex: 20,
                        background: template?.aiGeneratedBackground ? 'rgba(255,255,255,0.95)' : 'transparent',
                        padding: template?.aiGeneratedBackground ? '8px 12px' : '0',
                        borderRadius: template?.aiGeneratedBackground ? '8px' : '0',
                        backdropFilter: template?.aiGeneratedBackground ? 'blur(8px)' : 'none',
                        boxShadow: template?.aiGeneratedBackground ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
                      }}
                      onMouseDown={(e) => handleMouseDown(e, element.id, 'drag')}
                    >
                      {textEl.text}
                      
                      {/* Resize Handles for Text */}
                      {isEditMode && selectedElementId === element.id && (
                        <>
                          {['nw', 'ne', 'sw', 'se'].map((handle) => (
                            <div
                              key={handle}
                              className={`absolute w-2 h-2 bg-green-500 border border-white cursor-${handle}-resize ${
                                handle.includes('n') ? '-top-1' : '-bottom-1'
                              } ${
                                handle.includes('w') ? '-left-1' : '-right-1'
                              }`}
                              onMouseDown={(e) => handleMouseDown(e, element.id, 'resize', handle)}
                            />
                          ))}
                        </>
                      )}
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
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
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
