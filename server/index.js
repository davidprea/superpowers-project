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

app.use(cors())
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
