/* globals fetch, window */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: ''
    }
  }

  handleInputChange = (event) => {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const data = `username=${this.state.username}&password=${this.state.password}`
    const fetchData = {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: data
    }
    try {
      const response = await fetch('/api/login', fetchData)
      if (response.ok) {
        window.location.replace('/')
      } else if (response.status === 401) {
        this.props.alert({ messages: 'Username or password incorrect', type: 'danger' })
      } else if (response.status === 400) {
        this.props.alert({ messages: 'Please enter a username and password', type: 'danger' })
      } else {
        this.props.alert({ messages: `Login failed with code: ${response.status}`, type: 'danger' })
      }
    } catch (error) { this.props.alert({ messages: `Login failed: ${error}`, type: 'danger' }) }
  }

  render() {
    return (
      <div className='container well' id='login'>
        <form method='POST' action='/api/login' name='Login' onSubmit={this.handleSubmit}>
          <fieldset>
            <legend>Login</legend>
            <div className='form-group'>
              <label htmlFor='username'>Username:</label>
              <input
                autoFocus
                onChange={this.handleInputChange}
                onSubmit={this.handleSubmit}
                type='text'
                className='form-control'
                name='username'
                value={this.state.username}
                placeholder='username'
                id='username'
              />
              <label htmlFor='password'>Password:</label>
              <input
                onChange={this.handleInputChange}
                type='password'
                className='form-control'
                name='password'
                placeholder='password'
                id='password'
              />
              <div className='form-group'>
                <div className='form-button'>
                  <button type='submit' className='btn btn-primary'>Submit</button>
                </div>
              </div>
            </div>
            <div className='center-text'>
                Don&apos;t have an account?  <Link to='/register'>Register</Link>
            </div>
          </fieldset>
        </form>
      </div>
    )
  }
}

Login.propTypes = {
  alert: PropTypes.func.isRequired
}
