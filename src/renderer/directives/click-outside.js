export default {
  bind (element, { modifiers, value }, vnode) {
    element.clickOutsideEvent = event => {
      const path = event.path || (event.composedPath ? event.composedPath() : undefined)

      if (path ? path.indexOf(element) < 0 : !element.contains(event.target)) {
        value.call(vnode.context, event)
      }

      if (modifiers.stop) {
        event.stopPropagation()
      }
    }

    const options = {
      capture: modifiers.capture || false
    }
    document.documentElement.addEventListener('click', element.clickOutsideEvent, options)
  },

  unbind (element, { modifiers }) {
    const options = {
      capture: modifiers.capture || false
    }
    document.documentElement.removeEventListener('click', element.clickOutsideEvent, options)
  }
}
