import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Type, FileText, MessageSquare } from 'lucide-react';

interface QRCustomizerProps {
  businessName: string;
  onBusinessNameChange: (value: string) => void;
  additionalText: string;
  onAdditionalTextChange: (value: string) => void;
  otherText: string;
  onOtherTextChange: (value: string) => void;
  showWifiInfo: boolean;
  onShowWifiInfoChange: (value: boolean) => void;
  businessFont?: string;
  onBusinessFontChange?: (value: string) => void;
  fontSize?: number;
  onFontSizeChange?: (value: number) => void;
  fontWeight?: 'normal' | 'bold';
  onFontWeightChange?: (value: 'normal' | 'bold') => void;
  textPosition?: any;
  onTextPositionChange?: (value: any) => void;
  wifiInfoPosition?: any;
  onWifiInfoPositionChange?: (value: any) => void;
  wifiInfoFont?: string;
  onWifiInfoFontChange?: (value: string) => void;
}

export const QRCustomizer: React.FC<QRCustomizerProps> = ({
  businessName,
  onBusinessNameChange,
  additionalText,
  onAdditionalTextChange,
  otherText,
  onOtherTextChange,
  showWifiInfo,
  onShowWifiInfoChange,
}) => {
  return (
    <div className="space-y-4">
      {/* 업체명 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Type size={16} />
          업체명
        </Label>
        <Input
          placeholder="업체명을 입력하세요"
          value={businessName}
          onChange={(e) => onBusinessNameChange(e.target.value)}
        />
      </div>

      <Separator />

      {/* 추가 설명 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <MessageSquare size={16} />
          추가 설명
        </Label>
        <Input
          placeholder="추가 설명을 입력하세요"
          value={additionalText}
          onChange={(e) => onAdditionalTextChange(e.target.value)}
        />
      </div>

      <Separator />

      {/* 기타 문구 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <FileText size={16} />
          기타 문구
        </Label>
        <Input
          placeholder="기타 문구를 입력하세요"
          value={otherText}
          onChange={(e) => onOtherTextChange(e.target.value)}
        />
      </div>

      <Separator />

      {/* WiFi 정보 표시 */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">WiFi 정보 표시</Label>
        <Switch
          checked={showWifiInfo}
          onCheckedChange={onShowWifiInfoChange}
        />
      </div>
    </div>
  );
};