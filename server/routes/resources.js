const router = require('express').Router()
const pool = require('../db/pool')
const { authenticate, requireRole, requireApprovedMember } = require('../middleware/auth')

// Helper: attach tags to resources
async function attachTags(resources) {
  if (resources.length === 0) return resources
  const ids = resources.map((r) => r.id)
  const { rows: tagRows } = await pool.query(
    `SELECT rt.resource_id, t.id, t.name FROM resource_tags rt JOIN tags t ON rt.tag_id = t.id WHERE rt.resource_id = ANY($1)`,
    [ids]
  )
  return resources.map((r) => ({
    ...r,
    tags: tagRows.filter((t) => t.resource_id === r.id).map(({ id, name }) => ({ id, name })),
  }))
}

// Members: list approved resources
router.get('/', authenticate, requireApprovedMember, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.title, r.description, r.url, r.created_at, u.name AS submitter_name
       FROM resources r LEFT JOIN users u ON r.submitter_id = u.id
       WHERE r.approval_status = 'approved' ORDER BY r.created_at DESC`
    )
    res.json(await attachTags(rows))
  } catch (err) {
    next(err)
  }
})

// Admin: list all resources
router.get('/admin', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { status } = req.query
    let query = `SELECT r.id, r.title, r.description, r.url, r.approval_status, r.created_at, u.name AS submitter_name
       FROM resources r LEFT JOIN users u ON r.submitter_id = u.id`
    const params = []
    if (status) {
      params.push(status)
      query += ` WHERE r.approval_status = $${params.length}`
    }
    query += ' ORDER BY r.created_at DESC'
    const { rows } = await pool.query(query, params)
    res.json(await attachTags(rows))
  } catch (err) {
    next(err)
  }
})

// Submit resource
router.post('/', authenticate, requireApprovedMember, async (req, res, next) => {
  try {
    const { title, description, url } = req.body
    if (!title || !url) return res.status(400).json({ error: 'Title and URL are required' })

    const status = req.user.role === 'admin' ? 'approved' : 'pending'
    const { rows } = await pool.query(
      `INSERT INTO resources (submitter_id, title, description, url, approval_status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, title, description || '', url, status]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    next(err)
  }
})

// Update resource
router.patch('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { title, description, url } = req.body
    await pool.query(
      `UPDATE resources SET title = COALESCE($1, title), description = COALESCE($2, description),
       url = COALESCE($3, url), updated_at = NOW() WHERE id = $4`,
      [title, description, url, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Approve resource
router.post('/:id/approve', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await pool.query(`UPDATE resources SET approval_status = 'approved', updated_at = NOW() WHERE id = $1`, [req.params.id])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Reject resource
router.post('/:id/reject', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await pool.query(`UPDATE resources SET approval_status = 'rejected', updated_at = NOW() WHERE id = $1`, [req.params.id])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Delete resource
router.delete('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await pool.query('DELETE FROM resources WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Add tag to resource
router.post('/:id/tags', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await pool.query('INSERT INTO resource_tags (resource_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [req.params.id, req.body.tag_id])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Remove tag from resource
router.delete('/:id/tags/:tagId', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await pool.query('DELETE FROM resource_tags WHERE resource_id = $1 AND tag_id = $2', [req.params.id, req.params.tagId])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
