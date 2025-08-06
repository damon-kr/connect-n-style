import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QRTemplate } from '@/types/wifi';
import { CheckCircle, Sparkles, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AITemplateSelectorProps {
  templates: QRTemplate[];
  selectedTemplate: QRTemplate | null;
  onTemplateSelect: (template: QRTemplate) => void;
}

export const AITemplateSelector: React.FC<AITemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect
}) => {
  const [previewTemplate, setPreviewTemplate] = useState<QRTemplate | null>(null);

  if (templates.length === 0) {
    return (
      <Card className="border-dashed border-primary/20">
        <CardContent className="py-12 text-center">
          <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            먼저 AI 디자인 생성기에서 템플릿을 생성해주세요
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            생성된 AI 템플릿
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {templates.length}개의 AI 생성 템플릿 중에서 선택하세요
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((template) => {
              const isSelected = selectedTemplate?.id === template.id;
              
              return (
                <Card 
                  key={template.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:scale-[1.02] relative overflow-hidden group",
                    isSelected ? "ring-2 ring-primary ring-offset-1" : ""
                  )}
                  onClick={() => onTemplateSelect(template)}
                >
                  <CardContent className="p-3 relative h-40">
                    {/* AI 생성 배경 이미지 */}
                    {template.aiGeneratedBackground && (
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded"
                        style={{ 
                          backgroundImage: `url(${template.aiGeneratedBackground})`,
                          filter: 'brightness(0.9) contrast(1.1)'
                        }}
                      />
                    )}
                    
                    {/* 기본 배경색 (AI 이미지가 없는 경우) */}
                    {!template.aiGeneratedBackground && (
                      <div 
                        className="absolute inset-0 rounded"
                        style={{ backgroundColor: template.backgroundColor }}
                      />
                    )}
                    
                    {/* 오버레이 */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors rounded" />
                    
                    {/* AI 배지 */}
                    <div className="absolute top-2 left-2 z-20">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                        <Sparkles size={10} className="mr-1" />
                        AI
                      </Badge>
                    </div>
                    
                    {/* 선택 표시 */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-20">
                        <CheckCircle className="text-green-500 bg-white rounded-full shadow-lg" size={18} />
                      </div>
                    )}
                    
                    {/* 미리보기 버튼 */}
                    <div className="absolute bottom-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 text-black h-8 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template);
                        }}
                      >
                        <Eye size={14} />
                      </Button>
                    </div>
                    
                    {/* 템플릿 정보 */}
                    <div className="absolute bottom-2 left-2 z-20">
                      <div className="bg-white/95 px-2 py-1 rounded shadow-sm">
                        <h4 className="font-medium text-xs text-gray-800 truncate">
                          {template.name}
                        </h4>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="mt-4 text-center">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {templates.length}개의 AI 템플릿
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* 미리보기 모달 */}
      {previewTemplate && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setPreviewTemplate(null)}
        >
          <div 
            className="bg-white p-6 rounded-lg max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{previewTemplate.name}</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setPreviewTemplate(null)}
              >
                ✕
              </Button>
            </div>
            
            {previewTemplate.aiGeneratedBackground && (
              <div 
                className="w-full h-48 bg-cover bg-center bg-no-repeat rounded-lg"
                style={{ 
                  backgroundImage: `url(${previewTemplate.aiGeneratedBackground})`
                }}
              />
            )}
            
            <div className="mt-4 flex gap-2">
              <Button 
                onClick={() => {
                  onTemplateSelect(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className="flex-1"
              >
                이 템플릿 선택
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setPreviewTemplate(null)}
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};