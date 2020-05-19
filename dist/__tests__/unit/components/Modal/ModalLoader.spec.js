import { shallowMount } from '@vue/test-utils';
import { ModalLoader } from '@/components/Modal';
describe('ModalLoader', function () {
    it('should render modal', function () {
        var wrapper = shallowMount(ModalLoader, {
            propsData: {
                message: 'testing...'
            }
        });
        expect(wrapper.isVueInstance()).toBeTrue();
    });
});
//# sourceMappingURL=ModalLoader.spec.js.map