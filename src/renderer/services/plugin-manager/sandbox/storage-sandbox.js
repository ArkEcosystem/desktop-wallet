export function createStorageSandbox (walletApi, app, plugin) {
  return () => {
    walletApi.storage = {
      get: (key, global = false) => {
        const profile = global ? 'global' : app.$store.getters['session/profileId']
        const options = app.$store.getters['plugin/pluginOptions'](
          plugin.config.id,
          profile
        )

        return options && options[key]
      },

      set: (key, value, global = false) => {
        const profileId = global ? 'global' : app.$store.getters['session/profileId']
        app.$store.dispatch('plugin/setPluginOption', {
          profileId,
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
