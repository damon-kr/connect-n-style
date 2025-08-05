import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QRTemplate, AIGeneratedTemplate } from '@/types/wifi';
import { CheckCircle, Sparkles, RotateCcw, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  generateMultipleVariations, 
  CategoryType,
  LayoutType 
} from '@/lib/aiTemplateGenerator';
import { toast } from 'sonner';

interface AITemplateGalleryProps {
  category: CategoryType;
  layout: LayoutType;
  onTemplateSelect: (template: QRTemplate) => void;
  selectedTemplate: QRTemplate | null;
}

// QRTemplate으로 변환하는 함수
const convertAITemplateToQRTemplate = (aiTemplate: AIGeneratedTemplate): QRTemplate => {
  const categoryColors = {
    minimal_business: { bg: '#ffffff', accent: '#1e3a8a', text: '#000000' },
    cafe_vintage: { bg: '#faf7f0', accent: '#8b4513', text: '#2d1810' },
    modern_bold: { bg: '#ffffff', accent: '#0066ff', text: '#000000' },
    friendly_colorful: { bg: '#ffffff', accent: '#ff6b6b', text: '#2d3748' }
  };

  const colors = categoryColors[aiTemplate.category];

  return {
    id: aiTemplate.id,
    name: aiTemplate.name,
    description: `AI generated ${aiTemplate.category.replace('_', ' ')} style`,
    backgroundColor: colors.bg,
    accentColor: colors.accent,
    textColor: colors.text,
    borderStyle: aiTemplate.layoutType === 'tag_style' ? 'rounded' : 'none',
    layout: aiTemplate.layoutType,
    qrSizeRatio: 'medium',
    backgroundPattern: 'none',
    decorativeElements: ['frame'],
    aiGeneratedBackground: aiTemplate.generatedImageUrl,
    category: aiTemplate.category
  };
};

export const AITemplateGallery: React.FC<AITemplateGalleryProps> = ({
  category,
  layout,
  onTemplateSelect,
  selectedTemplate
}) => {
  const [templates, setTemplates] = useState<QRTemplate[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<QRTemplate | null>(null);

  const generateVariations = async () => {
    setIsGenerating(true);
    try {
      const aiTemplates = await generateMultipleVariations(category, layout, 4);
      const qrTemplates = aiTemplates.map(convertAITemplateToQRTemplate);
      setTemplates(qrTemplates);
      toast.success(`${qrTemplates.length}개의 변형이 생성되었습니다!`);
    } catch (error) {
      console.error('변형 생성 실패:', error);
      toast.error('변형 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateVariations = () => {
    setTemplates([]);
    generateVariations();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            AI 템플릿 갤러리
          </div>
          <div className="flex gap-2">
            {templates.length > 0 && (
              <Button
                onClick={regenerateVariations}
                variant="outline"
                size="sm"
                disabled={isGenerating}
              >
                <RotateCcw size={16} className="mr-1" />
                다시 생성
              </Button>
            )}
            <Button
              onClick={generateVariations}
              disabled={isGenerating}
              size="sm"
              className="bg-gradient-primary"
            >
              {isGenerating ? '생성 중...' : '변형 생성'}
            </Button>
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {category.replace('_', ' ')} 스타일의 {layout.replace('_', ' ')} 레이아웃 변형들
        </p>
      </CardHeader>
      
      <CardContent>
        {templates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            변형 생성 버튼을 클릭하여 다양한 디자인을 확인해보세요
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
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
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-lg"
                      style={{ 
                        backgroundImage: `url(${template.aiGeneratedBackground})`,
                        filter: 'brightness(0.9) contrast(1.1)'
                      }}
                    />
                    
                    {/* 오버레이 */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    
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
        )}
        
        {templates.length > 0 && (
          <div className="mt-4 text-center">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {templates.length}개의 AI 템플릿 변형
            </Badge>
          </div>
        )}
      </CardContent>
      
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
            
            <div 
              className="w-full h-48 bg-cover bg-center bg-no-repeat rounded-lg"
              style={{ 
                backgroundImage: `url(${previewTemplate.aiGeneratedBackground})`
              }}
            />
            
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
    </Card>
  );
};