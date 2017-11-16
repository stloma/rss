/* globals fetch, window */

import { Glyphicon } from 'react-bootstrap'

import React from 'react'

const Logout = () => {
  const logout = async (event) => {
    event.preventDefault()
    window.location.replace('/login')
    const fetchData = {
      method: 'GET',
      credentials: 'include'
    }
    try {
      const response = await fetch('/api/logout', fetchData)
      if (response.status === 401) {
        console.log('401')
      } else if (response.status !== 200) {
        console.log(`Error: ${response.status}`)
      } else {
        console.log('logged out')
      }
    } catch (error) { console.log(`logout failure: ${error}`) }
  }

  return (
    <a onClick={logout} className='btn'><Glyphicon glyph='log-out' /> Logout</a>
  )
}

export default Logout
