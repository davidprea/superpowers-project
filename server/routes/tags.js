const router = require('express').Router()
const pool = require('../db/pool')
const { authenticate, requireRole } = require('../middleware/auth')

// Public: list all tags (needed for resource filtering)
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, name FROM tags ORDER BY name')
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// Admin: create tag
router.post('/', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { name } = req.body
    if (!name?.trim()) return res.status(400).json({ error: 'Tag name is required' })

    const { rows } = await pool.query(
      'INSERT INTO tags (name) VALUES ($1) RETURNING id, name',
      [name.trim()]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Tag already exists' })
    next(err)
  }
})

// Admin: delete tag
router.delete('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await pool.query('DELETE FROM tags WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
