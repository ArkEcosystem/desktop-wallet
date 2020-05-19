import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../__utils__/i18n';
import { ProfileRemovalConfirmation } from '@/components/Profile';
var i18n = useI18nGlobally();
var wrapper;
var profile = { id: 'my profile' };
var $store = {};
var $router = {};
var mountComponent = function (_a) {
    var profiles = (_a === void 0 ? {} : _a).profiles;
    $router.push = jest.fn();
    $store.dispatch = jest.fn();
    $store.getters = {
        'profile/all': profiles
    };
    return shallowMount(ProfileRemovalConfirmation, {
        i18n: i18n,
        propsData: {
            profile: profile
        },
        mocks: {
            $router: $router,
            $store: $store
        }
    });
};
beforeEach(function () {
    wrapper = mountComponent();
});
describe('ProfileRemovalConfirmation', function () {
    it('should render modal', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    describe('removeProfile', function () {
        describe('when there are several profiles', function () {
            var profile2 = { id: 'two' };
            beforeEach(function () {
                wrapper = mountComponent({
                    profiles: [profile, profile2]
                });
            });
            it('should set other profile before removal', function () {
                wrapper.vm.removeProfile();
                expect($store.dispatch.mock.calls[0]).toEqual(['session/setProfileId', profile2.id]);
            });
            it('should delete the profile', function () {
                wrapper.vm.removeProfile();
                expect($store.dispatch.mock.calls[1]).toEqual(['profile/delete', profile]);
            });
            it('should emit the `removed` event', function () {
                wrapper.vm.removeProfile();
                expect(wrapper.emitted('removed'));
            });
        });
        describe('when there is only 1 profile', function () {
            beforeEach(function () {
                wrapper = mountComponent({
                    profiles: [profile]
                });
            });
            it('should reset the session before removal', function () {
                wrapper.vm.removeProfile();
                expect($store.dispatch.mock.calls[0]).toEqual(['session/reset']);
            });
            it('should delete the profile', function () {
                wrapper.vm.removeProfile();
                expect($store.dispatch.mock.calls[1]).toEqual(['profile/delete', profile]);
            });
            it('should redirect to the profile creation page', function () {
                wrapper.vm.removeProfile();
                expect($router.push).toHaveBeenCalledWith({ name: 'profile-new' });
            });
            it('should emit the `removed` event', function () {
                wrapper.vm.removeProfile();
                expect(wrapper.emitted('removed'));
            });
        });
    });
});
//# sourceMappingURL=ProfileRemovalConfirmation.spec.js.map