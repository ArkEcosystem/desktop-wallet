;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('feedService', [FeedService])

  function FeedService () {
    const rssParser = require('rss-parser')

    const fetchAndParse = url => {
      return new Promise((resolve, reject) => {
        rssParser.parseURL(url, (err, parsed) => {
          err ?  reject(err) : resolve(parsed)
        })
      })
    }

    const fetchBlogEntries = () => {
      const rssUrl = 'https://blog.ark.io/feed'

      return new Promise((resolve, reject) => {
        fetchAndParse(rssUrl).then( parsed => resolve(parsed.feed.entries) )
      })
    }

    return { rssParser,
      fetchAndParse,
      fetchBlogEntries
    }
  }

})()
