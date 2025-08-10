import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Wand2 } from 'lucide-react';
import { QRTemplate } from '@/types/wifi';
import { toast } from 'sonner';

const businessKeywords = [
  { id: 'korean-bbq', label: '한식/고기집', color: '#B45309', emoji: '🍖' },
  { id: 'cafe', label: '카페', color: '#8B4513', emoji: '☕' },
  { id: 'bakery', label: '베이커리', color: '#D97706', emoji: '🥐' },
  { id: 'restaurant', label: '레스토랑', color: '#DC2626', emoji: '🍽️' },
  { id: 'hospital', label: '병원', color: '#2563EB', emoji: '🏥' },
  { id: 'clinic', label: '치과/의원', color: '#0EA5E9', emoji: '🦷' },
  { id: 'bar', label: '바/호프', color: '#F59E0B', emoji: '🍺' },
  { id: 'kids', label: '키즈/교육', color: '#22C55E', emoji: '🧸' },
  { id: 'modern', label: '모던', color: '#06B6D4', emoji: '💎' },
  { id: 'vintage', label: '빈티지', color: '#C2410C', emoji: '📻' },
  { id: 'natural', label: '내추럴', color: '#10B981', emoji: '🌿' },
  { id: 'luxury', label: '럭셔리', color: '#D4AF37', emoji: '💛' },
];

interface AITemplateGeneratorProps {
  onTemplateGenerated: (templates: QRTemplate[]) => void;
}

