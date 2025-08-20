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
                      properties: {
                        x: { type: 'string', pattern: '^[0-9]{1,3}%$' },
                        y: { type: 'string', pattern: '^[0-9]{1,3}%$' },
                        size: { type: 'string', enum: ['small','medium','large'] }
                      },
                      required: ['x','y','size']
                    },
                    textPositions: {
                      type: 'object',
                      properties: {
                        storeName: {
                          type: 'object',
                          properties: { x: { type: 'string', pattern: '^[0-9]{1,3}%$' }, y: { type: 'string', pattern: '^[0-9]{1,3}%$' } },
                          required: ['x','y']
                        },
                        wifiInfo: {
                          type: 'object',
                          properties: { x: { type: 'string', pattern: '^[0-9]{1,3}%$' }, y: { type: 'string', pattern: '^[0-9]{1,3}%$' } },
                          required: ['x','y']
                        },
                        description: {
                          type: 'object',
                          properties: { x: { type: 'string', pattern: '^[0-9]{1,3}%$' }, y: { type: 'string', pattern: '^[0-9]{1,3}%$' } },
                          required: ['x','y']
                        }
                      },
                      required: ['storeName','wifiInfo','description']
                    },
                    colors: {
                      type: 'object',
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

    const system = `당신은 한국 소상공인을 위한 전문 그래픽 디자이너입니다. 한국 소상공인들이 실제로 사용할 수 있는 고품질의 QR코드 포스터 템플릿을 디자인해주세요.

핵심 요구사항:
1. 컨셉에 맞는 시각적 완성도: 각 업종/컨셉에 맞는 색상 조합, 폰트 스타일, 레이아웃 구성
2. 실용적인 배치: QR코드와 텍스트가 자연스럽게 어우러지며 시각적 균형을 이루도록 배치
3. 한국 문화에 맞는 디자인: 한국 소상공인 환경에 어울리는 색감과 스타일
4. 프린트 최적화: A4, A5 등 실제 프린트 환경에서 명확하게 보이는 대비와 크기

디자인 가이드라인:
- QR코드 주변 충분한 여백 확보 (최소 20px 마진)
- 업체명은 가장 눈에 띄는 위치에 큰 글씨로 배치
- WiFi 정보는 QR코드 근처에 명확하게 표시
- 색상 대비 최소 4.5:1 이상 확보 (접근성)
- 텍스트 요소들 간 적절한 시각적 계층 구조 형성`;

    const user = `키워드: ${keywords.join(', ')}\n생성할 템플릿 수: ${count}

각 키워드에 맞는 전문적인 템플릿을 생성해주세요:

📐 레이아웃 다양성:
- center: QR코드 중앙, 텍스트 상하 배치
- top/bottom: QR코드 상단/하단, 텍스트 반대편
- split-left/right: QR코드 좌/우측, 텍스트 반대편  
- vertical_centered: 세로 중심축 정렬
- horizontal_split: 가로 분할 구성
- tag_style: 태그/라벨 스타일

🎨 업종별 색상 가이드:
- 카페/음식점: 따뜻한 브라운, 오렌지, 크림 톤
- 병원/클리닉: 청록, 화이트, 라이트 블루
- 미용/뷰티: 핑크, 라벤더, 골드
- 현대적/테크: 다크 네이비, 실버, 블루
- 빈티지: 세피아, 베이지, 다크 브라운
- 키즈/컬러풀: 비비드 컬러들의 조화

📏 크기 및 배치:
- 업체명: 24-32px, 대담한 폰트
- WiFi 정보: 16-20px, 명확한 가독성  
- 설명문: 12-16px, 보조 정보
- QR코드: 전체 캔버스의 25-35% 크기
- 모든 요소 간 최소 15px 간격 유지

반드시 JSON 스키마를 정확히 따르고, templates 배열만 반환하세요.`;

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
