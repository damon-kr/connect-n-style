import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Wand2 } from 'lucide-react';
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
      toast.error('최소 하나의 키워드를 선택해주세요');
      return;
    }
    
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
          업종/컨셉을 선택하면 AI가 한국 사용자 취향에 맞게 템플릿을 생성합니다
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3 text-foreground">업종/컨셉 선택</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {businessKeywords.map((keyword) => (
                <Badge
                  key={keyword.id}
                  variant={selectedKeywords.includes(keyword.id) ? 'default' : 'outline'}
                  className="cursor-pointer p-3 justify-center transition-all hover:scale-105"
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
                {selectedKeywords.map((keywordId) => {
                  const keyword = businessKeywords.find((k) => k.id === keywordId);
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