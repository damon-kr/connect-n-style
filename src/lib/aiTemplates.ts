import { QRTemplate } from '@/types/wifi';

export const businessKeywords = [
  { id: 'korean-bbq', label: '한식/고기집', color: '#B45309', emoji: '🍖' },
  { id: 'cafe', label: '카페', color: '#8B4513', emoji: '☕' },
  { id: 'bakery', label: '베이커리', color: '#D97706', emoji: '🥐' },
  { id: 'restaurant', label: '레스토랑', color: '#DC2626', emoji: '🍽️' },
  { id: 'hospital', label: '병원', color: '#2563EB', emoji: '🏥' },
  { id: 'clinic', label: '치과/의원', color: '#0EA5E9', emoji: '🦷' },
  { id: 'bar', label: '바/호프', color: '#F59E0B', emoji: '🍺' },
  { id: 'kids', label: '키즈/교육', color: '#22C55E', emoji: '🧸' },
  { id: 'modern', label: '모던', color: '#06B6D4', emoji: '💎' },
  { id: 'vintage', label: '빈티지', color: '#C2410C', emoji: '📻' },
  { id: 'natural', label: '내추럴', color: '#10B981', emoji: '🌿' },
  { id: 'luxury', label: '럭셔리', color: '#D4AF37', emoji: '💛' },
] as const;

// Figma 레이아웃 프리셋: layout) 가로 A/B, 세로 A/B
const layoutPresets = [
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
] as const;

const paletteByKeyword: Record<string, { bg: string; accent: string; text: string; pattern: QRTemplate['backgroundPattern'] }[]> = {
  'korean-bbq': [
    { bg: '#FFFBEB', accent: '#B45309', text: '#7C2D12', pattern: 'subtle-texture' },
    { bg: '#FEF3C7', accent: '#D97706', text: '#92400E', pattern: 'dots' },
  ],
  cafe: [
    { bg: '#FEF7ED', accent: '#C2410C', text: '#8B4513', pattern: 'subtle-texture' },
    { bg: '#FFF7ED', accent: '#A16207', text: '#7C3F13', pattern: 'none' },
  ],
  bakery: [
    { bg: '#FFF7ED', accent: '#D97706', text: '#7C2D12', pattern: 'dots' },
    { bg: '#FEF3C7', accent: '#F59E0B', text: '#92400E', pattern: 'subtle-texture' },
  ],
  restaurant: [
    { bg: '#FCE7F3', accent: '#BE185D', text: '#831843', pattern: 'subtle-texture' },
    { bg: '#FEE2E2', accent: '#DC2626', text: '#991B1B', pattern: 'subtle-lines' },
  ],
  hospital: [
    { bg: '#ECFEFF', accent: '#06B6D4', text: '#0E7490', pattern: 'none' },
    { bg: '#F0FDFA', accent: '#10B981', text: '#065F46', pattern: 'none' },
  ],
  clinic: [
    { bg: '#F0F9FF', accent: '#0EA5E9', text: '#075985', pattern: 'subtle-lines' },
    { bg: '#DBEAFE', accent: '#2563EB', text: '#1E40AF', pattern: 'none' },
  ],
  bar: [
    { bg: '#111827', accent: '#F59E0B', text: '#F9FAFB', pattern: 'gradient' },
    { bg: '#0F172A', accent: '#06B6D4', text: '#E0F2FE', pattern: 'gradient' },
  ],
  kids: [
    { bg: '#FEFCE8', accent: '#22C55E', text: '#166534', pattern: 'dots' },
    { bg: '#F0FDF4', accent: '#10B981', text: '#065F46', pattern: 'subtle-texture' },
  ],
  modern: [
    { bg: '#FAFAFA', accent: '#0EA5E9', text: '#0F172A', pattern: 'subtle-lines' },
    { bg: '#111827', accent: '#06B6D4', text: '#E0F2FE', pattern: 'gradient' },
  ],
  vintage: [
    { bg: '#FEF7ED', accent: '#C2410C', text: '#7C2D12', pattern: 'subtle-texture' },
    { bg: '#FDF2E9', accent: '#B45309', text: '#7C2D12', pattern: 'dots' },
  ],
  natural: [
    { bg: '#ECFDF5', accent: '#10B981', text: '#064E3B', pattern: 'none' },
    { bg: '#F0FDF4', accent: '#22C55E', text: '#065F46', pattern: 'subtle-texture' },
  ],
  luxury: [
    { bg: '#1F2937', accent: '#F59E0B', text: '#FDE68A', pattern: 'gradient' },
    { bg: '#111827', accent: '#FBBF24', text: '#FEF3C7', pattern: 'gradient' },
  ],
};

