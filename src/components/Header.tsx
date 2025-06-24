
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-r from-pink-500 to-purple-600">
            <span className="text-sm font-bold text-white">D</span>
          </div>
          <span className="text-xl font-bold">detach</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-sm font-medium transition-colors hover:text-primary">
            How to use
          </a>
          <a href="#" className="text-sm font-medium transition-colors hover:text-primary">
            Tools & API
          </a>
          <a href="#" className="text-sm font-medium transition-colors hover:text-primary">
            Pricing
          </a>
          <a href="#" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
            <Button size="sm" className="gradient-primary text-white">
              Sign Up
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container py-4 space-y-4">
            <a href="#" className="block text-sm font-medium transition-colors hover:text-primary">
              How to use
            </a>
            <a href="#" className="block text-sm font-medium transition-colors hover:text-primary">
              Tools & API
            </a>
            <a href="#" className="block text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </a>
            <a href="#" className="block text-sm font-medium transition-colors hover:text-primary">
              Contact
            </a>
            <div className="flex space-x-2 pt-4">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
              <Button size="sm" className="gradient-primary text-white">
                Sign Up
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
