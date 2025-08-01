import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Palette, Coffee, Zap, Heart } from "lucide-react";
import { toast } from "sonner";
import { QRTemplate } from "@/types/wifi";

interface DesignCategory {
  id: 'minimal_business' | 'cafe_vintage' | 'modern_bold' | 'friendly_colorful';
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  prompt: string;
}

const designCategories: DesignCategory[] = [
  {
    id: 'minimal_business',
    name: '미니멀 비즈니스',
    description: '화이트 배경, 깔끔한 산세리프, 포인트 컬러',
    icon: Palette,
    color: 'hsl(0 0% 20%)',
    prompt: 'minimalist business design, clean white background, sans-serif typography, subtle accent color, professional layout, high quality 300dpi'
  },
  {
    id: 'cafe_vintage',
    name: '카페 빈티지',
    description: '베이지 배경, 필기체 조합, 장식 요소',
    icon: Coffee,
    color: 'hsl(30 30% 60%)',
    prompt: 'vintage cafe style design, warm beige background, handwritten script fonts, decorative elements, cozy atmosphere, rustic charm, 300dpi'
  },
  {
    id: 'modern_bold',
    name: '모던 볼드',
    description: '굵은 타이포, 강한 대비, 기하학적 요소',
    icon: Zap,
    color: 'hsl(220 100% 50%)',
    prompt: 'modern bold design, strong typography, high contrast colors, geometric elements, contemporary layout, striking visual impact, 300dpi'
  },
  {
    id: 'friendly_colorful',
    name: '친근한 컬러풀',
    description: '밝은 배경, 둥근 모서리, 아이콘 중심',
    icon: Heart,
    color: 'hsl(340 80% 60%)',
    prompt: 'friendly colorful design, bright cheerful background, rounded corners, icon-centric layout, playful atmosphere, warm colors, 300dpi'
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

// AI 이미지 생성 함수 (향후 실제 API로 교체)
const generateAIImage = async (prompt: string, category: string): Promise<string> => {
  // 실제 구현시 OpenAI DALL-E, Midjourney, Stable Diffusion 등 사용
  // 현재는 placeholder 이미지 반환
  await new Promise(resolve => setTimeout(resolve, 2000)); // 생성 시뮬레이션
  
  // 카테고리별 placeholder 이미지 (실제로는 AI 생성 이미지)
  const placeholderImages = {
    'minimal_business': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmZmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1pbmltYWwgQnVzaW5lc3M8L3RleHQ+PC9zdmc+',
    'cafe_vintage': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmMGU4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzhhNjk0NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhZmUgVmludGFnZTwvdGV4dD48L3N2Zz4=',
    'modern_bold': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMDY2ZmYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDMzYWEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCBCbGFjayIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Nb2Rlcm4gQm9sZDwvdGV4dD48L3N2Zz4=',
    'friendly_colorful': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9InIiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmJkZTAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZjk5YjMiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3IpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2MzM5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZyaWVuZGx5IENvbG9yZnVsPC90ZXh0Pjwvc3ZnPg=='
  };
  
  return placeholderImages[category as keyof typeof placeholderImages] || placeholderImages.minimal_business;
};

const generateTemplatesFromCategory = async (
  category: DesignCategory, 
  customPrompt?: string
): Promise<QRTemplate[]> => {
  const basePrompt = customPrompt || category.prompt;
  const templates: QRTemplate[] = [];
  
  // 각 레이아웃별로 템플릿 생성
  for (const layout of layoutOptions) {
    const aiBackground = await generateAIImage(
      `${basePrompt}, ${layout.description}, wifi qr code template design`,
      category.id
    );
    
    const template: QRTemplate = {
      id: `ai-${category.id}-${layout.id}-${Date.now()}`,
      name: `${category.name} - ${layout.name}`,
      description: `${category.description} / ${layout.description}`,
      backgroundColor: '#ffffff',
      accentColor: category.color,
      textColor: category.id === 'modern_bold' ? '#ffffff' : '#333333',
      borderStyle: 'rounded',
      layout: layout.id as any,
      qrSizeRatio: 'medium',
      aiGeneratedBackground: aiBackground,
      category: category.id,
      backgroundPattern: 'none'
    };
    
    templates.push(template);
  }
  
  return templates;
};

export const AIDesignGenerator: React.FC<AIDesignGeneratorProps> = ({ onTemplateGenerated }) => {
  const [selectedCategory, setSelectedCategory] = useState<DesignCategory | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplates, setGeneratedTemplates] = useState<QRTemplate[]>([]);

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
      let templates: QRTemplate[] = [];
      
      if (selectedCategory) {
        templates = await generateTemplatesFromCategory(selectedCategory, customPrompt.trim() || undefined);
      } else if (customPrompt.trim()) {
        // 커스텀 프롬프트로 생성
        const customCategory: DesignCategory = {
          id: 'minimal_business',
          name: '커스텀 디자인',
          description: '사용자 정의 스타일',
          icon: Sparkles,
          color: 'hsl(var(--primary))',
          prompt: customPrompt.trim()
        };
        templates = await generateTemplatesFromCategory(customCategory, customPrompt.trim());
      }

      setGeneratedTemplates(templates);
      onTemplateGenerated(templates);
      
      toast.success(`${templates.length}개의 AI 템플릿이 생성되었습니다!`);
    } catch (error) {
      console.error('AI 템플릿 생성 실패:', error);
      toast.error('AI 템플릿 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateTemplates = () => {
    setGeneratedTemplates([]);
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