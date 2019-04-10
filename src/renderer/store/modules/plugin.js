import Vue from 'vue'
import pluginManager from '@/services/plugin-manager'

export default {
  namespaced: true,

  state: {
    loaded: {},
    available: {},
    enabled: {}
  },

  getters: {
    available: state => state.available,

    loaded: (state, _, __, rootGetters) => {
      const profileId = rootGetters['session/profileId']
      if (!profileId || !state.loaded[profileId]) {
        return {}
      }

      return state.loaded[profileId]
    },

    enabled: (state, _, __, rootGetters) => {
      const profileId = rootGetters['session/profileId']
      if (!profileId || !state.enabled[profileId]) {
        return {}
      }

      return state.enabled[profileId]
    },

    isAvailable: state => pluginId => !!state.available[pluginId],

    isEnabled: (state, getters) => (pluginId, profileId) => {
      if (!profileId) {
        return getters['enabled'][pluginId]
      }

      return state.enabled[profileId] ? state.enabled[profileId][pluginId] : null
    },

    isLoaded: (state, getters) => (pluginId, profileId) => {
      if (!profileId) {
        return getters['loaded'][pluginId]
      }

      return state.loaded[profileId] ? !!state.loaded[profileId][pluginId] : null
    },

    avatar: state => profile => {
      const loaded = state.loaded[profile.id]
      const plugin = loaded ? loaded[profile.avatar.pluginId] : null
      if (!plugin) {
        return null
      }

      return pluginManager.getAvatarComponents(profile.avatar.pluginId)[profile.avatar.avatarName]
    },

    avatars: (state, getters) => profileId => {
      let loadedPlugins
      if (!profileId) {
        loadedPlugins = getters['loaded']
      } else {
        loadedPlugins = state.loaded[profileId]
      }

      if (!loadedPlugins || !Object.keys(loadedPlugins)) {
        return []
      }

      const avatars = []
      for (const plugin of Object.values(loadedPlugins)) {
        for (const avatar of Object.entries(pluginManager.getAvatarComponents(plugin.config.id))) {
          avatars.push({
            component: avatar[1],
            name: avatar[0],
            pluginId: plugin.config.id
          })
        }
      }

      return avatars
    },

    menuItems: (_, getters) => {
      const loadedPlugins = getters['loaded']
      const menuItems = []

      for (const plugin of Object.values(loadedPlugins)) {
        menuItems.push(...plugin.menuItems)
      }

      return menuItems
    },

    walletTabs: (_, getters) => {
      return Object.keys(getters.loaded).reduce((walletTabs, pluginId) => {
        const plugin = getters.loaded[pluginId]

        if (plugin.walletTabs) {
          const pluginWalletTabs = plugin.walletTabs.map(walletTab => {
            return {
              ...walletTab,
              component: pluginManager.getWalletTabComponent(pluginId, walletTab)
            }
          })
          walletTabs.push(...pluginWalletTabs)
        }

        return walletTabs
      }, [])
    }
  },

  mutations: {
    RESET_PLUGINS (state, plugin) {
      state.loaded = {}
      state.available = {}
    },

    SET_AVAILABLE_PLUGIN (state, plugin) {
      Vue.set(state.available, plugin.config.id, plugin)
    },

    SET_LOADED_PLUGIN (state, data) {
      if (!state.loaded[data.profileId]) {
        Vue.set(state.loaded, data.profileId, {})
      }

      Vue.set(state.loaded[data.profileId], data.config.id, {
        ...data,
        avatars: [],
        menuItems: []
      })
    },

    DELETE_LOADED_PLUGIN (state, data) {
      if (!state.loaded[data.profileId]) {
        return
      }

      Vue.delete(state.loaded[data.profileId], data.pluginId)
    },

    SET_PLUGIN_AVATARS (state, data) {
      Vue.set(state.loaded[data.profileId][data.pluginId], 'avatars', data.avatars)
    },

    SET_PLUGIN_MENU_ITEMS (state, data) {
      Vue.set(state.loaded[data.profileId][data.pluginId], 'menuItems', data.menuItems)
    },

    SET_PLUGIN_WALLET_TABS (state, data) {
      Vue.set(state.loaded[data.profileId][data.pluginId], 'walletTabs', data.walletTabs)
    },

    SET_IS_PLUGIN_ENABLED (state, data) {
      if (!state.enabled[data.profileId]) {
        Vue.set(state.enabled, data.profileId, {})
      }

      Vue.set(state.enabled[data.profileId], data.pluginId, data.enabled)
    }
  },

  actions: {
    async init ({ commit, dispatch }) {
      commit('RESET_PLUGINS')
    },

    async loadPluginsForProfiles ({ dispatch, rootGetters }) {
      for (const profile of rootGetters['profile/all']) {
        dispatch('loadPluginsForProfile', profile)
      }
    },

    async loadPluginsForProfile ({ getters, rootGetters, state }, profile) {
      if (!state.enabled[profile.id]) {
        return
      }

      for (const pluginId of Object.keys(state.enabled[profile.id])) {
        if (!getters['isAvailable'](pluginId)) {
          continue
        }

        if (getters['isLoaded'](pluginId, profile.id)) {
          continue
        }

        try {
          await this._vm.$plugins.enablePlugin(pluginId, profile.id)
        } catch (error) {
          this._vm.$logger.error(
            `Could not enable '${pluginId}' plugin for profile '${profile.name}': ${error.message}`
          )
        }
      }
    },

    async setEnabled ({ commit, getters, rootGetters }, { enabled, pluginId }) {
      if (getters['isEnabled'](pluginId) === enabled) {
        return
      }

      commit('SET_IS_PLUGIN_ENABLED', {
        enabled,
        pluginId,
        profileId: rootGetters['session/profileId']
      })

      if (enabled) {
        await this._vm.$plugins.enablePlugin(pluginId)
      } else {
        await this._vm.$plugins.disablePlugin(pluginId)
      }
    },

    setAvailable ({ commit, rootGetters }, plugin) {
      commit('SET_AVAILABLE_PLUGIN', plugin)
    },

    setLoaded ({ commit, getters, rootGetters }, data) {
      if (!getters['isEnabled'](data.config.id, data.profileId)) {
        throw new Error('Plugin is not enabled')
      }

      commit('SET_LOADED_PLUGIN', {
        ...data,
        profileId: data.profileId || rootGetters['session/profileId']
      })
    },

    deleteLoaded ({ commit, getters, rootGetters }, pluginId) {
      commit('DELETE_LOADED_PLUGIN', {
        pluginId,
        profileId: rootGetters['session/profileId']
      })
    },

    setAvatars ({ commit, getters, rootGetters }, data) {
      if (!getters['isEnabled'](data.pluginId, data.profileId)) {
        throw new Error('Plugin is not enabled')
      }

      commit('SET_PLUGIN_AVATARS', {
        ...data,
        profileId: data.profileId || rootGetters['session/profileId']
      })
    },

    setMenuItems ({ commit, getters, rootGetters }, data) {
      if (!getters['isEnabled'](data.pluginId, data.profileId)) {
        throw new Error('Plugin is not enabled')
      }

      commit('SET_PLUGIN_MENU_ITEMS', {
        ...data,
        profileId: data.profileId || rootGetters['session/profileId']
      })
    },

    setWalletTabs ({ commit, getters, rootGetters }, data) {
      if (!getters.isEnabled(data.pluginId, data.profileId)) {
        throw new Error('Plugin is not enabled')
      }

      commit('SET_PLUGIN_WALLET_TABS', {
        ...data,
        profileId: data.profileId || rootGetters['session/profileId']
      })
    }
  }
}
