import { Button } from '@/components/ui/button';
import { Upload, ArrowRight, Zap, Shield, Globe, Sparkles, Video, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function HeroSection() {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate('/upload');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <motion.div 
        className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="h-[40rem] w-[40rem] rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl" />
      </motion.div>
      
      <div className="relative">
        <motion.div 
          className="container mx-auto px-4 py-24 lg:py-32"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center rounded-full border bg-background/80 backdrop-blur-sm px-4 py-2 text-sm mb-8"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="mr-2 h-4 w-4 text-blue-500" />
              <span className="font-medium">BackdropAI - AI-Powered Media Background Removal</span>
            </motion.div>

            {/* Heading */}
            <motion.h1 
              className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6"
              variants={itemVariants}
            >
              Remove backgrounds from
              <br />
              <span className="gradient-text">images & videos</span> instantly
            </motion.h1>
            
            <motion.p 
              className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl mb-10"
              variants={itemVariants}
            >
              Professional-quality background removal for photos and videos using advanced AI. Perfect for content creators, marketers, and businesses. Replace backgrounds with custom images, colors, or other videos.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleUploadClick}
                  size="lg" 
                  className="gradient-primary text-white hover:opacity-90 transition-all duration-200 text-lg px-8 py-6 group"
                >
                  <Upload className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Upload Media
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 hover:bg-muted/50">
                  Try Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Features */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-16"
              variants={itemVariants}
            >
              <motion.div 
                className="flex items-center justify-center space-x-2 text-sm text-muted-foreground"
                whileHover={{ scale: 1.05 }}
              >
                <Camera className="h-4 w-4 text-green-500" />
                <span>Images & Videos</span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-center space-x-2 text-sm text-muted-foreground"
                whileHover={{ scale: 1.05 }}
              >
                <Shield className="h-4 w-4 text-blue-500" />
                <span>100% Secure</span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-center space-x-2 text-sm text-muted-foreground"
                whileHover={{ scale: 1.05 }}
              >
                <Globe className="h-4 w-4 text-purple-500" />
                <span>API Available</span>
              </motion.div>
            </motion.div>

            {/* Preview Cards */}
            <motion.div 
              className="relative max-w-4xl mx-auto"
              variants={itemVariants}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Before Card */}
                <motion.div 
                  className="group relative"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200" />
                  <div className="relative aspect-square rounded-2xl bg-card border border-border/50 p-6 backdrop-blur-sm">
                    <div className="h-full w-full rounded-xl bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 mx-auto bg-muted-foreground/20 rounded-full flex items-center justify-center">
                          <div className="flex space-x-1">
                            <Camera className="w-6 h-6 text-muted-foreground" />
                            <Video className="w-6 h-6 text-muted-foreground" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">Original Media</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-3 left-4 bg-background border rounded-full px-3 py-1 text-sm font-medium shadow-sm">
                    Before
                  </div>
                </motion.div>

                {/* After Card */}
                <motion.div 
                  className="group relative"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200" />
                  <div className="relative aspect-square rounded-2xl bg-card border border-border/50 p-6 backdrop-blur-sm">
                    <div className="h-full w-full rounded-xl bg-transparent border-2 border-dashed border-primary/30 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">Background Removed</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-3 left-4 bg-background border rounded-full px-3 py-1 text-sm font-medium shadow-sm">
                    After
                  </div>
                </motion.div>
              </div>

              {/* Arrow */}
              <motion.div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
              >
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg animate-pulse">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
