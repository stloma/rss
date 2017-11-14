import React from 'react'
import { Modal } from 'react-bootstrap'

export default class ConfirmRead extends React.Component {
  constructor() {
    super()
    this.state = {
      toDelete: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
  }

  render() {
    let { category, feed } = this.props.selectedFeed
    console.log(category, feed)

    category = category || 'all'
    feed = feed || 'all'
    return (
      <div>
        <Modal aria-labelledby='contained-modal-title-lg' onHide={this.props.markRead} show>
          <Modal.Header closeButton>
            <Modal.Title>Mark as Read</Modal.Title>
          </Modal.Header>
          <div className='container' id='add-feed'>
            <p>You are marking <b>{`${category}: ${feed}`}</b> as read.</p>
            <p>Are you sure?</p>
            <button onClick={() => this.props.markRead({ confirm: false })} type='reset' className='btn btn-black'>
              Cancel
            </button>
            <button onClick={() => this.props.markRead({ confirm: true })} type='submit' className='btn btn-primary'>Submit</button>
            <hr />
            <div className='center-text' />
          </div>
        </Modal>
      </div>
    )
  }
}
