import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import AppSidemenuImportantNotification from '@/components/App/AppSidemenu/AppSidemenuImportantNotification';
var localVue = createLocalVue();
localVue.use(Vuex);
var wrapper;
var store = new Vuex.Store({
    modules: {
        updater: {
            namespaced: true,
            getters: {
                availableRelease: function () { return '0.0'; }
            }
        }
    }
});
var mockData = {
    $t: function () { return 'Mock Translation'; }
};
var createWrapper = function (propsData, mocks) {
    if (propsData === void 0) { propsData = {}; }
    if (mocks === void 0) { mocks = mockData; }
    wrapper = shallowMount(AppSidemenuImportantNotification, {
        propsData: propsData,
        mocks: mocks,
        store: store
    });
};
describe('AppSidemenuImportantNotification', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTruthy();
        expect(wrapper.contains('.AppSidemenuImportantNotification')).toBeTruthy();
    });
    it('should define the visibility status of the notification', function () {
        expect(wrapper.vm.isNotificationVisible).toBe(false);
        wrapper.vm.openNotification();
        expect(wrapper.vm.isNotificationVisible).toBe(true);
        wrapper.vm.closeNotification();
        expect(wrapper.vm.isNotificationVisible).toBe(false);
    });
});
//# sourceMappingURL=AppSidemenuImportantNotification.spec.js.map