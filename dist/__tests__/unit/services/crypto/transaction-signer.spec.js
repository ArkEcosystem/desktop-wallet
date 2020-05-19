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
import { cloneDeep } from 'lodash';
import nock from 'nock';
import { Identities, Managers, Transactions } from '@arkecosystem/crypto';
import { TransactionSigner } from '@/services/crypto/transaction-signer';
import BigNumber from '@/plugins/bignumber';
import store from '@/store';
import TransactionService from '@/services/transaction';
import WalletService from '@/services/wallet';
import { CryptoUtils } from '@/services/crypto/utils';
var sessionNetwork = Object.freeze({
    nethash: 'test-nethash',
    constants: {
        epoch: '2017-03-21T13:00:00.000Z',
        aip11: false
    },
    vendorField: {
        maxLength: 64
    }
});
jest.mock('@/store', function () { return ({
    // __mock__: {
    // },
    getters: {
        'session/profile': {
            id: 'test-profile'
        },
        'session/network': {},
        'network/byId': function (id) {
            var version = 23;
            if (id === 'ark.devnet') {
                version = 30;
            }
            return {
                constants: {
                    epoch: '2017-03-21T13:00:00.000Z'
                },
                version: version
            };
        },
        'delegate/byAddress': function (address) {
            if (address === 'DTRdbaUW3RQQSL5By4G43JVaeHiqfVp9oh') {
                return {
                    username: 'test',
                    address: address,
                    publicKey: '034da006f958beba78ec54443df4a3f52237253f7ae8cbdb17dccf3feaa57f3126'
                };
            }
        },
        'transaction/staticFee': function (type, group) {
            if (group === void 0) { group = 1; }
            var fees = {
                1: [
                    0.1 * 1e8,
                    5 * 1e8,
                    25 * 1e8,
                    1 * 1e8,
                    5 * 1e8,
                    5 * 1e8,
                    1 * 1e8,
                    25 * 1e8 // Delegate resignation
                ],
                2: [
                    50 * 1e8,
                    50 * 1e8,
                    50 * 1e8,
                    50 * 1e8,
                    50 * 1e8,
                    50 * 1e8 // Bridgechain Update
                ]
            };
            return fees[group][type];
        },
        'peer/current': function () { return ({
            ip: '1.1.1.1',
            port: '8080',
            isHttps: false
        }); },
        'peer/broadcastPeers': function () { return [
            {
                ip: '1.1.1.1',
                port: '8080',
                isHttps: false
            },
            {
                ip: '2.2.2.2',
                port: '8080',
                isHttps: false
            }
        ]; }
    },
    dispatch: jest.fn(),
    watch: jest.fn(function () {
        // getter()
        // require('@/store').__mock__.watch = {
        //   getter: getter(),
        //   getter: callback(),
        //   options
        // }
    })
}); });
var setAip11AndSpy = function (enabled, spy) {
    if (enabled === void 0) { enabled = true; }
    if (spy === void 0) { spy = true; }
    var network = __assign(__assign({}, sessionNetwork), { constants: __assign(__assign({}, sessionNetwork.constants), { aip11: enabled }) });
    Managers.configManager.getMilestone().aip11 = enabled;
    store.getters['session/network'] = network;
    if (!spy) {
        return;
    }
    return jest.spyOn(store.getters, 'network/byId').mockReturnValue(network);
};
beforeEach(function () {
    Managers.configManager.setFromPreset('testnet');
    store.getters['session/network'] = cloneDeep(sessionNetwork);
    nock.cleanAll();
});
afterEach(function () { return jest.clearAllMocks(); });
describe('Services > Client', function () {
    describe('sign', function () {
        var address = Identities.Address.fromPassphrase('passphrase', 23);
        var publicKey = Identities.PublicKey.fromPassphrase('passphrase');
        var passphrase = 'passphrase';
        var secondPassphrase = 'second passphrase';
        var transaction;
        var signData;
        beforeEach(function () {
            transaction = Transactions.BuilderFactory
                .transfer()
                .amount(new BigNumber(1 * 1e8))
                .fee(new BigNumber(0.1 * 1e8))
                .recipientId(address)
                .vendorField('test vendorfield');
            signData = {
                address: address,
                transaction: transaction,
                passphrase: passphrase,
                secondPassphrase: secondPassphrase,
                networkWif: 170,
                networkId: 'ark.mainnet',
                nonce: '1'
            };
        });
        it('should sign transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setAip11AndSpy(false, false);
                        return [4 /*yield*/, TransactionSigner.sign(signData)];
                    case 1:
                        response = _a.sent();
                        expect(response.vendorField).toEqual(transaction.data.vendorField);
                        expect(response.amount).toBe(new BigNumber(1 * 1e8).toString());
                        expect(response.fee).toBe(new BigNumber(0.1 * 1e8).toString());
                        expect(response.senderPublicKey).toEqual(publicKey);
                        expect(response.type).toEqual(0);
                        expect(response.version).toEqual(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get network from session if no id', function () { return __awaiter(void 0, void 0, void 0, function () {
            var networkByIdSpy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        networkByIdSpy = jest.spyOn(store.getters, 'network/byId');
                        return [4 /*yield*/, TransactionSigner.sign(__assign(__assign({}, signData), { networkId: null }))];
                    case 1:
                        _a.sent();
                        expect(networkByIdSpy).not.toHaveBeenCalled();
                        networkByIdSpy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get network by id if provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var networkByIdSpy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        networkByIdSpy = jest.spyOn(store.getters, 'network/byId');
                        return [4 /*yield*/, TransactionSigner.sign(signData)];
                    case 1:
                        _a.sent();
                        expect(networkByIdSpy).toHaveBeenCalledWith('ark.mainnet');
                        networkByIdSpy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should normalize passphrase if provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(CryptoUtils, 'normalizePassphrase');
                        return [4 /*yield*/, TransactionSigner.sign(signData)];
                    case 1:
                        _a.sent();
                        expect(spy).toHaveBeenCalledWith(signData.passphrase);
                        expect(spy).toHaveBeenCalledWith(signData.secondPassphrase);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not normalize if no passphrase is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, wif;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(CryptoUtils, 'normalizePassphrase');
                        wif = Identities.WIF.fromPassphrase(passphrase, { wif: 170 });
                        return [4 /*yield*/, TransactionSigner.sign(__assign(__assign({}, signData), { passphrase: null, secondPassphrase: null, wif: wif }))];
                    case 1:
                        _a.sent();
                        expect(spy).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should create v1 transaction if aip11 disabled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, TransactionSigner.sign(signData)];
                    case 1:
                        response = _a.sent();
                        expect(response.version).toBe(1);
                        expect(response.nonce).toBeFalsy();
                        expect(response.timestamp).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should create v2 transaction if aip11 enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = setAip11AndSpy(true);
                        return [4 /*yield*/, TransactionSigner.sign(signData)];
                    case 1:
                        response = _a.sent();
                        spy.mockRestore();
                        expect(response.version).toBe(2);
                        expect(response.nonce).toBe('1');
                        return [2 /*return*/];
                }
            });
        }); });
        it.skip('should increment nonce of wallet', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = setAip11AndSpy(true);
                        nock('http://127.0.0.1:4003')
                            .get("/api/v2/wallets/" + address)
                            .reply(200, {
                            data: {
                                nonce: 3
                            }
                        });
                        return [4 /*yield*/, TransactionSigner.sign(signData)];
                    case 1:
                        response = _a.sent();
                        spy.mockRestore();
                        expect(response.version).toBe(2);
                        expect(response.nonce).toBe('4');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should default nonce to 0 if no wallet', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = setAip11AndSpy(true);
                        nock('http://127.0.0.1:4003')
                            .get("/api/v2/wallets/" + address)
                            .reply(200, {
                            data: {}
                        });
                        return [4 /*yield*/, TransactionSigner.sign(signData)];
                    case 1:
                        response = _a.sent();
                        spy.mockRestore();
                        expect(response.version).toBe(2);
                        expect(response.nonce).toBe('1');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should sign with passphrase', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, spySignPassphrase, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = setAip11AndSpy(true);
                        spySignPassphrase = jest.spyOn(transaction, 'sign');
                        return [4 /*yield*/, TransactionSigner.sign(signData)];
                    case 1:
                        response = _a.sent();
                        spy.mockRestore();
                        expect(response.version).toBe(2);
                        expect(response.nonce).toBe('1');
                        expect(spySignPassphrase).toHaveBeenCalledWith(passphrase);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should sign with second passphrase', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, spySecondSignPassphrase, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = setAip11AndSpy(true);
                        spySecondSignPassphrase = jest.spyOn(transaction, 'secondSign');
                        return [4 /*yield*/, TransactionSigner.sign(signData)];
                    case 1:
                        response = _a.sent();
                        spy.mockRestore();
                        expect(response.version).toBe(2);
                        expect(response.nonce).toBe('1');
                        expect(spySecondSignPassphrase).toHaveBeenCalledWith(secondPassphrase);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should sign with wif', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, spySignWif, wif, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = setAip11AndSpy(true);
                        spySignWif = jest.spyOn(transaction, 'signWithWif');
                        wif = Identities.WIF.fromPassphrase(passphrase, { wif: 170 });
                        return [4 /*yield*/, TransactionSigner.sign(__assign(__assign({}, signData), { passphrase: null, secondPassphrase: null, wif: wif, nonce: '1' }))];
                    case 1:
                        response = _a.sent();
                        spy.mockRestore();
                        expect(response.version).toBe(2);
                        expect(response.nonce).toBe('1');
                        expect(spySignWif).toHaveBeenCalledWith(wif, 170);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return object', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = setAip11AndSpy(true);
                        return [4 /*yield*/, TransactionSigner.sign(signData, true)];
                    case 1:
                        response = _a.sent();
                        spy.mockRestore();
                        expect(response.data).toBeTruthy();
                        expect(response.constructor.name).toBe('TransferBuilder');
                        return [2 /*return*/];
                }
            });
        }); });
        describe('multiSignature', function () {
            var minKeys = 3;
            var multiSignature;
            var publicKeys;
            var aip11Spy;
            beforeEach(function () {
                publicKeys = [];
                for (var i = 0; i < 5; i++) {
                    publicKeys.push(Identities.PublicKey.fromPassphrase("passphrase " + i));
                }
                multiSignature = {
                    publicKeys: publicKeys,
                    min: minKeys
                };
                aip11Spy = setAip11AndSpy(true);
            });
            afterEach(function () {
                aip11Spy.mockRestore();
            });
            it('should create transaction for multi-signature wallet when using passphrase', function () { return __awaiter(void 0, void 0, void 0, function () {
                var getPublicKeyFromPassphrase, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            getPublicKeyFromPassphrase = WalletService.getPublicKeyFromPassphrase;
                            WalletService.getPublicKeyFromPassphrase = jest.fn(function (passphrase) { return Identities.PublicKey.fromPassphrase(passphrase); });
                            return [4 /*yield*/, TransactionSigner.sign(__assign(__assign({}, signData), { multiSignature: multiSignature }))];
                        case 1:
                            response = _a.sent();
                            WalletService.getPublicKeyFromPassphrase = getPublicKeyFromPassphrase;
                            expect(response.signatures.length).toBe(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return transaction with multiSignature property', function () { return __awaiter(void 0, void 0, void 0, function () {
                var getPublicKeyFromPassphrase, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            getPublicKeyFromPassphrase = WalletService.getPublicKeyFromPassphrase;
                            WalletService.getPublicKeyFromPassphrase = jest.fn(function (passphrase) { return Identities.PublicKey.fromPassphrase(passphrase); });
                            return [4 /*yield*/, TransactionSigner.sign(__assign(__assign({}, signData), { multiSignature: multiSignature }))];
                        case 1:
                            response = _a.sent();
                            WalletService.getPublicKeyFromPassphrase = getPublicKeyFromPassphrase;
                            expect(response.multiSignature).toBe(multiSignature);
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('own passphrase used', function () {
                beforeEach(function () { return publicKeys.push(Identities.PublicKey.fromPassphrase("" + passphrase)); });
                it('should add signature to list of signatures', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var spyMultiSign, getPublicKeyFromPassphraseMock, getPublicKeyFromPassphrase, response, publicKeyIndex, signature;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                spyMultiSign = jest.spyOn(transaction, 'multiSign');
                                getPublicKeyFromPassphraseMock = jest.fn(function (passphrase) { return Identities.PublicKey.fromPassphrase(passphrase); });
                                getPublicKeyFromPassphrase = WalletService.getPublicKeyFromPassphrase;
                                WalletService.getPublicKeyFromPassphrase = getPublicKeyFromPassphraseMock;
                                return [4 /*yield*/, TransactionSigner.sign(__assign(__assign({}, signData), { multiSignature: multiSignature }))];
                            case 1:
                                response = _a.sent();
                                WalletService.getPublicKeyFromPassphrase = getPublicKeyFromPassphrase;
                                publicKeyIndex = publicKeys.indexOf(publicKey);
                                signature = response.signatures.find(function (s) { return parseInt(s.substring(0, 2), 16) === publicKeyIndex; });
                                expect(getPublicKeyFromPassphraseMock).toHaveBeenCalledWith(passphrase);
                                expect(spyMultiSign).toHaveBeenCalledWith(passphrase, publicKeyIndex);
                                expect(signature).toBeTruthy();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('own wif used', function () {
                beforeEach(function () {
                    publicKeys.push(Identities.PublicKey.fromPassphrase("" + passphrase));
                });
                it('should add signature to list of signatures', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var spyMultiSignWithWif, getPublicKeyFromWIFMock, getPublicKeyFromWIF, wif, response, publicKeyIndex, signature;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                spyMultiSignWithWif = jest.spyOn(transaction, 'multiSignWithWif');
                                getPublicKeyFromWIFMock = jest.fn(function (wif) { return Identities.PublicKey.fromWIF(wif, { wif: 170 }); });
                                getPublicKeyFromWIF = WalletService.getPublicKeyFromWIF;
                                WalletService.getPublicKeyFromWIF = getPublicKeyFromWIFMock;
                                wif = Identities.WIF.fromPassphrase(passphrase, { wif: 170 });
                                return [4 /*yield*/, TransactionSigner.sign(__assign(__assign({}, signData), { multiSignature: multiSignature, passphrase: null, secondPassphrase: null, wif: wif }))];
                            case 1:
                                response = _a.sent();
                                WalletService.getPublicKeyFromWIF = getPublicKeyFromWIF;
                                publicKeyIndex = publicKeys.indexOf(publicKey);
                                signature = response.signatures.find(function (s) { return parseInt(s.substring(0, 2), 16) === publicKeyIndex; });
                                expect(getPublicKeyFromWIFMock).toHaveBeenCalledWith(wif);
                                expect(spyMultiSignWithWif).toHaveBeenCalledWith(publicKeyIndex, wif, 170);
                                expect(signature).toBeTruthy();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    });
    describe('multiSign', function () {
        var masterPassphrase = 'passphrase';
        var address = Identities.Address.fromPassphrase(masterPassphrase, 23);
        var publicKey = Identities.PublicKey.fromPassphrase(masterPassphrase);
        var minKeys = 3;
        var publicKeys;
        var transaction;
        var signData;
        var multiSignature;
        var aip11Spy;
        beforeEach(function () {
            publicKeys = [];
            for (var i = 0; i < 5; i++) {
                publicKeys.push(Identities.PublicKey.fromPassphrase("passphrase " + i));
            }
            multiSignature = {
                publicKeys: publicKeys,
                min: minKeys
            };
            aip11Spy = setAip11AndSpy(true);
            transaction = {
                amount: new BigNumber(1 * 1e8),
                fee: new BigNumber(0.1 * 1e8),
                type: 0,
                typeGroup: 1,
                recipientId: address,
                vendorField: 'test vendorfield',
                version: 2,
                network: 23,
                senderPublicKey: publicKey,
                nonce: '1',
                signatures: []
            };
            signData = {
                multiSignature: multiSignature,
                networkWif: 170,
                passphrase: 'passphrase 1'
            };
        });
        afterEach(function () {
            aip11Spy.mockRestore();
        });
        it('should throw error if no passphrase or wif', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                expect(TransactionSigner.multiSign(transaction, { multiSignature: multiSignature })).rejects.toThrow('No passphrase or wif provided');
                return [2 /*return*/];
            });
        }); });
        it('should throw error aip11 not enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                setAip11AndSpy(false, false);
                expect(TransactionSigner.multiSign(transaction, signData)).rejects.toThrow('Multi-Signature Transactions are not supported yet');
                return [2 /*return*/];
            });
        }); });
        it.skip('should parse transaction from data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(CryptoUtils, 'transactionFromData');
                        return [4 /*yield*/, TransactionSigner.multiSign(transaction, signData)];
                    case 1:
                        _a.sent();
                        expect(spy).toHaveBeenCalledWith(transaction);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get keys from passphrase if provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(Identities.Keys, 'fromPassphrase');
                        return [4 /*yield*/, TransactionSigner.multiSign(transaction, signData)];
                    case 1:
                        _a.sent();
                        expect(spy).toHaveBeenCalledWith('passphrase 1');
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get keys from wif if provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var wif, spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wif = Identities.WIF.fromPassphrase('passphrase 1', { wif: 170 });
                        spy = jest.spyOn(Identities.Keys, 'fromWIF');
                        return [4 /*yield*/, TransactionSigner.multiSign(transaction, __assign(__assign({}, signData), { passphrase: null, wif: wif }))];
                    case 1:
                        _a.sent();
                        expect(spy).toHaveBeenCalledWith(wif, { wif: 170 });
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should check if signatures are needed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(TransactionService, 'isMultiSignatureReady');
                        return [4 /*yield*/, TransactionSigner.multiSign(transaction, signData)];
                    case 1:
                        _a.sent();
                        expect(spy).toHaveBeenCalledWith(__assign(__assign({}, transaction), { multiSignature: multiSignature }), true);
                        expect(spy).toHaveBeenCalledTimes(1);
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error if passphrase is not required for multi-signature wallet', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                expect(TransactionSigner.multiSign(transaction, __assign(__assign({}, signData), { passphrase: 'not used' }))).rejects.toThrow('passphrase/wif is not used to sign this transaction');
                return [2 /*return*/];
            });
        }); });
        it('should add signature for passphrase', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, TransactionSigner.multiSign(transaction, signData)];
                    case 1:
                        response = _a.sent();
                        expect(response.signatures.length).toBe(1);
                        expect(response.signatures[0]).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should add additional signatures upto minimum required', function () { return __awaiter(void 0, void 0, void 0, function () {
            var i, _loop_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < minKeys)) return [3 /*break*/, 4];
                        return [4 /*yield*/, TransactionSigner.multiSign(transaction, __assign(__assign({}, signData), { passphrase: "passphrase " + i }))];
                    case 2:
                        transaction = _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        expect(transaction.signatures.length).toBe(3);
                        _loop_1 = function (i) {
                            var publicKeyIndex = publicKeys.indexOf(Identities.PublicKey.fromPassphrase("passphrase " + i));
                            var signature = transaction.signatures.find(function (s) { return parseInt(s.substring(0, 2), 16) === publicKeyIndex; });
                            expect(signature).toBeTruthy();
                        };
                        for (i = 0; i < minKeys; i++) {
                            _loop_1(i);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not sign transaction if not primary sender', function () { return __awaiter(void 0, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < 4)) return [3 /*break*/, 4];
                        return [4 /*yield*/, TransactionSigner.multiSign(transaction, __assign(__assign({}, signData), { passphrase: "passphrase " + i }))];
                    case 2:
                        transaction = _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        expect(transaction.signature).toBeFalsy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should ignore duplicate signatures for passphrase', function () { return __awaiter(void 0, void 0, void 0, function () {
            var publicKeyIndex, signatures;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, TransactionSigner.multiSign(transaction, __assign(__assign({}, signData), { passphrase: 'passphrase 1' }))];
                    case 1:
                        transaction = _a.sent();
                        return [4 /*yield*/, TransactionSigner.multiSign(transaction, __assign(__assign({}, signData), { passphrase: 'passphrase 2' }))];
                    case 2:
                        transaction = _a.sent();
                        return [4 /*yield*/, TransactionSigner.multiSign(transaction, __assign(__assign({}, signData), { passphrase: 'passphrase 1' }))];
                    case 3:
                        transaction = _a.sent();
                        publicKeyIndex = publicKeys.indexOf(Identities.PublicKey.fromPassphrase('passphrase 1'));
                        signatures = transaction.signatures.filter(function (s) { return parseInt(s.substring(0, 2), 16) === publicKeyIndex; });
                        expect(signatures.length).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should only sign transaction with sender passphrase for registration', function () { return __awaiter(void 0, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transaction = {
                            fee: new BigNumber(0.1 * 1e8),
                            type: 4,
                            typeGroup: 1,
                            version: 2,
                            network: 23,
                            senderPublicKey: publicKey,
                            nonce: '1',
                            signatures: [],
                            asset: {
                                multiSignature: multiSignature
                            }
                        };
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < 5)) return [3 /*break*/, 4];
                        return [4 /*yield*/, TransactionSigner.multiSign(transaction, __assign(__assign({}, signData), { passphrase: "passphrase " + i }))];
                    case 2:
                        transaction = _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, TransactionSigner.multiSign(transaction, __assign(__assign({}, signData), { passphrase: masterPassphrase }))];
                    case 5:
                        transaction = _a.sent();
                        expect(transaction.signature).toBeTruthy();
                        expect(transaction.signatures.length).toBe(5);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should sign transaction with sender second passphrase for registration', function () { return __awaiter(void 0, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transaction = {
                            fee: new BigNumber(0.1 * 1e8),
                            type: 4,
                            typeGroup: 1,
                            version: 2,
                            network: 23,
                            senderPublicKey: publicKey,
                            nonce: '1',
                            signatures: [],
                            asset: {
                                multiSignature: multiSignature
                            }
                        };
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < 5)) return [3 /*break*/, 4];
                        return [4 /*yield*/, TransactionSigner.multiSign(transaction, __assign(__assign({}, signData), { passphrase: "passphrase " + i }))];
                    case 2:
                        transaction = _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, TransactionSigner.multiSign(transaction, __assign(__assign({}, signData), { passphrase: masterPassphrase, secondPassphrase: 'second-passphrase' }))];
                    case 5:
                        transaction = _a.sent();
                        expect(transaction.signature).toBeTruthy();
                        expect(transaction.secondSignature).toBeTruthy();
                        expect(transaction.signatures.length).toBe(5);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=transaction-signer.spec.js.map