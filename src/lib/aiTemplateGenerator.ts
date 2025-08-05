import { AIGeneratedTemplate } from "@/types/wifi";

export type LayoutType = 'vertical_centered' | 'horizontal_split' | 'top_heavy' | 'bottom_heavy' | 'tag_style';
export type CategoryType = 'minimal_business' | 'cafe_vintage' | 'modern_bold' | 'friendly_colorful';

// AI 프롬프트 생성 함수 - 실제 비즈니스 카드 수준의 디테일한 프롬프트
export const buildTemplatePrompt = (category: CategoryType, layout: LayoutType): string => {
  const categoryPrompts = {
    minimal_business: "Professional business card design for WiFi access, clean white background with elegant navy blue (#1e3a8a) accent elements, sophisticated corporate typography using Helvetica/Arial font family, minimalist geometric border design, subtle company logo placeholder area, premium business card aesthetic with high-end printing quality, professional office environment suitable",
    cafe_vintage: "Vintage coffee shop WiFi access card, warm cream/beige background (#f5f5dc), hand-lettered script font for 'WiFi' title, decorative coffee bean illustrations as border ornaments, vintage cafe atmosphere with steam wisps, rustic wooden texture elements, antique paper aging effect, warm sepia brown color palette (#8b4513), artisanal coffee shop branding style",
    modern_bold: "Contemporary tech-forward WiFi card design, pristine white base with electric blue (#0066ff) geometric accent lines, ultra-modern sans-serif typography (Roboto/Montserrat style), angular geometric patterns, sleek tech company branding, minimalist Scandinavian design influence, clean architectural lines, high-tech corporate aesthetic",
    friendly_colorful: "Welcoming family-friendly WiFi card, soft pastel background with cheerful rainbow accent colors (#ff6b6b coral, #4ecdc4 turquoise), playful rounded typography, simple line-art icons (heart, smile, home), warm welcoming atmosphere, child-friendly design elements, cozy home/cafe environment, approachable community feeling"
  };

  const layoutPrompts = {
    vertical_centered: "vertical business card layout: elegant 'WiFi' title at top center, spacious middle area reserved for QR code placement, network information section at bottom, symmetrical balanced composition, plenty of white space for readability",
    horizontal_split: "horizontal business card format: decorative branded left section (1/3 width) with ornamental elements and WiFi title, large right section (2/3 width) designated for QR code and network details, professional landscape orientation",
    top_heavy: "top-weighted design layout: substantial header section occupying upper 40% with branding and decorative elements, compressed lower area for QR code and essential information, authoritative business card hierarchy",
    bottom_heavy: "bottom-emphasized layout: minimal clean upper section with small QR area, expansive decorative footer section with ornamental patterns and ample space for network information, elegant invitation card style",
    tag_style: "hanging luggage tag format: authentic tag shape with hole punched at top center, natural vertical flow from hanging hole to QR placement to text area, realistic tag proportions and texture, practical travel tag aesthetic"
  };

  const printSpecs = "Ultra-high resolution print-ready design, 300 DPI minimum quality, standard business card dimensions 3.5×2 inches (89×51mm), professional CMYK color profile, proper 0.125 inch bleed margins, ink-efficient color usage under 20% coverage, laser printer optimized contrast ratios, commercial printing quality, vector-style graphics preferred over gradients";

  const designDetails = "Include realistic business card details: subtle drop shadows, professional typography hierarchy, appropriate negative space usage, authentic material textures (paper, cardstock), realistic lighting and depth, commercial print production ready, NO QR code in the design (QR will be added separately), focus on background design and text layout areas only";

  return `Create a ${categoryPrompts[category]} with ${layoutPrompts[layout]}. ${printSpecs}. ${designDetails}. Design should look like a real professional business card you'd receive at a high-end establishment.`;
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

// 프롬프트에 변화를 주어 다양한 이미지 생성
const addPromptVariation = (basePrompt: string, variationIndex: number): string => {
  const variations = [
    'elegant and sophisticated style',
    'warm and inviting atmosphere', 
    'modern minimalist approach',
    'creative artistic flair',
    'premium luxury feel'
  ];
  
  const currentVariation = variations[variationIndex % variations.length];
  return `${basePrompt}. Additional style guidance: ${currentVariation}, unique visual elements, distinctive design character.`;
};

// 배치별 템플릿 생성
export const generateTemplatesBatch = async (
  category: CategoryType,
  customPrompt?: string
): Promise<AIGeneratedTemplate[]> => {
  const layouts: LayoutType[] = ['vertical_centered', 'horizontal_split', 'top_heavy', 'bottom_heavy', 'tag_style'];
  
  const templatePromises = layouts.map((layout, index) => {
    const basePrompt = customPrompt || buildTemplatePrompt(category, layout);
    const variedPrompt = addPromptVariation(basePrompt, index);
    return generateAITemplate(category, layout, variedPrompt);
  });
  
  return Promise.all(templatePromises);
};