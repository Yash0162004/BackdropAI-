# Video Background Removal Setup Guide

This project now supports both image and video background removal with high accuracy using advanced AI models.

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

## Installation

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies

```bash
npm install
```

## Running the Application

### 1. Start the Python Backend Server

```bash
python video_bg_remover.py
```

The server will start on `http://localhost:5002`

### 2. Start the Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Features

### Image Background Removal
- Supports PNG, JPG, WebP formats
- High accuracy using U2Net model
- Instant processing

### Video Background Removal
- Supports MP4, MOV, AVI formats
- Frame-by-frame processing
- Maintains original video quality and FPS
- Progress tracking during processing

## Technical Details

### Backend (Python)
- **Flask**: Web server framework
- **rembg**: Advanced background removal using U2Net
- **OpenCV**: Video processing and frame extraction
- **MoviePy**: Video editing and composition
- **Pillow**: Image processing

### Frontend (React + TypeScript)
- **React**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Shadcn/ui**: UI components

## API Endpoints

- `POST /removebg`: Process image or video for background removal
  - Parameters:
    - `file`: The uploaded file
    - `type`: Either 'image' or 'video'
- `GET /health`: Health check endpoint

## Usage

1. Open the application in your browser
2. Upload an image or video file
3. The system will automatically detect the file type
4. For videos, processing may take longer depending on length and resolution
5. Download the processed file with background removed

## Performance Notes

- Image processing: Usually completes in 1-3 seconds
- Video processing: Depends on video length and resolution
  - 1-minute 1080p video: ~2-5 minutes
  - 30-second 720p video: ~1-2 minutes

## Troubleshooting

### Common Issues

1. **Import errors**: Make sure all Python dependencies are installed
2. **Video processing fails**: Ensure the video format is supported
3. **Memory issues**: For large videos, consider processing in smaller chunks

### System Requirements

- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: At least 2GB free space for temporary files
- **GPU**: Optional but recommended for faster processing 