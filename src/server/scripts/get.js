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

/*
function fetchFeeds (url) {
  return new Promise((resolve, reject) => {
    if (url.startsWith('https:')) {
      https.get(url, function (res) {
        var parser = new FeedMe(true)
        res.pipe(parser)
        parser.on('end', function () {
          resolve(parser.done())
        })
      }).on('error', function (error) { reject(error) })
    } else if (url.startsWith('http:')) {
      http.get(url, function (res) {
        var parser = new FeedMe(true)
        res.pipe(parser)
        parser.on('end', function () {
          resolve(parser.done())
        })
      }).on('error', function (error) { console.log(error); reject(error) })
    }
  })
}
*/

/*
updateFeeds('http://127.0.0.1/rss/lifehacker.rss', function (err, res) {
  if (err) throw err
  res.items.map(item => console.log(item.pubdate))
  // console.log(res.title, res.link)
})
*/

/*
 * https://www.wired.com/feed/category/science/latest/rss
 * https://news.ycombinator.com/rss
*/

export { fetchFeeds }
