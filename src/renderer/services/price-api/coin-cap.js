import got from 'got'
// import dayjs from 'dayjs'
// import { min, max } from 'lodash'
import { convert } from 'cashify'
import { MARKET } from '@config'

const BASE_CURRENCY = 'USD'
const TOKEN_ID = 'ARK'
const AMOUNT_TO_CONVERT = 1

export default class CoinCapAdapter {
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
      const uri = `${MARKET.source.coinCap}/rates`
      const { body } = await got(uri, {
        json: true
      })
      const { data } = body

      this.tokenLookup = data.reduce((map, value, index) => {
        map[value.symbol.toUpperCase()] = value.id

        return map
      }, {})

      return this.tokenLookup[token.toUpperCase()] || token
    } catch (error) {
    }

    return null
  }

  /**
   * Get ark data from api
   * @return {(Object|null)}
   */
  static async getArkData () {
    try {
      const uri = `${MARKET.source.coinCap}/assets/ark`
      const { body } = await got(uri, {
        json: true
      })
      const { data } = body

      return data
    } catch (error) {
    }

    return null
  }

  /**
   * Get currency data from api
   * @return {(Object|null)}
   */
  static async getCurrencyData () {
    let currencyData = {}
    let ratesData = {}
    let rates = {}

    try {
      const uri = `${MARKET.source.coinCap}/rates`
      const { body } = await got(uri, {
        json: true
      })
      const { data, timestamp } = body
      const arkData = await this.getArkData()

      ratesData = data.reduce((map, value, index) => {
        map[value.symbol.toUpperCase()] = value

        return map
      }, { [arkData.symbol.toUpperCase()]: arkData })

      rates = data.reduce((map, value, index) => {
        map[value.symbol.toUpperCase()] = value.rateUsd

        return map
      }, { [arkData.symbol.toUpperCase()]: arkData.priceUsd })

      currencyData = {
        data: ratesData,
        rates,
        timestamp
      }

      return currencyData
    } catch (error) {
    }

    return null
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
    const currencyData = await this.getCurrencyData()

    return this.__transformMarketResponse(currencyData, tokenId)
  }

  /**
   * Normalize market data reponse to a object
   * @param {Object} response
   * @return {Object}
   */
  static __transformMarketResponse (marketData, token = TOKEN_ID) {
    const marketResponse = {}

    const lastUpdated = new Date(marketData.timestamp)

    for (const currency of Object.keys(MARKET.currencies)) {
      if (!marketData.data[currency]) {
        continue
      }

      const { rates } = marketData

      marketResponse[currency] = {
        currency,
        price: convert(
          AMOUNT_TO_CONVERT, { from: currency, to: token, base: BASE_CURRENCY, rates }
        ),
        marketCap: marketData.data[token].marketCapUsd * (rates[BASE_CURRENCY] / rates[currency]),
        volume: marketData.data[token].volumeUsd24Hr * (rates[BASE_CURRENCY] / rates[currency]),
        date: lastUpdated,
        change24h: null
      }
    }

    return marketResponse
  }
}
