const FeedParser = require('feedparser')
const request = require('request')

function fetchFeeds(url) {
  return new Promise((resolve, reject) => {
    const feedparser = new FeedParser()

    request({ method: 'GET', url }, (e, res, body) => {
      if (e) {
        return reject(e)
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Bad status code (status: ${res.statusCode}, url: ${url})`))
      }
      feedparser.end(body)
    })

    feedparser.on('error', (error) => {
      reject(error)
    })

    const articles = []
    feedparser.on('readable', () => {
      let article = feedparser.read()

      while (article) {
        articles.push(article)
        article = feedparser.read()
      }
    }).on('end', () => {
      resolve(articles)
    })
  })
}

export default fetchFeeds
