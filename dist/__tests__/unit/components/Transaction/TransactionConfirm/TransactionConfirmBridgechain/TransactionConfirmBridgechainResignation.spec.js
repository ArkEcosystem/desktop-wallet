import { createLocalVue, mount } from '@vue/test-utils';
import installI18n from '../../../../__utils__/i18n';
import TransactionConfirmBridgechainResignation from '@/components/Transaction/TransactionConfirm/TransactionConfirmBridgechain/TransactionConfirmBridgechainResignation';
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var wrapper;
var createWrapper = function (component) {
    component = component || TransactionConfirmBridgechainResignation;
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
describe('TransactionConfirmBridgechainResignation', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should have magistrates transaction group (2)', function () {
        expect(wrapper.vm.$options.transactionGroup).toBe(2);
    });
    it('should have bridgechain resignation transaction type (4)', function () {
        expect(wrapper.vm.$options.transactionType).toBe(4);
    });
    describe('template', function () {
        it('should render', function () {
            expect(wrapper.contains('.TransactionConfirmBridgechainResignation')).toBe(true);
        });
        it('should output senderLabel', function () {
            expect(wrapper.find('.TransactionConfirmBridgechainResignation__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1');
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
//# sourceMappingURL=TransactionConfirmBridgechainResignation.spec.js.map