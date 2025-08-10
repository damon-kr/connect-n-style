import { QRTemplate } from '@/types/wifi';

// 한국 업종별 키워드 확장
export const businessKeywords = [
  // 식당/음식점
  { id: 'korean-bbq', label: '한식/고기집', color: '#B45309', emoji: '🍖' },
  { id: 'korean-restaurant', label: '한식당', color: '#DC2626', emoji: '🍚' },
  { id: 'japanese', label: '일식/초밥', color: '#EF4444', emoji: '🍣' },
  { id: 'chinese', label: '중식당', color: '#F97316', emoji: '🥢' },
  { id: 'western', label: '양식당', color: '#8B5CF6', emoji: '🍝' },
  { id: 'fastfood', label: '패스트푸드', color: '#F59E0B', emoji: '🍔' },
  
  // 카페/베이커리
  { id: 'cafe', label: '카페', color: '#8B4513', emoji: '☕' },
  { id: 'bakery', label: '베이커리', color: '#D97706', emoji: '🥐' },
  { id: 'dessert', label: '디저트', color: '#EC4899', emoji: '🍰' },
  { id: 'coffee', label: '커피전문', color: '#92400E', emoji: '☕' },
  
  // 의료/건강
  { id: 'hospital', label: '병원', color: '#2563EB', emoji: '🏥' },
  { id: 'clinic', label: '치과/의원', color: '#0EA5E9', emoji: '🦷' },
  { id: 'pharmacy', label: '약국', color: '#06B6D4', emoji: '💊' },
  { id: 'beauty', label: '미용실/뷰티', color: '#EC4899', emoji: '💇‍♀️' },
  
  // 엔터테인먼트
  { id: 'bar', label: '바/호프', color: '#F59E0B', emoji: '🍺' },
  { id: 'karaoke', label: '노래방', color: '#8B5CF6', emoji: '🎤' },
  { id: 'pcroom', label: 'PC방', color: '#06B6D4', emoji: '🖥️' },
  
  // 교육/키즈
  { id: 'kids', label: '키즈/교육', color: '#22C55E', emoji: '🧸' },
  { id: 'academy', label: '학원', color: '#10B981', emoji: '📚' },
  { id: 'kindergarten', label: '유치원', color: '#84CC16', emoji: '🎨' },
  
  // 서비스업
  { id: 'salon', label: '미용실', color: '#EC4899', emoji: '✂️' },
  { id: 'spa', label: '스파/마사지', color: '#F472B6', emoji: '💆‍♀️' },
  { id: 'gym', label: '헬스장', color: '#F97316', emoji: '💪' },
  
  // 컨셉별
  { id: 'modern', label: '모던', color: '#06B6D4', emoji: '💎' },
  { id: 'vintage', label: '빈티지', color: '#C2410C', emoji: '📻' },
  { id: 'natural', label: '내추럴', color: '#10B981', emoji: '🌿' },
  { id: 'luxury', label: '럭셔리', color: '#D4AF37', emoji: '💛' },
  { id: 'minimal', label: '미니멀', color: '#6B7280', emoji: '⚪' },
  { id: 'colorful', label: '컬러풀', color: '#8B5CF6', emoji: '🌈' },
] as const;

