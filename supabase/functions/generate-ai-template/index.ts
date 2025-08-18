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
                  items: { type: 'string', enum: allowedDecor },
                  uniqueItems: true,
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
                      items: { type: 'string', enum: allowedDecor },
                      uniqueItems: true
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

    const system = `당신은 한국 소상공인 포스터를 설계하는 시니어 그래픽 디자이너입니다. JSON 스키마를 엄격히 준수해 다양한 레이아웃을 생성하세요. QR 주위는 여백을 확보하고, 각 요소의 x,y는 '%'로, 대비/가독성을 확보하세요.`;

    const user = `키워드: ${keywords.join(', ')}\n개수: ${count}\n요구사항:\n- 서로 다른 레이아웃/구성(수평/수직/비대칭/tag_style)과 다양한 폰트/크기/정렬/패딩/간격 값을 섞어 만드세요.\n- 텍스트/QR이 겹치지 않도록 배치하고, 프린트 시 잘 보이게 대비를 확보하세요.\n- 색상은 hex, 위치는 'NN%' 문자열을 사용하세요.\n- templates 배열로만 반환하세요.`;

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
