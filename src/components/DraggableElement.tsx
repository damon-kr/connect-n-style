import { useState, useRef, useEffect } from 'react';

interface DraggableElementProps {
  id: string;
  children: React.ReactNode;
  x: number;
  y: number;
  width?: number;
  height?: number;
  onPositionChange: (id: string, x: number, y: number) => void;
  onSizeChange?: (id: string, width: number, height: number) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
  containerRef: React.RefObject<HTMLElement>;
  isResizable?: boolean;
}

export const DraggableElement = ({
  id,
  children,
  x,
  y,
  width = 100,
  height = 30,
  onPositionChange,
  onSizeChange,
  isSelected,
  onSelect,
  containerRef,
  isResizable = true,
}: DraggableElementProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !elementRef.current) return;

      if (isDragging) {
        const container = containerRef.current.getBoundingClientRect();
        
        // 더 부드러운 드래그를 위해 계산 방식 개선
        const deltaX = (e.clientX - dragStart.x) * 0.3; // 속도 더 감소
        const deltaY = (e.clientY - dragStart.y) * 0.3;
        
        const newX = Math.max(0, Math.min(
          container.width - width,
          x + deltaX
        ));
        const newY = Math.max(0, Math.min(
          container.height - height,
          y + deltaY
        ));

        onPositionChange(id, newX, newY);
      }

      if (isResizing && onSizeChange) {
        const container = containerRef.current.getBoundingClientRect();
        
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        const newWidth = Math.max(50, Math.min(
          container.width - x,
          resizeStart.width + deltaX
        ));
        const newHeight = Math.max(30, Math.min(
          container.height - y,
          resizeStart.height + deltaY
        ));

        onSizeChange(id, newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, x, y, width, height, id, onPositionChange, onSizeChange, containerRef]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    onSelect(id);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({ 
      x: e.clientX, 
      y: e.clientY, 
      width: width, 
      height: height 
    });
    onSelect(id);
  };

  return (
    <div
      ref={elementRef}
      className={`absolute cursor-move select-none ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      style={{
        left: x,
        top: y,
        width: width,
        height: height,
      }}
      onMouseDown={handleMouseDown}
      onClick={() => onSelect(id)}
    >
      {children}
      
      {/* Resize handles - 항상 표시 */}
      {isResizable && onSizeChange && (
        <>
          {/* Corner resize handle */}
          <div
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary cursor-se-resize rounded-full border-2 border-white shadow-md hover:bg-primary/80 transition-colors"
            onMouseDown={handleResizeStart}
          />
          
          {/* Edge resize handles */}
          <div
            className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-6 bg-primary cursor-e-resize rounded-full border border-white shadow-sm"
            onMouseDown={handleResizeStart}
          />
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-primary cursor-s-resize rounded-full border border-white shadow-sm"
            onMouseDown={handleResizeStart}
          />
        </>
      )}
    </div>
  );
};