// 피그마 레이아웃 프리셋 확장 (가로 A/B, 세로 A/B 기반)
const layoutPresets = [
  // 가로 레이아웃 A (좌측 텍스트, 우측 QR)
  {
    id: 'landscape-a',
    structure: {
      layout: 'horizontal_split',
      fontFamily: '',
      fontSizes: { storeName: 24, wifiInfo: 16, description: 13, qrLabel: 12 },
      textAlign: 'left' as const,
      spacing: { padding: 28, marginTop: 16, marginBottom: 16, elementGap: 12 },
      decorativeElements: ['clean-border'],
      qrPosition: { x: '72%', y: '46%', size: 'large' as const },
      textPositions: {
        storeName: { x: '26%', y: '28%' },
        wifiInfo: { x: '72%', y: '78%' },
        description: { x: '26%', y: '58%' },
      },
      colors: { primary: '', secondary: '', accent: '', text: '', background: '' },
    },
  },
  // 가로 레이아웃 B (상단 텍스트, 하단 QR)
  {
    id: 'landscape-b',
    structure: {
      layout: 'top_heavy',
      fontFamily: '',
      fontSizes: { storeName: 26, wifiInfo: 16, description: 12, qrLabel: 11 },
      textAlign: 'center' as const,
      spacing: { padding: 24, marginTop: 18, marginBottom: 18, elementGap: 14 },
      decorativeElements: ['geometric-shapes', 'color-accents'],
      qrPosition: { x: '50%', y: '62%', size: 'large' as const },
      textPositions: {
        storeName: { x: '50%', y: '20%' },
        wifiInfo: { x: '50%', y: '82%' },
        description: { x: '50%', y: '34%' },
      },
      colors: { primary: '', secondary: '', accent: '', text: '', background: '' },
    },
  },
  // 세로 레이아웃 A (중앙 정렬)
  {
    id: 'portrait-a',
    structure: {
      layout: 'vertical_centered',
      fontFamily: '',
      fontSizes: { storeName: 28, wifiInfo: 16, description: 12, qrLabel: 11 },
      textAlign: 'center' as const,
      spacing: { padding: 24, marginTop: 16, marginBottom: 16, elementGap: 12 },
      decorativeElements: ['frame'],
      qrPosition: { x: '50%', y: '55%', size: 'large' as const },
      textPositions: {
        storeName: { x: '50%', y: '18%' },
        wifiInfo: { x: '50%', y: '82%' },
        description: { x: '50%', y: '32%' },
      },
      colors: { primary: '', secondary: '', accent: '', text: '', background: '' },
    },
  },
  // 세로 레이아웃 B (컴팩트)
  {
    id: 'portrait-b',
    structure: {
      layout: 'center',
      fontFamily: '',
      fontSizes: { storeName: 24, wifiInfo: 15, description: 12, qrLabel: 11 },
      textAlign: 'center' as const,
      spacing: { padding: 22, marginTop: 16, marginBottom: 16, elementGap: 12 },
      decorativeElements: ['corners'],
      qrPosition: { x: '50%', y: '50%', size: 'medium' as const },
      textPositions: {
        storeName: { x: '50%', y: '24%' },
        wifiInfo: { x: '50%', y: '74%' },
        description: { x: '50%', y: '36%' },
      },
      colors: { primary: '', secondary: '', accent: '', text: '', background: '' },
    },
  },
  // 새로운 레이아웃: 비대칭
  {
    id: 'asymmetric',
    structure: {
      layout: 'asymmetric',
      fontFamily: '',
      fontSizes: { storeName: 22, wifiInfo: 14, description: 11, qrLabel: 10 },
      textAlign: 'left' as const,
      spacing: { padding: 20, marginTop: 12, marginBottom: 12, elementGap: 10 },
      decorativeElements: ['color-accents'],
      qrPosition: { x: '80%', y: '30%', size: 'medium' as const },
      textPositions: {
        storeName: { x: '20%', y: '25%' },
        wifiInfo: { x: '20%', y: '75%' },
        description: { x: '20%', y: '50%' },
      },
      colors: { primary: '', secondary: '', accent: '', text: '', background: '' },
    },
  },
  // 새로운 레이아웃: 태그 스타일
  {
    id: 'tag-style',
    structure: {
      layout: 'tag_style',
      fontFamily: '',
      fontSizes: { storeName: 20, wifiInfo: 14, description: 11, qrLabel: 10 },
      textAlign: 'center' as const,
      spacing: { padding: 16, marginTop: 8, marginBottom: 8, elementGap: 8 },
      decorativeElements: ['clean-border'],
      qrPosition: { x: '50%', y: '60%', size: 'small' as const },
      textPositions: {
        storeName: { x: '50%', y: '20%' },
        wifiInfo: { x: '50%', y: '85%' },
        description: { x: '50%', y: '35%' },
      },
      colors: { primary: '', secondary: '', accent: '', text: '', background: '' },
    },
  },
] as const;

