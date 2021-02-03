require('dotenv').config()
const common = require('../../config/common')

let PORT = process.env.PORT || 5000
let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
  ...common,
  MONGODB_URI,
  PORT
}