import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Type, Move } from 'lucide-react';

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
}

const fonts = [
  { id: 'inter', name: 'Inter (기본)', family: 'Inter, sans-serif' },
  { id: 'noto-sans-kr', name: 'Noto Sans KR', family: '"Noto Sans KR", sans-serif' },
  { id: 'pretendard', name: 'Pretendard', family: 'Pretendard, sans-serif' },
  { id: 'nanum-gothic', name: '나눔고딕', family: '"Nanum Gothic", sans-serif' },
  { id: 'malgun-gothic', name: '맑은 고딕', family: '"Malgun Gothic", sans-serif' },
  { id: 'gulim', name: '굴림', family: 'Gulim, sans-serif' },
];

export const QRCustomizer = ({ 
  businessName, 
  onBusinessNameChange, 
  additionalText, 
  onAdditionalTextChange,
  selectedFont,
  onFontChange 
}: QRCustomizerProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Type size={20} className="text-primary" />
          텍스트 커스터마이징
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName" className="text-sm font-medium">
            비즈니스 이름 (선택사항)
          </Label>
          <Input
            id="businessName"
            type="text"
            placeholder="카페명, 상호명 등"
            value={businessName}
            onChange={(e) => onBusinessNameChange(e.target.value)}
            className="w-full"
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalText" className="text-sm font-medium">
            추가 안내 문구 (선택사항)
          </Label>
          <Input
            id="additionalText"
            type="text"
            placeholder="예: 무료 WiFi, Free WiFi, 스캔하여 연결하세요"
            value={additionalText}
            onChange={(e) => onAdditionalTextChange(e.target.value)}
            className="w-full"
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground">
            QR코드 상단이나 하단에 표시될 문구입니다
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font" className="text-sm font-medium">
            폰트 선택
          </Label>
          <Select value={selectedFont} onValueChange={onFontChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="폰트를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((font) => (
                <SelectItem key={font.id} value={font.id}>
                  <span style={{ fontFamily: font.family }}>{font.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-muted/30 border border-muted-foreground/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Move size={16} className="text-primary" />
            <span className="text-sm font-medium">드래그 앤 드롭</span>
          </div>
          <p className="text-xs text-muted-foreground">
            미리보기에서 텍스트를 드래그하여 위치를 조정할 수 있습니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};