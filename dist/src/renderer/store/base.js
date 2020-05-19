var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { merge, unionBy } from 'lodash';
var includes = function (objects, find) { return objects.map(function (a) { return a.id; }).includes(find.id); };
/**
 * This module wraps db operations with actions and automatically performs the
 * mutations.
 */
var BaseModule = /** @class */ (function () {
    /**
     * @param {Object} config
     */
    function BaseModule(modeler, config) {
        if (config === void 0) { config = {}; }
        var defaultConfig = {
            namespaced: true,
            state: {
                all: []
            },
            getters: {
                all: function (state) { return state.all; },
                byId: function (state) { return function (id) { return state.all.find(function (model) { return model.id === id; }); }; }
            },
            mutations: {
                CREATE: function (state, model) {
                    if (includes(state.all, model)) {
                        throw new Error("Cannot create `" + model.id + "`. It already exists on the state");
                    }
                    state.all.push(model);
                },
                STORE: function (state, model) {
                    state.all = unionBy(__spreadArrays([model], state.all), 'id');
                },
                UPDATE: function (state, model) {
                    if (!includes(state.all, model)) {
                        throw new Error("Cannot update `" + model.id + "`. It does not exist on the state");
                    }
                    state.all = unionBy(__spreadArrays([model], state.all), 'id');
                },
                DELETE: function (state, id) {
                    var index = state.all.findIndex(function (item) { return item.id === id; });
                    if (index === -1) {
                        throw new Error("Cannot delete `" + id + "`. It does not exist on the state");
                    }
                    state.all.splice(index, 1);
                }
            },
            actions: {
                create: function (_a, model) {
                    var commit = _a.commit;
                    var data = modeler.deserialize(model);
                    commit('CREATE', data);
                    return data;
                },
                store: function (_a, model) {
                    var commit = _a.commit;
                    commit('STORE', model);
                },
                update: function (_a, model) {
                    var commit = _a.commit;
                    var data = modeler.deserialize(model);
                    commit('UPDATE', data);
                    return data;
                },
                delete: function (_a, _b) {
                    var commit = _a.commit;
                    var id = _b.id;
                    commit('DELETE', id);
                }
            }
        };
        return merge({}, defaultConfig, config);
    }
    return BaseModule;
}());
export default BaseModule;
//# sourceMappingURL=base.js.map