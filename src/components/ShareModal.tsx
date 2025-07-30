import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Share2, MessageCircle, Copy, Download } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  businessName?: string;
}

export const ShareModal = ({ isOpen, onClose, imageUrl, businessName }: ShareModalProps) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const shareText = `${businessName ? `${businessName}의 ` : ''}WiFi QR 코드를 생성했어요! 이제 QR코드만 스캔하면 바로 WiFi에 연결됩니다. 🔗✨\n\n무료 WiFi QR 생성기에서 만들어보세요: ${window.location.origin}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopySuccess(true);
      toast.success('링크가 복사되었습니다!');
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      toast.error('링크 복사에 실패했습니다.');
    }
  };

  const handleKakaoShare = () => {
    const message = encodeURIComponent(shareText);
    window.open(`https://talk.naver.com/WcQsRjzD?message=${message}`, '_blank');
    toast.success('카카오톡으로 공유했습니다!');
  };

  const handleSMSShare = () => {
    const message = encodeURIComponent(shareText);
    window.open(`sms:?body=${message}`);
    toast.success('문자로 공유했습니다!');
  };

  const handleDownloadAndShare = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${businessName || 'WiFi'}-QR코드.png`;
      link.click();
      toast.success('이미지가 다운로드되었습니다! SNS나 메신저로 공유해보세요.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 size={20} />
            공유하기
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">생성기 링크 공유</label>
            <div className="flex gap-2">
              <Input 
                value={window.location.origin} 
                readOnly 
                className="flex-1"
              />
              <Button 
                onClick={handleCopyLink}
                variant="outline"
                className={copySuccess ? "bg-green-50 border-green-200" : ""}
              >
                <Copy size={16} />
                {copySuccess ? '복사됨!' : '복사'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleKakaoShare}
              variant="outline"
              className="flex items-center gap-2"
            >
              <MessageCircle size={16} />
              카카오톡
            </Button>
            
            <Button 
              onClick={handleSMSShare}
              variant="outline"
              className="flex items-center gap-2"
            >
              <MessageCircle size={16} />
              문자 메시지
            </Button>
          </div>

          {imageUrl && (
            <div className="pt-2 border-t">
              <Button 
                onClick={handleDownloadAndShare}
                className="w-full flex items-center gap-2"
              >
                <Download size={16} />
                QR 이미지 다운로드 후 공유
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};