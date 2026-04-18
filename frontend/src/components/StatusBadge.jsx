import styles from './StatusBadge.module.css'

const CONFIG = {
  active:    { label: 'Active',    color: 'green' },
  'at-risk': { label: 'At Risk',   color: 'amber' },
  completed: { label: 'Completed', color: 'gray'  },
}

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] || CONFIG.active
  return (
    <span className={`${styles.badge} ${styles[cfg.color]}`}>
      <span className={styles.dot} />
      {cfg.label}
    </span>
  )
}
