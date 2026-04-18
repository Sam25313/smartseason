import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useAuth } from '../context/AuthContext'
import { useFields } from '../context/FieldsContext'
import { STAGES } from '../data/mockData'
import StatusBadge from '../components/StatusBadge'
import styles from './FieldDetail.module.css'

const STAGE_PROGRESS = { Planted: 1, Growing: 2, Ready: 3, Harvested: 4 }
const CROP_ICONS = { Maize: '🌽', Tomatoes: '🍅', Cassava: '🥔', Yam: '🥔', Sorghum: '🌾', Groundnuts: '🥜', Rice: '🌾', Cowpeas: '🫘' }

// Safe date formatting function
const formatDate = (dateString, formatStr = 'dd MMM yyyy') => {
  try {
    if (!dateString) return '—'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    return format(date, formatStr)
  } catch (error) {
    return '—'
  }
}

export default function FieldDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { fields, agents, getFieldUpdates, addUpdate, deleteField } = useFields()
  const navigate = useNavigate()

  const field = fields.find(f => f.id === Number(id))
  const [fieldUpdates, setFieldUpdates] = useState([])
  const [loadingUpdates, setLoadingUpdates] = useState(true)
  const agent = agents.find(u => u.id === field?.assigned_agent_id)
  const isAdmin = user?.role === 'admin'
  const isAssigned = field?.assigned_agent_id === user?.id

  const [showForm, setShowForm] = useState(false)
  const [stage, setStage]       = useState(field?.current_stage || STAGES[0])
  const [notes, setNotes]       = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (field) {
      loadUpdates()
    }
  }, [field])

  async function loadUpdates() {
    setLoadingUpdates(true)
    const updates = await getFieldUpdates(Number(id))
    setFieldUpdates(updates)
    setLoadingUpdates(false)
  }

  if (!field) {
    return (
      <div className={styles.notFound}>
        <h2>Field not found.</h2>
        <button onClick={() => navigate('/fields')}>← Back to fields</button>
      </div>
    )
  }

  const progress = ((STAGE_PROGRESS[field.current_stage] || 1) / 4) * 100

  async function handleSubmit(e) {
    e.preventDefault()
    if (!notes.trim()) return
    setSubmitting(true)
    try {
      await addUpdate({ field_id: field.id, agent_id: user.id, stage, notes: notes.trim() })
      setNotes('')
      setShowForm(false)
      // Reload updates
      await loadUpdates()
    } catch (err) {
      console.error('Failed to add update:', err)
    } finally {
      setSubmitting(false)
    }
  }

  function handleDelete() {
    if (window.confirm(`Delete "${field.name}"? This cannot be undone.`)) {
      deleteField(field.id)
      navigate('/fields')
    }
  }

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/fields')}>
        ← Back to fields
      </button>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.cropIcon}>{CROP_ICONS[field.crop_type] || '🌿'}</div>
          <div>
            <h1 className={styles.fieldName}>{field.name}</h1>
            <div className={styles.fieldMeta}>
              <span>📍 {field.location}</span>
              <span>🌱 {field.crop_type}</span>
              <span>📐 {field.area_ha} ha</span>
              <span>👤 {agent?.name}</span>
            </div>
          </div>
        </div>
        <div className={styles.heroRight}>
          <StatusBadge status={field.status} />
          {isAdmin && (
            <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
          )}
        </div>
      </div>

      {/* Stage progress */}
      <div className={styles.stageCard}>
        <div className={styles.stageHeader}>
          <span className={styles.stageTitle}>Growth Progress</span>
          <span className={styles.stageCurrent}>{field.current_stage}</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.stageSteps}>
          {STAGES.map((s, i) => (
            <div key={s} className={`${styles.stageStep} ${s === field.current_stage ? styles.stepActive : ''} ${STAGE_PROGRESS[s] < STAGE_PROGRESS[field.current_stage] ? styles.stepDone : ''}`}>
              <div className={styles.stepDot}>{STAGE_PROGRESS[s] <= STAGE_PROGRESS[field.current_stage] ? '✓' : i + 1}</div>
              <div className={styles.stepLabel}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Info grid */}
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <div className={styles.infoLabel}>Planting Date</div>
          <div className={styles.infoValue}>{formatDate(field.planting_date)}</div>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.infoLabel}>Days Since Planting</div>
          <div className={styles.infoValue}>{field.planting_date ? Math.floor((new Date() - new Date(field.planting_date)) / 86400000) + 'd' : '—'}</div>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.infoLabel}>Last Updated</div>
          <div className={styles.infoValue}>{formatDate(field.last_update)}</div>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.infoLabel}>Total Updates</div>
          <div className={styles.infoValue}>{loadingUpdates ? '...' : fieldUpdates.length}</div>
        </div>
      </div>

      {/* Update form */}
      {(isAdmin || isAssigned) && (
        <div className={styles.updateSection}>
          {!showForm ? (
            <button className={styles.addUpdateBtn} onClick={() => setShowForm(true)}>
              + Log Field Update
            </button>
          ) : (
            <form className={styles.updateForm} onSubmit={handleSubmit}>
              <h3 className={styles.formTitle}>Log a Field Update</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Current Stage</label>
                  <select
                    className={styles.formSelect}
                    value={stage}
                    onChange={e => setStage(e.target.value)}
                  >
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Observation Notes</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Describe what you observed in the field today…"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                  required
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Saving…' : 'Save Update'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Updates timeline */}
      <div className={styles.timelineSection}>
        <h2 className={styles.timelineTitle}>Update History</h2>
        {loadingUpdates ? (
          <p className={styles.noUpdates}>Loading updates...</p>
        ) : fieldUpdates.length === 0 ? (
          <p className={styles.noUpdates}>No updates logged yet.</p>
        ) : (
          <div className={styles.timeline}>
            {[...fieldUpdates].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((u, i) => {
              const updAgent = agents.find(a => a.id === u.agent_id)
              return (
                <div key={u.id} className={styles.timelineItem} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineCard}>
                    <div className={styles.timelineHeader}>
                      <div className={styles.timelineStage}>{u.stage}</div>
                      <div className={styles.timelineDate}>
                        {format(new Date(u.created_at), 'dd MMM yyyy')}
                      </div>
                    </div>
                    <p className={styles.timelineNotes}>{u.notes}</p>
                    <div className={styles.timelineAgent}>
                      <div className={styles.miniAvatar}>{updAgent?.name?.[0]}</div>
                      {updAgent?.name}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
