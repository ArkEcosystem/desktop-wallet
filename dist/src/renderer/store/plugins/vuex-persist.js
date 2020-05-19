// Based on https://github.com/championswimmer/vuex-persist
import { merge as lodashMerge } from 'lodash';
var merge = function (into, from) { return lodashMerge({}, into, from); };
var SimplePromiseQueue = /** @class */ (function () {
    function SimplePromiseQueue() {
        this._queue = [];
        this._flushing = false;
    }
    SimplePromiseQueue.prototype.enqueue = function (promise) {
        this._queue.push(promise);
        if (!this._flushing) {
            return this.flushQueue();
        }
        return Promise.resolve();
    };
    SimplePromiseQueue.prototype.flushQueue = function () {
        var _this = this;
        this._flushing = true;
        var chain = function () {
            var nextTask = _this._queue.shift();
            if (nextTask) {
                return nextTask.then(chain);
            }
            _this._flushing = false;
        };
        return Promise.resolve(chain());
    };
    return SimplePromiseQueue;
}());
var VuexPersistence = /** @class */ (function () {
    function VuexPersistence(options) {
        var _this = this;
        this._mutex = new SimplePromiseQueue();
        this.subscribed = false;
        if (typeof options === 'undefined') {
            options = {};
        }
        this.key = options.key;
        this.storage = options.storage;
        this.reducer = options.reducer;
        this.RESTORE_MUTATION = function RESTORE_MUTATION(state, savedState) {
            var mergedState = merge(state, savedState || {});
            for (var _i = 0, _a = Object.keys(mergedState); _i < _a.length; _i++) {
                var propertyName = _a[_i];
                this._vm.$set(state, propertyName, mergedState[propertyName]);
            }
        };
        this.restoreState = function (key, storage) {
            return storage
                .getItem(key)
                .then(function (value) {
                return typeof value === 'string' ? JSON.parse(value || '{}') : value || {};
            });
        };
        this.saveState = function (key, state, storage) {
            return storage.setItem(key, merge({}, state || {}));
        };
        this.plugin = function (store) {
            store.restored = _this.restoreState(_this.key, _this.storage).then(function (savedState) {
                store.commit('RESTORE_MUTATION', savedState);
                store.subscribe(function (mutation, state) {
                    return _this._mutex.enqueue(_this.saveState(_this.key, _this.reducer(state), _this.storage));
                });
                _this.subscribed = true;
            });
        };
    }
    return VuexPersistence;
}());
export { VuexPersistence };
//# sourceMappingURL=vuex-persist.js.map