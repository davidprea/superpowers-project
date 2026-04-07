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

async function notifyAdminNewMember(user) {
  const adminEmails = await getAdminEmails()
  if (adminEmails.length === 0) return

  await sendEmail({
    to: adminEmails,
    subject: 'New Member Application - Superpowers Project',
    html: `
      <h2>New Member Application</h2>
      <p><strong>${user.name}</strong> from <strong>${user.school_name || 'Unknown School'}</strong> has applied for full membership.</p>
      <p>Email: ${user.email}</p>
      <p>Please log in to the admin panel to review this application.</p>
    `,
  })
}

async function notifyApproval(user) {
  await sendEmail({
    to: user.email,
    subject: 'Membership Approved - Superpowers Project',
    html: `
      <h2>Welcome to the Superpowers Project!</h2>
      <p>Hi ${user.name},</p>
      <p>Your membership application has been approved. You now have full access to the members area, including the resource library and member directory.</p>
      <p>Log in to get started!</p>
    `,
  })
}

async function notifyRejection(user) {
  await sendEmail({
    to: user.email,
    subject: 'Membership Application Update - Superpowers Project',
    html: `
      <h2>Application Update</h2>
      <p>Hi ${user.name},</p>
      <p>Thank you for your interest in the Superpowers Project. After review, we are unable to approve your membership application at this time.</p>
      <p>If you have questions, please reach out to us.</p>
    `,
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

async function getAdminEmails() {
  const pool = require('../db/pool')
  const { rows } = await pool.query("SELECT email FROM users WHERE role = 'admin'")
  return rows.map((r) => r.email)
}

module.exports = { sendEmail, notifyAdminNewMember, notifyApproval, notifyRejection, sendBulkEmail }