// 업종별 색상 팔레트 확장
const paletteByKeyword: Record<string, { bg: string; accent: string; text: string; pattern: QRTemplate['backgroundPattern']; decorative: string[] }[]> = {
  // 한식/고기집
  'korean-bbq': [
    { bg: '#FFFBEB', accent: '#B45309', text: '#7C2D12', pattern: 'subtle-texture', decorative: ['corners', 'color-accents'] },
    { bg: '#FEF3C7', accent: '#D97706', text: '#92400E', pattern: 'dots', decorative: ['frame'] },
    { bg: '#FDE68A', accent: '#F59E0B', text: '#78350F', pattern: 'subtle-lines', decorative: ['geometric-shapes'] },
  ],
  'korean-restaurant': [
    { bg: '#FEE2E2', accent: '#DC2626', text: '#991B1B', pattern: 'subtle-texture', decorative: ['clean-border'] },
    { bg: '#FECACA', accent: '#EF4444', text: '#B91C1C', pattern: 'dots', decorative: ['corners'] },
  ],
  'japanese': [
    { bg: '#FEF2F2', accent: '#EF4444', text: '#B91C1C', pattern: 'subtle-lines', decorative: ['clean-border'] },
    { bg: '#FEE2E2', accent: '#F87171', text: '#DC2626', pattern: 'none', decorative: ['frame'] },
  ],
  'chinese': [
    { bg: '#FEF3C7', accent: '#F97316', text: '#C2410C', pattern: 'subtle-texture', decorative: ['color-accents'] },
    { bg: '#FDE68A', accent: '#FB923C', text: '#EA580C', pattern: 'dots', decorative: ['geometric-shapes'] },
  ],
  'western': [
    { bg: '#F3E8FF', accent: '#8B5CF6', text: '#6D28D9', pattern: 'subtle-lines', decorative: ['elegant-frame'] },
    { bg: '#EDE9FE', accent: '#A78BFA', text: '#7C3AED', pattern: 'none', decorative: ['clean-border'] },
  ],
  'fastfood': [
    { bg: '#FEF3C7', accent: '#F59E0B', text: '#D97706', pattern: 'dots', decorative: ['colorful-shapes'] },
    { bg: '#FDE68A', accent: '#FBBF24', text: '#F59E0B', pattern: 'subtle-texture', decorative: ['retro-icons'] },
  ],
  
  // 카페/베이커리
  'cafe': [
    { bg: '#FEF7ED', accent: '#C2410C', text: '#8B4513', pattern: 'subtle-texture', decorative: ['vintage-frame'] },
    { bg: '#FFF7ED', accent: '#A16207', text: '#7C3F13', pattern: 'none', decorative: ['clean-border'] },
    { bg: '#FDF2E9', accent: '#B45309', text: '#7C2D12', pattern: 'subtle-lines', decorative: ['coffee-icons'] },
  ],
  'bakery': [
    { bg: '#FFF7ED', accent: '#D97706', text: '#7C2D12', pattern: 'dots', decorative: ['color-accents'] },
    { bg: '#FEF3C7', accent: '#F59E0B', text: '#92400E', pattern: 'subtle-texture', decorative: ['geometric-shapes'] },
  ],
  'dessert': [
    { bg: '#FDF2F8', accent: '#EC4899', text: '#BE185D', pattern: 'dots', decorative: ['colorful-shapes'] },
    { bg: '#FCE7F3', accent: '#F472B6', text: '#DB2777', pattern: 'subtle-texture', decorative: ['color-accents'] },
  ],
  'coffee': [
    { bg: '#FEF7ED', accent: '#92400E', text: '#78350F', pattern: 'subtle-lines', decorative: ['coffee-icons'] },
    { bg: '#FDF2E9', accent: '#A16207', text: '#7C3F13', pattern: 'none', decorative: ['clean-border'] },
  ],
  
  // 의료/건강
  'hospital': [
    { bg: '#ECFEFF', accent: '#06B6D4', text: '#0E7490', pattern: 'none', decorative: ['professional-frame'] },
    { bg: '#F0FDFA', accent: '#10B981', text: '#065F46', pattern: 'none', decorative: ['clean-border'] },
    { bg: '#DBEAFE', accent: '#2563EB', text: '#1E40AF', pattern: 'subtle-lines', decorative: ['tech-shapes'] },
  ],
  'clinic': [
    { bg: '#F0F9FF', accent: '#0EA5E9', text: '#075985', pattern: 'subtle-lines', decorative: ['professional-frame'] },
    { bg: '#DBEAFE', accent: '#2563EB', text: '#1E40AF', pattern: 'none', decorative: ['clean-border'] },
  ],
  'pharmacy': [
    { bg: '#F0FDFA', accent: '#10B981', text: '#065F46', pattern: 'none', decorative: ['clean-border'] },
    { bg: '#ECFDF5', accent: '#22C55E', text: '#15803D', pattern: 'subtle-lines', decorative: ['professional-frame'] },
  ],
  'beauty': [
    { bg: '#FDF2F8', accent: '#EC4899', text: '#BE185D', pattern: 'subtle-texture', decorative: ['elegant-frame'] },
    { bg: '#FCE7F3', accent: '#F472B6', text: '#DB2777', pattern: 'dots', decorative: ['color-accents'] },
  ],
  
  // 엔터테인먼트
  'bar': [
    { bg: '#111827', accent: '#F59E0B', text: '#F9FAFB', pattern: 'gradient', decorative: ['neon-accents'] },
    { bg: '#0F172A', accent: '#06B6D4', text: '#E0F2FE', pattern: 'gradient', decorative: ['color-accents'] },
  ],
  'karaoke': [
    { bg: '#FDF2F8', accent: '#EC4899', text: '#BE185D', pattern: 'dots', decorative: ['colorful-shapes'] },
    { bg: '#FCE7F3', accent: '#F472B6', text: '#DB2777', pattern: 'gradient', decorative: ['retro-icons'] },
  ],
  'pcroom': [
    { bg: '#111827', accent: '#06B6D4', text: '#E0F2FE', pattern: 'gradient', decorative: ['tech-shapes'] },
    { bg: '#0F172A', accent: '#10B981', text: '#D1FAE5', pattern: 'subtle-lines', decorative: ['neon-accents'] },
  ],
  
  // 교육/키즈
  'kids': [
    { bg: '#FEFCE8', accent: '#22C55E', text: '#166534', pattern: 'dots', decorative: ['colorful-shapes'] },
    { bg: '#F0FDF4', accent: '#10B981', text: '#065F46', pattern: 'subtle-texture', decorative: ['retro-icons'] },
    { bg: '#FEF3C7', accent: '#F59E0B', text: '#D97706', pattern: 'dots', decorative: ['colorful-shapes'] },
  ],
  'academy': [
    { bg: '#F0FDF4', accent: '#10B981', text: '#065F46', pattern: 'subtle-lines', decorative: ['clean-border'] },
    { bg: '#ECFDF5', accent: '#22C55E', text: '#15803D', pattern: 'none', decorative: ['professional-frame'] },
  ],
  'kindergarten': [
    { bg: '#FEFCE8', accent: '#F59E0B', text: '#D97706', pattern: 'dots', decorative: ['colorful-shapes'] },
    { bg: '#FEF3C7', accent: '#FBBF24', text: '#F59E0B', pattern: 'subtle-texture', decorative: ['retro-icons'] },
  ],
  
  // 서비스업
  'salon': [
    { bg: '#FDF2F8', accent: '#EC4899', text: '#BE185D', pattern: 'subtle-texture', decorative: ['elegant-frame'] },
    { bg: '#FCE7F3', accent: '#F472B6', text: '#DB2777', pattern: 'dots', decorative: ['color-accents'] },
  ],
  'spa': [
    { bg: '#F0FDFA', accent: '#10B981', text: '#065F46', pattern: 'subtle-texture', decorative: ['elegant-frame'] },
    { bg: '#ECFDF5', accent: '#22C55E', text: '#15803D', pattern: 'none', decorative: ['clean-border'] },
  ],
  'gym': [
    { bg: '#FEF3C7', accent: '#F97316', text: '#C2410C', pattern: 'subtle-lines', decorative: ['geometric-shapes'] },
    { bg: '#FDE68A', accent: '#FB923C', text: '#EA580C', pattern: 'dots', decorative: ['color-accents'] },
  ],
  
  // 컨셉별
  'modern': [
    { bg: '#FAFAFA', accent: '#0EA5E9', text: '#0F172A', pattern: 'subtle-lines', decorative: ['clean-border'] },
    { bg: '#111827', accent: '#06B6D4', text: '#E0F2FE', pattern: 'gradient', decorative: ['tech-shapes'] },
  ],
  'vintage': [
    { bg: '#FEF7ED', accent: '#C2410C', text: '#7C2D12', pattern: 'subtle-texture', decorative: ['vintage-frame'] },
    { bg: '#FDF2E9', accent: '#B45309', text: '#7C2D12', pattern: 'dots', decorative: ['retro-icons'] },
  ],
  'natural': [
    { bg: '#ECFDF5', accent: '#10B981', text: '#064E3B', pattern: 'none', decorative: ['clean-border'] },
    { bg: '#F0FDF4', accent: '#22C55E', text: '#065F46', pattern: 'subtle-texture', decorative: ['color-accents'] },
  ],
  'luxury': [
    { bg: '#1F2937', accent: '#F59E0B', text: '#FDE68A', pattern: 'gradient', decorative: ['gold-accents'] },
    { bg: '#111827', accent: '#FBBF24', text: '#FEF3C7', pattern: 'gradient', decorative: ['elegant-frame'] },
  ],
  'minimal': [
    { bg: '#FFFFFF', accent: '#6B7280', text: '#374151', pattern: 'none', decorative: ['clean-border'] },
    { bg: '#F9FAFB', accent: '#9CA3AF', text: '#6B7280', pattern: 'subtle-lines', decorative: [] },
  ],
  'colorful': [
    { bg: '#FEF3C7', accent: '#8B5CF6', text: '#6D28D9', pattern: 'dots', decorative: ['colorful-shapes'] },
    { bg: '#FCE7F3', accent: '#EC4899', text: '#BE185D', pattern: 'gradient', decorative: ['color-accents'] },
  ],
};

