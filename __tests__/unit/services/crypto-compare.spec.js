import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { MARKET } from '@config'
import cryptoCompare from '@/services/crypto-compare'

describe('CryptoCompare', () => {
  const token = 'ARK'
  const currency = 'USD'
  const baseUrl = MARKET.source.baseUrl

  beforeEach(() => {
    const historicalRegex = new RegExp(`^${baseUrl}/data/histo.*`)
    const mock = new MockAdapter(axios)

    mock
      .onGet(`${baseUrl}/data/pricemultifull`)
      .reply(200, require('../__fixtures__/services/crypto-compare-market.json'))
    mock
      .onGet(historicalRegex)
      .reply(200, require('../__fixtures__/services/crypto-compare-historical.json'))
  })

  it('should return ticker values', async () => {
    const response = await cryptoCompare.fetchMarketData(token)
    const entries = Object.keys(response)
    expect(entries).not.toBeEmpty()
    expect(entries).toIncludeAllMembers(MARKET.currencies)
  })

  it('should return historic day values', async () => {
    const response = await cryptoCompare.historicPerDay(token, currency)
    expect(response).toBeObject()
    expect(response).toContainKeys(['labels', 'datasets'])
  })

  it('should return historic week values', async () => {
    const response = await cryptoCompare.historicPerWeek(token, currency)
    expect(response).toBeObject()
    expect(response).toContainKeys(['labels', 'datasets'])
  })

  it('should return historic month values', async () => {
    const response = await cryptoCompare.historicPerMonth(token, currency)
    expect(response).toBeObject()
    expect(response).toContainKeys(['labels', 'datasets'])
  })

  it('should return historic quarter values', async () => {
    const response = await cryptoCompare.historicPerQuarter(token, currency)
    expect(response).toBeObject()
    expect(response).toContainKeys(['labels', 'datasets'])
  })

  it('should return historic year values', async () => {
    const response = await cryptoCompare.historicPerYear(token, currency)
    expect(response).toBeObject()
    expect(response).toContainKeys(['labels', 'datasets'])
  })
})
