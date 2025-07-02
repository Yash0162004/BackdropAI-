// Configuration for different environments
const isDevelopment = import.meta.env.DEV;

export const BACKEND_URL = isDevelopment 
  ? 'http://localhost:8000'
  : (import.meta.env.VITE_API_URL || 'https://bgremover.vishalhq.in');

// Debug logging
console.log('Environment:', isDevelopment ? 'development' : 'production');
console.log('Backend URL:', BACKEND_URL); 
