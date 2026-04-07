const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const pool = require('./pool')

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      run_at TIMESTAMP DEFAULT NOW()
    )
  `)

  const migrationDir = path.join(__dirname, 'migrations')
  const files = fs.readdirSync(migrationDir).sort()

  const { rows: completed } = await pool.query('SELECT name FROM migrations')
  const completedNames = completed.map((r) => r.name)

  for (const file of files) {
    if (completedNames.includes(file)) continue
    console.log(`Running migration: ${file}`)
    const sql = fs.readFileSync(path.join(migrationDir, file), 'utf8')
    await pool.query(sql)
    await pool.query('INSERT INTO migrations (name) VALUES ($1)', [file])
  }

  console.log('Migrations complete.')
  await pool.end()
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
