import nock from 'nock'
import { MARKET } from '@config'
import priceApi from '@/services/price-api'
import CryptoCompareAdapter from '@/services/price-api/crypto-compare'
import CoinGeckoAdapter from '@/services/price-api/coin-gecko'
import CoinCapAdapter from '@/services/price-api/coin-cap'

describe('PriceApi', () => {
  const token = 'ARK'
  const currency = 'USD'

  describe.each([
    ['cryptoCompare', CryptoCompareAdapter],
    ['coinGecko', CoinGeckoAdapter],
    ['coinCap', CoinCapAdapter]
  ])('%s', (adapterName, adapter) => {
    beforeEach(() => {
      priceApi.setAdapter(adapterName.toLowerCase())

      if (adapterName === 'cryptoCompare') {
        nock(MARKET.source[adapterName])
          .get('/data/pricemultifull')
          .query(true)
          .reply(200, require('../__fixtures__/services/price-api/crypto-compare/market.json'))

        nock(MARKET.source[adapterName])
          .get(/\/data\/histo.+/)
          .reply(200, require('../__fixtures__/services/price-api/crypto-compare/historical.json'))
      } else if (adapterName === 'coinGecko') {
        nock(MARKET.source[adapterName])
          .get('/coins/list')
          .reply(200, [{
            id: 'ark',
            symbol: 'ark',
            name: 'ark'
          }, {
            id: 'dark',
            symbol: 'dark',
            name: 'dark'
          }])

        nock(MARKET.source[adapterName])
          .get('/simple/price')
          .query(true)
          .reply(200, {
            ark: {
              btc: 0.0000207
            }
          })

        nock(MARKET.source[adapterName])
          .get('/coins/ark')
          .reply(200, require('../__fixtures__/services/price-api/coin-gecko/market.json'))

        nock(MARKET.source[adapterName])
          .get('/coins/ark/market_chart')
          .query(true)
          .reply(200, require('../__fixtures__/services/price-api/coin-gecko/historical.json'))
      } else {
        nock(MARKET.source[adapterName])
          .get('/assets')
          .query(true)
          .reply(200, require('../__fixtures__/services/price-api/coin-cap/assets.json'))

        nock(MARKET.source[adapterName])
          .get('/assets/ark')
          .reply(200, {
            data: {
              id: 'ark',
              rank: '97',
              symbol: 'ARK',
              name: 'Ark',
              supply: '118054742.0000000000000000',
              maxSupply: null,
              marketCapUsd: '25606314.3186528481730628',
              volumeUsd24Hr: '200149.6642060181260072',
              priceUsd: '0.2169020395525734',
              changePercent24Hr: '4.0498226198624989',
              vwap24Hr: '0.2168174454697512'
            },
            timestamp: 1581339180902
          })

        nock(MARKET.source[adapterName])
          .get('/rates')
          .reply(200, require('../__fixtures__/services/price-api/coin-cap/rates.json'))

        nock(MARKET.source[adapterName])
          .get('/assets/ark/history')
          .query(true)
          .reply(200, require('../__fixtures__/services/price-api/coin-cap/historical.json'))
      }
    })

    it('should return ticker values', async () => {
      const response = await priceApi.fetchMarketData(token)
      const entries = Object.keys(response)
      expect(entries).not.toBeEmpty()
      expect(entries).toIncludeAllMembers(Object.keys(MARKET.currencies))

      if (adapterName === 'cryptoCompare') {
        expect(response.USD.price).toBe(0.178045896)
      } else if (adapterName === 'coinGecko') {
        expect(response.USD.price).toBe(0.176829)
      } else {
        expect(response.USD.price).toBe(0.2169020395525734)
      }
    })

    describe('checkTradeable', () => {
      it('should return true if found', async () => {
        if (adapterName === 'cryptoCompare') {
          nock(MARKET.source[adapterName])
            .get('/data/price')
            .query(true)
            .reply(200, {
              BTC: 0.00002073
            })
        }

        expect(await priceApi.checkTradeable('ark')).toBe(true)
      })

      it('should return false if not found', async () => {
        if (adapterName === 'cryptoCompare') {
          nock(MARKET.source[adapterName])
            .get('/data/price')
            .query(true)
            .reply(200, {
              Response: 'Error'
            })
        }

        expect(await priceApi.checkTradeable('not-ark')).toBe(false)
      })
    })

    if (adapterName === 'coinGecko') {
      it('should get token ids from api', async () => {
        const spy = jest.spyOn(CoinGeckoAdapter, 'getTokenId')

        await priceApi.checkTradeable('ARK')

        expect(adapter.tokenLookup).toEqual({
          ARK: 'ark',
          DARK: 'dark'
        })
        expect(spy).toHaveBeenCalledWith('ARK')

        spy.mockRestore()
      })
    }

    it('should return historic day values', async () => {
      const response = await priceApi.historicPerDay(token, currency)
      expect(response).toBeObject()
      expect(response).toContainKeys(['labels', 'datasets'])
    })

    it('should return historic week values', async () => {
      const response = await priceApi.historicPerWeek(token, currency)
      expect(response).toBeObject()
      expect(response).toContainKeys(['labels', 'datasets'])
    })

    it('should return historic month values', async () => {
      const response = await priceApi.historicPerMonth(token, currency)
      expect(response).toBeObject()
      expect(response).toContainKeys(['labels', 'datasets'])
    })

    it('should return historic quarter values', async () => {
      const response = await priceApi.historicPerQuarter(token, currency)
      expect(response).toBeObject()
      expect(response).toContainKeys(['labels', 'datasets'])
    })

    it('should return historic year values', async () => {
      const response = await priceApi.historicPerYear(token, currency)
      expect(response).toBeObject()
      expect(response).toContainKeys(['labels', 'datasets'])
    })
  })
})
