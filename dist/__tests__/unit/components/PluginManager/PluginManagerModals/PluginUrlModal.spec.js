import { mount } from '@vue/test-utils';
import Vuelidate from 'vuelidate';
import Vue from 'vue';
import useI18nGlobally from '../../../__utils__/i18n';
import { PluginUrlModal } from '@/components/PluginManager/PluginManagerModals';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = mount(PluginUrlModal, {
        i18n: i18n,
        stubs: {
            Portal: true
        },
        sync: false
    });
});
Vue.use(Vuelidate);
describe('PluginUrlModal', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    describe('form validation', function () {
        describe('url', function () {
            it('should switch from invalid to valid to invalid when url is changed', function () {
                wrapper.vm.$v.form.url.$model = 'https://github.com/foo/bar';
                expect(wrapper.vm.$v.form.url.isGitHubUrl).toBe(true);
                expect(wrapper.vm.$v.form.url.isAllowed).toBe(true);
                wrapper.vm.$v.form.url.$model = 'not-valid';
                expect(wrapper.vm.$v.form.url.isGitHubUrl).toBe(false);
                expect(wrapper.vm.$v.form.url.isAllowed).toBe(false);
            });
        });
    });
    describe('Computed properties', function () {
        describe('urlError', function () {
            it('should return an error if input is empty', function () {
                wrapper.vm.$v.form.url.$model = '';
                expect(wrapper.vm.urlError).toEqual('VALIDATION.REQUIRED');
            });
            it('should return an error if input is not an url', function () {
                wrapper.vm.$v.form.url.$model = 'not-an-url';
                expect(wrapper.vm.urlError).toEqual('VALIDATION.URL.INVALID');
            });
            it('should return an error if input is not a github url', function () {
                wrapper.vm.$v.form.url.$model = 'https://not-github.com/';
                expect(wrapper.vm.urlError).toEqual('VALIDATION.URL.NO_GITHUB');
            });
            it('should return an error if input is not a github repository url', function () {
                wrapper.vm.$v.form.url.$model = 'https://github.com/';
                expect(wrapper.vm.urlError).toEqual('VALIDATION.URL.NO_GITHUB_REPOSITORY');
            });
            it('should return null if input is a valid github repository url', function () {
                wrapper.vm.$v.form.url.$model = 'https://github.com/foo/bar';
                expect(wrapper.vm.urlError).toEqual(null);
            });
        });
    });
    describe('Methods', function () {
        it('should emit close event', function () {
            wrapper.vm.emitClose();
            expect(wrapper.emitted('close')).toBeTruthy();
        });
        it('should emit fetch-plugin event', function () {
            wrapper.vm.emitFetchPlugin();
            expect(wrapper.emitted('fetch-plugin', wrapper.vm.$v.form.url.$model)).toBeTruthy();
        });
    });
});
//# sourceMappingURL=PluginUrlModal.spec.js.map