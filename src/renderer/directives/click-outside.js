export default {
  bind (element, binding, vnode) {
    element.clickOutsideEvent = event => {
      const path =
        event.path || (event.composedPath ? event.composedPath() : undefined)

      if (path ? path.indexOf(element) < 0 : !element.contains(event.target)) {
        return binding.value.call(vnode.context, event)
      }
    }

    document.documentElement.addEventListener(
      'click',
      element.clickOutsideEvent,
      false
    )
  },
  unbind (element) {
    document.documentElement.removeEventListener(
      'click',
      element.clickOutsideEvent,
      false
    )
  }
}
