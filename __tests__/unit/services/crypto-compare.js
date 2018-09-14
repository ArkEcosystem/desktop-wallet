import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { MARKET } from '@config'
import cryptoCompare from '@/services/crypto-compare'

describe('CryptoCompare', () => {
  beforeEach(() => {
    const mock = new MockAdapter(axios)
    const params = {
      fsyms: 'ARK',
      tsyms: MARKET.currencies.join(',')
    }
    mock
      .onGet(`${MARKET.source.baseUrl}/data/pricemultifull`, { params })
      .reply(200, require('../__fixtures__/services/crypto-compare.json'))
  })

  it('should have refreshed all currencies', async () => {
    const response = await cryptoCompare.fetchMarketData('ARK')
    const entries = Object.keys(response)
    expect(entries).not.toBeEmpty()
    expect(entries).toIncludeAllMembers(MARKET.currencies)
  })
})
