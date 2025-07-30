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
}

export interface GeneratedQR {
  dataUrl: string;
  config: WiFiConfig;
  template: QRTemplate;
  timestamp: number;
}