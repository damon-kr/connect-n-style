// 피그마 디자인 분석 기반 레이아웃 엔진
import { QRTemplate } from '@/types/wifi';
import { PrintSize } from '@/types/size';

interface LayoutConfig {
  businessName: string;
  additionalText: string;
  otherText: string;
  showWifiInfo: boolean;
  businessFont: string;
  wifiInfoFont: string;
}

// 피그마 샘플 분석 기반 동적 레이아웃 계산
const calculateDynamicLayout = (printSize: PrintSize, template: QRTemplate) => {
  const { width, height } = printSize;
  const aspectRatio = width / height;
  
  // 용지 비율에 따른 동적 조정
  const isLandscape = aspectRatio > 1;
  const isPortrait = aspectRatio < 1;
  const isSquare = Math.abs(aspectRatio - 1) < 0.1;
  
  // QR 코드 크기 동적 계산
  const qrSizeRatio = isLandscape ? 0.25 : isPortrait ? 0.35 : 0.3;
  const qrSize = Math.min(width, height) * qrSizeRatio;
  
  // 텍스트 크기 동적 계산
  const baseFontSize = Math.min(width, height) * 0.02;
  const businessFontSize = baseFontSize * 1.8;
  const wifiFontSize = baseFontSize * 1.2;
  const descFontSize = baseFontSize * 0.9;
  
  // 위치 계산
  const qrX = width / 2 - qrSize / 2;
  const qrY = height / 2 - qrSize / 2;
  
  // 업체명 위치 (상단)
  const businessY = height * 0.15;
  const businessHeight = businessFontSize * 1.5;
  
  // WiFi 정보 위치 (QR 아래)
  const wifiY = qrY + qrSize + height * 0.05;
  const wifiHeight = wifiFontSize * 2.5;
  
  // 추가 설명 위치 (하단)
  const descY = height * 0.85;
  const descHeight = descFontSize * 1.5;
  
  return {
    qr: { x: qrX, y: qrY, size: qrSize },
    business: { y: businessY, height: businessHeight, fontSize: businessFontSize },
    wifi: { y: wifiY, height: wifiHeight, fontSize: wifiFontSize },
    desc: { y: descY, height: descHeight, fontSize: descFontSize }
  };
};

export const computeLayout = (
  template: QRTemplate,
  printSize: PrintSize,
  config: LayoutConfig,
  ssid: string,
  password: string
) => {
  const { width, height } = printSize;
  const dynamicLayout = calculateDynamicLayout(printSize, template);
  
  const elements: any[] = [];
  
  // QR 코드
  elements.push({
    id: 'qr',
    type: 'qr',
    x: dynamicLayout.qr.x,
    y: dynamicLayout.qr.y,
    width: dynamicLayout.qr.size,
    height: dynamicLayout.qr.size,
  });
  
  // 업체명
  if (config.businessName) {
    elements.push({
      id: 'business',
      type: 'text',
      x: width * 0.1,
      y: dynamicLayout.business.y,
      width: width * 0.8,
      height: dynamicLayout.business.height,
      textElement: {
        text: config.businessName,
        fontSize: dynamicLayout.business.fontSize,
        fontFamily: config.businessFont || 'Inter',
        fontWeight: 'bold',
        color: template.colors?.text || '#1F2937',
        visible: true,
        textAlign: 'center',
      },
    });
  }
  
  // WiFi 정보
  if (config.showWifiInfo && ssid) {
    // WiFi SSID
    elements.push({
      id: 'wifi-ssid',
      type: 'text',
      x: width * 0.1,
      y: dynamicLayout.wifi.y,
      width: width * 0.8,
      height: dynamicLayout.wifi.height / 2,
      textElement: {
        text: `WiFi: ${ssid}`,
        fontSize: dynamicLayout.wifi.fontSize,
        fontFamily: config.wifiInfoFont || 'Inter',
        fontWeight: 'bold',
        color: template.colors?.text || '#1F2937',
        visible: true,
        textAlign: 'center',
      },
    });
    
    // WiFi Password
    if (password) {
      elements.push({
        id: 'wifi-password',
        type: 'text',
        x: width * 0.1,
        y: dynamicLayout.wifi.y + dynamicLayout.wifi.height / 2,
        width: width * 0.8,
        height: dynamicLayout.wifi.height / 2,
        textElement: {
          text: `비밀번호: ${password}`,
          fontSize: dynamicLayout.wifi.fontSize * 0.9,
          fontFamily: config.wifiInfoFont || 'Inter',
          fontWeight: 'normal',
          color: template.colors?.secondary || '#6B7280',
          visible: true,
          textAlign: 'center',
        },
      });
    }
  }
  
  // 추가 설명
  if (config.additionalText) {
    elements.push({
      id: 'description',
      type: 'text',
      x: width * 0.1,
      y: dynamicLayout.desc.y,
      width: width * 0.8,
      height: dynamicLayout.desc.height,
      textElement: {
        text: config.additionalText,
        fontSize: dynamicLayout.desc.fontSize,
        fontFamily: config.businessFont || 'Inter',
        fontWeight: 'normal',
        color: template.colors?.secondary || '#6B7280',
        visible: true,
        textAlign: 'center',
      },
    });
  }
  
  // 기타 문구
  if (config.otherText) {
    elements.push({
      id: 'other',
      type: 'text',
      x: width * 0.1,
      y: dynamicLayout.desc.y + dynamicLayout.desc.height + height * 0.02,
      width: width * 0.8,
      height: dynamicLayout.desc.height,
      textElement: {
        text: config.otherText,
        fontSize: dynamicLayout.desc.fontSize * 0.9,
        fontFamily: config.businessFont || 'Inter',
        fontWeight: 'normal',
        color: template.colors?.secondary || '#6B7280',
        visible: true,
        textAlign: 'center',
      },
    });
  }
  
  return elements;
};
