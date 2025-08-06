import { TemplateStructure } from "@/types/wifi";

// 컨셉별 템플릿 구조 정의 - Figma 디자인을 기반으로 한 상세 레이아웃
export const templateStructures: Record<string, TemplateStructure> = {
  // 카페 빈티지 - 따뜻하고 아늑한 분위기
  cafe_vintage: {
    layout: 'vertical_centered',
    fontFamily: '"Cafe24Oneprettynight", "Dancing Script", cursive',
    fontSizes: {
      storeName: 28,
      wifiInfo: 16,
      description: 14,
      qrLabel: 18
    },
    textAlign: 'center',
    spacing: {
      padding: 24,
      marginTop: 20,
      marginBottom: 20,
      elementGap: 16
    },
    decorativeElements: ['coffee-cup', 'coffee-beans', 'vintage-border', 'steam'],
    qrPosition: {
      x: '50%',
      y: '45%',
      size: 'medium'
    },
    textPositions: {
      storeName: { x: '50%', y: '15%' },
      wifiInfo: { x: '50%', y: '70%' },
      description: { x: '50%', y: '85%' }
    },
    colors: {
      primary: '#8B4513',
      secondary: '#D2B48C',
      accent: '#F5DEB3',
      text: '#2D1810',
      background: '#FAF7F0'
    }
  },

  // 미니멀 비즈니스 - 깔끔하고 전문적인 느낌
  minimal_business: {
    layout: 'vertical_centered',
    fontFamily: '"Helvetica Neue", "Arial", sans-serif',
    fontSizes: {
      storeName: 24,
      wifiInfo: 14,
      description: 12,
      qrLabel: 16
    },
    textAlign: 'center',
    spacing: {
      padding: 32,
      marginTop: 24,
      marginBottom: 24,
      elementGap: 20
    },
    decorativeElements: ['clean-lines', 'geometric-frame'],
    qrPosition: {
      x: '50%',
      y: '50%',
      size: 'large'
    },
    textPositions: {
      storeName: { x: '50%', y: '20%' },
      wifiInfo: { x: '50%', y: '75%' },
      description: { x: '50%', y: '85%' }
    },
    colors: {
      primary: '#1E3A8A',
      secondary: '#3B82F6',
      accent: '#EBF8FF',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },

  // 모던 볼드 - 강렬하고 현대적인 디자인
  modern_bold: {
    layout: 'horizontal_split',
    fontFamily: '"Roboto", "Montserrat", sans-serif',
    fontSizes: {
      storeName: 26,
      wifiInfo: 16,
      description: 14,
      qrLabel: 18
    },
    textAlign: 'left',
    spacing: {
      padding: 20,
      marginTop: 16,
      marginBottom: 16,
      elementGap: 12
    },
    decorativeElements: ['angular-shapes', 'tech-pattern', 'gradient-accent'],
    qrPosition: {
      x: '75%',
      y: '50%',
      size: 'large'
    },
    textPositions: {
      storeName: { x: '25%', y: '25%' },
      wifiInfo: { x: '25%', y: '60%' },
      description: { x: '25%', y: '75%' }
    },
    colors: {
      primary: '#0066FF',
      secondary: '#1E40AF',
      accent: '#DBEAFE',
      text: '#111827',
      background: '#FFFFFF'
    }
  },

  // 친근한 컬러풀 - 밝고 즐거운 분위기
  friendly_colorful: {
    layout: 'top_heavy',
    fontFamily: '"Comic Sans MS", "Fredoka One", cursive',
    fontSizes: {
      storeName: 22,
      wifiInfo: 16,
      description: 14,
      qrLabel: 16
    },
    textAlign: 'center',
    spacing: {
      padding: 20,
      marginTop: 16,
      marginBottom: 16,
      elementGap: 14
    },
    decorativeElements: ['heart-icons', 'rainbow-elements', 'bubble-shapes', 'stars'],
    qrPosition: {
      x: '50%',
      y: '65%',
      size: 'medium'
    },
    textPositions: {
      storeName: { x: '50%', y: '25%' },
      wifiInfo: { x: '50%', y: '85%' },
      description: { x: '50%', y: '95%' }
    },
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#FFD93D',
      text: '#2D3748',
      background: '#FFFFFF'
    }
  },

  // 병원/의료 - 신뢰감 있고 깔끔한 디자인
  hospital_clean: {
    layout: 'vertical_centered',
    fontFamily: '"Roboto", "Open Sans", sans-serif',
    fontSizes: {
      storeName: 20,
      wifiInfo: 14,
      description: 12,
      qrLabel: 14
    },
    textAlign: 'center',
    spacing: {
      padding: 28,
      marginTop: 20,
      marginBottom: 20,
      elementGap: 18
    },
    decorativeElements: ['medical-cross', 'clean-borders', 'safety-icons'],
    qrPosition: {
      x: '50%',
      y: '55%',
      size: 'medium'
    },
    textPositions: {
      storeName: { x: '50%', y: '20%' },
      wifiInfo: { x: '50%', y: '75%' },
      description: { x: '50%', y: '88%' }
    },
    colors: {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#ECFDF5',
      text: '#1F2937',
      background: '#FFFFFF'
    }
  },

  // 레스토랑 - 고급스럽고 우아한 느낌
  restaurant_elegant: {
    layout: 'bottom_heavy',
    fontFamily: '"Playfair Display", "Noto Serif KR", serif',
    fontSizes: {
      storeName: 26,
      wifiInfo: 16,
      description: 14,
      qrLabel: 16
    },
    textAlign: 'center',
    spacing: {
      padding: 24,
      marginTop: 18,
      marginBottom: 18,
      elementGap: 16
    },
    decorativeElements: ['elegant-borders', 'utensils', 'wine-glass', 'ornamental'],
    qrPosition: {
      x: '50%',
      y: '35%',
      size: 'medium'
    },
    textPositions: {
      storeName: { x: '50%', y: '15%' },
      wifiInfo: { x: '50%', y: '65%' },
      description: { x: '50%', y: '80%' }
    },
    colors: {
      primary: '#7C2D12',
      secondary: '#DC2626',
      accent: '#FEF2F2',
      text: '#1F2937',
      background: '#FFFBEB'
    }
  },

  // 태그 스타일 - 행글릿 태그 형태
  tag_style: {
    layout: 'tag_style',
    fontFamily: '"Inter", "Helvetica", sans-serif',
    fontSizes: {
      storeName: 18,
      wifiInfo: 14,
      description: 12,
      qrLabel: 14
    },
    textAlign: 'center',
    spacing: {
      padding: 16,
      marginTop: 30, // 태그 구멍 공간
      marginBottom: 16,
      elementGap: 12
    },
    decorativeElements: ['tag-hole', 'string', 'rounded-corners'],
    qrPosition: {
      x: '50%',
      y: '50%',
      size: 'small'
    },
    textPositions: {
      storeName: { x: '50%', y: '25%' },
      wifiInfo: { x: '50%', y: '70%' },
      description: { x: '50%', y: '82%' }
    },
    colors: {
      primary: '#6B7280',
      secondary: '#9CA3AF',
      accent: '#F9FAFB',
      text: '#374151',
      background: '#FFFFFF'
    }
  }
};

