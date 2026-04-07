const router = require('express').Router()
const pool = require('../db/pool')
const { authenticate, requireRole } = require('../middleware/auth')
const { notifyApproval, notifyRejection } = require('../services/emailService')

router.use(authenticate)

// Stats for admin dashboard
router.get('/stats', requireRole('admin'), async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total_users,
        COUNT(*) FILTER (WHERE role = 'member' AND member_status = 'pending') AS pending_members,
        (SELECT COUNT(*) FROM blog_posts WHERE approval_status = 'pending') AS pending_posts,
        (SELECT COUNT(*) FROM resources WHERE approval_status = 'pending') AS pending_resources
      FROM users
    `)
    res.json(result.rows[0])
  } catch (err) {
    next(err)
  }
})

// List users
router.get('/', requireRole('admin'), async (req, res, next) => {
  try {
    const { role, status } = req.query
    let query = 'SELECT id, email, name, role, member_status, can_blog, school_name, school_url, created_at FROM users WHERE 1=1'
    const params = []

    if (role) {
      params.push(role)
      query += ` AND role = $${params.length}`
    }
    if (status) {
      params.push(status)
      query += ` AND member_status = $${params.length}`
    }

    query += ' ORDER BY created_at DESC'
    const { rows } = await pool.query(query, params)
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// Get single user with tags
router.get('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const { rows: users } = await pool.query(
      'SELECT id, email, name, role, member_status, can_blog, school_name, school_url, description, created_at FROM users WHERE id = $1',
      [req.params.id]
    )
    if (users.length === 0) return res.status(404).json({ error: 'User not found' })

    const { rows: tags } = await pool.query(
      'SELECT t.id, t.name FROM tags t JOIN user_tags ut ON t.id = ut.tag_id WHERE ut.user_id = $1',
      [req.params.id]
    )

    res.json({ ...users[0], tags })
  } catch (err) {
    next(err)
  }
})

// Update user
router.patch('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const { name, role, can_blog, school_name, school_url, description } = req.body
    await pool.query(
      `UPDATE users SET name = COALESCE($1, name), role = COALESCE($2, role), can_blog = COALESCE($3, can_blog),
       school_name = COALESCE($4, school_name), school_url = COALESCE($5, school_url), description = COALESCE($6, description),
       updated_at = NOW() WHERE id = $7`,
      [name, role, can_blog, school_name, school_url, description, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Approve member
router.post('/:id/approve', requireRole('admin'), async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `UPDATE users SET member_status = 'approved', updated_at = NOW() WHERE id = $1 AND role = 'member'
       RETURNING id, email, name, role, member_status`,
      [req.params.id]
    )
    if (rows.length === 0) return res.status(404).json({ error: 'User not found or not a member' })

    notifyApproval(rows[0]).catch(console.error)
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

// Reject member
router.post('/:id/reject', requireRole('admin'), async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `UPDATE users SET member_status = 'rejected', updated_at = NOW() WHERE id = $1 AND role = 'member'
       RETURNING id, email, name, role, member_status`,
      [req.params.id]
    )
    if (rows.length === 0) return res.status(404).json({ error: 'User not found or not a member' })

    notifyRejection(rows[0]).catch(console.error)
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

// Add tag to user
router.post('/:id/tags', requireRole('admin'), async (req, res, next) => {
  try {
    await pool.query('INSERT INTO user_tags (user_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [req.params.id, req.body.tag_id])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Remove tag from user
router.delete('/:id/tags/:tagId', requireRole('admin'), async (req, res, next) => {
  try {
    await pool.query('DELETE FROM user_tags WHERE user_id = $1 AND tag_id = $2', [req.params.id, req.params.tagId])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
