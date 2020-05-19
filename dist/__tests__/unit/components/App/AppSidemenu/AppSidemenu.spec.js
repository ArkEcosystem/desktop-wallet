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
import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import { AppSidemenu } from '@/components/App';
jest.mock('electron', function () { return ({
    ipcRenderer: {
        on: jest.fn()
    }
}); });
var wrapper;
var push = jest.fn();
var mockData = {
    session_profile: {
        avatar: 'mock_avatar',
        name: 'Mock Name'
    },
    $store: {
        getters: {
            'announcements/unread': function () { return 0; },
            'plugin/menuItems': function () { return []; },
            'plugin/avatar': function () { return 'pluginAvatar'; },
            'updater/hasAvailableRelease': function () { return false; }
        }
    },
    $route: {
        name: 'mock_route'
    },
    $router: {
        push: push
    },
    $t: function () { return 'Mock Translation'; },
    $refs: {
        settings: {
            showSettings: jest.fn()
        }
    }
};
var stubs = { RouterLink: RouterLinkStub };
var createWrapper = function (propsData, mocks) {
    if (propsData === void 0) { propsData = {}; }
    if (mocks === void 0) { mocks = mockData; }
    wrapper = shallowMount(AppSidemenu, {
        propsData: propsData,
        mocks: mocks,
        stubs: stubs
    });
};
describe('AppSidemenu', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTruthy();
        expect(wrapper.contains('.AppSidemenu')).toBeTruthy();
    });
    it('should be vertical by default', function () {
        expect(wrapper.contains('.AppSidemenu--vertical')).toBeTruthy();
    });
    it('should be horizontal when isHorizontal is true', function () {
        createWrapper({
            isHorizontal: true
        });
        expect(wrapper.contains('.AppSidemenu--horizontal')).toBeTruthy();
    });
    it('should be vertical when isHorizontal is false', function () {
        createWrapper({
            isHorizontal: false
        });
        expect(wrapper.contains('.AppSidemenu--vertical')).toBeTruthy();
    });
    it('should detect standard avatar', function () {
        expect(wrapper.vm.hasStandardAvatar).toBeTruthy();
        expect(wrapper.vm.pluginAvatar).toBe(null);
    });
    it('should get plugin avatar if enabled', function () {
        createWrapper(undefined, __assign(__assign({}, mockData), { session_profile: {
                name: 'Mock Name',
                avatar: {
                    pluginId: true
                }
            } }));
        expect(wrapper.vm.hasStandardAvatar).toBe(false);
        expect(wrapper.vm.pluginAvatar).toBe('pluginAvatar');
    });
    it('should set active item', function () {
        var navName = 'newNavItem';
        wrapper.vm.setActive(navName);
        expect(wrapper.vm.activeItem).toBe(navName);
    });
    it('should do a redirect', function () {
        var name = 'redirectNavItem';
        wrapper.vm.redirect(name);
        expect(push).toHaveBeenCalledWith({ name: name });
        expect(wrapper.vm.activeItem).toBe(name);
    });
    it('should set important notification visible state', function () {
        expect(wrapper.vm.isImportantNotificationVisible).toBe(true);
        wrapper.vm.hideImportantNotification();
        expect(wrapper.vm.isImportantNotificationVisible).toBe(false);
    });
    describe('Plugin Menu', function () {
        it('should toggle & close plugin menu state', function () {
            expect(wrapper.vm.isPluginMenuVisible).toBe(false);
            wrapper.vm.toggleShowPluginMenu();
            expect(wrapper.vm.isPluginMenuVisible).toBe(true);
            wrapper.vm.closeShowPlugins();
            expect(wrapper.vm.isPluginMenuVisible).toBe(false);
        });
        it('should activate the plugin menu item when \'setActive\' is true', function () {
            expect(wrapper.vm.activeItem).toBe('mock_route');
            wrapper.vm.closeShowPlugins(true);
            expect(wrapper.vm.activeItem).toBe('plugin-pages');
        });
    });
});
//# sourceMappingURL=AppSidemenu.spec.js.map