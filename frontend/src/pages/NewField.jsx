import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFields } from '../context/FieldsContext'
import { CROPS } from '../data/mockData'
import styles from './NewField.module.css'

const REGIONS = [
  'Mount Kenya', 'Rift Valley', 'Northern Eastern Region', 'Coastal Region',
  'Nyanza Region', 'Eastern Region', 'Western Region', 'Upper East Region',
  'Upper West Region', 'Savannah Region',
]

export default function NewField() {
  const { user } = useAuth()
  const { addField, getAgents } = useFields()
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

  const [form, setForm] = useState({
    name: '',
    crop_type: CROPS[0],
    planting_date: new Date().toISOString().split('T')[0],
    assigned_agent_id: '',
    location: REGIONS[0],
    area_ha: '',
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (agents.length > 0 && !form.assigned_agent_id) {
      setForm(prev => ({ ...prev, assigned_agent_id: agents[0].id }))
    }
  }, [agents, form.assigned_agent_id])

  function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim())   e.name = 'Field name is required.'
    if (!form.area_ha || isNaN(Number(form.area_ha)) || Number(form.area_ha) <= 0)
      e.area_ha = 'Enter a valid area in hectares.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      const field = await addField({
        ...form,
        assigned_agent_id: Number(form.assigned_agent_id),
        area_ha: Number(form.area_ha),
      })
      navigate(`/fields/${field.id}`)
    } catch (err) {
      console.error('Failed to create field:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className={styles.page}>Loading...</div>
  }

  if (user?.role !== 'admin') {
    navigate('/fields')
    return null
  }

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/fields')}>← Back to fields</button>

      <h1 className={styles.title}>Add New Field</h1>
      <p className={styles.subtitle}>Register a new field plot and assign it to an agent.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Field Information</h2>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Field Name *</label>
              <input
                className={`${styles.input} ${errors.name ? styles.inputErr : ''}`}
                type="text"
                placeholder="e.g. Aboabo North Plot"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
              {errors.name && <span className={styles.err}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Crop Type</label>
              <select className={styles.input} value={form.crop_type} onChange={e => set('crop_type', e.target.value)}>
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Region / Location</label>
              <select className={styles.input} value={form.location} onChange={e => set('location', e.target.value)}>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Area (hectares) *</label>
              <input
                className={`${styles.input} ${errors.area_ha ? styles.inputErr : ''}`}
                type="number"
                step="0.1"
                min="0.1"
                placeholder="e.g. 3.5"
                value={form.area_ha}
                onChange={e => set('area_ha', e.target.value)}
              />
              {errors.area_ha && <span className={styles.err}>{errors.area_ha}</span>}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Planting Date</label>
              <input
                className={styles.input}
                type="date"
                value={form.planting_date}
                onChange={e => set('planting_date', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Assign to Agent</label>
              <select
                className={styles.input}
                value={form.assigned_agent_id}
                onChange={e => set('assigned_agent_id', e.target.value)}
              >
                {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate('/fields')}>Cancel</button>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? 'Creating field…' : 'Create Field →'}
          </button>
        </div>
      </form>
    </div>
  )
}
