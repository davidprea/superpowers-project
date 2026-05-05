const { Pool } = require('pg')

// rejectUnauthorized: false is acceptable here because Render's managed Postgres
// is reached over Render's private network and uses self-signed certs. Do not
// copy this setting into an environment where the DB is reachable from outside.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

module.exports = pool
