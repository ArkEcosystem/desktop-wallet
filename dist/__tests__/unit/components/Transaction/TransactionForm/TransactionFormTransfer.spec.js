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
import { VENDOR_FIELD } from '@config';
import { TransactionFormTransfer } from '@/components/Transaction/TransactionForm';
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
    nethash: 'nethash-1',
    constants: {
        aip11: true
    }
});
var wrapper;
var createWrapper = function (component, wallet, network, props) {
    if (props === void 0) { props = {}; }
    component = component || TransactionFormTransfer;
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
    if (wallet && !Object.prototype.hasOwnProperty.call(wallet, 'balance')) {
        wallet.balance = (1000 * 1e8).toString();
    }
    var mountNetwork = network || cloneDeep(globalNetwork);
    wrapper = mount(TransactionFormTransfer, {
        i18n: i18n,
        localVue: localVue,
        sync: false,
        propsData: props,
        mocks: {
            $client: {
                buildTransfer: jest.fn(function (transactionData) { return transactionData; }),
                buildMultiPayment: jest.fn(function (transactionData) { return transactionData; })
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
describe('TransactionFormTransfer', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should not have magistrate transaction group', function () {
        expect(wrapper.vm.$options.transactionGroup).not.toBe(2);
    });
    it('should have transfer transaction type', function () {
        expect(wrapper.vm.$options.transactionType).toBe(0);
    });
    describe('props', function () {
        it('should allow schema', function () {
            wrapper.setProps({
                schema: {
                    test: true
                }
            });
            expect(wrapper.vm.schema).toEqual({ test: true });
        });
        it('should default schema', function () {
            expect(wrapper.vm.schema).toEqual(undefined);
        });
    });
    describe('data', function () {
        it('should has properties', function () {
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'recipientId')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'amount')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'isSendAllActive')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'previousAmount')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'showConfirmSendAll')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'wallet')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'form')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'recipients')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'fee')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'passphrase')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'walletPassword')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'vendorField')).toBe(true);
        });
    });
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionFormTransfer')).toBe(true);
        });
        it('should have recipient field', function () {
            expect(wrapper.contains('.TransactionFormTransfer__recipient')).toBe(true);
        });
        it('should have amount field', function () {
            expect(wrapper.contains('.TransactionFormTransfer__amount')).toBe(true);
        });
        it('should have add button', function () {
            expect(wrapper.contains('.TransactionFormTransfer__add')).toBe(true);
        });
        it('should have send all switch', function () {
            expect(wrapper.contains('.TransactionFormTransfer__send-all')).toBe(true);
        });
        describe('wallet selection', function () {
            it('should show if schema prop is provided with address', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.setProps({
                                schema: {
                                    address: 'address-1'
                                }
                            });
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.contains('.TransactionFormTransfer__wallet')).toBe(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not show if no schema prop is provided', function () {
                createWrapper(null, {
                    isLedger: false
                });
                expect(wrapper.contains('.TransactionFormTransfer__wallet')).toBe(false);
            });
        });
        describe('ledger notice', function () {
            it('should show if wallet is a ledger', function () {
                createWrapper(null, {
                    isLedger: true
                });
                expect(wrapper.contains('.TransactionFormTransfer__ledger-notice')).toBe(true);
            });
            it('should show if wallet is not a ledger', function () {
                createWrapper(null, {
                    isLedger: false
                });
                expect(wrapper.contains('.TransactionFormTransfer__ledger-notice')).toBe(false);
            });
        });
        describe('next button', function () {
            it('should be enabled if recipients form is valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.form.recipients.$model = [{
                                    address: 'address-2',
                                    amount: 10
                                }, {
                                    address: 'address-2',
                                    amount: 10
                                }];
                            wrapper.vm.$v.form.fee.$model = 0.1;
                            wrapper.vm.$v.form.vendorField.$model = 'vendorfield test';
                            wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.find('.TransactionFormTransfer__next').attributes('disabled')).toBeFalsy();
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
                            expect(wrapper.find('.TransactionFormTransfer__next').attributes('disabled')).toBe('disabled');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('computed', function () {
        describe('alternativeCurrency', function () {
            it('should return correct data', function () {
                expect(wrapper.vm.alternativeCurrency).toEqual('EUR');
            });
            it('should update data', function () {
                wrapper.vm.$store.getters['session/currency'] = 'GBP';
                expect(wrapper.vm.alternativeCurrency).toEqual('GBP');
            });
        });
        describe('isMultiPayment', function () {
            it('should return false if it is a normal transaction', function () {
                wrapper.vm.$v.form.recipients.$model = [{
                        address: 'address-2',
                        amount: 10
                    }];
                expect(wrapper.vm.isMultiPayment).toBe(false);
            });
            it('should return true if it is multipayment transaction', function () {
                wrapper.vm.$v.form.recipients.$model = [{
                        address: 'address-2',
                        amount: 10
                    }, {
                        address: 'address-3',
                        amount: 10
                    }];
                expect(wrapper.vm.isMultiPayment).toBe(true);
            });
        });
        describe('hasAip11', function () {
            it('should return true if it is aip11', function () {
                var response = TransactionFormTransfer.computed.walletNetwork.call({
                    session_network: globalNetwork,
                    currentWallet: null
                });
                expect(response.constants.aip11).toBe(true);
            });
            it('should return false if aip11 is false', function () {
                var response = TransactionFormTransfer.computed.walletNetwork.call({
                    session_network: __assign(__assign({}, globalNetwork), { constants: __assign(__assign({}, globalNetwork.constants), { aip11: false }) }),
                    currentWallet: null
                });
                expect(response.constants.aip11).toBe(false);
            });
        });
        describe('amountTooLowError', function () {
            it('should return formatted value', function () {
                var $tSpy = jest.fn(function (translation) { return translation; });
                var simpleFormatCryptoSpy = jest.fn(CurrencyMixin.methods.currency_simpleFormatCrypto);
                var response = TransactionFormTransfer.computed.amountTooLowError.call({
                    walletNetwork: globalNetwork,
                    $t: $tSpy,
                    currency_simpleFormatCrypto: simpleFormatCryptoSpy,
                    session_network: globalNetwork
                });
                expect($tSpy).toHaveBeenCalledWith('INPUT_CURRENCY.ERROR.LESS_THAN_MINIMUM', {
                    amount: '0.00000001 ARK'
                });
                expect(response).toBe('INPUT_CURRENCY.ERROR.LESS_THAN_MINIMUM');
                expect(simpleFormatCryptoSpy).toHaveBeenCalledWith('0.00000001');
            });
            it('should return formatted value with different fraction digits', function () {
                var $tSpy = jest.fn(function (translation) { return translation; });
                var simpleFormatCryptoSpy = jest.fn(CurrencyMixin.methods.currency_simpleFormatCrypto);
                var response = TransactionFormTransfer.computed.amountTooLowError.call({
                    walletNetwork: __assign(__assign({}, globalNetwork), { fractionDigits: 2 }),
                    $t: $tSpy,
                    currency_simpleFormatCrypto: simpleFormatCryptoSpy,
                    session_network: globalNetwork
                });
                expect($tSpy).toHaveBeenCalledWith('INPUT_CURRENCY.ERROR.LESS_THAN_MINIMUM', {
                    amount: '0.01 ARK'
                });
                expect(response).toBe('INPUT_CURRENCY.ERROR.LESS_THAN_MINIMUM');
                expect(simpleFormatCryptoSpy).toHaveBeenCalledWith('0.01');
            });
        });
        describe('notEnoughBalanceError', function () {
            it('should return a formatted value', function () {
                var $tSpy = jest.fn(function (translation) { return translation; });
                var formatterNetworkCurrencySpy = jest.fn(function (value) { return value; });
                var response = TransactionFormTransfer.computed.notEnoughBalanceError.call({
                    currentWallet: {
                        balance: (10 * 1e8).toString()
                    },
                    $t: $tSpy,
                    formatter_networkCurrency: formatterNetworkCurrencySpy,
                    session_network: globalNetwork
                });
                expect(response).toBe('TRANSACTION_FORM.ERROR.NOT_ENOUGH_BALANCE');
                expect($tSpy).toHaveBeenCalledWith('TRANSACTION_FORM.ERROR.NOT_ENOUGH_BALANCE', {
                    balance: '1000000000'
                });
                expect(formatterNetworkCurrencySpy).toHaveBeenCalledWith('1000000000');
            });
        });
        describe('minimumAmount', function () {
            it('should return the correct value', function () {
                expect(wrapper.vm.minimumAmount + '').toBe('0.00000001');
            });
        });
        describe('maximumAvailableAmount', function () {
            it('should return value', function () {
                wrapper.vm.$v.form.fee.$model = 0.1;
                expect(wrapper.vm.maximumAvailableAmount).toEqual((new BigNumber(1000)).minus(0.1));
            });
            it('should return value including all recipients', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.form.fee.$model = 0.1;
                            wrapper.vm.$v.recipientId.$model = Identities.Address.fromPassphrase('test');
                            wrapper.vm.$v.amount.$model = 10;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            wrapper.vm.addRecipient();
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 2:
                            _a.sent();
                            wrapper.vm.$v.recipientId.$model = Identities.Address.fromPassphrase('test');
                            wrapper.vm.$v.amount.$model = 20;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 3:
                            _a.sent();
                            wrapper.vm.addRecipient();
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 4:
                            _a.sent();
                            expect(wrapper.vm.maximumAvailableAmount).toEqual((new BigNumber(1000)).minus(0.1).minus(30));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return value based on different fee', function () {
                wrapper.vm.form.fee = 10;
                expect(wrapper.vm.maximumAvailableAmount).toEqual((new BigNumber(1000)).minus(10));
            });
        });
        describe('canSendAll', function () {
            it('should return true if amount is greater than 0', function () {
                expect(wrapper.vm.currentWallet.balance).toBe((1000 * 1e8).toString());
                expect(wrapper.vm.form.fee).toBe('0.1');
                expect(wrapper.vm.canSendAll).toBe(true);
            });
            it('should return false if maximumAvailableAmount is 0', function () {
                createWrapper(null, {
                    balance: (0.1 * 1e8).toString()
                });
                expect(wrapper.vm.currentWallet.balance).toBe((0.1 * 1e8).toString());
                expect(wrapper.vm.form.fee).toBe('0.1');
                expect(wrapper.vm.canSendAll).toBe(false);
            });
        });
        describe('senderLabel', function () {
            it('should return formatted address if currentWallet', function () {
                expect(wrapper.vm.senderLabel).toEqual('formatted-address-1');
            });
            it('should return null if no current wallet', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    createWrapper(null, null);
                    expect(wrapper.vm.senderLabel).toEqual(null);
                    return [2 /*return*/];
                });
            }); });
        });
        describe('senderWallet', function () {
            it('should return wallet if set', function () {
                wrapper.vm.wallet = {
                    address: 'address-1'
                };
                expect(wrapper.vm.senderWallet).toEqual({
                    address: 'address-1'
                });
            });
        });
        describe('walletNetwork', function () {
            it('should return current network if no wallet selected', function () {
                var profileByIdSpy = jest.fn();
                var networkByIdSpy = jest.fn();
                var response = TransactionFormTransfer.computed.walletNetwork.call({
                    $store: {
                        getters: {
                            'network/byId': networkByIdSpy,
                            'profile/byId': profileByIdSpy
                        }
                    },
                    session_network: globalNetwork,
                    currentWallet: null
                });
                expect(response).toBe(globalNetwork);
                expect(profileByIdSpy).not.toHaveBeenCalled();
                expect(networkByIdSpy).not.toHaveBeenCalled();
            });
            it('should return current network if wallet does not have id', function () {
                var profileByIdSpy = jest.fn();
                var networkByIdSpy = jest.fn();
                var response = TransactionFormTransfer.computed.walletNetwork.call({
                    $store: {
                        getters: {
                            'network/byId': networkByIdSpy,
                            'profile/byId': profileByIdSpy
                        }
                    },
                    session_network: globalNetwork,
                    currentWallet: {}
                });
                expect(response).toBe(globalNetwork);
                expect(profileByIdSpy).not.toHaveBeenCalled();
                expect(networkByIdSpy).not.toHaveBeenCalled();
            });
            it('should return current network if no profile selected', function () {
                var profileByIdSpy = jest.fn();
                var networkByIdSpy = jest.fn();
                var response = TransactionFormTransfer.computed.walletNetwork.call({
                    $store: {
                        getters: {
                            'network/byId': networkByIdSpy,
                            'profile/byId': profileByIdSpy
                        }
                    },
                    session_network: globalNetwork,
                    currentWallet: {
                        id: 'test',
                        profileId: 'profile-id'
                    }
                });
                expect(response).toBe(globalNetwork);
                expect(profileByIdSpy).toHaveBeenCalledWith('profile-id');
                expect(networkByIdSpy).not.toHaveBeenCalled();
            });
            it('should return current network if no network for profile selected', function () {
                var profileByIdSpy = jest.fn(function () { return ({
                    id: 'profile-id',
                    networkId: 'network-id'
                }); });
                var networkByIdSpy = jest.fn();
                var response = TransactionFormTransfer.computed.walletNetwork.call({
                    $store: {
                        getters: {
                            'network/byId': networkByIdSpy,
                            'profile/byId': profileByIdSpy
                        }
                    },
                    session_network: globalNetwork,
                    currentWallet: {
                        id: 'test',
                        profileId: 'profile-id'
                    }
                });
                expect(response).toBe(globalNetwork);
                expect(profileByIdSpy).toHaveBeenCalledWith('profile-id');
                expect(networkByIdSpy).toHaveBeenCalledWith('network-id');
            });
            it('should return profile network if no network for profile selected', function () {
                var profileNetwork = {
                    fractionDigits: 2,
                    token: 'DARK',
                    version: 30,
                    wif: 170,
                    market: {
                        enabled: false
                    }
                };
                var profileByIdSpy = jest.fn(function () { return ({
                    id: 'profile-id',
                    networkId: 'network-id'
                }); });
                var networkByIdSpy = jest.fn(function () { return profileNetwork; });
                var response = TransactionFormTransfer.computed.walletNetwork.call({
                    $store: {
                        getters: {
                            'network/byId': networkByIdSpy,
                            'profile/byId': profileByIdSpy
                        }
                    },
                    session_network: globalNetwork,
                    currentWallet: {
                        id: 'test',
                        profileId: 'profile-id'
                    }
                });
                expect(response).toBe(profileNetwork);
                expect(profileByIdSpy).toHaveBeenCalledWith('profile-id');
                expect(networkByIdSpy).toHaveBeenCalledWith('network-id');
            });
        });
        describe('currentWallet', function () {
            it('should get sender wallet', function () {
                wrapper.vm.wallet = {
                    id: 'test',
                    balance: 0,
                    address: 'address-3'
                };
                expect(wrapper.vm.currentWallet).toBe(wrapper.vm.wallet);
            });
            it('should get wallet from route', function () {
                var newWallet = {
                    id: 'test',
                    balance: 20,
                    address: 'address-2'
                };
                createWrapper(null, newWallet);
                wrapper.vm.wallet = null;
                expect(wrapper.vm.senderWallet).toBe(null);
                expect(wrapper.vm.currentWallet).toBe(newWallet);
            });
            it('should set wallet', function () {
                var newWallet = {
                    id: 'test',
                    balance: 20,
                    address: 'address-2'
                };
                wrapper.vm.wallet = null;
                wrapper.vm.currentWallet = newWallet;
                expect(wrapper.vm.wallet).toBe(newWallet);
            });
        });
        describe('vendorFieldLabel', function () {
            it('should return value', function () {
                expect(wrapper.vm.vendorFieldLabel).toBe('TRANSACTION.VENDOR_FIELD - VALIDATION.MAX_LENGTH');
            });
        });
        describe('vendorFieldHelperText', function () {
            describe('default max length', function () {
                var $tSpy;
                beforeEach(function () {
                    $tSpy = jest.spyOn(wrapper.vm, '$t');
                });
                afterEach(function () {
                    $tSpy.mockRestore();
                });
                it('should return null if vendorfield is empty', function () {
                    wrapper.vm.form.vendorField = '';
                    expect(wrapper.vm.vendorFieldHelperText).toBe(null);
                    expect($tSpy).not.toHaveBeenCalledWith('VALIDATION.VENDOR_FIELD.LIMIT_REACHED', [VENDOR_FIELD.defaultMaxLength]);
                });
                it('should return length warning if equal to max', function () {
                    wrapper.vm.form.vendorField = ''.padStart(VENDOR_FIELD.defaultMaxLength, '-');
                    expect(wrapper.vm.vendorFieldHelperText).toBe('VALIDATION.VENDOR_FIELD.LIMIT_REACHED');
                    expect($tSpy).toHaveBeenCalledWith('VALIDATION.VENDOR_FIELD.LIMIT_REACHED', [VENDOR_FIELD.defaultMaxLength]);
                });
                it('should return length warning if less than max', function () {
                    wrapper.vm.form.vendorField = ''.padStart(VENDOR_FIELD.defaultMaxLength - 10, '-');
                    expect(wrapper.vm.vendorFieldHelperText).toBe('VALIDATION.VENDOR_FIELD.LIMIT_REMAINING');
                    expect($tSpy).toHaveBeenCalledWith('VALIDATION.VENDOR_FIELD.LIMIT_REMAINING', [
                        10,
                        VENDOR_FIELD.defaultMaxLength
                    ]);
                });
            });
            describe('network max length', function () {
                var $tSpy;
                beforeEach(function () {
                    var network = __assign(__assign({}, cloneDeep(globalNetwork)), { vendorField: {
                            maxLength: 20
                        } });
                    createWrapper(null, undefined, network);
                    $tSpy = jest.spyOn(wrapper.vm, '$t');
                });
                afterEach(function () {
                    $tSpy.mockRestore();
                });
                it('should return null if vendorfield is empty', function () {
                    wrapper.vm.form.vendorField = '';
                    expect(wrapper.vm.vendorFieldHelperText).toBe(null);
                    expect($tSpy).not.toHaveBeenCalledWith('VALIDATION.VENDOR_FIELD.LIMIT_REACHED', [20]);
                });
                it('should return length warning if equal to max', function () {
                    wrapper.vm.form.vendorField = ''.padStart(20, '-');
                    expect(wrapper.vm.walletNetwork.vendorField.maxLength).toBe(20);
                    expect(wrapper.vm.vendorFieldHelperText).toBe('VALIDATION.VENDOR_FIELD.LIMIT_REACHED');
                    expect($tSpy).toHaveBeenCalledWith('VALIDATION.VENDOR_FIELD.LIMIT_REACHED', [20]);
                });
                it('should return length warning if less than max', function () {
                    wrapper.vm.form.vendorField = ''.padStart(20 - 5, '-');
                    expect(wrapper.vm.vendorFieldHelperText).toBe('VALIDATION.VENDOR_FIELD.LIMIT_REMAINING');
                    expect($tSpy).toHaveBeenCalledWith('VALIDATION.VENDOR_FIELD.LIMIT_REMAINING', [
                        5,
                        20
                    ]);
                });
            });
        });
        describe('vendorFieldMaxLength', function () {
            it('should return network max length', function () {
                createWrapper(null, undefined, __assign(__assign({}, cloneDeep(globalNetwork)), { vendorField: {
                        maxLength: 20
                    } }));
                expect(wrapper.vm.vendorFieldMaxLength).toBe(20);
            });
            it('should return default max length if network does not have vendorField max', function () {
                expect(wrapper.vm.vendorFieldMaxLength).toBe(VENDOR_FIELD.defaultMaxLength);
            });
        });
        describe('recipientWarning', function () {
            it('should return null if recipientId is not dirty', function () {
                expect(wrapper.vm.recipientWarning).toBe(null);
            });
            it('should return message for duplicate recipients', function () {
                wrapper.vm.$v.form.recipients.$model = [{
                        address: 'address-2',
                        amount: 10
                    }];
                wrapper.vm.$v.recipientId.$model = 'address-2';
                expect(wrapper.vm.recipientWarning).toBe('TRANSACTION.MULTI_PAYMENT.WARNING_DUPLICATE');
            });
        });
        describe('maximumRecipients', function () {
            it('should return default if no constants', function () {
                expect(wrapper.vm.maximumRecipients).toBe(500);
            });
            it('should return default if no network value', function () {
                var network = __assign(__assign({}, cloneDeep(globalNetwork)), { constants: {} });
                createWrapper(null, undefined, network);
                expect(wrapper.vm.maximumRecipients).toBe(500);
            });
            it('should return network constant', function () {
                var network = __assign(__assign({}, cloneDeep(globalNetwork)), { constants: {
                        multiPaymentLimit: 20
                    } });
                createWrapper(null, undefined, network);
                expect(wrapper.vm.maximumRecipients).toBe(20);
            });
        });
    });
    describe('watch', function () {
        it('should ensure available amount', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(wrapper.vm, 'ensureAvailableAmount');
                        wrapper.vm.wallet = {
                            balance: 0,
                            address: 'address-4',
                            passphrase: null
                        };
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(spy).toHaveBeenCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should check trigger recipient validation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(wrapper.vm.$v.recipientId, '$touch', 'get');
                        wrapper.vm.wallet = {
                            balance: 0,
                            address: 'address-4',
                            passphrase: null
                        };
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(spy).toHaveBeenCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('mounted hook', function () {
        it('should set wallet object', function () {
            expect(wrapper.vm.currentWallet).toBe(wrapper.vm.currentWallet);
            expect(wrapper.vm.wallet).toBe(wrapper.vm.currentWallet);
        });
    });
    describe('methods', function () {
        describe('getTransactionData', function () {
            it('should return correct data with passphrase for normal transaction', function () {
                wrapper.vm.$v.form.fee.$model = 0.1;
                wrapper.vm.$v.form.vendorField.$model = 'vendorfield test';
                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                wrapper.vm.$v.form.recipients.$model = [{
                        address: 'address-2',
                        amount: (1 * 1e8).toString()
                    }];
                wrapper.vm.$v.recipientId.$model = wrapper.vm.$v.form.recipients.$model[0].address;
                wrapper.vm.$v.amount.$model = wrapper.vm.$v.form.recipients.$model[0].amount;
                expect(wrapper.vm.getTransactionData()).toEqual({
                    address: 'address-1',
                    passphrase: 'passphrase',
                    recipientId: 'address-2',
                    amount: (1 * 1e8).toString(),
                    fee: new BigNumber(0.1 * 1e8),
                    vendorField: 'vendorfield test',
                    wif: undefined,
                    networkWif: 170,
                    networkId: 'network-1',
                    multiSignature: undefined
                });
            });
            it('should return correct data with passphrase for multipayment transaction', function () {
                wrapper.vm.$v.form.fee.$model = 0.1;
                wrapper.vm.$v.form.vendorField.$model = 'vendorfield test';
                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                wrapper.vm.$v.form.recipients.$model = [{
                        address: 'address-2',
                        amount: (1 * 1e8).toString()
                    }, {
                        address: 'address-3',
                        amount: (1 * 1e8).toString()
                    }];
                expect(wrapper.vm.getTransactionData()).toEqual({
                    address: 'address-1',
                    passphrase: 'passphrase',
                    recipients: [{
                            address: 'address-2',
                            amount: (1 * 1e8).toString()
                        }, {
                            address: 'address-3',
                            amount: (1 * 1e8).toString()
                        }],
                    fee: new BigNumber(0.1 * 1e8),
                    vendorField: 'vendorfield test',
                    wif: undefined,
                    networkWif: 170,
                    multiSignature: undefined
                });
            });
            it('should return correct data with passphrase and second passphrase', function () {
                createWrapper(null, {
                    address: 'address-1',
                    passphrase: null,
                    secondPublicKey: Identities.PublicKey.fromPassphrase('second passphrase')
                });
                wrapper.vm.$v.form.fee.$model = 0.1;
                wrapper.vm.$v.form.vendorField.$model = 'vendorfield test';
                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                wrapper.vm.$v.form.secondPassphrase.$model = 'second passphrase';
                wrapper.vm.$v.form.recipients.$model = [{
                        address: 'address-2',
                        amount: (1 * 1e8).toString()
                    }, {
                        address: 'address-3',
                        amount: (1 * 1e8).toString()
                    }];
                expect(wrapper.vm.getTransactionData()).toEqual({
                    address: 'address-1',
                    passphrase: 'passphrase',
                    secondPassphrase: 'second passphrase',
                    recipients: [{
                            address: 'address-2',
                            amount: (1 * 1e8).toString()
                        }, {
                            address: 'address-3',
                            amount: (1 * 1e8).toString()
                        }],
                    fee: new BigNumber(0.1 * 1e8),
                    vendorField: 'vendorfield test',
                    wif: undefined,
                    networkWif: 170,
                    multiSignature: undefined
                });
            });
        });
        describe('buildTransaction', function () {
            it('should build normal transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionData, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionData = {
                                type: 0,
                                typeGroup: 2
                            };
                            return [4 /*yield*/, wrapper.vm.buildTransaction(transactionData, true, true)];
                        case 1:
                            response = _a.sent();
                            expect(wrapper.vm.$client.buildTransfer).toHaveBeenCalledWith(transactionData, true, true);
                            expect(response).toBe(transactionData);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build multipayment transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionData, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.form.recipients.$model = [{
                                    address: 'address-2',
                                    amount: 10
                                }, {
                                    address: 'address-3',
                                    amount: 10
                                }];
                            transactionData = {
                                type: 6,
                                typeGroup: 1
                            };
                            return [4 /*yield*/, wrapper.vm.buildTransaction(transactionData, true, true)];
                        case 1:
                            response = _a.sent();
                            expect(wrapper.vm.$client.buildMultiPayment).toHaveBeenCalledWith(transactionData, true, true);
                            expect(response).toBe(transactionData);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build normal transaction with default arguments', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionData, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionData = {
                                type: 0,
                                typeGroup: 2
                            };
                            return [4 /*yield*/, wrapper.vm.buildTransaction(transactionData)];
                        case 1:
                            response = _a.sent();
                            expect(wrapper.vm.$client.buildTransfer).toHaveBeenCalledWith(transactionData, false, false);
                            expect(response).toBe(transactionData);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build multipayment transaction with default arguments', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionData, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.form.recipients.$model = [{
                                    address: 'address-2',
                                    amount: 10
                                }, {
                                    address: 'address-3',
                                    amount: 10
                                }];
                            transactionData = {
                                type: 6,
                                typeGroup: 1
                            };
                            return [4 /*yield*/, wrapper.vm.buildTransaction(transactionData)];
                        case 1:
                            response = _a.sent();
                            expect(wrapper.vm.$client.buildMultiPayment).toHaveBeenCalledWith(transactionData, false, false);
                            expect(response).toBe(transactionData);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('populateSchema', function () {
            it('should do nothing if no schema data', function () {
                var spy = jest.spyOn(wrapper.vm, '$set');
                wrapper.setProps({
                    schema: null
                });
                expect(spy).not.toHaveBeenCalled();
            });
            it('should load in schema form data', function () {
                wrapper.setProps({
                    schema: {
                        amount: (10 * 1e8).toString(),
                        address: 'address-5',
                        vendorField: 'test vendorfield'
                    }
                });
                wrapper.vm.populateSchema();
                expect(wrapper.vm.amount).toBe((10 * 1e8).toString());
                expect(wrapper.vm.recipientId).toBe('address-5');
                expect(wrapper.vm.form.vendorField).toBe('test vendorfield');
            });
            it('should load in schema wallet data', function () {
                var sessionProfileIdSpy = jest.spyOn(wrapper.vm.$store.getters, 'session/profileId', 'get');
                var ledgerConnectedSpy = jest.spyOn(wrapper.vm.$store.getters, 'ledger/isConnected', 'get');
                var ledgerWalletsSpy = jest.spyOn(wrapper.vm.$store.getters, 'ledger/wallets', 'get');
                var profileAllSpy = jest.spyOn(wrapper.vm.$store.getters, 'profile/all', 'get');
                wrapper.setProps({
                    schema: {
                        wallet: 'address-1'
                    }
                });
                wrapper.vm.$store.getters['profile/byId'].mockClear();
                wrapper.vm.$store.getters['network/byId'].mockClear();
                wrapper.vm.populateSchema();
                expect(sessionProfileIdSpy).toHaveBeenCalled();
                expect(ledgerConnectedSpy).toHaveBeenCalled();
                expect(ledgerWalletsSpy).toHaveBeenCalled();
                expect(profileAllSpy).toHaveBeenCalled();
                expect(wrapper.vm.$store.getters['wallet/byProfileId']).toHaveBeenCalledWith('profile-1');
                expect(wrapper.vm.$store.getters['wallet/byProfileId']).toHaveBeenCalledWith('profile-2');
                expect(wrapper.vm.$store.getters['profile/byId']).not.toHaveBeenCalled();
                expect(wrapper.vm.$store.getters['network/byId']).not.toHaveBeenCalled();
                expect(wrapper.vm.currentWallet).toBe(wrapper.vm.wallet_fromRoute);
            });
            it('should load data for network with nethash', function () {
                var sessionProfileIdSpy = jest.spyOn(wrapper.vm.$store.getters, 'session/profileId', 'get');
                var ledgerConnectedSpy = jest.spyOn(wrapper.vm.$store.getters, 'ledger/isConnected', 'get');
                var ledgerWalletsSpy = jest.spyOn(wrapper.vm.$store.getters, 'ledger/wallets', 'get');
                var profileAllSpy = jest.spyOn(wrapper.vm.$store.getters, 'profile/all', 'get');
                wrapper.setProps({
                    schema: {
                        wallet: 'address-1',
                        nethash: 'nethash-1'
                    }
                });
                wrapper.vm.$store.getters['profile/byId'].mockClear();
                wrapper.vm.$store.getters['network/byId'].mockClear();
                wrapper.vm.populateSchema();
                expect(sessionProfileIdSpy).toHaveBeenCalled();
                expect(ledgerConnectedSpy).toHaveBeenCalled();
                expect(ledgerWalletsSpy).toHaveBeenCalled();
                expect(profileAllSpy).toHaveBeenCalled();
                expect(wrapper.vm.$store.getters['wallet/byProfileId']).toHaveBeenCalledWith('profile-1');
                expect(wrapper.vm.$store.getters['wallet/byProfileId']).toHaveBeenCalledWith('profile-2');
                expect(wrapper.vm.$store.getters['profile/byId']).toHaveBeenCalledWith('profile-1');
                expect(wrapper.vm.$store.getters['network/byId']).toHaveBeenCalledWith('network-1');
                expect(wrapper.vm.currentWallet).toBe(wrapper.vm.wallet_fromRoute);
            });
            it('should check other profiles if no current profile', function () {
                var sessionProfileIdSpy = jest.spyOn(wrapper.vm.$store.getters, 'session/profileId', 'get').mockReturnValue(null);
                var ledgerConnectedSpy = jest.spyOn(wrapper.vm.$store.getters, 'ledger/isConnected', 'get');
                var ledgerWalletsSpy = jest.spyOn(wrapper.vm.$store.getters, 'ledger/wallets', 'get');
                var profileAllSpy = jest.spyOn(wrapper.vm.$store.getters, 'profile/all', 'get');
                wrapper.setProps({
                    schema: {
                        wallet: 'address-1',
                        nethash: 'nethash-1'
                    }
                });
                wrapper.vm.$store.getters['profile/byId'].mockClear();
                wrapper.vm.$store.getters['network/byId'].mockClear();
                wrapper.vm.populateSchema();
                expect(sessionProfileIdSpy).toHaveBeenCalled();
                expect(ledgerConnectedSpy).toHaveBeenCalled();
                expect(ledgerWalletsSpy).toHaveBeenCalled();
                expect(profileAllSpy).toHaveBeenCalled();
                expect(wrapper.vm.$store.getters['wallet/byProfileId']).toHaveBeenCalledWith('profile-1');
                expect(wrapper.vm.$store.getters['wallet/byProfileId']).toHaveBeenCalledWith('profile-2');
                expect(wrapper.vm.$store.getters['profile/byId']).not.toHaveBeenCalled();
                expect(wrapper.vm.$store.getters['network/byId']).toHaveBeenCalledWith('network-1');
                expect(wrapper.vm.currentWallet).toBe(wrapper.vm.wallet_fromRoute);
            });
            it('should error when no network', function () {
                var $tSpy = jest.spyOn(wrapper.vm, '$t');
                wrapper.setProps({
                    schema: {
                        wallet: 'address-1',
                        nethash: 'wrong nethash'
                    }
                });
                wrapper.vm.populateSchema();
                expect($tSpy).toHaveBeenCalledWith('TRANSACTION.ERROR.NETWORK_NOT_CONFIGURED');
                expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.NETWORK_NOT_CONFIGURED: wrong nethash');
                $tSpy.mockRestore();
            });
            it('should error when no wallets', function () {
                var $tSpy = jest.spyOn(wrapper.vm, '$t');
                wrapper.setProps({
                    schema: {
                        wallet: 'wrong address'
                    }
                });
                wrapper.vm.populateSchema();
                expect($tSpy).toHaveBeenCalledWith('TRANSACTION.ERROR.WALLET_NOT_IMPORTED');
                expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.WALLET_NOT_IMPORTED: wrong address');
                $tSpy.mockRestore();
            });
        });
        describe('transactionError', function () {
            it('should generate error for normal transaction', function () {
                wrapper.vm.transactionError();
                expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.TRANSFER');
            });
            it('should generate error for multipayment transaction', function () {
                wrapper.vm.$v.form.recipients.$model = [{
                        address: 'address-2',
                        amount: 10
                    }, {
                        address: 'address-3',
                        amount: 10
                    }];
                wrapper.vm.transactionError();
                expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.MULTI_PAYMENT');
            });
        });
        describe('emitNext', function () {
            it('should emit', function () {
                wrapper.vm.emitNext({
                    recipientId: 'address-2'
                });
                expect(wrapper.emitted('next')).toEqual([
                    [{
                            transaction: {
                                recipientId: 'address-2'
                            },
                            wallet: wrapper.vm.senderWallet
                        }]
                ]);
            });
            it('should emit with current wallet', function () {
                wrapper.vm.wallet = {
                    address: 'address-1'
                };
                wrapper.vm.emitNext({
                    recipientId: 'address-2'
                });
                expect(wrapper.emitted('next')).toEqual([
                    [{
                            transaction: {
                                recipientId: 'address-2'
                            },
                            wallet: {
                                address: 'address-1'
                            }
                        }]
                ]);
            });
        });
        describe('onFee', function () {
            it('should set fee in form', function () {
                wrapper.vm.onFee(20);
                expect(wrapper.vm.form.fee).toEqual(20);
            });
            it('should ensure amount is available', function () {
                var spy = jest.spyOn(wrapper.vm, 'ensureAvailableAmount').mockImplementation();
                wrapper.vm.onFee(20);
                expect(spy).toHaveBeenCalledTimes(1);
            });
        });
        describe('setSendAll', function () {
            it('should trigger send all', function () {
                var spy = jest.spyOn(wrapper.vm, 'confirmSendAll').mockImplementation();
                wrapper.vm.amount = 50;
                wrapper.vm.setSendAll(true);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(wrapper.vm.previousAmount).toEqual(50);
            });
            it('should trigger when disabled', function () {
                var spy = jest.spyOn(wrapper.vm, 'ensureAvailableAmount').mockImplementation();
                wrapper.vm.amount = 50;
                wrapper.vm.previousAmount = 50;
                wrapper.vm.setSendAll(false);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(wrapper.vm.amount).toEqual(50);
                expect(wrapper.vm.previousAmount).toEqual('');
                expect(wrapper.vm.isSendAllActive).toEqual(false);
            });
            it('should not update amount when disabled', function () {
                var spy = jest.spyOn(wrapper.vm, 'ensureAvailableAmount').mockImplementation();
                var spySet = jest.spyOn(wrapper.vm, '$set');
                wrapper.vm.amount = 10;
                wrapper.vm.previousAmount = 50;
                wrapper.vm.setSendAll(false, false);
                expect(spy).toHaveBeenCalled();
                expect(spySet).not.toHaveBeenCalled();
                expect(wrapper.vm.amount).toEqual(10);
                expect(wrapper.vm.previousAmount).toEqual('');
                expect(wrapper.vm.isSendAllActive).toEqual(false);
            });
        });
        describe('ensureAvailableAmount', function () {
            it('should set amount to max if send all is enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.amount = new BigNumber('999.9');
                            wrapper.vm.isSendAllActive = true;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            wrapper.vm.ensureAvailableAmount();
                            expect(wrapper.vm.isSendAllActive).toBe(true);
                            expect(wrapper.vm.canSendAll).toBe(true);
                            expect(wrapper.vm.amount).toEqual(new BigNumber('999.9'));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not set amount to max if send all is disabled', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spySet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spySet = jest.spyOn(wrapper.vm, '$set');
                            wrapper.vm.amount = 10;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            wrapper.vm.ensureAvailableAmount();
                            expect(spySet).not.toHaveBeenCalled();
                            expect(wrapper.vm.amount).toEqual(10);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('enableSendAll', function () {
            it('should force send all (for when modal is confirmed)', function () {
                var spy = jest.spyOn(wrapper.vm, 'ensureAvailableAmount');
                wrapper.vm.enableSendAll();
                expect(spy).toHaveBeenCalledTimes(1);
                expect(wrapper.vm.isSendAllActive).toBe(true);
                expect(wrapper.vm.showConfirmSendAll).toBe(false);
            });
        });
        describe('confirmSendAll', function () {
            it('should set to true (to show modal)', function () {
                wrapper.vm.confirmSendAll();
                expect(wrapper.vm.showConfirmSendAll).toBe(true);
            });
        });
        describe('cancelSendAll', function () {
            it('should set to false (to hide modal)', function () {
                wrapper.vm.cancelSendAll();
                expect(wrapper.vm.isSendAllActive).toBe(false);
                expect(wrapper.vm.showConfirmSendAll).toBe(false);
            });
        });
        describe('addRecipient', function () {
            it('should add current recipient to list', function () { return __awaiter(void 0, void 0, void 0, function () {
                var address;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            address = Identities.Address.fromPassphrase('passphrase');
                            wrapper.vm.$v.recipientId.$model = address;
                            wrapper.vm.$v.amount.$model = 100;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            wrapper.vm.addRecipient();
                            expect(wrapper.vm.$v.form.recipients.$model).toEqual([{
                                    address: address,
                                    amount: new BigNumber(100 * 1e8),
                                    sendAll: false
                                }]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should reset current recipient', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.recipientId.$model = Identities.Address.fromPassphrase('passphrase');
                            wrapper.vm.$v.amount.$model = 100;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            wrapper.vm.addRecipient();
                            expect(wrapper.vm.$v.recipientId.$model).toBe('');
                            expect(wrapper.vm.$v.amount.$model).toBe('');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should do nothing if invalid address', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            WalletService.validateAddress.mockReturnValue(false);
                            wrapper.vm.$v.recipientId.$model = 'invalid address';
                            wrapper.vm.$v.amount.$model = 100;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            wrapper.vm.addRecipient();
                            expect(wrapper.vm.$v.form.recipients.$model).toEqual([]);
                            WalletService.validateAddress.mockReturnValue(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should do nothing if invalid fee', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.recipientId.$model = Identities.Address.fromPassphrase('passphrase');
                            wrapper.vm.$v.amount.$model = '';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            wrapper.vm.addRecipient();
                            expect(wrapper.vm.$v.form.recipients.$model).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('emitRemoveRecipient', function () {
            it('should remove recipient at index', function () {
                wrapper.vm.$v.form.recipients.$model = [{
                        address: 'address-1',
                        amount: 10
                    }, {
                        address: 'address-2',
                        amount: 10
                    }, {
                        address: 'address-3',
                        amount: 10
                    }];
                wrapper.vm.emitRemoveRecipient(1);
                expect(wrapper.vm.$v.form.recipients.$model).toEqual([{
                        address: 'address-1',
                        amount: 10
                    }, {
                        address: 'address-3',
                        amount: 10
                    }]);
            });
            it('should do nothing if index does not exist', function () {
                var recipients = [{
                        address: 'address-1',
                        amount: 10
                    }, {
                        address: 'address-2',
                        amount: 10
                    }];
                wrapper.vm.$v.form.recipients.$model = recipients;
                wrapper.vm.emitRemoveRecipient(3);
                expect(wrapper.vm.$v.form.recipients.$model).toBe(recipients);
            });
        });
        describe('nextStep', function () {
            it('should submit form data', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    spy = jest.spyOn(wrapper.vm, 'onSubmit').mockImplementation();
                    wrapper.vm.nextStep();
                    expect(spy).toHaveBeenCalledTimes(0);
                    return [2 /*return*/];
                });
            }); });
        });
        describe('loadTransaction', function () {
            var $tSpy;
            beforeEach(function () {
                $tSpy = jest.spyOn(wrapper.vm, '$t');
            });
            afterEach(function () {
                $tSpy.mockRestore();
            });
            describe('when a valid JSON file is opened', function () {
                it('should display an error alert if the transaction has the wrong type', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                wrapper.vm.electron_readFile = jest.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, '{ "type": "1" }'];
                                    });
                                }); });
                                return [4 /*yield*/, wrapper.vm.loadTransaction()];
                            case 1:
                                _a.sent();
                                expect($tSpy).toHaveBeenCalledWith('VALIDATION.INVALID_TYPE');
                                expect($tSpy).toHaveBeenCalledWith('TRANSACTION.ERROR.LOAD_FROM_FILE');
                                expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.LOAD_FROM_FILE: VALIDATION.INVALID_TYPE');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should display an error alert if the recipient is on a different network', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                WalletService.validateAddress = jest.fn(function () { return false; });
                                wrapper.vm.electron_readFile = jest.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, '{ "type": "0", "recipientId": "AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm", "amount": "10" }'];
                                    });
                                }); });
                                return [4 /*yield*/, wrapper.vm.loadTransaction()];
                            case 1:
                                _a.sent();
                                expect($tSpy).toHaveBeenCalledWith('VALIDATION.RECIPIENT_DIFFERENT_NETWORK', [
                                    'AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm'
                                ]);
                                expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.LOAD_FROM_FILE: VALIDATION.RECIPIENT_DIFFERENT_NETWORK');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should set data from json', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var json;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                WalletService.validateAddress = jest.fn(function () { return true; });
                                json = JSON.stringify({
                                    type: 0,
                                    recipientId: 'AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm',
                                    fee: (0.1 * 1e8).toString(),
                                    amount: (20 * 1e8).toString(),
                                    vendorField: 'vendorfield test'
                                });
                                wrapper.vm.electron_readFile = jest.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, json];
                                    });
                                }); });
                                return [4 /*yield*/, wrapper.vm.loadTransaction()];
                            case 1:
                                _a.sent();
                                expect($tSpy).toHaveBeenCalledWith('TRANSACTION.SUCCESS.LOAD_FROM_FILE');
                                expect(wrapper.vm.$success).toHaveBeenCalledWith('TRANSACTION.SUCCESS.LOAD_FROM_FILE');
                                expect(wrapper.vm.recipientId).toEqual('AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm');
                                expect(wrapper.vm.amount).toEqual('20');
                                expect(wrapper.vm.form.fee).toEqual('0.1');
                                expect(wrapper.vm.form.vendorField).toEqual('vendorfield test');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should display a success alert', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var json;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                json = JSON.stringify({
                                    type: 0,
                                    recipientId: 'AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm',
                                    amount: (20 * 1e8).toString()
                                });
                                wrapper.vm.electron_readFile = jest.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, json];
                                    });
                                }); });
                                return [4 /*yield*/, wrapper.vm.loadTransaction()];
                            case 1:
                                _a.sent();
                                expect($tSpy).toHaveBeenCalledWith('TRANSACTION.SUCCESS.LOAD_FROM_FILE');
                                expect(wrapper.vm.$success).toHaveBeenCalledWith('TRANSACTION.SUCCESS.LOAD_FROM_FILE');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('when an invalid JSON file is opened', function () {
                it('should display an error alert', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                wrapper.vm.electron_readFile = jest.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, 'invalid json'];
                                    });
                                }); });
                                return [4 /*yield*/, wrapper.vm.loadTransaction()];
                            case 1:
                                _a.sent();
                                expect($tSpy).toHaveBeenCalledWith('TRANSACTION.ERROR.LOAD_FROM_FILE');
                                expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.LOAD_FROM_FILE: VALIDATION.INVALID_FORMAT');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should display an error alert when error thrown', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                wrapper.vm.electron_readFile = jest.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        throw new Error('invalid json');
                                    });
                                }); });
                                return [4 /*yield*/, wrapper.vm.loadTransaction()];
                            case 1:
                                _a.sent();
                                expect($tSpy).toHaveBeenCalledWith('TRANSACTION.ERROR.LOAD_FROM_FILE');
                                expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.LOAD_FROM_FILE: invalid json');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    });
    describe('validations', function () {
        describe('recipientId', function () {
            it('should be required if not set', function () {
                wrapper.vm.$v.recipientId.$model = '';
                expect(wrapper.vm.$v.recipientId.required).toBe(false);
            });
            it('should not be required if set', function () {
                wrapper.vm.$v.recipientId.$model = 'test';
                expect(wrapper.vm.$v.recipientId.required).toBe(true);
            });
            it('should not be valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            WalletService.validateAddress.mockReturnValue(false);
                            wrapper.vm.$v.recipientId.$model = 'test';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.$refs.recipient.$v.$invalid).toBe(true);
                            expect(wrapper.vm.$v.recipientId.isValid).toBe(false);
                            WalletService.validateAddress.mockReturnValue(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not be valid if no recipient field', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$refs.recipient = null;
                            wrapper.vm.$v.recipientId.$model = Identities.Address.fromPassphrase('passphrase');
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.$refs.recipient).toBe(null);
                            expect(wrapper.vm.$v.recipientId.isValid).toBe(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should be valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.recipientId.$model = Identities.Address.fromPassphrase('passphrase');
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.$refs.recipient.$v.$invalid).toBe(false);
                            expect(wrapper.vm.$v.recipientId.isValid).toBe(true);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('amount', function () {
            it('should be required if not set', function () {
                wrapper.vm.$v.amount.$model = '';
                expect(wrapper.vm.$v.amount.required).toBe(false);
            });
            it('should not be required if set', function () {
                wrapper.vm.$v.amount.$model = '10';
                expect(wrapper.vm.$v.amount.required).toBe(true);
            });
            it('should not be valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.amount.$model = 'test';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.$refs.amount.$v.$invalid).toBe(true);
                            expect(wrapper.vm.$v.amount.isValid).toBe(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not be valid if no amount field', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$refs.amount = null;
                            wrapper.vm.$v.amount.$model = 'test';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.$refs.amount).toBe(null);
                            expect(wrapper.vm.$v.amount.isValid).toBe(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should be valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.amount.$model = 10;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.$refs.amount.$v.$invalid).toBe(false);
                            expect(wrapper.vm.$v.amount.isValid).toBe(true);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('form', function () {
            describe('recipients', function () {
                it('should not be above minimum if not set', function () {
                    wrapper.vm.$v.form.recipients.$model = [];
                    expect(wrapper.vm.$v.form.recipients.aboveMinimum).toBe(false);
                });
                it('should be above minimum if set', function () {
                    wrapper.vm.$v.form.recipients.$model = [{
                            address: 'address-1',
                            amount: 10
                        }];
                    expect(wrapper.vm.$v.form.recipients.aboveMinimum).toBe(true);
                });
                it('should not be below or equal to maximum if too many', function () {
                    var network = __assign(__assign({}, cloneDeep(globalNetwork)), { constants: {
                            multiPaymentLimit: 2
                        } });
                    createWrapper(null, undefined, network);
                    wrapper.vm.$v.form.recipients.$model = [{
                            address: 'address-1',
                            amount: 10
                        }, {
                            address: 'address-1',
                            amount: 10
                        }, {
                            address: 'address-1',
                            amount: 10
                        }];
                    expect(wrapper.vm.$v.form.recipients.belowOrEqualMaximum).toBe(false);
                });
                it('should be below or equal to maximum if set', function () {
                    wrapper.vm.$v.form.recipients.$model = [{
                            address: 'address-1',
                            amount: 10
                        }];
                    expect(wrapper.vm.$v.form.recipients.belowOrEqualMaximum).toBe(true);
                });
            });
        });
    });
});
//# sourceMappingURL=TransactionFormTransfer.spec.js.map