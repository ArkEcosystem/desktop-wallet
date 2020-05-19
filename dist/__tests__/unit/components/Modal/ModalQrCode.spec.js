import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../__utils__/i18n';
import { ModalQrCode } from '@/components/Modal';
describe('ModalQrCode', function () {
    it('should render modal', function () {
        var i18n = useI18nGlobally();
        var wrapper = shallowMount(ModalQrCode, {
            i18n: i18n,
            propsData: {
                value: 'teste'
            }
        });
        expect(wrapper.isVueInstance()).toBeTrue();
    });
});
//# sourceMappingURL=ModalQrCode.spec.js.map