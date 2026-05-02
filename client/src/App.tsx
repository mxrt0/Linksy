import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RegisterPage } from './pages/auth/RegisterPage'
import { LoginPage } from './pages/auth/LoginPage'
import './index.css'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { AppLayout } from './layout/AppLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CreateLinkPage } from './pages/links/CreateLinkPage'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/links/new" element={<CreateLinkPage />} />
      </Route>
      
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
    </BrowserRouter>
  )
}

export default App
