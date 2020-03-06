import logger from 'electron-log'
import i18n from '@/i18n'
import { capitalize } from '@/utils'
import alertEvents from '@/plugins/alert-events'
import { PriceTrackerService } from '@arkecosystem/platform-sdk'

class PriceApi {
  setAdapter (adapter) {
    this.adapter = adapter
  }

  getAdapter () {
    return PriceTrackerService.make(this.adapter || 'cryptocompare')
  }

  async verifyToken (token) {
    try {
      return this.getAdapter().verifyToken(token)
    } catch (error) {
      logger.error(error)
      alertEvents.$error(
        i18n.t('COMMON.FAILED_FETCH', {
          name: i18n.t('MARKET.CHECK_TRADEABLE'),
          msg: error.message
        })
      )
    }

    return null
  }

  async marketData (token) {
    try {
      const marketData = this.getAdapter().marketData(token)

      if (!marketData) {
        logger.warn(`${token} market data does not exist on ${this.adapter}`)
      }

      return marketData
    } catch (error) {
      logger.error(error)
      alertEvents.$error(
        i18n.t('COMMON.FAILED_FETCH', {
          name: i18n.t('MARKET.MARKET'),
          msg: error.message
        })
      )
    }
  }

  async historicalPriceFor (type, token, currency) {
    try {
      return this.getAdapter()[`historicalPriceFor${capitalize(type)}`](
        token,
        currency
      )
    } catch (error) {
      logger.error(error)
      alertEvents.$error(
        i18n.t('COMMON.FAILED_FETCH', {
          name: i18n.t('MARKET.HISTORICAL_DATA'),
          msg: error.message
        })
      )
    }
  }
}

export default new PriceApi()
