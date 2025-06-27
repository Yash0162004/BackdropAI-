import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        {/* Pricing Section */}
        <section id="pricing" className="py-20 lg:py-32 bg-background border-t border-border/40">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Pricing</h2>
            <p className="text-lg text-muted-foreground mb-12">Choose the plan that fits your needs. Enjoy unlimited background removal for free, or upgrade for more features.</p>
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 md:gap-8">
              {/* Free Plan */}
              <div className="glass-effect rounded-2xl p-8 w-full max-w-xs border border-primary/20 flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-2">BackdropAI</h3>
                <div className="text-4xl font-bold mb-2">$0</div>
                <div className="text-sm text-muted-foreground mb-4">Per user/month, billed annually</div>
                <ul className="text-left text-muted-foreground space-y-2 mb-6 w-full">
                  <li><span className='text-green-500'>✔️</span> Unlimited image background removal</li>
                  <li><span className='text-green-500'>✔️</span> No watermarks</li>
                  <li><span className='text-green-500'>✔️</span> Fast processing</li>
                  <li><span className='text-green-500'>✔️</span> Open source backend</li>
                  <li><span className='text-green-500'>✔️</span> Community support</li>
                </ul>
                <button className="gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition w-full mt-auto">Get started for free</button>
              </div>
              {/* Pro Plan */}
              <div className="glass-effect rounded-2xl p-8 w-full max-w-xs border-2 border-primary flex flex-col h-full relative shadow-lg scale-105">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-white text-gray-900 text-xs font-bold px-4 py-1 rounded-full shadow border border-border">Popular</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 mt-2">BackdropAI Pro</h3>
                <div className="text-4xl font-bold mb-2">$19</div>
                <div className="text-sm text-muted-foreground mb-4">Per user/month, billed annually</div>
                <ul className="text-left text-muted-foreground space-y-2 mb-6 w-full">
                  <li><span className='text-green-500'>✔️</span> Everything in Free</li>
                  <li><span className='text-green-500'>✔️</span> Priority processing</li>
                  <li><span className='text-green-500'>✔️</span> Email support</li>
                  <li><span className='text-green-500'>✔️</span> Early access to new features</li>
                  <li><span className='text-green-500'>✔️</span> Up to 5 team members</li>
                </ul>
                <button className="gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition w-full mt-auto">Get started with Pro</button>
              </div>
              {/* Enterprise Plan */}
              <div className="rounded-2xl p-8 w-full max-w-xs bg-gradient-to-br from-gray-900 to-gray-800 text-white border border-border flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-2">BackdropAI Enterprise</h3>
                <div className="text-4xl font-bold mb-2">Custom</div>
                <div className="text-sm text-gray-300 mb-4">Per user/month, billed annually</div>
                <ul className="text-left text-gray-300 space-y-2 mb-6 w-full">
                  <li><span className='text-green-400'>✔️</span> Everything in Pro</li>
                  <li><span className='text-green-400'>✔️</span> Dedicated support</li>
                  <li><span className='text-green-400'>✔️</span> Custom integrations</li>
                  <li><span className='text-green-400'>✔️</span> SLA & onboarding</li>
                  <li><span className='text-green-400'>✔️</span> Unlimited team members</li>
                </ul>
                <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition w-full mt-auto">Get started with Enterprise</button>
              </div>
            </div>
          </div>
        </section>
        {/* API Section */}
        <section id="api" className="py-20 lg:py-32 border-t border-border/40">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6 gradient-text">API</h2>
            <div className="flex flex-col items-center justify-center">
              <span className="text-lg text-muted-foreground mb-4">BackdropAI API Coming Soon<span className="animate-pulse inline-block">...</span></span>
              <div className="bg-muted rounded-xl p-8 text-center mx-auto max-w-2xl">
                <span className="text-muted-foreground text-sm">We are working hard to make our API available for everyone. Stay tuned for updates!</span>
              </div>
            </div>
          </div>
        </section>
        {/* Contact Section */}
        <section id="contact" className="py-20 lg:py-32 bg-background border-t border-border/40">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Contact</h2>
            <p className="text-lg text-muted-foreground mb-8">Have questions, feedback, or want to contribute? Reach out to us!</p>
            <form className="max-w-xl mx-auto grid gap-6">
              <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-lg border border-border bg-muted focus:outline-none focus:ring-2 focus:ring-primary" />
              <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-lg border border-border bg-muted focus:outline-none focus:ring-2 focus:ring-primary" />
              <textarea placeholder="Your Message" rows={4} className="w-full px-4 py-3 rounded-lg border border-border bg-muted focus:outline-none focus:ring-2 focus:ring-primary" />
              <button type="submit" className="gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition">Send Message</button>
            </form>
            <div className="mt-8 text-muted-foreground text-sm">Or email us at <a href="mailto:hello@backdropai.com" className="underline text-primary">hello@backdropai.com</a></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
