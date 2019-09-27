import path from 'path'
import { PLUGINS } from '@config'
import { prepareContext } from './component/prepare-context'
import { defineContext } from './component/define-context'
import { hooks } from './component/hooks'

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
      const compiled = Vue.compile(${JSON.stringify(this.compiled.template)})
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
