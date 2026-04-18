import express from 'express'
import { getAllUpdates, getUpdatesByAgent, createUpdate, getFieldById } from '../utils/database.js'

const router = express.Router()

// Create update
router.post('/', async (req, res) => {
  try {
    const field = await getFieldById(req.body.field_id)
    if (!field) return res.status(404).json({ error: 'Field not found' })

    if (req.user.role !== 'admin' && field.assigned_agent_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const newUpdate = await createUpdate({
      ...req.body,
      agent_id: req.user.id
    })

    res.json(newUpdate)
  } catch (error) {
    console.error('Create update error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router