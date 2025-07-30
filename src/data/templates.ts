import { QRTemplate } from '@/types/wifi';

export const qrTemplates: QRTemplate[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean and simple design perfect for any business',
    backgroundColor: '#FFFFFF',
    accentColor: '#6366F1',
    textColor: '#1F2937',
    borderStyle: 'rounded',
    icon: 'wifi'
  },
  {
    id: 'cafe-warm',
    name: 'Cafe Warm',
    description: 'Warm brown tones ideal for cafes and restaurants',
    backgroundColor: '#FEF7ED',
    accentColor: '#EA580C',
    textColor: '#9A3412',
    borderStyle: 'rounded',
    icon: 'coffee'
  },
  {
    id: 'business-professional',
    name: 'Business Professional',
    description: 'Professional blue theme for corporate environments',
    backgroundColor: '#F8FAFC',
    accentColor: '#0F172A',
    textColor: '#334155',
    borderStyle: 'solid',
    icon: 'building'
  },
  {
    id: 'vibrant-creative',
    name: 'Vibrant Creative',
    description: 'Bold gradient design for creative spaces',
    backgroundColor: '#F3E8FF',
    accentColor: '#A855F7',
    textColor: '#581C87',
    borderStyle: 'none',
    icon: 'palette'
  },
  {
    id: 'nature-green',
    name: 'Nature Green',
    description: 'Eco-friendly green theme for natural settings',
    backgroundColor: '#F0FDF4',
    accentColor: '#16A34A',
    textColor: '#14532D',
    borderStyle: 'rounded',
    icon: 'leaf'
  },
  {
    id: 'tech-dark',
    name: 'Tech Dark',
    description: 'Dark theme perfect for tech companies and modern spaces',
    backgroundColor: '#0F172A',
    accentColor: '#06B6D4',
    textColor: '#E2E8F0',
    borderStyle: 'solid',
    icon: 'monitor'
  },
  {
    id: 'elegant-gold',
    name: 'Elegant Gold',
    description: 'Luxurious gold accent for premium establishments',
    backgroundColor: '#FFFBEB',
    accentColor: '#D97706',
    textColor: '#92400E',
    borderStyle: 'rounded',
    icon: 'crown'
  },
  {
    id: 'retro-vintage',
    name: 'Retro Vintage',
    description: 'Vintage-inspired design with classic colors',
    backgroundColor: '#FEF2F2',
    accentColor: '#DC2626',
    textColor: '#7F1D1D',
    borderStyle: 'dashed',
    icon: 'radio'
  }
];

export const getTemplateById = (id: string): QRTemplate | undefined => {
  return qrTemplates.find(template => template.id === id);
};