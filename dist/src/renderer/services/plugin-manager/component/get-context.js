import { isElement } from 'lodash';
export function getSafeContext(vueContext, component) {
    var context = vueContext._data || {};
    var keys = ['$nextTick', '_c', '_v', '_s', '_e', '_m', '_l', '_u'];
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        context[key] = vueContext[key];
    }
    if (vueContext.$refs) {
        var badGetters_1 = [
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
        ];
        var badSetters_1 = [
            'href',
            'innerHTML',
            'outerHTML'
        ];
        var badMethods_1 = [
            'appendChild',
            'cloneNode',
            'getRootNode',
            'insertBefore',
            'normalize',
            'querySelector',
            'querySelectorAll',
            'removeChild',
            'replaceChild'
        ];
        var blockElementProperties_1 = function (element) {
            if (!isElement(element) || !element.tagName || element.tagName.toLowerCase() === 'iframe') {
                return element;
            }
            var _loop_2 = function (badSetter) {
                try {
                    element.__defineSetter__(badSetter, function () { return console.error(badSetter + " \uD83D\uDEAB"); });
                }
                catch (_a) {
                    throw new Error("Failed to apply " + badSetter + " setter to the element. Try wrapping it with '$nextTick'.");
                }
            };
            for (var _i = 0, badSetters_2 = badSetters_1; _i < badSetters_2.length; _i++) {
                var badSetter = badSetters_2[_i];
                _loop_2(badSetter);
            }
            var _loop_3 = function (badGetter) {
                try {
                    element.__defineGetter__(badGetter, function () { return console.error(badGetter + " \uD83D\uDEAB"); });
                }
                catch (_a) {
                    throw new Error("Failed to apply " + badGetter + " getter to the element. Try wrapping it with '$nextTick'.");
                }
            };
            for (var _a = 0, badGetters_2 = badGetters_1; _a < badGetters_2.length; _a++) {
                var badGetter = badGetters_2[_a];
                _loop_3(badGetter);
            }
            var _loop_4 = function (badMethod) {
                try {
                    element[badMethod] = function () { return console.error(badMethod + " \uD83D\uDEAB"); };
                }
                catch (_a) {
                    throw new Error("Failed to apply " + badMethod + " method to the element. Try wrapping it with '$nextTick'.");
                }
            };
            for (var _b = 0, badMethods_2 = badMethods_1; _b < badMethods_2.length; _b++) {
                var badMethod = badMethods_2[_b];
                _loop_4(badMethod);
            }
            return element;
        };
        context.refs = new Proxy(vueContext.$refs, {
            get: function (target, prop) {
                if (prop in target) {
                    return blockElementProperties_1(target[prop]);
                }
            }
        });
    }
    if (component.computed) {
        for (var _a = 0, _b = Object.keys(component.computed || {}); _a < _b.length; _a++) {
            var computedName = _b[_a];
            context[computedName] = vueContext[computedName];
        }
    }
    if (component.methods) {
        var _loop_1 = function (methodName) {
            context[methodName] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return component.methods[methodName].apply(getSafeContext(vueContext, component), args);
            };
        };
        for (var _c = 0, _d = Object.keys(component.methods || {}); _c < _d.length; _c++) {
            var methodName = _d[_c];
            _loop_1(methodName);
        }
    }
    if (vueContext._props) {
        for (var propName in vueContext._props) {
            context[propName] = vueContext._props[propName];
        }
    }
    return context;
}
//# sourceMappingURL=get-context.js.map