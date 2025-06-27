# simple_server.py
# Basic Flask server for testing deployment

from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'backdropai-backend'})

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'BackdropAI Backend is running!'})

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Test endpoint working!'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False) 