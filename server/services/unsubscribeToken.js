const crypto = require('crypto')

function sign(email) {
  const secret = process.env.JWT_SECRET
  return crypto
    .createHmac('sha256', secret)
    .update(email.trim().toLowerCase())
    .digest('base64url')
}

function verify(email, token) {
  if (!email || !token) return false
  const expected = sign(email)
  const a = Buffer.from(expected)
  const b = Buffer.from(token)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

module.exports = { sign, verify }
