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
import { mount } from '@vue/test-utils';
import { useI18nGlobally } from '../../__utils__/i18n';
import { InputPassword } from '@/components/Input';
var i18n = useI18nGlobally();
var mountData;
beforeEach(function () {
    mountData = {
        i18n: i18n,
        propsData: {
            name: 'test',
            label: 'test'
        },
        mocks: {
            $v: {
                model: {}
            }
        }
    };
});
describe('InputPassword', function () {
    it('should render', function () {
        var wrapper = mount(InputPassword, mountData);
        expect(wrapper.contains('.InputPassword')).toBeTruthy();
    });
    it('should render with v-model', function () {
        var value = 'testing';
        mountData.propsData.value = value;
        var wrapper = mount(InputPassword, mountData);
        expect(wrapper.vm.value).toBe(value);
        var input = wrapper.find('.InputPassword__input');
        expect(input.element.value).toBe(value);
    });
    it('should be disabled', function () {
        mountData.propsData.isDisabled = true;
        var wrapper = mount(InputPassword, mountData);
        var input = wrapper.find('.InputPassword__input');
        expect(input.attributes().disabled).toBe('disabled');
    });
    it('should show a helper text', function () {
        var helperText = 'testing';
        mountData.propsData.helperText = helperText;
        var wrapper = mount(InputPassword, mountData);
        var helper = wrapper.find('.InputField__helper');
        expect(helper.text()).toBe(helperText);
    });
    describe('when focus', function () {
        it('should focus the input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var wrapper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrapper = mount(InputPassword, mountData);
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
                        wrapper = mount(InputPassword, mountData);
                        return [4 /*yield*/, wrapper.vm.focus()];
                    case 1:
                        _a.sent();
                        expect(wrapper.emitted('focus')).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('when the password is shorter than the minimum', function () {
        it('should provide feedback about it', function () {
            var value = 'aaaa0000';
            mountData.propsData.value = value;
            mountData.propsData.minLength = value.length + 1;
            var wrapper = mount(InputPassword, mountData);
            expect(wrapper.vm.passwordFeedback()).toEqual('VALIDATION.PASSWORD.TOO_SHORT');
        });
    });
    describe('when the password does not include a lowercase character', function () {
        it('should provide feedback about it', function () {
            mountData.propsData.value = 'A123';
            mountData.propsData.minLength = 2;
            var wrapper = mount(InputPassword, mountData);
            expect(wrapper.vm.passwordFeedback()).toEqual('VALIDATION.PASSWORD.LOWER_CASE');
        });
    });
    describe('when the password does not include an uppercase character', function () {
        it('should provide feedback about it', function () {
            mountData.propsData.value = 'a123';
            mountData.propsData.minLength = 2;
            var wrapper = mount(InputPassword, mountData);
            expect(wrapper.vm.passwordFeedback()).toEqual('VALIDATION.PASSWORD.UPPER_CASE');
        });
    });
    describe('when the password does not include a number', function () {
        it('should provide feedback about it', function () {
            mountData.propsData.value = 'aB';
            mountData.propsData.minLength = 2;
            var wrapper = mount(InputPassword, mountData);
            expect(wrapper.vm.passwordFeedback()).toEqual('VALIDATION.PASSWORD.NUMBERS');
        });
    });
    describe('when the password does not include a special character', function () {
        it('should provide feedback about it', function () {
            mountData.propsData.value = 'aB0';
            mountData.propsData.minLength = 2;
            var wrapper = mount(InputPassword, mountData);
            expect(wrapper.vm.passwordFeedback()).toEqual('VALIDATION.PASSWORD.SPECIAL_CHARACTERS');
        });
    });
    describe('when the password follows all the constraints', function () {
        it('should not provide feedback', function () {
            var value = 'aB1+';
            mountData.propsData.value = value;
            mountData.propsData.minLength = value.length;
            var wrapper = mount(InputPassword, mountData);
            expect(wrapper.vm.passwordFeedback()).toEqual('');
        });
    });
});
//# sourceMappingURL=InputPassword.spec.js.map