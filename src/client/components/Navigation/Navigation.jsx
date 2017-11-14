/* globals window */

import React from 'react'
import PropTypes from 'prop-types'
import { Glyphicon } from 'react-bootstrap'
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
      <div>
        {this.state.confirmRead &&
        <ConfirmRead
          markRead={this.markRead}
          selectedFeed={this.props.selectedFeed}
          Fade
          Transition
        />
        }
        <nav className='navbar navbar-default navbar-fixed-top'>
          <div className='container-fluid'>
            <div className='navbar-header'>
              <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#bs-example-navbar-collapse-2'>
                <span className='sr-only'>Toggle navigation</span>
                <span className='icon-bar' />
                <span className='icon-bar' />
                <span className='icon-bar' />
              </button>
            </div>
            <div className='collapse navbar-collapse' id='bs-example-navbar-collapse-2'>
              <ul className='nav navbar-nav'>
                <li className='pointer'><a onClick={() => window.location.reload()} className='navbar-link'><Glyphicon glyph='refresh' /> Refresh</a></li>
              </ul>
              <ul className='nav navbar-nav navbar-right'>
                <li><a onClick={this.markRead} className='navbar-link'><Glyphicon glyph='ok' /> Mark as Read</a></li>
                <li className='dropdown'>
                  <a className='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>Actions <span className='caret' /></a>
                  <ul className='dropdown-menu' role='menu'>
                    <li><a>Action</a></li>
                    <li><a>Another action</a></li>
                    <li><a>Something else here</a></li>
                    <li className='divider' />
                    <li><a>Separated link</a></li>
                    <li className='divider' />
                    <li><a>One more separated link</a></li>
                  </ul>
                </li>
                <li>
                  <form className='navbar-form' role='search'>
                    <div className='form-group'>
                      <input type='text' className='form-control' placeholder='Search' />
                    </div>
                    <button type='submit' className='btn btn-default'>Submit</button>
                  </form>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

Navigation.propTypes = {
  markRead: PropTypes.func.isRequired,
  selectedFeed: PropTypes.object.isRequired
}
