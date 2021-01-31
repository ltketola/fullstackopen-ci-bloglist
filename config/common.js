const inProduction = process.env.NODE_ENV === 'production'
const inTest = process.env.NODE_ENV === 'test'

module.exports = {
  inProduction,
  inTest
}