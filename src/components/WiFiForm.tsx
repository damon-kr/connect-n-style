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

interface WiFiFormProps {
  config: WiFiConfig;
  onConfigChange: (config: WiFiConfig) => void;
}

export const WiFiForm = ({ config, onConfigChange }: WiFiFormProps) => {
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
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wifi size={20} className="text-primary" />
          WiFi Network Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ssid" className="text-sm font-medium">
            Network Name (SSID) *
          </Label>
          <Input
            id="ssid"
            type="text"
            placeholder="Enter your WiFi network name"
            value={config.ssid}
            onChange={(e) => handleInputChange('ssid', e.target.value)}
            className="w-full"
            maxLength={32}
          />
          <p className="text-xs text-muted-foreground">
            The name that appears in WiFi settings
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="security" className="text-sm font-medium">
            Security Type
          </Label>
          <Select 
            value={config.security} 
            onValueChange={(value: 'WPA' | 'WEP' | 'nopass') => handleInputChange('security', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select security type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WPA">WPA/WPA2 (Recommended)</SelectItem>
              <SelectItem value="WEP">WEP (Legacy)</SelectItem>
              <SelectItem value="nopass">Open Network (No Password)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {config.security !== 'nopass' && (
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password *
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter WiFi password"
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
            <Label htmlFor="hidden" className="text-sm font-medium">
              Hidden Network
            </Label>
            <p className="text-xs text-muted-foreground">
              Enable if your network doesn't broadcast its name
            </p>
          </div>
          <Switch
            id="hidden"
            checked={config.hidden || false}
            onCheckedChange={(checked) => handleInputChange('hidden', checked)}
          />
        </div>

        {errors.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
            <h4 className="text-sm font-medium text-destructive mb-1">Please fix the following issues:</h4>
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