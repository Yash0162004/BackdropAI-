
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate('/upload');
  };

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Remove the background from images for{' '}
            <span className="gradient-text">free</span>.
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Remove background from images of humans, animals or objects and download high-resolution images for free.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleUploadClick}
              size="lg" 
              className="gradient-primary text-white hover:opacity-90 transition-opacity text-lg px-8 py-6"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Image
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Try from URL
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            or drop image anywhere on this page
          </p>
        </div>

        {/* Hero Image Preview */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Before Image */}
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 p-8 border-2 border-dashed border-pink-300 dark:border-pink-600">
                  <div className="h-full w-full rounded-xl bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Original Image</span>
                  </div>
                </div>
                <div className="absolute -top-3 left-3 bg-background border rounded-full px-3 py-1 text-sm font-medium">
                  Before
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center animate-pulse-glow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* After Image */}
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-8 border-2 border-purple-300 dark:border-purple-600">
                  <div className="h-full w-full rounded-xl bg-transparent border-2 border-dashed border-purple-400 dark:border-purple-500 flex items-center justify-center">
                    <span className="text-muted-foreground">Background Removed</span>
                  </div>
                </div>
                <div className="absolute -top-3 left-3 bg-background border rounded-full px-3 py-1 text-sm font-medium">
                  After
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(125%_125%_at_50%_10%,transparent_40%,theme(colors.primary/10%)_100%)]" />
    </section>
  );
}
