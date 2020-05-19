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
import { PluginComponentSandbox } from '@/services/plugin-manager/plugin-component-sandbox';
jest.mock('@/services/plugin-manager/component/compile-template.js', function () { return ({
    compileTemplate: jest.fn(function (vm, template) {
        var compileToFunctions = require('vue-template-compiler').compileToFunctions;
        return compileToFunctions(template);
    })
}); });
var vue = createLocalVue();
var plugin = {
    config: {
        id: 1
    }
};
var vm = {
    run: jest.fn(function (code) { return JSON.parse(code); })
};
var options = {
    vue: vue,
    plugin: plugin,
    componentVM: vm,
    pluginVM: vm,
    name: 'test'
};
describe('Plugin Component Sandbox', function () {
    it('should return a valid component', function () {
        var sandbox = new PluginComponentSandbox(__assign(__assign({}, options), { fullPath: './', source: {
                template: '<div>Test</div>'
            } }));
        var component = sandbox.render();
        var wrapper = mount(component);
        expect(wrapper.isVueInstance()).toBe(true);
        expect(wrapper.html()).toBe('<div>Test</div>');
    });
    it('should render from buffer', function () {
        var sandbox = new PluginComponentSandbox(__assign(__assign({}, options), { fullPath: './', source: Buffer.from(JSON.stringify({
                template: '<div>Test</div>'
            })) }));
        var component = sandbox.render();
        var wrapper = mount(component);
        expect(wrapper.isVueInstance()).toBe(true);
        expect(wrapper.html()).toBe('<div>Test</div>');
        expect(vm.run).toHaveBeenCalled();
    });
    it('should render with global components', function () {
        plugin.globalComponents = {
            Test: {
                template: '<div>Global</div>'
            }
        };
        var sandbox = new PluginComponentSandbox(__assign(__assign({}, options), { fullPath: './', source: {
                template: '<Test />'
            } }));
        var component = sandbox.render();
        var wrapper = mount(component);
        expect(wrapper.isVueInstance()).toBe(true);
        expect(wrapper.html()).toBe('<div>Global</div>');
    });
    it('should parse child components', function (done) {
        var spy = jest.spyOn(console, 'error').mockImplementation();
        var sandbox = new PluginComponentSandbox(__assign(__assign({}, options), { fullPath: './', source: {
                template: '<Test />',
                components: {
                    Test: {
                        template: '<button @click="increment" ref="btn">{{ count }}</button>',
                        data: function () { return ({
                            count: 0
                        }); },
                        methods: {
                            increment: function () {
                                this.count++;
                            }
                        },
                        mounted: function () {
                            var _this = this;
                            this.$nextTick(function () {
                                _this.refs.btn.innerHTML = '<div></div>';
                            });
                        }
                    }
                }
            } }));
        var component = sandbox.render();
        mount(component);
        vue.nextTick(function () {
            expect(spy).toHaveBeenCalledWith('innerHTML 🚫');
            done();
        });
    });
});
//# sourceMappingURL=plugin-component-sandbox.spec.js.map