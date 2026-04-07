const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const pool = require('./pool')
const bcrypt = require('bcryptjs')

async function seed() {
  const email = process.env.ADMIN_EMAIL || 'admin@superpowersproject.org'
  const password = process.env.ADMIN_PASSWORD || 'changeme123'
  const name = process.env.ADMIN_NAME || 'Admin'

  const { rows } = await pool.query('SELECT id FROM users WHERE email = $1', [email])
  if (rows.length > 0) {
    console.log('Admin account already exists.')
    await pool.end()
    return
  }

  const password_hash = await bcrypt.hash(password, 12)
  await pool.query(
    `INSERT INTO users (email, password_hash, name, role, school_name) VALUES ($1, $2, $3, 'admin', 'Superpowers Project')`,
    [email, password_hash, name]
  )

  console.log(`Admin account created: ${email}`)
  await pool.end()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
