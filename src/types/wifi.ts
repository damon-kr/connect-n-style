export interface WiFiConfig {
  ssid: string;
  password: string;
  security: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
}

export interface TemplateStructure {
  layout: 'center' | 'side' | 'asymmetric' | 'vertical_centered' | 'horizontal_split' | 'top_heavy' | 'bottom_heavy' | 'tag_style';
  fontFamily: string;
  fontSizes: { 
    storeName: number; 
    wifiInfo: number; 
    description: number;
    qrLabel: number;
  };
  textAlign: 'left' | 'center' | 'right';
  spacing: {
    padding: number;
    marginTop: number;
    marginBottom: number;
    elementGap: number;
  };
  decorativeElements: string[];
  qrPosition: {
    x: string;
    y: string;
    size: 'small' | 'medium' | 'large';
  };
  textPositions: {
    storeName: { x: string; y: string };
    wifiInfo: { x: string; y: string };
    description: { x: string; y: string };
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export interface QRTemplate {
  id: string;
  name: string;
  description: string;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  borderStyle: 'none' | 'solid' | 'dashed' | 'rounded';
  icon?: string;
  layout: 'center' | 'top' | 'bottom' | 'split-left' | 'split-right' | 'vertical_centered' | 'horizontal_split' | 'top_heavy' | 'bottom_heavy' | 'tag_style';
  qrSizeRatio: 'small' | 'medium' | 'large';
  backgroundPattern?: 'gradient' | 'dots' | 'lines' | 'none' | 'subtle-texture' | 'subtle-lines';
  decorativeElements?: ('corners' | 'frame' | 'icons' | 'shapes' | 'vintage-frame' | 'coffee-icons' | 'professional-frame' | 'geometric-shapes' | 'color-accents')[];
  aiGeneratedBackground?: string; // AI generated background image URL
  category?: 'minimal_business' | 'cafe_vintage' | 'modern_bold' | 'friendly_colorful' | 'hospital_clean' | 'restaurant_elegant' | 'tag_style';
  structure?: TemplateStructure; // New: concept-specific structure
}

export interface AIGeneratedTemplate {
  id: string;
  name: string;
  generatedImageUrl: string; // AI 생성 배경 이미지
  layoutType: 'vertical_centered' | 'horizontal_split' | 'top_heavy' | 'bottom_heavy' | 'tag_style';
  printOptimized: boolean;
  category: 'minimal_business' | 'cafe_vintage' | 'modern_bold' | 'friendly_colorful' | 'hospital_clean' | 'restaurant_elegant' | 'tag_style';
  prompt: string;
  structure?: TemplateStructure; // 구조 정보 추가
}

export interface GeneratedQR {
  dataUrl: string;
  config: WiFiConfig;
  template: QRTemplate;
  timestamp: number;
}