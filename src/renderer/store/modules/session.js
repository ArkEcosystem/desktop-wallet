import { I18N, MARKET } from '@config'

export default {
  namespaced: true,

  state: () => ({
    avatar: null,
    background: null,
    currency: null,
    language: null,
    name: null,
    profileId: null,
    theme: null,
    contentProtection: true
  }),

  getters: {
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
      return rootGetters['network/byId'](networkId)
    },
    avatar: state => state.avatar,
    background: state => state.background,
    currency: state => state.currency,
    theme: state => state.theme,
    language: state => state.language,
    name: state => state.name,
    hasDarkTheme: state => state.theme === 'dark',
    contentProtection: state => state.contentProtection
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

    SET_LANGUAGE (state, language) {
      state.language = language
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

    SET_CONTENT_PROTECTION (state, protection) {
      state.contentProtection = protection
    },

    RESET (state) {
      state.avatar = 'pages/new-profile-avatar.svg'
      state.background = null
      state.currency = MARKET.defaultCurrency
      state.language = I18N.defaultLocale
      state.name = null
      state.theme = 'light'
      state.contentProtection = true
    }
  },

  actions: {
    load ({ rootGetters, dispatch }, profileId) {
      const profile = rootGetters['profile/byId'](profileId)
      if (!profile) return

      dispatch('setAvatar', profile.avatar)
      dispatch('setBackground', profile.background)
      dispatch('setCurrency', profile.currency)
      dispatch('setName', profile.name)
      dispatch('setLanguage', profile.language)
      dispatch('setTheme', profile.theme)

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

    setLanguage ({ commit }, value) {
      commit('SET_LANGUAGE', value)
    },

    setName ({ commit }, value) {
      commit('SET_NAME', value)
    },

    setContentProtection ({ commit }, value) {
      commit('SET_CONTENT_PROTECTION', value)
    },

    async setProfileId ({ commit, dispatch }, value) {
      commit('SET_PROFILE_ID', value)
      const profile = await dispatch('load', value)
      await dispatch('network/updateNetworkConfig', profile.networkId, { root: true })
    },

    setTheme ({ commit }, value) {
      commit('SET_THEME', value)
    }
  }
}
