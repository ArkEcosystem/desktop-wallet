import path from 'path'
import fs from 'fs'
import { normalizeJson } from '../utils/normalize-json'
import { I18N } from '@config'
import { isEmpty } from '@/utils'

export function create (plugin, pluginObject, sandbox, profileId) {
  return async () => {
    if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getLanguages')) {
      return
    }

    const pluginLanguages = normalizeJson(pluginObject.getLanguages())
    if (pluginLanguages && typeof pluginLanguages === 'object') {
      // Validate the configuration of each language and ensure that the translations file exists
      const languages = Object.keys(pluginLanguages).reduce((valid, languageId) => {
        if (languageId === I18N.defaultLocale) {
          throw new Error(`Language ID is the same as the default locale "${I18N.defaultLocale}"`)
        }

        const config = pluginLanguages[languageId]

        if (typeof config.languagePath === 'string') {
          const languagePath = path.join(plugin.fullPath, 'src', config.languagePath)
          if (!fs.existsSync(languagePath)) {
            throw new Error(`No file found on "${config.languagePath}" for language "${languageId}"`)
          }

          const language = JSON.parse(normalizeJson(fs.readFileSync(languagePath, 'utf8')))

          for (const requiredProp of ['messages']) {
            if (!language[requiredProp]) {
              throw new Error(`Missing required property "${requiredProp}" for language "${languageId}"`)
            }
          }

          valid[languageId] = {
            ...config,
            name: config.name || languageId,
            languagePath
          }
        }
        return valid
      }, {})

      if (!isEmpty(languages)) {
        await sandbox.app.$store.dispatch('plugin/setLanguages', {
          pluginId: plugin.config.id,
          languages,
          profileId
        })
      }
    }
  }
}
