import { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider, useAuth } from './AuthContext'
import { api } from './api'
import MaintenancePage from './components/MaintenancePage'
import SiteSidebar from './components/SiteSidebar'
import AnnouncementBanner from './components/AnnouncementBanner'
import Home from './pages/Home'

// Home stays eager — it's the highest-traffic entry point, and keeping it in
// the main bundle avoids a second network round-trip for the most common
// visit. Everything else is only fetched when someone actually navigates
// there, so a first-time visitor to "/" never downloads Settings.jsx's full
// tab system, the analytics chart, or the legal pages' content.
const Guilds = lazy(() => import('./pages/Guilds'))
const Settings = lazy(() => import('./pages/Settings'))
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Premium = lazy(() => import('./pages/Premium'))
const Status = lazy(() => import('./pages/Status'))
const Admin = lazy(() => import('./pages/Admin'))
const Verify = lazy(() => import('./pages/Verify'))
const Staff = lazy(() => import('./pages/Staff'))
const Docs = lazy(() => import('./pages/Docs'))

function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-[var(--mist-dim)]">Loading...</p>
    </div>
  )
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoading />
  if (!user) return <Navigate to="/" replace />
  return children
}

function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoading />
  if (!user?.is_admin) return <Navigate to="/" replace />
  return children
}

function RequireStaff({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoading />
  if (!user?.is_staff) return <Navigate to="/" replace />
  return children
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname} className="page-transition">
      <Suspense fallback={<PageLoading />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/status" element={<Status />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            }
          />
          <Route
            path="/staff"
            element={
              <RequireStaff>
                <Staff />
              </RequireStaff>
            }
          />
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
      </Suspense>
    </div>
  )
}

// Checked once, before anything else renders — a visitor (logged in or not)
// should never see the real site while maintenance is on, and an admin
// should never be locked out of turning it back off. is_admin comes from
// AuthContext (already fetching /api/me anyway), so this only adds one
// extra lightweight public request for the maintenance flag itself.
function MaintenanceGate({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [maintenance, setMaintenance] = useState(null)

  useEffect(() => {
    api.maintenanceStatus().then(setMaintenance).catch(() => setMaintenance({ enabled: false, message: '' }))
  }, [])

  if (authLoading || maintenance === null) {
    return <PageLoading />
  }

  if (maintenance.enabled && !user?.is_admin) {
    return <MaintenancePage message={maintenance.message} onResolved={() => setMaintenance({ enabled: false })} />
  }

  return children
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <MaintenanceGate>
            <SiteSidebar>
              <AnnouncementBanner />
              <AnimatedRoutes />
            </SiteSidebar>
          </MaintenanceGate>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  )
}
