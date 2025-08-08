import QRCode from 'qrcode';
import { WiFiConfig } from '@/types/wifi';

export const generateWiFiQRString = (config: WiFiConfig): string => {
  const { ssid, password, security, hidden = false } = config;

  // Escape special characters per WiFi QR standard
  const esc = (s: string) =>
    s.replace(/\\/g, "\\\\") // escape backslash first
     .replace(/;/g, '\\;')
     .replace(/,/g, '\\,')
     .replace(/:/g, '\\:')
     .replace(/"/g, '\\"');

  // Security mapping: WPA (covers WPA/WPA2), WEP, or nopass
  let securityType: string = security;
  if (security === 'WPA') {
    securityType = 'WPA';
  } else if (security === 'WEP') {
    securityType = 'WEP';
  } else if (security === 'nopass') {
    securityType = 'nopass';
  }

  const sPart = `S:${esc(ssid)};`;
  const pPart = securityType !== 'nopass' && password ? `P:${esc(password)};` : '';
  const tPart = `T:${securityType};`;
  const hPart = hidden ? 'H:true;' : '';

  // Standard format: omit H when false; include only when true
  const qrString = `WIFI:${tPart}${sPart}${pPart}${hPart};`;
  console.log('Generated WiFi QR String:', qrString);
  return qrString;
};

export const generateQRCode = async (config: WiFiConfig, template: any): Promise<string> => {
  try {
    const qrString = generateWiFiQRString(config);
    console.log('Generating QR for:', qrString);
    
    const qrOptions = {
      width: 512,
      margin: 2,
      color: {
        // Force high-contrast colors for maximum scan reliability
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M' as const // 중간 수준 오류 보정으로 안정성 향상
    };
    
    // canvas 대신 데이터 URL 직접 생성으로 안정성 향상
    const qrDataUrl = await QRCode.toDataURL(qrString, qrOptions);
    console.log('QR Code generated successfully');
    
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error(`QR 코드 생성 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
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