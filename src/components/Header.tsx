import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, Sparkles, LogOut } from 'lucide-react';
import { SignInButton, UserButton, SignedIn, SignedOut, useClerk } from '@clerk/clerk-react';
import { motion, AnimatePresence, easeOut, easeInOut } from 'framer-motion';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut();
  };

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: easeOut
      }
    }
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: easeOut
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: easeInOut
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: easeOut
      }
    },
    hover: {
      y: -2,
      transition: {
        duration: 0.2,
        ease: easeInOut
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: easeOut
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: easeInOut
      }
    }
  };

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            variants={logoVariants}
            whileHover="hover"
          >
            <motion.div 
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: easeInOut }}
            >
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Backfree
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.a 
              href="#features" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              variants={navItemVariants}
              whileHover="hover"
            >
              Features
            </motion.a>
            <motion.a 
              href="#pricing" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              variants={navItemVariants}
              whileHover="hover"
            >
              Pricing
            </motion.a>
            <motion.a 
              href="#api" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              variants={navItemVariants}
              whileHover="hover"
            >
              API
            </motion.a>
            <motion.a 
              href="#contact" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              variants={navItemVariants}
              whileHover="hover"
            >
              Contact
            </motion.a>
            <SignedIn>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <UserButton afterSignOutUrl="/" />
              </motion.div>
            </SignedIn>
          </nav>

          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ThemeToggle />
            </motion.div>
            <div className="hidden md:flex items-center space-x-3">
              <SignedIn>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="text-sm font-medium flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </motion.div>
              </SignedIn>
              <SignedOut>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm" className="text-sm font-medium">
                      Sign In
                    </Button>
                  </SignInButton>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SignInButton mode="modal">
                    <Button size="sm" className="gradient-primary text-white hover:opacity-90 transition-opacity">
                      Get Started
                    </Button>
                  </SignInButton>
                </motion.div>
              </SignedOut>
            </div>
            
            {/* Mobile Menu Button */}
            <motion.div
              className="md:hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md overflow-hidden"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <nav className="container py-6 space-y-4">
                <motion.a 
                  href="#features" 
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Features
                </motion.a>
                <motion.a 
                  href="#pricing" 
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Pricing
                </motion.a>
                <motion.a 
                  href="#api" 
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  API
                </motion.a>
                <motion.a 
                  href="#contact" 
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Contact
                </motion.a>
                <div className="flex flex-col space-y-3 pt-4">
                  <SignedIn>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSignOut}
                        className="justify-start flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </Button>
                    </motion.div>
                  </SignedIn>
                  <SignedOut>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <SignInButton mode="modal">
                        <Button variant="ghost" size="sm" className="justify-start">
                          Sign In
                        </Button>
                      </SignInButton>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <SignInButton mode="modal">
                        <Button size="sm" className="gradient-primary text-white hover:opacity-90 transition-opacity justify-start">
                          Get Started
                        </Button>
                      </SignInButton>
                    </motion.div>
                  </SignedOut>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
