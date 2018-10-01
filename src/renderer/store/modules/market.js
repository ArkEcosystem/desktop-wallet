import { MarketTicker } from '@/models/market'
import { forEach, keys } from 'lodash'
import cryptoCompare from '@/services/crypto-compare'
import { MARKET } from '@config'

export default {
  namespaced: true,

  state: () => ({
    tickers: {}
  }),

  getters: {
    currencies: () => keys(MARKET.currencies),
    lastPrice: (state, getters) => {
      return getters['lastTicker'].price
    },
    lastTicker: (state, getters, _, rootGetters) => {
      const token = rootGetters['session/currentNetwork'].token
      const currency = rootGetters['session/currency']
      const market = `${token}/${currency}`

      return state.tickers[market]
    }
  },

  mutations: {
    UPDATE_TICKER (state, ticker) {
      const marketTicker = MarketTicker.deserialize(ticker)
      state.tickers[marketTicker.id] = marketTicker
    }
  },

  actions: {
    load ({ dispatch }) {
      dispatch('timer/subscribe', {
        interval: 'medium',
        callback: () => dispatch('refreshTicker'),
        immediate: true
      }, { root: true })
    },

    async refreshTicker ({ commit, rootGetters }) {
      const network = rootGetters['session/currentNetwork']
      if (!network || !network.market || !network.market.enabled) {
        return
      }

      const ticker = network.market.ticker
      const data = await cryptoCompare.fetchMarketData(ticker)
      if (!data) return

      forEach(data, (value) => {
        value.token = ticker
        commit('UPDATE_TICKER', value)
      })
    }
  }
}
