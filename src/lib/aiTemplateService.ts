import { supabase } from '@/integrations/supabase/client';
import { QRTemplate } from '@/types/wifi';
import { generateTemplatesFromKeywords } from '@/lib/aiTemplates';

export async function generateTemplatesWithOpenAI(keywords: string[]): Promise<QRTemplate[]> {
  try {
    console.log('🚀 OpenAI 템플릿 생성 시작:', keywords);
    
    const { data, error } = await supabase.functions.invoke('generate-ai-template', {
      body: { keywords },
    });
    
    if (error) {
      console.error('❌ Supabase Edge Function 오류:', error);
      throw error;
    }
    
    console.log('📦 Edge Function 응답 데이터:', data);
    
    const rawTemplates = (data?.templates || []) as any[];
    if (!Array.isArray(rawTemplates) || rawTemplates.length === 0) {
      console.warn('⚠️ 빈 템플릿 배열 반환됨');
      throw new Error('Empty AI templates');
    }

    const clampPct = (val: any) => {
      const n = typeof val === 'string' ? parseFloat(val) : Number(val);
      const c = Math.max(5, Math.min(95, isNaN(n) ? 50 : n));
      return `${c}%`;
    };

    const defaultByLayout: Record<string, any> = {
      center: {
        qrPosition: { x: '50%', y: '45%', size: 'large' },
        textPositions: {
          storeName: { x: '50%', y: '15%' },
          wifiInfo: { x: '50%', y: '75%' },
          description: { x: '50%', y: '85%' },
        },
      },
      top: {
        qrPosition: { x: '50%', y: '20%', size: 'large' },
        textPositions: {
          storeName: { x: '50%', y: '55%' },
          wifiInfo: { x: '50%', y: '75%' },
          description: { x: '50%', y: '85%' },
        },
      },
      'split-left': {
        qrPosition: { x: '25%', y: '50%', size: 'large' },
        textPositions: {
          storeName: { x: '70%', y: '25%' },
          wifiInfo: { x: '70%', y: '60%' },
          description: { x: '70%', y: '75%' },
        },
      },
      'split-right': {
        qrPosition: { x: '75%', y: '50%', size: 'large' },
        textPositions: {
          storeName: { x: '30%', y: '25%' },
          wifiInfo: { x: '30%', y: '60%' },
          description: { x: '30%', y: '75%' },
        },
      },
    };

    const normalize = (t: any): QRTemplate => {
      const layout = t.layout && typeof t.layout === 'string' ? t.layout : 'center';
      const base = defaultByLayout[layout] || defaultByLayout.center;
      const struct = t.structure || {};
      const qrPos = struct.qrPosition || base.qrPosition;
      const textPos = struct.textPositions || base.textPositions;

      const structure = {
        layout,
        fontFamily: struct.fontFamily || 'Inter',
        fontSizes: {
          storeName: typeof struct?.fontSizes?.storeName === 'number' ? struct.fontSizes.storeName : 28,
          wifiInfo: typeof struct?.fontSizes?.wifiInfo === 'number' ? struct.fontSizes.wifiInfo : 18,
          description: typeof struct?.fontSizes?.description === 'number' ? struct.fontSizes.description : 14,
          qrLabel: typeof struct?.fontSizes?.qrLabel === 'number' ? struct.fontSizes.qrLabel : 12,
        },
        textAlign: struct.textAlign || 'center',
        spacing: {
          padding: typeof struct?.spacing?.padding === 'number' ? struct.spacing.padding : 16,
          marginTop: typeof struct?.spacing?.marginTop === 'number' ? struct.spacing.marginTop : 8,
          marginBottom: typeof struct?.spacing?.marginBottom === 'number' ? struct.spacing.marginBottom : 8,
          elementGap: typeof struct?.spacing?.elementGap === 'number' ? struct.spacing.elementGap : 6,
        },
        decorativeElements: Array.isArray(struct.decorativeElements) ? struct.decorativeElements : (t.decorativeElements || []),
        qrPosition: {
          x: clampPct(qrPos.x ?? base.qrPosition.x),
          y: clampPct(qrPos.y ?? base.qrPosition.y),
          size: ['small','medium','large'].includes(qrPos.size) ? qrPos.size : 'large',
        },
        textPositions: {
          storeName: { x: clampPct(textPos.storeName?.x ?? base.textPositions.storeName.x), y: clampPct(textPos.storeName?.y ?? base.textPositions.storeName.y) },
          wifiInfo: { x: clampPct(textPos.wifiInfo?.x ?? base.textPositions.wifiInfo.x), y: clampPct(textPos.wifiInfo?.y ?? base.textPositions.wifiInfo.y) },
          description: { x: clampPct(textPos.description?.x ?? base.textPositions.description.x), y: clampPct(textPos.description?.y ?? base.textPositions.description.y) },
        },
        colors: {
          primary: t.accentColor || '#111827',
          secondary: t.backgroundColor || '#FFFFFF',
          accent: t.accentColor || '#111827',
          text: t.textColor || '#111827',
          background: t.backgroundColor || '#FFFFFF',
        },
      };

      return {
        id: String(t.id || crypto.randomUUID?.() || `ai-template-${Math.random().toString(36).slice(2,8)}`),
        name: String(t.name || 'AI 템플릿'),
        description: String(t.description || ''),
        backgroundColor: String(t.backgroundColor || '#FFFFFF'),
        accentColor: String(t.accentColor || '#111827'),
        textColor: String(t.textColor || '#111827'),
        borderStyle: ['none','solid','dashed','rounded'].includes(t.borderStyle) ? t.borderStyle : 'rounded',
        icon: t.icon || 'sparkles',
        layout,
        qrSizeRatio: ['small','medium','large'].includes(t.qrSizeRatio) ? t.qrSizeRatio : 'large',
        backgroundPattern: t.backgroundPattern || 'subtle-texture',
        decorativeElements: Array.isArray(t.decorativeElements) ? t.decorativeElements : [],
        category: t.category || 'minimal_business',
        aiGeneratedBackground: String(t.aiGeneratedBackground || ''),
        structure,
      } as QRTemplate;
    };

    const templates = rawTemplates.map(normalize);
    console.log('✅ OpenAI 템플릿 생성 성공(정규화 후):', templates.length, '개');
    return templates;
  } catch (e) {
    console.error('💥 OpenAI 템플릿 생성 실패, 로컬 프리셋으로 폴백:', e);
    // OpenAI 호출 실패 또는 한도 초과 시 로컬 프리셋으로 폴백
    const fallback = await generateTemplatesFromKeywords(keywords);

    const clampPct = (val: any) => {
      const n = typeof val === 'string' ? parseFloat(val) : Number(val);
      const c = Math.max(5, Math.min(95, isNaN(n) ? 50 : n));
      return `${c}%`;
    };

    const defaultByLayout: Record<string, any> = {
      center: {
        qrPosition: { x: '50%', y: '45%', size: 'large' },
        textPositions: {
          storeName: { x: '50%', y: '15%' },
          wifiInfo: { x: '50%', y: '75%' },
          description: { x: '50%', y: '85%' },
        },
      },
    };

    const normalizedFallback = fallback.map((t: any) => {
      const layout = t.layout || 'center';
      const base = defaultByLayout[layout] || defaultByLayout.center;
      return {
        ...t,
        structure: t.structure || {
          layout,
          fontFamily: 'Inter',
          fontSizes: { storeName: 28, wifiInfo: 18, description: 14, qrLabel: 12 },
          textAlign: 'center',
          spacing: { padding: 16, marginTop: 8, marginBottom: 8, elementGap: 6 },
          decorativeElements: t.decorativeElements || [],
          qrPosition: base.qrPosition,
          textPositions: base.textPositions,
          colors: { primary: t.accentColor, secondary: t.backgroundColor, accent: t.accentColor, text: t.textColor, background: t.backgroundColor },
        }
      } as QRTemplate;
    });

    console.log('🔄 로컬 프리셋 템플릿 정규화 완료:', normalizedFallback.length, '개');
    return normalizedFallback;
  }
}
