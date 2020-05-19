import { mount } from '@vue/test-utils';
import useI18nGlobally from '../../__utils__/i18n';
import ModalRename from '@/components/Modal';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = mount(ModalRename, {
        stubs: {
            Portal: true
        },
        i18n: i18n
    });
});
describe('ModalRename', function () {
    it('should render modal', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
});
//# sourceMappingURL=ModalRename.spec.js.map