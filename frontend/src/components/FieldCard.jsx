import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useFields } from '../context/FieldsContext'
import StatusBadge from './StatusBadge'
import styles from './FieldCard.module.css'

const STAGE_PROGRESS = { Planting: 1, Germination: 2, Vegetative: 3, Flowering: 4, Ripening: 5, Harvested: 6 }
const CROP_ICONS = { Maize: '🌽', Tomatoes: '🍅', Cassava: '🥔', Yam: '🥔', Sorghum: '🌾', Groundnuts: '🥜', Rice: '🌾', Cowpeas: '🫘' }
const STAGES = ['Planted', 'Growing', 'Ready', 'Harvested']

export default function FieldCard({ field }) {
  const navigate = useNavigate()
  const { agents } = useFields()
  const agent = agents.find(a => a.id === field.assigned_agent_id)
  const progress = ((STAGE_PROGRESS[field.current_stage] || 1) / 6) * 100

  // Safely format the last update date
  const formatLastUpdate = (lastUpdate) => {
    try {
      if (!lastUpdate) return '—'
      const date = new Date(lastUpdate)
      if (isNaN(date.getTime())) return '—'
      return format(date, 'MMM d')
    } catch (error) {
      return '—'
    }
  }

  return (
    <div className={styles.card} onClick={() => navigate(`/fields/${field.id}`)}>
      <div className={styles.header}>
        <div className={styles.cropIcon}>{CROP_ICONS[field.crop_type] || '🌿'}</div>
        <div className={styles.meta}>
          <div className={styles.name}>{field.name}</div>
          <div className={styles.location}>📍 {field.location}</div>
        </div>
        <StatusBadge status={field.status} />
      </div>

      <div className={styles.stageRow}>
        <span className={styles.stageLabel}>Stage</span>
        <span className={styles.stageName}>{field.current_stage}</span>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.stageLabels}>
        {STAGES.map(s => (
          <span key={s} className={`${styles.stageTick} ${s === field.current_stage ? styles.stageCurrent : ''}`}>
            {s === field.current_stage ? '●' : '·'}
          </span>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerItem}>
          <span className={styles.footerLabel}>Crop</span>
          <span className={styles.footerVal}>{field.crop_type}</span>
        </div>
        <div className={styles.footerItem}>
          <span className={styles.footerLabel}>Area</span>
          <span className={styles.footerVal}>{field.area_ha} ha</span>
        </div>
        <div className={styles.footerItem}>
          <span className={styles.footerLabel}>Agent</span>
          <span className={styles.footerVal}>{agent?.name?.split(' ')[0] || '—'}</span>
        </div>
        <div className={styles.footerItem}>
          <span className={styles.footerLabel}>Updated</span>
          <span className={styles.footerVal}>{formatLastUpdate(field.last_update)}</span>
        </div>
      </div>
    </div>
  )
}
