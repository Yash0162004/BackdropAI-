# video_bg_remover.py
# Flask server for background removal using Unscreen API for videos and rembg for images

from flask import Flask, request, send_file, jsonify
import io
import os
import tempfile
import requests
import time
import traceback
from PIL import Image
from rembg import remove, new_session
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Global session for better performance
session = new_session("u2net")

# Unscreen API configuration
UNSCREEN_API_KEY = "G5NHkdN4A98gRnJPDDBMFtdQ"  # Get free API key from https://www.unscreen.com/api
UNSCREEN_API_URL = "https://api.unscreen.com/v1.0/remove"

def remove_bg_from_image(image):
    """Remove background from image with high accuracy"""
    return remove(image, session=session, post_process_mask=True)

def remove_video_bg_with_unscreen(video_path):
    """Remove background from video using Unscreen API"""
    try:
        print(f"🎬 Starting video processing with Unscreen for: {video_path}")
        
        # Prepare the video file for upload
        with open(video_path, "rb") as f:
            video_data = f.read()
        
        print(f"📁 Video file size: {len(video_data)} bytes")
        
        # Upload to Unscreen API
        files = {
            'video': ('video.mp4', video_data, 'video/mp4')
        }
        
        headers = {
            'X-API-KEY': UNSCREEN_API_KEY
        }
        
        print("🌐 Sending request to Unscreen API...")
        
        # Start processing
        response = requests.post(UNSCREEN_API_URL, files=files, headers=headers)
        print(f"📡 API Response Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ API Error: {response.text}")
            raise Exception(f"Unscreen API returned status {response.status_code}: {response.text}")
        
        # Get the processed video URL
        result = response.json()
        if 'url' not in result:
            raise Exception("No video URL in response")
        
        output_url = result['url']
        print(f"📥 Downloading processed video from: {output_url}")
        
        # Download the processed video
        video_response = requests.get(output_url)
        if video_response.status_code != 200:
            raise Exception(f"Failed to download video: {video_response.text}")
        
        # Save to temporary file
        output_path = tempfile.mktemp(suffix=".mp4")
        with open(output_path, "wb") as f:
            f.write(video_response.content)
        
        print(f"💾 Video saved to: {output_path}")
        return output_path
            
    except Exception as e:
        print(f"💥 Error in video processing: {str(e)}")
        print(f"🔍 Full traceback: {traceback.format_exc()}")
        raise Exception(f"Unscreen API error: {str(e)}")

@app.route('/removebg', methods=['POST'])
def remove_bg_endpoint():
    try:
        print("🔄 Received background removal request")
        
        if 'file' not in request.files:
            print("❌ No file uploaded")
            return 'No file uploaded', 400
        
        file = request.files['file']
        file_type = request.form.get('type', 'image')
        
        print(f"📄 File type: {file_type}")
        print(f"📄 File name: {file.filename}")
        print(f"📄 File size: {len(file.read())} bytes")
        file.seek(0)  # Reset file pointer
        
        if file_type == 'image':
            print("🖼️ Processing image...")
            # Process image locally
            img = Image.open(file.stream)
            output_img = remove_bg_from_image(img)
            output = io.BytesIO()
            output_img.save(output, format='PNG')
            output.seek(0)
            print("✅ Image processing completed")
            return send_file(output, mimetype='image/png')
        
        elif file_type == 'video':
            print("🎬 Processing video with Unscreen...")
            # Process video using Unscreen API
            try:
                # Save uploaded video to temporary file
                temp_input = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
                file.save(temp_input.name)
                temp_input.close()
                
                print(f"💾 Video saved to temp file: {temp_input.name}")
                
                # Process video using Unscreen API
                output_path = remove_video_bg_with_unscreen(temp_input.name)
                
                # Clean up input file
                os.unlink(temp_input.name)
                print("🧹 Cleaned up input file")
                
                # Return processed video
                print("📤 Returning processed video")
                return send_file(output_path, mimetype='video/mp4', as_attachment=True)
                
            except Exception as e:
                print(f"💥 Video processing error: {str(e)}")
                return jsonify({'error': str(e)}), 500
            finally:
                # Clean up output file
                if 'output_path' in locals():
                    try:
                        os.unlink(output_path)
                        print("🧹 Cleaned up output file")
                    except:
                        pass
        
        print("❌ Invalid file type")
        return 'Invalid file type', 400
        
    except Exception as e:
        print(f"💥 General error in endpoint: {str(e)}")
        print(f"🔍 Full traceback: {traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy', 
        'service': 'background-removal',
        'unscreen_api_configured': bool(UNSCREEN_API_KEY and UNSCREEN_API_KEY != "your_unscreen_api_key_here")
    })

if __name__ == '__main__':
    print("🚀 Starting Video Background Removal Server...")
    print(f"✅ Unscreen API Key: {'Configured' if UNSCREEN_API_KEY and UNSCREEN_API_KEY != 'your_unscreen_api_key_here' else 'Not configured'}")
    print("🌐 Server will start on http://localhost:5002")
    print("📝 To get free Unscreen API key, visit: https://www.unscreen.com/api")
    app.run(port=5002, debug=True) 