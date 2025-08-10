import { QRTemplate } from '@/types/wifi';

// 기존 프리셋 템플릿을 완전히 초기화합니다. 
// 이제 모든 템플릿은 AI 생성기를 통해 동적으로 제공됩니다.
export const qrTemplates: QRTemplate[] = [];

export const getTemplateById = (id: string): QRTemplate | undefined => {
  return qrTemplates.find(template => template.id === id);
};

// 템플릿 추가 함수 (AI 생성기에서 사용)
export const addTemplate = (template: QRTemplate) => {
  qrTemplates.push(template);
};

// 템플릿 목록 초기화 함수
export const clearTemplates = () => {
  qrTemplates.length = 0;
};

// 템플릿 업데이트 함수
export const updateTemplate = (id: string, updates: Partial<QRTemplate>) => {
  const index = qrTemplates.findIndex(template => template.id === id);
  if (index !== -1) {
    qrTemplates[index] = { ...qrTemplates[index], ...updates };
  }
};
