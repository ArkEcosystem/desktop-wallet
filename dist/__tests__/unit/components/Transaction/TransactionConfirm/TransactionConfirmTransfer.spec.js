import { createLocalVue, mount } from '@vue/test-utils';
import installI18n from '../../../__utils__/i18n';
import TransactionConfirmTransfer from '@/components/Transaction/TransactionConfirm/TransactionConfirmTransfer';
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var wrapper;
var createWrapper = function (component, transaction) {
    component = component || TransactionConfirmTransfer;
    transaction = transaction || {
        amount: (1 * 1e8).toString(),
        fee: (0.1 * 1e8).toString(),
        recipientId: 'recipient-address',
        vendorField: 'test vendorField'
    };
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        sync: false,
        provide: {
            currentWallet: {
                address: 'address-1'
            },
            transaction: transaction
        },
        mocks: {
            formatter_networkCurrency: jest.fn(function (amount) { return amount; }),
            wallet_formatAddress: jest.fn(function (address) { return "formatted-" + address; })
        }
    });
};
describe('TransactionConfirmTransfer', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should have transfer transaction type (0)', function () {
        expect(wrapper.vm.$options.transactionType).toBe(0);
    });
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionConfirmTransfer')).toBe(true);
        });
        it('should output senderLabel', function () {
            expect(wrapper.find('.TransactionConfirmTransfer__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1');
        });
        it('should output amount', function () {
            expect(wrapper.find('.TransactionConfirmTransfer__amount .ListDividedItem__value').text()).toBe('100000000');
        });
        it('should output recipientLabel', function () {
            expect(wrapper.find('.TransactionConfirmTransfer__recipient .ListDividedItem__value span:first-child').text()).toBe('formatted-recipient-address');
        });
        it('should output vendorField', function () {
            expect(wrapper.find('.TransactionConfirmTransfer__vendorfield .ListDividedItem__value').text()).toBe('test vendorField');
        });
        it('should not output vendorField if not provided', function () {
            createWrapper(null, {
                amount: (1 * 1e8).toString(),
                fee: (0.1 * 1e8).toString(),
                recipientId: 'recipient-address'
            });
            expect(wrapper.contains('.TransactionConfirmTransfer__vendorfield')).toBe(false);
        });
        it('should output fee', function () {
            expect(wrapper.find('.TransactionConfirmTransfer__fee .ListDividedItem__value').text()).toBe('10000000');
        });
    });
    describe('computed', function () {
        describe('senderLabel', function () {
            it('should return a formatted address', function () {
                expect(wrapper.vm.senderLabel).toBe('formatted-address-1');
            });
        });
        describe('recipientLabel', function () {
            it('should return a formatted address', function () {
                expect(wrapper.vm.recipientLabel).toBe('formatted-recipient-address');
            });
        });
    });
});
//# sourceMappingURL=TransactionConfirmTransfer.spec.js.map