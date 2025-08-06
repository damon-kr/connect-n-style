import { QRTemplate } from '@/types/wifi';
import { PrintSize } from '@/types/size';
import { qrTemplates } from '@/data/templates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
  selectedTemplate: QRTemplate | null;
  onTemplateSelect: (template: QRTemplate) => void;
  printSize?: PrintSize;
}

export const TemplateSelector = ({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette size={20} className="text-primary" />
          디자인 템플릿 선택
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          4가지 전문 디자인 템플릿 중 선택해주세요
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {qrTemplates.map((template) => {
            const isSelected = selectedTemplate?.id === template.id;
            const structure = template.structure;
            
            return (
              <Card 
                key={template.id} 
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden",
                  isSelected ? "ring-2 ring-primary shadow-elegant" : "hover:shadow-md"
                )}
                onClick={() => onTemplateSelect(template)}
              >
                <CardContent className="p-0 relative h-48">
                  {/* 템플릿 미리보기 배경 */}
                  <div 
                    className="absolute inset-0"
                    style={{ backgroundColor: template.backgroundColor }}
                  >
                    {/* 배경 패턴 */}
                    {template.backgroundPattern === 'gradient' && (
                      <div 
                        className="absolute inset-0 opacity-20"
                        style={{ 
                          background: `linear-gradient(135deg, ${template.accentColor}22, ${template.textColor}11)`
                        }}
                      />
                    )}
                    {template.backgroundPattern === 'subtle-texture' && (
                      <div 
                        className="absolute inset-0 opacity-10"
                        style={{ 
                          backgroundImage: `radial-gradient(circle at 2px 2px, ${template.accentColor} 1px, transparent 0)`,
                          backgroundSize: '20px 20px'
                        }}
                      />
                    )}
                    {template.backgroundPattern === 'subtle-lines' && (
                      <div 
                        className="absolute inset-0 opacity-15"
                        style={{ 
                          backgroundImage: `linear-gradient(90deg, ${template.accentColor}33 1px, transparent 1px)`,
                          backgroundSize: '30px 30px'
                        }}
                      />
                    )}
                  </div>
                  
                  {/* 템플릿 레이아웃 미리보기 */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    {/* 매장명 영역 (노랑) */}
                    <div className="flex justify-center">
                      <div 
                        className="px-3 py-1 rounded text-xs font-bold truncate max-w-[120px]"
                        style={{ 
                          backgroundColor: '#FEF3C7',
                          color: template.textColor,
                          fontFamily: structure?.fontFamily || 'Noto Sans KR'
                        }}
                      >
                        {template.name}
                      </div>
                    </div>
                    
                    {/* QR 코드 영역 중앙 */}
                    <div className="flex justify-center items-center">
                      <div 
                        className="border-2 border-dashed flex items-center justify-center"
                        style={{ 
                          borderColor: template.accentColor,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          width: template.qrSizeRatio === 'large' ? '60px' : template.qrSizeRatio === 'small' ? '40px' : '50px',
                          height: template.qrSizeRatio === 'large' ? '60px' : template.qrSizeRatio === 'small' ? '40px' : '50px'
                        }}
                      >
                        <div className="grid grid-cols-4 gap-0.5 w-6 h-6">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div
                              key={i}
                              className="aspect-square"
                              style={{
                                backgroundColor: Math.random() > 0.5 ? template.textColor : 'transparent'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* 와이파이 정보 영역 (초록) */}
                    <div className="flex justify-center">
                      <div 
                        className="px-2 py-1 rounded text-[10px] truncate max-w-[100px]"
                        style={{ 
                          backgroundColor: '#D1FAE5',
                          color: template.textColor
                        }}
                      >
                        WiFi 정보
                      </div>
                    </div>
                    
                    {/* 기타 문구 영역 (파랑) */}
                    <div className="flex justify-center">
                      <div 
                        className="px-2 py-0.5 rounded text-[8px] truncate max-w-[80px]"
                        style={{ 
                          backgroundColor: '#DBEAFE',
                          color: template.accentColor
                        }}
                      >
                        {template.description}
                      </div>
                    </div>
                  </div>
                  
                  {/* 선택 표시 */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-20">
                      <CheckCircle className="text-green-500 bg-white rounded-full shadow-lg" size={20} />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};