import packageJson from '@package.json'
import RssParser from 'rss-parser'

export default {
  /**
   * Fetches and parses the RSS of an URL
   * @param {String} url
   * @return {Feed} the entire feed
   */
  async fetchAndParse (url) {
    const parser = new RssParser({
      'User-Agent': packageJson.name
    })

    return parser.parseURL(url)
  },

  /**
   * Fetches and parses the RSS of the feed URL and returns its entries
   * @param {String} url
   * @return {Array} array of items of the feed
   */
  async fetchItems (url) {
    const feed = await this.fetchAndParse(url)

    return feed.items
  }
}
