var FeedMe = require('feedme')
var http = require('http')
var https = require('https')

function fetchFeeds (url, cb) {
  if (url.startsWith('https:')) {
    https.get(url, function (res) {
      var parser = new FeedMe(true)
      res.pipe(parser)
      parser.on('end', function () {
        cb(null, parser.done())
      })
    }).on('error', function (e) { console.log(e.message) })
  } else if (url.startsWith('http:')) {
    http.get(url, function (res) {
      var parser = new FeedMe(true)
      res.pipe(parser)
      parser.on('end', function () {
        cb(null, parser.done())
      })
    }).on('error', function (e) { console.log(e.message) })
  }
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
