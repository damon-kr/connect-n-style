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

    const system = `You are a senior Korean graphic designer generating structured QR poster templates for print. Output JSON ONLY.`;
    const user = `Create ${count} diverse WiFi QR poster templates tailored for Korean businesses using these keywords: ${keywords.join(', ')}.
Return a pure JSON array (no markdown) of objects matching this TypeScript type fields:
{
  id: string; // unique id (kebab-case)
  name: string; // short display name in Korean
  description: string; // brief Korean description
  backgroundColor: string; // hex
  accentColor: string; // hex
  textColor: string; // hex
  borderStyle: 'none' | 'solid' | 'dashed' | 'rounded';
  icon?: string; // simple keyword like 'sparkles'
  layout: ${JSON.stringify(allowedLayouts)} one of
  qrSizeRatio: 'small' | 'medium' | 'large';
  backgroundPattern?: ${JSON.stringify(allowedPatterns)} one of
  decorativeElements?: ${JSON.stringify(allowedDecor)} subset array
  category?: 'minimal_business' | 'cafe_vintage' | 'modern_bold' | 'friendly_colorful' | 'hospital_clean' | 'restaurant_elegant' | 'tag_style';
  aiGeneratedBackground?: string; // leave empty string
  structure: {
    layout: ${JSON.stringify(allowedLayouts)} one of;
    fontFamily: string; // choose from Inter, Noto Sans KR, Pretendard
    fontSizes: { storeName: number; wifiInfo: number; description: number; qrLabel: number };
    textAlign: 'left' | 'center' | 'right';
    spacing: { padding: number; marginTop: number; marginBottom: number; elementGap: number };
    decorativeElements: ${JSON.stringify(allowedDecor)} subset array;
    qrPosition: { x: string; y: string; size: 'small' | 'medium' | 'large' }; // percentage strings for x,y
    textPositions: { storeName: {x: string; y: string}; wifiInfo: {x: string; y: string}; description: {x: string; y: string} };
    colors: { primary: string; secondary: string; accent: string; text: string; background: string };
  };
}
Rules:
- Ensure contrast and print readability; keep QR area less busy.
- Provide varied layouts (horizontal, vertical, asymmetric, tag_style) and sizes.
- Use hex colors; ensure Korean-friendly typography.
- Use only allowed decorativeElements values.
- x,y are percentage strings like '50%'.
- aiGeneratedBackground must be '' (empty) for now.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        temperature: 0.8,
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

    if (!Array.isArray(parsed)) {
      return new Response(JSON.stringify({ error: 'Model did not return a JSON array', raw: content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Basic sanitization
    const templates = (parsed as any[]).slice(0, count).map((t, i) => ({
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
