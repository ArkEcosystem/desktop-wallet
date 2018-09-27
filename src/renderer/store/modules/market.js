import { MarketTicker } from '@/models/market'
import { find, forEach, keys, isFunction, includes } from 'lodash'
import cryptoCompare from '@/services/crypto-compare'
import { MARKET } from '@config'

export default {
  namespaced: true,

  state: () => ({
    tickers: {}
  }),

  getters: {
    formatPrice: (_, __, ___, rootGetters) => ({ value, format }) => {
      const network = rootGetters['session/currentNetwork']
      const token = network.token

      const currency = rootGetters['session/currency']
      const symbol = MARKET.currencies[currency]

      if (includes(MARKET.crypto, currency)) {
        value = Number(value).toFixed(8)
      } else {
        value = Number(value).toFixed(2)
      }

      if (isFunction(format)) {
        return format({ token, currency, symbol, value })
      }

      return value
    },
    tickerByCurrency: state => (currency) => find(state.tickers, { currency }),
    currencies: () => keys(MARKET.currencies)
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
