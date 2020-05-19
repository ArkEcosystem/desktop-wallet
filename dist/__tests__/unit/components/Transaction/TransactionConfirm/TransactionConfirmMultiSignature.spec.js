import { createLocalVue, mount } from '@vue/test-utils';
import installI18n from '../../../__utils__/i18n';
import TransactionConfirmMultiSignature from '@/components/Transaction/TransactionConfirm/TransactionConfirmMultiSignature';
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var wrapper;
var createWrapper = function (component) {
    component = component || TransactionConfirmMultiSignature;
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        sync: false,
        provide: {
            currentWallet: {
                address: 'address-1'
            }
        },
        mocks: {
            wallet_formatAddress: jest.fn(function (address) { return "formatted-" + address; })
        }
    });
};
describe('TransactionConfirmMultiSignature', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should have multi-signature transaction type (4)', function () {
        expect(wrapper.vm.$options.transactionType).toBe(4);
    });
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionConfirmMultiSignature')).toBe(true);
        });
        it('should output senderLabel', function () {
            expect(wrapper.find('.TransactionConfirmMultiSignature__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1');
        });
    });
    describe('computed', function () {
        describe('senderLabel', function () {
            it('should return a formatted address', function () {
                expect(wrapper.vm.senderLabel).toBe('formatted-address-1');
            });
        });
    });
});
//# sourceMappingURL=TransactionConfirmMultiSignature.spec.js.map