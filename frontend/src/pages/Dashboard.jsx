import { useAuth } from '../context/AuthContext'
import AdminDashboard from './AdminDashboard'
import AgentDashboard from './AgentDashboard'

export default function Dashboard() {
  const { user } = useAuth()
  return user?.role === 'admin' ? <AdminDashboard /> : <AgentDashboard />
}
