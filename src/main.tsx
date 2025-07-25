import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { configureEcho } from "@laravel/echo-react";
import './index.css'
import App from './App.tsx'

configureEcho({
  broadcaster: "reverb",
  key: "hkrw5yhybhgasis7vrev",
  wsHost: "localhost",
  wsPort: 8080,
  // wssPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: false,
  enabledTransports: ['ws', 'wss'],
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
