import config from '@config'
import MarketDataService from '@/services/market-data-service'
import timerService from '@/services/timer-service'

import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

jest.useFakeTimers()

let service
beforeEach(() => {
  const mock = new MockAdapter(axios)

  mock
    .onGet(`${config.MARKET.source.baseUrl}/data/pricemultifull?fsyms=ARK&tsyms=BTC,AUD,BRL,CAD,CHF,CNY,EUR,GBP,HKD,IDR,INR,JPY,KRW,MXN,RUB,USD`)
    .reply(200, require('../__fixtures__/services/market-data.json'))

  service = new MarketDataService('ARK')
  timerService.clear()
})

describe('MarketDataService', () => {
  it('should be instance of MarketDataService', () => {
    expect(service).toBeInstanceOf(MarketDataService)
  })

  it('should start a timer', () => {
    const testRun = jest.fn()
    service.fetchMarketData = testRun
    timerService.start(service.timerName, () => {
      service.fetchMarketData()
    })
    expect(testRun).toHaveBeenCalledTimes(1)
    jest.runOnlyPendingTimers()
    expect(testRun).toHaveBeenCalledTimes(2)
  })

  it('should set the token and not restart network', () => {
    const testRun = jest.fn()
    service.fetchMarketData = testRun
    timerService.start(service.timerName, () => {
      service.fetchMarketData()
    })
    expect(testRun).toHaveBeenCalledTimes(1)
    service.setToken('DARK', false)
    expect(service.token).toBe('DARK')
    expect(testRun).toHaveBeenCalledTimes(1)
  })

  it('should change token and restart network', () => {
    const testRun = jest.fn()
    service.fetchMarketData = testRun
    timerService.start(service.timerName, () => {
      service.fetchMarketData()
    })
    expect(testRun).toHaveBeenCalledTimes(1)
    service.setToken('DARK')
    expect(service.token).toBe('DARK')
    expect(testRun).toHaveBeenCalledTimes(2)
    service.setToken('ARK', true)
    expect(service.token).toBe('ARK')
    expect(testRun).toHaveBeenCalledTimes(3)
  })

  it('should have refreshed all currencies', async () => {
    const response = await service.fetchMarketData()
    const entries = Object.keys(response)
    expect(entries).not.toBeEmpty()
    expect(entries).toIncludeAllMembers(config.MARKET.currencies)
  })
})
