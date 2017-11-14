import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-bootstrap'

const Errors = props => (
  <div className='error'>
    {props.errors.map(error =>
      (<Alert key={error} bsStyle='danger' onDismiss={() => props.closeError(error)}>
        <h4>{error}</h4>
      </Alert>)
    )}
  </div>
)

Errors.propTypes = {
  errors: PropTypes.array.isRequired
}

export default Errors
