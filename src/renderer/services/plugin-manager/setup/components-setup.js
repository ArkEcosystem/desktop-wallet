
import fs from 'fs'
import path from 'path'
import { PluginComponentSandbox } from '../plugin-component-sandbox'

export function createComponentsSetup (plugin, pluginObject, sandbox, vue) {
  return () => {
    if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getComponentPaths')) {
      return
    }

    const pluginComponents = pluginObject.getComponentPaths()
    const components = {}

    for (const componentName of Object.keys(pluginComponents)) {
      let componentPath = pluginComponents[componentName]

      if (componentPath.indexOf('./') === 0) {
        componentPath = `${componentPath.substring(2)}`
      }

      const fullPath = path.join(plugin.fullPath, 'src', pluginComponents[componentName])
      const source = fs.readFileSync(fullPath)

      const component = new PluginComponentSandbox({
        source,
        plugin,
        vue,
        fullPath,
        path: componentPath,
        name: componentName,
        vm: sandbox.getVM(),
        logger: sandbox.app.$logger
      })

      const vmComponent = component.render()

      if (vmComponent) {
        components[componentName] = component.render()
      }
    }

    plugin.components = components
  }
}
