import jwt from 'jsonwebtoken'
import { getFieldById } from '../utils/database.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Access token required' })

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })
    req.user = user
    next()
  })
}

export function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

export async function requireAgentOrAdmin(req, res, next) {
  try {
    const field = await getFieldById(parseInt(req.params.id))
    if (!field) return res.status(404).json({ error: 'Field not found' })

    if (req.user.role !== 'admin' && field.assigned_agent_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' })
    }
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}