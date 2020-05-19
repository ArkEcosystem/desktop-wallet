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
import installI18n from '../../../../__utils__/i18n';
import TransactionFormBridgechainUpdate from '@/components/Transaction/TransactionForm/TransactionFormBridgechain/TransactionFormBridgechainUpdate';
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
var createWrapper = function (component, wallet, bridgechain) {
    component = component || TransactionFormBridgechainUpdate;
    wallet = wallet || {
        passphrase: null
    };
    if (bridgechain === undefined) {
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
            wallet_formatAddress: jest.fn(function (address) { return "formatted-" + address; }),
            wallet_fromRoute: wallet
        }
    });
};
describe('TransactionFormBridgechainUpdate', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should have magistrate transaction group', function () {
        expect(wrapper.vm.$options.transactionGroup).toBe(2);
    });
    it('should have bridgechain update transaction type', function () {
        expect(wrapper.vm.$options.transactionType).toBe(5);
    });
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
            it('should not have name field', function () {
                expect(wrapper.contains('.TransactionFormBridgechain__name')).toBe(false);
            });
            it('should not have genesis hash field', function () {
                expect(wrapper.contains('.TransactionFormBridgechain__genesis-hash')).toBe(false);
            });
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
                                createWrapper(null, {
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
                                createWrapper(null, {
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
                                createWrapper(null, {
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
                                createWrapper(null, {
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
                                '1.1.1.1'
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
                                '1.1.1.1'
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
    describe('mounted hook', function () {
        it('should load bridgechain into form', function () {
            createWrapper(null, null, {
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
            createWrapper(null, null, {
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
    describe('methods', function () {
        describe('buildTransaction', function () {
            it('should build bridgechain update', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transactionData, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionData = {
                                type: 5,
                                typeGroup: 2
                            };
                            return [4 /*yield*/, wrapper.vm.buildTransaction(transactionData, true, true)];
                        case 1:
                            response = _a.sent();
                            expect(wrapper.vm.$client.buildBridgechainUpdate).toHaveBeenCalledWith(transactionData, true, true);
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
                                type: 5,
                                typeGroup: 2
                            };
                            return [4 /*yield*/, wrapper.vm.buildTransaction(transactionData)];
                        case 1:
                            response = _a.sent();
                            expect(wrapper.vm.$client.buildBridgechainUpdate).toHaveBeenCalledWith(transactionData, false, false);
                            expect(response).toBe(transactionData);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('transactionError', function () {
            it('should generate transaction error', function () {
                wrapper.vm.transactionError();
                expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.BRIDGECHAIN_UPDATE');
            });
        });
    });
});
//# sourceMappingURL=TransactionFormBridgechainUpdate.spec.js.map