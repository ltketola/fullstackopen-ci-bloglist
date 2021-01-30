import React, { useState } from 'react'

const Blog = ({ user, blog, like, remove }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const viewBasic = () => (
    <div style={blogStyle} className="basicDiv">
      {blog.title} by {blog.author} <button id="getDetails" onClick={() => setShowDetails(true)} className="showDetails">view</button>
    </div>
  )

  const viewDetails = () => (
    <div style={blogStyle} className="detailsDiv">
      <div>
        {blog.title} by {blog.author} <button onClick={() => setShowDetails(false)}>hide</button>
      </div>
      <div>{blog.url}</div>
      <div>likes {blog.likes} <button id="like" onClick={() => like(blog.id)} className="addLike">like</button></div>
      <div>{blog.user.name}</div>
      {blog.user.username === user.username
        ? <button
          id="remove"
          onClick={() => remove(blog.id)}
          style={{ backgroundColor: 'blue', color: 'white' }}
        >
              remove
        </button>
        : <div></div>
      }
    </div>
  )

  return (
    <div>
      {showDetails === false
        ? viewBasic()
        : viewDetails()
      }
    </div>
  )
}

export default Blog