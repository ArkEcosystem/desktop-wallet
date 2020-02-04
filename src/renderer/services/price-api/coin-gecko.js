import got from 'got'
import dayjs from 'dayjs'
import { min, max } from 'lodash'
import { MARKET } from '@config'

export default class CoinGeckoAdapter {
  /**
   * Get token name from api
   * @param  {String} token
   * @return {(String|null)}
   */
  static async getTokenId (token) {
    if (this.tokenLookup) {
      return this.tokenLookup[token.toUpperCase()]
    }

    try {
      const uri = `${MARKET.source.coinGecko}/coins/list`
      const { body } = await got(uri, {
        json: true
      })

      this.tokenLookup = body.reduce((map, value, index) => {
        map[value.symbol.toUpperCase()] = value.id

        return map
      }, {})

      return this.tokenLookup[token.toUpperCase()]
    } catch (error) {
      //
    }

    return null
  }

  /**
   * Checks if a token is tradeable
   * @param {String} token
   * @return {(Boolean|null)} Return true if the token is found
   */
  async checkTradeable (token) {
    const tokenId = await this.getTokenId(token)

    try {
      const uri = `${MARKET.source.coinGecko}/simple/price`
      const { body } = await got(uri, {
        query: {
          ids: tokenId,
          vs_currencies: 'BTC'
        },
        json: true
      })

      return !!body[tokenId]
    } catch (error) {
      return null
    }
  }

  /**
   * Fetch market data from API.
   * @param {String} token
   * @return {(Object|null)} Return API response data or null on failure
   */
  static async fetchMarketData (token) {
    const tokenId = await this.getTokenId(token)
    const { body } = await got(`${MARKET.source.coinGecko}/coins/${tokenId}`, { json: true })

    return this.__transformMarketResponse(body.market_data)
  }

  /**
   * Fetch historical data from API.
   * @param {String} token
   * @param {String} currency
   * @param {Number} limit
   * @param {String} type
   * @param {String} dateFormat
   * @return {(Object|null)} Return API response data or null on failure
   */
  static async fetchHistoricalData (token, currency, days, _, dateFormat = 'DD.MM') {
    const tokenId = await this.getTokenId(token)
    const { body } = await got(`${MARKET.source.coinGecko}/coins/${tokenId}/market_chart`, {
      query: {
        vs_currency: currency,
        days
      },
      json: true
    })

    return this.__transformHistoricalResponse(body, dateFormat)
  }

  /**
   * Normalize market data reponse to a object
   * @param {Object} response
   * @return {Object}
   */
  static __transformMarketResponse (marketData) {
    const marketResponse = {}

    const lastUpdated = new Date(marketData.last_updated)

    for (const currency of Object.keys(MARKET.currencies)) {
      const currencyLowerCase = currency.toLowerCase()

      if (!marketData.current_price[currencyLowerCase]) {
        continue
      }

      marketResponse[currency] = {
        currency,
        price: marketData.current_price[currencyLowerCase],
        marketCap: marketData.market_cap[currencyLowerCase],
        volume: marketData.total_volume[currencyLowerCase],
        date: lastUpdated,
        change24h: marketData.market_cap_change_percentage_24h_in_currency[currencyLowerCase]
      }
    }

    return marketResponse
  }

  /**
   * Prepare the historical data response to be used in charts
   * @param {Object} response
   * @param {String} dateFormat
   * @return {Object}
   */
  static __transformHistoricalResponse (response, dateFormat) {
    const datasets = {}
    for (let i = 0; i < response.prices.length; i += 24) {
      datasets[response.prices[i][0]] = response.prices[i][1]
    }

    return {
      labels: Object.keys(datasets).map(time => dayjs(time).format(dateFormat)),
      datasets: Object.values(datasets),
      min: min(Object.values(datasets)),
      max: max(Object.values(datasets))
    }
  }
}
