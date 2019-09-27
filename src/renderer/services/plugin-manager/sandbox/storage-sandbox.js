export function createStorageSandbox (walletApi, app, plugin) {
  return () => {
    walletApi.storage = {
      get: (key) => {
        const options = app.$store.getters['plugin/pluginOptions'](
          plugin.config.id,
          app.$store.getters['session/profileId']
        )

        return options[key]
      },

      set: (key, value) => {
        app.$store.dispatch('plugin/setPluginOption', {
          profileId: this.app.$store.getters['session/profileId'],
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
