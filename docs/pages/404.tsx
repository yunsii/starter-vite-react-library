import React from 'react'
import { useHistory } from 'react-router-dom'

const Component404 = () => {
  const history = useHistory()

  return (
    <div>
      <h1>404</h1>
      <p>Page not found</p>
      <button onClick={() => history.replace('/')}>Home</button>
    </div>
  )
}

export default Component404
