import * as fs from 'fs-extra'
import * as os from 'os'
import * as path from 'path'
import * as vm2 from 'vm2'

// import router from '@/router'

class PluginManager {
  constructor () {
    this.plugins = {}
    this.hasInit = false
  }

  async init (app) {
    this.app = app

    this.app.$store.dispatch('plugin/init')

    await this.fetchPluginsFromPath(`${__dirname}/../../../plugins`)
    await this.fetchPluginsFromPath(path.resolve(os.homedir(), '.ark-desktop/plugins'))

    this.hasInit = true

    this.app.$store.dispatch('plugin/loadPluginsForProfiles')
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

    const pluginObject = plugin.vm.run(
      fs.readFileSync(path.join(plugin.fullPath, 'src/index.js')),
      path.join(plugin.fullPath, 'src/index.js')
    )
    pluginObject.register()

    await this.app.$store.dispatch('plugin/setLoaded', {
      config: plugin.config,
      fullPath: plugin.fullPath,
      profileId
    })

    this.loadRoutes(pluginObject)
    await this.loadAvatars(plugin.config.id, pluginObject, profileId)
    await this.loadMenuItems(plugin.config.id, pluginObject, profileId)
  }

  async disablePlugin (pluginId) {
    if (!this.hasInit) {
      throw new Error('Plugin Manager not initiated')
    }

    const plugin = this.plugins[pluginId]
    if (!plugin) {
      throw new Error('Plugin not found')
    }

    await this.app.$store.dispatch('plugin/deleteLoaded', plugin.config.id)
  }

  loadRoutes (pluginObject) {
    if (!pluginObject.hasOwnProperty('getRoutes')) {
      return
    }

    const pluginRoutes = this.normalize(pluginObject.getRoutes())
    if (pluginRoutes && Array.isArray(pluginRoutes) && pluginRoutes.length) {
      this.app.$router.addRoutes(pluginRoutes)
    }
  }

  async loadAvatars (pluginId, pluginObject, profileId) {
    if (!pluginObject.hasOwnProperty('getAvatars')) {
      return
    }

    let avatars = this.normalize(pluginObject.getAvatars())
    if (avatars && Array.isArray(avatars) && avatars.length) {
      avatars = avatars.filter((avatar) => {
        if (!avatar.hasOwnProperty('name') || !avatar.hasOwnProperty('template')) {
          this.app.$logger.error('Plugin avatar components must contain a name and a template')

          return false
        }

        if (!/^[a-zA-Z][a-zA-Z0-9-]+$/.test(avatar.name)) {
          this.app.$logger.error(
            'Plugin avatar component names must contain only alphanumeric or hyphens and start with a letter'
          )

          return false
        }

        return true
      })
      if (avatars.length) {
        await this.app.$store.dispatch('plugin/setAvatars', {
          pluginId: pluginId,
          avatars,
          profileId
        })
      }
    }
  }

  async loadMenuItems (pluginId, pluginObject, profileId) {
    if (!pluginObject.hasOwnProperty('getMenuItems')) {
      return
    }

    const menuItems = this.normalize(pluginObject.getMenuItems())
    if (menuItems && Array.isArray(menuItems) && menuItems.length) {
      await this.app.$store.dispatch('plugin/setMenuItems', {
        pluginId: pluginId,
        menuItems,
        profileId
      })
    }
  }

  normalize (data) {
    return JSON.parse(JSON.stringify(data))
  }

  async fetchPluginsFromPath (pluginsPath) {
    console.log('fetchPluginsFromPath ', pluginsPath)
    if (!fs.existsSync(pluginsPath)) {
      return
    }

    const entries = fs.readdirSync(pluginsPath).filter(entry => {
      if (fs.lstatSync(`${pluginsPath}/${entry}`).isDirectory()) {
        return true
      }

      return false
    })

    for (const entry of entries) {
      const pluginPath = `${pluginsPath}/${entry}`
      console.log('fetch plugin', pluginPath)
      try {
        await this.fetchPlugin(pluginPath)
      } catch (error) {
        console.error(`Could not fetch plugin '${pluginPath}': ${error}`)
      }
    }
  }

  async fetchPlugin (pluginPath) {
    this.validatePlugin(pluginPath)

    const config = JSON.parse(fs.readFileSync(`${pluginPath}/config.json`))
    if (!config.id) {
      throw new Error('Plugin ID not found')
    } else if (!/^[a-z-0-9-]+$/.test(config.id)) {
      throw new Error('Invalid Plugin ID')
    }

    const fullPath = pluginPath.substring(0, 1) === '/' ? pluginPath : path.resolve(pluginPath)

    await this.app.$store.dispatch('plugin/setAvailable', {
      config,
      fullPath
    })

    this.plugins[config.id] = {
      config,
      path: pluginPath,
      fullPath,
      vm: new vm2.NodeVM({
        sandbox: this.loadSandbox(config),
        require: {
          external: ['./src'],
          builtin: [],
          root: fullPath
        }
      })
    }
  }

  loadSandbox (config) {
    const sandbox = {
      walletApi: {}
    }

    if (!config.permissions || !Array.isArray(config.permissions)) {
      return sandbox
    }

    if (config.permissions.includes('EVENTS')) {
      sandbox.walletApi.eventBus = this.app.$eventBus
    }

    if (config.permissions.includes('ALERTS')) {
      sandbox.walletApi.alert = {
        error: this.app.$error,
        success: this.app.$success,
        info: this.app.$info,
        warn: this.app.$warn
      }
    }

    return sandbox
  }

  validatePlugin (pluginPath) {
    const structureExists = [
      'config.json',
      'src',
      'src/index.js'
    ]

    for (const pathCheck of structureExists) {
      if (!fs.existsSync(path.resolve(pluginPath, pathCheck))) {
        throw new Error(`'${pathCheck}' does not exist`)
      }
    }
  }
}

export default new PluginManager()
