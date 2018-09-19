import { I18N, MARKET } from '@config'
import { client } from '@/plugins/api-client'

export default {
  namespaced: true,

  state: () => ({
    profileId: null,
    avatar: null,
    background: null,
    currency: null,
    language: null,
    theme: null
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

      const { networkId } = getters['currentProfile']
      return rootGetters['network/byId'](networkId)
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
      state.avatar = 'pages/new-profile-avatar.svg'
      state.background = null
      state.currency = MARKET.defaultCurrency
      state.language = I18N.defaultLocale
      state.theme = 'light'
    }
  },

  actions: {
    async setProfileId ({ commit, dispatch }, value) {
      commit('SET_PROFILE_ID', value)
      const profile = await dispatch('load', value)
      await dispatch('network/updateNetworkConfig', profile.networkId, { root: true })
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

    load ({ rootGetters, dispatch }, profileId) {
      const profile = rootGetters['profile/byId'](profileId)
      if (!profile) return

      dispatch('setAvatar', profile.avatar)
      dispatch('setBackground', profile.background)
      dispatch('setCurrency', profile.currency)
      dispatch('setLanguage', profile.language)
      dispatch('setTheme', profile.theme)

      return profile
    },

    setClient ({ rootGetters }, networkId) {
      const { server, apiVersion } = rootGetters['network/byId'](networkId)
      client.setVersion(apiVersion)
      client.setConnection(server)
      client.http.headers['API-Version'] = apiVersion
    },

    reset ({ commit }) {
      commit('RESET')
    }
  }
}
