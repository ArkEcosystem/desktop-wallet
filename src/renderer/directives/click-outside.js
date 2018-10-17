export default {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (ev) {
      var path = ev.path || (ev.composedPath ? ev.composedPath() : undefined)
      if ((path ? path.indexOf(el) < 0 : !el.contains(ev.target))) {
        return binding.value.call(vnode.context, ev)
      }
    }

    document.documentElement.addEventListener('click', el.clickOutsideEvent, false)
  },
  unbind: function (el) {
    document.documentElement.removeEventListener('click', el.clickOutsideEvent, false)
  }
}
