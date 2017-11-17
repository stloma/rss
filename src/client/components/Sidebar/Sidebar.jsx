import React from 'react'
import PropTypes from 'prop-types'
import { DropdownButton, MenuItem, Glyphicon, PanelGroup, Panel } from 'react-bootstrap'

import NewFeed from '../NewFeed/NewFeed'
import EditCategories from '../EditCategories/EditCategories'

export default class Sidebar extends React.Component {
  constructor() {
    super()

    this.state = ({
      addFeed: false,
      editCategores: false,
      count: {}
    })
  }
  addFeed = () => {
    this.setState({ addFeed: !this.state.addFeed })
  }
  toggleEditCategories = () => {
    this.setState({ editCategories: !this.state.editCategories })
  }

  render() {
    const { feeds, categories } = this.props
    const _id = feeds._id
    let groups = ''

    if (!categories) {
      groups = <h3 className='text-center'>create a new feed!</h3>
    } else {
      groups = feeds.map((category) => {
        const keys = Object.keys(category).filter(key => key !== 'name' && key !== 'count')
        const header =
          (<div onClick={() => this.props.selectedFeed(category.name)}>
            <h5>
              {category.name}
              <span className='category-badge'>
                {category.count > 0 ? category.count : 0}
              </span>
            </h5>
          </div>)
        return (
          <Panel
            collapsible
            expanded
            header={header}
            key={category.name}
          >
            {keys ? (
              keys.map((feed) => {
                const count = category[feed].count ? category[feed].count : 0
                const counts = this.state.count
                counts[category] = counts[category] || {}
                counts[category][feed] = counts[category][feed] || 0
                return (
                  <div
                    key={feed}
                    className='feed-bar-wrapper'
                    onClick={() => this.props.selectedFeed(category.name, feed)}
                  >
                    <DropdownButton title='' id='bg-nested-dropdown'>
                      <MenuItem>Edit</MenuItem>
                      <MenuItem onClick={() => this.props.deleteFeed(category.name, feed)}>
                        Delete
                      </MenuItem>
                    </DropdownButton>
                    <span className='feed-bar' />
                    <span className='feed-link'>
                      <a>
                        {feed}
                        <span className='badge feed-badge'>{count}</span>
                      </a>
                    </span>
                  </div>
                )
              })
            ) : (<h5 className='text-center'>Add a feed!</h5>)
            }
          </Panel>
        )
      })
    }
    const sideBar = this.props.showSidebar ? 'sidebar' : 'hide-sidebar'
    const glyphicon = this.props.showSidebar ? (
      <span onClick={this.props.toggleSidebar} id='toggle-sidebar'>
        <Glyphicon glyph='backward' />
        <p>Hide sidebar</p>
      </span>
    ) : (
      <span onClick={this.props.toggleSidebar} id='toggle-sidebar'>
        <Glyphicon glyph='forward' />
      </span>
    )
    return (
      <div>
        <div id={sideBar}>
          {glyphicon}
          {this.state.addFeed &&
          <NewFeed
            loadFeeds={this.props.loadFeeds}
            _id={_id}
            addFeed={this.addFeed}
            show={this.state.addFeed}
            categories={this.props.categories.map(key =>
              <option key={key}>{key}</option>
            )}
            Fade
            Transition
          />
          }
          {this.state.editCategories &&
          <EditCategories
            loadFeeds={this.props.loadFeeds}
            _id={_id}
            toggleEditCategories={this.toggleEditCategories}
            show={this.state.editCategories}
            categories={this.props.categories}
            Fade
            Transition
          />
          }
          <a onClick={this.addFeed} id='subscribe-button' className='btn btn-block pointer'> Subscribe</a>
          <div className='btn-group btn-group-justified'>
            <a onClick={this.toggleEditCategories} id='categories-button' className='btn'>Categories</a>
            <a onClick={() => this.props.selectedFeed('favorites')} id='favorites-button' className='btn'>Favorites</a>
            <a onClick={() => this.props.selectedFeed('all')} id='all-button' className='btn'>All</a>
          </div>

          <PanelGroup>
            {groups}
          </PanelGroup>

        </div>
      </div>
    )
  }
}

Sidebar.propTypes = {
  categories: PropTypes.array.isRequired,
  feeds: PropTypes.array.isRequired,
  loadFeeds: PropTypes.func.isRequired,
  selectedFeed: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  showSidebar: PropTypes.bool.isRequired,
  deleteFeed: PropTypes.func.isRequired
}
