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
import installI18n from '../../../__utils__/i18n';
import TransactionConfirm, * as TransactionConfirmComponents from '@/components/Transaction/TransactionConfirm';
import TransactionConfirmBusiness from '@/components/Transaction/TransactionConfirm/TransactionConfirmBusiness';
import TransactionConfirmBridgechain from '@/components/Transaction/TransactionConfirm/TransactionConfirmBridgechain';
import CurrencyMixin from '@/mixins/currency';
var transactions = {
    delegateRegistration: {
        type: 2,
        asset: {
            delegate: {
                username: 'test_delegate'
            }
        }
    },
    delegateResignation: {
        type: 7
    },
    ipfs: {
        type: 5
    },
    multiPayment: {
        type: 6,
        asset: {
            payments: [{
                    address: 'address-1',
                    amount: (1 * 1e8).toString()
                },
                {
                    address: 'address-2',
                    amount: (5 * 1e8).toString()
                }]
        }
    },
    multiSignature: {
        type: 4,
        multiSignature: {}
    },
    secondSignature: {
        type: 1
    },
    transfer: {
        type: 0,
        amount: (1 * 1e8).toString(),
        fee: (0.1 * 1e8).toString(),
        recipientId: 'recipient-address'
    },
    vote: {
        type: 3
    },
    businessRegistration: {
        type: 0,
        typeGroup: 2,
        asset: {
            businessRegistration: {
                name: 'test business',
                website: 'https://ark.io',
                vat: 'GB12345678',
                repository: 'https://github.com/arkecosystem/desktop-wallet.git'
            }
        }
    },
    businessResignation: {
        type: 1,
        typeGroup: 2
    },
    businessUpdate: {
        type: 2,
        typeGroup: 2,
        asset: {
            businessUpdate: {
                name: 'test business',
                website: 'https://ark.io',
                vat: 'GB12345678',
                repository: 'https://github.com/arkecosystem/desktop-wallet.git'
            }
        }
    },
    bridgechainRegistration: {
        type: 3,
        typeGroup: 2,
        asset: {
            bridgechainRegistration: {
                name: 'test bridgechain',
                genesisHash: 'genesis_hash_1234',
                seedNodes: [
                    '1.1.1.1',
                    '2.2.2.2'
                ],
                ports: {
                    '@arkecosystem/core-api': 4003
                },
                bridgechainRepository: 'https://github.com/arkecosystem/core.git'
            }
        }
    },
    bridgechainResignation: {
        type: 4,
        typeGroup: 2
    },
    bridgechainUpdate: {
        type: 5,
        typeGroup: 2,
        asset: {
            bridgechainUpdate: {
                seedNodes: [
                    '1.1.1.1',
                    '2.2.2.2'
                ],
                ports: {
                    '@arkecosystem/core-api': 4003
                }
            }
        }
    }
};
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var wrapper;
var createWrapper = function (component, transaction) {
    component = component || TransactionConfirm;
    transaction = transaction || transactions.transfer;
    if (!transaction.network) {
        transaction.network = 23;
    }
    if (!transaction.fee) {
        transaction.fee = (0.1 * 1e8).toString();
    }
    if (!transaction.version) {
        transaction.version = 2;
    }
    if (!transaction.nonce) {
        transaction.nonce = '1';
    }
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        sync: false,
        propsData: {
            transaction: transaction
        },
        mocks: {
            wallet_formatAddress: jest.fn(function (address) { return "formatted-" + address; }),
            formatter_networkCurrency: jest.fn(function (amount) { return amount.toString(); }),
            currency_toBuilder: jest.fn(CurrencyMixin.methods.currency_toBuilder),
            electron_writeFile: jest.fn(function (_, path) { return "/home/test/" + path; }),
            wallet_fromRoute: {
                address: 'address-1'
            },
            wallet_name: jest.fn(function (wallet) { return wallet; }),
            $success: jest.fn(),
            $error: jest.fn()
        },
        stubs: __assign(__assign(__assign({ Identicon: true, TransactionDetail: true }, TransactionConfirmComponents), TransactionConfirmBusiness), TransactionConfirmBridgechain)
    });
};
describe('TransactionConfirm', function () {
    beforeEach(function () {
        createWrapper();
    });
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionConfirm')).toBe(true);
        });
        it('should render transfer confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.transfer);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.contains('.TransactionConfirmTransfer')).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render second signature confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.secondSignature);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.contains('.TransactionConfirmSecondSignature')).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render delegate registration confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.delegateRegistration);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.contains('.TransactionConfirmDelegateRegistration')).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render vote confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.vote);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.contains('.TransactionConfirmVote')).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render multi-signature confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.multiSignature);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.contains('.TransactionConfirmMultiSignature')).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render ipfs confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.ipfs);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.contains('.TransactionConfirmIpfs')).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render multi-payment confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.multiPayment);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.contains('.TransactionConfirmMultiPayment')).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render delegate resignation confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.delegateResignation);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.contains('.TransactionConfirmDelegateResignation')).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render business registration confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.businessRegistration);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.contains('.TransactionConfirmBusinessRegistration')).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render business resignation confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.businessResignation);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.contains('.TransactionConfirmBusinessResignation')).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render business update confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.businessUpdate);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.contains('.TransactionConfirmBusinessUpdate')).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render bridgechain registration confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.bridgechainRegistration);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.contains('.TransactionConfirmBridgechainRegistration')).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render bridgechain resignation confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.bridgechainResignation);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.contains('.TransactionConfirmBridgechainResignation')).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render bridgechain update confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.bridgechainUpdate);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.contains('.TransactionConfirmBridgechainUpdate')).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('computed', function () {
        describe('totalAmount', function () {
            it('should calculate full amount of transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            createWrapper(null, transactions.transfer);
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.totalAmount + '').toEqual('110000000');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use only fee if no amount', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            createWrapper(null, transactions.vote);
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.totalAmount + '').toBe('10000000');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should calculate total including payments of multi-payment', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            createWrapper(null, transactions.multiPayment);
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.totalAmount + '').toBe('610000000');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('currentWallet', function () {
            it('should return wallet from prop if set', function () { return __awaiter(void 0, void 0, void 0, function () {
                var wallet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wallet = {
                                address: 'prop-address-1'
                            };
                            wrapper.setProps({
                                transaction: transactions.vote,
                                wallet: wallet
                            });
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.currentWallet).toBe(wallet);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return wallet from route if no prop is set', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    expect(wrapper.vm.currentWallet).toEqual({
                        address: 'address-1'
                    });
                    return [2 /*return*/];
                });
            }); });
            it('should return updated wallet from route if changed', function () { return __awaiter(void 0, void 0, void 0, function () {
                var wallet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expect(wrapper.vm.currentWallet).toEqual({
                                address: 'address-1'
                            });
                            wallet = {
                                address: 'prop-address-1'
                            };
                            wrapper.setProps({
                                transaction: transactions.vote,
                                wallet: wallet
                            });
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.currentWallet).toEqual({
                                address: 'prop-address-1'
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('address', function () {
            it('should get address of current wallet', function () {
                expect(wrapper.vm.address).toEqual('address-1');
            });
            it('should update address when current wallet changes', function () { return __awaiter(void 0, void 0, void 0, function () {
                var wallet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            wallet = {
                                address: 'prop-address-1'
                            };
                            expect(wrapper.vm.address).toEqual('address-1');
                            wrapper.setProps({
                                transaction: transactions.vote,
                                wallet: wallet
                            });
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.address).toEqual('prop-address-1');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('showSave', function () {
            it('should return true if transaction is not multi-signature', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            createWrapper(null, transactions.secondSignature);
                            return [4 /*yield*/, wrapper.vm.$nextTick()];
                        case 1:
                            _a.sent();
                            expect(wrapper.vm.showSave).toBe(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return false if transaction is multi-signature', function () {
                createWrapper(null, transactions.multiSignature);
                expect(wrapper.vm.showSave).toBe(false);
            });
        });
    });
    describe('mounted hook', function () {
        it('should render transfer confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.transfer);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.activeComponent).toBe('TransactionConfirmTransfer');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render second signature confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.secondSignature);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.activeComponent).toBe('TransactionConfirmSecondSignature');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render delegate registration confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.delegateRegistration);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.activeComponent).toBe('TransactionConfirmDelegateRegistration');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render vote confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.vote);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.activeComponent).toBe('TransactionConfirmVote');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render multi-signature confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.multiSignature);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.activeComponent).toBe('TransactionConfirmMultiSignature');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render ipfs confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.ipfs);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.activeComponent).toBe('TransactionConfirmIpfs');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render multi-payment confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.multiPayment);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.activeComponent).toBe('TransactionConfirmMultiPayment');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render delegate resignation confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.delegateResignation);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.activeComponent).toBe('TransactionConfirmDelegateResignation');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render business registration confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.businessRegistration);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.activeComponent).toBe('TransactionConfirmBusinessRegistration');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render business resignation confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.businessResignation);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.activeComponent).toBe('TransactionConfirmBusinessResignation');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render business update confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.businessUpdate);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.activeComponent).toBe('TransactionConfirmBusinessUpdate');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render bridgechain registration confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.bridgechainRegistration);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.activeComponent).toBe('TransactionConfirmBridgechainRegistration');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render bridgechain resignation confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.bridgechainResignation);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.transaction.type).toBe(4);
                        expect(wrapper.vm.transaction.typeGroup).toBe(2);
                        expect(wrapper.vm.activeComponent).toBe('TransactionConfirmBridgechainResignation');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render bridgechain update confirm component', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createWrapper(null, transactions.bridgechainUpdate);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.activeComponent).toBe('TransactionConfirmBridgechainUpdate');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should error if no component based on transaction type', function () {
            expect(function () { createWrapper(null, { type: 1000 }); }).toThrow('[TransactionConfirm] - Confirm for type 1000 (group 1) not found.');
        });
    });
    describe('methods', function () {
        describe('emitBack', function () {
            it('should emit', function () {
                wrapper.vm.emitBack();
                expect(wrapper.emitted().back).toBeTruthy();
            });
        });
        describe('emitConfirm', function () {
            it('should emit if not already clicked', function () {
                wrapper.vm.wasClicked = false;
                wrapper.vm.emitConfirm();
                expect(wrapper.emitted().confirm).toBeTruthy();
            });
            it('should not emit if already clicked', function () {
                wrapper.vm.wasClicked = true;
                wrapper.vm.emitConfirm();
                expect(wrapper.emitted().confirm).toBeFalsy();
            });
        });
        describe('saveTransaction', function () {
            it('should save to file & output success message', function () { return __awaiter(void 0, void 0, void 0, function () {
                var $tSpy, json, path;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            $tSpy = jest.spyOn(wrapper.vm, '$t');
                            return [4 /*yield*/, wrapper.vm.saveTransaction()];
                        case 1:
                            _a.sent();
                            json = JSON.stringify(wrapper.vm.transaction);
                            path = wrapper.vm.transaction.id + ".json";
                            expect(wrapper.vm.electron_writeFile).toHaveBeenCalledWith(json, path);
                            expect(wrapper.vm.$success).toHaveBeenCalledWith('TRANSACTION.SUCCESS.SAVE_OFFLINE');
                            expect($tSpy).toHaveBeenCalledWith('TRANSACTION.SUCCESS.SAVE_OFFLINE', { path: "/home/test/" + path });
                            $tSpy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should error if saving fails', function () { return __awaiter(void 0, void 0, void 0, function () {
                var $tSpy, json, path;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            $tSpy = jest.spyOn(wrapper.vm, '$t');
                            wrapper.vm.electron_writeFile.mockImplementation(function () {
                                throw new Error('failed to save');
                            });
                            return [4 /*yield*/, wrapper.vm.saveTransaction()];
                        case 1:
                            _a.sent();
                            json = JSON.stringify(wrapper.vm.transaction);
                            path = wrapper.vm.transaction.id + ".json";
                            expect(wrapper.vm.electron_writeFile).toHaveBeenCalledWith(json, path);
                            expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.SAVE_OFFLINE');
                            expect($tSpy).toHaveBeenCalledWith('TRANSACTION.ERROR.SAVE_OFFLINE', { error: 'failed to save' });
                            $tSpy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
//# sourceMappingURL=TransactionConfirm.spec.js.map