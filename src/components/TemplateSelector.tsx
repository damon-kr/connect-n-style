import { QRTemplate } from '@/types/wifi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Palette, Sparkles } from 'lucide-react';
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
          {templates.length > 0 && (
            <span className="text-xs text-muted-foreground ml-2">
              {templates.length}개 생성됨
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {templates.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 border-2 border-dashed border-muted rounded-lg">
            <Sparkles className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm">AI 템플릿을 먼저 생성해주세요</p>
            <p className="text-xs mt-1">업종/컨셉을 선택하면 맞춤 템플릿이 생성됩니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {templates.map((template) => {
              const isSelected = selectedTemplate?.id === template.id;
              const structure = template.structure;

              return (
                <Card
                  key={template.id}
                  className={cn(
                    'cursor-pointer transition-all duration-300 hover:shadow-md relative overflow-hidden group',
                    isSelected ? 'ring-2 ring-primary shadow-lg scale-105' : 'hover:shadow-md hover:scale-102'
                  )}
                  onClick={() => onTemplateSelect(template)}
                >
                  <CardContent className="p-0 relative h-32">
                    {/* 배경 */}
                    <div 
                      className="absolute inset-0 transition-all duration-300"
                      style={{ backgroundColor: template.backgroundColor }}
                    >
                      {template.backgroundPattern === 'gradient' && (
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{ background: `linear-gradient(135deg, ${template.accentColor}22, ${template.textColor}11)` }}
                        />
                      )}
                      {template.backgroundPattern === 'dots' && (
                        <div className="absolute inset-0 opacity-10">
                          <div className="w-full h-full" style={{
                            backgroundImage: `radial-gradient(circle, ${template.accentColor} 1px, transparent 1px)`,
                            backgroundSize: '8px 8px'
                          }} />
                        </div>
                      )}
                      {template.backgroundPattern === 'subtle-lines' && (
                        <div className="absolute inset-0 opacity-5">
                          <div className="w-full h-full" style={{
                            backgroundImage: `linear-gradient(45deg, ${template.accentColor} 1px, transparent 1px)`,
                            backgroundSize: '12px 12px'
                          }} />
                        </div>
                      )}
                    </div>

                    {/* 피그마 스타일 미리보기 */}
                    <div className="absolute inset-0 p-2 flex flex-col justify-between">
                      {/* 매장명 (노랑 배경) */}
                      <div className="flex justify-center">
                        <div
                          className="px-2 py-1 rounded text-[9px] font-bold truncate max-w-[80px] transition-all duration-300 group-hover:scale-105"
                          style={{
                            backgroundColor: '#FEF3C7',
                            color: template.textColor,
                            fontFamily: structure?.fontFamily || 'Noto Sans KR',
                            fontSize: `${Math.max(8, structure?.fontSizes.storeName * 0.35)}px`,
                          }}
                        >
                          {template.name.split(' · ')[0]}
                        </div>
                      </div>

                      {/* QR 코드 미리보기 */}
                      <div className="flex justify-center items-center">
                        <div
                          className="border-2 border-dashed flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                          style={{
                            borderColor: template.accentColor,
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            width:
                              template.qrSizeRatio === 'large' ? '44px' : template.qrSizeRatio === 'small' ? '32px' : '38px',
                            height:
                              template.qrSizeRatio === 'large' ? '44px' : template.qrSizeRatio === 'small' ? '32px' : '38px',
                          }}
                        >
                          <div className="grid grid-cols-4 gap-0.5 w-4 h-4">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div
                                key={i}
                                className="aspect-square"
                                style={{ 
                                  backgroundColor: Math.random() > 0.5 ? template.textColor : 'transparent',
                                  opacity: 0.8
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* WiFi 정보 (초록 배경) */}
                      <div className="flex justify-center">
                        <div
                          className="px-2 py-0.5 rounded text-[8px] truncate max-w-[70px] transition-all duration-300 group-hover:scale-105"
                          style={{ 
                            backgroundColor: '#D1FAE5', 
                            color: template.accentColor,
                            fontStyle: 'italic',
                            fontSize: `${Math.max(7, structure?.fontSizes.wifiInfo * 0.3)}px`,
                          }}
                        >
                          WiFi 정보
                        </div>
                      </div>

                      {/* 기타 문구 (파랑 배경) */}
                      <div className="flex justify-center">
                        <div
                          className="px-1.5 py-0.5 rounded text-[7px] truncate max-w-[60px] transition-all duration-300 group-hover:scale-105"
                          style={{ 
                            backgroundColor: '#DBEAFE', 
                            color: template.accentColor,
                            fontSize: `${Math.max(6, structure?.fontSizes.description * 0.25)}px`,
                          }}
                        >
                          {template.description}
                        </div>
                      </div>
                    </div>

                    {/* 선택 표시 */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 z-20">
                        <CheckCircle className="text-green-500 bg-white rounded-full shadow-lg" size={16} />
                      </div>
                    )}

                    {/* AI 생성 표시 */}
                    <div className="absolute bottom-1 left-1 z-20">
                      <Sparkles className="text-primary/60" size={12} />
                    </div>
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
