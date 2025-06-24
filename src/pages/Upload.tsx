
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Upload, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setOriginalImage(imageUrl);
        processImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageUrl: string) => {
    setIsProcessing(true);
    setProcessedImage(null);
    
    // Simulate processing time with a realistic delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // For demo purposes, we'll just show the same image
    // In a real app, this would be where you'd call your background removal API
    setProcessedImage(imageUrl);
    setIsProcessing(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'background-removed.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetUpload = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Remove Background from Image</h1>
            <p className="text-muted-foreground">Upload an image to automatically remove its background</p>
          </div>

          {!originalImage ? (
            <div
              className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                ${dragOver 
                  ? 'border-primary bg-primary/5 scale-105' 
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
                }
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="space-y-6">
                <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-12 w-12 text-primary" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Choose an image to upload</h3>
                  <p className="text-muted-foreground mb-6">
                    Drag and drop your image here, or click to browse
                  </p>
                </div>

                <Button 
                  onClick={handleUploadClick}
                  size="lg"
                  className="gradient-primary text-white hover:opacity-90 transition-opacity"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Choose Image
                </Button>

                <p className="text-sm text-muted-foreground">
                  Supports: PNG, JPG, JPEG, WebP
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Original Image */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-center">Original Image</h3>
                  <div className="relative rounded-2xl overflow-hidden bg-muted">
                    <img 
                      src={originalImage} 
                      alt="Original" 
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                </div>

                {/* Processed Image */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-center">Background Removed</h3>
                  <div className="relative rounded-2xl overflow-hidden bg-muted min-h-96 flex items-center justify-center">
                    {isProcessing ? (
                      <div className="text-center space-y-4">
                        <div className="animate-spin">
                          <Loader2 className="h-12 w-12 text-primary mx-auto" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium">Processing your image...</p>
                          <p className="text-sm text-muted-foreground">This may take a few seconds</p>
                        </div>
                        <div className="w-64 bg-muted rounded-full h-2 mx-auto">
                          <div className="bg-primary h-2 rounded-full animate-pulse w-3/4"></div>
                        </div>
                      </div>
                    ) : processedImage ? (
                      <img 
                        src={processedImage} 
                        alt="Processed" 
                        className="w-full h-auto max-h-96 object-contain"
                        style={{ 
                          background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px' 
                        }}
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <p>Processed image will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {processedImage && (
                  <Button 
                    onClick={downloadImage}
                    size="lg"
                    className="gradient-primary text-white hover:opacity-90 transition-opacity"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Image
                  </Button>
                )}
                
                <Button 
                  onClick={resetUpload}
                  variant="outline"
                  size="lg"
                >
                  Upload Another Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
