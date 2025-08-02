import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Palette, Type, Move, Wifi } from 'lucide-react';
import { TextPositionSelector, TextPosition, textPositions } from '@/components/TextPositionSelector';

interface TextElement {
  id: string;
  text: string;
  font: string;
  x: number;
  y: number;
}

interface QRCustomizerProps {
  businessName: string;
  onBusinessNameChange: (name: string) => void;
  additionalText: string;
  onAdditionalTextChange: (text: string) => void;
  selectedFont: string;
  onFontChange: (font: string) => void;
  textPosition: TextPosition | null;
  onTextPositionChange: (position: TextPosition) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  fontWeight: 'normal' | 'bold';
  onFontWeightChange: (weight: 'normal' | 'bold') => void;
  showWifiInfo: boolean;
  onShowWifiInfoChange: (show: boolean) => void;
}

const fonts = [
  { id: 'inter', name: 'Inter (기본)', fontFamily: 'Inter, sans-serif' },
  { id: 'noto-sans-kr', name: 'Noto Sans KR', fontFamily: '"Noto Sans KR", sans-serif' },
  { id: 'pretendard', name: 'Pretendard', fontFamily: 'Pretendard, sans-serif' },
  { id: 'nanum-gothic', name: '나눔고딕', fontFamily: '"Nanum Gothic", sans-serif' },
  { id: 'malgun-gothic', name: '맑은 고딕', fontFamily: '"Malgun Gothic", sans-serif' },
  { id: 'gulim', name: '굴림', fontFamily: 'Gulim, sans-serif' },
];

export const QRCustomizer = ({ 
  businessName, 
  onBusinessNameChange, 
  additionalText, 
  onAdditionalTextChange, 
  selectedFont, 
  onFontChange,
  textPosition,
  onTextPositionChange,
  fontSize,
  onFontSizeChange,
  fontWeight,
  onFontWeightChange,
  showWifiInfo,
  onShowWifiInfoChange
}: QRCustomizerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette size={20} className="text-primary" />
          텍스트 커스터마이징
        </CardTitle>
      </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 텍스트 입력 섹션 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">업체명 또는 타이틀</Label>
                <Input
                  id="businessName"
                  placeholder="예: 스타벅스 강남점"
                  value={businessName}
                  onChange={(e) => onBusinessNameChange(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalText">추가 설명</Label>
                <Input
                  id="additionalText"
                  placeholder="예: Free WiFi Available"
                  value={additionalText}
                  onChange={(e) => onAdditionalTextChange(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Wifi size={16} className="text-primary" />
                  <Label htmlFor="showWifiInfo">WiFi 정보 표시</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="showWifiInfo"
                    checked={showWifiInfo}
                    onCheckedChange={onShowWifiInfoChange}
                  />
                  <span className="text-sm text-muted-foreground">
                    네트워크 이름과 비밀번호 표시
                  </span>
                </div>
              </div>
            </div>
            
            {/* 폰트 및 스타일 섹션 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>폰트 선택</Label>
                <Select value={selectedFont} onValueChange={onFontChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="폰트를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font.id} value={font.id}>
                        <span style={{ fontFamily: font.fontFamily }}>
                          {font.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>폰트 크기: {fontSize}px</Label>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => onFontSizeChange(value[0])}
                  max={32}
                  min={12}
                  step={2}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label>폰트 굵기</Label>
                <Select value={fontWeight} onValueChange={onFontWeightChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">일반</SelectItem>
                    <SelectItem value="bold">굵게</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* 위치 선택 섹션 */}
            <div className="space-y-4">
              <TextPositionSelector 
                selectedPosition={textPosition}
                onPositionChange={onTextPositionChange}
              />
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  💡 <strong>커스터마이징 팁</strong>
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 업체명과 설명이 QR코드와 함께 표시됩니다</li>
                  <li>• 템플릿 색상에 어울리는 폰트가 자동 설정됩니다</li>
                  <li>• 텍스트 위치를 변경해서 최적의 레이아웃을 만드세요</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
    </Card>
  );
};