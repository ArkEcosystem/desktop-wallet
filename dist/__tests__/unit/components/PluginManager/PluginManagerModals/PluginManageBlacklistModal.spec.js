import { mount } from '@vue/test-utils';
import useI18nGlobally from '../../../__utils__/i18n';
import { PluginManageBlacklistModal } from '@/components/PluginManager/PluginManagerModals';
import store from '@/store';
var i18n = useI18nGlobally();
var wrapper;
var plugins = [
    'plugin-1',
    'plugin-2'
];
beforeEach(function () {
    wrapper = mount(PluginManageBlacklistModal, {
        i18n: i18n,
        store: store,
        propsData: {
            blacklist: plugins
        },
        stubs: {
            Portal: true
        }
    });
    store.dispatch('plugin/setBlacklisted', {
        scope: 'local',
        plugins: plugins
    });
});
describe('PluginManageBlacklistModal', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    describe('Methods', function () {
        it('should emit close event', function () {
            wrapper.vm.emitClose();
            expect(wrapper.emitted('close')).toBeTruthy();
        });
        it('should remove all plugins from local scope', function () {
            jest.spyOn(wrapper.vm.$store, 'dispatch');
            expect(wrapper.vm.$store.getters['plugin/blacklisted'].local).toEqual(wrapper.props('blacklist'));
            wrapper.vm.removeAll();
            expect(wrapper.vm.$store.dispatch).toHaveBeenCalled();
            expect(wrapper.vm.$store.getters['plugin/blacklisted'].local).toEqual([]);
        });
        it('should remove a single plugin from local scope', function () {
            jest.spyOn(wrapper.vm.$store, 'dispatch');
            expect(wrapper.vm.$store.getters['plugin/blacklisted'].local).toEqual(wrapper.props('blacklist'));
            wrapper.vm.removeFromBlacklist(plugins[0]);
            expect(wrapper.vm.$store.dispatch).toHaveBeenCalled();
            expect(wrapper.vm.$store.getters['plugin/blacklisted'].local).toEqual([plugins[1]]);
        });
    });
});
//# sourceMappingURL=PluginManageBlacklistModal.spec.js.map