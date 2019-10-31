import { I18N, MARKET } from '@config'
import i18n from '@/i18n'

export default {
  namespaced: true,

  state: () => ({
    avatar: null,
    background: null,
    currency: null,
    language: null,
    hideWalletButtonText: false,
    isMarketChartEnabled: true,
    marketChartOptions: { isEnabled: true, isExpanded: true, period: 'day' },
    name: null,
    profileId: null,
    theme: null,
    walletLayout: null,
    walletSidebarSortParams: null,
    walletSidebarFilters: null,
    walletSortParams: null,
    contactSortParams: null,
    pluginSortParams: null,
    screenshotProtection: true,
    backgroundUpdateLedger: null,
    broadcastPeers: null,
    ledgerCache: null,
    transactionTableRowCount: 10,
    unconfirmedVotes: [],
    lastFees: {}
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
      if (!getters.profile) {
        return
      }

      const { networkId } = getters.profile
      let network = rootGetters['network/byId'](networkId)

      if (!network) {
        network = rootGetters['network/customNetworkById'](networkId)
      }
      return network
    },
    avatar: state => state.avatar,
    background: state => state.background,
    currency: state => state.currency,
    timeFormat: state => state.timeFormat,
    hideWalletButtonText: state => state.hideWalletButtonText,
    isMarketChartEnabled: state => state.isMarketChartEnabled,
    marketChartOptions: state => state.marketChartOptions,
    theme: state => state.theme,
    walletLayout: state => state.walletLayout,
    walletSidebarSortParams: state => ({ ...state.walletSidebarSortParams }),
    walletSidebarFilters: state => ({ ...state.walletSidebarFilters }),
    walletSortParams: state => state.walletSortParams,
    contactSortParams: state => state.contactSortParams,
    pluginSortParams: state => state.pluginSortParams,
    language: state => state.language,
    bip39Language: state => state.bip39Language,
    name: state => state.name,
    hasWalletGridLayout: state => state.walletLayout === 'grid',
    screenshotProtection: state => state.screenshotProtection,
    backgroundUpdateLedger: state => state.backgroundUpdateLedger,
    broadcastPeers: state => state.broadcastPeers,
    ledgerCache: state => state.ledgerCache,
    transactionTableRowCount: state => state.transactionTableRowCount,
    unconfirmedVotes: state => state.unconfirmedVotes,
    lastFees: state => state.lastFees,
    lastFeeByType: state => type => {
      return state.lastFees ? state.lastFees[type] : null
    }
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

    SET_HIDE_WALLET_BUTTON_TEXT (state, isHidden) {
      state.hideWalletButtonText = isHidden
    },

    SET_IS_MARKET_CHART_ENABLED (state, isEnabled) {
      state.isMarketChartEnabled = isEnabled
    },

    SET_MARKET_CHART_OPTIONS (state, marketChartOptions) {
      state.marketChartOptions = marketChartOptions
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

    SET_WALLET_LAYOUT (state, walletLayout) {
      state.walletLayout = walletLayout
    },

    SET_WALLET_SIDEBAR_SORT_PARAMS (state, params) {
      state.walletSidebarSortParams = params
    },

    SET_WALLET_SIDEBAR_FILTERS (state, filters) {
      state.walletSidebarFilters = filters
    },

    SET_WALLET_TABLE_SORT_PARAMS (state, walletSortParams) {
      state.walletSortParams = walletSortParams
    },

    SET_CONTACT_TABLE_SORT_PARAMS (state, contactSortParams) {
      state.contactSortParams = contactSortParams
    },

    SET_PLUGIN_TABLE_SORT_PARAMS (state, pluginSortParams) {
      state.pluginSortParams = pluginSortParams
    },

    SET_SCREENSHOT_PROTECTION (state, protection) {
      state.screenshotProtection = protection
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

    SET_UNCONFIRMED_VOTES (state, votes) {
      state.unconfirmedVotes = votes
    },

    SET_LAST_FEES (state, fees) {
      state.lastFees = fees
    },

    RESET (state) {
      state.avatar = 'pages/new-profile-avatar.svg'
      state.background = null
      state.currency = MARKET.defaultCurrency
      state.timeFormat = 'Default'
      state.hideWalletButtonText = false
      state.isMarketChartEnabled = true
      state.marketChartOptions = { isEnabled: true, isExpanded: true, period: 'day' }
      state.language = I18N.defaultLocale
      state.bip39Language = 'english'
      state.name = null
      state.theme = 'light'
      state.walletLayout = 'grid'
      state.walletSidebarSortParams = { field: 'name', type: 'asc' }
      state.walletSidebarFilters = {}
      state.walletSortParams = { field: 'balance', type: 'desc' }
      state.contactSortParams = { field: 'name', type: 'asc' }
      state.pluginSortParams = { field: 'id', type: 'asc' }
      state.backgroundUpdateLedger = true
      state.broadcastPeers = true
      state.screenshotProtection = true
      state.ledgerCache = false
      state.transactionTableRowCount = 10
      state.unconfirmedVotes = []
      state.lastFees = {}

      i18n.locale = state.language
    },

    REPLACE (state, value) {
      state.avatar = value.avatar
      state.background = value.background
      state.currency = value.currency
      state.timeFormat = value.timeFormat
      state.hideWalletButtonText = value.hideWalletButtonText
      state.isMarketChartEnabled = value.isMarketChartEnabled
      state.marketChartOptions = value.marketChartOptions
      state.language = value.language
      state.bip39Language = value.bip39Language
      state.name = value.name
      state.theme = value.theme
      state.walletLayout = value.walletLayout
      state.walletSidebarSortParams = value.walletSidebarSortParams
      state.walletSidebarFilters = value.walletSidebarFilters
      state.walletSortParams = value.walletSortParams
      state.contactSortParams = value.contactSortParams
      state.pluginSortParams = value.pluginSortParams
      state.backgroundUpdateLedger = value.backgroundUpdateLedger
      state.broadcastPeers = value.broadcastPeers
      state.screenshotProtection = value.screenshotProtection
      state.ledgerCache = value.ledgerCache
      state.transactionTableRowCount = value.transactionTableRowCount
      state.unconfirmedVotes = value.unconfirmedVotes
      state.lastFees = value.lastFees

      i18n.locale = state.language
    }
  },

  actions: {
    load ({ commit, rootGetters, dispatch }, profileId) {
      const profile = rootGetters['profile/byId'](profileId)
      if (!profile) return

      if (!profile.unconfirmedVotes) {
        profile.unconfirmedVotes = []
        dispatch('profile/update', profile, { root: true })
      }

      commit('REPLACE', profile)

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

    setHideWalletButtonText ({ commit }, value) {
      commit('SET_HIDE_WALLET_BUTTON_TEXT', value)
    },

    setIsMarketChartEnabled ({ commit }, value) {
      commit('SET_IS_MARKET_CHART_ENABLED', value)
    },

    setMarketChartOptions ({ commit }, value) {
      commit('SET_MARKET_CHART_OPTIONS', value)
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

    setScreenshotProtection ({ commit }, value) {
      commit('SET_SCREENSHOT_PROTECTION', value)
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

    setWalletLayout ({ commit }, value) {
      commit('SET_WALLET_LAYOUT', value)
    },

    setWalletSidebarSortParams ({ commit }, value) {
      commit('SET_WALLET_SIDEBAR_SORT_PARAMS', value)
    },

    setWalletSidebarFilters ({ commit }, value) {
      commit('SET_WALLET_SIDEBAR_FILTERS', value)
    },

    setWalletSortParams ({ commit }, value) {
      commit('SET_WALLET_TABLE_SORT_PARAMS', value)
    },

    setContactSortParams ({ commit }, value) {
      commit('SET_CONTACT_TABLE_SORT_PARAMS', value)
    },

    setPluginSortParams ({ commit }, value) {
      commit('SET_PLUGIN_TABLE_SORT_PARAMS', value)
    },

    setTransactionTableRowCount ({ commit }, value) {
      commit('SET_TRANSACTION_TABLE_ROW_COUNT', value)
    },

    setUnconfirmedVotes ({ commit }, value) {
      commit('SET_UNCONFIRMED_VOTES', value)
    },

    setLastFees ({ commit }, value) {
      commit('SET_LAST_FEES', value)
    },

    setLastFeeByType ({ commit, getters }, { fee, type }) {
      const fees = getters.lastFees
      fees[type] = fee

      commit('SET_LAST_FEES', fees)
    }
  }
}
