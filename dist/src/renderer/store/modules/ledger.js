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
import cryptoLibrary from 'crypto';
import { keyBy } from 'lodash';
import logger from 'electron-log';
import Vue from 'vue';
import semver from 'semver';
import { Identities } from '@arkecosystem/crypto';
import i18n from '@/i18n';
import eventBus from '@/plugins/event-bus';
import ledgerService from '@/services/ledger-service';
export default {
    namespaced: true,
    state: {
        slip44: null,
        isConnected: false,
        wallets: {},
        walletCache: {},
        loadingProcesses: {},
        needsUpdate: false,
        ensureConnection: false
    },
    getters: {
        isLoading: function (state) { return Object.keys(state.loadingProcesses).length; },
        shouldStopLoading: function (state) { return function (processId) { return state.loadingProcesses[processId]; }; },
        isConnected: function (state) { return state.isConnected; },
        needsUpdate: function (state) { return state.needsUpdate; },
        isEnsureConnectionRunning: function (state) { return state.ensureConnection; },
        wallets: function (state) { return Object.values(state.wallets); },
        walletsObject: function (state) { return state.wallets; },
        wallet: function (state) { return function (address) {
            if (!state.wallets[address]) {
                return null;
            }
            return state.wallets[address];
        }; },
        cachedWallets: function (state, _, __, rootGetters) { return function (firstAddress) {
            var profileId = rootGetters['session/profileId'];
            if (!state.walletCache[profileId]) {
                return [];
            }
            for (var _i = 0, _a = state.walletCache[profileId]; _i < _a.length; _i++) {
                var batch = _a[_i];
                if (!batch.length) {
                    continue;
                }
                if (batch[0].address === firstAddress) {
                    return batch;
                }
            }
            return [];
        }; },
        byProfileId: function (state, getters, __, rootGetters) { return function (profileId) {
            var profile = rootGetters['profile/byId'](profileId);
            var network = rootGetters['session/network'];
            return getters.wallets.filter(function (wallet) {
                return wallet.profileId === profileId && profile.networkId === network.id;
            });
        }; }
    },
    mutations: {
        RESET: function (state) {
            state.slip44 = null;
            state.isConnected = false;
            state.wallets = {};
            state.loadingProcesses = {};
            state.needsUpdate = false;
            state.ensureConnection = false;
        },
        SET_SLIP44: function (state, slip44) {
            state.slip44 = slip44;
        },
        SET_NEEDS_UPDATE: function (state, needsUpdate) {
            state.needsUpdate = needsUpdate;
        },
        SET_ENSURE_CONNECTION: function (state, ensureConnection) {
            state.ensureConnection = ensureConnection;
        },
        SET_LOADING: function (state, processId) {
            Vue.set(state.loadingProcesses, processId, false);
        },
        STOP_ALL_LOADING_PROCESSES: function (state) {
            for (var _i = 0, _a = Object.keys(state.loadingProcesses); _i < _a.length; _i++) {
                var processId = _a[_i];
                Vue.set(state.loadingProcesses, processId, true);
            }
        },
        CLEAR_LOADING_PROCESS: function (state, processId) {
            Vue.delete(state.loadingProcesses, processId);
        },
        SET_CONNECTED: function (state, isConnected) {
            state.isConnected = isConnected;
        },
        SET_WALLET: function (state, wallet) {
            if (!state.wallets[wallet.address]) {
                throw new Error("Wallet " + wallet.address + " not found in ledger wallets");
            }
            state.wallets[wallet.address] = wallet;
        },
        SET_WALLETS: function (state, wallets) {
            state.wallets = wallets;
        },
        CACHE_WALLETS: function (state, _a) {
            var wallets = _a.wallets, profileId = _a.profileId;
            if (!wallets.length) {
                return;
            }
            if (!state.walletCache[profileId]) {
                state.walletCache[profileId] = [
                    wallets
                ];
                return;
            }
            var firstAddress = wallets[0].address;
            for (var batchId in state.walletCache[profileId]) {
                var batch = state.walletCache[profileId][batchId];
                if (!batch.length) {
                    continue;
                }
                if (batch[0].address === firstAddress) {
                    state.walletCache[profileId][batchId] = wallets;
                    return;
                }
            }
            state.walletCache[profileId].push(wallets);
        },
        CLEAR_WALLET_CACHE: function (state, profileId) {
            state.walletCache[profileId] = [];
        }
    },
    actions: {
        /**
         * Reset store for new session.
         */
        reset: function (_a) {
            var commit = _a.commit;
            commit('RESET');
        },
        /**
         * Initialise ledger service with ark-ledger library.
         * @param {Number} slip44
         */
        init: function (_a, slip44) {
            var dispatch = _a.dispatch, getters = _a.getters;
            return __awaiter(this, void 0, void 0, function () {
                var neededUpdate;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            dispatch('setSlip44', slip44);
                            dispatch('ensureConnection');
                            neededUpdate = getters.needsUpdate;
                            return [4 /*yield*/, dispatch('updateVersion')];
                        case 1:
                            _b.sent();
                            if (!getters.needsUpdate && neededUpdate !== getters.needsUpdate) {
                                eventBus.emit('ledger:connected');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * Update flag to determine if ledger app needs update.
         */
        updateVersion: function (_a) {
            var commit = _a.commit, dispatch = _a.dispatch, rootGetters = _a.rootGetters, state = _a.state;
            return __awaiter(this, void 0, void 0, function () {
                var network, needsUpdate, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!state.isConnected) {
                                return [2 /*return*/];
                            }
                            network = rootGetters['session/network'];
                            needsUpdate = false;
                            _b = network.constants && network.constants.aip11;
                            if (!_b) return [3 /*break*/, 2];
                            _d = (_c = semver).lt;
                            return [4 /*yield*/, dispatch('getVersion')];
                        case 1:
                            _b = _d.apply(_c, [_e.sent(), '1.2.0']);
                            _e.label = 2;
                        case 2:
                            if (_b) {
                                needsUpdate = true;
                            }
                            commit('SET_NEEDS_UPDATE', needsUpdate);
                            if (needsUpdate) {
                                this._vm.$error(i18n.t('LEDGER.NEEDS_UPDATE'), 10000);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * Try connecting to ledger device.
         * @return {Boolean} true if connected, false if failed
         */
        connect: function (_a) {
            var commit = _a.commit, dispatch = _a.dispatch, getters = _a.getters;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, ledgerService.connect()];
                        case 1:
                            if (!(_b.sent())) {
                                return [2 /*return*/, false];
                            }
                            commit('SET_CONNECTED', true);
                            return [4 /*yield*/, dispatch('updateVersion')];
                        case 2:
                            _b.sent();
                            if (!getters.needsUpdate) {
                                eventBus.emit('ledger:connected');
                            }
                            return [4 /*yield*/, dispatch('reloadWallets', {})];
                        case 3:
                            _b.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        },
        /**
         * Flag ledger as disconnected.
         * @return {void}
         */
        disconnect: function (_a) {
            var commit = _a.commit, dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, commit('STOP_ALL_LOADING_PROCESSES')];
                        case 1:
                            _b.sent();
                            commit('SET_CONNECTED', false);
                            return [4 /*yield*/, ledgerService.disconnect()];
                        case 2:
                            _b.sent();
                            eventBus.emit('ledger:disconnected');
                            commit('SET_WALLETS', {});
                            dispatch('ensureConnection');
                            return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * Start connect process.
         * @param {Object} [obj]
         * @param  {Number} [obj.delay=2000] Delay in between connection attempts.
         * @return {void}
         */
        ensureConnection: function (_a, _b) {
            var commit = _a.commit, dispatch = _a.dispatch, getters = _a.getters, state = _a.state;
            var _c = _b === void 0 ? { delay: 2000, reRun: false } : _b, delay = _c.delay, reRun = _c.reRun;
            return __awaiter(this, void 0, void 0, function () {
                var _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!reRun && getters.isEnsureConnectionRunning) {
                                return [2 /*return*/];
                            }
                            commit('SET_ENSURE_CONNECTION', true);
                            _d = state.isConnected;
                            if (!_d) return [3 /*break*/, 2];
                            return [4 /*yield*/, dispatch('checkConnected')];
                        case 1:
                            _d = !(_e.sent());
                            _e.label = 2;
                        case 2:
                            if (!_d) return [3 /*break*/, 4];
                            return [4 /*yield*/, dispatch('disconnect')];
                        case 3:
                            _e.sent();
                            delay = 2000;
                            _e.label = 4;
                        case 4:
                            if (!!state.isConnected) return [3 /*break*/, 6];
                            return [4 /*yield*/, dispatch('connect')];
                        case 5:
                            if (_e.sent()) {
                                delay = 5000;
                            }
                            _e.label = 6;
                        case 6:
                            setTimeout(function () {
                                dispatch('ensureConnection', { delay: delay, reRun: true });
                            }, delay);
                            return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * Check we're still connected to the Ledger.
         * @return {Boolean}
         */
        checkConnected: function (_a) {
            var state = _a.state;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    if (!state.isConnected) {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, ledgerService.isConnected()];
                });
            });
        },
        /**
         * Set slip44 value.
         * @param  {Number} slip44
         * @return {void}
         */
        setSlip44: function (_a, slip44) {
            var commit = _a.commit;
            commit('SET_SLIP44', slip44);
        },
        /**
         * Reload wallets into store.
         * @param {Object} [obj]
         * @param  {Boolean} [obj.clearFirst=false] Clear ledger wallets from store before reloading
         * @param  {Boolean} [obj.forceLoad=false] Force ledger to load wallets, cancelling in-progress processes
         * @param  {(Number|null)} [obj.quantity=null] Force load a specific number of wallets
         * @return {Object}
         */
        reloadWallets: function (_a, _b) {
            var commit = _a.commit, dispatch = _a.dispatch, getters = _a.getters, rootGetters = _a.rootGetters;
            var _c = _b === void 0 ? { clearFirst: false, forceLoad: false, quantity: null } : _b, clearFirst = _c.clearFirst, forceLoad = _c.forceLoad, quantity = _c.quantity;
            return __awaiter(this, void 0, void 0, function () {
                var wallets, processId, profileId, firstWallet, currentWallets, cachedWallets, startIndex, returnWallets, batchIncrement, ledgerIndex, ledgerWallets, batchIndex, index, wallet, hasCold, walletData, filteredWallets, _loop_1, _i, ledgerWallets_1, ledgerWallet, state_1, _d, filteredWallets_1, wallet, ledgerName, error_1;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!getters.isConnected) {
                                return [2 /*return*/, {}];
                            }
                            if (!getters.isLoading) return [3 /*break*/, 2];
                            if (!forceLoad) {
                                return [2 /*return*/, {}];
                            }
                            return [4 /*yield*/, commit('STOP_ALL_LOADING_PROCESSES')];
                        case 1:
                            _e.sent();
                            _e.label = 2;
                        case 2:
                            wallets = {};
                            processId = cryptoLibrary.randomBytes(12).toString('base64');
                            _e.label = 3;
                        case 3:
                            _e.trys.push([3, 14, , 15]);
                            profileId = rootGetters['session/profileId'];
                            if (clearFirst) {
                                commit('SET_WALLETS', {});
                                eventBus.emit('ledger:wallets-updated', {});
                            }
                            commit('SET_LOADING', processId);
                            return [4 /*yield*/, dispatch('getWallet', 0)];
                        case 4:
                            firstWallet = _e.sent();
                            currentWallets = getters.walletsObject;
                            cachedWallets = getters.cachedWallets(firstWallet.address);
                            startIndex = 0;
                            if (cachedWallets.length) {
                                returnWallets = false;
                                if (!quantity || quantity > cachedWallets.length) {
                                    wallets = keyBy(cachedWallets, 'address');
                                    startIndex = Math.max(0, cachedWallets.length - 1);
                                }
                                else if (quantity < cachedWallets.length) {
                                    wallets = keyBy(cachedWallets.slice(0, quantity), 'address');
                                    returnWallets = true;
                                }
                                else {
                                    wallets = keyBy(cachedWallets, 'address');
                                    returnWallets = true;
                                }
                                if (returnWallets) {
                                    if (getters.shouldStopLoading(processId)) {
                                        commit('CLEAR_LOADING_PROCESS', processId);
                                        return [2 /*return*/, {}];
                                    }
                                    commit('SET_WALLETS', wallets);
                                    eventBus.emit('ledger:wallets-updated', wallets);
                                    commit('CLEAR_LOADING_PROCESS', processId);
                                    dispatch('cacheWallets');
                                    return [2 /*return*/, wallets];
                                }
                            }
                            else if (currentWallets && Object.keys(currentWallets).length) {
                                startIndex = Object.keys(currentWallets).length - 1;
                                wallets = __assign({}, currentWallets);
                            }
                            batchIncrement = 10;
                            if (quantity && Math.abs(quantity - startIndex) < 10) {
                                batchIncrement = Math.abs(quantity - startIndex);
                            }
                            else if (!quantity && Object.keys(wallets).length > 0) {
                                batchIncrement = 2;
                            }
                            ledgerIndex = startIndex;
                            _e.label = 5;
                        case 5:
                            if (getters.shouldStopLoading(processId)) {
                                commit('CLEAR_LOADING_PROCESS', processId);
                                return [2 /*return*/, {}];
                            }
                            ledgerWallets = [];
                            batchIndex = 0;
                            _e.label = 6;
                        case 6:
                            if (!(batchIndex < batchIncrement)) return [3 /*break*/, 10];
                            index = ledgerIndex + batchIndex;
                            wallet = firstWallet;
                            if (!(index > 0)) return [3 /*break*/, 8];
                            return [4 /*yield*/, dispatch('getWallet', index)];
                        case 7:
                            wallet = _e.sent();
                            _e.label = 8;
                        case 8:
                            ledgerWallets.push(__assign(__assign({}, wallet), { ledgerIndex: index }));
                            if (quantity && ledgerIndex + ledgerWallets.length >= quantity) {
                                return [3 /*break*/, 10];
                            }
                            _e.label = 9;
                        case 9:
                            batchIndex++;
                            return [3 /*break*/, 6];
                        case 10:
                            hasCold = false;
                            return [4 /*yield*/, this._vm.$client.fetchWallets(ledgerWallets.map(function (wallet) { return wallet.address; }))];
                        case 11:
                            walletData = _e.sent();
                            filteredWallets = [];
                            _loop_1 = function (ledgerWallet) {
                                var wallet = walletData.find(function (wallet) { return wallet.address === ledgerWallet.address; });
                                if (!wallet || (wallet.balance === 0 && !wallet.publicKey)) {
                                    filteredWallets.push(__assign(__assign({}, ledgerWallet), { balance: 0, isCold: true }));
                                    hasCold = true;
                                    if (!quantity) {
                                        return "break";
                                    }
                                    else {
                                        return "continue";
                                    }
                                }
                                filteredWallets.push(__assign(__assign({}, wallet), ledgerWallet));
                            };
                            for (_i = 0, ledgerWallets_1 = ledgerWallets; _i < ledgerWallets_1.length; _i++) {
                                ledgerWallet = ledgerWallets_1[_i];
                                state_1 = _loop_1(ledgerWallet);
                                if (state_1 === "break")
                                    break;
                            }
                            for (_d = 0, filteredWallets_1 = filteredWallets; _d < filteredWallets_1.length; _d++) {
                                wallet = filteredWallets_1[_d];
                                ledgerName = rootGetters['wallet/ledgerNameByAddress'](wallet.address);
                                wallets[wallet.address] = Object.assign(wallet, {
                                    isLedger: true,
                                    isSendingEnabled: true,
                                    name: ledgerName || "Ledger " + (wallet.ledgerIndex + 1),
                                    passphrase: null,
                                    profileId: profileId,
                                    id: wallet.address
                                });
                            }
                            if ((hasCold && !quantity) || (quantity && Object.keys(wallets).length >= quantity)) {
                                return [3 /*break*/, 13];
                            }
                            _e.label = 12;
                        case 12:
                            ledgerIndex += batchIncrement;
                            return [3 /*break*/, 5];
                        case 13: return [3 /*break*/, 15];
                        case 14:
                            error_1 = _e.sent();
                            logger.error(error_1);
                            return [3 /*break*/, 15];
                        case 15:
                            if (getters.shouldStopLoading(processId)) {
                                commit('CLEAR_LOADING_PROCESS', processId);
                                return [2 /*return*/, {}];
                            }
                            commit('SET_WALLETS', wallets);
                            eventBus.emit('ledger:wallets-updated', wallets);
                            commit('CLEAR_LOADING_PROCESS', processId);
                            dispatch('cacheWallets');
                            return [2 /*return*/, wallets];
                    }
                });
            });
        },
        /**
         * Store ledger wallets in the cache.
         */
        updateWallet: function (_a, updatedWallet) {
            var commit = _a.commit, dispatch = _a.dispatch, getters = _a.getters;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    commit('SET_WALLET', updatedWallet);
                    eventBus.emit('ledger:wallets-updated', getters.walletsObject);
                    dispatch('cacheWallets');
                    return [2 /*return*/];
                });
            });
        },
        /**
         * Store several Ledger wallets at once and cache them.
         */
        updateWallets: function (_a, walletsToUpdate) {
            var commit = _a.commit, dispatch = _a.dispatch, getters = _a.getters;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    commit('SET_WALLETS', __assign(__assign({}, getters.walletsObject), walletsToUpdate));
                    eventBus.emit('ledger:wallets-updated', getters.walletsObject);
                    dispatch('cacheWallets');
                    return [2 /*return*/];
                });
            });
        },
        /**
         * Store ledger wallets in the cache.
         * @param  {Number} accountIndex Index of wallet to get address for.
         * @return {(String|Boolean)}
         */
        cacheWallets: function (_a) {
            var commit = _a.commit, getters = _a.getters, rootGetters = _a.rootGetters;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    if (rootGetters['session/ledgerCache']) {
                        commit('CACHE_WALLETS', {
                            wallets: getters.wallets,
                            profileId: rootGetters['session/profileId']
                        });
                    }
                    return [2 /*return*/];
                });
            });
        },
        /**
         * Clear all ledger wallets from cache.
         * @param  {Number} accountIndex Index of wallet to get address for.
         * @return {(String|Boolean)}
         */
        clearWalletCache: function (_a) {
            var commit = _a.commit, rootGetters = _a.rootGetters;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    commit('CLEAR_WALLET_CACHE', rootGetters['session/profileId']);
                    return [2 /*return*/];
                });
            });
        },
        /**
         * Get address and public key from ledger wallet.
         * @param  {Number} accountIndex Index of wallet to get data for.
         * @return {Promise<string>}
         */
        getVersion: function (_a) {
            var dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, dispatch('action', {
                                    action: 'getVersion'
                                })];
                        case 1: return [2 /*return*/, _b.sent()];
                        case 2:
                            error_2 = _b.sent();
                            logger.error(error_2);
                            throw new Error("Could not get version: " + error_2);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * Get address and public key from ledger wallet.
         * @param  {Number} accountIndex Index of wallet to get data for.
         * @return {(String|Boolean)}
         */
        getWallet: function (_a, accountIndex) {
            var dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                var error_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, dispatch('action', {
                                    action: 'getWallet',
                                    accountIndex: accountIndex
                                })];
                        case 1: return [2 /*return*/, _b.sent()];
                        case 2:
                            error_3 = _b.sent();
                            logger.error(error_3);
                            throw new Error("Could not get wallet: " + error_3);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * Get address from ledger wallet.
         * @param  {Number} accountIndex Index of wallet to get address for.
         * @return {(String|Boolean)}
         */
        getAddress: function (_a, accountIndex) {
            var dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                var error_4;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, dispatch('action', {
                                    action: 'getAddress',
                                    accountIndex: accountIndex
                                })];
                        case 1: return [2 /*return*/, _b.sent()];
                        case 2:
                            error_4 = _b.sent();
                            logger.error(error_4);
                            throw new Error("Could not get address: " + error_4);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * Get public key from ledger wallet.
         * @param  {Number} [accountIndex] Index of wallet to get public key for.
         * @return {Promise<string>}
         */
        getPublicKey: function (_a, accountIndex) {
            var dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                var error_5;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, dispatch('action', {
                                    action: 'getPublicKey',
                                    accountIndex: accountIndex
                                })];
                        case 1: return [2 /*return*/, _b.sent()];
                        case 2:
                            error_5 = _b.sent();
                            logger.error(error_5);
                            throw new Error("Could not get public key: " + error_5);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * Sign transaction for ledger wallet.
         * @param  {Object} obj
         * @param  {Buffer} obj.transactionBytes Bytes of transaction.
         * @param  {Number} obj.accountIndex Index of wallet to sign transaction for.
         * @return {Promise<string>}
         */
        signTransaction: function (_a, _b) {
            var dispatch = _a.dispatch;
            var _c = _b === void 0 ? {} : _b, transactionBytes = _c.transactionBytes, accountIndex = _c.accountIndex;
            return __awaiter(this, void 0, void 0, function () {
                var error_6;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, dispatch('action', {
                                    action: 'signTransaction',
                                    accountIndex: accountIndex,
                                    data: transactionBytes
                                })];
                        case 1: return [2 /*return*/, _d.sent()];
                        case 2:
                            error_6 = _d.sent();
                            logger.error(error_6);
                            throw new Error("Could not sign transaction: " + error_6);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * Sign message for ledger wallet.
         * @param  {Object} obj
         * @param  {Buffer} obj.messageBytes Bytes to sign.
         * @param  {Number} obj.accountIndex Index of wallet to sign transaction for.
         * @return {Promise<string>}
         */
        signMessage: function (_a, _b) {
            var dispatch = _a.dispatch;
            var _c = _b === void 0 ? {} : _b, messageBytes = _c.messageBytes, accountIndex = _c.accountIndex;
            return __awaiter(this, void 0, void 0, function () {
                var error_7;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, dispatch('action', {
                                    action: 'signMessage',
                                    accountIndex: accountIndex,
                                    data: messageBytes
                                })];
                        case 1: return [2 /*return*/, _d.sent()];
                        case 2:
                            error_7 = _d.sent();
                            logger.error(error_7);
                            throw new Error("Could not sign message: " + error_7);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * Action method to act as a wrapper for ledger methods
         * @param {Object} obj
         * @param  {String} obj.action       Action to perform
         * @param  {Number} obj.accountIndex Index of wallet to access.
         * @param  {*}      obj.data         Data used for any actions that need it.
         * @return {String}
         */
        action: function (_a, _b) {
            var state = _a.state, dispatch = _a.dispatch, rootGetters = _a.rootGetters;
            var _c = _b === void 0 ? {} : _b, action = _c.action, accountIndex = _c.accountIndex, data = _c.data;
            return __awaiter(this, void 0, void 0, function () {
                var path, actions, response, error_8;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (action !== 'getVersion' && (accountIndex === undefined || !Number.isFinite(accountIndex))) {
                                throw new Error('accountIndex must be a Number');
                            }
                            if (!!state.isConnected) return [3 /*break*/, 2];
                            return [4 /*yield*/, dispatch('ensureConnection')];
                        case 1:
                            _d.sent();
                            if (!state.isConnected) {
                                throw new Error('Ledger not connected');
                            }
                            _d.label = 2;
                        case 2:
                            path = "44'/" + state.slip44 + "'/" + (accountIndex || 0) + "'/0/0";
                            actions = {
                                getWallet: function () {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var publicKey, network;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, ledgerService.getPublicKey(path)];
                                                case 1:
                                                    publicKey = _a.sent();
                                                    network = rootGetters['session/network'];
                                                    return [2 /*return*/, {
                                                            address: Identities.Address.fromPublicKey(publicKey, network.version),
                                                            publicKey: publicKey
                                                        }];
                                            }
                                        });
                                    });
                                },
                                getAddress: function () {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var publicKey, network;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, ledgerService.getPublicKey(path)];
                                                case 1:
                                                    publicKey = _a.sent();
                                                    network = rootGetters['session/network'];
                                                    return [2 /*return*/, Identities.Address.fromPublicKey(publicKey, network.version)];
                                            }
                                        });
                                    });
                                },
                                getPublicKey: function () {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, ledgerService.getPublicKey(path)];
                                        });
                                    });
                                },
                                signTransaction: function () {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, ledgerService.signTransaction(path, data)];
                                        });
                                    });
                                },
                                signMessage: function () {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, ledgerService.signMessage(path, data)];
                                        });
                                    });
                                },
                                getVersion: function () {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, ledgerService.getVersion()];
                                        });
                                    });
                                }
                            };
                            if (!Object.prototype.hasOwnProperty.call(actions, action)) {
                                throw new Error('Action does not exist');
                            }
                            _d.label = 3;
                        case 3:
                            _d.trys.push([3, 7, , 9]);
                            return [4 /*yield*/, actions[action]()];
                        case 4:
                            response = _d.sent();
                            if (!(response === null)) return [3 /*break*/, 6];
                            return [4 /*yield*/, dispatch('disconnect')];
                        case 5:
                            _d.sent();
                            throw new Error('Ledger disconnected');
                        case 6: return [2 /*return*/, response];
                        case 7:
                            error_8 = _d.sent();
                            return [4 /*yield*/, dispatch('disconnect')];
                        case 8:
                            _d.sent();
                            throw new Error('Ledger disconnected');
                        case 9: return [2 /*return*/];
                    }
                });
            });
        }
    }
};
//# sourceMappingURL=ledger.js.map