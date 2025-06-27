// Configuration for different environments
const isDevelopment = import.meta.env.DEV;

export const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5002'
  : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5002');

// Debug logging
console.log('Environment:', isDevelopment ? 'development' : 'production');
console.log('Backend URL:', BACKEND_URL); 