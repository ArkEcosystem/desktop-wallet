import got from 'got'
import dayjs from 'dayjs'
import { min, max } from 'lodash'
import { MARKET } from '@config'

export default class CryptoCompareAdapter {
  /**
   * Checks if a token is tradeable
   * @param {String} token
   * @return {(Boolean|null)} Return true if the token is found
   */
  async checkTradeable (token) {
    try {
      const uri = `${MARKET.source.cryptoCompare}/data/price`
      const { body } = await got(uri, {
        query: {
          fsym: token,
          tsyms: 'BTC'
        },
        json: true
      })

      return !!body.BTC
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
    const uri = `${MARKET.source.cryptoCompare}/data/pricemultifull`
    const { body } = await got(uri, {
      query: {
        fsyms: token,
        tsyms: Object.keys(MARKET.currencies).join(',')
      },
      json: true
    })

    return this.__transformMarketResponse(body.RAW && body.RAW[token] ? body.RAW[token] : {})
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
  static async fetchHistoricalData (token, currency, limit, type = 'day', dateFormat = 'DD.MM') {
    const { body } = await got(`${MARKET.source.cryptoCompare}/data/histo${type}`, {
      query: {
        fsym: token,
        tsym: currency,
        toTs: Math.round(new Date().getTime() / 1000),
        limit
      },
      json: true
    })

    return this.__transformHistoricalResponse(body.Data, dateFormat)
  }

  /**
   * Normalize market data reponse to a object
   * @param {Object} response
   * @return {Object}
   */
  static __transformMarketResponse (response) {
    const marketData = {}

    for (const currencyData of Object.values(response)) {
      marketData[currencyData.TOSYMBOL] = {
        currency: currencyData.TOSYMBOL,
        price: currencyData.PRICE,
        marketCap: currencyData.MKTCAP,
        volume: currencyData.TOTALVOLUME24HTO,
        date: new Date(currencyData.LASTUPDATE * 1000),
        change24h: currencyData.CHANGEPCT24HOUR || null
      }
    }

    return marketData
  }

  /**
   * Prepare the historical data response to be used in charts
   * @param {Object} response
   * @param {String} dateFormat
   * @return {Object}
   */
  static __transformHistoricalResponse (response, dateFormat) {
    const datasets = response.map(value => value.close)

    return {
      labels: response.map(value => dayjs(value.time * 1000).format(dateFormat)),
      datasets,
      min: min(datasets),
      max: max(datasets)
    }
  }
}
