import * as fs from 'fs-extra'
import * as os from 'os'
import * as path from 'path'
import * as vm2 from 'vm2'

// import router from '@/router'

class PluginManager {
  constructor () {
    this.plugins = {}
  }

  async init (app) {
    this.app = app

    await this.app.$store.dispatch('plugin/init')

    // try {
    //   console.log('app store', app.$store.getters['app/hasSeenIntroduction'])
    // } catch (error) {
    //   console.log('app store error', error.message, false)
    // }
    await this.fetchPluginsFromPath(`${__dirname}/../../../plugins`)
    // this.fetchPluginsFromPath(path.resolve(__dirname, '../../../plugins'))
    await this.fetchPluginsFromPath(path.resolve(os.homedir(), '.ark-desktop/plugins'))

    console.log('activatePlugins', '')
    await this.activatePlugins()
  }

  async activatePlugins () {
    for (const plugin of Object.values(this.plugins)) {
      try {
        console.log('plugin', plugin)
        console.log('plugin fullPath', plugin.fullPath)

        await this.enablePlugin(plugin.config.id)
      } catch (error) {
        console.log('plugin error', { error, message: error.message })
      }
    }
  }

  async enablePlugin (pluginId) {
    const plugin = this.plugins[pluginId]

    if (!this.app.$store.getters['plugin/isEnabled'](plugin.config.id)) {
      throw new Error('Plugin is not enabled')
    }

    const pluginObject = plugin.vm.run(
      fs.readFileSync(path.join(plugin.fullPath, 'src/index.js')),
      path.join(plugin.fullPath, 'src/index.js')
    )
    pluginObject.register()

    // console.log('vm pluginObject', pluginObject)

    await this.app.$store.dispatch('plugin/setLoaded', {
      config: plugin.config,
      fullPath: plugin.fullPath
    })

    this.loadRoutes(pluginObject)
    await this.loadMenuItems(plugin.config.id, pluginObject)
  }

  async disablePlugin (pluginId) {
    const plugin = this.plugins[pluginId]

    await this.app.$store.dispatch('plugin/deleteLoaded', plugin.config.id)
  }

  loadRoutes (pluginObject) {
    const pluginRoutes = this.normalize(pluginObject.getRoutes())

    // console.log('vm pluginRoutes', pluginRoutes)

    if (pluginRoutes && pluginRoutes.length) {
      this.app.$router.addRoutes(pluginRoutes)
    }
  }

  async loadMenuItems (pluginId, pluginObject) {
    const menuItems = this.normalize(pluginObject.getMenuItems())

    // console.log('vm menuItems', menuItems)

    if (menuItems && menuItems.length) {
      await this.app.$store.dispatch('plugin/setMenuItems', {
        pluginId: pluginId,
        menuItems
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
        console.log(`Could not fetch plugin '${pluginPath}' `, `${error}`)
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
    if (config.permissions.includes('EVENTS')) {
      sandbox.walletApi.eventBus = this.app.$eventBus
    }
    if (config.permissions.includes('EVENTS')) {
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
