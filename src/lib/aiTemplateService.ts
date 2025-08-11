import { supabase } from '@/integrations/supabase/client';
import { QRTemplate } from '@/types/wifi';

export async function generateTemplatesWithOpenAI(keywords: string[]): Promise<QRTemplate[]> {
  const { data, error } = await supabase.functions.invoke('generate-ai-template', {
    body: { keywords },
  });
  if (error) throw error;
  // API returns { templates }
  return (data?.templates || []) as QRTemplate[];
}
