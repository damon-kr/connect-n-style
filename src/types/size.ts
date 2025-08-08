export interface PrintSize {
  id: string;
  name: string;
  width: number;
  height: number;
  description: string;
}

export interface PrintOrientation {
  id: 'landscape' | 'portrait';
  name: string;
  icon: string;
}

export const printOrientations: PrintOrientation[] = [
  {
    id: 'landscape',
    name: '가로형',
    icon: 'monitor'
  },
  {
    id: 'portrait', 
    name: '세로형',
    icon: 'smartphone'
  }
];

export const printSizes: PrintSize[] = [
  {
    id: 'business-card',
    name: '명함 크기',
    width: 350,
    height: 200,
    description: '85mm × 55mm (명함, 작은 스탠드)'
  },
  {
    id: 'postcard',
    name: '엽서 크기',
    width: 600,
    height: 400,
    description: '148mm × 105mm (테이블 텐트)'
  },
  {
    id: 'a5',
    name: 'A5',
    width: 800,
    height: 600,
    description: '148mm × 210mm (소형 포스터)'
  },
  {
    id: 'a4',
    name: 'A4',
    width: 1200,
    height: 800,
    description: '210mm × 297mm (표준 포스터)'
  },
  {
    id: 'square-small',
    name: '정사각형 (소)',
    width: 400,
    height: 400,
    description: '100mm × 100mm (스티커, 작은 사인)'
  },
  {
    id: 'square-large',
    name: '정사각형 (대)',
    width: 600,
    height: 600,
    description: '150mm × 150mm (벽걸이용)'
  }
];

export const getOrientedSize = (size: PrintSize, orientation: PrintOrientation['id']): PrintSize => {
  // 정사각형은 방향 변경 없음
  if (size.id.includes('square')) {
    return size;
  }
  
  // 가로형인 경우 원본 크기 유지
  if (orientation === 'landscape') {
    return size;
  }
  
  // 세로형인 경우 가로/세로 치환
  return {
    ...size,
    width: size.height,
    height: size.width
  };
};