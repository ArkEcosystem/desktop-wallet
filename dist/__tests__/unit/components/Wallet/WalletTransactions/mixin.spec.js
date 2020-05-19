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
import { createLocalVue, mount } from '@vue/test-utils';
import installI18n from '../../../__utils__/i18n';
import { WalletTransactions, WalletTransactionsMultiSignature } from '@/components/Wallet/WalletTransactions';
// Do not mock WalletService
jest.mock('@/services/wallet', function () { return jest.requireActual('@/services/wallet'); });
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var sampleTransactions = Object.freeze([]);
var wrapper;
var errorMock;
var successMock;
var loggerErrorMock;
var dispatchMock;
var createWrapper = function (component, gettersTransactions, gettersTableRowCount) {
    component = component || WalletTransactions;
    gettersTransactions = gettersTransactions === undefined ? sampleTransactions : gettersTransactions;
    gettersTableRowCount = gettersTableRowCount === undefined ? 10 : gettersTableRowCount;
    errorMock = jest.fn();
    successMock = jest.fn();
    loggerErrorMock = jest.fn();
    dispatchMock = jest.fn();
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        mocks: {
            $error: errorMock,
            $success: successMock,
            $logger: {
                error: loggerErrorMock
            },
            $store: {
                dispatch: dispatchMock,
                getters: {
                    get 'transaction/byAddress'() {
                        return gettersTransactions;
                    },
                    get 'session/transactionTableRowCount'() {
                        return gettersTableRowCount;
                    }
                }
            },
            session_profile: {
                id: 'profile-1'
            }
        },
        mixins: [{
                data: function () { return ({
                    mockWalletRoute: 1,
                    mockWalletRouteBusinessName: 'business-name'
                }); },
                computed: {
                    wallet_fromRoute: function () {
                        return !this.mockWalletRoute ? null : {
                            address: "address-" + this.mockWalletRoute,
                            business: {
                                name: this.mockWalletRouteBusinessName,
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
describe.each([
    ['WalletTransactions', WalletTransactions],
    ['WalletTransactionsMultiSignature', WalletTransactionsMultiSignature]
])('%s', function (componentName, component) {
    beforeEach(function () {
        createWrapper(component);
    });
    describe('template', function () {
        describe('TransactionTable', function () {
            it('should render', function () {
                expect(wrapper.contains('.TransactionTable')).toBe(true);
            });
            it('should pass correct props', function () { return __awaiter(void 0, void 0, void 0, function () {
                var props, expectedProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.isLoading = false;
                            props = wrapper.find('.TransactionTable').vm.$attrs;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expectedProps = {
                                'current-page': 1,
                                rows: [],
                                'total-rows': 0,
                                'is-loading': false,
                                'is-remote': true,
                                'has-pagination': false,
                                'sort-query': {
                                    field: 'timestamp',
                                    type: 'desc'
                                },
                                'per-page': 10
                            };
                            if (componentName === 'WalletTransactionsMultiSignature') {
                                expectedProps['is-remote'] = false;
                            }
                            expect(props).toEqual(expectedProps);
                            if (componentName === 'WalletTransactions') {
                                expect(props['transaction-type']).toBe(undefined);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should pass updated props', function () { return __awaiter(void 0, void 0, void 0, function () {
                var props, expectedProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            createWrapper(component, undefined, 20);
                            wrapper.setProps({
                                transactionType: 7
                            });
                            wrapper.vm.currentPage = 3;
                            wrapper.vm.fetchedTransactions = ['test'];
                            wrapper.vm.totalCount = 12;
                            wrapper.vm.isLoading = true;
                            wrapper.vm.queryParams.sort = {
                                field: 'amount',
                                type: 'asc'
                            };
                            props = wrapper.find('.TransactionTable').vm.$attrs;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expectedProps = {
                                'current-page': 3,
                                rows: ['test'],
                                'total-rows': 12,
                                'is-loading': true,
                                'is-remote': true,
                                'has-pagination': true,
                                'sort-query': {
                                    field: 'amount',
                                    type: 'asc'
                                },
                                'per-page': 20
                            };
                            if (componentName === 'WalletTransactionsMultiSignature') {
                                expectedProps['is-remote'] = false;
                                expectedProps['has-pagination'] = false;
                            }
                            expect(props).toEqual(expectedProps);
                            if (componentName === 'WalletTransactions') {
                                expect(wrapper.find('.TransactionTable').props('transactionType')).toBe(7);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('newTransactionsNotice', function () {
        it('should not show notice bar if not set', function () {
            wrapper.vm.newTransactionsNotice = 'TEST NOTICE';
            expect(wrapper.contains('.WalletTransactions__notice')).toBe(true);
            wrapper.vm.newTransactionsNotice = null;
            expect(wrapper.contains('.WalletTransactions__notice')).toBe(false);
        });
        it('should output new transactions notice when set', function () {
            expect(wrapper.contains('.WalletTransactions__notice')).toBe(false);
            wrapper.vm.newTransactionsNotice = 'TEST NOTICE';
            expect(wrapper.contains('.WalletTransactions__notice')).toBe(true);
            expect(wrapper.find('.WalletTransactions__notice').text()).toBe('TEST NOTICE');
        });
    });
    describe('watch wallet_fromRoute', function () {
        it('should reset when wallet route changes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyLoadTransactions, spyReset;
            return __generator(this, function (_a) {
                spyLoadTransactions = jest.spyOn(wrapper.vm, 'loadTransactions').mockImplementation(jest.fn());
                spyReset = jest.spyOn(wrapper.vm, 'reset').mockImplementation();
                wrapper.setData({
                    mockWalletRoute: 2
                });
                expect(wrapper.vm.wallet_fromRoute.address).toEqual('address-2');
                expect(spyLoadTransactions).toHaveBeenCalledTimes(1);
                expect(spyReset).toHaveBeenCalledTimes(1);
                return [2 /*return*/];
            });
        }); });
    });
    describe('computed', function () {
        describe('sortQuery', function () {
            it('should get data from queryParams', function () {
                expect(wrapper.vm.sortQuery).toEqual({
                    field: wrapper.vm.queryParams.sort.field,
                    type: wrapper.vm.queryParams.sort.type
                });
                wrapper.vm.queryParams.sort.field = 'test';
                wrapper.vm.queryParams.sort.type = 'test';
                expect(wrapper.vm.sortQuery).toEqual({
                    field: wrapper.vm.queryParams.sort.field,
                    type: wrapper.vm.queryParams.sort.type
                });
            });
        });
        describe('transactionTableRowCount', function () {
            it('should get data from session', function () {
                createWrapper(null, undefined, 50);
                expect(wrapper.vm.transactionTableRowCount).toBe(50);
                createWrapper(null, undefined, 20);
                expect(wrapper.vm.transactionTableRowCount).toBe(20);
            });
            it('should get data from session', function () {
                expect(wrapper.vm.transactionTableRowCount).toBe(10);
                wrapper.vm.transactionTableRowCount = 50;
                expect(dispatchMock).toHaveBeenCalledWith('session/setTransactionTableRowCount', 50);
                expect(dispatchMock).toHaveBeenCalledWith('profile/update', {
                    id: 'profile-1',
                    transactionTableRowCount: 50
                });
            });
        });
    });
    describe('watch', function () {
        describe('wallet_fromRoute', function () {
            it('should reset when wallet changes', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(wrapper.vm, 'reset');
                            spy.mockReset();
                            wrapper.vm.mockWalletRoute++;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(spy).toHaveBeenCalledTimes(1);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should refresh status if wallet has not changed', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(wrapper.vm, 'refreshStatus');
                            spy.mockReset();
                            wrapper.vm.mockWalletRouteBusinessName = 'new business';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(spy).toHaveBeenCalledTimes(1);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('methods', function () {
        describe('loadTransactions', function () {
            it('should not run if no wallet', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(wrapper.vm, 'fetchTransactions');
                            wrapper.vm.mockWalletRoute = 0;
                            return [4 /*yield*/, wrapper.vm.loadTransactions()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 2:
                            _a.sent();
                            expect(spy).not.toHaveBeenCalled();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not run if already fetching', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(wrapper.vm, 'fetchTransactions');
                            wrapper.vm.isFetching = true;
                            return [4 /*yield*/, wrapper.vm.loadTransactions()];
                        case 1:
                            _a.sent();
                            expect(spy).toHaveBeenCalledTimes(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should run if wallet and not already fetching', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(wrapper.vm, 'fetchTransactions');
                            return [4 /*yield*/, wrapper.vm.loadTransactions()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.isFetching).toBe(false);
                            expect(wrapper.vm.wallet_fromRoute).toBeTruthy();
                            expect(spy).toHaveBeenCalledTimes(1);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        if (componentName === 'WalletTransactions') {
            describe('onPageChange', function () {
                it('should update page data', function () {
                    var updateParamsSpy = jest.spyOn(wrapper.vm, '__updateParams');
                    var loadTransactionsSpy = jest.spyOn(wrapper.vm, 'loadTransactions');
                    expect(wrapper.vm.currentPage).toBe(1);
                    wrapper.vm.onPageChange({ currentPage: 10 });
                    expect(wrapper.vm.currentPage).toBe(10);
                    expect(wrapper.vm.queryParams.page).toBe(10);
                    expect(updateParamsSpy).toHaveBeenCalledTimes(1);
                    expect(updateParamsSpy).toHaveBeenCalledWith({ page: 10 });
                    expect(loadTransactionsSpy).toHaveBeenCalledTimes(1);
                });
                it('should do nothing if invalid page', function () {
                    var updateParamsSpy = jest.spyOn(wrapper.vm, '__updateParams');
                    var loadTransactionsSpy = jest.spyOn(wrapper.vm, 'loadTransactions');
                    expect(wrapper.vm.currentPage).toBe(1);
                    wrapper.vm.onPageChange({ currentPage: null });
                    expect(wrapper.vm.currentPage).toBe(1);
                    expect(wrapper.vm.queryParams.page).toBe(1);
                    expect(updateParamsSpy).not.toHaveBeenCalled();
                    expect(loadTransactionsSpy).not.toHaveBeenCalled();
                });
            });
            describe('onPerPageChange', function () {
                it('should update page data', function () {
                    var updateParamsSpy = jest.spyOn(wrapper.vm, '__updateParams');
                    var loadTransactionsSpy = jest.spyOn(wrapper.vm, 'loadTransactions');
                    wrapper.vm.queryParams.page = 11;
                    expect(wrapper.vm.queryParams.limit).toBe(10);
                    wrapper.vm.onPerPageChange({ currentPerPage: 20 });
                    expect(wrapper.vm.queryParams.limit).toBe(20);
                    expect(wrapper.vm.queryParams.page).toBe(1);
                    expect(updateParamsSpy).toHaveBeenCalledTimes(1);
                    expect(updateParamsSpy).toHaveBeenCalledWith({ limit: 20, page: 1 });
                    expect(loadTransactionsSpy).toHaveBeenCalledTimes(1);
                    expect(dispatchMock).toHaveBeenCalledWith('session/setTransactionTableRowCount', 20);
                });
                it('should do nothing if invalid page', function () {
                    var updateParamsSpy = jest.spyOn(wrapper.vm, '__updateParams');
                    var loadTransactionsSpy = jest.spyOn(wrapper.vm, 'loadTransactions');
                    wrapper.vm.queryParams.page = 11;
                    expect(wrapper.vm.queryParams.limit).toBe(10);
                    wrapper.vm.onPerPageChange({ currentPerPage: null });
                    expect(wrapper.vm.queryParams.limit).toBe(10);
                    expect(wrapper.vm.queryParams.page).toBe(11);
                    expect(updateParamsSpy).not.toHaveBeenCalled();
                    expect(loadTransactionsSpy).not.toHaveBeenCalled();
                    expect(dispatchMock).not.toHaveBeenCalledWith('session/setTransactionTableRowCount', 20);
                });
            });
        }
        describe('onSortChange', function () {
            var spyUpdateParams, spyLoadTransactions;
            beforeEach(function () {
                spyUpdateParams = jest.spyOn(wrapper.vm, '__updateParams');
                spyLoadTransactions = jest.spyOn(wrapper.vm, 'loadTransactions');
            });
            it('should update sort column', function () {
                wrapper.vm.onSortChange({
                    source: 'transactionsTab',
                    field: 'amount',
                    type: 'desc'
                });
                expect(spyUpdateParams).toHaveBeenCalledTimes(1);
                var expectedUpdateParams = {
                    sort: {
                        field: 'amount',
                        type: 'desc'
                    }
                };
                if (componentName === 'WalletTransactions') {
                    expectedUpdateParams.page = 1;
                    expect(spyLoadTransactions).toHaveBeenCalledTimes(1);
                }
                expect(spyUpdateParams).toHaveBeenCalledWith(expectedUpdateParams);
            });
            it('should update sort column direction', function () {
                wrapper.vm.onSortChange({
                    source: 'transactionsTab',
                    field: 'timestamp',
                    type: 'asc'
                });
                expect(spyUpdateParams).toHaveBeenCalledTimes(1);
                var expectedUpdateParams = {
                    sort: {
                        field: 'timestamp',
                        type: 'asc'
                    }
                };
                if (componentName === 'WalletTransactions') {
                    expectedUpdateParams.page = 1;
                    expect(spyLoadTransactions).toHaveBeenCalledTimes(1);
                }
                expect(spyUpdateParams).toHaveBeenCalledWith(expectedUpdateParams);
            });
            it('should not do anything if source is falsy', function () {
                wrapper.vm.onSortChange({
                    source: null,
                    field: 'amount',
                    type: 'desc'
                });
                expect(spyUpdateParams).toHaveBeenCalledTimes(0);
                expect(spyLoadTransactions).toHaveBeenCalledTimes(0);
            });
            it('should not do anything if source is not transactionsTab', function () {
                wrapper.vm.onSortChange({
                    source: 'notTransactionsTab',
                    field: 'amount',
                    type: 'desc'
                });
                expect(spyUpdateParams).toHaveBeenCalledTimes(0);
                expect(spyLoadTransactions).toHaveBeenCalledTimes(0);
            });
            it('should not do anything if column and direction do not change', function () {
                wrapper.vm.onSortChange({
                    source: 'transactionsTab',
                    field: 'timestamp',
                    type: 'desc'
                });
                expect(spyUpdateParams).toHaveBeenCalledTimes(0);
                expect(spyLoadTransactions).toHaveBeenCalledTimes(0);
            });
        });
        describe('reset', function () {
            if (componentName === 'WalletTransactions') {
                it('should reset values', function () {
                    wrapper.vm.currentPage = 10;
                    wrapper.vm.queryParams.page = 10;
                    wrapper.vm.totalCount = 10;
                    wrapper.vm.fetchedTransactions = [
                        'fake entry'
                    ];
                    wrapper.vm.reset();
                    expect(wrapper.vm.currentPage).toBe(1);
                    expect(wrapper.vm.queryParams.page).toBe(1);
                    expect(wrapper.vm.totalCount).toBe(0);
                    expect(wrapper.vm.fetchedTransactions).toEqual([]);
                });
            }
            else {
                it('should reset values', function () {
                    wrapper.vm.newTransactionsNotice = 'TEST NOTICE';
                    wrapper.vm.totalCount = 10;
                    wrapper.vm.fetchedTransactions = [
                        'fake entry'
                    ];
                    wrapper.vm.reset();
                    expect(wrapper.vm.newTransactionsNotice).toBe(null);
                    expect(wrapper.vm.totalCount).toBe(0);
                    expect(wrapper.vm.fetchedTransactions).toEqual([]);
                });
            }
        });
        describe('__updateParams', function () {
            var expected = {
                page: 1,
                limit: 10,
                sort: {
                    field: 'timestamp',
                    type: 'desc'
                }
            };
            it('should update query parameters', function () {
                var params = {
                    page: 10,
                    limit: 100,
                    sort: {
                        field: 'amount',
                        type: 'asc'
                    }
                };
                wrapper.vm.__updateParams(params);
                expect(wrapper.vm.queryParams).toEqual(params);
            });
            it('should not update if invalid value', function () {
                wrapper.vm.__updateParams(null);
                expect(wrapper.vm.queryParams).toEqual(expected);
                wrapper.vm.__updateParams([]);
                expect(wrapper.vm.queryParams).toEqual(expected);
                wrapper.vm.__updateParams('test');
                expect(wrapper.vm.queryParams).toEqual(expected);
            });
        });
    });
});
//# sourceMappingURL=mixin.spec.js.map