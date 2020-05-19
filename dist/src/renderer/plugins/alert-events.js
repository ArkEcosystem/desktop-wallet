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
import eventBus from './event-bus';
import { transform, assignIn } from 'lodash';
var triggerAlert = function (alert) { return eventBus.emit('alert', alert); };
var types = [
    'error',
    'success',
    'info',
    'warn'
];
var inject = transform(types, function (result, type) {
    result["$" + type] = function (message, duration) {
        triggerAlert({ message: message, type: type, duration: duration });
    };
}, {});
export default __assign({ install: function (Vue) {
        assignIn(Vue.prototype, inject);
    } }, inject);
//# sourceMappingURL=alert-events.js.map