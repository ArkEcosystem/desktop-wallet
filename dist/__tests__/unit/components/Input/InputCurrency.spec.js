import { merge } from 'lodash';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import { mount } from '@vue/test-utils';
import { useI18n } from '../../__utils__/i18n';
import { InputCurrency } from '@/components/Input';
import store from '@/store';
import BigNumber from '@/plugins/bignumber';
jest.mock('@/store', function () {
    return {
        getters: {
            'session/network': jest.fn()
        }
    };
});
Vue.use(Vuelidate);
var i18n = useI18n(Vue);
describe('InputCurrency', function () {
    var mockNetwork;
    beforeEach(function () {
        mockNetwork = {
            symbol: '×',
            token: 'NET',
            market: {
                enabled: true
            },
            fractionDigits: 8
        };
        store.getters['session/network'] = mockNetwork;
    });
    var mountComponent = function (config) {
        return mount(InputCurrency, merge({
            i18n: i18n,
            propsData: {
                currency: mockNetwork.token,
                value: '',
                minimumAmount: new BigNumber(1e8),
                maximumAmount: new BigNumber(1e8)
            },
            mocks: {
                currency_format: function () { return 'NET 9.9'; },
                session_network: mockNetwork
            }
        }, config));
    };
    it('has the right name', function () {
        var wrapper = mountComponent();
        expect(wrapper.name()).toEqual('InputCurrency');
    });
    it('should render', function () {
        var wrapper = mountComponent();
        expect(wrapper.contains('.InputCurrency')).toBeTruthy();
    });
    describe('decimalSeparator', function () {
        it('should be obtained from the locale', function () {
            var wrapper = mountComponent({
                mocks: {
                    currency_format: function () { return 'NET 9.9'; }
                }
            });
            expect(wrapper.vm.decimalSeparator).toBe('.');
            wrapper = mountComponent({
                mocks: {
                    currency_format: function () { return '9,9 NET'; }
                }
            });
            expect(wrapper.vm.decimalSeparator).toBe(',');
        });
    });
    describe('thousandSeparator', function () {
        it('should be obtained from the locale', function () {
            var wrapper = mountComponent({
                mocks: {
                    currency_format: function () { return 'NET 9.9'; }
                }
            });
            expect(wrapper.vm.thousandSeparator).toBe(',');
            wrapper = mountComponent({
                mocks: {
                    currency_format: function () { return '9,9 NET'; }
                }
            });
            expect(wrapper.vm.thousandSeparator).toBe('.');
        });
    });
    describe('when receiving the `isDisabled` prop', function () {
        it('should be disabled', function () {
            var wrapper = mountComponent({
                propsData: { isDisabled: true }
            });
            var input = wrapper.find('.InputCurrency__input');
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
            wrapper.find('.InputCurrency input').setValue(99);
            expect(wrapper.emitted('input')[0][0]).toEqual('99');
        });
        it('should emit the `raw` event', function () {
            var wrapper = mountComponent();
            wrapper.find('.InputCurrency input').setValue(99);
            expect(wrapper.emitted('raw')[0][0]).toEqual('99');
        });
    });
    describe('emitInput', function () {
        it('should emit 0 instead of invalid numbers', function () {
            var wrapper = mountComponent();
            wrapper.vm.emitInput('not');
            expect(wrapper.emitted('input')[0][0]).toEqual('0');
            wrapper.vm.emitInput(null);
            expect(wrapper.emitted('input')[1][0]).toEqual('0');
        });
        it('should sanitize the values', function () {
            var wrapper = mountComponent();
            jest.spyOn(wrapper.vm, 'sanitizeNumeric');
            wrapper.vm.emitInput('122,0122');
            expect(wrapper.vm.sanitizeNumeric).toHaveBeenCalledWith('122,0122');
        });
        it('should emit numeric values as Numbers', function () {
            var wrapper = mountComponent();
            wrapper.vm.emitInput('122,0122');
            expect(wrapper.emitted('input')[0][0]).toEqual('122.0122');
            wrapper.vm.emitInput('1,,23');
            expect(wrapper.emitted('input')[1][0]).toEqual('1.23');
            wrapper.vm.emitInput('6,,97');
            expect(wrapper.emitted('input')[2][0]).toEqual('6.97');
        });
    });
    describe('checkAmount', function () {
        it('should return `true`` on Numbers', function () {
            var wrapper = mountComponent();
            expect(wrapper.vm.checkAmount(0)).toBeTrue();
            expect(wrapper.vm.checkAmount(19)).toBeTrue();
            expect(wrapper.vm.checkAmount(19.9999999999)).toBeTrue();
            expect(wrapper.vm.checkAmount(766619.9999999999)).toBeTrue();
        });
        it('should return `true`` on Strings that looks like numbers', function () {
            var wrapper = mountComponent();
            expect(wrapper.vm.checkAmount('19')).toBeTrue();
            expect(wrapper.vm.checkAmount('19.9999999999')).toBeTrue();
            expect(wrapper.vm.checkAmount('766619.9999999999')).toBeTrue();
            expect(wrapper.vm.checkAmount('19,9')).toBeTrue();
            expect(wrapper.vm.checkAmount('19,999')).toBeTrue();
            expect(wrapper.vm.checkAmount('19,999.00')).toBeTrue();
            expect(wrapper.vm.checkAmount('19.999,00')).toBeTrue();
        });
        it('should return `true` on Strings that could be sanitized as numbers', function () {
            var wrapper = mountComponent();
            expect(wrapper.vm.checkAmount('.9')).toBeTrue();
            expect(wrapper.vm.checkAmount(',95')).toBeTrue();
            expect(wrapper.vm.checkAmount('  .79  ')).toBeTrue();
            expect(wrapper.vm.checkAmount('  33')).toBeTrue();
            expect(wrapper.vm.checkAmount(' 323 3 3')).toBeTrue();
            expect(wrapper.vm.checkAmount('766..999')).toBeTrue();
            expect(wrapper.vm.checkAmount('16  4.99')).toBeTrue();
            expect(wrapper.vm.checkAmount('7,,36')).toBeTrue();
            expect(wrapper.vm.checkAmount('5,,44.3')).toBeTrue();
        });
        it('should return `false` on Strings that does not look like numbers', function () {
            var wrapper = mountComponent();
            expect(wrapper.vm.checkAmount('')).toBeFalse();
            expect(wrapper.vm.checkAmount('a.9')).toBeFalse();
            expect(wrapper.vm.checkAmount('19a.99')).toBeFalse();
            expect(wrapper.vm.checkAmount('as97')).toBeFalse();
        });
    });
    describe('sanitizeNumeric', function () {
        it('should parse numeric values', function () {
            var wrapper = mountComponent();
            expect(wrapper.vm.sanitizeNumeric('10')).toEqual('10');
            expect(wrapper.vm.sanitizeNumeric('1.10')).toEqual('1.10');
            expect(wrapper.vm.sanitizeNumeric('.999')).toEqual('0.999');
            expect(wrapper.vm.sanitizeNumeric('..87')).toEqual('0.87');
            expect(wrapper.vm.sanitizeNumeric(',333')).toEqual('0.333');
            expect(wrapper.vm.sanitizeNumeric(',,4')).toEqual('0.4');
            expect(wrapper.vm.sanitizeNumeric('  8')).toEqual('8');
            expect(wrapper.vm.sanitizeNumeric('73  ')).toEqual('73');
            expect(wrapper.vm.sanitizeNumeric('  59  ')).toEqual('59');
            expect(wrapper.vm.sanitizeNumeric(1.1)).toEqual('1.1');
            expect(wrapper.vm.sanitizeNumeric(1e-8)).toEqual('0.00000001');
            expect(wrapper.vm.sanitizeNumeric(1e-6)).toEqual('0.000001');
            expect(wrapper.vm.sanitizeNumeric('1,1')).toEqual('1.1');
            expect(wrapper.vm.sanitizeNumeric('100.200.300,40')).toEqual('100200300.40');
            expect(wrapper.vm.sanitizeNumeric('7.777')).toEqual('7.777');
            expect(wrapper.vm.sanitizeNumeric('9,999')).toEqual('9999');
            expect(wrapper.vm.sanitizeNumeric('9,999,999.99')).toEqual('9999999.99');
            expect(wrapper.vm.sanitizeNumeric('10 000 000.5')).toEqual('10000000.5');
            expect(wrapper.vm.sanitizeNumeric('30 000.555')).toEqual('30000.555');
            expect(wrapper.vm.sanitizeNumeric('80 000,8')).toEqual('80000.8');
            expect(wrapper.vm.sanitizeNumeric('30 300,666')).toEqual('30300.666');
            expect(wrapper.vm.sanitizeNumeric('11_111_111.11')).toEqual('11111111.11');
            expect(wrapper.vm.sanitizeNumeric('33_333,33')).toEqual('33333.33');
            expect(wrapper.vm.sanitizeNumeric('10  007')).toEqual('10007');
            expect(wrapper.vm.sanitizeNumeric('49,,390.1')).toEqual('49390.1');
            expect(wrapper.vm.sanitizeNumeric('1..23')).toEqual('1.23');
            expect(wrapper.vm.sanitizeNumeric('6,,19')).toEqual('6.19');
            expect(wrapper.vm.sanitizeNumeric('9 8.34')).toEqual('98.34');
        });
    });
    describe('updateInputValue', function () {
        describe('when receiving an empty value', function () {
            it('should empty the input value', function () {
                var wrapper = mountComponent();
                wrapper.vm.inputValue = 10;
                wrapper.vm.updateInputValue('');
                expect(wrapper.vm.inputValue).toEqual('');
            });
            it('should return `true`', function () {
                var wrapper = mountComponent();
                expect(wrapper.vm.updateInputValue('')).toBeTrue();
            });
        });
        describe('when receiving values that look like numbers', function () {
            it('should sanitize it', function () {
                var wrapper = mountComponent();
                wrapper.vm.inputValue = 1;
                jest.spyOn(wrapper.vm, 'sanitizeNumeric');
                wrapper.vm.updateInputValue('33.333,33');
                expect(wrapper.vm.inputValue).toEqual('33333.33');
                expect(wrapper.vm.sanitizeNumeric).toHaveBeenCalledWith('33.333,33');
            });
            it('should return `true`', function () {
                var wrapper = mountComponent();
                expect(wrapper.vm.updateInputValue('10')).toBeTrue();
            });
        });
        describe('when receiving values that do not look like numbers', function () {
            it('should not change the input value', function () {
                var wrapper = mountComponent();
                wrapper.vm.inputValue = 10;
                wrapper.vm.updateInputValue('not');
                expect(wrapper.vm.inputValue).toEqual(10);
                wrapper.vm.updateInputValue(null);
                expect(wrapper.vm.inputValue).toEqual(10);
            });
            it('should return `false`', function () {
                var wrapper = mountComponent();
                expect(wrapper.vm.updateInputValue('not')).toBeFalse();
                expect(wrapper.vm.updateInputValue(null)).toBeFalse();
            });
        });
    });
});
//# sourceMappingURL=InputCurrency.spec.js.map