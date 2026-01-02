import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationContextProvider } from './notificationContext'
import { StrictMode } from 'react'

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationContextProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </NotificationContextProvider>
  </StrictMode>
)