import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Upload, Download, ArrowLeft, Loader2, Image as ImageIcon, CheckCircle, X, Video, Play, Pause, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { pipeline } from '@xenova/transformers';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BACKEND_URL } from '@/config';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [processingMethod, setProcessingMethod] = useState<'auto' | 'api' | 'local'>('auto');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

    try {
      console.log('Processing file:', fileUrl);
      console.log('Is video:', isVideo);
      console.log('Backend URL:', BACKEND_URL);

      // Convert data URL to Blob
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      console.log('File blob size:', blob.size);

      const formData = new FormData();
      formData.append('file', blob, isVideo ? 'video.mp4' : 'image.png');
      formData.append('type', isVideo ? 'video' : 'image');
      
      // Add processing method for videos
      if (isVideo) {
        formData.append('method', processingMethod);
      }

      console.log('Sending request to:', `${BACKEND_URL}/removebg`);

      // Send to unified backend for background removal
      const response = await fetch(`${BACKEND_URL}/removebg`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const resultBlob = await response.blob();
        console.log('Result blob size:', resultBlob.size);
        setProcessedFile(URL.createObjectURL(resultBlob));
      } else {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Background removal error:', error);
      alert(`Background removal failed: ${error.message}. See console for details.`);
      setProcessedFile(fileUrl);
    }
    setIsProcessing(false);
  };

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove background');
      }
      
      // Get the processed image as blob
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      setProcessedFile(imageUrl);
      setSuccessMessage('Background removed successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (file: File) => {
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/remove-video-bg', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setProcessedFile(data.url);
        setSuccessMessage(data.message);
      } else {
        setError(data.error || 'Failed to remove video background');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const uploadAreaVariants = {
    idle: { scale: 1 },
    dragOver: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      <SignedIn>
        <motion.div 
          className="min-h-screen bg-background"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Header />
          
          <div className="container mx-auto px-4 py-8">
            <motion.div 
              className="flex items-center space-x-4 mb-8"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2 hover:bg-muted/50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Button>
              </motion.div>
            </motion.div>

            <div className="max-w-6xl mx-auto">
              <motion.div 
                className="text-center mb-12"
                variants={itemVariants}
              >
                <h1 className="text-4xl font-bold mb-4 gradient-text">BackdropAI - AI Media Background Remover</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Upload your images or videos and let our AI instantly remove backgrounds with professional quality results
                </p>
              </motion.div>

              <AnimatePresence mode="wait">
                {!originalFile ? (
                  <motion.div 
                    key="upload"
                    className="max-w-2xl mx-auto"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <motion.div
                      className={`
                        relative border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300 cursor-pointer
                        ${dragOver 
                          ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg' 
                          : 'border-border hover:border-primary/50 hover:bg-muted/30'
                        }
                      `}
                      variants={uploadAreaVariants}
                      animate={dragOver ? "dragOver" : "idle"}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={handleUploadClick}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="space-y-8">
                        <motion.div 
                          className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <div className="flex space-x-2">
                            <ImageIcon className="h-8 w-8 text-primary" />
                            <Video className="h-8 w-8 text-primary" />
                          </div>
                        </motion.div>
                        
                        <div className="space-y-4">
                          <h3 className="text-2xl font-semibold">Drop your media here</h3>
                          <p className="text-muted-foreground text-lg">
                            Support for images and videos - or click to browse from your device
                          </p>
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            size="lg"
                            className="gradient-primary text-white hover:opacity-90 transition-opacity px-8 py-6 text-lg"
                          >
                            <Upload className="mr-3 h-6 w-6" />
                            Choose Media File
                          </Button>
                        </motion.div>

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
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="processing"
                    className="space-y-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* File Info */}
                    <motion.div 
                      className="flex items-center justify-center space-x-4 p-4 bg-muted/30 rounded-2xl max-w-md mx-auto"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {fileType === 'image' ? (
                        <ImageIcon className="h-5 w-5 text-primary" />
                      ) : (
                        <Video className="h-5 w-5 text-primary" />
                      )}
                      <span className="font-medium truncate">{fileName}</span>
                      <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {fileType?.toUpperCase()}
                      </div>
                      
                      {/* Processing Method Selection for Videos */}
                      {fileType === 'video' && (
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4 text-muted-foreground" />
                          <Select value={processingMethod} onValueChange={(value: 'auto' | 'api' | 'local') => setProcessingMethod(value)}>
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="auto">Auto</SelectItem>
                              <SelectItem value="api">API</SelectItem>
                              <SelectItem value="local">Local</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetUpload}
                          className="h-8 w-8 p-0 hover:bg-destructive/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </motion.div>

                    {/* Media Comparison */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Original Media */}
                      <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <h3 className="text-xl font-semibold">Original</h3>
                        </div>
                        <motion.div 
                          className="relative rounded-3xl overflow-hidden bg-card border shadow-lg"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
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
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  onClick={toggleVideoPlayback}
                                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-16 h-16 bg-black/50 hover:bg-black/70 transition-colors"
                                  size="lg"
                                >
                                  {isVideoPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                                </Button>
                              </motion.div>
                            </div>
                          )}
                        </motion.div>
                      </motion.div>

                      {/* Processed Media */}
                      <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <h3 className="text-xl font-semibold">Background Removed</h3>
                        </div>
                        <motion.div 
                          className="relative rounded-3xl overflow-hidden bg-card border shadow-lg min-h-[300px] flex items-center justify-center"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isProcessing ? (
                            <motion.div 
                              className="text-center space-y-6 p-12"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <div className="relative">
                                <motion.div 
                                  className="w-16 h-16 mx-auto"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                  <Loader2 className="h-16 w-16 text-primary" />
                                </motion.div>
                                <motion.div 
                                  className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-primary/20"
                                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                />
                              </div>
                              <div className="space-y-3">
                                <p className="text-lg font-semibold">
                                  Processing your {fileType}...
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  This may take a few moments
                                </p>
                              </div>
                            </motion.div>
                          ) : processedFile ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              {fileType === 'image' ? (
                                <img 
                                  src={processedFile} 
                                  alt="Processed" 
                                  className="w-full h-auto max-h-[500px] object-contain"
                                />
                              ) : (
                                <video 
                                  src={processedFile} 
                                  className="w-full h-auto max-h-[500px] object-contain"
                                  controls
                                />
                              )}
                            </motion.div>
                          ) : (
                            <div className="text-center space-y-4 p-12">
                              <div className="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                              </div>
                              <p className="text-muted-foreground">Processed file will appear here</p>
                            </div>
                          )}
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Download Button */}
                    {processedFile && !isProcessing && (
                      <motion.div 
                        className="flex justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            onClick={downloadFile}
                            size="lg" 
                            className="gradient-primary text-white hover:opacity-90 transition-opacity px-8 py-6 text-lg"
                          >
                            <Download className="mr-3 h-6 w-6" />
                            Download {fileType === 'video' ? 'Video' : 'Image'}
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
