const router = require('express').Router()
const pool = require('../db/pool')
const { authenticate, requireRole } = require('../middleware/auth')
const { sendBulkEmail } = require('../services/emailService')

router.use(authenticate, requireRole('admin'))

// Preview: get recipients for selected tags (empty = all subscribers)
router.post('/preview', async (req, res, next) => {
  try {
    const { tag_ids } = req.body
    let rows
    if (tag_ids?.length) {
      ;({ rows } = await pool.query(
        `SELECT DISTINCT ns.id, ns.email, ns.first_name, ns.last_name, ns.organization
         FROM newsletter_subscribers ns JOIN subscriber_tags st ON ns.id = st.subscriber_id
         WHERE st.tag_id = ANY($1) ORDER BY ns.last_name, ns.first_name`,
        [tag_ids]
      ))
    } else {
      ;({ rows } = await pool.query(
        `SELECT id, email, first_name, last_name, organization
         FROM newsletter_subscribers ORDER BY last_name, first_name`
      ))
    }
    res.json({ recipients: rows, recipient_count: rows.length })
  } catch (err) {
    next(err)
  }
})

// Send email to recipients (empty tags = all subscribers)
router.post('/send', async (req, res, next) => {
  try {
    const { tag_ids, subject, body } = req.body
    if (!subject || !body) {
      return res.status(400).json({ error: 'Subject and body are required' })
    }

    let rows
    if (tag_ids?.length) {
      ;({ rows } = await pool.query(
        `SELECT DISTINCT ns.email FROM newsletter_subscribers ns JOIN subscriber_tags st ON ns.id = st.subscriber_id WHERE st.tag_id = ANY($1)`,
        [tag_ids]
      ))
    } else {
      ;({ rows } = await pool.query('SELECT email FROM newsletter_subscribers'))
    }

    const emails = rows.map((r) => r.email)
    await sendBulkEmail({ emails, subject, body })

    await pool.query(
      'INSERT INTO email_log (subject, body, tag_ids, recipient_count) VALUES ($1, $2, $3, $4)',
      [subject, body, JSON.stringify(tag_ids || []), emails.length]
    )

    res.json({ success: true, recipient_count: emails.length })
  } catch (err) {
    next(err)
  }
})

// Get last news email date
router.get('/last-news-date', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT sent_at FROM email_log ORDER BY sent_at DESC LIMIT 1')
    res.json({ last_date: rows[0]?.sent_at || null })
  } catch (err) {
    next(err)
  }
})

module.exports = router
