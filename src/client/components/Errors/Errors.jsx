import React from 'react'
import { Alert, Button } from 'react-bootstrap'

export const Errors = props => (
  <div className='error'>
    {props.errors.map(error =>
      (<Alert key={error} bsStyle='danger' onDismiss={() => props.closeError(error)}>
        <h4>{error}</h4>
      </Alert>)
    )}
  </div>
)
