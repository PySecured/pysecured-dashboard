import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider, useAuth } from './AuthContext'
import ParticleField from './components/ParticleField'
import Home from './pages/Home'
import Guilds from './pages/Guilds'
import Settings from './pages/Settings'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Premium from './pages/Premium'
import Status from './pages/Status'

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-[var(--mist-dim)]">Loading...</p>
      </div>
    )
  }
  if (!user) return <Navigate to="/" replace />
  return children
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/status" element={<Status />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route
          path="/servers"
          element={
            <RequireAuth>
              <Guilds />
            </RequireAuth>
          }
        />
        <Route
          path="/servers/:guildId"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <ParticleField />
          <div className="relative" style={{ zIndex: 1 }}>
            <AnimatedRoutes />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  )
}