// 한글 폰트 다양화
const fontByKeyword: Record<string, string[]> = {
  'korean-bbq': ['Black Han Sans', 'Do Hyeon', 'Jua'],
  'korean-restaurant': ['Black Han Sans', 'Do Hyeon', 'Noto Sans KR'],
  'japanese': ['Noto Sans JP', 'Noto Serif JP', 'Noto Sans KR'],
  'chinese': ['Noto Sans SC', 'Noto Serif SC', 'Noto Sans KR'],
  'western': ['Playfair Display', 'Noto Serif KR', 'Noto Sans KR'],
  'fastfood': ['Black Han Sans', 'Jua', 'Do Hyeon'],
  'cafe': ['Noto Serif KR', 'Nanum Myeongjo', 'Noto Sans KR'],
  'bakery': ['Do Hyeon', 'Jua', 'Black Han Sans'],
  'dessert': ['Jua', 'Do Hyeon', 'Noto Sans KR'],
  'coffee': ['Noto Serif KR', 'Nanum Myeongjo', 'Noto Sans KR'],
  'hospital': ['Noto Sans KR', 'Noto Sans JP', 'Inter'],
  'clinic': ['Noto Sans KR', 'Noto Sans JP', 'Inter'],
  'pharmacy': ['Noto Sans KR', 'Noto Sans JP', 'Inter'],
  'beauty': ['Noto Serif KR', 'Nanum Myeongjo', 'Noto Sans KR'],
  'bar': ['Black Han Sans', 'Do Hyeon', 'Noto Sans KR'],
  'karaoke': ['Black Han Sans', 'Jua', 'Do Hyeon'],
  'pcroom': ['Black Han Sans', 'Do Hyeon', 'Noto Sans KR'],
  'kids': ['Jua', 'Do Hyeon', 'Black Han Sans'],
  'academy': ['Noto Sans KR', 'Noto Serif KR', 'Inter'],
  'kindergarten': ['Jua', 'Do Hyeon', 'Black Han Sans'],
  'salon': ['Noto Serif KR', 'Nanum Myeongjo', 'Noto Sans KR'],
  'spa': ['Noto Serif KR', 'Nanum Myeongjo', 'Noto Sans KR'],
  'gym': ['Black Han Sans', 'Do Hyeon', 'Noto Sans KR'],
  'modern': ['Poppins', 'Inter', 'Noto Sans KR'],
  'vintage': ['Nanum Myeongjo', 'Noto Serif KR', 'Noto Sans KR'],
  'natural': ['Gowun Dodum', 'Noto Sans KR', 'Inter'],
  'luxury': ['Playfair Display', 'Noto Serif KR', 'Noto Sans KR'],
  'minimal': ['Inter', 'Noto Sans KR', 'Poppins'],
  'colorful': ['Jua', 'Do Hyeon', 'Black Han Sans'],
};

