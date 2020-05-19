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
import { createLocalVue, mount } from '@vue/test-utils';
import nock from 'nock';
import installI18n from '../../../__utils__/i18n';
import { WalletTransactions } from '@/components/Wallet/WalletTransactions';
import WalletTransactionsMixin from '@/components/Wallet/WalletTransactions/mixin';
import * as mergeTableTransactions from '@/components/utils/merge-table-transactions';
import ClientService from '@/services/client';
var clientService = new ClientService(false);
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var sampleTransactions = Object.freeze([]);
var wrapper;
var errorMock;
var successMock;
var eventOnMock;
var eventOffMock;
var clientFetchTransactionsMock;
var loggerErrorMock;
var dispatchMock;
var createWrapper = function (component, gettersTransactions) {
    component = component || WalletTransactions;
    gettersTransactions = gettersTransactions === undefined ? sampleTransactions : gettersTransactions;
    errorMock = jest.fn();
    successMock = jest.fn();
    eventOnMock = jest.fn();
    eventOffMock = jest.fn();
    clientFetchTransactionsMock = jest.fn();
    loggerErrorMock = jest.fn();
    dispatchMock = jest.fn();
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        mocks: {
            $error: errorMock,
            $success: successMock,
            $client: {
                fetchWalletTransactions: clientFetchTransactionsMock
            },
            $eventBus: {
                on: eventOnMock,
                off: eventOffMock
            },
            $logger: {
                error: loggerErrorMock
            },
            $store: {
                dispatch: dispatchMock,
                getters: {
                    get 'transaction/byAddress'() {
                        return gettersTransactions;
                    },
                    'session/transactionTableRowCount': 10
                }
            },
            session_profile: {
                id: 'profile-1'
            }
        },
        mixins: [{
                data: function () { return ({
                    mockWalletRoute: 1
                }); },
                computed: {
                    wallet_fromRoute: function () {
                        return !this.mockWalletRoute ? null : {
                            address: "address-" + this.mockWalletRoute,
                            business: {
                                name: 'business-name',
                                website: 'http://business.website',
                                publicKey: "public-key-" + this.mockWalletRoute,
                                resigned: false
                            },
                            publicKey: "public-key-" + this.mockWalletRoute
                        };
                    }
                }
            }],
        stubs: {
            TransactionTable: '<div class="TransactionTable"></div>'
        }
    });
};
describe('WalletTransactions', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should render', function () {
        expect(wrapper.contains('.WalletTransactions')).toBe(true);
    });
    describe('props transactionType', function () {
        beforeEach(function () {
            wrapper.setProps({
                transactionType: 7
            });
        });
        it('should be set', function () {
            expect(wrapper.vm.transactionType).toBe(7);
        });
        it('should be passed to TransactionTable component', function () {
            expect(wrapper.find('.TransactionTable').props('transactionType')).toBe(7);
        });
    });
    describe('created hook', function () {
        it('should load transactions', function () {
            var spy = jest.spyOn(WalletTransactionsMixin.methods, 'loadTransactions').mockImplementation();
            createWrapper();
            expect(spy).toHaveBeenCalledTimes(1);
            spy.mockRestore();
        });
        it('should initiate event', function () {
            var spy = jest.spyOn(WalletTransactions.methods, 'enableNewTransactionEvent').mockImplementation();
            createWrapper();
            expect(eventOnMock).toHaveBeenCalledTimes(1);
            expect(eventOnMock).toHaveBeenCalledWith('wallet:reload', wrapper.vm.loadTransactions);
            spy.mockRestore();
        });
        it('should setup "new transaction" event', function () {
            var spy = jest.spyOn(WalletTransactions.methods, 'enableNewTransactionEvent').mockImplementation();
            createWrapper();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('address-1');
            spy.mockRestore();
        });
    });
    describe('beforeDestroy hook', function () {
        it('should disable event', function () {
            jest.spyOn(wrapper.vm, 'disableNewTransactionEvent').mockImplementation();
            eventOffMock.mockReset();
            wrapper.destroy();
            expect(eventOffMock).toHaveBeenCalledTimes(1);
            expect(eventOffMock).toHaveBeenCalledWith('wallet:reload', wrapper.vm.loadTransactions);
        });
        it('should disable "new transaction" event', function () {
            var spy = jest.spyOn(wrapper.vm, 'disableNewTransactionEvent').mockImplementation();
            wrapper.destroy();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('address-1');
        });
        it('should not disable "new transaction" event if no wallet from route', function () {
            var spy = jest.spyOn(wrapper.vm, 'disableNewTransactionEvent').mockImplementation();
            wrapper.vm.mockWalletRoute = null;
            spy.mockReset();
            wrapper.destroy();
            expect(spy).not.toHaveBeenCalled();
        });
    });
    describe('methods', function () {
        describe('enableNewTransactionEvent', function () {
            var spyDisableNew;
            beforeEach(function () {
                spyDisableNew = jest.spyOn(wrapper.vm, 'disableNewTransactionEvent');
            });
            it('should not do anything if no address', function () {
                wrapper.vm.enableNewTransactionEvent(null);
                expect(spyDisableNew).not.toHaveBeenCalled();
            });
            it('should disable "new transaction" event if address value is given', function () {
                eventOnMock.mockReset();
                wrapper.vm.enableNewTransactionEvent('address');
                expect(spyDisableNew).toHaveBeenCalledTimes(1);
                expect(spyDisableNew).toHaveBeenCalledWith('address');
                expect(eventOnMock).toHaveBeenCalledTimes(1);
                expect(eventOnMock).toHaveBeenCalledWith('wallet:address:transaction:new', wrapper.vm.refreshStatusEvent);
            });
        });
        describe('disableNewTransactionEvent', function () {
            beforeEach(function () {
                eventOffMock.mockReset();
            });
            it('should not do anything if no address', function () {
                wrapper.vm.disableNewTransactionEvent(null);
                expect(eventOffMock).not.toHaveBeenCalled();
            });
            it('should disable "new transaction" event if address value is given', function () {
                wrapper.vm.enableNewTransactionEvent('address');
                expect(eventOffMock).toHaveBeenCalledTimes(1);
                expect(eventOffMock).toHaveBeenCalledWith('wallet:address:transaction:new', wrapper.vm.refreshStatusEvent);
            });
        });
        describe('getStoredTransactions', function () {
            var transactions = [
                { type: 10 },
                { type: 1 },
                { type: 7 },
                { type: 0 }
            ];
            it('should not do anything if no address', function () {
                var spy = jest.fn(function () { return []; });
                createWrapper(null, spy);
                wrapper.vm.getStoredTransactions(null);
                expect(spy).not.toHaveBeenCalled();
            });
            it('should get stored transactions if address is provided', function () {
                var spy = jest.fn(function () { return []; });
                createWrapper(null, spy);
                wrapper.vm.getStoredTransactions('address');
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith('address', { includeExpired: true });
            });
            it('should return all transactions if no transactionType prop is specified', function () {
                createWrapper(null, jest.fn(function () { return transactions; }));
                wrapper.setProps({
                    transactionType: 0
                });
                expect(wrapper.vm.getStoredTransactions('address')).toEqual([{ type: 0 }]);
                wrapper.setProps({
                    transactionType: null
                });
                expect(wrapper.vm.getStoredTransactions('address')).toEqual(transactions);
            });
            it('should filter transactions if transactionType prop is specified', function () {
                createWrapper(null, jest.fn(function () { return transactions; }));
                wrapper.setProps({
                    transactionType: 7
                });
                expect(wrapper.vm.getStoredTransactions('address')).toEqual([{ type: 7 }]);
            });
            it('should return empty array if no results', function () {
                createWrapper(null, jest.fn(function () { return transactions; }));
                wrapper.setProps({
                    transactionType: 2
                });
                expect(wrapper.vm.getStoredTransactions('address')).toEqual([]);
            });
        });
        describe('getTransactions', function () {
            it('should not do anything if no address', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(wrapper.vm, 'queryParams', 'get');
                            return [4 /*yield*/, wrapper.vm.getTransactions(null)];
                        case 1:
                            _a.sent();
                            expect(spy).not.toHaveBeenCalled();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should get stored transactions if address is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            clientFetchTransactionsMock.mockReset();
                            return [4 /*yield*/, wrapper.vm.getTransactions('address')];
                        case 1:
                            _a.sent();
                            expect(clientFetchTransactionsMock).toHaveBeenCalledTimes(1);
                            expect(clientFetchTransactionsMock).toHaveBeenCalledWith('address', {
                                transactionType: null,
                                page: 1,
                                limit: 10,
                                orderBy: 'timestamp:desc'
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use updated props when changed', function () { return __awaiter(void 0, void 0, void 0, function () {
                var params;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params = {
                                page: 2,
                                limit: 5,
                                sort: {
                                    field: 'amount',
                                    type: 'asc'
                                }
                            };
                            wrapper.setProps({
                                transactionType: 7
                            });
                            wrapper.vm.__updateParams(params);
                            clientFetchTransactionsMock.mockReset();
                            return [4 /*yield*/, wrapper.vm.getTransactions('address')];
                        case 1:
                            _a.sent();
                            expect(clientFetchTransactionsMock).toHaveBeenCalledTimes(1);
                            expect(clientFetchTransactionsMock).toHaveBeenCalledWith('address', {
                                transactionType: 7,
                                page: params.page,
                                limit: params.limit,
                                orderBy: params.sort.field + ":" + params.sort.type
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('fetchTransactions', function () {
            var remoteTransactions = [
                'remote-1'
            ];
            var localTransactions = [
                'local-1'
            ];
            var mergeTableMock;
            beforeEach(function () {
                mergeTableMock = jest.spyOn(mergeTableTransactions, 'default');
            });
            afterEach(function () {
                mergeTableMock.mockRestore();
            });
            it('should not fetch if already fetching', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(wrapper.vm, 'getTransactions');
                            wrapper.vm.isFetching = true;
                            return [4 /*yield*/, wrapper.vm.fetchTransactions()];
                        case 1:
                            _a.sent();
                            expect(spy).not.toHaveBeenCalled();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should fetch if not already fetching', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(wrapper.vm, 'getTransactions');
                            return [4 /*yield*/, wrapper.vm.fetchTransactions()];
                        case 1:
                            _a.sent();
                            expect(spy).toHaveBeenCalledTimes(1);
                            expect(spy).toHaveBeenCalledWith('address-1');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should delete transactions received from api', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            jest.spyOn(wrapper.vm, 'getTransactions').mockReturnValue({ transactions: remoteTransactions });
                            return [4 /*yield*/, wrapper.vm.fetchTransactions()];
                        case 1:
                            _a.sent();
                            expect(dispatchMock).toHaveBeenCalledTimes(1);
                            expect(dispatchMock).toHaveBeenCalledWith('transaction/deleteBulk', {
                                transactions: remoteTransactions,
                                profileId: 'profile-1'
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should attempt to merge stored and remote transaction arrays', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            jest.spyOn(wrapper.vm, 'getTransactions').mockReturnValue({ transactions: remoteTransactions });
                            jest.spyOn(wrapper.vm, 'getStoredTransactions').mockReturnValue(localTransactions);
                            return [4 /*yield*/, wrapper.vm.fetchTransactions()];
                        case 1:
                            _a.sent();
                            expect(mergeTableMock).toHaveBeenCalledTimes(1);
                            expect(mergeTableMock).toHaveBeenCalledWith(remoteTransactions, localTransactions, wrapper.vm.queryParams.sort);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should store updated transactions if route address has not changed', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mergeTableMock.mockReturnValue(__spreadArrays(remoteTransactions, localTransactions));
                            jest.spyOn(wrapper.vm, 'getStoredTransactions').mockReturnValue(localTransactions);
                            jest.spyOn(wrapper.vm, 'getTransactions').mockReturnValue({
                                transactions: remoteTransactions,
                                totalCount: 1
                            });
                            return [4 /*yield*/, wrapper.vm.fetchTransactions()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.fetchedTransactions).toEqual(__spreadArrays(remoteTransactions, localTransactions));
                            expect(wrapper.vm.totalCount).toEqual(1);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not store transactions if route address has changed', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.fetchedTransactions = ['placeholder'];
                            wrapper.vm.totalCount = 31;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            mergeTableMock.mockReturnValue(__spreadArrays(remoteTransactions, localTransactions));
                            jest.spyOn(wrapper.vm, 'reset').mockImplementation();
                            jest.spyOn(wrapper.vm, 'getStoredTransactions').mockReturnValue(localTransactions);
                            jest.spyOn(wrapper.vm, 'getTransactions').mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            wrapper.vm.mockWalletRoute = 2;
                                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, {
                                                    transactions: remoteTransactions,
                                                    totalCount: 1
                                                }];
                                    }
                                });
                            }); });
                            return [4 /*yield*/, wrapper.vm.fetchTransactions()];
                        case 2:
                            _a.sent();
                            expect(wrapper.vm.fetchedTransactions).toEqual(['placeholder']);
                            expect(wrapper.vm.totalCount).toEqual(31);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should output error if not "wallet not found"', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            clientFetchTransactionsMock.mockImplementation(function (address, options) {
                                if (options === void 0) { options = {}; }
                                return clientService.fetchWalletTransactions(address, options);
                            });
                            nock('http://localhost')
                                .get('/wallets/address-1/transactions')
                                .query(true)
                                .reply(500, {
                                message: 'oops'
                            });
                            wrapper.vm.fetchedTransactions = ['placeholder'];
                            loggerErrorMock.mockReset();
                            errorMock.mockReset();
                            return [4 /*yield*/, wrapper.vm.fetchTransactions()];
                        case 1:
                            _a.sent();
                            expect(loggerErrorMock).toHaveBeenCalled();
                            expect(errorMock).toHaveBeenCalledWith('COMMON.FAILED_FETCH');
                            expect(wrapper.vm.fetchedTransactions).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not output error if "wallet not found"', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            clientFetchTransactionsMock.mockImplementation(function (address, options) {
                                if (options === void 0) { options = {}; }
                                return clientService.fetchWalletTransactions(address, options);
                            });
                            nock('http://localhost')
                                .get('/wallets/address-1/transactions')
                                .query(true)
                                .reply(404, {
                                message: 'Wallet not found'
                            });
                            wrapper.vm.fetchedTransactions = ['placeholder'];
                            loggerErrorMock.mockReset();
                            errorMock.mockReset();
                            return [4 /*yield*/, wrapper.vm.fetchTransactions()];
                        case 1:
                            _a.sent();
                            expect(loggerErrorMock).not.toHaveBeenCalled();
                            expect(errorMock).not.toHaveBeenCalled();
                            expect(wrapper.vm.fetchedTransactions).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('refreshStatusEvent', function () {
            it('should call refreshStatus', function () {
                var spy = jest.spyOn(WalletTransactions.methods, 'refreshStatus').mockImplementation();
                createWrapper();
                wrapper.vm.refreshStatusEvent();
                expect(spy).toHaveBeenCalledTimes(1);
                spy.mockRestore();
            });
        });
        describe('refreshStatus', function () {
            it('should do nothing if no wallet', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(wrapper.vm, 'getTransactions');
                            wrapper.vm.mockWalletRoute = null;
                            return [4 /*yield*/, wrapper.vm.refreshStatus()];
                        case 1:
                            _a.sent();
                            expect(spy).not.toHaveBeenCalled();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should update transaction notice if new transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            jest.spyOn(wrapper.vm, 'getTransactions').mockReturnValue({ transactions: [{ id: 'test' }] });
                            jest.spyOn(wrapper.vm, 'getStoredTransactions').mockReturnValue([]);
                            return [4 /*yield*/, wrapper.vm.refreshStatus()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.newTransactionsNotice).toBe('WALLET_TRANSACTIONS.NEW_TRANSACTIONS');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not update transaction notice if no new transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactions = [{ id: 'test' }];
                            wrapper.vm.fetchedTransactions = transactions;
                            jest.spyOn(wrapper.vm, 'getTransactions').mockReturnValue({ transactions: transactions });
                            jest.spyOn(wrapper.vm, 'getStoredTransactions').mockReturnValue(transactions);
                            return [4 /*yield*/, wrapper.vm.refreshStatus()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.newTransactionsNotice).not.toBe('WALLET_TRANSACTIONS.NEW_TRANSACTIONS');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should update transaction confirmations', function () { return __awaiter(void 0, void 0, void 0, function () {
                var newTransactions, oldTransactions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            newTransactions = [{ id: 'test', confirmations: 2 }];
                            oldTransactions = [{ id: 'test', confirmations: 1 }];
                            jest.spyOn(wrapper.vm, 'getTransactions').mockReturnValue({ transactions: newTransactions });
                            jest.spyOn(wrapper.vm, 'getStoredTransactions').mockReturnValue([]);
                            wrapper.vm.fetchedTransactions = oldTransactions;
                            return [4 /*yield*/, wrapper.vm.refreshStatus()];
                        case 1:
                            _a.sent();
                            expect(oldTransactions[0].confirmations).toBe(2);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should do nothing on error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.newTransactionsNotice = 'test';
                            error = new Error('failed web request');
                            jest.spyOn(wrapper.vm, 'getTransactions').mockImplementation(function () {
                                throw error;
                            });
                            return [4 /*yield*/, wrapper.vm.refreshStatus()];
                        case 1:
                            _a.sent();
                            expect(loggerErrorMock).toHaveBeenCalledWith('Failed to update confirmations: ', error);
                            expect(wrapper.vm.newTransactionsNotice).toBe('test');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('onPageChange', function () {
            it('should do nothing if currentPage has not changed', function () {
                var spyParams = jest.spyOn(WalletTransactionsMixin.methods, '__updateParams').mockImplementation();
                var spyTransactions = jest.spyOn(WalletTransactionsMixin.methods, 'loadTransactions').mockImplementation();
                createWrapper();
                wrapper.vm.onPageChange({ currentPage: 1 });
                expect(spyParams).not.toHaveBeenCalled();
                expect(spyTransactions).toHaveBeenCalledTimes(1); // gets called once in the created lifecycle hook
                spyParams.mockRestore();
                spyTransactions.mockRestore();
            });
            it('should update params and load transactions if currentPage has changed', function () {
                var spyParams = jest.spyOn(WalletTransactionsMixin.methods, '__updateParams').mockImplementation();
                var spyTransactions = jest.spyOn(WalletTransactionsMixin.methods, 'loadTransactions').mockImplementation();
                createWrapper();
                wrapper.vm.onPageChange({ currentPage: 10 });
                expect(wrapper.vm.currentPage).toBe(10);
                expect(spyParams).toHaveBeenCalledTimes(1);
                expect(spyTransactions).toHaveBeenCalledTimes(2); // gets called once in the created lifecycle hook
                spyParams.mockRestore();
                spyTransactions.mockRestore();
            });
        });
        describe('onPerPageChange', function () {
            it('should do nothing if currentPerPage has not changed', function () {
                var spyParams = jest.spyOn(WalletTransactionsMixin.methods, '__updateParams').mockImplementation();
                var spyTransactions = jest.spyOn(WalletTransactionsMixin.methods, 'loadTransactions').mockImplementation();
                createWrapper();
                wrapper.vm.onPerPageChange({ currentPerPage: 10 });
                expect(spyParams).not.toHaveBeenCalled();
                expect(spyTransactions).toHaveBeenCalledTimes(1); // gets called once in the created lifecycle hook
                spyParams.mockRestore();
                spyTransactions.mockRestore();
            });
            it('should update params and load transactions if currentPerPage has changed', function () {
                var spyParams = jest.spyOn(WalletTransactionsMixin.methods, '__updateParams').mockImplementation();
                var spyTransactions = jest.spyOn(WalletTransactionsMixin.methods, 'loadTransactions').mockImplementation();
                createWrapper();
                wrapper.vm.currentPage = 5;
                wrapper.vm.onPerPageChange({ currentPerPage: 20 });
                expect(spyParams).toHaveBeenCalledTimes(1);
                expect(spyTransactions).toHaveBeenCalledTimes(2); // gets called once in the created lifecycle hook
                expect(wrapper.vm.currentPage).toBe(1);
                spyParams.mockRestore();
                spyTransactions.mockRestore();
            });
        });
    });
});
//# sourceMappingURL=WalletTransactions.spec.js.map