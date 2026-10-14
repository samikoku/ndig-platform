import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { TRPCProvider } from './lib/trpc.ts'
import './index.css'

// Analytics loads only when a real endpoint is configured. The placeholder
// endpoint previously shipped in production caused a failed external fetch on every page.
const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined
const analyticsId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID as string | undefined
if (analyticsEndpoint && analyticsId && !/example\.com/.test(analyticsEndpoint) && !/placeholder|^default$/.test(analyticsId)) {
  const s = document.createElement('script')
  s.defer = true
  s.src = `${analyticsEndpoint}/umami`
  s.dataset.websiteId = analyticsId
  document.head.appendChild(s)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TRPCProvider>
      <App />
    </TRPCProvider>
  </React.StrictMode>,
)
