import { supabase } from '@/integrations/supabase/client';
import { QRTemplate } from '@/types/wifi';
import { generateTemplatesFromKeywords } from '@/lib/aiTemplates';

export async function generateTemplatesWithOpenAI(keywords: string[]): Promise<QRTemplate[]> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-ai-template', {
      body: { keywords },
    });
    if (error) throw error;
    const templates = (data?.templates || []) as QRTemplate[];
    if (!Array.isArray(templates) || templates.length === 0) {
      throw new Error('Empty AI templates');
    }
    return templates;
  } catch (e) {
    // OpenAI 호출 실패 또는 한도 초과 시 로컬 프리셋으로 폴백
    return await generateTemplatesFromKeywords(keywords);
  }
}
