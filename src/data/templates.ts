import { QRTemplate } from '@/types/wifi';

// 피그마 11개 샘플 분석 기반 템플릿
export const qrTemplates: QRTemplate[] = [
  {
    id: 'minimal-clean',
    name: '미니멀 클린',
    description: '깔끔하고 심플한 미니멀 디자인',
    backgroundColor: '#FFFFFF',
    accentColor: '#1F2937',
    textColor: '#374151',
    borderStyle: 'none',
    icon: 'wifi',
    layout: 'center',
    qrSizeRatio: 'medium',
    backgroundPattern: 'none',
    decorativeElements: [],
    structure: {
      layout: 'center',
      fontFamily: 'Inter',
      fontSizes: { 
        storeName: 32, 
        wifiInfo: 20, 
        description: 16,
        qrLabel: 14
      },
      textAlign: 'center',
      spacing: {
        padding: 40,
        marginTop: 20,
        marginBottom: 20,
        elementGap: 16
      },
      decorativeElements: [],
      qrPosition: {
        x: '50%',
        y: '50%',
        size: 'medium'
      },
      textPositions: {
        storeName: { x: '50%', y: '25%' },
        wifiInfo: { x: '50%', y: '75%' },
        description: { x: '50%', y: '85%' }
      },
      colors: {
        primary: '#1F2937',
        secondary: '#6B7280',
        accent: '#3B82F6',
        text: '#374151',
        background: '#FFFFFF'
      }
    }
  },
  {
    id: 'cafe-warm',
    name: '카페 웜',
    description: '따뜻한 카페 분위기의 디자인',
    backgroundColor: '#FEF3C7',
    accentColor: '#D97706',
    textColor: '#92400E',
    borderStyle: 'rounded',
    icon: 'coffee',
    layout: 'vertical_centered',
    qrSizeRatio: 'large',
    backgroundPattern: 'subtle-texture',
    decorativeElements: ['vintage-frame'],
    structure: {
      layout: 'vertical_centered',
      fontFamily: 'Noto Serif KR',
      fontSizes: { 
        storeName: 36, 
        wifiInfo: 22, 
        description: 18,
        qrLabel: 16
      },
      textAlign: 'center',
      spacing: {
        padding: 32,
        marginTop: 24,
        marginBottom: 24,
        elementGap: 20
      },
      decorativeElements: ['vintage-ornaments'],
      qrPosition: {
        x: '50%',
        y: '55%',
        size: 'large'
      },
      textPositions: {
        storeName: { x: '50%', y: '18%' },
        wifiInfo: { x: '50%', y: '80%' },
        description: { x: '50%', y: '90%' }
      },
      colors: {
        primary: '#D97706',
        secondary: '#F59E0B',
        accent: '#FCD34D',
        text: '#92400E',
        background: '#FEF3C7'
      }
    }
  },
  {
    id: 'business-professional',
    name: '비즈니스 프로페셔널',
    description: '전문적이고 신뢰감 있는 기업 스타일',
    backgroundColor: '#F8FAFC',
    accentColor: '#1E293B',
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
        storeName: 34, 
        wifiInfo: 21, 
        description: 17,
        qrLabel: 15
      },
      textAlign: 'left',
      spacing: {
        padding: 36,
        marginTop: 20,
        marginBottom: 20,
        elementGap: 18
      },
      decorativeElements: ['corporate-lines'],
      qrPosition: {
        x: '70%',
        y: '50%',
        size: 'medium'
      },
      textPositions: {
        storeName: { x: '25%', y: '30%' },
        wifiInfo: { x: '25%', y: '60%' },
        description: { x: '25%', y: '75%' }
      },
      colors: {
        primary: '#1E293B',
        secondary: '#475569',
        accent: '#64748B',
        text: '#0F172A',
        background: '#F8FAFC'
      }
    }
  },
  {
    id: 'hospital-clean',
    name: '병원 클린',
    description: '깔끔하고 위생적인 병원 스타일',
    backgroundColor: '#F0F9FF',
    accentColor: '#0369A1',
    textColor: '#0C4A6E',
    borderStyle: 'rounded',
    icon: 'cross',
    layout: 'center',
    qrSizeRatio: 'medium',
    backgroundPattern: 'none',
    decorativeElements: ['clean-border'],
    structure: {
      layout: 'center',
      fontFamily: 'Inter',
      fontSizes: { 
        storeName: 30, 
        wifiInfo: 19, 
        description: 16,
        qrLabel: 14
      },
      textAlign: 'center',
      spacing: {
        padding: 38,
        marginTop: 18,
        marginBottom: 18,
        elementGap: 15
      },
      decorativeElements: ['clean-border'],
      qrPosition: {
        x: '50%',
        y: '50%',
        size: 'medium'
      },
      textPositions: {
        storeName: { x: '50%', y: '22%' },
        wifiInfo: { x: '50%', y: '75%' },
        description: { x: '50%', y: '85%' }
      },
      colors: {
        primary: '#0369A1',
        secondary: '#0EA5E9',
        accent: '#38BDF8',
        text: '#0C4A6E',
        background: '#F0F9FF'
      }
    }
  },
  {
    id: 'restaurant-elegant',
    name: '레스토랑 엘레간트',
    description: '고급스럽고 우아한 레스토랑 스타일',
    backgroundColor: '#FDF2F8',
    accentColor: '#BE185D',
    textColor: '#831843',
    borderStyle: 'rounded',
    icon: 'utensils',
    layout: 'vertical_centered',
    qrSizeRatio: 'large',
    backgroundPattern: 'subtle-texture',
    decorativeElements: ['elegant-frame'],
    structure: {
      layout: 'vertical_centered',
      fontFamily: 'Playfair Display',
      fontSizes: { 
        storeName: 38, 
        wifiInfo: 24, 
        description: 20,
        qrLabel: 18
      },
      textAlign: 'center',
      spacing: {
        padding: 34,
        marginTop: 26,
        marginBottom: 26,
        elementGap: 22
      },
      decorativeElements: ['elegant-ornaments'],
      qrPosition: {
        x: '50%',
        y: '58%',
        size: 'large'
      },
      textPositions: {
        storeName: { x: '50%', y: '20%' },
        wifiInfo: { x: '50%', y: '82%' },
        description: { x: '50%', y: '92%' }
      },
      colors: {
        primary: '#BE185D',
        secondary: '#EC4899',
        accent: '#F472B6',
        text: '#831843',
        background: '#FDF2F8'
      }
    }
  },
  {
    id: 'modern-bold',
    name: '모던 볼드',
    description: '강렬하고 현대적인 볼드 디자인',
    backgroundColor: '#1F2937',
    accentColor: '#F59E0B',
    textColor: '#FFFFFF',
    borderStyle: 'none',
    icon: 'zap',
    layout: 'top_heavy',
    qrSizeRatio: 'large',
    backgroundPattern: 'gradient',
    decorativeElements: ['geometric-shapes'],
    structure: {
      layout: 'top_heavy',
      fontFamily: 'Poppins',
      fontSizes: { 
        storeName: 40, 
        wifiInfo: 26, 
        description: 22,
        qrLabel: 20
      },
      textAlign: 'center',
      spacing: {
        padding: 30,
        marginTop: 28,
        marginBottom: 28,
        elementGap: 24
      },
      decorativeElements: ['bold-shapes'],
      qrPosition: {
        x: '50%',
        y: '65%',
        size: 'large'
      },
      textPositions: {
        storeName: { x: '50%', y: '25%' },
        wifiInfo: { x: '50%', y: '45%' },
        description: { x: '50%', y: '90%' }
      },
      colors: {
        primary: '#F59E0B',
        secondary: '#FBBF24',
        accent: '#FCD34D',
        text: '#FFFFFF',
        background: '#1F2937'
      }
    }
  },
  {
    id: 'friendly-colorful',
    name: '프렌들리 컬러풀',
    description: '친근하고 활기찬 컬러풀 디자인',
    backgroundColor: '#FEFCE8',
    accentColor: '#16A34A',
    textColor: '#15803D',
    borderStyle: 'rounded',
    icon: 'heart',
    layout: 'center',
    qrSizeRatio: 'medium',
    backgroundPattern: 'dots',
    decorativeElements: ['colorful-shapes'],
    structure: {
      layout: 'center',
      fontFamily: 'Nunito',
      fontSizes: { 
        storeName: 35, 
        wifiInfo: 22, 
        description: 18,
        qrLabel: 16
      },
      textAlign: 'center',
      spacing: {
        padding: 35,
        marginTop: 22,
        marginBottom: 22,
        elementGap: 19
      },
      decorativeElements: ['friendly-shapes'],
      qrPosition: {
        x: '50%',
        y: '50%',
        size: 'medium'
      },
      textPositions: {
        storeName: { x: '50%', y: '23%' },
        wifiInfo: { x: '50%', y: '75%' },
        description: { x: '50%', y: '85%' }
      },
      colors: {
        primary: '#16A34A',
        secondary: '#22C55E',
        accent: '#4ADE80',
        text: '#15803D',
        background: '#FEFCE8'
      }
    }
  },
  {
    id: 'vintage-retro',
    name: '빈티지 레트로',
    description: '복고풍의 빈티지 레트로 디자인',
    backgroundColor: '#FEF7ED',
    accentColor: '#C2410C',
    textColor: '#9A3412',
    borderStyle: 'rounded',
    icon: 'camera',
    layout: 'vertical_centered',
    qrSizeRatio: 'large',
    backgroundPattern: 'subtle-texture',
    decorativeElements: ['vintage-frame', 'retro-icons'],
    structure: {
      layout: 'vertical_centered',
      fontFamily: 'Baskerville',
      fontSizes: { 
        storeName: 37, 
        wifiInfo: 23, 
        description: 19,
        qrLabel: 17
      },
      textAlign: 'center',
      spacing: {
        padding: 33,
        marginTop: 25,
        marginBottom: 25,
        elementGap: 21
      },
      decorativeElements: ['retro-pattern'],
      qrPosition: {
        x: '50%',
        y: '56%',
        size: 'large'
      },
      textPositions: {
        storeName: { x: '50%', y: '19%' },
        wifiInfo: { x: '50%', y: '81%' },
        description: { x: '50%', y: '91%' }
      },
      colors: {
        primary: '#C2410C',
        secondary: '#EA580C',
        accent: '#FB923C',
        text: '#9A3412',
        background: '#FEF7ED'
      }
    }
  },
  {
    id: 'minimal-dark',
    name: '미니멀 다크',
    description: '세련된 다크 미니멀 디자인',
    backgroundColor: '#111827',
    accentColor: '#3B82F6',
    textColor: '#F9FAFB',
    borderStyle: 'none',
    icon: 'moon',
    layout: 'center',
    qrSizeRatio: 'medium',
    backgroundPattern: 'none',
    decorativeElements: [],
    structure: {
      layout: 'center',
      fontFamily: 'Inter',
      fontSizes: { 
        storeName: 33, 
        wifiInfo: 21, 
        description: 17,
        qrLabel: 15
      },
      textAlign: 'center',
      spacing: {
        padding: 42,
        marginTop: 20,
        marginBottom: 20,
        elementGap: 17
      },
      decorativeElements: [],
      qrPosition: {
        x: '50%',
        y: '50%',
        size: 'medium'
      },
      textPositions: {
        storeName: { x: '50%', y: '24%' },
        wifiInfo: { x: '50%', y: '75%' },
        description: { x: '50%', y: '85%' }
      },
      colors: {
        primary: '#3B82F6',
        secondary: '#60A5FA',
        accent: '#93C5FD',
        text: '#F9FAFB',
        background: '#111827'
      }
    }
  },
  {
    id: 'elegant-gold',
    name: '엘레간트 골드',
    description: '고급스러운 골드 엘레간트 디자인',
    backgroundColor: '#FFFBEB',
    accentColor: '#D97706',
    textColor: '#92400E',
    borderStyle: 'rounded',
    icon: 'star',
    layout: 'vertical_centered',
    qrSizeRatio: 'large',
    backgroundPattern: 'subtle-texture',
    decorativeElements: ['elegant-frame', 'gold-accents'],
    structure: {
      layout: 'vertical_centered',
      fontFamily: 'Crimson Text',
      fontSizes: { 
        storeName: 39, 
        wifiInfo: 25, 
        description: 21,
        qrLabel: 19
      },
      textAlign: 'center',
      spacing: {
        padding: 36,
        marginTop: 28,
        marginBottom: 28,
        elementGap: 24
      },
      decorativeElements: ['gold-ornaments'],
      qrPosition: {
        x: '50%',
        y: '57%',
        size: 'large'
      },
      textPositions: {
        storeName: { x: '50%', y: '21%' },
        wifiInfo: { x: '50%', y: '83%' },
        description: { x: '50%', y: '93%' }
      },
      colors: {
        primary: '#D97706',
        secondary: '#F59E0B',
        accent: '#FCD34D',
        text: '#92400E',
        background: '#FFFBEB'
      }
    }
  },
  {
    id: 'tech-futuristic',
    name: '테크 퓨처리스틱',
    description: '미래지향적인 테크 디자인',
    backgroundColor: '#0F172A',
    accentColor: '#06B6D4',
    textColor: '#E0F2FE',
    borderStyle: 'none',
    icon: 'cpu',
    layout: 'top_heavy',
    qrSizeRatio: 'large',
    backgroundPattern: 'gradient',
    decorativeElements: ['tech-shapes', 'neon-accents'],
    structure: {
      layout: 'top_heavy',
      fontFamily: 'Orbitron',
      fontSizes: { 
        storeName: 41, 
        wifiInfo: 27, 
        description: 23,
        qrLabel: 21
      },
      textAlign: 'center',
      spacing: {
        padding: 28,
        marginTop: 30,
        marginBottom: 30,
        elementGap: 26
      },
      decorativeElements: ['futuristic-elements'],
      qrPosition: {
        x: '50%',
        y: '68%',
        size: 'large'
      },
      textPositions: {
        storeName: { x: '50%', y: '28%' },
        wifiInfo: { x: '50%', y: '48%' },
        description: { x: '50%', y: '92%' }
      },
      colors: {
        primary: '#06B6D4',
        secondary: '#22D3EE',
        accent: '#67E8F9',
        text: '#E0F2FE',
        background: '#0F172A'
      }
    }
  }
];

export const getTemplateById = (id: string): QRTemplate | undefined => {
  return qrTemplates.find(template => template.id === id);
};