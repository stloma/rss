
/* globals fetch, document */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default class Register extends React.Component {
  constructor() {
    super()

    this.state = ({
      user: []
    })
  }

  createUser = async (newUser) => {
    try {
      const response = await fetch('/api/registeruser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
      if (response.ok) {
        this.props.history.push('/login')
      } else {
        const alerts = await response.json()
        this.props.alert({ messages: alerts, type: 'danger' })
      }
    } catch (error) {
      this.props.alert({ messages: `Error in creating user: ${error}`, type: 'danger' })
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const form = document.forms.UserAdd
    if (form.password.value !== form.password2.value) {
      this.props.alert({ messages: 'Passwords do not match. Please try again', type: 'danger' })
    } else {
      this.createUser({
        username: form.username.value,
        password: form.password.value
      })
    }
  }

  cancel = () => {
    this.props.history.goBack()
  }

  render() {
    return (
      <div className='container well' id='register'>
        <form method='post' name='UserAdd' onSubmit={this.handleSubmit}>
          <fieldset>
            <legend>Register</legend>
            <div className='form-group'>
              <label htmlFor='username' className='control-label'>Username</label>
              <input
                type='text'
                className='form-control'
                name='username'
                id='username'
                placeholder='Username/Email'
              />
              <label htmlFor='password' className='control-label'>Password</label>
              <input
                type='password'
                className='form-control'
                name='password'
                id='password'
                placeholder='Password'
              />
              <label htmlFor='password2' className='control-label'>Re-enter password</label>
              <input
                type='password'
                className='form-control'
                name='password2'
                id='password2'
                placeholder='Password'
              />
              <div className='form-group'>
                <div className='form-button'>
                  <button type='submit' className='btn btn-primary'>Submit</button>
                </div>
              </div>
              <div className='center-text'>
                  Already have an account?  <Link to='/login'>Login</Link>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    )
  }
}

Register.propTypes = {
  history: PropTypes.object.isRequired,
  alert: PropTypes.func.isRequired
}
