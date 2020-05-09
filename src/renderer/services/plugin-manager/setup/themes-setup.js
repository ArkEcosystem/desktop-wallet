import path from 'path'
import fs from 'fs'
import { normalizeJson } from '../utils/normalize-json'
import { isEmpty } from '@/utils'

export function create (plugin, pluginObject, sandbox, profileId) {
  return async () => {
    if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getThemes')) {
      return
    }

    const pluginThemes = normalizeJson(pluginObject.getThemes())
    if (pluginThemes && typeof pluginThemes === 'object') {
      // Validate the configuration of each theme and ensure that their CSS exist
      const themes = Object.keys(pluginThemes).reduce((valid, themeId) => {
        const config = pluginThemes[themeId]

        if (typeof config.darkMode === 'boolean' && typeof config.cssPath === 'string') {
          const cssPath = path.join(plugin.fullPath, 'src', config.cssPath)
          if (!fs.existsSync(cssPath)) {
            throw new Error(`No file found on \`${config.cssPath}\` for theme "${themeId}"`)
          }

          valid[themeId] = {
            ...config,
            name: config.name || themeId,
            cssPath
          }
        }
        return valid
      }, {})

      if (!isEmpty(themes)) {
        await sandbox.app.$store.dispatch('plugin/setThemes', {
          pluginId: plugin.config.id,
          themes,
          profileId
        })
      }
    }
  }
}
