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
import BaseModule from '../base';
import { cloneDeep } from 'lodash';
import { Managers } from '@arkecosystem/crypto';
import { NETWORKS } from '@config';
import { isEmpty } from '@/utils';
import eventBus from '@/plugins/event-bus';
import NetworkModel from '@/models/network';
import Client from '@/services/client';
import Vue from 'vue';
import { reqwest } from '@/utils/http';
export default new BaseModule(NetworkModel, {
    state: function () { return ({
        all: [],
        customNetworks: {}
    }); },
    getters: {
        bySymbol: function (state) { return function (symbol) {
            return state.all.find(function (network) { return network.symbol === symbol; });
        }; },
        byToken: function (state) { return function (token) {
            return state.all.find(function (network) { return network.token === token; });
        }; },
        byName: function (state) { return function (name) {
            return state.all.find(function (network) { return network.name === name; });
        }; },
        customNetworkById: function (state) { return function (id) {
            return state.customNetworks[id];
        }; },
        customNetworks: function (state) { return state.customNetworks; }
    },
    mutations: {
        SET_ALL: function (state, value) {
            state.all = value;
        },
        ADD_CUSTOM_NETWORK: function (state, value) {
            Vue.set(state.customNetworks, value.id, value);
        },
        UPDATE_CUSTOM_NETWORK: function (state, value) {
            if (state.customNetworks[value.id]) {
                Vue.set(state.customNetworks, value.id, value);
            }
        },
        REMOVE_CUSTOM_NETWORK: function (state, value) {
            Vue.delete(state.customNetworks, value);
        }
    },
    actions: {
        load: function (_a) {
            var commit = _a.commit, getters = _a.getters, rootGetters = _a.rootGetters;
            var all = cloneDeep(getters.all);
            if (!isEmpty(all)) {
                // TODO: remove in future major version
                // This is a "hack" to make sure all custom networks are in state.all
                var missingCustom = false;
                var _loop_1 = function (custom) {
                    if (!all.find(function (network) { return network.name === custom.name; })) {
                        all.push(custom);
                        missingCustom = true;
                    }
                };
                for (var _i = 0, _b = Object.values(getters.customNetworks); _i < _b.length; _i++) {
                    var custom = _b[_i];
                    _loop_1(custom);
                }
                if (missingCustom) {
                    commit('SET_ALL', all);
                }
            }
            else {
                commit('SET_ALL', NETWORKS);
            }
            var sessionNetwork = rootGetters['session/network'];
            if (sessionNetwork && sessionNetwork.crypto && sessionNetwork.constants) {
                Managers.configManager.setConfig(cloneDeep(sessionNetwork.crypto));
                Managers.configManager.setHeight(sessionNetwork.constants.height);
            }
        },
        /*
         * Update data of the network
         */
        updateData: function (_a, network) {
            var commit = _a.commit, rootGetters = _a.rootGetters;
            if (network === void 0) { network = null; }
            return __awaiter(this, void 0, void 0, function () {
                var crypto_1, constants, defaultNetwork, knownWallets, error_1, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!network) {
                                network = cloneDeep(rootGetters['session/network']);
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 8, , 9]);
                            return [4 /*yield*/, Client.fetchNetworkCrypto(network.server)];
                        case 2:
                            crypto_1 = _b.sent();
                            return [4 /*yield*/, Client.fetchNetworkConfig(network.server)
                                // TODO: remove in future major version
                                // this is a "hack" to make sure the known wallets url is set on the default networks
                            ];
                        case 3:
                            constants = (_b.sent()).constants;
                            // TODO: remove in future major version
                            // this is a "hack" to make sure the known wallets url is set on the default networks
                            if (!network.knownWalletsUrl) {
                                defaultNetwork = NETWORKS.find(function (defaultNetwork) { return defaultNetwork.id === network.id; });
                                if (defaultNetwork) {
                                    network.knownWalletsUrl = defaultNetwork.knownWalletsUrl;
                                }
                            }
                            if (!network.knownWalletsUrl) return [3 /*break*/, 7];
                            _b.label = 4;
                        case 4:
                            _b.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, reqwest(network.knownWalletsUrl, {
                                    json: true
                                })];
                        case 5:
                            knownWallets = _b.sent();
                            network.knownWallets = knownWallets.body;
                            return [3 /*break*/, 7];
                        case 6:
                            error_1 = _b.sent();
                            this._vm.$logger.error('Could not retrieve known wallets: ', error_1);
                            return [3 /*break*/, 7];
                        case 7:
                            commit('UPDATE', __assign(__assign({}, network), { constants: constants }));
                            Managers.configManager.setConfig(cloneDeep(crypto_1));
                            Managers.configManager.setHeight(constants.height);
                            return [3 /*break*/, 9];
                        case 8:
                            error_2 = _b.sent();
                            this._vm.$logger.error('Could not update network data: ', error_2);
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        },
        /*
         * Update the fee statistics of the current network
         */
        fetchFees: function (_a, network) {
            var commit = _a.commit, rootGetters = _a.rootGetters;
            if (network === void 0) { network = null; }
            return __awaiter(this, void 0, void 0, function () {
                var feeStatistics, error_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!network) {
                                network = rootGetters['session/network'];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Client.fetchFeeStatistics(network.server)];
                        case 2:
                            feeStatistics = _b.sent();
                            commit('UPDATE', __assign(__assign({}, network), { feeStatistics: __assign({}, feeStatistics) }));
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _b.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        addCustomNetwork: function (_a, network) {
            var dispatch = _a.dispatch, commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            commit('ADD_CUSTOM_NETWORK', network);
                            dispatch('create', network);
                            return [4 /*yield*/, dispatch('fetchFees', network)];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        updateCustomNetwork: function (_a, network) {
            var dispatch = _a.dispatch, commit = _a.commit, rootGetters = _a.rootGetters;
            return __awaiter(this, void 0, void 0, function () {
                var currentNetwork;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            commit('UPDATE_CUSTOM_NETWORK', network);
                            dispatch('update', network);
                            currentNetwork = rootGetters['session/network'];
                            if (!(currentNetwork.id === network.id)) return [3 /*break*/, 2];
                            return [4 /*yield*/, dispatch('session/setProfileId', rootGetters['session/profileId'], { root: true })];
                        case 1:
                            _b.sent();
                            eventBus.emit('client:changed');
                            _b.label = 2;
                        case 2: return [4 /*yield*/, dispatch('fetchFees', network)];
                        case 3:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        removeCustomNetwork: function (_a, id) {
            var dispatch = _a.dispatch, commit = _a.commit;
            commit('REMOVE_CUSTOM_NETWORK', id);
            dispatch('delete', { id: id });
        }
    }
});
//# sourceMappingURL=network.js.map