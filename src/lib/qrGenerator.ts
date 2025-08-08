import QRCode from 'qrcode';
import { WiFiConfig } from '@/types/wifi';

export const generateWiFiQRString = (config: WiFiConfig): string => {
  const { ssid, password, security, hidden = false } = config;

  // WiFi QR 코드 표준에 따른 특수문자 이스케이프
  const escapeSpecialChars = (str: string): string => {
    return str
      .replace(/\\/g, '\\\\')  // 백슬래시를 먼저 이스케이프
      .replace(/;/g, '\\;')    // 세미콜론
      .replace(/,/g, '\\,')    // 쉼표
      .replace(/:/g, '\\:')    // 콜론
      .replace(/"/g, '\\"')    // 따옴표
      .replace(/\n/g, '\\n')   // 개행
      .replace(/\r/g, '\\r')   // 캐리지 리턴
      .replace(/\t/g, '\\t');  // 탭
  };

  // 보안 타입 매핑 (타입에 맞춰 WPA2/3 분기 제거)
  let securityType: string;
  switch (security) {
    case 'WPA':
      securityType = 'WPA';
      break;
    case 'WEP':
      securityType = 'WEP';
      break;
    case 'nopass':
      securityType = 'nopass';
      break;
    default:
      securityType = 'WPA';
  }

  // WiFi QR 코드 표준 형식: WIFI:T:WPA;S:SSID;P:Password;H:true;;
  const parts = [
    `T:${securityType}`,
    `S:${escapeSpecialChars(ssid)}`,
    ...(securityType !== 'nopass' && password ? [`P:${escapeSpecialChars(password)}`] : []),
    `H:${hidden ? 'true' : 'false'}`
  ];

  const qrString = `WIFI:${parts.join(';')};;`;
  console.log('Generated WiFi QR String:', qrString);
  return qrString;
};

export const generateQRCode = async (config: WiFiConfig, template: any): Promise<string> => {
  try {
    // 입력 검증
    if (!config.ssid.trim()) {
      throw new Error('WiFi 네트워크 이름(SSID)을 입력해주세요');
    }

    if (config.security !== 'nopass' && !config.password.trim()) {
      throw new Error('보안이 설정된 네트워크는 비밀번호가 필요합니다');
    }

    const qrString = generateWiFiQRString(config);
    console.log('Generating QR for:', qrString);
    
    const qrOptions = {
      width: 512,
      margin: 2,
      color: {
        dark: template?.textColor || '#000000',
        light: template?.backgroundColor || '#FFFFFF'
      },
      errorCorrectionLevel: 'M' as const,
      type: 'image/png' as const
    };
    
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
