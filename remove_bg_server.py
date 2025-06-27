# remove_bg_server.py
# Lightweight Flask server for background removal using OpenCV

from flask import Flask, request, send_file, jsonify
import io
import os
import tempfile
import numpy as np
from PIL import Image
from flask_cors import CORS
import requests
import gc
import psutil
import cv2

app = Flask(__name__)
CORS(app)

# Unscreen API configuration
UNSCREEN_API_KEY = os.getenv("UNSCREEN_API_KEY")  # Use environment variable
UNSCREEN_API_URL = "https://api.unscreen.com/v1.0/remove"

def remove_bg_with_opencv(image):
    """Remove background using OpenCV - lighter alternative to rembg"""
    try:
        # Convert PIL image to OpenCV format
        img_array = np.array(image)
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        
        # Convert to RGBA if not already
        if img_cv.shape[2] == 3:
            img_cv = cv2.cvtColor(img_cv, cv2.COLOR_BGR2BGRA)
        
        # Create a mask using color-based segmentation
        # Convert to HSV for better color segmentation
        hsv = cv2.cvtColor(img_cv[:,:,:3], cv2.COLOR_BGR2HSV)
        
        # Create a mask for common background colors (white, light colors)
        # This is a simple approach - for better results, use rembg
        lower_light = np.array([0, 0, 200])  # Light colors
        upper_light = np.array([180, 30, 255])
        
        mask = cv2.inRange(hsv, lower_light, upper_light)
        mask = cv2.bitwise_not(mask)  # Invert to get foreground
        
        # Apply morphological operations to clean up the mask
        kernel = np.ones((5,5), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        
        # Apply mask to image
        img_cv[:, :, 3] = mask
        
        # Convert back to PIL
        img_rgba = cv2.cvtColor(img_cv, cv2.COLOR_BGRA2RGBA)
        result = Image.fromarray(img_rgba)
        
        # Force garbage collection
        gc.collect()
        
        return result
        
    except Exception as e:
        print(f"Error in remove_bg_with_opencv: {e}")
        raise e

def log_memory_usage():
    """Log current memory usage"""
    process = psutil.Process(os.getpid())
    memory_info = process.memory_info()
    print(f"Memory usage: {memory_info.rss / 1024 / 1024:.2f} MB")

def remove_video_bg_with_unscreen(video_path):
    """Remove background from video using Unscreen API"""
    try:
        print(f"[Unscreen] Processing video: {video_path}")
        
        # Check if file exists and is readable
        if not os.path.exists(video_path):
            raise Exception(f"Video file not found: {video_path}")
        
        # Get file size
        file_size = os.path.getsize(video_path)
        print(f"[Unscreen] File size: {file_size} bytes")
        
        with open(video_path, "rb") as f:
            video_data = f.read()
        
        # Check if video data is not empty
        if len(video_data) == 0:
            raise Exception("Video file is empty")
        
        files = {'video': ('video.mp4', video_data, 'video/mp4')}
        headers = {'X-API-KEY': UNSCREEN_API_KEY}
        
        print(f"[Unscreen] Sending request to: {UNSCREEN_API_URL}")
        print(f"[Unscreen] Headers: {headers}")
        
        response = requests.post(UNSCREEN_API_URL, files=files, headers=headers, timeout=60)
        
        print(f"[Unscreen] Response status: {response.status_code}")
        print(f"[Unscreen] Response headers: {dict(response.headers)}")
        
        if response.status_code == 404:
            raise Exception("Unscreen API endpoint not found. Please check the API URL.")
        elif response.status_code == 401:
            raise Exception("Unauthorized. Please check your Unscreen API key.")
        elif response.status_code == 413:
            raise Exception("File too large. Unscreen has file size limits.")
        elif response.status_code != 200:
            raise Exception(f"Unscreen API error: {response.status_code} - {response.text}")
        
        result = response.json()
        print(f"[Unscreen] API response: {result}")
        
        if 'url' not in result:
            raise Exception(f"Unexpected API response format: {result}")
        
        # Download the processed video
        processed_url = result['url']
        print(f"[Unscreen] Downloading processed video from: {processed_url}")
        
        video_response = requests.get(processed_url, timeout=60)
        if video_response.status_code != 200:
            raise Exception(f"Failed to download processed video: {video_response.status_code}")
        
        # Save to temporary file
        output_path = video_path.replace('.mp4', '_processed.mp4')
        with open(output_path, 'wb') as f:
            f.write(video_response.content)
        
        print(f"[Unscreen] Video processed successfully: {output_path}")
        return output_path
        
    except Exception as e:
        print(f"[Unscreen] Error: {str(e)}")
        raise e

@app.route('/removebg', methods=['POST'])
def remove_bg_endpoint():
    try:
        log_memory_usage()
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        file_type = request.form.get('type', 'image')
        
        print(f"[API] Processing {file_type}")
        log_memory_usage()
        
        if file_type == 'image':
            # Process image with OpenCV (lighter alternative)
            try:
                file.seek(0)
                img = Image.open(file.stream)
                print(f"[API] Image size: {img.size}")
                
                output_img = remove_bg_with_opencv(img)
                output = io.BytesIO()
                output_img.save(output, format='PNG')
                output.seek(0)
                
                log_memory_usage()
                return send_file(output, mimetype='image/png')
            except Exception as e:
                print(f"[API] Image processing error: {e}")
                log_memory_usage()
                return jsonify({'error': f'Image processing failed: {str(e)}'}), 500
        
        elif file_type == 'video':
            # Process video - always try Unscreen API first, fallback to local if it fails
            try:
                # Save uploaded video to temp file
                temp_video = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
                file.save(temp_video.name)
                temp_video.close()
                
                print(f"[API] Processing video")
                print(f"[API] Saved video to: {temp_video.name}")
                log_memory_usage()
                
                try:
                    # Try Unscreen API first
                    print(f"[API] Using Unscreen API for video processing")
                    output_path = remove_video_bg_with_unscreen(temp_video.name)
                    
                    # Send the processed video
                    return send_file(output_path, as_attachment=True, download_name='processed_video.mp4')
                    
                except Exception as api_error:
                    print(f"[API] Unscreen API failed: {api_error}")
                    print(f"[API] Video processing error: {api_error}")
                    
                    # Return error response with details
                    return jsonify({
                        'error': 'Video background removal failed',
                        'details': str(api_error),
                        'suggestion': 'Please check your Unscreen API key or try a different video format'
                    }), 500
                    
            except Exception as e:
                print(f"[API] Video processing error: {e}")
                return jsonify({'error': f'Video processing failed: {str(e)}'}), 500
        else:
            return jsonify({'error': f'Invalid file type: {file_type}'}), 400
    except Exception as e:
        print(f"[API] Unexpected error: {e}")
        log_memory_usage()
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'background-removal-opencv'})

@app.route('/methods', methods=['GET'])
def get_methods():
    return jsonify({
        'image': {
            'method': 'opencv',
            'description': 'Uses OpenCV for basic background removal (lighter alternative)'
        },
        'video': {
            'methods': {
                'api': {
                    'description': 'Uses Unscreen API for fast processing',
                    'advantages': 'Faster, higher quality, no local processing'
                }
            }
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    
    # Log initial memory usage
    print(f"Starting BackdropAI server (OpenCV version) on port {port}")
    log_memory_usage()
    
    # Set environment variables for memory optimization
    os.environ['OMP_NUM_THREADS'] = '1'  # Limit OpenMP threads
    os.environ['MKL_NUM_THREADS'] = '1'  # Limit MKL threads
    
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)