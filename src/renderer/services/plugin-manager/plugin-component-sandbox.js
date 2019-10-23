import { createSafeComponent } from './component/create-component'
import { validateComponent } from './component/validate'
import { compileTemplate } from './component/compile-template'

export class PluginComponentSandbox {
  constructor ({
    fullPath,
    name,
    plugin,
    source,
    pluginVM,
    componentVM,
    vue,
    logger
  }) {
    this.fullPath = fullPath
    this.name = name
    this.plugin = plugin
    this.source = source
    this.pluginVM = pluginVM
    this.componentVM = componentVM
    this.vue = vue
    this.logger = logger

    this.compiled = undefined

    this.__compileSource()
  }

  /**
   * Child components have already been loaded
   * by VM and their code is available.
   */
  get isFromFilesystem () {
    return Buffer.isBuffer(this.source)
  }

  cloneSandbox ({ name, source }) {
    return new PluginComponentSandbox({
      source: source,
      name: name,
      fullPath: this.fullPath,
      plugin: this.plugin,
      pluginVM: this.pluginVM,
      componentVM: this.componentVM,
      vue: this.vue,
      logger: this.logger
    })
  }

  /**
   * The raw component is validated, parsed and generates
   * a secure component to be mounted by Vue.
   */
  render () {
    if (!validateComponent({ ...this, component: this.compiled })) {
      return
    }

    const compiledTemplate = compileTemplate(this.pluginVM, this.compiled.template)

    const lazyComponent = Object.assign(compiledTemplate, this.compiled)
    delete lazyComponent.template

    const components = this.plugin.globalComponents

    for (const childName of Object.keys(this.compiled.components || {})) {
      const childSandbox = this.cloneSandbox({ name: childName, source: this.compiled.components[childName] })
      components[childName] = childSandbox.render()
    }

    lazyComponent.components = components

    return createSafeComponent(this.name, lazyComponent, this.vue)
  }

  __compileSource () {
    if (this.isFromFilesystem) {
      this.compiled = this.componentVM.run(
        this.source,
        this.fullPath
      )
    } else {
      this.compiled = this.source
    }
  }
}
