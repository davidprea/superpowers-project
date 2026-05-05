const { Resend } = require('resend')
const { sign: signUnsubscribe } = require('./unsubscribeToken')

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@superpowersproject.org'
const SITE_URL = process.env.SITE_URL || 'http://localhost:5173'
let resend = null

function unsubscribeUrl(email) {
  const token = signUnsubscribe(email)
  return `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`
}

async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL STUB] To: ${to}, Subject: ${subject}`)
    return
  }

  if (!resend) resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  })
}

async function sendConfirmation({ email, first_name }) {
  const unsubUrl = unsubscribeUrl(email)
  await sendEmail({
    to: email,
    subject: 'Welcome to the Superpowers Project Newsletter',
    html: `
      <h2>Thanks for subscribing!</h2>
      <p>Hi ${first_name},</p>
      <p>You've been added to the Superpowers Project newsletter. You'll receive updates about our consortium's work in AI-based student portfolio assessment.</p>
      <p style="margin-top: 2em; font-size: 12px; color: #666;">
        <a href="${unsubUrl}">Unsubscribe</a> from this newsletter.
      </p>
    `,
  })
}

async function sendBulkEmail({ emails, subject, body }) {
  for (const email of emails) {
    const unsubUrl = unsubscribeUrl(email)
    await sendEmail({
      to: email,
      subject,
      html: `<div>${body.replace(/\n/g, '<br>')}</div>
        <p style="margin-top: 2em; font-size: 12px; color: #666;">
          <a href="${unsubUrl}">Unsubscribe</a> from this newsletter.
        </p>`,
    })
  }
}

module.exports = { sendEmail, sendConfirmation, sendBulkEmail }
