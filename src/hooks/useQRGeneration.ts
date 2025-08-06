import { useState, useCallback } from 'react';
import { WiFiConfig, QRTemplate } from '@/types/wifi';
import { PrintSize } from '@/types/size';
import { generateQRCode } from '@/lib/qrGenerator';
import { toast } from 'sonner';

export const useQRGeneration = () => {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isQRGenerated, setIsQRGenerated] = useState(false);

  const generateQR = useCallback(async (
    config: WiFiConfig, 
    template: QRTemplate | null, 
    printSize: PrintSize | null
  ) => {
    if (!template || !config.ssid || !printSize) {
      toast.error('WiFi 정보와 템플릿, 인쇄 크기를 먼저 설정해주세요');
      return null;
    }
    
    setIsGenerating(true);
    try {
      console.log('Generating QR with config:', config);
      const qrDataUrl = await generateQRCode(config, template);
      setQrImage(qrDataUrl);
      setIsQRGenerated(true);
      toast.success('QR 코드가 생성되었습니다!');
      return qrDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('QR 코드 생성에 실패했습니다');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const resetQR = useCallback(() => {
    setQrImage(null);
    setIsQRGenerated(false);
  }, []);

  return {
    qrImage,
    isGenerating,
    isQRGenerated,
    generateQR,
    resetQR
  };
};