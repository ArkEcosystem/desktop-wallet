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
import { merge } from 'lodash';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import { mount } from '@vue/test-utils';
import { useI18n } from '../../__utils__/i18n';
import { PassphraseInput } from '@/components/Passphrase';
import WalletService from '@/services/wallet';
Vue.use(Vuelidate);
var i18n = useI18n(Vue);
describe('PassphraseInput', function () {
    var mountComponent = function (config) {
        return mount(PassphraseInput, merge({
            i18n: i18n,
            propsData: {
                value: '',
                pubKeyHash: 23
            }
        }, config));
    };
    it('has the right name', function () {
        var wrapper = mountComponent();
        expect(wrapper.name()).toEqual('PassphraseInput');
    });
    it('should render', function () {
        var wrapper = mountComponent();
        expect(wrapper.contains('.PassphraseInput')).toBeTruthy();
    });
    describe('when receiving the `isDisabled` prop', function () {
        it('should be disabled', function () {
            var wrapper = mountComponent({
                propsData: { isDisabled: true }
            });
            var input = wrapper.find('.PassphraseInput__input');
            expect(input.attributes().disabled).toBe('disabled');
        });
    });
    describe('when receiving the `helperText` prop', function () {
        it('should show a helper text', function () {
            var helperText = 'example text';
            var wrapper = mountComponent({
                propsData: { helperText: helperText }
            });
            var helper = wrapper.find('.InputField__helper');
            expect(helper.text()).toBe(helperText);
        });
    });
    describe('when the input value changes', function () {
        it('should emit the `input` event', function () {
            var wrapper = mountComponent();
            wrapper.find('.PassphraseInput input').setValue('not empty');
            expect(wrapper.emitted('input')).toBeTruthy();
        });
    });
    describe('when the passphrase is not valid', function () {
        // FIXME: Vuelidate is not updating the $dirty state
        xit('should show the error instead of the helper text', function () {
            WalletService.validatePassphrase = jest.fn(function () { return false; });
            var wrapper = mountComponent();
            wrapper.find('.PassphraseInput input').setValue('not empty');
            var helper = wrapper.find('.InputField__helper');
            expect(wrapper.vm.error).toMatch(/not.*valid/);
            expect(helper.text()).toMatch(/not.*valid/);
        });
    });
    describe('when focus', function () {
        it('should focus the input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var wrapper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrapper = mountComponent();
                        return [4 /*yield*/, wrapper.vm.focus()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.isFocused).toBeTrue();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should emit the `focus` event', function () { return __awaiter(void 0, void 0, void 0, function () {
            var wrapper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrapper = mountComponent();
                        return [4 /*yield*/, wrapper.vm.focus()];
                    case 1:
                        _a.sent();
                        expect(wrapper.emitted('focus')).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=PassphraseInput.spec.js.map