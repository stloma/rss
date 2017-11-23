/* globals fetch, document */

import React from 'react'
import PropTypes from 'prop-types'
import { Glyphicon, Modal, Panel } from 'react-bootstrap'

export default class AddFeed extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      open: false,
      feed: { url: '', name: '' }
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
        window.location.reload()
      } else {
        const errors = await response.json()
        this.setState({ errors })
      }
    } catch (err) { console.log(`Error in sending data to server: ${err.message}`) }
  }

  handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value

    const { feed } = this.state
    feed[name] = value

    this.setState({ feed })
  }

  loadExample = (name, url) => {
    this.setState({ feed: { url, name } })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const form = document.forms.FeedAdd
    const { name, url } = this.state.feed

    this.createFeed({
      name,
      url,
      category: form.category.value
    })
  }

  render() {
    const urls = [
      { name: 'Wired', url: 'https://www.wired.com/feed/rss' },
      { name: 'Webdev', url: 'https://www.reddit.com/r/webdev/.rss' },
      { name: 'LifeHacker', url: 'https://lifehacker.com/rss' },
      { name: 'Debian Security', url: 'https://www.debian.org/security/dsa' },
      { name: 'Css tricks', url: 'http://feeds.feedburner.com/CssTricks' },
      { name: 'Seattle Times', url: 'https://www.seattletimes.com/feed/' },
      { name: 'BBC', url: 'http://feeds.bbci.co.uk/news/world/rss.xml' },
      { name: 'Serious eats', url: 'http://feeds.feedburner.com/seriouseats/recipes?format=xml' }
    ]

    const urlWrapper = url => (
      <span key={url.url}> {url.name}
        <a onClick={() => this.loadExample(url.name, url.url)}>{url.url}</a>
      </span>
    )

    const exampleUrls = urls.map(url => urlWrapper(url))

    const panelHeader = <div>Examples <Glyphicon glyph='triangle-bottom' /></div>
    return (
      <div>
        <Modal aria-labelledby='contained-modal-title-lg' onHide={this.props.addFeed} show>
          <Modal.Header closeButton>
            <Modal.Title>New Feed</Modal.Title>
          </Modal.Header>
          <div className='container' id='add-feed'>
            <div id='feed-examples'>
              <Panel
                header={panelHeader}
                collapsible
                expanded={this.state.open}
                bsStyle='info'
                onClick={() => this.setState({ open: !this.state.open })}
              >
                {exampleUrls}
              </Panel>
            </div>
            <form method='post' name='FeedAdd' onSubmit={this.handleSubmit}>
              <fieldset>
                <div className='form-group'>
                  <label htmlFor='name' className='control-label'>Name</label>
                  <input
                    type='text'
                    className='form-control'
                    required
                    name='name'
                    placeholder='Name'
                    onChange={this.handleChange}
                    value={this.state.feed.name}
                  />
                  <label htmlFor='url' className='control-label'>Url</label>
                  <input
                    type='text'
                    className='form-control'
                    required
                    name='url'
                    placeholder='cnn.com'
                    onChange={this.handleChange}
                    value={this.state.feed.url}
                  />
                  <select className='form-control' name='category' id='select-category'>
                    {this.props.categories}
                  </select>
                  <div className='form-group'>
                    <div className='form-button'>
                      <button
                        onClick={this.props.addFeed}
                        type='reset'
                        className='btn btn-default'
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
