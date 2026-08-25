import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <p className="p-8 text-2xl font-semibold">서비스 대시보드</p>
  </StrictMode>,
)
