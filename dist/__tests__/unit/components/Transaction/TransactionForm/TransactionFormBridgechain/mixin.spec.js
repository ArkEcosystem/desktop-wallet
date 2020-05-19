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
import TransactionFormBridgechainRegistration from '@/components/Transaction/TransactionForm/TransactionFormBridgechain/TransactionFormBridgechainRegistration';
import TransactionFormBridgechainUpdate from '@/components/Transaction/TransactionForm/TransactionFormBridgechain/TransactionFormBridgechainUpdate';
import CurrencyMixin from '@/mixins/currency';
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
var createWrapper = function (component, wallet, bridgechain) {
    wallet = wallet || {
        address: 'address-1',
        passphrase: null
    };
    if (component.name === 'TransactionFormBridgechainUpdate' && !wallet.business) {
        wallet.business = {
            name: 'business',
            website: 'https://ark.io',
            vat: 'GB12345678',
            repository: 'https://github.com/arkecosystem/desktop-wallet.git'
        };
    }
    if (component.name === 'TransactionFormBridgechainUpdate' && bridgechain === undefined) {
        bridgechain = {
            name: 'bridgechain',
            seedNodes: [
                '1.1.1.1',
                '2.2.2.2'
            ],
            ports: {
                '@arkecosystem/core-api': 4003
            },
            genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
            bridgechainRepository: 'https://github.com/arkecosystem/core.git',
            bridgechainAssetRepository: 'https://github.com/arkecosystem/core-assets.git'
        };
    }
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        sync: false,
        propsData: {
            bridgechain: bridgechain
        },
        mocks: {
            $client: {
                buildBridgechainRegistration: jest.fn(function (transactionData) { return transactionData; }),
                buildBridgechainUpdate: jest.fn(function (transactionData) { return transactionData; })
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
        }
    });
};
describe.each([
    ['TransactionFormBridgechainRegistration', TransactionFormBridgechainRegistration],
    ['TransactionFormBridgechainUpdate', TransactionFormBridgechainUpdate]
])('%s', function (componentName, component) {
    beforeEach(function () {
        createWrapper(component);
    });
    it('should have magistrate transaction group', function () {
        expect(wrapper.vm.$options.transactionGroup).toBe(2);
    });
    it('should have correct transaction type', function () {
        if (componentName === 'TransactionFormBridgechainRegistration') {
            expect(wrapper.vm.$options.transactionType).toBe(3);
        }
        else {
            expect(wrapper.vm.$options.transactionType).toBe(5);
        }
    });
    describe('data', function () {
        it('should create form object', function () {
            expect(Object.keys(wrapper.vm.form)).toEqual([
                'fee',
                'passphrase',
                'walletPassword',
                'apiPort',
                'seedNodes',
                'asset'
            ]);
            expect(Object.keys(wrapper.vm.form.asset)).toEqual([
                'name',
                'ports',
                'genesisHash',
                'bridgechainRepository',
                'bridgechainAssetRepository'
            ]);
        });
    });
    if (componentName === 'TransactionFormBridgechainUpdate') {
        describe('mounted hook', function () {
            it('should load bridgechain into form', function () {
                createWrapper(component, null, {
                    genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
                    ports: {
                        '@arkecosystem/core-api': 8081
                    },
                    seedNodes: [
                        '5.5.5.5',
                        '6.6.6.6'
                    ],
                    bridgechainRepository: '',
                    bridgechainAssetRepository: ''
                });
                expect(wrapper.vm.form.apiPort).toBe(8081);
                expect(wrapper.vm.form.seedNodes).toEqual([
                    { ip: '5.5.5.5', isInvalid: false },
                    { ip: '6.6.6.6', isInvalid: false }
                ]);
                expect(wrapper.vm.form.asset).toEqual({
                    name: '',
                    ports: {},
                    genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
                    bridgechainRepository: '',
                    bridgechainAssetRepository: ''
                });
            });
            it('should use default api port if not provided', function () {
                createWrapper(component, null, {
                    genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
                    ports: {},
                    seedNodes: [
                        '5.5.5.5',
                        '6.6.6.6'
                    ],
                    bridgechainRepository: '',
                    bridgechainAssetRepository: ''
                });
                expect(wrapper.vm.form.apiPort).toBe(4003);
                expect(wrapper.vm.form.seedNodes).toEqual([
                    { ip: '5.5.5.5', isInvalid: false },
                    { ip: '6.6.6.6', isInvalid: false }
                ]);
                expect(wrapper.vm.form.asset).toEqual({
                    name: '',
                    ports: {},
                    genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
                    bridgechainRepository: '',
                    bridgechainAssetRepository: ''
                });
            });
        });
    }
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionFormBridgechain')).toBe(true);
        });
        describe('step 1', function () {
            it('should have seed node field', function () {
                expect(wrapper.contains('.TransactionFormBridgechain__seed-node')).toBe(true);
            });
            it('should have add button', function () {
                expect(wrapper.contains('.TransactionFormBridgechain__add')).toBe(true);
            });
            it('should have seed nodes list', function () {
                expect(wrapper.contains('.TransactionFormBridgechain__seed-nodes')).toBe(true);
            });
        });
        describe('step 2', function () {
            beforeEach(function () {
                wrapper.vm.step = 2;
            });
            if (componentName === 'TransactionFormBridgechainRegistration') {
                describe('registration', function () {
                    it('should have name field', function () {
                        expect(wrapper.contains('.TransactionFormBridgechain__name')).toBe(true);
                    });
                    it('should have genesis hash field', function () {
                        expect(wrapper.contains('.TransactionFormBridgechain__genesis-hash')).toBe(true);
                    });
                });
            }
            else {
                describe('update', function () {
                    it('should not have name field', function () {
                        expect(wrapper.contains('.TransactionFormBridgechain__name')).toBe(false);
                    });
                    it('should not have genesis hash field', function () {
                        expect(wrapper.contains('.TransactionFormBridgechain__genesis-hash')).toBe(false);
                    });
                });
            }
            it('should have bridgechain repository field', function () {
                expect(wrapper.contains('.TransactionFormBridgechain__bridgechain-repository')).toBe(true);
            });
            it('should have bridgechain asset repository field', function () {
                expect(wrapper.contains('.TransactionFormBridgechain__bridgechain-asset-repository')).toBe(true);
            });
            it('should have api port field', function () {
                expect(wrapper.contains('.TransactionFormBridgechain__api-port')).toBe(true);
            });
            it('should have fee field', function () {
                expect(wrapper.contains('.TransactionFormBridgechain__fee')).toBe(true);
            });
            describe('ledger notice', function () {
                it('should show if wallet is a ledger', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                createWrapper(component, {
                                    isLedger: true
                                });
                                wrapper.vm.step = 2;
                                return [4 /*yield*/, wrapper.vm.$nextTick()];
                            case 1:
                                _a.sent();
                                expect(wrapper.contains('.TransactionFormBridgechain__ledger-notice')).toBe(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should show if wallet is not a ledger', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                createWrapper(component, {
                                    isLedger: false
                                });
                                wrapper.vm.step = 2;
                                return [4 /*yield*/, wrapper.vm.$nextTick()];
                            case 1:
                                _a.sent();
                                expect(wrapper.contains('.TransactionFormBridgechain__ledger-notice')).toBe(false);
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
                                createWrapper(component, {
                                    passphrase: 'password'
                                });
                                wrapper.vm.step = 2;
                                return [4 /*yield*/, wrapper.vm.$nextTick()];
                            case 1:
                                _a.sent();
                                expect(wrapper.contains('.TransactionFormBridgechain__password')).toBe(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should show if wallet does not have a password', function () {
                    expect(wrapper.contains('.TransactionFormBridgechain__password')).toBe(false);
                });
            });
            describe('passphrase field', function () {
                it('should show if wallet does not have a password', function () {
                    expect(wrapper.contains('.TransactionFormBridgechain__passphrase')).toBe(true);
                });
                it('should not show if wallet does have a password', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                createWrapper(component, {
                                    passphrase: 'password'
                                });
                                wrapper.vm.step = 2;
                                return [4 /*yield*/, wrapper.vm.$nextTick()];
                            case 1:
                                _a.sent();
                                expect(wrapper.contains('.TransactionFormBridgechain__passphrase')).toBe(false);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
        describe('prev button', function () {
            it('should be enabled if form is on step 2', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.step = 2;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.find('.TransactionFormBridgechain__prev').attributes('disabled')).toBeFalsy();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should be disabled if form is on step 1', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.step = 1;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.find('.TransactionFormBridgechain__prev').attributes('disabled')).toBe('disabled');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('next button', function () {
            it('should be enabled if seed nodes is valid on step 1', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.step = 1;
                            wrapper.vm.$v.form.seedNodes.$model = [
                                { ip: '1.1.1.1', isInvalid: false }
                            ];
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.find('.TransactionFormBridgechain__next').attributes('disabled')).toBeFalsy();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should be enabled if form is valid on step 2', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.step = 2;
                            wrapper.vm.$v.form.fee.$model = (0.1 * 1e8).toString();
                            wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                            wrapper.vm.$v.form.asset.name.$model = 'bridgechain';
                            wrapper.vm.$v.form.asset.genesisHash.$model = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867';
                            wrapper.vm.form.asset.ports = {
                                '@arkecosystem/core-api': 4003
                            };
                            wrapper.vm.$v.form.seedNodes.$model = [
                                { ip: '1.1.1.1', isInvalid: false }
                            ];
                            wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'https://github.com/arkecosystem/core.git';
                            wrapper.vm.$v.form.asset.bridgechainAssetRepository.$model = 'https://github.com/arkecosystem/core-assets.git';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.find('.TransactionFormBridgechain__next').attributes('disabled')).toBeFalsy();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should be disabled if seed nodes is invalid on step 1', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.step = 1;
                            wrapper.vm.$v.form.seedNodes.$model = [];
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.find('.TransactionFormBridgechain__next').attributes('disabled')).toBe('disabled');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should be disabled if form is invalid on step 2', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.step = 2;
                            wrapper.vm.$v.form.seedNodes.$model = [];
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.find('.TransactionFormBridgechain__next').attributes('disabled')).toBe('disabled');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('computed', function () {
        describe('isUpdate', function () {
            if (componentName === 'TransactionFormBridgechainRegistration') {
                describe('TransactionFormBridgechainRegistration', function () {
                    it('should return false if bridgechain prop is set', function () {
                        wrapper.setProps({
                            bridgechain: {
                                name: 'bridgechain',
                                seedNodes: [
                                    '1.1.1.1',
                                    '2.2.2.2'
                                ],
                                ports: {
                                    '@arkecosystem/core-api': 4003
                                },
                                genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
                                bridgechainRepository: 'https://github.com/arkecosystem/core.git',
                                bridgechainAssetRepository: 'https://github.com/arkecosystem/core-assets.git'
                            }
                        });
                        expect(wrapper.vm.isUpdate).toBe(false);
                    });
                    it('should return false if bridgechain prop is not set', function () {
                        wrapper.setProps({
                            bridgechain: null
                        });
                        expect(wrapper.vm.isUpdate).toBe(false);
                    });
                });
            }
            else {
                describe('TransactionFormBridgechainUpdate', function () {
                    it('should return true if bridgechain prop is set', function () {
                        wrapper.setProps({
                            bridgechain: {
                                name: 'bridgechain',
                                seedNodes: [
                                    '1.1.1.1',
                                    '2.2.2.2'
                                ],
                                ports: {
                                    '@arkecosystem/core-api': 4003
                                },
                                genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
                                bridgechainRepository: 'https://github.com/arkecosystem/core.git',
                                bridgechainAssetRepository: 'https://github.com/arkecosystem/core-assets.git'
                            }
                        });
                        expect(wrapper.vm.isUpdate).toBe(true);
                    });
                    it('should return false if bridgechain prop is not set', function () {
                        wrapper.setProps({
                            bridgechain: null
                        });
                        expect(wrapper.vm.isUpdate).toBe(false);
                    });
                });
            }
        });
        describe('isFormValid', function () {
            it('should be true if seed nodes is valid on step 1', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.step = 1;
                            wrapper.vm.$v.form.seedNodes.$model = [
                                { ip: '1.1.1.1', isInvalid: false }
                            ];
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.isFormValid).toBe(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should be true if form is valid on step 2', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.step = 2;
                            wrapper.vm.$v.form.fee.$model = (0.1 * 1e8).toString();
                            wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                            wrapper.vm.$v.form.asset.name.$model = 'bridgechain';
                            wrapper.vm.$v.form.asset.genesisHash.$model = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867';
                            wrapper.vm.form.asset.ports = {
                                '@arkecosystem/core-api': 4003
                            };
                            wrapper.vm.$v.form.seedNodes.$model = [
                                { ip: '1.1.1.1', isInvalid: false }
                            ];
                            wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'https://github.com/arkecosystem/core.git';
                            wrapper.vm.$v.form.asset.bridgechainAssetRepository.$model = 'https://github.com/arkecosystem/core-assets.git';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.isFormValid).toBe(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should be false if seed nodes is invalid on step 1', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.step = 1;
                            wrapper.vm.$v.form.seedNodes.$model = [];
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.isFormValid).toBe(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should be false if form is invalid on step 2', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.step = 2;
                            wrapper.vm.$v.form.seedNodes.$model = [];
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.isFormValid).toBe(false);
                            return [2 /*return*/];
                    }
                });
            }); });
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
                if (componentName === 'TransactionFormBridgechainRegistration') {
                    expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(true);
                }
                else {
                    expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(false);
                }
                expect(wrapper.vm.nameError).toBe(null);
            });
            if (componentName === 'TransactionFormBridgechainRegistration') {
                describe('TransactionFormBridgechainRegistration', function () {
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
            }
        });
        describe('seedNodeDisabled', function () {
            it('should be false if seed node not empty and no error', function () {
                wrapper.vm.$v.seedNode.$model = '5.5.5.5';
                expect(wrapper.vm.seedNodeDisabled).toBe(false);
            });
            it('should be true if seed node is empty', function () {
                wrapper.vm.$v.seedNode.$model = '';
                expect(wrapper.vm.seedNodeDisabled).toBe(true);
            });
            it('should be true if seed node is invalid', function () {
                wrapper.vm.$v.seedNode.$model = 'invalid seed node';
                expect(wrapper.vm.seedNodeDisabled).toBe(true);
            });
        });
        describe('hasSeedNodesError', function () {
            it('should be true if there is an invalid seed node', function () {
                wrapper.vm.invalidSeeds = [
                    { ip: '0.5.5.5', isInvalid: true }
                ];
                expect(wrapper.vm.hasSeedNodesError).toBe(true);
            });
            it('should be false if there are less than maximum seed nodes', function () {
                wrapper.vm.$v.form.seedNodes.$model = [
                    { ip: '0.5.5.5', isInvalid: false }
                ];
                expect(wrapper.vm.hasSeedNodesError).toBe(false);
            });
            it('should be true if there are more than maximum seed nodes', function () {
                wrapper.vm.$v.form.seedNodes.$model = [
                    { ip: '0.5.5.5', isInvalid: false },
                    { ip: '1.5.5.5', isInvalid: false },
                    { ip: '2.5.5.5', isInvalid: false },
                    { ip: '3.5.5.5', isInvalid: false },
                    { ip: '4.5.5.5', isInvalid: false },
                    { ip: '5.5.5.5', isInvalid: false },
                    { ip: '6.5.5.5', isInvalid: false },
                    { ip: '7.5.5.5', isInvalid: false },
                    { ip: '8.5.5.5', isInvalid: false },
                    { ip: '9.5.5.5', isInvalid: false },
                    { ip: '10.5.5.5', isInvalid: false }
                ];
                expect(wrapper.vm.hasSeedNodesError).toBe(true);
            });
        });
        describe('seedNodeError', function () {
            it('should return null if valid', function () {
                wrapper.vm.$v.seedNode.$model = '5.5.5.5';
                expect(wrapper.vm.$v.seedNode.$dirty).toBe(true);
                expect(wrapper.vm.$v.seedNode.$invalid).toBe(false);
                expect(wrapper.vm.seedNodeError).toBe(null);
            });
            it('should return null if not dirty', function () {
                wrapper.vm.$v.seedNode.$model = '';
                wrapper.vm.$v.seedNode.$reset();
                expect(wrapper.vm.$v.seedNode.$dirty).toBe(false);
                expect(wrapper.vm.$v.seedNode.$invalid).toBe(false);
                expect(wrapper.vm.seedNodeError).toBe(null);
            });
            it('should return error if invalid', function () {
                wrapper.vm.$v.seedNode.$model = 'invalid seed node';
                expect(wrapper.vm.$v.seedNode.$dirty).toBe(true);
                expect(wrapper.vm.$v.seedNode.$invalid).toBe(true);
                expect(wrapper.vm.seedNodeError).toBe('VALIDATION.INVALID_SEED');
            });
            it('should return error if duplicate', function () {
                wrapper.vm.$v.form.seedNodes.$model = [
                    { ip: '5.5.5.5', isInvalid: false }
                ];
                wrapper.vm.$v.seedNode.$model = '5.5.5.5';
                expect(wrapper.vm.$v.seedNode.$dirty).toBe(true);
                expect(wrapper.vm.$v.seedNode.$invalid).toBe(true);
                expect(wrapper.vm.seedNodeError).toBe('TRANSACTION.BRIDGECHAIN.ERROR_DUPLICATE');
            });
        });
        describe('genesisHashError', function () {
            it('should return null if valid', function () {
                wrapper.vm.$v.form.asset.genesisHash.$model = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867';
                expect(wrapper.vm.$v.form.asset.genesisHash.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.genesisHash.$invalid).toBe(false);
                expect(wrapper.vm.genesisHashError).toBe(null);
            });
            it('should return null if not dirty', function () {
                wrapper.vm.$v.form.asset.genesisHash.$model = '';
                wrapper.vm.$v.form.asset.genesisHash.$reset();
                expect(wrapper.vm.$v.form.asset.genesisHash.$dirty).toBe(false);
                if (componentName === 'TransactionFormBridgechainRegistration') {
                    expect(wrapper.vm.$v.form.asset.genesisHash.$invalid).toBe(true);
                }
                else {
                    expect(wrapper.vm.$v.form.asset.genesisHash.$invalid).toBe(false);
                }
                expect(wrapper.vm.genesisHashError).toBe(null);
            });
            if (componentName === 'TransactionFormBridgechainRegistration') {
                describe('TransactionFormBridgechainRegistration', function () {
                    it('should return error if invalid', function () {
                        wrapper.vm.$v.form.asset.genesisHash.$model = '1234';
                        expect(wrapper.vm.$v.form.asset.genesisHash.$dirty).toBe(true);
                        expect(wrapper.vm.$v.form.asset.genesisHash.$invalid).toBe(true);
                        expect(wrapper.vm.genesisHashError).toBe('VALIDATION.NOT_VALID');
                    });
                });
            }
        });
        describe('bridgechainRepositoryError', function () {
            it('should return null if valid', function () {
                wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'https://github.com/arkecosystem/desktop-wallet.git';
                expect(wrapper.vm.$v.form.asset.bridgechainRepository.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.bridgechainRepository.$invalid).toBe(false);
                expect(wrapper.vm.bridgechainRepositoryError).toBe(null);
            });
            it('should return null if not dirty', function () {
                wrapper.vm.$v.form.asset.bridgechainRepository.$model = '';
                wrapper.vm.$v.form.asset.bridgechainRepository.$reset();
                expect(wrapper.vm.$v.form.asset.bridgechainRepository.$dirty).toBe(false);
                if (componentName === 'TransactionFormBridgechainRegistration') {
                    expect(wrapper.vm.$v.form.asset.bridgechainRepository.$invalid).toBe(true);
                }
                else {
                    expect(wrapper.vm.$v.form.asset.bridgechainRepository.$invalid).toBe(false);
                }
                expect(wrapper.vm.bridgechainRepositoryError).toBe(null);
            });
            if (componentName === 'TransactionFormBridgechainRegistration') {
                describe('TransactionFormBridgechainRegistration', function () {
                    it('should not return error if longer than min (12)', function () {
                        wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'http://github.com';
                        expect(wrapper.vm.$v.form.asset.bridgechainRepository.$dirty).toBe(true);
                        expect(wrapper.vm.$v.form.asset.bridgechainRepository.$invalid).toBe(false);
                        expect(wrapper.vm.bridgechainRepositoryError).not.toBe('VALIDATION.TOO_SHORT');
                    });
                    it('should not return error if equal to min (12)', function () {
                        wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'http://g.com';
                        expect(wrapper.vm.$v.form.asset.bridgechainRepository.$dirty).toBe(true);
                        expect(wrapper.vm.$v.form.asset.bridgechainRepository.$invalid).toBe(false);
                        expect(wrapper.vm.bridgechainRepositoryError).not.toBe('VALIDATION.TOO_SHORT');
                    });
                    it('should return error if shorter than min (12)', function () {
                        wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'ftp://g.co';
                        expect(wrapper.vm.$v.form.asset.bridgechainRepository.$dirty).toBe(true);
                        expect(wrapper.vm.$v.form.asset.bridgechainRepository.$invalid).toBe(true);
                        expect(wrapper.vm.bridgechainRepositoryError).toBe('VALIDATION.TOO_SHORT');
                    });
                    it('should not return error if valid', function () {
                        wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'https://github.com/arkecosystem/desktop-wallet.git';
                        expect(wrapper.vm.$v.form.asset.bridgechainRepository.$dirty).toBe(true);
                        expect(wrapper.vm.$v.form.asset.bridgechainRepository.$invalid).toBe(false);
                        expect(wrapper.vm.bridgechainRepositoryError).not.toBe('VALIDATION.INVALID_URL');
                    });
                    it('should return error if invalid', function () {
                        wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'https://github/arkecosystem/desktop-wallet.git';
                        expect(wrapper.vm.$v.form.asset.bridgechainRepository.$dirty).toBe(true);
                        expect(wrapper.vm.$v.form.asset.bridgechainRepository.$invalid).toBe(true);
                        expect(wrapper.vm.bridgechainRepositoryError).toBe('VALIDATION.INVALID_URL');
                    });
                });
            }
        });
        describe('bridgechainAssetRepositoryError', function () {
            it('should return null if valid', function () {
                wrapper.vm.$v.form.asset.bridgechainAssetRepository.$model = 'https://github.com/arkecosystem/desktop-wallet.git';
                expect(wrapper.vm.$v.form.asset.bridgechainAssetRepository.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.asset.bridgechainAssetRepository.$invalid).toBe(false);
                expect(wrapper.vm.bridgechainAssetRepositoryError).toBe(null);
            });
            if (componentName === 'TransactionFormBridgechainRegistration') {
                describe('TransactionFormBridgechainRegistration', function () {
                    it('should return null if not dirty', function () {
                        wrapper.vm.$v.form.asset.bridgechainAssetRepository.$model = '';
                        wrapper.vm.$v.form.asset.bridgechainAssetRepository.$reset();
                        expect(wrapper.vm.$v.form.asset.bridgechainAssetRepository.$dirty).toBe(false);
                        expect(wrapper.vm.$v.form.asset.bridgechainAssetRepository.$invalid).toBe(false);
                        expect(wrapper.vm.bridgechainAssetRepositoryError).toBe(null);
                    });
                    it('should not return error if valid', function () {
                        wrapper.vm.$v.form.asset.bridgechainAssetRepository.$model = 'https://github.com/arkecosystem/desktop-wallet.git';
                        expect(wrapper.vm.$v.form.asset.bridgechainAssetRepository.$dirty).toBe(true);
                        expect(wrapper.vm.$v.form.asset.bridgechainAssetRepository.$invalid).toBe(false);
                        expect(wrapper.vm.bridgechainAssetRepositoryError).not.toBe('VALIDATION.INVALID_URL');
                    });
                    it('should return error if invalid', function () {
                        wrapper.vm.$v.form.asset.bridgechainAssetRepository.$model = 'https://github/arkecosystem/desktop-wallet.git';
                        expect(wrapper.vm.$v.form.asset.bridgechainAssetRepository.$dirty).toBe(true);
                        expect(wrapper.vm.$v.form.asset.bridgechainAssetRepository.$invalid).toBe(true);
                        expect(wrapper.vm.bridgechainAssetRepositoryError).toBe('VALIDATION.INVALID_URL');
                    });
                });
            }
        });
        describe('apiPortError', function () {
            it('should return null if valid', function () {
                wrapper.vm.$v.form.apiPort.$model = 4003;
                expect(wrapper.vm.$v.form.apiPort.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.apiPort.$invalid).toBe(false);
                expect(wrapper.vm.apiPortError).toBe(null);
            });
            it('should return null if not dirty', function () {
                wrapper.vm.$v.form.apiPort.$model = '';
                wrapper.vm.$v.form.apiPort.$reset();
                expect(wrapper.vm.$v.form.apiPort.$dirty).toBe(false);
                expect(wrapper.vm.$v.form.apiPort.$invalid).toBe(true);
                expect(wrapper.vm.apiPortError).toBe(null);
            });
            it('should return error if empty', function () {
                wrapper.vm.$v.form.apiPort.$model = '';
                expect(wrapper.vm.$v.form.apiPort.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.apiPort.$invalid).toBe(true);
                expect(wrapper.vm.apiPortError).toBe('VALIDATION.REQUIRED');
            });
            it('should return error if not numeric', function () {
                wrapper.vm.$v.form.apiPort.$model = 'test';
                expect(wrapper.vm.$v.form.apiPort.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.apiPort.$invalid).toBe(true);
                expect(wrapper.vm.apiPortError).toBe('VALIDATION.NOT_NUMERIC');
            });
            it('should return error if not valid port', function () {
                wrapper.vm.$v.form.apiPort.$model = '9999999';
                expect(wrapper.vm.$v.form.apiPort.$dirty).toBe(true);
                expect(wrapper.vm.$v.form.apiPort.$invalid).toBe(true);
                expect(wrapper.vm.apiPortError).toBe('VALIDATION.INVALID_PORT');
            });
        });
    });
    describe('methods', function () {
        describe('getTransactionData', function () {
            it('should return correct data with passphrase', function () {
                wrapper.vm.$v.form.fee.$model = 0.1;
                wrapper.vm.$v.form.passphrase.$model = 'passphrase';
                wrapper.vm.$v.form.asset.name.$model = 'bridgechain';
                wrapper.vm.$v.form.asset.genesisHash.$model = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867';
                wrapper.vm.$v.form.seedNodes.$model = [
                    { ip: '1.1.1.1', isInvalid: false },
                    { ip: '2.2.2.2', isInvalid: false }
                ];
                wrapper.vm.form.asset.ports = {
                    '@arkecosystem/core-api': 4003
                };
                wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'https://github.com/arkecosystem/core.git';
                wrapper.vm.$v.form.asset.bridgechainAssetRepository.$model = 'https://github.com/arkecosystem/core-assets.git';
                var expectedAsset = {
                    name: 'bridgechain',
                    seedNodes: [
                        '1.1.1.1',
                        '2.2.2.2'
                    ],
                    ports: {
                        '@arkecosystem/core-api': 4003
                    },
                    genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
                    bridgechainRepository: 'https://github.com/arkecosystem/core.git',
                    bridgechainAssetRepository: 'https://github.com/arkecosystem/core-assets.git'
                };
                if (componentName === 'TransactionFormBridgechainUpdate') {
                    expectedAsset = {
                        bridgechainId: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'
                    };
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
                wrapper.vm.$v.form.asset.name.$model = 'bridgechain';
                wrapper.vm.$v.form.asset.genesisHash.$model = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867';
                wrapper.vm.$v.form.seedNodes.$model = [
                    { ip: '1.1.1.1', isInvalid: false },
                    { ip: '2.2.2.2', isInvalid: false }
                ];
                wrapper.vm.form.asset.ports = {
                    '@arkecosystem/core-api': 4003
                };
                wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'https://github.com/arkecosystem/core.git';
                wrapper.vm.$v.form.asset.bridgechainAssetRepository.$model = 'https://github.com/arkecosystem/core-assets.git';
                var expectedAsset = {
                    name: 'bridgechain',
                    seedNodes: [
                        '1.1.1.1',
                        '2.2.2.2'
                    ],
                    ports: {
                        '@arkecosystem/core-api': 4003
                    },
                    genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
                    bridgechainRepository: 'https://github.com/arkecosystem/core.git',
                    bridgechainAssetRepository: 'https://github.com/arkecosystem/core-assets.git'
                };
                if (componentName === 'TransactionFormBridgechainUpdate') {
                    expectedAsset = {
                        bridgechainId: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'
                    };
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
            it('should build bridgechain update', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                            if (componentName === 'TransactionFormBridgechainRegistration') {
                                expect(wrapper.vm.$client.buildBridgechainRegistration).toHaveBeenCalledWith(transactionData, true, true);
                            }
                            else {
                                expect(wrapper.vm.$client.buildBridgechainUpdate).toHaveBeenCalledWith(transactionData, true, true);
                            }
                            expect(response).toBe(transactionData);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should build bridgechain update with default arguments', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                            if (componentName === 'TransactionFormBridgechainRegistration') {
                                expect(wrapper.vm.$client.buildBridgechainRegistration).toHaveBeenCalledWith(transactionData, false, false);
                            }
                            else {
                                expect(wrapper.vm.$client.buildBridgechainUpdate).toHaveBeenCalledWith(transactionData, false, false);
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
                if (componentName === 'TransactionFormBridgechainRegistration') {
                    expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.BRIDGECHAIN_REGISTRATION');
                }
                else {
                    expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.BRIDGECHAIN_UPDATE');
                }
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
                var spy, validateSeedsSpy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(wrapper.vm, 'onSubmit').mockImplementation();
                            validateSeedsSpy = jest.spyOn(wrapper.vm, 'validateSeeds').mockImplementation();
                            wrapper.vm.step = 2;
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, wrapper.vm.nextStep()];
                        case 2:
                            _a.sent();
                            expect(validateSeedsSpy).toHaveBeenCalledTimes(1);
                            expect(wrapper.vm.invalidSeeds.length).toBe(0);
                            expect(spy).toHaveBeenCalledTimes(1);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('addSeedNode', function () {
            it('should add current seed to list', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.form.seedNodes.$model = [];
                            wrapper.vm.$v.seedNode.$model = '5.5.5.5';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            wrapper.vm.addSeedNode();
                            expect(wrapper.vm.$v.form.seedNodes.$model).toEqual([{ ip: '5.5.5.5', isInvalid: false }]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should reset current seed', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.seedNode.$model = '7.7.7.7';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            wrapper.vm.addSeedNode();
                            expect(wrapper.vm.$v.seedNode.$model).toBe('');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should do nothing if invalid seed', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wrapper.vm.$v.form.seedNodes.$model = [];
                            wrapper.vm.$v.seedNode.$model = 'invalid seed';
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            wrapper.vm.addSeedNode();
                            expect(wrapper.vm.$v.form.seedNodes.$model).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('emitRemoveSeedNode', function () {
            it('should remove seed at index', function () {
                wrapper.vm.$v.form.seedNodes.$model = [
                    { ip: '5.5.5.5', isInvalid: false },
                    { ip: '6.6.6.6', isInvalid: false },
                    { ip: '7.7.7.7', isInvalid: false }
                ];
                wrapper.vm.emitRemoveSeedNode(1);
                expect(wrapper.vm.$v.form.seedNodes.$model).toEqual([
                    { ip: '5.5.5.5', isInvalid: false },
                    { ip: '7.7.7.7', isInvalid: false }
                ]);
            });
            it('should do nothing if index does not exist', function () {
                var seeds = [
                    { ip: '5.5.5.5', isInvalid: false },
                    { ip: '6.6.6.6', isInvalid: false }
                ];
                wrapper.vm.$v.form.seedNodes.$model = seeds;
                wrapper.vm.emitRemoveSeedNode(3);
                expect(wrapper.vm.$v.form.seedNodes.$model).toBe(seeds);
            });
        });
    });
});
//# sourceMappingURL=mixin.spec.js.map