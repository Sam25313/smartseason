import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initializeDB } from './utils/database.js'
import { authenticateToken } from './middleware/auth.js'
import authRoutes from './routes/auth.js'
import fieldRoutes from './routes/fields.js'
import updateRoutes from './routes/updates.js'
import agentRoutes from './routes/agents.js'

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Initialize database
await initializeDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/fields', authenticateToken, fieldRoutes)
app.use('/api/updates', authenticateToken, updateRoutes)
app.use('/api/agents', authenticateToken, agentRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.get('/', (req, res) => {
  res.json({ message: 'SmartSeason API is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})