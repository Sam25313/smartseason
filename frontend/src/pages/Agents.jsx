import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFields } from '../context/FieldsContext'
import StatusBadge from '../components/StatusBadge'
import styles from './Agents.module.css'

export default function Agents() {
  const { fields, getAgents } = useFields()
  const navigate = useNavigate()
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAgents() {
      const data = await getAgents()
      setAgents(data)
      setLoading(false)
    }
    loadAgents()
  }, [getAgents])

  if (loading) {
    return <div className={styles.page}>Loading...</div>
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Field Agents</h1>
        <p className={styles.subtitle}>{agents.length} agents registered</p>
      </div>

      <div className={styles.grid}>
        {agents.map(agent => {
          const agentFields = fields.filter(f => f.assigned_agent_id === agent.id)
          const active    = agentFields.filter(f => f.status === 'active').length
          const atRisk    = agentFields.filter(f => f.status === 'at-risk').length
          const completed = agentFields.filter(f => f.status === 'completed').length
          const totalHa   = agentFields.reduce((s, f) => s + (parseFloat(f.area_ha) || 0), 0)

          return (
            <div key={agent.id} className={styles.agentCard}>
              <div className={styles.agentTop}>
                <div className={styles.avatar}>{agent.name[0]}</div>
                <div className={styles.agentInfo}>
                  <div className={styles.agentName}>{agent.name}</div>
                  <div className={styles.agentEmail}>{agent.email}</div>
                </div>
              </div>

              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <span className={styles.statNum}>{agentFields.length}</span>
                  <span className={styles.statLbl}>Fields</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNum}>{totalHa.toFixed(1)}</span>
                  <span className={styles.statLbl}>Hectares</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNum} style={{ color: atRisk > 0 ? 'var(--status-risk)' : 'inherit' }}>{atRisk}</span>
                  <span className={styles.statLbl}>At Risk</span>
                </div>
              </div>

              <div className={styles.fieldList}>
                {agentFields.length === 0
                  ? <p className={styles.noFields}>No fields assigned.</p>
                  : agentFields.map(f => (
                      <div key={f.id} className={styles.fieldRow} onClick={() => navigate(`/fields/${f.id}`)}>
                        <span className={styles.fieldName}>{f.name}</span>
                        <span className={styles.fieldCrop}>{f.crop_type}</span>
                        <StatusBadge status={f.status} />
                      </div>
                    ))
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
