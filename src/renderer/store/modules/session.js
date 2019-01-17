import { I18N, MARKET } from '@config'
import i18n from '@/i18n'

export default {
  namespaced: true,

  state: () => ({
    avatar: null,
    background: null,
    currency: null,
    language: null,
    isMarketChartEnabled: true,
    name: null,
    profileId: null,
    theme: null,
    layout: null,
    contentProtection: true,
    backgroundUpdateLedger: null,
    broadcastPeers: null,
    ledgerCache: null,
    transactionTableRowCount: 10
  }),

  getters: {
    profileId (state) {
      return state.profileId
    },
    profile (state, _, __, rootGetters) {
      if (!state.profileId) {
        return
      }

      return rootGetters['profile/byId'](state.profileId)
    },
    network (state, getters, __, rootGetters) {
      if (!state.profileId) {
        return
      }

      const { networkId } = getters['profile']
      var network = rootGetters['network/byId'](networkId)

      if (!network) {
        network = rootGetters['network/customNetworkById'](networkId)
      }
      return network
    },
    avatar: state => state.avatar,
    background: state => state.background,
    currency: state => state.currency,
    timeFormat: state => state.timeFormat,
    isMarketChartEnabled: state => state.isMarketChartEnabled,
    theme: state => state.theme,
    layout: state => state.layout,
    language: state => state.language,
    bip39Language: state => state.bip39Language,
    name: state => state.name,
    hasDarkTheme: state => state.theme === 'dark',
    hasGridLayout: state => state.layout === 'grid',
    contentProtection: state => state.contentProtection,
    backgroundUpdateLedger: state => state.backgroundUpdateLedger,
    broadcastPeers: state => state.broadcastPeers,
    ledgerCache: state => state.ledgerCache,
    transactionTableRowCount: state => state.transactionTableRowCount
  },

  mutations: {
    SET_AVATAR (state, avatar) {
      state.avatar = avatar
    },

    SET_BACKGROUND (state, background) {
      state.background = background
    },

    SET_CURRENCY (state, currency) {
      state.currency = currency
    },

    SET_TIME_FORMAT (state, format) {
      state.timeFormat = format
    },

    SET_IS_MARKET_CHART_ENABLED (state, isEnabled) {
      state.isMarketChartEnabled = isEnabled
    },

    SET_LANGUAGE (state, language) {
      state.language = language
    },

    SET_BIP39_LANGUAGE (state, bip39Language) {
      state.bip39Language = bip39Language
    },

    SET_NAME (state, name) {
      state.name = name
    },

    SET_PROFILE_ID (state, profileId) {
      state.profileId = profileId
    },

    SET_THEME (state, theme) {
      state.theme = theme
    },

    SET_LAYOUT (state, layout) {
      state.layout = layout
    },

    SET_CONTENT_PROTECTION (state, protection) {
      state.contentProtection = protection
    },

    SET_BACKGROUND_UPDATE_LEDGER (state, update) {
      state.backgroundUpdateLedger = update
    },

    SET_BROADCAST_PEERS (state, broadcast) {
      state.broadcastPeers = broadcast
    },

    SET_LEDGER_CACHE (state, enabled) {
      state.ledgerCache = enabled
    },

    SET_TRANSACTION_TABLE_ROW_COUNT (state, count) {
      state.transactionTableRowCount = count
    },

    RESET (state) {
      state.avatar = 'pages/new-profile-avatar.svg'
      state.background = null
      state.currency = MARKET.defaultCurrency
      state.timeFormat = 'Default'
      state.isMarketChartEnabled = true
      state.language = I18N.defaultLocale
      state.bip39Language = 'english'
      state.name = null
      state.theme = 'light'
      state.layout = 'grid'
      state.backgroundUpdateLedger = true
      state.broadcastPeers = true
      state.contentProtection = true
      state.ledgerCache = false
      state.transactionTableRowCount = 10
    }
  },

  actions: {
    load ({ rootGetters, dispatch }, profileId) {
      const profile = rootGetters['profile/byId'](profileId)
      if (!profile) return

      dispatch('setAvatar', profile.avatar)
      dispatch('setBackground', profile.background)
      dispatch('setCurrency', profile.currency)
      dispatch('setTimeFormat', profile.timeFormat)
      dispatch('setIsMarketChartEnabled', profile.isMarketChartEnabled)
      dispatch('setName', profile.name)
      dispatch('setLanguage', profile.language)
      dispatch('setBip39Language', profile.bip39Language)
      dispatch('setTheme', profile.theme)
      dispatch('setLayout', profile.layout)
      dispatch('setBackgroundUpdateLedger', profile.backgroundUpdateLedger)
      dispatch('setBroadcastPeers', profile.broadcastPeers)
      dispatch('setLedgerCache', profile.ledgerCache)
      dispatch('setTransactionTableRowCount', profile.transactionTableRowCount)

      return profile
    },

    reset ({ commit }) {
      commit('RESET')
    },

    setAvatar ({ commit }, value) {
      commit('SET_AVATAR', value)
    },

    setBackground ({ commit }, value) {
      commit('SET_BACKGROUND', value)
    },

    setCurrency ({ commit }, value) {
      commit('SET_CURRENCY', value)
    },

    setTimeFormat ({ commit }, value) {
      commit('SET_TIME_FORMAT', value)
    },

    setIsMarketChartEnabled ({ commit }, value) {
      commit('SET_IS_MARKET_CHART_ENABLED', value)
    },

    setLanguage ({ commit }, value) {
      commit('SET_LANGUAGE', value)
      i18n.locale = value
    },

    setBip39Language ({ commit }, value) {
      commit('SET_BIP39_LANGUAGE', value)
    },

    setName ({ commit }, value) {
      commit('SET_NAME', value)
    },

    setContentProtection ({ commit }, value) {
      commit('SET_CONTENT_PROTECTION', value)
    },

    setBackgroundUpdateLedger ({ commit }, value) {
      commit('SET_BACKGROUND_UPDATE_LEDGER', value)
    },

    setBroadcastPeers ({ commit }, value) {
      commit('SET_BROADCAST_PEERS', value)
    },

    setLedgerCache ({ commit }, value) {
      commit('SET_LEDGER_CACHE', value)
    },

    async setProfileId ({ commit, dispatch }, value) {
      commit('SET_PROFILE_ID', value)
      await dispatch('load', value)
    },

    setTheme ({ commit }, value) {
      commit('SET_THEME', value)
    },

    setLayout ({ commit }, value) {
      commit('SET_LAYOUT', value)
    },

    setTransactionTableRowCount ({ commit }, value) {
      commit('SET_TRANSACTION_TABLE_ROW_COUNT', value)
    }
  }
}
