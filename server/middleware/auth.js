const jwt = require('jsonwebtoken')
const pool = require('../db/pool')

async function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const token = header.slice(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { rows } = await pool.query('SELECT id, email, name, role, member_status, can_blog, school_name, school_url, description FROM users WHERE id = $1', [decoded.id])
    if (rows.length === 0) return res.status(401).json({ error: 'User not found' })
    req.user = rows[0]
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }
    next()
  }
}

function requireApprovedMember(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' })
  if (req.user.role === 'admin') return next()
  if (req.user.role === 'member' && req.user.member_status === 'approved') return next()
  res.status(403).json({ error: 'Approved membership required' })
}

module.exports = { authenticate, requireRole, requireApprovedMember }
