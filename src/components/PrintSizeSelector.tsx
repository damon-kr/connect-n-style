import { PrintSize, printSizes } from '@/types/size';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, Printer } from 'lucide-react';

interface PrintSizeSelectorProps {
  selectedSize: PrintSize | null;
  onSizeSelect: (size: PrintSize) => void;
}

export const PrintSizeSelector = ({ selectedSize, onSizeSelect }: PrintSizeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">인쇄 크기 선택</h3>
        <p className="text-sm text-muted-foreground">원하는 인쇄 크기를 먼저 선택하세요</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {printSizes.map((size) => {
          const isSelected = selectedSize?.id === size.id;
          
          return (
            <Card 
              key={size.id}
              className={cn(
                "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-elegant",
                isSelected && "ring-2 ring-primary shadow-glow"
              )}
              onClick={() => onSizeSelect(size)}
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
                  
                  <p className="text-xs text-muted-foreground">{size.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};