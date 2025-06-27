# Unified Background Removal Server

A comprehensive Flask server that provides both image and video background removal capabilities using multiple processing methods.

## Features

### 🖼️ Image Processing
- **Local Processing**: Uses `rembg` library with U2Net model for high-quality image background removal
- **Fast Processing**: Optimized with session reuse for better performance
- **Multiple Formats**: Supports PNG, JPG, WebP, and other common image formats

### 🎬 Video Processing
- **API Processing**: Uses Unscreen API for fast, high-quality video background removal
- **Local Processing**: Frame-by-frame processing using local AI models (no API limits)
- **Auto Selection**: Automatically chooses the best method based on availability

## Processing Methods

### For Images
- **Local (rembg)**: Recommended method using local AI processing

### For Videos
- **Auto**: Automatically selects API if available, falls back to local processing
- **API (Unscreen)**: Fast processing using Unscreen API (requires API key)
- **Local**: Frame-by-frame processing using local AI (slower but no API limits)

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure API Keys (Optional)

For video processing with Unscreen API, get a free API key from [Unscreen](https://www.unscreen.com/api) and update the `UNSCREEN_API_KEY` in `unified_bg_remover.py`.

### 3. Start the Server

```bash
python unified_bg_remover.py
```

The server will start on `http://localhost:5002`

## API Endpoints

### POST `/removebg`
Main endpoint for background removal.

**Parameters:**
- `file`: The image or video file to process
- `type`: File type (`image` or `video`)
- `method`: Processing method (`auto`, `api`, or `local`) - only for videos

**Example:**
```bash
curl -X POST -F "file=@image.jpg" -F "type=image" http://localhost:5002/removebg
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "unified-background-removal",
  "features": {
    "image_processing": "local (rembg)",
    "video_processing": "api (unscreen) + local (frame-by-frame)",
    "unscreen_api_configured": true
  }
}
```

### GET `/methods`
Get available processing methods.

**Response:**
```json
{
  "image": {
    "local": "Process images locally using rembg (recommended)"
  },
  "video": {
    "api": "Process videos using Unscreen API (fast, high quality)",
    "local": "Process videos frame-by-frame locally (slower, no API limits)",
    "auto": "Use API if available, fallback to local processing"
  }
}
```

## Frontend Integration

The React frontend has been updated to support the unified server with:

- **Method Selection**: Dropdown to choose processing method for videos
- **Status Updates**: Real-time processing status with method information
- **Error Handling**: Comprehensive error handling for all processing methods

## Unscreen API Limits

- **Free Tier**: 10 videos per month, max 5 seconds each
- **Watermark**: Free tier includes watermark
- **No Auto-billing**: Won't charge if limits exceeded

## Performance Considerations

### Image Processing
- **Speed**: ~1-3 seconds per image (depending on size)
- **Quality**: High-quality results with post-processing
- **Memory**: Low memory usage with session reuse

### Video Processing
- **API Method**: Fast (30 seconds to 2 minutes depending on video length)
- **Local Method**: Slower (depends on video length and frame count)
- **Quality**: Both methods provide high-quality results

## Error Handling

The server includes comprehensive error handling:

- **API Errors**: Graceful fallback for API failures
- **File Validation**: Proper file type and size validation
- **Memory Management**: Automatic cleanup of temporary files
- **Detailed Logging**: Extensive logging for debugging

## Development

### Running in Development Mode
```bash
python unified_bg_remover.py
```

### Debug Mode
The server runs with Flask debug mode enabled by default for development.

### Logging
The server provides detailed logging with emojis for easy identification:
- 🔄 Request received
- 📄 File information
- 🖼️ Image processing
- 🎬 Video processing
- ✅ Success messages
- ❌ Error messages
- 🧹 Cleanup operations

## Migration from Separate Servers

If you were using the separate `remove_bg_server.py` and `video_bg_remover.py`:

1. **Stop the old servers**
2. **Start the unified server**: `python unified_bg_remover.py`
3. **Update frontend**: The frontend has been updated to work with the unified server
4. **API compatibility**: The `/removebg` endpoint maintains the same interface

## Troubleshooting

### Common Issues

1. **CUDA DLL Warnings**: These are warnings and don't affect functionality
2. **Cryptography Deprecation**: Warnings about deprecated algorithms, doesn't affect functionality
3. **API Key Issues**: Check if your Unscreen API key is valid and has remaining credits
4. **File Size Limits**: Large videos may take longer to process

### Getting Help

- Check the server logs for detailed error messages
- Verify API key configuration
- Ensure all dependencies are installed correctly
- Test with smaller files first

## License

This project is open source and available under the MIT License. 