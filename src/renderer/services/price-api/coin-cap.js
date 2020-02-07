import got from 'got'
// import dayjs from 'dayjs'
// import { min, max } from 'lodash'
import { MARKET } from '@config'

// const BASE_CURRENCY = 'USD'

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

      return this.tokenLookup[token.toUpperCase()] || token.toLowerCase
    } catch (error) {
    }

    return null
  }

  /**
   * Get ark data from api
   * @return {(Object|null)}
   */
  static async getArkRate () {
    let arkRate = {}

    try {
      const uri = `${MARKET.source.coinCap}/assets/ark`
      const { body } = await got(uri, {
        json: true
      })
      const { data } = body
      const { symbol, priceUsd } = data

      arkRate[symbol.toUpperCase()] = priceUsd

      return arkRate
    } catch (error) {
    }

    return null
  }

  /**
   * Get data rates from api
   * @return {(Object|null)}
   */
  static async getRates () {
    let rates = {}

    try {
      const uri = `${MARKET.source.coinCap}/rates`
      const { body } = await got(uri, {
        json: true
      })
      const { data } = body
      const arkRate = await this.getArkRate()

      rates = data.reduce((map, value, index) => {
        map[value.symbol.toUpperCase()] = value.rateUsd

        return map
      }, {})

      rates = Object.assign({}, rates, arkRate)

      return rates
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
}
