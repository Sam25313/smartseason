import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smartseason',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

let pool = null

export async function getConnection() {
  if (!pool) {
    pool = mysql.createPool(DB_CONFIG)
  }
  return pool.getConnection()
}

export async function initializeDB() {
  try {
    const connection = await getConnection()

    // Disable foreign key checks to allow dropping tables
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0')

    // Drop all tables in reverse dependency order
    await connection.execute(`DROP TABLE IF EXISTS updates`)
    await connection.execute(`DROP TABLE IF EXISTS field_updates`)
    await connection.execute(`DROP TABLE IF EXISTS fields`)
    await connection.execute(`DROP TABLE IF EXISTS users`)

    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1')

    // Create tables if they don't exist
    await connection.execute(`
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'agent') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create fields table
    await connection.execute(`
      CREATE TABLE fields (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        crop_type VARCHAR(100) NOT NULL,
        planting_date DATE NOT NULL,
        current_stage VARCHAR(50) NOT NULL,
        assigned_agent_id INT,
        location VARCHAR(255) NOT NULL,
        area_ha DECIMAL(5,2) NOT NULL,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (assigned_agent_id) REFERENCES users(id)
      )
    `)

    await connection.execute(`
      CREATE TABLE updates (
        id INT PRIMARY KEY AUTO_INCREMENT,
        field_id INT NOT NULL,
        agent_id INT NOT NULL,
        stage VARCHAR(50) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
        FOREIGN KEY (agent_id) REFERENCES users(id)
      )
    `)

    // Check if data already exists
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users')
    if (users[0].count === 0) {
      // Insert sample data
      const hashedAdminPassword = await bcrypt.hash('admin123', 10)
      const hashedAgentPassword = await bcrypt.hash('agent123', 10)

      await connection.execute(`
        INSERT INTO users (name, email, password, role) VALUES
        ('Amara Osei', 'admin@smartseason.com', ?, 'admin'),
        ('Kofi Mensah', 'kofi@smartseason.com', ?, 'agent'),
        ('Nia Adeyemi', 'nia@smartseason.com', ?, 'agent'),
        ('Kwame Asante', 'kwame@smartseason.com', ?, 'agent')
      `, [hashedAdminPassword, hashedAgentPassword, hashedAgentPassword, hashedAgentPassword])
    }

    // Insert sample fields data (always insert since we drop and recreate the table)
    await connection.execute(`
      INSERT INTO fields (name, crop_type, planting_date, current_stage, assigned_agent_id, location, area_ha) VALUES
      ('Aboabo North Plot', 'Maize', '2026-01-15', 'Growing', 2, 'Kumasi Region', 3.5),
      ('Tamale East Farm', 'Sorghum', '2026-01-30', 'Growing', 3, 'Northern Region', 5.0),
      ('Volta Basin Field', 'Rice', '2025-10-15', 'Harvested', 2, 'Volta Region', 2.2),
      ('Brong-Ahafo Plot A', 'Yam', '2026-02-15', 'Planted', 4, 'Bono Region', 4.0)
    `)

    connection.release()
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

// User operations
export async function getUserByEmail(email) {
  const connection = await getConnection()
  try {
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email])
    return rows[0] || null
  } finally {
    connection.release()
  }
}

export async function getUserById(id) {
  const connection = await getConnection()
  try {
    const [rows] = await connection.execute('SELECT id, name, email, role FROM users WHERE id = ?', [id])
    return rows[0] || null
  } finally {
    connection.release()
  }
}

export async function getAgents() {
  const connection = await getConnection()
  try {
    const [rows] = await connection.execute('SELECT id, name, email FROM users WHERE role = ?', ['agent'])
    return rows
  } finally {
    connection.release()
  }
}

// Field operations
export async function getAllFields() {
  const connection = await getConnection()
  try {
    const [rows] = await connection.execute('SELECT * FROM fields ORDER BY id')
    return rows
  } finally {
    connection.release()
  }
}

export async function getFieldsByAgent(agentId) {
  const connection = await getConnection()
  try {
    const [rows] = await connection.execute('SELECT * FROM fields WHERE assigned_agent_id = ? ORDER BY id', [agentId])
    return rows
  } finally {
    connection.release()
  }
}

export async function getFieldById(id) {
  const connection = await getConnection()
  try {
    const [rows] = await connection.execute('SELECT * FROM fields WHERE id = ?', [id])
    return rows[0] || null
  } finally {
    connection.release()
  }
}

export async function createField(fieldData) {
  const connection = await getConnection()
  try {
    const { name, crop_type, planting_date, current_stage, assigned_agent_id, location, area_ha } = fieldData
    const [result] = await connection.execute(
      'INSERT INTO fields (name, crop_type, planting_date, current_stage, assigned_agent_id, location, area_ha) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, crop_type, planting_date, current_stage || 'Planted', assigned_agent_id, location, area_ha]
    )
    return { id: result.insertId, ...fieldData, current_stage: current_stage || 'Planted' }
  } finally {
    connection.release()
  }
}

export async function updateField(id, updates) {
  const connection = await getConnection()
  try {
    const fields = Object.keys(updates)
    const values = Object.values(updates)
    const setClause = fields.map(field => `${field} = ?`).join(', ')

    await connection.execute(
      `UPDATE fields SET ${setClause} WHERE id = ?`,
      [...values, id]
    )

    return await getFieldById(id)
  } finally {
    connection.release()
  }
}

export async function deleteField(id) {
  const connection = await getConnection()
  try {
    await connection.execute('DELETE FROM fields WHERE id = ?', [id])
  } finally {
    connection.release()
  }
}

// Update operations
export async function getAllUpdates() {
  const connection = await getConnection()
  try {
    const [rows] = await connection.execute(`
      SELECT u.*, f.name as field_name, usr.name as agent_name
      FROM updates u
      JOIN fields f ON u.field_id = f.id
      JOIN users usr ON u.agent_id = usr.id
      ORDER BY u.created_at DESC
    `)
    return rows
  } finally {
    connection.release()
  }
}

export async function getUpdatesByField(fieldId) {
  const connection = await getConnection()
  try {
    const [rows] = await connection.execute(`
      SELECT u.*, usr.name as agent_name
      FROM updates u
      JOIN users usr ON u.agent_id = usr.id
      WHERE u.field_id = ?
      ORDER BY u.created_at DESC
    `, [fieldId])
    return rows
  } finally {
    connection.release()
  }
}

export async function getUpdatesByAgent(agentId) {
  const connection = await getConnection()
  try {
    const [rows] = await connection.execute(`
      SELECT u.*, f.name as field_name
      FROM updates u
      JOIN fields f ON u.field_id = f.id
      WHERE u.agent_id = ?
      ORDER BY u.created_at DESC
    `, [agentId])
    return rows
  } finally {
    connection.release()
  }
}

export async function createUpdate(updateData) {
  const connection = await getConnection()
  try {
    const { field_id, agent_id, stage, notes } = updateData
    const [result] = await connection.execute(
      'INSERT INTO updates (field_id, agent_id, stage, notes) VALUES (?, ?, ?, ?)',
      [field_id, agent_id, stage, notes || '']
    )

    // Update field stage
    await connection.execute(
      'UPDATE fields SET current_stage = ?, last_update = CURRENT_TIMESTAMP WHERE id = ?',
      [stage, field_id]
    )

    return {
      id: result.insertId,
      ...updateData,
      created_at: new Date().toISOString()
    }
  } finally {
    connection.release()
  }
}