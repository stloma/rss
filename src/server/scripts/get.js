var FeedMe = require('feedme')
var http = require('http')
var https = require('https')

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
        console.log(url)
        var parser = new FeedMe(true)
        res.pipe(parser)
        parser.on('end', function () {
          setTimeout(() => { resolve(parser.done()) }, 2000)
        })
      }).on('error', function (error) { reject(error) })
    }
  })
}

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
