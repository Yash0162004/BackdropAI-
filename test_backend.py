#!/usr/bin/env python3
"""
Test script to verify backend functionality
"""

import requests
import json

def test_backend_health():
    """Test the health endpoint"""
    try:
        response = requests.get('http://localhost:5002/health')
        print(f"Health check status: {response.status_code}")
        print(f"Health check response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_backend_methods():
    """Test the methods endpoint"""
    try:
        response = requests.get('http://localhost:5002/methods')
        print(f"Methods check status: {response.status_code}")
        print(f"Methods check response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Methods check failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing Backfree Backend...")
    print("=" * 40)
    
    health_ok = test_backend_health()
    methods_ok = test_backend_methods()
    
    if health_ok and methods_ok:
        print("\n✅ Backend is working correctly!")
    else:
        print("\n❌ Backend has issues!")
        print("\nTo fix:")
        print("1. Make sure backend is running: python remove_bg_server.py")
        print("2. Check if port 5002 is available")
        print("3. Verify all dependencies are installed: pip install -r requirements.txt") 