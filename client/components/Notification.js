import React from 'react'

const Notification = ({ message }) => {
  let notificationColor = 'green'

  if (message !== null &&
    (message.startsWith('Error: ') ||
    message.includes('alidation failed'))) {
    notificationColor = 'red'
  }

  const messageStyle = {
    color: notificationColor,
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (message === null) {
    return null
  }

  return (
    <div className="error" style={messageStyle}>
      {message}
    </div>
  )
}

export default Notification