import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Login = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const userLogin = (event) => {
    event.preventDefault()
    login(username, password)

    setUsername('')
    setPassword('')
  }


  return (
    <form id="loginForm" onSubmit={userLogin}>
      <div>
        Username
        <input
          type="text"
          id="username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input
          type="password"
          id="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <div>
        <button id="submitLogin" type="submit">login</button>
      </div>
    </form>
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired
}

export default Login