import nock from 'nock'
import { MARKET } from '@config'
import { keys } from 'lodash'
import cryptoCompare from '@/services/crypto-compare'

describe('CryptoCompare', () => {
  const token = 'ARK'
  const currency = 'USD'
  const baseUrl = MARKET.source.baseUrl

  beforeEach(() => {
    nock(baseUrl)
      .get('/data/pricemultifull')
      .query(true)
      .reply(200, require('../__fixtures__/services/crypto-compare-market.json'))
    nock(baseUrl)
      .get(/\/data\/histo.+/)
      .reply(200, require('../__fixtures__/services/crypto-compare-historical.json'))
  })

  it('should return ticker values', async () => {
    const response = await cryptoCompare.fetchMarketData(token)
    const entries = Object.keys(response)
    expect(entries).not.toBeEmpty()
    expect(entries).toIncludeAllMembers(keys(MARKET.currencies))
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
