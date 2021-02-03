const healthRouter = require('express').Router()

healthRouter.get('/', async (request, response) => {
  response.send('ok')
})

module.exports = healthRouter