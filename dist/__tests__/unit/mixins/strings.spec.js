import { createLocalVue, shallowMount } from '@vue/test-utils';
import StringsMixin from '@/mixins/strings';
describe('Mixins > Strings', function () {
    var wrapper;
    beforeEach(function () {
        var localVue = createLocalVue();
        var TestComponent = {
            name: 'TestComponent',
            template: '<div/>'
        };
        wrapper = shallowMount(TestComponent, {
            localVue: localVue,
            mixins: [StringsMixin]
        });
    });
    describe('strings_snakeCase', function () {
        it('should return it as snake-cased string', function () {
            var result = 'foo_bar';
            expect(wrapper.vm.strings_snakeCase('Foo Bar')).toEqual(result);
            expect(wrapper.vm.strings_snakeCase('fooBar')).toEqual(result);
            expect(wrapper.vm.strings_snakeCase('--Foo-Bar--')).toEqual(result);
        });
    });
});
//# sourceMappingURL=strings.spec.js.map