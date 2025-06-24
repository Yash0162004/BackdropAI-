
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Upload, Download, ArrowLeft, Loader2, Image as ImageIcon, CheckCircle, X, Video, Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalFile, setOriginalFile] = useState<string | null>(null);
  const [processedFile, setProcessedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setFileName(file.name);
      setFileType(file.type.startsWith('image/') ? 'image' : 'video');
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileUrl = e.target?.result as string;
        setOriginalFile(fileUrl);
        processFile(fileUrl, file.type.startsWith('video/'));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const processFile = async (fileUrl: string, isVideo: boolean) => {
    setIsProcessing(true);
    setProcessedFile(null);
    
    // Simulate AI processing with realistic delay
    // For videos, processing takes longer
    const delay = isVideo ? 8000 : 3000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // For demo purposes, we'll show the same file
    // In production, this would call your background removal API
    setProcessedFile(fileUrl);
    setIsProcessing(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const downloadFile = () => {
    if (processedFile) {
      const link = document.createElement('a');
      link.href = processedFile;
      const extension = fileType === 'video' ? 'mp4' : 'png';
      link.download = `${fileName.split('.')[0]}-no-bg.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetUpload = () => {
    setOriginalFile(null);
    setProcessedFile(null);
    setIsProcessing(false);
    setFileName('');
    setFileType(null);
    setIsVideoPlaying(false);
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 hover:bg-muted/50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">AI Media Background Remover</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your images or videos and let our AI instantly remove backgrounds with professional quality results
            </p>
          </div>

          {!originalFile ? (
            <div className="max-w-2xl mx-auto">
              <div
                className={`
                  relative border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300 cursor-pointer
                  ${dragOver 
                    ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  }
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleUploadClick}
              >
                <div className="space-y-8">
                  <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <div className="flex space-x-2">
                      <ImageIcon className="h-8 w-8 text-primary" />
                      <Video className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold">Drop your media here</h3>
                    <p className="text-muted-foreground text-lg">
                      Support for images and videos - or click to browse from your device
                    </p>
                  </div>

                  <Button 
                    size="lg"
                    className="gradient-primary text-white hover:opacity-90 transition-opacity px-8 py-6 text-lg"
                  >
                    <Upload className="mr-3 h-6 w-6" />
                    Choose Media File
                  </Button>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="text-center">
                      <p className="text-sm font-medium mb-2">Images</p>
                      <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                        <span className="bg-muted px-2 py-1 rounded">PNG</span>
                        <span className="bg-muted px-2 py-1 rounded">JPG</span>
                        <span className="bg-muted px-2 py-1 rounded">WebP</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium mb-2">Videos</p>
                      <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                        <span className="bg-muted px-2 py-1 rounded">MP4</span>
                        <span className="bg-muted px-2 py-1 rounded">MOV</span>
                        <span className="bg-muted px-2 py-1 rounded">AVI</span>
                      </div>
                    </div>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* File Info */}
              <div className="flex items-center justify-center space-x-4 p-4 bg-muted/30 rounded-2xl max-w-md mx-auto">
                {fileType === 'image' ? (
                  <ImageIcon className="h-5 w-5 text-primary" />
                ) : (
                  <Video className="h-5 w-5 text-primary" />
                )}
                <span className="font-medium truncate">{fileName}</span>
                <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {fileType?.toUpperCase()}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetUpload}
                  className="h-8 w-8 p-0 hover:bg-destructive/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Media Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Original Media */}
                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h3 className="text-xl font-semibold">Original</h3>
                  </div>
                  <div className="relative rounded-3xl overflow-hidden bg-card border shadow-lg">
                    {fileType === 'image' ? (
                      <img 
                        src={originalFile} 
                        alt="Original" 
                        className="w-full h-auto max-h-[500px] object-contain"
                      />
                    ) : (
                      <div className="relative">
                        <video 
                          ref={videoRef}
                          src={originalFile} 
                          className="w-full h-auto max-h-[500px] object-contain"
                          controls={false}
                          onPlay={() => setIsVideoPlaying(true)}
                          onPause={() => setIsVideoPlaying(false)}
                        />
                        <Button
                          onClick={toggleVideoPlayback}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-16 h-16 bg-black/50 hover:bg-black/70 transition-colors"
                          size="lg"
                        >
                          {isVideoPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Processed Media */}
                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h3 className="text-xl font-semibold">Background Removed</h3>
                  </div>
                  <div className="relative rounded-3xl overflow-hidden bg-card border shadow-lg min-h-[300px] flex items-center justify-center">
                    {isProcessing ? (
                      <div className="text-center space-y-6 p-12">
                        <div className="relative">
                          <div className="w-16 h-16 mx-auto">
                            <Loader2 className="h-16 w-16 text-primary animate-spin" />
                          </div>
                          <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-primary/20 animate-ping"></div>
                        </div>
                        <div className="space-y-3">
                          <p className="text-lg font-semibold">
                            Processing your {fileType}...
                          </p>
                          <p className="text-muted-foreground">
                            {fileType === 'video' 
                              ? 'Processing frame-by-frame with AI' 
                              : 'Our AI is working its magic'
                            }
                          </p>
                        </div>
                        <div className="w-64 bg-muted rounded-full h-2 mx-auto overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse w-3/4"></div>
                        </div>
                      </div>
                    ) : processedFile ? (
                      <>
                        {fileType === 'image' ? (
                          <img 
                            src={processedFile} 
                            alt="Processed" 
                            className="w-full h-auto max-h-[500px] object-contain"
                            style={{ 
                              background: 'repeating-conic-gradient(#f1f5f9 0% 25%, #e2e8f0 0% 50%) 50% / 20px 20px' 
                            }}
                          />
                        ) : (
                          <video 
                            src={processedFile} 
                            className="w-full h-auto max-h-[500px] object-contain"
                            controls
                            style={{ 
                              background: 'repeating-conic-gradient(#f1f5f9 0% 25%, #e2e8f0 0% 50%) 50% / 20px 20px' 
                            }}
                          />
                        )}
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Complete</span>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {processedFile && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                  <Button 
                    onClick={downloadFile}
                    size="lg"
                    className="gradient-primary text-white hover:opacity-90 transition-opacity px-8 py-6 text-lg"
                  >
                    <Download className="mr-3 h-6 w-6" />
                    Download HD {fileType === 'video' ? 'Video' : 'Image'}
                  </Button>
                  
                  <Button 
                    onClick={resetUpload}
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-lg hover:bg-muted/50"
                  >
                    Process Another File
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
