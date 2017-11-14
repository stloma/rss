/* globals fetch */
import { Glyphicon } from 'react-bootstrap'

import React from 'react'

export const Logout = () => {
  const logout = (event) => {
    event.preventDefault()
    window.location.replace('/login')
    const fetchData = {
      method: 'GET',
      credentials: 'include'
    }
    fetch('/api/logout', fetchData)
      .then((res) => {
        if (res.status === 401) {
          console.log('401')
        } else if (res.status !== 200) {
          console.log(`Error: ${res.status}`)
        } else {
          console.log('logged out')
        }
      })
      .catch(error => console.log(`logout failure: ${error}`))
  }

  return (
    <a onClick={logout} className='btn'><Glyphicon glyph='log-out' /> Logout</a>
  )
}
