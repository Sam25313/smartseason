import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const FieldsContext = createContext(null)

const API_BASE = `${import.meta.env.VITE_API_URL || ''}/api`

async function parseJson(response) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch (err) {
    throw new Error(`Expected JSON response but got: ${text.slice(0,200)}`)
  }
}

export function FieldsProvider({ children }) {
  const { user } = useAuth()
  const [fields, setFields] = useState([])
  const [updates, setUpdates] = useState([])
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(false)

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadFields()
      if (user.role === 'admin') {
        loadAgents()
      }
    } else {
      setFields([])
      setUpdates([])
      setAgents([])
    }
  }, [user])

  async function loadAgents() {
    try {
      const res = await fetch(`${API_BASE}/agents`, { headers: getAuthHeaders() })
      const data = await parseJson(res)
      if (res.ok) {
        setAgents(data)
      }
    } catch (err) {
      console.error('Failed to load agents:', err)
    }
  }

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  async function loadFields() {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/fields`, { headers: getAuthHeaders() })
      const data = await parseJson(res)
      if (res.ok) {
      }
    } catch (err) {
      console.error('Failed to load fields:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addField(fieldData) {
    try {
      const res = await fetch(`${API_BASE}/fields`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(fieldData)
      })
      const data = await parseJson(res)
      if (res.ok) {
        setFields(prev => [...prev, data])
        return data
      }
      throw new Error(data.error)
    } catch (err) {
      console.error('Failed to add field:', err)
      throw err
    }
  }

  async function updateField(id, changes) {
    try {
      const res = await fetch(`${API_BASE}/fields/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(changes)
      })
      const data = await parseJson(res)
      if (res.ok) {
        setFields(prev => prev.map(f => f.id === id ? data : f))
        return data
      }
      throw new Error(data.error)
    } catch (err) {
      console.error('Failed to update field:', err)
      throw err
    }
  }

  async function deleteField(id) {
    try {
      const res = await fetch(`${API_BASE}/fields/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      if (res.ok) {
        setFields(prev => prev.filter(f => f.id !== id))
        setUpdates(prev => prev.filter(u => u.field_id !== id))
      } else {
        const data = await parseJson(res)
        throw new Error(data.error)
      }
    } catch (err) {
      console.error('Failed to delete field:', err)
      throw err
    }
  }

  async function addUpdate(updateData) {
    try {
      const res = await fetch(`${API_BASE}/updates`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      })
      const data = await parseJson(res)
      if (res.ok) {
        setUpdates(prev => [data, ...prev])
        // Update the field in the list
        setFields(prev => prev.map(f => 
          f.id === updateData.field_id 
            ? { ...f, current_stage: updateData.stage, last_update: new Date().toISOString() }
            : f
        ))
        return data
      }
      throw new Error(data.error)
    } catch (err) {
      console.error('Failed to add update:', err)
      throw err
    }
  }

  async function getAgents() {
    try {
      const res = await fetch(`${API_BASE}/agents`, { headers: getAuthHeaders() })
      const data = await parseJson(res)
      if (res.ok) {
        return data
      }
      throw new Error(data.error)
    } catch (err) {
      console.error('Failed to load agents:', err)
      return []
    }
  }

  return (
    <FieldsContext.Provider value={{ 
      fields, 
      updates,
      agents,
      addField, 
      updateField, 
      deleteField, 
      addUpdate, 
      getFieldUpdates,
      getAgents,
      loading,
      refreshFields: loadFields
    }}>
      {children}
    </FieldsContext.Provider>
  )
}

export function useFields() {
  return useContext(FieldsContext)
}
