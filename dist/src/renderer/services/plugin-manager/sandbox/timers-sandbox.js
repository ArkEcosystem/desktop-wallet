export function create(walletApi, app) {
    return function () {
        var timerArrays = {
            intervals: [],
            timeouts: [],
            timeoutWatchdog: {}
        };
        var timers = {
            clearInterval: function (id) {
                clearInterval(id);
                timerArrays.intervals = timerArrays.intervals.filter(function (interval) { return interval !== id; });
            },
            clearTimeout: function (id) {
                clearTimeout(id);
                clearTimeout(timerArrays.timeoutWatchdog[id]);
                delete timerArrays.timeoutWatchdog[id];
                timerArrays.timeouts = timerArrays.timeouts.filter(function (timeout) { return timeout !== id; });
            },
            get intervals() {
                return timerArrays.intervals;
            },
            get timeouts() {
                return timerArrays.timeouts;
            },
            setInterval: function (method, interval) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                var id = setInterval(function () {
                    method.apply(void 0, args);
                }, interval);
                timerArrays.intervals.push(id);
                return id;
            },
            setTimeout: function (method, interval) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                var id = setTimeout(function () {
                    method.apply(void 0, args);
                }, interval);
                timerArrays.timeouts.push(id);
                timerArrays.timeoutWatchdog[id] = setTimeout(function () { return timers.clearTimeout(id); }, interval);
                return id;
            }
        };
        app.$router.beforeEach(function (_, __, next) {
            for (var _i = 0, _a = timerArrays.intervals; _i < _a.length; _i++) {
                var id = _a[_i];
                clearInterval(id);
            }
            for (var _b = 0, _c = timerArrays.timeouts; _b < _c.length; _b++) {
                var id = _c[_b];
                clearTimeout(id);
                clearTimeout(timerArrays.timeoutWatchdog[id]);
            }
            timerArrays.intervals = [];
            timerArrays.timeouts = [];
            timerArrays.timeoutWatchdog = {};
            next();
        });
        walletApi.timers = timers;
    };
}
//# sourceMappingURL=timers-sandbox.js.map