/* globals window */

import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, Button, FormGroup, Glyphicon, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import ConfirmRead from '../ConfirmRead/ConfirmRead'
import Alerts from '../Alerts/Alerts'
import Logout from '../Logout/Logout'

export default class Navigation extends React.Component {
  constructor() {
    super()
    this.state = {
      articles: '',
      status: '',
      favorites: [],
      confirmRead: false
    }
  }

  markRead = (confirm) => {
    this.setState({ confirmRead: !this.state.confirmRead })
    if (confirm.confirm) {
      this.props.markRead()
    }
  }

  render() {
    return (
      <div>
        <Navbar
          fixedTop collapseOnSelect className='navbar-light bg-light'
        >
          <Navbar.Header>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem onClick={() => window.location.reload()}>
                <Glyphicon glyph='refresh' /> Refresh </NavItem>
              <NavItem onClick={this.markRead}><Glyphicon glyph='ok' /> Mark as Read</NavItem>
            </Nav>
            <Nav pullRight>
              <NavDropdown eventKey={3} title='Account' id='basic-nav-dropdown'>
                <MenuItem><Logout /></MenuItem>
                {/* <MenuItem eventKey={3.3}>Change Password</MenuItem> */}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          {this.state.confirmRead &&
          <ConfirmRead
            markRead={this.markRead}
            selectedFeed={this.props.selectedFeed}
            Fade
            Transition
          />
          }
        </Navbar>
        {this.props.alerts.messages.length > 0 &&
          <Alerts clearAlert={this.props.clearAlert} alerts={this.props.alerts} />
        }
      </div>
    )
  }
}

Navigation.propTypes = {
  markRead: PropTypes.func.isRequired,
  selectedFeed: PropTypes.object.isRequired,
  clearAlert: PropTypes.func.isRequired,
  alerts: PropTypes.object.isRequired
}
