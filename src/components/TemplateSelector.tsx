import { QRTemplate } from '@/types/wifi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
  templates: QRTemplate[];
  selectedTemplate: QRTemplate | null;
  onTemplateSelect: (template: QRTemplate) => void;
}

export const TemplateSelector = ({ templates, selectedTemplate, onTemplateSelect }: TemplateSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Palette size={18} className="text-primary" />
          템플릿 선택
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {templates.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 border-2 border-dashed border-muted rounded-lg">
            AI 템플릿을 먼저 생성해주세요
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {templates.map((template) => {
              const isSelected = selectedTemplate?.id === template.id;
              const structure = template.structure;

              return (
                <Card
                  key={template.id}
                  className={cn(
                    'cursor-pointer transition-all duration-300 hover:shadow-sm relative overflow-hidden',
                    isSelected ? 'ring-2 ring-primary shadow-elegant' : 'hover:shadow-sm'
                  )}
                  onClick={() => onTemplateSelect(template)}
                >
                  <CardContent className="p-0 relative h-40">
                    {/* 배경 */}
                    <div className="absolute inset-0" style={{ backgroundColor: template.backgroundColor }}>
                      {template.backgroundPattern === 'gradient' && (
                        <div
                          className="absolute inset-0 opacity-15"
                          style={{ background: `linear-gradient(135deg, ${template.accentColor}22, ${template.textColor}11)` }}
                        />
                      )}
                    </div>

                    {/* 간결 미리보기 */}
                    <div className="absolute inset-0 p-3 flex flex-col justify-between">
                      {/* 매장명(노랑) */}
                      <div className="flex justify-center">
                        <div
                          className="px-2 py-1 rounded text-[10px] font-bold truncate max-w-[100px]"
                          style={{
                            backgroundColor: '#FEF3C7',
                            color: template.textColor,
                            fontFamily: structure?.fontFamily || 'Noto Sans KR',
                          }}
                        >
                          {template.name}
                        </div>
                      </div>

                      {/* QR 더미 */}
                      <div className="flex justify-center items-center">
                        <div
                          className="border-2 border-dashed flex items-center justify-center"
                          style={{
                            borderColor: template.accentColor,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            width:
                              template.qrSizeRatio === 'large' ? '56px' : template.qrSizeRatio === 'small' ? '40px' : '48px',
                            height:
                              template.qrSizeRatio === 'large' ? '56px' : template.qrSizeRatio === 'small' ? '40px' : '48px',
                          }}
                        >
                          <div className="grid grid-cols-4 gap-0.5 w-5 h-5">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div
                                key={i}
                                className="aspect-square"
                                style={{ backgroundColor: Math.random() > 0.5 ? template.textColor : 'transparent' }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 기타 문구(파랑) */}
                      <div className="flex justify-center">
                        <div
                          className="px-2 py-0.5 rounded text-[9px] truncate max-w-[90px]"
                          style={{ backgroundColor: '#DBEAFE', color: template.accentColor }}
                        >
                          {template.description}
                        </div>
                      </div>
                    </div>

                    {/* 선택 표시 */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-20">
                        <CheckCircle className="text-green-500 bg-white rounded-full shadow-lg" size={18} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
