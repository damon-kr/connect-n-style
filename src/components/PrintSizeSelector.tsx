import { PrintSize, printSizes, PrintOrientation, printOrientations, getOrientedSize } from '@/types/size';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, Printer, Monitor, Smartphone } from 'lucide-react';

interface PrintSizeSelectorProps {
  selectedSize: PrintSize | null;
  selectedOrientation: PrintOrientation['id'];
  onSizeSelect: (size: PrintSize) => void;
  onOrientationSelect: (orientation: PrintOrientation['id']) => void;
}

export const PrintSizeSelector = ({ selectedSize, selectedOrientation, onSizeSelect, onOrientationSelect }: PrintSizeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">인쇄 크기 선택</h3>
        <p className="text-sm text-muted-foreground">원하는 인쇄 크기와 방향을 선택하세요</p>
      </div>
      
      {/* 방향 선택 */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">방향</h4>
        <div className="grid grid-cols-2 gap-2">
          {printOrientations.map((orientation) => {
            const isSelected = selectedOrientation === orientation.id;
            const IconComponent = orientation.icon === 'monitor' ? Monitor : Smartphone;
            
            return (
              <Card 
                key={orientation.id}
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:scale-105",
                  isSelected && "ring-2 ring-primary shadow-glow"
                )}
                onClick={() => onOrientationSelect(orientation.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <div className="bg-primary text-primary-foreground rounded-full p-1">
                        <Check size={10} />
                      </div>
                    )}
                    <IconComponent size={16} className="text-primary" />
                    <span className="text-sm font-medium">{orientation.name}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      {/* 크기 선택 */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">크기</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {printSizes.map((size) => {
            const isSelected = selectedSize?.id === size.id;
            const orientedSize = getOrientedSize(size, selectedOrientation);
            
            return (
              <Card 
                key={size.id}
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-elegant",
                  isSelected && "ring-2 ring-primary shadow-glow"
                )}
                onClick={() => onSizeSelect(orientedSize)}
              >
                <CardContent className="p-3">
                  <div className="relative">
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 z-10">
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                          <Check size={10} />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Printer size={16} className="text-primary" />
                      <h4 className="font-medium text-sm text-foreground">{size.name}</h4>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1">{size.description}</p>
                    <p className="text-xs text-primary font-mono">
                      {orientedSize.width} × {orientedSize.height}px
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
         </div>
      </div>
    </div>
  );
};