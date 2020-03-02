import { normalizeJson } from '../utils/normalize-json'
import { isString } from 'lodash'

export function create (plugin, pluginObject, sandbox, profileId) {
  return async () => {
    const pluginWalletTabs = normalizeJson(pluginObject.getWalletTabs())

    if (pluginWalletTabs && Array.isArray(pluginWalletTabs) && pluginWalletTabs.length) {
      // Validate the configuration of each tab
      const walletTabs = pluginWalletTabs.reduce((valid, walletTab) => {
        if (isString(walletTab.tabTitle) && plugin.components[walletTab.componentName]) {
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
