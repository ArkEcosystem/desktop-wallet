import * as fs from 'fs-extra'
import * as os from 'os'
import * as path from 'path'
import * as vm2 from 'vm2'
import { ipcRenderer } from 'electron'

class PluginManager {
  constructor () {
    this.plugins = {}
    this.pluginRoutes = []
    this.hasInit = false
    this.vue = null
    this.hooks = [
      'beforeCreate',
      'created',
      'beforeMount',
      'mounted',
      'beforeUpdate',
      'updated',
      'beforeDestroy',
      'destroyed'
    ]
  }

  setVue (vue) {
    this.vue = vue
  }

  async init (app) {
    this.app = app

    await this.app.$store.dispatch('plugin/init')

    await this.fetchPluginsFromPath(`${__dirname}/../../../plugins`)
    await this.fetchPluginsFromPath(path.resolve(os.homedir(), '.ark-desktop/plugins'))

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

    const pluginObject = plugin.vm.run(
      fs.readFileSync(path.join(plugin.fullPath, 'src/index.js')),
      path.join(plugin.fullPath, 'src/index.js')
    )

    if (pluginObject.hasOwnProperty('register')) {
      await pluginObject.register()
    }

    await this.app.$store.dispatch('plugin/setLoaded', {
      config: plugin.config,
      fullPath: plugin.fullPath,
      profileId
    })

    await this.loadComponents(pluginObject, plugin)
    await this.loadRoutes(pluginObject, plugin)
    await this.loadMenuItems(pluginObject, plugin, profileId)
    await this.loadAvatars(pluginObject, plugin, profileId)
    await this.loadWalletTabs(pluginObject, plugin, profileId)
    await this.loadUnprotectedIframeUrls(pluginObject, plugin, profileId)
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

  async loadComponents (pluginObject, plugin) {
    if (!pluginObject.hasOwnProperty('getComponentPaths')) {
      return
    }

    const components = []
    const pluginComponents = await pluginObject.getComponentPaths()
    if (pluginComponents && !Array.isArray(pluginComponents) && typeof pluginComponents === 'object') {
      for (const componentName of Object.keys(pluginComponents)) {
        let componentPath = pluginComponents[componentName]
        if (componentPath.indexOf('./') === 0) {
          componentPath = `${componentPath.substring(2)}`
        }
        const fullPath = path.join(plugin.fullPath, 'src', pluginComponents[componentName])

        const component = plugin.vm.run(
          fs.readFileSync(fullPath),
          fullPath
        )

        if (!this.validateComponent(component, componentName)) {
          continue
        }

        // Inline method to format context based on "this"
        const componentContext = function (that) {
          let context = that._data
          if (!context) {
            context = {}
          }

          const keys = ['$nextTick', '_c', '_v', '_s', '_e', '_m', '_l']
          for (const key of keys) {
            context[key] = that[key]
          }

          for (const computedName of Object.keys(component.computed || {})) {
            context[computedName] = that[computedName]
          }

          for (const methodName of Object.keys(component.methods || {})) {
            context[methodName] = function () {
              return component.methods[methodName].apply(componentContext(that))
            }
          }

          return context
        }

        // Build component object inside vm2 to restrict access for methods
        // TODO: Security checks against running from wallet root instead of plugin root.
        //       Make sure additional files/packages aren't accessible.
        const vm = new vm2.NodeVM({
          sandbox: { ...this.loadSandbox(plugin.config), document },
          require: {
            builtin: [],
            context: 'sandbox',
            external: [
              path.resolve(plugin.fullPath, '/src/', componentPath),
              'vue/dist/vue.common.js'
            ],
            root: path.resolve(__dirname, '../../../')
          }
        })

        // TODO: Test accessing 'document' "module.exports =" in the required component file.
        const renderedComponent = vm.run(
          `const Vue = require('vue/dist/vue.common.js')
          const component = require('./${componentPath}')
          const compiled = Vue.compile(component.template)
          const componentContext = ${componentContext.toString()}
          if (compiled.staticRenderFns.length) {
            component.render = compiled.render
            component.staticRenderFns = compiled.staticRenderFns
          } else {
            component.render = function () {
              return compiled.render.apply(componentContext(this), [ ...arguments ])
            }
          }
          delete component.template

          module.exports = component`,
          path.join(plugin.fullPath, 'src/vm-component.js')
        )

        // Build Vue component
        const vmComponent = this.vue.component(componentName, renderedComponent)

        // Fix context of "data" method
        if (component.data) {
          vmComponent.options.data = function () { return component.data.apply(componentContext(this)) }
        }

        // Fix context of "computed" methods - also removes global computed methods
        for (const computedName of Object.keys(vmComponent.options.computed)) {
          vmComponent.options.computed[computedName] = function () {}
        }

        const createdMethod = vmComponent.options.created
        vmComponent.options.created = [function () {
          for (const computedName of Object.keys(this.$options.computed)) {
            if (component.computed && component.computed[computedName]) {
              this.$options.computed[computedName] = component.computed[computedName].bind(
                componentContext(this)
              )
              this._computedWatchers[computedName].getter = component.computed[computedName].bind(
                componentContext(this)
              )
              this._computedWatchers[computedName].run()
            }

            if (!component.computed || !component.computed[computedName]) {
              delete this.$options.computed[computedName]
              this._computedWatchers[computedName].teardown()
              delete this._computedWatchers[computedName]

              for (const watcherId in this._watchers) {
                if (this._watchers[watcherId].getter.name === computedName) {
                  this._watchers[watcherId].teardown()
                  break
                }
              }
            }
          }
          if (createdMethod) {
            return createdMethod[0].apply(componentContext(this))
          }
        }]

        // Fix context of all standard methods
        vmComponent.options.methods = {}
        for (const methodName of Object.keys(component.methods || {})) {
          vmComponent.options.methods[methodName] = function () {
            return component.methods[methodName].apply(componentContext(this), [ ...arguments ])
          }
        }

        // Fix context of hooks
        this.hooks
          .filter(hook => component.hasOwnProperty(hook))
          .forEach(prop => {
            vmComponent.options[prop] = function () { return component[prop].apply(componentContext(this)) }
          })

        components[componentName] = vmComponent
      }
    }

    plugin.components = components
  }

  async loadRoutes (pluginObject, plugin) {
    if (!pluginObject.hasOwnProperty('getRoutes')) {
      return
    }

    const pluginRoutes = this.normalize(await pluginObject.getRoutes())
    if (pluginRoutes && Array.isArray(pluginRoutes) && pluginRoutes.length) {
      const allRoutes = this.getAllRoutes()

      const routes = pluginRoutes.reduce((valid, route) => {
        console.log(route, plugin.components)
        if (typeof route.component === 'string' && plugin.components[route.component]) {
          if (allRoutes.every(loadedRoute => loadedRoute.name !== route.name)) {
            valid.push({
              ...route,
              component: plugin.components[route.component]
            })
          }
        }
        return valid
      }, [])

      console.log(routes)

      this.pluginRoutes.push(...routes)
      this.app.$router.addRoutes(routes)
    }
  }

  async loadMenuItems (pluginObject, plugin, profileId) {
    if (!pluginObject.hasOwnProperty('getMenuItems')) {
      return
    }

    const pluginMenuItems = this.normalize(pluginObject.getMenuItems())
    if (pluginMenuItems && Array.isArray(pluginMenuItems) && pluginMenuItems.length) {
      const allRoutes = this.getAllRoutes()

      const menuItems = pluginMenuItems.reduce((valid, menuItem) => {
        // Check that the related route exists
        if (allRoutes.some(route => route.name === menuItem.routeName)) {
          valid.push(menuItem)
        }
        return valid
      }, [])

      await this.app.$store.dispatch('plugin/setMenuItems', {
        pluginId: plugin.config.id,
        menuItems,
        profileId
      })
    }
  }

  async loadAvatars (pluginObject, plugin, profileId) {
    if (!pluginObject.hasOwnProperty('getAvatars')) {
      return
    }

    let pluginAvatars = this.normalize(await pluginObject.getAvatars())
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
        await this.app.$store.dispatch('plugin/setAvatars', {
          pluginId: plugin.config.id,
          avatars,
          profileId
        })
      }
    }
  }

  getAvatarComponents (pluginId) {
    const plugin = this.plugins[pluginId]
    if (!plugin || !plugin.avatars) {
      return {}
    }

    const components = {}
    for (const avatarName of plugin.avatars) {
      if (!plugin.components[avatarName]) {
        continue
      }

      components[avatarName] = plugin.components[avatarName]
    }

    return components
  }

  async loadWalletTabs (pluginObject, plugin, profileId) {
    if (!pluginObject.hasOwnProperty('getWalletTabs')) {
      return
    }

    const pluginWalletTabs = this.normalize(pluginObject.getWalletTabs())
    if (pluginWalletTabs && Array.isArray(pluginWalletTabs) && pluginWalletTabs.length) {
      // Validate the configuration of each tab
      const walletTabs = pluginWalletTabs.reduce((valid, walletTab) => {
        if (typeof walletTab.tabTitle === 'string' && plugin.components[walletTab.componentName]) {
          valid.push(walletTab)
        }
        return valid
      }, [])

      if (walletTabs.length) {
        await this.app.$store.dispatch('plugin/setWalletTabs', {
          pluginId: plugin.config.id,
          walletTabs,
          profileId
        })
      }
    }
  }

  async loadUnprotectedIframeUrls (pluginObject) {
    if (!pluginObject.hasOwnProperty('getUnprotectedIframeUrls')) {
      return
    }

    const urls = pluginObject.getUnprotectedIframeUrls()
    if (urls) {
      ipcRenderer.send('disable-iframe-protection', urls)
    }
  }

  getWalletTabComponent (pluginId, walletTab) {
    const component = this.plugins[pluginId].components[walletTab.componentName]
    if (!component) {
      throw new Error(`The wallet tab component \`${walletTab.componentName}\` has not be found`)
    }
    return component
  }

  validateComponent (component, name) {
    const requiredKeys = ['template']
    const allowedKeys = [
      'data',
      'methods',
      'computed',
      ...this.hooks
    ]

    const missingKeys = []
    for (const key of requiredKeys) {
      if (!component.hasOwnProperty(key)) {
        missingKeys.push(key)
      }
    }

    if (missingKeys.length) {
      this.app.$logger.error(`Plugin component '${name}' is missing: ${missingKeys.join(', ')}`)

      return false
    }

    const bannedKeys = []
    for (const key of Object.keys(component)) {
      if (![ ...requiredKeys, ...allowedKeys ].includes(key)) {
        bannedKeys.push(key)
      }
    }

    if (bannedKeys.length) {
      this.app.$logger.error(`Plugin component '${name}' has unpermitted keys: ${bannedKeys.join(', ')}`)

      return false
    }

    return true
  }

  getAllRoutes () {
    return [...this.app.$router.options.routes, ...this.pluginRoutes]
  }

  normalize (data) {
    return JSON.parse(JSON.stringify(data))
  }

  async fetchPluginsFromPath (pluginsPath) {
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
      try {
        await this.fetchPlugin(pluginPath)
      } catch (error) {
        console.error(`Could not fetch plugin '${pluginPath}': ${error}`)
      }
    }
  }

  async fetchPlugin (pluginPath) {
    this.validatePlugin(pluginPath)

    let config = JSON.parse(fs.readFileSync(`${pluginPath}/package.json`))
    config = {
      id: config.name,
      name: config.title,
      description: config.description,
      version: config.version,
      permissions: config.permissions,
      urls: config.urls
    }
    if (!config.id) {
      throw new Error('Plugin ID not found')
    } else if (!/^[a-z-0-9-]+$/.test(config.id)) {
      throw new Error('Invalid Plugin ID')
    } else if (this.plugins[config.id]) {
      throw new Error(`Plugin '${config.id}' has already been loaded`)
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
          builtin: [],
          context: 'sandbox',
          external: ['./src', 'vue/dist/vue.common.js'],
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

    if (config.permissions.includes('AUDIO')) {
      sandbox.AudioContext = AudioContext
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
      'package.json',
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
