import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const API_BASE = `${import.meta.env.VITE_API_URL || ''}/api`

async function parseJson(response) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch (err) {
    throw new Error(`Expected JSON response but got: ${text.slice(0,200)}`)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token with server
      fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(async res => {
        const data = await parseJson(res)
        if (data.error) {
          localStorage.removeItem('token')
        } else {
          setUser(data)
        }
      })
      .catch(() => {
        localStorage.removeItem('token')
      })
      .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  async function login(email, password) {
    setError('')
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await parseJson(res)
      if (!res.ok) throw new Error(data.error)
      
      localStorage.setItem('token', data.token)
      setUser(data.user)
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, error, setError, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
