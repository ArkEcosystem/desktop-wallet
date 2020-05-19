var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var PluginEvents = /** @class */ (function () {
    function PluginEvents(eventBus) {
        this.events = {};
        this.eventBus = eventBus;
    }
    PluginEvents.prototype.on = function (criteria, action) {
        if (!this.events[criteria]) {
            this.events[criteria] = [];
        }
        if (typeof criteria.test === 'function') {
            action = this.__parseAction(criteria, action);
            this.eventBus.onAny(action);
        }
        else {
            this.eventBus.on(criteria, action);
        }
        this.events[criteria].push(action);
    };
    PluginEvents.prototype.off = function (criteria, action, forceRegex) {
        if (forceRegex === void 0) { forceRegex = false; }
        if (typeof criteria.test === 'function') {
            action = this.__parseAction(criteria, action);
        }
        var index = -1;
        for (var actionIndex in this.events[criteria]) {
            if (this.events[criteria][actionIndex].toString() === action.toString()) {
                index = actionIndex;
                break;
            }
        }
        if (index > -1) {
            action = this.events[criteria][index];
            if (forceRegex || typeof criteria.test === 'function') {
                this.eventBus.offAny(action);
            }
            else {
                this.eventBus.off(criteria, action);
            }
            this.events[criteria] = __spreadArrays(this.events[criteria].slice(0, index), this.events[criteria].slice(index + 1));
        }
    };
    PluginEvents.prototype.destroy = function () {
        for (var _i = 0, _a = Object.keys(this.events); _i < _a.length; _i++) {
            var criteria = _a[_i];
            var isRegex = false;
            if (/^\/.+\/\w?$/.test(criteria)) {
                isRegex = true;
            }
            for (var _b = 0, _c = Object.values(this.events[criteria]); _b < _c.length; _b++) {
                var action = _c[_b];
                this.off(criteria, action, isRegex);
            }
        }
    };
    PluginEvents.prototype.__parseAction = function (criteria, action) {
        return function (eventName, data) {
            if (criteria && criteria.test(eventName)) {
                action(data);
            }
        };
    };
    return PluginEvents;
}());
export function create(walletApi, app) {
    return function () {
        walletApi.eventBus = new PluginEvents(app.$eventBus);
    };
}
export function destroy(walletApi) {
    walletApi.eventBus.destroy();
}
//# sourceMappingURL=events-sandbox.js.map