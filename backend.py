from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import rembg
import os
import requests
import json
import time
import tempfile
import asyncio
from typing import Optional, Dict, Any
import cv2
import numpy as np
from pathlib import Path

app = FastAPI(title="BackdropAI Backend", version="1.0.0")

# Bria AI API Configuration
BRIA_API_KEY = "8968948699084adf914e31928faadf11"
BRIA_API_URL = "https://api.bria.ai/v2"

# Video processing configuration
SUPPORTED_VIDEO_FORMATS = ['.mp4', '.avi', '.mov', '.mkv', '.webm']
MAX_VIDEO_SIZE_MB = 100  # Maximum video size in MB
PROCESSING_TIMEOUT = 300  # 5 minutes timeout

# Store for tracking video processing jobs
video_jobs: Dict[str, Dict[str, Any]] = {}

# Allow CORS for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def validate_video_file(file: UploadFile) -> bool:
    """Validate video file format and size"""
    if not file.content_type or not file.content_type.startswith('video/'):
        return False
    
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in SUPPORTED_VIDEO_FORMATS:
        return False
    
    return True

async def process_video_frames_locally(video_path: str) -> str:
    """Process video frames locally using rembg for each frame"""
    try:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise Exception("Could not open video file")
        
        # Get video properties
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # Create output video writer
        output_path = video_path.replace('.mp4', '_processed.mp4')
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        # Initialize rembg session
        session = rembg.new_session("isnet-general-use")
        
        frame_count = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Convert BGR to RGB
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Remove background using rembg
            processed_frame = rembg.remove(frame_rgb, session=session)
            
            # Convert back to BGR for video writing
            processed_frame_bgr = cv2.cvtColor(processed_frame, cv2.COLOR_RGB2BGR)
            
            out.write(processed_frame_bgr)
            frame_count += 1
            
            # Print progress
            if frame_count % 30 == 0:  # Every 30 frames
                progress = (frame_count / total_frames) * 100
                print(f"[LOCAL] Processing frame {frame_count}/{total_frames} ({progress:.1f}%)")
        
        cap.release()
        out.release()
        
        return output_path
        
    except Exception as e:
        print(f"[LOCAL] Error in local video processing: {str(e)}")
        raise

async def process_video_bg_removal(file: UploadFile):
    """Process video background removal using Bria AI API with fallback to local processing"""
    try:
        print(f"[BRIA] Starting video background removal for: {file.filename}")
        
        # Validate video file
        if not validate_video_file(file):
            raise Exception(f"Unsupported video format. Supported formats: {', '.join(SUPPORTED_VIDEO_FORMATS)}")
        
        # Read video file
        contents = await file.read()
        
        # Check file size
        file_size_mb = len(contents) / (1024 * 1024)
        if file_size_mb > MAX_VIDEO_SIZE_MB:
            print(f"[BRIA] Video too large ({file_size_mb:.1f}MB), falling back to local processing")
            return await process_video_locally(file, contents)
        
        # Try Bria AI first
        try:
            return await process_video_with_bria(file, contents)
        except Exception as bria_error:
            print(f"[BRIA] Bria AI failed: {str(bria_error)}, falling back to local processing")
            return await process_video_locally(file, contents)
            
    except Exception as e:
        print(f"[BRIA] Error processing video {file.filename}: {str(e)}")
        return JSONResponse(status_code=500, content={"error": str(e)})

async def process_video_with_bria(file: UploadFile, contents: bytes):
    """Process video using Bria AI API"""
    # Upload video to Bria AI
    upload_url = f"{BRIA_API_URL}/upload"
    headers = {
        "Authorization": f"Bearer {BRIA_API_KEY}",
        "Content-Type": "application/octet-stream"
    }
    
    print(f"[BRIA] Uploading video to Bria AI...")
    upload_response = requests.post(
        upload_url,
        headers=headers,
        data=contents,
        timeout=60
    )
    
    if upload_response.status_code != 200:
        raise Exception(f"Failed to upload video: {upload_response.text}")
    
    upload_data = upload_response.json()
    video_id = upload_data.get("id")
    
    if not video_id:
        raise Exception("No video ID received from upload")
    
    print(f"[BRIA] Video uploaded successfully, ID: {video_id}")
    
    # Start background removal job
    job_url = f"{BRIA_API_URL}/jobs"
    job_payload = {
        "video_id": video_id,
        "task": "remove_background",
        "options": {
            "background": "transparent",
            "quality": "high"
        }
    }
    
    job_response = requests.post(
        job_url,
        headers={"Authorization": f"Bearer {BRIA_API_KEY}"},
        json=job_payload,
        timeout=30
    )
    
    if job_response.status_code != 200:
        raise Exception(f"Failed to start job: {job_response.text}")
    
    job_data = job_response.json()
    job_id = job_data.get("id")
    
    if not job_id:
        raise Exception("No job ID received")
    
    print(f"[BRIA] Job started successfully, ID: {job_id}")
    
    # Store job info for tracking
    video_jobs[job_id] = {
        "status": "processing",
        "filename": file.filename,
        "start_time": time.time(),
        "progress": 0
    }
    
    # Poll for job completion
    max_attempts = PROCESSING_TIMEOUT // 5  # Check every 5 seconds
    attempts = 0
    
    while attempts < max_attempts:
        status_url = f"{BRIA_API_URL}/jobs/{job_id}"
        status_response = requests.get(
            status_url,
            headers={"Authorization": f"Bearer {BRIA_API_KEY}"},
            timeout=10
        )
        
        if status_response.status_code != 200:
            raise Exception(f"Failed to check job status: {status_response.text}")
        
        status_data = status_response.json()
        status = status_data.get("status")
        
        # Update job progress
        if job_id in video_jobs:
            video_jobs[job_id]["status"] = status
            video_jobs[job_id]["progress"] = min(attempts / max_attempts * 100, 95)
        
        if status == "completed":
            # Download the processed video
            result_url = status_data.get("result", {}).get("url")
            if not result_url:
                raise Exception("No result URL in completed job")
            
            print(f"[BRIA] Job completed, downloading result from: {result_url}")
            
            # Download the processed video
            download_response = requests.get(result_url, timeout=60)
            if download_response.status_code != 200:
                raise Exception("Failed to download processed video")
            
            # Update job status
            if job_id in video_jobs:
                video_jobs[job_id]["status"] = "completed"
                video_jobs[job_id]["progress"] = 100
            
            return StreamingResponse(
                io.BytesIO(download_response.content),
                media_type="video/mp4",
                headers={"Content-Disposition": f"attachment; filename=processed_{file.filename}"}
            )
        
        elif status == "failed":
            error_msg = status_data.get("error", "Unknown error")
            if job_id in video_jobs:
                video_jobs[job_id]["status"] = "failed"
            raise Exception(f"Job failed: {error_msg}")
        
        # Wait before next check
        await asyncio.sleep(5)
        attempts += 1
        print(f"[BRIA] Job status: {status}, attempt {attempts}/{max_attempts}")
    
    # Clean up job tracking
    if job_id in video_jobs:
        video_jobs[job_id]["status"] = "timeout"
    
    raise Exception("Job timed out")

