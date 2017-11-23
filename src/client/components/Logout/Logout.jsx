/* globals fetch, window */

import { Glyphicon } from 'react-bootstrap'
import PropTypes from 'prop-types'
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
      await fetch('/api/logout', fetchData)
    } catch (error) { console.log(error) }
  }

  return (
    <span onClick={logout} className='btn'><Glyphicon glyph='log-out' /> Logout</span>
  )
}

export default Logout
