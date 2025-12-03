const express = require('express')
const mongoose = require('mongoose')
const { MONGO_URI } = require('./utils/config.cjs')
const logger = require('./utils/logger.cjs')
const middleware = require('./utils/middleware.cjs')
const blogRouter = require('./controllers/blog-list.cjs')
const userRouter = require('./controllers/user.cjs')
const loginRouter = require('./controllers/login.cjs')

const app = express()

mongoose
  .connect(MONGO_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/blog-list', middleware.tokenExtractor, middleware.userExtractor, blogRouter)
app.use('/api/users', userRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app