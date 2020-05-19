import { mount } from '@vue/test-utils';
import ModalWindow from '@/components/Modal';
import useI18nGlobally from '../../__utils__/i18n';
var i18n = useI18nGlobally();
var stubs = {
    Portal: '<div><slot/></div>'
};
describe('ModalWindow', function () {
    describe('render popup', function () {
        it('should render the popup', function () {
            var wrapper = mount(ModalWindow, { stubs: stubs });
            expect(wrapper.contains('.ModalWindow')).toBe(true);
        });
        it('should render with content', function () {
            var wrapper = mount(ModalWindow, {
                stubs: stubs,
                slots: {
                    default: ['<strong>My popup modal</strong>']
                }
            });
            expect(wrapper.contains('article')).toBe(true);
        });
        it('should render with a title passed by prop', function () {
            var wrapper = mount(ModalWindow, {
                stubs: stubs,
                propsData: {
                    title: 'Testing popup component'
                }
            });
            expect(wrapper.contains('header')).toBe(true);
        });
        it('should render with a header passed by slot', function () {
            var wrapper = mount(ModalWindow, {
                stubs: stubs,
                slots: {
                    header: '<h2>Testing popup component</h2>'
                }
            });
            expect(wrapper.contains('header')).toBe(true);
        });
        it('should render with a message passed by prop', function () {
            var wrapper = mount(ModalWindow, {
                stubs: stubs,
                propsData: {
                    message: 'Testing popup component'
                }
            });
            expect(wrapper.contains('footer')).toBe(true);
        });
        it('should render with a header passed by slot', function () {
            var wrapper = mount(ModalWindow, {
                stubs: stubs,
                slots: {
                    footer: '<footer>Testing popup component</footer>'
                }
            });
            expect(wrapper.contains('footer')).toBe(true);
        });
    });
    describe('close confirmation modal', function () {
        var options = {
            stubs: stubs,
            i18n: i18n,
            propsData: {
                confirmClose: true
            }
        };
        describe('render', function () {
            describe('without changes', function () {
                it('should not render when click on mask', function () {
                    var wrapper = mount(ModalWindow, options);
                    var mask = wrapper.find('.ModalWindow');
                    mask.trigger('click');
                    expect(wrapper.contains('.ModalCloseConfirmation')).toBeFalsy();
                });
                it('should not render when click on close button', function () {
                    var wrapper = mount(ModalWindow, options);
                    var mask = wrapper.find('.ModalWindow__close-button');
                    mask.trigger('click');
                    expect(wrapper.contains('.ModalCloseConfirmation')).toBeFalsy();
                });
            });
            describe('with changes', function () {
                it('should render when click on mask', function () {
                    var wrapper = mount(ModalWindow, options);
                    wrapper.setData({ showConfirmationModal: true });
                    var mask = wrapper.find('.ModalWindow');
                    mask.trigger('click');
                    expect(wrapper.contains('.ModalCloseConfirmation')).toBeTruthy();
                });
                it('should render when click on close button', function () {
                    var wrapper = mount(ModalWindow, options);
                    wrapper.setData({ showConfirmationModal: true });
                    var mask = wrapper.find('.ModalWindow__close-button');
                    mask.trigger('click');
                    expect(wrapper.contains('.ModalCloseConfirmation')).toBeTruthy();
                });
            });
        });
        describe('events', function () {
            describe('close', function () {
                it('should emit on confirm', function () {
                    var wrapper = mount(ModalWindow, options);
                    wrapper.setData({ showConfirmationModal: true });
                    var confirmButton = wrapper.find('.ModalCloseConfirmation__confirm-button');
                    confirmButton.trigger('click');
                    expect(wrapper.emitted('close')).toBeTruthy();
                });
                it('should not emit on cancel', function () {
                    var wrapper = mount(ModalWindow, options);
                    wrapper.setData({ showConfirmationModal: true });
                    var cancelButton = wrapper.find('.ModalCloseConfirmation__cancel-button');
                    cancelButton.trigger('click');
                    expect(wrapper.emitted('close')).toBeFalsy();
                });
            });
            describe('confirm', function () {
                it('should close the confirmation modal', function () {
                    var wrapper = mount(ModalWindow, options);
                    wrapper.setData({ showConfirmationModal: true });
                    var confirmButton = wrapper.find('.ModalCloseConfirmation__confirm-button');
                    confirmButton.trigger('click');
                    expect(wrapper.contains('.ModalCloseConfirmation')).toBeFalsy();
                });
                it('should close the modal window', function () {
                    var wrapper = mount(ModalWindow, options);
                    wrapper.setData({ showConfirmationModal: true });
                    var confirmButton = wrapper.find('.ModalCloseConfirmation__confirm-button');
                    confirmButton.trigger('click');
                    expect(wrapper.contains('.ModalCloseConfirmation')).toBeFalsy();
                });
            });
            describe('cancel', function () {
                it('should close the confirmation modal', function () {
                    var wrapper = mount(ModalWindow, options);
                    wrapper.setData({ showConfirmationModal: true });
                    var cancelButton = wrapper.find('.ModalCloseConfirmation__cancel-button');
                    cancelButton.trigger('click');
                    expect(wrapper.contains('.ModalCloseConfirmation')).toBeFalsy();
                });
                it('should not close the modal window', function () {
                    var wrapper = mount(ModalWindow, options);
                    wrapper.setData({ showConfirmationModal: true });
                    var cancelButton = wrapper.find('.ModalCloseConfirmation__cancel-button');
                    cancelButton.trigger('click');
                    expect(wrapper.contains('.ModalWindow')).toBeTruthy();
                });
            });
        });
    });
    describe('close popup', function () {
        it('should emit a close event when clicks the close button', function () {
            var wrapper = mount(ModalWindow, { stubs: stubs });
            var mask = wrapper.find('.ModalWindow__close-button');
            mask.trigger('click');
            expect(wrapper.emitted('close')).toBeTruthy();
        });
        it('should not close when clicking inside the modal', function () {
            var wrapper = mount(ModalWindow, { stubs: stubs });
            var modal = wrapper.find('.ModalWindow__container');
            modal.trigger('click');
            expect(wrapper.emitted('close')).toBeFalsy();
        });
        it('should not close when mousedown inside the modal', function () {
            var wrapper = mount(ModalWindow, { stubs: stubs });
            var modal = wrapper.find('.ModalWindow__container');
            modal.trigger('mousedown');
            expect(wrapper.emitted('close')).toBeFalsy();
        });
        it('should close when firing mousedown inside the mask', function () {
            var wrapper = mount(ModalWindow, { stubs: stubs });
            var mask = wrapper.find('.ModalWindow');
            mask.trigger('mousedown');
            expect(wrapper.emitted('close')).toBeTruthy();
        });
        it('should not close event when firing mouseup only inside the mask', function () {
            var wrapper = mount(ModalWindow, { stubs: stubs });
            var mask = wrapper.find('.ModalWindow');
            mask.trigger('mouseup');
            expect(wrapper.emitted('close')).toBeFalsy();
        });
        it('should not close event when firing mousedown inside the container and mouseup inside the wrapper', function () {
            var wrapper = mount(ModalWindow, { stubs: stubs });
            var modal = wrapper.find('.ModalWindow__container');
            var mask = wrapper.find('.ModalWindow');
            modal.trigger('mousedown');
            mask.trigger('mouseup');
            expect(wrapper.emitted('close')).toBeFalsy();
        });
    });
    describe('resize popup', function () {
        it('should start maximized', function () {
            var wrapper = mount(ModalWindow, { stubs: stubs });
            expect(wrapper.contains('.ModalWindow--maximized')).toBe(true);
        });
        it('should not display the resize button by default', function () {
            var wrapper = mount(ModalWindow, { stubs: stubs });
            expect(wrapper.contains('.ModalWindow__resize-button')).toBe(false);
        });
        it('should display the resize button', function () {
            var wrapper = mount(ModalWindow, { stubs: stubs, propsData: { canResize: true } });
            expect(wrapper.contains('.ModalWindow__resize-button')).toBe(true);
        });
        it('should minimize modal when clicks the resize button', function () {
            var wrapper = mount(ModalWindow, { stubs: stubs, propsData: { canResize: true } });
            var button = wrapper.find('.ModalWindow__resize-button');
            button.trigger('click');
            expect(wrapper.contains('.ModalWindow--minimized')).toBe(true);
        });
        it('should not close when pressing on the backdrop while minimized', function () {
            var wrapper = mount(ModalWindow, { stubs: stubs, propsData: { canResize: true } });
            var button = wrapper.find('.ModalWindow__resize-button');
            button.trigger('click');
            expect(wrapper.contains('.ModalWindow--minimized')).toBe(true);
            var modal = wrapper.find('.ModalWindow');
            modal.trigger('click');
            expect(wrapper.emitted('close')).toBeFalsy();
        });
        it('should maximize modal when clicks the resize button', function () {
            var wrapper = mount(ModalWindow, { stubs: stubs, propsData: { canResize: true } });
            var button = wrapper.find('.ModalWindow__resize-button');
            button.trigger('click');
            expect(wrapper.contains('.ModalWindow--minimized')).toBe(true);
            button.trigger('click');
            expect(wrapper.contains('.ModalWindow--maximized')).toBe(true);
        });
    });
});
//# sourceMappingURL=ModalWindow.spec.js.map