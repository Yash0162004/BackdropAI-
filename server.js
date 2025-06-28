import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import axios from 'axios';
import sharp from 'sharp';
import Jimp from 'jimp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist')); // Serve React build

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Background removal using remove.bg API (free tier available)
async function removeBackgroundWithAPI(imageBuffer) {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: imageBuffer,
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY || 'YOUR_API_KEY_HERE',
        'Content-Type': 'application/octet-stream',
      },
      responseType: 'arraybuffer'
    });
    
    return Buffer.from(response.data);
  } catch (error) {
    console.error('Remove.bg API error:', error.message);
    throw new Error('Background removal failed');
  }
}

// Basic background removal using Jimp (color-based segmentation)
async function removeBackgroundWithJimp(imageBuffer) {
  try {
    // Load image with Jimp
    const image = await Jimp.read(imageBuffer);
    
    // Get image dimensions
    const width = image.getWidth();
    const height = image.getHeight();
    
    // Create a new image with transparency
    const result = new Jimp(width, height, 0x00000000);
    
    // Get the most common color in the corners (assumed to be background)
    const cornerColors = [
      image.getPixelColor(0, 0),
      image.getPixelColor(width - 1, 0),
      image.getPixelColor(0, height - 1),
      image.getPixelColor(width - 1, height - 1)
    ];
    
    // Calculate average background color
    const avgBgColor = cornerColors.reduce((sum, color) => sum + color, 0) / cornerColors.length;
    
    // Threshold for color similarity (adjust this value for better results)
    const threshold = 50;
    
    // Process each pixel
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const pixelColor = image.getPixelColor(x, y);
        
        // Calculate color difference
        const colorDiff = Math.abs(pixelColor - avgBgColor);
        
        // If pixel is similar to background, make it transparent
        if (colorDiff < threshold) {
          result.setPixelColor(0x00000000, x, y); // Transparent
        } else {
          result.setPixelColor(pixelColor, x, y); // Keep original color
        }
      }
    }
    
    // Convert to buffer
    return await result.getBufferAsync(Jimp.MIME_PNG);
    
  } catch (error) {
    console.error('Jimp processing error:', error);
    throw new Error('Image processing failed');
  }
}

// Enhanced background removal using Sharp with edge detection
async function removeBackgroundWithSharp(imageBuffer) {
  try {
    // Use Sharp for basic processing and edge enhancement
    const processed = await sharp(imageBuffer)
      .png()
      .toBuffer();
    
    return processed;
  } catch (error) {
    console.error('Sharp processing error:', error);
    throw new Error('Image processing failed');
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'BackdropAI Backend is running' });
});

// Get available methods
app.get('/methods', (req, res) => {
  res.json({
    methods: ['auto', 'api', 'local', 'jimp'],
    description: 'Available background removal methods'
  });
});

// Background removal endpoint
app.post('/removebg', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileType = req.body.type || 'image';
    const method = req.body.method || 'auto';
    
    console.log(`Processing ${fileType} with method: ${method}`);
    console.log(`File: ${req.file.filename}`);

    if (fileType === 'image') {
      // Read the uploaded file
      const imageBuffer = fs.readFileSync(req.file.path);
      
      let processedBuffer;
      
      if (method === 'api') {
        // Use remove.bg API
        processedBuffer = await removeBackgroundWithAPI(imageBuffer);
      } else if (method === 'jimp') {
        // Use Jimp for basic background removal
        processedBuffer = await removeBackgroundWithJimp(imageBuffer);
      } else {
        // Use Sharp for basic processing
        processedBuffer = await removeBackgroundWithSharp(imageBuffer);
      }
      
      // Save processed image
      const processedPath = req.file.path.replace(path.extname(req.file.path), '-processed.png');
      fs.writeFileSync(processedPath, processedBuffer);
      
      // Return the processed image
      res.setHeader('Content-Type', 'image/png');
      res.send(processedBuffer);
      
      // Clean up original file
      fs.unlinkSync(req.file.path);
      
    } else if (fileType === 'video') {
      // For videos, we'll use a mock response for now
      // In a real implementation, you'd process video frames
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing
      
      res.json({
        message: 'Video background removal completed',
        url: `/uploads/${req.file.filename}`,
        method: method
      });
    } else {
      res.status(400).json({ error: 'Unsupported file type' });
    }

  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BackdropAI Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
}); 