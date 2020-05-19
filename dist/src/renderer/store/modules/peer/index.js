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
import { random, shuffle } from 'lodash';
import { PeerDiscovery } from '@arkecosystem/peers';
import ClientService from '@/services/client';
import config from '@config';
import i18n from '@/i18n';
import { isEmpty } from '@/utils';
import PeerModel from '@/models/peer';
import Vue from 'vue';
import { fallbackSeeds } from './fallback';
var getBaseUrl = function (peer) {
    var scheme = peer.isHttps ? 'https://' : 'http://';
    return "" + scheme + peer.ip + ":" + peer.port;
};
var discoverPeers = function (peerDiscovery) { return __awaiter(void 0, void 0, void 0, function () {
    var peers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                peerDiscovery.withLatency(300).sortBy('latency');
                return [4 /*yield*/, peerDiscovery.findPeersWithPlugin('core-api', {
                        additional: [
                            'height',
                            'latency'
                        ]
                    })];
            case 1:
                peers = _a.sent();
                if (peers && peers.length) {
                    return [2 /*return*/, peers];
                }
                return [2 /*return*/, peerDiscovery.findPeersWithPlugin('core-wallet-api', {
                        additional: [
                            'height',
                            'latency',
                            'version'
                        ]
                    })];
        }
    });
}); };
export default {
    namespaced: true,
    state: {
        all: {},
        current: {}
    },
    getters: {
        /**
         * Get all peers for current network.
         * @param  {Boolean} [ignoreCurrent=false]
         * @return {Object[]}
         */
        all: function (state, getters, _, rootGetters) { return function (ignoreCurrent, networkId) {
            if (ignoreCurrent === void 0) { ignoreCurrent = false; }
            if (networkId === void 0) { networkId = null; }
            if (!networkId) {
                var profile = rootGetters['session/profile'];
                if (!profile || !profile.networkId) {
                    return [];
                }
                networkId = profile.networkId;
            }
            var networkPeers = state.all[networkId];
            var peers = [];
            if (networkPeers) {
                peers = Object.values(networkPeers.peers);
            }
            if (ignoreCurrent) {
                var currentPeer_1 = getters.current();
                if (currentPeer_1) {
                    peers = peers.filter(function (peer) {
                        return peer.ip !== currentPeer_1.ip;
                    });
                }
            }
            return peers;
        }; },
        /**
         * Get peer for current network based on ip.
         * @param  {String} ip
         * @return {(Object|undefined)}
         */
        get: function (_, getters) { return function (ip) {
            return getters.all().find(function (peer) { return peer.ip === ip; });
        }; },
        /**
         * Determine best peer for current network (random from top 10).
         * @param  {Boolean} [ignoreCurrent=true]
         * @return {(Object|null)}
         */
        best: function (_, getters) { return function (ignoreCurrent) {
            if (ignoreCurrent === void 0) { ignoreCurrent = true; }
            var peers = getters.bestPeers(undefined, ignoreCurrent);
            if (!peers) {
                return null;
            }
            return Object.values(peers)[random(peers.length - 1)];
        }; },
        /**
         * Retrieves n random peers for the current network (excluding current peer)
         * @param {Number} amount of peers to return
         * @return {Object[]} containing peer objects
         */
        randomPeers: function (_, getters) { return function (amount) {
            if (amount === void 0) { amount = 5; }
            var peers = getters.all(true); // Ignore current peer
            if (!peers.length) {
                return [];
            }
            return shuffle(peers).slice(0, amount);
        }; },
        /**
         * Retrieves n random seed peers for the current network (excluding current peer)
         * Note that these peers are currently taken from a config file and will an empty array
         * custom networks without a corresponding peers file
         * @param {Number} amount of peers to return
         * @return {Object[]} containing peer objects
         */
        randomSeedPeers: function (_, __, ___, rootGetters) { return function (amount, networkId) {
            if (amount === void 0) { amount = 5; }
            if (networkId === void 0) { networkId = null; }
            if (!networkId) {
                var profile = rootGetters['session/profile'];
                if (!profile || !profile.networkId) {
                    return [];
                }
                networkId = profile.networkId;
            }
            var peers = config.PEERS[networkId];
            if (!peers || !peers.length) {
                return [];
            }
            return shuffle(peers).slice(0, amount);
        }; },
        /**
         * Returns an array of peers that can be used to broadcast a transaction to
         * Currently this consists of top 10 peers + 5 random peers + 5 random seed peers
         * @return {Object[]} containing peer objects
         */
        broadcastPeers: function (_, getters) { return function (networkId) {
            if (networkId === void 0) { networkId = null; }
            var bestPeers = getters.bestPeers(10, false, networkId);
            var randomPeers = getters.randomPeers(5, networkId);
            var seedPeers = getters.randomSeedPeers(5, networkId);
            var peers = bestPeers.concat(randomPeers);
            if (seedPeers.length) {
                peers = peers.concat(seedPeers);
            }
            return peers;
        }; },
        /**
         * Determine best peer for current network (random from top 10).
         * @param  {Boolean} [ignoreCurrent=true]
         * @return {Object[]}
         */
        bestPeers: function (_, getters) { return function (maxRandom, ignoreCurrent) {
            if (maxRandom === void 0) { maxRandom = 10; }
            if (ignoreCurrent === void 0) { ignoreCurrent = true; }
            var peers = getters.all(ignoreCurrent);
            if (!peers.length) {
                return [];
            }
            // NOTE: Disabled because if a bad peer has a height 50 blocks above the rest it is not returning any peer
            // const highestHeight = peers[0].height
            // for (let i = 1; i < maxRandom; i++) {
            //   if (!peers[i]) {
            //     break
            //   }
            //   if (peers[i].height < highestHeight - 50) {
            //     maxRandom = i - 1
            //   }
            // }
            return peers.slice(0, Math.min(maxRandom, peers.length));
        }; },
        /**
         * Get current peer.
         * @return {(Object|boolean)} - false if no current peer
         */
        current: function (state, getters, __, rootGetters) { return function (networkId) {
            if (networkId === void 0) { networkId = null; }
            if (!networkId) {
                var profile = rootGetters['session/profile'];
                if (!profile || !profile.networkId) {
                    return false;
                }
                networkId = profile.networkId;
            }
            var currentPeer = state.current[networkId];
            if (isEmpty(currentPeer)) {
                return false;
            }
            return currentPeer;
        }; },
        /**
         * Get last updated date for peer list.
         * @return {(Date|null)}
         */
        lastUpdated: function (state, _, __, rootGetters) { return function () {
            var profile = rootGetters['session/profile'];
            if (!profile || !profile.networkId) {
                return false;
            }
            var networkPeers = state.all[profile.networkId];
            if (networkPeers) {
                return networkPeers.lastUpdated;
            }
            return null;
        }; }
    },
    mutations: {
        SET_PEERS: function (state, _a) {
            var peers = _a.peers, networkId = _a.networkId;
            Vue.set(state.all, networkId, {
                peers: peers,
                lastUpdated: new Date()
            });
        },
        SET_CURRENT_PEER: function (state, _a) {
            var peer = _a.peer, networkId = _a.networkId;
            Vue.set(state.current, networkId, peer);
        }
    },
    actions: {
        /**
         * Set peers for specific network.
         * @param  {Object[]} peers
         * @param  {Number} networkId
         * @return {void}
         */
        setToNetwork: function (_a, _b) {
            var _this = this;
            var commit = _a.commit;
            var peers = _b.peers, networkId = _b.networkId;
            commit('SET_PEERS', {
                peers: peers.map(function (peer) {
                    try {
                        return PeerModel.deserialize(peer);
                    }
                    catch (error) {
                        _this._vm.$logger.error("Could not deserialize peer: " + error.message);
                    }
                    return null;
                }).filter(function (peer) { return peer !== null; }),
                networkId: networkId
            });
        },
        /**
         * Set peers for current network.
         * @param  {Object[]} peers
         * @return {void}
         */
        set: function (_a, peers) {
            var _this = this;
            var commit = _a.commit, rootGetters = _a.rootGetters;
            var profile = rootGetters['session/profile'];
            if (!profile || !profile.networkId) {
                return;
            }
            commit('SET_PEERS', {
                peers: peers.map(function (peer) {
                    try {
                        return PeerModel.deserialize(peer);
                    }
                    catch (error) {
                        _this._vm.$logger.error("Could not deserialize peer: " + error.message);
                    }
                    return null;
                }).filter(function (peer) { return peer !== null; }),
                networkId: profile.networkId
            });
        },
        /**
         * Set current peer for current network.
         * @param  {Object} peer
         * @return {void}
         */
        setCurrentPeer: function (_a, peer) {
            var commit = _a.commit, dispatch = _a.dispatch, rootGetters = _a.rootGetters;
            return __awaiter(this, void 0, void 0, function () {
                var profile;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            profile = rootGetters['session/profile'];
                            if (!profile || !profile.networkId) {
                                return [2 /*return*/];
                            }
                            if (!peer) return [3 /*break*/, 2];
                            this._vm.$client.host = getBaseUrl(peer);
                            // TODO only when necessary (when / before sending) (if no dynamic)
                            return [4 /*yield*/, dispatch('transaction/updateStaticFees', null, { root: true })];
                        case 1:
                            // TODO only when necessary (when / before sending) (if no dynamic)
                            _b.sent();
                            _b.label = 2;
                        case 2:
                            commit('SET_CURRENT_PEER', {
                                peer: peer,
                                networkId: profile.networkId
                            });
                            return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * Get Peer Discovery instance.
         * @return {PeerDiscovery}
         */
        getPeerDiscovery: function (_a, network) {
            var getters = _a.getters, rootGetters = _a.rootGetters;
            if (network === void 0) { network = null; }
            return __awaiter(this, void 0, void 0, function () {
                var networkLookup, peerUrl;
                return __generator(this, function (_b) {
                    if (!network) {
                        network = rootGetters['session/network'];
                    }
                    if (!network) {
                        return [2 /*return*/];
                    }
                    networkLookup = {
                        'ark.mainnet': 'mainnet',
                        'ark.devnet': 'devnet'
                    };
                    if (networkLookup[network.id]) {
                        return [2 /*return*/, PeerDiscovery.new({
                                networkOrHost: networkLookup[network.id]
                            })];
                    }
                    else if (getters.current()) {
                        peerUrl = getBaseUrl(getters.current());
                        return [2 /*return*/, PeerDiscovery.new({
                                networkOrHost: peerUrl + "/api/peers"
                            })];
                    }
                    return [2 /*return*/, PeerDiscovery.new({
                            networkOrHost: network.server + "/api/peers"
                        })];
                });
            });
        },
        /**
         * Refresh peer list.
         * @return {void}
         */
        refresh: function (_a, network) {
            var dispatch = _a.dispatch, rootGetters = _a.rootGetters;
            if (network === void 0) { network = null; }
            return __awaiter(this, void 0, void 0, function () {
                var peers, _b, error_1, networkLookup, peerDiscoveryFailed, seeds, seed, peerDiscovery, error_2;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            peers = [];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 4, , 14]);
                            _b = discoverPeers;
                            return [4 /*yield*/, dispatch('getPeerDiscovery', network)];
                        case 2: return [4 /*yield*/, _b.apply(void 0, [_c.sent()])];
                        case 3:
                            peers = _c.sent();
                            return [3 /*break*/, 14];
                        case 4:
                            error_1 = _c.sent();
                            if (!network) {
                                network = rootGetters['session/network'];
                            }
                            networkLookup = {
                                'ark.mainnet': 'mainnet',
                                'ark.devnet': 'devnet'
                            };
                            if (!networkLookup[network.id]) return [3 /*break*/, 12];
                            console.log('Could not refresh peer list. Using fallback seeds: ', error_1);
                            peerDiscoveryFailed = true;
                            _c.label = 5;
                        case 5:
                            if (!peerDiscoveryFailed) return [3 /*break*/, 11];
                            _c.label = 6;
                        case 6:
                            _c.trys.push([6, 9, , 10]);
                            seeds = fallbackSeeds[network.id];
                            seed = seeds[Math.floor(Math.random() * seeds.length)];
                            return [4 /*yield*/, PeerDiscovery.new({ networkOrHost: "http://" + seed.ip + ":4003/api/peers" })];
                        case 7:
                            peerDiscovery = _c.sent();
                            return [4 /*yield*/, discoverPeers(peerDiscovery)];
                        case 8:
                            peers = _c.sent();
                            peerDiscoveryFailed = false;
                            return [3 /*break*/, 10];
                        case 9:
                            error_2 = _c.sent();
                            peerDiscoveryFailed = true;
                            console.error('Could not refresh peer list:', error_2);
                            return [3 /*break*/, 10];
                        case 10: return [3 /*break*/, 5];
                        case 11: return [3 /*break*/, 13];
                        case 12:
                            console.error('Could not refresh peer list:', error_1);
                            _c.label = 13;
                        case 13: return [3 /*break*/, 14];
                        case 14:
                            if (!peers.length) {
                                this._vm.$error(i18n.t('PEER.FAILED_REFRESH'));
                            }
                            dispatch('set', peers);
                            return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * Get best peer for current network.
         * @param  {Boolean} [refresh=true]
         * @param  {Boolean} [skipIfCustom=true]
         * @return {(Object|null)}
         */
        findBest: function (_a, _b) {
            var dispatch = _a.dispatch, getters = _a.getters;
            var _c = _b.refresh, refresh = _c === void 0 ? true : _c, _d = _b.network, network = _d === void 0 ? null : _d;
            return __awaiter(this, void 0, void 0, function () {
                var error_3, peer;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!refresh) return [3 /*break*/, 4];
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, dispatch('refresh', network)];
                        case 2:
                            _e.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _e.sent();
                            this._vm.$error(i18n.t('PEER.FAILED_REFRESH') + ": " + error_3.message);
                            return [3 /*break*/, 4];
                        case 4:
                            peer = network ? getters.best(true, network.id) : getters.best();
                            if (!peer) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, dispatch('updateCurrentPeerStatus', peer)];
                        case 5:
                            peer = _e.sent();
                            if (!peer) {
                                return [2 /*return*/, dispatch('findBest', {
                                        refresh: true,
                                        network: network
                                    })];
                            }
                            return [2 /*return*/, peer];
                    }
                });
            });
        },
        /**
         * Update to the best peer for current network.
         * @param  {Boolean} [refresh=true]
         * @param  {Boolean} [skipIfCustom=true]
         * @return {(Object|null)}
         */
        connectToBest: function (_a, _b) {
            var dispatch = _a.dispatch, getters = _a.getters;
            var _c = _b.refresh, refresh = _c === void 0 ? true : _c, _d = _b.skipIfCustom, skipIfCustom = _d === void 0 ? true : _d;
            return __awaiter(this, void 0, void 0, function () {
                var currentPeer, peer;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!skipIfCustom) return [3 /*break*/, 2];
                            currentPeer = getters.current();
                            if (!(!isEmpty(currentPeer) && currentPeer.isCustom)) return [3 /*break*/, 2];
                            // TODO only when necessary (when / before sending) (if no dynamic)
                            return [4 /*yield*/, dispatch('transaction/updateStaticFees', null, { root: true })];
                        case 1:
                            // TODO only when necessary (when / before sending) (if no dynamic)
                            _e.sent();
                            return [2 /*return*/, null];
                        case 2: return [4 /*yield*/, dispatch('findBest', {
                                refresh: refresh
                            })];
                        case 3:
                            peer = _e.sent();
                            return [4 /*yield*/, dispatch('setCurrentPeer', peer)];
                        case 4:
                            _e.sent();
                            return [2 /*return*/, peer];
                    }
                });
            });
        },
        ensureStillValid: function (_a, peer) {
            var rootGetters = _a.rootGetters;
            return __awaiter(this, void 0, void 0, function () {
                var networkConfig;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!peer) {
                                throw new Error('Not connected to peer');
                            }
                            return [4 /*yield*/, ClientService.fetchNetworkConfig(getBaseUrl(peer))];
                        case 1:
                            networkConfig = _b.sent();
                            if (networkConfig.nethash !== rootGetters['session/network'].nethash) {
                                throw new Error('Wrong network');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        fallbackToSeedPeer: function (_a) {
            var dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            dispatch('set', []);
                            dispatch('setCurrentPeer', null);
                            return [4 /*yield*/, dispatch('connectToBest', { skipIfCustom: false })];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * Update peer status.
         * @param  {Object} [port]
         * @return {(Object|void)}
         */
        updateCurrentPeerStatus: function (_a, currentPeer) {
            var dispatch = _a.dispatch, getters = _a.getters;
            return __awaiter(this, void 0, void 0, function () {
                var updateCurrentPeer, delayStart, peerStatus, client, latency, error_4;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            updateCurrentPeer = false;
                            if (isEmpty(currentPeer)) {
                                currentPeer = __assign({}, getters.current());
                                updateCurrentPeer = true;
                            }
                            if (!isEmpty(currentPeer)) return [3 /*break*/, 2];
                            return [4 /*yield*/, dispatch('fallbackToSeedPeer')];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                        case 2:
                            _b.trys.push([2, 12, , 15]);
                            if (!updateCurrentPeer) return [3 /*break*/, 4];
                            return [4 /*yield*/, dispatch('ensureStillValid', currentPeer)];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4:
                            delayStart = performance.now();
                            peerStatus = void 0;
                            if (!updateCurrentPeer) return [3 /*break*/, 6];
                            return [4 /*yield*/, this._vm.$client.fetchPeerStatus()];
                        case 5:
                            peerStatus = _b.sent();
                            return [3 /*break*/, 8];
                        case 6:
                            client = new ClientService();
                            client.host = getBaseUrl(currentPeer);
                            client.client.withOptions({ timeout: 3000 });
                            return [4 /*yield*/, client.fetchPeerStatus()];
                        case 7:
                            peerStatus = _b.sent();
                            _b.label = 8;
                        case 8:
                            latency = (performance.now() - delayStart).toFixed(0);
                            currentPeer = __assign(__assign({}, currentPeer), { latency: +latency, height: +peerStatus.height, lastUpdated: new Date() });
                            if (!updateCurrentPeer) return [3 /*break*/, 10];
                            return [4 /*yield*/, dispatch('setCurrentPeer', currentPeer)];
                        case 9:
                            _b.sent();
                            return [3 /*break*/, 11];
                        case 10: return [2 /*return*/, currentPeer];
                        case 11: return [3 /*break*/, 15];
                        case 12:
                            error_4 = _b.sent();
                            if (!updateCurrentPeer) return [3 /*break*/, 14];
                            return [4 /*yield*/, dispatch('fallbackToSeedPeer')];
                        case 13:
                            _b.sent();
                            _b.label = 14;
                        case 14: return [3 /*break*/, 15];
                        case 15: return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * Create client service object for a peer.
         * @param  {Object} peer
         * @return {ClientService}
         */
        clientServiceFromPeer: function (_, peer) {
            return __awaiter(this, void 0, void 0, function () {
                var client;
                return __generator(this, function (_a) {
                    client = new ClientService();
                    client.host = getBaseUrl(peer);
                    client.client.withOptions({ timeout: 3000 });
                    return [2 /*return*/, client];
                });
            });
        },
        /**
         * Validate custom peer, used to check it's acceptable to connect.
         * @param  {String} ip
         * @param  {Number} port
         * @param  {Number} [ignoreNetwork=false]
         * @param  {Number} [timeout=3000]
         * @return {(Object|String)}
         */
        validatePeer: function (_a, _b) {
            var rootGetters = _a.rootGetters;
            var host = _b.host, ip = _b.ip, port = _b.port, nethash = _b.nethash, _c = _b.ignoreNetwork, ignoreNetwork = _c === void 0 ? false : _c, _d = _b.timeout, timeout = _d === void 0 ? 3000 : _d;
            return __awaiter(this, void 0, void 0, function () {
                var networkConfig, baseUrl, schemeUrl, error_5, client, peerStatus, error_6;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!host && ip) {
                                host = ip;
                            }
                            baseUrl = host + ":" + port;
                            schemeUrl = host.match(/^(https?:\/\/)+(.+)$/);
                            if (!schemeUrl) {
                                baseUrl = "http://" + baseUrl;
                            }
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, ClientService.fetchNetworkConfig(baseUrl, timeout)];
                        case 2:
                            networkConfig = _e.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_5 = _e.sent();
                            console.error('Could not get network config:', error_5);
                            return [3 /*break*/, 4];
                        case 4:
                            if (!networkConfig) {
                                return [2 /*return*/, i18n.t('PEER.NO_CONNECT')];
                            }
                            else if (!ignoreNetwork && networkConfig.nethash !== (nethash || rootGetters['session/network'].nethash)) {
                                return [2 /*return*/, i18n.t('PEER.WRONG_NETWORK')];
                            }
                            client = new ClientService();
                            client.host = baseUrl;
                            client.client.withOptions({ timeout: 3000 });
                            _e.label = 5;
                        case 5:
                            _e.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, client.fetchPeerStatus()];
                        case 6:
                            peerStatus = _e.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            error_6 = _e.sent();
                            return [3 /*break*/, 8];
                        case 8:
                            if (!peerStatus) {
                                return [2 /*return*/, i18n.t('PEER.STATUS_CHECK_FAILED')];
                            }
                            return [2 /*return*/, {
                                    ip: schemeUrl ? schemeUrl[2] : host,
                                    host: baseUrl,
                                    port: +port,
                                    height: peerStatus.height,
                                    status: 'OK',
                                    latency: 0,
                                    isHttps: schemeUrl && schemeUrl[1] === 'https://'
                                }];
                    }
                });
            });
        }
    }
};
//# sourceMappingURL=index.js.map