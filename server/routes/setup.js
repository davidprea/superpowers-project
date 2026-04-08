const router = require('express').Router()
const bcrypt = require('bcryptjs')
const pool = require('../db/pool')

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
    if (rows.length > 0) {
      return res.json({ success: false, message: 'Admin already exists' })
    }

    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    const name = process.env.ADMIN_NAME

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME environment variables are required' })
    }

    const password_hash = await bcrypt.hash(password, 12)
    await pool.query(
      `INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, 'admin')`,
      [email, password_hash, name]
    )

    res.status(201).json({ success: true, message: 'Admin created' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
