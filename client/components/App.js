import React, { useState, useEffect, useRef } from 'react'
import AddNewBlog from './AddNewBlog'
import Blog from './Blog'
import Login from './Login'
import Notification from './Notification'
import Togglable from './Togglable'
import blogService from '../util/services/blogs'
import loginService from '../util/services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const addNewRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showMessage = (message) => {
    setInfoMessage(message)
    setTimeout(() => {
      setInfoMessage(null)
    }, 5000)
  }

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      showMessage('Error: Wrong username or password')
    }
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const addBlog = (blogObject) => {
    addNewRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })

    showMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
  }

  const endorseBlog = (id) => {
    const blog = blogs.find(blog => blog.id === id)
    console.log(id)
    console.log(blog)
    const changedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    console.log(changedBlog)

    blogService
      .change(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
  }

  const removeBlog = (id) => {
    const blog = blogs.find(blog => blog.id === id)
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      blogService
        .deleteBlog(id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id))
          setInfoMessage(`Removed ${blog.title} by ${blog.author}`)
        })
        .catch((error) => {
          if(error.response.status === 401) {
            setInfoMessage(error.response.data.error)
          } else {
            setInfoMessage(`Error: ${blog.title} by ${blog.author} was already removed`)
          }
        })
    }
  }

  const loginForm = () => (
    <div>
      <h2>Log in to the application</h2>
      <Login login={login}/>
    </div>
  )

  const blogsView = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={logout}>logout</button></p>
      <Togglable buttonLabel='add new' ref={addNewRef}>
        <AddNewBlog createBlog={addBlog} />
      </Togglable>
      <div id="blogList">
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog => <Blog
            key={blog.id}
            user={user}
            blog={blog}
            like={endorseBlog}
            remove={removeBlog}
          />)
        }
      </div>
    </div>
  )

  return (
    <div>
      <Notification message={infoMessage} />
      {user === null
        ? loginForm()
        : blogsView()
      }
    </div>
  )
}

export default App