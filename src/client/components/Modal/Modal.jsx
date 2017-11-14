import React from 'react'
import { Modal } from 'react-bootstrap'

export default class AddFeed extends React.Component {
  render() {
    return (
      <div>
        <Modal aria-labelledby='contained-modal-title-lg' show={this.props.show}>
          <Modal.Body>
            <div>
              <div className='container' id='register'>
                <form method='post' name='FeedAdd' onSubmit={this.handleSubmit}>
                  <fieldset>
                    <legend>Add Feed</legend>
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
                      <select className='form-control' id='select'>
                        <option>-- Select Category --</option>
                        {this.props.directories}
                      </select>
                      <div className='form-group'>
                        <div className='form-button'>
                          <button onClick={this.props.showModal} type='reset' className='btn btn-default'>Cancel</button>
                          <button type='submit' className='btn btn-primary'>Submit</button>
                        </div>
                      </div>
                      <div className='center-text' />
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>

          </Modal.Body>

        </Modal>
      </div>
    )
  }
}
