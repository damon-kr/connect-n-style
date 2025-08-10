import { QRTemplate } from '@/types/wifi';

// 기존 프리셋 템플릿을 초기화합니다. 이제 템플릿은 AI 생성기를 통해 동적으로 제공됩니다.
export const qrTemplates: QRTemplate[] = [];

export const getTemplateById = (id: string): QRTemplate | undefined => {
  return qrTemplates.find(template => template.id === id);
};
