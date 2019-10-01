import * as fs from 'fs-extra'
import * as path from 'path'
import * as vm2 from 'vm2'
import { ipcRenderer } from 'electron'
import { camelCase, cloneDeep, isBoolean, isEmpty, isObject, isString, partition, uniq, upperFirst } from 'lodash'
import { PLUGINS } from '@config'
import PluginHttp from '@/services/plugin-manager/http'
import PluginWebsocket from '@/services/plugin-manager/websocket'
import SandboxFontAwesome from '@/services/plugin-manager/font-awesome-sandbox'
import WalletComponents from '@/services/plugin-manager/wallet-components'

let rootPath = path.resolve(__dirname, '../../../')
if (process.env.NODE_ENV === 'production') {
  rootPath = path.resolve(__dirname, '../../')
}

class PluginManager {
  constructor () {
    this.plugins = {}
    this.pluginRoutes = []
    this.hasInit = false
    this.vue = null
    this.hooks = [
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

    const pluginObject = plugin.vm.run(
      fs.readFileSync(path.join(plugin.fullPath, 'src/index.js')),
      path.join(plugin.fullPath, 'src/index.js')
    )

    if (Object.prototype.hasOwnProperty.call(pluginObject, 'register')) {
      await pluginObject.register()
    }

    await this.app.$store.dispatch('plugin/setLoaded', {
      config: plugin.config,
      fullPath: plugin.fullPath,
      profileId
    })

    const [first, rest] = partition(plugin.config.permissions, permission => {
      // These permissions could be necessary first to load others
      // The rest does not have dependencies: 'MENU_ITEMS', 'AVATARS', 'WALLET_TABS'
      return ['COMPONENTS', 'ROUTES'].includes(permission)
    })

    for (const permission of first) {
      const method = `loadPlugin${upperFirst(camelCase(permission))}`
      if (typeof this[method] === 'function') {
        await this[method](pluginObject, plugin, profileId)
      }
    }
    for (const permission of rest) {
      const method = `loadPlugin${upperFirst(camelCase(permission))}`
      if (typeof this[method] === 'function') {
        await this[method](pluginObject, plugin, profileId)
      }
    }
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

  async loadPluginComponents (pluginObject, plugin) {
    if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getComponentPaths')) {
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

        if (!this.validateComponent(plugin, component, componentName)) {
          continue
        }

        // Inline method to format context based on "this"
        const componentContext = function (that, componentData = component) {
          let context = that._data
          if (!context) {
            context = {}
          }

          const keys = ['$nextTick', '$refs', '_c', '_v', '_s', '_e', '_m', '_l', '_u']
          for (let key of keys) {
            let thatObject = that[key]

            if (key === '$refs' && thatObject) {
              key = 'refs'
              thatObject = {}
              const badGetters = [
                'attributes',
                'children',
                'childNodes',
                'contentDocument',
                'contentWindow',
                'firstChild',
                'firstElementChild',
                'lastChild',
                'lastElementChild',
                'nextElementSibling',
                'nextSibling',
                'offsetParent',
                'ownerDocument',
                'parentElement',
                'parentNode',
                'shadowRoot',
                'previousElementSibling',
                'previousSibling',
                '$root',
                '__vue__'
              ]
              const badSetters = [
                'innerHTML',
                'outerHTML'
              ]
              that.$nextTick(() => {
                for (const elKey in that.$refs) {
                  const element = that.$refs[elKey]

                  if (!element.tagName || element.tagName.toLowerCase() === 'iframe') {
                    continue
                  }

                  for (const badGetter of badGetters) {
                    element.__defineGetter__(badGetter, () => console.log('🚫'))
                  }

                  for (const badSetter of badSetters) {
                    element.__defineSetter__(badSetter, () => console.log('🚫'))
                  }

                  thatObject[elKey] = element
                }
              })
            }

            context[key] = thatObject
          }

          for (const computedName of Object.keys(componentData.computed || {})) {
            context[computedName] = that[computedName]
          }

          for (const methodName of Object.keys(componentData.methods || {})) {
            context[methodName] = function () {
              return componentData.methods[methodName].apply(componentContext(that, componentData))
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
            resolve: function (source) {
              return path.resolve(plugin.fullPath, 'src/', source)
            },
            external: {
              modules: [
                path.resolve(plugin.fullPath, 'src/'),
                'vue/dist/vue.common.js'
              ],
              transitive: true
            },
            root: [
              rootPath,
              path.resolve(plugin.fullPath, 'src/')
            ]
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
              return compiled.render.apply(componentContext(this, component), [ ...arguments ])
            }
          }
          delete component.template

          module.exports = component`,
          path.join(rootPath, 'src/vm-component.js')
        )

        for (const methodName of Object.keys(renderedComponent.methods || {})) {
          renderedComponent.methods[methodName] = component.methods[methodName]
        }

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

        vmComponent.options.created = [function () {
          for (const computedName of Object.keys(this.$options.computed)) {
            if (component.computed && component.computed[computedName]) {
              this.$options.computed[computedName] = component.computed[computedName].bind(
                componentContext(this)
              )
              this._computedWatchers[computedName].getter = component.computed[computedName].bind(
                componentContext(this)
              )

              try {
                this._computedWatchers[computedName].run()
              } catch (error) {
                console.error(error)
              }
            }

            if (!component.computed || !component.computed[computedName]) {
              delete this.$options.computed[computedName]

              try {
                this._computedWatchers[computedName].teardown()
              } catch (error) {
                console.error(error)
              }

              delete this._computedWatchers[computedName]

              for (const watcherId in this._watchers) {
                if (this._watchers[watcherId].getter.name === computedName) {
                  try {
                    this._watchers[watcherId].teardown()
                  } catch (error) {
                    console.error(error)
                  }

                  break
                }
              }
            }
          }

          if (component.created) {
            return component.created.apply(componentContext(this))
          }
        }]

        // Fix context of hooks
        this.hooks
          .filter(hook => Object.prototype.hasOwnProperty.call(component, hook))
          .filter(hook => hook !== 'created')
          .forEach(prop => {
            const hookMethod = function () { return component[prop].apply(componentContext(this)) }
            if (Array.isArray(vmComponent.options[prop])) {
              vmComponent.options[prop] = [hookMethod]
            } else {
              vmComponent.options[prop] = hookMethod
            }
          })

        components[componentName] = vmComponent
      }
    }

    plugin.components = components
  }

  async loadPluginRoutes (pluginObject, plugin) {
    if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getRoutes')) {
      return
    }

    const pluginRoutes = this.normalize(await pluginObject.getRoutes())
    if (pluginRoutes && Array.isArray(pluginRoutes) && pluginRoutes.length) {
      const allRoutes = this.getAllRoutes()

      const routes = pluginRoutes.reduce((valid, route) => {
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

      this.pluginRoutes.push(...routes)
      this.app.$router.addRoutes(routes)
    }
  }

  async loadPluginMenuItems (pluginObject, plugin, profileId) {
    if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getMenuItems')) {
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

  async loadPluginAvatars (pluginObject, plugin, profileId) {
    if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getAvatars')) {
      return
    }

    const pluginAvatars = this.normalize(await pluginObject.getAvatars())
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

  async loadPluginWalletTabs (pluginObject, plugin, profileId) {
    if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getWalletTabs')) {
      return
    }

    const pluginWalletTabs = this.normalize(pluginObject.getWalletTabs())
    if (pluginWalletTabs && Array.isArray(pluginWalletTabs) && pluginWalletTabs.length) {
      // Validate the configuration of each tab
      const walletTabs = pluginWalletTabs.reduce((valid, walletTab) => {
        if (isString(walletTab.tabTitle) && plugin.components[walletTab.componentName]) {
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

  async loadPluginThemes (pluginObject, plugin, profileId) {
    if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getThemes')) {
      return
    }

    const pluginThemes = this.normalize(pluginObject.getThemes())
    if (pluginThemes && isObject(pluginThemes)) {
      // Validate the configuration of each theme and ensure that their CSS exist
      const themes = Object.keys(pluginThemes).reduce((valid, themeName) => {
        const config = pluginThemes[themeName]

        if (isBoolean(config.darkMode) && isString(config.cssPath)) {
          const cssPath = path.join(plugin.fullPath, 'src', config.cssPath)
          if (!fs.existsSync(cssPath)) {
            throw new Error(`No file found on \`${config.cssPath}\` for theme "${themeName}"`)
          }

          valid[themeName] = { ...config, cssPath }
        }
        return valid
      }, {})

      if (!isEmpty(themes)) {
        await this.app.$store.dispatch('plugin/setThemes', {
          pluginId: plugin.config.id,
          themes,
          profileId
        })
      }
    }
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

  async loadUnprotectedIframeUrls (pluginObject) {
    if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getUnprotectedIframeUrls')) {
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

  validateComponent (plugin, component, name) {
    const requiredKeys = ['template']
    const allowedKeys = [
      'data',
      'methods',
      'computed',
      'components',
      ...this.hooks
    ]

    const missingKeys = []
    for (const key of requiredKeys) {
      if (!Object.prototype.hasOwnProperty.call(component, key)) {
        missingKeys.push(key)
      }
    }

    const componentError = (error, errorType) => {
      this.app.$logger.error(`Plugin '${plugin.config.id}' component '${name}' ${errorType}: ${error}`)
    }

    if (missingKeys.length) {
      componentError(missingKeys.join(', '), 'is missing')

      return false
    }

    const inlineErrors = []
    if (/v-html/i.test(component.template)) {
      inlineErrors.push('uses v-html')
    }
    if (/javascript:/i.test(component.template)) {
      inlineErrors.push('"javascript:"')
    }
    if (/<\s*webview/i.test(component.template)) {
      inlineErrors.push('uses webview tag')
    }
    if (/<\s*script/i.test(component.template)) {
      inlineErrors.push('uses script tag')
    } else if (/[^\w]+eval\(/i.test(component.template)) {
      inlineErrors.push('uses eval')
    }
    if (/<\s*iframe/i.test(component.template)) {
      inlineErrors.push('uses iframe tag')
    }
    if (/srcdoc/i.test(component.template)) {
      inlineErrors.push('uses srcdoc property')
    }
    const inlineEvents = []
    for (const event of PLUGINS.validation.events) {
      if ((new RegExp(`on${event}`, 'i')).test(component.template)) {
        inlineEvents.push(event)
      }
    }
    if (inlineEvents.length) {
      inlineErrors.push('events: ' + inlineEvents.join(', '))
    }

    if (inlineErrors.length) {
      componentError(inlineErrors.join('; '), 'has inline javascript')

      return false
    }

    const bannedKeys = []
    for (const key of Object.keys(component)) {
      if (![...requiredKeys, ...allowedKeys].includes(key)) {
        bannedKeys.push(key)
      }
    }

    if (bannedKeys.length) {
      componentError(bannedKeys.join(', '), 'has unpermitted keys')

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
    this.validatePlugin(pluginPath)

    let config = JSON.parse(fs.readFileSync(`${pluginPath}/package.json`))
    config = this.sanitizeConfig(config)

    if (!config.id) {
      throw new Error('Plugin ID not found')
    } else if (!/^[@/a-z-0-9-]+$/.test(config.id)) {
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
      walletApi: {
        icons: SandboxFontAwesome,
        route: {
          get: () => {
            return { ...this.app.$route, matched: [] }
          },
          goTo: routeName => {
            const route = this.getAllRoutes().find(route => routeName === route.name)
            if (route) {
              this.app.$router.push(route)
            }
          }
        }
      }
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

    if (config.permissions.includes('TIMERS')) {
      const timerArrays = {
        intervals: [],
        timeouts: [],
        timeoutWatchdog: {}
      }

      const timers = {
        clearInterval (id) {
          clearInterval(id)
          timerArrays.intervals = timerArrays.intervals.filter(interval => interval !== id)
        },

        clearTimeout (id) {
          clearTimeout(id)
          clearTimeout(timerArrays.timeoutWatchdog[id])
          delete timerArrays.timeoutWatchdog[id]
          timerArrays.timeouts = timerArrays.timeouts.filter(timeout => timeout !== id)
        },

        get intervals () {
          return timerArrays.intervals
        },

        get timeouts () {
          return timerArrays.timeouts
        },

        setInterval (method, interval, ...args) {
          const id = setInterval(function () {
            method(...args)
          }, interval)
          timerArrays.intervals.push(id)
          return id
        },

        setTimeout (method, interval, ...args) {
          const id = setTimeout(function () {
            method(...args)
          }, interval)
          timerArrays.timeouts.push(id)
          timerArrays.timeoutWatchdog[id] = setTimeout(() => timers.clearTimeout(id), interval)
          return id
        }
      }

      this.app.$router.beforeEach((_, __, next) => {
        for (const id of timerArrays.intervals) {
          clearInterval(id)
        }

        for (const id of timerArrays.timeouts) {
          clearTimeout(id)
          clearTimeout(timerArrays.timeoutWatchdog[id])
        }

        timerArrays.intervals = []
        timerArrays.timeouts = []
        timerArrays.timeoutWatchdog = {}
        next()
      })

      sandbox.walletApi.timers = timers
    }

    if (config.permissions.includes('MESSAGING')) {
      const messages = {
        events: [],

        clear () {
          for (const eventId in this.events) {
            window.removeEventListener('message', this.events[eventId])
          }

          this.events = []
        },

        on (action, eventCallback) {
          const eventTrigger = event => {
            if (event.data !== Object(event.data) || event.data.action !== action) {
              return
            }

            eventCallback(cloneDeep(event.data))
          }

          window.addEventListener('message', eventTrigger)
          this.events[action] = eventTrigger
        }
      }

      this.app.$router.beforeEach((_, __, next) => {
        messages.clear()
        next()
      })

      sandbox.walletApi.messages = messages
    }

    if (config.permissions.includes('STORAGE')) {
      sandbox.walletApi.storage = {
        get: (key) => {
          const options = this.app.$store.getters['plugin/pluginOptions'](
            config.id,
            this.app.$store.getters['session/profileId']
          )

          return options[key]
        },

        set: (key, value) => {
          this.app.$store.dispatch('plugin/setPluginOption', {
            profileId: this.app.$store.getters['session/profileId'],
            pluginId: config.id,
            key,
            value
          })
        },

        getOptions: () => {
          return this.app.$store.getters['plugin/pluginOptions'](
            config.id,
            this.app.$store.getters['session/profileId']
          )
        }
      }
    }

    sandbox.walletApi.components = WalletComponents(config.permissions)

    if (config.permissions.includes('HTTP')) {
      sandbox.walletApi.http = new PluginHttp(config.urls)
    }

    if (config.permissions.includes('WEBSOCKETS')) {
      sandbox.walletApi.websocket = new PluginWebsocket(config.urls, this.app.$router)
    }

    if (config.permissions.includes('PEER_CURRENT')) {
      sandbox.walletApi.peers = {
        current: {
          get: async (url, timeout = 3000) => {
            return (await this.app.$client.client.get(url, { timeout })).body
          },

          post: async (url, timeout = 3000) => {
            return (await this.app.$client.client.post(url, { timeout })).body
          }
        }
      }
    }

    if (config.permissions.includes('PROFILE_CURRENT')) {
      sandbox.walletApi.profiles = {
        getCurrent: () => {
          return this.app.$store.getters['profile/public']()
        }
      }
    }

    if (config.permissions.includes('PROFILE_ALL')) {
      if (!sandbox.walletApi.profiles) {
        sandbox.walletApi.profiles = {}
      }

      sandbox.walletApi.profiles.all = this.app.$store.getters['profile/public'](true)
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

  sanitizeConfig (config) {
    return {
      id: config.name,
      name: config.title,
      description: config.description,
      version: config.version,
      permissions: uniq(config.permissions).sort(),
      urls: config.urls || []
    }
  }
}

export default new PluginManager()
