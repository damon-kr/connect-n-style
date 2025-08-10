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
  const isLandscape = aspectRatio > 1;
  const structure = template.structure;

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  const pct = (s: string) => {
    const n = parseFloat(s);
    return isNaN(n) ? 50 : n;
  };

  // QR 크기: 구조 우선, 없으면 비율로
  const sizeMap = { small: 0.28, medium: 0.36, large: 0.46 } as const;
  const qrRatio = structure?.qrPosition?.size ? sizeMap[structure.qrPosition.size] : (isLandscape ? 0.375 : 0.525);
  const qrSize = Math.min(width, height) * qrRatio;

  // 폰트 사이즈: 구조 값(피그마 pt 유사)을 인쇄 크기에 맞춰 스케일
  const base = Math.min(width, height) / 300;
  const businessFontSize = (structure?.fontSizes?.storeName ?? 24) * base;
  const wifiFontSize = (structure?.fontSizes?.wifiInfo ?? 16) * base;
  const descFontSize = (structure?.fontSizes?.description ?? 12) * base;

  const gap = height * 0.04;

  // 위치: 구조의 퍼센트 우선 사용
  let qrX = structure ? (pct(structure.qrPosition.x) / 100) * width - qrSize / 2 : width / 2 - qrSize / 2;
  let qrY = structure ? (pct(structure.qrPosition.y) / 100) * height - qrSize / 2 : height / 2 - qrSize / 2;

  // 텍스트 블록 크기(폭/높이)
  const textBlockWidth = isLandscape ? width * 0.42 : width * 0.8;
  const textHeightBusiness = businessFontSize * 1.6;
  const textHeightWifi = wifiFontSize * 2.6;
  const textHeightDesc = descFontSize * 1.6;

  // 텍스트 Y: 구조 좌표 있으면 해당 퍼센트 사용
  let businessY = structure ? (pct(structure.textPositions.storeName.y) / 100) * height - textHeightBusiness / 2 : height * (isLandscape ? 0.25 : 0.12);
  let descY = structure ? (pct(structure.textPositions.description.y) / 100) * height - textHeightDesc / 2 : businessY + textHeightBusiness + gap;
  let wifiY = structure ? (pct(structure.textPositions.wifiInfo.y) / 100) * height - textHeightWifi / 2 : (isLandscape ? (qrY + qrSize + gap) : (descY + textHeightDesc + qrSize + gap));
  let otherY = isLandscape ? descY + textHeightDesc + gap : (qrY + qrSize + gap);

  // 경계 클램프
  qrX = clamp(qrX, width * 0.05, width * 0.95 - qrSize);
  qrY = clamp(qrY, height * 0.08, height * 0.92 - qrSize);
  businessY = clamp(businessY, height * 0.06, height * 0.9 - textHeightBusiness);
  descY = clamp(descY, height * 0.06, height * 0.94 - textHeightDesc);
  wifiY = clamp(wifiY, height * 0.06, height * 0.94 - textHeightWifi);
  otherY = clamp(otherY, height * 0.06, height * 0.94 - textHeightDesc);

  return {
    qr: { x: qrX, y: qrY, size: qrSize },
    business: { y: businessY, height: textHeightBusiness, fontSize: businessFontSize },
    wifi: { y: wifiY, height: textHeightWifi, fontSize: wifiFontSize },
    desc: { y: descY, height: textHeightDesc, fontSize: descFontSize },
    other: { y: otherY, height: textHeightDesc, fontSize: descFontSize * 0.9 }
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
  const pct = (s: string) => parseFloat(s);
  const isLandscape = width / height > 1;

  const elements: any[] = [];

  // Helper to compute centered x from percent and block width
  const cxToLeft = (percentX: number, blockWidth: number) => (percentX / 100) * width - blockWidth / 2;
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

  // 텍스트폭 기본값
  const leftTextWidth = isLandscape ? width * 0.42 : width * 0.8;
  const rightTextWidth = isLandscape ? width * 0.37 : width * 0.8;

  // 업체명
  if (config.businessName) {
    const centerX = structure ? pct(structure.textPositions.storeName.x) : (isLandscape ? 29 : 50);
    const left = cxToLeft(centerX, leftTextWidth);
    elements.push({
      id: 'business',
      type: 'text',
      x: left,
      y: dynamicLayout.business.y,
      width: leftTextWidth,
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
    const centerX = structure ? pct(structure.textPositions.wifiInfo.x) : (isLandscape ? 72 : 50);
    const left = cxToLeft(centerX, rightTextWidth);

    // SSID
    elements.push({
      id: 'wifi-ssid',
      type: 'text',
      x: left,
      y: dynamicLayout.wifi.y,
      width: rightTextWidth,
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
        width: rightTextWidth,
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
    const centerX = structure ? pct(structure.textPositions.description.x) : (isLandscape ? 29 : 50);
    const left = cxToLeft(centerX, leftTextWidth);
    elements.push({
      id: 'description',
      type: 'text',
      x: left,
      y: dynamicLayout.desc.y,
      width: leftTextWidth,
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
    const centerX = structure ? pct(structure.textPositions.description.x) : (isLandscape ? 29 : 50);
    const left = cxToLeft(centerX, leftTextWidth);
    elements.push({
      id: 'other',
      type: 'text',
      x: left,
      y: dynamicLayout.other.y,
      width: leftTextWidth,
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
