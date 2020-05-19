import { createLocalVue, mount } from '@vue/test-utils';
import PluginWrapper from '@/components/Plugin/PluginWrapper';
import { Wormhole } from 'portal-vue';
var vue = createLocalVue();
jest.mock('portal-vue', function () { return ({
    Wormhole: {
        open: jest.fn(),
        close: jest.fn()
    }
}); });
describe('PluginWrapper', function () {
    var mountComponent = function (config) {
        return mount(PluginWrapper, config);
    };
    describe('when there is a footer slot', function () {
        it('should open a Wormhole when mounted', function (done) {
            var spy = jest.spyOn(Wormhole, 'open');
            var wrapper = mountComponent({
                slots: {
                    footer: '<div></div>'
                }
            });
            vue.nextTick(function () {
                expect(spy).toHaveBeenCalledWith({
                    to: 'plugin-footer',
                    from: 'plugin-wrapper',
                    passengers: wrapper.vm.footerSlot
                });
                done();
            });
            spy.mockRestore();
        });
        it('should close a Wormhole when destroyed', function (done) {
            var spy = jest.spyOn(Wormhole, 'close');
            mountComponent({
                slots: {
                    footer: '<div></div>'
                }
            }).destroy();
            vue.nextTick(function () {
                expect(spy).toHaveBeenCalledWith({
                    to: 'plugin-footer',
                    from: 'plugin-wrapper'
                });
                done();
            });
            spy.mockRestore();
        });
    });
    describe('when there is no footer slot', function () {
        it('should not open a Wormhole when mounted', function (done) {
            var spy = jest.spyOn(Wormhole, 'open');
            mountComponent();
            vue.nextTick(function () {
                expect(spy).not.toHaveBeenCalled();
                done();
            });
            spy.mockRestore();
        });
        it('should not close a Wormhole when destroyed', function (done) {
            var spy = jest.spyOn(Wormhole, 'close');
            mountComponent().destroy();
            vue.nextTick(function () {
                expect(spy).not.toHaveBeenCalled();
                done();
            });
            spy.mockRestore();
        });
    });
});
//# sourceMappingURL=PluginWrapper.spec.js.map