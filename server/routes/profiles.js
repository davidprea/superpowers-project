const router = require('express').Router()
const pool = require('../db/pool')
const { authenticate, requireApprovedMember } = require('../middleware/auth')

// Public: list approved member profiles
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, school_name, school_url, description
       FROM users WHERE role IN ('member', 'admin') AND (member_status = 'approved' OR role = 'admin')
       ORDER BY school_name`
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// Get own profile
router.get('/me', authenticate, requireApprovedMember, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, school_name, school_url, description FROM users WHERE id = $1',
      [req.user.id]
    )
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

// Public: get single profile
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, school_name, school_url, description
       FROM users WHERE id = $1 AND role IN ('member', 'admin') AND (member_status = 'approved' OR role = 'admin')`,
      [req.params.id]
    )
    if (rows.length === 0) return res.status(404).json({ error: 'Profile not found' })
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

// Update own profile
router.patch('/me', authenticate, requireApprovedMember, async (req, res, next) => {
  try {
    const { name, school_name, school_url, description } = req.body
    await pool.query(
      `UPDATE users SET name = COALESCE($1, name), school_name = COALESCE($2, school_name),
       school_url = COALESCE($3, school_url), description = COALESCE($4, description),
       updated_at = NOW() WHERE id = $5`,
      [name, school_name, school_url, description, req.user.id]
    )
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
