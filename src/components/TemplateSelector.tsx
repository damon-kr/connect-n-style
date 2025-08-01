import { useState } from 'react';
import { QRTemplate } from '@/types/wifi';
import { PrintSize } from '@/types/size';
import { qrTemplates } from '@/data/templates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIDesignGenerator } from '@/components/AIDesignGenerator';

interface TemplateSelectorProps {
  selectedTemplate: QRTemplate | null;
  onTemplateSelect: (template: QRTemplate) => void;
  printSize?: PrintSize;
}

export const TemplateSelector = ({ selectedTemplate, onTemplateSelect, printSize }: TemplateSelectorProps) => {
  const [allTemplates, setAllTemplates] = useState<QRTemplate[]>(qrTemplates);
  
  const handleAITemplatesGenerated = (aiTemplates: QRTemplate[]) => {
    setAllTemplates([...aiTemplates, ...qrTemplates]);
  };
  
  return (
    <div className="space-y-6">
      {/* AI 템플릿 생성 섹션 */}
      <AIDesignGenerator onTemplateGenerated={handleAITemplatesGenerated} />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            디자인 템플릿 선택
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            생성된 AI 템플릿 또는 기본 템플릿을 선택해주세요
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {allTemplates.map((template) => {
              const isSelected = selectedTemplate?.id === template.id;
              
              return (
                <Card 
                  key={template.id} 
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:scale-105 relative overflow-hidden",
                    isSelected ? "ring-2 ring-primary ring-offset-2" : ""
                  )}
                  onClick={() => onTemplateSelect(template)}
                  style={{
                    backgroundColor: template.backgroundColor,
                    borderColor: template.accentColor,
                    borderWidth: template.borderStyle !== 'none' ? '2px' : '1px',
                    borderStyle: template.borderStyle === 'dashed' ? 'dashed' : 'solid',
                    borderRadius: template.borderStyle === 'rounded' ? '12px' : '8px'
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-3">
                      {/* QR 패턴 미리보기 */}
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <div 
                          className="grid grid-cols-5 gap-0.5 w-12 h-12"
                        >
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div
                              key={i}
                              className="aspect-square rounded-sm"
                              style={{
                                backgroundColor: Math.random() > 0.4 ? template.textColor : 'transparent'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <h4 className="font-medium text-sm" style={{ color: template.textColor }}>
                          {template.name}
                        </h4>
                        <p className="text-xs mt-1" style={{ color: template.accentColor }}>
                          {template.description}
                        </p>
                      </div>
                      
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="text-primary bg-white rounded-full" size={20} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};