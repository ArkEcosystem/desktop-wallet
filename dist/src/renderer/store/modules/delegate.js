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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import DelegateModel from '@/models/delegate';
import Vue from 'vue';
export default {
    namespaced: true,
    state: {
        delegates: {}
    },
    getters: {
        all: function (state, _, __, rootGetters) {
            var network = rootGetters['session/network'];
            if (!network || !state.delegates[network.id]) {
                return false;
            }
            return state.delegates;
        },
        bySessionNetwork: function (state, _, __, rootGetters) {
            var network = rootGetters['session/network'];
            if (!network || !state.delegates[network.id]) {
                return false;
            }
            return state.delegates[network.id];
        },
        byAddress: function (state, _, __, rootGetters) { return function (address) {
            var network = rootGetters['session/network'];
            if (!address || !network || !state.delegates[network.id]) {
                return false;
            }
            return state.delegates[network.id][address] || false;
        }; },
        byUsername: function (state, _, __, rootGetters) { return function (username) {
            var network = rootGetters['session/network'];
            if (!username || !network || !state.delegates[network.id]) {
                return false;
            }
            return Object.values(state.delegates[network.id]).find(function (delegate) {
                return delegate.username === username;
            }) || false;
        }; },
        byPublicKey: function (state, _, __, rootGetters) { return function (publicKey) {
            var network = rootGetters['session/network'];
            if (!publicKey || !network || !state.delegates[network.id]) {
                return false;
            }
            return Object.values(state.delegates[network.id]).find(function (delegate) {
                return delegate.publicKey === publicKey;
            }) || false;
        }; },
        search: function (state, getters) { return function (query) {
            if (query.length <= 20) {
                return getters.byUsername(query);
            }
            else if (query.length <= 34) {
                return getters.byAddress(query);
            }
            else {
                return getters.byPublicKey(query);
            }
        }; }
    },
    mutations: {
        SET_DELEGATES: function (state, _a) {
            var delegates = _a.delegates, networkId = _a.networkId;
            var result = delegates.reduce(function (acc, delegate) {
                acc[delegate.address] = delegate;
                return acc;
            }, {});
            Vue.set(state.delegates, networkId, result);
        },
        ADD_DELEGATE: function (state, _a) {
            var _b;
            var delegate = _a.delegate, networkId = _a.networkId;
            Vue.set(state.delegates, networkId, (_b = {}, _b[delegate.address] = delegate, _b));
        }
    },
    actions: {
        load: function (_a) {
            var dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                var delegates, delegatePage1, requests, page, delegatePages, _b, _i, delegatePages_1, page;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            delegates = [];
                            return [4 /*yield*/, this._vm.$client.fetchDelegates({
                                    page: 1,
                                    limit: 100
                                })];
                        case 1:
                            delegatePage1 = _c.sent();
                            requests = [];
                            for (page = 2; page <= delegatePage1.meta.pageCount; page++) {
                                requests.push(this._vm.$client.fetchDelegates({
                                    page: page,
                                    limit: 100
                                }));
                            }
                            _b = [[delegatePage1]];
                            return [4 /*yield*/, Promise.all(requests)];
                        case 2:
                            delegatePages = __spreadArrays.apply(void 0, _b.concat([_c.sent()]));
                            for (_i = 0, delegatePages_1 = delegatePages; _i < delegatePages_1.length; _i++) {
                                page = delegatePages_1[_i];
                                delegates.push.apply(delegates, page.delegates);
                            }
                            dispatch('set', delegates);
                            return [2 /*return*/];
                    }
                });
            });
        },
        set: function (_a, delegates) {
            var commit = _a.commit, rootGetters = _a.rootGetters;
            var network = rootGetters['session/network'];
            commit('SET_DELEGATES', {
                delegates: delegates.map(function (delegate) { return DelegateModel.deserialize(delegate); }),
                networkId: network.id
            });
        },
        add: function (_a, delegate) {
            var commit = _a.commit, rootGetters = _a.rootGetters;
            var network = rootGetters['session/network'];
            commit('ADD_DELEGATE', {
                delegate: DelegateModel.deserialize(delegate),
                networkId: network.id
            });
        }
    }
};
//# sourceMappingURL=delegate.js.map