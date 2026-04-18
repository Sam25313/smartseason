import express from 'express'
import { getAllFields, getFieldsByAgent, getFieldById, createField, updateField, deleteField, getUpdatesByField } from '../utils/database.js'
import { computeStatus } from '../utils/constants.js'

const router = express.Router()

// Get fields
router.get('/', async (req, res) => {
  try {
    let fields
    if (req.user.role === 'agent') {
      fields = await getFieldsByAgent(req.user.id)
    } else {
      fields = await getAllFields()
    }

    // Add status to each field
    fields = fields.map(f => ({ ...f, status: computeStatus(f.current_stage, f.last_update) }))
    res.json(fields)
  } catch (error) {
    console.error('Get fields error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create field
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' })

    const field = await createField(req.body)
    res.json(field)
  } catch (error) {
    console.error('Create field error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update field
router.put('/:id', async (req, res) => {
  try {
    const field = await getFieldById(parseInt(req.params.id))
    if (!field) return res.status(404).json({ error: 'Field not found' })

    if (req.user.role !== 'admin' && field.assigned_agent_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const updatedField = await updateField(parseInt(req.params.id), req.body)
    res.json(updatedField)
  } catch (error) {
    console.error('Update field error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete field
router.delete('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' })

    const field = await getFieldById(parseInt(req.params.id))
    if (!field) return res.status(404).json({ error: 'Field not found' })

    await deleteField(parseInt(req.params.id))
    res.json({ message: 'Field deleted' })
  } catch (error) {
    console.error('Delete field error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get field updates
router.get('/:id/updates', async (req, res) => {
  try {
    const field = await getFieldById(parseInt(req.params.id))
    if (!field) return res.status(404).json({ error: 'Field not found' })

    if (req.user.role !== 'admin' && field.assigned_agent_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const updates = await getUpdatesByField(parseInt(req.params.id))
    res.json(updates)
  } catch (error) {
    console.error('Get field updates error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router