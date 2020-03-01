import { normalizeJson } from '../utils/normalize-json'

export function create (plugin, pluginObject, sandbox, profileId) {
  return async () => {
    const pluginWalletTabs = normalizeJson(pluginObject.getWalletTabs())

    if (pluginWalletTabs && Array.isArray(pluginWalletTabs) && pluginWalletTabs.length) {
      // Validate the configuration of each tab
      const walletTabs = pluginWalletTabs.reduce((valid, walletTab) => {
        if (typeof walletTab.tabTitle === 'string' && plugin.components[walletTab.componentName]) {
          valid.push(walletTab)
        }
        return valid
      }, [])

      if (walletTabs.length) {
        await sandbox.app.$store.dispatch('plugin/setWalletTabs', {
          pluginId: plugin.config.id,
          walletTabs,
          profileId
        })
      }
    }
  }
}
