import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Wand2 } from 'lucide-react';
import { QRTemplate } from '@/types/wifi';
import { toast } from 'sonner';

const businessKeywords = [
  { id: 'cafe', label: '카페', color: '#8B4513', emoji: '☕' },
  { id: 'restaurant', label: '레스토랑', color: '#DC2626', emoji: '🍽️' },
  { id: 'hospital', label: '병원', color: '#2563EB', emoji: '🏥' },
  { id: 'hotel', label: '호텔', color: '#7C3AED', emoji: '🏨' },
  { id: 'modern', label: '모던', color: '#06B6D4', emoji: '💎' },
  { id: 'classic', label: '클래식', color: '#059669', emoji: '🎭' },
  { id: 'minimal', label: '미니멀', color: '#6B7280', emoji: '⚪' },
  { id: 'luxury', label: '럭셔리', color: '#D97706', emoji: '👑' }
];

interface AITemplateGeneratorProps {
  onTemplateGenerated: (templates: QRTemplate[]) => void;
}

// AI 템플릿 생성 로직
const generateTemplatesFromKeywords = async (keywords: string[]): Promise<QRTemplate[]> => {
  // 키워드 기반 색상 팔레트 생성
  const colorPalettes = {
    cafe: [
      { bg: '#FEF7ED', accent: '#EA580C', text: '#9A3412', border: 'rounded' },
      { bg: '#F5F5DC', accent: '#8B4513', text: '#654321', border: 'solid' },
      { bg: '#FFFBF0', accent: '#D2691E', text: '#A0522D', border: 'rounded' },
      { bg: '#FDF2E9', accent: '#CD853F', text: '#8B4513', border: 'none' }
    ],
    restaurant: [
      { bg: '#FEE2E2', accent: '#DC2626', text: '#991B1B', border: 'solid' },
      { bg: '#FFF1F2', accent: '#E11D48', text: '#BE123C', border: 'rounded' },
      { bg: '#FFEBEE', accent: '#F44336', text: '#C62828', border: 'dashed' },
      { bg: '#FCE4EC', accent: '#E91E63', text: '#AD1457', border: 'solid' }
    ],
    hospital: [
      { bg: '#DBEAFE', accent: '#2563EB', text: '#1E40AF', border: 'solid' },
      { bg: '#E0F2FE', accent: '#0284C7', text: '#0369A1', border: 'rounded' },
      { bg: '#F0F9FF', accent: '#0EA5E9', text: '#0284C7', border: 'none' },
      { bg: '#EBF8FF', accent: '#3B82F6', text: '#1D4ED8', border: 'solid' }
    ],
    hotel: [
      { bg: '#F3E8FF', accent: '#7C3AED', text: '#5B21B6', border: 'rounded' },
      { bg: '#FAF5FF', accent: '#8B5CF6', text: '#6D28D9', border: 'solid' },
      { bg: '#F5F3FF', accent: '#A855F7', text: '#7C2D12', border: 'dashed' },
      { bg: '#FDF4FF', accent: '#D946EF', text: '#A21CAF', border: 'rounded' }
    ],
    modern: [
      { bg: '#ECFEFF', accent: '#06B6D4', text: '#0E7490', border: 'none' },
      { bg: '#F0FDFA', accent: '#14B8A6', text: '#0F766E', border: 'solid' },
      { bg: '#F0F9FF', accent: '#0EA5E9', text: '#0284C7', border: 'rounded' },
      { bg: '#FAFAFA', accent: '#71717A', text: '#3F3F46', border: 'solid' }
    ],
    classic: [
      { bg: '#F0FDF4', accent: '#059669', text: '#047857', border: 'solid' },
      { bg: '#FFFBEB', accent: '#D97706', text: '#92400E', border: 'rounded' },
      { bg: '#FEF3C7', accent: '#F59E0B', text: '#B45309', border: 'dashed' },
      { bg: '#FDF4FF', accent: '#A855F7', text: '#7C2D12', border: 'solid' }
    ],
    minimal: [
      { bg: '#FFFFFF', accent: '#374151', text: '#1F2937', border: 'none' },
      { bg: '#F9FAFB', accent: '#6B7280', text: '#374151', border: 'solid' },
      { bg: '#F8FAFC', accent: '#64748B', text: '#334155', border: 'rounded' },
      { bg: '#FEFEFE', accent: '#52525B', text: '#27272A', border: 'none' }
    ],
    luxury: [
      { bg: '#FFFBEB', accent: '#D97706', text: '#92400E', border: 'rounded' },
      { bg: '#FEF3C7', accent: '#F59E0B', text: '#B45309', border: 'solid' },
      { bg: '#1F2937', accent: '#F59E0B', text: '#FDE68A', border: 'dashed' },
      { bg: '#111827', accent: '#FBBF24', text: '#FEF3C7', border: 'rounded' }
    ]
  };
  
  const templates: QRTemplate[] = [];
  
  for (let i = 0; i < 4; i++) {
    const selectedKeyword = keywords[Math.floor(Math.random() * keywords.length)] as keyof typeof colorPalettes;
    const keywordPalettes = colorPalettes[selectedKeyword] || colorPalettes.modern;
    const palette = keywordPalettes[i % keywordPalettes.length];
    
    const keywordEmoji = businessKeywords.find(k => k.id === selectedKeyword)?.emoji || '✨';
    
    templates.push({
      id: `ai-generated-${Date.now()}-${i}`,
      name: `AI ${selectedKeyword} ${i + 1} ${keywordEmoji}`,
      description: `${selectedKeyword} 컨셉의 맞춤 디자인`,
      backgroundColor: palette.bg,
      accentColor: palette.accent,
      textColor: palette.text,
      borderStyle: palette.border as 'none' | 'solid' | 'dashed' | 'rounded',
      icon: 'sparkles'
    });
  }
  
  return templates;
};

