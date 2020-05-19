import { createLocalVue, mount } from '@vue/test-utils';
import installI18n from '../../../__utils__/i18n';
import { WalletBusiness } from '@/components/Wallet/WalletBusiness';
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config';
var localVue = createLocalVue();
var i18n = installI18n(localVue);
var wrapper;
var createWrapper = function (component) {
    component = component || WalletBusiness;
    wrapper = mount(component, {
        i18n: i18n,
        localVue: localVue,
        sync: false,
        stubs: {
            WalletBusinessBridgechains: "<div>\n        <div class=\"WalletBusinessBridgechains\"></div>\n      </div>"
        }
    });
};
describe('WalletBusiness', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should render', function () {
        expect(wrapper.contains('.WalletBusiness')).toBe(true);
    });
    it('should include WalletBusinessBridgechains component', function () {
        expect(wrapper.contains('.WalletBusinessBridgechains')).toBe(true);
    });
    it('should initiate with bridgechain lookup', function () {
        expect(wrapper.vm.bridgechainRegistration).toEqual({
            type: TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_REGISTRATION,
            group: TRANSACTION_GROUPS.MAGISTRATE
        });
    });
    describe('closeTransactionModal', function () {
        it('should toggle modal if open', function () {
            var toggleMethod = jest.fn();
            wrapper.vm.closeTransactionModal(toggleMethod, true);
            expect(toggleMethod).toHaveBeenCalled();
        });
        it('should not toggle modal if closed', function () {
            var toggleMethod = jest.fn();
            wrapper.vm.closeTransactionModal(toggleMethod, false);
            expect(toggleMethod).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=WalletBusiness.spec.js.map