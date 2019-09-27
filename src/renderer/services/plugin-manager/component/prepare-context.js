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
