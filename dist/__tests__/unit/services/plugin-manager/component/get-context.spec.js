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
import { createLocalVue, mount } from '@vue/test-utils';
import { getSafeContext } from '@/services/plugin-manager/component/get-context';
var localVue;
beforeEach(function () {
    localVue = createLocalVue();
});
var createSafeRender = function (plugin) {
    return localVue.extend(__assign(__assign({}, plugin), { render: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return plugin.render.apply(getSafeContext(this, plugin), args);
        } }));
};
describe('Prepare Component Context', function () {
    describe('Render', function () {
        it('should render', function () {
            var plugin = {
                render: function (h) {
                    return h('div', 'Test');
                }
            };
            var wrapper = mount(createSafeRender(plugin));
            expect(wrapper.isVueInstance()).toBe(true);
            expect(wrapper.html()).toBe('<div>Test</div>');
        });
        it('should render with computed properties', function () {
            var plugin = {
                render: function (h) {
                    return h('div', this.name);
                },
                computed: {
                    name: function () {
                        return 'Test';
                    }
                }
            };
            var wrapper = mount(createSafeRender(plugin));
            expect(wrapper.html()).toBe('<div>Test</div>');
        });
        it('should not access the parent element', function () {
            var plugin = {
                render: function (h) {
                    return h('div', this.$parent && this.$parent._uid);
                }
            };
            var wrapper = mount(createSafeRender(plugin));
            expect(wrapper.find('div').text()).toBe('');
        });
        it('should not access the root element', function () {
            var plugin = {
                render: function (h) {
                    return h('div', this.$root && this.$root._uid);
                }
            };
            var wrapper = mount(createSafeRender(plugin));
            expect(wrapper.find('div').text()).toBe('');
        });
    });
});
//# sourceMappingURL=get-context.spec.js.map