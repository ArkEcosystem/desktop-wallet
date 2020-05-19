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
import { TransactionFormVote } from '@/components/Transaction/TransactionForm';
import CurrencyMixin from '@/mixins/currency';
import FormatterMixin from '@/mixins/formatter';
import BigNumber from '@/plugins/bignumber';
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
    knownWallets: {},
    constants: {
        activeDelegates: 51
    }
};
var wrapper;
var createWrapper = function (component, wallet, delegate) {
    component = component || TransactionFormVote;
    wallet = wallet || {
        address: 'address-1'
    };
    delegate = delegate || {
        username: 'delegate-1',
        publicKey: 'public-key-1',
        address: 'delegate-address-1',
        blocks: {
            produced: 10
        },
        production: {
            approval: 1.0
        },
        forged: {
            total: (10 * 1e8).toString()
        },
        voters: 10
    };
    if (!Object.keys(wallet).includes('passphrase')) {
        wallet.passphrase = null;
    }
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        sync: false,
        propsData: {
            delegate: delegate
        },
        mocks: {
            $client: {
                buildVote: jest.fn(function (transactionData) { return transactionData; }),
                fetchDelegateForged: jest.fn(function (delegate) { return delegate.forged.total; }),
                fetchDelegateVoters: jest.fn(function (delegate) { return delegate.voters; })
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
describe('TransactionFormVote', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should have vote transaction type', function () {
        expect(wrapper.vm.$options.transactionType).toBe(3);
    });
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionFormVote')).toBe(true);
        });
        it('should have delegate details', function () {
            expect(wrapper.vm.isPassphraseStep).toBe(false);
            expect(wrapper.find('.TransactionFormVote__delegate-details').props('isOpen')).toBe(true);
        });
        describe('passphrase step', function () {
            beforeEach(function () {
                wrapper.vm.isPassphraseStep = true;
            });
            it('should hide delegate details when choosing to vote', function () {
                expect(wrapper.find('.TransactionFormVote__delegate-details').props('isOpen')).toBe(false);
            });
            it('should have fee field', function () {
                expect(wrapper.contains('.TransactionFormVote__fee')).toBe(true);
            });
            it('should have hash field', function () {
                expect(wrapper.contains('.TransactionFormVote__fee')).toBe(true);
            });
            describe('ledger notice', function () {
                it('should show if wallet is a ledger', function () {
                    createWrapper(null, {
                        isLedger: true
                    });
                    expect(wrapper.contains('.TransactionFormVote__ledger-notice')).toBe(true);
                });
                it('should show if wallet is not a ledger', function () {
                    createWrapper(null, {
                        isLedger: false
                    });
                    expect(wrapper.contains('.TransactionFormVote__ledger-notice')).toBe(false);
                });
            });
            describe('password field', function () {
                it('should show if wallet does have a password', function () {
                    createWrapper(null, {
                        passphrase: 'password'
                    });
                    expect(wrapper.contains('.TransactionFormVote__password')).toBe(true);
                });
                it('should show if wallet does not have a password', function () {
                    expect(wrapper.contains('.TransactionFormVote__password')).toBe(false);
                });
            });
            describe('passphrase field', function () {
                it('should show if wallet does not have a password', function () {
                    expect(wrapper.contains('.TransactionFormVote__passphrase')).toBe(true);
                });
                it('should not show if wallet does have a password', function () {
                    createWrapper(null, {
                        passphrase: 'password'
                    });
                    expect(wrapper.contains('.TransactionFormVote__passphrase')).toBe(false);
                });
            });
            describe('next button', function () {
                it('should be enabled if form is valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                wrapper.vm.$v.form.fee.$model = (0.1 * 1e8).toString();
                                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                                return [4 /*yield*/, wrapper.vm.$nextTick()];
                            case 1:
                                _a.sent();
                                expect(wrapper.find('.TransactionFormVote__next').attributes('disabled')).toBeFalsy();
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
                                expect(wrapper.find('.TransactionFormVote__next').attributes('disabled')).toBe('disabled');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    });
    describe('computed', function () {
        describe('blocksProduced', function () {
            it('should return blocks produced for delegate', function () {
                expect(wrapper.vm.blocksProduced).toBe(10);
            });
            it('should return 0 if no delegate', function () {
                wrapper.setProps({
                    delegate: {
                        blocks: null
                    }
                });
                expect(wrapper.vm.blocksProduced).toBe(0);
                wrapper.setProps({
                    delegate: {
                        blocks: {
                            produced: null
                        },
                        production: {
                            approval: 1.0
                        }
                    }
                });
                expect(wrapper.vm.blocksProduced).toBe(0);
            });
        });
        describe('showVoteUnvoteButton', function () {
            it('should return false if wallet is a contact', function () {
                createWrapper(null, {
                    isContact: true
                });
                expect(wrapper.vm.showVoteUnvoteButton).toBe(false);
            });
            it('should return false if wallet is voting but not for delegate', function () {
                wrapper.setProps({
                    isVoter: false,
                    votedDelegate: {
                        username: 'delegate-2',
                        publicKey: 'public-key-2',
                        address: 'delegate-address-2',
                        blocks: {
                            produced: 10
                        },
                        production: {
                            approval: 1.0
                        },
                        forged: {
                            total: '0'
                        },
                        voters: 10
                    }
                });
                expect(wrapper.vm.showVoteUnvoteButton).toBe(false);
            });
            it('should return true if not voting', function () {
                wrapper.setProps({
                    votedDelegate: null
                });
                expect(wrapper.vm.showVoteUnvoteButton).toBe(true);
            });
            it('should return true if voting for this delegate', function () {
                wrapper.setProps({
                    isVoter: true,
                    votedDelegate: {
                        username: 'delegate-1',
                        publicKey: 'public-key-1',
                        address: 'delegate-address-1',
                        blocks: {
                            produced: 10
                        },
                        production: {
                            approval: 1.0
                        },
                        forged: {
                            total: '0'
                        },
                        voters: 10
                    }
                });
                expect(wrapper.vm.showVoteUnvoteButton).toBe(true);
            });
        });
        describe('showCurrentlyVoting', function () {
            it('should return true if voting for a different delegate', function () {
                wrapper.setProps({
                    isVoter: false,
                    votedDelegate: {
                        username: 'delegate-2',
                        publicKey: 'public-key-2',
                        address: 'delegate-address-2',
                        blocks: {
                            produced: 10
                        },
                        production: {
                            approval: 1.0
                        },
                        forged: {
                            total: '0'
                        },
                        voters: 10
                    }
                });
                expect(wrapper.vm.showCurrentlyVoting).toBe(true);
            });
        });
    });
    describe('watch', function () {
        describe('isPassphraseStep', function () {
            it('should do nothing if ledger wallet', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            createWrapper(null, {
                                isLedger: true,
                                get passphrase() {
                                    return null;
                                }
                            });
                            spy = jest.spyOn(wrapper.vm.currentWallet, 'passphrase', 'get');
                            wrapper.vm.isPassphraseStep = true;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(spy).not.toHaveBeenCalled();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should do nothing if multi-signature', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            createWrapper(null, {
                                multiSignature: true,
                                get passphrase() {
                                    return null;
                                }
                            });
                            spy = jest.spyOn(wrapper.vm.currentWallet, 'passphrase', 'get');
                            wrapper.vm.isPassphraseStep = true;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(spy).not.toHaveBeenCalled();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should focus on password field', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            createWrapper(null, {
                                passphrase: 'password'
                            });
                            spy = jest.spyOn(wrapper.vm.$refs.password, 'focus');
                            wrapper.vm.isPassphraseStep = true;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(spy).toHaveBeenCalledTimes(1);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should focus on passphrase field', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(wrapper.vm.$refs.passphrase, 'focus');
                            wrapper.vm.isPassphraseStep = true;
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
    describe('mounted hook', function () {
        it('should fetch delegate data', function () {
            var fetchForgedOriginal = TransactionFormVote.methods.fetchForged;
            var fetchVotersOriginal = TransactionFormVote.methods.fetchVoters;
            TransactionFormVote.methods.fetchForged = jest.fn();
            TransactionFormVote.methods.fetchVoters = jest.fn();
            createWrapper();
            expect(TransactionFormVote.methods.fetchForged).toHaveBeenCalledTimes(1);
            expect(TransactionFormVote.methods.fetchVoters).toHaveBeenCalledTimes(1);
            TransactionFormVote.methods.fetchForged = fetchForgedOriginal;
            TransactionFormVote.methods.fetchVoters = fetchVotersOriginal;
        });
    });
    describe('methods', function () {
        describe('getTransactionData', function () {
            it('should return correct data with passphrase', function () {
                wrapper.vm.$v.form.fee.$model = 0.1;
                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                expect(wrapper.vm.getTransactionData()).toEqual({
                    address: 'address-1',
                    passphrase: 'passphrase',
                    votes: [
                        '+public-key-1'
                    ],
                    fee: new BigNumber(0.1 * 1e8),
                    wif: undefined,
                    networkWif: 170,
                    multiSignature: undefined
                });
            });
            it('should return correct data when unvoting with passphrase', function () {
                wrapper.setProps({
                    isVoter: true
                });
                wrapper.vm.$v.form.fee.$model = 0.1;
                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                expect(wrapper.vm.getTransactionData()).toEqual({
                    address: 'address-1',
                    passphrase: 'passphrase',
                    votes: [
                        '-public-key-1'
                    ],
                    fee: new BigNumber(0.1 * 1e8),
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
                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                wrapper.vm.$v.form.secondPassphrase.$model = 'second passphrase';
                expect(wrapper.vm.getTransactionData()).toEqual({
                    address: 'address-1',
                    passphrase: 'passphrase',
                    secondPassphrase: 'second passphrase',
                    votes: [
                        '+public-key-1'
                    ],
                    fee: new BigNumber(0.1 * 1e8),
                    wif: undefined,
                    networkWif: 170,
                    multiSignature: undefined
                });
            });
        });
        describe('buildTransaction', function () {
            it('should build vote', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                            expect(wrapper.vm.$client.buildVote).toHaveBeenCalledWith(transactionData, true, true);
                            expect(response).toBe(transactionData);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build vote with default arguments', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                            expect(wrapper.vm.$client.buildVote).toHaveBeenCalledWith(transactionData, false, false);
                            expect(response).toBe(transactionData);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('transactionError', function () {
            it('should generate transaction error', function () {
                wrapper.vm.transactionError();
                expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.VOTE');
            });
        });
        describe('postSubmit', function () {
            it('should call reset method', function () {
                var spy = jest.spyOn(wrapper.vm, 'reset');
                wrapper.vm.postSubmit();
                expect(spy).toHaveBeenCalledTimes(1);
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
        describe('fetchForged', function () {
            it('should update forged value', function () {
                wrapper.vm.fetchForged();
                expect(wrapper.vm.forged).toEqual('ARK 10.00');
            });
        });
        describe('fetchVoters', function () {
            it('should update voters value', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, wrapper.vm.fetchVoters()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.voters).toEqual(10);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should update voters value to default if no response', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            jest.spyOn(wrapper.vm.$client, 'fetchDelegateVoters').mockReturnValue(null);
                            return [4 /*yield*/, wrapper.vm.fetchVoters()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.voters).toEqual('0');
                            return [2 /*return*/];
                    }
                });
            }); });
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
        describe('emitCancel', function () {
            it('should emit cancel', function () {
                wrapper.vm.emitCancel();
                expect(wrapper.emitted('cancel')).toEqual([['navigateToTransactions']]);
            });
        });
    });
});
//# sourceMappingURL=TransactionFormVote.spec.js.map