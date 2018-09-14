import axios from 'axios'
import { MARKET } from '@config'
import i18n from '@/i18n'
import alertEvents from '@/plugins/alert-events'

class CryptoCompare {
  /**
   * Fetch market data from API.
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

      if (!response.data.RAW || !response.data.RAW[token]) {
        return []
      }

      const marketData = {}
      for (const currencyData of Object.values(response.data.RAW[token])) {
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
      alertEvents.$error(i18n.t('COMMON.FAILED_FETCH', {
        name: 'market',
        msg: error.message
      }))
      return null
    }
  }
}

export default new CryptoCompare()