const fontByKeyword: Record<string, string> = {
  'korean-bbq': 'Black Han Sans',
  cafe: 'Noto Serif KR',
  bakery: 'Do Hyeon',
  restaurant: 'Playfair Display',
  hospital: 'Noto Sans KR',
  clinic: 'Noto Sans KR',
  bar: 'Black Han Sans',
  kids: 'Jua',
  modern: 'Poppins',
  vintage: 'Nanum Myeongjo',
  natural: 'Gowun Dodum',
  luxury: 'Playfair Display',
};

const categoryByKeyword: Record<string, QRTemplate['category']> = {
  'korean-bbq': 'minimal_business',
  cafe: 'cafe_vintage',
  bakery: 'friendly_colorful',
  restaurant: 'restaurant_elegant',
  hospital: 'hospital_clean',
  clinic: 'hospital_clean',
  bar: 'modern_bold',
  kids: 'friendly_colorful',
  modern: 'modern_bold',
  vintage: 'cafe_vintage',
  natural: 'minimal_business',
  luxury: 'restaurant_elegant',
};

export const generateTemplatesFromKeywords = async (keywords: string[]): Promise<QRTemplate[]> => {
  const templates: QRTemplate[] = [];

  const total = Math.max(6, Math.min(12, keywords.length * 3));
  for (let i = 0; i < total; i++) {
    const kw = keywords[i % keywords.length];
    const palettes = paletteByKeyword[kw] || paletteByKeyword['modern'];
    const palette = palettes[i % palettes.length];
    const preset = layoutPresets[i % layoutPresets.length];

    const font = fontByKeyword[kw] || 'Noto Sans KR';
    const category = categoryByKeyword[kw] || 'minimal_business';
    const id = `ai-${kw}-${Date.now()}-${i}`;

    const structure = {
      ...preset.structure,
      decorativeElements: [...preset.structure.decorativeElements],
      fontFamily: font,
      colors: {
        primary: palette.accent,
        secondary: palette.text,
        accent: palette.accent,
        text: palette.text,
        background: palette.bg,
      },
    } as unknown as QRTemplate['structure'];

    // 업종별 디폴트 문구
    const defaults: Record<string, { name: string; desc: string }> = {
      cafe: { name: '브라운카페', desc: '스캔 후 즉시 연결' },
      restaurant: { name: '한우정', desc: 'QR 스캔으로 WiFi 연결' },
      hospital: { name: '스마일치과', desc: '대기 중 무료 WiFi' },
      clinic: { name: '스마일치과', desc: '대기 중 무료 WiFi' },
      bar: { name: 'BAR 1984', desc: 'SCAN & CONNECT' },
      kids: { name: '키즈랜드', desc: '보호자용 무료 WiFi' },
      modern: { name: 'STUDIO S', desc: 'Scan to join WiFi' },
      vintage: { name: '빈티지 카페', desc: '스캔 후 연결' },
      natural: { name: '그린라운지', desc: '손님 전용 WiFi' },
      luxury: { name: 'The Palace', desc: 'Guest WiFi' },
      'korean-bbq': { name: '고기굽는날', desc: '스캔하면 연결됩니다' },
    };

    templates.push({
      id,
      name: `${defaults[kw]?.name || '브랜드'} · ${businessKeywords.find((b) => b.id === kw)?.label || 'AI'} ${i + 1}`,
      description: defaults[kw]?.desc || '여기서 스캔하고 바로 연결',
      backgroundColor: palette.bg,
      accentColor: palette.accent,
      textColor: palette.text,
      borderStyle: 'rounded',
      icon: 'sparkles',
      layout: structure.layout as QRTemplate['layout'],
      qrSizeRatio: (preset.structure.qrPosition.size as QRTemplate['qrSizeRatio']),
      backgroundPattern: palette.pattern,
      decorativeElements: [...preset.structure.decorativeElements],
      category,
      structure,
    });
  }

  return templates;
};
