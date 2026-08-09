import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import Home from './pages/Home'
import Guilds from './pages/Guilds'
import Settings from './pages/Settings'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Premium from './pages/Premium'

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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/premium" element={<Premium />} />
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
      </BrowserRouter>
    </AuthProvider>
  )
}
