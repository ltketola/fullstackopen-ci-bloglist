const { MONGODB_URI } = require('./util/common')
const express = require('express')
require('express-async-errors')
const cors = require('cors')
const logger = require('./util/logger')
const middleware = require('./middleware/middleware')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')

const app = express()

mongoose.set('useCreateIndex', true)

logger.info('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then (() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error in connection to MongoDB', error.message)
  })
mongoose.set('useFindAndModify', false)

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
