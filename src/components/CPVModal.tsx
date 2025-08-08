import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Eye, Edit3, Download, Share2, Settings, Clock } from 'lucide-react';

interface CPVModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'preview' | 'detail';
  onModeChange: (mode: 'preview' | 'detail') => void;
}

export const CPVModal: React.FC<CPVModalProps> = ({
  isOpen,
  onClose,
  mode,
  onModeChange,
}) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [canChangeMode, setCanChangeMode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(30);
      setCanChangeMode(false);
      
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanChangeMode(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const features = [
    {
      icon: <Eye size={20} className="text-blue-500" />,
      title: '미리보기 모드',
      description: 'QR 코드의 최종 결과를 미리 확인할 수 있습니다.',
      benefits: ['실시간 미리보기', '다운로드 전 확인', '공유 전 검토']
    },
    {
      icon: <Edit3 size={20} className="text-green-500" />,
      title: '상세 조정 모드',
      description: '각 요소의 위치, 크기, 스타일을 세밀하게 조정할 수 있습니다.',
      benefits: ['픽셀 단위 조정', '폰트 스타일 변경', '색상 커스터마이징']
    }
  ];

  const currentFeature = features.find(f => 
    f.title.includes(mode === 'preview' ? '미리보기' : '상세 조정')
  );

  const progressPercentage = ((30 - timeLeft) / 30) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Settings size={24} />
            모드 전환
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 타이머 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock size={20} className="text-orange-500" />
                모드 변경 대기
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  {timeLeft}초
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  30초가 지나면 모드 변경이 가능합니다
                </p>
                <Progress value={progressPercentage} className="w-full" />
              </div>
              
              {canChangeMode && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium">모드 변경이 가능합니다!</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 현재 모드 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {currentFeature?.icon}
                {currentFeature?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {currentFeature?.description}
              </p>
              <div className="space-y-2">
                {currentFeature?.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* 모드 선택 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">모드 선택</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <Card 
                  key={feature.title}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    feature.title.includes(mode === 'preview' ? '미리보기' : '상세 조정')
                      ? 'ring-2 ring-primary'
                      : ''
                  } ${!canChangeMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => {
                    if (canChangeMode) {
                      const newMode = feature.title.includes('미리보기') ? 'preview' : 'detail';
                      onModeChange(newMode);
                      onClose();
                    }
                  }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      {feature.icon}
                      <Badge variant={feature.title.includes(mode === 'preview' ? '미리보기' : '상세 조정') ? 'default' : 'secondary'}>
                        {feature.title.includes(mode === 'preview' ? '미리보기' : '상세 조정') ? '현재' : '선택'}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* 기능 안내 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">주요 기능</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Download size={24} className="mx-auto mb-2 text-blue-500" />
                <h4 className="font-medium">다운로드</h4>
                <p className="text-sm text-muted-foreground">고해상도 PNG/PDF</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Share2 size={24} className="mx-auto mb-2 text-green-500" />
                <h4 className="font-medium">공유</h4>
                <p className="text-sm text-muted-foreground">소셜 미디어 공유</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Settings size={24} className="mx-auto mb-2 text-purple-500" />
                <h4 className="font-medium">커스터마이징</h4>
                <p className="text-sm text-muted-foreground">완전한 디자인 제어</p>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={onClose}>
              확인
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
