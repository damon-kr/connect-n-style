import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, X } from 'lucide-react';

interface AdInterstitialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  title: string;
}

export const AdInterstitial = ({ isOpen, onClose, onComplete, title }: AdInterstitialProps) => {
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCanSkip(false);
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          setCanSkip(true);
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    if (canSkip) {
      handleComplete();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-6 p-2">
          {/* 광고 영역 */}
          <div className="bg-muted/30 border-2 border-dashed border-muted-foreground/30 rounded-lg p-8">
            <div className="text-center text-muted-foreground">
              <ExternalLink size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">스폰서 광고</p>
              <p className="text-sm">여기에 CPV 광고가 표시됩니다</p>
              <p className="text-xs mt-2 opacity-75">실제 서비스에서는 광고 제공업체의 광고가 노출됩니다</p>
            </div>
          </div>

          {/* 진행률 및 버튼 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{title}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground"
              >
                <X size={16} className="mr-1" />
                취소
              </Button>
              
              <Button
                onClick={handleSkip}
                disabled={!canSkip}
                variant={canSkip ? "default" : "secondary"}
              >
                {canSkip ? '계속하기' : `${Math.round((100 - progress) / 20)}초 후 계속`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};