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
import nock from 'nock';
import Vue from 'vue';
import Vuex from 'vuex';
import apiClient, { client } from '@/plugins/api-client';
import store from '@/store';
import peers, { goodPeer1, goodPeer2, goodPeer4, goodPeer5, badPeer1 } from '../../__fixtures__/store/peer';
import { network1 } from '../../__fixtures__/store/network';
import { profile1 } from '../../__fixtures__/store/profile';
Vue.use(Vuex);
Vue.use(apiClient);
var nethash = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867';
var stripPorts = function (peers) {
    var single = !Array.isArray(peers);
    if (single) {
        peers = [peers];
    }
    var response = peers.map(function (peer) {
        var newPeer = {};
        for (var _i = 0, _a = Object.keys(peer); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key === 'ports') {
                continue;
            }
            newPeer[key] = peer[key];
        }
        return newPeer;
    });
    if (single) {
        return response[0];
    }
    return response;
};
beforeAll(function () {
    network1.nethash = nethash;
    store.commit('network/SET_ALL', [network1]);
    store.commit('profile/CREATE', profile1);
    store.commit('session/SET_PROFILE_ID', profile1.id);
    store.dispatch('peer/set', peers);
});
beforeEach(function () {
    nock.cleanAll();
});
describe('peer store module', function () {
    it('should get peer list', function () {
        expect(store.getters['peer/all']()).toIncludeAllMembers(stripPorts(peers));
    });
    it('should get a single peer', function () {
        expect(store.getters['peer/get']('2.2.2.2')).toEqual(stripPorts(goodPeer2));
    });
    it('should get one of the best peers', function () {
        var bestPeer = store.getters['peer/best']();
        expect(bestPeer).toBeOneOf(stripPorts(peers));
        expect(bestPeer).not.toEqual(badPeer1);
    });
    it('should get peers in random order', function () {
        var randomPeers = store.getters['peer/randomPeers']();
        expect(randomPeers[0]).toBeOneOf(stripPorts(peers));
        var randomPeers2 = store.getters['peer/randomPeers']();
        expect(randomPeers).not.toEqual(randomPeers2);
    });
    it('should get random seed server peer', function () {
        var randomSeedPeers = store.getters['peer/randomSeedPeers'](5, 'ark.mainnet');
        var randomSeedPeers2 = store.getters['peer/randomSeedPeers'](5, 'ark.mainnet');
        expect(randomSeedPeers).not.toEqual(randomSeedPeers2);
    });
    it('should get & set current peer', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, peers_1, peer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    for (_i = 0, peers_1 = peers; _i < peers_1.length; _i++) {
                        peer = peers_1[_i];
                        nock("http://" + peer.ip + ":" + peer.port)
                            .get('/api/transactions/fees')
                            .reply(200, {
                            data: {
                                send: 1,
                                secondsignature: 1,
                                delegate: 1,
                                vote: 1
                            }
                        });
                    }
                    return [4 /*yield*/, store.dispatch('peer/setCurrentPeer', goodPeer1)];
                case 1:
                    _a.sent();
                    expect(store.getters['peer/current']()).toEqual(goodPeer1);
                    return [4 /*yield*/, store.dispatch('peer/setCurrentPeer', goodPeer2)];
                case 2:
                    _a.sent();
                    expect(store.getters['peer/current']()).toEqual(goodPeer2);
                    return [4 /*yield*/, store.dispatch('peer/setCurrentPeer', goodPeer4)];
                case 3:
                    _a.sent();
                    expect(store.getters['peer/current']()).toEqual(goodPeer4);
                    return [4 /*yield*/, store.dispatch('peer/setCurrentPeer', goodPeer5)];
                case 4:
                    _a.sent();
                    expect(store.getters['peer/current']()).toEqual(goodPeer5);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return false if no initial peer', function () {
        store.commit('peer/SET_CURRENT_PEER', { peer: null, networkId: network1.id });
        expect(store.getters['peer/current']()).toEqual(false);
    });
    it('should get a last updated date', function () {
        expect(store.getters['peer/lastUpdated']).toBeTruthy();
    });
    it('should reset peer list', function () {
        store.dispatch('peer/set', [goodPeer1, goodPeer2]);
        var result = stripPorts([goodPeer1, goodPeer2]);
        expect(store.getters['peer/all']()).toIncludeAllMembers(result);
    });
    it('should connect to best peer', function () { return __awaiter(void 0, void 0, void 0, function () {
        var peerResponse, _i, peers_2, peer, bestPeer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    peerResponse = peers.filter(function (peer) { return peer.ip !== goodPeer1.ip; });
                    for (_i = 0, peers_2 = peers; _i < peers_2.length; _i++) {
                        peer = peers_2[_i];
                        nock("http://" + peer.ip + ":" + peer.port)
                            .persist()
                            .get('/api/node/syncing')
                            .reply(200, {
                            data: {
                                height: 20000
                            }
                        })
                            .get('/api/node/configuration')
                            .reply(200, {
                            data: {
                                nethash: nethash
                            }
                        })
                            .get('/api/blocks/getEpoch')
                            .reply(200, {
                            epoch: new Date()
                        })
                            .get('/api/transactions/fees')
                            .reply(200, {
                            data: {
                                send: 1,
                                secondsignature: 1,
                                delegate: 1,
                                vote: 1
                            }
                        })
                            .get('/api/peers')
                            .reply(200, {
                            data: peerResponse
                        });
                    }
                    return [4 /*yield*/, store.dispatch('peer/setCurrentPeer', goodPeer1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, store.dispatch('peer/connectToBest', { refresh: false })];
                case 2:
                    bestPeer = _a.sent();
                    expect(bestPeer).toEqual(store.getters['peer/current']());
                    expect(bestPeer.ip).toBeOneOf(peerResponse.map(function (peer) { return peer.ip; }));
                    expect(bestPeer.ip).not.toEqual(badPeer1.ip);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should refresh peer list for v2', function () { return __awaiter(void 0, void 0, void 0, function () {
        var goodV2Peer, badV2Peer, refreshPeers, _i, refreshPeers_1, peer, allPeers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    goodV2Peer = __assign(__assign({}, goodPeer1), { version: '2.0.0' });
                    badV2Peer = __assign(__assign({}, badPeer1), { ip: '5.5.5.5', version: '1.0.0' });
                    refreshPeers = [goodV2Peer, badV2Peer];
                    nock("http://" + goodPeer1.ip + ":" + goodPeer1.ports['@arkecosystem/core-api'])
                        .persist()
                        .get('/api/transactions/fees')
                        .reply(200, {
                        data: {
                            send: 1,
                            secondsignature: 1,
                            delegate: 1,
                            vote: 1
                        }
                    });
                    for (_i = 0, refreshPeers_1 = refreshPeers; _i < refreshPeers_1.length; _i++) {
                        peer = refreshPeers_1[_i];
                        nock("http://" + peer.ip + ":" + peer.ports['@arkecosystem/core-api'])
                            .persist()
                            .get('/api/peers')
                            .reply(200, {
                            data: refreshPeers
                        });
                    }
                    return [4 /*yield*/, store.dispatch('peer/setCurrentPeer', goodPeer1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, store.dispatch('peer/refresh')];
                case 2:
                    _a.sent();
                    allPeers = store.getters['peer/all']();
                    expect(allPeers.length).toEqual(1);
                    expect(allPeers[0]).toContainEntries([
                        ['ip', goodV2Peer.ip],
                        ['height', goodV2Peer.height],
                        ['latency', goodV2Peer.latency],
                        ['port', goodV2Peer.port]
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update v2 peer status on the fly', function () { return __awaiter(void 0, void 0, void 0, function () {
        var goodV2Peer, host, updatedPeer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    goodV2Peer = __assign(__assign({}, goodPeer1), { version: '2.0.0' });
                    host = "http://" + goodV2Peer.ip + ":" + goodV2Peer.port;
                    client.host = host;
                    nock(host)
                        .get('/api/node/syncing')
                        .reply(200, {
                        data: {
                            height: 21000
                        }
                    })
                        .get('/api/node/configuration')
                        .reply(200, {
                        data: {
                            constants: {},
                            nethash: nethash
                        }
                    });
                    return [4 /*yield*/, store.dispatch('peer/updateCurrentPeerStatus', goodV2Peer)];
                case 1:
                    updatedPeer = _a.sent();
                    expect(updatedPeer.height).toBe(21000);
                    expect(updatedPeer.latency).not.toBe(123);
                    expect(updatedPeer.lastUpdated).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update current peer status', function () { return __awaiter(void 0, void 0, void 0, function () {
        var currentPeer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock("http://" + goodPeer1.ip + ":" + goodPeer1.port)
                        .persist()
                        .get('/api/node/configuration')
                        .reply(200, {
                        data: {
                            constants: {
                                vendorFieldLength: 255
                            },
                            nethash: nethash
                        }
                    })
                        .get('/api/node/syncing')
                        .reply(200, {
                        data: {
                            height: 10000
                        }
                    })
                        .get('/api/transactions/fees')
                        .reply(200, {
                        data: {
                            send: 1,
                            secondsignature: 1,
                            delegate: 1,
                            vote: 1
                        }
                    });
                    return [4 /*yield*/, store.dispatch('peer/setCurrentPeer', goodPeer1)];
                case 1:
                    _a.sent();
                    client.host = "http://" + goodPeer1.ip + ":" + goodPeer1.port;
                    return [4 /*yield*/, store.dispatch('peer/updateCurrentPeerStatus')];
                case 2:
                    _a.sent();
                    currentPeer = store.getters['peer/current']();
                    expect(currentPeer.height).toBe(10000);
                    expect(currentPeer.latency).not.toBe(123);
                    expect(currentPeer.lastUpdated).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should validate a v2 peer successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock("http://" + goodPeer1.ip + ":" + goodPeer1.port)
                        .get('/api/node/configuration')
                        .reply(200, {
                        data: {
                            constants: {},
                            nethash: nethash
                        }
                    })
                        .get('/api/node/syncing')
                        .reply(200, {
                        data: {
                            height: 10002
                        }
                    });
                    return [4 /*yield*/, store.dispatch('peer/validatePeer', __assign(__assign({}, goodPeer1), { timeout: 100 }))];
                case 1:
                    response = _a.sent();
                    expect(response).toBeObject();
                    expect(response).toContainEntries([
                        ['height', 10002],
                        ['latency', 0]
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should validate a v2 https peer successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock("https://" + goodPeer1.ip + ":" + goodPeer1.port)
                        .get('/api/node/configuration')
                        .reply(200, {
                        data: {
                            constants: {},
                            nethash: nethash
                        }
                    })
                        .get('/api/node/syncing')
                        .reply(200, {
                        data: {
                            height: 10002
                        }
                    });
                    return [4 /*yield*/, store.dispatch('peer/validatePeer', __assign(__assign({}, goodPeer1), { host: "https://" + goodPeer1.ip, timeout: 100 }))];
                case 1:
                    response = _a.sent();
                    expect(response).toBeObject();
                    expect(response).toContainEntries([
                        ['height', 10002],
                        ['latency', 0]
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should fail validating a v2 peer due to bad network url', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock("http://" + goodPeer1.ip + ":" + goodPeer1.port)
                        .get('/api/node/configuration')
                        .reply(400);
                    return [4 /*yield*/, store.dispatch('peer/validatePeer', __assign(__assign({}, goodPeer1), { timeout: 100 }))];
                case 1:
                    response = _a.sent();
                    expect(response).toEqual(expect.stringMatching(/^Could not connect$/));
                    return [2 /*return*/];
            }
        });
    }); });
    it('should fail validating a v2 peer due to bad sync status url', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock("http://" + goodPeer1.ip + ":" + goodPeer1.port)
                        .get('/api/node/configuration')
                        .reply(200, {
                        data: {
                            constants: {},
                            nethash: nethash
                        }
                    })
                        .get('/api/node/syncing')
                        .reply(400);
                    return [4 /*yield*/, store.dispatch('peer/validatePeer', __assign(__assign({}, goodPeer1), { timeout: 100 }))];
                case 1:
                    response = _a.sent();
                    expect(response).toEqual(expect.stringMatching(/^Status check failed$/));
                    return [2 /*return*/];
            }
        });
    }); });
    it('should fail validating a v2 peer because of wrong nethash', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock("http://" + goodPeer1.ip + ":" + goodPeer1.port)
                        .persist()
                        .get('/api/node/configuration')
                        .reply(200, {
                        data: {
                            constants: {},
                            nethash: 'wrong nethash'
                        }
                    });
                    return [4 /*yield*/, store.dispatch('peer/validatePeer', __assign(__assign({}, goodPeer1), { timeout: 100 }))];
                case 1:
                    response = _a.sent();
                    expect(response).toEqual(expect.stringMatching(/^Wrong network$/));
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=peer.spec.js.map