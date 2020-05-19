import { shallowMount } from '@vue/test-utils';
import { useI18nGlobally } from '../../__utils__/i18n';
import { SelectionBackground } from '@/components/Selection';
import StringsMixin from '@/mixins/strings';
var i18n = useI18nGlobally();
describe('SelectionBackground', function () {
    describe('SelectionBackground', function () {
        it('should render the component', function () {
            var wrapper = shallowMount(SelectionBackground, {
                i18n: i18n,
                mixins: [StringsMixin]
            });
            expect(wrapper.contains('.SelectionBackgroundGrid')).toBeTruthy();
        });
    });
});
//# sourceMappingURL=SelectionBackground.spec.js.map