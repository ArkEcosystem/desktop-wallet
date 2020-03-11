export function create (walletApi, app, plugin) {
  return () => {
    const getOptions = (global = false) => {
      return app.$store.getters['plugin/pluginOptions'](
        plugin.config.id,
        global ? 'global' : app.$store.getters['session/profileId']
      )
    }

    walletApi.storage = {
      get: (key, global = false) => {
        const options = getOptions(global)
        return options && options[key]
      },

      set: (key, value, global = false) => {
        app.$store.dispatch('plugin/setPluginOption', {
          profileId: global ? 'global' : app.$store.getters['session/profileId'],
          pluginId: plugin.config.id,
          key,
          value
        })
      },

      clear: (global = false) => {
        app.$store.dispatch('plugin/deletePluginOptionsForProfile', {
          profileId: global ? 'global' : app.$store.getters['session/profileId'],
          pluginId: plugin.config.id
        })
      },

      getOptions
    }
  }
}
