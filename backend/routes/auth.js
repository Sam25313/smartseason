import express from 'express'
import jwt from 'jsonwebtoken'
import { getUserByEmail, getUserById } from '../utils/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await getUserByEmail(email)

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // For now, we'll use plain text comparison since we're using pre-hashed passwords
    // In production, you'd hash the input password and compare
    const bcrypt = (await import('bcryptjs')).default
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router