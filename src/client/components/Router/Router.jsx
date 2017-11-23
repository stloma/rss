/* globals fetch, document */

import ReactDOM from 'react-dom'
import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Redirect, Route, Switch, withRouter } from 'react-router-dom'

import Articles from '../Articles/Articles'
import Sidebar from '../Sidebar/Sidebar'
import Navigation from '../Navigation/Navigation'
import Login from '../Login/Login'
import Register from '../Register/Register'
import Loading from '../Loading/Loading'

async function isAuthenticated(cb) {
  const fetchOptions = {
    method: 'GET',
    credentials: 'include'
  }
  const response = await fetch('/api/protected', fetchOptions)
  cb(response.ok)
}

class Container extends React.Component {
  constructor() {
    super()
    this.state = {
      feeds: [],
      categories: [],
      selectedFeed: {},
      favorites: [],
      showSidebar: true,
      loggedIn: undefined,
      loading: true,
      alerts: { messages: '', type: '' }
    }
  }

  componentDidMount() {
    isAuthenticated((loggedIn) => {
      if (loggedIn) {
        this.setState({ loggedIn: true, loading: false })
        this.loadFeeds()
      } else {
        this.setState({ loggedIn: false, loading: false })
      }
    })
  }

  clearAlert = (alert) => {
    const alerts = this.state.alerts
    alerts.messages = alerts.messages.filter(message => message !== alert)
    this.setState({ alerts })
  }

  alert = (alerts) => {
    if (!alerts) {
      this.setState({ alerts: { messages: '', type: '' } })
    } else if (alerts.messages instanceof Array) {
      this.setState({ alerts })
    } else {
      const message = alerts
      message.messages = [message.messages]
      this.setState({ alerts: message })
    }
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
      if (category === 'all') {
        window.location.reload()
      }
      const { feeds } = this.state
      const categoryKeys = Object.keys(feeds).filter(key => key !== 'favorites' && key !== 'length')
      categoryKeys.forEach((categoryObj) => {
        const currentFeed = feeds[categoryObj]
        if (currentFeed.name === category) {
          if (feed === 'all') {
            const names = Object.keys(currentFeed).filter(key => key !== 'name' && key !== 'count')
            names.forEach((feedName) => {
              currentFeed.count -= currentFeed[feedName].count
              currentFeed[feedName].count = 0
              currentFeed[feedName].articles = []
            })
          } else {
            currentFeed.count -= currentFeed[feed].count
            currentFeed[feed].count = 0
            currentFeed[feed].articles = []
          }
        }
      })
      this.setState({ feeds })
    } catch (error) { console.error(`Mark read failure: ${error}`) }
  }

  deleteFeed = async (category, feed) => {
    const data = { category, feed }
    const fetchData = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    }
    await fetch('/api/feeds', fetchData)
    window.location.reload()
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

    const errors = []
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
            errors.push(`Error fetching ${category[feed].url}`)
          }
        })
      })
      return promise
    })
    this.alert({ messages: errors, type: 'danger' })

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

  toggleSidebar = () => {
    this.setState({ showSidebar: !this.state.showSidebar })
  }

  render() {
    if (this.state.feeds.length === 0 || this.state.loggedIn === undefined) {
      return <div id='site-loader'><Loading id='side-loader' type='bars' height='65px' width='65px' /></div>
    }
    const MainWrapper = (content) => {
      if (this.state.loggedIn) {
        return <div id='content'>{content}</div>
      }
      return <div>{content}</div>
    }
    return (
      <div id='big-wrapper'>
        <Navigation
          markRead={this.markRead}
          selectedFeed={this.state.selectedFeed}
          toggleSidebar={this.toggleSidebar}
          alerts={this.state.alerts}
          history={this.props.history}
          alert={this.alert}
          clearAlert={this.clearAlert}
        />
        {this.state.loggedIn &&
        <Sidebar
          feeds={this.state.feeds}
          loadFeeds={this.loadFeeds}
          categories={this.state.categories}
          selectedFeed={this.selectedFeed}
          showSidebar={this.state.showSidebar}
          toggleSidebar={this.toggleSidebar}
          deleteFeed={this.deleteFeed}
        />
        }
        {MainWrapper(
          <Main
            feeds={this.state.feeds}
            selectedFeed={this.state.selectedFeed}
            categories={this.state.categories}
            bookmark={this.bookmark}
            updateCount={this.updateCount}
            loggedIn={this.state.loggedIn}
            alert={this.alert}
          />
        )
        }
      </div>
    )
  }
}

Container.propTypes = {
  history: PropTypes.object.isRequired
}

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest)
  return (
    React.createElement(component, finalProps)
  )
}

const PropsRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={routeProps => renderMergedProps(component, routeProps, rest)}
  />
)

PropsRoute.propTypes = {
  component: PropTypes.object.isRequired
}

const Main = (props) => {
  const { feeds } = props

  if (props.loggedIn === true) {
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
        <Redirect from='*' to='/' />
      </Switch>
    )
  }
  return (
    <Switch>
      <PropsRoute exact path='/login' alert={props.alert} component={Login} />
      <PropsRoute exact path='/register' alert={props.alert} component={Register} />
      <Redirect from='*' to='/login' />
    </Switch>
  )
}

Main.propTypes = {
  categories: PropTypes.array.isRequired,
  feeds: PropTypes.array.isRequired,
  selectedFeed: PropTypes.object.isRequired,
  updateCount: PropTypes.func.isRequired,
  bookmark: PropTypes.string,
  loggedIn: PropTypes.bool,
  alert: PropTypes.func.isRequired
}

Main.defaultProps = {
  loggedIn: undefined,
  bookmark: ''
}

const contentNode = document.querySelector('#root')

// const Loading = () => (<div className='container'><h2>Welcome to RSS!</h2></div>)

const ContainerWithRouter = withRouter(Container)
ReactDOM.render(<Router><ContainerWithRouter /></Router>, contentNode)

if (module.hot) {
  module.hot.accept()
}
