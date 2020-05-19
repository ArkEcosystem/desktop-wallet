export default {
    bind: function (element, _a, vnode) {
        var modifiers = _a.modifiers, value = _a.value;
        element.clickOutsideEvent = function (event) {
            var path = event.path || (event.composedPath ? event.composedPath() : undefined);
            if (path ? path.indexOf(element) < 0 : !element.contains(event.target)) {
                value.call(vnode.context, event);
            }
            if (modifiers.stop) {
                event.stopPropagation();
            }
        };
        var options = {
            capture: modifiers.capture || false
        };
        document.documentElement.addEventListener('click', element.clickOutsideEvent, options);
    },
    unbind: function (element, _a) {
        var modifiers = _a.modifiers;
        var options = {
            capture: modifiers.capture || false
        };
        document.documentElement.removeEventListener('click', element.clickOutsideEvent, options);
    }
};
//# sourceMappingURL=click-outside.js.map