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
  textAlign?: 'left' | 'center' | 'right';
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
        
        // 배경색 (AI 배경 제거, 고정 컬러)
        ctx.fillStyle = template.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        renderElements(ctx, qrImage);
        resolve();
      });
    };

    const renderElements = (ctx: CanvasRenderingContext2D, qrImage: string) => {
      // QR 코드 렌더링
      const qrElement = elements.find(el => el.type === 'qr');
      if (qrElement) {
        const img = new Image();
        img.onload = () => {
          // QR 코드 가독성을 위한 흰색 배경 (템플릿 배경이 어두운 경우 대비)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
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

          // 텍스트 렌더링 (장식 배경 제거, Figma 스타일 존중)
          ctx.font = `${textEl.fontWeight} ${textEl.fontSize}px ${textEl.fontFamily}`;
          ctx.fillStyle = textEl.color;
          ctx.textAlign = textEl.textAlign ?? 'center';
          ctx.textBaseline = 'middle';
          const cx = element.x + element.width / 2;
          const cy = element.y + element.height / 2;
          if (ctx.textAlign === 'left') {
            ctx.fillText(textEl.text, element.x, cy);
          } else if (ctx.textAlign === 'right') {
            ctx.fillText(textEl.text, element.x + element.width, cy);
          } else {
            ctx.fillText(textEl.text, cx, cy);
          }
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