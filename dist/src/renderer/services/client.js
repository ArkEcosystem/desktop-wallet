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
import { Connection } from '@arkecosystem/client';
import { castArray, chunk, orderBy } from 'lodash';
import logger from 'electron-log';
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config';
import store from '@/store';
import TransactionService from '@/services/transaction';
import { TransactionBuilderService } from './crypto/transaction-builder.service';
import { TransactionSigner } from './crypto/transaction-signer';
import BigNumber from '@/plugins/bignumber';
import { camelToUpperSnake } from '@/utils';
var ClientService = /** @class */ (function () {
    function ClientService() {
        this.__host = null;
        this.client = new Connection('http://localhost');
    }
    /**
     * Generate a new connection instance.
     *
     * @param  {String} server         Host URL to connect to server
     * @param  {Number} [timeout=5000] Connection timeout
     * @return {Connection}
     */
    ClientService.newConnection = function (server, timeout) {
        return new Connection(server + "/api").withOptions({
            timeout: timeout || 5000
        });
    };
    /**
     * Fetch the network configuration according to the version.
     * In case the `vendorField` length has changed, updates the network data.
     * Create a new client to isolate the main client.
     *
     * @param {String} server
     * @param {Number} timeout
     * @returns {Object}
     */
    ClientService.fetchNetworkConfig = function (server, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, currentNetwork, newLength;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ClientService.newConnection(server, timeout)
                            .api('node')
                            .configuration()];
                    case 1:
                        response = _a.sent();
                        data = response.body.data;
                        currentNetwork = store.getters['session/network'];
                        if (!(currentNetwork && currentNetwork.nethash === data.nethash)) return [3 /*break*/, 3];
                        newLength = data.constants.vendorFieldLength;
                        if (!(newLength &&
                            (!currentNetwork.vendorField ||
                                newLength !== currentNetwork.vendorField.maxLength))) return [3 /*break*/, 3];
                        currentNetwork.vendorField = {
                            maxLength: newLength
                        };
                        return [4 /*yield*/, store.dispatch('network/update', currentNetwork)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * Fetch the network crypto data, e.g. milestones
     *
     * @param {String} server
     * @param {Number} timeout
     * @returns {Object}
     */
    ClientService.fetchNetworkCrypto = function (server, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ClientService.newConnection(server, timeout)
                            .api('node')
                            .crypto()];
                    case 1: return [2 /*return*/, (_a.sent()).body.data];
                }
            });
        });
    };
    ClientService.fetchFeeStatistics = function (server, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_1, groupsIds, parsedFees;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ClientService.newConnection(server, timeout)
                                .api('node')
                                .fees(7)];
                    case 1:
                        response = _a.sent();
                        data = response.body.data;
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, []];
                    case 3:
                        /*
                          The peer can send 2 types of response: an Array and and Object.
                          In case it sends an Object, the fees should be parsed according to the
                          transaction groups and types from @config.
                        */
                        // Case it is an Object
                        if (!Array.isArray(data)) {
                            groupsIds = Object.values(TRANSACTION_GROUPS).filter(function (groupId) { return !!data[groupId]; });
                            parsedFees = groupsIds.reduce(function (accumulator, groupId) {
                                var retrivedTypeNames = Object.keys(data[groupId]);
                                // Parse the fees and add to accumulator
                                accumulator[groupId] = retrivedTypeNames.map(function (typeName) {
                                    var fees = data[groupId][typeName];
                                    /*
                                      Notice that the types are in different format.
                                      Response is in cammelCase. Eg: 'bussinesUpdate'
                                      @config is in UPPER_SNAKE_CASE. Eg: 'BUSSINES_UPDATE'
                                    */
                                    var groupName = "GROUP_" + groupId;
                                    var parsedTypeName = camelToUpperSnake(typeName);
                                    var type = TRANSACTION_TYPES[groupName][parsedTypeName];
                                    return {
                                        type: type,
                                        fees: {
                                            minFee: Number(fees.min),
                                            maxFee: Number(fees.max),
                                            avgFee: Number(fees.avg)
                                        }
                                    };
                                });
                                return accumulator;
                            }, {});
                            return [2 /*return*/, parsedFees];
                        }
                        // Case the response is an Array
                        return [2 /*return*/, data.map(function (fee) { return ({
                                type: Number(fee.type),
                                fees: {
                                    minFee: Number(fee.min),
                                    maxFee: Number(fee.max),
                                    avgFee: Number(fee.avg)
                                }
                            }); })];
                }
            });
        });
    };
    Object.defineProperty(ClientService.prototype, "host", {
        get: function () {
            return this.__host;
        },
        set: function (host) {
            this.__host = host + "/api";
            this.client = ClientService.newConnection(host);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Fetch the peer status.
     * @returns {Object}
     */
    ClientService.prototype.fetchPeerStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.api('node').syncing()];
                    case 1: return [2 /*return*/, (_a.sent()).body.data];
                }
            });
        });
    };
    /** Request the delegates according to the current network version
     *
     * @param {Object} [query]
     * @param {Number} [query.page=1]
     * @param {Number} [query.limit=51]
     * @param {String} [query.orderBy='rank:asc']
     * @return {Object[]}
     */
    ClientService.prototype.fetchDelegates = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var network, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        network = store.getters['session/network'];
                        options.page || (options.page = 1);
                        options.limit || (options.limit = network.constants.activeDelegates);
                        options.orderBy || (options.orderBy = 'rank:asc');
                        return [4 /*yield*/, this.client.api('delegates').all({
                                page: options.page,
                                limit: options.limit,
                                orderBy: options.orderBy
                            })];
                    case 1:
                        body = (_a.sent()).body;
                        return [2 /*return*/, {
                                delegates: body.data,
                                meta: body.meta
                            }];
                }
            });
        });
    };
    /**
     * Fetches the voters of the given delegates and returns the number of total voters
     *
     * @return {Number}
     */
    ClientService.prototype.fetchDelegateVoters = function (delegate, _a) {
        var _b = _a === void 0 ? {} : _a, page = _b.page, limit = _b.limit;
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.client
                            .api('delegates')
                            .voters(delegate.username, { page: page, limit: limit })];
                    case 1:
                        body = (_c.sent()).body;
                        return [2 /*return*/, body.meta.totalCount];
                }
            });
        });
    };
    ClientService.prototype.fetchDelegateForged = function (delegate) {
        if (delegate.forged) {
            return delegate.forged.total;
        }
        return '0';
    };
    /**
     * Fetches the static fees for transaction types.
     * @return {Number[]}
     */
    ClientService.prototype.fetchStaticFees = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fees;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.api('transactions').fees()];
                    case 1:
                        fees = (_a.sent()).body.data;
                        return [2 /*return*/, fees];
                }
            });
        });
    };
    /**
     * Fetch the latest transactions
     *
     * @param {Object} [query]
     * @param {Number} [query.page=1]
     * @param {Number} [query.limit=100]
     * @return {Array}
     */
    ClientService.prototype.fetchTransactions = function (_a) {
        var _b = _a === void 0 ? {} : _a, page = _b.page, limit = _b.limit;
        return __awaiter(this, void 0, void 0, function () {
            var totalCount, transactions, body;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        page || (page = 1);
                        limit || (limit = 100);
                        totalCount = 0;
                        transactions = [];
                        return [4 /*yield*/, this.client.api('transactions').all({
                                limit: limit,
                                page: page
                            })];
                    case 1:
                        body = (_c.sent()).body;
                        transactions = body.data.map(function (transaction) {
                            transaction.timestamp = transaction.timestamp.unix * 1000; // to milliseconds
                            return transaction;
                        });
                        totalCount = body.meta.totalCount;
                        return [2 /*return*/, {
                                transactions: transactions,
                                totalCount: totalCount
                            }];
                }
            });
        });
    };
    /**
     * Fetch bridgechains for a business.
     * @param  {String} address
     * @return {Object}
     */
    ClientService.prototype.fetchBusinessBridgechains = function (address, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options.page || (options.page = 1);
                        options.limit || (options.limit = 50);
                        options.orderBy || (options.orderBy = 'name:asc');
                        return [4 /*yield*/, this.client.api('businesses').bridgechains(address, {
                                page: options.page,
                                limit: options.limit,
                                orderBy: options.orderBy
                            })];
                    case 1: return [2 /*return*/, (_a.sent()).body];
                }
            });
        });
    };
    /**
     * Request the transactions according to the current network version
     *
     * V1:
     *   - The timestamp returned from the api is relative to the mainnet release date.
     *   - Map keys to match the v2 response structure.
     *
     * V2:
     *   - The timestamp field is an object that already returns converted date.
     *
     * @param {String} address
     * @param {Object} [query]
     * @param {Number} [query.page=1]
     * @param {Number} [query.limit=50]
     * @return {Object[]}
     */
    ClientService.prototype.fetchWalletTransactions = function (address, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var totalCount, transactions, queryOptions, body, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options.page || (options.page = 1);
                        options.limit || (options.limit = 50);
                        options.orderBy || (options.orderBy = 'timestamp:desc');
                        totalCount = 0;
                        transactions = [];
                        queryOptions = {
                            orderBy: options.orderBy,
                            limit: options.limit,
                            page: options.page
                        };
                        if (options.transactionType) {
                            queryOptions.type = options.transactionType;
                        }
                        return [4 /*yield*/, this.client
                                .api('wallets')
                                .transactions(address, queryOptions)];
                    case 1:
                        body = (_a.sent()).body;
                        transactions = body.data.map(function (transaction) {
                            transaction.timestamp = transaction.timestamp.unix * 1000; // to milliseconds
                            return transaction;
                        });
                        store.dispatch('transaction/processVotes', transactions);
                        totalCount = body.meta.totalCount;
                        result = transactions.map(function (transaction) {
                            transaction.isSender = transaction.sender === address;
                            transaction.isRecipient = transaction.recipient === address;
                            transaction.totalAmount = TransactionService.getTotalAmount(transaction);
                            return transaction;
                        });
                        return [2 /*return*/, {
                                transactions: result,
                                totalCount: totalCount
                            }];
                }
            });
        });
    };
    /**
     * Fetch transactions from a bulk list of addresses.
     * @param  {String[]} addresses
     * @param  {Object} options
     * @return {Object}
     */
    ClientService.prototype.fetchTransactionsForWallets = function (addresses, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var walletData, transactions, hadFailure, _i, _a, addressChunk, body, error_2, _b, transactions_1, transaction, _c, _d, payment, _e, _f, address, _g, addresses_1, address, _h, _j, error_3, message;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        options = options || {};
                        walletData = {};
                        transactions = [];
                        hadFailure = false;
                        _i = 0, _a = chunk(addresses, 20);
                        _k.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        addressChunk = _a[_i];
                        _k.label = 2;
                    case 2:
                        _k.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.client.api('transactions').search({
                                addresses: addressChunk
                            })];
                    case 3:
                        body = (_k.sent()).body;
                        transactions.push.apply(transactions, body.data);
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _k.sent();
                        logger.error(error_2);
                        hadFailure = true;
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        if (!hadFailure) {
                            transactions = orderBy(transactions, 'timestamp', 'desc').map(function (transaction) {
                                transaction.timestamp = transaction.timestamp.unix * 1000; // to milliseconds
                                transaction.isSender = addresses.includes(transaction.sender);
                                transaction.isRecipient = addresses.includes(transaction.recipient);
                                return transaction;
                            });
                            for (_b = 0, transactions_1 = transactions; _b < transactions_1.length; _b++) {
                                transaction = transactions_1[_b];
                                if (addresses.includes(transaction.sender)) {
                                    if (!walletData[transaction.sender]) {
                                        walletData[transaction.sender] = {};
                                    }
                                    walletData[transaction.sender][transaction.id] = transaction;
                                }
                                if (transaction.recipient &&
                                    addresses.includes(transaction.recipient)) {
                                    if (!walletData[transaction.recipient]) {
                                        walletData[transaction.recipient] = {};
                                    }
                                    walletData[transaction.recipient][transaction.id] = transaction;
                                }
                                if (transaction.asset && transaction.asset.payments) {
                                    for (_c = 0, _d = transaction.asset.payments; _c < _d.length; _c++) {
                                        payment = _d[_c];
                                        if (addresses.includes(payment.recipientId)) {
                                            if (!walletData[payment.recipientId]) {
                                                walletData[payment.recipientId] = {};
                                            }
                                            walletData[payment.recipientId][transaction.id] = transaction;
                                        }
                                    }
                                }
                            }
                            for (_e = 0, _f = Object.keys(walletData); _e < _f.length; _e++) {
                                address = _f[_e];
                                if (walletData[address]) {
                                    walletData[address] = Object.values(walletData[address]);
                                }
                            }
                            return [2 /*return*/, walletData];
                        }
                        _g = 0, addresses_1 = addresses;
                        _k.label = 7;
                    case 7:
                        if (!(_g < addresses_1.length)) return [3 /*break*/, 12];
                        address = addresses_1[_g];
                        _k.label = 8;
                    case 8:
                        _k.trys.push([8, 10, , 11]);
                        _h = walletData;
                        _j = address;
                        return [4 /*yield*/, this.fetchWalletTransactions(address, options)];
                    case 9:
                        _h[_j] = (_k.sent()).transactions;
                        return [3 /*break*/, 11];
                    case 10:
                        error_3 = _k.sent();
                        logger.error(error_3);
                        message = error_3.response
                            ? error_3.response.body.message
                            : error_3.message;
                        if (message !== 'Wallet not found') {
                            throw error_3;
                        }
                        return [3 /*break*/, 11];
                    case 11:
                        _g++;
                        return [3 /*break*/, 7];
                    case 12: return [2 /*return*/, walletData];
                }
            });
        });
    };
    /**
     * Fetches wallet data from an address.
     * @param {String} address
     * @return {Object}
     */
    ClientService.prototype.fetchWallet = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.api('wallets').get(address)];
                    case 1:
                        body = (_a.sent()).body;
                        return [2 /*return*/, body.data];
                }
            });
        });
    };
    /**
     * Fetches wallet data from a bulk list of addresses.
     * @param  {String[]} addresses
     * @return {Object[]}
     */
    ClientService.prototype.fetchWallets = function (addresses) {
        return __awaiter(this, void 0, void 0, function () {
            var walletData, _i, _a, addressChunk, body;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        walletData = [];
                        _i = 0, _a = chunk(addresses, 20);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        addressChunk = _a[_i];
                        return [4 /*yield*/, this.client.api('wallets').search({
                                addresses: addressChunk
                            })];
                    case 2:
                        body = (_b.sent()).body;
                        walletData.push.apply(walletData, body.data);
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, walletData];
                }
            });
        });
    };
    /**
     * Request the vote of a wallet.
     * Returns the delegate's public key if this wallet has voted, null otherwise.
     * @param {String} address
     * @returns {String|null}
     */
    ClientService.prototype.fetchWalletVote = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var walletData, error_4, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.fetchWallet(address)];
                    case 1:
                        walletData = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        logger.error(error_4);
                        message = error_4.response
                            ? error_4.response.body.message
                            : error_4.message;
                        if (message !== 'Wallet not found') {
                            throw error_4;
                        }
                        return [3 /*break*/, 3];
                    case 3:
                        if (walletData) {
                            return [2 /*return*/, walletData.vote || null];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Fetch votes for wallet.
     *
     * @param {String} address
     * @returns {Object[]}
     */
    ClientService.prototype.fetchWalletVotes = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.api('wallets').votes(address)];
                    case 1: return [2 /*return*/, (_a.sent()).body.data];
                }
            });
        });
    };
    /**
     * Parse peer from current client host.
     * @return {Object}
     */
    ClientService.prototype.__parseCurrentPeer = function () {
        var matches = /(https?:\/\/)([a-zA-Z0-9.\-_]+)(:([0-9]*))?/.exec(this.host);
        var scheme = matches[1];
        var ip = matches[2];
        var port = matches[4];
        var isHttps = scheme === 'https://';
        return {
            ip: ip,
            port: port || (isHttps ? '443' : '80'),
            isHttps: isHttps
        };
    };
    ClientService.prototype.getNonceForAddress = function (_a) {
        var address = _a.address, networkId = _a.networkId;
        return __awaiter(this, void 0, void 0, function () {
            var network, response, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (networkId) {
                            network = store.getters['network/byId'](networkId);
                        }
                        if (!network) {
                            network = store.getters['session/network'];
                        }
                        if (!network.constants.aip11) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.fetchWallet(address)];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/, BigNumber(response.nonce || 0)
                                .plus(1)
                                .toString()];
                    case 3:
                        error_5 = _b.sent();
                        return [2 /*return*/, '1'];
                    case 4: return [2 /*return*/, undefined];
                }
            });
        });
    };
    // todo: move this out
    ClientService.prototype.buildTransfer = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__buildTransaction('buildTransfer', data, isAdvancedFee, returnObject)];
            });
        });
    };
    // todo: move this out
    ClientService.prototype.buildSecondSignatureRegistration = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__buildTransaction('buildSecondSignatureRegistration', data, isAdvancedFee, returnObject)];
            });
        });
    };
    // todo: move this out
    ClientService.prototype.buildDelegateRegistration = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__buildTransaction('buildDelegateRegistration', data, isAdvancedFee, returnObject)];
            });
        });
    };
    // todo: move this out
    ClientService.prototype.buildVote = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__buildTransaction('buildVote', data, isAdvancedFee, returnObject)];
            });
        });
    };
    // todo: move this out
    ClientService.prototype.buildMultiSignature = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__buildTransaction('buildMultiSignature', data, isAdvancedFee, returnObject)];
            });
        });
    };
    // todo: move this out
    ClientService.prototype.buildIpfs = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__buildTransaction('buildIpfs', data, isAdvancedFee, returnObject)];
            });
        });
    };
    // todo: move this out
    ClientService.prototype.buildMultiPayment = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__buildTransaction('buildMultiPayment', data, isAdvancedFee, returnObject)];
            });
        });
    };
    // todo: move this out
    ClientService.prototype.buildDelegateResignation = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__buildTransaction('buildDelegateResignation', data, isAdvancedFee, returnObject)];
            });
        });
    };
    // todo: move this out
    ClientService.prototype.buildBusinessRegistration = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__buildTransaction('buildBusinessRegistration', data, isAdvancedFee, returnObject)];
            });
        });
    };
    // todo: move this out
    ClientService.prototype.buildBusinessUpdate = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__buildTransaction('buildBusinessUpdate', data, isAdvancedFee, returnObject)];
            });
        });
    };
    // todo: move this out
    ClientService.prototype.buildBusinessResignation = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__buildTransaction('buildBusinessResignation', data, isAdvancedFee, returnObject)];
            });
        });
    };
    // todo: move this out
    ClientService.prototype.buildBridgechainRegistration = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__buildTransaction('buildBridgechainRegistration', data, isAdvancedFee, returnObject)];
            });
        });
    };
    // todo: move this out
    ClientService.prototype.buildBridgechainUpdate = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__buildTransaction('buildBridgechainUpdate', data, isAdvancedFee, returnObject)];
            });
        });
    };
    // todo: move this out
    ClientService.prototype.buildBridgechainResignation = function (data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__buildTransaction('buildBridgechainResignation', data, isAdvancedFee, returnObject)];
            });
        });
    };
    // todo: move this out
    ClientService.prototype.__buildTransaction = function (builder, data, isAdvancedFee, returnObject) {
        if (isAdvancedFee === void 0) { isAdvancedFee = false; }
        if (returnObject === void 0) { returnObject = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _b = (_a = TransactionBuilderService)[builder];
                        _c = [__assign({}, data)];
                        _d = {};
                        return [4 /*yield*/, this.getNonceForAddress(data)];
                    case 1: return [2 /*return*/, _b.apply(_a, [__assign.apply(void 0, _c.concat([(_d.nonce = _e.sent(), _d)])), isAdvancedFee,
                            returnObject])];
                }
            });
        });
    };
    // todo: move this out
    ClientService.prototype.multiSign = function (transaction, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, TransactionSigner.multiSign(transaction, data)];
            });
        });
    };
    /**
     * Broadcast transactions to the current peer.
     *
     * @param {Array|Object} transactions
     * @param {Boolean} broadcast - whether the transaction should be broadcasted to multiple peers or not
     * @returns {Object[]}
     */
    ClientService.prototype.broadcastTransaction = function (transactions, broadcast) {
        return __awaiter(this, void 0, void 0, function () {
            var currentPeer, failedBroadcast, txs, peers, i, client, transaction, err_1, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (Array.isArray(transactions) && !transactions.length) {
                            return [2 /*return*/, []];
                        }
                        else if (typeof transactions === 'object' && !transactions.network) {
                            return [2 /*return*/, []];
                        }
                        currentPeer = store.getters['peer/current']();
                        if (!currentPeer) {
                            currentPeer = this.__parseCurrentPeer();
                        }
                        failedBroadcast = false;
                        if (!broadcast) return [3 /*break*/, 9];
                        txs = [];
                        peers = store.getters['peer/broadcastPeers']();
                        if (!(peers && peers.length)) return [3 /*break*/, 8];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < peers.length)) return [3 /*break*/, 7];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, store.dispatch('peer/clientServiceFromPeer', peers[i])];
                    case 3:
                        client = _a.sent();
                        return [4 /*yield*/, client.client.api('transactions').create({
                                transactions: castArray(transactions)
                            })];
                    case 4:
                        transaction = _a.sent();
                        txs.push(transaction);
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, txs];
                    case 8:
                        failedBroadcast = true;
                        _a.label = 9;
                    case 9:
                        if (!(!broadcast || failedBroadcast)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.client.api('transactions').create({
                                transactions: castArray(transactions)
                            })];
                    case 10:
                        transaction = _a.sent();
                        return [2 /*return*/, [transaction]];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    return ClientService;
}());
export default ClientService;
//# sourceMappingURL=client.js.map