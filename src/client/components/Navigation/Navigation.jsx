/* globals window */

import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, Button, FormGroup, Glyphicon, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import ConfirmRead from '../ConfirmRead/ConfirmRead'

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
          </Nav>
          <Navbar.Form pullRight>
            <FormGroup>
              <FormControl type='text' placeholder='Search' />
            </FormGroup>
            {' '}
            <Button type='submit'>Submit</Button>
          </Navbar.Form>
          <Nav pullRight>
            <NavItem onClick={this.markRead}><Glyphicon glyph='ok' /> Mark as Read</NavItem>
            <NavDropdown eventKey={3} title='Action' id='basic-nav-dropdown'>
              <MenuItem eventKey={3.1}>Action</MenuItem>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>Separated link</MenuItem>
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
    )
  }
}

Navigation.propTypes = {
  markRead: PropTypes.func.isRequired,
  selectedFeed: PropTypes.object.isRequired,
  toggleSidebar: PropTypes.func.isRequired
}
