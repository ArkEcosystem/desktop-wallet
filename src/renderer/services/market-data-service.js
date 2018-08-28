import axios from 'axios'
import config from '@config'
import timerService from '@/services/timer-service'

export default class MarketDataService {
  constructor (token) {
    this.setToken(token, false)
  }

  /**
   * Get static name for timer.
   * @return {String}
   */
  static get timerName () {
    return 'marketDataService'
  }

  /**
   * Change token used for updating prices.
   * @param {String}    token          New Token to get data for
   * @param {[Boolean]} [restart=true] Whether to restart the timer and trigger a price update
   */
  setToken (token, restart) {
    restart = restart === undefined ? true : restart
    this.token = token.toUpperCase()

    if (restart) {
      timerService.restart(this.timerName)
    }
  }

  /**
   * Fetch market data from API.
   * @return {(Object|null)} Return API response data or null on failure
   */
  async fetchMarketData () {
    const params = [
      `fsyms=${this.token}`,
      `tsyms=${config.MARKET.currencies.join(',')}`
    ]

    try {
      const response = await axios.get(`${config.MARKET.source.baseUrl}/data/pricemultifull?${params.join('&')}`)

      if (!response.data.RAW || !response.data.RAW[this.token]) {
        return []
      }

      const marketData = {}
      for (const currencyData of Object.values(response.data.RAW[this.token])) {
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
    } catch (error) {
      // TODO: show toast message here
      console.log('could not get market data', error)
      return null
    }
  }
}
