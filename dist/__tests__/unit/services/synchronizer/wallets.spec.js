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
import config from '@config';
import { Action } from '@/services/synchronizer/wallets';
describe('Services > Synchronizer > Wallets', function () {
    var action;
    var profile;
    var profileWallets;
    var ledgerWallets;
    var contacts;
    var transactions;
    var transactionDeleteBulk;
    var transactionProcessVotes;
    beforeEach(function () {
        transactionDeleteBulk = jest.fn();
        transactionProcessVotes = jest.fn();
        var synchronizer = {
            $client: {},
            scope: {
                $logger: {
                    error: jest.fn()
                },
                $error: jest.fn(),
                $success: jest.fn()
            },
            $store: {
                getters: {
                    'ledger/wallets': [],
                    'session/backgroundUpdateLedger': true,
                    'wallet/byProfileId': jest.fn(),
                    'wallet/contactsByProfileId': jest.fn(),
                    'session/unconfirmedVotes': []
                },
                dispatch: function (action, data) {
                    if (action === 'transaction/deleteBulk') {
                        return transactionDeleteBulk(action, data);
                    }
                    else if (action === 'transaction/processVotes') {
                        return transactionProcessVotes(action, data);
                    }
                    else if (action === 'transaction/clearExpired') {
                        return [];
                    }
                }
            }
        };
        action = new Action(synchronizer);
        profile = { id: 'profile ID' };
        profileWallets = [
            { address: 'A1', transactions: {} },
            { address: 'A2', transactions: {} },
            { address: 'A3', transactions: {} },
            { address: 'A4', transactions: {} }
        ];
        ledgerWallets = {
            A1ledger: { address: 'A1ledger', transactions: {}, isLedger: true },
            A2ledger: { address: 'A2ledger', transactions: {}, isLedger: true }
        };
        contacts = [
            { address: 'Acon1', transactions: {} },
            { address: 'Acon2', transactions: {} }
        ];
        transactions = [
            { id: 'tx1', timestamp: 300 * 1000 },
            { id: 'tx2', timestamp: 400 * 1000 },
            { id: 'tx3', timestamp: 200 * 1000 },
            { id: 'tx4', timestamp: 110 * 1000 }
        ];
    });
    describe('static compareWalletData', function () {
        // TODO more properties
        var wallet = {
            address: 'A',
            isLedger: false
        };
        it('shoud return `true` if the data and the wallet data is the same', function () {
            var data = {
                address: wallet.address
            };
            expect(Action.compareWalletData(wallet, data)).toBeTrue();
        });
        it('shoud return `false` if the data and the wallet data is not the same', function () {
            var data = {
                address: 'Anot'
            };
            expect(Action.compareWalletData(wallet, data)).toBeFalse();
        });
    });
    describe('get profileWallets', function () {
        describe('when there is not a session profile', function () {
            beforeEach(function () { return (action.$scope.session_profile = undefined); });
            it('should return an empty Array', function () {
                expect(action.profileWallets).toBeEmpty();
            });
        });
        describe('when there is a session profile', function () {
            beforeEach(function () {
                action.$scope.session_profile = profile;
                action.$getters['wallet/byProfileId'].mockReturnValue(profileWallets);
            });
            it('should return its wallet', function () {
                expect(action.profileWallets).toBe(profileWallets);
                expect(action.$getters['wallet/byProfileId']).toHaveBeenCalledWith(profile.id);
            });
        });
    });
    describe('get ledgerWallets', function () {
        beforeEach(function () {
            action.$getters['ledger/wallets'] = ledgerWallets;
        });
        describe('when the Ledger is set to be updated on the background', function () {
            beforeEach(function () {
                action.$getters['session/backgroundUpdateLedger'] = true;
            });
            it('should return all the Ledger wallets', function () {
                expect(action.ledgerWallets).toBe(ledgerWallets);
            });
        });
        describe('when the Ledger is not set to be updated on the background', function () {
            beforeEach(function () {
                action.$getters['session/backgroundUpdateLedger'] = false;
            });
            it('should return an empty Array', function () {
                expect(action.ledgerWallets).toBeEmpty();
            });
        });
    });
    describe('get wallets', function () {
        beforeEach(function () {
            action.$scope.session_profile = profile;
            action.$getters['wallet/byProfileId'].mockReturnValue(profileWallets);
            action.$getters['ledger/wallets'] = ledgerWallets;
        });
        it('should return the regular wallets and Ledger wallets', function () {
            expect(action.wallets).toIncludeSameMembers(__spreadArrays(profileWallets, Object.values(ledgerWallets)));
        });
    });
    describe('get contacts', function () {
        describe('when there is not a session profile', function () {
            beforeEach(function () { return (action.$scope.session_profile = undefined); });
            it('should return an empty Array', function () {
                expect(action.contacts).toBeEmpty();
            });
        });
        describe('when there is a session profile', function () {
            beforeEach(function () {
                action.$scope.session_profile = profile;
                action.$getters['wallet/contactsByProfileId'].mockReturnValue(contacts);
            });
            it('should return its contacts', function () {
                expect(action.contacts).toBe(contacts);
                expect(action.$getters['wallet/contactsByProfileId']).toHaveBeenCalledWith(profile.id);
            });
        });
    });
    describe('get allWallets', function () {
        beforeEach(function () {
            action.$scope.session_profile = profile;
            action.$getters['wallet/byProfileId'].mockReturnValue(profileWallets);
            action.$getters['wallet/contactsByProfileId'].mockReturnValue(contacts);
            action.$getters['ledger/wallets'] = ledgerWallets;
        });
        it('should return the regular wallets, contacts and Ledger wallets', function () {
            expect(action.allWallets).toIncludeSameMembers(__spreadArrays(profileWallets, contacts, Object.values(ledgerWallets)));
        });
    });
    describe('get allWalletsByAdress', function () {
        beforeEach(function () {
            action.$scope.session_profile = profile;
            action.$getters['wallet/byProfileId'].mockReturnValue([
                profileWallets[0],
                profileWallets[1]
            ]);
            action.$getters['wallet/contactsByProfileId'].mockReturnValue(contacts);
            action.$getters['ledger/wallets'] = __assign({}, ledgerWallets);
            action.$getters['ledger/wallets'][profileWallets[0].address] = __assign(__assign({}, profileWallets[0]), { isLedger: true });
        });
        it('should return the regular wallets, contacts and Ledger wallets', function () {
            expect(action.allWalletsByAddress).toEqual({
                A1: [{ address: 'A1', transactions: {} }, { address: 'A1', isLedger: true, transactions: {} }],
                A2: [{ address: 'A2', transactions: {} }],
                Acon1: [{ address: 'Acon1', transactions: {} }],
                Acon2: [{ address: 'Acon2', transactions: {} }],
                A1ledger: [{ address: 'A1ledger', isLedger: true, transactions: {} }],
                A2ledger: [{ address: 'A2ledger', isLedger: true, transactions: {} }]
            });
        });
    });
    describe('run', function () {
        beforeEach(function () { return (action.sync = jest.fn()); });
        describe('when there are wallets of any kind', function () {
            beforeEach(function () {
                jest.spyOn(action, 'allWallets', 'get').mockReturnValue(contacts);
            });
            it('should sync them', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, action.run()];
                        case 1:
                            _a.sent();
                            expect(action.sync).toHaveBeenCalled();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when there are not any wallet of any kind', function () {
            beforeEach(function () {
                jest.spyOn(action, 'allWallets', 'get').mockReturnValue([]);
            });
            it('should not even try to sync them', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, action.run()];
                        case 1:
                            _a.sent();
                            expect(action.sync).not.toHaveBeenCalled();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('sync', function () {
        var walletsData;
        var transactionsByAddress;
        var walletsToUpdate;
        beforeEach(function () {
            transactionsByAddress = {};
            profileWallets.forEach(function (wallet) {
                transactionsByAddress[wallet.address] = [];
            });
            walletsToUpdate = Object.values(ledgerWallets);
            action.fetch = jest.fn();
            action.process = jest.fn();
            action.update = jest.fn();
            action.fetch.mockImplementation(function () {
                return { walletsData: walletsData, transactionsByAddress: transactionsByAddress };
            });
            action.process.mockImplementation(function () {
                return walletsToUpdate;
            });
        });
        it('should fetch the data', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, action.sync()];
                    case 1:
                        _a.sent();
                        expect(action.fetch).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should process the fetched data', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, action.sync()];
                    case 1:
                        _a.sent();
                        expect(action.process).toHaveBeenCalledWith(walletsData, transactionsByAddress);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('when there are not wallets to update', function () {
            beforeEach(function () {
                action.process.mockImplementation(function () {
                    return [];
                });
            });
            it('should not update them', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, action.sync()];
                        case 1:
                            _a.sent();
                            expect(action.update).not.toHaveBeenCalled();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when there are wallets to update', function () {
            it('should update them', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, action.sync()];
                        case 1:
                            _a.sent();
                            expect(action.update).toHaveBeenCalledWith(walletsToUpdate);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('fetch', function () {
        var addresses;
        var allAddresses;
        var walletsData;
        var transactionsByAddress;
        beforeEach(function () {
            jest.spyOn(action, 'wallets', 'get').mockReturnValue(__spreadArrays(profileWallets, Object.values(ledgerWallets)));
            jest.spyOn(action, 'allWallets', 'get').mockReturnValue(__spreadArrays(profileWallets, Object.values(ledgerWallets), contacts));
            action.emit = jest.fn();
            addresses = action.wallets.map(function (wallet) { return wallet.address; });
            allAddresses = action.allWallets.map(function (wallet) { return wallet.address; });
            action.fetchWalletsData = jest.fn();
            action.fetchWalletsTransactions = jest.fn();
            walletsData = [
                profileWallets[0],
                { address: Object.values(ledgerWallets)[1].address }
            ];
            transactionsByAddress = {};
            profileWallets.forEach(function (wallet) {
                transactionsByAddress[wallet.address] = wallet;
            });
            action.fetchWalletsData.mockImplementation(function () {
                return walletsData;
            });
            action.fetchWalletsTransactions.mockImplementation(function () {
                return transactionsByAddress;
            });
        });
        it('should fetch the data of every regular wallet, Ledger wallet or contact', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, action.fetch()];
                    case 1:
                        _a.sent();
                        expect(action.fetchWalletsData).toHaveBeenCalledWith(allAddresses);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fetch the transactions of every regular or Ledger wallet', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, action.fetch()];
                    case 1:
                        _a.sent();
                        expect(action.fetchWalletsTransactions).toHaveBeenCalledWith(addresses);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return the fetched data and transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, action.fetch()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual({ walletsData: walletsData, transactionsByAddress: transactionsByAddress });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should emit `transactions:fetched` with the transactions grouped by address', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, action.fetch()];
                    case 1:
                        _a.sent();
                        expect(action.emit).toHaveBeenCalledWith('transactions:fetched', transactionsByAddress);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('when there are duplicated addresses', function () {
            it('should ignore duplicates', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            jest.spyOn(action, 'wallets', 'get').mockReturnValue(__spreadArrays(profileWallets, Object.values(ledgerWallets), [
                                profileWallets[1],
                                Object.values(ledgerWallets)[0]
                            ]));
                            jest.spyOn(action, 'allWallets', 'get').mockReturnValue(__spreadArrays(profileWallets, Object.values(ledgerWallets), contacts, [
                                contacts[1],
                                Object.values(ledgerWallets)[1],
                                profileWallets[3]
                            ]));
                            return [4 /*yield*/, action.fetch()];
                        case 1:
                            _a.sent();
                            expect(action.fetchWalletsData).toHaveBeenCalledWith(allAddresses);
                            expect(action.fetchWalletsTransactions).toHaveBeenCalledWith(addresses);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('fetchWalletsData', function () {
        var addresses;
        beforeEach(function () {
            addresses = action.wallets.map(function (wallet) { return wallet.address; });
            action.$client.fetchWallets = jest.fn();
        });
        it('should fetch the data of each wallet address', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, action.fetchWalletsData(addresses)];
                    case 1:
                        _a.sent();
                        expect(action.$client.fetchWallets).toHaveBeenCalledWith(addresses);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchWalletsTransactions', function () {
        var addresses;
        beforeEach(function () {
            addresses = action.wallets.map(function (wallet) { return wallet.address; });
            action.$client.fetchTransactionsForWallets = jest.fn();
        });
        it('should fetch the transactions of each wallet address', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, action.fetchWalletsTransactions(addresses)];
                    case 1:
                        _a.sent();
                        expect(action.$client.fetchTransactionsForWallets).toHaveBeenCalledWith(addresses);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('process', function () {
        var walletsData;
        var transactionsByAddress;
        beforeEach(function () {
            var _a;
            walletsData = [
                { address: profileWallets[0].address, balance: 1 }
            ];
            transactionsByAddress = (_a = {},
                _a[profileWallets[0].address] = transactions,
                _a[profileWallets[1].address] = transactions,
                _a);
            action.processWalletsData = jest.fn();
            action.processTransactions = jest.fn();
            jest.spyOn(action, 'allWallets', 'get').mockReturnValue([
                profileWallets[0],
                profileWallets[1]
            ]);
            action.processWalletsData = jest.fn().mockImplementation(function () {
                var _a;
                return _a = {}, _a[walletsData[0].address] = walletsData[0], _a;
            });
            action.processTransactions = jest.fn().mockImplementation(function (transactionsByAddress) {
                return Object.keys(transactionsByAddress).reduce(function (all, address) {
                    all[address] = transactionsByAddress[address][0].timestamp;
                    return all;
                }, {});
            });
        });
        it('should process the wallet data', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, action.process(walletsData, transactionsByAddress)];
                    case 1:
                        _a.sent();
                        expect(action.processWalletsData).toHaveBeenCalledWith(walletsData);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should process the transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, action.process(walletsData, transactionsByAddress)];
                    case 1:
                        _a.sent();
                        expect(action.processTransactions).toHaveBeenCalledWith(transactionsByAddress);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('processWalletsData', function () {
        beforeEach(function () {
            jest.spyOn(action, 'allWallets', 'get').mockReturnValue([
                profileWallets[0],
                Object.values(ledgerWallets)[0],
                contacts[0]
            ]);
        });
        describe('when no data is passed', function () {
            it('should return an empty `Object`', function () {
                expect(action.processWalletsData([])).toEqual({});
            });
        });
        describe('when the data has changed', function () {
            it('should return them aggregated by address', function () {
                var _a;
                var data = [
                    __assign(__assign({}, profileWallets[0]), { balance: 10 }),
                    __assign(__assign({}, Object.values(ledgerWallets)[0]), { balance: 11 }),
                    __assign(__assign({}, contacts[0]), { balance: 12 })
                ];
                expect(action.processWalletsData(data)).toEqual((_a = {},
                    _a[data[0].address] = data[0],
                    _a[data[1].address] = data[1],
                    _a[data[2].address] = data[2],
                    _a));
            });
        });
        describe('when the data has not changed', function () {
            it('should not return them', function () {
                var data = [
                    __assign({}, profileWallets[0]),
                    __assign({}, Object.values(ledgerWallets)[0]),
                    __assign({}, contacts[0])
                ];
                expect(action.processWalletsData(data)).toEqual({});
            });
        });
    });
    describe('processTransactions', function () {
        var transactionsByAddress;
        beforeEach(function () {
            var _a;
            transactionsByAddress = (_a = {},
                _a[profileWallets[0].address] = transactions,
                _a[profileWallets[1].address] = transactions,
                _a);
            action.processWalletTransactions = jest.fn().mockImplementation(function (_, transactions) {
                return transactions[0].timestamp;
            });
            jest.spyOn(action, 'wallets', 'get').mockReturnValue(profileWallets);
        });
        describe('when a wallet doest not have transactions', function () {
            beforeEach(function () {
                profileWallets.forEach(function (wallet) {
                    transactionsByAddress[wallet.address] = [];
                });
            });
            it('should not try to process them', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, action.processTransactions(transactionsByAddress)];
                        case 1:
                            _a.sent();
                            expect(action.processWalletTransactions).not.toHaveBeenCalled();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when wallets have transactions', function () {
            it('should process them', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, action.processTransactions(transactionsByAddress)];
                        case 1:
                            _a.sent();
                            profileWallets.slice(0, 2).forEach(function (wallet) {
                                expect(action.processWalletTransactions).toHaveBeenCalledWith(wallet, transactions);
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return the timestamp of new transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, action.processTransactions(transactionsByAddress)];
                        case 1:
                            _a.apply(void 0, [_c.sent()]).toEqual((_b = {},
                                _b[profileWallets[0].address] = transactions[0].timestamp,
                                _b[profileWallets[1].address] = transactions[0].timestamp,
                                _b));
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('processWalletTransactions', function () {
        var wallet;
        beforeEach(function () {
            wallet = profileWallets[2];
            action.displayNewTransaction = jest.fn();
            jest.spyOn(action.synchronizer.$store, 'dispatch');
        });
        describe('when all of them are old', function () {
            beforeEach(function () {
                wallet.transactions.checkedAt = 50000 * 1000;
            });
            it('should not return the timestamp', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, action.processWalletTransactions(wallet, transactions)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).toBeUndefined();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should dispatch the `transaction/deleteBulk` Vuex action', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, action.processWalletTransactions(wallet, transactions)];
                        case 1:
                            _a.sent();
                            expect(transactionDeleteBulk).toHaveBeenCalledTimes(1);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not display the new transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, action.processWalletTransactions(wallet, transactions)];
                        case 1:
                            _a.sent();
                            expect(action.displayNewTransaction).not.toHaveBeenCalled();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when transactions include votes', function () {
            beforeEach(function () {
                transactions[0].type = config.TRANSACTION_TYPES.GROUP_1.VOTE;
            });
            it('should process the votes', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, action.processWalletTransactions(wallet, transactions)];
                        case 1:
                            _a.sent();
                            expect(action.synchronizer.$store.dispatch).toHaveBeenCalledWith('transaction/processVotes', transactions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('processUnconfirmedVotes', function () {
            var votes;
            beforeEach(function () {
                votes = [{
                        address: 'test'
                    }, {
                        address: 'test'
                    }];
                action.$client.fetchWalletVotes = jest.fn(function () { return votes; });
                action.$getters['session/unconfirmedVotes'] = [{
                        address: 'test'
                    }, {
                        address: 'test-2'
                    }];
            });
            it('should fetch votes for wallets with unconfirmed vote transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, action.processUnconfirmedVotes()];
                        case 1:
                            _a.sent();
                            expect(action.$client.fetchWalletVotes).toHaveBeenNthCalledWith(1, 'test');
                            expect(action.$client.fetchWalletVotes).toHaveBeenNthCalledWith(2, 'test-2');
                            expect(transactionProcessVotes).toHaveBeenCalledWith('transaction/processVotes', votes);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when at least 1 of them is new', function () {
            var latestTransaction;
            beforeEach(function () {
                latestTransaction = transactions[1];
                wallet.transactions.checkedAt = latestTransaction.timestamp - 10;
            });
            it('should return the timestamp', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, action.processWalletTransactions(wallet, transactions)];
                        case 1:
                            _a.apply(void 0, [_b.sent()])
                                .toEqual(latestTransaction.timestamp);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should display the new transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, action.processWalletTransactions(wallet, transactions)];
                        case 1:
                            _a.sent();
                            expect(action.displayNewTransaction).toHaveBeenCalledWith(latestTransaction, wallet);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('update', function () {
        beforeEach(function () {
            jest.spyOn(action.synchronizer.$store, 'dispatch');
        });
        it('should update in bulk regular wallets', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, action.update(profileWallets)];
                    case 1:
                        _a.sent();
                        expect(action.synchronizer.$store.dispatch).toHaveBeenCalledWith('wallet/updateBulk', profileWallets);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update all Ledger wallets at once', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, action.update(ledgerWallets)];
                    case 1:
                        _a.sent();
                        expect(action.synchronizer.$store.dispatch).toHaveBeenCalledWith('ledger/updateWallets', ledgerWallets);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should log errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jest.spyOn(action.synchronizer.$store, 'dispatch').mockImplementation(function () {
                            throw new Error('Example error');
                        });
                        return [4 /*yield*/, action.update(profileWallets)];
                    case 1:
                        _a.sent();
                        expect(action.$scope.$logger.error).toHaveBeenCalledWith('Example error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=wallets.spec.js.map