import { hooks } from './hooks'
import { prepareContext } from './prepare-context'

export function defineContext (componentName, baseComponent, vue) {
  // Build Vue component
  const vmComponent = vue.extend({
    ...baseComponent,
    name: componentName
  })
  // Fix context of "data" method
  if (baseComponent.data) {
    vmComponent.options.data = function () { return baseComponent.data.apply(prepareContext(this, baseComponent)) }
  }

  // Fix context of "computed" methods - also removes global computed methods
  if (vmComponent.options.computed) {
    for (const computedName of Object.keys(vmComponent.options.computed)) {
      vmComponent.options.computed[computedName] = function () {}
    }
  }

  vmComponent.options.created = [function () {
    if (this.$options.computed) {
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
    }

    if (baseComponent.created) {
      return baseComponent.created.apply(prepareContext(this, baseComponent))
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
