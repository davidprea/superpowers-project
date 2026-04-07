const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../db/pool')
const { authenticate } = require('../middleware/auth')
const { notifyAdminNewMember } = require('../services/emailService')

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, role, school_name, school_url } = req.body

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Email, password, name, and role are required' })
    }
    if (!['observer', 'member'].includes(role)) {
      return res.status(400).json({ error: 'Role must be observer or member' })
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const password_hash = await bcrypt.hash(password, 12)
    const member_status = role === 'member' ? 'pending' : null

    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, name, role, member_status, school_name, school_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, name, role, member_status, can_blog, school_name, school_url, description`,
      [email, password_hash, name, role, member_status, school_name || null, school_url || null]
    )

    const user = rows[0]
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    if (role === 'member') {
      notifyAdminNewMember(user).catch(console.error)
    }

    res.status(201).json({ token, user })
  } catch (err) {
    next(err)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { rows } = await pool.query(
      'SELECT id, email, password_hash, name, role, member_status, can_blog, school_name, school_url, description FROM users WHERE email = $1',
      [email]
    )
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = rows[0]
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    delete user.password_hash

    res.json({ token, user })
  } catch (err) {
    next(err)
  }
})

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user })
})

module.exports = router
