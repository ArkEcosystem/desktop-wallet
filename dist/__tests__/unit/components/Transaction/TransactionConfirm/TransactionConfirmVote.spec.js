import { createLocalVue, mount } from '@vue/test-utils';
import installI18n from '../../../__utils__/i18n';
import TransactionConfirmVote from '@/components/Transaction/TransactionConfirm/TransactionConfirmVote';
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var wrapper;
var createWrapper = function (component) {
    component = component || TransactionConfirmVote;
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
describe('TransactionConfirmVote', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should have vote transaction type (3)', function () {
        expect(wrapper.vm.$options.transactionType).toBe(3);
    });
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionConfirmVote')).toBe(true);
        });
        it('should output senderLabel', function () {
            expect(wrapper.find('.TransactionConfirmVote__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1');
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
//# sourceMappingURL=TransactionConfirmVote.spec.js.map