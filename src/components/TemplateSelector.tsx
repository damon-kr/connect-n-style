import { QRTemplate } from '@/types/wifi';
import { qrTemplates } from '@/data/templates';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Wifi, Coffee, Building, Palette, Leaf, Monitor, Crown, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
  selectedTemplate: QRTemplate | null;
  onTemplateSelect: (template: QRTemplate) => void;
}

const iconMap = {
  wifi: Wifi,
  coffee: Coffee,
  building: Building,
  palette: Palette,
  leaf: Leaf,
  monitor: Monitor,
  crown: Crown,
  radio: Radio,
};

export const TemplateSelector = ({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Choose Design Template</h3>
        <p className="text-sm text-muted-foreground">Select a template that matches your business style</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {qrTemplates.map((template) => {
          const IconComponent = iconMap[template.icon as keyof typeof iconMap] || Wifi;
          const isSelected = selectedTemplate?.id === template.id;
          
          return (
            <Card 
              key={template.id}
              className={cn(
                "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-elegant",
                isSelected && "ring-2 ring-primary shadow-glow"
              )}
              onClick={() => onTemplateSelect(template)}
            >
              <CardContent className="p-4">
                <div className="relative">
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-primary text-primary-foreground rounded-full p-1">
                        <Check size={12} />
                      </div>
                    </div>
                  )}
                  
                  {/* Template Preview */}
                  <div 
                    className="w-full h-24 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: template.backgroundColor }}
                  >
                    <div 
                      className={cn(
                        "w-16 h-16 rounded flex items-center justify-center",
                        template.borderStyle === 'solid' && "border-2",
                        template.borderStyle === 'dashed' && "border-2 border-dashed",
                        template.borderStyle === 'rounded' && "border border-opacity-30"
                      )}
                      style={{ 
                        backgroundColor: template.accentColor + '20',
                        borderColor: template.accentColor,
                      }}
                    >
                      <IconComponent 
                        size={20} 
                        style={{ color: template.accentColor }}
                      />
                    </div>
                    
                    {/* Sample QR pattern */}
                    <div className="absolute top-2 right-2 w-6 h-6 grid grid-cols-3 gap-px">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div 
                          key={i}
                          className="w-1 h-1 rounded-sm"
                          style={{ 
                            backgroundColor: Math.random() > 0.5 ? template.textColor : 'transparent' 
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-foreground mb-1">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};