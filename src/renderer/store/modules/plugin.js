import Vue from 'vue'
import pluginManager from '@/services/plugin-manager'
import releaseService from '@/services/release'
import { cloneDeep, differenceWith, sortBy, uniqBy } from 'lodash'
import semver from 'semver'

export default {
  namespaced: true,

  state: {
    available: {},
    installed: {},
    enabled: {},
    loaded: {},
    blacklisted: [],
    pluginOptions: {},
    lastFetched: 0
  },

  getters: {
    lastFetched: state => state.lastFetched,

    all: (state, getters, rootGetters) => {
      const filterPlugins = rootGetters['session/filterBlacklistedPlugins']

      let plugins = uniqBy([
        ...(Object.values(getters.installed).map(plugin => plugin.config)),
        ...Object.values(getters.available)
      ], 'id')

      // TODO global blacklist
      if (filterPlugins) {
        plugins = differenceWith(plugins, getters.blacklisted, (plugin, blacklisted) => {
          return plugin.id === blacklisted
        })
      }

      return sortBy(plugins, 'title')
    },

    available: state => state.available,

    availableById: (state, getters) => pluginId => {
      const plugins = getters.available

      if (!Object.keys(plugins).length) {
        return null
      }

      return plugins[pluginId] || null
    },

    installedById: (state, getters) => id => {
      const plugins = Object.values(getters.installed)

      if (!plugins.length) {
        return null
      }

      return plugins.find(plugin => id === plugin.config.id)
    },

    installed: state => state.installed,

    byCategory: (state, getters) => (category, source) => {
      const plugins = getters[source]

      return category === 'all' ? plugins : plugins.filter(plugin => {
        return plugin.categories.includes(category)
      })
    },

    byQuery: (state, getters) => (query, source) => {
      return getters[source].filter(plugin => {
        return ['id', 'title', 'description'].some(property => {
          return plugin[property].includes(query)
        })
      })
    },

    loaded: (state, _, __, rootGetters) => {
      const profileId = rootGetters['session/profileId']
      if (!profileId || !state.loaded[profileId]) {
        return {}
      }

      return state.loaded[profileId]
    },

    blacklisted: state => state.blacklisted,

    enabled: (state, _, __, rootGetters) => {
      const profileId = rootGetters['session/profileId']
      if (!profileId || !state.enabled[profileId]) {
        return {}
      }

      return state.enabled[profileId]
    },

    isInstalled: state => pluginId => !!state.installed[pluginId],

    isUpdateAvailable: (state, getters) => pluginId => {
      const available = getters.availableById(pluginId)
      const installed = getters.installedById(pluginId)

      return available && installed ? semver.lt(installed.config.version, available.version) : false
    },

    latestVersion: (state, getters) => pluginId => {
      const plugin = getters.availableById(pluginId)

      return plugin ? plugin.version : null
    },

    isEnabled: (state, getters) => (pluginId, profileId) => {
      if (!profileId) {
        return getters.enabled[pluginId]
      }

      return state.enabled[profileId] ? state.enabled[profileId][pluginId] : null
    },

    isLoaded: (state, getters) => (pluginId, profileId) => {
      if (!profileId) {
        return getters.loaded[pluginId]
      }

      return state.loaded[profileId] ? !!state.loaded[profileId][pluginId] : null
    },

    isBlacklisted: (state, getters) => pluginId => {
      if (!getters.blacklisted.length) {
        return false
      }

      return getters.blacklisted.includes(pluginId)
    },

    isInstalledSupported: (state, getters) => pluginId => {
      const plugin = getters.installedById(pluginId)

      if (!plugin.config.minVersion) {
        return true
      }

      return semver.lte(releaseService.currentVersion, plugin.config.minVersion)
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
        loadedPlugins = getters.loaded
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
      const loadedPlugins = getters.loaded
      const menuItems = []

      for (const plugin of Object.values(loadedPlugins)) {
        menuItems.push(...plugin.menuItems)
      }

      return menuItems
    },

    themes: (_, getters) => {
      return Object.keys(getters.loaded).reduce((themes, pluginId) => {
        const plugin = getters.loaded[pluginId]

        if (plugin.themes) {
          themes = {
            ...themes,
            ...plugin.themes
          }
        }

        return themes
      }, {})
    },

    // For each plugin that supports wallet tabs, get the component and configuration of each tab
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
    },

    pluginOptions: (state) => (pluginId, profileId) => {
      if (!state.pluginOptions[profileId]) {
        return {}
      } else if (!state.pluginOptions[profileId][pluginId]) {
        return {}
      }

      return cloneDeep(state.pluginOptions[profileId][pluginId])
    }
  },

  mutations: {
    RESET_PLUGINS (state) {
      state.loaded = {}
      state.installed = {}
    },

    SET_LAST_FETCHED (state, timestamp) {
      state.lastFetched = timestamp
    },

    SET_AVAILABLE_PLUGINS (state, plugins) {
      state.available = plugins
    },

    SET_INSTALLED_PLUGIN (state, plugin) {
      Vue.set(state.installed, plugin.config.id, plugin)
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

    DELETE_LOADED_PLUGIN (state, { pluginId, profileId }) {
      Vue.delete(state.loaded[profileId], pluginId)
    },

    DELETE_INSTALLED_PLUGIN (state, pluginId) {
      Vue.delete(state.installed, pluginId)
    },

    SET_PLUGIN_AVATARS (state, data) {
      Vue.set(state.loaded[data.profileId][data.pluginId], 'avatars', data.avatars)
    },

    SET_PLUGIN_MENU_ITEMS (state, data) {
      Vue.set(state.loaded[data.profileId][data.pluginId], 'menuItems', data.menuItems)
    },

    SET_PLUGIN_THEMES (state, data) {
      Vue.set(state.loaded[data.profileId][data.pluginId], 'themes', data.themes)
    },

    SET_PLUGIN_WALLET_TABS (state, data) {
      Vue.set(state.loaded[data.profileId][data.pluginId], 'walletTabs', data.walletTabs)
    },

    SET_PLUGIN_OPTION (state, data) {
      if (!state.pluginOptions[data.profileId]) {
        Vue.set(state.pluginOptions, data.profileId, {})
      }
      if (!state.pluginOptions[data.profileId][data.pluginId]) {
        Vue.set(state.pluginOptions[data.profileId], data.pluginId, {})
      }

      Vue.set(state.pluginOptions[data.profileId][data.pluginId], data.key, data.value)
    },

    DELETE_PLUGIN_OPTIONS (state, { pluginId, profileId }) {
      if (state.pluginOptions[profileId][pluginId]) {
        Vue.delete(state.pluginOptions[profileId], pluginId)
      }
    },

    SET_IS_PLUGIN_ENABLED (state, data) {
      if (!state.enabled[data.profileId]) {
        Vue.set(state.enabled, data.profileId, {})
      }

      Vue.set(state.enabled[data.profileId], data.pluginId, data.enabled)
    }
  },

  actions: {
    async reset ({ commit }) {
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
        if (!getters.isInstalled(pluginId)) {
          continue
        }

        if (getters.isLoaded(pluginId, profile.id)) {
          continue
        }

        try {
          await this._vm.$plugins.enablePlugin(pluginId, profile.id)
        } catch (error) {
          this._vm.$logger.error(
            `Could not enable '${pluginId}' for profile '${profile.name}': ${error.message}`
          )
        }
      }
    },

    async setEnabled ({ commit, getters, rootGetters }, { enabled, pluginId, profileId = null }) {
      if (getters.isEnabled(pluginId) === enabled) {
        return
      }

      profileId = profileId || rootGetters['session/profileId']

      commit('SET_IS_PLUGIN_ENABLED', {
        enabled,
        pluginId,
        profileId
      })

      if (enabled) {
        await this._vm.$plugins.enablePlugin(pluginId, profileId)
      } else {
        await this._vm.$plugins.disablePlugin(pluginId, profileId)
      }
    },

    setAvailable ({ commit, getters }, plugins) {
      commit('SET_AVAILABLE_PLUGINS', plugins)
      commit('SET_LAST_FETCHED', Date.now())
    },

    setInstalled ({ commit, rootGetters }, plugin) {
      commit('SET_INSTALLED_PLUGIN', plugin)
    },

    setLoaded ({ commit, getters, rootGetters }, data) {
      if (!getters.isEnabled(data.config.id, data.profileId)) {
        throw new Error('Plugin is not enabled')
      }

      commit('SET_LOADED_PLUGIN', {
        ...data,
        profileId: data.profileId || rootGetters['session/profileId']
      })
    },

    async deletePlugin ({ dispatch, getters, rootGetters }, pluginId, removeOptions = false) {
      if (!getters.installedById(pluginId)) {
        return
      }

      for (const profile of rootGetters['profile/all']) {
        dispatch('setEnabled', {
          enabled: false,
          pluginId,
          profileId: profile.id
        })

        if (removeOptions) {
          dispatch('deletePluginOptionsForProfile', pluginId, profile.id)
        }
      }

      try {
        await this._vm.$plugins.deletePlugin(pluginId)
      } catch (error) {
        this._vm.$logger.error(
          `Could not delete '${pluginId}' plugin': ${error.message}`
        )
      }
    },

    deleteLoaded ({ commit, getters, rootGetters }, pluginId, profileId = null) {
      profileId = profileId || rootGetters['session/profileId']

      if (!getters.isLoaded(pluginId, profileId)) {
        return
      }

      commit('DELETE_LOADED_PLUGIN', {
        pluginId,
        profileId
      })
    },

    deleteInstalled ({ commit, getters }, pluginId) {
      if (!getters.installedById(pluginId)) {
        return
      }

      commit('DELETE_INSTALLED_PLUGIN', pluginId)
    },

    setAvatars ({ commit, getters, rootGetters }, data) {
      if (!getters.isEnabled(data.pluginId, data.profileId)) {
        throw new Error('Plugin is not enabled')
      }

      commit('SET_PLUGIN_AVATARS', {
        ...data,
        profileId: data.profileId || rootGetters['session/profileId']
      })
    },

    setMenuItems ({ commit, getters, rootGetters }, data) {
      if (!getters.isEnabled(data.pluginId, data.profileId)) {
        throw new Error('Plugin is not enabled')
      }

      commit('SET_PLUGIN_MENU_ITEMS', {
        ...data,
        profileId: data.profileId || rootGetters['session/profileId']
      })
    },

    setThemes ({ commit, getters, rootGetters }, data) {
      if (!getters.isEnabled(data.pluginId, data.profileId)) {
        throw new Error('Plugin is not enabled')
      }

      commit('SET_PLUGIN_THEMES', {
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
    },

    async setPluginOption ({ commit, getters, rootGetters }, data) {
      if (!getters.isEnabled(data.pluginId, data.profileId)) {
        throw new Error('Plugin is not enabled')
      }

      commit('SET_PLUGIN_OPTION', {
        pluginId: data.pluginId,
        profileId: rootGetters['session/profileId'],
        key: data.key,
        value: data.value
      })
    },

    deletePluginOptionsForProfile ({ commit, rootGetters }, pluginId, profileId = null) {
      profileId = profileId || rootGetters['session/profileId']

      commit('DELETE_PLUGIN_OPTIONS', {
        pluginId,
        profileId
      })
    }
  }
}
