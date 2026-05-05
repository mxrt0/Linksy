import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/auth/AuthProvider.tsx'
import { ThemeProvider } from './context/theme/ThemeProvider.tsx'
import { ToastProvider } from './context/toast/ToastProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider> 
      </ToastProvider>   
    </ThemeProvider>
  </StrictMode>
)
