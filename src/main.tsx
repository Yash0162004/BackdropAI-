import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react';

const clerkPubKey = 'pk_test_b3B0aW11bS1yZXB0aWxlLTQzLmNsZXJrLmFjY291bnRzLmRldiQ';

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <App />
  </ClerkProvider>
);
