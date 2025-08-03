import { useState, useRef, useCallback, useEffect } from 'react';
import { DraggableElement } from './DraggableElement';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, RotateCcw, Move, Settings } from 'lucide-react';
import { WiFiConfig } from '@/types/wifi';

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

interface DraggableQRCanvasProps {
  businessName: string;
  additionalText: string;
  otherText: string;
  showWifiInfo: boolean;
  wifiConfig: WiFiConfig;
  qrImageUrl?: string;
  canvasWidth: number;
  canvasHeight: number;
  onElementsChange?: (elements: (TextElement | QRElement)[]) => void;
}

export const DraggableQRCanvas = ({
  businessName,
  additionalText,
  otherText,
  showWifiInfo,
  wifiConfig,
  qrImageUrl,
  canvasWidth = 400,
  canvasHeight = 400,
  onElementsChange,
}: DraggableQRCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [elements, setElements] = useState<(TextElement | QRElement)[]>([]);

  // 초기 요소들 설정
  useEffect(() => {
    const defaultElements: (TextElement | QRElement)[] = [
      // QR 코드 (중앙)
      {
        id: 'qr',
        type: 'qr',
        x: canvasWidth / 2 - 80,
        y: canvasHeight / 2 - 80,
        width: 160,
        height: 160,
      },
      // 업체명 (상단)
      {
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
      },
      // 부가설명 (업체명 아래)
      {
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
      },
      // 기타 문구 (QR 하단)
      {
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
      },
      // WiFi SSID (기타 문구 아래)
      {
        id: 'wifi-ssid',
        type: 'wifi-ssid',
        text: wifiConfig.ssid || 'WiFi 이름',
        x: canvasWidth / 2 - 100,
        y: canvasHeight / 2 + 140,
        width: 200,
        height: 25,
        fontSize: 16,
        fontFamily: 'Noto Sans KR',
        fontWeight: 'bold',
        color: '#000000',
        visible: showWifiInfo && !!wifiConfig.ssid,
      },
      // WiFi 비밀번호 (SSID 아래)
      {
        id: 'wifi-password',
        type: 'wifi-password',
        text: wifiConfig.password || '비밀번호',
        x: canvasWidth / 2 - 100,
        y: canvasHeight / 2 + 170,
        width: 200,
        height: 20,
        fontSize: 12,
        fontFamily: 'Noto Sans KR',
        fontWeight: 'normal',
        color: '#666666',
        visible: showWifiInfo && !!wifiConfig.password && wifiConfig.security !== 'nopass',
      },
    ];
    
    setElements(defaultElements);
    onElementsChange?.(defaultElements);
  }, [businessName, additionalText, otherText, showWifiInfo, wifiConfig, canvasWidth, canvasHeight]);

  const handlePositionChange = useCallback((id: string, x: number, y: number) => {
    setElements(prev => {
      const updated = prev.map(el => 
        el.id === id ? { ...el, x, y } : el
      );
      onElementsChange?.(updated);
      return updated;
    });
  }, [onElementsChange]);

  const handleSizeChange = useCallback((id: string, width: number, height: number) => {
    setElements(prev => {
      const updated = prev.map(el => 
        el.id === id ? { ...el, width, height } : el
      );
      onElementsChange?.(updated);
      return updated;
    });
  }, [onElementsChange]);

  const resetLayout = () => {
    const defaultElements: (TextElement | QRElement)[] = [
      {
        id: 'qr',
        type: 'qr',
        x: canvasWidth / 2 - 80,
        y: canvasHeight / 2 - 80,
        width: 160,
        height: 160,
      },
      {
        id: 'business',
        type: 'business',
        text: businessName || '업체명',
        x: canvasWidth / 2 - 100,
        y: 40,
        width: 200,
        height: 30,
        fontSize: 18,
        fontFamily: 'Noto Sans KR',
        fontWeight: 'bold' as const,
        color: '#000000',
        visible: !!businessName,
      },
      {
        id: 'additional',
        type: 'additional',
        text: additionalText || '부가설명',
        x: canvasWidth / 2 - 100,
        y: 80,
        width: 200,
        height: 25,
        fontSize: 14,
        fontFamily: 'Noto Sans KR',
        fontWeight: 'normal' as const,
        color: '#666666',
        visible: !!additionalText,
      },
      {
        id: 'other',
        type: 'other',
        text: otherText || '기타 문구',
        x: canvasWidth / 2 - 100,
        y: canvasHeight / 2 + 100,
        width: 200,
        height: 25,
        fontSize: 14,
        fontFamily: 'Noto Sans KR',
        fontWeight: 'normal' as const,
        color: '#000000',
        visible: !!otherText,
      },
      {
        id: 'wifi-ssid',
        type: 'wifi-ssid',
        text: wifiConfig.ssid || 'WiFi 이름',
        x: canvasWidth / 2 - 100,
        y: canvasHeight / 2 + 140,
        width: 200,
        height: 25,
        fontSize: 16,
        fontFamily: 'Noto Sans KR',
        fontWeight: 'bold' as const,
        color: '#000000',
        visible: showWifiInfo && !!wifiConfig.ssid,
      },
      {
        id: 'wifi-password',
        type: 'wifi-password',
        text: wifiConfig.password || '비밀번호',
        x: canvasWidth / 2 - 100,
        y: canvasHeight / 2 + 170,
        width: 200,
        height: 20,
        fontSize: 12,
        fontFamily: 'Noto Sans KR',
        fontWeight: 'normal' as const,
        color: '#666666',
        visible: showWifiInfo && !!wifiConfig.password && wifiConfig.security !== 'nopass',
      },
    ];
    setElements(defaultElements);
    onElementsChange?.(defaultElements);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={20} className="text-primary" />
            드래그 앤 드롭 미리보기
          </div>
          <div className="flex items-center gap-2">
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
          {/* 안내 메시지 */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg">
            <Move size={16} />
            <span className="text-sm">
              각 요소를 클릭하고 드래그해서 위치를 조정하세요. 우하단 핸들을 드래그해서 크기를 조정할 수 있습니다.
            </span>
          </div>

          {/* 드래그 앤 드롭 캔버스 */}
          <div
            ref={containerRef}
            className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden mx-auto"
            style={{
              width: Math.min(canvasWidth, 500),
              height: Math.min(canvasHeight, 500),
              aspectRatio: `${canvasWidth}/${canvasHeight}`,
            }}
            onClick={() => setSelectedElement(null)}
          >
            {elements.map(element => {
              if (element.type === 'qr' || ('visible' in element && element.visible)) {
                return (
                  <DraggableElement
                    key={element.id}
                    id={element.id}
                    x={element.x * (Math.min(canvasWidth, 500) / canvasWidth)}
                    y={element.y * (Math.min(canvasHeight, 500) / canvasHeight)}
                    width={element.width * (Math.min(canvasWidth, 500) / canvasWidth)}
                    height={element.height * (Math.min(canvasHeight, 500) / canvasHeight)}
                    onPositionChange={(id, x, y) => 
                      handlePositionChange(id, x / (Math.min(canvasWidth, 500) / canvasWidth), y / (Math.min(canvasHeight, 500) / canvasHeight))
                    }
                    onSizeChange={(id, width, height) => 
                      handleSizeChange(id, width / (Math.min(canvasWidth, 500) / canvasWidth), height / (Math.min(canvasHeight, 500) / canvasHeight))
                    }
                    isSelected={selectedElement === element.id}
                    onSelect={setSelectedElement}
                    containerRef={containerRef}
                    isResizable={true}
                  >
                    {element.type === 'qr' ? (
                      qrImageUrl ? (
                        <img
                          src={qrImageUrl}
                          alt="QR Code"
                          className="w-full h-full object-contain rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded border-2 border-dashed border-gray-400">
                          QR 코드
                        </div>
                      )
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-center px-2 py-1 rounded"
                        style={{
                          fontSize: 'fontSize' in element ? Math.max(10, element.fontSize * 0.8) : 12,
                          fontFamily: 'fontFamily' in element ? element.fontFamily : 'inherit',
                          fontWeight: 'fontWeight' in element ? element.fontWeight : 'normal',
                          color: 'color' in element ? element.color : '#000000',
                          backgroundColor: selectedElement === element.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                          border: selectedElement === element.id ? '1px solid #3b82f6' : '1px solid #e5e7eb',
                        }}
                      >
                        {'text' in element ? element.text : ''}
                      </div>
                    )}
                  </DraggableElement>
                );
              }
              return null;
            })}
          </div>

          {/* 선택된 요소 정보 */}
          {selectedElement && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Settings size={16} className="text-primary" />
                <p className="text-sm font-medium">
                  선택된 요소: {(() => {
                    const element = elements.find(el => el.id === selectedElement);
                    if (!element) return selectedElement;
                    switch (element.type) {
                      case 'qr': return 'QR 코드';
                      case 'business': return '업체명';
                      case 'additional': return '부가설명';
                      case 'other': return '기타 문구';
                      case 'wifi-ssid': return 'WiFi 이름';
                      case 'wifi-password': return 'WiFi 비밀번호';
                      default: return selectedElement;
                    }
                  })()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <span>위치: X: {Math.round(elements.find(el => el.id === selectedElement)?.x || 0)}px</span>
                <span>Y: {Math.round(elements.find(el => el.id === selectedElement)?.y || 0)}px</span>
                <span>크기: W: {Math.round(elements.find(el => el.id === selectedElement)?.width || 0)}px</span>
                <span>H: {Math.round(elements.find(el => el.id === selectedElement)?.height || 0)}px</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};