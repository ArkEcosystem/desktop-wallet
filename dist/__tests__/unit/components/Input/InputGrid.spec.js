import { shallowMount } from '@vue/test-utils';
import { useI18nGlobally } from '../../__utils__/i18n';
import { InputGrid, InputGridItem, InputGridModal } from '@/components/Input/InputGrid';
var i18n = useI18nGlobally();
describe('InputGrid', function () {
    describe('InputGrid', function () {
        it('should render the component', function () {
            var wrapper = shallowMount(InputGrid, {
                i18n: i18n,
                propsData: {
                    items: [],
                    itemKey: 'src'
                }
            });
            expect(wrapper.contains('.InputGrid')).toBeTruthy();
        });
    });
    describe('InputGridItem', function () {
        it('should render the component', function () {
            var wrapper = shallowMount(InputGridItem, {
                i18n: i18n,
                propsData: {
                    isSelected: false,
                    title: 'Example title'
                }
            });
            expect(wrapper.contains('.InputGridItem')).toBeTruthy();
        });
    });
    describe('InputGridModal', function () {
        it('should render the component', function () {
            var wrapper = shallowMount(InputGridModal, {
                i18n: i18n,
                propsData: {
                    items: [],
                    itemKey: 'src'
                }
            });
            expect(wrapper.contains('.InputGridModal')).toBeTruthy();
        });
    });
});
//# sourceMappingURL=InputGrid.spec.js.map