import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../__utils__/i18n';
import { WalletRenameModal } from '@/components/Wallet';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = shallowMount(WalletRenameModal, {
        propsData: {
            wallet: {}
        },
        i18n: i18n
    });
});
describe('WalletRenameModal', function () {
    it('should render modal', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
});
//# sourceMappingURL=WalletRenameModal.spec.js.map