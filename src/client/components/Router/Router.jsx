/* globals fetch */

import ReactDOM from 'react-dom'
import React from 'react'
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
    this.loadFeeds = this.loadFeeds.bind(this)
    this.updateArticles = this.updateArticles.bind(this)
    this.selectedFeed = this.selectedFeed.bind(this)
    this.markRead = this.markRead.bind(this)
    this.updateCount = this.updateCount.bind(this)
  }

  // loads feeds from database without fetching from external sources
  async loadFeeds(updated = false) {
    const fetchData = {
      method: 'GET',
      credentials: 'include'
    }

    try {
      const response = await fetch('/api/feeds', fetchData)

      if (response.ok) {
        const result = await response.json()
        let { categories, feeds, favorites } = result.data

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
  updateArticles() {
    const { feeds } = this.state

    const fetches = feeds.map((category) => {
      delete category.name
      delete category.count
      for (const feed in category) {
        const data = {
          category: category[feed].category,
          name: feed,
          url: category[feed].url
        }
        return fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include'
        }).then((response) => {
          if (!response.ok) {
            console.error(`Error fetching ${category[feed].url}`)
          }
        })
      }
    })

    Promise.all(fetches)
      .then(res => this.loadFeeds(true))
      .catch(error => console.log(`Update articles error: ${error}`))
  }

  selectedFeed(category, feed = 'all') {
    this.setState({ selectedFeed: { category, feed } })
  }

  componentDidMount() {
    let { category, feed } = this.state.selectedFeed
    category = category || 'all'
    feed = feed || 'all'
    this.setState({ category, feed })
    this.loadFeeds()
  }

  async markRead() {
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

  updateCount(item) {
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

const contentNode = document.querySelector('#root')

const NoMatch = () => (<div className='container'><h2>Page Not Found</h2></div>)
const Loading = () => (<div className='container'><h2>Loading from router...</h2></div>)

const ContainerWithRouter = withRouter(Container)
ReactDOM.render(<Router><ContainerWithRouter /></Router>, contentNode)

if (module.hot) {
  module.hot.accept()
}
