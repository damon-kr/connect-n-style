import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Wand2, Zap } from 'lucide-react';
import { QRTemplate } from '@/types/wifi';
import { toast } from 'sonner';

import { generateTemplatesFromKeywords, businessKeywords } from '@/lib/aiTemplates';

interface AITemplateGeneratorProps {
  onTemplateGenerated: (templates: QRTemplate[]) => void;
}

export const AITemplateGenerator = ({ onTemplateGenerated }: AITemplateGeneratorProps) => {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplates, setGeneratedTemplates] = useState<QRTemplate[]>([]);

  const generateAITemplates = async () => {
    if (selectedKeywords.length === 0) {
      toast.error('최소 하나의 업종/컨셉을 선택해주세요');
      return;
    }
    
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const templates = await generateTemplatesFromKeywords(selectedKeywords);
      setGeneratedTemplates(templates);
      onTemplateGenerated(templates);
      toast.success(`${templates.length}개의 맞춤 템플릿이 생성되었습니다!`);
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

  const quickSelect = (category: string) => {
    const categoryKeywords = businessKeywords.filter(k => {
      if (category === 'food') return ['korean-bbq', 'korean-restaurant', 'japanese', 'chinese', 'western', 'fastfood', 'cafe', 'bakery', 'dessert', 'coffee'].includes(k.id);
      if (category === 'medical') return ['hospital', 'clinic', 'pharmacy', 'beauty'].includes(k.id);
      if (category === 'entertainment') return ['bar', 'karaoke', 'pcroom'].includes(k.id);
      if (category === 'education') return ['kids', 'academy', 'kindergarten'].includes(k.id);
      if (category === 'service') return ['salon', 'spa', 'gym'].includes(k.id);
      if (category === 'concept') return ['modern', 'vintage', 'natural', 'luxury', 'minimal', 'colorful'].includes(k.id);
      return false;
    });
    setSelectedKeywords(categoryKeywords.map(k => k.id));
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
          업종/컨셉을 선택하면 AI가 한국 사용자 취향에 맞게 템플릿을 생성합니다
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 빠른 선택 */}
        <div>
          <h4 className="text-sm font-medium mb-3 text-foreground">빠른 선택</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {[
              { id: 'food', label: '🍽️ 음식점', color: '#F59E0B' },
              { id: 'medical', label: '🏥 의료', color: '#06B6D4' },
              { id: 'entertainment', label: '🎮 엔터테인먼트', color: '#8B5CF6' },
              { id: 'education', label: '📚 교육', color: '#10B981' },
              { id: 'service', label: '💇‍♀️ 서비스', color: '#EC4899' },
              { id: 'concept', label: '🎨 컨셉', color: '#6B7280' },
            ].map((category) => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                className="h-10 text-xs"
                onClick={() => quickSelect(category.id)}
                style={{ borderColor: category.color, color: category.color }}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 상세 선택 */}
        <div>
          <h4 className="text-sm font-medium mb-3 text-foreground">상세 선택</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {businessKeywords.map((keyword) => (
              <Badge
                key={keyword.id}
                variant={selectedKeywords.includes(keyword.id) ? 'default' : 'outline'}
                className="cursor-pointer p-2 justify-center transition-all hover:scale-105 text-xs"
                onClick={() => toggleKeyword(keyword.id)}
                style={{
                  backgroundColor: selectedKeywords.includes(keyword.id) ? keyword.color : undefined,
                  borderColor: keyword.color,
                  color: selectedKeywords.includes(keyword.id) ? '#ffffff' : keyword.color,
                }}
              >
                <span className="mr-1">{keyword.emoji}</span>
                {keyword.label}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* 생성 버튼 */}
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
              '맞춤 템플릿 생성'
            )}
          </Button>

          {generatedTemplates.length > 0 && (
            <Button 
              variant="outline" 
              onClick={generateAITemplates}
              disabled={isGenerating}
              className="h-12 px-4"
              size="lg"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>

        {/* 선택된 항목 표시 */}
        {selectedKeywords.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <p className="text-xs font-medium text-foreground">선택된 컨셉:</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedKeywords.map((keywordId) => {
                const keyword = businessKeywords.find((k) => k.id === keywordId);
                return (
                  <span 
                    key={keywordId} 
                    className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                    style={{ 
                      backgroundColor: keyword?.color + '20', 
                      color: keyword?.color,
                      border: `1px solid ${keyword?.color}40`
                    }}
                  >
                    <span>{keyword?.emoji}</span>
                    {keyword?.label}
                  </span>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              예상 생성 템플릿: {Math.max(8, Math.min(16, selectedKeywords.length * 4))}개
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};