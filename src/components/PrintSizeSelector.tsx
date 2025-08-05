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
                <CardContent className="p-2">
                  <div className="flex items-center gap-1">
                    {isSelected && (
                      <div className="bg-primary text-primary-foreground rounded-full p-0.5">
                        <Check size={8} />
                      </div>
                    )}
                    <IconComponent size={12} className="text-primary flex-shrink-0" />
                    <span className="text-xs font-medium truncate">{orientation.name}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                 <CardContent className="p-2">
                   <div className="relative">
                     {isSelected && (
                       <div className="absolute -top-1 -right-1 z-10">
                         <div className="bg-primary text-primary-foreground rounded-full p-1">
                           <Check size={8} />
                         </div>
                       </div>
                     )}
                     
                     <div className="flex items-start gap-1 mb-1">
                       <Printer size={12} className="text-primary mt-0.5 flex-shrink-0" />
                       <h4 className="font-medium text-xs text-foreground leading-tight break-words">{size.name}</h4>
                     </div>
                     
                     <p className="text-xs text-muted-foreground mb-1 leading-tight break-words">{size.description}</p>
                     <p className="text-xs text-primary font-mono leading-tight">
                       {orientedSize.width}×{orientedSize.height}px
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