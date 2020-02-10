import got from 'got'
import dayjs from 'dayjs'
import moment from 'moment'
import { min, max } from 'lodash'
import { convert } from 'cashify'
import { MARKET } from '@config'

// All prices on the CoinCap API are standardized in USD (United States Dollar)
const BASE_CURRENCY = 'USD'
const AMOUNT_TO_CONVERT = 1

export default class CoinCapAdapter {
  /**
   * Get token name from API
   * @param  {String} token
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
      const { data } = body

      this.tokenLookup = data.reduce((map, value, index) => {
        map[value.symbol.toUpperCase()] = value.id

        return map
      }, {})

      return this.tokenLookup[token.toUpperCase()]
    } catch (error) {
      return null
    }
  }

  /**
   * Get Ark data from API
   * @return {(Object|null)}
   */
  static async fetchArkData () {
    try {
      const uri = `${MARKET.source.coinCap}/assets/ark`
      const { body } = await got(uri, {
        json: true
      })
      const { data } = body

      return data
    } catch (error) {
      return null
    }
  }

  /**
   * Get assets and rates data from API
   * @return {(Object|null)}
   */
  static async getCurrencyData () {
    try {
      const uri = `${MARKET.source.coinCap}/rates`
      const { body } = await got(uri, {
        json: true
      })
      const { data, timestamp } = body
      const arkData = await this.fetchArkData()

      const assets = data.reduce((map, value, index) => {
        map[value.symbol.toUpperCase()] = value

        return map
      }, { [arkData.symbol.toUpperCase()]: arkData })

      const rates = data.reduce((map, value, index) => {
        map[value.symbol.toUpperCase()] = value.rateUsd

        return map
      }, { [arkData.symbol.toUpperCase()]: arkData.priceUsd })

      return {
        assets,
        rates,
        timestamp
      }
    } catch (error) {
      return null
    }
  }

  /**
   * Checks if a token is tradeable
   * @param {String} token
   * @return {(Boolean|null)} Return true if the token is found
   */
  static async checkTradeable (token) {
    const tokenId = await this.getTokenId(token)

    try {
      const uri = `${MARKET.source.coinCap}/assets/${tokenId}`
      const { body } = await got(uri, {
        json: true
      })
      const { data } = body

      return !!data.id
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
    const currencyData = await this.getCurrencyData()

    return this.__transformMarketResponse(currencyData, tokenId)
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
    const currencyData = await this.getCurrencyData()
    const { rates } = currencyData
    const daysSubtract = days === 24 ? 1 : days
    const timeInterval = days === 24 ? 'h1' : 'h12'
    const startDate = moment().subtract(daysSubtract, 'd').valueOf()
    const endDate = moment().valueOf()
    const { body } = await got(`${MARKET.source.coinCap}/assets/${tokenId}/history?interval=${timeInterval}&start=${startDate}&end=${endDate}`, {
      json: true
    })
    const { data } = body

    return this.__transformHistoricalResponse(tokenId, data, currency, rates, dateFormat)
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
        price: convert(
          AMOUNT_TO_CONVERT, { from: currency, to: tokenId, base: BASE_CURRENCY, rates }
        ),
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
      datasets[dayjs(value.date).format(dateFormat)] = convert(
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
}
