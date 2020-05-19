import { createLocalVue, mount } from '@vue/test-utils';
import installI18n from '../../../__utils__/i18n';
import TransactionConfirmDelegateRegistration from '@/components/Transaction/TransactionConfirm/TransactionConfirmDelegateRegistration';
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var wrapper;
var createWrapper = function (component, transaction) {
    component = component || TransactionConfirmDelegateRegistration;
    transaction = transaction || {
        asset: {
            delegate: {
                username: 'test_delegate'
            }
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
            wallet_formatAddress: jest.fn(function (address) { return "formatted-" + address; })
        }
    });
};
describe('TransactionConfirmDelegateRegistration', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should have delegate registration transaction type (2)', function () {
        expect(wrapper.vm.$options.transactionType).toBe(2);
    });
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionConfirmDelegateRegistration')).toBe(true);
        });
        it('should output senderLabel', function () {
            expect(wrapper.find('.TransactionConfirmDelegateRegistration__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1');
        });
        it('should output username', function () {
            expect(wrapper.find('.TransactionConfirmDelegateRegistration__username .ListDividedItem__value').text()).toBe('test_delegate');
        });
    });
    describe('computed', function () {
        describe('senderLabel', function () {
            it('should return a formatted address', function () {
                expect(wrapper.vm.senderLabel).toBe('formatted-address-1');
            });
        });
        describe('username', function () {
            it('should return username if set', function () {
                expect(wrapper.vm.username).toBe('test_delegate');
            });
            it('should return empty string if no asset', function () {
                createWrapper(null, {});
                expect(wrapper.vm.username).toBe('');
            });
            it('should return empty string if no delegate', function () {
                createWrapper(null, {
                    asset: {}
                });
                expect(wrapper.vm.username).toBe('');
            });
        });
    });
});
//# sourceMappingURL=TransactionConfirmDelegateRegistration.spec.js.map