import { mount } from '@vue/test-utils';
import useI18nGlobally from '../../../__utils__/i18n';
import { PluginInstallModal } from '@/components/PluginManager/PluginManagerModals';
jest.mock('electron', function () { return ({
    ipcRenderer: {
        on: jest.fn(),
        send: jest.fn(),
        removeListener: jest.fn()
    }
}); });
var i18n = useI18nGlobally();
var wrapper;
var plugin = {
    id: 'test',
    source: 'source'
};
var availablePlugin = {
    config: {
        id: 'test',
        source: 'store-source'
    }
};
var mocks = {
    $store: {
        getters: {
            'plugin/availableById': jest.fn(function () { return availablePlugin; })
        }
    },
    formatter_bytes: jest.fn(function (bytes) { return bytes; }),
    formatter_percentage: jest.fn()
};
beforeEach(function () {
    wrapper = mount(PluginInstallModal, {
        i18n: i18n,
        mocks: mocks,
        propsData: {
            plugin: plugin
        },
        stubs: {
            Portal: '<div><slot /></div>'
        }
    });
    wrapper.setData({
        progress: {
            percent: 0.5,
            transferredBytes: 50,
            totalBytes: 100
        }
    });
});
afterEach(function () {
    wrapper.destroy();
});
describe('PluginInstallModal', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    describe('Methods', function () {
        it('should emit install event', function () {
            wrapper.vm.emitInstall();
            expect(wrapper.emitted('install')).toBeTruthy();
        });
        describe('emitDownload', function () {
            it('should emit download event with plugin source', function () {
                wrapper.vm.emitDownload();
                expect(wrapper.emitted('download', plugin.source)).toBeTruthy();
            });
            it('should emit download event with available plugin source if update', function () {
                wrapper.setProps({ isUpdate: true });
                wrapper.vm.emitDownload();
                expect(wrapper.emitted('download', availablePlugin.config.source)).toBeTruthy();
            });
        });
        describe('emitClose', function () {
            it('should emit close event', function () {
                wrapper.vm.emitClose();
                expect(wrapper.emitted('close')).toBeTruthy();
            });
            it('should call cancel()', function () {
                jest.spyOn(wrapper.vm, 'cancel');
                wrapper.vm.emitClose();
                expect(wrapper.vm.cancel).toHaveBeenCalled();
            });
            it('should call cleanup() if download failed', function () {
                wrapper.setData({ isDownloadFailed: true });
                jest.spyOn(wrapper.vm, 'cleanup');
                wrapper.vm.emitClose();
                expect(wrapper.vm.cleanup).toHaveBeenCalled();
            });
        });
    });
});
//# sourceMappingURL=PluginInstallModal.spec.js.map