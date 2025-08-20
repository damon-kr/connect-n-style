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
    
    const templates = (data?.templates || []) as QRTemplate[];
    if (!Array.isArray(templates) || templates.length === 0) {
      console.warn('⚠️ 빈 템플릿 배열 반환됨');
      throw new Error('Empty AI templates');
    }
    
    console.log('✅ OpenAI 템플릿 생성 성공:', templates.length, '개');
    return templates;
  } catch (e) {
    console.error('💥 OpenAI 템플릿 생성 실패, 로컬 프리셋으로 폴백:', e);
    // OpenAI 호출 실패 또는 한도 초과 시 로컬 프리셋으로 폴백
    const fallbackTemplates = await generateTemplatesFromKeywords(keywords);
    console.log('🔄 로컬 프리셋 템플릿 생성됨:', fallbackTemplates.length, '개');
    return fallbackTemplates;
  }
}
