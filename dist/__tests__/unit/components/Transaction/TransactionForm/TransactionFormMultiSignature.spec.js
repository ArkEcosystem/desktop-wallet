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
import { createLocalVue, mount } from '@vue/test-utils';
import { Identities } from '@arkecosystem/crypto';
import Vuelidate from 'vuelidate';
import cloneDeep from 'lodash/cloneDeep';
import installI18n from '../../../__utils__/i18n';
import { TransactionFormMultiSignature } from '@/components/Transaction/TransactionForm';
import CurrencyMixin from '@/mixins/currency';
import BigNumber from '@/plugins/bignumber';
import WalletService from '@/services/wallet';
var localVue = createLocalVue();
localVue.use(Vuelidate);
var i18n = installI18n(localVue);
var globalNetwork = Object.freeze({
    id: 'network-1',
    fractionDigits: 8,
    token: 'ARK',
    version: 23,
    wif: 170,
    market: {
        enabled: false
    },
    nethash: 'nethash-1'
});
var wrapper;
var createWrapper = function (component, wallet, network, props) {
    if (props === void 0) { props = {}; }
    component = component || TransactionFormMultiSignature;
    if (wallet === undefined) {
        wallet = {
            id: 'test-wallet'
        };
    }
    if (wallet && !Object.prototype.hasOwnProperty.call(wallet, 'passphrase')) {
        wallet.passphrase = null;
    }
    if (wallet && !Object.prototype.hasOwnProperty.call(wallet, 'address')) {
        wallet.address = 'address-1';
    }
    if (wallet && !Object.prototype.hasOwnProperty.call(wallet, 'publicKey')) {
        wallet.publicKey = 'public-key-1';
    }
    if (wallet && !Object.prototype.hasOwnProperty.call(wallet, 'balance')) {
        wallet.balance = (1000 * 1e8).toString();
    }
    var mountNetwork = network || cloneDeep(globalNetwork);
    wrapper = mount(TransactionFormMultiSignature, {
        i18n: i18n,
        localVue: localVue,
        sync: false,
        propsData: props,
        mocks: {
            $client: {
                buildMultiSignature: jest.fn(function (transactionData) { return transactionData; }),
                fetchWallet: jest.fn(function (address) { return ({
                    address: address,
                    publicKey: address.replace('address', 'public-key')
                }); })
            },
            $error: jest.fn(),
            $success: jest.fn(),
            $store: {
                getters: {
                    'profile/byId': jest.fn(function () { return ({
                        id: 'profile-1',
                        name: 'profile-1',
                        networkId: 'network-1'
                    }); }),
                    'session/currency': 'EUR',
                    get 'ledger/isConnected'() {
                        return true;
                    },
                    get 'ledger/wallets'() {
                        return [{
                                address: 'ledger-address-1'
                            }];
                    },
                    'wallet/byAddress': jest.fn(function (address) { return ({
                        address: address,
                        publicKey: address.replace('address', 'public-key')
                    }); }),
                    'wallet/byProfileId': jest.fn(function () { return [wallet]; }),
                    'wallet/contactsByProfileId': jest.fn(function () { return []; }),
                    'transaction/staticFee': jest.fn(function () { return null; }),
                    get 'session/profileId'() {
                        return 'profile-1';
                    },
                    'session/lastFeeByType': jest.fn(function () { return (1 * 1e8).toString(); }),
                    'network/byToken': jest.fn(function () { return mountNetwork; }),
                    'network/byId': jest.fn(function () { return mountNetwork; }),
                    'profile/byCompatibleAddress': jest.fn(function () { return []; }),
                    get 'profile/all'() {
                        return [{
                                id: 'profile-1',
                                name: 'profile-1',
                                networkId: 'network-1'
                            }, {
                                id: 'profile-2',
                                name: 'profile-2',
                                networkId: 'network-1'
                            }];
                    }
                }
            },
            $synchronizer: {
                appendFocus: jest.fn()
            },
            currency_subToUnit: jest.fn(CurrencyMixin.methods.currency_subToUnit),
            currency_format: jest.fn(CurrencyMixin.methods.currency_format),
            currency_toBuilder: jest.fn(CurrencyMixin.methods.currency_toBuilder),
            currency_simpleFormatCrypto: jest.fn(CurrencyMixin.methods.currency_simpleFormatCrypto),
            currency_unitToSub: jest.fn(CurrencyMixin.methods.currency_unitToSub),
            formatter_networkCurrency: jest.fn(),
            session_network: mountNetwork,
            wallet_formatAddress: jest.fn(function (address) { return "formatted-" + address; }),
            wallet_truncate: jest.fn(function (address) { return address; }),
            wallet_name: jest.fn(function (address) { return address; }),
            wallet_fromRoute: wallet
        },
        stubs: {
            Identicon: true,
            Portal: true
        }
    });
};
describe('TransactionFormMultiSignature', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should have multi-payment transaction type', function () {
        expect(wrapper.vm.$options.transactionType).toBe(4);
    });
    describe('data', function () {
        it('should has properties', function () {
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'step')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'currentTab')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'address')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'publicKey')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'form')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'publicKeys')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'minKeys')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'fee')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'passphrase')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'walletPassword')).toBe(true);
        });
    });
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionFormMultiSignature')).toBe(true);
        });
        describe('step 1', function () {
            it('should have add button', function () {
                expect(wrapper.contains('.TransactionFormMultiSignature__add')).toBe(true);
            });
            describe('address tab', function () {
                beforeEach(function () {
                    wrapper.vm.currentTab = 0;
                });
                it('should have address field', function () {
                    expect(wrapper.contains('.TransactionFormMultiSignature__address')).toBe(true);
                });
            });
            describe('public key tab', function () {
                beforeEach(function () {
                    wrapper.vm.currentTab = 1;
                });
                it('should have address field', function () {
                    expect(wrapper.contains('.TransactionFormMultiSignature__public-key')).toBe(true);
                });
            });
        });
        describe('step 2', function () {
            beforeEach(function () {
                wrapper.vm.step = 2;
            });
            it('should have fee field', function () {
                expect(wrapper.contains('.TransactionFormMultiSignature__fee')).toBe(true);
            });
            describe('ledger notice', function () {
                it('should show if wallet is a ledger', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                createWrapper(null, {
                                    isLedger: true
                                });
                                wrapper.vm.step = 2;
                                return [4 /*yield*/, wrapper.vm.$nextTick()];
                            case 1:
                                _a.sent();
                                expect(wrapper.contains('.TransactionFormMultiSignature__ledger-notice')).toBe(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should show if wallet is not a ledger', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                createWrapper(null, {
                                    isLedger: false
                                });
                                wrapper.vm.step = 2;
                                return [4 /*yield*/, wrapper.vm.$nextTick()];
                            case 1:
                                _a.sent();
                                expect(wrapper.contains('.TransactionFormMultiSignature__ledger-notice')).toBe(false);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('password field', function () {
                it('should show if wallet does have a password', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                createWrapper(null, {
                                    passphrase: 'password'
                                });
                                wrapper.vm.step = 2;
                                return [4 /*yield*/, wrapper.vm.$nextTick()];
                            case 1:
                                _a.sent();
                                expect(wrapper.contains('.TransactionFormMultiSignature__password')).toBe(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should not show if wallet does not have a password', function () {
                    expect(wrapper.contains('.TransactionFormMultiSignature__password')).toBe(false);
                });
            });
            describe('passphrase field', function () {
                it('should show if wallet does not have a password', function () {
                    expect(wrapper.contains('.TransactionFormMultiSignature__passphrase')).toBe(true);
                });
                it('should not show if wallet does have a password', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                createWrapper(null, {
                                    passphrase: 'password'
                                });
                                wrapper.vm.step = 2;
                                return [4 /*yield*/, wrapper.vm.$nextTick()];
                            case 1:
                                _a.sent();
                                expect(wrapper.contains('.TransactionFormMultiSignature__passphrase')).toBe(false);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
        describe('prev button', function () {
            it('should be enabled if on second form', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.step = 2;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.find('.TransactionFormMultiSignature__prev').attributes('disabled')).toBeFalsy();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should be disabled if on step 1', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.step = 1;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.find('.TransactionFormMultiSignature__prev').attributes('disabled')).toBe('disabled');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('next button', function () {
            it('should be enabled if recipients form is valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.step = 1;
                            wrapper.vm.$v.form.publicKeys.$model = [{
                                    address: 'address-2',
                                    publicKey: 'public-key-2'
                                }, {
                                    address: 'address-3',
                                    publicKey: 'public-key-3'
                                }];
                            wrapper.vm.$v.form.fee.$model = 0.1;
                            wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.find('.TransactionFormMultiSignature__next').attributes('disabled')).toBeFalsy();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should be enabled if both forms are valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.step = 2;
                            wrapper.vm.$v.form.publicKeys.$model = [{
                                    address: 'address-2',
                                    publicKey: 'public-key-2'
                                }, {
                                    address: 'address-3',
                                    publicKey: 'public-key-3'
                                }];
                            wrapper.vm.$v.form.fee.$model = 0.1;
                            wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.find('.TransactionFormMultiSignature__next').attributes('disabled')).toBeFalsy();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should be disabled if form is invalid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.form.$touch();
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.find('.TransactionFormMultiSignature__next').attributes('disabled')).toBe('disabled');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('computed', function () {
        describe('addressTab', function () {
            it('should return true if 0', function () {
                wrapper.vm.currentTab = 0;
                expect(wrapper.vm.addressTab).toBe(true);
            });
            it('should return false if 1', function () {
                wrapper.vm.currentTab = 1;
                expect(wrapper.vm.addressTab).toBe(false);
            });
        });
        describe('publicKeyTab', function () {
            it('should return true if 1', function () {
                wrapper.vm.currentTab = 1;
                expect(wrapper.vm.publicKeyTab).toBe(true);
            });
            it('should return false if 0', function () {
                wrapper.vm.currentTab = 0;
                expect(wrapper.vm.publicKeyTab).toBe(false);
            });
        });
        describe('tabs', function () {
            it('should return tabs', function () {
                expect(wrapper.vm.tabs).toEqual([
                    {
                        text: 'TRANSACTION.MULTI_SIGNATURE.TAB.ADDRESS'
                    },
                    {
                        text: 'TRANSACTION.MULTI_SIGNATURE.TAB.PUBLIC_KEY'
                    }
                ]);
            });
        });
        describe('validStep1', function () {
            describe('addressTab', function () {
                beforeEach(function () {
                    wrapper.vm.currentTab = 0;
                });
                it('should return false if address not dirty', function () {
                    wrapper.vm.$v.address.$model = Identities.Address.fromPassphrase('passphrase');
                    wrapper.vm.$v.address.$reset();
                    expect(wrapper.vm.$v.address.$dirty).toBe(false);
                    expect(wrapper.vm.$v.address.$invalid).toBe(false);
                    expect(wrapper.vm.addressWarning).toBeFalsy();
                    expect(wrapper.vm.address.replace(/\s+/, '') === '').toBe(false);
                    expect(wrapper.vm.validStep1).toBe(false);
                });
                it('should return false if address is invalid', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                WalletService.validateAddress.mockReturnValue(false);
                                wrapper.vm.$v.address.$model = 'wut';
                                return [4 /*yield*/, wrapper.vm.$nextTick()];
                            case 1:
                                _a.sent();
                                expect(wrapper.vm.$v.address.$dirty).toBe(true);
                                expect(wrapper.vm.$v.address.$invalid).toBe(true);
                                expect(wrapper.vm.addressWarning).toBeFalsy();
                                expect(wrapper.vm.address.replace(/\s+/, '') === '').toBe(false);
                                expect(wrapper.vm.validStep1).toBe(false);
                                WalletService.validateAddress.mockReturnValue(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should return false if address warning', function () {
                    var address = Identities.Address.fromPassphrase('passphrase');
                    wrapper.vm.$v.address.$model = address;
                    wrapper.vm.form.publicKeys = [{
                            address: address,
                            publicKey: 'public-key-2'
                        }];
                    expect(wrapper.vm.$v.address.$dirty).toBe(true);
                    expect(wrapper.vm.$v.address.$invalid).toBe(false);
                    expect(wrapper.vm.addressWarning).toBeTruthy();
                    expect(wrapper.vm.address.replace(/\s+/, '') === '').toBe(false);
                    expect(wrapper.vm.validStep1).toBe(false);
                });
                it('should return false if address is empty', function () {
                    wrapper.vm.$v.address.$model = '';
                    expect(wrapper.vm.$v.address.$dirty).toBe(true);
                    expect(wrapper.vm.$v.address.$invalid).toBe(false);
                    expect(wrapper.vm.addressWarning).toBeFalsy();
                    expect(wrapper.vm.address.replace(/\s+/, '') === '').toBe(true);
                    expect(wrapper.vm.validStep1).toBe(false);
                });
            });
            describe('publicKeyTab', function () {
                beforeEach(function () {
                    wrapper.vm.currentTab = 1;
                });
                it('should return false if publicKey not dirty', function () {
                    wrapper.vm.$v.publicKey.$model = Identities.PublicKey.fromPassphrase('passphrase');
                    wrapper.vm.$v.publicKey.$reset();
                    expect(wrapper.vm.$v.publicKey.$dirty).toBe(false);
                    expect(wrapper.vm.$v.publicKey.$invalid).toBe(false);
                    expect(wrapper.vm.publicKeyWarning).toBeFalsy();
                    expect(wrapper.vm.publicKey.replace(/\s+/, '') === '').toBe(false);
                    expect(wrapper.vm.validStep1).toBe(false);
                });
                it('should return false if publicKey is invalid', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                wrapper.vm.$v.publicKey.$model = 'wut';
                                return [4 /*yield*/, wrapper.vm.$nextTick()];
                            case 1:
                                _a.sent();
                                expect(wrapper.vm.$v.publicKey.$dirty).toBe(true);
                                expect(wrapper.vm.$v.publicKey.$invalid).toBe(true);
                                expect(wrapper.vm.publicKeyWarning).toBeFalsy();
                                expect(wrapper.vm.publicKey.replace(/\s+/, '') === '').toBe(false);
                                expect(wrapper.vm.validStep1).toBe(false);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should return false if publicKey warning', function () {
                    var publicKey = Identities.PublicKey.fromPassphrase('passphrase');
                    wrapper.vm.$v.publicKey.$model = publicKey;
                    wrapper.vm.form.publicKeys = [{
                            address: 'address-2',
                            publicKey: publicKey
                        }];
                    expect(wrapper.vm.$v.publicKey.$dirty).toBe(true);
                    expect(wrapper.vm.$v.publicKey.$invalid).toBe(false);
                    expect(wrapper.vm.publicKeyWarning).toBeTruthy();
                    expect(wrapper.vm.publicKey.replace(/\s+/, '') === '').toBe(false);
                    expect(wrapper.vm.validStep1).toBe(false);
                });
                it('should return false if publicKey is empty', function () {
                    wrapper.vm.$v.publicKey.$model = '';
                    expect(wrapper.vm.$v.publicKey.$dirty).toBe(true);
                    expect(wrapper.vm.$v.publicKey.$invalid).toBe(false);
                    expect(wrapper.vm.publicKeyWarning).toBeFalsy();
                    expect(wrapper.vm.publicKey.replace(/\s+/, '') === '').toBe(true);
                    expect(wrapper.vm.validStep1).toBe(false);
                });
            });
        });
        describe('isFormValid', function () {
            it('should return true if valid step 1', function () {
                wrapper.vm.step = 1;
                wrapper.vm.$v.form.publicKeys.$model = [{
                        address: 'address-2',
                        publicKey: 'public-key-2'
                    }, {
                        address: 'address-3',
                        publicKey: 'public-key-3'
                    }];
                expect(wrapper.vm.isFormValid).toBe(true);
            });
            it('should return false if valid step 1 and no keys', function () {
                wrapper.vm.step = 1;
                wrapper.vm.$v.form.publicKeys.$model = [];
                expect(wrapper.vm.isFormValid).toBe(false);
            });
            it('should return true if valid step 2', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.step = 2;
                            wrapper.vm.$v.form.publicKeys.$model = [{
                                    address: 'address-2',
                                    publicKey: 'public-key-2'
                                }, {
                                    address: 'address-3',
                                    publicKey: 'public-key-3'
                                }];
                            wrapper.vm.$v.form.minKeys.$model = 2;
                            wrapper.vm.$v.form.fee.$model = 0.1;
                            wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.isFormValid).toBe(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return false if valid step 1 and no keys', function () {
                wrapper.vm.step = 2;
                wrapper.vm.$v.form.publicKeys.$model = [{
                        address: 'address-2',
                        publicKey: 'public-key-2'
                    }, {
                        address: 'address-3',
                        publicKey: 'public-key-3'
                    }];
                expect(wrapper.vm.isFormValid).toBe(false);
            });
        });
        describe('addressWarning', function () {
            it('should return null if not dirty', function () {
                wrapper.vm.$v.address.$reset();
                expect(wrapper.vm.$v.address.$dirty).toBe(false);
                expect(wrapper.vm.addressWarning).toBe(null);
            });
            it('should return null if not duplicate', function () {
                wrapper.vm.form.publicKeys = [{
                        address: 'address-2',
                        publicKey: 'public-key-2'
                    }, {
                        address: 'address-3',
                        publicKey: 'public-key-3'
                    }];
                wrapper.vm.$v.address.$model = 'address-1';
                expect(wrapper.vm.$v.address.$dirty).toBe(true);
                expect(wrapper.vm.addressWarning).toBe(null);
            });
            it('should return error if duplicate', function () {
                wrapper.vm.form.publicKeys = [{
                        address: 'address-2',
                        publicKey: 'public-key-2'
                    }, {
                        address: 'address-3',
                        publicKey: 'public-key-3'
                    }];
                wrapper.vm.$v.address.$model = 'address-2';
                expect(wrapper.vm.$v.address.$dirty).toBe(true);
                expect(wrapper.vm.addressWarning).toBe('TRANSACTION.MULTI_SIGNATURE.ERROR_DUPLICATE');
            });
        });
        describe('publicKeyWarning', function () {
            it('should return null if not dirty', function () {
                wrapper.vm.$v.publicKey.$reset();
                expect(wrapper.vm.$v.publicKey.$dirty).toBe(false);
                expect(wrapper.vm.publicKeyWarning).toBe(null);
            });
            it('should return null if not duplicate', function () {
                wrapper.vm.form.publicKeys = [{
                        address: 'address-2',
                        publicKey: 'public-key-2'
                    }, {
                        address: 'address-3',
                        publicKey: 'public-key-3'
                    }];
                wrapper.vm.$v.publicKey.$model = 'public-key-1';
                expect(wrapper.vm.$v.publicKey.$dirty).toBe(true);
                expect(wrapper.vm.publicKeyWarning).toBe(null);
            });
            it('should return error if duplicate', function () {
                wrapper.vm.form.publicKeys = [{
                        address: 'address-2',
                        publicKey: 'public-key-2'
                    }, {
                        address: 'address-3',
                        publicKey: 'public-key-3'
                    }];
                wrapper.vm.$v.publicKey.$model = 'public-key-2';
                expect(wrapper.vm.$v.publicKey.$dirty).toBe(true);
                expect(wrapper.vm.publicKeyWarning).toBe('TRANSACTION.MULTI_SIGNATURE.ERROR_DUPLICATE');
            });
        });
        describe('maximumPublicKeys', function () {
            it('should return default if no constants', function () {
                expect(wrapper.vm.maximumPublicKeys).toBe(16);
            });
            it('should return default if no network value', function () {
                var network = __assign(__assign({}, cloneDeep(globalNetwork)), { constants: {} });
                createWrapper(null, undefined, network);
                expect(wrapper.vm.maximumPublicKeys).toBe(16);
            });
            it('should return network constant', function () {
                var network = __assign(__assign({}, cloneDeep(globalNetwork)), { constants: {
                        maxMultiSignatureParticipants: 20
                    } });
                createWrapper(null, undefined, network);
                expect(wrapper.vm.maximumPublicKeys).toBe(20);
            });
        });
        describe('minKeysError', function () {
            beforeEach(function () {
                wrapper.vm.$v.form.publicKeys.$model = [{
                        address: 'address-2',
                        publicKey: 'public-key-2'
                    }, {
                        address: 'address-3',
                        publicKey: 'public-key-3'
                    }];
            });
            it('should return null if valid value', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.form.minKeys.$model = 1;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.minKeysError).toBe(null);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return error if empty value', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.form.minKeys.$model = '';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.minKeysError).toBe('VALIDATION.REQUIRED');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return error if above maximum', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.form.minKeys.$model = 4;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.minKeysError).toBe('TRANSACTION.MULTI_SIGNATURE.ERROR_MIN_KEYS_TOO_HIGH');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return error if below minimum', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.form.minKeys.$model = 0;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.minKeysError).toBe('TRANSACTION.MULTI_SIGNATURE.ERROR_MIN_KEYS_TOO_LOW');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('mounted hook', function () {
        it('should add current wallet to public keys', function () {
            expect(wrapper.vm.form.publicKeys).toEqual([{
                    address: 'address-1',
                    publicKey: 'public-key-1'
                }]);
        });
        it('should update min keys', function () {
            var updateMinKeysOriginal = TransactionFormMultiSignature.methods.updateMinKeys;
            TransactionFormMultiSignature.methods.updateMinKeys = jest.fn();
            createWrapper();
            expect(TransactionFormMultiSignature.methods.updateMinKeys).toHaveBeenCalledTimes(1);
            TransactionFormMultiSignature.methods.updateMinKeys = updateMinKeysOriginal;
        });
    });
    describe('methods', function () {
        describe('getTransactionData', function () {
            it('should return correct data with passphrase', function () {
                wrapper.vm.$v.form.fee.$model = 0.1;
                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                wrapper.vm.$v.form.minKeys.$model = 3;
                wrapper.vm.$v.form.publicKeys.$model = [{
                        address: 'address-2',
                        publicKey: 'public-key-2'
                    }, {
                        address: 'address-3',
                        publicKey: 'public-key-3'
                    }, {
                        address: 'address-4',
                        publicKey: 'public-key-4'
                    }];
                expect(wrapper.vm.getTransactionData()).toEqual({
                    address: 'address-1',
                    passphrase: 'passphrase',
                    publicKeys: [
                        'public-key-2',
                        'public-key-3',
                        'public-key-4'
                    ],
                    minKeys: 3,
                    fee: new BigNumber(0.1 * 1e8),
                    wif: undefined,
                    networkWif: 170
                });
            });
            it('should return correct data with passphrase and second passphrase', function () {
                createWrapper(null, {
                    address: 'address-1',
                    passphrase: null,
                    secondPublicKey: Identities.PublicKey.fromPassphrase('second passphrase')
                });
                wrapper.vm.$v.form.fee.$model = 0.1;
                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                wrapper.vm.$v.form.secondPassphrase.$model = 'second passphrase';
                wrapper.vm.$v.form.minKeys.$model = 3;
                wrapper.vm.$v.form.publicKeys.$model = [{
                        address: 'address-2',
                        publicKey: 'public-key-2'
                    }, {
                        address: 'address-3',
                        publicKey: 'public-key-3'
                    }, {
                        address: 'address-4',
                        publicKey: 'public-key-4'
                    }];
                expect(wrapper.vm.getTransactionData()).toEqual({
                    address: 'address-1',
                    passphrase: 'passphrase',
                    secondPassphrase: 'second passphrase',
                    publicKeys: [
                        'public-key-2',
                        'public-key-3',
                        'public-key-4'
                    ],
                    minKeys: 3,
                    fee: new BigNumber(0.1 * 1e8),
                    wif: undefined,
                    networkWif: 170
                });
            });
        });
        describe('buildTransaction', function () {
            it('should build multi-signature', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionData, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionData = {
                                type: 6,
                                typeGroup: 1,
                                asset: {
                                    multiSignature: {}
                                }
                            };
                            return [4 /*yield*/, wrapper.vm.buildTransaction(transactionData, true, true)];
                        case 1:
                            response = _a.sent();
                            expect(wrapper.vm.$client.buildMultiSignature).toHaveBeenCalledWith(transactionData, true, true);
                            expect(response).toBe(transactionData);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build multi-signature with default arguments', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionData, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionData = {
                                type: 6,
                                typeGroup: 1,
                                asset: {
                                    multiSignature: {}
                                }
                            };
                            return [4 /*yield*/, wrapper.vm.buildTransaction(transactionData)];
                        case 1:
                            response = _a.sent();
                            expect(wrapper.vm.$client.buildMultiSignature).toHaveBeenCalledWith(transactionData, false, false);
                            expect(response).toBe(transactionData);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('transactionError', function () {
            it('should generate transaction error', function () {
                wrapper.vm.transactionError();
                expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.MULTI_SIGNATURE');
            });
        });
        describe('addPublicKey', function () {
            beforeEach(function () {
                wrapper.vm.form.publicKeys = [];
            });
            describe('addressTab', function () {
                beforeEach(function () {
                    wrapper.vm.currentTab = 0;
                });
                it('should get wallet from store', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var spy;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                spy = jest.spyOn(wrapper.vm.$store.getters, 'wallet/byAddress');
                                wrapper.vm.address = 'address-4';
                                return [4 /*yield*/, wrapper.vm.addPublicKey()];
                            case 1:
                                _a.sent();
                                expect(spy).toHaveBeenCalledWith('address-4');
                                expect(wrapper.vm.form.publicKeys).toEqual([{
                                        address: 'address-4',
                                        publicKey: 'public-key-4'
                                    }]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should check api for wallet', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var spy;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                jest.spyOn(wrapper.vm.$store.getters, 'wallet/byAddress').mockReturnValue(null);
                                spy = jest.spyOn(wrapper.vm.$client, 'fetchWallet');
                                wrapper.vm.address = 'address-4';
                                return [4 /*yield*/, wrapper.vm.addPublicKey()];
                            case 1:
                                _a.sent();
                                expect(spy).toHaveBeenCalledWith('address-4');
                                expect(wrapper.vm.form.publicKeys).toEqual([{
                                        address: 'address-4',
                                        publicKey: 'public-key-4'
                                    }]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should error if no wallet', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var spy;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                jest.spyOn(wrapper.vm.$store.getters, 'wallet/byAddress').mockReturnValue(null);
                                jest.spyOn(wrapper.vm.$client, 'fetchWallet').mockReturnValue(null);
                                spy = jest.spyOn(wrapper.vm, '$error');
                                wrapper.vm.address = 'address-4';
                                return [4 /*yield*/, wrapper.vm.addPublicKey()];
                            case 1:
                                _a.sent();
                                expect(spy).toHaveBeenCalledWith('TRANSACTION.MULTI_SIGNATURE.ERROR_PUBLIC_KEY_NOT_FOUND');
                                expect(wrapper.vm.form.publicKeys).toEqual([]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should error if duplicate entry', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var spy;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                wrapper.vm.form.publicKeys = [{
                                        address: 'address-4',
                                        publicKey: 'public-key-4'
                                    }];
                                jest.spyOn(wrapper.vm.$store.getters, 'wallet/byAddress');
                                spy = jest.spyOn(wrapper.vm, '$error');
                                wrapper.vm.address = 'address-4';
                                return [4 /*yield*/, wrapper.vm.addPublicKey()];
                            case 1:
                                _a.sent();
                                expect(spy).toHaveBeenCalledWith('TRANSACTION.MULTI_SIGNATURE.ERROR_PUBLIC_KEY_EXISTS');
                                expect(wrapper.vm.form.publicKeys).toEqual([{
                                        address: 'address-4',
                                        publicKey: 'public-key-4'
                                    }]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should update duplicate entry if only has public key', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var spy;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                wrapper.vm.form.publicKeys = [{
                                        address: null,
                                        publicKey: 'public-key-4'
                                    }];
                                jest.spyOn(wrapper.vm.$store.getters, 'wallet/byAddress');
                                spy = jest.spyOn(wrapper.vm, '$error');
                                wrapper.vm.address = 'address-4';
                                return [4 /*yield*/, wrapper.vm.addPublicKey()];
                            case 1:
                                _a.sent();
                                expect(spy).toHaveBeenCalledWith('TRANSACTION.MULTI_SIGNATURE.ERROR_PUBLIC_KEY_EXISTS');
                                expect(wrapper.vm.form.publicKeys).toEqual([{
                                        address: 'address-4',
                                        publicKey: 'public-key-4'
                                    }]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should reset field', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                wrapper.vm.$v.address.$model = 'address-4';
                                return [4 /*yield*/, wrapper.vm.addPublicKey()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, wrapper.vm.$nextTick()];
                            case 2:
                                _a.sent();
                                expect(wrapper.vm.$refs.address.$v.$dirty).toBe(false);
                                expect(wrapper.vm.$v.address.$model).toBe('');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('publicKeyTab', function () {
                beforeEach(function () {
                    wrapper.vm.currentTab = 1;
                });
                it('should store public key', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                wrapper.vm.publicKey = 'public-key-4';
                                return [4 /*yield*/, wrapper.vm.addPublicKey()];
                            case 1:
                                _a.sent();
                                expect(wrapper.vm.form.publicKeys).toEqual([{
                                        address: null,
                                        publicKey: 'public-key-4'
                                    }]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should error if duplicate entry', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var spy;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                wrapper.vm.form.publicKeys = [{
                                        address: 'address-4',
                                        publicKey: 'public-key-4'
                                    }];
                                jest.spyOn(wrapper.vm.$store.getters, 'wallet/byAddress');
                                spy = jest.spyOn(wrapper.vm, '$error');
                                wrapper.vm.publicKey = 'public-key-4';
                                return [4 /*yield*/, wrapper.vm.addPublicKey()];
                            case 1:
                                _a.sent();
                                expect(spy).toHaveBeenCalledWith('TRANSACTION.MULTI_SIGNATURE.ERROR_PUBLIC_KEY_EXISTS');
                                expect(wrapper.vm.form.publicKeys).toEqual([{
                                        address: 'address-4',
                                        publicKey: 'public-key-4'
                                    }]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should reset field', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                wrapper.vm.$v.publicKey.$model = 'public-key-4';
                                return [4 /*yield*/, wrapper.vm.addPublicKey()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, wrapper.vm.$nextTick()];
                            case 2:
                                _a.sent();
                                expect(wrapper.vm.$refs.publicKey.$v.$dirty).toBe(false);
                                expect(wrapper.vm.$v.publicKey.$model).toBe('');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
        describe('updateMinKeys', function () {
            it('should update min keys to be length of public keys', function () {
                wrapper.vm.$v.form.publicKeys.$model = [{
                        address: 'address-2',
                        publicKey: 'public-key-2'
                    }, {
                        address: 'address-3',
                        publicKey: 'public-key-3'
                    }, {
                        address: 'address-4',
                        publicKey: 'public-key-4'
                    }];
                wrapper.vm.$v.form.minKeys.$model = 1;
                wrapper.vm.updateMinKeys();
                expect(wrapper.vm.$v.form.minKeys.$model).toBe(3);
            });
        });
        describe('previousStep', function () {
            it('should go from step 2 to step 1', function () {
                wrapper.vm.step = 2;
                wrapper.vm.previousStep();
                expect(wrapper.vm.step).toBe(1);
            });
            it('should do nothing on step 1', function () {
                wrapper.vm.step = 1;
                wrapper.vm.previousStep();
                expect(wrapper.vm.step).toBe(1);
            });
        });
        describe('nextStep', function () {
            it('should go from step 1 to step 2', function () {
                wrapper.vm.step = 1;
                wrapper.vm.nextStep();
                expect(wrapper.vm.step).toBe(2);
            });
            it('should submit form data on step 2', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(wrapper.vm, 'onSubmit').mockImplementation();
                            wrapper.vm.step = 2;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            wrapper.vm.nextStep();
                            expect(spy).toHaveBeenCalledTimes(1);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('emitRemovePublicKey', function () {
            it('should remove recipient at index', function () {
                wrapper.vm.$v.form.publicKeys.$model = [{
                        address: 'address-2',
                        publicKey: 'public-key-2'
                    }, {
                        address: 'address-3',
                        publicKey: 'public-key-3'
                    }, {
                        address: 'address-4',
                        publicKey: 'public-key-4'
                    }];
                wrapper.vm.emitRemovePublicKey(1);
                expect(wrapper.vm.$v.form.publicKeys.$model).toEqual([{
                        address: 'address-2',
                        publicKey: 'public-key-2'
                    }, {
                        address: 'address-4',
                        publicKey: 'public-key-4'
                    }]);
            });
            it('should do nothing if index does not exist', function () {
                var publicKeys = [{
                        address: 'address-2',
                        publicKey: 'public-key-2'
                    }, {
                        address: 'address-3',
                        publicKey: 'public-key-3'
                    }];
                wrapper.vm.$v.form.publicKeys.$model = publicKeys;
                wrapper.vm.emitRemovePublicKey(3);
                expect(wrapper.vm.$v.form.publicKeys.$model).toEqual(publicKeys);
            });
        });
    });
    describe('validations', function () {
        describe('publicKey', function () {
            beforeEach(function () {
                wrapper.vm.currentTab = 1;
            });
            it('should not be valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.publicKey.$model = 'test';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.$refs.publicKey.$v.$invalid).toBe(true);
                            expect(wrapper.vm.$v.publicKey.isValid).toBe(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not be valid if no publicKey field', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$refs.publicKey = null;
                            wrapper.vm.$v.publicKey.$model = Identities.Address.fromPassphrase('passphrase');
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.$refs.publicKey).toBe(null);
                            expect(wrapper.vm.$v.publicKey.isValid).toBe(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should be valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.publicKey.$model = Identities.PublicKey.fromPassphrase('passphrase');
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.$refs.publicKey.$v.$invalid).toBe(false);
                            expect(wrapper.vm.$v.publicKey.isValid).toBe(true);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('address', function () {
            beforeEach(function () {
                wrapper.vm.currentTab = 0;
            });
            it('should not be valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            WalletService.validateAddress.mockReturnValue(false);
                            wrapper.vm.$v.address.$model = 'test';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.$refs.address.$v.$invalid).toBe(true);
                            expect(wrapper.vm.$v.address.isValid).toBe(false);
                            WalletService.validateAddress.mockReturnValue(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not be valid if no address field', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$refs.address = null;
                            wrapper.vm.$v.address.$model = Identities.Address.fromPassphrase('passphrase');
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.$refs.address).toBe(null);
                            expect(wrapper.vm.$v.address.isValid).toBe(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should be valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.address.$model = Identities.Address.fromPassphrase('passphrase');
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.$refs.address.$v.$invalid).toBe(false);
                            expect(wrapper.vm.$v.address.isValid).toBe(true);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('form', function () {
            describe('publicKeys', function () {
                it('should not be notEmpty', function () {
                    wrapper.vm.$v.form.publicKeys.$model = [{
                            address: 'address-1',
                            publicKey: 'public-key-1'
                        }];
                    expect(wrapper.vm.$v.form.publicKeys.notEmpty).toBe(true);
                });
                it('should be notEmpty', function () {
                    wrapper.vm.$v.form.publicKeys.$model = [];
                    expect(wrapper.vm.$v.form.publicKeys.notEmpty).toBe(false);
                });
                it('should not be above minimum if not set', function () {
                    wrapper.vm.$v.form.publicKeys.$model = [];
                    expect(wrapper.vm.$v.form.publicKeys.aboveMinimum).toBe(false);
                });
                it('should not be above minimum if not enough', function () {
                    wrapper.vm.$v.form.publicKeys.$model = [{
                            address: 'address-2',
                            publicKey: 'public-key-2'
                        }];
                    expect(wrapper.vm.$v.form.publicKeys.aboveMinimum).toBe(false);
                });
                it('should be above minimum if set', function () {
                    wrapper.vm.$v.form.publicKeys.$model = [{
                            address: 'address-2',
                            publicKey: 'public-key-2'
                        }, {
                            address: 'address-3',
                            publicKey: 'public-key-3'
                        }];
                    expect(wrapper.vm.$v.form.publicKeys.aboveMinimum).toBe(true);
                });
                it('should not be below maximum if too many', function () {
                    var network = __assign(__assign({}, cloneDeep(globalNetwork)), { constants: {
                            maxMultiSignatureParticipants: 2
                        } });
                    createWrapper(null, undefined, network);
                    wrapper.vm.$v.form.publicKeys.$model = [{
                            address: 'address-2',
                            publicKey: 'public-key-2'
                        }, {
                            address: 'address-3',
                            publicKey: 'public-key-3'
                        }, {
                            address: 'address-4',
                            publicKey: 'public-key-4'
                        }];
                    expect(wrapper.vm.$v.form.publicKeys.belowMaximum).toBe(false);
                });
                it('should be below maximum if set', function () {
                    wrapper.vm.$v.form.publicKeys.$model = [{
                            address: 'address-2',
                            publicKey: 'public-key-2'
                        }];
                    expect(wrapper.vm.$v.form.publicKeys.belowMaximum).toBe(true);
                });
            });
            describe('minKeys', function () {
                it('should be required if not set', function () {
                    wrapper.vm.$v.form.minKeys.$model = '';
                    expect(wrapper.vm.$v.form.minKeys.required).toBe(false);
                });
                it('should not be required if set', function () {
                    wrapper.vm.$v.form.minKeys.$model = 1;
                    expect(wrapper.vm.$v.form.minKeys.required).toBe(true);
                });
                it('should not be above minimum if not set', function () {
                    wrapper.vm.$v.form.minKeys.$model = '';
                    expect(wrapper.vm.$v.form.minKeys.aboveMinimum).toBe(false);
                });
                it('should not be above minimum if not enough', function () {
                    wrapper.vm.$v.form.minKeys.$model = 0;
                    expect(wrapper.vm.$v.form.minKeys.aboveMinimum).toBe(false);
                });
                it('should be above minimum if set', function () {
                    wrapper.vm.$v.form.minKeys.$model = 1;
                    expect(wrapper.vm.$v.form.minKeys.aboveMinimum).toBe(true);
                });
                it('should not be below maximum if too many', function () {
                    wrapper.vm.$v.form.minKeys.$model = [{
                            address: 'address-2',
                            publicKey: 'public-key-2'
                        }, {
                            address: 'address-3',
                            publicKey: 'public-key-3'
                        }];
                    wrapper.vm.$v.form.minKeys.$model = 3;
                    expect(wrapper.vm.$v.form.minKeys.belowMaximum).toBe(false);
                });
                it('should be below maximum if set', function () {
                    wrapper.vm.$v.form.publicKeys.$model = [{
                            address: 'address-2',
                            publicKey: 'public-key-2'
                        }, {
                            address: 'address-3',
                            publicKey: 'public-key-3'
                        }];
                    wrapper.vm.$v.form.minKeys.$model = 2;
                    expect(wrapper.vm.$v.form.minKeys.belowMaximum).toBe(true);
                });
            });
        });
    });
});
//# sourceMappingURL=TransactionFormMultiSignature.spec.js.map