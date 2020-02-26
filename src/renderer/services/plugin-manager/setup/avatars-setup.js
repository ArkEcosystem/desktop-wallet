import { normalizeJson } from '../utils/normalize-json'

export function create (plugin, pluginObject, sandbox, profileId) {
  return async () => {
    if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getAvatars')) {
      return
    }

    const pluginAvatars = normalizeJson(await pluginObject.getAvatars())
    if (pluginAvatars && Array.isArray(pluginAvatars) && pluginAvatars.length) {
      const avatars = []
      for (const avatar of pluginAvatars) {
        if (typeof avatar !== 'string' || !plugin.components[avatar]) {
          continue
        }

        avatars.push(avatar)
      }

      plugin.avatars = avatars

      if (avatars.length) {
        await sandbox.app.$store.dispatch('plugin/setAvatars', {
          pluginId: plugin.config.id,
          avatars,
          profileId
        })
      }
    }
  }
}
