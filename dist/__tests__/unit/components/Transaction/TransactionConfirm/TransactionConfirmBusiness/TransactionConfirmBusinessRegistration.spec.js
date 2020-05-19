import { createLocalVue, mount } from '@vue/test-utils';
import installI18n from '../../../../__utils__/i18n';
import TransactionConfirmBusinessRegistration from '@/components/Transaction/TransactionConfirm/TransactionConfirmBusiness/TransactionConfirmBusinessRegistration';
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var wrapper;
var createWrapper = function (component, transaction) {
    component = component || TransactionConfirmBusinessRegistration;
    transaction = transaction || {
        asset: {
            businessRegistration: {
                name: 'test business',
                website: 'https://ark.io',
                vat: 'GB12345678',
                repository: 'https://github.com/arkecosystem/desktop-wallet.git'
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
describe('TransactionConfirmBusinessRegistration', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should have magistrates transaction group (2)', function () {
        expect(wrapper.vm.$options.transactionGroup).toBe(2);
    });
    it('should have business registration transaction type (0)', function () {
        expect(wrapper.vm.$options.transactionType).toBe(0);
    });
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionConfirmBusinessRegistration')).toBe(true);
        });
        it('should output senderLabel', function () {
            expect(wrapper.find('.TransactionConfirmBusinessRegistration__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1');
        });
        it('should output name', function () {
            expect(wrapper.find('.TransactionConfirmBusinessRegistration__name .ListDividedItem__value').text()).toBe('test business');
        });
        it('should output website', function () {
            expect(wrapper.find('.TransactionConfirmBusinessRegistration__website .ListDividedItem__value').text()).toBe('https://ark.io');
        });
        it('should output vat when provided', function () {
            expect(wrapper.find('.TransactionConfirmBusinessRegistration__vat .ListDividedItem__value').text()).toBe('GB12345678');
        });
        it('should not output vat when not provided', function () {
            createWrapper(null, {
                asset: {
                    businessRegistration: {
                        name: 'test business',
                        website: 'https://ark.io',
                        repository: 'https://github.com/arkecosystem/desktop-wallet.git'
                    }
                }
            });
            expect(wrapper.contains('.TransactionConfirmBusinessRegistration__vat')).toBe(false);
        });
        it('should output repo when provided', function () {
            expect(wrapper.find('.TransactionConfirmBusinessRegistration__repository .ListDividedItem__value').text()).toBe('https://github.com/arkecosystem/desktop-wallet.git');
        });
        it('should not output repo when not provided', function () {
            createWrapper(null, {
                asset: {
                    businessRegistration: {
                        name: 'test business',
                        website: 'https://ark.io',
                        vat: 'GB12345678'
                    }
                }
            });
            expect(wrapper.contains('.TransactionConfirmBusinessRegistration__repository')).toBe(false);
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
//# sourceMappingURL=TransactionConfirmBusinessRegistration.spec.js.map