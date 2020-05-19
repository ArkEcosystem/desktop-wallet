var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { AppUpdater } from '@/components/App';
var localVue = createLocalVue();
localVue.use(Vuex);
jest.mock('electron', function () { return ({
    ipcRenderer: {
        on: jest.fn(),
        send: jest.fn()
    }
}); });
var wrapper;
var availableRelease = function () {
    return {
        version: '0.1',
        releaseNotes: '<div><h3>Title</h3><a href="#">Test Link</a></div>'
    };
};
var store = new Vuex.Store({
    modules: {
        updater: {
            namespaced: true,
            getters: {
                availableRelease: availableRelease
            }
        }
    }
});
var mockData = {
    $t: function () { return 'Mock Translation'; },
    process: {
        platform: 'linux'
    },
    assets_loadImage: function (data) { return data; }
};
var createWrapper = function (mocks) {
    if (mocks === void 0) { mocks = mockData; }
    wrapper = shallowMount(AppUpdater, {
        store: store,
        mocks: mocks
    });
};
describe('AppUpdater', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTruthy();
        expect(wrapper.contains('.AppUpdater')).toBeTruthy();
    });
    it('should format percentage', function () {
        expect(wrapper.vm.formattedPercentage).toBe('0.00%');
        wrapper.vm.progressUpdate.percent = 5;
        expect(wrapper.vm.formattedPercentage).toBe('5.00%');
        wrapper.vm.progressUpdate.percent = 5.56567688;
        expect(wrapper.vm.formattedPercentage).toBe('5.57%');
    });
    it('should return if it is linux', function () {
        var originalPlatform = process.platform;
        Object.defineProperty(process, 'platform', {
            value: 'win95'
        });
        createWrapper();
        expect(wrapper.vm.isLinux).toBe(false);
        Object.defineProperty(process, 'platform', {
            value: 'linux'
        });
        createWrapper();
        expect(wrapper.vm.isLinux).toBe(true);
        Object.defineProperty(process, 'platform', {
            value: originalPlatform
        });
    });
    it('should return isAppImage', function () {
        var originalEnv = process.env;
        Object.defineProperty(process, 'env', {
            value: { APPIMAGE: 'a value' }
        });
        createWrapper();
        expect(wrapper.vm.isAppImage).toBe(true);
        Object.defineProperty(process, 'env', {
            value: { APPIMAGE: null }
        });
        createWrapper();
        expect(wrapper.vm.isAppImage).toBe(false);
        Object.defineProperty(process, 'env', {
            value: originalEnv
        });
    });
    it('should return the title if download is not authorized', function () {
        expect(wrapper.vm.title).toBe('Mock Translation - 0.1');
        wrapper.vm.isDownloadAuthorized = true;
        expect(wrapper.vm.title).toBe(undefined);
    });
    it('should return formatted release notes', function () {
        /* eslint-disable no-useless-escape */
        var newHTML = '<html><head></head><body><div><h3>Title</h3><span href=\"#\">Test Link</span></div></body></html>';
        expect(wrapper.vm.releaseNotes).toBe(newHTML);
    });
    it('should return the image of the description depending on the theme', function () {
        expect(wrapper.vm.descriptionImage).toBe('pages/updater/computer-light.svg');
        createWrapper(__assign(__assign({}, mockData), { session_hasDarkTheme: true }));
        expect(wrapper.vm.descriptionImage).toBe('pages/updater/computer-dark.svg');
        createWrapper(__assign(__assign({}, mockData), { session_hasDarkTheme: false }));
        expect(wrapper.vm.descriptionImage).toBe('pages/updater/computer-light.svg');
    });
    it('should emit closed', function () {
        wrapper.vm.emitClose();
        expect(wrapper.emitted('close')).toBeTruthy();
        expect(wrapper.vm.isDownloadCancelled).toBe(false);
    });
    it('should emit closed & cancel if current download', function () {
        wrapper.vm.isDownloadAuthorized = true;
        wrapper.vm.isDownloadFinished = false;
        wrapper.vm.isDownloadFailed = false;
        wrapper.vm.emitClose();
        expect(wrapper.emitted('close')).toBeTruthy();
        expect(wrapper.vm.isDownloadCancelled).toBeTruthy();
    });
    it('should start download', function () {
        var originalPlatform = process.platform;
        Object.defineProperty(process, 'platform', {
            value: 'notlinux'
        });
        createWrapper();
        expect(wrapper.vm.isDownloadAuthorized).toBe(false);
        wrapper.vm.startDownload();
        expect(wrapper.vm.isDownloadAuthorized).toBe(true);
        Object.defineProperty(process, 'platform', {
            value: originalPlatform
        });
    });
    it('should not start download if not supported', function () {
        var originalPlatform = process.platform;
        var originalEnv = process.env;
        Object.defineProperty(process, 'env', {
            value: { APPIMAGE: null }
        });
        Object.defineProperty(process, 'platform', {
            value: 'linux'
        });
        createWrapper();
        wrapper.vm.startDownload();
        expect(wrapper.vm.isDownloadAuthorized).toBe(false);
        Object.defineProperty(process, 'env', {
            value: originalEnv
        });
        Object.defineProperty(process, 'platform', {
            value: originalPlatform
        });
    });
    it('should verify inactivity', function () {
        var now = Date.now();
        var failed = now - 60000;
        var ok = now - 59999;
        wrapper.vm.progressUpdate.timestamp = failed;
        wrapper.vm.verifyInactivity();
        expect(wrapper.vm.isDownloadFailed).toBe(true);
        expect(wrapper.vm.isDownloadCancelled).toBe(true);
        wrapper.vm.progressUpdate.timestamp = ok;
        createWrapper();
        wrapper.vm.verifyInactivity();
        expect(wrapper.vm.isDownloadFailed).toBe(false);
        expect(wrapper.vm.isDownloadCancelled).toBe(false);
    });
});
//# sourceMappingURL=AppUpdater.spec.js.map