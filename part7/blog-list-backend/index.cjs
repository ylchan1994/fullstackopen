const app = require('./app.cjs') // the actual Express application
const { PORT } = require('./utils/config.cjs')
const logger = require('./utils/logger.cjs')

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})