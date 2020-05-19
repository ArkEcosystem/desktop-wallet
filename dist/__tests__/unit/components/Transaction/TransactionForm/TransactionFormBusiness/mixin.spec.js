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
import installI18n from '../../../../__utils__/i18n';
import TransactionFormBusinessRegistration from '@/components/Transaction/TransactionForm/TransactionFormBusiness/TransactionFormBusinessRegistration';
import TransactionFormBusinessUpdate from '@/components/Transaction/TransactionForm/TransactionFormBusiness/TransactionFormBusinessUpdate';
import CurrencyMixin from '@/mixins/currency';
import StringMixin from '@/mixins/strings';
import BigNumber from '@/plugins/bignumber';
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
/* eslint-disable-next-line camelcase */
var createWrapper = function (component, wallet_fromRoute) {
    /* eslint-disable-next-line camelcase */
    wallet_fromRoute = wallet_fromRoute || {
        address: 'address-1',
        passphrase: null
    };
    if (component.name === 'TransactionFormBusinessUpdate' && !wallet_fromRoute.business) {
        wallet_fromRoute.business = {
            name: 'business',
            website: 'https://ark.io',
            vat: 'GB12345678',
            repository: 'https://github.com/arkecosystem/desktop-wallet.git'
        };
    }
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        sync: false,
        mixins: [StringMixin],
        mocks: {
            $client: {
                buildBusinessRegistration: jest.fn(function (transactionData) { return transactionData; }),
                buildBusinessUpdate: jest.fn(function (transactionData) { return transactionData; })
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
            wallet_fromRoute: wallet_fromRoute
        }
    });
};
describe.each([
    ['TransactionFormBusinessRegistration', TransactionFormBusinessRegistration],
    ['TransactionFormBusinessUpdate', TransactionFormBusinessUpdate]
])('%s', function (componentName, component) {
    beforeEach(function () {
        createWrapper(component);
    });
    it('should have magistrate transaction group', function () {
        expect(wrapper.vm.$options.transactionGroup).toBe(2);
    });
    it('should have correct transaction type', function () {
        if (componentName === 'TransactionFormBusinessRegistration') {
            expect(wrapper.vm.$options.transactionType).toBe(0);
        }
        else {
            expect(wrapper.vm.$options.transactionType).toBe(2);
        }
    });
    describe('data', function () {
        it('should create form object', function () {
            expect(Object.keys(wrapper.vm.form)).toEqual([
                'fee',
                'passphrase',
                'walletPassword',
                'asset'
            ]);
            expect(Object.keys(wrapper.vm.form.asset)).toEqual([
                'name',
                'website',
                'vat',
                'repository'
            ]);
        });
    });
    if (componentName === 'TransactionFormBusinessUpdate') {
        describe('mounted hook', function () {
            it('should load business into form', function () {
                expect(wrapper.vm.form.asset).toEqual({
                    name: 'business',
                    website: 'https://ark.io',
                    vat: 'GB12345678',
                    repository: 'https://github.com/arkecosystem/desktop-wallet.git'
                });
            });
        });
    }
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionFormBusiness')).toBe(true);
        });
        it('should have name field', function () {
            expect(wrapper.contains('.TransactionFormBusiness__name')).toBe(true);
        });
        it('should have website field', function () {
            expect(wrapper.contains('.TransactionFormBusiness__website')).toBe(true);
        });
        it('should have vat field', function () {
            expect(wrapper.contains('.TransactionFormBusiness__vat')).toBe(true);
        });
        it('should have repository field', function () {
            expect(wrapper.contains('.TransactionFormBusiness__repository')).toBe(true);
        });
        it('should have fee field', function () {
            expect(wrapper.contains('.TransactionFormBusiness__fee')).toBe(true);
        });
        describe('ledger notice', function () {
            it('should show if wallet is a ledger', function () {
                createWrapper(component, {
                    isLedger: true
                });
                expect(wrapper.contains('.TransactionFormBusiness__ledger-notice')).toBe(true);
            });
            it('should show if wallet is not a ledger', function () {
                createWrapper(component, {
                    isLedger: false
                });
                expect(wrapper.contains('.TransactionFormBusiness__ledger-notice')).toBe(false);
            });
        });
        describe('password field', function () {
            it('should show if wallet does have a password', function () {
                createWrapper(component, {
                    passphrase: 'password'
                });
                expect(wrapper.contains('.TransactionFormBusiness__password')).toBe(true);
            });
            it('should show if wallet does not have a password', function () {
                expect(wrapper.contains('.TransactionFormBusiness__password')).toBe(false);
            });
        });
        describe('passphrase field', function () {
            it('should show if wallet does not have a password', function () {
                expect(wrapper.contains('.TransactionFormBusiness__passphrase')).toBe(true);
            });
            it('should not show if wallet does have a password', function () {
                createWrapper(component, {
                    passphrase: 'password'
                });
                expect(wrapper.contains('.TransactionFormBusiness__passphrase')).toBe(false);
            });
        });
        describe('next button', function () {
            it('should be enabled if form is valid', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.form.fee.$model = (0.1 * 1e8).toString();
                            wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                            wrapper.vm.$v.form.asset.name.$model = 'new business';
                            wrapper.vm.$v.form.asset.website.$model = 'https://ark.io';
                            wrapper.vm.$v.form.asset.vat.$model = 'GB12345678';
                            wrapper.vm.$v.form.asset.repository.$model = 'https://github.com/arkecosystem/desktop-wallet.git';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.find('.TransactionFormBusiness__next').attributes('disabled')).toBeFalsy();
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
                            expect(wrapper.find('.TransactionFormBusiness__next').attributes('disabled')).toBe('disabled');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('computed', function () {
        describe('nameLabel', function () {
            it('should be formatted', function () {
                expect(wrapper.vm.nameLabel).toBe('WALLET_BUSINESS.NAME - VALIDATION.MAX_LENGTH');
            });
        });
        describe('nameError', function () {
            it('should return null if valid', function () {
                wrapper.vm.$v.form.asset.name.$model = 'test';
                expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(false);
                expect(wrapper.vm.nameError).toBe(null);
            });
            it('should return null if not dirty', function () {
                wrapper.vm.$v.form.asset.name.$model = '';
                wrapper.vm.$v.form.asset.name.$reset();
                expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(false);
                expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(true);
                expect(wrapper.vm.nameError).toBe(null);
            });
            it('should return required if empty', function () {
                wrapper.vm.$v.form.asset.name.$model = '';
                expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(true);
                expect(wrapper.vm.nameError).toBe('VALIDATION.REQUIRED');
            });
            it('should not return error if shorter than max (40)', function () {
                wrapper.vm.$v.form.asset.name.$model = ''.padStart(30, 'a');
                expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(false);
                expect(wrapper.vm.nameError).not.toBe('VALIDATION.TOO_LONG');
            });
            it('should not return error if equal to max (40)', function () {
                wrapper.vm.$v.form.asset.name.$model = ''.padStart(40, 'a');
                expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(false);
                expect(wrapper.vm.nameError).not.toBe('VALIDATION.TOO_LONG');
            });
            it('should return error if longer than max (40)', function () {
                wrapper.vm.$v.form.asset.name.$model = ''.padStart(50, 'a');
                expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(true);
                expect(wrapper.vm.nameError).toBe('VALIDATION.TOO_LONG');
            });
            it('should not return error if valid', function () {
                wrapper.vm.$v.form.asset.name.$model = 'test';
                expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(false);
                expect(wrapper.vm.nameError).not.toBe('VALIDATION.NOT_VALID');
            });
            it('should return error if invalid', function () {
                wrapper.vm.$v.form.asset.name.$model = '$ARK';
                expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(true);
                expect(wrapper.vm.nameError).toBe('VALIDATION.NOT_VALID');
            });
        });
        describe('websiteError', function () {
            it('should return null if valid', function () {
                wrapper.vm.$v.form.asset.website.$model = 'http://ark.io';
                expect(wrapper.vm.$v.form.asset.website.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.website.$invalid).toBe(false);
                expect(wrapper.vm.websiteError).toBe(null);
            });
            it('should return null if not dirty', function () {
                wrapper.vm.$v.form.asset.website.$model = '';
                wrapper.vm.$v.form.asset.website.$reset();
                expect(wrapper.vm.$v.form.asset.website.$dirty).toBe(false);
                expect(wrapper.vm.$v.form.asset.website.$invalid).toBe(true);
                expect(wrapper.vm.websiteError).toBe(null);
            });
            it('should return required if empty', function () {
                wrapper.vm.$v.form.asset.website.$model = '';
                expect(wrapper.vm.$v.form.asset.website.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.website.$invalid).toBe(true);
                expect(wrapper.vm.websiteError).toBe('VALIDATION.REQUIRED');
            });
            it('should not return error if valid', function () {
                wrapper.vm.$v.form.asset.website.$model = 'https://ark.io:4003';
                expect(wrapper.vm.$v.form.asset.website.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.website.$invalid).toBe(false);
                expect(wrapper.vm.websiteError).not.toBe('VALIDATION.INVALID_URL');
            });
            it('should return error if invalid', function () {
                wrapper.vm.$v.form.asset.website.$model = 'http://ark';
                expect(wrapper.vm.$v.form.asset.website.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.website.$invalid).toBe(true);
                expect(wrapper.vm.websiteError).toBe('VALIDATION.INVALID_URL');
            });
        });
        describe('vatLabel', function () {
            it('should be formatted', function () {
                expect(wrapper.vm.vatLabel).toBe('WALLET_BUSINESS.VAT - VALIDATION.MIN_LENGTH VALIDATION.MAX_LENGTH');
            });
        });
        describe('vatError', function () {
            it('should return null if valid', function () {
                wrapper.vm.$v.form.asset.vat.$model = 'GB12345678';
                expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(false);
                expect(wrapper.vm.vatError).toBe(null);
            });
            it('should return null if not dirty', function () {
                if (componentName === 'TransactionFormBusinessRegistration') {
                    wrapper.vm.$v.form.asset.vat.$model = '';
                    wrapper.vm.$v.form.asset.vat.$reset();
                    expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(false);
                    expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(false);
                    expect(wrapper.vm.vatError).toBe(null);
                }
            });
            it('should return null if empty as not required', function () {
                if (componentName === 'TransactionFormBusinessRegistration') {
                    wrapper.vm.$v.form.asset.vat.$model = '';
                    expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true);
                    expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(false);
                    expect(wrapper.vm.vatError).toBe(null);
                }
            });
            it('should not return error if shorter than max (15)', function () {
                wrapper.vm.$v.form.asset.vat.$model = ''.padStart(10, '-');
                expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(false);
                expect(wrapper.vm.vatError).not.toBe('VALIDATION.TOO_LONG');
            });
            it('should not return error if equal to max (15)', function () {
                wrapper.vm.$v.form.asset.vat.$model = ''.padStart(15, '-');
                expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(false);
                expect(wrapper.vm.vatError).not.toBe('VALIDATION.TOO_LONG');
            });
            it('should not return error if longer than min (8)', function () {
                wrapper.vm.$v.form.asset.vat.$model = ''.padStart(10, '-');
                expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(false);
                expect(wrapper.vm.vatError).not.toBe('VALIDATION.TOO_SHORT');
            });
            it('should not return error if equal to min (8)', function () {
                wrapper.vm.$v.form.asset.vat.$model = ''.padStart(15, '-');
                expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(false);
                expect(wrapper.vm.vatError).not.toBe('VALIDATION.TOO_SHORT');
            });
            it('should return error if longer than max (40)', function () {
                wrapper.vm.$v.form.asset.vat.$model = ''.padStart(50, '-');
                expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(true);
                expect(wrapper.vm.vatError).toBe('VALIDATION.TOO_LONG');
            });
            it('should return error if shorter than min (8)', function () {
                wrapper.vm.$v.form.asset.vat.$model = ''.padStart(5, '-');
                expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(true);
                expect(wrapper.vm.vatError).toBe('VALIDATION.TOO_SHORT');
            });
            it('should not return error if valid', function () {
                wrapper.vm.$v.form.asset.vat.$model = 'GB12345678';
                expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(false);
                expect(wrapper.vm.vatError).not.toBe('VALIDATION.NOT_VALID');
            });
        });
        describe('repositoryLabel', function () {
            it('should be formatted', function () {
                expect(wrapper.vm.repositoryLabel).toBe('WALLET_BUSINESS.REPOSITORY - VALIDATION.MIN_LENGTH');
            });
        });
        describe('repositoryError', function () {
            it('should return null if valid', function () {
                wrapper.vm.$v.form.asset.repository.$model = 'https://github.com/arkecosystem/desktop-wallet.git';
                expect(wrapper.vm.$v.form.asset.repository.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.repository.$invalid).toBe(false);
                expect(wrapper.vm.repositoryError).toBe(null);
            });
            it('should return null if not dirty', function () {
                if (componentName === 'TransactionFormBusinessRegistration') {
                    wrapper.vm.$v.form.asset.repository.$model = '';
                    wrapper.vm.$v.form.asset.repository.$reset();
                    expect(wrapper.vm.$v.form.asset.repository.$dirty).toBe(false);
                    expect(wrapper.vm.$v.form.asset.repository.$invalid).toBe(false);
                    expect(wrapper.vm.repositoryError).toBe(null);
                }
            });
            it('should not return error if longer than min (12)', function () {
                wrapper.vm.$v.form.asset.repository.$model = 'http://github.com';
                expect(wrapper.vm.$v.form.asset.repository.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.repository.$invalid).toBe(false);
                expect(wrapper.vm.repositoryError).not.toBe('VALIDATION.TOO_SHORT');
            });
            it('should not return error if equal to min (12)', function () {
                wrapper.vm.$v.form.asset.repository.$model = 'http://g.com';
                expect(wrapper.vm.$v.form.asset.repository.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.repository.$invalid).toBe(false);
                expect(wrapper.vm.repositoryError).not.toBe('VALIDATION.TOO_SHORT');
            });
            it('should return error if shorter than min (12)', function () {
                wrapper.vm.$v.form.asset.repository.$model = 'ftp://g.co';
                expect(wrapper.vm.$v.form.asset.repository.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.repository.$invalid).toBe(true);
                expect(wrapper.vm.repositoryError).toBe('VALIDATION.TOO_SHORT');
            });
            it('should not return error if valid', function () {
                wrapper.vm.$v.form.asset.repository.$model = 'https://github.com/arkecosystem/desktop-wallet.git';
                expect(wrapper.vm.$v.form.asset.repository.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.repository.$invalid).toBe(false);
                expect(wrapper.vm.repositoryError).not.toBe('VALIDATION.INVALID_URL');
            });
            it('should return error if invalid', function () {
                wrapper.vm.$v.form.asset.repository.$model = 'https://github/arkecosystem/desktop-wallet.git';
                expect(wrapper.vm.$v.form.asset.repository.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.repository.$invalid).toBe(true);
                expect(wrapper.vm.repositoryError).toBe('VALIDATION.INVALID_URL');
            });
        });
    });
    describe('methods', function () {
        describe('getTransactionData', function () {
            it('should return correct data with passphrase', function () {
                wrapper.vm.$v.form.fee.$model = 0.1;
                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                wrapper.vm.$v.form.asset.name.$model = 'business';
                wrapper.vm.$v.form.asset.website.$model = 'https://ark.io';
                wrapper.vm.$v.form.asset.vat.$model = 'GB12345678';
                wrapper.vm.$v.form.asset.repository.$model = 'https://github.com/arkecosystem/desktop-wallet.git';
                var expectedAsset = {
                    name: 'business',
                    website: 'https://ark.io',
                    vat: 'GB12345678',
                    repository: 'https://github.com/arkecosystem/desktop-wallet.git'
                };
                if (componentName === 'TransactionFormBusinessUpdate') {
                    expectedAsset = {};
                }
                expect(wrapper.vm.getTransactionData()).toEqual({
                    address: 'address-1',
                    asset: expectedAsset,
                    passphrase: 'passphrase',
                    fee: new BigNumber(0.1 * 1e8),
                    wif: undefined,
                    networkWif: 170,
                    multiSignature: undefined
                });
            });
            it('should return correct data with passphrase and second passphrase', function () {
                createWrapper(component, {
                    address: 'address-1',
                    passphrase: null,
                    secondPublicKey: Identities.PublicKey.fromPassphrase('second passphrase')
                });
                wrapper.vm.$v.form.fee.$model = 0.1;
                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                wrapper.vm.$v.form.secondPassphrase.$model = 'second passphrase';
                wrapper.vm.$v.form.asset.name.$model = 'business';
                wrapper.vm.$v.form.asset.website.$model = 'https://ark.io';
                wrapper.vm.$v.form.asset.vat.$model = 'GB12345678';
                wrapper.vm.$v.form.asset.repository.$model = 'https://github.com/arkecosystem/desktop-wallet.git';
                var expectedAsset = {
                    name: 'business',
                    website: 'https://ark.io',
                    vat: 'GB12345678',
                    repository: 'https://github.com/arkecosystem/desktop-wallet.git'
                };
                if (componentName === 'TransactionFormBusinessUpdate') {
                    expectedAsset = {};
                }
                expect(wrapper.vm.getTransactionData()).toEqual({
                    address: 'address-1',
                    asset: expectedAsset,
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
            it('should build business update', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionData, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionData = {
                                type: 2,
                                typeGroup: 2
                            };
                            return [4 /*yield*/, wrapper.vm.buildTransaction(transactionData, true, true)];
                        case 1:
                            response = _a.sent();
                            if (componentName === 'TransactionFormBusinessRegistration') {
                                expect(wrapper.vm.$client.buildBusinessRegistration).toHaveBeenCalledWith(transactionData, true, true);
                            }
                            else {
                                expect(wrapper.vm.$client.buildBusinessUpdate).toHaveBeenCalledWith(transactionData, true, true);
                            }
                            expect(response).toBe(transactionData);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build business update with default arguments', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionData, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionData = {
                                type: 2,
                                typeGroup: 2
                            };
                            return [4 /*yield*/, wrapper.vm.buildTransaction(transactionData)];
                        case 1:
                            response = _a.sent();
                            if (componentName === 'TransactionFormBusinessRegistration') {
                                expect(wrapper.vm.$client.buildBusinessRegistration).toHaveBeenCalledWith(transactionData, false, false);
                            }
                            else {
                                expect(wrapper.vm.$client.buildBusinessUpdate).toHaveBeenCalledWith(transactionData, false, false);
                            }
                            expect(response).toBe(transactionData);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('transactionError', function () {
            it('should generate transaction error', function () {
                wrapper.vm.transactionError();
                if (componentName === 'TransactionFormBusinessRegistration') {
                    expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.BUSINESS_REGISTRATION');
                }
                else {
                    expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.BUSINESS_UPDATE');
                }
            });
        });
    });
});
//# sourceMappingURL=mixin.spec.js.map