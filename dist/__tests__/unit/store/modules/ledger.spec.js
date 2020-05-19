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
import { Identities } from '@arkecosystem/crypto';
import apiClient, { client as ClientService } from '@/plugins/api-client';
import LedgerModule from '@/store/modules/ledger';
import ledgerService from '@/services/ledger-service';
import testWallets from '../../__fixtures__/store/ledger';
import logger from 'electron-log';
Vue.use(Vuex);
Vue.use(apiClient);
logger.error = jest.fn();
var ledgerNameByAddress = function () { return null; };
var sessionNetwork = jest.fn();
var ledgerCache = false;
var nethash = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867';
var store = new Vuex.Store({
    modules: {
        ledger: LedgerModule,
        session: {
            namespaced: true,
            getters: {
                ledgerCache: function () {
                    return ledgerCache;
                },
                profile: function () {
                    return {
                        networkId: 'abc'
                    };
                },
                profileId: function () {
                    return 'profile id';
                },
                network: function () {
                    return sessionNetwork();
                }
            }
        },
        wallet: {
            namespaced: true,
            getters: {
                ledgerNameByAddress: function () { return function (address) {
                    return ledgerNameByAddress(address);
                }; }
            }
        }
    },
    strict: true
});
var spyConnect;
var disconnectLedger = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spyConnect = jest.spyOn(ledgerService, 'connect').mockImplementation(function () { return false; });
                return [4 /*yield*/, store.dispatch('ledger/disconnect')];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var initialState = JSON.parse(JSON.stringify(store.state));
beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (spyConnect) {
            spyConnect.mockRestore();
        }
        store.replaceState(JSON.parse(JSON.stringify(initialState)));
        sessionNetwork.mockReturnValue({
            id: 'abc',
            nethash: nethash,
            constants: {
                aip11: false
            }
        });
        store._vm.$error = jest.fn();
        ClientService.host = 'http://127.0.0.1';
        ledgerNameByAddress = function () { return null; };
        nock.cleanAll();
        return [2 /*return*/];
    });
}); });
describe('ledger store module', function () {
    it('should init ledger service', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, store.dispatch('ledger/init', 1234)];
                case 1:
                    _a.sent();
                    expect(store.state.ledger.slip44).toBe(1234);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should set slip44 value', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, store.dispatch('ledger/init', 4567)];
                case 1:
                    _a.sent();
                    expect(store.state.ledger.slip44).toBe(4567);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('updateVersion', function () {
        it('should not show error if disconnected', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionNetwork.mockReturnValue({
                            id: 'abc',
                            nethash: nethash,
                            constants: {
                                aip11: true
                            }
                        });
                        return [4 /*yield*/, store.dispatch('ledger/connect')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, store.dispatch('ledger/setSlip44', 1234)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, disconnectLedger()];
                    case 3:
                        _a.sent();
                        store._vm.$error.mockReset();
                        return [4 /*yield*/, store.dispatch('ledger/updateVersion')];
                    case 4:
                        _a.sent();
                        expect(store._vm.$error).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not show error if aip11 is false', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.dispatch('ledger/updateVersion')];
                    case 1:
                        _a.sent();
                        expect(store._vm.$error).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should show error if aip11 is true', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionNetwork.mockReturnValue({
                            id: 'abc',
                            nethash: nethash,
                            constants: {
                                aip11: true
                            }
                        });
                        return [4 /*yield*/, store.dispatch('ledger/connect')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, store.dispatch('ledger/setSlip44', 1234)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, store.dispatch('ledger/updateVersion')];
                    case 3:
                        _a.sent();
                        expect(store._vm.$error).toHaveBeenCalledWith('Ledger update available! Please update the ARK app via Ledger Live to send transactions on this network', 10000);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getVersion', function () {
        it('should return version', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, store.dispatch('ledger/getVersion')];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual('1.0.0');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail when not connected', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, disconnectLedger()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expect(store.dispatch('ledger/getVersion')).rejects.toThrow(/.*Ledger not connected$/)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getWallet', function () {
        it('should return address and publicKey', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, store.dispatch('ledger/getWallet', 1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual({
                            address: 'DLWeBuwSBFYtUFj8kFB8CFswfvN2ht3yKn',
                            publicKey: '0278a28d0eac9916ef46613d9dbac706acc218e64864d4b4c1fcb0c759b6205b2b'
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with invalid accountIndex', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect(store.dispatch('ledger/getWallet')).rejects.toThrow(/.*accountIndex must be a Number$/)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail when not connected', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, disconnectLedger()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expect(store.dispatch('ledger/getWallet', 1)).rejects.toThrow(/.*Ledger not connected$/)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getAddress', function () {
        it('should call ledger service', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.dispatch('ledger/connect')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, store.dispatch('ledger/setSlip44', 1234)];
                    case 2:
                        _a.sent();
                        spy = jest.spyOn(ledgerService, 'getPublicKey').mockReturnValue('PUBLIC_KEY');
                        return [4 /*yield*/, store.dispatch('ledger/getPublicKey', 1)];
                    case 3:
                        response = _a.sent();
                        expect(response).toBe('PUBLIC_KEY');
                        expect(spy).toHaveBeenNthCalledWith(1, '44\'/1234\'/1\'/0/0');
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with invalid accountIndex', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect(store.dispatch('ledger/getAddress')).rejects.toThrow(/.*accountIndex must be a Number$/)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail when not connected', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, disconnectLedger()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expect(store.dispatch('ledger/getAddress', 1)).rejects.toThrow(/.*Ledger not connected$/)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getPublicKey', function () {
        it('should call ledger service', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.dispatch('ledger/connect')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, store.dispatch('ledger/setSlip44', 1234)];
                    case 2:
                        _a.sent();
                        spy = jest.spyOn(ledgerService, 'getPublicKey').mockReturnValue('PUBLIC_KEY');
                        return [4 /*yield*/, store.dispatch('ledger/getPublicKey', 1)];
                    case 3:
                        response = _a.sent();
                        expect(response).toBe('PUBLIC_KEY');
                        expect(spy).toHaveBeenNthCalledWith(1, '44\'/1234\'/1\'/0/0');
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with invalid accountIndex', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect(store.dispatch('ledger/getPublicKey')).rejects.toThrow(/.*accountIndex must be a Number$/)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail when not connected', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, disconnectLedger()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expect(store.dispatch('ledger/getPublicKey', 1)).rejects.toThrow(/.*Ledger not connected$/)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('signTransaction', function () {
        it('should call ledger service', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.dispatch('ledger/connect')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, store.dispatch('ledger/setSlip44', 1234)];
                    case 2:
                        _a.sent();
                        spy = jest.spyOn(ledgerService, 'signTransaction').mockReturnValue('SIGNATURE');
                        return [4 /*yield*/, store.dispatch('ledger/signTransaction', {
                                accountIndex: 1,
                                transactionBytes: Buffer.from([1, 2, 3, 4])
                            })];
                    case 3:
                        response = _a.sent();
                        expect(response).toBe('SIGNATURE');
                        expect(spy).toHaveBeenNthCalledWith(1, '44\'/1234\'/1\'/0/0', Buffer.from([1, 2, 3, 4]));
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with invalid accountIndex', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect(store.dispatch('ledger/signTransaction')).rejects.toThrow(/.*accountIndex must be a Number$/)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail when not connected', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, disconnectLedger()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expect(store.dispatch('ledger/signTransaction', {
                                accountIndex: 1,
                                transactionBytes: Buffer.from('abc', 'utf-8')
                            })).rejects.toThrow(/.*Ledger not connected$/)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('signMessage', function () {
        it('should call ledger service', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.dispatch('ledger/connect')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, store.dispatch('ledger/setSlip44', 1234)];
                    case 2:
                        _a.sent();
                        spy = jest.spyOn(ledgerService, 'signMessage').mockReturnValue('SIGNATURE');
                        return [4 /*yield*/, store.dispatch('ledger/signMessage', {
                                accountIndex: 1,
                                messageBytes: Buffer.from('abc', 'utf-8')
                            })];
                    case 3:
                        response = _a.sent();
                        expect(response).toBe('SIGNATURE');
                        expect(spy).toHaveBeenNthCalledWith(1, '44\'/1234\'/1\'/0/0', Buffer.from('abc', 'utf-8'));
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with invalid accountIndex', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect(store.dispatch('ledger/signMessage')).rejects.toThrow(/.*accountIndex must be a Number$/)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail when not connected', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, disconnectLedger()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expect(store.dispatch('ledger/signMessage', {
                                accountIndex: 1,
                                messageBytes: Buffer.from('abc', 'utf-8')
                            })).rejects.toThrow(/.*Ledger not connected$/)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('reloadWallets', function () {
        var spyGetWallet;
        var spyCryptoGetAddress;
        var ledgerWallets;
        var expectedWallets;
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletId, wallet, newWallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (spyGetWallet) {
                            spyGetWallet.mockRestore();
                        }
                        if (spyCryptoGetAddress) {
                            spyCryptoGetAddress.mockRestore();
                        }
                        spyGetWallet = jest.spyOn(ledgerService, 'getPublicKey').mockImplementation(function (path) {
                            var matches = path.match(/^44'+\/.+'\/([0-9]+)'\/0\/0/);
                            return testWallets[matches[1]].publicKey;
                        });
                        spyCryptoGetAddress = jest.spyOn(Identities.Address, 'fromPublicKey').mockImplementation(function (publicKey) {
                            return testWallets.find(function (wallet) { return wallet.publicKey === publicKey; }).address;
                        });
                        ledgerWallets = testWallets.slice(0, 10).map(function (wallet) { return (__assign(__assign({}, wallet), { balance: 10 })); });
                        expectedWallets = {};
                        for (walletId in ledgerWallets) {
                            wallet = ledgerWallets[walletId];
                            newWallet = __assign(__assign({}, wallet), { isLedger: true, isSendingEnabled: true, name: "Ledger " + (+walletId + 1), passphrase: null, profileId: 'profile id', id: wallet.address, ledgerIndex: +walletId });
                            if (wallet.address === 'address 10') {
                                newWallet.balance = 0;
                                newWallet.isCold = true;
                            }
                            expectedWallets[wallet.address] = newWallet;
                        }
                        return [4 /*yield*/, store.dispatch('ledger/connect')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not start if not connected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, disconnectLedger()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, store.dispatch('ledger/reloadWallets')];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toEqual({});
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not start if already loading', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        store.commit('ledger/SET_LOADING', 'test');
                        _a = expect;
                        return [4 /*yield*/, store.dispatch('ledger/reloadWallets')];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual({});
                        return [2 /*return*/];
                }
            });
        }); });
        it('should mark all other processes to stop on force reload', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        store.commit('ledger/SET_LOADING', 'test1');
                        store.commit('ledger/SET_LOADING', 'test2');
                        store.commit('ledger/SET_LOADING', 'test3');
                        expect(store.getters['ledger/isLoading']).toBeTruthy();
                        expect(store.getters['ledger/isConnected']).toBeTruthy();
                        return [4 /*yield*/, store.dispatch('ledger/reloadWallets', {
                                clearFirst: false,
                                forceLoad: true,
                                quantity: null
                            })];
                    case 1:
                        _a.sent();
                        expect(store.getters['ledger/shouldStopLoading']('test1')).toEqual(true);
                        expect(store.getters['ledger/shouldStopLoading']('test2')).toEqual(true);
                        expect(store.getters['ledger/shouldStopLoading']('test3')).toEqual(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should load all wallets with multi-wallet search', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        nock('http://127.0.0.1')
                            .persist()
                            .post('/api/wallets/search')
                            .reply(200, {
                            data: ledgerWallets.slice(0, 9)
                        });
                        return [4 /*yield*/, store.commit('ledger/SET_CONNECTED', true)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, store.dispatch('ledger/reloadWallets')];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toEqual(expectedWallets);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should use ledger name', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletId, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ledgerNameByAddress = function (address) { return address; };
                        nock('http://127.0.0.1')
                            .persist()
                            .post('/api/wallets/search')
                            .reply(200, {
                            data: ledgerWallets.slice(0, 9)
                        });
                        for (walletId in expectedWallets) {
                            expectedWallets[walletId].name = expectedWallets[walletId].address;
                        }
                        return [4 /*yield*/, store.commit('ledger/SET_CONNECTED', true)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, store.dispatch('ledger/reloadWallets')];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toEqual(expectedWallets);
                        return [2 /*return*/];
                }
            });
        }); });
        xit('should stop if profile changes', function () {
            //
        });
    });
    describe('updateWallet', function () {
        it('should update a single wallet', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        store.commit('ledger/SET_WALLETS', {
                            A1: { address: 'A1', balance: 0 }
                        });
                        return [4 /*yield*/, store.dispatch('ledger/updateWallet', { address: 'A1', balance: 10 })];
                    case 1:
                        _a.sent();
                        expect(store.getters['ledger/wallets']).toEqual([
                            { address: 'A1', balance: 10 }
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error if wallet does not exist', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                expect(store.dispatch('ledger/updateWallet', { address: 'nope' })).rejects.toThrow(/.*not found in ledger wallets$/);
                return [2 /*return*/];
            });
        }); });
    });
    describe('cacheWallets', function () {
        it('should cache if enabled in session', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ledgerCache = true;
                        return [4 /*yield*/, store.commit('ledger/SET_WALLETS', {
                                A1: { address: 'A1', balance: 0 }
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, store.dispatch('ledger/cacheWallets')];
                    case 2:
                        _a.sent();
                        expect(store.getters['ledger/cachedWallets']('A1')).toEqual([{ address: 'A1', balance: 0 }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not cache if disabled in session', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ledgerCache = false;
                        return [4 /*yield*/, store.commit('ledger/SET_WALLETS', {
                                A1: { address: 'A1', balance: 0 }
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, store.dispatch('ledger/cacheWallets')];
                    case 2:
                        _a.sent();
                        expect(store.getters['ledger/cachedWallets']('A1')).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('clearWalletCache', function () {
        it('should clear the cached wallets', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ledgerCache = true;
                        return [4 /*yield*/, store.commit('ledger/SET_WALLETS', {
                                A1: { address: 'A1' }
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, store.dispatch('ledger/cacheWallets')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, store.dispatch('ledger/clearWalletCache')];
                    case 3:
                        _a.sent();
                        expect(store.getters['ledger/cachedWallets']('A1')).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('updateWallets', function () {
        it('should set wallets when the state is empty', function () { return __awaiter(void 0, void 0, void 0, function () {
            var wallets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect(store.getters['ledger/wallets']).toBeArrayOfSize(0);
                        wallets = { A1: { address: 'A1' } };
                        return [4 /*yield*/, store.dispatch('ledger/updateWallets', wallets)];
                    case 1:
                        _a.sent();
                        expect(store.getters['ledger/walletsObject']).toMatchObject(wallets);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not remove existing wallets in the state', function () { return __awaiter(void 0, void 0, void 0, function () {
            var wallets, walletsToUpdate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect(store.getters['ledger/wallets']).toBeArrayOfSize(0);
                        wallets = { A1: { address: 'A1', balance: 0 }, A2: { address: 'A2', balance: 1 } };
                        return [4 /*yield*/, store.dispatch('ledger/updateWallets', wallets)];
                    case 1:
                        _a.sent();
                        expect(store.getters['ledger/wallet']('A2').balance).toBe(1);
                        walletsToUpdate = { A2: { address: 'A2', balance: 0 } };
                        return [4 /*yield*/, store.dispatch('ledger/updateWallets', walletsToUpdate)];
                    case 2:
                        _a.sent();
                        expect(store.getters['ledger/wallet']('A2').balance).toBe(0);
                        expect(store.getters['ledger/wallet']('A1')).toBeObject();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=ledger.spec.js.map