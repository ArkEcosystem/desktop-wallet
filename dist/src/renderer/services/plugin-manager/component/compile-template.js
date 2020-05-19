import { getSafeContext } from './get-context';
export function compileTemplate(vm, template) {
    return vm.run("const Vue = require('vue/dist/vue.common.js')\n    const compiled = Vue.compile(" + JSON.stringify(template) + ")\n    const prepareContext = " + getSafeContext.toString() + "\n    const component = {}\n    if (compiled.staticRenderFns.length) {\n      component.render = compiled.render\n      component.staticRenderFns = compiled.staticRenderFns\n    } else {\n      component.render = function () {\n        return compiled.render.apply(prepareContext(this, component), [ ...arguments ])\n      }\n    }\n    module.exports = component", 'compile-template.js');
}
//# sourceMappingURL=compile-template.js.map