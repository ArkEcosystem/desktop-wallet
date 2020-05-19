import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../__utils__/i18n';
import { ModalConfirmation } from '@/components/Modal';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = shallowMount(ModalConfirmation, {
        i18n: i18n
    });
});
describe('ModalConfirmation', function () {
    it('should render modal', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    it('should render buttons', function () {
        expect(wrapper.findAll('button')).toHaveLength(2);
        expect(wrapper.find('.ModalConfirmation__cancel-button').isVisible());
        expect(wrapper.find('.ModalConfirmation__continue-button').isVisible());
    });
    it('should be possible to hide the cancel button', function () {
        wrapper = shallowMount(ModalConfirmation, {
            i18n: i18n,
            propsData: {
                showCancelButton: false
            }
        });
        expect(wrapper.findAll('button')).toHaveLength(1);
        expect(wrapper.find('.ModalConfirmation__cancel-button').exists()).toBe(false);
        expect(wrapper.find('.ModalConfirmation__continue-button').isVisible());
    });
    it('should default portal target to "modal"', function () {
        expect(wrapper.props('portalTarget')).toBe('modal');
    });
    it('should change portal target', function () {
        wrapper = shallowMount(ModalConfirmation, {
            i18n: i18n,
            propsData: {
                portalTarget: 'test'
            }
        });
        expect(wrapper.props('portalTarget')).toBe('test');
    });
});
//# sourceMappingURL=ModalConfirmation.spec.js.map