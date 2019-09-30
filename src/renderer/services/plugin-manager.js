import * as fs from 'fs-extra'
import * as path from 'path'
import { PLUGINS } from '@config'
import { Plugin } from './plugin-manager/plugin'
import { PluginConfiguration } from './plugin-manager/plugin-configuration'
import { PluginSetup } from './plugin-manager/plugin-setup'
import { PluginSandbox } from './plugin-manager/plugin-sandbox'
import { validatePluginPath } from './plugin-manager/utils/validate-plugin-path'

let rootPath = path.resolve(__dirname, '../../../')
if (process.env.NODE_ENV === 'production') {
  rootPath = path.resolve(__dirname, '../../')
}

class PluginManager {
  constructor () {
    this.plugins = {}
    this.hasInit = false
    this.vue = null
  }

  setVue (vue) {
    this.vue = vue
  }

  async init (app) {
    this.app = app

    await this.app.$store.dispatch('plugin/init')
    await this.fetchPluginsFromPath(
      process.env.NODE_ENV !== 'development' ? PLUGINS.path : PLUGINS.devPath
    )

    this.hasInit = true

    await this.app.$store.dispatch('plugin/loadPluginsForProfiles')
  }

  async enablePlugin (pluginId, profileId) {
    if (!this.hasInit) {
      throw new Error('Plugin Manager not initiated')
    }

    const plugin = this.plugins[pluginId]
    if (!plugin) {
      throw new Error('Plugin not found')
    }

    if (!this.app.$store.getters['plugin/isEnabled'](plugin.config.id, profileId)) {
      throw new Error('Plugin is not enabled')
    }

    await this.app.$store.dispatch('plugin/setLoaded', {
      config: plugin.config,
      fullPath: plugin.fullPath,
      profileId
    })

    const sandbox = new PluginSandbox({
      plugin,
      app: this.app
    })

    await sandbox.install()

    const setup = new PluginSetup({
      plugin,
      sandbox,
      profileId,
      vue: this.vue
    })

    await setup.install()
  }

  async unloadThemes (plugin, profileId) {
    const defaultTheme = 'light'
    await this.app.$store.dispatch('session/setTheme', defaultTheme)

    const profile = this.app.$store.getters['profile/byId'](profileId)
    await this.app.$store.dispatch('profile/update', {
      ...profile,
      ...{ theme: defaultTheme }
    })
  }

  getAvatarComponents (pluginId) {
    const plugin = this.plugins[pluginId]

    if (!plugin) {
      return {}
    }

    return plugin.getAvatarComponents()
  }

  // TODO hook to clean up and restore or reset values
  async disablePlugin (pluginId, profileId) {
    if (!this.hasInit) {
      throw new Error('Plugin Manager not initiated')
    }

    const plugin = this.plugins[pluginId]
    if (!plugin) {
      throw new Error(`Plugin \`${pluginId}\` not found`)
    }

    if (plugin.config.permissions.includes('THEMES')) {
      await this.unloadThemes(plugin, profileId)
    }

    await this.app.$store.dispatch('plugin/deleteLoaded', plugin.config.id)
  }

  async fetchPluginsFromPath (pluginsPath) {
    fs.ensureDirSync(pluginsPath)

    const entries = fs.readdirSync(pluginsPath).filter(entry => {
      if (fs.lstatSync(`${pluginsPath}/${entry}`).isDirectory()) {
        return true
      }

      return false
    })

    for (const entry of entries) {
      const pluginPath = `${pluginsPath}/${entry}`
      try {
        await this.fetchPlugin(pluginPath)
      } catch (error) {
        console.error(`Could not fetch plugin '${pluginPath}': ${error}`)
      }
    }
  }

  async fetchPlugin (pluginPath) {
    validatePluginPath(pluginPath)

    const packageJson = JSON.parse(fs.readFileSync(`${pluginPath}/package.json`))
    const pluginConfig = PluginConfiguration.sanitize(packageJson)

    if (this.plugins[pluginConfig.id]) {
      throw new Error(`Plugin '${pluginConfig.id}' has already been loaded`)
    }

    const fullPath = pluginPath.substring(0, 1) === '/' ? pluginPath : path.resolve(pluginPath)

    await this.app.$store.dispatch('plugin/setAvailable', {
      config: pluginConfig,
      fullPath
    })

    this.plugins[pluginConfig.id] = new Plugin({
      config: pluginConfig,
      path,
      fullPath,
      rootPath
    })
  }
}

export default new PluginManager()
