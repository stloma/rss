/* globals fetch */

import React from 'react'
import PropTypes from 'prop-types'
import { Glyphicon } from 'react-bootstrap'

export default class Articles extends React.Component {
  constructor() {
    super()
    this.state = {
      articles: '',
      status: '',
      favorites: []
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const category = nextProps.selectedFeed.category || 'all'
    const feed = nextProps.selectedFeed.feed || 'all'

    const { feeds } = nextProps
    const favorites = this.state.articles.favorites || feeds.favorites

    let status = ''
    let articles = []

    function sortArticles(unsortedArticles) {
      return unsortedArticles.sort((a, b) => {
        const adate = a.pubdate ? a.pubdate : a.published
        const bdate = b.pubdate ? b.pubdate : b.published
        return new Date(bdate).getTime() - new Date(adate).getTime()
      })
    }

    // Determines what category and/or feed is selected and updates
    // this.state.articles to what's been selected
    if (category === 'all') {
      feeds.forEach((categories) => {
        const feedNames = Object.keys(categories).filter(key => key !== 'name' && key !== 'count')
        feedNames.forEach((feedName) => {
          articles = [...articles, ...categories[feedName].articles]
        })
      })
      articles = sortArticles(articles)
      status = 'All articles'
    } else if (category === 'favorites') {
      articles = sortArticles(favorites)
      status = 'Favorited articles'
    } else if (feed === 'all') {
      const allFeedsInCategory = feeds.filter(feedName => feedName.name === category)[0]
      const feedNames = Object.keys(allFeedsInCategory).filter(key => key !== 'name' && key !== 'count')
      feedNames.forEach((name) => {
        articles = [...articles, ...allFeedsInCategory[name].articles]
      })
      articles = sortArticles(articles)
      status = `All feeds in ${category}`
    } else {
      articles = feeds.filter(feedArticles => feedArticles.name === category)[0][feed].articles
      articles = sortArticles(articles)
      status = `${feed}`
    }
    articles.favorites = favorites
    this.setState({ articles, status })
  }

  bookmark = async (article) => {
    try {
      const response = await fetch('/api/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
        credentials: 'include'
      })

      if (response.ok) {
        const articles = this.state.articles

        const idx = articles.findIndex(item => item.title === article.title)
        const favIdx = articles.favorites.findIndex(item => item.title === article.title)
        const action = articles[idx].bookmark ? 'remove' : 'add'

        if (action === 'add') {
          articles[idx].bookmark = true
          articles.favorites.push(article)
          articles.favorites = Array.from(new Set(articles.favorites))
        } else if (action === 'remove') {
          articles.favorites[favIdx].bookmark = false
          articles[idx].bookmark = false
          articles.favorites = Array.from(new Set(articles.favorites))
        }
        this.setState({ articles })
      }
    } catch (error) { console.error(`Failed bookmarking ${article.title}: ${error}`) }
  }

  trash = async (item, link) => {
    const { title, rssCategory, rssFeed } = item
    const data = {
      title,
      link,
      category: rssCategory,
      feed: rssFeed
    }
    try {
      const response = await fetch('/api/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      })

      if (response.ok) {
        this.props.updateCount(item)
      }
    } catch (error) { console.error(`Failed bookmarking ${item}: ${error}`) }
  }

  render() {
    let articles
    if (this.state.articles) {
      articles = this.state.articles.map((item) => {
        const bookmark = item.bookmark ? { color: 'green', textShadow: 'none' } : { color: 'white' }
        const link = item.origlink || item.link
        const story = item.description || item.content.text || item.content
        const trashStyle = { color: 'white' }
        const trash = this.props.selectedFeed.category === 'favorites' ?
          '' : <Glyphicon style={trashStyle} onClick={() => this.trash(item, link)} glyph='trash' />
        return (
          <div className='article' key={item.title}>
            <a href={link}><h3>{item.title}</h3></a>
            <div dangerouslySetInnerHTML={{ __html: story }} />
            <div className='article-buttons'>
              <Glyphicon style={bookmark} onClick={() => this.bookmark(item)} glyph='bookmark' />
              {trash}
            </div>
            <p>{item.pubdate || item.published}</p>
          </div>
        )
      }
      )
    }
    return (
      <div>
        <div id='articles'>
          <h4 className='article-heading'>{this.state.status}</h4>
          {articles}</div>
      </div>
    )
  }
}

Articles.propTypes = {
  updateCount: PropTypes.func.isRequired,
  selectedFeed: PropTypes.object.isRequired,
  feeds: PropTypes.array.isRequired
}
