/* globals fetch, document */

import ReactDOM from 'react-dom'
import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom'

import Articles from '../Articles/Articles'
import Sidebar from '../Sidebar/Sidebar'
import Navigation from '../Navigation/Navigation'

class Container extends React.Component {
  constructor() {
    super()
    this.state = {
      feeds: [],
      categories: [],
      selectedFeed: {},
      favorites: []
    }
  }

  componentDidMount() {
    this.loadFeeds()
  }

  selectedFeed = (category, feed = 'all') => {
    this.setState({ selectedFeed: { category, feed } })
  }

  markRead = async () => {
    const category = this.state.selectedFeed.category || 'all'
    const feed = this.state.selectedFeed.feed || 'all'

    const data = {
      category,
      feed
    }
    const fetchData = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    }

    try {
      await fetch('/api/read', fetchData)
    } catch (error) { console.error(`Mark read failure: ${error}`) }
  }


  // loads feeds from database without fetching from external sources
  loadFeeds = async (updated = false) => {
    const fetchData = {
      method: 'GET',
      credentials: 'include'
    }

    try {
      const response = await fetch('/api/feeds', fetchData)

      if (response.ok) {
        const result = await response.json()
        const { feeds, favorites } = result.data
        let { categories } = result.data

        categories = Object.keys(categories)
        feeds.favorites = favorites

        if (categories.length === 0) {
          this.setState({ feeds: false, categories: false })
        } else {
          this.setState({ feeds, categories, favorites })
        }

        if (!updated) {
          this.updateArticles()
        }
      }
    } catch (error) { console.log(`Failed fetching articles: ${error}`) }
  }

  // fetches new articles from external sources and updates database
  updateArticles = () => {
    const { feeds } = this.state

    const fetches = feeds.map((categoryParam) => {
      const category = categoryParam
      delete category.name
      delete category.count
      let promise
      Object.keys(category).forEach((feed) => {
        const data = {
          category: category[feed].category,
          name: feed,
          url: category[feed].url
        }
        promise = fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include'
        }).then((response) => {
          if (!response.ok) {
            console.error(`Error fetching ${category[feed].url}`)
          }
        })
      })
      return promise
    })

    Promise.all(fetches)
      .then(() => this.loadFeeds(true))
      .catch(error => console.log(`Update articles error: ${error}`))
  }

  updateCount = (item) => {
    const { feeds } = this.state
    const countIdx = feeds.findIndex(feed => feed.name === item.rssCategory)
    const articleIdx = feeds[countIdx][item.rssFeed].articles.findIndex(article =>
      article.title === item.title
    )
    feeds[countIdx][item.rssFeed].articles.splice(articleIdx, 1)
    feeds[countIdx].count -= 1
    feeds[countIdx][item.rssFeed].count -= 1
    this.setState({ feeds })
  }

  render() {
    return (
      <div>
        <Navigation
          markRead={this.markRead}
          selectedFeed={this.state.selectedFeed}
        />
        <Sidebar
          feeds={this.state.feeds}
          loadFeeds={this.loadFeeds}
          categories={this.state.categories}
          selectedFeed={this.selectedFeed}
        />
        <div id='content'>
          <Main
            feeds={this.state.feeds}
            selectedFeed={this.state.selectedFeed}
            categories={this.state.categories}
            bookmark={this.bookmark}
            updateCount={this.updateCount}
          />
        </div>
      </div>
    )
  }
}

const NoMatch = () => (<div className='container'><h2>Page Not Found</h2></div>)

const Main = (props) => {
  const { feeds } = props

  return (
    <Switch>
      {feeds ? (
        <Route
          exact
          path='/'
          render={() => (
            <Articles
              feeds={props.feeds}
              bookmark={props.bookmark}
              selectedFeed={props.selectedFeed}
              categories={props.categories}
              updateCount={props.updateCount}
            />
          )}
        />
      ) : (
        <Loading />
      )}
      <Route path='*' component={NoMatch} />
    </Switch>
  )
}

Main.propTypes = {
  categories: PropTypes.array.isRequired,
  feeds: PropTypes.array.isRequired,
  selectedFeed: PropTypes.object.isRequired,
  updateCount: PropTypes.func.isRequired,
  bookmark: PropTypes.string
}

const contentNode = document.querySelector('#root')

const Loading = () => (<div className='container'><h2>Loading from router...</h2></div>)

const ContainerWithRouter = withRouter(Container)
ReactDOM.render(<Router><ContainerWithRouter /></Router>, contentNode)

if (module.hot) {
  module.hot.accept()
}
