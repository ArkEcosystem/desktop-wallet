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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { cloneDeep } from 'lodash';
import nock from 'nock';
import { Identities, Managers } from '@arkecosystem/crypto';
import fixtures from '../__fixtures__/services/client';
import ClientService from '@/services/client';
import BigNumber from '@/plugins/bignumber';
import store from '@/store';
import logger from 'electron-log';
import WalletService from '@/services/wallet';
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
describe('Services > Client', function () {
    var client;
    var wallets = [
        {
            address: 'address1',
            balance: '1202',
            publicKey: 'public key',
            vote: 'voted delegate'
        },
        {
            address: 'address2',
            balance: '300',
            publicKey: 'public key'
        }
    ];
    var generateWalletResponse = function (address) {
        return {
            body: {
                data: __assign(__assign({}, wallets.find(function (wallet) { return wallet.address === address; })), { isDelegate: true, username: 'test' })
            }
        };
    };
    var getWalletEndpoint = jest.fn(generateWalletResponse);
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
    beforeEach(function () {
        client = new ClientService();
        client.host = 'http://127.0.0.1:4003';
    });
    describe('constructor', function () {
        it('should not watch profile if false', function () {
            var watchProfileOriginal = ClientService.__watchProfile;
            ClientService.__watchProfile = jest.fn();
            client = new ClientService(false);
            expect(ClientService.__watchProfile).not.toHaveBeenCalled();
            ClientService.__watchProfile = watchProfileOriginal;
        });
    });
    describe('newConnection', function () {
        it('should create a new connection', function () {
            var connection = ClientService.newConnection('http://localhost');
            expect(connection.host).toBe('http://localhost/api');
        });
        it('should set timeout if provided', function () {
            var connection = ClientService.newConnection('http://localhost', 100);
            expect(connection.opts.timeout).toBe(100);
        });
        it('should use default 5000ms timeout if not provided', function () {
            var connection = ClientService.newConnection('http://localhost');
            expect(connection.opts.timeout).toBe(5000);
        });
        it('should throw error if no server', function () {
            expect(function () { return ClientService.newConnection(null); }).toThrow();
        });
    });
    describe('fetchNetworkConfig', function () {
        var mockEndpoint = function (config) {
            nock('http://127.0.0.1')
                .get('/api/node/configuration')
                .reply(200, {
                data: config
            });
        };
        it('should fetch network config', function () { return __awaiter(void 0, void 0, void 0, function () {
            var networkConfig, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        networkConfig = {
                            nethash: 'nethash'
                        };
                        mockEndpoint(networkConfig);
                        _a = expect;
                        return [4 /*yield*/, ClientService.fetchNetworkConfig('http://127.0.0.1')];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(networkConfig);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update network store', function () { return __awaiter(void 0, void 0, void 0, function () {
            var networkConfig, spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        networkConfig = {
                            nethash: 'test-nethash',
                            constants: {
                                vendorFieldLength: 10
                            }
                        };
                        mockEndpoint(networkConfig);
                        return [4 /*yield*/, ClientService.fetchNetworkConfig('http://127.0.0.1')];
                    case 1:
                        _a.sent();
                        spy = jest.spyOn(store, 'dispatch');
                        expect(spy).toHaveBeenCalledWith('network/update', __assign(__assign({}, sessionNetwork), { vendorField: __assign(__assign({}, sessionNetwork.vendorField), { maxLength: 10 }) }));
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not update network store if vendorfield is the same', function () { return __awaiter(void 0, void 0, void 0, function () {
            var networkConfig, spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        networkConfig = {
                            nethash: 'test-nethash',
                            constants: {
                                vendorFieldLength: 64
                            }
                        };
                        mockEndpoint(networkConfig);
                        return [4 /*yield*/, ClientService.fetchNetworkConfig('http://127.0.0.1')];
                    case 1:
                        _a.sent();
                        spy = jest.spyOn(store, 'dispatch');
                        expect(spy).not.toHaveBeenCalled();
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchNetworkCrypto', function () {
        it('should fetch data from crypto endpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
            var cryptoConfig, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        cryptoConfig = {
                            exceptions: {},
                            genesisBlock: {},
                            milestones: {},
                            network: {}
                        };
                        nock('http://127.0.0.1')
                            .get('/api/node/configuration/crypto')
                            .reply(200, {
                            data: cryptoConfig
                        });
                        _a = expect;
                        return [4 /*yield*/, ClientService.fetchNetworkCrypto('http://127.0.0.1')];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(cryptoConfig);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchFeeStatistics', function () {
        var mockEndpoint = function (config) {
            nock('http://127.0.0.1')
                .get('/api/node/fees')
                .query({ days: 7 })
                .reply(200, {
                data: config
            });
        };
        it('should fetch fees for updated endpoint schema', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mockEndpoint({
                            1: {
                                transfer: {
                                    avg: '9434054',
                                    max: '10000000',
                                    min: '500000',
                                    sum: '1962283291'
                                }
                            }
                        });
                        _a = expect;
                        return [4 /*yield*/, ClientService.fetchFeeStatistics('http://127.0.0.1')];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual({
                            1: [
                                {
                                    type: 0,
                                    fees: {
                                        minFee: 500000,
                                        maxFee: 10000000,
                                        avgFee: 9434054
                                    }
                                }
                            ]
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fetch fees for old endpoint schema', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mockEndpoint([
                            {
                                type: 0,
                                avg: '9434054',
                                max: '10000000',
                                min: '500000',
                                sum: '1962283291'
                            }
                        ]);
                        _a = expect;
                        return [4 /*yield*/, ClientService.fetchFeeStatistics('http://127.0.0.1')];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual([
                            {
                                type: 0,
                                fees: {
                                    minFee: 500000,
                                    maxFee: 10000000,
                                    avgFee: 9434054
                                }
                            }
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return empty array on error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        nock('http://127.0.0.1')
                            .get('/api/node/fees')
                            .query({ days: 7 })
                            .reply(500);
                        _a = expect;
                        return [4 /*yield*/, ClientService.fetchFeeStatistics('http://127.0.0.1')];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('host getter/setter', function () {
        it('should return formatted host', function () {
            client.host = 'http://6.6.6.6';
            expect(client.host).toEqual('http://6.6.6.6/api');
        });
        it('should update current client', function () {
            client.host = 'http://7.7.7.7';
            expect(client.client.host).toEqual('http://7.7.7.7/api');
        });
    });
    describe('fetchPeerStatus', function () {
        it('should fetch data from syncing endpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        response = {
                            syncing: false,
                            blocks: -7,
                            height: 10969757,
                            id: 'e1315d04c74bb7edc0a0c902e399eafb2e6cf12c0d36e8ecd692408a14d9dda3'
                        };
                        nock('http://127.0.0.1:4003')
                            .get('/api/node/syncing')
                            .reply(200, {
                            data: response
                        });
                        _a = expect;
                        return [4 /*yield*/, client.fetchPeerStatus()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(response);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchDelegates', function () {
        var _a = fixtures.delegates, data = _a.data, meta = _a.meta;
        var delegates = fixtures.delegates.v2;
        beforeEach(function () {
            var resource = function (resource) {
                if (resource === 'delegates') {
                    return {
                        all: function () { return ({ body: { data: delegates, meta: meta } }); }
                    };
                }
            };
            client.client.api = resource;
        });
        it('should return all properties for each delegate', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, delegates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.fetchDelegates()];
                    case 1:
                        response = _a.sent();
                        expect(response).toHaveProperty('delegates');
                        expect(response).toHaveProperty('meta', meta);
                        delegates = response.delegates;
                        expect(delegates).toHaveLength(data.length);
                        delegates.forEach(function (delegate, i) {
                            expect(delegate).toHaveProperty('rank', data[i].rank);
                            expect(delegate).toHaveProperty('username', data[i].username);
                            expect(delegate).toHaveProperty('production.approval', data[i].approval);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchDelegateVoters', function () {
        it('should fetch data from syncing endpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
            var meta, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        meta = {
                            totalCount: 531
                        };
                        nock('http://127.0.0.1:4003')
                            .get('/api/delegates/USERNAME/voters')
                            .query(true)
                            .reply(200, {
                            meta: meta,
                            data: {}
                        });
                        _a = expect;
                        return [4 /*yield*/, client.fetchDelegateVoters({ username: 'USERNAME' })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(meta.totalCount);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchDelegateForged', function () {
        it('should return the forged property from the given delegate', function () { return __awaiter(void 0, void 0, void 0, function () {
            var forged;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.fetchDelegateForged({
                            publicKey: 'dummyKey',
                            forged: {
                                total: 100
                            }
                        })];
                    case 1:
                        forged = _a.sent();
                        expect(forged).toEqual(100);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return 0 if no forged data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var forged;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.fetchDelegateForged({
                            publicKey: 'dummyKey'
                        })];
                    case 1:
                        forged = _a.sent();
                        expect(forged).toEqual('0');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchStaticFees', function () {
        var data = fixtures.staticFeeResponses.v2.data;
        beforeEach(function () {
            var resource = function (resource) {
                if (resource === 'transactions') {
                    return {
                        fees: function () { return ({ body: fixtures.staticFeeResponses.v2 }); }
                    };
                }
            };
            client.client.api = resource;
        });
        it('should return and match fees to types', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.fetchStaticFees()];
                    case 1:
                        response = _a.sent();
                        expect(response.transfer).toBe(data.transfer);
                        expect(response.secondSignature).toBe(data.secondSignature);
                        expect(response.delegateRegistration).toBe(data.delegateRegistration);
                        expect(response.vote).toBe(data.vote);
                        expect(response.multiSignature).toBe(data.multiSignature);
                        expect(response.ipfs).toBe(data.ipfs);
                        expect(response.multiPayment).toBe(data.multiPayment);
                        expect(response.delegateResignation).toBe(data.delegateResignation);
                        expect(response.htlcLock).toBe(data.htlcLock);
                        expect(response.htlcClaim).toBe(data.htlcClaim);
                        expect(response.htlcRefund).toBe(data.htlcRefund);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchTransactions', function () {
        var _a = fixtures.transactions, data = _a.data, meta = _a.meta;
        beforeEach(function () {
            var transactions = cloneDeep(fixtures.transactions.v2);
            var resource = function (resource) {
                if (resource === 'transactions') {
                    return {
                        all: function () { return ({ body: { data: transactions, meta: { totalCount: meta.count } } }); }
                    };
                }
            };
            client.client.api = resource;
        });
        it('should return only some properties for each transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.fetchTransactions()];
                    case 1:
                        response = _a.sent();
                        expect(response).toHaveProperty('transactions');
                        expect(response).toHaveProperty('totalCount', meta.count);
                        transactions = response.transactions;
                        expect(transactions).toHaveLength(data.length);
                        transactions.forEach(function (transaction, i) {
                            expect(transaction).toHaveProperty('timestamp', data[i].timestamp.unix * 1000);
                            expect(transaction).toHaveProperty('sender');
                            expect(transaction).toHaveProperty('recipient');
                            expect(transaction).not.toHaveProperty('totalAmount');
                            expect(transaction).not.toHaveProperty('senderId');
                            expect(transaction).not.toHaveProperty('recipientId');
                            expect(transaction).not.toHaveProperty('isSender');
                            expect(transaction).not.toHaveProperty('isRecipient');
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchBusinessBridgechains', function () {
        it('should fetch data from bridgechains endpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        response = {
                            meta: {
                                totalCount: 137
                            },
                            data: [
                                {
                                    address: 'address-1',
                                    publicKey: 'publicKey-1',
                                    name: 'Business Name',
                                    website: 'http://t-explorer.ark.io',
                                    isResigned: false
                                }
                            ]
                        };
                        nock('http://127.0.0.1:4003')
                            .get('/api/businesses/BUSINESS_ID/bridgechains?page=1&limit=50&orderBy=name%3Aasc')
                            .reply(200, response);
                        _a = expect;
                        return [4 /*yield*/, client.fetchBusinessBridgechains('BUSINESS_ID')];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(response);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchWalletTransactions', function () {
        var _a = fixtures.transactions, data = _a.data, meta = _a.meta;
        beforeEach(function () {
            var transactions = cloneDeep(fixtures.transactions.v2);
            var resource = function (resource) {
                if (resource === 'wallets') {
                    return {
                        transactions: function (_, queryOptions) {
                            var transactionsResponse = transactions.filter(function (t) { return !queryOptions.type || (queryOptions.type && t.type === queryOptions.type); });
                            return {
                                body: {
                                    data: transactionsResponse,
                                    meta: {
                                        totalCount: meta.count
                                    }
                                }
                            };
                        }
                    };
                }
            };
            client.client.api = resource;
        });
        it('should return only some properties for each transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.fetchWalletTransactions('address')];
                    case 1:
                        response = _a.sent();
                        expect(response).toHaveProperty('transactions');
                        expect(response).toHaveProperty('totalCount', meta.count);
                        transactions = response.transactions;
                        expect(transactions).toHaveLength(data.length);
                        transactions.forEach(function (transaction, i) {
                            expect(transaction).toHaveProperty('totalAmount');
                            expect(transaction.totalAmount).toBeString();
                            expect(transaction.totalAmount).toEqual(new BigNumber(data[i].amount).plus(data[i].fee).toString());
                            expect(transaction).toHaveProperty('timestamp', data[i].timestamp.unix * 1000);
                            expect(transaction).toHaveProperty('isSender');
                            expect(transaction).toHaveProperty('isRecipient');
                            expect(transaction).toHaveProperty('sender');
                            expect(transaction).toHaveProperty('recipient');
                            expect(transaction).not.toHaveProperty('senderId');
                            expect(transaction).not.toHaveProperty('recipientId');
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should filter transactions by transaction type', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.fetchWalletTransactions('address', { transactionType: 1 })];
                    case 1:
                        response = _a.sent();
                        expect(response.transactions.length).toBe(1);
                        expect(response.transactions[0].type).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchTransactionsForWallets', function () {
        var walletAddresses = ['address1', 'address2'];
        var transactions;
        var searchTransactionsEndpoint;
        var walletTransactions;
        it('should call the transaction search endpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
            var resource, fetchedWallets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transactions = cloneDeep(fixtures.transactions.v2);
                        searchTransactionsEndpoint = jest.fn(function () { return ({ body: { data: transactions } }); });
                        resource = function (resource) {
                            if (resource === 'transactions') {
                                return {
                                    search: searchTransactionsEndpoint
                                };
                            }
                        };
                        client.client.api = jest.fn(resource);
                        walletTransactions = walletAddresses.reduce(function (all, address) {
                            all[address] = transactions.filter(function (transaction) {
                                return [transaction.sender, transaction.recipient].includes(address);
                            });
                            return all;
                        }, {});
                        return [4 /*yield*/, client.fetchTransactionsForWallets(walletAddresses)];
                    case 1:
                        fetchedWallets = _a.sent();
                        expect(client.client.api).toHaveBeenNthCalledWith(1, 'transactions');
                        expect(searchTransactionsEndpoint).toHaveBeenNthCalledWith(1, { addresses: walletAddresses });
                        expect(fetchedWallets).toEqual(walletTransactions);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should log error if api fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(logger, 'error').mockImplementation();
                        jest.spyOn(client, 'fetchWalletTransactions').mockReturnValue({});
                        return [4 /*yield*/, client.fetchTransactionsForWallets(['address-1'], null)];
                    case 1:
                        _a.sent();
                        expect(spy).toHaveBeenCalledTimes(1);
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fall back to fetchWalletTransactions if search endpoint fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(client, 'fetchWalletTransactions').mockReturnValue({
                            transactions: ['test']
                        });
                        return [4 /*yield*/, client.fetchTransactionsForWallets(['address-1'])];
                    case 1:
                        response = _a.sent();
                        expect(spy).toHaveBeenCalledWith('address-1', {});
                        expect(response['address-1']).toEqual(['test']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should log error for each fetchWalletTransactions failure', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, error, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(logger, 'error').mockImplementation();
                        error = new Error('Wallet not found');
                        jest.spyOn(client, 'fetchWalletTransactions').mockImplementation(function () {
                            throw error;
                        });
                        return [4 /*yield*/, client.fetchTransactionsForWallets(['address-1', 'address-2'])];
                    case 1:
                        response = _a.sent();
                        expect(spy).toHaveBeenNthCalledWith(2, error);
                        expect(response).toEqual({});
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error on fetchWalletTransactions failure (not "Wallet not found")', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(logger, 'error').mockImplementation();
                        error = new Error('oops');
                        jest.spyOn(client, 'fetchWalletTransactions').mockImplementation(function () {
                            throw error;
                        });
                        return [4 /*yield*/, expect(client.fetchTransactionsForWallets(['address-1'])).rejects.toThrow('oops')];
                    case 1:
                        _a.sent();
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchWallet', function () {
        var data = {
            address: 'address',
            balance: '1202',
            publicKey: 'public key'
        };
        var wallet = {
            body: {
                data: __assign(__assign({}, data), { isDelegate: true, username: 'test' })
            }
        };
        var account = {
            data: {
                success: true,
                account: __assign(__assign({}, data), { unconfirmedBalance: 'NO', unconfirmedSignature: 'NO', secondSignature: 'NO', multisignatures: 'NO', u_multisignatures: 'NO' })
            }
        };
        beforeEach(function () {
            var resource = function (resource) {
                if (resource === 'accounts') {
                    return {
                        get: function () { return account; }
                    };
                }
                else if (resource === 'wallets') {
                    return {
                        get: function () { return wallet; }
                    };
                }
            };
            client.client.api = resource;
        });
        describe('when version is 2', function () {
            it('should return almost all properties from the wallet endpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
                var wallet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.fetchWallet('address')];
                        case 1:
                            wallet = _a.sent();
                            expect(wallet).toHaveProperty('address', data.address);
                            expect(wallet).toHaveProperty('balance', data.balance);
                            expect(wallet).toHaveProperty('publicKey', data.publicKey);
                            expect(wallet).toHaveProperty('isDelegate', true);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('fetchWallets', function () {
        var walletAddresses = ['address1', 'address2'];
        var walletsResponse = {
            body: {
                data: [
                    __assign(__assign({}, wallets[0]), { isDelegate: true, username: 'test' }),
                    __assign(__assign({}, wallets[1]), { isDelegate: false, username: null })
                ]
            }
        };
        var searchWalletEndpoint = jest.fn(function () { return walletsResponse; });
        beforeEach(function () {
            var resource = function (resource) {
                if (resource === 'wallets') {
                    return {
                        get: getWalletEndpoint,
                        search: searchWalletEndpoint
                    };
                }
            };
            client.client.api = jest.fn(resource);
        });
        it('should call the wallet search endpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fetchedWallets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.fetchWallets(walletAddresses)];
                    case 1:
                        fetchedWallets = _a.sent();
                        expect(client.client.api).toHaveBeenNthCalledWith(1, 'wallets');
                        expect(searchWalletEndpoint).toHaveBeenNthCalledWith(1, { addresses: walletAddresses });
                        expect(fetchedWallets).toEqual(walletsResponse.body.data);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchWalletVote', function () {
        var voteDelegate = 'voted delegate';
        beforeEach(function () {
            var resource = function (resource) {
                if (resource === 'wallets') {
                    return {
                        get: generateWalletResponse
                    };
                }
            };
            client.client.api = resource;
        });
        it('should return delegate public key if wallet is voting', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.fetchWalletVote('address1')];
                    case 1:
                        response = _a.sent();
                        expect(response).toBe(voteDelegate);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null if wallet is not voting', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.fetchWalletVote('address2')];
                    case 1:
                        response = _a.sent();
                        expect(response).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should log error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, error, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(logger, 'error').mockImplementation();
                        error = new Error('Wallet not found');
                        jest.spyOn(client, 'fetchWallet').mockImplementation(function () {
                            throw error;
                        });
                        return [4 /*yield*/, client.fetchWalletVote('address2')];
                    case 1:
                        response = _a.sent();
                        expect(spy).toHaveBeenCalledWith(error);
                        expect(response).toBe(null);
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw if error is not "Wallet not found"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(logger, 'error').mockImplementation();
                        error = new Error('oops');
                        jest.spyOn(client, 'fetchWallet').mockImplementation(function () {
                            throw error;
                        });
                        return [4 /*yield*/, expect(client.fetchWalletVote('address2')).rejects.toThrow('oops')];
                    case 1:
                        _a.sent();
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchWalletVotes', function () {
        var transactions = [{
                asset: {
                    votes: ['+test']
                }
            }, {
                asset: {
                    votes: ['+test2']
                }
            }];
        beforeEach(function () {
            var resource = function (resource) {
                if (resource === 'wallets') {
                    return {
                        votes: function () { return ({ body: { data: transactions } }); }
                    };
                }
            };
            client.client.api = resource;
        });
        it('should return vote transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.fetchWalletVotes()];
                    case 1:
                        response = _a.sent();
                        expect(response).toBe(transactions);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('__parseCurrentPeer', function () {
        it('should parse peer from current host', function () {
            client.host = 'http://1.1.1.1:8080';
            expect(client.__parseCurrentPeer()).toEqual({
                ip: '1.1.1.1',
                port: '8080',
                isHttps: false
            });
        });
        it('should parse https', function () {
            client.host = 'https://1.1.1.1:8080';
            expect(client.__parseCurrentPeer()).toEqual({
                ip: '1.1.1.1',
                port: '8080',
                isHttps: true
            });
        });
        it('should default port if not found', function () {
            client.host = 'http://1.1.1.1';
            expect(client.__parseCurrentPeer()).toEqual({
                ip: '1.1.1.1',
                port: '80',
                isHttps: false
            });
            client.host = 'https://1.1.1.1';
            expect(client.__parseCurrentPeer()).toEqual({
                ip: '1.1.1.1',
                port: '443',
                isHttps: true
            });
        });
    });
    describe('buildVote', function () {
        var address = Identities.Address.fromPassphrase('passphrase', 23);
        var publicKey = Identities.PublicKey.fromPassphrase('passphrase');
        var rawTransaction = {
            address: address,
            votes: [
                "+" + publicKey
            ],
            fee: new BigNumber(fees[1][3]),
            passphrase: 'passphrase',
            secondPassphrase: 'second passphrase',
            networkWif: 170
        };
        describe('standard transaction', function () {
            it('should build a valid v1 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Managers.configManager.getMilestone().aip11 = false;
                            return [4 /*yield*/, client.buildVote(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            expect(transaction.asset.votes).toEqual(rawTransaction.votes);
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.recipientId).toEqual(address);
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.type).toEqual(3);
                            expect(transaction.version).toEqual(1);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build a valid v2 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            Managers.configManager.getMilestone().aip11 = true;
                            return [4 /*yield*/, client.buildVote(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            expect(transaction.asset.votes).toEqual(rawTransaction.votes);
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.type).toEqual(3);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is bigger than the static fee', function () {
            it('should throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fee = new BigNumber(fees[1][3] + 1);
                            return [4 /*yield*/, expect(client.buildVote({ fee: fee })).rejects.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is smaller or equal to the static fee fee (0.1)', function () {
            it('should not throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(false);
                            return [4 /*yield*/, expect(client.buildVote(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[1][3]) }))).resolves.not.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, expect(client.buildVote(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[1][3] - 1) }))).resolves.not.toThrow(/fee/)];
                        case 2:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('buildDelegateRegistration', function () {
        var address = Identities.Address.fromPassphrase('passphrase', 23);
        var publicKey = Identities.PublicKey.fromPassphrase('passphrase');
        var rawTransaction = {
            address: address,
            username: 'bob',
            fee: new BigNumber(fees[1][2]),
            passphrase: 'passphrase',
            secondPassphrase: 'second passphrase',
            networkWif: 170
        };
        describe('standard transaction', function () {
            it('should build a valid v1 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setAip11AndSpy(false, false);
                            return [4 /*yield*/, client.buildDelegateRegistration(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            expect(transaction.asset.delegate.username).toEqual(rawTransaction.username);
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.type).toEqual(2);
                            expect(transaction.version).toEqual(1);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build a valid v2 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, client.buildDelegateRegistration(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            expect(transaction.asset.delegate.username).toEqual(rawTransaction.username);
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.type).toEqual(2);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is bigger than the static fee', function () {
            it('should throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fee = new BigNumber(fees[1][2] + 1);
                            return [4 /*yield*/, expect(client.buildDelegateRegistration({ fee: fee })).rejects.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is smaller or equal to the static fee (25)', function () {
            it('should not throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(false);
                            return [4 /*yield*/, expect(client.buildDelegateRegistration(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[1][2]) }))).resolves.not.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, expect(client.buildDelegateRegistration(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[1][2] - 1) }))).resolves.not.toThrow(/fee/)];
                        case 2:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('buildTransfer', function () {
        var address = Identities.Address.fromPassphrase('passphrase', 23);
        var publicKey = Identities.PublicKey.fromPassphrase('passphrase');
        var rawTransaction = {
            address: address,
            amount: new BigNumber(100 * 1e8),
            fee: new BigNumber(fees[1][0]),
            recipientId: address,
            vendorField: 'this is a test',
            passphrase: 'passphrase',
            secondPassphrase: 'second passphrase',
            networkWif: 170
        };
        describe('standard transaction', function () {
            it('should build a valid v1 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setAip11AndSpy(false, false);
                            return [4 /*yield*/, client.buildTransfer(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            expect(transaction.vendorField).toEqual(rawTransaction.vendorField);
                            expect(transaction.amount).toEqual(rawTransaction.amount.toString());
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.type).toEqual(0);
                            expect(transaction.version).toEqual(1);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build a valid v2 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, client.buildTransfer(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            expect(transaction.vendorField).toEqual(rawTransaction.vendorField);
                            expect(transaction.amount).toEqual(rawTransaction.amount.toString());
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.type).toEqual(0);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when a custom network is specified', function () {
            it('should have the correct version', function () { return __awaiter(void 0, void 0, void 0, function () {
                var networkId, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setAip11AndSpy(false, false);
                            networkId = 'ark.devnet';
                            return [4 /*yield*/, client.buildTransfer({ fee: new BigNumber(fees[1][0]), networkId: networkId, passphrase: 'test' }, false, true)];
                        case 1:
                            transaction = _a.sent();
                            expect(transaction.data.network).toBe(30);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is bigger than the static fee', function () {
            it('should throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fee = new BigNumber(fees[1][0] + 1);
                            return [4 /*yield*/, expect(client.buildTransfer({ fee: fee })).rejects.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is smaller or equal to the static fee (0.1)', function () {
            it('should not throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, expect(client.buildTransfer(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[1][0]) }))).resolves.not.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, expect(client.buildTransfer(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[1][0] - 1) }))).resolves.not.toThrow(/fee/)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('buildSecondSignatureRegistration', function () {
        var address = Identities.Address.fromPassphrase('passphrase', 23);
        var publicKey = Identities.PublicKey.fromPassphrase('passphrase');
        var secondPublicKey = Identities.PublicKey.fromPassphrase('second passphrase');
        var rawTransaction = {
            address: address,
            fee: new BigNumber(fees[1][1]),
            passphrase: 'passphrase',
            secondPassphrase: 'second passphrase',
            networkWif: 170
        };
        describe('standard transaction', function () {
            it('should build a valid v1 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setAip11AndSpy(false, false);
                            return [4 /*yield*/, client.buildSecondSignatureRegistration(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            expect(transaction.asset.signature.publicKey).toEqual(secondPublicKey);
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.type).toEqual(1);
                            expect(transaction.version).toEqual(1);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build a valid v2 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, client.buildSecondSignatureRegistration(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            expect(transaction.asset.signature.publicKey).toEqual(secondPublicKey);
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.type).toEqual(1);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is bigger than the static fee', function () {
            it('should throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fee = new BigNumber(fees[1][1] + 1);
                            return [4 /*yield*/, expect(client.buildSecondSignatureRegistration({ fee: fee })).rejects.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is smaller or equal to the static fee (5)', function () {
            it('should not throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(false);
                            return [4 /*yield*/, expect(client.buildSecondSignatureRegistration(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[1][1]) }))).resolves.not.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, expect(client.buildSecondSignatureRegistration(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[1][1] - 1) }))).resolves.not.toThrow(/fee/)];
                        case 2:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('buildMultiSignature', function () {
        var minKeys = 3;
        var publicKeys = [];
        for (var i = 0; i < 5; i++) {
            publicKeys.push(Identities.PublicKey.fromPassphrase("passphrase " + i));
        }
        var address = Identities.Address.fromPassphrase('passphrase', 23);
        var publicKey = Identities.PublicKey.fromPassphrase('passphrase');
        var rawTransaction = {
            address: address,
            publicKeys: publicKeys,
            minKeys: minKeys,
            fee: new BigNumber(fees[1][4]),
            passphrase: 'passphrase',
            secondPassphrase: 'second passphrase',
            networkWif: 170
        };
        describe('standard transaction', function () {
            it('should not build a v1 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setAip11AndSpy(false, false);
                            return [4 /*yield*/, expect(client.buildMultiSignature(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build a valid v2 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, client.buildMultiSignature(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            expect(transaction.asset.multiSignature.publicKeys).toEqual(publicKeys);
                            expect(transaction.asset.multiSignature.min).toEqual(rawTransaction.minKeys);
                            expect(transaction.fee + '').toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual('public key of passphrase');
                            expect(transaction.type).toEqual(4);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return object if required', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, client.buildMultiSignature(rawTransaction, true, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            expect(transaction.constructor.name).toEqual('MultiSignatureBuilder');
                            expect(transaction.data.asset.multiSignature.publicKeys).toEqual(publicKeys);
                            expect(transaction.data.asset.multiSignature.min).toEqual(rawTransaction.minKeys);
                            expect(transaction.data.fee + '').toEqual(rawTransaction.fee.toString());
                            expect(transaction.data.senderPublicKey).toEqual('public key of passphrase');
                            expect(transaction.data.type).toEqual(4);
                            expect(transaction.data.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should add own wallet to signatures', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, getPublicKeyFromPassphrase, newPublicKeys, newRawTransaction, transaction, publicKeyIndex, signature;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            getPublicKeyFromPassphrase = WalletService.getPublicKeyFromPassphrase;
                            WalletService.getPublicKeyFromPassphrase = jest.fn(function (passphrase) { return Identities.PublicKey.fromPassphrase(passphrase); });
                            newPublicKeys = __spreadArrays(publicKeys, [
                                publicKey
                            ]);
                            newRawTransaction = __assign(__assign({}, rawTransaction), { publicKeys: newPublicKeys });
                            return [4 /*yield*/, client.buildMultiSignature(newRawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            WalletService.getPublicKeyFromPassphrase = getPublicKeyFromPassphrase;
                            publicKeyIndex = newPublicKeys.indexOf(publicKey);
                            signature = transaction.signatures.find(function (s) { return parseInt(s.substring(0, 2), 16) === publicKeyIndex; });
                            expect(signature).toBeTruthy();
                            expect(transaction.asset.multiSignature.publicKeys).toEqual(newPublicKeys);
                            expect(transaction.asset.multiSignature.min).toEqual(rawTransaction.minKeys);
                            expect(transaction.fee + '').toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.type).toEqual(4);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is bigger than the static fee', function () {
            it('should throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            fee = new BigNumber(fees[1][4] + 1);
                            return [4 /*yield*/, expect(client.buildMultiSignature({ fee: fee, minKeys: minKeys, publicKeys: publicKeys })).rejects.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is smaller or equal to the static fee (5)', function () {
            it('should not throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, expect(client.buildMultiSignature(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[1][4]) }))).resolves.not.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, expect(client.buildMultiSignature(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[1][4] - 1) }))).resolves.not.toThrow(/fee/)];
                        case 2:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('buildIpfs', function () {
        var address = Identities.Address.fromPassphrase('passphrase', 23);
        var publicKey = Identities.PublicKey.fromPassphrase('passphrase');
        var rawTransaction = {
            address: address,
            fee: new BigNumber(fees[1][5]),
            hash: 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6',
            passphrase: 'passphrase',
            secondPassphrase: 'second passphrase',
            networkWif: 170
        };
        describe('standard transaction', function () {
            it('should not build a v1 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setAip11AndSpy(false, false);
                            return [4 /*yield*/, expect(client.buildIpfs(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not create transaction with invalid hash', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, newRawTransaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            newRawTransaction = __assign(__assign({}, rawTransaction), { hash: 'invalid hash' });
                            return [4 /*yield*/, expect(client.buildIpfs(newRawTransaction, true)).rejects.toThrow(/base58/)];
                        case 1:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build a valid v2 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, client.buildIpfs(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            expect(transaction.asset.ipfs).toEqual(rawTransaction.hash);
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.type).toEqual(5);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is bigger than the static fee', function () {
            it('should throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            fee = new BigNumber(fees[1][5] + 1);
                            return [4 /*yield*/, expect(client.buildIpfs({ fee: fee })).rejects.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is smaller or equal to the static fee (5)', function () {
            it('should not throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, expect(client.buildIpfs(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[1][5]) }))).resolves.not.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, expect(client.buildIpfs(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[1][5] - 1) }))).resolves.not.toThrow(/fee/)];
                        case 2:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('buildMultiPayment', function () {
        var recipients = [];
        for (var i = 0; i < 5; i++) {
            recipients.push({
                address: Identities.Address.fromPassphrase("passphrase " + i, 23),
                amount: new BigNumber((i + 1) * 1e8)
            });
        }
        var address = Identities.Address.fromPassphrase('passphrase', 23);
        var publicKey = Identities.PublicKey.fromPassphrase('passphrase');
        var rawTransaction = {
            address: address,
            recipients: recipients,
            fee: new BigNumber(fees[1][6]),
            vendorField: 'this is a test',
            passphrase: 'passphrase',
            secondPassphrase: 'second passphrase',
            networkWif: 170
        };
        describe('standard transaction', function () {
            it('should not build a v1 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setAip11AndSpy(false, false);
                            return [4 /*yield*/, expect(client.buildMultiPayment(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build a valid v2 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, transaction, recipientIndex;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, client.buildMultiPayment(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            for (recipientIndex in recipients) {
                                expect(transaction.asset.payments[recipientIndex].recipientId).toEqual(recipients[recipientIndex].address);
                                expect(transaction.asset.payments[recipientIndex].amount).toEqual(recipients[recipientIndex].amount.toString());
                            }
                            expect(transaction.vendorField).toEqual(rawTransaction.vendorField);
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.type).toEqual(6);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is bigger than the static fee', function () {
            it('should throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            fee = new BigNumber(fees[1][6] + 1);
                            return [4 /*yield*/, expect(client.buildMultiPayment({ fee: fee })).rejects.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is smaller or equal to the static fee (5)', function () {
            it('should not throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, expect(client.buildMultiPayment(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[1][6]) }))).resolves.not.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, expect(client.buildMultiPayment(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[1][6] - 1) }))).resolves.not.toThrow(/fee/)];
                        case 2:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('buildDelegateResignation', function () {
        var address = Identities.Address.fromPassphrase('passphrase', 23);
        var publicKey = Identities.PublicKey.fromPassphrase('passphrase');
        var rawTransaction = {
            address: address,
            fee: new BigNumber(fees[1][7]),
            passphrase: 'passphrase',
            secondPassphrase: 'second passphrase',
            networkWif: 170
        };
        describe('standard transaction', function () {
            it('should not build a v1 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setAip11AndSpy(false, false);
                            return [4 /*yield*/, expect(client.buildDelegateResignation(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build a valid v2 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, client.buildDelegateResignation(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.type).toEqual(7);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is bigger than the static fee', function () {
            it('should throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            fee = new BigNumber(fees[1][7] + 1);
                            return [4 /*yield*/, expect(client.buildDelegateResignation({ fee: fee })).rejects.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is smaller or equal to the static fee (5)', function () {
            it('should not throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, expect(client.buildDelegateResignation(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[1][7]) }))).resolves.not.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, expect(client.buildDelegateResignation(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[1][7] - 1) }))).resolves.not.toThrow(/fee/)];
                        case 2:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('buildBusinessRegistration', function () {
        var address = Identities.Address.fromPassphrase('passphrase', 23);
        var publicKey = Identities.PublicKey.fromPassphrase('passphrase');
        var rawTransaction = {
            address: address,
            fee: new BigNumber(fees[2][0]),
            asset: {
                name: 'google',
                website: 'https://www.google.com',
                vat: 'GB123456',
                repository: 'https://github.com/arkecosystem/desktop-wallet.git'
            },
            passphrase: 'passphrase',
            secondPassphrase: 'second passphrase',
            networkWif: 170
        };
        describe('standard transaction', function () {
            it('should not build a v1 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setAip11AndSpy(false, false);
                            return [4 /*yield*/, expect(client.buildBusinessRegistration(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build a valid v2 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, client.buildBusinessRegistration(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            expect(transaction.asset.businessRegistration).toEqual(rawTransaction.asset);
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.typeGroup).toEqual(2);
                            expect(transaction.type).toEqual(0);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build a valid v2 transaction without optional data', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, newRawTransaction, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            newRawTransaction = __assign(__assign({}, rawTransaction), { asset: {
                                    name: 'google',
                                    website: 'https://www.google.com'
                                } });
                            return [4 /*yield*/, client.buildBusinessRegistration(newRawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            expect(transaction.asset.businessRegistration).toEqual(newRawTransaction.asset);
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.typeGroup).toEqual(2);
                            expect(transaction.type).toEqual(0);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is bigger than the static fee', function () {
            it('should throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            fee = new BigNumber(fees[2][0] + 1);
                            return [4 /*yield*/, expect(client.buildBusinessRegistration({ fee: fee })).rejects.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is smaller or equal to the static fee (5)', function () {
            it('should not throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, expect(client.buildBusinessRegistration(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[2][0]) }))).resolves.not.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, expect(client.buildBusinessRegistration(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[2][0] - 1) }))).resolves.not.toThrow(/fee/)];
                        case 2:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('buildBusinessUpdate', function () {
        var address = Identities.Address.fromPassphrase('passphrase', 23);
        var publicKey = Identities.PublicKey.fromPassphrase('passphrase');
        var rawTransaction = {
            address: address,
            fee: new BigNumber(fees[2][2]),
            asset: {
                name: 'google',
                website: 'https://www.google.com',
                vat: 'GB123456',
                repository: 'https://github.com/arkecosystem/desktop-wallet.git'
            },
            passphrase: 'passphrase',
            secondPassphrase: 'second passphrase',
            networkWif: 170
        };
        describe('standard transaction', function () {
            it('should not build a v1 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setAip11AndSpy(false, false);
                            return [4 /*yield*/, expect(client.buildBusinessUpdate(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build a valid v2 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, client.buildBusinessUpdate(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            expect(transaction.asset.businessUpdate).toEqual(rawTransaction.asset);
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.typeGroup).toEqual(2);
                            expect(transaction.type).toEqual(2);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build a valid v2 transaction without optional data', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, newRawTransaction, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            newRawTransaction = __assign(__assign({}, rawTransaction), { asset: {
                                    name: 'google',
                                    website: 'https://www.google.com'
                                } });
                            return [4 /*yield*/, client.buildBusinessUpdate(newRawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            expect(transaction.asset.businessUpdate).toEqual(newRawTransaction.asset);
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.typeGroup).toEqual(2);
                            expect(transaction.type).toEqual(2);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is bigger than the static fee', function () {
            it('should throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            fee = new BigNumber(fees[2][2] + 1);
                            return [4 /*yield*/, expect(client.buildBusinessUpdate({ fee: fee })).rejects.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is smaller or equal to the static fee (5)', function () {
            it('should not throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, expect(client.buildBusinessUpdate(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[2][2]) }))).resolves.not.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, expect(client.buildBusinessUpdate(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[2][2] - 1) }))).resolves.not.toThrow(/fee/)];
                        case 2:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('buildBusinessResignation', function () {
        var address = Identities.Address.fromPassphrase('passphrase', 23);
        var publicKey = Identities.PublicKey.fromPassphrase('passphrase');
        var rawTransaction = {
            address: address,
            fee: new BigNumber(fees[2][1]),
            passphrase: 'passphrase',
            secondPassphrase: 'second passphrase',
            networkWif: 170
        };
        describe('standard transaction', function () {
            it('should not build a v1 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setAip11AndSpy(false, false);
                            return [4 /*yield*/, expect(client.buildBusinessResignation(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build a valid v2 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, client.buildBusinessResignation(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.typeGroup).toEqual(2);
                            expect(transaction.type).toEqual(1);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is bigger than the static fee', function () {
            it('should throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            fee = new BigNumber(fees[2][1] + 1);
                            return [4 /*yield*/, expect(client.buildBusinessResignation({ fee: fee })).rejects.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is smaller or equal to the static fee (5)', function () {
            it('should not throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, expect(client.buildBusinessResignation(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[2][1]) }))).resolves.not.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, expect(client.buildBusinessResignation(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[2][1] - 1) }))).resolves.not.toThrow(/fee/)];
                        case 2:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('buildBridgechainRegistration', function () {
        var address = Identities.Address.fromPassphrase('passphrase', 23);
        var publicKey = Identities.PublicKey.fromPassphrase('passphrase');
        var rawTransaction = {
            address: address,
            fee: new BigNumber(fees[2][3]),
            asset: {
                name: 'test_bridgechain',
                seedNodes: [
                    '1.1.1.1',
                    '2.2.2.2',
                    '3.3.3.3',
                    '4.4.4.4'
                ],
                ports: {
                    '@arkecosystem/core-api': 4003
                },
                genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
                bridgechainRepository: 'https://github.com/arkecosystem/core.git'
            },
            passphrase: 'passphrase',
            secondPassphrase: 'second passphrase',
            networkWif: 170
        };
        describe('standard transaction', function () {
            it('should not build a v1 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setAip11AndSpy(false, false);
                            return [4 /*yield*/, expect(client.buildBridgechainRegistration(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build a valid v2 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, client.buildBridgechainRegistration(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            expect(transaction.asset.bridgechainRegistration).toEqual(rawTransaction.asset);
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.typeGroup).toEqual(2);
                            expect(transaction.type).toEqual(3);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is bigger than the static fee', function () {
            it('should throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            fee = new BigNumber(fees[2][3] + 1);
                            return [4 /*yield*/, expect(client.buildBridgechainRegistration({ fee: fee })).rejects.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is smaller or equal to the static fee (5)', function () {
            it('should not throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, expect(client.buildBridgechainRegistration(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[2][3]) }))).resolves.not.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, expect(client.buildBridgechainRegistration(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[2][3] - 1) }))).resolves.not.toThrow(/fee/)];
                        case 2:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('buildBridgechainUpdate', function () {
        var address = Identities.Address.fromPassphrase('passphrase', 23);
        var publicKey = Identities.PublicKey.fromPassphrase('passphrase');
        var rawTransaction = {
            address: address,
            fee: new BigNumber(fees[2][5]),
            asset: {
                bridgechainId: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
                seedNodes: [
                    '1.1.1.1',
                    '2.2.2.2',
                    '3.3.3.3',
                    '4.4.4.4'
                ],
                ports: {
                    '@arkecosystem/core-api': 4003
                }
            },
            passphrase: 'passphrase',
            secondPassphrase: 'second passphrase',
            networkWif: 170
        };
        describe('standard transaction', function () {
            it('should not build a v1 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setAip11AndSpy(false, false);
                            return [4 /*yield*/, expect(client.buildBridgechainUpdate(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build a valid v2 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, client.buildBridgechainUpdate(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            expect(transaction.asset.bridgechainUpdate).toEqual(rawTransaction.asset);
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.typeGroup).toEqual(2);
                            expect(transaction.type).toEqual(5);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is bigger than the static fee', function () {
            it('should throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            fee = new BigNumber(fees[2][5] + 1);
                            return [4 /*yield*/, expect(client.buildBridgechainUpdate({ fee: fee })).rejects.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is smaller or equal to the static fee (5)', function () {
            it('should not throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, expect(client.buildBridgechainUpdate(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[2][5]) }))).resolves.not.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, expect(client.buildBridgechainUpdate(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[2][5] - 1) }))).resolves.not.toThrow(/fee/)];
                        case 2:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('buildBridgechainResignation', function () {
        var address = Identities.Address.fromPassphrase('passphrase', 23);
        var publicKey = Identities.PublicKey.fromPassphrase('passphrase');
        var rawTransaction = {
            address: address,
            fee: new BigNumber(fees[2][4]),
            bridgechainId: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
            passphrase: 'passphrase',
            secondPassphrase: 'second passphrase',
            networkWif: 170
        };
        describe('standard transaction', function () {
            it('should not build a v1 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setAip11AndSpy(false, false);
                            return [4 /*yield*/, expect(client.buildBridgechainResignation(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build a valid v2 transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, client.buildBridgechainResignation(rawTransaction, true)];
                        case 1:
                            transaction = _a.sent();
                            spy.mockRestore();
                            expect(transaction.asset.bridgechainResignation.bridgechainId).toEqual(rawTransaction.bridgechainId);
                            expect(transaction.fee).toEqual(rawTransaction.fee.toString());
                            expect(transaction.senderPublicKey).toEqual(publicKey);
                            expect(transaction.typeGroup).toEqual(2);
                            expect(transaction.type).toEqual(4);
                            expect(transaction.version).toEqual(2);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is bigger than the static fee', function () {
            it('should throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            fee = new BigNumber(fees[2][4] + 1);
                            return [4 /*yield*/, expect(client.buildBridgechainResignation({ fee: fee })).rejects.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when the fee is smaller or equal to the static fee (5)', function () {
            it('should not throw an Error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = setAip11AndSpy(true);
                            return [4 /*yield*/, expect(client.buildBridgechainResignation(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[2][4]) }))).resolves.not.toThrow(/fee/)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, expect(client.buildBridgechainResignation(__assign(__assign({}, rawTransaction), { fee: new BigNumber(fees[2][4] - 1) }))).resolves.not.toThrow(/fee/)];
                        case 2:
                            _a.sent();
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('broadcastTransaction', function () {
        beforeEach(function () {
            nock('http://127.0.0.1:4003')
                .post('/api/transactions')
                .reply(200, {
                data: 'transaction'
            });
        });
        it('should get current peer', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(store.getters, 'peer/current');
                        return [4 /*yield*/, client.broadcastTransaction({ network: 23 })];
                    case 1:
                        _a.sent();
                        expect(spy).toHaveBeenCalledTimes(1);
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should parse current peer if no peer found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyPeerCurrent, spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spyPeerCurrent = jest.spyOn(store.getters, 'peer/current').mockReturnValue(null);
                        spy = jest.spyOn(client, '__parseCurrentPeer');
                        return [4 /*yield*/, client.broadcastTransaction({ network: 23 })];
                    case 1:
                        _a.sent();
                        expect(spy).toHaveBeenCalledTimes(1);
                        spy.mockRestore();
                        spyPeerCurrent.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should do nothing if no transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(store.getters, 'peer/current');
                        return [4 /*yield*/, client.broadcastTransaction([])];
                    case 1:
                        _a.sent();
                        expect(spy).not.toHaveBeenCalled();
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should do nothing if empty transaction object', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(store.getters, 'peer/current');
                        return [4 /*yield*/, client.broadcastTransaction({})];
                    case 1:
                        _a.sent();
                        expect(spy).not.toHaveBeenCalled();
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return transaction response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.broadcastTransaction({ network: 23 })];
                    case 1:
                        response = _a.sent();
                        expect(response.length).toBe(1);
                        expect(response[0].body).toEqual({
                            data: 'transaction'
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        describe('broadcast', function () {
            var spyDispatch;
            beforeEach(function () {
                spyDispatch = jest.spyOn(store, 'dispatch').mockImplementation(function (_, peer) {
                    // Copied from peer store
                    var client = new ClientService(false);
                    var scheme = peer.isHttps ? 'https://' : 'http://';
                    client.host = "" + scheme + peer.ip + ":" + peer.port;
                    client.client.withOptions({ timeout: 3000 });
                    return client;
                });
                for (var _i = 0, _a = ['1.1.1.1', '2.2.2.2']; _i < _a.length; _i++) {
                    var ip = _a[_i];
                    nock("http://" + ip + ":8080")
                        .post('/api/transactions')
                        .reply(200, {
                        data: "broadcast transaction for " + ip
                    });
                }
            });
            afterEach(function () {
                spyDispatch.mockRestore();
            });
            it('should get peers to broadcast to', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(store.getters, 'peer/broadcastPeers');
                            return [4 /*yield*/, client.broadcastTransaction({ network: 23 }, true)];
                        case 1:
                            _a.sent();
                            expect(spy).toHaveBeenCalledTimes(1);
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should broadcast to all peers and return responses', function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.broadcastTransaction({ network: 23 }, true)];
                        case 1:
                            response = _a.sent();
                            expect(spyDispatch).toHaveBeenCalledWith('peer/clientServiceFromPeer', {
                                ip: '1.1.1.1',
                                port: '8080',
                                isHttps: false
                            });
                            expect(spyDispatch).toHaveBeenCalledWith('peer/clientServiceFromPeer', {
                                ip: '2.2.2.2',
                                port: '8080',
                                isHttps: false
                            });
                            expect(response.length).toBe(2);
                            expect(response[0].body).toEqual({
                                data: 'broadcast transaction for 1.1.1.1'
                            });
                            expect(response[1].body).toEqual({
                                data: 'broadcast transaction for 2.2.2.2'
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should broadcast to current peer if no broadcast peers', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(store.getters, 'peer/broadcastPeers').mockReturnValue();
                            return [4 /*yield*/, client.broadcastTransaction({ network: 23 }, true)];
                        case 1:
                            response = _a.sent();
                            spy.mockRestore();
                            expect(response.length).toBe(1);
                            expect(response[0].body).toEqual({
                                data: 'transaction'
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    // describe('__watchProfile', () => {
    //   it('should watch current profile', () => {
    //     client.__watchProfile()
    //     expect(store.watch).toHaveBeenCalledWith()
    //   })
    // })
});
//# sourceMappingURL=client.spec.js.map