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
import { WalletBusinessBridgechains } from '@/components/Wallet/WalletBusiness';
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var wrapper;
var clientFetchBridgechainsMock;
var eventOnMock;
var eventOffMock;
var storeDispatchMock;
var createWrapper = function (component) {
    component = component || WalletBusinessBridgechains;
    eventOnMock = jest.fn();
    eventOffMock = jest.fn();
    storeDispatchMock = jest.fn();
    clientFetchBridgechainsMock = jest.fn(function () { return ({
        data: [],
        meta: {
            count: 0,
            pageCount: 1,
            totalCount: 0,
            next: null,
            previous: null,
            self: '/api/businesses/address-1/bridgechains?page=1&limit=100',
            first: '/api/businesses/address-1/bridgechains?page=1&limit=100',
            last: null
        }
    }); });
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        mocks: {
            $client: {
                fetchBusinessBridgechains: clientFetchBridgechainsMock
            },
            $eventBus: {
                on: eventOnMock,
                off: eventOffMock
            },
            $store: {
                dispatch: storeDispatchMock,
                getters: {
                    get 'session/transactionTableRowCount'() {
                        return 10;
                    }
                }
            },
            session_profile: {
                id: 1
            }
        },
        mixins: [
            {
                data: function () { return ({
                    mockWalletRoute: 1
                }); },
                computed: {
                    wallet_fromRoute: function () {
                        return {
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
            }
        ],
        stubs: {
            WalletBusinessBridgechainsTable: "<div>\n        <div class=\"WalletBusinessBridgechainsTable\"></div>\n      </div>"
        }
    });
};
describe('WalletBusinessBridgechains', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should render', function () {
        expect(wrapper.contains('.WalletBusinessBridgechains')).toBe(true);
    });
    it('should include WalletBusinessBridgechainsTable component', function () {
        expect(wrapper.contains('.WalletBusinessBridgechainsTable')).toBe(true);
    });
    it('should reset when wallet route changes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var spyLoadBridgechains, spyReset;
        return __generator(this, function (_a) {
            spyLoadBridgechains = jest.spyOn(wrapper.vm, 'loadBridgechains').mockImplementation(jest.fn());
            spyReset = jest.spyOn(wrapper.vm, 'reset').mockImplementation(jest.fn());
            wrapper.setData({
                mockWalletRoute: 2
            });
            expect(wrapper.vm.wallet_fromRoute.address).toEqual('address-2');
            expect(spyLoadBridgechains).toHaveBeenCalledTimes(1);
            expect(spyReset).toHaveBeenCalledTimes(1);
            return [2 /*return*/];
        });
    }); });
    describe('created', function () {
        var spy = jest.spyOn(WalletBusinessBridgechains.methods, 'loadBridgechains').mockImplementation(jest.fn());
        createWrapper();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(eventOnMock).toHaveBeenCalledTimes(2);
        expect(eventOnMock).toHaveBeenCalledWith('wallet:reload', wrapper.vm.loadBridgechains);
        expect(eventOnMock).toHaveBeenCalledWith('wallet:reload:business-bridgechains', wrapper.vm.loadBridgechains);
        spy.mockRestore();
    });
    describe('beforeDestroy', function () {
        wrapper.destroy();
        expect(eventOffMock).toHaveBeenCalledTimes(2);
        expect(eventOffMock).toHaveBeenCalledWith('wallet:reload', wrapper.vm.loadBridgechains);
        expect(eventOffMock).toHaveBeenCalledWith('wallet:reload:business-bridgechains', wrapper.vm.loadBridgechains);
    });
    describe('fetchBridgechains', function () {
        it('should not run if already fetching', function () {
            clientFetchBridgechainsMock.mockClear();
            wrapper.vm.isFetching = true;
            wrapper.vm.fetchBridgechains();
            expect(clientFetchBridgechainsMock).not.toHaveBeenCalled();
        });
        it('should fetch bridgechains via client', function () { return __awaiter(void 0, void 0, void 0, function () {
            var clientFetchBridgechains, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clientFetchBridgechains = clientFetchBridgechainsMock();
                        clientFetchBridgechainsMock.mockClear().mockImplementation(function () {
                            clientFetchBridgechains.data = [
                                'test'
                            ];
                            clientFetchBridgechains.meta.totalCount = 100;
                            return clientFetchBridgechains;
                        });
                        params = {
                            page: 10,
                            limit: 100,
                            sort: {
                                field: 'amount',
                                type: 'asc'
                            }
                        };
                        wrapper.vm.__updateParams(params);
                        wrapper.vm.fetchBridgechains();
                        expect(clientFetchBridgechainsMock).toHaveBeenCalledTimes(1);
                        expect(clientFetchBridgechainsMock).toHaveBeenCalledWith('address-1', {
                            page: params.page,
                            limit: params.limit,
                            orderBy: params.sort.field + ":" + params.sort.type
                        });
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.fetchedBridgechains).toEqual([
                            'test'
                        ]);
                        expect(wrapper.vm.totalCount).toBe(100);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should clear bridgechains on error', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clientFetchBridgechainsMock.mockClear().mockImplementation(function () {
                            throw new Error('Failed');
                        });
                        wrapper.vm.fetchedBridgechains = [
                            'test'
                        ];
                        wrapper.vm.totalCount = 100;
                        wrapper.vm.fetchBridgechains();
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.fetchedBridgechains).toEqual([]);
                        expect(wrapper.vm.totalCount).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('loadBridgechains', function () {
        it('should not load if not viewing a wallet', function () {
            var spy = jest.spyOn(wrapper.vm, 'fetchBridgechains');
            jest.spyOn(wrapper.vm, 'wallet_fromRoute', 'get').mockReturnValue(null);
            wrapper.vm.loadBridgechains();
            expect(spy).not.toHaveBeenCalled();
        });
        it('should not load if already fetching', function () {
            var spy = jest.spyOn(wrapper.vm, 'fetchBridgechains');
            wrapper.vm.isFetching = true;
            wrapper.vm.loadBridgechains();
            expect(spy).not.toHaveBeenCalled();
        });
        it('should load bridgechains', function () {
            var spy = jest.spyOn(wrapper.vm, 'fetchBridgechains').mockImplementation();
            wrapper.vm.loadBridgechains();
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
    describe('onPageChange', function () {
        it('should change page', function () {
            var currentPage = 2;
            var spyUpdateParams = jest.spyOn(wrapper.vm, '__updateParams');
            var spyLoadBridgechains = jest.spyOn(wrapper.vm, 'loadBridgechains');
            wrapper.vm.onPageChange({ currentPage: currentPage });
            expect(wrapper.vm.currentPage).toBe(currentPage);
            expect(spyUpdateParams).toHaveBeenCalledTimes(1);
            expect(spyUpdateParams).toHaveBeenCalledWith({ page: currentPage });
            expect(spyLoadBridgechains).toHaveBeenCalledTimes(1);
        });
    });
    describe('onPerPageChange', function () {
        it('should update page row count', function () {
            var currentPerPage = 1;
            var spyUpdateParams = jest.spyOn(wrapper.vm, '__updateParams');
            var spyLoadBridgechains = jest.spyOn(wrapper.vm, 'loadBridgechains');
            wrapper.vm.onPerPageChange({ currentPerPage: currentPerPage });
            expect(storeDispatchMock).toHaveBeenCalledWith('session/setTransactionTableRowCount', currentPerPage);
            expect(storeDispatchMock).toHaveBeenCalledWith('profile/update', {
                id: 1,
                transactionTableRowCount: currentPerPage
            });
            expect(spyUpdateParams).toHaveBeenCalledTimes(1);
            expect(spyUpdateParams).toHaveBeenCalledWith({ limit: currentPerPage, page: 1 });
            expect(spyLoadBridgechains).toHaveBeenCalledTimes(1);
        });
    });
    describe('onSortChange', function () {
        var spyUpdateParams, spyLoadBridgechains;
        beforeEach(function () {
            spyUpdateParams = jest.spyOn(wrapper.vm, '__updateParams');
            spyLoadBridgechains = jest.spyOn(wrapper.vm, 'loadBridgechains');
        });
        it('should update sort column', function () {
            wrapper.vm.onSortChange({
                source: 'bridgechainsTab',
                field: 'genesisHash',
                type: 'asc'
            });
            expect(spyUpdateParams).toHaveBeenCalledTimes(1);
            expect(spyUpdateParams).toHaveBeenCalledWith({
                sort: {
                    field: 'genesisHash',
                    type: 'asc'
                },
                page: 1
            });
            expect(spyLoadBridgechains).toHaveBeenCalledTimes(1);
        });
        it('should update sort column direction', function () {
            wrapper.vm.onSortChange({
                source: 'bridgechainsTab',
                field: 'name',
                type: 'desc'
            });
            expect(spyUpdateParams).toHaveBeenCalledTimes(1);
            expect(spyUpdateParams).toHaveBeenCalledWith({
                sort: {
                    field: 'name',
                    type: 'desc'
                },
                page: 1
            });
            expect(spyLoadBridgechains).toHaveBeenCalledTimes(1);
        });
        it('should not do anything if source is falsy', function () {
            wrapper.vm.onSortChange({
                source: null,
                field: 'amount',
                type: 'desc'
            });
            expect(spyUpdateParams).toHaveBeenCalledTimes(0);
            expect(spyLoadBridgechains).toHaveBeenCalledTimes(0);
        });
        it('should not do anything if source doesn\'t match component', function () {
            wrapper.vm.onSortChange({
                source: 'transactionsTab',
                field: 'amount',
                type: 'desc'
            });
            expect(spyUpdateParams).toHaveBeenCalledTimes(0);
            expect(spyLoadBridgechains).toHaveBeenCalledTimes(0);
        });
        it('should not do anything if column and direction do not change', function () {
            wrapper.vm.onSortChange({
                source: 'bridgechainsTab',
                field: 'name',
                type: 'asc'
            });
            expect(spyUpdateParams).toHaveBeenCalledTimes(0);
            expect(spyLoadBridgechains).toHaveBeenCalledTimes(0);
        });
    });
    describe('reset', function () {
        it('should reset values', function () {
            wrapper.vm.currentPage = 10;
            wrapper.vm.queryParams.page = 10;
            wrapper.vm.totalCount = 10;
            wrapper.vm.fetchedBridgechains = [
                'fake entry'
            ];
            wrapper.vm.reset();
            expect(wrapper.vm.currentPage).toBe(1);
            expect(wrapper.vm.queryParams.page).toBe(1);
            expect(wrapper.vm.totalCount).toBe(0);
            expect(wrapper.vm.fetchedBridgechains).toEqual([]);
        });
    });
    describe('__updateParams', function () {
        var expected = {
            page: 1,
            limit: 10,
            sort: {
                field: 'name',
                type: 'asc'
            }
        };
        it('should update query parameters', function () {
            var params = {
                page: 10,
                limit: 100,
                sort: {
                    field: 'genesisHash',
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
//# sourceMappingURL=WalletBusinessBridgechains.spec.js.map