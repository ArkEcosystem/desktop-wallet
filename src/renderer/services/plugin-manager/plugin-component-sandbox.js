import { PLUGINS } from '@config'
import path from 'path'

const hooks = [
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]

export function prepareContext (vueContext, component) {
  const context = vueContext._data || {}

  const keys = ['$nextTick', '$refs', '_c', '_v', '_s', '_e', '_m', '_l', '_u']
  for (let key of keys) {
    let vueContextItem = vueContext[key]

    if (key === '$refs' && vueContextItem) {
      key = 'refs'
      vueContextItem = {}
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
      vueContext.$nextTick(() => {
        for (const elKey in vueContext.$refs) {
          const element = vueContext.$refs[elKey]

          if (!element.tagName || element.tagName.toLowerCase() === 'iframe') {
            continue
          }

          for (const badGetter of badGetters) {
            element.__defineGetter__(badGetter, () => console.log('🚫'))
          }

          for (const badSetter of badSetters) {
            element.__defineSetter__(badSetter, () => console.log('🚫'))
          }

          vueContextItem[elKey] = element
        }
      })
    }

    context[key] = vueContextItem
  }

  for (const computedName of Object.keys(component.computed || {})) {
    context[computedName] = vueContext[computedName]
  }

  for (const methodName of Object.keys(component.methods || {})) {
    context[methodName] = function () {
      return component.methods[methodName].apply(prepareContext(vueContext, component))
    }
  }

  return context
}

export function defineContext (componentName, proxyComponent, baseComponent, vue) {
  for (const methodName of Object.keys(proxyComponent.methods || {})) {
    proxyComponent.methods[methodName] = baseComponent.methods[methodName]
  }

  // Build Vue component
  const vmComponent = vue.component(componentName, proxyComponent)

  // Fix context of "data" method
  if (baseComponent.data) {
    vmComponent.options.data = function () { return baseComponent.data.apply(prepareContext(this, baseComponent)) }
  }

  // Fix context of "computed" methods - also removes global computed methods
  for (const computedName of Object.keys(vmComponent.options.computed)) {
    vmComponent.options.computed[computedName] = function () {}
  }

  vmComponent.options.created = [function () {
    for (const computedName of Object.keys(this.$options.computed)) {
      if (baseComponent.computed && baseComponent.computed[computedName]) {
        this.$options.computed[computedName] = baseComponent.computed[computedName].bind(
          prepareContext(this)
        )
        this._computedWatchers[computedName].getter = baseComponent.computed[computedName].bind(
          prepareContext(this)
        )

        try {
          this._computedWatchers[computedName].run()
        } catch (error) {
          console.error(error)
        }
      }

      if (!baseComponent.computed || !baseComponent.computed[computedName]) {
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

    if (baseComponent.created) {
      return baseComponent.created.apply(prepareContext(this))
    }
  }]

  // Fix context of hooks
  hooks
    .filter(hook => Object.prototype.hasOwnProperty.call(baseComponent, hook))
    .filter(hook => hook !== 'created')
    .forEach(prop => {
      const componentMethod = baseComponent[prop]
      const hookMethod = function () { return componentMethod.apply(prepareContext(this, baseComponent)) }
      if (Array.isArray(vmComponent.options[prop])) {
        vmComponent.options[prop] = [hookMethod]
      } else {
        vmComponent.options[prop] = hookMethod
      }
    })

  return vmComponent
}

export class PluginComponentSandbox {
  constructor ({
    fullPath,
    name,
    path,
    plugin,
    source,
    vm,
    vue
  }) {
    this.fullPath = fullPath
    this.name = name
    this.path = path
    this.plugin = plugin
    this.source = source
    this.vm = vm
    this.vue = vue

    this.compiled = undefined

    this.__compileSource()
    this.validate()
  }

  get isFromFilesystem () {
    return Buffer.isBuffer(this.source)
  }

  copyWith ({ name, source }) {
    return new PluginComponentSandbox({
      source: source,
      name: name,
      fullPath: this.fullPath,
      path: this.path,
      plugin: this.plugin,
      rootPath: this.path,
      vm: this.vm,
      vue: this.vue
    })
  }

  render () {
    const renderedTemplate = this.vm.run(
      `const Vue = require('vue/dist/vue.common.js')
      const compiled = Vue.compile('${this.compiled.template}')
      const prepareContext = ${prepareContext.toString()}
      const component = {}
      if (compiled.staticRenderFns.length) {
        component.render = compiled.render
        component.staticRenderFns = compiled.staticRenderFns
      } else {
        component.render = function () {
          return compiled.render.apply(prepareContext(this, component), [ ...arguments ])
        }
      }
      module.exports = component`,
      path.join(this.plugin.rootPath, 'src/vm-component.js')
    )

    const renderedComponent = Object.assign(renderedTemplate, this.compiled)
    delete renderedComponent.template

    for (const childName of Object.keys(renderedComponent.components || {})) {
      const childSandbox = this.copyWith({ name: childName, source: renderedComponent.components[childName] })
      renderedComponent.components[childName] = childSandbox.render()
    }

    return defineContext(this.name, renderedComponent, this.compiled, this.vue)
  }

  validate () {
    const requiredKeys = ['template']
    const allowedKeys = [
      'data',
      'methods',
      'computed',
      'components',
      ...hooks
    ]

    const missingKeys = []
    for (const key of requiredKeys) {
      if (!Object.prototype.hasOwnProperty.call(this.compiled, key)) {
        missingKeys.push(key)
      }
    }

    const componentError = (error, errorType) => {
      this.app.$logger.error(`Plugin '${this.plugin.config.id}' component '${name}' ${errorType}: ${error}`)
    }

    if (missingKeys.length) {
      componentError(missingKeys.join(', '), 'is missing')

      return false
    }

    const inlineErrors = []
    if (/v-html/i.test(this.compiled.template)) {
      inlineErrors.push('uses v-html')
    }
    if (/javascript:/i.test(this.compiled.template)) {
      inlineErrors.push('"javascript:"')
    }
    if (/<\s*webview/i.test(this.compiled.template)) {
      inlineErrors.push('uses webview tag')
    }
    if (/<\s*script/i.test(this.compiled.template)) {
      inlineErrors.push('uses script tag')
    } else if (/[^\w]+eval\(/i.test(this.compiled.template)) {
      inlineErrors.push('uses eval')
    }
    if (/<\s*iframe/i.test(this.compiled.template)) {
      inlineErrors.push('uses iframe tag')
    }
    if (/srcdoc/i.test(this.compiled.template)) {
      inlineErrors.push('uses srcdoc property')
    }
    const inlineEvents = []
    for (const event of PLUGINS.validation.events) {
      if ((new RegExp(`on${event}`, 'i')).test(this.compiled.template)) {
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
    for (const key of Object.keys(this.compiled)) {
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

  __compileSource () {
    if (this.isFromFilesystem) {
      this.compiled = this.vm.run(
        this.source,
        this.path
      )
    } else {
      this.compiled = this.source
    }
  }
}
