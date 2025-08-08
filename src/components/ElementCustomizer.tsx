import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Type, Palette, Move, Zap } from 'lucide-react';

export interface ElementStyle {
  id: string;
  name: string;
  visible: boolean;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  color: string;
  x: number; // 퍼센트
  y: number; // 퍼센트
  width: number; // 퍼센트
  height: number; // 퍼센트
  textAlign: 'left' | 'center' | 'right';
}

export interface ElementCustomizerProps {
  elements: ElementStyle[];
  onElementChange: (elementId: string, updates: Partial<ElementStyle>) => void;
}

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

export const ElementCustomizer: React.FC<ElementCustomizerProps> = ({
  elements,
  onElementChange,
}) => {
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

  const getElementLabel = (elementId: string) => {
    switch (elementId) {
      case 'business':
        return '업체명';
      case 'description':
        return '추가설명';
      case 'other':
        return '기타문구';
      case 'qr':
        return 'QR 코드';
      case 'wifi-ssid':
        return 'WiFi ID';
      case 'wifi-password':
        return 'WiFi 비밀번호';
      default:
        return elementId;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings size={20} />
            요소별 스타일 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {elements.map((element) => (
            <div key={element.id} className="space-y-3 p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getElementIcon(element.id)}
                  <Label className="font-medium">{getElementLabel(element.id)}</Label>
                </div>
                <Switch
                  checked={element.visible}
                  onCheckedChange={(checked) =>
                    onElementChange(element.id, { visible: checked })
                  }
                />
              </div>

              {element.visible && (
                <div className="space-y-3 pl-6">
                  {/* 폰트 설정 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">폰트</Label>
                      <Select
                        value={element.fontFamily}
                        onValueChange={(value) =>
                          onElementChange(element.id, { fontFamily: value })
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
                    <div>
                      <Label className="text-sm">굵기</Label>
                      <Select
                        value={element.fontWeight}
                        onValueChange={(value: 'normal' | 'bold') =>
                          onElementChange(element.id, { fontWeight: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">보통</SelectItem>
                          <SelectItem value="bold">굵게</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 폰트 크기 */}
                  <div>
                    <Label className="text-sm">폰트 크기: {element.fontSize}px</Label>
                    <Slider
                      value={[element.fontSize]}
                      onValueChange={([value]) =>
                        onElementChange(element.id, { fontSize: value })
                      }
                      min={12}
                      max={48}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  {/* 색상 */}
                  <div>
                    <Label className="text-sm">색상</Label>
                    <Select
                      value={element.color}
                      onValueChange={(value) =>
                        onElementChange(element.id, { color: value })
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
                  <div>
                    <Label className="text-sm">정렬</Label>
                    <Select
                      value={element.textAlign}
                      onValueChange={(value: 'left' | 'center' | 'right') =>
                        onElementChange(element.id, { textAlign: value })
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

                  <Separator />

                  {/* 위치 조정 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">X 위치: {element.x}%</Label>
                      <Slider
                        value={[element.x]}
                        onValueChange={([value]) =>
                          onElementChange(element.id, { x: value })
                        }
                        min={0}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Y 위치: {element.y}%</Label>
                      <Slider
                        value={[element.y]}
                        onValueChange={([value]) =>
                          onElementChange(element.id, { y: value })
                        }
                        min={0}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* 크기 조정 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">너비: {element.width}%</Label>
                      <Slider
                        value={[element.width]}
                        onValueChange={([value]) =>
                          onElementChange(element.id, { width: value })
                        }
                        min={10}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">높이: {element.height}%</Label>
                      <Slider
                        value={[element.height]}
                        onValueChange={([value]) =>
                          onElementChange(element.id, { height: value })
                        }
                        min={10}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
