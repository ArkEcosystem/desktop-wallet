var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { hooks } from './hooks';
import { PLUGINS } from '@config';
export function validateComponent(_a) {
    var plugin = _a.plugin, component = _a.component, name = _a.name, logger = _a.logger;
    var requiredKeys = ['template'];
    var allowedKeys = __spreadArrays([
        'data',
        'methods',
        'watch',
        'computed',
        'components',
        'props'
    ], hooks);
    var missingKeys = [];
    for (var _i = 0, requiredKeys_1 = requiredKeys; _i < requiredKeys_1.length; _i++) {
        var key = requiredKeys_1[_i];
        if (!Object.prototype.hasOwnProperty.call(component, key)) {
            missingKeys.push(key);
        }
    }
    var componentError = function (error, errorType) {
        if (logger) {
            logger.error("Plugin '" + plugin.config.id + "' component '" + name + "' " + errorType + ": " + error);
        }
    };
    if (missingKeys.length) {
        componentError(missingKeys.join(', '), 'is missing');
        return false;
    }
    var inlineErrors = [];
    if (/v-html/i.test(component.template)) {
        inlineErrors.push('uses v-html');
    }
    if (/javascript:/i.test(component.template)) {
        inlineErrors.push('"javascript:"');
    }
    if (/<\s*webview/i.test(component.template)) {
        inlineErrors.push('uses webview tag');
    }
    if (/<\s*script/i.test(component.template)) {
        inlineErrors.push('uses script tag');
    }
    else if (/[^\w]+eval\(/i.test(component.template)) {
        inlineErrors.push('uses eval');
    }
    if (/<\s*iframe/i.test(component.template)) {
        inlineErrors.push('uses iframe tag');
    }
    if (/srcdoc/i.test(component.template)) {
        inlineErrors.push('uses srcdoc property');
    }
    var inlineEvents = [];
    for (var _b = 0, _c = PLUGINS.validation.events; _b < _c.length; _b++) {
        var event_1 = _c[_b];
        if ((new RegExp("(^|\\s)+on" + event_1, 'i')).test(component.template)) {
            inlineEvents.push(event_1);
        }
    }
    if (inlineEvents.length) {
        inlineErrors.push('events: ' + inlineEvents.join(', '));
    }
    if (inlineErrors.length) {
        componentError(inlineErrors.join('; '), 'has inline javascript');
        return false;
    }
    var bannedKeys = [];
    for (var _d = 0, _e = Object.keys(component); _d < _e.length; _d++) {
        var key = _e[_d];
        if (!__spreadArrays(requiredKeys, allowedKeys).includes(key)) {
            bannedKeys.push(key);
        }
    }
    if (bannedKeys.length) {
        componentError(bannedKeys.join(', '), 'has unpermitted keys');
        return false;
    }
    return true;
}
//# sourceMappingURL=validate.js.map