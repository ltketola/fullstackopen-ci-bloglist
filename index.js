require('dotenv').config()
require('module-alias/register')
const http = require('http')
const app = require('./server/app')
const logger = require('@util/logger')
const { PORT } = require('@util/common')

const server = http.createServer(app)

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})