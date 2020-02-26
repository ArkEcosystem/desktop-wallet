import { getSafeContext } from './get-context'
import { hooks } from './hooks'

export function createSafeComponent (componentName, baseComponent, vue) {
  // Build Vue component
  const vmComponent = vue.extend({
    ...baseComponent,
    name: componentName
  })

  if (baseComponent.methods) {
    const methods = {}
    for (const methodName in baseComponent.methods) {
      methods[methodName] = function safeMethod (...args) {
        return baseComponent.methods[methodName].call(getSafeContext(this, baseComponent), ...args)
      }
    }
    vmComponent.options.methods = methods
  }

  // Fix context of "data" method
  if (baseComponent.data) {
    vmComponent.options.data = function safeData () {
      return baseComponent.data.apply(getSafeContext(this, baseComponent))
    }
  }

  vmComponent.options.created = [function safeCreated () {
    if (this.$options.computed) {
      for (const computedName of Object.keys(this.$options.computed)) {
        if (baseComponent.computed && baseComponent.computed[computedName]) {
          this.$options.computed[computedName] = baseComponent.computed[computedName].bind(
            getSafeContext(this, baseComponent)
          )
          this._computedWatchers[computedName].getter = baseComponent.computed[computedName].bind(
            getSafeContext(this, baseComponent)
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
      return baseComponent.created.apply(getSafeContext(this, baseComponent))
    }
  }]

  // Fix context of hooks
  hooks
    .filter(hook => Object.prototype.hasOwnProperty.call(baseComponent, hook))
    .filter(hook => hook !== 'created')
    .forEach(prop => {
      const componentMethod = baseComponent[prop]
      const hookMethod = function safeHook () {
        return componentMethod.apply(getSafeContext(this, baseComponent))
      }

      if (Array.isArray(vmComponent.options[prop])) {
        vmComponent.options[prop] = [hookMethod]
      } else {
        vmComponent.options[prop] = hookMethod
      }
    })

  return vmComponent
}
