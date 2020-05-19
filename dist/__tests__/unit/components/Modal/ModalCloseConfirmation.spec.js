import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../__utils__/i18n';
import { ModalCloseConfirmation } from '@/components/Modal';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = shallowMount(ModalCloseConfirmation, {
        i18n: i18n
    });
});
describe('ModalCloseConfirmation', function () {
    describe('render popup', function () {
        it('should render the close confirmation modal', function () {
            expect(wrapper.isVueInstance()).toBeTrue();
        });
    });
    describe('close modal capabilities', function () {
        describe('cancel event', function () {
            it('should emit a cancel event when clicks the cancel buttom', function () {
                var mask = wrapper.find('.ModalCloseConfirmation__cancel-button');
                mask.trigger('click');
                expect(wrapper.emitted('cancel')).toBeTruthy();
            });
            it('should emit a cancel event when clicks the mask', function () {
                var mask = wrapper.find('.ModalCloseConfirmation__mask');
                mask.trigger('click');
                expect(wrapper.emitted('cancel')).toBeTruthy();
            });
            it('should not emit a cancel event when pressing inside the modal', function () {
                var modal = wrapper.find('.ModalCloseConfirmation__container');
                modal.trigger('click');
                expect(wrapper.emitted('cancel')).toBeFalsy();
            });
        });
        describe('confirm event', function () {
            it('should emit a confirm event when clicks the confirm buttom', function () {
                var mask = wrapper.find('.ModalCloseConfirmation__confirm-button');
                mask.trigger('click');
                expect(wrapper.emitted('confirm')).toBeTruthy();
            });
        });
    });
});
//# sourceMappingURL=ModalCloseConfirmation.spec.js.map