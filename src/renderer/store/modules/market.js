import { MarketTicker } from '@/models/market'
import { forEach, keys } from 'lodash'
import cryptoCompare from '@/services/crypto-compare'
import { MARKET } from '@config'
import Vue from 'vue'

export default {
  namespaced: true,

  state: () => ({
    tickers: {}
  }),

  getters: {
    currencies: () => keys(MARKET.currencies),
    lastPrice: (_, getters) => {
      const lastTicker = getters['lastTicker']
      return lastTicker ? lastTicker.price : null
    },
    lastTicker: (state, getters, _, rootGetters) => {
      const network = rootGetters['session/network']
      if (!network) {
        return
      }
      const token = network.token
      const currency = rootGetters['session/currency']
      const market = `${token}/${currency}`

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
      const data = await cryptoCompare.fetchMarketData(ticker)
      if (!data) return

      forEach(data, (value) => {
        value.token = ticker
        commit('UPDATE_TICKER', value)
      })
    }
  }
}
