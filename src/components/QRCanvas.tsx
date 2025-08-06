import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { QRTemplate } from '@/types/wifi';
import { PrintSize } from '@/types/size';

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  color: string;
  visible: boolean;
}

interface CanvasElement {
  id: string;
  type: 'qr' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  textElement?: TextElement;
}

interface QRCanvasProps {
  template: QRTemplate | null;
  printSize: PrintSize | null;
  elements: CanvasElement[];
  qrDataUrl: string | null;
}

export interface QRCanvasRef {
  renderToCanvas: () => Promise<void>;
  getCanvasDataUrl: () => string | null;
}

export const QRCanvas = forwardRef<QRCanvasRef, QRCanvasProps>(
  ({ template, printSize, elements, qrDataUrl }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
      renderToCanvas: async () => {
        if (!qrDataUrl) return;
        await renderToCanvas(qrDataUrl);
      },
      getCanvasDataUrl: () => {
        const canvas = canvasRef.current;
        return canvas ? canvas.toDataURL() : null;
      }
    }));

    const renderToCanvas = async (qrImage: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const canvas = canvasRef.current;
        if (!canvas || !template || !printSize) {
          reject(new Error('Canvas not ready'));
          return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        canvas.width = printSize.width;
        canvas.height = printSize.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // AI 생성 배경 또는 기본 배경
        if (template.aiGeneratedBackground) {
          const bgImg = new Image();
          bgImg.onload = () => {
            // 배경 이미지 비율 맞춤
            const bgAspectRatio = bgImg.width / bgImg.height;
            const canvasAspectRatio = canvas.width / canvas.height;
            
            let drawWidth = canvas.width;
            let drawHeight = canvas.height;
            let offsetX = 0;
            let offsetY = 0;
            
            if (bgAspectRatio > canvasAspectRatio) {
              drawHeight = canvas.height;
              drawWidth = drawHeight * bgAspectRatio;
              offsetX = (canvas.width - drawWidth) / 2;
            } else {
              drawWidth = canvas.width;
              drawHeight = drawWidth / bgAspectRatio;
              offsetY = (canvas.height - drawHeight) / 2;
            }
            
            ctx.drawImage(bgImg, offsetX, offsetY, drawWidth, drawHeight);
            renderElements(ctx, qrImage);
            resolve();
          };
          
          bgImg.onerror = () => {
            // 배경 로드 실패시 기본 배경
            ctx.fillStyle = template.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            renderElements(ctx, qrImage);
            resolve();
          };
          
          bgImg.src = template.aiGeneratedBackground;
        } else {
          // 기본 배경색
          ctx.fillStyle = template.backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          renderElements(ctx, qrImage);
          resolve();
        }
      });
    };

    const renderElements = (ctx: CanvasRenderingContext2D, qrImage: string) => {
      // QR 코드 렌더링
      const qrElement = elements.find(el => el.type === 'qr');
      if (qrElement) {
        const img = new Image();
        img.onload = () => {
          // QR 코드 가독성을 위한 흰색 배경
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.fillRect(qrElement.x - 10, qrElement.y - 10, qrElement.width + 20, qrElement.height + 20);
          
          // QR 코드 그리기
          ctx.drawImage(img, qrElement.x, qrElement.y, qrElement.width, qrElement.height);
          
          // 텍스트 요소들 렌더링
          renderTextElements(ctx);
        };
        img.src = qrImage;
      }
    };

    const renderTextElements = (ctx: CanvasRenderingContext2D) => {
      elements.forEach(element => {
        if (element.type === 'text' && element.textElement?.visible) {
          const textEl = element.textElement;
          
          // 텍스트 가독성을 위한 반투명 배경
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(element.x - 8, element.y - 5, element.width + 16, element.height + 10);
          
          // 텍스트 테두리
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.lineWidth = 1;
          ctx.strokeRect(element.x - 8, element.y - 5, element.width + 16, element.height + 10);
          
          // 텍스트 렌더링
          ctx.font = `${textEl.fontWeight} ${textEl.fontSize}px ${textEl.fontFamily}`;
          ctx.fillStyle = textEl.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(textEl.text, element.x + element.width / 2, element.y + element.height / 2);
        }
      });
    };

    return (
      <canvas
        ref={canvasRef}
        className="hidden"
        style={{ imageRendering: 'pixelated' }}
      />
    );
  }
);

QRCanvas.displayName = 'QRCanvas';