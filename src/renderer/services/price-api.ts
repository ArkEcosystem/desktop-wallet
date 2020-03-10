/* eslint-disable @typescript-eslint/ban-ts-ignore */
import logger from 'electron-log'
import i18n from '@/i18n'
import { capitalize } from '@/utils'
import alertEvents from '@/plugins/alert-events'
import { PriceTrackerService } from '@arkecosystem/platform-sdk'

class PriceApi {
  private adapter = 'cryptocompare';

  public getAdapter () {
    return PriceTrackerService.make(this.adapter)
  }

  public setAdapter (adapter: string) {
    this.adapter = adapter
  }

  public async verifyToken (token: string) {
    try {
      return this.getAdapter().verifyToken(token)
    } catch (error) {
      logger.error(error)
      // @ts-ignore - todo: needs types
      alertEvents.$error(
        i18n.t('COMMON.FAILED_FETCH', {
          name: i18n.t('MARKET.CHECK_TRADEABLE'),
          msg: error.message
        })
      )
    }

    return null
  }

  public async marketData (token: string) {
    try {
      const marketData = this.getAdapter().marketData(token)

      if (!marketData) {
        logger.warn(`${token} market data does not exist on ${this.adapter}`)
      }

      return marketData
    } catch (error) {
      logger.error(error)
      // @ts-ignore - todo: needs types
      alertEvents.$error(
        i18n.t('COMMON.FAILED_FETCH', {
          name: i18n.t('MARKET.MARKET'),
          msg: error.message
        })
      )
    }
  }

  public async historicalPriceFor (
    type: string,
    token: string,
    currency: string
  ) {
    try {
      // @ts-ignore
      return this.getAdapter()[`historicalPriceFor${capitalize(type)}`](
        token,
        currency
      )
    } catch (error) {
      logger.error(error)
      // @ts-ignore - todo: needs types
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
