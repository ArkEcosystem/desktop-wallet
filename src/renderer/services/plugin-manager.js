import * as fs from 'fs-extra'
import * as os from 'os'
import * as path from 'path'
import * as vm2 from 'vm2'

class PluginManager {
  constructor () {
    this.plugins = {}
    this.pluginRoutes = []
    this.hasInit = false
    this.vue = null
  }

  setVue (vue) {
    this.vue = vue
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

          const keys = ['$nextTick', '_c', '_v', '_s', '_e', '_m']
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

        // Fix context of "mounted" method
        if (component.mounted) {
          vmComponent.options.mounted[0] = function () { return component.mounted.apply(componentContext(this)) }
        }

        // TODO: Fix context of other method types allowed (see `this.validateComponent`)

        // Fix context of all standard methods
        vmComponent.options.methods = {}
        for (const methodName of Object.keys(component.methods || {})) {
          vmComponent.options.methods[methodName] = function () {
            return component.methods[methodName].apply(componentContext(this), [ ...arguments ])
          }
        }

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
      let routes = []
      for (const route of pluginRoutes) {
        if (typeof route.component !== 'string' || !plugin.components[route.component]) {
          continue
        }

        route.component = plugin.components[route.component]
        routes.push(route)
      }

      this.app.$router.addRoutes(routes.filter(route => {
        return !this.getAllRoutes().some(loadedRoute => loadedRoute.name === route.name)
      }))
      this.pluginRoutes.push(...routes)
    }
  }

  async loadMenuItems (pluginObject, plugin, profileId) {
    if (!pluginObject.hasOwnProperty('getMenuItems')) {
      return
    }

    const pluginMenuItems = this.normalize(pluginObject.getMenuItems())
    if (pluginMenuItems && Array.isArray(pluginMenuItems) && pluginMenuItems.length) {
      const menuItems = []
      for (const menuItem of pluginMenuItems) {
        if (!this.getAllRoutes().some(route => route.name === menuItem.routeName)) {
          continue
        }

        menuItems.push(menuItem)
      }

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

  validateComponent (component, name) {
    const requiredKeys = ['template']
    const allowedKeys = [
      'data',
      'methods',
      'computed',
      'beforeCreate',
      'created',
      'beforeMount',
      'mounted',
      'beforeUpdate',
      'updated',
      'beforeDestroy',
      'destroyed'
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
