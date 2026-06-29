import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PrototypeFrame from './components/PrototypeFrame.jsx'
import { ToastProvider } from './components/Toast.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <PrototypeFrame />
    </ToastProvider>
  </StrictMode>,
)
