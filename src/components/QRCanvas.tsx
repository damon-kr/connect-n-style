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
  fontStyle?: 'normal' | 'italic';
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

        const drawBackground = () => {
          if (template.aiGeneratedBackground) {
            const bg = new Image();
            bg.onload = () => {
              // cover
              const scale = Math.max(canvas.width / bg.width, canvas.height / bg.height);
              const dw = bg.width * scale;
              const dh = bg.height * scale;
              const dx = (canvas.width - dw) / 2;
              const dy = (canvas.height - dh) / 2;
              ctx.drawImage(bg, dx, dy, dw, dh);
              renderDecorations(ctx);
              renderElements(ctx, qrImage);
              resolve();
            };
            bg.onerror = () => {
              // fallback to solid color
              ctx.fillStyle = template.backgroundColor;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              renderDecorations(ctx);
              renderElements(ctx, qrImage);
              resolve();
            };
            bg.src = template.aiGeneratedBackground;
          } else {
            // solid background
            ctx.fillStyle = template.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            renderDecorations(ctx);
            renderElements(ctx, qrImage);
            resolve();
          }
        };

        drawBackground();
      });
    };
    const renderDecorations = (ctx: CanvasRenderingContext2D) => {
      const w = printSize?.width || 0;
      const h = printSize?.height || 0;
      const decos = template?.decorativeElements || [];
      ctx.save();

      if (decos.includes('clean-border') || decos.includes('frame') || decos.includes('elegant-frame')) {
        ctx.strokeStyle = template.accentColor || '#000';
        ctx.lineWidth = decos.includes('elegant-frame') ? 4 : 2;
        const r = 16;
        ctx.beginPath();
        // rounded rect
        ctx.moveTo(r, 0);
        ctx.arcTo(w, 0, w, h, r);
        ctx.arcTo(w, h, 0, h, r);
        ctx.arcTo(0, h, 0, 0, r);
        ctx.arcTo(0, 0, w, 0, r);
        ctx.closePath();
        ctx.stroke();
      }

      if (decos.includes('corners')) {
        ctx.strokeStyle = template.textColor || '#111';
        ctx.lineWidth = 3;
        const len = Math.min(w, h) * 0.06;
        // corners
        const drawCorner = (x: number, y: number, sx: number, sy: number) => {
          ctx.beginPath();
          ctx.moveTo(x, y + sy * len);
          ctx.lineTo(x, y);
          ctx.lineTo(x + sx * len, y);
          ctx.stroke();
        };
        drawCorner(12, 12, 1, 1);
        drawCorner(w - 12, 12, -1, 1);
        drawCorner(12, h - 12, 1, -1);
        drawCorner(w - 12, h - 12, -1, -1);
      }

      if (decos.includes('geometric-shapes') || decos.includes('color-accents')) {
        // subtle circle behind QR area
        ctx.fillStyle = `${template.accentColor}22`;
        const r = Math.min(w, h) * 0.18;
        ctx.beginPath();
        ctx.arc(w * 0.72, h * 0.48, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };
    const renderElements = (ctx: CanvasRenderingContext2D, qrImage: string) => {
      // QR 코드 렌더링
      const qrElement = elements.find(el => el.type === 'qr');
      if (qrElement) {
        const img = new Image();
        img.onload = () => {
          // QR 코드 가독성을 위한 흰색 배경
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

          ctx.font = `${textEl.fontStyle ?? 'normal'} ${textEl.fontWeight} ${textEl.fontSize}px ${textEl.fontFamily}`;
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