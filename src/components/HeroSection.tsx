import { Button } from '@/components/ui/button';
import { Upload, ArrowRight, Zap, Shield, Globe, Sparkles, Video, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import orignalImg from '../../orignal.png';
import bgremoveImg from '../../bgremove.png';

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
              <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-8 md:gap-x-10 relative">
                {/* Before Card */}
                <motion.div 
                  className="group relative flex items-center justify-center aspect-square min-w-[440px] max-w-[480px] min-h-[440px] max-h-[480px] mx-auto"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200" />
                  <div className="relative w-full h-full aspect-square rounded-2xl bg-card border border-border/50 p-6 backdrop-blur-sm flex items-center justify-center">
                    <img src={orignalImg} alt="Original" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div className="absolute -top-3 left-4 bg-background border rounded-full px-3 py-1 text-sm font-medium shadow-sm">
                    Before
                  </div>
                </motion.div>

                {/* Arrow */}
                <motion.div 
                  className="hidden md:flex items-center justify-center z-10"
                  style={{ minWidth: '72px', minHeight: '72px' }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
                >
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg animate-pulse">
                    <ArrowRight className="w-7 h-7" />
                  </div>
                </motion.div>

                {/* After Card */}
                <motion.div 
                  className="group relative flex items-center justify-center aspect-square min-w-[440px] max-w-[480px] min-h-[440px] max-h-[480px] mx-auto"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200" />
                  <div className="relative w-full h-full aspect-square rounded-2xl bg-card border border-border/50 p-6 backdrop-blur-sm flex items-center justify-center">
                    <img src={bgremoveImg} alt="Background Removed" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div className="absolute -top-3 left-4 bg-background border rounded-full px-3 py-1 text-sm font-medium shadow-sm">
                    After
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
