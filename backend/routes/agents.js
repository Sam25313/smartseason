import express from 'express'
import { getAgents } from '../utils/database.js'

const router = express.Router()

// Get agents (admin only)
router.get('/', async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' })

    const agents = await getAgents()
    res.json(agents)
  } catch (error) {
    console.error('Get agents error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router