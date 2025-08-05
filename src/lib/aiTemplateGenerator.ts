import { AIGeneratedTemplate } from "@/types/wifi";

export type LayoutType = 'vertical_centered' | 'horizontal_split' | 'top_heavy' | 'bottom_heavy' | 'tag_style';
export type CategoryType = 'minimal_business' | 'cafe_vintage' | 'modern_bold' | 'friendly_colorful';

// AI 프롬프트 생성 함수 - 더 구체적이고 디테일한 프롬프트
export const buildTemplatePrompt = (category: CategoryType, layout: LayoutType): string => {
  const categoryPrompts = {
    minimal_business: "Professional WiFi QR code card design, pristine white background, elegant navy blue accents (#1e3a8a), Helvetica Neue or Inter font family, ultra-clean typography, subtle shadow effects, corporate business card aesthetic, premium quality finish",
    cafe_vintage: "Vintage coffee shop WiFi card design, warm cream parchment background (#f5f5dc), rich brown coffee tones (#8b4513), hand-drawn decorative flourishes, vintage ornamental borders, rustic coffee bean illustrations, handwritten script 'WiFi' lettering, antique typography, distressed texture overlay",
    modern_bold: "Contemporary bold WiFi card design, high-contrast black and electric blue (#0066ff), geometric hexagonal patterns, sleek Montserrat or Roboto font, dynamic angular shapes, gradient overlays, futuristic tech aesthetic, striking visual hierarchy",
    friendly_colorful: "Cheerful family-friendly WiFi card, soft pastel rainbow background, rounded corner design, playful sans-serif typography, cute WiFi signal icons, warm welcoming colors (#ff6b6b, #4ecdc4, #45b7d1), cartoon-style illustrations, kid-friendly atmosphere"
  };

  const layoutPrompts = {
    vertical_centered: "centered vertical layout with 'WiFi' title at top, QR code prominently in center, network details below, balanced composition",
    horizontal_split: "split horizontal layout with decorative text area on left third, large QR code positioned on right two-thirds, professional business card proportion",
    top_heavy: "top-emphasized layout with large branded header section taking upper 40%, QR code and details in compact lower section",
    bottom_heavy: "bottom-weighted design with compact QR code in upper area, expansive decorative footer with network information and styling elements",
    tag_style: "hanging tag format with punched hole at top center, vertical flow from hole to QR to text, authentic luggage tag proportions"
  };

  const printSpecs = "print-optimized design, 300 DPI resolution, 3.5x2 inch business card dimensions, CMYK color profile, 0.125 inch bleed area, ink-efficient color usage";

  return `Create a ${categoryPrompts[category]} with ${layoutPrompts[layout]}. ${printSpecs}. Photorealistic quality, no placeholder text, ready for immediate use.`;
};

// AI 이미지 생성 함수 (실제 OpenAI API 사용)
export const generateAIBackgroundImage = async (prompt: string, category: CategoryType, layout: LayoutType): Promise<string> => {
  try {
    console.log('Generating AI image with prompt:', prompt);
    
    const response = await fetch('https://gsnswkhsidrcfckkshrf.supabase.co/functions/v1/generate-ai-template', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzbnN3a2hzaWRyY2Zja2tzaHJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDY0MTEsImV4cCI6MjA2OTUyMjQxMX0.hCbEoCTIQVuzJTr860zXF5SYgWnBTj1UET3wZnG_rqU'}`,
      },
      body: JSON.stringify({
        prompt,
        category,
        layout
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate AI image');
    }

    const data = await response.json();
    return data.template.generatedImageUrl;
  } catch (error) {
    console.error('AI image generation failed:', error);
    
    // Fallback to SVG placeholder if API fails
    const mockImageData = btoa(`
      <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f8f9fa"/>
            <stop offset="100%" style="stop-color:#e9ecef"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="50%" y="30%" font-family="Arial" font-size="24" fill="#6c757d" text-anchor="middle" dy=".3em">
          ${category.replace('_', ' ')} Style
        </text>
        <text x="50%" y="50%" font-family="Arial" font-size="18" fill="#6c757d" text-anchor="middle" dy=".3em">
          ${layout.replace('_', ' ')} Layout
        </text>
        <text x="50%" y="70%" font-family="Arial" font-size="14" fill="#6c757d" text-anchor="middle" dy=".3em">
          AI Generation Failed - Using Fallback
        </text>
      </svg>
    `);
    
    return `data:image/svg+xml;base64,${mockImageData}`;
  }
};

// 템플릿 생성 함수
export const generateAITemplate = async (
  category: CategoryType,
  layout: LayoutType,
  customPrompt?: string
): Promise<AIGeneratedTemplate> => {
  const basePrompt = customPrompt || buildTemplatePrompt(category, layout);
  const generatedImageUrl = await generateAIBackgroundImage(basePrompt, category, layout);
  
  const template: AIGeneratedTemplate = {
    id: `ai-${category}-${layout}-${Date.now()}`,
    name: `AI ${category.replace('_', ' ')} - ${layout.replace('_', ' ')}`,
    generatedImageUrl,
    layoutType: layout,
    printOptimized: true,
    category,
    prompt: basePrompt
  };
  
  return template;
};

// 배치별 템플릿 생성
export const generateTemplatesBatch = async (
  category: CategoryType,
  customPrompt?: string
): Promise<AIGeneratedTemplate[]> => {
  const layouts: LayoutType[] = ['vertical_centered', 'horizontal_split', 'top_heavy', 'bottom_heavy', 'tag_style'];
  
  const templatePromises = layouts.map(layout => 
    generateAITemplate(category, layout, customPrompt)
  );
  
  return Promise.all(templatePromises);
};