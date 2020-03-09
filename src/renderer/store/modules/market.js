import { MarketTicker } from '@/models/market'
import priceApi from '@/services/price-api'
import Vue from 'vue'

export default {
  namespaced: true,

  state: () => ({
    tickers: {}
  }),

  getters: {
    lastPrice: (_, getters) => {
      const lastTicker = getters.lastTicker
      return lastTicker ? lastTicker.price : null
    },
    lastTicker: (state, _, __, rootGetters) => {
      const network = rootGetters['session/network']
      if (!network) {
        return
      }
      const ticker = network.market.ticker
      const currency = rootGetters['session/currency']
      const market = `${ticker}/${currency}`

      return state.tickers[market]
    }
  },

  mutations: {
    UPDATE_TICKERS (state, tickers) {
      Vue.set(state, 'tickers', tickers)
    }
  },

  actions: {
    async refreshTicker ({ commit, rootGetters }) {
      const network = rootGetters['session/network']
      if (!network || !network.market || !network.market.enabled) {
        return
      }

      const ticker = network.market.ticker
      const data = await priceApi.marketData(ticker)
      if (!data) {
        return
      }

      const tickers = {}
      for (const value of Object.values(data)) {
        const marketTicker = MarketTicker.deserialize({
          ...value,
          token: ticker
        })

        tickers[marketTicker.id] = marketTicker
      }
      commit('UPDATE_TICKERS', tickers)
    }
  }
}
