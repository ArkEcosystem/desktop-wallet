import fs from 'fs'
import path from 'path'
import { PluginComponentSandbox } from '../plugin-component-sandbox'

export function create (plugin, pluginObject, sandbox, vue) {
  return () => {
    if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getComponentPaths')) {
      return
    }

    const pluginComponents = pluginObject.getComponentPaths()
    const components = {}

    for (const componentName of Object.keys(pluginComponents)) {
      const fullPath = path.join(plugin.fullPath, 'src', pluginComponents[componentName])
      const source = fs.readFileSync(fullPath)

      if (source) {
        const component = new PluginComponentSandbox({
          source,
          plugin,
          vue,
          fullPath,
          name: componentName,
          pluginVM: sandbox.getPluginVM(),
          componentVM: sandbox.getComponentVM(),
          logger: sandbox.app.$logger
        })

        const vmComponent = component.render()

        if (vmComponent) {
          components[componentName] = vmComponent
        }
      }
    }

    plugin.components = components
  }
}
