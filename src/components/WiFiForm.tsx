import { useState } from 'react';
import { WiFiConfig } from '@/types/wifi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, Wifi } from 'lucide-react';
import { validateWiFiConfig } from '@/lib/qrGenerator';
import { HelpTooltip } from '@/components/HelpTooltip';

interface WiFiFormProps {
  config: WiFiConfig;
  onConfigChange: (config: WiFiConfig) => void;
  showWifiInfo?: boolean;
  onShowWifiInfoChange?: (show: boolean) => void;
}

export const WiFiForm = ({ config, onConfigChange, showWifiInfo, onShowWifiInfoChange }: WiFiFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (field: keyof WiFiConfig, value: string | boolean) => {
    const newConfig = { ...config, [field]: value };
    onConfigChange(newConfig);
    
    // Validate on change
    const validationErrors = validateWiFiConfig(newConfig);
    setErrors(validationErrors);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Wifi size={16} className="text-primary" />
          WiFi 네트워크 정보
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label htmlFor="ssid" className="text-xs font-medium">
              네트워크 이름 (SSID) *
            </Label>
            <HelpTooltip content="WiFi 설정에서 보이는 네트워크 이름입니다. 스마트폰의 WiFi 설정에서 확인할 수 있습니다." />
          </div>
          <Input
            id="ssid"
            type="text"
            placeholder="WiFi 네트워크 이름을 입력하세요"
            value={config.ssid}
            onChange={(e) => handleInputChange('ssid', e.target.value)}
            className="w-full"
            maxLength={32}
          />
          <p className="text-xs text-muted-foreground">
            WiFi 설정에서 표시되는 이름입니다
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label htmlFor="security" className="text-xs font-medium">
              보안 유형
            </Label>
            <HelpTooltip content={
              <div>
                <p className="font-medium mb-2">보안 유형 확인 방법:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li><strong>가장 쉬운 방법:</strong> 공유기 뒷면/밑면 스티커 확인</li>
                  <li>스마트폰 WiFi 설정에서 연결된 네트워크 정보 확인</li>
                  <li>공유기 관리자 페이지 (192.168.1.1 또는 192.168.0.1) 접속</li>
                </ol>
                <p className="mt-2 text-sm text-muted-foreground">대부분의 최신 공유기는 WPA/WPA2를 사용합니다.</p>
              </div>
            } />
          </div>
          <Select 
            value={config.security} 
            onValueChange={(value: 'WPA' | 'WEP' | 'nopass') => handleInputChange('security', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select security type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WPA">WPA/WPA2 (권장)</SelectItem>
              <SelectItem value="WEP">WEP (구형)</SelectItem>
              <SelectItem value="nopass">개방형 네트워크 (비밀번호 없음)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {config.security !== 'nopass' && (
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="password" className="text-xs font-medium">
                비밀번호 *
              </Label>
              <HelpTooltip content="WiFi 연결 시 입력하는 비밀번호입니다. 공유기 스티커나 관리자가 설정한 비밀번호를 입력하세요." />
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="WiFi 비밀번호를 입력하세요"
                value={config.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pr-10"
                maxLength={63}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={16} className="text-muted-foreground" />
                ) : (
                  <Eye size={16} className="text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between py-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Label htmlFor="hidden" className="text-xs font-medium">
                숨겨진 네트워크
              </Label>
              <HelpTooltip content="네트워크가 자동으로 검색되지 않는 경우 활성화하세요. 대부분의 경우 비활성화 상태로 유지하시면 됩니다." />
            </div>
            <p className="text-xs text-muted-foreground">
              네트워크 이름이 자동으로 표시되지 않는 경우 활성화
            </p>
          </div>
          <Switch
            id="hidden"
            checked={config.hidden || false}
            onCheckedChange={(checked) => handleInputChange('hidden', checked)}
          />
        </div>

        {/* WiFi 정보 표시 옵션 */}
        {onShowWifiInfoChange && (
          <div className="flex items-center justify-between py-2 border-t pt-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">
                QR 코드에 WiFi 정보 표시
              </Label>
              <p className="text-xs text-muted-foreground">
                네트워크 이름과 비밀번호를 QR 코드에 포함
              </p>
            </div>
            <Switch
              checked={showWifiInfo || false}
              onCheckedChange={onShowWifiInfoChange}
            />
          </div>
        )}

        {errors.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
            <h4 className="text-sm font-medium text-destructive mb-1">다음 사항을 수정해주세요:</h4>
            <ul className="text-xs text-destructive space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};