// AI 템플릿 생성 로직 (피그마 레이아웃 반영: 가로 A/B, 세로 A/B)
const generateTemplatesFromKeywords = async (keywords: string[]): Promise<QRTemplate[]> => {
  const paletteByKeyword: Record<string, { bg: string; accent: string; text: string; pattern: QRTemplate['backgroundPattern'] }[]> = {
    'korean-bbq': [
      { bg: '#FFFBEB', accent: '#B45309', text: '#7C2D12', pattern: 'subtle-texture' },
      { bg: '#FEF3C7', accent: '#D97706', text: '#92400E', pattern: 'dots' },
    ],
    cafe: [
      { bg: '#FEF7ED', accent: '#C2410C', text: '#8B4513', pattern: 'subtle-texture' },
      { bg: '#FFF7ED', accent: '#A16207', text: '#7C3F13', pattern: 'none' },
    ],
    bakery: [
      { bg: '#FFF7ED', accent: '#D97706', text: '#7C2D12', pattern: 'dots' },
      { bg: '#FEF3C7', accent: '#F59E0B', text: '#92400E', pattern: 'subtle-texture' },
    ],
    restaurant: [
      { bg: '#FCE7F3', accent: '#BE185D', text: '#831843', pattern: 'subtle-texture' },
      { bg: '#FEE2E2', accent: '#DC2626', text: '#991B1B', pattern: 'subtle-lines' },
    ],
    hospital: [
      { bg: '#ECFEFF', accent: '#06B6D4', text: '#0E7490', pattern: 'none' },
      { bg: '#F0FDFA', accent: '#10B981', text: '#065F46', pattern: 'none' },
    ],
    clinic: [
      { bg: '#F0F9FF', accent: '#0EA5E9', text: '#075985', pattern: 'subtle-lines' },
      { bg: '#DBEAFE', accent: '#2563EB', text: '#1E40AF', pattern: 'none' },
    ],
    bar: [
      { bg: '#111827', accent: '#F59E0B', text: '#F9FAFB', pattern: 'gradient' },
      { bg: '#0F172A', accent: '#06B6D4', text: '#E0F2FE', pattern: 'gradient' },
    ],
    kids: [
      { bg: '#FEFCE8', accent: '#22C55E', text: '#166534', pattern: 'dots' },
      { bg: '#F0FDF4', accent: '#10B981', text: '#065F46', pattern: 'subtle-texture' },
    ],
    modern: [
      { bg: '#FAFAFA', accent: '#0EA5E9', text: '#0F172A', pattern: 'subtle-lines' },
      { bg: '#F8FAFC', accent: '#64748B', text: '#0F172A', pattern: 'none' },
    ],
    vintage: [
      { bg: '#FEF7ED', accent: '#C2410C', text: '#7C2D12', pattern: 'subtle-texture' },
      { bg: '#FDF2E9', accent: '#B45309', text: '#7C2D12', pattern: 'dots' },
    ],
    natural: [
      { bg: '#ECFDF5', accent: '#10B981', text: '#064E3B', pattern: 'none' },
      { bg: '#F0FDF4', accent: '#22C55E', text: '#065F46', pattern: 'subtle-texture' },
    ],
    luxury: [
      { bg: '#1F2937', accent: '#F59E0B', text: '#FDE68A', pattern: 'gradient' },
      { bg: '#111827', accent: '#FBBF24', text: '#FEF3C7', pattern: 'gradient' },
    ],
  };

  const fontByKeyword: Record<string, string> = {
    'korean-bbq': 'Nanum Myeongjo',
    cafe: 'Noto Serif KR',
    bakery: 'Do Hyeon',
    restaurant: 'Playfair Display',
    hospital: 'Noto Sans KR',
    clinic: 'Noto Sans KR',
    bar: 'Black Han Sans',
    kids: 'Jua',
    modern: 'Poppins',
    vintage: 'Nanum Myeongjo',
    natural: 'Nanum Gothic',
    luxury: 'Playfair Display',
  };

  const categoryByKeyword: Record<string, QRTemplate['category']> = {
    'korean-bbq': 'minimal_business',
    cafe: 'cafe_vintage',
    bakery: 'friendly_colorful',
    restaurant: 'restaurant_elegant',
    hospital: 'hospital_clean',
    clinic: 'hospital_clean',
    bar: 'modern_bold',
    kids: 'friendly_colorful',
    modern: 'modern_bold',
    vintage: 'cafe_vintage',
    natural: 'minimal_business',
    luxury: 'restaurant_elegant',
  };

  // 피그마 기반 레이아웃 프리셋
  const layoutPresets = [
    {
      id: 'landscape-a',
      structure: {
        layout: 'horizontal_split',
        fontFamily: '',
        fontSizes: { storeName: 24, wifiInfo: 16, description: 13, qrLabel: 12 },
        textAlign: 'left' as const,
        spacing: { padding: 28, marginTop: 16, marginBottom: 16, elementGap: 12 },
        decorativeElements: [],
        qrPosition: { x: '72%', y: '50%', size: 'large' },
        textPositions: {
          storeName: { x: '25%', y: '30%' },
          wifiInfo: { x: '25%', y: '58%' },
          description: { x: '25%', y: '75%' },
        },
        colors: { primary: '', secondary: '', accent: '', text: '', background: '' },
      },
    },
    {
      id: 'landscape-b',
      structure: {
        layout: 'top_heavy',
        fontFamily: '',
        fontSizes: { storeName: 26, wifiInfo: 16, description: 12, qrLabel: 11 },
        textAlign: 'center' as const,
        spacing: { padding: 24, marginTop: 18, marginBottom: 18, elementGap: 14 },
        decorativeElements: [],
        qrPosition: { x: '50%', y: '62%', size: 'large' },
        textPositions: {
          storeName: { x: '50%', y: '20%' },
          wifiInfo: { x: '50%', y: '80%' },
          description: { x: '50%', y: '90%' },
        },
        colors: { primary: '', secondary: '', accent: '', text: '', background: '' },
      },
    },
    {
      id: 'portrait-a',
      structure: {
        layout: 'vertical_centered',
        fontFamily: '',
        fontSizes: { storeName: 28, wifiInfo: 16, description: 12, qrLabel: 11 },
        textAlign: 'center' as const,
        spacing: { padding: 24, marginTop: 16, marginBottom: 16, elementGap: 12 },
        decorativeElements: [],
        qrPosition: { x: '50%', y: '55%', size: 'large' },
        textPositions: {
          storeName: { x: '50%', y: '18%' },
          wifiInfo: { x: '50%', y: '80%' },
          description: { x: '50%', y: '90%' },
        },
        colors: { primary: '', secondary: '', accent: '', text: '', background: '' },
      },
    },
    {
      id: 'portrait-b',
      structure: {
        layout: 'center',
        fontFamily: '',
        fontSizes: { storeName: 24, wifiInfo: 15, description: 12, qrLabel: 11 },
        textAlign: 'center' as const,
        spacing: { padding: 22, marginTop: 16, marginBottom: 16, elementGap: 12 },
        decorativeElements: [],
        qrPosition: { x: '50%', y: '50%', size: 'medium' },
        textPositions: {
          storeName: { x: '50%', y: '25%' },
          wifiInfo: { x: '50%', y: '75%' },
          description: { x: '50%', y: '86%' },
        },
        colors: { primary: '', secondary: '', accent: '', text: '', background: '' },
      },
    },
  ];

  const templates: QRTemplate[] = [];

  for (let i = 0; i < Math.min(6, keywords.length * 2 || 4); i++) {
    const kw = keywords[i % keywords.length];
    const palettes = paletteByKeyword[kw] || paletteByKeyword['modern'];
    const palette = palettes[i % palettes.length];
    const preset = layoutPresets[i % layoutPresets.length];

    const font = fontByKeyword[kw] || 'Noto Sans KR';
    const category = categoryByKeyword[kw] || 'minimal_business';

    const id = `ai-${kw}-${Date.now()}-${i}`;

    const structure = {
      ...preset.structure,
      fontFamily: font,
      colors: {
        primary: palette.accent,
        secondary: palette.text,
        accent: palette.accent,
        text: palette.text,
        background: palette.bg,
      },
    } as QRTemplate['structure'];

    templates.push({
      id,
      name: `${businessKeywords.find((b) => b.id === kw)?.label || 'AI'} 템플릿 ${i + 1}`,
      description: '예: "여기서 스캔하고 바로 연결"',
      backgroundColor: palette.bg,
      accentColor: palette.accent,
      textColor: palette.text,
      borderStyle: 'rounded',
      icon: 'sparkles',
      layout: structure.layout as QRTemplate['layout'],
      qrSizeRatio: (preset.structure.qrPosition.size as QRTemplate['qrSizeRatio']),
      backgroundPattern: palette.pattern,
      decorativeElements: ['frame'],
      category,
      structure,
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