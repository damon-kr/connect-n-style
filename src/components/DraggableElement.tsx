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
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current || !elementRef.current) return;

      const container = containerRef.current.getBoundingClientRect();
      const element = elementRef.current.getBoundingClientRect();
      
      const newX = Math.max(0, Math.min(
        container.width - element.width,
        x + (e.clientX - dragStart.x)
      ));
      const newY = Math.max(0, Math.min(
        container.height - element.height,
        y + (e.clientY - dragStart.y)
      ));

      onPositionChange(id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, x, y, id, onPositionChange, containerRef]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
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
      
      {/* Resize handles */}
      {isSelected && isResizable && onSizeChange && (
        <>
          {/* Corner resize handles */}
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary cursor-se-resize rounded-full"
            onMouseDown={(e) => {
              e.stopPropagation();
              // Handle resize logic here if needed
            }}
          />
        </>
      )}
    </div>
  );
};