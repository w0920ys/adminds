import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="bg-background text-foreground min-h-screen p-8">
      <div className="bg-surface-raised rounded-lg border p-4 shadow-card">
        <p className="text-success">success</p>
        <p className="text-warning">warning</p>
        <p className="text-info">info</p>
        <p className="text-destructive">destructive</p>
        <button className="bg-primary text-primary-foreground h-control rounded-md px-4">
          control 높이
        </button>
      </div>
    </div>
  </StrictMode>,
)
