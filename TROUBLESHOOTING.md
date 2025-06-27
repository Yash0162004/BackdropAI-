# BackdropAI Troubleshooting Guide

## 🚨 Frontend Not Working - Quick Fixes

### Issue 1: Backend Not Running
**Symptoms**: "Failed to fetch" errors, connection refused

**Solution**:
```bash
# Start the backend server
python remove_bg_server.py
```

**Expected Output**:
```
🚀 Starting Video Background Removal Server...
 * Running on http://0.0.0.0:5002
```

### Issue 2: Frontend Not Starting
**Symptoms**: "npm run dev" fails

**Solution**:
```bash
# Install dependencies
npm install

# Start frontend
npm run dev
```

**Expected Output**:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Issue 3: CORS Errors
**Symptoms**: "Access to fetch at 'http://localhost:5002' from origin 'http://localhost:5173' has been blocked by CORS policy"

**Solution**: Backend already has CORS configured. If issues persist:
1. Check if backend is running on port 5002
2. Restart both frontend and backend
3. Clear browser cache

### Issue 4: File Upload Not Working
**Symptoms**: Files don't upload, no processing happens

**Solutions**:
1. **Check Console**: Open browser DevTools (F12) and check Console tab for errors
2. **Check Network**: In DevTools Network tab, see if requests are being made
3. **File Size**: Try smaller files first (< 10MB)
4. **File Format**: Ensure files are PNG, JPG, MP4, MOV, or AVI

### Issue 5: Processing Fails
**Symptoms**: "Background removal failed" error

**Solutions**:
1. **Check Backend Logs**: Look at terminal where backend is running
2. **API Key**: Verify Unscreen API key is valid
3. **Dependencies**: Ensure all Python packages are installed

## 🔧 Testing Commands

### Test Backend
```bash
python test_backend.py
```

### Test Frontend
1. Open browser to http://localhost:5173
2. Open DevTools (F12)
3. Check Console for any errors
4. Try uploading a small image file

### Test API Endpoints
```bash
# Health check
curl http://localhost:5002/health

# Methods check
curl http://localhost:5002/methods
```

## 🐛 Common Error Messages

### "Module not found"
```bash
pip install -r requirements.txt
```

### "Port already in use"
```bash
# Find process using port 5002
netstat -ano | findstr :5002

# Kill the process
taskkill /PID <process_id> /F
```

### "Permission denied"
Run terminal as Administrator

### "Node modules not found"
```bash
rm -rf node_modules
npm install
```

## 📋 Debug Checklist

- [ ] Backend server running on port 5002
- [ ] Frontend server running on port 5173
- [ ] No CORS errors in browser console
- [ ] API keys configured correctly
- [ ] All dependencies installed
- [ ] File formats supported
- [ ] File size within limits

## 🆘 Still Not Working?

1. **Check Logs**: Look at both frontend and backend terminal outputs
2. **Browser Console**: Check for JavaScript errors
3. **Network Tab**: Verify API requests are being made
4. **Try Different File**: Test with a simple PNG image
5. **Restart Everything**: Close all terminals and restart

## 📞 Get Help

If issues persist:
1. Check the console logs
2. Note the exact error message
3. Try the troubleshooting steps above
4. Check if all dependencies are installed correctly 