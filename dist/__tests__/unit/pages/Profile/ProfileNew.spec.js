import { createLocalVue, mount } from '@vue/test-utils';
import ProfileNew from '@/pages/Profile/ProfileNew';
describe('pages > ProfileNew', function () {
    var mountPage = function () {
        var localVue = createLocalVue();
        // FIXME validations ?
        // FIXME schema ?
        return mount(ProfileNew, {
            mocks: {
                $t: function () { }
            },
            localVue: localVue
        });
    };
    xit('should render component', function () {
        var wrapper = mountPage();
        expect(wrapper.contains('.ProfileNew')).toBeTruthy();
    });
    describe('Step 1', function () {
    });
});
//# sourceMappingURL=ProfileNew.spec.js.map