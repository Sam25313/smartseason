import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { FieldsProvider } from './context/FieldsContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Fields from './pages/Fields'
import FieldDetail from './pages/FieldDetail'
import NewField from './pages/NewField'
import Agents from './pages/Agents'

function RequireAuth({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" replace />
}

function RequireAdmin({ children }) {
  const { user } = useAuth()
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fields" element={<Fields />} />
        <Route path="/fields/new" element={<RequireAdmin><NewField /></RequireAdmin>} />
        <Route path="/fields/:id" element={<FieldDetail />} />
        <Route path="/agents" element={<RequireAdmin><Agents /></RequireAdmin>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <FieldsProvider>
        <AppRoutes />
      </FieldsProvider>
    </AuthProvider>
  )
}
