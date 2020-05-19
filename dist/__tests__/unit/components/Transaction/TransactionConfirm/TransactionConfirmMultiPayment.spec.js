import { createLocalVue, mount } from '@vue/test-utils';
import installI18n from '../../../__utils__/i18n';
import CurrencyMixin from '@/mixins/currency';
import TransactionConfirmMultiPayment from '@/components/Transaction/TransactionConfirm/TransactionConfirmMultiPayment';
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var wrapper;
var createWrapper = function (component, transaction) {
    component = component || TransactionConfirmMultiPayment;
    transaction = transaction || {
        asset: {
            payments: [
                {
                    address: 'address-1',
                    amount: (1 * 1e8).toString()
                },
                {
                    address: 'address-2',
                    amount: (2 * 1e8).toString()
                }
            ]
        }
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
            currency_toBuilder: jest.fn(CurrencyMixin.methods.currency_toBuilder),
            formatter_networkCurrency: jest.fn(function (amount) { return amount; }),
            wallet_formatAddress: jest.fn(function (address) { return "formatted-" + address; }),
            wallet_name: jest.fn(function (wallet) { return wallet; })
        },
        stubs: {
            Identicon: '<div></div>'
        }
    });
};
describe('TransactionConfirmMultiPayment', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should have multi-payment transaction type (6)', function () {
        expect(wrapper.vm.$options.transactionType).toBe(6);
    });
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionConfirmMultiPayment')).toBe(true);
        });
        it('should output senderLabel', function () {
            expect(wrapper.find('.TransactionConfirmMultiPayment__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1');
        });
        it('should output recipients', function () {
            var recipients = wrapper.findAll('.TransactionConfirmMultiPayment__recipients .InputEditableList__list__item');
            for (var recipientIndex in wrapper.vm.transaction.asset.payments) {
                var recipient = wrapper.vm.transaction.asset.payments[recipientIndex];
                var recipientElement = recipients.at(recipientIndex);
                var addressText = recipientElement.find('.TransactionRecipientList__recipient').text().replace('TRANSACTION.RECIPIENT:', '');
                var amountText = recipientElement.find('.TransactionRecipientList__amount').text().replace('TRANSACTION.AMOUNT:', '');
                expect(addressText.trim()).toBe(recipient.address);
                expect(amountText.trim()).toBe(recipient.amount);
            }
        });
    });
    describe('computed', function () {
        describe('senderLabel', function () {
            it('should return a formatted address', function () {
                expect(wrapper.vm.senderLabel).toBe('formatted-address-1');
            });
        });
        describe('payments', function () {
            it('should return all payments', function () {
                expect(wrapper.vm.payments).toEqual([
                    {
                        address: 'address-1',
                        amount: '100000000'
                    },
                    {
                        address: 'address-2',
                        amount: '200000000'
                    }
                ]);
            });
        });
    });
});
//# sourceMappingURL=TransactionConfirmMultiPayment.spec.js.map