import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export interface TextPosition {
  id: string;
  name: string;
  x: number; // 0-1 범위
  y: number; // 0-1 범위
  align: 'left' | 'center' | 'right';
  icon: React.ReactNode;
}

export const textPositions: TextPosition[] = [
  { 
    id: 'top-center', 
    name: '상단 중앙', 
    x: 0.5, 
    y: 0.15, 
    align: 'center',
    icon: <AlignCenter size={16} />
  },
  { 
    id: 'bottom-center', 
    name: '하단 중앙', 
    x: 0.5, 
    y: 0.85, 
    align: 'center',
    icon: <AlignCenter size={16} />
  },
  { 
    id: 'left-center', 
    name: '좌측 중앙', 
    x: 0.15, 
    y: 0.5, 
    align: 'left',
    icon: <AlignLeft size={16} />
  },
  { 
    id: 'right-center', 
    name: '우측 중앙', 
    x: 0.85, 
    y: 0.5, 
    align: 'right',
    icon: <AlignRight size={16} />
  }
];

interface TextPositionSelectorProps {
  selectedPosition: TextPosition | null;
  onPositionChange: (position: TextPosition) => void;
}

export const TextPositionSelector = ({ selectedPosition, onPositionChange }: TextPositionSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">텍스트 위치</Label>
      <div className="grid grid-cols-2 gap-2">
        {textPositions.map((position) => (
          <Button
            key={position.id}
            variant={selectedPosition?.id === position.id ? "default" : "outline"}
            onClick={() => onPositionChange(position)}
            className="h-16 flex flex-col items-center justify-center gap-1 text-xs"
          >
            {position.icon}
            <span>{position.name}</span>
          </Button>
        ))}
      </div>
      
      {selectedPosition && (
        <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
          선택됨: {selectedPosition.name}
        </div>
      )}
    </div>
  );
};