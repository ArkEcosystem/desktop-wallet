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
import { WalletTransactionsMultiSignature } from '@/components/Wallet/WalletTransactions';
import WalletTransactionsMixin from '@/components/Wallet/WalletTransactions/mixin';
import MultiSignatureClient from '@/services/client-multisig';
import WalletService from '@/services/wallet';
jest.mock('@/services/wallet');
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var wrapper;
var errorMock;
var successMock;
var eventOnMock;
var eventOffMock;
var multiSignatureClientMock;
var publicKeyFromWalletMock;
var loggerErrorMock;
var dispatchMock;
var createWrapper = function (component) {
    component = component || WalletTransactionsMultiSignature;
    errorMock = jest.fn();
    successMock = jest.fn();
    eventOnMock = jest.fn();
    eventOffMock = jest.fn();
    multiSignatureClientMock = jest.spyOn(MultiSignatureClient, 'getTransactions').mockImplementation();
    loggerErrorMock = jest.fn();
    dispatchMock = jest.fn();
    publicKeyFromWalletMock = jest.fn(); // jest.spyOn(WalletService.default, 'getPublicKeyFromWallet').mockImplementation()
    WalletService.getPublicKeyFromWallet = publicKeyFromWalletMock.bind(WalletService);
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        mocks: {
            $error: errorMock,
            $success: successMock,
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
                    get 'session/multiSignaturePeer'() {
                        return {
                            ip: 'http://1.2.3.4',
                            port: 1234
                        };
                    }
                    // get 'transaction/byAddress' () {
                    //   return gettersTransactions
                    // }
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
describe('WalletTransactionsMultiSignature', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should render', function () {
        expect(wrapper.contains('.WalletTransactions')).toBe(true);
    });
    describe('created hook', function () {
        it('should load transactions', function () {
            var spy = jest.spyOn(WalletTransactionsMixin.methods, 'loadTransactions').mockImplementation();
            createWrapper();
            expect(spy).toHaveBeenCalledTimes(1);
            spy.mockRestore();
        });
        it('should initiate event', function () {
            var spy = jest.spyOn(WalletTransactionsMixin.methods, 'loadTransactions').mockImplementation();
            createWrapper();
            expect(eventOnMock).toHaveBeenCalledTimes(2);
            expect(eventOnMock).toHaveBeenCalledWith('wallet:reload', wrapper.vm.loadTransactions);
            expect(eventOnMock).toHaveBeenCalledWith('wallet:reload:multi-signature', wrapper.vm.loadTransactions);
            spy.mockRestore();
        });
    });
    describe('beforeDestroy hook', function () {
        it('should disable event', function () {
            eventOffMock.mockReset();
            wrapper.destroy();
            expect(eventOffMock).toHaveBeenCalledTimes(2);
            expect(eventOffMock).toHaveBeenCalledWith('wallet:reload', wrapper.vm.loadTransactions);
            expect(eventOffMock).toHaveBeenCalledWith('wallet:reload:multi-signature', wrapper.vm.loadTransactions);
        });
    });
    describe('methods', function () {
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
            it('should get transactions from peer', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            multiSignatureClientMock.mockReset();
                            return [4 /*yield*/, wrapper.vm.getTransactions('publicKey')];
                        case 1:
                            _a.sent();
                            expect(multiSignatureClientMock).toHaveBeenCalledTimes(1);
                            expect(multiSignatureClientMock).toHaveBeenCalledWith({
                                ip: 'http://1.2.3.4',
                                port: 1234
                            }, 'publicKey');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('fetchTransactions', function () {
            var remoteTransactions = [
                'remote-1'
            ];
            beforeEach(function () {
                publicKeyFromWalletMock.mockReset();
                publicKeyFromWalletMock.mockReturnValue('publicKey');
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
                            expect(spy).toHaveBeenCalledWith('publicKey');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not fetch if no wallet', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.mockWalletRoute = null;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, wrapper.vm.fetchTransactions()];
                        case 2:
                            _a.sent();
                            expect(publicKeyFromWalletMock).not.toHaveBeenCalled();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should store updated transactions if route address has not changed', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.fetchedTransactions = ['placeholder'];
                            wrapper.vm.totalCount = 31;
                            jest.spyOn(wrapper.vm, 'getTransactions').mockReturnValue({
                                transactions: remoteTransactions,
                                totalCount: 1
                            });
                            return [4 /*yield*/, wrapper.vm.fetchTransactions()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.fetchedTransactions).toEqual(remoteTransactions);
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
                            jest.spyOn(wrapper.vm, 'getTransactions').mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    publicKeyFromWalletMock.mockReturnValue('differentPublicKey');
                                    return [2 /*return*/, {
                                            transactions: remoteTransactions,
                                            totalCount: 1
                                        }];
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
        });
        describe('refreshStatus', function () {
            beforeEach(function () {
                publicKeyFromWalletMock.mockReset();
                publicKeyFromWalletMock.mockReturnValue('publicKey');
            });
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
                            return [4 /*yield*/, wrapper.vm.refreshStatus()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.newTransactionsNotice).not.toBe('WALLET_TRANSACTIONS.NEW_TRANSACTIONS');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should do nothing if no publicKey', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(wrapper.vm, 'getTransactions');
                            publicKeyFromWalletMock.mockReturnValue(null);
                            return [4 /*yield*/, wrapper.vm.refreshStatus()];
                        case 1:
                            _a.sent();
                            expect(spy).not.toHaveBeenCalled();
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
    });
});
//# sourceMappingURL=WalletTransactionsMultiSignature.spec.js.map