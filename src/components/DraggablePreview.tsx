import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Eye, Edit3, Settings, Type, Palette, Move, Zap } from 'lucide-react';
import { ElementStyle } from './ElementCustomizer';

interface DraggablePreviewProps {
  qrImage: string | null;
  printSize: any;
  template: any;
  elementStyles: ElementStyle[];
  onElementChange: (elementId: string, updates: Partial<ElementStyle>) => void;
  businessName: string;
  additionalText: string;
  otherText: string;
  showWifiInfo: boolean;
  config: any;
}

export const DraggablePreview: React.FC<DraggablePreviewProps> = ({
  qrImage,
  printSize,
  template,
  elementStyles,
  onElementChange,
  businessName,
  additionalText,
  otherText,
  showWifiInfo,
  config,
}) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Noto Sans KR', label: 'Noto Sans KR' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Crimson Text', label: 'Crimson Text' },
    { value: 'Baskerville', label: 'Baskerville' },
    { value: 'Orbitron', label: 'Orbitron' },
  ];

  const colorOptions = [
    { value: '#000000', label: '검정' },
    { value: '#FFFFFF', label: '흰색' },
    { value: '#1F2937', label: '다크 그레이' },
    { value: '#374151', label: '그레이' },
    { value: '#6B7280', label: '라이트 그레이' },
    { value: '#3B82F6', label: '파랑' },
    { value: '#10B981', label: '초록' },
    { value: '#F59E0B', label: '주황' },
    { value: '#EF4444', label: '빨강' },
    { value: '#8B5CF6', label: '보라' },
    { value: '#EC4899', label: '핑크' },
  ];

  const getElementText = (elementId: string) => {
    switch (elementId) {
      case 'business':
        return businessName || '업체명';
      case 'description':
        return additionalText || '추가 설명';
      case 'other':
        return otherText || '기타 문구';
      case 'wifi-ssid':
        return `WiFi: ${config.ssid || '네트워크명'}`;
      case 'wifi-password':
        return `비밀번호: ${config.password || '비밀번호'}`;
      default:
        return '';
    }
  };

  const getElementIcon = (elementId: string) => {
    switch (elementId) {
      case 'business':
        return <Type size={16} />;
      case 'description':
        return <Settings size={16} />;
      case 'other':
        return <Palette size={16} />;
      case 'qr':
        return <Zap size={16} />;
      case 'wifi-ssid':
      case 'wifi-password':
        return <Move size={16} />;
      default:
        return <Settings size={16} />;
    }
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    setDraggedElement(elementId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedElement || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - containerRect.left - dragOffset.x) / containerRect.width) * 100;
    const y = ((e.clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100;

    onElementChange(draggedElement, {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  useEffect(() => {
    if (draggedElement) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedElement, dragOffset]);

  if (!qrImage || !printSize) {
    return (
      <div className="text-center text-muted-foreground py-16 border-2 border-dashed border-muted rounded-lg">
        QR 코드를 먼저 생성해주세요
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 드래그 가능한 미리보기 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Edit3 size={14} />
            드래그하여 요소 위치 조정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={containerRef}
            className="relative bg-white border-2 border-dashed border-gray-300 mx-auto overflow-hidden w-full max-w-full"
            style={{
              width: '100%',
              maxWidth: `min(100vw - 3rem, 400px)`,
              height: `${Math.min(300, printSize.height * (Math.min(window.innerWidth - 48, 400) / printSize.width))}px`,
              aspectRatio: `${printSize.width} / ${printSize.height}`,
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* 배경 */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: template?.backgroundColor || '#ffffff' }}
            />

            {/* QR 코드 */}
            <div
              className="absolute"
              style={{
                left: `${(printSize.width / 2 - 80) * (Math.min(400, printSize.width) / printSize.width)}px`,
                top: `${(printSize.height / 2 - 80) * (Math.min(400, printSize.height) / printSize.height)}px`,
                width: `${160 * (Math.min(400, printSize.width) / printSize.width)}px`,
                height: `${160 * (Math.min(400, printSize.width) / printSize.width)}px`,
                zIndex: 20,
              }}
            >
              <img
                src={qrImage}
                alt="QR Code"
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>

            {/* 드래그 가능한 텍스트 요소들 */}
            {elementStyles
              .filter((element) => element.visible && element.id !== 'qr')
              .map((element) => {
                const containerWidth = Math.min(400, printSize.width);
                const containerHeight = Math.min(400, printSize.height);
                const scaleX = containerWidth / printSize.width;
                const scaleY = containerHeight / printSize.height;
                const scale = Math.min(scaleX, scaleY);

                return (
                  <div
                    key={element.id}
                    className={`absolute cursor-move border-2 border-dashed border-blue-300 bg-blue-50/50 hover:border-blue-500 hover:bg-blue-100/50 transition-all ${
                      selectedElement === element.id ? 'border-blue-500 bg-blue-100/50' : ''
                    } ${draggedElement === element.id ? 'z-50' : 'z-30'}`}
                    style={{
                      left: `${(element.x / 100) * containerWidth}px`,
                      top: `${(element.y / 100) * containerHeight}px`,
                      width: `${(element.width / 100) * containerWidth}px`,
                      height: `${(element.height / 100) * containerHeight}px`,
                      fontSize: `${element.fontSize * scale}px`,
                      fontFamily: element.fontFamily,
                      fontWeight: element.fontWeight,
                      color: element.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: element.textAlign || 'center',
                      lineHeight: '1.2',
                      padding: '4px',
                      minWidth: '60px',
                      minHeight: '20px',
                    }}
                    onMouseDown={(e) => handleMouseDown(e, element.id)}
                    onClick={() => setSelectedElement(element.id)}
                    onDoubleClick={() => {
                      setSelectedElement(element.id);
                      setShowStyleModal(true);
                    }}
                  >
                    <div className="flex items-center gap-1 text-xs">
                      {getElementIcon(element.id)}
                      <span className="truncate">{getElementText(element.id)}</span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* 선택된 요소 정보 */}
          {selectedElement && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getElementIcon(selectedElement)}
                  <span className="text-sm font-medium">
                    {selectedElement === 'business' ? '업체명' :
                     selectedElement === 'description' ? '추가설명' :
                     selectedElement === 'other' ? '기타문구' :
                     selectedElement === 'wifi-ssid' ? 'WiFi ID' :
                     selectedElement === 'wifi-password' ? 'WiFi 비밀번호' : selectedElement}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStyleModal(true)}
                >
                  스타일 편집
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                더블클릭하거나 스타일 편집 버튼을 클릭하여 폰트, 색상 등을 변경할 수 있습니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 스타일 편집 모달 */}
      <Dialog open={showStyleModal} onOpenChange={setShowStyleModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings size={20} />
              요소 스타일 편집
            </DialogTitle>
          </DialogHeader>

          {selectedElement && (
            <div className="space-y-4">
              {(() => {
                const element = elementStyles.find(e => e.id === selectedElement);
                if (!element) return null;

                return (
                  <>
                    {/* 표시/숨김 */}
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">표시</Label>
                      <Switch
                        checked={element.visible}
                        onCheckedChange={(checked) =>
                          onElementChange(selectedElement, { visible: checked })
                        }
                      />
                    </div>

                    {/* 폰트 */}
                    <div className="space-y-2">
                      <Label className="text-sm">폰트</Label>
                      <Select
                        value={element.fontFamily}
                        onValueChange={(value) =>
                          onElementChange(selectedElement, { fontFamily: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 폰트 크기 */}
                    <div className="space-y-2">
                      <Label className="text-sm">폰트 크기: {element.fontSize}px</Label>
                      <Slider
                        value={[element.fontSize]}
                        onValueChange={([value]) =>
                          onElementChange(selectedElement, { fontSize: value })
                        }
                        min={12}
                        max={48}
                        step={1}
                      />
                    </div>

                    {/* 색상 */}
                    <div className="space-y-2">
                      <Label className="text-sm">색상</Label>
                      <Select
                        value={element.color}
                        onValueChange={(value) =>
                          onElementChange(selectedElement, { color: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded border"
                                  style={{ backgroundColor: color.value }}
                                />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 정렬 */}
                    <div className="space-y-2">
                      <Label className="text-sm">정렬</Label>
                      <Select
                        value={element.textAlign}
                        onValueChange={(value: 'left' | 'center' | 'right') =>
                          onElementChange(selectedElement, { textAlign: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">왼쪽</SelectItem>
                          <SelectItem value="center">가운데</SelectItem>
                          <SelectItem value="right">오른쪽</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowStyleModal(false)}>
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
