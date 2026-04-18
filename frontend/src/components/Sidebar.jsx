import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Sidebar.module.css'

const ADMIN_NAV = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/fields',    icon: '⬡', label: 'All Fields' },
  { to: '/agents',    icon: '◎', label: 'Agents' },
]

const AGENT_NAV = [
  { to: '/dashboard', icon: '⊞', label: 'My Dashboard' },
  { to: '/fields',    icon: '⬡', label: 'My Fields' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const nav = user?.role === 'admin' ? ADMIN_NAV : AGENT_NAV

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🌱</div>
        <div>
          <div className={styles.logoText}>SmartSeason</div>
          <div className={styles.logoRole}>{user?.role === 'admin' ? 'Coordinator' : 'Field Agent'}</div>
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>Navigation</div>
        {nav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.bottom}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>{user?.name?.[0]}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name}</div>
            <div className={styles.userEmail}>{user?.email}</div>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          ↩ Sign out
        </button>
      </div>
    </aside>
  )
}
