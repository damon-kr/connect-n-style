import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Palette, Coffee, Zap, Heart } from "lucide-react";
import { toast } from "sonner";
import { QRTemplate, AIGeneratedTemplate } from "@/types/wifi";
import { 
  generateTemplatesBatch, 
  CategoryType,
  buildTemplatePrompt 
} from "@/lib/aiTemplateGenerator";

interface DesignCategory {
  id: CategoryType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const designCategories: DesignCategory[] = [
  {
    id: 'minimal_business',
    name: '미니멀 비즈니스',
    description: '화이트 배경, 깔끔한 산세리프, 포인트 컬러',
    icon: Palette,
    color: 'hsl(0 0% 20%)'
  },
  {
    id: 'cafe_vintage',
    name: '카페 빈티지',
    description: '베이지 배경, 필기체 조합, 장식 요소',
    icon: Coffee,
    color: 'hsl(30 30% 60%)'
  },
  {
    id: 'modern_bold',
    name: '모던 볼드',
    description: '굵은 타이포, 강한 대비, 기하학적 요소',
    icon: Zap,
    color: 'hsl(220 100% 50%)'
  },
  {
    id: 'friendly_colorful',
    name: '친근한 컬러풀',
    description: '밝은 배경, 둥근 모서리, 아이콘 중심',
    icon: Heart,
    color: 'hsl(340 80% 60%)'
  }
];

const layoutOptions = [
  { id: 'vertical_centered', name: 'QR 중앙 배치', description: 'QR 중앙, 상하 텍스트' },
  { id: 'horizontal_split', name: '수평 분할', description: '좌측 텍스트, 우측 QR' },
  { id: 'top_heavy', name: '상단 강조', description: '상단 타이틀, 하단 QR' },
  { id: 'bottom_heavy', name: '하단 강조', description: '상단 QR, 하단 강조 텍스트' },
  { id: 'tag_style', name: '태그 스타일', description: '상단 구멍, 세로 배치' }
] as const;

interface AIDesignGeneratorProps {
  onTemplateGenerated: (templates: QRTemplate[]) => void;
}

// QRTemplate으로 변환하는 함수
const convertAITemplateToQRTemplate = (aiTemplate: AIGeneratedTemplate): QRTemplate => {
  return {
    id: aiTemplate.id,
    name: aiTemplate.name,
    description: `AI 생성 - ${aiTemplate.category.replace('_', ' ')}`,
    backgroundColor: '#ffffff',
    accentColor: designCategories.find(cat => cat.id === aiTemplate.category)?.color || 'hsl(var(--primary))',
    textColor: aiTemplate.category === 'modern_bold' ? '#ffffff' : '#333333',
    borderStyle: 'rounded',
    layout: aiTemplate.layoutType,
    qrSizeRatio: 'medium',
    aiGeneratedBackground: aiTemplate.generatedImageUrl,
    category: aiTemplate.category,
    backgroundPattern: 'none'
  };
};


export const AIDesignGenerator: React.FC<AIDesignGeneratorProps> = ({ onTemplateGenerated }) => {
  const [selectedCategory, setSelectedCategory] = useState<DesignCategory | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplates, setGeneratedTemplates] = useState<QRTemplate[]>([]);
  const [aiTemplates, setAiTemplates] = useState<AIGeneratedTemplate[]>([]);

  const handleCategorySelect = (category: DesignCategory) => {
    setSelectedCategory(category);
    setCustomPrompt('');
  };

  const generateAITemplates = async () => {
    if (!selectedCategory && !customPrompt.trim()) {
      toast.error('카테고리를 선택하거나 커스텀 프롬프트를 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    
    try {
      let aiGeneratedTemplates: AIGeneratedTemplate[] = [];
      
      if (selectedCategory) {
        aiGeneratedTemplates = await generateTemplatesBatch(
          selectedCategory.id, 
          customPrompt.trim() || undefined
        );
      } else if (customPrompt.trim()) {
        // 커스텀 프롬프트로 기본 카테고리 사용
        aiGeneratedTemplates = await generateTemplatesBatch(
          'minimal_business',
          customPrompt.trim()
        );
      }

      // AI 템플릿을 QR 템플릿으로 변환
      const qrTemplates = aiGeneratedTemplates.map(convertAITemplateToQRTemplate);
      
      setAiTemplates(aiGeneratedTemplates);
      setGeneratedTemplates(qrTemplates);
      onTemplateGenerated(qrTemplates);
      
      toast.success(`${qrTemplates.length}개의 AI 템플릿이 생성되었습니다!`);
    } catch (error) {
      console.error('AI 템플릿 생성 실패:', error);
      toast.error('AI 템플릿 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateTemplates = () => {
    setGeneratedTemplates([]);
    setAiTemplates([]);
    generateAITemplates();
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          AI 디자인 생성기
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          원하는 스타일을 선택하거나 커스텀 프롬프트로 전문적인 WiFi QR 템플릿을 생성하세요
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 디자인 카테고리 선택 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">디자인 카테고리 선택</Label>
          <div className="grid grid-cols-2 gap-3">
            {designCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory?.id === category.id ? "default" : "outline"}
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => handleCategorySelect(category)}
                >
                  <div className="flex items-start gap-3">
                    <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1 min-w-0">
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {category.description}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-xs text-muted-foreground">또는</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* 커스텀 프롬프트 */}
        <div className="space-y-3">
          <Label htmlFor="custom-prompt" className="text-sm font-medium">
            커스텀 프롬프트 (무한 스타일 생성)
          </Label>
          <Input
            id="custom-prompt"
            placeholder="예: 우주 테마의 네온 컬러 디자인, 미래적인 홀로그램 스타일..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="bg-background/50"
          />
          <p className="text-xs text-muted-foreground">
            원하는 스타일, 색상, 분위기를 자세히 설명해주세요. AI가 맞춤형 디자인을 생성합니다.
          </p>
        </div>

        {/* 생성 버튼 */}
        <div className="flex gap-3">
          <Button
            onClick={generateAITemplates}
            disabled={isGenerating || (!selectedCategory && !customPrompt.trim())}
            className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-elegant"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI 템플릿 생성 중...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                AI 템플릿 생성하기
              </>
            )}
          </Button>
          
          {generatedTemplates.length > 0 && (
            <Button
              onClick={regenerateTemplates}
              variant="outline"
              disabled={isGenerating}
              className="border-primary/20 hover:bg-primary/5"
            >
              다시 생성
            </Button>
          )}
        </div>

        {/* 생성된 템플릿 수 표시 */}
        {generatedTemplates.length > 0 && (
          <div className="text-center">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {generatedTemplates.length}개의 AI 템플릿이 생성되었습니다
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};