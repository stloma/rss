'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var FeedParser = require('feedparser');
var request = require('request');

function fetchFeeds(url) {
  return new Promise(function (resolve, reject) {
    var feedparser = new FeedParser();

    request({ method: 'GET', url: url }, function (e, res, body) {
      if (e) {
        return reject(e);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Bad status code (status: ' + res.statusCode + ', url: ' + url + ')'));
      }
      feedparser.end(body);
    });

    feedparser.on('error', function (error) {
      reject(error);
    });

    var articles = [];
    feedparser.on('readable', function () {
      var article = feedparser.read();

      while (article) {
        articles.push(article);
        article = feedparser.read();
      }
    }).on('end', function () {
      resolve(articles);
    });
  });
}

exports.default = fetchFeeds;
//# sourceMappingURL=get.js.map