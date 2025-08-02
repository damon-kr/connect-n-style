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
  businessFont: string;
  onBusinessFontChange: (font: string) => void;
  textPosition: TextPosition | null;
  onTextPositionChange: (position: TextPosition) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  fontWeight: 'normal' | 'bold';
  onFontWeightChange: (weight: 'normal' | 'bold') => void;
  showWifiInfo: boolean;
  onShowWifiInfoChange: (show: boolean) => void;
  wifiInfoFont: string;
  onWifiInfoFontChange: (font: string) => void;
  wifiInfoPosition: TextPosition | null;
  onWifiInfoPositionChange: (position: TextPosition) => void;
}

const fonts = [
  { id: 'inter', name: 'Inter (기본)', fontFamily: 'Inter, sans-serif' },
  { id: 'noto-sans-kr', name: 'Noto Sans KR', fontFamily: '"Noto Sans KR", sans-serif' },
  { id: 'pretendard', name: 'Pretendard', fontFamily: 'Pretendard, sans-serif' },
  { id: 'nanum-gothic', name: '나눔고딕', fontFamily: '"Nanum Gothic", sans-serif' },
  { id: 'malgun-gothic', name: '맑은 고딕', fontFamily: '"Malgun Gothic", sans-serif' },
  { id: 'gulim', name: '굴림', fontFamily: 'Gulim, sans-serif' },
  { id: 'roboto', name: 'Roboto', fontFamily: 'Roboto, sans-serif' },
  { id: 'open-sans', name: 'Open Sans', fontFamily: '"Open Sans", sans-serif' },
  { id: 'lato', name: 'Lato', fontFamily: 'Lato, sans-serif' },
  { id: 'source-sans-pro', name: 'Source Sans Pro', fontFamily: '"Source Sans Pro", sans-serif' },
  { id: 'montserrat', name: 'Montserrat', fontFamily: 'Montserrat, sans-serif' },
  { id: 'poppins', name: 'Poppins', fontFamily: 'Poppins, sans-serif' },
  { id: 'playfair', name: 'Playfair Display', fontFamily: '"Playfair Display", serif' },
  { id: 'merriweather', name: 'Merriweather', fontFamily: 'Merriweather, serif' },
  { id: 'oswald', name: 'Oswald', fontFamily: 'Oswald, sans-serif' },
];

export const QRCustomizer = ({ 
  businessName, 
  onBusinessNameChange, 
  additionalText, 
  onAdditionalTextChange, 
  businessFont, 
  onBusinessFontChange,
  textPosition,
  onTextPositionChange,
  fontSize,
  onFontSizeChange,
  fontWeight,
  onFontWeightChange,
  showWifiInfo,
  onShowWifiInfoChange,
  wifiInfoFont,
  onWifiInfoFontChange,
  wifiInfoPosition,
  onWifiInfoPositionChange
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 업체명 및 부가설명 섹션 */}
            <div className="space-y-6 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Type size={20} className="text-primary" />
                <h3 className="text-lg font-semibold">업체명 & 부가설명</h3>
              </div>
              
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
                  <Label>업체명/설명 폰트</Label>
                  <Select value={businessFont} onValueChange={onBusinessFontChange}>
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
                  <Label>업체명/설명 위치</Label>
                  <TextPositionSelector 
                    selectedPosition={textPosition}
                    onPositionChange={onTextPositionChange}
                  />
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
            </div>
            
            {/* WiFi 정보 섹션 */}
            <div className="space-y-6 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Wifi size={20} className="text-primary" />
                <h3 className="text-lg font-semibold">WiFi 정보</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
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
                
                {showWifiInfo && (
                  <>
                    <div className="space-y-2">
                      <Label>WiFi 정보 폰트</Label>
                      <Select value={wifiInfoFont} onValueChange={onWifiInfoFontChange}>
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
                      <Label>WiFi 정보 위치</Label>
                      <TextPositionSelector 
                        selectedPosition={wifiInfoPosition}
                        onPositionChange={onWifiInfoPositionChange}
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  💡 <strong>커스터마이징 팁</strong>
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 업체명과 WiFi 정보의 위치를 각각 설정할 수 있습니다</li>
                  <li>• 각 영역마다 다른 폰트를 사용해서 강조 효과를 줄 수 있습니다</li>
                  <li>• WiFi 정보 표시를 끄면 업체명만 표시됩니다</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
    </Card>
  );
};