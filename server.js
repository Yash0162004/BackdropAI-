// server.js
// Node.js Express server for BackdropAI with server-side background removal

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const Jimp = require('jimp');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'backdropai-backend',
    message: 'BackdropAI server is running with background removal'
  });
});

// Simple background removal using color-based segmentation
async function removeBackgroundSimple(imagePath) {
  try {
    // Read image with Jimp
    const image = await Jimp.read(imagePath);
    
    // Get image dimensions
    const width = image.getWidth();
    const height = image.getHeight();
    
    // Create a new image with transparent background
    const result = new Jimp(width, height, 0x00000000);
    
    // Process each pixel
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const pixel = image.getPixelColor(x, y);
        const rgba = Jimp.intToRGBA(pixel);
        
        // Simple background detection (white/light background)
        const brightness = (rgba.r + rgba.g + rgba.b) / 3;
        const threshold = 240; // Adjust this value for different backgrounds
        
        if (brightness < threshold) {
          // Keep pixel if it's not too bright (likely foreground)
          result.setPixelColor(pixel, x, y);
        }
        // Otherwise, leave transparent (background)
      }
    }
    
    return result;
  } catch (error) {
    throw new Error(`Background removal failed: ${error.message}`);
  }
}

// Advanced background removal using edge detection
async function removeBackgroundAdvanced(imagePath) {
  try {
    // Use Sharp for more advanced processing
    const image = sharp(imagePath);
    
    // Get image metadata
    const metadata = await image.metadata();
    
    // Create a mask using edge detection and color analysis
    const processed = await image
      .removeAlpha()
      .grayscale()
      .blur(1)
      .sharpen()
      .threshold(128)
      .png()
      .toBuffer();
    
    // Convert back to Jimp for pixel manipulation
    const mask = await Jimp.read(processed);
    const original = await Jimp.read(imagePath);
    
    const width = original.getWidth();
    const height = original.getHeight();
    
    // Create result image
    const result = new Jimp(width, height, 0x00000000);
    
    // Apply mask to original image
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const originalPixel = original.getPixelColor(x, y);
        const maskPixel = mask.getPixelColor(x, y);
        const maskBrightness = Jimp.intToRGBA(maskPixel).r;
        
        // Keep pixel if mask is dark (foreground)
        if (maskBrightness < 128) {
          result.setPixelColor(originalPixel, x, y);
        }
      }
    }
    
    return result;
  } catch (error) {
    throw new Error(`Advanced background removal failed: ${error.message}`);
  }
}

// Background removal endpoint
app.post('/api/remove-bg', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`Processing image: ${req.file.originalname}`);

    const method = req.body.method || 'simple'; // 'simple' or 'advanced'
    
    let processedImage;
    
    if (method === 'advanced') {
      processedImage = await removeBackgroundAdvanced(req.file.path);
    } else {
      processedImage = await removeBackgroundSimple(req.file.path);
    }
    
    // Convert to buffer
    const buffer = await processedImage.getBufferAsync(Jimp.MIME_PNG);
    
    // Clean up temporary file
    fs.unlinkSync(req.file.path);

    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);

  } catch (error) {
    console.error('Error processing image:', error);
    
    // Clean up input file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Failed to remove background',
      details: error.message 
    });
  }
});

// Get available methods endpoint
app.get('/api/methods', (req, res) => {
  res.json({
    methods: {
      simple: {
        name: 'Simple Color-Based',
        description: 'Removes light/white backgrounds using color thresholding',
        bestFor: 'Images with clear light backgrounds'
      },
      advanced: {
        name: 'Advanced Edge Detection',
        description: 'Uses edge detection and advanced image processing',
        bestFor: 'Complex backgrounds and detailed images'
      }
    }
  });
});

// Video background removal endpoint (placeholder)
app.post('/api/remove-video-bg', upload.single('file'), async (req, res) => {
  res.status(501).json({ 
    error: 'Video background removal not implemented yet',
    message: 'This feature will be added soon'
  });
});

// Serve static files (for React app if needed)
app.use(express.static(path.join(__dirname, 'dist')));

// Catch all route for React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`BackdropAI server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Available methods: http://localhost:${port}/api/methods`);
}); 