const categoryByKeyword: Record<string, QRTemplate['category']> = {
  'korean-bbq': 'minimal_business',
  'korean-restaurant': 'minimal_business',
  'japanese': 'restaurant_elegant',
  'chinese': 'restaurant_elegant',
  'western': 'restaurant_elegant',
  'fastfood': 'friendly_colorful',
  'cafe': 'cafe_vintage',
  'bakery': 'friendly_colorful',
  'dessert': 'friendly_colorful',
  'coffee': 'cafe_vintage',
  'hospital': 'hospital_clean',
  'clinic': 'hospital_clean',
  'pharmacy': 'hospital_clean',
  'beauty': 'modern_bold',
  'bar': 'modern_bold',
  'karaoke': 'friendly_colorful',
  'pcroom': 'modern_bold',
  'kids': 'friendly_colorful',
  'academy': 'minimal_business',
  'kindergarten': 'friendly_colorful',
  'salon': 'modern_bold',
  'spa': 'modern_bold',
  'gym': 'modern_bold',
  'modern': 'modern_bold',
  'vintage': 'cafe_vintage',
  'natural': 'minimal_business',
  'luxury': 'restaurant_elegant',
  'minimal': 'minimal_business',
  'colorful': 'friendly_colorful',
};

// 업종별 디폴트 문구 확장
const defaultsByKeyword: Record<string, { name: string; desc: string }[]> = {
  'korean-bbq': [
    { name: '고기굽는날', desc: '스캔하면 연결됩니다' },
    { name: '삼겹살천국', desc: 'QR 스캔으로 WiFi 연결' },
    { name: '돼지고기집', desc: '여기서 스캔하고 바로 연결' },
  ],
  'korean-restaurant': [
    { name: '한우정', desc: 'QR 스캔으로 WiFi 연결' },
    { name: '맛있는집', desc: '스캔 후 즉시 연결' },
    { name: '한식당', desc: '손님 전용 WiFi' },
  ],
  'japanese': [
    { name: '스시로', desc: 'SCAN & CONNECT' },
    { name: '초밥천국', desc: 'QR 스캔으로 WiFi 연결' },
    { name: '일식당', desc: '스캔 후 즉시 연결' },
  ],
  'chinese': [
    { name: '중화요리', desc: 'QR 스캔으로 WiFi 연결' },
    { name: '차이나', desc: '스캔 후 즉시 연결' },
    { name: '중식당', desc: '손님 전용 WiFi' },
  ],
  'western': [
    { name: '스테이크하우스', desc: 'Guest WiFi' },
    { name: '파스타바', desc: 'Scan to join WiFi' },
    { name: '양식당', desc: 'QR 스캔으로 WiFi 연결' },
  ],
  'fastfood': [
    { name: '버거킹', desc: 'FAST WiFi' },
    { name: '맥도날드', desc: 'Quick Connect' },
    { name: '롯데리아', desc: '스캔 후 즉시 연결' },
  ],
  'cafe': [
    { name: '브라운카페', desc: '스캔 후 즉시 연결' },
    { name: '스타벅스', desc: 'Scan & Connect' },
    { name: '투썸플레이스', desc: 'QR 스캔으로 WiFi 연결' },
  ],
  'bakery': [
    { name: '파리바게뜨', desc: '스캔 후 즉시 연결' },
    { name: '뚜레쥬르', desc: 'QR 스캔으로 WiFi 연결' },
    { name: '베이커리', desc: '손님 전용 WiFi' },
  ],
  'dessert': [
    { name: '디저트카페', desc: '스캔 후 즉시 연결' },
    { name: '아이스크림', desc: 'QR 스캔으로 WiFi 연결' },
    { name: '케이크샵', desc: '손님 전용 WiFi' },
  ],
  'coffee': [
    { name: '커피전문점', desc: '스캔 후 즉시 연결' },
    { name: '로스터리', desc: 'QR 스캔으로 WiFi 연결' },
    { name: '카페', desc: '손님 전용 WiFi' },
  ],
  'hospital': [
    { name: '스마일병원', desc: '대기 중 무료 WiFi' },
    { name: '종합병원', desc: '환자/보호자 WiFi' },
    { name: '의료원', desc: '무료 인터넷' },
  ],
  'clinic': [
    { name: '스마일치과', desc: '대기 중 무료 WiFi' },
    { name: '치과의원', desc: '환자 WiFi' },
    { name: '의원', desc: '무료 인터넷' },
  ],
  'pharmacy': [
    { name: '약국', desc: '대기 중 무료 WiFi' },
    { name: '드럭스토어', desc: '고객 WiFi' },
    { name: '약방', desc: '무료 인터넷' },
  ],
  'beauty': [
    { name: '미용실', desc: '고객 전용 WiFi' },
    { name: '헤어샵', desc: '스캔 후 즉시 연결' },
    { name: '뷰티샵', desc: 'QR 스캔으로 WiFi 연결' },
  ],
  'bar': [
    { name: 'BAR 1984', desc: 'SCAN & CONNECT' },
    { name: '호프', desc: '스캔 후 즉시 연결' },
    { name: '술집', desc: 'QR 스캔으로 WiFi 연결' },
  ],
  'karaoke': [
    { name: '노래방', desc: '스캔 후 즉시 연결' },
    { name: '코인노래방', desc: 'QR 스캔으로 WiFi 연결' },
    { name: 'KTV', desc: '손님 전용 WiFi' },
  ],
  'pcroom': [
    { name: 'PC방', desc: '고객 전용 WiFi' },
    { name: '인터넷카페', desc: '스캔 후 즉시 연결' },
    { name: '게임방', desc: 'QR 스캔으로 WiFi 연결' },
  ],
  'kids': [
    { name: '키즈랜드', desc: '보호자용 무료 WiFi' },
    { name: '놀이터', desc: '스캔 후 즉시 연결' },
    { name: '어린이집', desc: 'QR 스캔으로 WiFi 연결' },
  ],
  'academy': [
    { name: '학원', desc: '학생 전용 WiFi' },
    { name: '교육원', desc: '스캔 후 즉시 연결' },
    { name: '과외', desc: 'QR 스캔으로 WiFi 연결' },
  ],
  'kindergarten': [
    { name: '유치원', desc: '보호자용 무료 WiFi' },
    { name: '어린이집', desc: '스캔 후 즉시 연결' },
    { name: '키즈센터', desc: 'QR 스캔으로 WiFi 연결' },
  ],
  'salon': [
    { name: '미용실', desc: '고객 전용 WiFi' },
    { name: '헤어샵', desc: '스캔 후 즉시 연결' },
    { name: '뷰티샵', desc: 'QR 스캔으로 WiFi 연결' },
  ],
  'spa': [
    { name: '스파', desc: '고객 전용 WiFi' },
    { name: '마사지', desc: '스캔 후 즉시 연결' },
    { name: '웰빙센터', desc: 'QR 스캔으로 WiFi 연결' },
  ],
  'gym': [
    { name: '헬스장', desc: '회원 전용 WiFi' },
    { name: '피트니스', desc: '스캔 후 즉시 연결' },
    { name: '운동센터', desc: 'QR 스캔으로 WiFi 연결' },
  ],
  'modern': [
    { name: 'STUDIO S', desc: 'Scan to join WiFi' },
    { name: '모던스페이스', desc: 'QR 스캔으로 WiFi 연결' },
    { name: '현대적공간', desc: '스캔 후 즉시 연결' },
  ],
  'vintage': [
    { name: '빈티지 카페', desc: '스캔 후 연결' },
    { name: '레트로샵', desc: 'QR 스캔으로 WiFi 연결' },
    { name: '옛날스타일', desc: '손님 전용 WiFi' },
  ],
  'natural': [
    { name: '그린라운지', desc: '손님 전용 WiFi' },
    { name: '내추럴스페이스', desc: '스캔 후 즉시 연결' },
    { name: '자연친화적', desc: 'QR 스캔으로 WiFi 연결' },
  ],
  'luxury': [
    { name: 'The Palace', desc: 'Guest WiFi' },
    { name: '럭셔리스페이스', desc: 'Premium WiFi' },
    { name: '고급장소', desc: 'VIP WiFi' },
  ],
  'minimal': [
    { name: '미니멀', desc: 'Clean WiFi' },
    { name: '심플스페이스', desc: 'Simple Connect' },
    { name: '간결한공간', desc: 'QR 스캔으로 WiFi 연결' },
  ],
  'colorful': [
    { name: '컬러풀', desc: 'Fun WiFi' },
    { name: '즐거운공간', desc: '스캔 후 즉시 연결' },
    { name: '활기찬장소', desc: 'QR 스캔으로 WiFi 연결' },
  ],
};

