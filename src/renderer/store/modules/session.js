import { I18N, MARKET } from '@config'
import { client } from '@/plugins/api-client'

export default {
  namespaced: true,

  state: () => ({
    profileId: null,
    background: null,
    theme: null,
    language: null,
    currency: null,
    avatar: null
  }),

  getters: {
    currentProfile (state, _, __, rootGetters) {
      if (!state.profileId) {
        return
      }

      return rootGetters['profile/byId'](state.profileId)
    },
    currentNetwork (state, getters, __, rootGetters) {
      if (!state.profileId) {
        return
      }

      const { network } = getters['currentProfile']
      return rootGetters['network/byId'](network)
    },
    profileId: state => state.profileId,
    background: state => state.background,
    theme: state => state.theme,
    language: state => state.language,
    currency: state => state.currency,
    avatar: state => state.avatar,
    hasDarkTheme: state => state.theme === 'dark'
  },

  mutations: {
    SET_PROFILE_ID (state, profileId) {
      state.profileId = profileId
    },

    SET_BACKGROUND (state, background) {
      state.background = background
    },

    SET_THEME (state, theme) {
      state.theme = theme
    },

    SET_LANGUAGE (state, language) {
      state.language = language
    },

    SET_CURRENCY (state, currency) {
      state.currency = currency
    },

    SET_AVATAR (state, avatar) {
      state.avatar = avatar
    },

    RESET (state) {
      state.background = null
      state.language = I18N.defaultLocale
      state.theme = 'light'
      state.currency = MARKET.defaultCurrency
      state.avatar = 'pages/new-profile-avatar.svg'
    }
  },

  actions: {
    async setProfileId ({ commit, dispatch }, value) {
      commit('SET_PROFILE_ID', value)
      dispatch('load')
      await dispatch('network/updateCurrentNetworkConfig', null, { root: true })
    },

    setBackground ({ commit }, value) {
      commit('SET_BACKGROUND', value)
    },

    setTheme ({ commit }, value) {
      commit('SET_THEME', value)
    },

    setLanguage ({ commit }, value) {
      commit('SET_LANGUAGE', value)
    },

    setCurrency ({ commit }, value) {
      commit('SET_CURRENCY', value)
    },

    setAvatar ({ commit }, value) {
      commit('SET_AVATAR', value)
    },

    load ({ getters, rootGetters, dispatch }) {
      const profile = getters['currentProfile']
      if (!profile) return

      dispatch('setBackground', profile.background)
      dispatch('setTheme', profile.theme)
      dispatch('setLanguage', profile.language)
      dispatch('setCurrency', profile.currency)

      const { server } = rootGetters['network/byId'](profile.network)

      // TODO: client bug
      // client.setVersion(apiVersion)
      client.setVersion(1)
      client.setConnection(server)
    },

    reset ({ commit }) {
      commit('RESET')
    }
  }
}
