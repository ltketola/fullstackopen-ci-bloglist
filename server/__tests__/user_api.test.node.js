const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
})

describe('creating a new user', () => {
  test('creating a user in compliance with restrictions succeeds', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'smuggler',
      name: 'Han Solo',
      password: 'universe'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already in use', async () => {
    const newUser = {
      username: 'root',
      name: 'Andy Admin',
      password: 'sekret',
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')
  })

  test('creation fails with proper statuscode and message if username length is less than 3 characters', async () => {
    const newUser = {
      username: 'ro',
      name: 'Andy Admin',
      password: 'sekret',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('is shorter than the minimum allowed length (3)')

  })

  test('creation fails with proper statuscode and message if password length is less than 3 characters', async () => {
    const newUser = {
      username: 'casualuser',
      name: 'John Doe',
      password: 'se',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password length must be at least 3 characters')

  })
})

afterAll(() => {
  mongoose.connection.close()
})