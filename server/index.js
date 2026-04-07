const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { errorHandler } = require('./middleware/errorHandler')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const tagRoutes = require('./routes/tags')
const blogRoutes = require('./routes/blog')
const resourceRoutes = require('./routes/resources')
const profileRoutes = require('./routes/profiles')
const emailRoutes = require('./routes/email')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/setup', require('./routes/setup'))
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/tags', tagRoutes)
app.use('/api/blog', blogRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/profiles', profileRoutes)
app.use('/api/email', emailRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
