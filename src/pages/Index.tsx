import { useState } from 'react';
import { WiFiConfig, QRTemplate } from '@/types/wifi';
import { PrintSize } from '@/types/size';
import { WiFiForm } from '@/components/WiFiForm';
import { PrintSizeSelector } from '@/components/PrintSizeSelector';
import { TemplateSelector } from '@/components/TemplateSelector';
import { QRPreview } from '@/components/QRPreview';
import { ShareModal } from '@/components/ShareModal';
import { AdBanner } from '@/components/AdBanner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Wifi, QrCode, Download, Sparkles, Heart, Github } from 'lucide-react';
import { qrTemplates } from '@/data/templates';
import { toast } from 'sonner';

const Index = () => {
  const [wifiConfig, setWifiConfig] = useState<WiFiConfig>({
    ssid: '',
    password: '',
    security: 'WPA',
    hidden: false,
  });
  
  const [selectedSize, setSelectedSize] = useState<PrintSize | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<QRTemplate | null>(null);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>();

  const handleDownload = (imageUrl: string) => {
    setGeneratedCount(prev => prev + 1);
    setGeneratedImageUrl(imageUrl);
    if (generatedCount === 0) {
      toast.success('첫 번째 QR 코드가 생성되었습니다! 🎉');
    }
  };

  const handleShare = (imageUrl?: string) => {
    setGeneratedImageUrl(imageUrl);
    setShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-hero rounded-lg shadow-glow">
                <QrCode size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  WiFi QR Generator
                </h1>
                <p className="text-xs text-muted-foreground">Professional QR codes for your business</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles size={16} className="text-primary" />
                <span>{generatedCount}개 QR 코드 생성됨</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github size={16} />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Wifi size={16} />
            사업자를 위한 무료 도구
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            아름다운 WiFi QR 코드 생성기
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            더 이상 종이에 WiFi 비밀번호를 적지 마세요! 고객이 바로 스캔해서 연결할 수 있는 전문적인 QR 코드를 생성하세요. 카페, 레스토랑, 호텔 등 모든 사업장에 완벽합니다.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-12">
            <div className="flex items-center gap-2">
              <Download size={16} className="text-primary" />
              <span>고해상도 다운로드</span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode size={16} className="text-primary" />
              <span>다양한 템플릿</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-primary" />
              <span>100% 무료</span>
            </div>
          </div>
        </div>
      </section>

      {/* 상단 광고 배너 */}
      <section className="px-4">
        <div className="container mx-auto max-w-4xl">
          <AdBanner position="top" />
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Step 1: Print Size Selection */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <h2 className="text-xl font-semibold">인쇄 크기</h2>
              </div>
              
              <PrintSizeSelector 
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
              />
            </div>

            {/* Step 2: WiFi Configuration */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <h2 className="text-xl font-semibold">WiFi 정보</h2>
              </div>
              
              <WiFiForm 
                config={wifiConfig} 
                onConfigChange={setWifiConfig} 
              />
            </div>

            {/* Step 3: Template Selection */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <h2 className="text-xl font-semibold">디자인 선택</h2>
              </div>
              
              {selectedSize && (
                <TemplateSelector 
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={setSelectedTemplate}
                  printSize={selectedSize}
                />
              )}
              
              {!selectedSize && (
                <div className="text-center text-muted-foreground py-8">
                  먼저 인쇄 크기를 선택해주세요
                </div>
              )}
            </div>

            {/* Step 4: Preview & Download */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <h2 className="text-xl font-semibold">다운로드</h2>
              </div>
              
              {/* 사이드바 광고 */}
              <AdBanner position="sidebar" className="mb-4" />
              
              <QRPreview 
                config={wifiConfig}
                template={selectedTemplate}
                printSize={selectedSize}
                onDownload={handleDownload}
                onShare={handleShare}
              />
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Features Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">사업자들이 이 도구를 사랑하는 이유</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <QrCode size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold">전문적인 외관</h3>
              <p className="text-muted-foreground">
                손으로 쓴 WiFi 비밀번호를 비즈니스 스타일에 맞는 아름답고 브랜드화된 QR 코드로 교체하세요.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Wifi size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold">즉시 연결</h3>
              <p className="text-muted-foreground">
                고객이 한 번 스캔하면 자동으로 연결됩니다. 더 이상 긴 비밀번호를 입력하거나 직원에게 묻지 않아도 됩니다.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Download size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold">인쇄 준비 완료</h3>
              <p className="text-muted-foreground">
                인쇄, 코팅 또는 비즈니스 어디든 표시하기에 완벽한 고해상도 파일을 다운로드하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 광고 배너 */}
      <section className="px-4 mt-12">
        <div className="container mx-auto max-w-4xl">
          <AdBanner position="bottom" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t py-8 px-4 mt-12">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode size={20} className="text-primary" />
            <span className="font-semibold">WiFi QR 생성기</span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            더 나은 고객 경험을 제공하고자 하는 소상공인을 위해 ❤️로 만들었습니다.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>© 2024 WiFi QR 생성기</span>
            <span>•</span>
            <span>무료 사용</span>
            <span>•</span>
            <span>회원가입 불필요</span>
          </div>
        </div>
      </footer>

      {/* Share Modal */}
      <ShareModal 
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        imageUrl={generatedImageUrl}
        businessName={wifiConfig.ssid}
      />
    </div>
  );
};

export default Index;
