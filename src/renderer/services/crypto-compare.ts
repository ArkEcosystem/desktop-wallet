/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as got from 'got'
import * as dayjs from 'dayjs'
import { MARKET } from '@config'
import i18n from '@/i18n'
import alertEvents from '@/plugins/alert-events'
import { keys, min, max } from 'lodash'
import logger from 'electron-log'

interface MarketSymbol {
  [symbol: string]: {
    currency: string;
    price: number;
    marketCap: number;
    volume: number;
    date: Date;
    change24h?: number;
  };
}

interface MarketHistorical {
  labels: string[];
  datasets: number[];
  min: number;
  max: number;
}

interface SymbolTicker {
  TOSYMBOL: string;
  PRICE: number;
  MKTCAP: number;
  TOTALVOLUME24HTO: number;
  LASTUPDATE: number;
  CHANGEPCT24HOUR?: number;
}

interface PriceTicker {
  time: number;
  close: number;
  high: number;
  low: number;
  open: number;
  volumefrom: number;
  volumeto: number;
}

class CryptoCompare {
  /**
   * Fetch market data from API.
   */
  async fetchMarketData (token: string): Promise<MarketSymbol | undefined> {
    const query = {
      fsyms: token,
      tsyms: keys(MARKET.currencies).join(',')
    }

    try {
      const uri = `${MARKET.source.baseUrl}/data/pricemultifull`
      const response = await got(uri, { query, json: true })
      const data = response.body.RAW && response.body.RAW[token] ? response.body.RAW[token] : {}

      return this.__transformMarketResponse(data)
    } catch (error) {
      logger.error(error)
      // @ts-ignore
      alertEvents.$error(i18n.t('COMMON.FAILED_FETCH', {
        name: i18n.t('MARKET.MARKET'),
        msg: error.message
      }))
    }
  }

  /**
   * Returns the price of the last 24h
   */
  async historicPerDay (token: string, currency: string): Promise<MarketHistorical | undefined> {
    return this.__fetchHistoricalData(token, currency, 24, 'hour', 'HH:mm')
  }

  /**
   * Returns the price of the last week
   */
  async historicPerWeek (token: string, currency: string): Promise<MarketHistorical | undefined> {
    return this.__fetchHistoricalData(token, currency, 7, 'day', 'ddd')
  }

  /**
   * Returns the price of the last month
   */
  async historicPerMonth (token: string, currency: string): Promise<MarketHistorical | undefined> {
    return this.__fetchHistoricalData(token, currency, 30, 'day', 'DD')
  }

  /**
   * Returns the price of the last quarter
   */
  async historicPerQuarter (token: string, currency: string): Promise<MarketHistorical | undefined> {
    return this.__fetchHistoricalData(token, currency, 120)
  }

  /**
   * Returns the price of the last year
   */
  async historicPerYear (token: string, currency: string): Promise<MarketHistorical | undefined> {
    return this.__fetchHistoricalData(token, currency, 365)
  }

  /**
   * Returns the price according to the type
   */
  async historicByType (type: 'day' | 'week' | 'month' | 'quarter' | 'year', token: string, currency: string): Promise<MarketHistorical | undefined> {
    switch (type) {
      case 'day':
        return this.historicPerDay(token, currency)
      case 'week':
        return this.historicPerWeek(token, currency)
      case 'month':
        return this.historicPerMonth(token, currency)
      case 'quarter':
        return this.historicPerQuarter(token, currency)
      case 'year':
        return this.historicPerYear(token, currency)
    }
  }

  /**
   * Checks if a token is tradeable
   */
  async checkTradeable (token: string): Promise<boolean> {
    const query = {
      fsym: token,
      tsyms: 'BTC'
    }

    try {
      const uri = `${MARKET.source.baseUrl}/data/price`
      const response = await got(uri, { query, json: true })
      return !!response.body.BTC
    } catch (error) {
      return false
    }
  }

  /**
 * Fetch historical data from API.
 */
  async __fetchHistoricalData (token: string, currency: string, limit: number, type = 'day', dateFormat = 'DD.MM'): Promise<MarketHistorical | undefined> {
    const date = Math.round(new Date().getTime() / 1000)
    const uri = `${MARKET.source.baseUrl}/data/histo${type}`
    const query = {
      fsym: token,
      tsym: currency,
      toTs: date,
      limit
    }

    try {
      const response = await got(uri, { query, json: true })
      return this.__transformHistoricalResponse(response.body.Data, dateFormat)
    } catch (error) {
      logger.error(error)
      // @ts-ignore
      alertEvents.$error(i18n.t('COMMON.FAILED_FETCH', {
        name: i18n.t('MARKET.HISTORICAL_DATA'),
        msg: error.message
      }))
    }
  }

  /**
   * Normalize market data reponse to a object
   */
  __transformMarketResponse (response: { [tsym: string]: SymbolTicker }): MarketSymbol {
    const marketData: MarketSymbol = {}

    for (const currencyData of Object.values(response)) {
      marketData[currencyData.TOSYMBOL] = {
        currency: currencyData.TOSYMBOL,
        price: currencyData.PRICE,
        marketCap: currencyData.MKTCAP,
        volume: currencyData.TOTALVOLUME24HTO,
        date: new Date(currencyData.LASTUPDATE * 1000),
        change24h: currencyData.CHANGEPCT24HOUR
      }
    }

    return marketData
  }

  /**
   * Prepare the historical data response to be used in charts
   */
  __transformHistoricalResponse (response: PriceTicker[], dateFormat: string): MarketHistorical {
    const labels = response.map(value => dayjs(value.time * 1000).format(dateFormat))
    const datasets = response.map(value => value.close)

    return {
      labels,
      datasets,
      min: min(datasets) || 0,
      max: max(datasets) || 0
    }
  }
}

export default new CryptoCompare()
