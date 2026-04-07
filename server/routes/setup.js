const router = require('express').Router()
const bcrypt = require('bcryptjs')
const pool = require('../db/pool')

router.post('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
    if (rows.length > 0) {
      return res.json({ message: 'Already initialized' })
    }

    const email = process.env.ADMIN_EMAIL || 'admin@superpowersproject.org'
    const password = process.env.ADMIN_PASSWORD || 'changeme123'
    const name = process.env.ADMIN_NAME || 'Admin'

    const password_hash = await bcrypt.hash(password, 12)
    await pool.query(
      `INSERT INTO users (email, password_hash, name, role, school_name) VALUES ($1, $2, $3, 'admin', 'Superpowers Project')`,
      [email, password_hash, name]
    )

    res.status(201).json({ message: 'Admin account created', email })
  } catch (err) {
    next(err)
  }
})

module.exports = router
