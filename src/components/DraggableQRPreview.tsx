import { useState, useRef, useCallback } from 'react';
import { DraggableElement } from './DraggableElement';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, RotateCcw, Move } from 'lucide-react';

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
}

interface QRElement {
  id: string;
  type: 'qr';
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DraggableQRPreviewProps {
  businessName: string;
  additionalText: string;
  otherText: string;
  showWifiInfo: boolean;
  wifiSSID: string;
  wifiPassword: string;
  qrImageUrl?: string;
  canvasWidth: number;
  canvasHeight: number;
  onElementsChange: (elements: (TextElement | QRElement)[]) => void;
}

export const DraggableQRPreview = ({
  businessName,
  additionalText,
  otherText,
  showWifiInfo,
  wifiSSID,
  wifiPassword,
  qrImageUrl,
  canvasWidth,
  canvasHeight,
  onElementsChange,
}: DraggableQRPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [elements, setElements] = useState<(TextElement | QRElement)[]>([
    // QR 코드 (중앙)
    {
      id: 'qr',
      type: 'qr',
      x: canvasWidth / 2 - 100,
      y: canvasHeight / 2 - 100,
      width: 200,
      height: 200,
    },
    // 업체명 (상단)
    {
      id: 'business',
      type: 'business',
      text: businessName || '업체명',
      x: canvasWidth / 2 - 100,
      y: 50,
      width: 200,
      height: 30,
      fontSize: 18,
      fontFamily: 'Noto Sans KR',
      fontWeight: 'bold',
      color: '#000000',
    },
    // 부가설명 (업체명 아래)
    {
      id: 'additional',
      type: 'additional',
      text: additionalText || '부가설명',
      x: canvasWidth / 2 - 100,
      y: 90,
      width: 200,
      height: 25,
      fontSize: 14,
      fontFamily: 'Noto Sans KR',
      fontWeight: 'normal',
      color: '#666666',
    },
    // 기타 문구 (QR 하단)
    {
      id: 'other',
      type: 'other',
      text: otherText || '기타 문구',
      x: canvasWidth / 2 - 100,
      y: canvasHeight / 2 + 120,
      width: 200,
      height: 25,
      fontSize: 14,
      fontFamily: 'Noto Sans KR',
      fontWeight: 'normal',
      color: '#000000',
    },
    // WiFi SSID (기타 문구 아래)
    {
      id: 'wifi-ssid',
      type: 'wifi-ssid',
      text: wifiSSID || 'WiFi 이름',
      x: canvasWidth / 2 - 100,
      y: canvasHeight / 2 + 160,
      width: 200,
      height: 25,
      fontSize: 16,
      fontFamily: 'Noto Sans KR',
      fontWeight: 'bold',
      color: '#000000',
    },
    // WiFi 비밀번호 (SSID 아래)
    {
      id: 'wifi-password',
      type: 'wifi-password',
      text: wifiPassword || '비밀번호',
      x: canvasWidth / 2 - 100,
      y: canvasHeight / 2 + 190,
      width: 200,
      height: 20,
      fontSize: 12,
      fontFamily: 'Noto Sans KR',
      fontWeight: 'normal',
      color: '#666666',
    },
  ]);

  const handlePositionChange = useCallback((id: string, x: number, y: number) => {
    setElements(prev => {
      const updated = prev.map(el => 
        el.id === id ? { ...el, x, y } : el
      );
      onElementsChange(updated);
      return updated;
    });
  }, [onElementsChange]);

  const handleSizeChange = useCallback((id: string, width: number, height: number) => {
    setElements(prev => {
      const updated = prev.map(el => 
        el.id === id ? { ...el, width, height } : el
      );
      onElementsChange(updated);
      return updated;
    });
  }, [onElementsChange]);

  const resetLayout = () => {
    const defaultElements = [
      {
        id: 'qr',
        type: 'qr' as const,
        x: canvasWidth / 2 - 100,
        y: canvasHeight / 2 - 100,
        width: 200,
        height: 200,
      },
      {
        id: 'business',
        type: 'business' as const,
        text: businessName || '업체명',
        x: canvasWidth / 2 - 100,
        y: 50,
        width: 200,
        height: 30,
        fontSize: 18,
        fontFamily: 'Noto Sans KR',
        fontWeight: 'bold' as const,
        color: '#000000',
      },
      // ... 다른 기본 요소들
    ];
    setElements(defaultElements);
    onElementsChange(defaultElements);
  };

  // 텍스트 업데이트
  const updateElementText = (id: string, text: string) => {
    setElements(prev => {
      const updated = prev.map(el => 
        el.id === id && 'text' in el ? { ...el, text } : el
      );
      onElementsChange(updated);
      return updated;
    });
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
              각 요소를 클릭하고 드래그해서 위치를 조정하세요. 모서리를 드래그해서 크기를 조정할 수 있습니다.
            </span>
          </div>

          {/* 드래그 앤 드롭 캔버스 */}
          <div
            ref={containerRef}
            className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
            style={{
              width: canvasWidth,
              height: canvasHeight,
              maxWidth: '100%',
              aspectRatio: `${canvasWidth}/${canvasHeight}`,
            }}
          >
            {elements.map(element => (
              <DraggableElement
                key={element.id}
                id={element.id}
                x={element.x}
                y={element.y}
                width={element.width}
                height={element.height}
                onPositionChange={handlePositionChange}
                onSizeChange={handleSizeChange}
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
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                      QR 코드
                    </div>
                  )
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-center px-2"
                    style={{
                      fontSize: 'fontSize' in element ? element.fontSize : 14,
                      fontFamily: 'fontFamily' in element ? element.fontFamily : 'inherit',
                      fontWeight: 'fontWeight' in element ? element.fontWeight : 'normal',
                      color: 'color' in element ? element.color : '#000000',
                      backgroundColor: selectedElement === element.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    }}
                  >
                    {'text' in element ? element.text : ''}
                  </div>
                )}
              </DraggableElement>
            ))}
          </div>

          {/* 선택된 요소 정보 */}
          {selectedElement && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-2">
                선택된 요소: {elements.find(el => el.id === selectedElement)?.id}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <span>위치: X: {elements.find(el => el.id === selectedElement)?.x}px</span>
                <span>Y: {elements.find(el => el.id === selectedElement)?.y}px</span>
                <span>크기: W: {elements.find(el => el.id === selectedElement)?.width}px</span>
                <span>H: {elements.find(el => el.id === selectedElement)?.height}px</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};