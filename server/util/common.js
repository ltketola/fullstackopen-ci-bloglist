require('dotenv').config()
const common = require('@root/config/common')

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
  ...common,
  MONGODB_URI,
  PORT
}