import packageJson from '@package.json'
import feedService from '@/services/feed'

import RssParser from 'rss-parser' // eslint-disable-line
import { parseURLMock } from 'rss-parser' // eslint-disable-line

// https://github.com/facebook/jest/issues/3601
const errorCapturer = fn => fn.then(res => () => res).catch(err => () => { throw err })

const feed = {
  feedUrl: 'http://exampl.net/feed.rss',
  items: [
    { title: 'example 1' },
    { title: 'example 2' }
  ]
}

describe('Services > Feed', () => {
  describe('fetchAndParse', () => {
    it('should retrieve the feed and parse it', async () => {
      parseURLMock.mockImplementation(url => url === feed.feedUrl ? feed : null)

      expect(await feedService.fetchAndParse(feed.feedUrl)).toEqual(feed)
    })

    it('should use the NPM package name as the request user-agent', async () => {
      await feedService.fetchAndParse('http://example.net')

      expect(RssParser).toHaveBeenCalledWith({
        'User-Agent': packageJson.name
      })
    })

    describe('when the request or parsing fails', () => {
      it('should throw the Error', async () => {
        parseURLMock.mockImplementation(url => {
          throw new Error('failed')
        })

        expect(await errorCapturer(feedService.fetchAndParse(feed.feedUrl))).toThrow('failed')
      })
    })
  })

  describe('fetchItems', () => {
    it('should retrieve the items of the feed', async () => {
      parseURLMock.mockImplementation(url => url === feed.feedUrl ? feed : null)

      expect(await feedService.fetchItems(feed.feedUrl)).toEqual(feed.items)
    })

    describe('when the request or parsing fails', () => {
      it('should throw the Error', async () => {
        parseURLMock.mockImplementation(url => {
          throw new Error('failed items')
        })

        expect(await errorCapturer(feedService.fetchItems(feed.feedUrl))).toThrow('failed items')
      })
    })
  })
})
