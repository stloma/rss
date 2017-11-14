import React from 'react'
import { Glyphicon } from 'react-bootstrap'

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
    this.addFeed = this.addFeed.bind(this)
    this.editCategories = this.editCategories.bind(this)
    this.delete = this.delete.bind(this)
  }
  addFeed() {
    this.setState({ addFeed: !this.state.addFeed })
  }
  editCategories() {
    this.setState({ editCategories: !this.state.editCategories })
  }
  delete(e) {
    console.log(e)
  }

  render() {
    const { feeds, categories } = this.props
    const _id = feeds._id
    let groups = ''

    if (!categories) {
      groups = <h3 className='text-center'>create a new feed!</h3>
    } else {
      groups = feeds.map((category, idx) => {
        const keys = Object.keys(category).filter(key => key !== 'name' && key !== 'count')
        return (
          <div key={category.name} className='panel panel-default'>
            <div className='panel-heading'>
              <a
                onClick={() => this.props.selectedFeed(category.name)}
                className='directory-title'
                data-toggle='collapse'
                data-parent='#accordion'
                href={`#collapse${idx}`}
              >
                <h4 className='panel-title'>
                  {category.name}
                  <span className='category-badge'>
                    {category.count > 0 ? category.count : 0}
                  </span>
                </h4>
              </a>
            </div>
            <div id={`collapse${idx}`} className='panel-collapse collapse'>
              <div className='panel-body'>
                {keys ? (
                  keys.map((feed) => {
                    const count = category[feed].count ? category[feed].count : 0
                    const counts = this.state.count
                    counts[category] = counts[category] || {}
                    counts[category][feed] = counts[category][feed] || 0
                    return (
                      <div className='feed-bar' key={feed} onClick={() => this.props.selectedFeed(category.name, feed)}>
                        <div className='btn-group'>
                          <a href='#' className='btn dropdown-toggle' data-toggle='dropdown'>
                            <span className='caret' />
                          </a>
                          <ul className='dropdown-menu'>
                            <li><a href='#'>Edit</a></li>
                            <li><a onClick={() => this.delete(feed)} href='#'>Delete</a></li>
                          </ul>
                        </div>

                        <div className='feed-link' onClick={() => this.props.selectedFeed(category.name, feed)}>
                          <a>
                            {feed}
                            <span className='badge feed-badge'>{count}</span>
                          </a>
                        </div>
                      </div>
                    )
                  })
                ) : (<h5 className='text-center'>Add a feed!</h5>)
                }
              </div>
            </div>
          </div>
        )
      })
    }
    return (
      <div className='column'>
        {this.state.addFeed &&
        <NewFeed
          loadFeeds={this.props.loadFeeds}
          _id={_id}
          addFeed={this.addFeed}
          show={this.state.addFeed}
          categories={this.props.categories.map((key, idx) =>
            <option key={idx}>{key}</option>
          )}
          Fade
          Transition
        />
        }
        {this.state.editCategories &&
        <EditCategories
          loadFeeds={this.props.loadFeeds}
          _id={_id}
          editCategories={this.editCategories}
          show={this.state.editCategories}
          categories={this.props.categories}
          Fade
          Transition
        />
        }
        <a onClick={this.addFeed} className='btn btn-info btn-block pointer'>Subscribe</a>
        <div className='btn-group btn-group-justified'>
          <a href='#' className='btn btn-default'>New</a>
          <a onClick={() => this.props.selectedFeed('favorites')} className='btn btn-success'>Favorites</a>
          <a onClick={() => this.props.selectedFeed('all')} className='btn btn-primary'>All</a>
        </div>

        <div className='panel-group' id='accordion'>
          {groups}
        </div>
        <div onClick={this.editCategories} className='pointer' id='add-category'><Glyphicon glyph='plus' /> Add/Edit categories</div>
      </div>
    )
  }
}
