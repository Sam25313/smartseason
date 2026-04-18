import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFields } from '../context/FieldsContext'
import FieldCard from '../components/FieldCard'
import styles from './Dashboard.module.css'

export default function AgentDashboard() {
  const { user } = useAuth()
  const { fields, updates } = useFields()
  const navigate = useNavigate()

  const myFields = useMemo(() => fields.filter(f => f.assigned_agent_id === user?.id), [fields, user])
  const myUpdates = useMemo(() =>
    [...updates]
      .filter(u => u.agent_id === user?.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 4)
  , [updates, user])

  const stats = {
    total:     myFields.length,
    active:    myFields.filter(f => f.status === 'active').length,
    atRisk:    myFields.filter(f => f.status === 'at-risk').length,
    completed: myFields.filter(f => f.status === 'completed').length,
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome back, {user?.name?.split(' ')[0]} 🌿</h1>
          <p className={styles.subtitle}>You have {stats.total} fields assigned.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard} style={{ '--accent': 'var(--leaf)' }}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>My Fields</div>
        </div>
        <div className={styles.statCard} style={{ '--accent': 'var(--status-active)' }}>
          <div className={styles.statValue}>{stats.active}</div>
          <div className={styles.statLabel}>Active</div>
        </div>
        <div className={styles.statCard} style={{ '--accent': 'var(--status-risk)' }}>
          <div className={styles.statValue}>{stats.atRisk}</div>
          <div className={styles.statLabel}>At Risk</div>
        </div>
        <div className={styles.statCard} style={{ '--accent': 'var(--status-done)' }}>
          <div className={styles.statValue}>{stats.completed}</div>
          <div className={styles.statLabel}>Harvested</div>
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.cardWide}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>My Fields</h2>
            <button className={styles.seeAll} onClick={() => navigate('/fields')}>View all →</button>
          </div>
          <div className={styles.fieldGrid}>
            {myFields.length === 0
              ? <p className={styles.empty}>No fields assigned yet.</p>
              : myFields.map(f => <FieldCard key={f.id} field={f} />)
            }
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>My Recent Updates</h2>
          </div>
          <div className={styles.updateList}>
            {myUpdates.length === 0
              ? <p className={styles.empty}>No updates yet.</p>
              : myUpdates.map(u => {
                  const field = fields.find(f => f.id === u.field_id)
                  return (
                    <div key={u.id} className={styles.updateRow} onClick={() => navigate(`/fields/${u.field_id}`)}>
                      <div className={styles.updateDot} />
                      <div className={styles.updateContent}>
                        <div className={styles.updateField}>{field?.name}</div>
                        <div className={styles.updateNote}>{u.notes}</div>
                        <div className={styles.updateMeta}>
                          {u.stage} · {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </div>
                  )
                })
            }
          </div>
        </div>
      </div>
    </div>
  )
}
