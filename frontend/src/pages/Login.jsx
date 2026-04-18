import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Login.module.css'

export default function Login() {
  const { login, error, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)
    if (ok) {
      setEmail('')
      setPassword('')
      navigate('/dashboard')
    }
  }

  if (authLoading) {
    return (
      <div className={styles.root}>
        <div className={styles.loginCard}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.art}>
        <div className={styles.fieldArt}>
          {Array.from({ length: 14 }, (_, i) => (
            <div key={i} className={styles.fieldRow} style={{ animationDelay: `${i * 0.06}s` }} />
          ))}
        </div>
        <div className={styles.artContent}>
          <h1 className={styles.tagline}>
            Watch your<br /><em>fields grow</em><br />smarter.
          </h1>
          <p className={styles.taglineSub}>
            Real-time crop monitoring across every plot, for every agent, in every region.
          </p>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.logoRow}>
          <div className={styles.logoIcon}>🌱</div>
          <span className={styles.logoText}>SmartSeason</span>
        </div>
        <div className={styles.loginTitle}>Sign in to your account</div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email address</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>
      </div>
    </div>
  )
}
