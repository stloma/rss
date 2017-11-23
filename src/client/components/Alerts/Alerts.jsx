import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-bootstrap'

const Alerts = (props) => {
  // Avoids eslint no-unused-prop-types false positives on stateless functional components
  const { clearAlert } = props
  const path = window.location.pathname
  const errorClass = path === '/' ? 'error-sidebar' : 'error'
  const errorContainer = path === '/' ? 'error-container' : ''
  return (
    <div className={errorContainer}>
      <div className={errorClass}>
        {props.alerts.messages.map(alert =>
          (<Alert key={`${alert}`} bsStyle={props.alerts.type} onDismiss={() => clearAlert(alert)}>
            <h4>{alert}</h4>
          </Alert>)
        )}
      </div>
    </div>
  )
}

Alerts.propTypes = {
  alerts: PropTypes.object.isRequired,
  clearAlert: PropTypes.func.isRequired
}

export default Alerts
