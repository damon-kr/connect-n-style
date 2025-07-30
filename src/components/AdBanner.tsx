import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface AdBannerProps {
  position: 'top' | 'sidebar' | 'bottom';
  className?: string;
}

export const AdBanner = ({ position, className = '' }: AdBannerProps) => {
  // 개발 중에는 플레이스홀더 광고 표시
  const getAdContent = () => {
    switch (position) {
      case 'top':
        return {
          title: '광고 영역 (상단)',
          description: '728 x 90 배너 광고',
          size: 'h-24'
        };
      case 'sidebar':
        return {
          title: '광고 영역 (사이드바)',
          description: '300 x 250 사각형 광고',
          size: 'h-64'
        };
      case 'bottom':
        return {
          title: '광고 영역 (하단)',
          description: '728 x 90 배너 광고',
          size: 'h-24'
        };
      default:
        return {
          title: '광고 영역',
          description: '광고가 표시됩니다',
          size: 'h-32'
        };
    }
  };

  const adContent = getAdContent();

  return (
    <Card className={`${className} border-dashed border-muted-foreground/30`}>
      <CardContent className={`${adContent.size} flex items-center justify-center p-4`}>
        <div className="text-center text-muted-foreground">
          <ExternalLink size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">{adContent.title}</p>
          <p className="text-xs">{adContent.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};