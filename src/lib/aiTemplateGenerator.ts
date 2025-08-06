import { AIGeneratedTemplate, TemplateStructure } from "@/types/wifi";
import { supabase } from "@/integrations/supabase/client";
import { templateStructures, generateConceptPrompt } from "./templateStructures";

export type LayoutType = 'vertical_centered' | 'horizontal_split' | 'top_heavy' | 'bottom_heavy' | 'tag_style';
export type CategoryType = 'minimal_business' | 'cafe_vintage' | 'modern_bold' | 'friendly_colorful' | 'hospital_clean' | 'restaurant_elegant' | 'tag_style';

// 컨셉별 구조 기반 AI 프롬프트 생성
export const buildTemplatePrompt = (category: CategoryType, layout: LayoutType): string => {
  const structure = templateStructures[category] || templateStructures.minimal_business;
  return generateConceptPrompt(category, structure);
};

// AI 이미지 생성 함수 (Supabase Edge Function 사용) - 완전 재작성
export const generateAIBackgroundImage = async (prompt: string, category: CategoryType, layout: LayoutType): Promise<string> => {
  try {
    console.log('=== AI Template Generation Start ===');
    console.log('Prompt:', prompt);
    console.log('Category:', category);
    console.log('Layout:', layout);
    
    const { data, error } = await supabase.functions.invoke('generate-ai-template', {
      method: 'POST',
      body: { 
        prompt: prompt.trim(), 
        category, 
        layout 
      }
    });

    console.log('Supabase function response:', { data, error });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`AI 생성 실패: ${error.message}`);
    }

    if (!data || !data.template || !data.template.generatedImageUrl) {
      console.error('Invalid response structure:', data);
      throw new Error('AI 응답 형식이 올바르지 않습니다');
    }

    console.log('AI image generated successfully:', data.template.generatedImageUrl.substring(0, 100) + '...');
    return data.template.generatedImageUrl;
    
  } catch (error) {
    console.error('=== AI Generation Failed ===');
    console.error('Error details:', error);
    
    // 안정성 있는 폴백 생성
    const structure = templateStructures[category] || templateStructures.minimal_business;
    const colors = structure.colors;
    
    const fallbackSvg = `
      <svg width="1024" height="640" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.background}"/>
            <stop offset="100%" style="stop-color:${colors.accent}"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="50%" y="30%" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${colors.text}" text-anchor="middle" dy=".3em">
          ${category.replace('_', ' ')} Style
        </text>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="${colors.text}" text-anchor="middle" dy=".3em">
          ${layout.replace('_', ' ')} Layout
        </text>
        <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="16" fill="${colors.text}" text-anchor="middle" dy=".3em">
          Fallback Template (AI 생성 실패)
        </text>
      </svg>
    `.trim();
    
    const mockImageData = btoa(fallbackSvg);
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
  
  // 템플릿 구조 정보 포함
  const structure = templateStructures[category] || templateStructures.minimal_business;
  
  const template: AIGeneratedTemplate = {
    id: `ai-${category}-${layout}-${Date.now()}`,
    name: `AI ${category.replace('_', ' ')} - ${layout.replace('_', ' ')}`,
    generatedImageUrl,
    layoutType: layout,
    printOptimized: true,
    category,
    prompt: basePrompt,
    structure // 구조 정보 추가
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

// 다중 이미지 생성 함수
export const generateMultipleVariations = async (
  category: CategoryType,
  layout: LayoutType,
  count: number = 3,
  customPrompt?: string
): Promise<AIGeneratedTemplate[]> => {
  const basePrompt = customPrompt || buildTemplatePrompt(category, layout);
  
  const templatePromises = Array.from({ length: count }, (_, index) => {
    const variedPrompt = addPromptVariation(basePrompt, index);
    return generateAITemplate(category, layout, variedPrompt);
  });
  
  return Promise.all(templatePromises);
};

// 배치별 템플릿 생성 (한 레이아웃당 하나씩)
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