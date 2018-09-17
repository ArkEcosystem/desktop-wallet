import axios from 'axios'
import { MARKET } from '@config'
import i18n from '@/i18n'
import alertEvents from '@/plugins/alert-events'
import dayjs from 'dayjs'

class CryptoCompare {
  /**
   * Fetch market data from API.
   * @param {String} token
   * @return {(Object|null)} Return API response data or null on failure
   */
  async fetchMarketData (token) {
    const params = {
      fsyms: token,
      tsyms: MARKET.currencies.join(',')
    }

    try {
      const uri = `${MARKET.source.baseUrl}/data/pricemultifull`
      const response = await axios.get(uri, { params })
      const data = response.data.RAW && response.data.RAW[token] ? response.data.RAW[token] : {}

      return this.__transformMarketResponse(data)
    } catch (error) {
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
    return this.__fetchHistoricalData(token, currency, 7)
  }

  /**
   * Returns the price of the last month
   * @param {String} token
   * @param {String} currency
   * @return {(Object|null)} Return API response data or null on failure
   */
  async historicPerMonth (token, currency) {
    return this.__fetchHistoricalData(token, currency, 30)
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
    const uri = `${MARKET.source.baseUrl}/data/histo${type}`
    const params = {
      fsym: token,
      tsym: currency,
      toTs: date,
      limit
    }

    try {
      const response = await axios.get(uri, { params })
      return this.__transformHistoricalResponse(response.data.Data, dateFormat)
    } catch (error) {
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
   * Prepare the historical data reponse to be used in charts
   * @param {Object} response
   * @param {String} dateFormat
   * @return {Object}
   */
  __transformHistoricalResponse (response, dateFormat) {
    return {
      labels: response.map(value => {
        return dayjs(value.time).format(dateFormat)
      }),
      datasets: response.map(value => {
        return value.close
      })
    }
  }
}

export default new CryptoCompare()
