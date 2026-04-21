const { Resend } = require('resend')

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@superpowersproject.org'
let resend = null

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

async function sendBulkEmail({ emails, subject, body }) {
  for (const email of emails) {
    await sendEmail({
      to: email,
      subject,
      html: `<div>${body.replace(/\n/g, '<br>')}</div>`,
    })
  }
}

module.exports = { sendEmail, sendBulkEmail }
