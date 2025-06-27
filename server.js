// server.js
// Node.js Express server using Remove.bg API

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { removeBackgroundFromImageFile } = require('remove.bg');
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
    provider: 'remove.bg'
  });
});

// Background removal endpoint
app.post('/api/remove-bg', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Remove.bg API key not configured' });
    }

    const inputFile = req.file.path;
    const outputFile = inputFile.replace('.', '_removed.');

    console.log(`Processing image: ${req.file.originalname}`);

    // Remove background using Remove.bg
    const result = await removeBackgroundFromImageFile({
      path: inputFile,
      apiKey: apiKey,
      size: "regular",
      type: "auto"
    });

    // Save the result
    result.saveImage(outputFile);

    // Read the processed image and send as response
    const processedImage = fs.readFileSync(outputFile);
    
    // Clean up temporary files
    fs.unlinkSync(inputFile);
    fs.unlinkSync(outputFile);

    res.setHeader('Content-Type', 'image/png');
    res.send(processedImage);

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