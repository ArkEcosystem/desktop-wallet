import { I18N, MARKET } from '@config'

export default {
  namespaced: true,

  state: () => ({
    avatar: null,
    background: null,
    currency: null,
    language: null,
    hideWalletButtonText: false,
    isMarketChartEnabled: true,
    isAdvancedModeEnabled: false,
    marketChartOptions: { isEnabled: true, isExpanded: true, period: 'day' },
    name: null,
    profileId: null,
    theme: null,
    pluginManagerLayout: null,
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
    lastFees: {},
    multiSignaturePeer: null,
    filterBlacklistedPlugins: true,
    pluginAdapter: 'npm',
    priceApi: 'coingecko',
    pluginMenuOpen: true,
    defaultChosenFee: 'AVERAGE'
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
    isAdvancedModeEnabled: state => state.isAdvancedModeEnabled,
    marketChartOptions: state => ({ ...state.marketChartOptions }),
    theme: state => state.theme,
    pluginManagerLayout: state => state.pluginManagerLayout,
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
    lastFeeByType: state => (type, typeGroup) => {
      return (state.lastFees && state.lastFees[typeGroup]) ? state.lastFees[typeGroup][type] : null
    },
    multiSignaturePeer: state => state.multiSignaturePeer,
    filterBlacklistedPlugins: state => state.filterBlacklistedPlugins,
    pluginAdapter: state => state.pluginAdapter,
    priceApi: state => state.priceApi,
    pluginMenuOpen: state => state.pluginMenuOpen,
    defaultChosenFee: state => state.defaultChosenFee
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

    SET_IS_ADVANCED_MODE_ENABLED (state, isEnabled) {
      state.isAdvancedModeEnabled = isEnabled
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

    SET_PLUGIN_MANAGER_LAYOUT (state, pluginManagerLayout) {
      state.pluginManagerLayout = pluginManagerLayout
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

    SET_LAST_FEES_BY_TYPE (state, { fee, type, typeGroup }) {
      if (!state.lastFees[typeGroup]) {
        state.lastFees[typeGroup] = {}
      }
      state.lastFees[typeGroup][type] = fee
    },

    SET_MULTI_SIGNATURE_PEER (state, peer) {
      state.multiSignaturePeer = peer
    },

    SET_FILTER_BLACKLISTED_PLUGINS (state, filterBlacklistedPlugins) {
      state.filterBlacklistedPlugins = filterBlacklistedPlugins
    },

    SET_PLUGIN_ADAPTER (state, pluginAdapter) {
      state.pluginAdapter = pluginAdapter
    },

    SET_PRICE_API (state, priceApi) {
      state.priceApi = priceApi
    },

    SET_PLUGIN_MENU_OPEN (state, pluginMenuOpen) {
      state.pluginMenuOpen = pluginMenuOpen
    },

    SET_DEFAULT_CHOSEN_FEE (state, defaultChosenFee) {
      state.defaultChosenFee = defaultChosenFee
    },

    RESET (state) {
      state.avatar = 'pages/new-profile-avatar.svg'
      state.background = null
      state.currency = MARKET.defaultCurrency
      state.timeFormat = 'Default'
      state.hideWalletButtonText = false
      state.isMarketChartEnabled = true
      state.isAdvancedModeEnabled = false
      state.marketChartOptions = { isEnabled: true, isExpanded: true, period: 'day' }
      state.language = I18N.defaultLocale
      state.bip39Language = 'english'
      state.name = null
      state.theme = 'light'
      state.pluginManagerLayout = 'grid'
      state.walletLayout = 'grid'
      state.walletSidebarSortParams = { field: 'name', type: 'asc' }
      state.walletSidebarFilters = {}
      state.walletSortParams = { field: 'balance', type: 'desc' }
      state.contactSortParams = { field: 'name', type: 'asc' }
      state.pluginSortParams = { field: 'title', type: 'asc' }
      state.backgroundUpdateLedger = true
      state.broadcastPeers = true
      state.screenshotProtection = true
      state.ledgerCache = false
      state.transactionTableRowCount = 10
      state.unconfirmedVotes = []
      state.lastFees = {}
      state.multiSignaturePeer = null
      state.filterBlacklistedPlugins = true
      state.pluginAdapter = 'npm'
      state.priceApi = 'coingecko'
      state.pluginMenuOpen = true
      state.defaultChosenFee = 'AVERAGE'
    },

    REPLACE (state, value) {
      state.avatar = value.avatar
      state.background = value.background
      state.currency = value.currency
      state.timeFormat = value.timeFormat
      state.hideWalletButtonText = value.hideWalletButtonText
      state.isMarketChartEnabled = value.isMarketChartEnabled
      state.isAdvancedModeEnabled = value.isAdvancedModeEnabled
      state.marketChartOptions = value.marketChartOptions
      state.language = value.language
      state.bip39Language = value.bip39Language
      state.name = value.name
      state.theme = value.theme
      state.pluginManagerLayout = value.pluginManagerLayout
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
      state.multiSignaturePeer = value.multiSignaturePeer
      state.filterBlacklistedPlugins = value.filterBlacklistedPlugins
      state.pluginAdapter = value.pluginAdapter
      state.priceApi = value.priceApi
      state.pluginMenuOpen = value.pluginMenuOpen !== undefined ? value.pluginMenuOpen : true
      state.defaultChosenFee = value.defaultChosenFee
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

    setIsAdvancedModeEnabled ({ commit }, value) {
      commit('SET_IS_ADVANCED_MODE_ENABLED', value)
    },

    setMarketChartOptions ({ commit }, value) {
      commit('SET_MARKET_CHART_OPTIONS', value)
    },

    setLanguage ({ commit }, value) {
      commit('SET_LANGUAGE', value)
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

    setPluginManagerLayout ({ commit }, value) {
      commit('SET_PLUGIN_MANAGER_LAYOUT', value)
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

    setLastFeeByType ({ commit }, { fee, type, typeGroup }) {
      commit('SET_LAST_FEES_BY_TYPE', { fee, type, typeGroup })
    },

    setMultiSignaturePeer ({ commit }, { host, port }) {
      commit('SET_MULTI_SIGNATURE_PEER', { host, port })
    },

    setFilterBlacklistedPlugins ({ commit }, value) {
      commit('SET_FILTER_BLACKLISTED_PLUGINS', value)
    },

    setPluginAdapter ({ commit }, value) {
      commit('SET_PLUGIN_ADAPTER', value)
    },

    setPriceApi ({ commit }, value) {
      commit('SET_PRICE_API', value)
    },

    setPluginMenuOpen ({ commit }, value) {
      commit('SET_PLUGIN_MENU_OPEN', value)
    },

    setDefaultChosenFee ({ commit }, value) {
      commit('SET_DEFAULT_CHOSEN_FEE', value)
    }
  }
}
