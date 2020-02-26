export function create (walletApi, app, plugin) {
  return () => {
    walletApi.storage = {
      get: (key, global = false) => {
        const options = app.$store.getters['plugin/pluginOptions'](
          plugin.config.id,
          global ? 'global' : app.$store.getters['session/profileId']
        )

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

      getOptions: () => {
        return app.$store.getters['plugin/pluginOptions'](
          plugin.config.id,
          app.$store.getters['session/profileId']
        )
      }
    }
  }
}
