import { supabase } from '@/integrations/supabase/client';
import { QRTemplate } from '@/types/wifi';

const categoryPrompts: Record<NonNullable<QRTemplate['category']>, string> = {
  minimal_business: 'clean minimal Korean signage, soft neutral palette, subtle paper texture, elegant thin rules, professional and calm',
  cafe_vintage: 'vintage cafe poster, warm beige paper, coffee stains and subtle grain, retro ornaments, cozy mood',
  modern_bold: 'modern bold poster, dark slate background, neon accents, geometric shapes, high contrast, trendy nightlife',
  friendly_colorful: 'friendly playful poster, pastel palette, rounded shapes, dots pattern, soft gradients, kid-friendly',
  hospital_clean: 'clinical clean poster, white and mint background, subtle grid, clean lines, professional medical vibe',
  restaurant_elegant: 'elegant restaurant menu background, dark charcoal with gold accents, fine texture, refined frame',
  tag_style: 'tag label style, simple white card with clean border and drop shadow, product label aesthetic',
};

function buildPrompt(template: QRTemplate) {
  const cat = template.category || 'minimal_business';
  const base = categoryPrompts[cat];
  const palette = `primary accent color ${template.accentColor}, text color ${template.textColor}, background ${template.backgroundColor}`;
  // Background only, no text/qr, leave readability for QR
  return `${base}. abstract background only, no text, no logos, no QR, center kept less busy for readability, print-ready, high detail, soft lighting, seamless.` +
    ` Color palette hints: ${palette}.`;
}

export async function generateBackground(template: QRTemplate): Promise<string> {
  const prompt = buildPrompt(template);
  const { data, error } = await supabase.functions.invoke('generate-image', {
    body: { prompt, size: '1024x1024', background: 'opaque' },
  });
  if (error) throw error;
  // data.image is a data URL
  return data.image as string;
}
