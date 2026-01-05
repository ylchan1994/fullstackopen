const logger = require('./logger.cjs')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error('Error happens: ', error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

const tokenExtractor = async (request, response, next) => {
  if (request.method === 'GET' && request.path === '/') return next()
  let token = request.get('authorization')
  if (token && token.startsWith('Bearer ')) {
    token = token.replace('Bearer ', '')
  } else {
    return response.status(401).json({ error: 'Missing Token. Authorization must start with Bearer' })
  }
  request.token = token
  next()
}

const userExtractor = async (request, response, next) => {
  if (request.method === 'GET' && request.path === '/') return next()
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  request.user = decodedToken.id
  next()
}

const responseLogger = (req, res, next) => {

  res.on('finish', () => {
    const { method, originalUrl } = req
    const status = res.statusCode

    logger.info('Method:', method)
    logger.info('Path:  ', originalUrl)
    logger.info('Status:  ', status)
    logger.info('---')
    next()
  })

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor,
  tokenExtractor,
  responseLogger
}
