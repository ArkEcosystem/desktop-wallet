import { merge } from 'lodash';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import { mount } from '@vue/test-utils';
import { useI18n } from '../../__utils__/i18n';
import { InputDelegate } from '@/components/Input';
import delegates from '../../__fixtures__/store/delegate';
Vue.use(Vuelidate);
var i18n = useI18n(Vue);
describe('InputDelegate', function () {
    var mountComponent = function (config) {
        return mount(InputDelegate, merge({
            i18n: i18n,
            propsData: {
                value: ''
            },
            mocks: {
                wallet_name: function (value) { return value; },
                wallet_truncate: function (value) { return value; },
                $store: {
                    getters: {
                        'delegate/byUsername': function (value) { return value; },
                        'delegate/byAddress': function (value) { return value; },
                        'delegate/byPublicKey': function (value) { return value; },
                        'delegate/bySessionNetwork': delegates
                    }
                }
            }
        }, config));
    };
    it('has the right name', function () {
        var wrapper = mountComponent();
        expect(wrapper.name()).toEqual('InputDelegate');
    });
    it('should render', function () {
        var wrapper = mountComponent();
        expect(wrapper.contains('.InputDelegate')).toBeTruthy();
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
            wrapper.find('.InputDelegate input').setValue('not empty');
            expect(wrapper.emitted('input')).toBeTruthy();
        });
        it('should emit the `valid` event', function () {
            var wrapper = mountComponent();
            wrapper.find('.InputDelegate input').setValue('not empty');
            expect(wrapper.emitted('valid')).toBeTruthy();
        });
    });
    describe('when the value is not valid', function () {
        // FIXME: Vuelidate is not updating the $dirty state
        xit('should show the error instead of the helper text', function () {
            var wrapper = mountComponent();
            wrapper.find('.InputDelegate input').setValue('not empty');
            var helper = wrapper.find('.InputField__helper');
            expect(wrapper.vm.error).toMatch(/could not be found/);
            expect(helper.text()).toMatch(/could not be found/);
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
//# sourceMappingURL=InputDelegate.spec.js.map