export const generateTemplatesFromKeywords = async (keywords: string[]): Promise<QRTemplate[]> => {
  const templates: QRTemplate[] = [];

  const total = Math.max(8, Math.min(16, keywords.length * 4));
  for (let i = 0; i < total; i++) {
    const kw = keywords[i % keywords.length];
    const palettes = paletteByKeyword[kw] || paletteByKeyword['modern'];
    const palette = palettes[i % palettes.length];
    const preset = layoutPresets[i % layoutPresets.length];
    
    const fonts = fontByKeyword[kw] || ['Noto Sans KR'];
    const font = fonts[i % fonts.length];
    const category = categoryByKeyword[kw] || 'minimal_business';
    const id = `ai-${kw}-${Date.now()}-${i}`;
    
    const defaults = defaultsByKeyword[kw] || [{ name: '브랜드', desc: '여기서 스캔하고 바로 연결' }];
    const defaultText = defaults[i % defaults.length];

    const structure = {
      ...preset.structure,
      decorativeElements: [...palette.decorative],
      fontFamily: font,
      colors: {
        primary: palette.accent,
        secondary: palette.text,
        accent: palette.accent,
        text: palette.text,
        background: palette.bg,
      },
    } as unknown as QRTemplate['structure'];

    templates.push({
      id,
      name: `${defaultText.name} · ${businessKeywords.find((b) => b.id === kw)?.label || 'AI'} ${i + 1}`,
      description: defaultText.desc,
      backgroundColor: palette.bg,
      accentColor: palette.accent,
      textColor: palette.text,
      borderStyle: 'rounded',
      icon: 'sparkles',
      layout: structure.layout as QRTemplate['layout'],
      qrSizeRatio: (preset.structure.qrPosition.size as QRTemplate['qrSizeRatio']),
      backgroundPattern: palette.pattern,
      decorativeElements: [...palette.decorative],
      category,
      structure,
    });
  }

  return templates;
};