async def process_video_locally(file: UploadFile, contents: bytes):
    """Process video locally using frame-by-frame rembg"""
    try:
        print(f"[LOCAL] Starting local video processing for: {file.filename}")
        
        # Save video to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_file:
            temp_file.write(contents)
            temp_path = temp_file.name
        
        # Process video frames
        output_path = await process_video_frames_locally(temp_path)
        
        # Read processed video
        with open(output_path, 'rb') as f:
            processed_content = f.read()
        
        # Clean up temporary files
        os.unlink(temp_path)
        os.unlink(output_path)
        
        print(f"[LOCAL] Video processing completed successfully")
        
        return StreamingResponse(
            io.BytesIO(processed_content),
            media_type="video/mp4",
            headers={"Content-Disposition": f"attachment; filename=processed_{file.filename}"}
        )
        
    except Exception as e:
        print(f"[LOCAL] Error in local video processing: {str(e)}")
        raise

@app.post("/removebg")
async def remove_bg(
    file: UploadFile = File(...),
    model: str = Form("isnet-general-use"),
    return_mask: bool = Form(False),
    alpha_matting: bool = Form(False),
    alpha_matting_foreground_threshold: int = Form(240),
    alpha_matting_background_threshold: int = Form(10),
    alpha_matting_erode_size: int = Form(10)
):
    try:
        print(f"[RMBG] Received request: {file.filename}")
        
        # Check if it's a video file
        if file.content_type and file.content_type.startswith('video/'):
            return await process_video_bg_removal(file)
        
        # Read image
        contents = await file.read()
        input_image = Image.open(io.BytesIO(contents))

        # Set U2NET_HOME if needed
        if "U2NET_HOME" not in os.environ:
            os.environ["U2NET_HOME"] = os.path.expanduser("~/.u2net")

        # Remove background
        output_image = rembg.remove(
            input_image,
            session=rembg.new_session(model),
            only_mask=return_mask,
            alpha_matting=alpha_matting,
            alpha_matting_foreground_threshold=alpha_matting_foreground_threshold,
            alpha_matting_background_threshold=alpha_matting_background_threshold,
            alpha_matting_erode_size=alpha_matting_erode_size,
        )
        print(f"[RMBG] Background removal completed for: {file.filename}")
        # Convert to bytes
        img_byte_arr = io.BytesIO()
        output_image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        return StreamingResponse(img_byte_arr, media_type="image/png")
    except Exception as e:
        print(f"[RMBG] Error processing {file.filename}: {str(e)}")
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/remove-video-bg")
async def remove_video_bg(file: UploadFile = File(...)):
    """Dedicated endpoint for video background removal"""
    return await process_video_bg_removal(file)

@app.get("/video-status/{job_id}")
async def get_video_status(job_id: str):
    """Get status of video processing job"""
    if job_id in video_jobs:
        return video_jobs[job_id]
    return JSONResponse(status_code=404, content={"error": "Job not found"})

@app.get("/health")
def health():
    return {
        "status": "healthy", 
        "service": "BackdropAI Backend",
        "version": "1.0.0",
        "active_jobs": len([j for j in video_jobs.values() if j["status"] == "processing"])
    }

@app.get("/")
def root():
    return {
        "message": "BackdropAI Backend",
        "endpoints": {
            "removebg": "POST /removebg - Remove background from image/video",
            "remove-video-bg": "POST /remove-video-bg - Video background removal",
            "video-status": "GET /video-status/{job_id} - Check video processing status",
            "health": "GET /health - Health check"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True) 