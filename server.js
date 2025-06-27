// server.js
// Node.js Express server for BackdropAI

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'backdropai-backend',
    message: 'BackdropAI server is running'
  });
});

// Background removal endpoint (placeholder)
app.post('/api/remove-bg', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`Processing image: ${req.file.originalname}`);

    // For now, just return the original image
    // This is a placeholder - you can implement local background removal here
    const originalImage = fs.readFileSync(req.file.path);
    
    // Clean up temporary file
    fs.unlinkSync(req.file.path);

    res.setHeader('Content-Type', 'image/png');
    res.send(originalImage);

  } catch (error) {
    console.error('Error processing image:', error);
    
    // Clean up input file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Failed to process image',
      details: error.message 
    });
  }
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
}); 