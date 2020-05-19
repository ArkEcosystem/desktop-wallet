var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { getSafeContext } from './get-context';
import { hooks } from './hooks';
export function createSafeComponent(componentName, baseComponent, vue) {
    // Build Vue component
    var vmComponent = vue.extend(__assign(__assign({}, baseComponent), { name: componentName }));
    if (baseComponent.methods) {
        var methods = {};
        var _loop_1 = function (methodName) {
            methods[methodName] = function safeMethod() {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = baseComponent.methods[methodName]).call.apply(_a, __spreadArrays([getSafeContext(this, baseComponent)], args));
            };
        };
        for (var methodName in baseComponent.methods) {
            _loop_1(methodName);
        }
        vmComponent.options.methods = methods;
    }
    // Fix context of "data" method
    if (baseComponent.data) {
        vmComponent.options.data = function safeData() {
            return baseComponent.data.apply(getSafeContext(this, baseComponent));
        };
    }
    vmComponent.options.created = [function safeCreated() {
            if (this.$options.computed) {
                for (var _i = 0, _a = Object.keys(this.$options.computed); _i < _a.length; _i++) {
                    var computedName = _a[_i];
                    if (baseComponent.computed && baseComponent.computed[computedName]) {
                        this.$options.computed[computedName] = baseComponent.computed[computedName].bind(getSafeContext(this, baseComponent));
                        this._computedWatchers[computedName].getter = baseComponent.computed[computedName].bind(getSafeContext(this, baseComponent));
                        try {
                            this._computedWatchers[computedName].run();
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                    if (!baseComponent.computed || !baseComponent.computed[computedName]) {
                        delete this.$options.computed[computedName];
                        try {
                            this._computedWatchers[computedName].teardown();
                        }
                        catch (error) {
                            console.error(error);
                        }
                        delete this._computedWatchers[computedName];
                        for (var watcherId in this._watchers) {
                            if (this._watchers[watcherId].getter.name === computedName) {
                                try {
                                    this._watchers[watcherId].teardown();
                                }
                                catch (error) {
                                    console.error(error);
                                }
                                break;
                            }
                        }
                    }
                }
            }
            if (baseComponent.created) {
                return baseComponent.created.apply(getSafeContext(this, baseComponent));
            }
        }];
    // Fix context of hooks
    hooks
        .filter(function (hook) { return Object.prototype.hasOwnProperty.call(baseComponent, hook); })
        .filter(function (hook) { return hook !== 'created'; })
        .forEach(function (prop) {
        var componentMethod = baseComponent[prop];
        var hookMethod = function safeHook() {
            return componentMethod.apply(getSafeContext(this, baseComponent));
        };
        if (Array.isArray(vmComponent.options[prop])) {
            vmComponent.options[prop] = [hookMethod];
        }
        else {
            vmComponent.options[prop] = hookMethod;
        }
    });
    return vmComponent;
}
//# sourceMappingURL=create-component.js.map