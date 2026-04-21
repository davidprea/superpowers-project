const router = require('express').Router()
const pool = require('../db/pool')
const { authenticate, requireRole } = require('../middleware/auth')

// Public: list all member schools
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, school_name, location, logo_url, link, description FROM member_schools ORDER BY display_order, school_name'
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// Admin: get single member school
router.get('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM member_schools WHERE id = $1', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Member school not found' })
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

// Admin: create member school
router.post('/', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { school_name, location, logo_url, link, description, display_order } = req.body
    if (!school_name || !location || !logo_url) {
      return res.status(400).json({ error: 'School name, location, and logo URL are required' })
    }

    const { rows } = await pool.query(
      `INSERT INTO member_schools (school_name, location, logo_url, link, description, display_order)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [school_name, location, logo_url, link || null, description || null, display_order || 0]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    next(err)
  }
})

// Admin: update member school
router.patch('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { school_name, location, logo_url, link, description, display_order } = req.body
    await pool.query(
      `UPDATE member_schools SET school_name = COALESCE($1, school_name), location = COALESCE($2, location),
       logo_url = COALESCE($3, logo_url), link = $4, description = $5,
       display_order = COALESCE($6, display_order) WHERE id = $7`,
      [school_name, location, logo_url, link ?? null, description ?? null, display_order, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Admin: delete member school
router.delete('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await pool.query('DELETE FROM member_schools WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
