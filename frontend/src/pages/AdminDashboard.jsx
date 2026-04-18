import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFields } from '../context/FieldsContext'
import StatusBadge from '../components/StatusBadge'
import styles from './Dashboard.module.css'

function StatCard({ label, value, sub, color }) {
  return (
    <div className={styles.statCard} style={{ '--accent': color }}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const { fields, updates, agents, loading } = useFields()
  const navigate = useNavigate()

  const stats = useMemo(() => ({
    total:     fields.length,
    active:    fields.filter(f => f.status === 'active').length,
    atRisk:    fields.filter(f => f.status === 'at-risk').length,
    completed: fields.filter(f => f.status === 'completed').length,
    totalHa:   fields.reduce((s, f) => s + (Number(f.area_ha) || 0), 0).toFixed(1),
  }), [fields])

  const recentUpdates = useMemo(() =>
    [...updates]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
  , [updates])

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Loading dashboard...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Good morning, {user?.name?.split(' ')[0]} 👋</h1>
          <p className={styles.subtitle}>Here's what's happening across your fields today.</p>
        </div>
        <button className={styles.addBtn} onClick={() => navigate('/fields/new')}>
          + Add Field
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard label="Total Fields" value={stats.total}     sub={`${stats.totalHa} ha total`} color="var(--leaf)" />
        <StatCard label="Active"       value={stats.active}    sub="On track"       color="var(--status-active)" />
        <StatCard label="At Risk"      value={stats.atRisk}    sub="Need attention" color="var(--status-risk)" />
        <StatCard label="Completed"    value={stats.completed} sub="Harvested"      color="var(--status-done)" />
      </div>

      <div className={styles.twoCol}>
        {/* Agent overview */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Field Agents</h2>
            <button className={styles.seeAll} onClick={() => navigate('/agents')}>See all →</button>
          </div>
          <div className={styles.agentList}>
            {agents.map(agent => {
              const agentFields = fields.filter(f => f.assigned_agent_id === agent.id)
              const atRisk = agentFields.filter(f => f.status === 'at-risk').length
              return (
                <div key={agent.id} className={styles.agentRow}>
                  <div className={styles.agentAvatar}>{agent.name[0]}</div>
                  <div className={styles.agentInfo}>
                    <div className={styles.agentName}>{agent.name}</div>
                    <div className={styles.agentMeta}>{agentFields.length} fields assigned</div>
                  </div>
                  {atRisk > 0 && (
                    <span className={styles.riskPill}>{atRisk} at risk</span>
                  )}
                  <div className={styles.agentFields}>
                    {agentFields.map(f => (
                      <div
                        key={f.id}
                        className={`${styles.agentDot} ${styles[`dot_${f.status.replace('-', '')}`]}`}
                        title={`${f.name} – ${f.status}`}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent updates */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Updates</h2>
            <button className={styles.seeAll} onClick={() => navigate('/fields')}>All fields →</button>
          </div>
          <div className={styles.updateList}>
            {recentUpdates.map(u => {
              const field = fields.find(f => f.id === u.field_id)
              const agent = agents.find(a => a.id === u.agent_id)
              return (
                <div
                  key={u.id}
                  className={styles.updateRow}
                  onClick={() => navigate(`/fields/${u.field_id}`)}
                >
                  <div className={styles.updateDot} />
                  <div className={styles.updateContent}>
                    <div className={styles.updateField}>{field?.name}</div>
                    <div className={styles.updateNote}>{u.notes}</div>
                    <div className={styles.updateMeta}>
                      {agent?.name?.split(' ')[0]} · {u.stage} ·{' '}
                      {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* At-risk fields */}
      {stats.atRisk > 0 && (
        <div className={`${styles.card} ${styles.riskCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>⚠️ Fields Needing Attention</h2>
          </div>
          <div className={styles.riskGrid}>
            {fields.filter(f => f.status === 'at-risk').map(f => {
              const agent = agents.find(a => a.id === f.assigned_agent_id)
              const daysSince = Math.floor((new Date() - new Date(f.last_update)) / 86400000)
              return (
                <div key={f.id} className={styles.riskRow} onClick={() => navigate(`/fields/${f.id}`)}>
                  <div className={styles.riskName}>{f.name}</div>
                  <div className={styles.riskDetail}>
                    <span>{f.crop_type}</span>
                    <span>{agent?.name?.split(' ')[0]}</span>
                    <span style={{ color: 'var(--status-risk)', fontWeight: 600 }}>
                      No update in {daysSince}d
                    </span>
                  </div>
                  <StatusBadge status="at-risk" />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}