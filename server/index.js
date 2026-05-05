const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { errorHandler } = require('./middleware/errorHandler')
const authRoutes = require('./routes/auth')
const tagRoutes = require('./routes/tags')
const blogRoutes = require('./routes/blog')
const resourceRoutes = require('./routes/resources')
const subscriberRoutes = require('./routes/subscribers')
const emailRoutes = require('./routes/email')
const memberRoutes = require('./routes/members')
const uploadRoutes = require('./routes/uploads')

const app = express()
const PORT = process.env.PORT || 3001

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key-change-this') {
  console.error('FATAL: JWT_SECRET is not set (or still the placeholder). Refusing to start.')
  process.exit(1)
}

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin / curl / server-to-server (no Origin header).
      if (!origin) return cb(null, true)
      if (allowedOrigins.includes(origin)) return cb(null, true)
      cb(new Error(`CORS: origin ${origin} not allowed`))
    },
  })
)
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/tags', tagRoutes)
app.use('/api/blog', blogRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/subscribers', subscriberRoutes)
app.use('/api/email', emailRoutes)
app.use('/api/members', memberRoutes)
app.use('/api/uploads', uploadRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
