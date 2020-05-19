var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { mount } from '@vue/test-utils';
import useI18nGlobally from '../../__utils__/i18n';
import { PluginManagerTable } from '@/components/PluginManager';
var i18n = useI18nGlobally();
var wrapper;
var plugins = [
    { id: 'plugin-enabled' },
    { id: 'plugin-disabled' },
    { id: 'plugin-available' }
];
beforeEach(function () {
    wrapper = mount(PluginManagerTable, {
        i18n: i18n,
        mocks: {
            $store: {
                getters: {
                    'plugin/isEnabled': jest.fn(function (pluginId) { return pluginId === 'plugin-enabled'; }),
                    'plugin/isInstalled': jest.fn(function (pluginId) { return pluginId === 'plugin-enabled' || pluginId === 'plugin-disabled'; }),
                    'plugin/isUpdateAvailable': jest.fn(function (pluginId) { return pluginId === 'plugin-enabled'; })
                }
            },
            formatter_bytes: jest.fn()
        },
        propsData: {
            activeCategory: 'all'
        },
        attrs: {
            rows: plugins.map(function (plugin) { return (__assign(__assign({}, plugin), { categories: ['other'] })); })
        },
        sync: false
    });
});
describe('PluginManagerTable', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    it('should include the categories column only if activeCategory is \'all\'', function () {
        expect(wrapper.vm.columns.filter(function (column) { return column.field === 'categories'; })).toHaveLength(1);
        wrapper.setProps({ activeCategory: 'other' });
        expect(wrapper.vm.columns.filter(function (column) { return column.field === 'categories'; })).toHaveLength(0);
    });
    it('should emit sort-change event when clicking on a categories header', function () {
        wrapper.findAll('th').filter(function (node) { return node.text() === 'PLUGIN_TABLE.CATEGORY'; }).at(0).trigger('click');
        expect(wrapper.emitted('on-sort-change')).toBeTruthy();
    });
    it('should emit sort-change event when clicking on a status header', function () {
        wrapper.findAll('th').filter(function (node) { return node.text() === 'PLUGIN_TABLE.STATUS'; }).at(0).trigger('click');
        expect(wrapper.emitted('on-sort-change')).toBeTruthy();
    });
    describe('Methods', function () {
        it('should emit on-sort-change event', function () {
            wrapper.vm.onSortChange(['foobar']);
            expect(wrapper.emitted('on-sort-change', 'foobar')).toBeTruthy();
        });
        it('should emit show-details event', function () {
            wrapper.vm.emitShowDetails({ id: 'enabled' });
            expect(wrapper.emitted('show-details', plugins[0])).toBeTruthy();
        });
        describe('getStatusText', function () {
            it('should return \'enabled\' for installed and enabled plugins', function () {
                expect(wrapper.vm.getStatusText(plugins[0].id)).toBe('enabled');
            });
            it('should return \'disabled\' for installed and disabled plugins', function () {
                expect(wrapper.vm.getStatusText(plugins[1].id)).toBe('disabled');
            });
            it('should return \'available\' for not installed plugins', function () {
                expect(wrapper.vm.getStatusText(plugins[2].id)).toBe('available');
            });
        });
        describe('isEnabled', function () {
            it('should return true for enabled plugins', function () {
                expect(wrapper.vm.isEnabled(plugins[0].id)).toBeTrue();
            });
            it('should return false for disabled plugins', function () {
                expect(wrapper.vm.isEnabled(plugins[1].id)).toBeFalse();
            });
        });
        describe('isInstalled', function () {
            it('should return true for installed plugins', function () {
                expect(wrapper.vm.isInstalled(plugins[0].id)).toBeTrue();
                expect(wrapper.vm.isInstalled(plugins[1].id)).toBeTrue();
            });
            it('should return false for not installed plugins', function () {
                expect(wrapper.vm.isInstalled(plugins[2].id)).toBeFalse();
            });
        });
        describe('isUpdateAvailable', function () {
            it('should return true if there is an available update', function () {
                expect(wrapper.vm.isUpdateAvailable(plugins[0].id)).toBeTrue();
            });
            it('should return false if there is no available update', function () {
                expect(wrapper.vm.isUpdateAvailable(plugins[1].id)).toBeFalse();
            });
        });
    });
});
//# sourceMappingURL=PluginManagerTable.spec.js.map