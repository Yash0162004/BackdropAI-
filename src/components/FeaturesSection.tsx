
import { Upload, Download, Video, Palette, Layers, Zap } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Upload,
      title: 'Upload Media',
      description: 'Simply drag and drop your images or videos. Supports JPG, PNG, MP4, MOV, and more formats.',
      step: '01'
    },
    {
      icon: () => (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'AI Processing',
      description: 'Advanced AI removes backgrounds frame-by-frame for videos and instantly for images with precision.',
      step: '02'
    },
    {
      icon: Download,
      title: 'Download & Replace',
      description: 'Download with transparent background or replace with custom images, colors, or videos.',
      step: '03'
    }
  ];

  const additionalFeatures = [
    {
      icon: Video,
      title: 'Video Background Removal',
      description: 'Frame-by-frame processing using MediaPipe and RVM for professional video editing.'
    },
    {
      icon: Palette,
      title: 'Custom Backgrounds',
      description: 'Replace backgrounds with solid colors, gradients, images, or even other videos.'
    },
    {
      icon: Layers,
      title: 'Batch Processing',
      description: 'Process multiple images or videos simultaneously to save time and effort.'
    },
    {
      icon: Zap,
      title: 'Real-time Preview',
      description: 'See changes instantly with our real-time preview before downloading.'
    }
  ];

  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="text-primary">Easy steps</span> to remove backgrounds
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Remove backgrounds from images and videos with AI precision. Perfect for content creators, e-commerce, and marketing professionals.
          </p>
        </div>

        {/* Main Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="relative group">
                <div className="glass-effect rounded-2xl p-8 h-full transition-all duration-300 hover:scale-105">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                        {feature.step}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">
            Advanced Features
          </h3>
          <p className="text-muted-foreground">
            Powered by cutting-edge AI technology for professional results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {additionalFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="group">
                <div className="glass-effect rounded-xl p-6 h-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold mb-3">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
