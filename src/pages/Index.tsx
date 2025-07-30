import { useState } from 'react';
import { WiFiConfig, QRTemplate } from '@/types/wifi';
import { WiFiForm } from '@/components/WiFiForm';
import { TemplateSelector } from '@/components/TemplateSelector';
import { QRPreview } from '@/components/QRPreview';
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
  
  const [selectedTemplate, setSelectedTemplate] = useState<QRTemplate | null>(qrTemplates[0]);
  const [generatedCount, setGeneratedCount] = useState(0);

  const handleDownload = () => {
    setGeneratedCount(prev => prev + 1);
    if (generatedCount === 0) {
      toast.success('First QR code generated! 🎉');
    }
  };

  const handleShare = () => {
    toast.success('Thanks for sharing! 💜');
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
                <span>{generatedCount} QR codes generated</span>
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
            Free Tool for Business Owners
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Create Beautiful WiFi QR Codes
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop writing WiFi passwords on paper! Generate professional QR codes that customers can scan to connect instantly. Perfect for cafes, restaurants, hotels, and any business.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-12">
            <div className="flex items-center gap-2">
              <Download size={16} className="text-primary" />
              <span>High-resolution downloads</span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode size={16} className="text-primary" />
              <span>8 beautiful templates</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-primary" />
              <span>100% free to use</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Step 1: WiFi Configuration */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <h2 className="text-xl font-semibold">WiFi Details</h2>
              </div>
              
              <WiFiForm 
                config={wifiConfig} 
                onConfigChange={setWifiConfig} 
              />
            </div>

            {/* Step 2: Template Selection */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <h2 className="text-xl font-semibold">Choose Design</h2>
              </div>
              
              <TemplateSelector 
                selectedTemplate={selectedTemplate}
                onTemplateSelect={setSelectedTemplate}
              />
            </div>

            {/* Step 3: Preview & Download */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <h2 className="text-xl font-semibold">Download</h2>
              </div>
              
              <QRPreview 
                config={wifiConfig}
                template={selectedTemplate}
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
          <h2 className="text-3xl font-bold mb-8">Why Business Owners Love This Tool</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <QrCode size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Professional Look</h3>
              <p className="text-muted-foreground">
                Replace handwritten WiFi passwords with beautiful, branded QR codes that match your business style.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Wifi size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Instant Connection</h3>
              <p className="text-muted-foreground">
                Customers scan once and connect automatically. No more typing long passwords or asking staff.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Download size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Print Ready</h3>
              <p className="text-muted-foreground">
                Download high-resolution files perfect for printing, laminating, or displaying anywhere in your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t py-8 px-4 mt-12">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode size={20} className="text-primary" />
            <span className="font-semibold">WiFi QR Generator</span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Made with ❤️ for small business owners who want to provide better customer experience.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>© 2024 WiFi QR Generator</span>
            <span>•</span>
            <span>Free to use</span>
            <span>•</span>
            <span>No registration required</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
