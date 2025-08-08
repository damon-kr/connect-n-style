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
  businessFont?: string; // id from select; not used directly (we rely on template structure font)
  wifiInfoFont?: string; // kept for future use
}

const pctToPx = (pct: string, total: number) => {
  if (!pct.endsWith('%')) return Number(pct) || 0;
  const v = parseFloat(pct.replace('%', ''));
  return (v / 100) * total;
};

const sizeToRatio = (size: 'small' | 'medium' | 'large') => {
  // Tuned by Figma reference: large is bold hero, medium default, small compact
  switch (size) {
    case 'small':
      return 0.28;
    case 'large':
      return 0.42;
    default:
      return 0.34;
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

  // QR element
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

  // Common font/color
  const fontFamily = s.fontFamily || 'Noto Sans KR';
  const textColor = s.colors?.text || template.textColor || '#111827';
  const align = s.textAlign || 'center';
  const gap = s.spacing?.elementGap ?? 12;

  // Business/store name
  const storeNameX = pctToPx(s.textPositions.storeName.x, W);
  const storeNameY = pctToPx(s.textPositions.storeName.y, H);
  const storeWidth = Math.round(W * 0.7);
  const storeHeight = Math.round(s.fontSizes.storeName * 1.4);
  if (inputs.businessName) {
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

  // Additional description
  const descX = pctToPx(s.textPositions.description.x, W);
  const descY = pctToPx(s.textPositions.description.y, H);
  const descWidth = Math.round(W * 0.7);
  const descHeight = Math.round(s.fontSizes.description * 1.4);
  if (inputs.additionalText) {
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

  // Other label (optional, small)
  if (inputs.otherText) {
    const otherWidth = Math.round(W * 0.6);
    const otherHeight = Math.round(s.fontSizes.qrLabel * 1.4);
    elements.push({
      id: 'other',
      type: 'text',
      x: Math.round(descX - otherWidth / 2),
      y: Math.round(descY - otherHeight / 2 + gap + otherHeight),
      width: otherWidth,
      height: otherHeight,
      textElement: {
        id: 'other',
        text: inputs.otherText,
        x: Math.round(descX - otherWidth / 2),
        y: Math.round(descY - otherHeight / 2 + gap + otherHeight),
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

  // WiFi info (SSID + password) block
  if (inputs.showWifiInfo) {
    const wifiX = pctToPx(s.textPositions.wifiInfo.x, W);
    const wifiY = pctToPx(s.textPositions.wifiInfo.y, H);
    const wifiWidth = Math.round(W * 0.7);
    const wifiLineHeight = Math.round(s.fontSizes.wifiInfo * 1.4);

    // SSID line
    elements.push({
      id: 'wifi-ssid',
      type: 'text',
      x: Math.round(wifiX - wifiWidth / 2),
      y: Math.round(wifiY - wifiLineHeight),
      width: wifiWidth,
      height: wifiLineHeight,
      textElement: {
        id: 'wifi-ssid',
        text: ssid ? `WIFI : ${ssid}` : 'WIFI :',
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

    // Password line
    elements.push({
      id: 'wifi-password',
      type: 'text',
      x: Math.round(wifiX - wifiWidth / 2),
      y: Math.round(wifiY + gap * 0.6),
      width: wifiWidth,
      height: wifiLineHeight,
      textElement: {
        id: 'wifi-password',
        text: (password ?? '') !== '' ? `PW : ${password}` : 'PW :',
        x: Math.round(wifiX - wifiWidth / 2),
        y: Math.round(wifiY + gap * 0.6),
        width: wifiWidth,
        height: wifiLineHeight,
        fontSize: Math.max(12, Math.round(s.fontSizes.wifiInfo * 0.85)),
        fontFamily,
        fontWeight: 'normal',
        color: textColor,
        visible: true,
        textAlign: align,
      },
    });
  }

  return elements;
};
