import { useState } from 'react';
import { WiFiConfig, QRTemplate } from '@/types/wifi';
import { PrintSize, PrintOrientation } from '@/types/size';
import { WiFiForm } from '@/components/WiFiForm';
import { PrintSizeSelector } from '@/components/PrintSizeSelector';
import { TemplateSelector } from '@/components/TemplateSelector';
import { QRPreview } from '@/components/QRPreview';
import { ShareModal } from '@/components/ShareModal';
import { AdBanner } from '@/components/AdBanner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Wifi, QrCode, Download, Sparkles, Heart, Github } from 'lucide-react';
import { toast } from 'sonner';

const NewIndex = () => {
  const [wifiConfig, setWifiConfig] = useState<WiFiConfig>({
    ssid: '',
    password: '',
    security: 'WPA',
    hidden: false,
  });
  
  const [selectedSize, setSelectedSize] = useState<PrintSize | null>(null);
  const [selectedOrientation, setSelectedOrientation] = useState<PrintOrientation['id']>('landscape');
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

      {/* Main Content - New Layout inspired by Figma */}
      <section className="px-4 py-8">
        <div className="container mx-auto max-w-7xl">
          {/* Left Sidebar - Controls */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Configuration Panel */}
            <div className="xl:col-span-1 space-y-6">
              {/* Step 1: Print Size */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <h2 className="text-lg font-semibold">인쇄 크기</h2>
                </div>
                <PrintSizeSelector 
                  selectedSize={selectedSize}
                  selectedOrientation={selectedOrientation}
                  onSizeSelect={setSelectedSize}
                  onOrientationSelect={setSelectedOrientation}
                />
              </div>

              {/* Step 2: WiFi Config */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <h2 className="text-lg font-semibold">WiFi 정보</h2>
                </div>
                <WiFiForm 
                  config={wifiConfig} 
                  onConfigChange={setWifiConfig} 
                />
              </div>

              {/* Step 3: Template */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <h2 className="text-lg font-semibold">디자인</h2>
                </div>
                {selectedSize ? (
                  <TemplateSelector 
                    selectedTemplate={selectedTemplate}
                    onTemplateSelect={setSelectedTemplate}
                    printSize={selectedSize}
                  />
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    먼저 인쇄 크기를 선택해주세요
                  </div>
                )}
              </div>

              {/* Ad Banner */}
              <AdBanner position="sidebar" />
            </div>

            {/* Main Preview Area */}
            <div className="xl:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
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
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 bg-gray-50">
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

      {/* Bottom Ad */}
      <section className="px-4 py-8">
        <div className="container mx-auto max-w-4xl">
          <AdBanner position="bottom" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t py-8 px-4">
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

export default NewIndex;