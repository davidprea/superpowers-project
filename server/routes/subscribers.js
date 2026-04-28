const router = require('express').Router()
const pool = require('../db/pool')
const { authenticate, requireRole } = require('../middleware/auth')
const { sendConfirmation } = require('../services/emailService')

// Public: newsletter signup
router.post('/', async (req, res, next) => {
  try {
    const { first_name, last_name, organization, email } = req.body
    if (!first_name || !last_name || !organization || !email) {
      return res.status(400).json({ error: 'First name, last name, organization, and email are required' })
    }

    const existing = await pool.query('SELECT id FROM newsletter_subscribers WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'This email is already subscribed' })
    }

    const { rows } = await pool.query(
      `INSERT INTO newsletter_subscribers (first_name, last_name, organization, email)
       VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, organization, email, created_at`,
      [first_name.trim(), last_name.trim(), organization.trim(), email.trim().toLowerCase()]
    )
    sendConfirmation({ email: rows[0].email, first_name: rows[0].first_name }).catch(console.error)
    res.status(201).json(rows[0])
  } catch (err) {
    next(err)
  }
})

// Public: unsubscribe by email
router.post('/unsubscribe', async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })

    const { rowCount } = await pool.query(
      'DELETE FROM newsletter_subscribers WHERE email = $1',
      [email.trim().toLowerCase()]
    )
    if (rowCount === 0) return res.status(404).json({ error: 'Email not found' })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Admin: list all subscribers
router.get('/', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, first_name, last_name, organization, email, created_at FROM newsletter_subscribers ORDER BY created_at DESC'
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// Admin: get single subscriber with tags
router.get('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { rows: subscribers } = await pool.query(
      'SELECT id, first_name, last_name, organization, email, created_at FROM newsletter_subscribers WHERE id = $1',
      [req.params.id]
    )
    if (subscribers.length === 0) return res.status(404).json({ error: 'Subscriber not found' })

    const { rows: tags } = await pool.query(
      'SELECT t.id, t.name FROM tags t JOIN subscriber_tags st ON t.id = st.tag_id WHERE st.subscriber_id = $1',
      [req.params.id]
    )

    res.json({ ...subscribers[0], tags })
  } catch (err) {
    next(err)
  }
})

// Admin: update subscriber
router.patch('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { first_name, last_name, organization, email } = req.body
    await pool.query(
      `UPDATE newsletter_subscribers SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name),
       organization = COALESCE($3, organization), email = COALESCE($4, email) WHERE id = $5`,
      [first_name, last_name, organization, email, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Admin: delete subscriber
router.delete('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await pool.query('DELETE FROM newsletter_subscribers WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Admin: add tag to subscriber
router.post('/:id/tags', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await pool.query(
      'INSERT INTO subscriber_tags (subscriber_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.params.id, req.body.tag_id]
    )
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Admin: remove tag from subscriber
router.delete('/:id/tags/:tagId', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM subscriber_tags WHERE subscriber_id = $1 AND tag_id = $2',
      [req.params.id, req.params.tagId]
    )
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Admin: stats
router.get('/stats/count', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) AS total_subscribers FROM newsletter_subscribers')
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

module.exports = router
