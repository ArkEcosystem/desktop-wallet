import path from 'path'
import fs from 'fs'
import { normalizeJson } from '../utils/normalize-json'
import { isEmpty, isString } from 'lodash'

export function create (plugin, pluginObject, sandbox, profileId) {
  return async () => {
    if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getThemes')) {
      return
    }

    const pluginThemes = normalizeJson(pluginObject.getThemes())
    if (pluginThemes && typeof pluginThemes === 'object') {
      // Validate the configuration of each theme and ensure that their CSS exist
      const themes = Object.keys(pluginThemes).reduce((valid, themeName) => {
        const config = pluginThemes[themeName]

        if (typeof config.darkMode === 'boolean' && isString(config.cssPath)) {
          const cssPath = path.join(plugin.fullPath, 'src', config.cssPath)
          if (!fs.existsSync(cssPath)) {
            throw new Error(`No file found on \`${config.cssPath}\` for theme "${themeName}"`)
          }

          valid[themeName] = { ...config, cssPath }
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
