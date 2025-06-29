import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { CheckCircle, Copy, Download, ArrowRight, Key, Sparkles } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ApiSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // Fetch API purchase result
      fetch(`/api-success?session_id=${sessionId}`)
        .then(response => response.json())
        .then(data => {
          setApiData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching API data:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const copyApiKey = async () => {
    if (apiData?.api_key) {
      await navigator.clipboard.writeText(apiData.api_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadApiKey = () => {
    if (apiData?.api_key) {
      const blob = new Blob([`RMBG_API_KEY=${apiData.api_key}\nPLAN=${apiData.plan}\n\nKeep this key safe and don't share it with anyone!`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rmbg-api-key.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-8"
            >
              <Sparkles className="w-16 h-16 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-4">Setting up your RMBG API...</h2>
            <p className="text-muted-foreground">Please wait while we configure your API access.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!apiData?.success) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-red-600">API Setup Failed</h2>
            <p className="text-muted-foreground mb-8">
              {apiData?.message || 'There was an error setting up your RMBG API access.'}
            </p>
            <Button onClick={() => navigate('/')} className="gradient-primary text-white">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Success Header */}
          <div className="text-center mb-12">
            <motion.div 
              className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-4 gradient-text">RMBG API Access Activated!</h1>
            <p className="text-lg text-muted-foreground">
              Your RMBG API has been successfully purchased and configured.
            </p>
          </div>

          {/* API Key Card */}
          <motion.div 
            className="bg-card border border-border rounded-2xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <Key className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Your RMBG API Key</h2>
            </div>
            
            <div className="bg-muted rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono break-all">{apiData.api_key}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyApiKey}
                  className="ml-2"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {copied && (
              <motion.div 
                className="text-green-600 text-sm mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ✓ API key copied to clipboard!
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={downloadApiKey}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Key</span>
              </Button>
              <Button
                onClick={copyApiKey}
                className="flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Key</span>
              </Button>
            </div>
          </motion.div>

          {/* Plan Details */}
          <motion.div 
            className="bg-muted/30 rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4">Plan Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan Type:</span>
                <span className="font-medium capitalize">{apiData.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Credits:</span>
                <span className="font-medium">{apiData.credits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                You can now use your RMBG API key in your applications. The API provides premium background removal with 4K resolution support.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate('/upload')}
                  className="gradient-primary text-white flex items-center space-x-2"
                >
                  <span>Try Upload Feature</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Return to Home
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 