import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFields } from '../context/FieldsContext'
import { USERS } from '../data/mockData'
import FieldCard from '../components/FieldCard'
import StatusBadge from '../components/StatusBadge'
import styles from './Fields.module.css'

export default function Fields() {
  const { user } = useAuth()
  const { fields } = useFields()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  const [search, setSearch]   = useState('')
  const [statusF, setStatusF] = useState('all')
  const [agentF,  setAgentF]  = useState('all')
  const [view,    setView]    = useState('grid')

  const agents = USERS.filter(u => u.role === 'agent')

  const visible = useMemo(() => {
    let list = isAdmin ? fields : fields.filter(f => f.assigned_agent_id === user?.id)
    if (search)          list = list.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.crop_type.toLowerCase().includes(search.toLowerCase()) || f.location?.toLowerCase().includes(search.toLowerCase()))
    if (statusF !== 'all') list = list.filter(f => f.status === statusF)
    if (agentF  !== 'all') list = list.filter(f => f.assigned_agent_id === Number(agentF))
    return list
  }, [fields, isAdmin, user, search, statusF, agentF])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{isAdmin ? 'All Fields' : 'My Fields'}</h1>
          <p className={styles.subtitle}>{visible.length} field{visible.length !== 1 ? 's' : ''} shown</p>
        </div>
        {isAdmin && (
          <button className={styles.addBtn} onClick={() => navigate('/fields/new')}>
            + New Field
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="text"
          placeholder="Search fields, crops, regions…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className={styles.select} value={statusF} onChange={e => setStatusF(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="at-risk">At Risk</option>
          <option value="completed">Completed</option>
        </select>
        {isAdmin && (
          <select className={styles.select} value={agentF} onChange={e => setAgentF(e.target.value)}>
            <option value="all">All agents</option>
            {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        )}
        <div className={styles.viewToggle}>
          <button className={`${styles.viewBtn} ${view === 'grid' ? styles.viewActive : ''}`} onClick={() => setView('grid')}>⊞</button>
          <button className={`${styles.viewBtn} ${view === 'list' ? styles.viewActive : ''}`} onClick={() => setView('list')}>☰</button>
        </div>
      </div>

      {/* Grid view */}
      {view === 'grid' && (
        <div className={styles.grid}>
          {visible.length === 0
            ? <div className={styles.empty}><p>No fields match your filters.</p></div>
            : visible.map((f, i) => (
                <div key={f.id} style={{ animationDelay: `${i * 0.04}s` }}>
                  <FieldCard field={f} />
                </div>
              ))
          }
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className={styles.listWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Field</th>
                <th>Crop</th>
                <th>Stage</th>
                <th>Area</th>
                {isAdmin && <th>Agent</th>}
                <th>Last Update</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0
                ? <tr><td colSpan={isAdmin ? 7 : 6} className={styles.emptyCell}>No fields match your filters.</td></tr>
                : visible.map(f => {
                    const agent = USERS.find(u => u.id === f.assigned_agent_id)
                    const daysSince = Math.floor((new Date() - new Date(f.last_update)) / 86400000)
                    return (
                      <tr key={f.id} className={styles.tableRow} onClick={() => navigate(`/fields/${f.id}`)}>
                        <td className={styles.fieldCell}>
                          <span className={styles.fieldName}>{f.name}</span>
                          <span className={styles.fieldLoc}>📍 {f.location}</span>
                        </td>
                        <td>{f.crop_type}</td>
                        <td><span className={styles.stagePill}>{f.current_stage}</span></td>
                        <td>{f.area_ha} ha</td>
                        {isAdmin && <td>{agent?.name?.split(' ')[0]}</td>}
                        <td className={daysSince >= 7 ? styles.stale : ''}>{daysSince === 0 ? 'Today' : `${daysSince}d ago`}</td>
                        <td><StatusBadge status={f.status} /></td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
