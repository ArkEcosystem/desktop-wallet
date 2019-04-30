import Http from '@/services/http'
import { MARKET } from '@config'
import i18n from '@/i18n'
import alertEvents from '@/plugins/alert-events'
import dayjs from 'dayjs'
import { capitalize, keys, min, max } from 'lodash'
import logger from 'electron-log'

class CryptoCompare {
  constructor () {
    this.http = new Http()
  }

  /**
   * Fetch market data from API.
   * @param {String} token
   * @return {(Object|null)} Return API response data or null on failure
   */
  async fetchMarketData (token) {
    const params = {
      fsyms: token,
      tsyms: keys(MARKET.currencies).join(',')
    }

    try {
      const url = `${MARKET.source.baseUrl}/data/pricemultifull`
      const response = await this.http.get(url, { params })
      const data = response.data.RAW && response.data.RAW[token] ? response.data.RAW[token] : {}

      return this.__transformMarketResponse(data)
    } catch (error) {
      logger.error(error)
      alertEvents.$error(i18n.t('COMMON.FAILED_FETCH', {
        name: i18n.t('MARKET.MARKET'),
        msg: error.message
      }))
    }
  }

  /**
   * Returns the price of the last 24h
   * @param {String} token
   * @param {String} currency
   * @return {(Object|null)} Return API response data or null on failure
   */
  async historicPerDay (token, currency) {
    return this.__fetchHistoricalData(token, currency, 24, 'hour', 'HH:mm')
  }

  /**
   * Returns the price of the last week
   * @param {String} token
   * @param {String} currency
   * @return {(Object|null)} Return API response data or null on failure
   */
  async historicPerWeek (token, currency) {
    return this.__fetchHistoricalData(token, currency, 7, 'day', 'ddd')
  }

  /**
   * Returns the price of the last month
   * @param {String} token
   * @param {String} currency
   * @return {(Object|null)} Return API response data or null on failure
   */
  async historicPerMonth (token, currency) {
    return this.__fetchHistoricalData(token, currency, 30, 'day', 'DD')
  }

  /**
   * Returns the price of the last quarter
   * @param {String} token
   * @param {String} currency
   * @return {(Object|null)} Return API response data or null on failure
   */
  async historicPerQuarter (token, currency) {
    return this.__fetchHistoricalData(token, currency, 120)
  }

  /**
   * Returns the price of the last year
   * @param {String} token
   * @param {String} currency
   * @return {(Object|null)} Return API response data or null on failure
   */
  async historicPerYear (token, currency) {
    return this.__fetchHistoricalData(token, currency, 365)
  }

  /**
   * Returns the price according to the type
   * @param {String} type
   * @param {String} token
   * @param {String} currency
   * @return {(Object|null)} Return API response data or null on failure
   */
  async historicByType (type, token, currency) {
    const method = `historicPer${capitalize(type)}`
    return this[method](token, currency)
  }

  /**
   * Checks if a token is tradeable
   * @param {String} token
   * @return {(Boolean|null)} Return true if the token is found
   */
  async checkTradeable (token) {
    const params = {
      fsym: token,
      tsyms: 'BTC'
    }

    try {
      const url = `${MARKET.source.baseUrl}/data/price`
      const response = await this.http.get(url, { params })
      return !!response.data.BTC
    } catch (error) {
      return null
    }
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
  async __fetchHistoricalData (token, currency, limit, type = 'day', dateFormat = 'DD.MM') {
    const date = Math.round(new Date().getTime() / 1000)
    const url = `${MARKET.source.baseUrl}/data/histo${type}`
    const params = {
      fsym: token,
      tsym: currency,
      toTs: date,
      limit
    }

    try {
      const response = await this.http.get(url, { params })
      return this.__transformHistoricalResponse(response.data.Data, dateFormat)
    } catch (error) {
      logger.error(error)
      alertEvents.$error(i18n.t('COMMON.FAILED_FETCH', {
        name: i18n.t('MARKET.HISTORICAL_DATA'),
        msg: error.message
      }))
    }
  }

  /**
   * Normalize market data reponse to a object
   * @param {Object} response
   * @return {Object}
   */
  __transformMarketResponse (response) {
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
  __transformHistoricalResponse (response, dateFormat) {
    const labels = response.map(value => dayjs(value.time * 1000).format(dateFormat))
    const datasets = response.map(value => value.close)

    return {
      labels,
      datasets,
      min: min(datasets),
      max: max(datasets)
    }
  }
}

export default new CryptoCompare()
