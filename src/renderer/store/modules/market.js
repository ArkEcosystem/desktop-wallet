import { MarketTicker } from '@/models/market'
import { forEach } from 'lodash'
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
    lastTicker: (state, getters, _, rootGetters) => {
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
    UPDATE_TICKER (state, ticker) {
      const marketTicker = MarketTicker.deserialize(ticker)
      Vue.set(state.tickers, marketTicker.id, marketTicker)
    }
  },

  actions: {
    async refreshTicker ({ commit, rootGetters }) {
      const network = rootGetters['session/network']
      if (!network || !network.market || !network.market.enabled) {
        return
      }

      const ticker = network.market.ticker
      const data = await priceApi.fetchMarketData(ticker)
      if (!data) return

      forEach(data, (value) => {
        value.token = ticker
        commit('UPDATE_TICKER', value)
      })
    }
  }
}
