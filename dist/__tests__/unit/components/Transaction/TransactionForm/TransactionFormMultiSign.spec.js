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
import installI18n from '../../../__utils__/i18n';
import { TransactionFormMultiSign } from '@/components/Transaction/TransactionForm';
import CurrencyMixin from '@/mixins/currency';
var localVue = createLocalVue();
localVue.use(Vuelidate);
var i18n = installI18n(localVue);
var network = {
    token: 'ARK',
    version: 23,
    wif: 170,
    market: {
        enabled: false
    }
};
var wrapper;
var createWrapper = function (component, wallet, transaction) {
    component = component || TransactionFormMultiSign;
    wallet = wallet || {
        address: 'address-1',
        publicKey: 'public-key-1'
    };
    transaction = transaction || {
        amount: (1 * 1e8).toString(),
        fee: (0.1 * 1e8).toString(),
        recipientId: 'recipient-address',
        vendorField: 'test vendorField'
    };
    if (!Object.keys(wallet).includes('passphrase')) {
        wallet.passphrase = null;
    }
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        sync: false,
        propsData: {
            transaction: transaction
        },
        mocks: {
            $client: {
                multiSign: jest.fn(function (transaction) { return transaction; })
            },
            $error: jest.fn(),
            $store: {
                getters: {
                    'transaction/staticFee': jest.fn(function () { return null; }),
                    'session/lastFeeByType': jest.fn(function () { return (1 * 1e8).toString(); }),
                    'session/network': network,
                    'network/byToken': jest.fn(function () { return (network); })
                }
            },
            $synchronizer: {
                appendFocus: jest.fn()
            },
            session_network: network,
            currency_format: jest.fn(CurrencyMixin.methods.currency_format),
            currency_subToUnit: jest.fn(CurrencyMixin.methods.currency_subToUnit),
            currency_toBuilder: jest.fn(CurrencyMixin.methods.currency_toBuilder),
            currency_unitToSub: jest.fn(CurrencyMixin.methods.currency_unitToSub),
            wallet_formatAddress: jest.fn(function (address) { return "formatted-" + address; }),
            wallet_fromRoute: wallet
        },
        stubs: {
            Portal: true
        }
    });
};
describe('TransactionFormMultiSign', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should have multisign transaction type - placeholder', function () {
        expect(wrapper.vm.$options.transactionType).toBe(-1);
    });
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionFormMultiSign')).toBe(true);
        });
        describe('ledger notice', function () {
            it('should show if wallet is a ledger', function () {
                createWrapper(null, {
                    isLedger: true
                });
                expect(wrapper.contains('.TransactionFormMultiSign__ledger-notice')).toBe(true);
            });
            it('should show if wallet is not a ledger', function () {
                createWrapper(null, {
                    isLedger: false
                });
                expect(wrapper.contains('.TransactionFormMultiSign__ledger-notice')).toBe(false);
            });
        });
        describe('password field', function () {
            it('should show if wallet does have a password', function () {
                createWrapper(null, {
                    passphrase: 'password'
                });
                expect(wrapper.contains('.TransactionFormMultiSign__password')).toBe(true);
            });
            it('should show if wallet does not have a password', function () {
                expect(wrapper.contains('.TransactionFormMultiSign__password')).toBe(false);
            });
        });
        describe('passphrase field', function () {
            it('should show if wallet does not have a password', function () {
                expect(wrapper.contains('.TransactionFormMultiSign__passphrase')).toBe(true);
            });
            it('should not show if wallet does have a password', function () {
                createWrapper(null, {
                    passphrase: 'password'
                });
                expect(wrapper.contains('.TransactionFormMultiSign__passphrase')).toBe(false);
            });
        });
        describe('next button', function () {
            it('should be enabled if form is valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.find('.TransactionFormMultiSign__next').attributes('disabled')).toBeFalsy();
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
                            expect(wrapper.find('.TransactionFormMultiSign__next').attributes('disabled')).toBe('disabled');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('methods', function () {
        describe('getTransactionData', function () {
            it('should return correct data with passphrase', function () {
                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                expect(wrapper.vm.getTransactionData()).toEqual({
                    publicKey: 'public-key-1',
                    passphrase: 'passphrase',
                    wif: undefined,
                    networkWif: 170,
                    multiSignature: undefined
                });
            });
            it('should return correct data with passphrase and second passphrase', function () {
                createWrapper(null, {
                    publicKey: 'public-key-1',
                    passphrase: null,
                    secondPublicKey: Identities.PublicKey.fromPassphrase('second passphrase')
                });
                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                wrapper.vm.$v.form.secondPassphrase.$model = 'second passphrase';
                expect(wrapper.vm.getTransactionData()).toEqual({
                    publicKey: 'public-key-1',
                    passphrase: 'passphrase',
                    secondPassphrase: 'second passphrase',
                    wif: undefined,
                    networkWif: 170,
                    multiSignature: undefined
                });
            });
        });
        describe('buildTransaction', function () {
            it('should build signed transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transaction, transactionData, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transaction = {
                                type: 0,
                                amount: 10,
                                fee: 0.1
                            };
                            transactionData = {
                                type: 0,
                                typeGroup: 1
                            };
                            wrapper.setProps({
                                transaction: transaction
                            });
                            return [4 /*yield*/, wrapper.vm.buildTransaction(transactionData)];
                        case 1:
                            response = _a.sent();
                            expect(wrapper.vm.$client.multiSign).toHaveBeenCalledWith(transaction, transactionData);
                            expect(response).toBe(transaction);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('transactionError', function () {
            it('should generate transaction error', function () {
                wrapper.vm.transactionError();
                expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.MULTI_SIGN');
            });
        });
    });
});
//# sourceMappingURL=TransactionFormMultiSign.spec.js.map