import logger from 'electron-log'
import i18n from '@/i18n'
import { capitalize } from '@/utils'
import alertEvents from '@/plugins/alert-events'
import CryptoCompareAdapter from './price-api/crypto-compare'
import CoinGeckoAdapter from './price-api/coin-gecko'
import CoinCapAdapter from './price-api/coin-cap'

class PriceApi {
  setAdapter (adapter) {
    this.adapter = adapter
  }

  getAdapter () {
    if (this.adapter === 'cryptocompare') {
      return CryptoCompareAdapter
    } else if (this.adapter === 'coincap') {
      return CoinCapAdapter
    }

    return CoinGeckoAdapter
  }

  /**
   * Fetch market data from API.
   * @param {String} token
   * @return {(Object|null)} Return API response data or null on failure
   */
  async fetchMarketData (token) {
    try {
      const marketData = this.getAdapter().fetchMarketData(token)

      if (!marketData) {
        logger.warn(`${token} market data does not exist on ${this.adapter}`)
      }

      return marketData
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
    return this.fetchHistoricalData(token, currency, 24, 'hour', 'HH:mm')
  }

  /**
   * Returns the price of the last week
   * @param {String} token
   * @param {String} currency
   * @return {(Object|null)} Return API response data or null on failure
   */
  async historicPerWeek (token, currency) {
    return this.fetchHistoricalData(token, currency, 7, 'day', 'ddd')
  }

  /**
   * Returns the price of the last month
   * @param {String} token
   * @param {String} currency
   * @return {(Object|null)} Return API response data or null on failure
   */
  async historicPerMonth (token, currency) {
    return this.fetchHistoricalData(token, currency, 30, 'day', 'DD')
  }

  /**
   * Returns the price of the last quarter
   * @param {String} token
   * @param {String} currency
   * @return {(Object|null)} Return API response data or null on failure
   */
  async historicPerQuarter (token, currency) {
    return this.fetchHistoricalData(token, currency, 120)
  }

  /**
   * Returns the price of the last year
   * @param {String} token
   * @param {String} currency
   * @return {(Object|null)} Return API response data or null on failure
   */
  async historicPerYear (token, currency) {
    return this.fetchHistoricalData(token, currency, 365)
  }

  /**
   * Returns the price according to the type
   * @param {String} type
   * @param {String} token
   * @param {String} currency
   * @return {(Object|null)} Return API response data or null on failure
   */
  async historicByType (type, token, currency) {
    return this[`historicPer${capitalize(type)}`](token, currency)
  }

  /**
   * Checks if a token is tradeable
   * @param {String} token
   * @return {(Boolean|null)} Return true if the token is found
   */
  async checkTradeable (token) {
    try {
      return this.getAdapter().checkTradeable(token)
    } catch (error) {
      logger.error(error)
      alertEvents.$error(i18n.t('COMMON.FAILED_FETCH', {
        name: i18n.t('MARKET.CHECK_TRADEABLE'),
        msg: error.message
      }))
    }

    return null
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
  async fetchHistoricalData (token, currency, limit, type = 'day', dateFormat = 'DD.MM') {
    try {
      return this.getAdapter().fetchHistoricalData(token, currency, limit, type, dateFormat)
    } catch (error) {
      logger.error(error)
      alertEvents.$error(i18n.t('COMMON.FAILED_FETCH', {
        name: i18n.t('MARKET.HISTORICAL_DATA'),
        msg: error.message
      }))
    }
  }
}

export default new PriceApi()
