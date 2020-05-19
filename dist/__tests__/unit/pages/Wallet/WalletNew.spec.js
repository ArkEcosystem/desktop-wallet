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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { createLocalVue, mount } from '@vue/test-utils';
import { useI18n } from '../../__utils__/i18n';
import WalletNew from '@/pages/Wallet/WalletNew';
import WalletService from '@/services/wallet';
var localVue = createLocalVue();
var i18n = useI18n(localVue);
describe('pages > WalletNew', function () {
    var mountPage = function () {
        return mount(WalletNew, {
            localVue: localVue,
            i18n: i18n,
            mocks: {
                schema: {},
                session_hasDarkTheme: false,
                session_network: {
                    symbol: {}
                },
                $v: {
                    step1: {},
                    step3: {},
                    step4: {},
                    step5: {},
                    schema: {
                        name: {},
                        isSendingEnabled: {}
                    },
                    model: {}
                }
            }
        });
    };
    it('should have the right name', function () {
        var wrapper = mountPage();
        expect(wrapper.name()).toEqual('WalletNew');
    });
    it('should render component', function () {
        var wrapper = mountPage();
        expect(wrapper.contains('.WalletNew')).toBeTruthy();
    });
    describe('computed additionalSuggestions', function () {
        it('should mix and shuffle the words of all the passphrases', function () {
            var wallets = {
                A1: 'word1 word2 word3 word4',
                A2: 'first second third fourth',
                A3: 'lemon orange grape banana'
            };
            var words = __spreadArrays(wallets.A1.split(' '), wallets.A2.split(' '), wallets.A3.split(' '));
            var wrapper = mountPage();
            wrapper.setData({ wallets: wallets });
            expect(wrapper.vm.additionalSuggestions).toIncludeAllMembers(words);
        });
    });
    describe('refreshAddresses', function () {
        it('should generate 4 wallets', function () { return __awaiter(void 0, void 0, void 0, function () {
            var wrapper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrapper = mountPage();
                        WalletService.generate.mockClear();
                        wrapper.vm.refreshAddresses();
                        // There is a delay to play an animation
                        return [4 /*yield*/, setTimeout(function () {
                                expect(WalletService.generate).toHaveBeenCalledTimes(4);
                            }, 500)];
                    case 1:
                        // There is a delay to play an animation
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=WalletNew.spec.js.map