const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    if(!request.token) {
      return response.status(401).json({ error: 'token missing' })
    }

    const blog = new Blog(request.body)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)

    if (blog.title === undefined) {
      return response.status(400).json({ error: 'title missing' })
    }

    if (blog.url === undefined) {
      return response.status(400).json({ error: 'url missing' })
    }

    if (!blog.likes) {
      blog.likes = 0
    }

    blog.user = user
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch(error) {
    return response.status(401).json({ error: 'invalid token' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    if(!request.token) {
      return response.status(401).json({ error: 'token missing' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)

    if(blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'only the creator of the blog entry can delete it' })
    }

    await blog.remove()
    user.blogs = user.blogs.filter(blog => blog.id.toString() !== request.params.id.toString())
    response.status(204).end()
  } catch(error) {
    return response.status(401).json({ error: 'invalid token' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter
