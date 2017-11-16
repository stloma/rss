/* globals fetch, document */

import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'

export default class AddFeed extends React.Component {
  constructor() {
    super()
    this.state = {
      username: ''
    }
  }

  createFeed = async (newFeed) => {
    try {
      const response = await fetch('/api/feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeed),
        credentials: 'include'
      })
      if (response.ok) {
        this.props.loadFeeds()
        this.props.addFeed()
      } else {
        const errors = await response.json()
        this.setState({ errors })
      }
    } catch (err) { console.log(`Error in sending data to server: ${err.message}`) }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const form = document.forms.FeedAdd

    this.createFeed({
      name: form.name.value,
      url: form.url.value,
      category: form.category.value
    })
  }

  render() {
    return (
      <div>
        <Modal aria-labelledby='contained-modal-title-lg' onHide={this.props.addFeed} show>
          <Modal.Header closeButton>
            <Modal.Title>New Feed</Modal.Title>
          </Modal.Header>
          <div className='container' id='add-feed'>
            <form method='post' name='FeedAdd' onSubmit={this.handleSubmit}>
              <fieldset>
                <div className='form-group'>
                  <label htmlFor='name' className='control-label'>Name</label>
                  <input
                    type='text'
                    className='form-control'
                    name='name'
                    placeholder='Name'
                  />
                  <label htmlFor='url' className='control-label'>Url</label>
                  <input
                    type='text'
                    className='form-control'
                    name='url'
                    placeholder='cnn.com'
                  />
                  <select className='form-control' name='category' id='select'>
                    <option>-- Select Category --</option>
                    {this.props.categories}
                  </select>
                  <div className='form-group'>
                    <div className='form-button'>
                      <button
                        onClick={this.props.addFeed}
                        type='reset'
                        className='btn btn-black'
                      >
                            Cancel
                      </button>
                      <button type='submit' className='btn btn-primary'>Submit</button>
                    </div>
                  </div>
                  <div className='center-text' />
                </div>
              </fieldset>
            </form>
          </div>
        </Modal>
      </div>
    )
  }
}

AddFeed.propTypes = {
  addFeed: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  loadFeeds: PropTypes.func.isRequired
}