export const AITemplateGenerator = ({ onTemplateGenerated }: AITemplateGeneratorProps) => {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplates, setGeneratedTemplates] = useState<QRTemplate[]>([]);

  const generateAITemplates = async () => {
    if (selectedKeywords.length === 0) {
      toast.error('최소 하나의 키워드를 선택해주세요');
      return;
    }
    
    setIsGenerating(true);
    try {
      // 시뮬레이션된 AI 생성 딜레이
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const templates = await generateTemplatesFromKeywords(selectedKeywords);
      setGeneratedTemplates(templates);
      onTemplateGenerated(templates);
      
      toast.success(`${templates.length}개의 AI 템플릿이 생성되었습니다!`);
    } catch (error) {
      console.error('AI 템플릿 생성 실패:', error);
      toast.error('AI 템플릿 생성에 실패했습니다');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleKeyword = (keywordId: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keywordId) 
        ? prev.filter(k => k !== keywordId)
        : [...prev, keywordId]
    );
  };
  
  return (
    <Card className="mb-6 border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Wand2 className="w-5 h-5" />
          AI 맞춤 템플릿 생성
          <Badge variant="secondary" className="ml-2">Beta</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          비즈니스 컨셉을 선택하면 AI가 어울리는 맞춤 템플릿을 생성해드립니다
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3 text-foreground">비즈니스 컨셉 선택</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {businessKeywords.map((keyword) => (
                <Badge
                  key={keyword.id}
                  variant={selectedKeywords.includes(keyword.id) ? "default" : "outline"}
                  className="cursor-pointer p-3 justify-center transition-all hover:scale-105"
                  onClick={() => toggleKeyword(keyword.id)}
                  style={{
                    backgroundColor: selectedKeywords.includes(keyword.id) ? keyword.color : undefined,
                    borderColor: keyword.color,
                    color: selectedKeywords.includes(keyword.id) ? '#ffffff' : keyword.color
                  }}
                >
                  <span className="mr-1">{keyword.emoji}</span>
                  {keyword.label}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={generateAITemplates}
              disabled={selectedKeywords.length === 0 || isGenerating}
              className="flex-1 h-12"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  AI가 생성 중...
                </>
              ) : (
                'AI 템플릿 생성'
              )}
            </Button>
            
            {generatedTemplates.length > 0 && (
              <Button 
                variant="outline" 
                onClick={generateAITemplates}
                disabled={isGenerating}
                className="h-12 px-6"
                size="lg"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>

          {selectedKeywords.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">선택된 컨셉:</p>
              <div className="flex flex-wrap gap-1">
                {selectedKeywords.map(keywordId => {
                  const keyword = businessKeywords.find(k => k.id === keywordId);
                  return (
                    <span key={keywordId} className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                      {keyword?.emoji} {keyword?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};