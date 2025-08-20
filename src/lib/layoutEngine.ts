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

// 피그마 디자인 패턴 기반 정확한 레이아웃 계산
const calculateDynamicLayout = (printSize: PrintSize, template: QRTemplate) => {
  const { width, height } = printSize;
  const structure = template.structure;
  
  // 안전 영역 설정 (캔버스의 5%)
  const safeMargin = Math.min(width, height) * 0.05;
  const usableWidth = width - (safeMargin * 2);
  const usableHeight = height - (safeMargin * 2);

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  const pct = (s: string) => {
    const n = parseFloat(s);
    return isNaN(n) ? 50 : clamp(n, 5, 95); // 5-95% 범위로 제한
  };

  // QR 크기: 캔버스의 25-30%로 제한
  const sizeMap = { small: 0.25, medium: 0.28, large: 0.30 } as const;
  const qrRatio = structure?.qrPosition?.size ? sizeMap[structure.qrPosition.size] : 0.28;
  const qrSize = Math.min(usableWidth, usableHeight) * qrRatio;

  // 폰트 사이즈: 캔버스 크기에 비례하여 스케일링
  const fontScale = Math.min(width, height) / 400; // 400px 기준으로 스케일링
  const businessFontSize = clamp((structure?.fontSizes?.storeName ?? 28) * fontScale, 16, 48);
  const wifiFontSize = clamp((structure?.fontSizes?.wifiInfo ?? 18) * fontScale, 12, 24);
  const descFontSize = clamp((structure?.fontSizes?.description ?? 14) * fontScale, 10, 20);

  // 위치 계산: structure의 % 좌표를 실제 픽셀로 변환
  const qrX = structure ? 
    clamp((pct(structure.qrPosition.x) / 100) * width - qrSize / 2, safeMargin, width - safeMargin - qrSize) :
    (width / 2) - (qrSize / 2);
    
  const qrY = structure ? 
    clamp((pct(structure.qrPosition.y) / 100) * height - qrSize / 2, safeMargin, height - safeMargin - qrSize) :
    (height / 2) - (qrSize / 2);

  // 텍스트 높이 계산
  const textHeightBusiness = businessFontSize * 1.4;
  const textHeightWifi = wifiFontSize * 2.2;
  const textHeightDesc = descFontSize * 1.4;

  // 텍스트 Y 위치 계산 (구조의 % 좌표 사용)
  const businessY = structure ? 
    clamp((pct(structure.textPositions.storeName.y) / 100) * height - textHeightBusiness / 2, safeMargin, height - safeMargin - textHeightBusiness) :
    safeMargin;
    
  const descY = structure ? 
    clamp((pct(structure.textPositions.description.y) / 100) * height - textHeightDesc / 2, safeMargin, height - safeMargin - textHeightDesc) :
    height - safeMargin - textHeightDesc;
    
  const wifiY = structure ? 
    clamp((pct(structure.textPositions.wifiInfo.y) / 100) * height - textHeightWifi / 2, safeMargin, height - safeMargin - textHeightWifi) :
    height * 0.75;

  return {
    qr: { x: qrX, y: qrY, size: qrSize },
    business: { y: businessY, height: textHeightBusiness, fontSize: businessFontSize },
    wifi: { y: wifiY, height: textHeightWifi, fontSize: wifiFontSize },
    desc: { y: descY, height: textHeightDesc, fontSize: descFontSize },
    other: { y: descY + textHeightDesc + (height * 0.02), height: textHeightDesc, fontSize: descFontSize * 0.9 },
    safeMargin
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
  const structure = template.structure;
  
  // Helper functions
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  const pct = (s: string) => parseFloat(s);
  const isLandscape = width / height > 1;

  const elements: any[] = [];

  // 사용 가능한 전체 영역 계산 (안전 영역 고려)
  const usableWidth = width - (dynamicLayout.safeMargin * 2);
  
  // 안전한 텍스트 블록 폭 계산
  const maxTextWidth = width * 0.8; // 캔버스의 80%로 제한
  const textBlockWidth = Math.min(maxTextWidth, usableWidth * 0.9);
  
  // Helper to compute safe x position from percent
  const cxToLeft = (percentX: number, blockWidth: number) => {
    const centerX = (percentX / 100) * width;
    const leftX = centerX - blockWidth / 2;
    return clamp(leftX, dynamicLayout.safeMargin, width - dynamicLayout.safeMargin - blockWidth);
  };
  
  const textAlign = structure?.textAlign ?? 'center';

  // QR 코드
  elements.push({
    id: 'qr',
    type: 'qr',
    x: dynamicLayout.qr.x,
    y: dynamicLayout.qr.y,
    width: dynamicLayout.qr.size,
    height: dynamicLayout.qr.size,
  });

  // 사용 가능한 전체 영역 계산 (안전 영역 고려)

  // 업체명
  if (config.businessName) {
    const centerX = structure ? pct(structure.textPositions.storeName.x) : 50;
    const left = cxToLeft(centerX, textBlockWidth);
    elements.push({
      id: 'business',
      type: 'text',
      x: left,
      y: dynamicLayout.business.y,
      width: textBlockWidth,
      height: dynamicLayout.business.height,
      textElement: {
        text: config.businessName,
        fontSize: dynamicLayout.business.fontSize,
        fontFamily: config.businessFont || structure?.fontFamily || 'Inter',
        fontWeight: 'bold',
        color: structure?.colors?.text || template.textColor || '#1F2937',
        visible: true,
        textAlign,
      },
    });
  }

  // WiFi 정보
  if (config.showWifiInfo && ssid) {
    const centerX = structure ? pct(structure.textPositions.wifiInfo.x) : 50;
    const wifiBlockWidth = textBlockWidth * 0.9; // WiFi 정보는 조금 더 작게
    const left = cxToLeft(centerX, wifiBlockWidth);

    // SSID
    elements.push({
      id: 'wifi-ssid',
      type: 'text',
      x: left,
      y: dynamicLayout.wifi.y,
      width: wifiBlockWidth,
      height: dynamicLayout.wifi.height / 2,
      textElement: {
        text: `WiFi: ${ssid}`,
        fontSize: dynamicLayout.wifi.fontSize,
        fontFamily: config.wifiInfoFont || structure?.fontFamily || 'Inter',
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: structure?.colors?.text || template.textColor || '#1F2937',
        visible: true,
        textAlign: 'center',
      },
    });

    // Password
    if (password) {
      elements.push({
        id: 'wifi-password',
        type: 'text',
        x: left,
        y: dynamicLayout.wifi.y + dynamicLayout.wifi.height / 2,
        width: wifiBlockWidth,
        height: dynamicLayout.wifi.height / 2,
        textElement: {
          text: `비밀번호: ${password}`,
          fontSize: dynamicLayout.wifi.fontSize * 0.9,
          fontFamily: config.wifiInfoFont || structure?.fontFamily || 'Inter',
          fontWeight: 'normal',
          fontStyle: 'italic',
          color: structure?.colors?.secondary || template.accentColor || '#6B7280',
          visible: true,
          textAlign: 'center',
        },
      });
    }
  }

  // 추가 설명
  if (config.additionalText) {
    const centerX = structure ? pct(structure.textPositions.description.x) : 50;
    const left = cxToLeft(centerX, textBlockWidth);
    elements.push({
      id: 'description',
      type: 'text',
      x: left,
      y: dynamicLayout.desc.y,
      width: textBlockWidth,
      height: dynamicLayout.desc.height,
      textElement: {
        text: config.additionalText,
        fontSize: dynamicLayout.desc.fontSize,
        fontFamily: config.businessFont || structure?.fontFamily || 'Inter',
        fontWeight: 'normal',
        color: structure?.colors?.secondary || template.accentColor || '#6B7280',
        visible: true,
        textAlign,
      },
    });
  }

  // 기타 문구
  if (config.otherText) {
    const centerX = structure ? pct(structure.textPositions.description.x) : 50;
    const left = cxToLeft(centerX, textBlockWidth);
    elements.push({
      id: 'other',
      type: 'text',
      x: left,
      y: dynamicLayout.other.y,
      width: textBlockWidth,
      height: dynamicLayout.other.height,
      textElement: {
        text: config.otherText,
        fontSize: dynamicLayout.other.fontSize,
        fontFamily: config.businessFont || structure?.fontFamily || 'Inter',
        fontWeight: 'normal',
        color: structure?.colors?.secondary || template.accentColor || '#6B7280',
        visible: true,
        textAlign,
      },
    });
  }

  return elements;
};
