const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let headers

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  for (let blog of helper.initialList) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

  const newUser = {
    username: 'testuser',
    name: 'Jester Tester',
    password: 'testaccess'
  }

  await api
    .post('/api/users')
    .send(newUser)

  const result = await api
    .post('/api/login')
    .send(newUser)

  headers = { 'Authorization': `bearer ${result.body.token}` }
})

describe('basic database and presentation properties', () => {
  test('all blog posts are returned as JSON', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialList.length)
  })

  test('unique identifier named as id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('addition of a new blog to the list', () => {
  test('a blog post is added', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialList.length + 1)

    const addedEntry = blogsAtEnd.find(blog => blog.title === 'Type wars')
    expect(addedEntry.author).toBe('Robert C. Martin')
    expect(addedEntry.url).toBe(
      'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    )
    expect(addedEntry.likes).toBe(2)
  })

  test('a blog post not added without authorization', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialList.length)
  })

  test('default value for likes is 0', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedEntry = blogsAtEnd.find(b => b.title === 'Type wars')
    expect(addedEntry.likes).toBe(0)
  })

  test('missing title or url gives status 400', async () => {
    let newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(400)

    newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(400)
  })
})

describe('modifying a blog in database', () => {
  test('increasing likes succeeds', async () => {
    const newBlog = {
      title: 'Great developer experience',
      author: 'Hector Ramos',
      url: 'https://jestjs.io/blog/2017/01/30/a-great-developer-experience',
      likes: 7
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)

    const blogToUpdate = result.body
    console.log(blogToUpdate)

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .set(headers)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const contents = blogsAtEnd.find(r => r.id === blogToUpdate.id)
    expect(contents.likes).toBe(8)
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const newBlog = {
      title: 'Great developer experience',
      author: 'Hector Ramos',
      url: 'https://jestjs.io/blog/2017/01/30/a-great-developer-experience',
      likes: 7
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = result.body

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set(headers)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const contents = blogsAtEnd.map(blog => blog.id)
    expect(contents).not.toContain(blogToDelete.id)
  })
})

afterAll(() => {
  mongoose.connection.close()
})