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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { pullAll } from 'lodash';
import { flatten } from '@/utils';
import { announcements, fees, ledger, market, peer, wallets } from './synchronizer/';
/**
 * This class adds the possibility to define actions (not to confuse with Vuex actions)
 * that could be dispatched using 2 modes: `default` and `focus`.
 *
 * Each mode has an interval configuration that establishes the delay until the
 * next update:
 *  - `focus` should be used on sections that display that kind of data to users
 *  - `default` should be used to check if new data is available
 *
 * There is also a way to pause and unpause the synchronization that is useful
 * for not executing actions when the users do not need fresh data.
 */
var Synchronizer = /** @class */ (function () {
    /**
     * @param {Object} config
     * @param {Vue} config.scope - Vue instance that would be synchronized
     */
    function Synchronizer(_a) {
        var scope = _a.scope;
        this.scope = scope;
        this.actions = {};
        this.focused = [];
        this.paused = [];
    }
    Object.defineProperty(Synchronizer.prototype, "intervals", {
        get: function () {
            // ARK block production time
            var block = 8000;
            var intervals = {
                longest: block * 300,
                longer: block * 100,
                medium: block * 25,
                shorter: block * 10,
                shortest: block * 3,
                block: block,
                // Number of milliseconds to wait to evaluate which actions should be run
                loop: 2000
            };
            return intervals;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Synchronizer.prototype, "config", {
        get: function () {
            var _a = this.intervals, loop = _a.loop, shortest = _a.shortest, shorter = _a.shorter, medium = _a.medium, longer = _a.longer, longest = _a.longest;
            var config = {
                announcements: {
                    default: { interval: longest, delay: loop * 6 },
                    focus: { interval: medium }
                },
                delegates: {
                    default: { interval: longer, delay: loop * 3 },
                    focus: { interval: longer }
                },
                fees: {
                    default: { interval: null },
                    focus: { interval: shorter }
                },
                ledgerWallets: {
                    default: { interval: shorter },
                    focus: { interval: shortest }
                },
                market: {
                    default: { interval: medium },
                    focus: { interval: shorter }
                },
                peer: {
                    default: { interval: longer },
                    focus: { interval: shorter }
                },
                wallets: {
                    default: { interval: shorter },
                    focus: { interval: shortest }
                }
            };
            config.contacts = config.wallets;
            return config;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Synchronizer.prototype, "$client", {
        get: function () {
            return this.scope.$client;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Synchronizer.prototype, "$store", {
        get: function () {
            return this.scope.$store;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Define an action that would be called later periodically
     * @param {String} actionId
     * @param {Object} config
     * @param {Function} actionFn
     */
    Synchronizer.prototype.define = function (actionId, config, actionFn) {
        if (typeof actionFn !== 'function') {
            throw new Error('[$synchronizer] action is not a function');
        }
        ;
        ['default', 'focus'].forEach(function (mode) {
            var interval = config[mode].interval;
            if (!interval && interval !== null) {
                throw new Error("[$synchronizer] `interval` for `" + mode + "` mode should be a Number bigger than 0 (or `null` to ignore it)");
            }
        });
        this.actions[actionId] = __assign({ calledAt: 0, isCalling: false, fn: actionFn }, config);
    };
    /**
     * Focus on these actions: instead of refreshing their data on the normal pace,
     * change to the `focus` frequency.
     *
     * Focusing on 1 or several actions, unfocused the rest
     * @params {(...String|Array)} actions - ID of the actions to focus on
     */
    Synchronizer.prototype.focus = function () {
        var actions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actions[_i] = arguments[_i];
        }
        this.focused = flatten(actions);
        this.unpause(this.focused);
    };
    /**
     * Add 1 or more actions to additionally focus
     * @params {(...String|Array)} actions - ID of the actions to focus on
     */
    Synchronizer.prototype.appendFocus = function () {
        var actions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actions[_i] = arguments[_i];
        }
        this.focused = flatten([actions, this.focused]);
        this.unpause(actions);
    };
    /**
     * Remove action from focus
     * @params {(...String|Array)} actions - ID of the actions to focus on
     */
    Synchronizer.prototype.removeFocus = function () {
        var actions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actions[_i] = arguments[_i];
        }
        pullAll(this.focused, flatten(actions));
    };
    /**
     * Pause these actions. They would not be dispatched until they are unpaused
     * or focused
     * @params {(...String|Array)} actions - ID of the actions to pause
     */
    Synchronizer.prototype.pause = function () {
        var actions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actions[_i] = arguments[_i];
        }
        this.paused = flatten(actions);
    };
    /**
     * Enable these paused actions again
     * @params {(...String|Array)} actions - ID of the actions to unpause
     */
    Synchronizer.prototype.unpause = function () {
        var actions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actions[_i] = arguments[_i];
        }
        pullAll(this.paused, flatten(actions));
    };
    /**
     * Trigger these actions 1 time.
     * As a consequence the interval of those actions is updated.
     * @params {(...String|Array)} actions - ID of the actions to unpause
     */
    Synchronizer.prototype.trigger = function () {
        var _this = this;
        var actions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actions[_i] = arguments[_i];
        }
        flatten(actions).forEach(function (actionId) { return _this.call(actionId); });
    };
    /**
     * Invoke the action and update the last time it has been called, when
     * it has finished its sync or async execution
     * @param {String} actionId
     */
    Synchronizer.prototype.call = function (actionId) {
        return __awaiter(this, void 0, void 0, function () {
            var action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = this.actions[actionId];
                        if (!action) {
                            return [2 /*return*/];
                        }
                        action.isCalling = true;
                        return [4 /*yield*/, action.fn()];
                    case 1:
                        _a.sent();
                        action.calledAt = (new Date()).getTime();
                        action.isCalling = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
     * Starts to dispatch the actions periodically
     */
    Synchronizer.prototype.ready = function () {
        var _this = this;
        /**
         * Run all the actions
         */
        var run = function (options) {
            if (options === void 0) { options = {}; }
            Object.keys(_this.actions).forEach(function (actionId) {
                if (!_this.paused.includes(actionId)) {
                    var action = _this.actions[actionId];
                    if (!action.isCalling) {
                        if (options.immediate) {
                            _this.call(actionId);
                        }
                        else {
                            var mode = _this.focused.includes(actionId) ? 'focus' : 'default';
                            var interval = action[mode].interval;
                            // A `null` interval means no interval, so the action does not run
                            if (interval !== null) {
                                // Delay the beginning of the periodic action run
                                if (!action.calledAt && action[mode].delay) {
                                    action.calledAt += action.delay;
                                }
                                var nextCallAt = action.calledAt + interval;
                                var now = (new Date()).getTime();
                                if (nextCallAt <= now) {
                                    _this.call(actionId);
                                }
                            }
                        }
                    }
                }
            });
        };
        var runLoop = function () {
            // Using `setTimeout` instead of `setInterval` allows waiting to the
            // completion of async functions
            setTimeout(function () {
                run();
                runLoop();
            }, _this.intervals.loop);
        };
        // Run the first time
        run({ immediate: true });
        runLoop();
    };
    Synchronizer.prototype.defineAll = function () {
        var _this = this;
        this.define('announcements', this.config.announcements, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, announcements(this)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // TODO focus on contacts only (currently wallets and contacts are the same)
        // this.define('contacts', this.config.contacts, async () => {
        //   console.log('defined CONTACTS')
        // })
        // NOTE: not used currently
        // this.define('delegates', this.config.delegates, async () => {
        //   await delegates(this)
        // })
        this.define('fees', this.config.fees, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fees(this)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.define('market', this.config.market, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, market(this)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.define('peer', this.config.peer, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, peer(this)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // TODO allow focusing on 1 wallet alone, while using the normal mode for the rest
        this.define('wallets', this.config.wallets, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, wallets(this)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.define('wallets:ledger', this.config.ledgerWallets, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ledger(this)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return Synchronizer;
}());
export default Synchronizer;
//# sourceMappingURL=synchronizer.js.map