// 컨셉별 상세 프롬프트 생성
export const generateConceptPrompt = (concept: string, structure: TemplateStructure): string => {
  const conceptPrompts = {
    cafe_vintage: `Vintage coffee shop WiFi poster design with warm cream/beige background, hand-lettered script calligraphy style, decorative coffee bean illustrations scattered around borders, antique coffee cup silhouette as watermark, rustic burlap texture overlay, sepia brown color palette with aged paper effect, artisanal cafe branding aesthetic`,
    
    minimal_business: `Professional minimalist WiFi access poster, clean white background with subtle geometric line accents, modern Helvetica typography hierarchy, navy blue color scheme, corporate office environment feel, subtle drop shadows, premium business card quality, clean architectural lines`,
    
    modern_bold: `Contemporary tech-forward WiFi poster with electric blue gradient accents, ultra-modern geometric typography, angular tech patterns, sleek Scandinavian minimalism, high-contrast color blocking, futuristic corporate aesthetic, laser-cut precision edges`,
    
    friendly_colorful: `Welcoming family-friendly WiFi poster with soft pastel gradient background, playful rounded typography, cute line-art icons (hearts, smiles, home symbols), warm community atmosphere, child-friendly design with rounded corners, hand-drawn illustration style`,
    
    hospital_clean: `Clean medical facility WiFi poster, pristine white background with subtle green medical cross accents, professional sans-serif typography, trustworthy healthcare branding, sterile hospital environment aesthetic, safety-focused design elements`,
    
    restaurant_elegant: `Elegant fine dining restaurant WiFi poster, sophisticated serif typography, ornamental decorative borders, wine and dining utensils illustrations, upscale restaurant ambiance, gold accent details, premium hospitality branding`,
    
    tag_style: `Hanging luggage tag style WiFi card, authentic cardstock tag material with reinforced hole at top, natural tag proportions with rounded corners, practical travel aesthetic with string attachment point`
  };

  const layoutDescriptions = {
    vertical_centered: "vertical centered layout with title at top, QR code in middle, details at bottom",
    horizontal_split: "horizontal split layout with text on left side, QR code on right side",
    top_heavy: "top-heavy layout with large header section and compact QR/info below",
    bottom_heavy: "bottom-heavy layout with QR code at top and expanded footer section",
    tag_style: "luggage tag format with hanging hole at top and vertical information flow"
  };

  return `${conceptPrompts[concept] || conceptPrompts.minimal_business} with ${layoutDescriptions[structure.layout]}. Ultra-high resolution 300 DPI print quality, professional business signage standards, NO QR code in design (added separately), focus on background design and decorative elements only.`;
};