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
import Vuelidate from 'vuelidate';
import installI18n from '../../../__utils__/i18n';
import { TransactionFormSecondSignature } from '@/components/Transaction/TransactionForm';
import CurrencyMixin from '@/mixins/currency';
import FormatterMixin from '@/mixins/formatter';
import BigNumber from '@/plugins/bignumber';
import WalletService from '@/services/wallet';
var localVue = createLocalVue();
localVue.use(Vuelidate);
var i18n = installI18n(localVue);
var network = {
    token: 'ARK',
    symbol: 'ARK',
    fractionDigits: 8,
    version: 23,
    wif: 170,
    market: {
        enabled: false
    },
    knownWallets: {}
};
var wrapper;
var createWrapper = function (component, wallet) {
    component = component || TransactionFormSecondSignature;
    wallet = wallet || {
        address: 'address-1',
        secondPublicKey: false
    };
    if (!Object.keys(wallet).includes('passphrase')) {
        wallet.passphrase = null;
    }
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        sync: false,
        mocks: {
            $client: {
                buildSecondSignatureRegistration: jest.fn(function (transactionData) { return transactionData; })
            },
            $error: jest.fn(),
            $store: {
                getters: {
                    'transaction/staticFee': jest.fn(function () { return null; }),
                    'session/lastFeeByType': jest.fn(function () { return (1 * 1e8).toString(); }),
                    'session/network': network,
                    'network/byToken': jest.fn(function () { return network; })
                }
            },
            $synchronizer: {
                appendFocus: jest.fn()
            },
            session_profile: {
                bip39Language: 'EN'
            },
            session_network: network,
            currency_format: jest.fn(CurrencyMixin.methods.currency_format),
            currency_subToUnit: jest.fn(CurrencyMixin.methods.currency_subToUnit),
            currency_toBuilder: jest.fn(CurrencyMixin.methods.currency_toBuilder),
            currency_unitToSub: jest.fn(CurrencyMixin.methods.currency_unitToSub),
            formatter_percentage: jest.fn(FormatterMixin.methods.formatter_percentage),
            wallet_formatAddress: jest.fn(function (address) { return "formatted-" + address; }),
            wallet_fromRoute: wallet
        },
        stubs: {
            Portal: true
        }
    });
};
describe('TransactionFormSecondSignature', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should have second signature transaction type', function () {
        expect(wrapper.vm.$options.transactionType).toBe(1);
    });
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionFormSecondSignature')).toBe(true);
        });
        describe('step 1', function () {
            it('should have step 1', function () {
                expect(wrapper.vm.isPassphraseStep).toBe(false);
                expect(wrapper.find('.TransactionFormSecondSignature__step-1').props('isOpen')).toBe(true);
            });
            it('should have passphrase words', function () {
                expect(wrapper.vm.isPassphraseStep).toBe(false);
                expect(wrapper.contains('.TransactionFormSecondSignature__passphrase-words')).toBe(true);
            });
            it('should have next button', function () {
                expect(wrapper.vm.isPassphraseStep).toBe(false);
                expect(wrapper.contains('.TransactionFormSecondSignature__step-1__next')).toBe(true);
            });
        });
        describe('passphrase step', function () {
            beforeEach(function () {
                wrapper.vm.isPassphraseStep = true;
            });
            it('should hide passphrase words when on passphrase step', function () {
                expect(wrapper.find('.TransactionFormSecondSignature__step-1').props('isOpen')).toBe(false);
            });
            it('should have passphrase verification field', function () {
                expect(wrapper.contains('.TransactionFormSecondSignature__passphrase-verification')).toBe(true);
            });
            it('should have fee field', function () {
                expect(wrapper.contains('.TransactionFormSecondSignature__fee')).toBe(true);
            });
            describe('ledger notice', function () {
                it('should show if wallet is a ledger', function () {
                    createWrapper(null, {
                        isLedger: true
                    });
                    expect(wrapper.contains('.TransactionFormSecondSignature__ledger-notice')).toBe(true);
                });
                it('should show if wallet is not a ledger', function () {
                    createWrapper(null, {
                        isLedger: false
                    });
                    expect(wrapper.contains('.TransactionFormSecondSignature__ledger-notice')).toBe(false);
                });
            });
            describe('password field', function () {
                it('should show if wallet does have a password', function () {
                    createWrapper(null, {
                        passphrase: 'password'
                    });
                    expect(wrapper.contains('.TransactionFormSecondSignature__password')).toBe(true);
                });
                it('should show if wallet does not have a password', function () {
                    expect(wrapper.contains('.TransactionFormSecondSignature__password')).toBe(false);
                });
            });
            describe('passphrase field', function () {
                it('should show if wallet does not have a password', function () {
                    expect(wrapper.contains('.TransactionFormSecondSignature__passphrase')).toBe(true);
                });
                it('should not show if wallet does have a password', function () {
                    createWrapper(null, {
                        passphrase: 'password'
                    });
                    expect(wrapper.contains('.TransactionFormSecondSignature__passphrase')).toBe(false);
                });
            });
            it('should have back button', function () {
                expect(wrapper.contains('.TransactionFormSecondSignature__back')).toBe(true);
            });
            describe('next button', function () {
                it('should be enabled if form is valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                wrapper.vm.$v.form.fee.$model = (0.1 * 1e8).toString();
                                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                                wrapper.vm.isPassphraseVerified = true;
                                return [4 /*yield*/, wrapper.vm.$nextTick()];
                            case 1:
                                _a.sent();
                                expect(wrapper.find('.TransactionFormSecondSignature__step-2__next').attributes('disabled')).toBeFalsy();
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
                                expect(wrapper.find('.TransactionFormSecondSignature__step-2__next').attributes('disabled')).toBe('disabled');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    });
    describe('computed', function () {
        describe('wordPositions', function () {
            it('should return required word permissions', function () {
                expect(wrapper.vm.wordPositions).toEqual([3, 6, 9]);
            });
        });
        describe('passphraseWords', function () {
            it('should split passphrase by space', function () {
                wrapper.vm.secondPassphrase = 'this is a passphrase';
                expect(wrapper.vm.passphraseWords).toEqual([
                    'this',
                    'is',
                    'a',
                    'passphrase'
                ]);
            });
            it('should split japanese passphrase by japanese space', function () {
                wrapper.vm.secondPassphrase = 'this\u3000is\u3000a\u3000passphrase';
                expect(wrapper.vm.passphraseWords).toEqual([
                    'this',
                    'is',
                    'a',
                    'passphrase'
                ]);
            });
        });
    });
    describe('watch', function () {
        describe('isPassphraseStep', function () {
            it('should focus on passphrase verification if passphrase step', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(wrapper.vm.$refs.passphraseVerification, 'focusFirst');
                            wrapper.vm.isPassphraseStep = true;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(spy).toHaveBeenCalled();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not focus on passphrase verification if not passphrase step', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.isPassphraseStep = true;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            spy = jest.spyOn(wrapper.vm.$refs.passphraseVerification, 'focusFirst');
                            wrapper.vm.isPassphraseStep = false;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 2:
                            _a.sent();
                            expect(spy).not.toHaveBeenCalled();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('created hook', function () {
        it('should generate second passphrase', function () {
            WalletService.generateSecondPassphrase.mockClear();
            createWrapper();
            expect(WalletService.generateSecondPassphrase).toHaveBeenNthCalledWith(1, 'EN');
        });
    });
    describe('methods', function () {
        describe('getTransactionData', function () {
            it('should return correct data with passphrase and second passphrase', function () {
                createWrapper(null, {
                    address: 'address-1',
                    passphrase: null
                });
                wrapper.vm.$v.form.fee.$model = 0.1;
                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                wrapper.vm.secondPassphrase = 'second passphrase';
                expect(wrapper.vm.getTransactionData()).toEqual({
                    address: 'address-1',
                    passphrase: 'passphrase',
                    secondPassphrase: 'second passphrase',
                    fee: new BigNumber(0.1 * 1e8),
                    wif: undefined,
                    networkWif: 170,
                    multiSignature: undefined
                });
            });
        });
        describe('buildTransaction', function () {
            it('should build second signature', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionData, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionData = {
                                type: 5,
                                typeGroup: 1
                            };
                            return [4 /*yield*/, wrapper.vm.buildTransaction(transactionData, true, true)];
                        case 1:
                            response = _a.sent();
                            expect(wrapper.vm.$client.buildSecondSignatureRegistration).toHaveBeenCalledWith(transactionData, true, true);
                            expect(response).toBe(transactionData);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build second signature with default arguments', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionData, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionData = {
                                type: 7,
                                typeGroup: 1
                            };
                            return [4 /*yield*/, wrapper.vm.buildTransaction(transactionData)];
                        case 1:
                            response = _a.sent();
                            expect(wrapper.vm.$client.buildSecondSignatureRegistration).toHaveBeenCalledWith(transactionData, false, false);
                            expect(response).toBe(transactionData);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('transactionError', function () {
            it('should generate transaction error', function () {
                wrapper.vm.transactionError();
                expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.SECOND_SIGNATURE');
            });
        });
        describe('postSubmit', function () {
            it('should call reset method', function () {
                var spy = jest.spyOn(wrapper.vm, 'reset');
                wrapper.vm.postSubmit();
                expect(spy).toHaveBeenCalledTimes(1);
            });
            it('should set password verified to true', function () {
                wrapper.vm.isPassphraseVerified = false;
                wrapper.vm.postSubmit();
                expect(wrapper.vm.isPassphraseVerified).toBe(true);
            });
        });
        describe('toggleStep', function () {
            it('should toggle passphrase step', function () {
                expect(wrapper.vm.isPassphraseStep).toBe(false);
                wrapper.vm.toggleStep();
                expect(wrapper.vm.isPassphraseStep).toBe(true);
                wrapper.vm.toggleStep();
                expect(wrapper.vm.isPassphraseStep).toBe(false);
            });
        });
        describe('displayPassphraseWords', function () {
            it('should toggle generating and show passphrase', function (done) {
                wrapper.vm.displayPassphraseWords();
                expect(wrapper.vm.isGenerating).toBe(true);
                setTimeout(function () {
                    expect(wrapper.vm.isGenerating).toBe(false);
                    expect(wrapper.vm.showPassphraseWords).toBe(true);
                    done();
                }, 301);
            });
        });
        describe('generateNewPassphrase', function () {
            it('should call reset method', function () {
                var spy = jest.spyOn(wrapper.vm, 'reset');
                wrapper.vm.generateNewPassphrase();
                expect(spy).toHaveBeenCalledTimes(1);
            });
            it('should toggle generating and show passphrase', function (done) {
                WalletService.generateSecondPassphrase.mockClear();
                wrapper.vm.generateNewPassphrase();
                expect(wrapper.vm.isGenerating).toBe(true);
                setTimeout(function () {
                    expect(wrapper.vm.isGenerating).toBe(false);
                    expect(WalletService.generateSecondPassphrase).toHaveBeenNthCalledWith(1, 'EN');
                    done();
                }, 301);
            });
        });
        describe('onVerification', function () {
            it('should set password verified', function () {
                wrapper.vm.isPassphraseVerified = false;
                wrapper.vm.onVerification();
                expect(wrapper.vm.isPassphraseVerified).toBe(true);
            });
        });
        describe('reset', function () {
            it('should reset to delegate detail view', function () {
                wrapper.vm.isPassphraseStep = true;
                expect(wrapper.vm.isPassphraseStep).toBe(true);
                wrapper.vm.reset();
                expect(wrapper.vm.isPassphraseStep).toBe(false);
            });
            it('should reset passphrase field if not encrypted or ledger', function () {
                var spy = jest.spyOn(wrapper.vm, '$set');
                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                expect(wrapper.vm.$v.form.passphrase.$dirty).toBe(true);
                expect(wrapper.vm.form.passphrase).toBe('passphrase');
                wrapper.vm.reset();
                expect(wrapper.vm.$v.form.passphrase.$dirty).toBe(false);
                expect(wrapper.vm.form.passphrase).toBe('');
                expect(spy).toHaveBeenCalledWith(wrapper.vm.form, 'passphrase', '');
            });
            it('should reset password field if encrypted and not ledger', function () {
                createWrapper(null, {
                    passphrase: 'password'
                });
                var spy = jest.spyOn(wrapper.vm, '$set');
                wrapper.vm.$v.form.walletPassword.$model = 'password';
                expect(wrapper.vm.$v.form.walletPassword.$dirty).toBe(true);
                expect(wrapper.vm.form.walletPassword).toBe('password');
                wrapper.vm.reset();
                expect(wrapper.vm.$v.form.walletPassword.$dirty).toBe(false);
                expect(wrapper.vm.form.walletPassword).toBe('');
                expect(spy).toHaveBeenCalledWith(wrapper.vm.form, 'walletPassword', '');
            });
            it('should do nothing if ledger', function () {
                createWrapper(null, {
                    isLedger: true
                });
                var spy = jest.spyOn(wrapper.vm, '$set');
                wrapper.vm.reset();
                expect(spy).not.toHaveBeenCalled();
            });
            it('should do nothing if multi-signature wallet', function () {
                createWrapper(null, {
                    multiSignature: true
                });
                var spy = jest.spyOn(wrapper.vm, '$set');
                wrapper.vm.reset();
                expect(spy).not.toHaveBeenCalled();
            });
        });
    });
});
//# sourceMappingURL=TransactionFormSecondSignature.spec.js.map