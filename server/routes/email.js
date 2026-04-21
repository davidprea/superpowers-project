const router = require('express').Router()
const pool = require('../db/pool')
const { authenticate, requireRole } = require('../middleware/auth')
const { sendBulkEmail } = require('../services/emailService')

router.use(authenticate, requireRole('admin'))

// Preview: get recipient count for selected tags
router.post('/preview', async (req, res, next) => {
  try {
    const { tag_ids } = req.body
    if (!tag_ids?.length) return res.status(400).json({ error: 'Select at least one tag' })

    const { rows } = await pool.query(
      `SELECT COUNT(DISTINCT ns.id) AS recipient_count
       FROM newsletter_subscribers ns JOIN subscriber_tags st ON ns.id = st.subscriber_id
       WHERE st.tag_id = ANY($1)`,
      [tag_ids]
    )
    res.json({ recipient_count: parseInt(rows[0].recipient_count) })
  } catch (err) {
    next(err)
  }
})

// Send email to tagged recipients
router.post('/send', async (req, res, next) => {
  try {
    const { tag_ids, subject, body } = req.body
    if (!tag_ids?.length || !subject || !body) {
      return res.status(400).json({ error: 'Tags, subject, and body are required' })
    }

    const { rows: recipients } = await pool.query(
      `SELECT DISTINCT ns.email FROM newsletter_subscribers ns JOIN subscriber_tags st ON ns.id = st.subscriber_id WHERE st.tag_id = ANY($1)`,
      [tag_ids]
    )

    const emails = recipients.map((r) => r.email)
    await sendBulkEmail({ emails, subject, body })

    await pool.query(
      'INSERT INTO email_log (subject, body, tag_ids, recipient_count) VALUES ($1, $2, $3, $4)',
      [subject, body, JSON.stringify(tag_ids), emails.length]
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
