import { mount } from '@vue/test-utils';
import useI18nGlobally from '../../__utils__/i18n';
import { PluginManagerSideMenu } from '@/components/PluginManager';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = mount(PluginManagerSideMenu, {
        i18n: i18n,
        mocks: {
            $store: {
                getters: {}
            }
        },
        propsData: {
            activeCategory: 'all'
        }
    });
});
describe('PluginManagerSideMenu', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    describe('Computed properties', function () {
        describe('pluginCategories', function () {
            it('should return plugin categories', function () {
                expect(wrapper.vm.pluginCategories).toEqual(['all', 'gaming', 'utility', 'other']);
            });
        });
        describe('otherCategories', function () {
            it('should return other categories', function () {
                expect(wrapper.vm.otherCategories).toEqual(['theme', 'language']);
            });
        });
    });
    describe('Methods', function () {
        it('should emit toggle event', function () {
            wrapper.vm.emitToggle();
            expect(wrapper.emitted('toggle')).toBeTruthy();
        });
        describe('emitCategory', function () {
            it('should not emit category-change event if category is active category', function () {
                wrapper.vm.emitCategory('all');
                expect(wrapper.emitted('category-change')).toBeFalsy();
            });
            it('should emit category-change event if category is not active category', function () {
                wrapper.vm.emitCategory('gaming');
                expect(wrapper.emitted('category-change', 'gaming')).toBeTruthy();
            });
        });
    });
});
//# sourceMappingURL=PluginManagerSideMenu.spec.js.map