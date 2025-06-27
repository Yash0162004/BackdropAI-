# remove_bg_server.py
# Flask server for background removal using advanced AI models for both images and videos

from flask import Flask, request, send_file, jsonify
import io
import os
import tempfile
import numpy as np
from PIL import Image
from rembg import remove, new_session
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Global session for better performance
session = new_session("u2net")

# Unscreen API configuration
UNSCREEN_API_KEY = os.getenv("UNSCREEN_API_KEY")  # Use environment variable
UNSCREEN_API_URL = "https://api.unscreen.com/v1.0/remove"

def remove_bg_from_image(image):
    """Remove background from image with high accuracy"""
    return remove(image, session=session, post_process_mask=True)

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
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        file_type = request.form.get('type', 'image')
        # method = request.form.get('method', 'local')  # No longer used
        
        print(f"[API] Processing {file_type} (video always uses Unscreen API)")
        
        if file_type == 'image':
            # Process image
            try:
                file.seek(0)
                img = Image.open(file.stream)
                output_img = remove_bg_from_image(img)
                output = io.BytesIO()
                output_img.save(output, format='PNG')
                output.seek(0)
                return send_file(output, mimetype='image/png')
            except Exception as e:
                print(f"[API] Image processing error: {e}")
                return jsonify({'error': f'Image processing failed: {str(e)}'}), 500
        
        elif file_type == 'video':
            # Process video - always try Unscreen API first, fallback to local if it fails
            try:
                # Save uploaded video to temp file
                temp_video = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
                file.save(temp_video.name)
                temp_video.close()
                
                print(f"[API] Processing video (video always uses Unscreen API)")
                print(f"[API] Saved video to: {temp_video.name}")
                
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
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'background-removal'})

@app.route('/methods', methods=['GET'])
def get_methods():
    return jsonify({
        'image': {
            'method': 'local',
            'description': 'Uses rembg library with U2Net model'
        },
        'video': {
            'methods': {
                'local': {
                    'description': 'Frame-by-frame processing using local AI',
                    'advantages': 'No API limits, works offline'
                },
                'api': {
                    'description': 'Uses Unscreen API for fast processing',
                    'advantages': 'Faster, higher quality, no local processing'
                }
            }
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=False)