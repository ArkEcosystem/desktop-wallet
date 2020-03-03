import packageJson from '@package.json'
import feedService from '@/services/feed'

import RssParser from 'rss-parser' // eslint-disable-line
import { parseURLMock } from 'rss-parser' // eslint-disable-line

describe('Services > Feed', () => {
  const feed = {
    feedUrl: 'http://exampl.net/feed.rss',
    items: [
      { title: 'example 1' },
      { title: 'example 2' }
    ]
  }

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
        parseURLMock.mockImplementation(() => {
          throw new Error('failed')
        })

        await expect(feedService.fetchAndParse(feed.feedUrl)).rejects.toThrow('failed')
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
        parseURLMock.mockImplementation(() => {
          throw new Error('failed items')
        })

        await expect(feedService.fetchItems(feed.feedUrl)).rejects.toThrow('failed items')
      })
    })
  })
})
