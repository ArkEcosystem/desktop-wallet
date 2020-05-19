import { createLocalVue, mount } from '@vue/test-utils';
import VueRouter from 'vue-router';
import router from '@/router';
import App from '@/App';
jest.mock('electron', function () { return ({
    remote: {
        Menu: jest.fn()
    },
    ipcRenderer: {
        on: jest.fn()
    }
}); });
var localVue = createLocalVue();
localVue.use(VueRouter);
var wrapper;
beforeEach(function () {
    wrapper = mount(App, {
        localVue: localVue,
        router: router,
        mocks: {
            $store: {
                getters: {
                    'session/language': 'en-US',
                    'session/theme': 'dark',
                    'session/profile': {
                        id: 'test-profile'
                    }
                },
                watch: jest.fn()
            }
        }
    });
});
describe('App', function () {
    it('should have the right name', function () {
        expect(wrapper.name()).toEqual('DesktopWallet');
    });
    describe('Computed properties', function () {
        describe('hasProfile', function () {
            it('should not have a profile', function () {
                wrapper.vm.$store.getters['session/profile'] = undefined;
                expect(wrapper.vm.hasProfile).toBe(false);
            });
            it('should have a profile', function () {
                var profileMock = { id: 'test-profile-2' };
                wrapper.vm.$store.getters['session/profile'] = profileMock;
                expect(wrapper.vm.hasProfile).toBe(true);
            });
        });
    });
});
//# sourceMappingURL=App.spec.js.map