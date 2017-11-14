/* globals fetch */

import React from 'react'
import { Modal } from 'react-bootstrap'

export default class AddFeed extends React.Component {
  constructor() {
    super()
    this.state = {
      username: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  createFeed(newFeed) {
    fetch('/api/feeds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFeed),
      credentials: 'include'
    })
      .then((response) => {
        if (response.ok) {
          this.props.loadFeeds()
          this.props.addFeed()
        } else {
          response.json().then((errors) => {
            this.setState({ errors })
          })
        }
      })
      .catch((err) => {
        console.log(`Error in sending data to server: ${err.message}`)
      })
  }

  handleSubmit(event) {
    event.preventDefault()
    const form = document.forms.FeedAdd

    this.createFeed({
      name: form.name.value,
      url: form.url.value,
      category: form.category.value,
      _id: this.props._id
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
                  <label className='control-label'>Name</label>
                  <input
                    type='text'
                    className='form-control'
                    name='name'
                    placeholder='Name'
                  />
                  <label className='control-label'>Url</label>
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
