import { QRTemplate } from '@/types/wifi';

export const qrTemplates: QRTemplate[] = [
  {
    id: 'modern-minimal',
    name: '모던 미니멀',
    description: '깔끔하고 심플한 디자인, 모든 비즈니스에 적합',
    backgroundColor: '#FFFFFF',
    accentColor: '#6366F1',
    textColor: '#1F2937',
    borderStyle: 'rounded',
    icon: 'wifi'
  },
  {
    id: 'cafe-warm',
    name: '카페 웜톤',
    description: '따뜻한 브라운 톤, 카페와 레스토랑에 이상적',
    backgroundColor: '#FEF7ED',
    accentColor: '#EA580C',
    textColor: '#9A3412',
    borderStyle: 'rounded',
    icon: 'coffee'
  },
  {
    id: 'business-professional',
    name: '비즈니스 프로페셔널',
    description: '기업 환경을 위한 전문적인 블루 테마',
    backgroundColor: '#F8FAFC',
    accentColor: '#0F172A',
    textColor: '#334155',
    borderStyle: 'solid',
    icon: 'building'
  },
  {
    id: 'vibrant-creative',
    name: '활기찬 크리에이티브',
    description: '창작 공간을 위한 대담한 그라디언트 디자인',
    backgroundColor: '#F3E8FF',
    accentColor: '#A855F7',
    textColor: '#581C87',
    borderStyle: 'none',
    icon: 'palette'
  },
  {
    id: 'nature-green',
    name: '자연 그린',
    description: '자연 친화적인 환경을 위한 그린 테마',
    backgroundColor: '#F0FDF4',
    accentColor: '#16A34A',
    textColor: '#14532D',
    borderStyle: 'rounded',
    icon: 'leaf'
  },
  {
    id: 'tech-dark',
    name: '테크 다크',
    description: '기술 회사와 모던 공간에 완벽한 다크 테마',
    backgroundColor: '#0F172A',
    accentColor: '#06B6D4',
    textColor: '#E2E8F0',
    borderStyle: 'solid',
    icon: 'monitor'
  },
  {
    id: 'elegant-gold',
    name: '엘레간트 골드',
    description: '프리미엄 시설을 위한 럭셔리한 골드 액센트',
    backgroundColor: '#FFFBEB',
    accentColor: '#D97706',
    textColor: '#92400E',
    borderStyle: 'rounded',
    icon: 'crown'
  },
  {
    id: 'retro-vintage',
    name: '레트로 빈티지',
    description: '클래식한 색상의 빈티지 영감 디자인',
    backgroundColor: '#FEF2F2',
    accentColor: '#DC2626',
    textColor: '#7F1D1D',
    borderStyle: 'dashed',
    icon: 'radio'
  },
  {
    id: 'cute-pastel',
    name: '귀여운 파스텔',
    description: '부드러운 파스텔 톤의 사랑스러운 디자인',
    backgroundColor: '#FDF2F8',
    accentColor: '#EC4899',
    textColor: '#BE185D',
    borderStyle: 'rounded',
    icon: 'wifi'
  },
  {
    id: 'classic-elegant',
    name: '클래식 엘레간트',
    description: '전통적이고 우아한 스타일의 고급스러운 디자인',
    backgroundColor: '#F8FAFC',
    accentColor: '#475569',
    textColor: '#1E293B',
    borderStyle: 'solid',
    icon: 'building'
  },
  {
    id: 'trendy-neon',
    name: '트렌디 네온',
    description: '젊고 트렌디한 네온 컬러의 현대적 디자인',
    backgroundColor: '#0F172A',
    accentColor: '#10B981',
    textColor: '#D1FAE5',
    borderStyle: 'none',
    icon: 'palette'
  },
  {
    id: 'rustic-vintage',
    name: '고풍스러운 빈티지',
    description: '따뜻하고 고풍스러운 분위기의 클래식 디자인',
    backgroundColor: '#FEF3C7',
    accentColor: '#92400E',
    textColor: '#451A03',
    borderStyle: 'dashed',
    icon: 'radio'
  }
];

export const getTemplateById = (id: string): QRTemplate | undefined => {
  return qrTemplates.find(template => template.id === id);
};