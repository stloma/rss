/* globals fetch, document */

import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'

export default class EditCategory extends React.Component {
  constructor() {
    super()
    this.state = {
      category: '',
      toDelete: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
  }

  async editCategories(editCategory) {
    const response = await fetch('/api/editcategories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editCategory),
      credentials: 'include'
    })
    if (response.ok) {
      this.props.loadFeeds()
      this.props.toggleEditCategories()
    } else {
      const errors = await response.json()
      this.setState({ errors })
    }
  }

  handleCheckbox(event) {
    const toDelete = this.state.toDelete
    const name = event.target.name
    if (toDelete[name]) {
      delete toDelete[name]
    } else {
      toDelete[name] = true
    }
    this.setState({ toDelete })
  }

  handleSubmit(event) {
    event.preventDefault()
    const form = document.forms.CategoryEdit
    const delKeys = Object.keys(this.state.toDelete)
    const toDelete = delKeys.length > 0 ? delKeys : ''
    const categories = this.props.categories || []
    if (form.name.value in categories) {
      console.log(form.name.value, 'exists')
    } else {
      this.editCategories({
        toDelete,
        name: form.name.value
      })
    }
  }

  render() {
    let categories = ''
    if (!this.props.categories) {
      categories = ''
    } else {
      categories = this.props.categories.map(category =>
        (<div key={category} className='checkbox'>
          <label htmlFor={category} className='control-label'>Delete
            <input onChange={this.handleCheckbox} type='checkbox' name={category} value='' />{category}
          </label>
        </div>)
      )
    }
    const delKeys = Object.keys(this.state.toDelete)
    const deletions = delKeys.map(item => (<li key={item}>{item}</li>))

    return (
      <div>
        <Modal aria-labelledby='contained-modal-title-lg' onHide={this.props.toggleEditCategories} show>
          <Modal.Header closeButton>
            <Modal.Title>Edit Category</Modal.Title>
          </Modal.Header>
          <div className='container' id='add-feed'>
            <form method='post' name='CategoryEdit' onSubmit={this.handleSubmit}>
              <fieldset>
                {categories}
                <div className='form-group'>
                  <label htmlFor='name' className='control-label'>Add new</label>
                  <input
                    type='text'
                    className='form-control'
                    name='name'
                    placeholder='Name'
                  />
                  {delKeys.length > 0 &&
                    <div className='confirm-dir-delete alert alert-dismissible alert-danger'>
                      <button type='button' className='close' data-dismiss='alert'>&times;</button>
                      <h4>Delete confirmation</h4>
                      <hr />
                      You will be deleting the following items,
                      along with all the containing articles:
                      <ul>
                        {deletions}
                      </ul>
                      Are you sure?
                    </div>
                  }
                  <div className='form-group'>
                    <div className='form-button'>
                      <button
                        onClick={this.props.toggleEditCategories}
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

EditCategory.propTypes = {
  toggleEditCategories: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired
}
