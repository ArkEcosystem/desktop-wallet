import path from 'path'
import { prepareContext } from './component/prepare-context'
import { defineContext } from './component/define-context'
import { validateComponent } from './component/validate'

export class PluginComponentSandbox {
  constructor ({
    fullPath,
    name,
    path,
    plugin,
    source,
    vm,
    vue,
    logger
  }) {
    this.fullPath = fullPath
    this.name = name
    this.path = path
    this.plugin = plugin
    this.source = source
    this.vm = vm
    this.vue = vue
    this.logger = logger

    this.compiled = undefined

    this.__compileSource()
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
      vue: this.vue,
      logger: this.logger
    })
  }

  render () {
    if (!validateComponent(this.plugin, this.compiled, this.logger)) {
      return
    }

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
