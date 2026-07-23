import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RegisterPage } from './pages/auth/RegisterPage'
import { LoginPage } from './pages/auth/LoginPage'
import './index.css'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { AppLayout } from './layout/AppLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CreateLinkPage } from './pages/links/CreateLinkPage'
import { AnalyticsPage } from './pages/links/AnalyticsPage'
import { LinkPasswordPage } from './pages/links/LinkPasswordPage'
import { LinkExpiredPage } from './pages/links/LinkExpiredPage'
import { LinkNotFoundPage } from './pages/links/LinkNotFoundPage'
import { HomePage } from './pages/HomePage'
import { AccountSettingsPage } from './pages/account/AccountSettingsPage'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={< HomePage />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/r/:code/auth" element={<LinkPasswordPage />} />
      
        <Route path="/not-found" element={<LinkNotFoundPage />} />
        <Route path="/expired" element={<LinkExpiredPage />} />
      </Route>   

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >   
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analytics/" element={<AnalyticsPage />} />
        <Route path="/analytics/:code" element={<AnalyticsPage />} />
        <Route path="/links/new" element={<CreateLinkPage />} />
        <Route path="/settings" element={<AccountSettingsPage />} />
      </Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App
