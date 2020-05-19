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
import { WalletBusinessShowBridgechain } from '@/components/Wallet/WalletBusiness';
import truncateMiddle from '@/filters/truncate-middle';
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var wrapper;
var createWrapper = function (component, propsData) {
    component = component || WalletBusinessShowBridgechain;
    propsData = propsData || {
        bridgechain: {
            name: 'test bridgechain',
            seedNodes: ['1.1.1.1', '2.2.2.2'],
            genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
            bridgechainRepository: 'http://ark.io',
            ports: {
                '@arkecosystem/core-api': 4003
            },
            isResigned: false
        }
    };
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        propsData: propsData,
        sync: false,
        stubs: {
            Portal: '<div class="Portal"><slot /></div>'
        }
    });
};
describe('WalletBusinessShowBridgechain', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should render', function () {
        expect(wrapper.contains('.WalletBusinessShowBridgechain')).toBe(true);
    });
    describe('template', function () {
        it('should output bridgechain name', function () {
            var props = wrapper.find('.WalletBusinessShowBridgechain__name').props();
            expect(props.label).toBe('WALLET_BUSINESS.BRIDGECHAIN.NAME');
            expect(props.value).toBe('test bridgechain');
        });
        it('should output seed nodes', function () {
            var seedNodes = wrapper.find('.WalletBusinessShowBridgechain__seed-nodes');
            var seedNodeItems = seedNodes.findAll('.WalletBusinessShowBridgechain__seed-nodes__item');
            expect(seedNodes.props('label')).toBe('WALLET_BUSINESS.BRIDGECHAIN.SEED_NODES');
            for (var itemIndex = 0; itemIndex < seedNodeItems.length; itemIndex++) {
                var seedNode = seedNodeItems.at(itemIndex);
                expect(seedNode.text()).toBe(wrapper.vm.bridgechain.seedNodes[itemIndex]);
            }
        });
        it('should output genesis hash', function () {
            var genesisHash = wrapper.find('.WalletBusinessShowBridgechain__genesis-hash');
            var genesisHashItem = genesisHash.find('.WalletBusinessShowBridgechain__genesis-hash__item');
            expect(genesisHash.props('label')).toBe('WALLET_BUSINESS.BRIDGECHAIN.GENESIS_HASH');
            expect(genesisHashItem.text()).toBe(truncateMiddle(wrapper.vm.bridgechain.genesisHash, 10));
        });
        it('should output genesis hash', function () {
            var bridgechainRepo = wrapper.find('.WalletBusinessShowBridgechain__bridgechain-repo');
            var bridgechainRepoItem = bridgechainRepo.find('.WalletBusinessShowBridgechain__bridgechain-repo__item');
            expect(bridgechainRepo.props('label')).toBe('WALLET_BUSINESS.BRIDGECHAIN.BRIDGECHAIN_REPOSITORY');
            expect(bridgechainRepoItem.text()).toBe(wrapper.vm.bridgechain.bridgechainRepository);
        });
    });
    describe('computed isResigned', function () {
        it('should return false if not present in bridgechain', function () {
            var props = {
                bridgechain: __assign(__assign({}, wrapper.vm.bridgechain), { isResigned: undefined })
            };
            createWrapper(null, props);
            expect(wrapper.vm.isResigned).toBe(false);
        });
        it('should return false if bridgechain is false', function () {
            expect(wrapper.vm.isResigned).toBe(false);
        });
        it('should return true if bridgechain is true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var props;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        props = {
                            bridgechain: __assign(__assign({}, wrapper.vm.bridgechain), { isResigned: true })
                        };
                        createWrapper(null, props);
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.isResigned).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('closeTransactionModal', function () {
        it('should toggle method & call "emitClose" if open', function () {
            var spy = jest.spyOn(wrapper.vm, 'emitClose').mockImplementation();
            var toggleClose = jest.fn();
            wrapper.vm.closeTransactionModal(toggleClose, true);
            expect(toggleClose).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should only call "emitClose" if already closed', function () {
            var spy = jest.spyOn(wrapper.vm, 'emitClose').mockImplementation();
            var toggleClose = jest.fn();
            wrapper.vm.closeTransactionModal(toggleClose, false);
            expect(toggleClose).not.toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should not toggle method if not a function', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                expect(function () { wrapper.vm.closeTransactionModal(null, true); }).not.toThrowError();
                return [2 /*return*/];
            });
        }); });
    });
    describe('emitClose', function () {
        it('should emit "close"', function () {
            wrapper.vm.emitClose();
            expect(wrapper.emitted('close')[0][0]).toBe('navigateToTransactions');
        });
    });
});
//# sourceMappingURL=WalletBusinessShowBridgechain.spec.js.map