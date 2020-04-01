import Vue from 'vue'
import pluginManager from '@/services/plugin-manager'
import releaseService from '@/services/release'
import { sortByProps } from '@/utils'
import { cloneDeep, uniqBy } from 'lodash'
import semver from 'semver'

export default {
  namespaced: true,

  state: {
    available: {},
    installed: {},
    enabled: {},
    loaded: {},
    blacklisted: {
      global: [],
      local: []
    },
    whitelisted: {
      global: {}
    },
    pluginOptions: {},
    lastFetched: 0
  },

  getters: {
    lastFetched: state => state.lastFetched,

    all: (_, getters) => {
      return uniqBy([...getters.installed, ...getters.available], 'config.id')
    },

    official: (_, getters) => {
      return getters.all.filter(plugin => plugin.config.isOfficial)
    },

    funded: (_, getters) => {
      return getters.all.filter(plugin => getters.isGrant(plugin.config.id))
    },

    filtered: (_, getters, __, rootGetters) => (query, category, filter) => {
      let plugins = getters[filter || 'all']

      plugins = plugins.filter(plugin => {
        if (rootGetters['session/filterBlacklistedPlugins'] && getters.isBlacklisted(plugin.config.id)) {
          return false
        }

        if (!getters.installedById(plugin.config.id) && !getters.isWhitelisted(plugin)) {
          return false
        }

        let match = true

        if (category === 'all') {
          match = match && !plugin.config.categories.some(category => ['theme', 'language'].includes(category))
        } else if (category && category !== 'all') {
          match = match && plugin.config.categories.includes(category)
        }

        if (query) {
          match = match && ['id', 'title', 'description', 'keywords'].some(property => {
            let value = plugin.config[property]

            if (!value) {
              return false
            }

            if (property === 'keywords') {
              value = value.join(' ')
            }

            return value.toLowerCase().includes(query)
          })
        }

        return match
      })

      return plugins
    },

    available: state => Object.values(state.available),

    availableById: (_, getters) => id => {
      const plugins = getters.available

      if (!Object.keys(plugins).length) {
        return null
      }

      return plugins.find(plugin => id === plugin.config.id)
    },

    installed: state => Object.values(state.installed),

    installedById: (_, getters) => id => {
      const plugins = getters.installed

      if (!plugins.length) {
        return null
      }

      return plugins.find(plugin => id === plugin.config.id)
    },

    loaded: (state, _, __, rootGetters) => {
      const profileId = rootGetters['session/profileId']
      if (!profileId || !state.loaded[profileId]) {
        return {}
      }

      return state.loaded[profileId]
    },

    blacklisted: state => state.blacklisted,

    whitelisted: state => state.whitelisted,

    enabled: (state, _, __, rootGetters) => {
      const profileId = rootGetters['session/profileId']
      if (!profileId || !state.enabled[profileId]) {
        return {}
      }

      return state.enabled[profileId]
    },

    isAvailable: (_, getters) => pluginId => !!getters.availableById(pluginId),

    isInstalled: (_, getters) => pluginId => !!getters.installedById(pluginId),

    isUpdateAvailable: (_, getters) => pluginId => {
      const available = getters.availableById(pluginId)
      const installed = getters.installedById(pluginId)

      return available && installed ? semver.lt(installed.config.version, available.config.version) : false
    },

    latestVersion: (_, getters) => pluginId => {
      const plugin = getters.availableById(pluginId)

      return plugin ? plugin.config.version : null
    },

    isEnabled: (state, getters) => (pluginId, profileId) => {
      if (!profileId) {
        return !!getters.enabled[pluginId]
      }

      return state.enabled[profileId] ? !!state.enabled[profileId][pluginId] : false
    },

    isLoaded: (state, getters) => (pluginId, profileId) => {
      if (!profileId) {
        return !!getters.loaded[pluginId]
      }

      return state.loaded[profileId] ? !!state.loaded[profileId][pluginId] : false
    },

    isBlacklisted: (_, getters) => pluginId => {
      return getters.blacklisted.global.includes(pluginId) || getters.blacklisted.local.includes(pluginId)
    },

    isWhitelisted: (_, getters) => plugin => {
      if (Object.prototype.hasOwnProperty.call(getters.whitelisted.global, plugin.config.id)) {
        return semver.lte(plugin.config.version, getters.whitelisted.global[plugin.config.id].version)
      }

      return false
    },

    isGrant: (_, getters) => pluginId => {
      if (Object.prototype.hasOwnProperty.call(getters.whitelisted.global, pluginId) && Object.prototype.hasOwnProperty.call(getters.whitelisted.global[pluginId], 'isGrant')) {
        return getters.whitelisted.global[pluginId].isGrant
      }

      return false
    },

    isInstalledSupported: (_, getters) => pluginId => {
      const plugin = getters.installedById(pluginId)

      if (!plugin.config.minimumVersion) {
        return true
      }

      return semver.gte(releaseService.currentVersion, plugin.config.minimumVersion)
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
      const loadedPlugins = profileId ? state.loaded[profileId] : getters.loaded

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

      return [...menuItems].sort(sortByProps('title'))
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

    languages: (_, getters) => {
      return Object.keys(getters.loaded).reduce((languages, pluginId) => {
        const plugin = getters.loaded[pluginId]

        if (plugin.languages) {
          languages = {
            ...languages,
            ...plugin.languages
          }
        }

        return languages
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

    profileHasPluginOptions: (state, _, __, rootGetters) => (pluginId, profileId) => {
      if (!profileId) {
        profileId = rootGetters['session/profileId']
      }

      return !!(state.pluginOptions[profileId] && state.pluginOptions[profileId][pluginId])
    },

    pluginOptions: state => (pluginId, profileId) => {
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

    SET_BLACKLISTED_PLUGINS (state, { scope, plugins }) {
      Vue.set(state.blacklisted, scope, plugins)
    },

    SET_WHITELISTED_PLUGINS (state, { scope, plugins }) {
      Vue.set(state.whitelisted, scope, plugins)
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

    SET_PLUGIN_LANGUAGES (state, data) {
      Vue.set(state.loaded[data.profileId][data.pluginId], 'languages', data.languages)
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
      if (state.pluginOptions[profileId] && state.pluginOptions[profileId][pluginId]) {
        Vue.delete(state.pluginOptions[profileId], pluginId)

        if (!Object.keys(state.pluginOptions[profileId]).length) {
          Vue.delete(state.pluginOptions, profileId)
        }
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

    async loadPluginsForProfile ({ getters, state }, profile) {
      if (!state.enabled[profile.id]) {
        return
      }

      for (const pluginId of Object.keys(state.enabled[profile.id])) {
        if (!getters.isEnabled(pluginId, profile.id)) {
          continue
        }

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
      profileId = profileId || rootGetters['session/profileId']

      if (getters.isEnabled(pluginId, profileId) === enabled) {
        return
      }

      commit('SET_IS_PLUGIN_ENABLED', {
        enabled,
        pluginId,
        profileId
      })

      try {
        await this._vm.$plugins[`${enabled ? 'enable' : 'disable'}Plugin`](pluginId, profileId)
      } catch (error) {
        commit('SET_IS_PLUGIN_ENABLED', {
          enabled: !enabled,
          pluginId,
          profileId
        })

        throw error
      }
    },

    setAvailable ({ commit }, plugins) {
      commit('SET_AVAILABLE_PLUGINS', plugins)
      commit('SET_LAST_FETCHED', Date.now())
    },

    setInstalled ({ commit }, plugin) {
      commit('SET_INSTALLED_PLUGIN', plugin)
    },

    async setBlacklisted ({ commit, dispatch, getters, rootGetters }, { scope, plugins }) {
      commit('SET_BLACKLISTED_PLUGINS', { scope, plugins })

      for (const plugin of plugins) {
        for (const profile of rootGetters['profile/all']) {
          if (profile.filterBlacklistedPlugins && getters.isEnabled(plugin, profile.id)) {
            await dispatch('setEnabled', { enabled: false, pluginId: plugin, profileId: profile.id })
          }
        }
      }
    },

    setWhitelisted ({ commit }, { scope, plugins }) {
      commit('SET_WHITELISTED_PLUGINS', { scope, plugins })
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

    async deletePlugin ({ dispatch, getters, rootGetters }, { pluginId, removeOptions = false }) {
      if (!getters.installedById(pluginId)) {
        return
      }

      for (const profile of rootGetters['profile/all']) {
        await dispatch('setEnabled', {
          enabled: false,
          pluginId,
          profileId: profile.id
        })

        if (removeOptions) {
          dispatch('deletePluginOptionsForProfile', { pluginId, profileId: profile.id })
        }
      }

      if (removeOptions && getters.profileHasPluginOptions(pluginId, 'global')) {
        dispatch('deletePluginOptionsForProfile', { pluginId, profileId: 'global' })
      }

      try {
        await this._vm.$plugins.deletePlugin(pluginId)
      } catch (error) {
        this._vm.$logger.error(
          `Could not delete '${pluginId}' plugin: ${error.message}`
        )
      }
    },

    deleteLoaded ({ commit, getters, rootGetters }, { pluginId, profileId = null }) {
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

    setLanguages ({ commit, getters, rootGetters }, { pluginId, languages, profileId }) {
      if (!getters.isEnabled(pluginId, profileId)) {
        throw new Error('Plugin is not enabled')
      }

      for (const language of Object.keys(languages)) {
        if (getters.languages[language]) {
          throw new Error(`Language "${language}" exists already`)
        }
      }

      commit('SET_PLUGIN_LANGUAGES', {
        pluginId,
        languages,
        profileId: profileId || rootGetters['session/profileId']
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
      if (data.profileId !== 'global' && !getters.isEnabled(data.pluginId, data.profileId)) {
        throw new Error('Plugin is not enabled')
      }

      commit('SET_PLUGIN_OPTION', {
        pluginId: data.pluginId,
        profileId: data.profileId === 'global' ? 'global' : rootGetters['session/profileId'],
        key: data.key,
        value: data.value
      })
    },

    deletePluginOptionsForProfile ({ commit, rootGetters }, { pluginId, profileId = null }) {
      profileId = profileId || rootGetters['session/profileId']

      commit('DELETE_PLUGIN_OPTIONS', {
        pluginId,
        profileId
      })
    }
  }
}
