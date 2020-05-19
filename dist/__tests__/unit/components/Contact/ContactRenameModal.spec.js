import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../__utils__/i18n';
import { ContactRenameModal } from '@/components/Contact';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = shallowMount(ContactRenameModal, {
        propsData: {
            wallet: {}
        },
        i18n: i18n
    });
});
describe('ContactRenameModal', function () {
    it('should render modal', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
});
//# sourceMappingURL=ContactRenameModal.spec.js.map