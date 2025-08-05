import { useState, useEffect, useRef, useCallback } from 'react';
import { WiFiConfig, QRTemplate } from '@/types/wifi';
import { PrintSize } from '@/types/size';
import { generateQRCode } from '@/lib/qrGenerator';
import { QRCustomizer } from '@/components/QRCustomizer';
import { AdInterstitial } from '@/components/AdInterstitial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Share2, FileText, RotateCcw, Move, Eye, Settings } from 'lucide-react';
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

export const ImprovedQRPreview = ({ config, template, printSize, onDownload, onShare }: QRPreviewProps) => {
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
          text: showWifiInfo ? (config.ssid ? `WIFI : ${config.ssid}` : 'WIFI : ') : 'WIFI : ',
          x: canvasWidth / 2 - 100,
          y: canvasHeight / 2 + 140,
          width: 200,
          height: 25,
          fontSize: 16,
          fontFamily: 'Noto Sans KR',
          fontWeight: 'bold',
          color: '#000000',
          visible: showWifiInfo,
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
          text: showWifiInfo ? (config.password ? `PW : ${config.password}` : 'PW : ') : 'PW : ',
          x: canvasWidth / 2 - 100,
          y: canvasHeight / 2 + 170,
          width: 200,
          height: 20,
          fontSize: 12,
          fontFamily: 'Noto Sans KR',
          fontWeight: 'normal',
          color: '#666666',
          visible: showWifiInfo,
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
      
      // Background
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
    <div className="space-y-4">
      <Tabs defaultValue="customize" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customize">
            <Settings size={16} className="mr-2" />
            내용 수정
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye size={16} className="mr-2" />
            미리보기 및 다운로드
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customize" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye size={18} className="text-primary" />
                  <span className="text-lg">미리보기</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="edit-mode"
                      checked={isEditMode}
                      onCheckedChange={setIsEditMode}
                    />
                    <Label htmlFor="edit-mode" className="text-sm">
                      위치 및 크기 조정 모드
                    </Label>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetLayout}
                    className="flex items-center gap-1"
                  >
                    <RotateCcw size={14} />
                    초기화
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isEditMode && (
                  <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg">
                    <Move size={16} className="mt-0.5 flex-shrink-0" />
                    <div className="text-sm space-y-1">
                      <p className="font-medium">편집 모드가 활성화되었습니다:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• 요소를 클릭하고 드래그하여 위치 이동</li>
                        <li>• 모서리 핸들을 드래그하여 크기 조정</li>
                        <li>• PowerPoint 스타일 편집 인터페이스</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 미리보기 캔버스 */}
                <div
                  ref={previewRef}
                  className="relative bg-white border border-gray-200 rounded-lg overflow-hidden mx-auto shadow-sm"
                  style={{
                    width: printSize ? Math.min(printSize.width, 600) : 400,
                    height: printSize ? Math.min(printSize.height, 600) : 400,
                    aspectRatio: printSize ? `${printSize.width}/${printSize.height}` : '1/1',
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {elements.map(element => {
                    const shouldShow = element.element.type === 'qr' || 
                      ('visible' in element.element && element.element.visible);
                    
                    if (!shouldShow) return null;

                    const scale = printSize ? Math.min(600 / printSize.width, 600 / printSize.height) : 1;
                    
                    return (
                      <div
                        key={element.id}
                        className={`absolute ${isEditMode ? 'cursor-move' : ''}`}
                        style={{
                          left: element.x * scale,
                          top: element.y * scale,
                          width: element.width * scale,
                          height: element.height * scale,
                          border: isEditMode && element.selected ? '2px solid #3b82f6' : 'none',
                          backgroundColor: isEditMode && element.selected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        }}
                        onMouseDown={(e) => handleMouseDown(e, element.id, 'drag')}
                      >
                        {element.element.type === 'qr' ? (
                          qrImage ? (
                            <img
                              src={qrImage}
                              alt="QR Code"
                              className="w-full h-full object-contain rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs rounded border border-dashed border-gray-300">
                              QR
                            </div>
                          )
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-center px-2 py-1 rounded"
                            style={{
                              fontSize: 'fontSize' in element.element ? Math.max(8, element.element.fontSize * scale * 0.7) : 10,
                              fontFamily: 'fontFamily' in element.element ? element.element.fontFamily : 'inherit',
                              fontWeight: 'fontWeight' in element.element ? element.element.fontWeight : 'normal',
                              color: 'color' in element.element ? element.element.color : '#000000',
                            }}
                          >
                            {'text' in element.element ? element.element.text : ''}
                          </div>
                        )}

                        {/* PowerPoint 스타일 리사이즈 핸들 */}
                        {isEditMode && element.selected && (
                          <>
                            {/* 모서리 핸들 */}
                            <div
                              className="absolute w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-nw-resize"
                              style={{ left: -4, top: -4 }}
                              onMouseDown={(e) => handleMouseDown(e, element.id, 'resize', 'nw')}
                            />
                            <div
                              className="absolute w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-ne-resize"
                              style={{ right: -4, top: -4 }}
                              onMouseDown={(e) => handleMouseDown(e, element.id, 'resize', 'ne')}
                            />
                            <div
                              className="absolute w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-sw-resize"
                              style={{ left: -4, bottom: -4 }}
                              onMouseDown={(e) => handleMouseDown(e, element.id, 'resize', 'sw')}
                            />
                            <div
                              className="absolute w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-se-resize"
                              style={{ right: -4, bottom: -4 }}
                              onMouseDown={(e) => handleMouseDown(e, element.id, 'resize', 'se')}
                            />
                            
                            {/* 가장자리 핸들 */}
                            <div
                              className="absolute w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-n-resize"
                              style={{ left: '50%', top: -4, transform: 'translateX(-50%)' }}
                              onMouseDown={(e) => handleMouseDown(e, element.id, 'resize', 'n')}
                            />
                            <div
                              className="absolute w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-s-resize"
                              style={{ left: '50%', bottom: -4, transform: 'translateX(-50%)' }}
                              onMouseDown={(e) => handleMouseDown(e, element.id, 'resize', 's')}
                            />
                            <div
                              className="absolute w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-w-resize"
                              style={{ left: -4, top: '50%', transform: 'translateY(-50%)' }}
                              onMouseDown={(e) => handleMouseDown(e, element.id, 'resize', 'w')}
                            />
                            <div
                              className="absolute w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-e-resize"
                              style={{ right: -4, top: '50%', transform: 'translateY(-50%)' }}
                              onMouseDown={(e) => handleMouseDown(e, element.id, 'resize', 'e')}
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 선택된 요소 정보 */}
                {isEditMode && selectedElementId && (
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings size={16} className="text-primary" />
                      <p className="text-sm font-medium text-primary">
                        선택된 요소: {(() => {
                          const element = elements.find(el => el.id === selectedElementId);
                          if (!element) return selectedElementId;
                          switch (element.element.type) {
                            case 'qr': return 'QR 코드';
                            case 'business': return '업체명';
                            case 'additional': return '부가설명';
                            case 'other': return '기타 문구';
                            case 'wifi-ssid': return 'WiFi 이름';
                            case 'wifi-password': return 'WiFi 비밀번호';
                            default: return selectedElementId;
                          }
                        })()}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="text-muted-foreground">위치</div>
                        <div className="font-mono">X: {Math.round(elements.find(el => el.id === selectedElementId)?.x || 0)}px</div>
                        <div className="font-mono">Y: {Math.round(elements.find(el => el.id === selectedElementId)?.y || 0)}px</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">크기</div>
                        <div className="font-mono">W: {Math.round(elements.find(el => el.id === selectedElementId)?.width || 0)}px</div>
                        <div className="font-mono">H: {Math.round(elements.find(el => el.id === selectedElementId)?.height || 0)}px</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* QR 생성 및 다운로드 버튼 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleGenerateQR}
                  disabled={isGenerating || !template || !config.ssid || !printSize}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      QR 코드 생성 중...
                    </>
                  ) : (
                    <>
                      {isQRGenerated ? 'QR 코드 다시 생성하기' : 'QR 코드 생성하기'}
                    </>
                  )}
                </Button>

                {qrImage && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      onClick={handleDownload}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} />
                      PNG 다운로드
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handlePDFExport}
                      className="flex items-center gap-2"
                    >
                      <FileText size={16} />
                      PDF 다운로드
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => onShare(qrImage)}
                      className="flex items-center gap-2"
                    >
                      <Share2 size={16} />
                      공유하기
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 숨겨진 캔버스 */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />

      {/* 광고 모달 */}
      <AdInterstitial
        isOpen={showAdInterstitial}
        onComplete={handleAdComplete}
        onClose={() => {
          setShowAdInterstitial(false);
          setPendingAction(null);
        }}
        title="광고 시청 후 계속"
      />
    </div>
  );
};
