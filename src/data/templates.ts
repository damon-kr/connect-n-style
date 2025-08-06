import { QRTemplate } from '@/types/wifi';

// Figma 기반 4가지 기본 템플릿
export const qrTemplates: QRTemplate[] = [
  {
    id: 'modern-clean',
    name: '모던 클린',
    description: '깔끔하고 세련된 현대적 디자인',
    backgroundColor: '#FFFFFF',
    accentColor: '#2563EB',
    textColor: '#1F2937',
    borderStyle: 'rounded',
    icon: 'wifi',
    layout: 'center',
    qrSizeRatio: 'medium',
    backgroundPattern: 'none',
    decorativeElements: ['corners'],
    structure: {
      layout: 'center',
      fontFamily: 'Noto Sans KR',
      fontSizes: { 
        storeName: 24, 
        wifiInfo: 16, 
        description: 14,
        qrLabel: 12
      },
      textAlign: 'center',
      spacing: {
        padding: 24,
        marginTop: 16,
        marginBottom: 16,
        elementGap: 12
      },
      decorativeElements: ['clean-border'],
      qrPosition: {
        x: '50%',
        y: '45%',
        size: 'medium'
      },
      textPositions: {
        storeName: { x: '50%', y: '15%' },
        wifiInfo: { x: '50%', y: '75%' },
        description: { x: '50%', y: '88%' }
      },
      colors: {
        primary: '#2563EB',
        secondary: '#64748B',
        accent: '#3B82F6',
        text: '#1F2937',
        background: '#FFFFFF'
      }
    }
  },
  {
    id: 'cafe-vintage',
    name: '카페 빈티지',
    description: '따뜻하고 아늑한 카페 분위기',
    backgroundColor: '#FEF7ED',
    accentColor: '#EA580C',
    textColor: '#9A3412',
    borderStyle: 'rounded',
    icon: 'coffee',
    layout: 'vertical_centered',
    qrSizeRatio: 'large',
    backgroundPattern: 'subtle-texture',
    decorativeElements: ['vintage-frame', 'coffee-icons'],
    structure: {
      layout: 'vertical_centered',
      fontFamily: 'Nanum Myeongjo',
      fontSizes: { 
        storeName: 28, 
        wifiInfo: 18, 
        description: 15,
        qrLabel: 13
      },
      textAlign: 'center',
      spacing: {
        padding: 28,
        marginTop: 20,
        marginBottom: 20,
        elementGap: 16
      },
      decorativeElements: ['vintage-ornaments', 'coffee-pattern'],
      qrPosition: {
        x: '50%',
        y: '50%',
        size: 'large'
      },
      textPositions: {
        storeName: { x: '50%', y: '12%' },
        wifiInfo: { x: '50%', y: '78%' },
        description: { x: '50%', y: '92%' }
      },
      colors: {
        primary: '#EA580C',
        secondary: '#FB923C',
        accent: '#FDBA74',
        text: '#9A3412',
        background: '#FEF7ED'
      }
    }
  },
  {
    id: 'business-professional',
    name: '비즈니스 프로페셔널',
    description: '전문적이고 신뢰감 있는 기업 스타일',
    backgroundColor: '#F8FAFC',
    accentColor: '#334155',
    textColor: '#0F172A',
    borderStyle: 'solid',
    icon: 'building',
    layout: 'horizontal_split',
    qrSizeRatio: 'medium',
    backgroundPattern: 'subtle-lines',
    decorativeElements: ['professional-frame'],
    structure: {
      layout: 'horizontal_split',
      fontFamily: 'Roboto',
      fontSizes: { 
        storeName: 26, 
        wifiInfo: 17, 
        description: 14,
        qrLabel: 12
      },
      textAlign: 'left',
      spacing: {
        padding: 32,
        marginTop: 18,
        marginBottom: 18,
        elementGap: 14
      },
      decorativeElements: ['corporate-lines', 'minimal-accent'],
      qrPosition: {
        x: '70%',
        y: '50%',
        size: 'medium'
      },
      textPositions: {
        storeName: { x: '25%', y: '25%' },
        wifiInfo: { x: '25%', y: '65%' },
        description: { x: '25%', y: '80%' }
      },
      colors: {
        primary: '#334155',
        secondary: '#64748B',
        accent: '#94A3B8',
        text: '#0F172A',
        background: '#F8FAFC'
      }
    }
  },
  {
    id: 'creative-colorful',
    name: '크리에이티브 컬러풀',
    description: '활기차고 창의적인 그라디언트 디자인',
    backgroundColor: '#F0F9FF',
    accentColor: '#7C3AED',
    textColor: '#581C87',
    borderStyle: 'none',
    icon: 'palette',
    layout: 'top_heavy',
    qrSizeRatio: 'large',
    backgroundPattern: 'gradient',
    decorativeElements: ['geometric-shapes', 'color-accents'],
    structure: {
      layout: 'top_heavy',
      fontFamily: 'Poppins',
      fontSizes: { 
        storeName: 32, 
        wifiInfo: 19, 
        description: 16,
        qrLabel: 14
      },
      textAlign: 'center',
      spacing: {
        padding: 30,
        marginTop: 22,
        marginBottom: 22,
        elementGap: 18
      },
      decorativeElements: ['gradient-overlay', 'creative-shapes'],
      qrPosition: {
        x: '50%',
        y: '60%',
        size: 'large'
      },
      textPositions: {
        storeName: { x: '50%', y: '18%' },
        wifiInfo: { x: '50%', y: '35%' },
        description: { x: '50%', y: '90%' }
      },
      colors: {
        primary: '#7C3AED',
        secondary: '#A855F7',
        accent: '#C084FC',
        text: '#581C87',
        background: '#F0F9FF'
      }
    }
  }
];

export const getTemplateById = (id: string): QRTemplate | undefined => {
  return qrTemplates.find(template => template.id === id);
};