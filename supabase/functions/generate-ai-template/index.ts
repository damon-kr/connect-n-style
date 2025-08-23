import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY is not set in Supabase environment' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const body = await req.json();
    const keywords: string[] = body.keywords || [];
    const count = Math.max(8, Math.min(16, (body.count ?? keywords.length * 3)));

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return new Response(
        JSON.stringify({ error: 'keywords is required (string[])' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const allowedLayouts = [
      'center','top','bottom','split-left','split-right','vertical_centered','horizontal_split','top_heavy','bottom_heavy','tag_style'
    ];
    const allowedPatterns = ['gradient','dots','lines','none','subtle-texture','subtle-lines'];
    const allowedDecor = [
      'corners','frame','icons','shapes','vintage-frame','coffee-icons','professional-frame','geometric-shapes','color-accents','clean-border','elegant-frame','colorful-shapes','retro-icons','gold-accents','tech-shapes','neon-accents'
    ];

    // JSON Schema to enforce structured output
    const jsonSchema = {
      name: 'qr_templates_payload',
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          templates: {
            type: 'array',
            minItems: 8,
            maxItems: 16,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
                backgroundColor: { type: 'string', pattern: '^#([0-9a-fA-F]{6})$' },
                accentColor: { type: 'string', pattern: '^#([0-9a-fA-F]{6})$' },
                textColor: { type: 'string', pattern: '^#([0-9a-fA-F]{6})$' },
                borderStyle: { type: 'string', enum: ['none','solid','dashed','rounded'] },
                icon: { type: 'string' },
                layout: { type: 'string', enum: allowedLayouts },
                qrSizeRatio: { type: 'string', enum: ['small','medium','large'] },
                backgroundPattern: { type: 'string', enum: allowedPatterns },
                decorativeElements: {
                  type: 'array',
                  items: { type: 'string', enum: allowedDecor }
                },
                category: {
                  type: 'string',
                  enum: ['minimal_business','cafe_vintage','modern_bold','friendly_colorful','hospital_clean','restaurant_elegant','tag_style']
                },
                aiGeneratedBackground: { type: 'string' },
                structure: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    layout: { type: 'string', enum: allowedLayouts },
                    fontFamily: { type: 'string', enum: ['Inter','Noto Sans KR','Pretendard'] },
                    fontSizes: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        storeName: { type: 'number' },
                        wifiInfo: { type: 'number' },
                        description: { type: 'number' },
                        qrLabel: { type: 'number' }
                      },
                      required: ['storeName','wifiInfo','description','qrLabel']
                    },
                    textAlign: { type: 'string', enum: ['left','center','right'] },
                    spacing: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        padding: { type: 'number' },
                        marginTop: { type: 'number' },
                        marginBottom: { type: 'number' },
                        elementGap: { type: 'number' }
                      },
                      required: ['padding','marginTop','marginBottom','elementGap']
                    },
                    decorativeElements: {
                      type: 'array',
                      items: { type: 'string', enum: allowedDecor }
                    },
                    qrPosition: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        x: { type: 'string', pattern: '^[0-9]{1,3}%$' },
                        y: { type: 'string', pattern: '^[0-9]{1,3}%$' },
                        size: { type: 'string', enum: ['small','medium','large'] }
                      },
                      required: ['x','y','size']
                    },
                    textPositions: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        storeName: {
                          type: 'object',
                          additionalProperties: false,
                          properties: { x: { type: 'string', pattern: '^[0-9]{1,3}%$' }, y: { type: 'string', pattern: '^[0-9]{1,3}%$' } },
                          required: ['x','y']
                        },
                        wifiInfo: {
                          type: 'object',
                          additionalProperties: false,
                          properties: { x: { type: 'string', pattern: '^[0-9]{1,3}%$' }, y: { type: 'string', pattern: '^[0-9]{1,3}%$' } },
                          required: ['x','y']
                        },
                        description: {
                          type: 'object',
                          additionalProperties: false,
                          properties: { x: { type: 'string', pattern: '^[0-9]{1,3}%$' }, y: { type: 'string', pattern: '^[0-9]{1,3}%$' } },
                          required: ['x','y']
                        }
                      },
                      required: ['storeName','wifiInfo','description']
                    },
                    colors: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        primary: { type: 'string', pattern: '^#([0-9a-fA-F]{6})$' },
                        secondary: { type: 'string', pattern: '^#([0-9a-fA-F]{6})$' },
                        accent: { type: 'string', pattern: '^#([0-9a-fA-F]{6})$' },
                        text: { type: 'string', pattern: '^#([0-9a-fA-F]{6})$' },
                        background: { type: 'string', pattern: '^#([0-9a-fA-F]{6})$' }
                      },
                      required: ['primary','secondary','accent','text','background']
                    }
                  },
                  required: ['layout','fontFamily','fontSizes','textAlign','spacing','decorativeElements','qrPosition','textPositions','colors']
                }
              },
              required: ['id','name','description','backgroundColor','accentColor','textColor','borderStyle','layout','qrSizeRatio','backgroundPattern','decorativeElements','category','aiGeneratedBackground','structure']
            }
          }
        },
        required: ['templates']
      },
      strict: true
    } as const;

    const system = `당신은 한국 소상공인을 위한 전문 그래픽 디자이너입니다. 실제 프린트용 QR 코드 포스터를 디자인하며, 각 요소가 캔버스 내에서 정확히 배치되어야 합니다.

## 핵심 디자인 원칙 (피그마 기준)

### 1. 캔버스 레이아웃 (100% 기준)
- **QR 코드**: 캔버스의 25-35% 크기, 중앙 또는 한쪽에 배치
- **업체명**: 상단 10-25% 영역, 폰트 크기 24-32pt
- **WiFi 정보**: QR 코드 하단 또는 우측, 폰트 크기 16-20pt  
- **설명문**: 하단 5-15% 영역, 폰트 크기 12-16pt
- **여백**: 모든 가장자리에서 최소 8% 여백 확보

### 2. 업종별 디자인 컨셉
- **카페**: 따뜻한 브라운(#8B4513), 크림(#F5F5DC), 빈티지 폰트
- **병원**: 청록(#20B2AA), 화이트(#FFFFFF), 클린한 Sans-serif
- **음식점**: 골드(#FFD700), 딥레드(#8B0000), 우아한 serif
- **현대적**: 네이비(#191970), 실버(#C0C0C0), 미니멀 구성
- **키즈**: 비비드 블루(#0066FF), 옐로우(#FFFF00), 둥근 폰트

### 3. 정확한 위치 좌표 (%)
각 레이아웃별 요소 위치를 정확히 지정:
- center: QR(50%,50%), 업체명(50%,20%), WiFi(50%,75%)
- top: QR(50%,25%), 업체명(50%,60%), WiFi(50%,80%)
- split-left: QR(25%,50%), 업체명(75%,30%), WiFi(75%,70%)

각 템플릿은 반드시 캔버스 내부에 모든 요소가 배치되어야 합니다.`;

    const user = `키워드: ${keywords.join(', ')}
생성할 템플릿 수: ${count}

각 키워드에 맞춘 프로페셔널 템플릿을 생성하세요. 모든 요소가 캔버스 내부에 정확히 배치되어야 합니다.

## 필수 레이아웃 좌표 (% 단위)

### 📐 레이아웃별 정확한 위치
**center**: QR(50%,45%), 업체명(50%,15%), WiFi(50%,75%), 설명(50%,85%)
**top**: QR(50%,20%), 업체명(50%,55%), WiFi(50%,75%), 설명(50%,85%)  
**bottom**: QR(50%,65%), 업체명(50%,15%), WiFi(50%,25%), 설명(50%,35%)
**split-left**: QR(25%,50%), 업체명(70%,25%), WiFi(70%,60%), 설명(70%,75%)
**split-right**: QR(75%,50%), 업체명(30%,25%), WiFi(30%,60%), 설명(30%,75%)

### 🎨 업종별 정확한 색상 코드
**카페**: bg #F5F5DC, accent #8B4513, text #2F1B14
**병원**: bg #F0FFFF, accent #20B2AA, text #003333  
**음식점**: bg #FFF8DC, accent #B8860B, text #4A4A4A
**현대적**: bg #F8F9FA, accent #343A40, text #212529
**키즈**: bg #E6F3FF, accent #0066FF, text #003366

### 📏 요소 크기 (캔버스 % 기준)
- QR 코드: width 30%, height 30%
- 업체명: width 80%, height 12%, fontSize 28pt
- WiFi 정보: width 70%, height 8%, fontSize 18pt
- 설명문: width 75%, height 6%, fontSize 14pt

### ⚡ 안전 영역 규칙
- 모든 요소는 가장자리에서 최소 5% 떨어진 곳에 배치
- 요소 간 최소 3% 간격 유지
- QR 코드 주변 최소 2% 여백 확보

JSON 스키마를 정확히 따라 templates 배열만 반환하세요.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        // NOTE: gpt-4.1 family does not support `temperature`.
        // Avoid using `max_tokens`; use `max_completion_tokens` instead if limiting output.
        max_completion_tokens: 1200,
        response_format: { type: 'json_schema', json_schema: jsonSchema },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenAI error:', err);
      return new Response(JSON.stringify({ error: 'OpenAI request failed', details: err }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';

    let parsed: unknown = null;
    try {
      // Try raw JSON
      parsed = JSON.parse(content);
    } catch {
      // Try to extract from fenced code
      const match = content.match(/```(?:json)?\n([\s\S]*?)```/i);
      if (match) {
        parsed = JSON.parse(match[1]);
      }
    }

    // Accept either an array or an object with templates array
    let parsedArray: any[] = [];
    if (Array.isArray(parsed)) {
      parsedArray = parsed as any[];
    } else if (parsed && typeof parsed === 'object' && Array.isArray((parsed as any).templates)) {
      parsedArray = (parsed as any).templates as any[];
    } else {
      return new Response(JSON.stringify({ error: 'Model did not return valid templates', raw: content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Basic sanitization
    const templates = parsedArray.slice(0, count).map((t: any, i: number) => ({
      id: String(t.id || `ai-template-${i+1}`),
      name: String(t.name || `AI 템플릿 ${i+1}`),
      description: String(t.description || ''),
      backgroundColor: String(t.backgroundColor || '#FFFFFF'),
      accentColor: String(t.accentColor || '#111827'),
      textColor: String(t.textColor || '#111827'),
      borderStyle: ['none','solid','dashed','rounded'].includes(t.borderStyle) ? t.borderStyle : 'rounded',
      icon: t.icon || 'sparkles',
      layout: allowedLayouts.includes(t.layout) ? t.layout : 'vertical_centered',
      qrSizeRatio: ['small','medium','large'].includes(t.qrSizeRatio) ? t.qrSizeRatio : 'large',
      backgroundPattern: allowedPatterns.includes(t.backgroundPattern) ? t.backgroundPattern : 'subtle-texture',
      decorativeElements: Array.isArray(t.decorativeElements) ? t.decorativeElements.filter((d: string) => allowedDecor.includes(d)) : [],
      category: t.category || 'minimal_business',
      aiGeneratedBackground: '',
      structure: t.structure,
    }));

    return new Response(JSON.stringify({ templates }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in generate-ai-template function:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
