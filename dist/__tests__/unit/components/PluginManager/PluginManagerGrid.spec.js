import { mount } from '@vue/test-utils';
import useI18nGlobally from '../../__utils__/i18n';
import { PluginManagerGrid } from '@/components/PluginManager';
var i18n = useI18nGlobally();
var wrapper;
var plugins = [
    {
        id: 'test 4',
        title: 'plugin 4'
    },
    {
        id: 'test 3',
        title: 'plugin 3'
    },
    {
        id: 'test 2',
        title: 'plugin 2'
    },
    {
        id: 'test 1',
        title: 'plugin 1'
    },
    {
        id: 'first test',
        title: 'first plugin'
    }
];
beforeEach(function () {
    wrapper = mount(PluginManagerGrid, {
        i18n: i18n,
        mocks: {
            $store: {
                getters: {
                    'plugin/isInstalled': jest.fn(function () { return true; }),
                    'plugin/isUpdateAvailable': jest.fn(function () { return true; })
                }
            },
            formatter_bytes: jest.fn()
        },
        propsData: {
            plugins: plugins
        }
    });
});
describe('PluginManagerGrid', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    describe('Methods', function () {
        it('should emit show-details event', function () {
            wrapper.vm.emitShowDetails(plugins[0]);
            expect(wrapper.emitted('show-details', plugins[0])).toBeTruthy();
        });
    });
    describe('computed', function () {
        it('sortedPlugins', function () {
            expect(wrapper.vm.sortedPlugins[0].title).toBe('first plugin');
            expect(wrapper.vm.sortedPlugins).toEqual([
                plugins[4],
                plugins[3],
                plugins[2],
                plugins[1],
                plugins[0]
            ]);
        });
    });
});
//# sourceMappingURL=PluginManagerGrid.spec.js.map