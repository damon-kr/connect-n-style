import QRCode from 'qrcode';
import { WiFiConfig } from '@/types/wifi';

export const generateWiFiQRString = (config: WiFiConfig): string => {
  const { ssid, password, security, hidden = false } = config;
  
  // WiFi QR code format: WIFI:T:WPA;S:mynetwork;P:mypass;H:false;;
  return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden};;`;
};

export const generateQRCode = async (config: WiFiConfig, template: any): Promise<string> => {
  try {
    const qrString = generateWiFiQRString(config);
    
    const canvas = await QRCode.toCanvas(qrString, {
      width: 512,
      margin: 2,
      color: {
        dark: template.textColor,
        light: template.backgroundColor
      }
    });
    
    return canvas.toDataURL();
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const validateWiFiConfig = (config: WiFiConfig): string[] => {
  const errors: string[] = [];
  
  if (!config.ssid.trim()) {
    errors.push('WiFi 네트워크 이름(SSID)을 입력해주세요');
  }
  
  if (config.security !== 'nopass' && !config.password.trim()) {
    errors.push('보안이 설정된 네트워크는 비밀번호가 필요합니다');
  }
  
  if (config.ssid.length > 32) {
    errors.push('WiFi 네트워크 이름은 32자를 초과할 수 없습니다');
  }
  
  if (config.password.length > 63) {
    errors.push('비밀번호는 63자를 초과할 수 없습니다');
  }
  
  return errors;
};