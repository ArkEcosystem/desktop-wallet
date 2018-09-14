import { MarketTicker } from '@/models/market'
import { find, forEach } from 'lodash'
import cryptoCompare from '@/services/crypto-compare'

export default {
  namespaced: true,

  state: () => ({
    tickers: {}
  }),

  getters: {
    tickerByCurrency: state => (currency) => find(state.tickers, { currency })
  },

  mutations: {
    UPDATE_TICKER (state, ticker) {
      const marketTicker = MarketTicker.deserialize(ticker)
      state.tickers[marketTicker.id] = marketTicker
    }
  },

  actions: {
    load ({ dispatch }) {
      dispatch('timer/listen', {
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
