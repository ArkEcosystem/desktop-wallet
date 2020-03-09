import { isElement } from 'lodash'

export function getSafeContext (vueContext, component) {
  const context = vueContext._data || {}

  const keys = ['$nextTick', '_c', '_v', '_s', '_e', '_m', '_l', '_u']

  for (const key of keys) {
    context[key] = vueContext[key]
  }

  if (vueContext.$refs) {
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
      '__vue__',
      '$root'
    ]

    const badSetters = [
      'href',
      'innerHTML',
      'outerHTML'
    ]

    const badMethods = [
      'appendChild',
      'cloneNode',
      'getRootNode',
      'insertBefore',
      'normalize',
      'querySelector',
      'querySelectorAll',
      'removeChild',
      'replaceChild'
    ]

    const blockElementProperties = (element) => {
      if (!isElement(element) || !element.tagName || element.tagName.toLowerCase() === 'iframe') {
        return element
      }

      for (const badSetter of badSetters) {
        try {
          element.__defineSetter__(badSetter, () => console.error(`${badSetter} 🚫`))
        } catch {
          throw new Error(`Failed to apply ${badSetter} setter to the element. Try wrapping it with '$nextTick'.`)
        }
      }

      for (const badGetter of badGetters) {
        try {
          element.__defineGetter__(badGetter, () => console.error(`${badGetter} 🚫`))
        } catch {
          throw new Error(`Failed to apply ${badGetter} getter to the element. Try wrapping it with '$nextTick'.`)
        }
      }

      for (const badMethod of badMethods) {
        try {
          element[badMethod] = () => console.error(`${badMethod} 🚫`)
        } catch {
          throw new Error(`Failed to apply ${badMethod} method to the element. Try wrapping it with '$nextTick'.`)
        }
      }

      return element
    }

    context.refs = new Proxy(vueContext.$refs, {
      get (target, prop) {
        if (prop in target) {
          return blockElementProperties(target[prop])
        }
      }
    })
  }

  if (component.computed) {
    for (const computedName of Object.keys(component.computed || {})) {
      context[computedName] = vueContext[computedName]
    }
  }

  if (component.methods) {
    for (const methodName of Object.keys(component.methods || {})) {
      context[methodName] = function (...args) {
        return component.methods[methodName].apply(getSafeContext(vueContext, component), args)
      }
    }
  }

  if (vueContext._props) {
    for (const propName in vueContext._props) {
      context[propName] = vueContext._props[propName]
    }
  }

  return context
}
