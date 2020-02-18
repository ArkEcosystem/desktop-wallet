import got from 'got'
import dayjs from 'dayjs'
import moment from 'moment'
import { min, max } from 'lodash'
import { MARKET } from '@config'

// All prices on the CoinCap API are standardized in USD (United States Dollar)
const BASE_CURRENCY = 'USD'

export default class CoinCapAdapter {
  /**
   * Get token name from API
   * @param  {String} token
   * @param  {Number} limit
   * @return {(String|null)}
   */
  static async getTokenId (token, limit = 1000) {
    if (this.tokenLookup) {
      return this.tokenLookup[token.toUpperCase()]
    }

    try {
      const uri = `${MARKET.source.coinCap}/assets?limit=${limit}`
      const { body } = await got(uri, {
        json: true
      })

      this.tokenLookup = body.data.reduce((map, value, index) => {
        map[value.symbol.toUpperCase()] = value.id

        return map
      }, {})

      return this.tokenLookup[token.toUpperCase()]
    } catch (error) {
      return null
    }
  }

  /**
   * Get token data from API
   * @param {String} token
   * @return {(Object|null)}
   */
  static async fetchTokenData (token) {
    const tokenId = await this.getTokenId(token)

    try {
      const uri = `${MARKET.source.coinCap}/assets/${tokenId}`
      const { body } = await got(uri, {
        json: true
      })

      return body.data
    } catch (error) {
      return null
    }
  }

  /**
   * Get assets and rates data from API
   * @param {String} token
   * @return {(Object|null)}
   */
  static async getCurrencyData (token) {
    try {
      const uri = `${MARKET.source.coinCap}/rates`
      const { body } = await got(uri, {
        json: true
      })
      const { data, timestamp } = body
      const tokenData = await this.fetchTokenData(token)

      const response = {
        assets: { [tokenData.symbol.toUpperCase()]: tokenData },
        rates: { [tokenData.symbol.toUpperCase()]: tokenData.priceUsd },
        timestamp
      }

      for (const value of data) {
        response.assets[value.symbol.toUpperCase()] = value
        response.rates[value.symbol.toUpperCase()] = value.rateUsd
      }

      return response
    } catch (error) {
      return null
    }
  }

  /**
   * Checks if a token is tradeable
   * @param {String} token
   * @return {(Boolean)} Return true if the token is found
   */
  static async checkTradeable (token) {
    try {
      const tokenData = await this.fetchTokenData(token)

      return !!tokenData.id
    } catch (error) {
      return false
    }
  }

  /**
   * Fetch market data from API
   * @param {String} token
   * @return {(Object|null)} Return normalized market data or null on failure
   */
  static async fetchMarketData (token) {
    const tokenId = await this.getTokenId(token)

    if (!tokenId) {
      return null
    }

    return this.__transformMarketResponse(
      await this.getCurrencyData(token),
      tokenId
    )
  }

  /**
   * Fetch historical data from API
   * @param {String} token
   * @param {String} currency
   * @param {Number} limit
   * @param {String} type
   * @param {String} dateFormat
   * @return {(Object|null)} Return API response data or null on failure
   */
  static async fetchHistoricalData (token, currency, days, _, dateFormat = 'DD.MM') {
    const tokenId = await this.getTokenId(token)

    if (!tokenId) {
      return null
    }

    const { rates } = await this.getCurrencyData(token)
    const daysSubtract = days === 24 ? 1 : days
    const timeInterval = days === 24 ? 'h1' : 'h12'
    const startDate = moment().subtract(daysSubtract, 'd').valueOf()
    const endDate = moment().valueOf()
    const { body } = await got(`${MARKET.source.coinCap}/assets/${tokenId}/history?interval=${timeInterval}&start=${startDate}&end=${endDate}`, {
      json: true
    })

    return this.__transformHistoricalResponse(tokenId, body.data, currency, rates, dateFormat)
  }

  /**
   * Normalize market data response to an object
   * @param {Object} response
   * @param {String} token
   * @return {Object}
   */
  static __transformMarketResponse (marketData, token) {
    const tokenId = token.toUpperCase()
    const marketResponse = {}

    const lastUpdated = new Date(marketData.timestamp)

    for (const currency of Object.keys(MARKET.currencies)) {
      const { assets, rates } = marketData

      if (!assets[currency]) {
        continue
      }

      marketResponse[currency] = {
        currency,
        price: this.__convertToCurrency(1, { from: currency, to: tokenId, base: BASE_CURRENCY, rates }),
        marketCap: assets[tokenId].marketCapUsd * (rates[BASE_CURRENCY] / rates[currency]),
        volume: assets[tokenId].volumeUsd24Hr * (rates[BASE_CURRENCY] / rates[currency]),
        date: lastUpdated,
        change24h: null
      }
    }

    return marketResponse
  }

  /**
   * Prepare the historical data response to be used in charts
   * @param {String} token
   * @param {Object} response
   * @param {String} currency
   * @param {Object} rates
   * @param {String} dateFormat
   * @return {Object}
   */
  static __transformHistoricalResponse (token, response, currency, rates, dateFormat) {
    const tokenId = token.toUpperCase()
    const datasets = {}

    for (const value of response) {
      datasets[dayjs(value.date).format(dateFormat)] = this.__convertToCurrency(
        value.priceUsd, { from: currency, to: tokenId, base: tokenId, rates }
      )
    }

    return {
      labels: Object.keys(datasets),
      datasets: Object.values(datasets),
      min: min(Object.values(datasets)),
      max: max(Object.values(datasets))
    }
  }

  /**
   * Convert an amount of money to another currency
   * @param {Number} amount
   * @param {Object} options
   * @return {Number} Returns conversion result
   */
  static __convertToCurrency (amount, { from, to, base, rates }) {
    if (from && to) {
      // If `from` equals `base`, return the basic exchange rate for the `to` currency
      if (from === base && Object.prototype.hasOwnProperty.call(rates, to)) {
        return (amount * 100) * (rates[to] / 100)
      }

      // If `to` equals `base`, return the basic inverse rate of the `from` currency
      if (to === base && Object.prototype.hasOwnProperty.call(rates, from)) {
        return (amount * 100) * ((1 / rates[from]) / 100)
      }

      // Otherwise, return the `to` rate multipled by the inverse of the `from` rate to get the relative exchange rate between the two currencies.
      if (Object.prototype.hasOwnProperty.call(rates, from) && Object.prototype.hasOwnProperty.call(rates, to)) {
        return (amount * 100) * ((rates[to] * (1 / rates[from])) / 100)
      }

      throw new Error('`rates` object does not contain either `from` or `to` currency!')
    } else {
      throw new Error('Please specify the `from` and/or `to` currency or use parsing!')
    }
  }
}
