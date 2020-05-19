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
import installI18n from '../../__utils__/i18n';
import { InputPublicKey } from '@/components/Input';
import transaction from '../../__fixtures__/models/transaction';
var localVue = createLocalVue();
var i18n = installI18n(localVue);
localVue.use(Vuelidate);
var wrapper;
var createWrapper = function (component, propsData) {
    component = component || InputPublicKey;
    propsData = propsData || {
        value: ''
    };
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        propsData: propsData,
        sync: false
    });
};
describe('InputPublicKey', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should render', function () {
        expect(wrapper.contains('.InputPublicKey')).toBe(true);
    });
    it('should update model if value property is updated', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect(wrapper.vm.inputValue).toBe('');
                    wrapper.setProps({
                        value: 'test'
                    });
                    return [4 /*yield*/, wrapper.vm.$nextTick()];
                case 1:
                    _a.sent();
                    expect(wrapper.vm.$v.model.$model).toEqual('test');
                    expect(wrapper.vm.inputValue).toBe('test');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return an error if invalid input', function () {
        wrapper.vm.$v.model.$model = 'test';
        expect(wrapper.vm.error).toBeTruthy();
    });
    it('should reset the value', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper.vm.$v.model.$model = 'test';
                    expect(wrapper.vm.model).toBe('test');
                    wrapper.vm.reset();
                    return [4 /*yield*/, wrapper.vm.$nextTick()];
                case 1:
                    _a.sent();
                    expect(wrapper.vm.model).toBe('');
                    expect(wrapper.vm.error).toBeFalsy();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('validation', function () {
        it('should check if valid public key is entered', function () {
            var spy = jest.spyOn(Identities.Address, 'fromPublicKey');
            wrapper.vm.model = 'test';
            expect(wrapper.vm.$v.model.isValid).toBe(false);
            wrapper.vm.model = transaction.senderPublicKey;
            expect(wrapper.vm.$v.model.isValid).toBe(true);
            expect(spy).toHaveBeenCalledTimes(2);
            spy.mockRestore();
        });
        it('should not check if not required and empty', function () {
            wrapper.setProps({
                isRequired: false
            });
            var spy = jest.spyOn(Identities.Address, 'fromPublicKey');
            wrapper.vm.model = '';
            expect(wrapper.vm.$v.model.isValid).toBe(true);
            expect(spy).not.toHaveBeenCalled();
            wrapper.vm.model = 'test';
            expect(wrapper.vm.$v.model.isValid).toBe(false);
            expect(spy).toHaveBeenCalledTimes(1);
            spy.mockRestore();
        });
    });
});
//# sourceMappingURL=InputPublicKey.spec.js.map