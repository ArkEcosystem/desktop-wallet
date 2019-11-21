import { getSafeContext } from './get-context'

export function compileTemplate (vm, template) {
  return vm.run(
    `const Vue = require('vue/dist/vue.common.js')
    const compiled = Vue.compile(${JSON.stringify(template)})
    const prepareContext = ${getSafeContext.toString()}
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
    'compile-template.js'
  )
}
