// Centralized layout computation for QR preview and canvas rendering
// Converts template.structure percentages and size enums into absolute pixel elements

import { QRTemplate } from '@/types/wifi';
import { PrintSize } from '@/types/size';

export type FontWeight = 'normal' | 'bold';

export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: FontWeight;
  color: string;
  visible: boolean;
  textAlign?: 'left' | 'center' | 'right';
}

export interface CanvasElement {
  id: string;
  type: 'qr' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  textElement?: TextElement;
}

export interface LayoutInputs {
  businessName: string;
  additionalText: string;
  otherText: string;
  showWifiInfo: boolean;
  businessFont?: string;
  wifiInfoFont?: string;
}

const pctToPx = (pct: string, total: number) => {
  if (!pct.endsWith('%')) return Number(pct) || 0;
  const v = parseFloat(pct.replace('%', ''));
  return Math.round((v / 100) * total);
};

const sizeToRatio = (size: 'small' | 'medium' | 'large') => {
  // Figma 디자인 기준으로 조정된 QR 크기 비율
  switch (size) {
    case 'small':
      return 0.25; // 작은 QR
    case 'large':
      return 0.45; // 큰 QR
    default:
      return 0.35; // 중간 QR
  }
};

export const computeLayout = (
  template: QRTemplate | null,
  printSize: PrintSize | null,
  inputs: LayoutInputs,
  ssid?: string,
  password?: string
): CanvasElement[] => {
  if (!template || !printSize || !template.structure) return [];
  
  const { width: W, height: H } = printSize;
  const s = template.structure;
  const elements: CanvasElement[] = [];

  // QR 요소 계산 - 중앙 정렬 기준
  const qrRatio = sizeToRatio(s.qrPosition.size);
  const qrSide = Math.round(Math.min(W, H) * qrRatio);
  const qrCenterX = pctToPx(s.qrPosition.x, W);
  const qrCenterY = pctToPx(s.qrPosition.y, H);
  const qrX = Math.round(qrCenterX - qrSide / 2);
  const qrY = Math.round(qrCenterY - qrSide / 2);

  elements.push({
    id: 'qr',
    type: 'qr',
    x: qrX,
    y: qrY,
    width: qrSide,
    height: qrSide,
  });

  // 공통 스타일 설정
  const fontFamily = s.fontFamily || 'Noto Sans KR';
  const textColor = s.colors?.text || template.textColor || '#111827';
  const align = s.textAlign || 'center';
  const gap = s.spacing?.elementGap ?? 12;

  // 매장명 텍스트
  if (inputs.businessName) {
    const storeNameX = pctToPx(s.textPositions.storeName.x, W);
    const storeNameY = pctToPx(s.textPositions.storeName.y, H);
    const storeWidth = Math.round(W * 0.8); // 더 넓은 텍스트 영역
    const storeHeight = Math.round(s.fontSizes.storeName * 1.5); // 더 높은 텍스트 높이
    
    elements.push({
      id: 'business',
      type: 'text',
      x: Math.round(storeNameX - storeWidth / 2),
      y: Math.round(storeNameY - storeHeight / 2),
      width: storeWidth,
      height: storeHeight,
      textElement: {
        id: 'business',
        text: inputs.businessName,
        x: Math.round(storeNameX - storeWidth / 2),
        y: Math.round(storeNameY - storeHeight / 2),
        width: storeWidth,
        height: storeHeight,
        fontSize: s.fontSizes.storeName,
        fontFamily,
        fontWeight: 'bold',
        color: textColor,
        visible: true,
        textAlign: align,
      },
    });
  }

  // 추가 설명 텍스트
  if (inputs.additionalText) {
    const descX = pctToPx(s.textPositions.description.x, W);
    const descY = pctToPx(s.textPositions.description.y, H);
    const descWidth = Math.round(W * 0.8);
    const descHeight = Math.round(s.fontSizes.description * 1.5);
    
    elements.push({
      id: 'description',
      type: 'text',
      x: Math.round(descX - descWidth / 2),
      y: Math.round(descY - descHeight / 2),
      width: descWidth,
      height: descHeight,
      textElement: {
        id: 'description',
        text: inputs.additionalText,
        x: Math.round(descX - descWidth / 2),
        y: Math.round(descY - descHeight / 2),
        width: descWidth,
        height: descHeight,
        fontSize: s.fontSizes.description,
        fontFamily,
        fontWeight: 'normal',
        color: textColor,
        visible: true,
        textAlign: align,
      },
    });
  }

  // 기타 라벨 텍스트
  if (inputs.otherText) {
    const otherX = pctToPx(s.textPositions.description.x, W);
    const otherY = pctToPx(s.textPositions.description.y, H) + gap + s.fontSizes.description;
    const otherWidth = Math.round(W * 0.7);
    const otherHeight = Math.round(s.fontSizes.qrLabel * 1.4);
    
    elements.push({
      id: 'other',
      type: 'text',
      x: Math.round(otherX - otherWidth / 2),
      y: Math.round(otherY - otherHeight / 2),
      width: otherWidth,
      height: otherHeight,
      textElement: {
        id: 'other',
        text: inputs.otherText,
        x: Math.round(otherX - otherWidth / 2),
        y: Math.round(otherY - otherHeight / 2),
        width: otherWidth,
        height: otherHeight,
        fontSize: s.fontSizes.qrLabel,
        fontFamily,
        fontWeight: 'normal',
        color: textColor,
        visible: true,
        textAlign: align,
      },
    });
  }

  // WiFi 정보 표시
  if (inputs.showWifiInfo && ssid) {
    const wifiX = pctToPx(s.textPositions.wifiInfo.x, W);
    const wifiY = pctToPx(s.textPositions.wifiInfo.y, H);
    const wifiWidth = Math.round(W * 0.8);
    const wifiLineHeight = Math.round(s.fontSizes.wifiInfo * 1.4);

    // SSID 라인
    elements.push({
      id: 'wifi-ssid',
      type: 'text',
      x: Math.round(wifiX - wifiWidth / 2),
      y: Math.round(wifiY - wifiLineHeight),
      width: wifiWidth,
      height: wifiLineHeight,
      textElement: {
        id: 'wifi-ssid',
        text: `WiFi: ${ssid}`,
        x: Math.round(wifiX - wifiWidth / 2),
        y: Math.round(wifiY - wifiLineHeight),
        width: wifiWidth,
        height: wifiLineHeight,
        fontSize: s.fontSizes.wifiInfo,
        fontFamily,
        fontWeight: 'bold',
        color: textColor,
        visible: true,
        textAlign: align,
      },
    });

    // 비밀번호 라인 (있는 경우만)
    if (password && password.trim()) {
      elements.push({
        id: 'wifi-password',
        type: 'text',
        x: Math.round(wifiX - wifiWidth / 2),
        y: Math.round(wifiY + gap * 0.8),
        width: wifiWidth,
        height: wifiLineHeight,
        textElement: {
          id: 'wifi-password',
          text: `비밀번호: ${password}`,
          x: Math.round(wifiX - wifiWidth / 2),
          y: Math.round(wifiY + gap * 0.8),
          width: wifiWidth,
          height: wifiLineHeight,
          fontSize: Math.max(12, Math.round(s.fontSizes.wifiInfo * 0.9)),
          fontFamily,
          fontWeight: 'normal',
          color: textColor,
          visible: true,
          textAlign: align,
        },
      });
    }
  }

  return elements;
};
