import QRCode from 'qrcode';
import { WiFiConfig } from '@/types/wifi';

export const generateWiFiQRString = (config: WiFiConfig): string => {
  const { ssid, password, security, hidden = false } = config;
  
  // WiFi QR code format: WIFI:T:WPA;S:mynetwork;P:mypass;H:false;;
  return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden};;`;
};

export const generateQRCode = async (
  wifiString: string,
  options: QRCode.QRCodeToDataURLOptions = {}
): Promise<string> => {
  const defaultOptions: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    quality: 0.92,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    width: 512,
    ...options
  };

  try {
    return await QRCode.toDataURL(wifiString, defaultOptions);
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const validateWiFiConfig = (config: WiFiConfig): string[] => {
  const errors: string[] = [];
  
  if (!config.ssid.trim()) {
    errors.push('WiFi network name (SSID) is required');
  }
  
  if (config.security !== 'nopass' && !config.password.trim()) {
    errors.push('Password is required for secured networks');
  }
  
  if (config.ssid.length > 32) {
    errors.push('WiFi network name cannot exceed 32 characters');
  }
  
  if (config.password.length > 63) {
    errors.push('Password cannot exceed 63 characters');
  }
  
  return errors;
};