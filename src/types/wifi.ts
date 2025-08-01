export interface WiFiConfig {
  ssid: string;
  password: string;
  security: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
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
  backgroundPattern?: 'gradient' | 'dots' | 'lines' | 'none';
  decorativeElements?: ('corners' | 'frame' | 'icons' | 'shapes')[];
  aiGeneratedBackground?: string; // AI generated background image URL
  category?: 'minimal_business' | 'cafe_vintage' | 'modern_bold' | 'friendly_colorful';
}

export interface GeneratedQR {
  dataUrl: string;
  config: WiFiConfig;
  template: QRTemplate;
  timestamp: number;
}