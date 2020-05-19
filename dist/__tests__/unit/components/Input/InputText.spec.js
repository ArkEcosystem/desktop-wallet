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
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import { InputText } from '@/components/Input';
import useI18nGlobally from '../../__utils__/i18n';
Vue.use(Vuelidate);
describe('InputText', function () {
    it('should render', function () {
        var wrapper = mount(InputText, {
            propsData: {
                name: 'test',
                label: 'test'
            }
        });
        expect(wrapper.contains('.InputText')).toBeTruthy();
    });
    it('should render with v-model', function () {
        var value = 'testing';
        var wrapper = mount(InputText, {
            propsData: {
                name: 'test',
                label: 'test',
                value: value
            }
        });
        expect(wrapper.vm.value).toBe(value);
        var input = wrapper.find('.InputText__input');
        expect(input.element.value).toBe(value);
    });
    it('should be disabled', function () {
        var wrapper = mount(InputText, {
            propsData: {
                name: 'test',
                label: 'test',
                isDisabled: true
            }
        });
        var input = wrapper.find('.InputText__input');
        expect(input.attributes().disabled).toBe('disabled');
    });
    it('should be dirty', function () {
        var wrapper = mount(InputText, {
            propsData: {
                name: 'test',
                label: 'test',
                value: 'testing'
            }
        });
        expect(wrapper.vm.isDirty).toBeTrue();
    });
    it('should show a helper text', function () {
        var helperText = 'testing';
        var wrapper = mount(InputText, {
            propsData: {
                name: 'test',
                label: 'test',
                helperText: helperText
            }
        });
        var helper = wrapper.find('.InputField__helper');
        expect(helper.text()).toBe(helperText);
    });
    describe('when focus', function () {
        it('should focus the input', function () {
            var wrapper = mount(InputText, {
                propsData: {
                    name: 'test',
                    label: 'test'
                }
            });
            wrapper.vm.focus();
            expect(wrapper.vm.isFocused).toBeTrue();
        });
        it('should emit the `focus` event', function () {
            var wrapper = mount(InputText, {
                propsData: {
                    name: 'test',
                    label: 'test'
                }
            });
            wrapper.vm.focus();
            expect(wrapper.emitted('focus')).toBeTruthy();
        });
    });
    describe('when vendorfield contains a bip39 passphrase', function () {
        var wrapper;
        var i18n = useI18nGlobally();
        var mocks = {
            session_profile: {
                bip39Language: 'english'
            }
        };
        beforeEach(function () {
            wrapper = mount(InputText, {
                propsData: {
                    name: 'vendorField',
                    label: 'vendorField',
                    bip39Warning: true
                },
                i18n: i18n,
                mocks: mocks,
                sync: false
            });
        });
        it('should show a warning', function () { return __awaiter(void 0, void 0, void 0, function () {
            var helper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrapper.find('.InputText input').setValue('one video jaguar gap soldier ill hobby motor bundle couple trophy smoke');
                        wrapper.vm.$v.$touch();
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.warning).toBeTruthy();
                        helper = wrapper.find('.InputField__helper');
                        expect(helper.text()).toMatch(/BIP39/);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should show a warning when it contains spaces at the end', function () { return __awaiter(void 0, void 0, void 0, function () {
            var helper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrapper.find('.InputText input').setValue('one video jaguar gap soldier ill hobby motor bundle couple trophy smoke   ');
                        wrapper.vm.$v.$touch();
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.warning).toBeTruthy();
                        helper = wrapper.find('.InputField__helper');
                        expect(helper.text()).toMatch(/BIP39/);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should show a warning when it contains spaces at the front', function () { return __awaiter(void 0, void 0, void 0, function () {
            var helper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrapper.find('.InputText input').setValue('   one video jaguar gap soldier ill hobby motor bundle couple trophy smoke');
                        wrapper.vm.$v.$touch();
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.warning).toBeTruthy();
                        helper = wrapper.find('.InputField__helper');
                        expect(helper.text()).toMatch(/BIP39/);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should show a warning when it contains additional spaces in between', function () { return __awaiter(void 0, void 0, void 0, function () {
            var helper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrapper.find('.InputText input').setValue('one video jaguar   gap soldier ill hobby   motor bundle couple trophy smoke');
                        wrapper.vm.$v.$touch();
                        return [4 /*yield*/, wrapper.vm.$nextTick()];
                    case 1:
                        _a.sent();
                        expect(wrapper.vm.warning).toBeTruthy();
                        helper = wrapper.find('.InputField__helper');
                        expect(helper.text()).toMatch(/BIP39/);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=InputText.spec.js.map