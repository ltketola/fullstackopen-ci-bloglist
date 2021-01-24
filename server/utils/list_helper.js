const _ = require('lodash')

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  const reducer = (sum, item) => sum + item.likes
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const reducer = ((prev, current) => prev.likes > current.likes
    ? prev
    : current
  )

  const favorite = blogs.reduce(reducer)

  return {
    'title': favorite.title,
    'author': favorite.author,
    'likes': favorite.likes
  }
}

const mostBlogs = (blogs) => {
  const blogsByAuthor =_
    .chain(blogs)
    .groupBy('author')
    .map((value, key) => (
      { author: key, blogs: value.length }
    ))
    .value()

  const reducer = ((prev, current) => prev.blogs > current.blogs
    ? prev
    : current
  )

  return blogs.length === 0
    ? 'none'
    : blogsByAuthor.reduce(reducer)
}

const mostLikes = (blogs) => {
  const valueReducer = (sum, item) => sum + item.likes

  const likesByAuthor =_
    .chain(blogs)
    .groupBy('author')
    .map((value, key) => (
      { author: key, likes: value.reduce(valueReducer, 0) }
    ))
    .value()


  const reducer = ((prev, current) => prev.likes > current.likes
    ? prev
    : current
  )

  return blogs.length === 0
    ? 'none'
    : likesByAuthor.reduce(reducer)
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}