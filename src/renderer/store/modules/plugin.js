import Vue from 'vue'

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

    isAvailable: state => pluginId => state.available[pluginId],

    isEnabled: (_, getters) => pluginId => getters['enabled'][pluginId],

    menuItems: (_, getters) => {
      const loadedPlugins = getters['loaded']
      const menuItems = []

      for (const plugin of Object.values(loadedPlugins)) {
        console.log('plugin.menuItems', plugin.menuItems)
        menuItems.push(...plugin.menuItems)
      }

      return menuItems
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

      Vue.set(state.loaded[data.profileId], data.config.id, { ...data, menuItems: [] })
    },

    DELETE_LOADED_PLUGIN (state, data) {
      if (!state.loaded[data.profileId]) {
        return
      }

      Vue.delete(state.loaded[data.profileId], data.pluginId)
    },

    SET_PLUGIN_MENU_ITEMS (state, data) {
      Vue.set(state.loaded[data.profileId][data.pluginId], 'menuItems', data.menuItems)
    },

    SET_IS_PLUGIN_ENABLED (state, data) {
      if (!state.enabled[data.profileId]) {
        Vue.set(state.enabled, data.profileId, {})
      }

      Vue.set(state.enabled[data.profileId], data.pluginId, data.enabled)
    }
  },

  actions: {
    init ({ commit, dispatch }) {
      commit('RESET_PLUGINS')
    },

    async loadPlugins ({ dispatch, getters }) {
      for (const pluginId of Object.keys(getters['enabled'])) {
        await this._vm.$plugins.enablePlugin(pluginId)
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

    setLoaded ({ commit, getters, rootGetters }, plugin) {
      if (!getters['isEnabled'](plugin.config.id)) {
        throw new Error('Plugin is not enabled')
      }

      commit('SET_LOADED_PLUGIN', {
        ...plugin,
        profileId: rootGetters['session/profileId']
      })
    },

    deleteLoaded ({ commit, getters, rootGetters }, pluginId) {
      commit('DELETE_LOADED_PLUGIN', {
        pluginId,
        profileId: rootGetters['session/profileId']
      })
    },

    setMenuItems ({ commit, getters, rootGetters }, data) {
      if (!getters['isEnabled'](data.pluginId)) {
        throw new Error('Plugin is not enabled')
      }

      commit('SET_PLUGIN_MENU_ITEMS', {
        ...data,
        profileId: rootGetters['session/profileId']
      })
    }
  }
}
