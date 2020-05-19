import { merge } from 'lodash';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import { mount } from '@vue/test-utils';
import { useI18n } from '../../__utils__/i18n';
import { InputAddress } from '@/components/Input';
import WalletService from '@/services/wallet';
Vue.use(Vuelidate);
var i18n = useI18n(Vue);
describe('InputAddress', function () {
    var mountComponent = function (config) {
        return mount(InputAddress, merge({
            i18n: i18n,
            propsData: {
                value: '',
                pubKeyHash: 23
            },
            mocks: {
                wallet_name: function (value) { return value; }
            }
        }, config));
    };
    it('has the right name', function () {
        var wrapper = mountComponent();
        expect(wrapper.name()).toEqual('InputAddress');
    });
    it('should render', function () {
        var wrapper = mountComponent();
        expect(wrapper.contains('.InputAddress')).toBeTruthy();
    });
    describe('when receiving the `isDisabled` prop', function () {
        it('should be disabled', function () {
            var wrapper = mountComponent({
                propsData: { isDisabled: true }
            });
            var input = wrapper.find('.InputAddress__input');
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
            wrapper.find('.InputAddress input').setValue('not empty');
            expect(wrapper.emitted('input')).toBeTruthy();
        });
    });
    describe('when the value is not valid', function () {
        // FIXME: Vuelidate is not updating the $dirty state
        xit('should show the error instead of the helper text', function () {
            WalletService.validateAddress = jest.fn(function () { return false; });
            var wrapper = mountComponent();
            wrapper.find('.InputAddress input').setValue('not empty');
            var helper = wrapper.find('.InputField__helper');
            expect(wrapper.vm.error).toMatch(/not.*valid/);
            expect(helper.text()).toMatch(/not.*valid/);
        });
    });
    describe('when focus', function () {
        it('should focus the input', function () {
            var wrapper = mountComponent();
            wrapper.vm.focus();
            expect(wrapper.vm.isFocused).toBeTrue();
        });
        it('should emit the `focus` event', function () {
            var wrapper = mountComponent();
            wrapper.vm.focus();
            expect(wrapper.emitted('focus')).toBeTruthy();
        });
    });
});
//# sourceMappingURL=InputAddress.spec.js.map