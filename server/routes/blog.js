const router = require('express').Router()
const pool = require('../db/pool')
const { authenticate, requireRole } = require('../middleware/auth')

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Public: list published posts
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT bp.id, bp.title, bp.slug, bp.content, bp.published_at, u.name AS author_name
       FROM blog_posts bp LEFT JOIN users u ON bp.author_id = u.id
       WHERE bp.approval_status = 'approved' AND bp.published_at IS NOT NULL
       ORDER BY bp.published_at DESC`
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// Admin: list all posts
router.get('/admin', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { status } = req.query
    let query = `SELECT bp.id, bp.title, bp.slug, bp.approval_status, bp.created_at, bp.published_at, u.name AS author_name
       FROM blog_posts bp LEFT JOIN users u ON bp.author_id = u.id`
    const params = []

    if (status) {
      params.push(status)
      query += ` WHERE bp.approval_status = $${params.length}`
    }
    query += ' ORDER BY bp.created_at DESC'

    const { rows } = await pool.query(query, params)
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// Admin: get single post for editing
router.get('/admin/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Post not found' })
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

// Public: get single post by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT bp.id, bp.title, bp.slug, bp.content, bp.published_at, u.name AS author_name
       FROM blog_posts bp LEFT JOIN users u ON bp.author_id = u.id
       WHERE bp.slug = $1 AND bp.approval_status = 'approved'`,
      [req.params.slug]
    )
    if (rows.length === 0) return res.status(404).json({ error: 'Post not found' })
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

// Admin: create post
router.post('/', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { title, content, approval_status } = req.body
    if (!title) return res.status(400).json({ error: 'Title is required' })

    let slug = slugify(title)
    const existing = await pool.query('SELECT id FROM blog_posts WHERE slug = $1', [slug])
    if (existing.rows.length > 0) slug += '-' + Date.now()

    const status = approval_status || 'draft'
    const published_at = status === 'approved' ? new Date() : null

    const { rows } = await pool.query(
      `INSERT INTO blog_posts (author_id, title, slug, content, approval_status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, title, slug, content || '', status, published_at]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    next(err)
  }
})

// Admin: update post
router.patch('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { title, content, approval_status } = req.body
    const { rows: posts } = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [req.params.id])
    if (posts.length === 0) return res.status(404).json({ error: 'Post not found' })

    const post = posts[0]
    const newStatus = approval_status || post.approval_status
    const published_at = newStatus === 'approved' && !post.published_at ? new Date() : post.published_at

    await pool.query(
      `UPDATE blog_posts SET title = COALESCE($1, title), content = COALESCE($2, content),
       approval_status = $3, published_at = $4, updated_at = NOW() WHERE id = $5`,
      [title, content, newStatus, published_at, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Approve post
router.post('/:id/approve', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await pool.query(
      `UPDATE blog_posts SET approval_status = 'approved', published_at = COALESCE(published_at, NOW()), updated_at = NOW() WHERE id = $1`,
      [req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Reject post
router.post('/:id/reject', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await pool.query(
      `UPDATE blog_posts SET approval_status = 'rejected', updated_at = NOW() WHERE id = $1`,
      [req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Delete post
router.delete('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await pool.query('DELETE FROM blog_posts WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
