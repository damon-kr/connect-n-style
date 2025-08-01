import { AIGeneratedTemplate } from "@/types/wifi";

export type LayoutType = 'vertical_centered' | 'horizontal_split' | 'top_heavy' | 'bottom_heavy' | 'tag_style';
export type CategoryType = 'minimal_business' | 'cafe_vintage' | 'modern_bold' | 'friendly_colorful';

// AI 프롬프트 생성 함수
export const buildTemplatePrompt = (category: CategoryType, layout: LayoutType): string => {
  const categoryPrompts = {
    minimal_business: "Professional WiFi QR card template, clean white background, blue accent color, modern sans-serif typography, minimalist design, business card style",
    cafe_vintage: "Vintage cafe WiFi QR card template, warm beige background, brown earth tones, decorative border elements, rustic texture, handwritten style fonts",
    modern_bold: "Modern bold WiFi QR card template, high contrast colors, geometric shapes, strong typography, contemporary design, striking visual impact",
    friendly_colorful: "Friendly colorful WiFi QR card template, bright cheerful background, rounded corners, playful colors, welcoming atmosphere, icon elements"
  };

  const layoutPrompts = {
    vertical_centered: "vertical layout with QR code centered, text above and below",
    horizontal_split: "horizontal split layout with text on left side and QR code on right side",
    top_heavy: "top-heavy layout with large title area at top and QR code at bottom",
    bottom_heavy: "bottom-heavy layout with QR code at top and emphasis text area at bottom",
    tag_style: "tag style layout with hanging hole at top, vertical arrangement"
  };

  return `${categoryPrompts[category]}, ${layoutPrompts[layout]}, print-ready design, 300 DPI resolution, high quality professional template`;
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