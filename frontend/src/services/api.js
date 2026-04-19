const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || ''
const API_BASE = `${API_URL}/api`

class ApiService {
  constructor() {
    this.baseURL = API_BASE
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    }

    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'API request failed')
    }

    return data
  }

  // Auth endpoints
  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  // Field endpoints
  async getFields() {
    return this.request('/fields')
  }

  async createField(fieldData) {
    return this.request('/fields', {
      method: 'POST',
      body: JSON.stringify(fieldData)
    })
  }

  async updateField(id, fieldData) {
    return this.request(`/fields/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fieldData)
    })
  }

  async deleteField(id) {
    return this.request(`/fields/${id}`, {
      method: 'DELETE'
    })
  }

  async getFieldUpdates(fieldId) {
    return this.request(`/fields/${fieldId}/updates`)
  }

  // Update endpoints
  async createUpdate(updateData) {
    return this.request('/updates', {
      method: 'POST',
      body: JSON.stringify(updateData)
    })
  }

  // Agent endpoints
  async getAgents() {
    return this.request('/agents')
  }
}

export const apiService = new ApiService()